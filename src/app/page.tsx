import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-text mb-4">
          2026 Goals Tracker
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Set ambitious goals. Get AI-powered milestones. Achieve more.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/5 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  )
}
