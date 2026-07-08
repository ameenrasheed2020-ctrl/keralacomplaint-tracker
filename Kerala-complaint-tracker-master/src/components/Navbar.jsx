import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Navbar = () => {
  const { t, i18n } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const user = JSON.parse(localStorage.getItem('kct_user') || 'null')

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    localStorage.removeItem('kct_user')
    closeMenu()
    window.location.href = '/'
  }

  const toggleLang = () => {
    const next = i18n.language === 'ml' ? 'en' : 'ml'
    i18n.changeLanguage(next)
    localStorage.setItem('kct_lang', next)
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
            <span className="nav-seal-text">{t('nav.kc')}</span>
          </span>
          <span className="nav-brand-text">{t('nav.keralaComplaintTracker')}</span>
        </Link>

        <button
          type="button"
          className={`nav-toggle${menuOpen ? ' open' : ''}`}
          aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`nav-collapse${menuOpen ? ' open' : ''}`}>
        <nav className="nav-menu" aria-label={t('nav.mainNav')} onClick={closeMenu}>
          {(!user || user?.role === 'user') && <Link className="nav-link-tab" to="/" state={{ tab: 'programs' }} onClick={closeMenu}>{t('nav.programs')}</Link>}
          {(!user || user?.role === 'user') && <Link className="nav-link-tab" to="/" state={{ tab: 'notifications' }} onClick={closeMenu}>{t('nav.notifications')}</Link>}
          {(!user || user?.role === 'user') && <Link className="nav-link-tab" to="/" state={{ tab: 'polls' }} onClick={closeMenu}>{t('nav.polls')}</Link>}
          {user?.role === 'staff' && <NavLink to="/staff">{t('nav.queue')}</NavLink>}
          {user?.role === 'staff' && <NavLink to="/staff/broadcast">{t('nav.broadcast')}</NavLink>}
          {user?.role === 'staff' && <NavLink to="/staff/polls">{t('nav.polls')}</NavLink>}
          {user?.role === 'staff' && <NavLink to="/staff/ideas">{t('nav.ideas')}</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin/dashboard">{t('nav.overview')}</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin/broadcast">{t('nav.broadcast')}</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin/ideas">{t('nav.ideas')}</NavLink>}
        </nav>

        <div className="nav-end">
          <button className="nav-lang-btn" type="button" onClick={toggleLang} aria-label="Switch language">
            {i18n.language === 'ml' ? 'EN' : 'മലയാളം'}
          </button>
          {user ? (
            <button className="nav-button" type="button" onClick={handleLogout}>
              {t('nav.logout')}
            </button>
          ) : (
            <Link className="nav-button" to="/login" onClick={closeMenu}>
              {t('nav.login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
