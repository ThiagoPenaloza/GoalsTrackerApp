'use client'

import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      className="theme-toggle focus-ring"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Track background */}
      <span className="tt-track" data-dark={isDark ? '' : undefined} />

      {/* Stars layer (dark mode) */}
      <span className="tt-stars" data-dark={isDark ? '' : undefined}>
        <span className="tt-star tt-star-1" />
        <span className="tt-star tt-star-2" />
        <span className="tt-star tt-star-3" />
      </span>

      {/* Cloud wisps (light mode) */}
      <span className="tt-clouds" data-dark={isDark ? '' : undefined}>
        <span className="tt-cloud tt-cloud-1" />
        <span className="tt-cloud tt-cloud-2" />
      </span>

      {/* Sliding knob */}
      <span className="tt-knob" data-dark={isDark ? '' : undefined}>
        {/* Sun */}
        <span className="tt-sun" data-dark={isDark ? '' : undefined}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            {/* accent #D4845A */}
            <circle cx="12" cy="12" r="5" fill="#D4845A" />
            <g stroke="#D4845A" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="1" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
              <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
              <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
            </g>
          </svg>
        </span>

        {/* Moon — ember #E8956A */}
        <span className="tt-moon" data-dark={isDark ? '' : undefined}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#E8956A">
            <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        </span>

        {/* Glow ring */}
        <span className="tt-glow" data-dark={isDark ? '' : undefined} />
      </span>

      <style jsx>{`
        /* ── Base ─────────────────────────────────── */
        .theme-toggle {
          position: relative;
          width: 60px;
          height: 32px;
          border-radius: 9999px;
          border: none;
          padding: 0;
          cursor: pointer;
          overflow: hidden;
          flex-shrink: 0;
          view-transition-name: theme-toggle;
        }

        /* ── Track ────────────────────────────────── */
        /* Light: warm cream → accent-subtle gradient (from palette) */
        .tt-track {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: linear-gradient(135deg, #FAEEE6 0%, #F0D9C8 50%, #F5EDE3 100%);
          transition: opacity 0.4s ease;
        }
        /* Dark: bg → surface-raised → bg-warm gradient (from palette) */
        .tt-track[data-dark] {
          background: linear-gradient(135deg, #1A1614 0%, #2E2923 50%, #211D1A 100%);
        }

        /* ── Stars ────────────────────────────────── */
        .tt-stars {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.3s ease 0.15s;
          pointer-events: none;
        }
        .tt-stars[data-dark] {
          opacity: 1;
        }

        .tt-star {
          position: absolute;
          width: 2.5px;
          height: 2.5px;
          border-radius: 50%;
          background: #F2EDE8; /* --text (dark mode) */
        }
        .tt-star-1 {
          top: 7px; left: 10px;
          opacity: 0.9;
          animation: twinkle 2s ease-in-out infinite;
        }
        .tt-star-2 {
          top: 17px; left: 16px;
          opacity: 0.5;
          animation: twinkle 2.5s ease-in-out infinite 0.7s;
        }
        .tt-star-3 {
          top: 10px; left: 22px;
          opacity: 0.7;
          animation: twinkle 3s ease-in-out infinite 1.2s;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }

        /* ── Clouds ───────────────────────────────── */
        .tt-clouds {
          position: absolute;
          inset: 0;
          opacity: 1;
          transition: opacity 0.25s ease;
          pointer-events: none;
        }
        .tt-clouds[data-dark] {
          opacity: 0;
        }

        .tt-cloud {
          position: absolute;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.6); /* --surface with alpha */
        }
        .tt-cloud-1 {
          width: 14px; height: 5px;
          top: 19px; left: 8px;
          animation: cloud-drift 4s ease-in-out infinite;
        }
        .tt-cloud-2 {
          width: 10px; height: 4px;
          top: 9px; left: 18px;
          animation: cloud-drift 5s ease-in-out infinite 1s;
        }

        @keyframes cloud-drift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }

        /* ── Knob ─────────────────────────────────── */
        .tt-knob {
          position: absolute;
          width: 24px;
          height: 24px;
          top: 4px;
          left: 4px;
          border-radius: 50%;
          background: #FFFFFF; /* --surface */
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateX(0px) translateZ(0);
          transition: transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1);
          will-change: transform;
          z-index: 2;
        }
        .tt-knob[data-dark] {
          transform: translateX(28px) translateZ(0);
          background: #F2EDE8; /* --text (dark) / --toggle-knob */
        }

        /* ── Glow ring — ember glow from palette ── */
        .tt-glow {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .tt-glow[data-dark] {
          box-shadow: 0 0 10px 2px rgba(232, 149, 106, 0.45); /* --ember-glow */
          opacity: 1;
        }

        /* ── Sun icon ─────────────────────────────── */
        .tt-sun {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 1;
          transform: rotate(0deg) scale(1) translateZ(0);
          transition:
            opacity 0.2s ease,
            transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1);
          will-change: transform, opacity;
        }
        .tt-sun[data-dark] {
          opacity: 0;
          transform: rotate(-75deg) scale(0.4) translateZ(0);
        }

        /* ── Moon icon ────────────────────────────── */
        .tt-moon {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: rotate(60deg) scale(0.4) translateZ(0);
          transition:
            opacity 0.2s ease 0.1s,
            transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1) 0.05s;
          will-change: transform, opacity;
        }
        .tt-moon[data-dark] {
          opacity: 1;
          transform: rotate(0deg) scale(1) translateZ(0);
        }

        /* ── Reduced motion ───────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .tt-knob,
          .tt-sun,
          .tt-moon,
          .tt-track,
          .tt-stars,
          .tt-clouds,
          .tt-glow {
            transition-duration: 0.01ms !important;
          }
          .tt-star-1, .tt-star-2, .tt-star-3,
          .tt-cloud-1, .tt-cloud-2 {
            animation: none !important;
          }
        }
      `}</style>
    </button>
  )
}
