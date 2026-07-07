import { Link, useNavigate } from 'react-router-dom'
import heroPhoto from '../../assets/mla-crowd-wave.jpg'

const AdminLogin = () => {
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const role = formData.get('role')

    localStorage.setItem(
      'kct_user',
      JSON.stringify({
        name: formData.get('email'),
        email: formData.get('email'),
        role,
      }),
    )

    if (role === 'staff') {
      navigate('/staff')
    } else {
      navigate('/admin/dashboard')
    }
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
            <h1>Admin Login</h1>
          </div>
        </div>
        <p>Sign in as staff to manage complaints, or as MLA office to oversee the constituency dashboard.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" required />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Enter password" required />

          <label htmlFor="role">You are a</label>
          <select id="role" name="role" defaultValue="staff">
            <option value="staff">Staff member</option>
            <option value="admin">MLA office / Admin</option>
          </select>

          <button type="submit">Login</button>
        </form>

        <p className="auth-note">
          New here? <Link to="/admin/register">Create admin account</Link>
        </p>
        <p className="auth-note">
          Public user? <Link to="/login">Public login</Link>
        </p>
      </section>
    </main>
  )
}

export default AdminLogin
