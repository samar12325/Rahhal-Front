export const CONTACT_INBOX_EVENT = 'rahhal-contact-inbox-change'

export function dispatchContactInboxChange() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CONTACT_INBOX_EVENT))
}
