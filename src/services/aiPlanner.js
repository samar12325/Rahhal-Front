import { createAiTripSession } from './aiTrips'

export async function generatePlan(form, { language } = {}) {
  return createAiTripSession(form, { language })
}
