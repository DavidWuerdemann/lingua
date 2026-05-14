// Generates public/icon-192.png and public/icon-512.png with Ollie the owl.
// Runs automatically as "prebuild" before every `npm run build`.
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dir  = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dir, '..', 'public');

// ── SVG source ────────────────────────────────────────────────────────────────
// Designed to stay crisp at 192 px:
//  • Face-forward Ollie, big eyes, bold shapes, minimal fine detail
//  • Navy squircle background  ·  gold accent ring  ·  warm brown owl
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" shape-rendering="geometricPrecision">
<defs>
  <!-- Background: deep navy, subtle centre glow -->
  <radialGradient id="bgGrad" cx="50%" cy="40%" r="70%">
    <stop offset="0%"   stop-color="#1A2D45"/>
    <stop offset="100%" stop-color="#0B1522"/>
  </radialGradient>

  <!-- Owl body: warm amber-brown -->
  <radialGradient id="bodyGrad" cx="42%" cy="32%" r="68%">
    <stop offset="0%"   stop-color="#C9935A"/>
    <stop offset="60%"  stop-color="#9E6A38"/>
    <stop offset="100%" stop-color="#6E4420"/>
  </radialGradient>

  <!-- Facial disc: creamy -->
  <radialGradient id="faceGrad" cx="45%" cy="38%" r="62%">
    <stop offset="0%"   stop-color="#F5E8D0"/>
    <stop offset="100%" stop-color="#DFC9A4"/>
  </radialGradient>

  <!-- Eye whites -->
  <radialGradient id="eyeGrad" cx="35%" cy="30%" r="65%">
    <stop offset="0%"   stop-color="#FFFFFF"/>
    <stop offset="100%" stop-color="#EDE4D8"/>
  </radialGradient>

  <!-- Gold ring glow behind owl -->
  <radialGradient id="haloGrad" cx="50%" cy="50%" r="50%">
    <stop offset="60%"  stop-color="rgba(201,148,58,0)"  />
    <stop offset="100%" stop-color="rgba(201,148,58,0.28)"/>
  </radialGradient>

  <!-- Drop shadow filter -->
  <filter id="dropShadow" x="-15%" y="-10%" width="130%" height="130%">
    <feDropShadow dx="0" dy="6" stdDeviation="14" flood-color="#000" flood-opacity="0.55"/>
  </filter>
  <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="0" dy="3" stdDeviation="7" flood-color="#000" flood-opacity="0.40"/>
  </filter>
</defs>

<!-- ── Background squircle ── -->
<rect width="512" height="512" rx="108" ry="108" fill="url(#bgGrad)"/>

<!-- Gold halo ring (subtle, decorative) -->
<ellipse cx="256" cy="272" rx="198" ry="195" fill="url(#haloGrad)"/>

<!-- ── Ollie group ── -->
<g filter="url(#dropShadow)">

  <!-- Body -->
  <ellipse cx="256" cy="318" rx="152" ry="168" fill="url(#bodyGrad)"/>

  <!-- Ear tufts (drawn behind the head) -->
  <polygon points="166,175 148,84 208,168" fill="#7A4E22"/>
  <polygon points="346,175 364,84 304,168" fill="#7A4E22"/>
  <!-- Tuft highlight -->
  <polygon points="172,172 156,100 205,170" fill="#A06836"/>
  <polygon points="340,172 356,100 307,170" fill="#A06836"/>

  <!-- Facial disc (warm cream oval covering front of face) -->
  <ellipse cx="256" cy="265" rx="128" ry="122" fill="url(#faceGrad)"/>

  <!-- Wing hints (small rounded patches on sides) -->
  <ellipse cx="116" cy="340" rx="46" ry="88" fill="#7A4E22" transform="rotate(-18,116,340)"/>
  <ellipse cx="396" cy="340" rx="46" ry="88" fill="#7A4E22" transform="rotate(18,396,340)"/>

  <!-- Belly feather texture (very subtle arcs) -->
  <ellipse cx="256" cy="348" rx="88" ry="96" fill="#EBD9B8" opacity="0.55"/>

  <!-- ── Eyes ── -->
  <!-- Left eye -->
  <circle cx="204" cy="258" r="58" fill="url(#eyeGrad)" filter="url(#softShadow)"/>
  <circle cx="204" cy="258" r="58" fill="none" stroke="#C9943A" stroke-width="5" opacity="0.9"/>
  <!-- Left pupil -->
  <circle cx="210" cy="263" r="34" fill="#1A1008"/>
  <!-- Left pupil shine (large) -->
  <circle cx="196" cy="248" r="11" fill="#FFFFFF"/>
  <!-- Left pupil shine (small) -->
  <circle cx="220" cy="266" r="5"  fill="rgba(255,255,255,0.55)"/>

  <!-- Right eye -->
  <circle cx="308" cy="258" r="58" fill="url(#eyeGrad)" filter="url(#softShadow)"/>
  <circle cx="308" cy="258" r="58" fill="none" stroke="#C9943A" stroke-width="5" opacity="0.9"/>
  <!-- Right pupil -->
  <circle cx="314" cy="263" r="34" fill="#1A1008"/>
  <!-- Right pupil shine (large) -->
  <circle cx="300" cy="248" r="11" fill="#FFFFFF"/>
  <!-- Right pupil shine (small) -->
  <circle cx="324" cy="266" r="5"  fill="rgba(255,255,255,0.55)"/>

  <!-- Beak -->
  <path d="M 230,298 L 256,340 L 282,298 Q 256,285 230,298 Z" fill="#E8943B"/>
  <path d="M 230,298 Q 256,310 282,298" stroke="#C07020" stroke-width="2.5" fill="none"/>
  <!-- Beak highlight -->
  <path d="M 238,300 Q 256,293 274,300" stroke="#F5B060" stroke-width="2" fill="none" opacity="0.7"/>

  <!-- Feet (small, peeking at bottom) -->
  <g fill="#C07820" opacity="0.85">
    <ellipse cx="224" cy="472" rx="18" ry="8" transform="rotate(-12,224,472)"/>
    <ellipse cx="244" cy="476" rx="18" ry="8" transform="rotate(-4,244,476)"/>
    <ellipse cx="268" cy="476" rx="18" ry="8" transform="rotate(4,268,476)"/>
    <ellipse cx="288" cy="472" rx="18" ry="8" transform="rotate(12,288,472)"/>
  </g>
</g>

<!-- ── Lingua ✦ badge (bottom-right) ── -->
<circle cx="404" cy="412" r="46" fill="#C9943A"/>
<circle cx="404" cy="412" r="46" fill="none" stroke="#0F1B2D" stroke-width="4" opacity="0.4"/>
<text x="404" y="422" font-family="Georgia, serif" font-size="42" font-weight="700"
      text-anchor="middle" fill="#0F1B2D" opacity="0.9">✦</text>
</svg>`;

// ── Render & save ─────────────────────────────────────────────────────────────
for (const size of [192, 512]) {
  const resvg = new Resvg(SVG, {
    fitTo:  { mode: 'width', value: size },
    font:   { loadSystemFonts: false },
  });
  const png     = resvg.render().asPng();
  const outPath = join(outDir, `icon-${size}.png`);
  writeFileSync(outPath, png);
  console.log(`✓ icon-${size}.png  (${(png.length / 1024).toFixed(0)} KB)`);
}
console.log('Icons ready.');
