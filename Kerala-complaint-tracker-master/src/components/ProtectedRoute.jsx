import { Navigate, Outlet, useLocation } from 'react-router-dom'

const MESSAGES = {
  '/complaints/new': 'Login to file a complaint',
  '/complaints': 'Login to file a complaint',
  '/ideas/new': 'Login to share your idea',
  '/ideas': 'Login to share your idea',
}

const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem('kct_user') || 'null')
  const location = useLocation()

  if (!user) {
    const message = Object.entries(MESSAGES).find(([path]) => location.pathname.startsWith(path))?.[1]
    return <Navigate to="/login" state={{ from: location.pathname, ...(message && { message }) }} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
