import { Target } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/Button'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-primary/10 rounded-full p-4 mb-4">
        <Target className="w-12 h-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-text mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  )
}
