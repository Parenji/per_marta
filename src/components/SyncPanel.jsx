import { useState, useCallback } from 'react'
import { RefreshCw, Key, CheckCircle2, AlertCircle, Settings, X } from 'lucide-react'
import { syncAll, hasToken, saveToken, getLastSyncTime } from '../lib/sync'

function timeAgo(isoString) {
  if (!isoString) return null
  const now = Date.now()
  const then = new Date(isoString).getTime()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return 'pochi secondi fa'
  if (diff < 3600) return `${Math.floor(diff / 60)} min fa`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ore fa`
  return `${Math.floor(diff / 86400)} giorni fa`
}

function SyncPanel({ onSyncComplete }) {
  const [token, setToken] = useState(hasToken() ? localStorage.getItem('github-token') || '' : '')
  const [showSetup, setShowSetup] = useState(!hasToken())
  const [syncing, setSyncing] = useState(false)
  const [status, setStatus] = useState(null) // 'success' | 'error' | null
  const [statusMessage, setStatusMessage] = useState('')

  const lastSync = getLastSyncTime()

  const handleSync = useCallback(async () => {
    if (!hasToken() && !token.trim()) {
      setShowSetup(true)
      return
    }

    setSyncing(true)
    setStatus(null)
    setStatusMessage('')

    try {
      if (token.trim() && !hasToken()) {
        saveToken(token.trim())
      }

      const result = await syncAll()
      window.dispatchEvent(new CustomEvent('sync-complete', { detail: result }))

      setStatus('success')
      const entryCount = result.entries?.length || 0
      setStatusMessage(`${entryCount} ricordi sincronizzati`)

      if (onSyncComplete) {
        onSyncComplete(result)
      }
    } catch (err) {
      setStatus('error')
      setStatusMessage(err.message || 'Errore')
    } finally {
      setSyncing(false)
      if (status === 'success') {
        setTimeout(() => setStatus(null), 3000)
      }
    }
  }, [token, onSyncComplete])

  if (showSetup) {
    return (
      <div className="section-card bg-amber-50 border border-amber-200 max-w-md mx-auto text-left">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
            <Key className="w-4 h-4" />
            Configura Sync GitHub
          </h3>
          {hasToken() && (
            <button
              onClick={() => setShowSetup(false)}
              className="text-amber-500 hover:text-amber-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-xs text-amber-700 mb-2">
          Crea un token su{' '}
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
          >
            GitHub → Settings → Developer settings → Tokens (classic)
          </a>
          {' '}con permesso <strong>repo</strong>, poi incollalo qui:
        </p>
        <div className="flex gap-2">
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_..."
            className="flex-1 border border-amber-300 rounded-lg px-3 py-2 text-sm text-amber-900 placeholder-amber-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          />
          <button
            onClick={() => {
              if (token.trim()) {
                saveToken(token.trim())
                setShowSetup(false)
              }
            }}
            disabled={!token.trim()}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            Salva
          </button>
        </div>
        <p className="text-[10px] text-amber-600 mt-2">
          Il token resta salvato solo sul tuo telefono.
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {/* Sync button — compact, header-style */}
      <button
        onClick={handleSync}
        disabled={syncing}
        title={lastSync ? `Ultimo sync: ${timeAgo(lastSync)}` : 'Sincronizza diario e checklist'}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all disabled:opacity-50 ${
          syncing
            ? 'bg-white/10 text-white/60'
            : 'bg-white/15 text-white/90 hover:bg-white/25'
        }`}
      >
        <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
        <span>{syncing ? 'Sync...' : 'Sync'}</span>
      </button>

      {/* Status feedback — tiny inline */}
      {status === 'success' && statusMessage && (
        <span className="text-xs text-emerald-200 animate-fade-in">{statusMessage}</span>
      )}
      {status === 'error' && statusMessage && (
        <span className="text-xs text-rose-200 max-w-[200px] truncate" title={statusMessage}>
          <AlertCircle className="w-3 h-3 inline mr-0.5" />
          {statusMessage}
        </span>
      )}

      {/* Config gear */}
      {!hasToken() ? null : (
        <button
          onClick={() => setShowSetup(true)}
          className="text-white/50 hover:text-white/80 transition-colors"
          title="Configura sync"
        >
          <Settings className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

export default SyncPanel