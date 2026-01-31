'use client'

import { useEffect, useState } from 'react'

export function HeroScene() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0">
      {/* Large warm ambient glow — the "hearth" */}
      <div
        className="absolute"
        style={{
          top: '42%',
          left: '48%',
          transform: 'translate(-50%, -50%)',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
          animation: 'breathe 6s ease-in-out infinite',
        }}
      />

      {/* Soft bokeh dots */}
      {[
        { top: '18%', left: '15%', size: 8, delay: 0, dur: 7 },
        { top: '28%', left: '72%', size: 6, delay: 1.2, dur: 8 },
        { top: '55%', left: '80%', size: 10, delay: 0.4, dur: 9 },
        { top: '70%', left: '22%', size: 7, delay: 2.1, dur: 7.5 },
        { top: '38%', left: '35%', size: 5, delay: 0.8, dur: 8.5 },
        { top: '62%', left: '58%', size: 9, delay: 1.6, dur: 6.5 },
        { top: '22%', left: '52%', size: 4, delay: 3, dur: 9 },
        { top: '78%', left: '65%', size: 6, delay: 0.2, dur: 7 },
        { top: '45%', left: '88%', size: 5, delay: 2.4, dur: 8 },
        { top: '82%', left: '40%', size: 7, delay: 1, dur: 6 },
      ].map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            background: `var(--accent)`,
            opacity: 0.15 + (i % 3) * 0.08,
            animation: `drift ${dot.dur}s ease-in-out infinite ${dot.delay}s, glow-pulse ${dot.dur * 0.8}s ease-in-out infinite ${dot.delay}s`,
          }}
        />
      ))}

      {/* Organic curved shape 1 — soft arc */}
      <svg
        className="absolute"
        style={{
          top: '25%',
          left: '20%',
          width: 200,
          height: 200,
          opacity: 0.08,
          animation: 'warm-float 10s ease-in-out infinite',
        }}
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M30 100 C30 50, 80 20, 120 40 C160 60, 180 100, 160 140 C140 180, 80 190, 50 160 C20 130, 30 100, 30 100Z"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Organic curved shape 2 */}
      <svg
        className="absolute"
        style={{
          top: '40%',
          right: '15%',
          width: 160,
          height: 160,
          opacity: 0.06,
          animation: 'warm-float 12s ease-in-out infinite 2s',
        }}
        viewBox="0 0 160 160"
        fill="none"
      >
        <path
          d="M80 10 C120 10, 150 40, 150 80 C150 120, 120 150, 80 150 C40 150, 10 120, 10 80 C10 40, 40 10, 80 10Z"
          stroke="var(--sage)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="4 6"
        />
      </svg>

      {/* Central decorative element — soft target/goal rings */}
      <div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Outer ring */}
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: '50%',
            border: '1.5px solid var(--accent)',
            opacity: 0.1,
            animation: 'breathe 8s ease-in-out infinite 1s',
          }}
        />
        {/* Middle ring */}
        <div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 120,
            height: 120,
            borderRadius: '50%',
            border: '1px solid var(--accent)',
            opacity: 0.15,
            animation: 'breathe 7s ease-in-out infinite 0.5s',
          }}
        />
        {/* Inner warm dot */}
        <div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
            opacity: 0.2,
            animation: 'breathe 5s ease-in-out infinite',
          }}
        />
      </div>

      {/* Warm gradient streak */}
      <div
        className="absolute"
        style={{
          top: '30%',
          left: '10%',
          width: '80%',
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, var(--accent) 30%, var(--accent) 70%, transparent 100%)',
          opacity: 0.06,
          animation: 'breathe 10s ease-in-out infinite 3s',
        }}
      />
      <div
        className="absolute"
        style={{
          top: '65%',
          left: '5%',
          width: '90%',
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, var(--sage) 40%, var(--sage) 60%, transparent 100%)',
          opacity: 0.04,
          animation: 'breathe 12s ease-in-out infinite 1s',
        }}
      />
    </div>
  )
}
