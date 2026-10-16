/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_DURATION = 30.0;
const SCENE_TIMES = [0, 7.5, 14.0, 22.0];
const WORKSPACE_COLOR = '#5F6368'; // Characteristic Google Workspace lead / chumbo gray

export const GoogleWord: React.FC<{ style?: React.CSSProperties; className?: string }> = ({
  style,
  className,
}) => (
  <span style={{ display: 'inline-flex', letterSpacing: '-0.02em', ...style }} className={className}>
    <span style={{ color: '#4285F4' }}>G</span>
    <span style={{ color: '#EA4335' }}>o</span>
    <span style={{ color: '#FBBC05' }}>o</span>
    <span style={{ color: '#4285F4' }}>g</span>
    <span style={{ color: '#34A853' }}>l</span>
    <span style={{ color: '#EA4335' }}>e</span>
  </span>
);

export const GoogleSearchBar: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={`google-search-bar inline-flex items-center select-none ${className || ''}`}
    style={{
      width: 530,
      height: 56,
      backgroundColor: '#FFFFFF',
      borderRadius: 28,
      border: '1px solid #DFE1E5',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
      padding: '0 20px',
      gap: 14,
    }}
  >
    {/* Google Search Magnifying Glass Icon */}
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
        fill="#9AA0A6"
      />
    </svg>

    {/* Search Input Text: "Conectado com Gemini" with cursor */}
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', textAlign: 'left', overflow: 'hidden' }}>
      <span
        style={{
          fontSize: 17,
          fontWeight: 500,
          color: '#202124',
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
        }}
      >
        Conectado com{' '}
        <span className="gemini-gradient" style={{ fontWeight: 700 }}>
          Gemini
        </span>
      </span>
      <span
        className="search-cursor"
        style={{
          display: 'inline-block',
          width: 2,
          height: 20,
          backgroundColor: '#4285F4',
          marginLeft: 4,
          borderRadius: 1,
        }}
      />
    </div>

    {/* Right Icons: Google Mic, Google Lens, and Colorful Gemini Sparkle */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
      {/* Google Mic */}
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" fill="#4285F4"/>
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" fill="#34A853"/>
        <path d="M10 21h4v2h-4z" fill="#FBBC05"/>
      </svg>

      {/* Google Lens Camera Icon */}
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="#4285F4"/>
        <path d="M9 4L7.17 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.17L15 4H9Z" stroke="#EA4335" strokeWidth="1.8" fill="none"/>
        <circle cx="17.5" cy="8.5" r="1.5" fill="#34A853"/>
      </svg>

      {/* Gemini Gradient Sparkle */}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C12 7.52285 16.4772 12 22 12C16.4772 12 12 16.4772 12 22C12 16.4772 7.52285 12 2 12C7.52285 12 12 7.52285 12 2Z"
          fill="url(#geminiBarGrad)"
        />
        <defs>
          <linearGradient id="geminiBarGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4285F4"/>
            <stop offset="0.5" stopColor="#9B72CB"/>
            <stop offset="1" stopColor="#D96570"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
);

interface AppItem {
  id: string;
  name: string;
  color: string;
  delayTime: number;
  icon: React.ReactNode;
}

