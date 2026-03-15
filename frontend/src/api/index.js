const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

async function request(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body !== undefined) opts.body = JSON.stringify(body)

  let res, data
  try {
    res = await fetch(`${BASE_URL}/api${path}`, opts)
    data = await res.json()
  } catch (e) {
    throw new Error('Network error — is the backend running?')
  }

  if (!res.ok) {
    const msg = data?.error || data?.detail || `Request failed (${res.status})`
    const err = new Error(msg)
    err.details = data?.details || null
    err.status = res.status
    throw err
  }
  return data
}

export function toList(data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.results)) return data.results
  return []
}

export const api = {
  get:    (path)       => request('GET',    path),
  post:   (path, body) => request('POST',   path, body),
  patch:  (path, body) => request('PATCH',  path, body),
  delete: (path)       => request('DELETE', path),
}

export const employeeApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return api.get(`/employees/${qs ? '?' + qs : ''}`)
  },
  get:    (id)   => api.get(`/employees/${id}/`),
  create: (data) => api.post('/employees/', data),
  delete: (id)   => api.delete(`/employees/${id}/`),
}

export const attendanceApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return api.get(`/attendance/${qs ? '?' + qs : ''}`)
  },
  mark:   (data)     => api.post('/attendance/', data),
  update: (id, data) => api.patch(`/attendance/${id}/`, data),
  delete: (id)       => api.delete(`/attendance/${id}/`),
}

export const dashboardApi = {
  stats: () => api.get('/dashboard/'),
}