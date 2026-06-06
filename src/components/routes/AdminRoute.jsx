import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { buildLoginRedirectPath, isAdminUser, readStoredUser } from '../../auth/session'

function AdminRoute() {
  const location = useLocation()
  const currentUser = readStoredUser()
  const currentPath = `${location.pathname}${location.search}${location.hash}`

  if (!currentUser) {
    return <Navigate to={buildLoginRedirectPath(currentPath)} replace />
  }

  if (!isAdminUser(currentUser)) {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}

export default AdminRoute
