import Link from 'next/link'
import { Target, ArrowRight, Sparkles, TrendingUp, Calendar } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function Home() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 stagger-1">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
            <Target size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg text-txt tracking-tight">Mindful Goals</span>
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

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-light border border-accent/10 rounded-full mb-8 stagger-2">
            <Sparkles size={14} className="text-accent" />
            <span className="text-xs font-semibold text-accent tracking-wide">AI-Powered Goal Tracking</span>
          </div>

          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-txt tracking-display leading-[1.08] mb-6 stagger-3">
            Set goals.
            <br />
            <span className="text-accent">Crush them.</span>
          </h1>

          <p className="text-lg text-txt-secondary max-w-xl mx-auto mb-10 leading-relaxed stagger-4">
            Track progress with AI-generated milestones, weekly check-ins, and personalized coaching. Built for people who finish what they start.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center stagger-5">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 bg-accent text-white text-base font-semibold px-7 py-3.5 rounded-xl hover:bg-orange-600 transition-colors shadow-sm hover:shadow-glow"
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

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto mt-24">
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
    <div className="bg-surface border border-line rounded-card p-6 shadow-card">
      <div className="w-11 h-11 rounded-xl bg-accent-light flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-display font-bold text-base text-txt tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-txt-secondary leading-relaxed">{desc}</p>
    </div>
  )
}
