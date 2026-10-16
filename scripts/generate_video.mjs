import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const WIDTH = 1280;
const HEIGHT = 720;
const FPS = 30;
const DURATION = 30;
const TOTAL_FRAMES = FPS * DURATION; // 900 frames

const FRAMES_DIR = '/tmp/motion_frames';
if (fs.existsSync(FRAMES_DIR)) {
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
}
fs.mkdirSync(FRAMES_DIR, { recursive: true });

// Read font files
const homeDir = process.env.HOME || '/root';
const jakartaFontB64 = fs.readFileSync(path.join(homeDir, '.fonts', 'PlusJakartaSans.ttf')).toString('base64');
const interFontB64 = fs.readFileSync(path.join(homeDir, '.fonts', 'Inter.ttf')).toString('base64');

const FONT_STYLES = `
  @font-face {
    font-family: 'Plus Jakarta Sans';
    src: url(data:font/ttf;base64,${jakartaFontB64}) format('truetype');
    font-weight: 700 800;
  }
  @font-face {
    font-family: 'Inter';
    src: url(data:font/ttf;base64,${interFontB64}) format('truetype');
    font-weight: 400 500 600 700;
  }
`;

// Exact Google G Icon SVG
const googleGIcon = (x, y, size = 24) => `
  <g transform="translate(${x}, ${y}) scale(${size / 24})">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </g>
`;

// Exact Google colored letters
const googleWord = (x, y, size = 82) => `
  <g transform="translate(${x}, ${y})">
    <text font-family="'Plus Jakarta Sans', sans-serif" font-size="${size}" font-weight="800" letter-spacing="-0.03em" dominant-baseline="alphabetic">
      <tspan fill="#4285F4">G</tspan><tspan fill="#EA4335">o</tspan><tspan fill="#FBBC05">o</tspan><tspan fill="#4285F4">g</tspan><tspan fill="#34A853">l</tspan><tspan fill="#EA4335">e</tspan>
    </text>
  </g>
`;

// Exact Momento 3 App Badges with official SVG drawings
const appIconSvg = {
  gmail: `
    <circle cx="40" cy="40" r="36" stroke="#202124" stroke-width="2.2" fill="#FFFFFF" />
    <rect x="23" y="27" width="34" height="24" rx="3" stroke="#202124" stroke-width="2" fill="none" />
    <path d="M24 28L40 40L56 28" stroke="#EA4335" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
  `,
  drive: `
    <circle cx="40" cy="40" r="36" stroke="#202124" stroke-width="2.2" fill="#FFFFFF" />
    <polygon points="40,22 58,52 22,52" stroke="#202124" stroke-width="2" stroke-linejoin="round" fill="none" />
    <line x1="28" y1="42" x2="52" y2="42" stroke="#4285F4" stroke-width="2.6" stroke-linecap="round" />
  `,
  docs: `
    <circle cx="40" cy="40" r="36" stroke="#202124" stroke-width="2.2" fill="#FFFFFF" />
    <rect x="26" y="22" width="28" height="34" rx="3" stroke="#202124" stroke-width="2" fill="none" />
    <path d="M46 22V29H54" stroke="#202124" stroke-width="1.8" fill="none" />
    <line x1="31" y1="35" x2="49" y2="35" stroke="#4285F4" stroke-width="2" stroke-linecap="round" />
    <line x1="31" y1="41" x2="49" y2="41" stroke="#4285F4" stroke-width="2" stroke-linecap="round" />
    <line x1="31" y1="47" x2="41" y2="47" stroke="#4285F4" stroke-width="2" stroke-linecap="round" />
  `,
  sheets: `
    <circle cx="40" cy="40" r="36" stroke="#202124" stroke-width="2.2" fill="#FFFFFF" />
    <rect x="25" y="24" width="30" height="32" rx="3" stroke="#202124" stroke-width="2" fill="none" />
    <line x1="25" y1="35" x2="55" y2="35" stroke="#202124" stroke-width="1.8" />
    <line x1="25" y1="45" x2="55" y2="45" stroke="#202124" stroke-width="1.8" />
    <line x1="40" y1="24" x2="40" y2="56" stroke="#202124" stroke-width="1.8" />
    <rect x="28" y="27" width="9" height="5" rx="1" fill="#34A853" />
  `,
  slides: `
    <circle cx="40" cy="40" r="36" stroke="#202124" stroke-width="2.2" fill="#FFFFFF" />
    <rect x="24" y="25" width="32" height="23" rx="3" stroke="#202124" stroke-width="2" fill="none" />
    <line x1="40" y1="48" x2="40" y2="54" stroke="#202124" stroke-width="2" />
    <line x1="32" y1="54" x2="48" y2="54" stroke="#202124" stroke-width="2" stroke-linecap="round" />
    <rect x="29" y="30" width="13" height="9" rx="1.5" fill="#FBBC05" />
  `,
  calendar: `
    <circle cx="40" cy="40" r="36" stroke="#202124" stroke-width="2.2" fill="#FFFFFF" />
    <rect x="25" y="25" width="30" height="29" rx="3" stroke="#202124" stroke-width="2" fill="none" />
    <line x1="25" y1="34" x2="55" y2="34" stroke="#202124" stroke-width="2" />
    <line x1="32" y1="21" x2="32" y2="26" stroke="#202124" stroke-width="2" stroke-linecap="round" />
    <line x1="48" y1="21" x2="48" y2="26" stroke="#202124" stroke-width="2" stroke-linecap="round" />
    <text x="40" y="47" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" fill="#4285F4">31</text>
  `,
  meet: `
    <circle cx="40" cy="40" r="36" stroke="#202124" stroke-width="2.2" fill="#FFFFFF" />
    <rect x="22" y="28" width="23" height="24" rx="3.5" stroke="#202124" stroke-width="2" fill="none" />
    <path d="M46 34L58 26V54L46 46Z" fill="#34A853" stroke="#34A853" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />
    <circle cx="33.5" cy="40" r="4.5" fill="#34A853" />
  `,
};

