import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import './i18n/i18n'
import ProtectedRoute from './components/ProtectedRoute'
import RoleBasedRoute from './components/RoleBasedRoute'
import Home from './pages/Home'
import Detail from './pages/Detail'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminBroadcast from './pages/admin/AdminBroadcast'
import AdminComplaintDetail from './pages/admin/AdminComplaintDetail'
import AdminComplaints from './pages/admin/AdminComplaints'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminIdeas from './pages/admin/AdminIdeas'
import AdminIdeaDetail from './pages/admin/AdminIdeaDetail'
import Broadcast from './pages/staff/Broadcast'
import Polls from './pages/staff/Polls'
import StaffDashboard from './pages/staff/StaffDashboard'
import StaffIdeas from './pages/staff/StaffIdeas'
import ComplaintDetails from './pages/user/ComplaintDetails'
import NewComplaint from './pages/user/NewComplaint'
import NewIdea from './pages/user/NewIdea'
import TrackComplaint from './pages/user/TrackComplaint'
import UserDashboard from './pages/user/UserDashboard'
import ChatBot from './components/ChatBot'

if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
}

const getUser = () => JSON.parse(localStorage.getItem('kct_user') || 'null')

const DashboardRedirect = () => {
  const user = getUser()

  if (user?.role === 'staff') {
    return <Navigate to="/staff" replace />
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  }

  return <Navigate to="/user/dashboard" replace />
}

const Landing = () => {
  const user = getUser()

  if (user?.role === 'staff' || user?.role === 'admin') {
    return <DashboardRedirect />
  }

  return <Home />
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/track" element={<TrackComplaint />} />
          <Route path="/complaints/new" element={<NewComplaint />} />
          <Route path="/complaints/:id" element={<ComplaintDetails />} />
          <Route path="/ideas/new" element={<NewIdea />} />
        </Route>

        <Route element={<RoleBasedRoute allowedRoles={['staff']} />}>
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/broadcast" element={<Broadcast />} />
          <Route path="/staff/polls" element={<Polls />} />
          <Route path="/staff/ideas" element={<StaffIdeas />} />
        </Route>

        <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/broadcast" element={<AdminBroadcast />} />
          <Route path="/admin/ideas" element={<AdminIdeas />} />
          <Route path="/admin/ideas/:id" element={<AdminIdeaDetail />} />
          <Route path="/admin/complaints" element={<AdminComplaints />} />
          <Route path="/admin/complaints/:id" element={<AdminComplaintDetail />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ChatBot />
    </BrowserRouter>
  )
}

export default App
