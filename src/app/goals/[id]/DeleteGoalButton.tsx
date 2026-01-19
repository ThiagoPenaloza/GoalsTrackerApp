'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Trash2 } from 'lucide-react'

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

    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId)

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
          className="text-sm text-gray-500 hover:text-gray-700"
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          {isDeleting ? 'Deleting...' : 'Confirm Delete'}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-gray-400 hover:text-red-600 transition-colors"
      title="Delete goal"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  )
}
