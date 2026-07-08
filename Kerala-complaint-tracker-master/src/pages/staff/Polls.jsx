import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '../../components/Navbar'
import { getPublicPolls, savePublicPolls } from '../../data/communityData'

const Polls = () => {
  const { t } = useTranslation()
  const [polls, setPolls] = useState(getPublicPolls)

  const handleStatusChange = (id, newStatus) => {
    const next = polls.map((p) =>
      p.id === id ? { ...p, status: newStatus } : p
    )
    setPolls(next)
    savePublicPolls(next)
  }

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="page-heading">
          <p className="eyebrow">{t('staff.polls.heading')}</p>
          <h1>{t('staff.polls.description')}</h1>
        </section>

        <section className="table-panel">
          <div className="table-header">
            <h2>{t('staff.polls.heading')}</h2>
            <span>{polls.length} total</span>
          </div>

          <div className="complaint-table">
            {polls.map((poll) => (
              <article className="table-row" key={poll.id}>
                <div>
                  <strong>{poll.question}</strong>
                  <span>{poll.audience} &middot; {poll.id}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  <select
                    className={`status-select status-select--${poll.status}`}
                    value={poll.status}
                    onChange={(e) => handleStatusChange(poll.id, e.target.value)}
                  >
                    <option value="draft">{t('staff.polls.draft')}</option>
                    <option value="published">{t('staff.polls.active')}</option>
                  </select>
                </div>
              </article>
            ))}
            {polls.length === 0 && (
              <p style={{ padding: 16, color: 'rgba(251,246,234,0.5)' }}>{t('staff.polls.empty')}</p>
            )}
          </div>
        </section>
      </main>
    </>
  )
}

export default Polls
