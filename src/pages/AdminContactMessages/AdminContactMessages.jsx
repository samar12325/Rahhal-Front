import { useCallback, useEffect, useMemo, useState } from 'react'
import '../Home/Home.css'
import '../AdminTrips/AdminTrips.css'
import './AdminContactMessages.css'
import { apiRequest } from '../../api/client'
import { useLanguage } from '../../i18n/LanguageContext'
import { dispatchContactInboxChange } from '../../utils/contactInbox'

const copy = {
  ar: {
    eyebrow: 'لوحة الإدارة',
    title: 'الوارد',
    subtitle: 'راجع رسائل التواصل، افتح التفاصيل، ورد على الرسائل من مكان واحد.',
    stats: {
      total: 'إجمالي الرسائل',
      unread: 'غير المقروءة',
      sent: 'تم الرد',
      failed: 'فشل الرد',
    },
    filters: {
      all: 'الكل',
      new: 'جديد',
      sent: 'تم الرد',
      failed: 'فشل',
    },
    searchLabel: 'بحث',
    searchPlaceholder: 'ابحث بالاسم أو البريد أو نص الرسالة',
    searchButton: 'بحث',
    retry: 'إعادة التحميل',
    empty: 'لا توجد رسائل مطابقة.',
    loadFailed: 'تعذر تحميل الرسائل.',
    loading: 'جارٍ تحميل الرسائل...',
    successReply: 'تم إرسال الرد بنجاح.',
    status: {
      new: 'جديدة',
      sent: 'تم الرد',
      failed: 'فشل',
    },
    type: {
      inquiry: 'استفسار',
      suggestion: 'اقتراح',
      complaint: 'شكوى',
      partnership: 'شراكة',
    },
    table: {
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      type: 'النوع',
      message: 'الرسالة',
      status: 'الحالة',
      sentAt: 'تاريخ الإرسال',
      readAt: 'تاريخ القراءة',
      details: 'عرض التفاصيل',
      reply: 'رد',
    },
    details: {
      title: 'تفاصيل الرسالة',
      close: 'إغلاق',
      sentAt: 'تاريخ الإرسال',
      readAt: 'تاريخ القراءة',
      ip: 'IP',
      userAgent: 'User Agent',
      error: 'تفاصيل الخطأ',
      subject: 'عنوان الرد',
      replyMessage: 'نص الرد',
      send: 'إرسال الرد',
      sending: 'جارٍ الإرسال...',
      noReadAt: 'لم تُقرأ بعد',
      noError: 'لا يوجد',
      defaultSubject: 'رد على رسالتك',
    },
    dash: '-',
  },
  en: {
    eyebrow: 'Admin panel',
    title: 'Inbox',
    subtitle: 'Review contact messages, inspect details, and send replies from one page.',
    stats: {
      total: 'Total messages',
      unread: 'Unread',
      sent: 'Replied',
      failed: 'Failed',
    },
    filters: {
      all: 'All',
      new: 'New',
      sent: 'Replied',
      failed: 'Failed',
    },
    searchLabel: 'Search',
    searchPlaceholder: 'Search by name, email, or message',
    searchButton: 'Search',
    retry: 'Retry',
    empty: 'No matching messages.',
    loadFailed: 'Unable to load messages.',
    loading: 'Loading messages...',
    successReply: 'Reply sent successfully.',
    status: {
      new: 'New',
      sent: 'Sent',
      failed: 'Failed',
    },
    type: {
      inquiry: 'Inquiry',
      suggestion: 'Suggestion',
      complaint: 'Complaint',
      partnership: 'Partnership',
    },
    table: {
      name: 'Name',
      email: 'Email',
      type: 'Type',
      message: 'Message',
      status: 'Status',
      sentAt: 'Submitted at',
      readAt: 'Read at',
      details: 'Details',
      reply: 'Reply',
    },
    details: {
      title: 'Message details',
      close: 'Close',
      sentAt: 'Submitted at',
      readAt: 'Read at',
      ip: 'IP',
      userAgent: 'User Agent',
      error: 'Error details',
      subject: 'Reply subject',
      replyMessage: 'Reply message',
      send: 'Send reply',
      sending: 'Sending...',
      noReadAt: 'Not read yet',
      noError: 'None',
      defaultSubject: 'Reply to your message',
    },
    dash: '-',
  },
}

function formatDate(value, locale, emptyLabel) {
  if (!value) return emptyLabel
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return emptyLabel
  }
}

