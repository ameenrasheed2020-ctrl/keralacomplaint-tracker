import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import heroPhoto from '../assets/mla-crowd-wave.jpg'

const Register = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    localStorage.setItem(
      'kct_user',
      JSON.stringify({
        name: formData.get('email'),
        email: formData.get('email'),
        role: 'staff',
      }),
    )
    navigate('/login')
  }

  return (
    <main className="auth-screen auth-screen--photo" style={{ backgroundImage: `url(${heroPhoto})` }}>
      <div className="auth-screen-overlay" />
      <section className="auth-box">
        <div className="auth-box-header">
          <span className="auth-box-seal">
            <svg viewBox="0 0 40 40" aria-hidden="true">
              <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="20" cy="20" r="15.5" fill="none" stroke="currentColor" strokeWidth="0.75" />
            </svg>
            <span>{t('auth.kc')}</span>
          </span>
          <div>
            <p className="eyebrow">{t('auth.staffRegistration')}</p>
            <h1>{t('auth.register')}</h1>
          </div>
        </div>
        <p>{t('auth.registerDescription')}</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">{t('auth.email')}</label>
          <input id="email" name="email" type="email" placeholder={t('auth.emailPlaceholder')} required />
          <label htmlFor="password">{t('auth.password')}</label>
          <input id="password" name="password" type="password" placeholder={t('auth.createPasswordPlaceholder')} required />
          <button type="submit">{t('auth.createAccount')}</button>
        </form>

        <p className="auth-note">
          {t('auth.alreadyRegistered')} <Link to="/login">{t('auth.login')}</Link>
        </p>
      </section>
    </main>
  )
}

export default Register
