import sharp from 'sharp';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// 180x180 for iPhone Retina (modern iPhones)
await sharp(join(publicDir, 'pwa-192x192.png'))
  .resize(180, 180)
  .png()
  .toFile(join(publicDir, 'apple-touch-icon-180x180.png'));

// 167x167 for iPad Pro
await sharp(join(publicDir, 'pwa-192x192.png'))
  .resize(167, 167)
  .png()
  .toFile(join(publicDir, 'apple-touch-icon-167x167.png'));

// 152x152 for iPad Retina
await sharp(join(publicDir, 'pwa-192x192.png'))
  .resize(152, 152)
  .png()
  .toFile(join(publicDir, 'apple-touch-icon-152x152.png'));

console.log('Generated apple-touch-icon files (180x180, 167x167, 152x152)');
