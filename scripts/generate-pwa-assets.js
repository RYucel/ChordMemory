// Helper script to generate PNG fallback files for PWA manifest
import fs from 'fs';
import path from 'path';

// Valid 1x1 gold colored PNG base64 byte array
const goldPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const buffer = Buffer.from(goldPngBase64, 'base64');

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192.png'), buffer);
fs.writeFileSync(path.join(publicDir, 'pwa-512.png'), buffer);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), buffer);

console.log('PWA fallback icons generated successfully in /public');
