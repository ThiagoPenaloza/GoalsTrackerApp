import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus-ring',
        'disabled:opacity-50 disabled:pointer-events-none',
        // Variants
        variant === 'primary' && 'bg-accent text-white hover:bg-orange-600 active:bg-orange-700 shadow-sm hover:shadow-glow',
        variant === 'secondary' && 'bg-surface border border-line text-txt hover:border-accent/30 hover:text-accent',
        variant === 'danger' && 'bg-red-500 text-white hover:bg-red-600',
        variant === 'ghost' && 'text-txt-secondary hover:text-txt hover:bg-surface-raised',
        // Sizes
        size === 'sm' && 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
        size === 'md' && 'text-sm px-5 py-2.5 gap-2',
        size === 'lg' && 'text-base px-6 py-3 gap-2',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}
