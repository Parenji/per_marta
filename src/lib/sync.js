// GitHub Sync module
// Syncs diary entries and checklist state via GitHub API

const REPO_OWNER = 'Parenji'
const REPO_NAME = 'per_marta'
const DATA_PATH = 'data/diary.json'
const BRANCH = 'main'

const STORAGE_KEYS = {
  token: 'github-token',
  entries: 'diary-entries',
  checklist: 'checklist-state',
  deletedIds: 'diary-deleted-ids',
  notes: 'travel-notes',
  notesDeletedIds: 'notes-deleted-ids',
}

function getToken() {
  return localStorage.getItem(STORAGE_KEYS.token) || ''
}

export function hasToken() {
  return !!getToken()
}

export function saveToken(token) {
  localStorage.setItem(STORAGE_KEYS.token, token)
}

export function getLastSyncTime() {
  return localStorage.getItem('last-sync-time') || null
}

function setLastSyncTime() {
  const now = new Date().toISOString()
  localStorage.setItem('last-sync-time', now)
}

function loadLocalData() {
  let entries = []
  let checklist = {}
  let notes = []
  try {
    entries = JSON.parse(localStorage.getItem(STORAGE_KEYS.entries) || '[]')
    checklist = JSON.parse(localStorage.getItem(STORAGE_KEYS.checklist) || '{}')
    notes = JSON.parse(localStorage.getItem(STORAGE_KEYS.notes) || '[]')
  } catch { /* ignore */ }
  return { entries, checklist, notes }
}

function saveLocalData(entries, checklist, notes) {
  localStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(entries))
  localStorage.setItem(STORAGE_KEYS.checklist, JSON.stringify(checklist))
  localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes || []))
}

function loadDeletedIds() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.deletedIds) || '[]')
  } catch {
    return []
  }
}

function saveDeletedIds(ids) {
  localStorage.setItem(STORAGE_KEYS.deletedIds, JSON.stringify(ids))
}

function loadNotesDeletedIds() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.notesDeletedIds) || '[]')
  } catch {
    return []
  }
}

function saveNotesDeletedIds(ids) {
  localStorage.setItem(STORAGE_KEYS.notesDeletedIds, JSON.stringify(ids))
}

// Merge two arrays of entries by ID.
// Tombstone list: IDs that were deleted locally. Remote entries with those IDs
// are NOT added back unless they were modified after the deletion timestamp.
function mergeEntries(localEntries, remoteEntries, localDeletedIds = []) {
  const deletedSet = new Map() // id → deletion timestamp
  for (const item of localDeletedIds) {
    if (typeof item === 'object') {
      deletedSet.set(item.id, item.deletedAt || 0)
    } else {
      // Legacy format (just ID string/number)
      deletedSet.set(item, new Date().toISOString())
    }
  }

  const merged = [...remoteEntries]

  for (const localEntry of localEntries) {
    const existingIdx = merged.findIndex(e => e.id === localEntry.id)
    if (existingIdx === -1) {
      merged.push(localEntry)
    } else {
      const remoteEntry = merged[existingIdx]
      const localTime = localEntry.timestamp || ''
      const remoteTime = remoteEntry.timestamp || ''
      if (localTime > remoteTime) {
        merged[existingIdx] = localEntry
      }
    }
  }

  // Remove entries that are in the tombstone list, unless remote has a newer version
  const now = new Date().toISOString()
  for (let i = merged.length - 1; i >= 0; i--) {
    const entry = merged[i]
    if (deletedSet.has(entry.id)) {
      const deletedAt = deletedSet.get(entry.id)
      // Keep if remote timestamp > deletion time (other phone re-added/modified it)
      if ((entry.timestamp || '') > deletedAt) {
        continue // keep it
      }
      merged.splice(i, 1)
    }
  }

  merged.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''))
  return merged
}

// Clean up tombstone: remove IDs that no longer exist anywhere
function cleanupDeletedIds(mergedEntries, localDeletedIds, remoteEntries) {
  const allIds = new Set([
    ...mergedEntries.map(e => e.id),
  ])
  return localDeletedIds.filter(item => {
    const id = typeof item === 'object' ? item.id : item
    return allIds.has(id)
  })
}

// Merge checklist: for each key, keep the entry with the most recent timestamp.
// Each value is now { v: boolean, t: ISO timestamp }.
// Handles legacy boolean values (migrated on the fly).
function mergeChecklist(localChecklist, remoteChecklist) {
  const merged = { ...remoteChecklist }

  for (const [key, localVal] of Object.entries(localChecklist)) {
    const localEntry = typeof localVal === 'object' && localVal !== null ? localVal : { v: !!localVal, t: '0' }
    const remoteEntry = merged[key]
    
    if (!remoteEntry) {
      // New local key → add
      merged[key] = localEntry
    } else {
      const remoteVal = typeof remoteEntry === 'object' && remoteEntry !== null ? remoteEntry : { v: !!remoteEntry, t: '0' }
      const localTime = localEntry.t || '0'
      const remoteTime = remoteVal.t || '0'
      // Keep the most recent toggle
      if (localTime >= remoteTime) {
        merged[key] = localEntry
      }
    }
  }

  return merged
}

