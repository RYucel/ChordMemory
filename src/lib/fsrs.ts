/**
 * Akor Belleği - Free Spaced Repetition Scheduler (FSRS 4.5) Implementation
 * FSRS formula: R(t,S) = (1 + F * t/S)^D_exp
 * F = 19/81, D_exp = -0.5
 */

import { Card, FsrsState, Grade } from '../types';

// Default 19 FSRS-4.5 weights
export const DEFAULT_FSRS_WEIGHTS = [
  0.4, 1.2, 3.2, 15.6, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14,
  0.94, 2.18, 0.05, 0.34, 1.26, 0.29, 2.61, 0.0, 0.0
];

const F = 19 / 81; // ~0.2345679
const D_EXP = -0.5;

/**
 * Calculates current retrievability R(t, S) given elapsed time t (in days) and stability S (in days)
 */
export function calculateRetrievability(tDays: number, stability: number): number {
  if (stability <= 0) return 0;
  if (tDays <= 0) return 1.0;
  return Math.pow(1 + F * (tDays / stability), D_EXP);
}

/**
 * Calculates optimal review interval (in days) for target retention rate
 */
export function calculateInterval(stability: number, desiredRetention: number): number {
  if (stability <= 0) return 1;
  const targetR = Math.max(0.70, Math.min(0.98, desiredRetention));
  // (1 + F * I / S)^(-0.5) = R => 1 + F * I / S = R^(-2) => I = (S / F) * (R^(-2) - 1)
  const interval = (stability / F) * (Math.pow(targetR, -2) - 1);
  return Math.max(1, Math.round(interval));
}

/**
 * Clamps difficulty between 1.0 and 10.0
 */
function clampDifficulty(d: number): number {
  return Math.max(1.0, Math.min(10.0, d));
}

/**
 * Create initial FSRS State for new card
 */
export function createInitialFsrsState(): FsrsState {
  return {
    stability: 0,
    difficulty: 5.0,
    dueAt: Date.now(),
    lastReviewAt: null,
    reps: 0,
    lapses: 0,
    state: 'NEW',
  };
}

/**
 * Main FSRS review scheduler
 */
export function scheduleReview(
  currentState: FsrsState,
  grade: Grade, // 1: Again, 2: Hard, 3: Good, 4: Easy
  nowTimestamp: number = Date.now(),
  desiredRetention: number = 0.90,
  w: number[] = DEFAULT_FSRS_WEIGHTS
): { nextState: FsrsState; nextCueLevelChange: number; nextIntervalDays: number } {
  const { stability, difficulty, lastReviewAt, reps, lapses, state } = currentState;

  // Elapsed time in days
  const elapsedDays = lastReviewAt ? Math.max(0, (nowTimestamp - lastReviewAt) / (1000 * 60 * 60 * 24)) : 0;
  const currentR = state === 'NEW' ? 1.0 : calculateRetrievability(elapsedDays, stability);

  let nextS = stability;
  let nextD = difficulty;
  let nextLapses = lapses;
  let nextReps = reps + 1;
  let nextStateName = state;
  let cueLevelChange = 0;

  if (state === 'NEW') {
    // First time review
    nextS = w[grade - 1]; // w[0..3]
    nextD = clampDifficulty(w[4] - w[5] * (grade - 3));
    
    if (grade === 1) {
      nextStateName = 'LEARNING';
      nextLapses += 1;
      cueLevelChange = -1; // decrease cue level on failure
    } else if (grade === 2) {
      nextStateName = 'LEARNING';
      cueLevelChange = 0;
    } else {
      nextStateName = 'REVIEW';
      cueLevelChange = 1; // increase cue level on success
    }
  } else {
    // Review or Learning state
    if (grade === 1) {
      // Lapse (Again)
      nextLapses += 1;
      nextStateName = 'RELEARNING';
      // New lapse stability
      const lapseS = w[11] * Math.pow(difficulty, -w[12]) * (Math.pow(stability + 1, w[13]) - 1) * Math.exp(w[14] * (1 - currentR));
      nextS = Math.max(0.1, Math.min(stability * 0.5, lapseS));
      nextD = clampDifficulty(difficulty + w[6] * 0.5);
      cueLevelChange = -1; // decrease cue level on mistake
    } else {
      // Success (Hard, Good, Easy)
      nextD = clampDifficulty(difficulty - w[6] * (grade - 3));
      
      const hardPenalty = grade === 2 ? w[15] : 1.0;
      const easyBonus = grade === 4 ? w[16] : 1.0;

      // Recall stability growth formula
      const sRecall = stability * (1 + Math.exp(w[8]) * (11 - nextD) * Math.pow(stability, -w[9]) * (Math.exp(w[10] * (1 - currentR)) - 1) * hardPenalty * easyBonus);
      nextS = Math.max(0.2, sRecall);

      nextStateName = 'REVIEW';
      cueLevelChange = grade >= 3 ? 1 : 0;
    }
  }

  // Calculate interval
  const intervalDays = grade === 1 ? 0.25 : calculateInterval(nextS, desiredRetention); // 6 hours for Again
  const dueAt = nowTimestamp + intervalDays * 24 * 60 * 60 * 1000;

  return {
    nextState: {
      stability: Number(nextS.toFixed(2)),
      difficulty: Number(nextD.toFixed(2)),
      dueAt: Math.round(dueAt),
      lastReviewAt: nowTimestamp,
      reps: nextReps,
      lapses: nextLapses,
      state: nextStateName,
    },
    nextCueLevelChange: cueLevelChange,
    nextIntervalDays: intervalDays,
  };
}

