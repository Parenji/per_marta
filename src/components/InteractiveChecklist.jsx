import { useState, useEffect, useCallback } from 'react'
import { Heart, CheckCircle2, RefreshCw } from 'lucide-react'

const STORAGE_KEY = 'checklist-state'

function loadChecklistState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveChecklistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage full or unavailable, silently ignore
  }
}

function makeKey(day, activityIndex) {
  return `day-${day}-${activityIndex}`
}

function InteractiveChecklist({ day, date, title, activities }) {
  const [checked, setChecked] = useState({})

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = loadChecklistState()
    const initial = {}
    activities.forEach((_, idx) => {
      const key = makeKey(day, idx)
      initial[idx] = saved[key] || false
    })
    setChecked(initial)
  }, [day, activities])

  // Persist to localStorage on change
  const toggleActivity = useCallback((activityIndex) => {
    setChecked(prev => {
      const newChecked = { ...prev, [activityIndex]: !prev[activityIndex] }
      const fullState = loadChecklistState()
      fullState[makeKey(day, activityIndex)] = newChecked[activityIndex]
      saveChecklistState(fullState)
      return newChecked
    })
  }, [day])

  const completeAll = useCallback(() => {
    const newChecked = {}
    activities.forEach((_, idx) => {
      newChecked[idx] = true
    })
    setChecked(newChecked)
    const fullState = loadChecklistState()
    activities.forEach((_, idx) => {
      fullState[makeKey(day, idx)] = true
    })
    saveChecklistState(fullState)
  }, [day, activities])

  const resetAll = useCallback(() => {
    const newChecked = {}
    activities.forEach((_, idx) => {
      newChecked[idx] = false
    })
    setChecked(newChecked)
    const fullState = loadChecklistState()
    activities.forEach((_, idx) => {
      fullState[makeKey(day, idx)] = false
    })
    saveChecklistState(fullState)
  }, [day, activities])

  const checkedCount = Object.values(checked).filter(Boolean).length
  const total = activities.length
  const progressPercent = total > 0 ? Math.round((checkedCount / total) * 100) : 0

  return (
    <div className="section-card group">
      {/* Header with progress bar */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-rose-100">
        <div className="bg-gradient-to-br from-rose-500 to-pink-500 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0">
          {day}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
            <span className="text-rose-500 font-semibold text-xs sm:text-sm">{date}</span>
            <span className="text-rose-400 hidden sm:inline">•</span>
            <span className="text-rose-800 font-semibold text-sm sm:text-base">{title}</span>
          </div>
          {/* Progress bar */}
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-2 bg-rose-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-rose-500 font-medium whitespace-nowrap">
              {checkedCount}/{total}
            </span>
          </div>
        </div>
      </div>

      {/* Activities */}
      <ul className="space-y-2 sm:space-y-1.5">
        {activities.map((activity, idx) => {
          const isChecked = checked[idx]
          return (
            <li key={idx}>
              <label
                className={`flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1.5 -mx-2 transition-all duration-200 hover:bg-rose-50 ${
                  isChecked ? 'opacity-60' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked || false}
                  onChange={() => toggleActivity(idx)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    isChecked
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-rose-300 bg-white hover:border-rose-400'
                  }`}
                >
                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <span
                  className={`text-sm sm:text-base break-words transition-all duration-200 ${
                    isChecked ? 'line-through text-rose-400' : 'text-rose-700'
                  }`}
                >
                  {activity}
                </span>
              </label>
            </li>
          )
        })}
      </ul>

      {/* Action buttons */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-rose-100">
        <button
          onClick={completeAll}
          className="flex-1 bg-emerald-500 text-white text-center py-1.5 rounded-full hover:bg-emerald-600 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-1"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Completa tutto
        </button>
        <button
          onClick={resetAll}
          className="flex-1 bg-rose-200 text-rose-700 text-center py-1.5 rounded-full hover:bg-rose-300 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>
    </div>
  )
}

export default InteractiveChecklist