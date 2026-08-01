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
  const [stats, setStats] = useState(null) // { entries, checklist }

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
      // Notify all components that sync completed
      window.dispatchEvent(new CustomEvent('sync-complete', { detail: result }))
      const entryCount = result.entries?.length || 0
      const checklistCount = Object.values(result.checklist || {}).filter(v => (typeof v === 'object' ? v.v : v)).length

      setStats({ entries: entryCount, checklist: checklistCount })
      setStatus('success')
      setStatusMessage(`Sincronizzato! ${entryCount} ricordi, ${checklistCount} attività completate`)

      if (onSyncComplete) {
        onSyncComplete(result)
      }
    } catch (err) {
      setStatus('error')
      setStatusMessage(err.message || 'Errore di sincronizzazione')
    } finally {
      setSyncing(false)
      // Auto-clear success message after 5s
      if (status === 'success') {
        setTimeout(() => setStatus(null), 5000)
      }
    }
  }, [token, onSyncComplete])

  const handleDismissStatus = () => {
    setStatus(null)
    setStatusMessage('')
  }

  return (
    <div className="space-y-3">
      {/* Token setup (collapsible) */}
      {showSetup && (
        <div className="section-card bg-amber-50 border border-amber-200">
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
                  setStatus('success')
                  setStatusMessage('Token salvato! Ora puoi sincronizzare.')
                  setTimeout(() => setStatus(null), 4000)
                }
              }}
              disabled={!token.trim()}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
            >
              Salva
            </button>
          </div>
          <p className="text-[10px] text-amber-600 mt-2">
            Il token resta salvato solo sul tuo telefono. Non viene mai inviato a server esterni (solo a GitHub API).
          </p>
        </div>
      )}

      {/* Sync button + status */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all disabled:opacity-60 text-white shadow-md hover:shadow-lg"
          style={{
            background: syncing
              ? '#9ca3af'
              : status === 'success'
                ? '#10b981'
                : status === 'error'
                  ? '#ef4444'
                  : hasToken()
                    ? '#6366f1'
                    : '#f59e0b',
          }}
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Sincronizzazione...' : '🔄 Sincronizza'}
        </button>

        {!hasToken() && !showSetup && (
          <button
            onClick={() => setShowSetup(true)}
            className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <Settings className="w-3 h-3" />
            Configura
          </button>
        )}

        {lastSync && !status && (
          <span className="text-xs text-rose-400">
            Ultimo sync: {timeAgo(lastSync)}
          </span>
        )}
      </div>

      {/* Status message */}
      {status && statusMessage && (
        <div
          className={`flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${
            status === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {status === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            <span>{statusMessage}</span>
          </div>
          <button onClick={handleDismissStatus} className="text-current opacity-50 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats */}
      {stats && status === 'success' && (
        <div className="flex gap-3 text-xs text-rose-500">
          <span>📔 {stats.entries} ricordi</span>
          <span>✅ {stats.checklist} attività</span>
        </div>
      )}
    </div>
  )
}

export default SyncPanel