import sharp from 'sharp';
import { unlink } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// Generate a 32x32 PNG favicon from the 192x192 PWA icon
await sharp(join(publicDir, 'pwa-192x192.png'))
  .resize(32, 32)
  .png()
  .toFile(join(publicDir, 'favicon.png'));

// Also generate a 16x16 for legacy contexts
await sharp(join(publicDir, 'pwa-192x192.png'))
  .resize(16, 16)
  .png()
  .toFile(join(publicDir, 'favicon-16x16.png'));

// Delete the old (Lovable) favicon.ico
try {
  await unlink(join(publicDir, 'favicon.ico'));
  console.log('Deleted old favicon.ico');
} catch {
  console.log('No old favicon.ico to delete');
}

console.log('Generated favicon.png (32x32) and favicon-16x16.png (16x16)');
