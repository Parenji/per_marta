import { useState, useEffect, useRef, useCallback } from 'react'
import { StickyNote, Plus, Trash2, ChevronDown, ChevronUp, Save } from 'lucide-react'
import { debouncedAutoSync, markNoteDeleted } from '../lib/sync'

const STORAGE_KEY = 'travel-notes'

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

function generateId() {
  return 'note_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
}

function TravelNotes() {
  const [notes, setNotes] = useState(loadNotes)
  const [expandedId, setExpandedId] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const titleInputRef = useRef(null)

  // Listen for sync-complete to merge remote notes
  useEffect(() => {
    const handleSync = (e) => {
      const remoteNotes = e.detail?.notes
      if (remoteNotes && Array.isArray(remoteNotes)) {
        setNotes(prev => {
          const merged = [...remoteNotes]
          for (const localNote of prev) {
            const exists = merged.find(r => r.id === localNote.id)
            if (!exists) {
              merged.push(localNote)
            } else {
              const localTime = localNote.timestamp || ''
              const remoteTime = exists.timestamp || ''
              if (localTime > remoteTime) {
                const idx = merged.findIndex(r => r.id === localNote.id)
                if (idx !== -1) merged[idx] = localNote
              }
            }
          }
          merged.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''))
          saveNotes(merged)
          return merged
        })
      }
    }
    window.addEventListener('sync-complete', handleSync)
    return () => window.removeEventListener('sync-complete', handleSync)
  }, [])

  const persistAndSync = useCallback((newNotes) => {
    saveNotes(newNotes)
    setNotes(newNotes)
    debouncedAutoSync()
  }, [])

  const handleCreateNote = () => {
    const note = {
      id: generateId(),
      title: '',
      content: '',
      timestamp: new Date().toISOString(),
    }
    const newNotes = [note, ...notes]
    persistAndSync(newNotes)
    setExpandedId(note.id)
  }

  const handleUpdateNote = (id, field, value) => {
    const newNotes = notes.map(n => {
      if (n.id === id) {
        return { ...n, [field]: value, timestamp: new Date().toISOString() }
      }
      return n
    })
    persistAndSync(newNotes)
  }

  const handleDeleteNote = (id) => {
    const newNotes = notes.filter(n => n.id !== id)
    persistAndSync(newNotes)
    markNoteDeleted(id)
    if (expandedId === id) setExpandedId(null)
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StickyNote className="w-6 h-6 text-rose-500" />
          <h2 className="text-2xl font-bold text-rose-800">Note</h2>
          {notes.length > 0 && (
            <span className="text-sm text-rose-400 ml-2">({notes.length})</span>
          )}
        </div>
        <button
          onClick={handleCreateNote}
          className="flex items-center gap-1.5 bg-rose-500 text-white px-4 py-2 rounded-full font-medium hover:bg-rose-600 transition-colors text-sm shadow-md"
        >
          <Plus className="w-4 h-4" />
          Nuova Nota
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="section-card text-center py-12">
          <StickyNote className="w-16 h-16 mx-auto text-rose-200 mb-4" />
          <p className="text-rose-500 text-lg mb-2">Nessuna nota ancora</p>
          <p className="text-rose-400 text-sm mb-6">
            Crea la tua prima nota per tenere traccia di idee, promemoria o qualunque cosa ti venga in mente!
          </p>
          <button
            onClick={handleCreateNote}
            className="inline-flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-full font-medium hover:bg-rose-600 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Crea la prima nota
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`section-card transition-all ${
                expandedId === note.id ? 'ring-2 ring-rose-300 shadow-lg' : ''
              }`}
            >
              {/* Note Header */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(note.id)}
              >
                <div className="flex-1 min-w-0 mr-3">
                  {expandedId === note.id ? (
                    <input
                      type="text"
                      value={note.title}
                      onChange={(e) => handleUpdateNote(note.id, 'title', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Titolo della nota..."
                      className="w-full text-lg font-semibold text-rose-800 bg-transparent border-b-2 border-rose-200 focus:border-rose-400 outline-none pb-1 placeholder-rose-300"
                      autoFocus
                    />
                  ) : (
                    <h3 className="text-lg font-semibold text-rose-800 truncate">
                      {note.title || 'Nota senza titolo'}
                    </h3>
                  )}
                  {expandedId !== note.id && note.content && (
                    <p className="text-sm text-rose-500 mt-1 truncate">
                      {note.content}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {expandedId === note.id ? (
                    <ChevronUp className="w-5 h-5 text-rose-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-rose-400" />
                  )}
                </div>
              </div>

              {/* Note Content (expanded) */}
              {expandedId === note.id && (
                <div className="mt-3 space-y-3">
                  <textarea
                    value={note.content}
                    onChange={(e) => handleUpdateNote(note.id, 'content', e.target.value)}
                    placeholder="Scrivi qui il contenuto della nota..."
                    className="w-full min-h-[150px] text-rose-700 bg-rose-50/50 border border-rose-200 rounded-lg p-3 resize-y focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 placeholder-rose-300 text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-rose-400">
                      {note.timestamp ? new Date(note.timestamp).toLocaleString('it-IT') : ''}
                    </span>
                    <button
                      onClick={() => {
                        if (window.confirm('Eliminare questa nota?')) {
                          handleDeleteNote(note.id)
                        }
                      }}
                      className="flex items-center gap-1 text-rose-400 hover:text-rose-600 transition-colors text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Elimina
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TravelNotes