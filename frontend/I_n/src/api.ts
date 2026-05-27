import type { Service, Sound, Paginated } from './types'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `${response.status} ${response.statusText}`)
  }

  return response.json()
}

export function getSounds(params?: { page?: number; limit?: number; q?: string }) {
  const qs = new URLSearchParams()
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))
  if (params?.q) qs.set('q', params.q)
  const path = '/api/sounds' + (qs.toString() ? `?${qs.toString()}` : '')
  return request<Paginated<Sound>>(path)
}

export function createSound(sound: Partial<Sound>) {
  return request<Sound>('/api/sounds', { method: 'POST', body: sound })
}

export function updateSound(id: string, sound: Partial<Sound>) {
  return request<Sound>(`/api/sounds/${id}`, { method: 'PUT', body: sound })
}

export function deleteSound(id: string) {
  return request<void>(`/api/sounds/${id}`, { method: 'DELETE' })
}

export function getServices(params?: { page?: number; limit?: number; q?: string }) {
  const qs = new URLSearchParams()
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))
  if (params?.q) qs.set('q', params.q)
  const path = '/api/services' + (qs.toString() ? `?${qs.toString()}` : '')
  return request<Paginated<Service>>(path)
}

export function createService(service: Partial<Service>) {
  return request<Service>('/api/services', { method: 'POST', body: service })
}

export function updateService(id: string, service: Partial<Service>) {
  return request<Service>(`/api/services/${id}`, { method: 'PUT', body: service })
}

export function deleteService(id: string) {
  return request<void>(`/api/services/${id}`, { method: 'DELETE' })
}
