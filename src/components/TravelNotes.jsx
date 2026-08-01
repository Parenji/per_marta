import { useState, useEffect, useCallback } from 'react'
import { StickyNote, Plus, Trash2, ChevronDown, ChevronUp, Save } from 'lucide-react'
import { autoSync, markNoteDeleted } from '../lib/sync'

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
  const [draft, setDraft] = useState(null) // { id, title, content, timestamp } | null
  const [isSaving, setIsSaving] = useState(false)

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

  const persistAndSave = useCallback(async (newNotes) => {
    saveNotes(newNotes)
    setNotes(newNotes)
    setIsSaving(true)
    try {
      await autoSync()
    } catch {
      // sync fallisce silenziosamente, i dati sono già in localStorage
    } finally {
      setIsSaving(false)
    }
  }, [])

  const handleCreateNote = () => {
    // Se c'era una nuova nota non ancora salvata (non in localStorage), rimuovila
    if (draft && !loadNotes().some(n => n.id === draft.id)) {
      setNotes(prev => prev.filter(n => n.id !== draft.id))
    }
    const newNote = {
      id: generateId(),
      title: '',
      content: '',
      timestamp: new Date().toISOString(),
    }
    // Aggiungiamo subito alla lista per mostrarla, ma NON salviamo ancora in localStorage
    const newNotes = [newNote, ...notes]
    setNotes(newNotes)
    setExpandedId(newNote.id)
    setDraft({ ...newNote })
  }

  const handleUpdateDraft = (field, value) => {
    if (!draft) return
    setDraft(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveNote = () => {
    if (!draft) return

    const savedNote = { ...draft, timestamp: new Date().toISOString() }
    const existingIdx = notes.findIndex(n => n.id === savedNote.id)
    let newNotes
    if (existingIdx === -1) {
      newNotes = [savedNote, ...notes]
    } else {
      newNotes = notes.map(n => n.id === savedNote.id ? savedNote : n)
    }
    persistAndSave(newNotes)
    setDraft(null)
    setExpandedId(null)
  }

  const handleDeleteNote = (id) => {
    const newNotes = notes.filter(n => n.id !== id)
    saveNotes(newNotes)
    setNotes(newNotes)
    markNoteDeleted(id)
    autoSync().catch(() => {})
    if (expandedId === id) {
      setExpandedId(null)
      setDraft(null)
    }
  }

  const toggleExpand = (id) => {
    if (expandedId === id) {
      // Collapse: discard draft
      // Se la nota in draft non è ancora salvata in localStorage, rimuovila dalla lista
      if (draft && !loadNotes().some(n => n.id === draft.id)) {
        setNotes(prev => prev.filter(n => n.id !== draft.id))
      }
      setExpandedId(null)
      setDraft(null)
    } else {
      // Se stiamo cambiando nota, scarta il draft precedente (se non salvato)
      if (draft && expandedId && !loadNotes().some(n => n.id === draft.id)) {
        setNotes(prev => prev.filter(n => n.id !== draft.id))
      }
      // Expand: load note into draft
      const note = notes.find(n => n.id === id)
      if (note) {
        setDraft({ ...note })
        setExpandedId(id)
      }
    }
  }

  const getDisplayNote = (note) => {
    if (draft && draft.id === note.id) return draft
    return note
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
          {notes.map((note) => {
            const display = getDisplayNote(note)
            const isExpanded = expandedId === note.id
            return (
            <div
              key={note.id}
              className={`section-card transition-all ${
                isExpanded ? 'ring-2 ring-rose-300 shadow-lg' : ''
              }`}
            >
              {/* Note Header */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(note.id)}
              >
                <div className="flex-1 min-w-0 mr-3">
                  {isExpanded ? (
                    <input
                      type="text"
                      value={display.title}
                      onChange={(e) => handleUpdateDraft('title', e.target.value)}
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
                  {!isExpanded && note.content && (
                    <p className="text-sm text-rose-500 mt-1 truncate">
                      {note.content}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-rose-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-rose-400" />
                  )}
                </div>
              </div>

              {/* Note Content (expanded) */}
              {isExpanded && (
                <div className="mt-3 space-y-3">
                  <textarea
                    value={display.content}
                    onChange={(e) => handleUpdateDraft('content', e.target.value)}
                    placeholder="Scrivi qui il contenuto della nota..."
                    className="w-full min-h-[150px] text-rose-700 bg-rose-50/50 border border-rose-200 rounded-lg p-3 resize-y focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 placeholder-rose-300 text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-rose-400">
                      {note.timestamp ? new Date(note.timestamp).toLocaleString('it-IT') : ''}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveNote}
                        disabled={isSaving}
                        className="flex items-center gap-1.5 bg-rose-500 text-white px-4 py-2 rounded-full font-medium hover:bg-rose-600 transition-colors text-sm shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Salvando...' : 'Salva'}
                      </button>
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
                </div>
              )}
            </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TravelNotes