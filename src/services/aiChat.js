import { chatAiTripSession } from './aiTrips'

export async function chatAndPatchPlan({ sessionId, message, language }) {
  return chatAiTripSession(sessionId, message, { language })
}