console.log(`Rendering ${TOTAL_FRAMES} high-fidelity frames...`);

for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
  const t = frame / FPS;
  const progressWidth = (t / DURATION) * WIDTH;

  let sceneContent = '';

  // ===================================================================
  // MOMENTO 1 (0.0s to 7.5s)
  // ===================================================================
  if (t < 7.5) {
    let word = 'Gemini';
    let isGemini = true;
    if (t < 1.8) {
      word = 'Gemini';
      isGemini = true;
    } else if (t < 3.6) {
      word = 'Workspace';
      isGemini = false;
    } else if (t < 5.4) {
      word = 'Gemini';
      isGemini = true;
    } else {
      word = 'Workspace';
      isGemini = false;
    }

    // 3D rotation flip simulation via scaleY & opacity
    const rotInterval = t % 1.8;
    const isFlipping = rotInterval < 0.5 && t > 0.4;
    const flipProgress = isFlipping ? rotInterval / 0.5 : 1;
    const wordOpacity = isFlipping ? Math.min(1, flipProgress * 2) : 1;
    const wordScaleY = isFlipping ? 0.3 + 0.7 * flipProgress : 1;
    const wordYOffset = isFlipping ? (1 - flipProgress) * 15 : 0;

    sceneContent = `
      <!-- Embaixadores Signature (Aligned with G of Google) -->
      ${googleGIcon(283.5, 276, 24)}
      <text x="319.5" y="294" font-family="'Inter', sans-serif" font-size="18" font-weight="600" fill="#3C4043" letter-spacing="0.01em">
        Embaixadores Estudantis do Google
      </text>

      <!-- Fixed Google Headline -->
      ${googleWord(280, 396, 82)}

      <!-- Rotating Word (Gemini / Workspace) -->
      <g transform="translate(558, ${396 + wordYOffset}) scale(1, ${wordScaleY})" opacity="${wordOpacity}">
        ${isGemini ? `
          <text font-family="'Plus Jakarta Sans', sans-serif" font-size="82" font-weight="800" letter-spacing="-0.03em" fill="url(#geminiGrad)" dominant-baseline="alphabetic">Gemini</text>
        ` : `
          <text font-family="'Plus Jakarta Sans', sans-serif" font-size="82" font-weight="800" letter-spacing="-0.03em" fill="#5F6368" dominant-baseline="alphabetic">Workspace</text>
        `}
      </g>
    `;
  }
  // ===================================================================
  // MOMENTO 2 (7.5s to 14.0s) — Ecossistema Integrado
  // ===================================================================
  else if (t < 14.0) {
    const s2T = t - 7.5;
    const yellowWidth = Math.min(270, s2T * 400);

    sceneContent = `
      <!-- Top-Left Title -->
      <rect x="100" y="78" width="64" height="2.5" fill="#202124" />
      <text x="100" y="122" font-family="'Plus Jakarta Sans', sans-serif" font-size="42" font-weight="800" fill="#202124" letter-spacing="-0.02em">
        ECOSSISTEMA
      </text>
      <!-- Yellow Bar Behind INTEGRADO -->
      <rect x="94" y="132" width="${yellowWidth}" height="34" fill="#FBBC05" />
      <text x="100" y="160" font-family="'Plus Jakarta Sans', sans-serif" font-size="42" font-weight="800" fill="#202124" letter-spacing="-0.02em">
        INTEGRADO
      </text>

      <!-- 3 Symmetrical Columns (x=260, x=640, x=1020) -->
      
      <!-- Col 1: Gmail (Center at 260) -->
      <g transform="translate(208, 275)">
        <circle cx="52" cy="52" r="46" stroke="#202124" stroke-width="2.5" fill="#FFFFFF"/>
        <rect x="29" y="36" width="46" height="32" rx="4" stroke="#202124" stroke-width="2.5" fill="none"/>
        <path d="M30 38L52 54L74 38" stroke="#EA4335" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="28" y="124" width="48" height="2" fill="#202124"/>
        <text x="52" y="156" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="700" fill="#202124">Gmail</text>
        <text x="52" y="186" text-anchor="middle" font-family="'Inter', sans-serif" font-size="15" fill="#5F6368">Consulte e-mails importantes</text>
        <text x="52" y="210" text-anchor="middle" font-family="'Inter', sans-serif" font-size="15" fill="#5F6368">e prazos sem sair do chat</text>
      </g>

      <!-- Col 2: Google Drive (Center at 640) -->
      <g transform="translate(588, 275)">
        <circle cx="52" cy="52" r="46" stroke="#202124" stroke-width="2.5" fill="#FFFFFF"/>
        <polygon points="52,30 74,66 30,66" stroke="#202124" stroke-width="2.5" stroke-linejoin="round" fill="none"/>
        <line x1="38" y1="54" x2="66" y2="54" stroke="#4285F4" stroke-width="3" stroke-linecap="round"/>
        <rect x="28" y="124" width="48" height="2" fill="#202124"/>
        <text x="52" y="156" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="700" fill="#202124">Google Drive</text>
        <text x="52" y="186" text-anchor="middle" font-family="'Inter', sans-serif" font-size="15" fill="#5F6368">Localize resumos, artigos</text>
        <text x="52" y="210" text-anchor="middle" font-family="'Inter', sans-serif" font-size="15" fill="#5F6368">e materiais das suas aulas</text>
      </g>

      <!-- Col 3: Google Calendar (Center at 1020) -->
      <g transform="translate(968, 275)">
        <circle cx="52" cy="52" r="46" stroke="#202124" stroke-width="2.5" fill="#FFFFFF"/>
        <rect x="33" y="34" width="38" height="36" rx="4" stroke="#202124" stroke-width="2.5" fill="none"/>
        <line x1="33" y1="45" x2="71" y2="45" stroke="#202124" stroke-width="2.5"/>
        <line x1="43" y1="29" x2="43" y2="36" stroke="#202124" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="61" y1="29" x2="61" y2="36" stroke="#202124" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="46" y="52" width="12" height="10" rx="2" fill="#34A853"/>
        <rect x="28" y="124" width="48" height="2" fill="#202124"/>
        <text x="52" y="156" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="700" fill="#202124">Google Calendar</text>
        <text x="52" y="186" text-anchor="middle" font-family="'Inter', sans-serif" font-size="15" fill="#5F6368">Organize sessões de estudo</text>
        <text x="52" y="210" text-anchor="middle" font-family="'Inter', sans-serif" font-size="15" fill="#5F6368">e eventos automaticamente</text>
      </g>
    `;
  }
  // ===================================================================
  // MOMENTO 3 (14.0s to 22.0s) — Logos dos Apps Google Workspace
  // ===================================================================
  else if (t < 22.0) {
    const s3T = t - 14.0;
    const apps = [
      { id: 'gmail', name: 'Gmail', color: '#EA4335', delay: 0.2 },
      { id: 'drive', name: 'Drive', color: '#4285F4', delay: 0.6 },
      { id: 'docs', name: 'Docs', color: '#4285F4', delay: 1.0 },
      { id: 'sheets', name: 'Sheets', color: '#34A853', delay: 1.4 },
      { id: 'slides', name: 'Slides', color: '#FBBC05', delay: 1.8 },
      { id: 'calendar', name: 'Calendar', color: '#4285F4', delay: 2.2 },
      { id: 'meet', name: 'Meet', color: '#34A853', delay: 2.6 },
    ];

    let appCards = '';
    const startX = 216;
    const pitch = 126;

    apps.forEach((app, i) => {
      const isVis = s3T >= app.delay;
      const opacity = isVis ? Math.min(1, (s3T - app.delay) * 3) : 0;
      const cardX = startX + i * pitch;

      appCards += `
        <g transform="translate(${cardX}, 340)" opacity="${opacity}">
          <!-- White Circular Shadow Container (92x92) -->
          <circle cx="46" cy="46" r="46" fill="#FFFFFF" stroke="#F3F4F6" stroke-width="1.5" />
          
          <!-- Exact App Icon Scaled inside 92px circle -->
          <g transform="translate(6, 6) scale(1)">
            ${appIconSvg[app.id]}
          </g>

          <!-- Colored Dash -->
          <rect x="33" y="110" width="26" height="4" rx="2" fill="${app.color}" />

          <!-- App Name -->
          <text x="46" y="136" text-anchor="middle" font-family="'Inter', sans-serif" font-size="15" font-weight="600" fill="#202124">${app.name}</text>
        </g>
      `;
    });

    sceneContent = `
      <!-- Grid Paper Background Pattern -->
      <defs>
        <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#ECEFF1" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />

      <!-- Center Title: Google Workspace (64px) -->
      <g transform="translate(430, 240)">
        ${googleWord(0, 0, 64)}
        <text x="238" y="0" font-family="'Plus Jakarta Sans', sans-serif" font-size="64" font-weight="800" fill="#5F6368" letter-spacing="-0.03em" dominant-baseline="alphabetic">Workspace</text>
      </g>

      <!-- Row of 7 App Badges -->
      ${appCards}
    `;
  }
  // ===================================================================
  // MOMENTO 4 (22.0s to 30.0s) — Google Workspace Final (Parado, Padrão Google)
  // ===================================================================
  else {
    sceneContent = `
      <!-- Bottom-Left Strictly Aligned Google Workspace Capsules -->
      <g>
        <rect x="-16" y="646" width="300" height="44" rx="22" fill="#34A853" />
        <rect x="-16" y="590" width="230" height="44" rx="22" fill="#FBBC05" />
        <rect x="-16" y="534" width="160" height="44" rx="22" fill="#4285F4" />
        <circle cx="182" cy="556" r="22" fill="#EA4335" />
      </g>

      <!-- Top-Right Strictly Aligned Google Workspace Capsules -->
      <g>
        <rect x="996" y="30" width="300" height="44" rx="22" fill="#4285F4" />
        <rect x="1066" y="86" width="230" height="44" rx="22" fill="#FBBC05" />
        <rect x="1136" y="142" width="160" height="44" rx="22" fill="#34A853" />
        <circle cx="1098" cy="164" r="22" fill="#EA4335" />
      </g>

      <!-- Top Signature (Centered at x=640) -->
      <g transform="translate(485, 230)">
        ${googleGIcon(0, 0, 22)}
        <text x="32" y="16" font-family="'Inter', sans-serif" font-size="18" font-weight="600" fill="#5F6368" letter-spacing="0.01em">
          Embaixadores Estudantis do Google
        </text>
      </g>

      <!-- Central Headline: Fixed, Static Google Workspace (Centered at x=640) -->
      <g transform="translate(365, 345)">
        ${googleWord(0, 0, 82)}
        <text x="278" y="0" font-family="'Plus Jakarta Sans', sans-serif" font-size="82" font-weight="800" fill="#5F6368" letter-spacing="-0.03em" dominant-baseline="alphabetic">Workspace</text>
      </g>

      <!-- Google Search Bar: "Conectado com Gemini" (Centered at x=640, y=414) -->
      <g transform="translate(375, 414)">
        <rect width="530" height="56" rx="28" fill="#FFFFFF" stroke="#DFE1E5" stroke-width="1"/>
        
        <!-- Search Magnifier Icon -->
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="#9AA0A6" transform="translate(20, 18)"/>

        <!-- Text: Conectado com Gemini -->
        <text x="56" y="34" font-family="'Inter', sans-serif" font-size="17" font-weight="500" fill="#202124">
          Conectado com <tspan font-weight="700" fill="url(#geminiGrad)">Gemini</tspan>
        </text>

        <!-- Blinking Cursor -->
        ${(Math.floor(t * 2) % 2 === 0) ? '<rect x="254" y="18" width="2" height="20" rx="1" fill="#4285F4"/>' : ''}

        <!-- Right Google Icons: Mic, Lens, Sparkle -->
        <g transform="translate(440, 18)">
          <!-- Google Mic -->
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" fill="#4285F4"/>
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" fill="#34A853"/>
          <path d="M10 21h4v2h-4z" fill="#FBBC05"/>

          <!-- Google Lens -->
          <circle cx="28" cy="12" r="3" fill="#4285F4"/>
          <rect x="20" y="5" width="16" height="14" rx="3" fill="none" stroke="#EA4335" stroke-width="1.8"/>

          <!-- Gemini Sparkle -->
          <path d="M48 2C48 6.4 51.6 10 56 10C51.6 10 48 13.6 48 18C48 13.6 44.4 10 40 10C44.4 10 48 6.4 48 2Z" fill="url(#geminiGrad)"/>
        </g>
      </g>
    `;
  }

  // Full SVG Frame with Embedded Fonts
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
      <defs>
        <style>
          ${FONT_STYLES}
        </style>
        <!-- Top Google Progress Bar Gradient -->
        <linearGradient id="topProgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#4285F4"/>
          <stop offset="25%" stop-color="#4285F4"/>
          <stop offset="25%" stop-color="#EA4335"/>
          <stop offset="50%" stop-color="#EA4335"/>
          <stop offset="50%" stop-color="#FBBC05"/>
          <stop offset="75%" stop-color="#FBBC05"/>
          <stop offset="75%" stop-color="#34A853"/>
          <stop offset="100%" stop-color="#34A853"/>
        </linearGradient>
        <!-- Gemini Color Gradient -->
        <linearGradient id="geminiGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#4285F4"/>
          <stop offset="50%" stop-color="#9B72CB"/>
          <stop offset="100%" stop-color="#D96570"/>
        </linearGradient>
      </defs>

      <!-- Stage Background -->
      <rect width="100%" height="100%" fill="#FFFFFF" />

      <!-- Top Google Progress Bar (3.5px) -->
      <rect x="0" y="0" width="${progressWidth}" height="3.5" fill="url(#topProgGrad)"/>

      <!-- Scene Visual Content -->
      ${sceneContent}
    </svg>
  `;

  const frameFileName = path.join(FRAMES_DIR, `frame_${String(frame).padStart(4, '0')}.svg`);
  fs.writeFileSync(frameFileName, svg);
}

console.log('All 900 frames generated with embedded fonts and official icons.');
console.log('Encoding broadcast-quality MP4 video with ffmpeg...');

const OUTPUT_MP4 = path.join(process.cwd(), 'public', 'google-workspace-gemini-30s.mp4');

execSync(
  `ffmpeg -y -framerate ${FPS} -i ${FRAMES_DIR}/frame_%04d.svg -c:v libx264 -b:v 2500k -profile:v high -level 4.1 -pix_fmt yuv420p -movflags +faststart ${OUTPUT_MP4}`,
  { stdio: 'inherit' }
);

const stats = fs.statSync(OUTPUT_MP4);
console.log(`Video generated successfully! Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB (${stats.size} bytes) at ${OUTPUT_MP4}`);

// Clean up temporary frames
fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
