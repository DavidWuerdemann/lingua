// Generate icon-192.png and icon-512.png with Ollie the owl on a navy background
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dir, '..', 'public');

// Full Ollie owl SVG — navy background, friendly owl face
// Designed to be clear at both 192×192 and 512×512
const svgTemplate = (size) => {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  // Scale factor: original design at 512
  const sc = s / 512;
  const t = (v) => (v * sc).toFixed(2);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#1D2E44"/>
      <stop offset="100%" stop-color="#0F1B2D"/>
    </radialGradient>
    <radialGradient id="body" cx="50%" cy="38%" r="60%">
      <stop offset="0%" stop-color="#C49570"/>
      <stop offset="100%" stop-color="#7A5535"/>
    </radialGradient>
    <radialGradient id="belly" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#F5E8D5"/>
      <stop offset="100%" stop-color="#E4CCA8"/>
    </radialGradient>
    <radialGradient id="eye-l" cx="38%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#E8E0D8"/>
    </radialGradient>
    <radialGradient id="eye-r" cx="38%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#E8E0D8"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${t(8)}" stdDeviation="${t(12)}" flood-color="#000" flood-opacity="0.35"/>
    </filter>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="${t(6)}" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background circle -->
  <rect width="${s}" height="${s}" fill="url(#bg)" rx="${t(96)}"/>

  <!-- Subtle glow behind Ollie -->
  <ellipse cx="${cx}" cy="${cy}" rx="${t(185)}" ry="${t(175)}" fill="rgba(201,148,58,0.07)"/>

  <!-- Ollie's body (centred, shifted down slightly) -->
  <g transform="translate(${cx}, ${cy + s * 0.04})" filter="url(#shadow)">
    <!-- Main body oval -->
    <ellipse cx="0" cy="${t(30)}" rx="${t(148)}" ry="${t(155)}" fill="url(#body)"/>

    <!-- Wing feathers (left) -->
    <ellipse cx="${t(-128)}" cy="${t(80)}" rx="${t(40)}" ry="${t(80)}" fill="#8B6242" transform="rotate(-22 ${t(-128)} ${t(80)})"/>
    <ellipse cx="${t(-110)}" cy="${t(88)}" rx="${t(32)}" ry="${t(68)}" fill="#9E7050" transform="rotate(-18 ${t(-110)} ${t(88)})"/>

    <!-- Wing feathers (right) -->
    <ellipse cx="${t(128)}" cy="${t(80)}" rx="${t(40)}" ry="${t(80)}" fill="#8B6242" transform="rotate(22 ${t(128)} ${t(80)})"/>
    <ellipse cx="${t(110)}" cy="${t(88)}" rx="${t(32)}" ry="${t(68)}" fill="#9E7050" transform="rotate(18 ${t(110)} ${t(88)})"/>

    <!-- Belly -->
    <ellipse cx="0" cy="${t(68)}" rx="${t(90)}" ry="${t(108)}" fill="url(#belly)"/>

    <!-- Belly feather lines -->
    <path d="M 0 ${t(-10)} Q ${t(-40)} ${t(30)} 0 ${t(60)}" stroke="#D4B890" stroke-width="${t(2)}" fill="none" opacity="0.5"/>
    <path d="M 0 ${t(-10)} Q ${t(40)} ${t(30)} 0 ${t(60)}" stroke="#D4B890" stroke-width="${t(2)}" fill="none" opacity="0.5"/>

    <!-- Ear tufts -->
    <path d="M ${t(-72)} ${t(-110)} L ${t(-90)} ${t(-175)} L ${t(-38)} ${t(-118)} Z" fill="#8B6242"/>
    <path d="M ${t(72)} ${t(-110)} L ${t(90)} ${t(-175)} L ${t(38)} ${t(-118)} Z" fill="#8B6242"/>
    <!-- Tuft highlights -->
    <path d="M ${t(-72)} ${t(-115)} L ${t(-82)} ${t(-158)} L ${t(-50)} ${t(-120)} Z" fill="#A07548"/>
    <path d="M ${t(72)} ${t(-115)} L ${t(82)} ${t(-158)} L ${t(50)} ${t(-120)} Z" fill="#A07548"/>

    <!-- Facial disc (lighter ring around face) -->
    <ellipse cx="0" cy="${t(-20)}" rx="${t(115)}" ry="${t(108)}" fill="#A87F58" opacity="0.35"/>

    <!-- Left eye white -->
    <circle cx="${t(-48)}" cy="${t(-30)}" r="${t(52)}" fill="url(#eye-l)"/>
    <!-- Left eye ring -->
    <circle cx="${t(-48)}" cy="${t(-30)}" r="${t(52)}" fill="none" stroke="#C9943A" stroke-width="${t(4)}" opacity="0.6"/>
    <!-- Left pupil -->
    <circle cx="${t(-42)}" cy="${t(-26)}" r="${t(28)}" fill="#2D2521"/>
    <!-- Left pupil shine -->
    <circle cx="${t(-36)}" cy="${t(-36)}" r="${t(9)}" fill="#FFFFFF"/>
    <circle cx="${t(-28)}" cy="${t(-22)}" r="${t(4)}" fill="rgba(255,255,255,0.5)"/>

    <!-- Right eye white -->
    <circle cx="${t(48)}" cy="${t(-30)}" r="${t(52)}" fill="url(#eye-r)"/>
    <!-- Right eye ring -->
    <circle cx="${t(48)}" cy="${t(-30)}" r="${t(52)}" fill="none" stroke="#C9943A" stroke-width="${t(4)}" opacity="0.6"/>
    <!-- Right pupil -->
    <circle cx="${t(54)}" cy="${t(-26)}" r="${t(28)}" fill="#2D2521"/>
    <!-- Right pupil shine -->
    <circle cx="${t(60)}" cy="${t(-36)}" r="${t(9)}" fill="#FFFFFF"/>
    <circle cx="${t(68)}" cy="${t(-22)}" r="${t(4)}" fill="rgba(255,255,255,0.5)"/>

    <!-- Beak -->
    <path d="M ${t(-22)} ${t(22)} L 0 ${t(62)} L ${t(22)} ${t(22)} Q 0 ${t(12)} ${t(-22)} ${t(22)} Z" fill="#E8943B"/>
    <path d="M ${t(-22)} ${t(22)} Q 0 ${t(38)} ${t(22)} ${t(22)}" stroke="#C97820" stroke-width="${t(2.5)}" fill="none"/>
    <!-- Beak highlight -->
    <path d="M ${t(-12)} ${t(26)} Q 0 ${t(20)} ${t(12)} ${t(26)}" stroke="#F4B060" stroke-width="${t(2)}" fill="none" opacity="0.6"/>

    <!-- Feet -->
    <g fill="#C97820">
      <ellipse cx="${t(-38)}" cy="${t(168)}" rx="${t(16)}" ry="${t(8)}" transform="rotate(-10 ${t(-38)} ${t(168)})"/>
      <ellipse cx="${t(-20)}" cy="${t(170)}" rx="${t(16)}" ry="${t(8)}" transform="rotate(5 ${t(-20)} ${t(170)})"/>
      <ellipse cx="${t(20)}" cy="${t(170)}" rx="${t(16)}" ry="${t(8)}" transform="rotate(-5 ${t(20)} ${t(170)})"/>
      <ellipse cx="${t(38)}" cy="${t(168)}" rx="${t(16)}" ry="${t(8)}" transform="rotate(10 ${t(38)} ${t(168)})"/>
    </g>
  </g>

  <!-- Gold accent star bottom-right -->
  <text x="${t(390)}" y="${t(460)}" font-size="${t(56)}" text-anchor="middle" fill="#C9943A" opacity="0.7">✦</text>
</svg>`;
};

for (const size of [192, 512]) {
  const svg = svgTemplate(size);
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    font: { loadSystemFonts: false },
  });
  const png = resvg.render().asPng();
  const outPath = join(publicDir, `icon-${size}.png`);
  writeFileSync(outPath, png);
  console.log(`✓ icon-${size}.png (${png.length} bytes)`);
}
console.log('Done!');
