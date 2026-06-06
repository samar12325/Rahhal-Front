import { apiRequest } from '../api/client'

export async function listAiTripSessions() {
  return apiRequest('/api/ai-trips')
}

export async function getAiTripSession(sessionId) {
  return apiRequest(`/api/ai-trips/${sessionId}`)
}

export async function createAiTripSession(form, { language } = {}) {
  return apiRequest('/api/ai-trips/generate', {
    method: 'POST',
    body: {
      city: form.city,
      days: Number(form.days || 1),
      minBudget:
        form.minBudget === '' || form.minBudget === null || form.minBudget === undefined
          ? undefined
          : Number(form.minBudget),
      maxBudget:
        form.maxBudget === '' || form.maxBudget === null || form.maxBudget === undefined
          ? undefined
          : Number(form.maxBudget),
      people: Number(form.people || 1),
      style: form.style || 'all',
      prefs: Array.isArray(form.prefs) ? form.prefs : [],
      notes: form.notes || '',
      locale: language || 'ar',
    },
  })
}

export async function startAssistantSession(message, { language } = {}) {
  return apiRequest('/api/ai-trips/assistant', {
    method: 'POST',
    body: {
      message,
      locale: language || 'ar',
    },
  })
}

export async function chatAiTripSession(sessionId, message, { language } = {}) {
  return apiRequest(`/api/ai-trips/${sessionId}/chat`, {
    method: 'POST',
    body: {
      message,
      locale: language || 'ar',
    },
  })
}