/**
 * FSRS Verification & Unit Test Routine
 */
export function runFsrsSelfTests(): { passed: boolean; logs: string[] } {
  const logs: string[] = [];
  let passed = true;

  try {
    // Test 1: Initial creation
    const init = createInitialFsrsState();
    logs.push(`Test 1: Initial state created, stability=${init.stability}`);

    // Test 2: First review 'Good' (3)
    const res1 = scheduleReview(init, 3, Date.now(), 0.90);
    if (res1.nextState.stability <= 0 || res1.nextState.reps !== 1) {
      passed = false;
      logs.push(`FAILED Test 2: Expected stability > 0, got ${res1.nextState.stability}`);
    } else {
      logs.push(`Test 2 PASSED: 'Good' initial review gave stability=${res1.nextState.stability}, interval=${res1.nextIntervalDays}d`);
    }

    // Test 3: Subsequent review 'Again' (1) causes lapse and decreases stability
    const stateAfterGood = res1.nextState;
    const resAgain = scheduleReview(stateAfterGood, 1, Date.now() + 2 * 24 * 3600 * 1000, 0.90);
    if (resAgain.nextState.lapses !== 1 || resAgain.nextState.stability >= stateAfterGood.stability) {
      passed = false;
      logs.push(`FAILED Test 3: Lapse did not increase lapse count or reduce stability properly`);
    } else {
      logs.push(`Test 3 PASSED: 'Again' properly incremented lapses=${resAgain.nextState.lapses}, lowered stability to ${resAgain.nextState.stability}`);
    }

    // Test 4: Retrievability decay
    const r1 = calculateRetrievability(0, 10);
    const r2 = calculateRetrievability(10, 10);
    if (r1 !== 1.0 || r2 >= 1.0 || r2 <= 0) {
      passed = false;
      logs.push(`FAILED Test 4: Retrievability curve error`);
    } else {
      logs.push(`Test 4 PASSED: Retrievability decay working (R(0)=${r1}, R(10d, S=10)=${r2.toFixed(3)})`);
    }

  } catch (err) {
    passed = false;
    logs.push(`FSRS Self Test Exception: ${String(err)}`);
  }

  return { passed, logs };
}
