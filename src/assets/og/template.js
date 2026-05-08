const WIDTH = 1200;
const HEIGHT = 630;

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toLines(text, maxChars, maxLines) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];

  const lines = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars || current.length === 0) {
      current = next;
      continue;
    }

    lines.push(current);
    current = word;
    if (lines.length >= maxLines - 1) {
      break;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  if (lines.length > maxLines) {
    lines.length = maxLines;
  }

  const lastIndex = lines.length - 1;
  if (lastIndex >= 0 && words.join(' ').length > lines.join(' ').length) {
    lines[lastIndex] = `${lines[lastIndex].replace(/\s*$/, '')}…`;
  }

  return lines.length > 0 ? lines : [String(text || '')];
}

function buildTextBlock({ x, y, lines, fontSize = 70, lineHeight = 1.16, fill = '#F8FBFF', weight = 800 }) {
  const escaped = lines.map(escapeXml);
  const tspans = escaped
    .map((line, index) => {
      const dy = index === 0 ? 0 : fontSize * lineHeight;
      const attrs = index === 0 ? '' : ` dy="${dy}"`;
      return `<tspan x="${x}"${attrs}>${line}</tspan>`;
    })
    .join('');

  return `<text x="${x}" y="${y}" fill="${fill}" font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="${fontSize}" font-weight="${weight}" letter-spacing="-0.04em">${tspans}</text>`;
}

function renderSvg({
  eyebrow = 'BlockWaveLab',
  title,
  subtitle = '',
  footer = 'Web3 growth, creator campaigns, and community strategy',
  badge = 'Crypto Marketing Agency',
  accent = '#2DE2E6',
  secondary = '#4F8CFF',
  variant = 'article',
}) {
  const titleLines = toLines(title, variant === 'service' ? 24 : 26, variant === 'tag' ? 2 : 3);
  const subtitleLines = subtitle ? toLines(subtitle, 54, 2) : [];

  const titleBlock = buildTextBlock({ x: 76, y: 236, lines: titleLines, fontSize: variant === 'service' ? 66 : 72 });
  const subtitleBlock = subtitleLines.length
    ? buildTextBlock({ x: 76, y: 396, lines: subtitleLines, fontSize: 28, lineHeight: 1.25, fill: '#B9C7DF', weight: 500 })
    : '';

  const accentBadge = `<g transform="translate(76 56)">
    <rect x="0" y="0" rx="22" ry="22" width="276" height="44" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.12)" />
    <circle cx="24" cy="22" r="7" fill="${accent}" />
    <text x="42" y="28" fill="#F8FBFF" font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="18" font-weight="700">${escapeXml(eyebrow)}</text>
  </g>`;

  const brandBlock = `<g transform="translate(76 530)">
    <text x="0" y="0" fill="#9FB4D1" font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="18" font-weight="600" letter-spacing="0.12em">${escapeXml(badge)}</text>
    <text x="0" y="34" fill="#F8FBFF" font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="20" font-weight="700">${escapeXml(footer)}</text>
  </g>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title>${escapeXml(title)}</title>
  <desc>${escapeXml(subtitle || footer)}</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#07111F"/>
      <stop offset="0.55" stop-color="#0D1B34"/>
      <stop offset="1" stop-color="#08111E"/>
    </linearGradient>
    <linearGradient id="accentGradient" x1="64" y1="64" x2="1136" y2="566" gradientUnits="userSpaceOnUse">
      <stop stop-color="${accent}" stop-opacity="0.95"/>
      <stop offset="1" stop-color="${secondary}" stop-opacity="0.95"/>
    </linearGradient>
    <radialGradient id="halo" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(960 168) rotate(128) scale(390 390)">
      <stop stop-color="${accent}" stop-opacity="0.36"/>
      <stop offset="0.55" stop-color="${secondary}" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#07111F" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 H 0 V 48" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    </pattern>
    <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="22" />
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)" opacity="0.55"/>
  <circle cx="982" cy="138" r="188" fill="url(#halo)"/>
  <circle cx="980" cy="146" r="116" fill="url(#accentGradient)" opacity="0.18" filter="url(#softBlur)"/>
  <circle cx="1060" cy="454" r="94" fill="${accent}" opacity="0.12" filter="url(#softBlur)"/>
  <rect x="52" y="44" width="1096" height="542" rx="36" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)"/>
  <rect x="76" y="118" width="120" height="5" rx="3" fill="url(#accentGradient)"/>
  ${accentBadge}
  ${titleBlock}
  ${subtitleBlock}
  ${brandBlock}
  <g transform="translate(904 402)">
    <rect x="0" y="0" width="220" height="142" rx="26" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.10)"/>
    <text x="24" y="38" fill="#F8FBFF" font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="20" font-weight="700">Open Graph</text>
    <text x="24" y="68" fill="#AFC1DA" font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="15" font-weight="500">Optimized for X</text>
    <text x="24" y="92" fill="#AFC1DA" font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="15" font-weight="500">Telegram, LinkedIn</text>
    <circle cx="182" cy="40" r="10" fill="${accent}"/>
    <circle cx="182" cy="68" r="10" fill="${secondary}"/>
    <circle cx="182" cy="96" r="10" fill="#9EF3FF"/>
  </g>
</svg>`;
}

export { escapeXml, toLines, renderSvg };
