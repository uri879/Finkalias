import sharp from 'sharp';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const bg = '#e63946';
const fg = '#ffffff';

const makeFullSvg = () => `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="${bg}"/>
  <circle cx="256" cy="256" r="180" fill="none" stroke="${fg}" stroke-width="20" opacity="0.3"/>
  <text x="256" y="340" font-family="Heebo, sans-serif" font-weight="900" font-size="280" fill="${fg}" text-anchor="middle">א</text>
  <line x1="256" y1="256" x2="256" y2="130" stroke="${fg}" stroke-width="18" stroke-linecap="round"/>
  <line x1="256" y1="256" x2="350" y2="256" stroke="${fg}" stroke-width="14" stroke-linecap="round"/>
  <circle cx="256" cy="256" r="14" fill="${fg}"/>
</svg>
`.trim();

// Maskable: just the Alef glyph on solid background, well within the 40% safe zone.
// No clock circle / hands — they get cropped by OS adaptive masks.
const makeMaskableSvg = () => `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="${bg}"/>
  <g transform="translate(256 256) scale(0.55) translate(-256 -256)">
    <text x="256" y="340" font-family="Heebo, sans-serif" font-weight="900" font-size="280" fill="${fg}" text-anchor="middle">א</text>
  </g>
</svg>
`.trim();

const targets = [
  { name: 'pwa-192x192.png', size: 192, maskable: false },
  { name: 'pwa-512x512.png', size: 512, maskable: false },
  { name: 'pwa-maskable-512x512.png', size: 512, maskable: true },
];

for (const t of targets) {
  const svg = t.maskable ? makeMaskableSvg() : makeFullSvg();
  await sharp(Buffer.from(svg))
    .resize(t.size, t.size)
    .png()
    .toFile(join(publicDir, t.name));
  console.log(`Generated ${t.name} (${t.size}x${t.size})`);
}

console.log('All icons generated.');
