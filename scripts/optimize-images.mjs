// Turns original photos into web-ready WebP files for the Work section.
//
//   1. Put originals in assets/work-src/ (not committed), named <id>-before.<ext> and <id>-after.<ext>,
//      where <id> matches an entry in src/data/portfolio.json. Example: vestment-01-before.jpg
//   2. Run `npm run images`.
//   3. Files land in public/work/ as <id>-before.webp and <id>-after.webp (max 1200 px wide, 4:3 crop-free).
//   4. Copy the printed width and height into the piece in portfolio.json, fill in title, alt and caption,
//      and set "approved": true.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'assets/work-src';
const OUT = 'public/work';
const MAX_WIDTH = 1200;
const EXT = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.webp', '.avif']);

if (!fs.existsSync(SRC)) {
  console.log(`No ${SRC}/ folder yet. Create it and add <id>-before.jpg and <id>-after.jpg files.`);
  process.exit(0);
}
fs.mkdirSync(OUT, { recursive: true });

for (const name of fs.readdirSync(SRC).sort()) {
  const ext = path.extname(name).toLowerCase();
  if (!EXT.has(ext)) continue;
  const base = path.basename(name, path.extname(name));
  if (!/-(before|after)$/.test(base)) {
    console.log(`Skipping ${name}: name it <id>-before or <id>-after.`);
    continue;
  }
  const target = path.join(OUT, `${base}.webp`);
  const info = await sharp(path.join(SRC, name))
    .rotate() // respect camera orientation
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(target);
  console.log(`${target}  ${info.width} x ${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
