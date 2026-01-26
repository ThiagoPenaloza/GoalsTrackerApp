import Link from 'next/link'
import { Inbox, ArrowRight } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-accent-light flex items-center justify-center mb-5">
        <Inbox size={24} className="text-accent" />
      </div>
      <h3 className="font-display font-bold text-lg text-txt mb-1">{title}</h3>
      <p className="text-txt-secondary text-sm max-w-sm mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-colors"
        >
          {actionLabel}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  )
}
