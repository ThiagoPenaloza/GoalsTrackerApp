'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Target, ArrowRight, Sparkles, TrendingUp, Calendar, Zap } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

// Lazy load the 3D scene to prevent blocking
const HeroScene = dynamic(() => import('@/components/landing/HeroScene').then((mod) => mod.HeroScene), {
  ssr: false,
  loading: () => null,
})

export default function Home() {
  return (
    <main className="min-h-screen bg-bg overflow-hidden">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 stagger-1">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
            <Target size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg text-txt tracking-tight">MyGoals AI</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/auth/login" className="text-sm font-medium text-txt-secondary hover:text-txt transition-colors">
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="bg-accent text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section with 3D */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="text-left relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-light border border-accent/10 rounded-full mb-8 stagger-2">
              <Zap size={14} className="text-accent" />
              <span className="text-xs font-semibold text-accent tracking-wide">AI-Powered Goal Tracking</span>
            </div>

            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-6xl text-txt tracking-display leading-[1.08] mb-6 stagger-3">
              Set goals.
              <br />
              <span className="text-accent">Crush them.</span>
            </h1>

            <p className="text-lg text-txt-secondary max-w-md mb-10 leading-relaxed stagger-4">
              Track progress with AI-generated milestones, weekly check-ins, and personalized coaching. Built for people who finish what they start.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 stagger-5">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center gap-2 bg-accent text-white text-base font-semibold px-7 py-3.5 rounded-xl hover:bg-orange-600 transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
              >
                Start for Free
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 bg-surface border border-line text-txt text-base font-semibold px-7 py-3.5 rounded-xl hover:border-accent/30 hover:text-accent transition-colors"
              >
                I have an account
              </Link>
            </div>
          </div>

          {/* Right - 3D Scene */}
          <div className="relative h-[400px] lg:h-[500px]">
            <HeroScene />
            {/* Fallback gradient orb for when 3D is loading */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none lg:pointer-events-auto">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-accent/20 via-orange-300/10 to-transparent blur-3xl" />
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto mt-20">
          <FeatureCard
            icon={<Target size={22} className="text-accent" />}
            title="Smart Goals"
            desc="Set goals and get AI-generated monthly milestones that break your ambitions into achievable steps."
          />
          <FeatureCard
            icon={<TrendingUp size={22} className="text-accent" />}
            title="Track Progress"
            desc="Visual progress tracking with milestone completion rates and weekly momentum indicators."
          />
          <FeatureCard
            icon={<Calendar size={22} className="text-accent" />}
            title="Weekly Check-ins"
            desc="Reflect on your progress each week and receive personalized AI coaching feedback."
          />
        </div>
      </div>

      {/* Footer accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </main>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-accent/20 transition-all duration-300 hover:-translate-y-1">
      <div className="w-11 h-11 rounded-xl bg-accent-light flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-display font-bold text-base text-txt tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-txt-secondary leading-relaxed">{desc}</p>
    </div>
  )
}