export default function App() {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [stageScale, setStageScale] = useState<number>(1);


  const prevTimestampRef = useRef<number | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Uniform 16:9 Stage Scaling (1280x720) adapting to the full screen
  const updateStageScale = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(vw / 1280, vh / 720);
    setStageScale(scale);
  }, []);

  useEffect(() => {
    updateStageScale();
    window.addEventListener('resize', updateStageScale);
    return () => window.removeEventListener('resize', updateStageScale);
  }, [updateStageScale]);

  // Main 30s Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      prevTimestampRef.current = null;
      return;
    }

    const tick = (now: number) => {
      if (!prevTimestampRef.current) {
        prevTimestampRef.current = now;
      }
      const delta = (now - prevTimestampRef.current) / 1000;
      prevTimestampRef.current = now;

      setElapsedSeconds((prev) => {
        const next = prev + delta;
        if (next >= TOTAL_DURATION) {
          return 0;
        }
        return next;
      });

      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isPlaying]);

  const restartMotion = useCallback(() => {
    setElapsedSeconds(0);
    setIsPlaying(true);
    prevTimestampRef.current = null;
  }, []);

  const jumpToScene = useCallback((sceneIndex: number) => {
    setElapsedSeconds(SCENE_TIMES[sceneIndex]);
    setIsPlaying(true);
    prevTimestampRef.current = null;
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  // Keyboard navigation: Space (pause/play), R (restart), 1-4 (jump scene), F (fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        restartMotion();
      } else if (e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        jumpToScene(parseInt(e.key, 10) - 1);
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jumpToScene, restartMotion, toggleFullscreen]);

  // Determine current scene index
  let activeIdx = 0;
  if (elapsedSeconds >= SCENE_TIMES[3]) {
    activeIdx = 3;
  } else if (elapsedSeconds >= SCENE_TIMES[2]) {
    activeIdx = 2;
  } else if (elapsedSeconds >= SCENE_TIMES[1]) {
    activeIdx = 1;
  } else {
    activeIdx = 0;
  }

  const progressPct = Math.min(100, (elapsedSeconds / TOTAL_DURATION) * 100);

  // Scene 1 (0s - 7.5s): Alternates "Gemini" / "Workspace"
  let s1GeminiState = 'state-visible';
  let s1WorkspaceState = 'state-below';
  if (activeIdx === 0) {
    if (elapsedSeconds < 1.8) {
      s1GeminiState = 'state-visible';
      s1WorkspaceState = 'state-below';
    } else if (elapsedSeconds >= 1.8 && elapsedSeconds < 3.6) {
      s1WorkspaceState = 'state-visible';
      s1GeminiState = 'state-above';
    } else if (elapsedSeconds >= 3.6 && elapsedSeconds < 5.4) {
      s1GeminiState = 'state-visible';
      s1WorkspaceState = 'state-below';
    } else {
      s1WorkspaceState = 'state-visible';
      s1GeminiState = 'state-above';
    }
  }


  const formatTime = (sec: number) => {
    const s = Math.floor(sec);
    const ms = Math.floor((sec % 1) * 10);
    return `${s < 10 ? '0' : ''}${s}.${ms}s`;
  };

  // The 7 Google Workspace Apps for Momento 3
  // Elegant circular badges matching the circular aesthetic of Momento 2
  const workspaceApps: AppItem[] = [
    {
      id: 'gmail',
      name: 'Gmail',
      color: '#EA4335',
      delayTime: 0.2,
      icon: (
        <svg width="84" height="84" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="36" stroke="#202124" strokeWidth="2.2" fill="#FFFFFF" />
          <rect x="23" y="27" width="34" height="24" rx="3" stroke="#202124" strokeWidth="2" fill="none" />
          <path d="M24 28L40 40L56 28" stroke="#EA4335" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 'drive',
      name: 'Drive',
      color: '#4285F4',
      delayTime: 0.6,
      icon: (
        <svg width="84" height="84" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="36" stroke="#202124" strokeWidth="2.2" fill="#FFFFFF" />
          <polygon points="40,22 58,52 22,52" stroke="#202124" strokeWidth="2" strokeLinejoin="round" fill="none" />
          <line x1="28" y1="42" x2="52" y2="42" stroke="#4285F4" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'docs',
      name: 'Docs',
      color: '#4285F4',
      delayTime: 1.0,
      icon: (
        <svg width="84" height="84" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="36" stroke="#202124" strokeWidth="2.2" fill="#FFFFFF" />
          <rect x="26" y="22" width="28" height="34" rx="3" stroke="#202124" strokeWidth="2" fill="none" />
          <path d="M46 22V29H54" stroke="#202124" strokeWidth="1.8" fill="none" />
          <line x1="31" y1="35" x2="49" y2="35" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
          <line x1="31" y1="41" x2="49" y2="41" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
          <line x1="31" y1="47" x2="41" y2="47" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'sheets',
      name: 'Sheets',
      color: '#34A853',
      delayTime: 1.4,
      icon: (
        <svg width="84" height="84" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="36" stroke="#202124" strokeWidth="2.2" fill="#FFFFFF" />
          <rect x="25" y="24" width="30" height="32" rx="3" stroke="#202124" strokeWidth="2" fill="none" />
          <line x1="25" y1="35" x2="55" y2="35" stroke="#202124" strokeWidth="1.8" />
          <line x1="25" y1="45" x2="55" y2="45" stroke="#202124" strokeWidth="1.8" />
          <line x1="40" y1="24" x2="40" y2="56" stroke="#202124" strokeWidth="1.8" />
          <rect x="28" y="27" width="9" height="5" rx="1" fill="#34A853" />
        </svg>
      ),
    },
    {
      id: 'slides',
      name: 'Slides',
      color: '#FBBC05',
      delayTime: 1.8,
      icon: (
        <svg width="84" height="84" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="36" stroke="#202124" strokeWidth="2.2" fill="#FFFFFF" />
          <rect x="24" y="25" width="32" height="23" rx="3" stroke="#202124" strokeWidth="2" fill="none" />
          <line x1="40" y1="48" x2="40" y2="54" stroke="#202124" strokeWidth="2" />
          <line x1="32" y1="54" x2="48" y2="54" stroke="#202124" strokeWidth="2" strokeLinecap="round" />
          <rect x="29" y="30" width="13" height="9" rx="1.5" fill="#FBBC05" />
        </svg>
      ),
    },
    {
      id: 'calendar',
      name: 'Calendar',
      color: '#4285F4',
      delayTime: 2.2,
      icon: (
        <svg width="84" height="84" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="36" stroke="#202124" strokeWidth="2.2" fill="#FFFFFF" />
          <rect x="25" y="25" width="30" height="29" rx="3" stroke="#202124" strokeWidth="2" fill="none" />
          <line x1="25" y1="34" x2="55" y2="34" stroke="#202124" strokeWidth="2" />
          <line x1="32" y1="21" x2="32" y2="26" stroke="#202124" strokeWidth="2" strokeLinecap="round" />
          <line x1="48" y1="21" x2="48" y2="26" stroke="#202124" strokeWidth="2" strokeLinecap="round" />
          <text x="40" y="47" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="12" fontWeight="800" fill="#4285F4">
            31
          </text>
        </svg>
      ),
    },
    {
      id: 'meet',
      name: 'Meet',
      color: '#34A853',
      delayTime: 2.6,
      icon: (
        <svg width="84" height="84" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="36" stroke="#202124" strokeWidth="2.2" fill="#FFFFFF" />
          {/* Clean Google Meet Camera matching the aesthetic */}
          <rect x="22" y="28" width="23" height="24" rx="3.5" stroke="#202124" strokeWidth="2" fill="none" />
          <path d="M46 34L58 26V54L46 46Z" fill="#34A853" stroke="#34A853" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="33.5" cy="40" r="4.5" fill="#34A853" />
        </svg>
      ),
    },
  ];

  return (
    <div
      ref={containerRef}
      id="viewport"
      onClick={restartMotion}
      title="Clique na tela para reiniciar o motion de 30s | Pressione F para tela cheia"
      className="relative select-none cursor-pointer"
    >
      {/* Fixed 1280x720 (16:9) Virtual Stage */}
      <div
        id="stage"
        style={{
          transform: `scale(${stageScale})`,
        }}
      >
        {/* 3px Top Progress Bar with the 4 Google Colors - directly locked to 16:9 Stage */}
        <div id="top-progress" style={{ width: `${progressPct}%` }} />

        {/* ===================================================================
             MOMENTO 1 (0s a 7.5s)
             - "Embaixadores Estudantis do Google" perfeitamente alinhado a "Google Workspace"
             - Enquadramento 16:9 limpo e equilibrado
        ==================================================================== */}
        <section id="scene-1" className={`scene ${activeIdx === 0 ? 'active' : ''}`}>
          <div
            style={{
              width: 1280,
              height: 720,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            {/* Bloco editorial com Embaixadores perfeitamente alinhado com Google Workspace */}
            <div
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: 720,
              }}
            >
              {/* Embaixadores Estudantis do Google (Alinhado à esquerda com o G de Google Workspace) */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 20,
                  transform: 'translateX(3.5px)', // Alinhamento ótico perfeito com a curva do G em Google
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: '0.01em', color: '#3C4043' }}>
                  Embaixadores Estudantis do Google
                </span>
              </div>

              {/* Stabilized "Google" + Rotating "Gemini" / "Workspace" */}
              <div
                className="font-display"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 82,
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  height: 96,
                }}
              >
                <GoogleWord style={{ flexShrink: 0, marginRight: 22 }} />

                {/* Sized Rotator Container with constant fixed width */}
                <div
                  className="word-rotator"
                  style={{
                    width: 440,
                    height: 96,
                    textAlign: 'left',
                  }}
                >
                  <span id="s1-word-gemini" className={`rotator-word gemini-gradient ${s1GeminiState}`}>
                    Gemini
                  </span>
                  <span id="s1-word-workspace" className={`rotator-word ${s1WorkspaceState}`} style={{ color: WORKSPACE_COLOR }}>
                    Workspace
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
             MOMENTO 2 (7.5s a 14.0s) — Ecossistema Integrado
        ==================================================================== */}
        <section id="scene-2" className={`scene ${activeIdx === 1 ? 'active' : ''}`}>
          {/* Top-Left Title with Thin Black Line & Yellow Rectangular Highlight */}
          <div style={{ position: 'absolute', left: 100, top: 78 }}>
            <div style={{ width: 64, height: 2.5, backgroundColor: '#202124', marginBottom: 14 }} />
            <h2
              className="font-display"
              style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.16, letterSpacing: '-0.02em', color: '#202124' }}
            >
              ECOSSISTEMA<br />
              <span className="yellow-bar">INTEGRADO</span>
            </h2>
          </div>

          {/* Symmetrical 3-Column Grid */}
          <div
            style={{
              position: 'absolute',
              left: 100,
              right: 100,
              top: 275,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 60,
            }}
          >
            {/* Column 1: Gmail */}
            <div className="stagger-item delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <svg width="104" height="104" viewBox="0 0 104 104" fill="none" style={{ marginBottom: 28 }}>
                <circle cx="52" cy="52" r="46" stroke="#202124" strokeWidth="2.5" className="draw-stroke"/>
                <rect x="29" y="36" width="46" height="32" rx="4" stroke="#202124" strokeWidth="2.5" className="draw-stroke"/>
                <path d="M30 38L52 54L74 38" stroke="#EA4335" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="draw-stroke"/>
              </svg>
              <div style={{ width: 48, height: 2, backgroundColor: '#202124', marginBottom: 18 }} />
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: '#202124', marginBottom: 10 }}>
                Gmail
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: '#5F6368', maxWidth: 260 }}>
                Consulte e-mails importantes e prazos sem sair do chat
              </p>
            </div>

            {/* Column 2: Google Drive */}
            <div className="stagger-item delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <svg width="104" height="104" viewBox="0 0 104 104" fill="none" style={{ marginBottom: 28 }}>
                <circle cx="52" cy="52" r="46" stroke="#202124" strokeWidth="2.5" className="draw-stroke"/>
                <polygon points="52,30 74,66 30,66" stroke="#202124" strokeWidth="2.5" strokeLinejoin="round" className="draw-stroke"/>
                <line x1="38" y1="54" x2="66" y2="54" stroke="#4285F4" strokeWidth="3" strokeLinecap="round" className="draw-stroke"/>
              </svg>
              <div style={{ width: 48, height: 2, backgroundColor: '#202124', marginBottom: 18 }} />
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: '#202124', marginBottom: 10 }}>
                Google Drive
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: '#5F6368', maxWidth: 260 }}>
                Localize resumos, artigos e materiais das suas aulas
              </p>
            </div>

            {/* Column 3: Google Calendar */}
            <div className="stagger-item delay-3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <svg width="104" height="104" viewBox="0 0 104 104" fill="none" style={{ marginBottom: 28 }}>
                <circle cx="52" cy="52" r="46" stroke="#202124" strokeWidth="2.5" className="draw-stroke"/>
                <rect x="33" y="34" width="38" height="36" rx="4" stroke="#202124" strokeWidth="2.5" className="draw-stroke"/>
                <line x1="33" y1="45" x2="71" y2="45" stroke="#202124" strokeWidth="2.5" className="draw-stroke"/>
                <line x1="43" y1="29" x2="43" y2="36" stroke="#202124" strokeWidth="2.5" strokeLinecap="round" className="draw-stroke"/>
                <line x1="61" y1="29" x2="61" y2="36" stroke="#202124" strokeWidth="2.5" strokeLinecap="round" className="draw-stroke"/>
                <rect x="46" y="52" width="12" height="10" rx="2" fill="#34A853"/>
              </svg>
              <div style={{ width: 48, height: 2, backgroundColor: '#202124', marginBottom: 18 }} />
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: '#202124', marginBottom: 10 }}>
                Google Calendar
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: '#5F6368', maxWidth: 260 }}>
                Organize sessões de estudo e eventos automaticamente
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================================
             MOMENTO 3 (14.0s a 22.0s) — Logos dos Apps surgindo gradativamente
             com círculos ao redor (estilo Momento 2)
        ==================================================================== */}
        <section
          id="scene-3"
          className={`scene workspace-grid ${activeIdx === 2 ? 'active' : ''}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          {/* Main Title: Google Workspace */}
          <h2
            className="font-display stagger-item delay-1"
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              marginBottom: 52,
              lineHeight: 1.1,
              display: 'inline-flex',
              alignItems: 'baseline',
              justifyContent: 'center',
            }}
          >
            <GoogleWord style={{ marginRight: 18 }} />
            <span style={{ color: WORKSPACE_COLOR }}>Workspace</span>
          </h2>

          {/* Row of 7 App Cards with Circle Enclosures */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 34,
              marginBottom: 56,
            }}
          >
            {workspaceApps.map((app) => {
              const scene3Elapsed = elapsedSeconds - SCENE_TIMES[2];
              const isVisible = activeIdx === 2 && scene3Elapsed >= app.delayTime;

              return (
                <div
                  key={app.id}
                  className={`app-card-pop ${isVisible ? 'visible' : ''}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {/* Circular icon container like Momento 2 with smooth shadow */}
                  <div
                    style={{
                      width: 92,
                      height: 92,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 8px 20px -3px rgba(0, 0, 0, 0.07)',
                    }}
                  >
                    {app.icon}
                  </div>

                  {/* Colored Pill Dash */}
                  <div
                    style={{
                      width: 26,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: app.color,
                      marginTop: 18,
                      marginBottom: 10,
                    }}
                  />

                  {/* App Name Label */}
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#202124',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {app.name}
                  </span>
                </div>
              );
            })}
          </div>

        </section>

        {/* ===================================================================
             MOMENTO 4 (22.0s a 30.0s) — Google Workspace Encerramento (Padrão Google)
        ==================================================================== */}
        <section id="scene-4" className={`scene ${activeIdx === 3 ? 'active' : ''}`}>
          {/* Strictly aligned, balanced Google Workspace corner accents */}
          <svg
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 1280,
              height: 720,
              pointerEvents: 'none',
              zIndex: 1,
            }}
            viewBox="0 0 1280 720"
            fill="none"
          >
            {/* Bottom-Left Composition: Disciplined, aligned Google Workspace capsules + circle */}
            <g className="ribbon-left">
              {/* Green bar along bottom */}
              <rect x="-16" y="646" width="300" height="44" rx="22" fill="#34A853" />
              {/* Yellow bar in middle */}
              <rect x="-16" y="590" width="230" height="44" rx="22" fill="#FBBC05" />
              {/* Blue bar on top */}
              <rect x="-16" y="534" width="160" height="44" rx="22" fill="#4285F4" />
              {/* Red accent circle, perfectly aligned with the Blue bar centerline */}
              <circle cx="182" cy="556" r="22" fill="#EA4335" />
            </g>

            {/* Top-Right Composition: Perfectly mirrored aligned Google Workspace capsules + circle */}
            <g className="ribbon-right">
              {/* Blue bar on top */}
              <rect x="996" y="30" width="300" height="44" rx="22" fill="#4285F4" />
              {/* Yellow bar in middle */}
              <rect x="1066" y="86" width="230" height="44" rx="22" fill="#FBBC05" />
              {/* Green bar at bottom of group */}
              <rect x="1136" y="142" width="160" height="44" rx="22" fill="#34A853" />
              {/* Red accent circle, perfectly aligned with Green bar centerline */}
              <circle cx="1098" cy="164" r="22" fill="#EA4335" />
            </g>
          </svg>

          {/* Central Google Workspace + Search Bar Lockup (Static & Centered) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 1280,
              height: 720,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              zIndex: 10,
            }}
          >
            {/* Top Signature: "Embaixadores Estudantis do Google" with Google "G" Logo */}
            <div
              className="stagger-item delay-1"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 24,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: '0.01em', color: '#5F6368' }}>
                Embaixadores Estudantis do Google
              </span>
            </div>

            {/* Central Headline: Fixed, Stable "Google Workspace" */}
            <div
              className="font-display stagger-item delay-2"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 82,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                marginBottom: 36,
              }}
            >
              <GoogleWord style={{ flexShrink: 0, marginRight: 22 }} />
              <span style={{ color: WORKSPACE_COLOR }}>Workspace</span>
            </div>

            {/* Google Search Bar: "Conectado com Gemini" */}
            <div className="stagger-item delay-3">
              <GoogleSearchBar />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

