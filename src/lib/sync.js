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
  try {
    entries = JSON.parse(localStorage.getItem(STORAGE_KEYS.entries) || '[]')
    checklist = JSON.parse(localStorage.getItem(STORAGE_KEYS.checklist) || '{}')
  } catch { /* ignore */ }
  return { entries, checklist }
}

function saveLocalData(entries, checklist) {
  localStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(entries))
  localStorage.setItem(STORAGE_KEYS.checklist, JSON.stringify(checklist))
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

// Merge two arrays of entries by ID.
// Tombstone list: IDs that were deleted locally. Remote entries with those IDs
// are NOT added back unless they were modified after the deletion timestamp.
function mergeEntries(localEntries, remoteEntries, localDeletedIds) {
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
    return { sha: null, data: { entries: [], checklist: {} } }
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

export async function autoSync() {
  if (autoSyncInProgress) return
  if (!hasToken()) return

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
  }
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

  // 1. Load local data (do this once, local state may change slightly but that's edge-case)
  const local = loadLocalData()
  const localDeletedIds = loadDeletedIds()

  const MAX_RETRIES = 3
  let lastError = null

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // 2. Fetch remote data
      const remote = await fetchRemoteFile()

      // 3. Merge
      const mergedEntries = mergeEntries(local.entries, remote.data.entries || [], localDeletedIds)
      const mergedChecklist = mergeChecklist(local.checklist, remote.data.checklist || {})

      // 4. Clean up deleted IDs (remove those no longer in either local or remote)
      const cleanedDeletedIds = cleanupDeletedIds(mergedEntries, localDeletedIds, remote.data.entries || [])
      saveDeletedIds(cleanedDeletedIds)

      // 5. Build final data
      const finalData = {
        entries: mergedEntries,
        checklist: mergedChecklist,
        lastModified: new Date().toISOString(),
      }

      // 6. Push to GitHub
      await pushRemoteFile(finalData, remote.sha)

      // 7. Save merged data locally
      saveLocalData(mergedEntries, mergedChecklist)
      setLastSyncTime()

      return {
        entries: mergedEntries,
        checklist: mergedChecklist,
      }
    } catch (err) {
      lastError = err
      // If conflict (SHA mismatch), retry after a short delay
      const message = err.message || ''
      if (message.includes('409') || message.includes('does not match') || message.includes('conflict')) {
        if (attempt < MAX_RETRIES - 1) {
          // Wait a bit for the other push to settle, then retry
          await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000))
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

export default {
  syncAll,
  hasToken,
  saveToken,
  getLastSyncTime,
}