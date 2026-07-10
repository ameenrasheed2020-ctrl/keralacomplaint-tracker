import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../../components/Navbar'
import { LuSearch } from 'react-icons/lu'

const TrackComplaint = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [inputId, setInputId] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const id = inputId.trim().toUpperCase()
    if (id) navigate(`/complaints/${id}`)
  }

  return (
    <>
      <Navbar />
      <main className="page-shell narrow">
        <section className="page-heading" style={{ textAlign: 'center' }}>
          <p className="eyebrow">{t('trackProgress', 'Track Progress')}</p>
          <h1>Track Your Complaint</h1>
          <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
            Enter the tracking ID you received after filing your complaint.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="panel-form" style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="trackId">Tracking ID</label>
            <input
              id="trackId"
              type="text"
              placeholder="e.g. KCT-2026-0003"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              required
              style={{ textTransform: 'uppercase' }}
            />
          </div>
          <button type="submit" className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <LuSearch size={16} /> Track
          </button>
        </form>
      </main>
    </>
  )
}

export default TrackComplaint