function AdminContactMessages() {
  const { language, dir } = useLanguage()
  const text = copy[language] ?? copy.ar
  const locale = language === 'ar' ? 'ar-SA' : 'en-US'
  const [filter, setFilter] = useState('all')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [banner, setBanner] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [replySubject, setReplySubject] = useState('')
  const [replyMessage, setReplyMessage] = useState('')
  const [replyLoading, setReplyLoading] = useState(false)
  const [replyError, setReplyError] = useState('')

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const params = new URLSearchParams()
      if (filter !== 'all') params.set('status', filter)
      if (search) params.set('q', search)
      const payload = await apiRequest(`/admin/contact-messages?${params.toString()}`)
      setItems(Array.isArray(payload?.items) ? payload.items : [])
    } catch (err) {
      setError(err?.message || text.loadFailed)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [filter, search, text.loadFailed])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const stats = useMemo(() => {
    const unread = items.filter((item) => !item.readAt).length
    const sent = items.filter((item) => item.status === 'sent').length
    const failed = items.filter((item) => item.status === 'failed').length
    return { total: items.length, unread, sent, failed }
  }, [items])

  const openMessage = async (message, replyMode = false) => {
    try {
      setSelectedId(message.id)
      setDetailsLoading(true)
      setReplyError('')
      setBanner('')
      const wasUnread = !message.readAt
      const payload = await apiRequest(`/admin/contact-messages/${message.id}`)
      setSelectedMessage(payload)
      setReplySubject(replyMode ? text.details.defaultSubject : '')
      setReplyMessage('')
      setItems((prev) =>
        prev.map((item) => (item.id === message.id ? { ...item, ...payload } : item)),
      )
      if (wasUnread) dispatchContactInboxChange()
    } catch (err) {
      setError(err?.message || text.loadFailed)
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleReplySubmit = async (event) => {
    event.preventDefault()
    if (!selectedId) return

    try {
      setReplyLoading(true)
      setReplyError('')
      setBanner('')
      const payload = await apiRequest(`/admin/contact-messages/${selectedId}/reply`, {
        method: 'PATCH',
        body: {
          subject: replySubject,
          reply_message: replyMessage,
        },
      })
      setSelectedMessage(payload?.item ?? null)
      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedId ? { ...item, ...(payload?.item ?? {}) } : item,
        ),
      )
      setBanner(payload?.ok ? text.successReply : payload?.message || '')
      if (!payload?.ok) setReplyError(payload?.message || '')
      dispatchContactInboxChange()
    } catch (err) {
      setReplyError(err?.message || text.loadFailed)
    } finally {
      setReplyLoading(false)
    }
  }

  return (
    <div className="home adminTripsPage adminContactMessagesPage" dir={dir}>
      <main className="adminTripsMain">
        <section className="adminHero">
          <div className="adminHeroText">
            <p className="adminEyebrow">{text.eyebrow}</p>
            <h1>{text.title}</h1>
            <p className="adminSubtitle">{text.subtitle}</p>
          </div>
          <div className="adminHeroActions adminStatsGrid">
            <div className="adminStat">
              <span>{text.stats.total}</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="adminStat">
              <span>{text.stats.unread}</span>
              <strong>{stats.unread}</strong>
            </div>
            <div className="adminStat">
              <span>{text.stats.sent}</span>
              <strong>{stats.sent}</strong>
            </div>
            <div className="adminStat">
              <span>{text.stats.failed}</span>
              <strong>{stats.failed}</strong>
            </div>
          </div>
        </section>

        <section className="adminToolbar inboxToolbar">
          <div className="approvalsFilters">
            {Object.entries(text.filters).map(([value, label]) => (
              <button
                key={value}
                className={`filterChip ${filter === value ? 'active' : ''}`}
                type="button"
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <form
            className="adminFilters inboxSearchForm"
            onSubmit={(event) => {
              event.preventDefault()
              setSearch(searchInput.trim())
            }}
          >
            <div className="field">
              <label htmlFor="contact-search">{text.searchLabel}</label>
              <input
                id="contact-search"
                className="input"
                type="search"
                placeholder={text.searchPlaceholder}
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </div>
            <button className="primaryBtn" type="submit">
              {text.searchButton}
            </button>
          </form>
        </section>

        {banner ? <p className="adminInboxBanner success">{banner}</p> : null}
        {error ? <p className="adminInboxBanner error">{error}</p> : null}

        <section className="adminInboxTableWrap">
          {loading ? (
            <div className="adminEmptyState">
              <h3>{text.loading}</h3>
            </div>
          ) : items.length ? (
            <table className="adminInboxTable">
              <thead>
                <tr>
                  <th>{text.table.name}</th>
                  <th>{text.table.email}</th>
                  <th>{text.table.type}</th>
                  <th>{text.table.message}</th>
                  <th>{text.table.status}</th>
                  <th>{text.table.sentAt}</th>
                  <th>{text.table.readAt}</th>
                  <th>{text.table.details}</th>
                  <th>{text.table.reply}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className={!item.readAt ? 'unread' : ''}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{text.type[item.type] ?? item.type}</td>
                    <td className="inboxMessageCell">{item.message}</td>
                    <td>
                      <span className={`contactStatusBadge ${item.status}`}>
                        {text.status[item.status] ?? item.status}
                      </span>
                    </td>
                    <td>{formatDate(item.createdAt, locale, text.dash)}</td>
                    <td>{formatDate(item.readAt, locale, text.dash)}</td>
                    <td>
                      <button
                        className="secondaryBtn"
                        type="button"
                        onClick={() => openMessage(item, false)}
                      >
                        {text.table.details}
                      </button>
                    </td>
                    <td>
                      <button
                        className="primaryBtn"
                        type="button"
                        onClick={() => openMessage(item, true)}
                      >
                        {text.table.reply}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="adminEmptyState">
              <h3>{text.empty}</h3>
              <button className="secondaryBtn" type="button" onClick={fetchItems}>
                {text.retry}
              </button>
            </div>
          )}
        </section>
      </main>

      {selectedId ? (
        <div className="adminModal" role="dialog" aria-modal="true">
          <div className="adminModalCard adminInboxModalCard">
            <button
              className="modalClose"
              type="button"
              onClick={() => {
                setSelectedId(null)
                setSelectedMessage(null)
                setReplySubject('')
                setReplyMessage('')
                setReplyError('')
              }}
              aria-label={text.details.close}
            >
              x
            </button>
            {detailsLoading || !selectedMessage ? (
              <p>{text.loading}</p>
            ) : (
              <>
                <p className="adminEyebrow">{text.details.title}</p>
                <h3>{selectedMessage.name}</h3>
                <div className="adminInboxDetailsGrid">
                  <div className="approvalRow">
                    <span>{text.table.email}</span>
                    <strong>{selectedMessage.email}</strong>
                  </div>
                  <div className="approvalRow">
                    <span>{text.table.type}</span>
                    <strong>{text.type[selectedMessage.type] ?? selectedMessage.type}</strong>
                  </div>
                  <div className="approvalRow">
                    <span>{text.details.sentAt}</span>
                    <strong>{formatDate(selectedMessage.createdAt, locale, text.dash)}</strong>
                  </div>
                  <div className="approvalRow">
                    <span>{text.details.readAt}</span>
                    <strong>
                      {formatDate(selectedMessage.readAt, locale, text.details.noReadAt)}
                    </strong>
                  </div>
                  <div className="approvalRow">
                    <span>{text.details.ip}</span>
                    <strong>{selectedMessage.ipAddress || text.dash}</strong>
                  </div>
                  <div className="approvalRow">
                    <span>{text.details.userAgent}</span>
                    <strong>{selectedMessage.userAgent || text.dash}</strong>
                  </div>
                </div>

                <div className="adminInboxLongBlock">
                  <span>{text.table.message}</span>
                  <p>{selectedMessage.message}</p>
                </div>

                <div className="adminInboxLongBlock">
                  <span>{text.details.error}</span>
                  <p>{selectedMessage.errorMessage || text.details.noError}</p>
                </div>

                <form className="adminForm" onSubmit={handleReplySubmit}>
                  <div className="field">
                    <label htmlFor="reply-subject">{text.details.subject}</label>
                    <input
                      id="reply-subject"
                      className="input"
                      value={replySubject}
                      onChange={(event) => setReplySubject(event.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="reply-message">{text.details.replyMessage}</label>
                    <textarea
                      id="reply-message"
                      className="input"
                      rows="6"
                      value={replyMessage}
                      onChange={(event) => setReplyMessage(event.target.value)}
                    />
                  </div>
                  {replyError ? <p className="adminInboxBanner error">{replyError}</p> : null}
                  <div className="adminModalActions">
                    <button className="primaryBtn" type="submit" disabled={replyLoading}>
                      {replyLoading ? text.details.sending : text.details.send}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default AdminContactMessages
