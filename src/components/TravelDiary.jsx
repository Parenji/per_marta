import { useState, useEffect, useCallback } from 'react'
import { BookOpen, Plus, Trash2, Camera, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'

const STORAGE_KEY = 'diary-entries'

const DAYS = [
  { day: 1, date: '2 Agosto', title: 'Alla scoperta di Trieste', location: 'Trieste' },
  { day: 2, date: '3 Agosto', title: 'Verso l\'Istria', location: 'Istria' },
  { day: 3, date: '4 Agosto', title: 'Il fascino di Rovigno', location: 'Istria' },
  { day: 4, date: '5 Agosto', title: 'Pola Romana e Brioni', location: 'Istria' },
  { day: 5, date: '6 Agosto', title: 'Grotte e Lubiana', location: 'Slovenia' },
  { day: 6, date: '7 Agosto', title: 'Esplorazione di Lubiana', location: 'Slovenia' },
  { day: 7, date: '8 Agosto', title: 'Lago di Bled', location: 'Slovenia' },
  { day: 8, date: '9 Agosto', title: 'Rientro a Padova', location: 'Friuli V.G.' },
]

const DAY_COLORS = [
  '#e11d48', '#f43f5e', '#ec4899', '#a855f7',
  '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9',
]

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveEntries(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // silently ignore
  }
}

function TravelDiary() {
  const [selectedDay, setSelectedDay] = useState(1)
  const [entries, setEntries] = useState([])
  const [newText, setNewText] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')
  const [showConfirmDelete, setShowConfirmDelete] = useState(null)
  const [expandedImage, setExpandedImage] = useState(null)

  // Load entries on mount
  useEffect(() => {
    setEntries(loadEntries())
  }, [])

  const dayEntries = entries
    .filter(e => e.day === selectedDay)
    .sort((a, b) => b.timestamp - a.timestamp)

  const currentDayInfo = DAYS.find(d => d.day === selectedDay)

  const addEntry = useCallback(() => {
    if (!newText.trim()) return
    const entry = {
      id: Date.now(),
      day: selectedDay,
      text: newText.trim(),
      imageUrl: newImageUrl.trim() || null,
      timestamp: new Date().toISOString(),
    }
    const updated = [entry, ...entries]
    setEntries(updated)
    saveEntries(updated)
    setNewText('')
    setNewImageUrl('')
  }, [newText, newImageUrl, selectedDay, entries])

  const deleteEntry = useCallback((id) => {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    saveEntries(updated)
    setShowConfirmDelete(null)
  }, [entries])

  const entryCounts = DAYS.reduce((acc, d) => {
    acc[d.day] = entries.filter(e => e.day === d.day).length
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-6 h-6 text-rose-500" />
        <h2 className="text-2xl font-bold text-rose-800">Diario di Bordo</h2>
      </div>

      {/* Day selector */}
      <div className="section-card">
        <h3 className="text-sm font-semibold text-rose-700 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Seleziona il giorno
        </h3>
        <div className="flex gap-1.5 flex-wrap">
          {DAYS.map((d) => {
            const count = entryCounts[d.day] || 0
            const color = DAY_COLORS[d.day - 1]
            return (
              <button
                key={d.day}
                onClick={() => setSelectedDay(d.day)}
                className={`relative px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                  selectedDay === d.day
                    ? 'text-white shadow-lg'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
                style={selectedDay === d.day ? { background: color } : {}}
              >
                <span className="font-bold">{d.day}</span>
                <span className="hidden sm:inline">{d.date.split(' ')[0]} {d.date.split(' ')[1]}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                      selectedDay === d.day
                        ? 'bg-white text-rose-600'
                        : 'bg-rose-200 text-rose-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Current day header */}
      {currentDayInfo && (
        <div className="section-card bg-gradient-to-r from-rose-50 to-pink-50">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
              style={{ background: DAY_COLORS[selectedDay - 1] }}
            >
              {selectedDay}
            </div>
            <div>
              <p className="text-rose-500 text-sm font-semibold">{currentDayInfo.date}</p>
              <h3 className="text-rose-800 text-lg font-bold">{currentDayInfo.title}</h3>
              <p className="text-rose-500 text-xs flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                {currentDayInfo.location}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add entry form */}
      <div className="section-card">
        <h3 className="text-lg font-semibold text-rose-800 mb-3 flex items-center gap-2">
          <Plus className="w-5 h-5 text-rose-500" />
          Nuovo ricordo
        </h3>
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Scrivi un ricordo di oggi..."
          rows={3}
          className="w-full border border-rose-200 rounded-xl p-3 text-rose-700 placeholder-rose-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 resize-none text-sm"
        />
        <div className="flex gap-2 mt-2">
          <div className="flex-1 flex items-center gap-2 bg-rose-50 rounded-xl px-3 py-2">
            <Camera className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Link a una foto (opzionale)"
              className="bg-transparent w-full text-sm text-rose-700 placeholder-rose-400 focus:outline-none"
            />
          </div>
          <button
            onClick={addEntry}
            disabled={!newText.trim()}
            className="px-5 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed text-white"
            style={{ background: DAY_COLORS[selectedDay - 1] || '#e11d48' }}
          >
            <Plus className="w-4 h-4" />
            Salva
          </button>
        </div>
      </div>

      {/* Entries list */}
      <div className="space-y-4">
        {dayEntries.length === 0 ? (
          <div className="section-card text-center py-10">
            <BookOpen className="w-12 h-12 mx-auto text-rose-300 mb-3" />
            <p className="text-rose-500 text-sm">Nessun ricordo per questo giorno</p>
            <p className="text-rose-400 text-xs mt-1">Scrivi il primo ricordo qui sopra ✍️</p>
          </div>
        ) : (
          dayEntries.map((entry) => (
            <div
              key={entry.id}
              className="section-card relative animate-slide-up"
              style={{ borderLeft: `4px solid ${DAY_COLORS[selectedDay - 1] || '#e11d48'}` }}
            >
              <div className="absolute top-3 right-3">
                {showConfirmDelete === entry.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-red-600 transition-colors"
                    >
                      Sì, elimina
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(null)}
                      className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium hover:bg-gray-300 transition-colors"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowConfirmDelete(entry.id)}
                    className="text-rose-400 hover:text-red-500 transition-colors p-1"
                    title="Elimina ricordo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-xs text-rose-400 mb-2 font-medium">
                {new Date(entry.timestamp).toLocaleString('it-IT', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>

              <p className="text-rose-700 text-sm leading-relaxed whitespace-pre-wrap pr-12">
                {entry.text}
              </p>

              {entry.imageUrl && (
                <div className="mt-3">
                  <img
                    src={entry.imageUrl}
                    alt="Ricordo"
                    className={`rounded-xl cursor-pointer object-cover transition-all duration-200 ${
                      expandedImage === entry.id
                        ? 'w-full max-h-96'
                        : 'w-32 h-32 hover:ring-2 ring-rose-300'
                    }`}
                    onClick={() =>
                      setExpandedImage(expandedImage === entry.id ? null : entry.id)
                    }
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentElement.innerHTML =
                        '<div class="text-xs text-rose-400 italic mt-2">📷 Immagine non disponibile</div>'
                    }}
                  />
                  {expandedImage !== entry.id && (
                    <p className="text-xs text-rose-400 mt-1">Clicca per ingrandire</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TravelDiary