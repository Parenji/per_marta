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

// Merge checklist: simple union, local wins on conflict (most recent toggle)
function mergeChecklist(localChecklist, remoteChecklist) {
  return { ...remoteChecklist, ...localChecklist }
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

export async function syncAll() {
  const token = getToken()
  if (!token) throw new Error('Configura il token GitHub per sincronizzare')

  // 1. Load local data
  const local = loadLocalData()
  const localDeletedIds = loadDeletedIds()

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