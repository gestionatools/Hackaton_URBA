'use client'

import { useRouter } from 'next/navigation'
import { useTransition, useEffect } from 'react'

export default function RefreshButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleRefresh() {
    startTransition(() => {
      router.refresh()
    })
  }

  // Auto-refresh when the user returns to this tab
  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        startTransition(() => {
          router.refresh()
        })
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [router])

  return (
    <button
      onClick={handleRefresh}
      disabled={isPending}
      title="Refrescar datos"
      style={{
        padding: '7px 14px',
        fontSize: '0.85rem',
        fontWeight: 600,
        borderRadius: '6px',
        cursor: isPending ? 'not-allowed' : 'pointer',
        border: '2px solid #64748b',
        background: isPending ? '#e2e8f0' : '#f0f4f8',
        color: isPending ? '#94a3b8' : '#334155',
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          animation: isPending ? 'spin 0.8s linear infinite' : 'none',
        }}
      >
        ↻
      </span>
      {isPending ? 'Actualizando…' : 'Refrescar'}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  )
}
