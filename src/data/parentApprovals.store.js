const STORAGE_KEY = 'rahhalSchoolParentApprovals'

const canUseStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const readApprovals = () => {
  if (!canUseStorage()) return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeApprovals = (approvals) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(approvals))
}

const createApprovalToken = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replaceAll('-', '')
  }

  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`
}

export const getParentApprovals = readApprovals

export const createParentApproval = ({ studentName, parentName, parentPhone, tripName }) => {
  const approvals = readApprovals()
  let approvalToken = createApprovalToken()

  while (approvals.some((approval) => approval.approvalToken === approvalToken)) {
    approvalToken = createApprovalToken()
  }

  const approval = {
    id: Date.now(),
    studentName,
    parentName,
    parentPhone,
    tripName,
    approvalStatus: 'pending',
    approvalToken,
    approvalLink: `/parent-approval/${approvalToken}`,
  }

  writeApprovals([approval, ...approvals])
  return approval
}

export const deleteParentApproval = (id) => {
  const nextApprovals = readApprovals().filter((approval) => approval.id !== id)
  writeApprovals(nextApprovals)
  return nextApprovals
}

export const findParentApprovalByToken = (approvalToken) =>
  readApprovals().find((approval) => approval.approvalToken === approvalToken) || null

export const updateParentApprovalStatus = (approvalToken, approvalStatus) => {
  const approvals = readApprovals()
  const nextApprovals = approvals.map((approval) =>
    approval.approvalToken === approvalToken
      ? { ...approval, approvalStatus }
      : approval,
  )
  writeApprovals(nextApprovals)
  return nextApprovals.find((approval) => approval.approvalToken === approvalToken) || null
}
