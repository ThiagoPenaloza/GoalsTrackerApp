'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface DeleteGoalButtonProps {
  goalId: string
}

export function DeleteGoalButton({ goalId }: DeleteGoalButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setIsDeleting(true)
    const { error } = await supabase.from('goals').delete().eq('id', goalId)
    if (!error) {
      router.push('/goals')
      router.refresh()
    } else {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowConfirm(false)}
          className="text-xs text-txt-secondary hover:text-txt font-medium px-3 py-1.5"
          disabled={isDeleting}
        >
          Cancel
        </button>
        <Button onClick={handleDelete} disabled={isDeleting} variant="danger" size="sm">
          {isDeleting ? 'Deleting...' : 'Confirm'}
        </Button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2 text-txt-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
      title="Delete goal"
    >
      <Trash2 size={16} />
    </button>
  )
}
