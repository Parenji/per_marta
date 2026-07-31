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

// Merge two arrays of entries by ID.
// If same ID exists in both, keep the one with newer timestamp.
// Deleted entries: we track deleted IDs. If an entry exists remotely but locally we just
// deleted it, we need to know. Strategy: when user deletes locally, we mark it as deleted
// in a separate list. During merge, if remote has it and local marked deleted → keep remote?
// Actually simpler: deletions propagate on next sync. If LOCAL deleted AND REMOTE still has it,
// it means the other phone hasn't synced the deletion yet. We should respect the deletion
// only if local timestamp > remote timestamp. Otherwise keep remote.
// Even simpler: local deletions are applied immediately, and on next sync we push the deletion.
// During merge, we do: start with remote, add local entries that are not in remote,
// for entries in both, keep the one with higher timestamp.
function mergeEntries(localEntries, remoteEntries) {
  const merged = [...remoteEntries]
  const remoteIds = new Set(remoteEntries.map(e => e.id))

  for (const localEntry of localEntries) {
    const existingIdx = merged.findIndex(e => e.id === localEntry.id)
    if (existingIdx === -1) {
      // New local entry → add
      merged.push(localEntry)
    } else {
      // Same ID: keep the one with newer timestamp
      const remoteEntry = merged[existingIdx]
      const localTime = localEntry.timestamp || ''
      const remoteTime = remoteEntry.timestamp || ''
      if (localTime > remoteTime) {
        merged[existingIdx] = localEntry
      }
    }
  }

  // Sort by timestamp descending
  merged.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''))
  return merged
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

  // 2. Fetch remote data
  const remote = await fetchRemoteFile()

  // 3. Merge
  const mergedEntries = mergeEntries(local.entries, remote.data.entries || [])
  const mergedChecklist = mergeChecklist(local.checklist, remote.data.checklist || {})

  // 4. Build final data
  const finalData = {
    entries: mergedEntries,
    checklist: mergedChecklist,
    lastModified: new Date().toISOString(),
  }

  // 5. Push to GitHub
  await pushRemoteFile(finalData, remote.sha)

  // 6. Save merged data locally
  saveLocalData(mergedEntries, mergedChecklist)
  setLastSyncTime()

  return {
    entries: mergedEntries,
    checklist: mergedChecklist,
  }
}

export default {
  syncAll,
  hasToken,
  saveToken,
  getLastSyncTime,
}