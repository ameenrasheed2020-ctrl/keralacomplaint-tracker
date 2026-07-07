import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import heroPhoto from '../assets/mla-crowd-wave.jpg'

const DEFAULT_OTP = '1234'

const Register = () => {
  const navigate = useNavigate()
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
      JSON.stringify({
        name: phone,
        email: phone,
        phone,
        role: 'user',
      }),
    )

    navigate('/')
  }

  const handleBack = () => setStep('phone')

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
            <span>KC</span>
          </span>
          <div>
            <p className="eyebrow">Public registration</p>
            <h1>Register</h1>
          </div>
        </div>
        <p>Create a public account to submit complaints and vote on polls.</p>

        {step === 'phone' && (
          <form className="auth-form" onSubmit={handleSendOtp}>
            <label htmlFor="phone">Phone number</label>
            <input id="phone" name="phone" type="tel" placeholder="+91 98765 43210" required />

            <button type="submit">Send OTP</button>
          </form>
        )}

        {step === 'otp' && (
          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <p className="auth-otp-info">
              OTP sent to <strong>{phone}</strong>
            </p>

            <label htmlFor="otp">Enter OTP</label>
            <input id="otp" name="otp" type="text" inputMode="numeric" placeholder="1234" maxLength={4} required />

            <button type="submit">Verify &amp; Register</button>

            <button type="button" className="auth-back-btn" onClick={handleBack}>
              Change phone number
            </button>
          </form>
        )}

        <p className="auth-note">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  )
}

export default Register
