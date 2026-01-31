'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Target, ArrowRight, Sparkles, TrendingUp, Calendar, CheckCircle2, Flame, Heart } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

const HeroScene = dynamic(() => import('@/components/landing/HeroScene').then((mod) => mod.HeroScene), {
  ssr: false,
  loading: () => null,
})

export default function Home() {
  return (
    <main className="min-h-screen bg-bg relative" style={{ overflowX: 'clip' }}>
      {/* Warm background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 120% 60% at 50% 0%, var(--accent-glow) 0%, transparent 60%)',
          opacity: 0.4,
        }}
      />

      {/* Nav */}
      <nav className="relative z-20 max-w-5xl mx-auto px-5 sm:px-8 flex items-center justify-between h-20 stagger-1">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--ember) 100%)',
              boxShadow: '0 2px 8px var(--accent-glow)',
            }}
          >
            <Target size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-semibold text-xl text-txt" style={{ fontStyle: 'italic' }}>
            MyGoals
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/auth/login"
            className="hidden sm:inline-flex text-sm font-medium text-txt-secondary hover:text-txt transition-colors duration-300"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--ember) 100%)',
              color: '#FFFFFF',
              boxShadow: '0 2px 12px var(--accent-glow)',
            }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 pt-12 sm:pt-20 pb-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div className="text-left relative z-10">
            {/* Warm badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 stagger-2"
              style={{
                background: 'var(--accent-light)',
                border: '1px solid var(--accent-subtle)',
              }}
            >
              <Flame size={14} style={{ color: 'var(--accent)' }} />
              <span className="text-xs font-semibold tracking-wide" style={{ color: 'var(--accent)' }}>
                Your cozy corner for growth
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] text-txt leading-[1.12] mb-6 stagger-3" style={{ fontWeight: 600 }}>
              Goals feel better
              <br />
              when they feel{' '}
              <span
                className="relative inline-block"
                style={{
                  color: 'var(--accent)',
                  fontStyle: 'italic',
                }}
              >
                like home
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                  style={{ opacity: 0.3 }}
                >
                  <path
                    d="M2 6 C40 2, 80 2, 100 4 C120 6, 160 4, 198 2"
                    stroke="var(--accent)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-txt-secondary max-w-md mb-10 leading-relaxed stagger-4">
              A warm, thoughtful space to set intentions, track your progress with AI-powered milestones, and celebrate every step forward.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 stagger-5">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center gap-2.5 text-white text-base font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
                  boxShadow: '0 4px 20px var(--accent-glow), 0 1px 3px rgba(0,0,0,0.08)',
                }}
              >
                Begin your journey
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 text-base font-medium px-8 py-4 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
              >
                Welcome back
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 mt-10 stagger-6">
              <div className="flex -space-x-2">
                {['var(--sage)', 'var(--lavender)', 'var(--rose)', 'var(--accent)'].map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-white text-xs font-bold"
                    style={{
                      background: color,
                      borderColor: 'var(--bg)',
                    }}
                  >
                    {['J', 'S', 'M', 'A'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="var(--accent)" stroke="none">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-txt-muted mt-0.5">
                  Loved by 2,400+ goal-setters
                </p>
              </div>
            </div>
          </div>

          {/* Right — Ambient Scene + Preview Card */}
          <div className="relative h-[420px] lg:h-[520px] overflow-visible">
            <HeroScene />

            {/* Floating goal card preview */}
            <div
              className="absolute glass rounded-card shadow-card-hover stagger-6"
              style={{
                top: '15%',
                left: '10%',
                right: '10%',
                padding: '24px',
                border: '1px solid var(--border)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-medium text-txt-muted mb-1 uppercase tracking-wider">Current Goal</p>
                  <h3 className="font-display text-lg text-txt" style={{ fontWeight: 600 }}>Run a half marathon</h3>
                </div>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--sage-light)' }}
                >
                  <Heart size={16} style={{ color: 'var(--sage)' }} />
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-txt-secondary font-medium">Progress</span>
                  <span className="font-semibold" style={{ color: 'var(--sage)' }}>68%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border-light)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: '68%',
                      background: 'linear-gradient(90deg, var(--sage) 0%, #A3C49F 100%)',
                      transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </div>
              </div>

              {/* Milestones mini list */}
              <div className="space-y-2.5">
                {[
                  { text: 'Run 5K without stopping', done: true },
                  { text: 'Complete 10K race', done: true },
                  { text: 'Build to 15K distance', done: false },
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle2
                      size={16}
                      style={{
                        color: m.done ? 'var(--sage)' : 'var(--border)',
                      }}
                      fill={m.done ? 'var(--sage-light)' : 'none'}
                    />
                    <span
                      className="text-sm"
                      style={{
                        color: m.done ? 'var(--text-muted)' : 'var(--text)',
                        textDecoration: m.done ? 'line-through' : 'none',
                      }}
                    >
                      {m.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Small floating AI insight card */}
            <div
              className="absolute glass rounded-2xl shadow-card stagger-7"
              style={{
                bottom: '12%',
                right: '5%',
                padding: '14px 18px',
                border: '1px solid var(--border)',
                maxWidth: 220,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={13} style={{ color: 'var(--lavender)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--lavender)' }}>AI Coach</span>
              </div>
              <p className="text-xs text-txt-secondary leading-relaxed">
                &ldquo;Great consistency this week! Your pace improved 12% since last month.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 pb-28">
        {/* Section header */}
        <div className="text-center mb-14 stagger-6">
          <p className="text-sm font-semibold tracking-wider uppercase mb-3" style={{ color: 'var(--accent)' }}>
            How it works
          </p>
          <h2 className="font-display text-2xl sm:text-3xl text-txt" style={{ fontWeight: 600 }}>
            Three steps to meaningful progress
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto stagger-7">
          <FeatureCard
            icon={<Target size={22} style={{ color: 'var(--accent)' }} />}
            iconBg="var(--accent-light)"
            step="01"
            title="Set an intention"
            desc="Define your goal and let AI break it into smart, monthly milestones you can actually follow."
          />
          <FeatureCard
            icon={<TrendingUp size={22} style={{ color: 'var(--sage)' }} />}
            iconBg="var(--sage-light)"
            step="02"
            title="Track your rhythm"
            desc="Visual progress tracking that celebrates consistency, not perfection. See your momentum build."
          />
          <FeatureCard
            icon={<Calendar size={22} style={{ color: 'var(--lavender)' }} />}
            iconBg="var(--lavender-light)"
            step="03"
            title="Reflect & grow"
            desc="Weekly check-ins with personalized AI coaching that adapts to your mood and progress."
          />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 pb-20">
        <div
          className="rounded-card p-10 sm:p-14 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, var(--accent-light) 0%, var(--surface-raised) 50%, var(--lavender-light) 100%)',
            border: '1px solid var(--border-light)',
          }}
        >
          <h2 className="font-display text-2xl sm:text-3xl text-txt mb-4 relative z-10" style={{ fontWeight: 600 }}>
            Ready to start something<br className="hidden sm:block" /> meaningful?
          </h2>
          <p className="text-txt-secondary text-base mb-8 max-w-md mx-auto relative z-10">
            Join thousands who&apos;ve turned vague ambitions into completed goals, one cozy check-in at a time.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2.5 text-white text-base font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 relative z-10"
            style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
              boxShadow: '0 4px 20px var(--accent-glow), 0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            Get started free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 pb-10">
        <div className="h-px mb-8" style={{ background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Target size={14} style={{ color: 'var(--accent)' }} />
            <span className="text-sm text-txt-muted">MyGoals AI</span>
          </div>
          <p className="text-xs text-txt-muted">
            Built for people who finish what they start.
          </p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({
  icon,
  iconBg,
  step,
  title,
  desc,
}: {
  icon: React.ReactNode
  iconBg: string
  step: string
  title: string
  desc: string
}) {
  return (
    <div
      className="rounded-card p-7 transition-all duration-400 hover:-translate-y-1 group"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center transition-shadow duration-300 group-hover:shadow-glow"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
        <span className="text-xs font-bold text-txt-muted tracking-widest uppercase">{step}</span>
      </div>
      <h3 className="font-display text-base text-txt mb-2" style={{ fontWeight: 600 }}>{title}</h3>
      <p className="text-sm text-txt-secondary leading-relaxed">{desc}</p>
    </div>
  )
}
