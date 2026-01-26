import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, id, className, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-txt-secondary tracking-wide uppercase mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'w-full px-4 py-2.5 bg-transparent border border-line rounded-xl text-txt placeholder:text-txt-muted',
          'focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all',
          className
        )}
        {...props}
      />
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export function Textarea({ label, id, className, ...props }: TextareaProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-txt-secondary tracking-wide uppercase mb-2">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          'w-full px-4 py-2.5 bg-transparent border border-line rounded-xl text-txt placeholder:text-txt-muted resize-none',
          'focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all',
          className
        )}
        {...props}
      />
    </div>
  )
}
