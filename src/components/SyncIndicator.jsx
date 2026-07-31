import { useState, useEffect } from 'react'
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'

function SyncIndicator() {
  const [status, setStatus] = useState('idle') // idle | syncing | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handler = (e) => {
      const { status: s, message: m } = e.detail
      setStatus(s)
      setMessage(m || '')
    }
    window.addEventListener('sync-status-change', handler)
    return () => window.removeEventListener('sync-status-change', handler)
  }, [])

  if (status === 'idle') return null

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
      status === 'syncing'
        ? 'bg-white/20 text-white animate-pulse'
        : status === 'success'
          ? 'bg-emerald-400/30 text-emerald-100'
          : 'bg-red-400/30 text-red-100'
    }`}>
      {status === 'syncing' && (
        <>
          <RefreshCw className="w-3 h-3 animate-spin" />
          <span>Sync...</span>
        </>
      )}
      {status === 'success' && (
        <>
          <CheckCircle2 className="w-3 h-3" />
          <span>Sync ok</span>
        </>
      )}
      {status === 'error' && (
        <>
          <AlertCircle className="w-3 h-3" />
          <span title={message}>Errore sync</span>
        </>
      )}
    </div>
  )
}

export default SyncIndicator