async function fetchRemoteFile() {
  const token = getToken()
  if (!token) throw new Error('Token GitHub non configurato')

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DATA_PATH}?ref=${BRANCH}`
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })

  if (res.status === 404) {
    // File doesn't exist yet, return empty
    return { sha: null, data: { entries: [], checklist: {}, notes: [] } }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `GitHub API error: ${res.status}`)
  }

  const json = await res.json()
  const content = atob(json.content)
  const data = JSON.parse(content)
  return { sha: json.sha, data }
}

async function pushRemoteFile(data, sha) {
  const token = getToken()
  if (!token) throw new Error('Token GitHub non configurato')

  const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))))
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DATA_PATH}`

  const body = {
    message: 'Sync diary & checklist',
    content,
    branch: BRANCH,
  }
  if (sha) {
    body.sha = sha
  }

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `GitHub API error: ${res.status}`)
  }

  return res.json()
}

let autoSyncInProgress = false
let autoSyncDebounceTimer = null
let pendingSyncRequest = false
let lastSyncFinishedAt = 0

async function _doAutoSync() {
  autoSyncInProgress = true
  window.dispatchEvent(new CustomEvent('sync-status-change', { detail: { status: 'syncing' } }))

  try {
    const result = await syncAll()
    window.dispatchEvent(new CustomEvent('sync-complete', { detail: result }))
    window.dispatchEvent(new CustomEvent('sync-status-change', { detail: { status: 'success' } }))
    // Auto-hide success after 2s
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('sync-status-change', { detail: { status: 'idle' } }))
    }, 2000)
    return result
  } catch (err) {
    window.dispatchEvent(new CustomEvent('sync-status-change', { detail: { status: 'error', message: err.message } }))
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('sync-status-change', { detail: { status: 'idle' } }))
    }, 5000)
    throw err
  } finally {
    autoSyncInProgress = false
    lastSyncFinishedAt = Date.now()
    // Retry if a sync was requested while this one was in progress,
    // but wait for GitHub to settle (min 3s cooldown between syncs)
    if (pendingSyncRequest) {
      pendingSyncRequest = false
      const sinceLastSync = Date.now() - lastSyncFinishedAt
      const cooldown = Math.max(0, 3000 - sinceLastSync)
      setTimeout(() => {
        _doAutoSync().catch(() => {})
      }, cooldown)
    }
  }
}

export async function autoSync() {
  if (!hasToken()) return
  if (autoSyncInProgress) {
    // Mark that we need a re-sync once the current one finishes
    pendingSyncRequest = true
    return
  }
  return _doAutoSync()
}

// Debounced autoSync (for checklist toggles — fire after 2s of inactivity)
export function debouncedAutoSync() {
  if (autoSyncDebounceTimer) clearTimeout(autoSyncDebounceTimer)
  autoSyncDebounceTimer = setTimeout(() => {
    autoSync().catch(() => {})
  }, 2000)
}

export async function syncAll() {
  const token = getToken()
  if (!token) throw new Error('Configura il token GitHub per sincronizzare')

  const MAX_RETRIES = 5
  let lastError = null

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    // Reload local data fresh on every attempt (user may have made changes during retries)
    const local = loadLocalData()
    const localDeletedIds = loadDeletedIds()
    const notesDeletedIds = loadNotesDeletedIds()

    try {
      // Fetch remote data
      const remote = await fetchRemoteFile()

      // 3. Merge
      const mergedEntries = mergeEntries(local.entries, remote.data.entries || [], localDeletedIds)
      const mergedChecklist = mergeChecklist(local.checklist, remote.data.checklist || {})
      const mergedNotes = mergeEntries(local.notes, remote.data.notes || [], notesDeletedIds)

      // 4. Clean up deleted IDs (remove those no longer in either local or remote)
      const cleanedDeletedIds = cleanupDeletedIds(mergedEntries, localDeletedIds, remote.data.entries || [])
      saveDeletedIds(cleanedDeletedIds)
      const cleanedNotesDeletedIds = cleanupDeletedIds(mergedNotes, notesDeletedIds, remote.data.notes || [])
      saveNotesDeletedIds(cleanedNotesDeletedIds)

      // 5. Build final data
      const finalData = {
        entries: mergedEntries,
        checklist: mergedChecklist,
        notes: mergedNotes,
        lastModified: new Date().toISOString(),
      }

      // 6. Push to GitHub
      await pushRemoteFile(finalData, remote.sha)

      // 7. Save merged data locally
      saveLocalData(mergedEntries, mergedChecklist, mergedNotes)
      setLastSyncTime()

      return {
        entries: mergedEntries,
        checklist: mergedChecklist,
        notes: mergedNotes,
      }
    } catch (err) {
      lastError = err
      // If conflict (SHA mismatch), retry after a short delay
      const message = err.message || ''
      if (message.includes('409') || message.includes('does not match') || message.includes('conflict')) {
        if (attempt < MAX_RETRIES - 1) {
          // Exponential backoff: 1s, 2s, 4s, 8s + jitter
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000
          await new Promise(r => setTimeout(r, delay))
          continue
        }
      }
      // Non-retryable error → throw immediately
      throw err
    }
  }

  throw lastError || new Error('Sync failed after retries')
}

// Mark an entry as deleted (called when user deletes locally)
export function markDeleted(entryId) {
  const ids = loadDeletedIds()
  ids.push({ id: entryId, deletedAt: new Date().toISOString() })
  saveDeletedIds(ids)
}

// Mark a note as deleted (called when user deletes locally)
export function markNoteDeleted(noteId) {
  const ids = loadNotesDeletedIds()
  ids.push({ id: noteId, deletedAt: new Date().toISOString() })
  saveNotesDeletedIds(ids)
}

export default {
  syncAll,
  hasToken,
  saveToken,
  getLastSyncTime,
}