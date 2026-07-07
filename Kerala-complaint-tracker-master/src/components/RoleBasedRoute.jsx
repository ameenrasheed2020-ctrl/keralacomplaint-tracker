import { Navigate, Outlet } from 'react-router-dom'

const RoleBasedRoute = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('kct_user') || 'null')

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    const fallbackPath =
      user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/complaints/new'

    return <Navigate to={fallbackPath} replace />
  }

  return <Outlet />
}

export default RoleBasedRoute
