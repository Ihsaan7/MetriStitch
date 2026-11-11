import { siteConfig } from '@/config/site.config';

/** The brand name set in the display font, with the dashed stitch line underneath. */
export default function Wordmark({ scale = 1 }: { scale?: number }) {
  const name = siteConfig.brandName;
  const width = Math.round(name.length * 12.6);
  const height = 38;

  return (
    <svg
      role="img"
      aria-label={name}
      viewBox={`0 0 ${width} ${height}`}
      width={Math.round(width * scale)}
      height={Math.round(height * scale)}
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <title>{name}</title>
      <text
        x="0"
        y="25"
        textLength={width}
        lengthAdjust="spacing"
        fill="currentColor"
        style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 500 }}
      >
        {name}
      </text>
      <line
        x1="0"
        y1="33"
        x2={width}
        y2="33"
        stroke="var(--color-gold)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
    </svg>
  );
}
