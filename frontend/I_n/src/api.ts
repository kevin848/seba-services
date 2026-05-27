import type { Service, Sound } from './types'

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

export function getSounds() {
  return request<Sound[]>('/api/sounds')
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

export function getServices() {
  return request<Service[]>('/api/services')
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
