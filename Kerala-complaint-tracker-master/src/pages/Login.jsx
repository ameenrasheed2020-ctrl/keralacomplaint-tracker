import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import heroPhoto from '../assets/mla-crowd-wave.jpg'

const DEFAULT_OTP = '1234'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const from = location.state?.from || '/'
  const loginMessage = location.state?.message
  const [showAdmin, setShowAdmin] = useState(false)
  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')

  const handleSendOtp = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const p = formData.get('phone')
    if (!p) return
    setPhone(p)
    setStep('otp')
  }

  const handleVerifyOtp = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const otp = formData.get('otp')
    if (otp !== DEFAULT_OTP) return
    localStorage.setItem(
      'kct_user',
      JSON.stringify({ name: phone, email: phone, phone, role: 'user' }),
    )
    navigate(from, { replace: true })
  }

  const handleAdminLogin = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const role = formData.get('role')
    localStorage.setItem(
      'kct_user',
      JSON.stringify({ name: email, email, role }),
    )
    if (role === 'staff') navigate('/staff', { replace: true })
    else navigate('/admin/dashboard', { replace: true })
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
            <h1>{showAdmin ? t('auth.staffAdminLogin') : t('auth.login')}</h1>
          </div>
        </div>

        {loginMessage && (
          <p style={{ margin: '4px 0 0', textAlign: 'center', color: '#e2aa3e', fontSize: '13px', fontWeight: 500 }}>{loginMessage}</p>
        )}

        {showAdmin ? (
          <>
            <form className="auth-form" onSubmit={handleAdminLogin}>
              <label htmlFor="email">{t('auth.email')}</label>
              <input id="email" name="email" type="email" placeholder={t('auth.emailPlaceholder')} required />
              <label htmlFor="password">{t('auth.password')}</label>
              <input id="password" name="password" type="password" placeholder={t('auth.passwordPlaceholder')} required />
              <label htmlFor="role">{t('auth.iAmA')}</label>
              <select id="role" name="role" defaultValue="staff">
                <option value="staff">{t('auth.staffMember')}</option>
                <option value="admin">{t('auth.mlaOffice')}</option>
              </select>
              <button type="submit">{t('auth.loginButton')}</button>
            </form>
            <p className="auth-note">
              <button type="button" className="auth-link-btn" onClick={() => setShowAdmin(false)}>{t('auth.publicLogin')}</button>
            </p>
            <p className="auth-note">
              {t('auth.newHere')} <Link to="/register">{t('auth.registerAsStaff')}</Link>
            </p>
          </>
        ) : (
          <>
            {step === 'phone' && (
              <form className="auth-form" onSubmit={handleSendOtp}>
                <label htmlFor="phone">{t('auth.phone')}</label>
                <input id="phone" name="phone" type="tel" placeholder={t('auth.phonePlaceholder')} required />
                <button type="submit">{t('auth.sendOtp')}</button>
              </form>
            )}
            {step === 'otp' && (
              <form className="auth-form" onSubmit={handleVerifyOtp}>
                <p className="auth-otp-info">{t('auth.otpSentTo')} <strong>{phone}</strong></p>
                <label htmlFor="otp">{t('auth.enterOtp')}</label>
                <input id="otp" name="otp" type="text" inputMode="numeric" placeholder={t('auth.otpPlaceholder')} maxLength={4} required />
                <button type="submit">{t('auth.verify')}</button>
                <button type="button" className="auth-back-btn" onClick={() => setStep('phone')}>{t('auth.changePhone')}</button>
              </form>
            )}
            <p className="auth-note">
              <button type="button" className="auth-link-btn" onClick={() => setShowAdmin(true)}>{t('auth.loginAsStaff')}</button>
            </p>
          </>
        )}

      </section>
    </main>
  )
}

export default Login
