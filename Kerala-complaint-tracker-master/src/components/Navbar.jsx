import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const user = JSON.parse(localStorage.getItem('kct_user') || 'null')

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    const role = user?.role
    localStorage.removeItem('kct_user')
    closeMenu()
    navigate(role === 'admin' || role === 'staff' ? '/admin/login' : '/login')
  }

  return (
    <header className="app-navbar">
      <div className="navbar-top">
        <Link className="nav-brand" to="/" onClick={closeMenu}>
          <span className="nav-seal" aria-hidden="true">
            <svg viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="20" cy="20" r="15.5" fill="none" stroke="currentColor" strokeWidth="0.75" />
            </svg>
            <span className="nav-seal-text">KC</span>
          </span>
          <span className="nav-brand-text">Kerala Complaint Tracker</span>
        </Link>

        <button
          type="button"
          className={`nav-toggle${menuOpen ? ' open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`nav-collapse${menuOpen ? ' open' : ''}`}>
        <nav className="nav-menu" aria-label="Main navigation" onClick={closeMenu}>
          {!user && <NavLink to="/complaints/new">File a complaint</NavLink>}
          {(!user || user?.role === 'user') && <Link className="nav-link-tab" to="/" state={{ tab: 'programs' }} onClick={closeMenu}>Programs</Link>}
          {(!user || user?.role === 'user') && <Link className="nav-link-tab" to="/" state={{ tab: 'notifications' }} onClick={closeMenu}>Notifications</Link>}
          {(!user || user?.role === 'user') && <Link className="nav-link-tab" to="/" state={{ tab: 'polls' }} onClick={closeMenu}>Polls</Link>}
          {user?.role === 'user' && <NavLink to="/complaints/new">New complaint</NavLink>}
          {user?.role === 'staff' && <NavLink to="/staff">Queue</NavLink>}
          {user?.role === 'staff' && <NavLink to="/staff/broadcast">Broadcast</NavLink>}
          {user?.role === 'staff' && <NavLink to="/staff/polls">Polls</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin/dashboard">Overview</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin/broadcast">Broadcast</NavLink>}
        </nav>

        <div className="nav-end">
          {user ? (
            <button className="nav-button" type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <Link className="nav-button" to="/login" onClick={closeMenu}>
                Public Login
              </Link>
              <Link className="nav-button" to="/admin/login" onClick={closeMenu}>
                Admin Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
