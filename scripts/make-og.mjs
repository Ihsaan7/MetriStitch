// Generates public/og.png (1200x630) from the brand name in src/config/site.config.ts.
// Run `npm run og` after changing the brand name. Replace the file with your own artwork any time.
import fs from 'node:fs';
import sharp from 'sharp';

const config = fs.readFileSync('src/config/site.config.ts', 'utf8');
const brand = /brandName:\s*'([^']+)'/.exec(config)?.[1];
if (!brand) throw new Error('Could not read brandName from src/config/site.config.ts');

const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#F7F4EE"/>
  <rect x="48" y="48" width="1104" height="534" fill="none" stroke="#D9D3C7" stroke-width="2"/>
  <text x="96" y="318" font-family="Newsreader, Georgia, 'DejaVu Serif', serif" font-size="132" font-weight="500" fill="#15171A">${escape(brand)}</text>
  <line x1="96" y1="352" x2="1104" y2="352" stroke="#B08A3E" stroke-width="4" stroke-dasharray="18 14"/>
  <text x="96" y="430" font-family="Inter, Arial, sans-serif" font-size="44" fill="#55575C">Embroidery digitizing</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('public/og.png');
console.log(`Wrote public/og.png for "${brand}".`);
