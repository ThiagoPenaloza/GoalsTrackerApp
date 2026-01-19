import { cn } from '@/lib/utils'

interface ProgressRingProps {
  progress: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showPercentage?: boolean
}

export function ProgressRing({
  progress,
  size = 'md',
  className,
  showPercentage = true,
}: ProgressRingProps) {
  const sizes = {
    sm: { container: 80, stroke: 6, fontSize: 'text-sm' },
    md: { container: 120, stroke: 8, fontSize: 'text-xl' },
    lg: { container: 160, stroke: 10, fontSize: 'text-3xl' },
  }

  const { container, stroke, fontSize } = sizes[size]
  const radius = (container - stroke) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={container} height={container} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={container / 2}
          cy={container / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={container / 2}
          cy={container / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-all duration-500"
        />
      </svg>
      {showPercentage && (
        <span className={cn('absolute font-bold text-text', fontSize)}>
          {Math.round(progress)}%
        </span>
      )}
    </div>
  )
}
