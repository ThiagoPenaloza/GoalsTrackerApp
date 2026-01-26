import { cn } from '@/lib/utils'

interface ProgressRingProps {
  progress: number
  size?: 'sm' | 'md'
}

export function ProgressRing({ progress, size = 'md' }: ProgressRingProps) {
  const dims = size === 'sm' ? 40 : 56
  const stroke = size === 'sm' ? 3 : 4
  const radius = (dims - stroke) / 2
  const circ = 2 * Math.PI * radius
  const offset = circ - (progress / 100) * circ

  return (
    <div className="relative" style={{ width: dims, height: dims }}>
      <svg width={dims} height={dims} className="-rotate-90">
        <circle cx={dims / 2} cy={dims / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={dims / 2}
          cy={dims / 2}
          r={radius}
          fill="none"
          stroke="var(--orange)"
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span className={cn(
        'absolute inset-0 flex items-center justify-center font-display font-bold text-txt',
        size === 'sm' ? 'text-[10px]' : 'text-xs'
      )}>
        {progress}%
      </span>
    </div>
  )
}
