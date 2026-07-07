import { Link, useNavigate } from 'react-router-dom'
import heroPhoto from '../../assets/mla-crowd-wave.jpg'

const AdminRegister = () => {
  const navigate = useNavigate()

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

    navigate('/admin/login')
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
            <span>KC</span>
          </span>
          <div>
            <p className="eyebrow">Staff &amp; MLA office</p>
            <h1>Admin Registration</h1>
          </div>
        </div>
        <p>Register as staff to manage the constituency platform.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" required />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Create password" required />

          <button type="submit">Create account</button>
        </form>

        <p className="auth-note">
          Already registered? <Link to="/admin/login">Admin login</Link>
        </p>
      </section>
    </main>
  )
}

export default AdminRegister