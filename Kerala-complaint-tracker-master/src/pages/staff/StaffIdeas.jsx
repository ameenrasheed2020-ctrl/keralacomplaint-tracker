import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../../components/Navbar'
import { getIdeas, updateIdeaStatus, markIdeasViewed } from '../../data/ideaData'
import { getPublicPolls, savePublicPolls } from '../../data/communityData'

const statusLabels = {
  pending: 'Pending',
  reviewed: 'Under review',
  implemented: 'Implemented',
  declined: 'Declined',
}

const defaultOptions = [
  'Yes, with regulations',
  'No',
  'Need more discussion',
]

const StaffIdeas = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [ideas, setIdeas] = useState(getIdeas)

  useEffect(() => {
    const ids = ideas.map((i) => i.id)
    const next = markIdeasViewed(ids)
    setIdeas(next)
  }, [])

  const handleStatusChange = (id, newStatus) => {
    const next = updateIdeaStatus(id, newStatus)
    setIdeas(next)
  }

  const handleCreatePoll = (idea) => {
    const polls = getPublicPolls()
    const newPoll = {
      id: `POLL-${String(polls.length + 1).padStart(3, '0')}`,
      question: idea.title,
      audience: 'All public users',
      options: [...defaultOptions],
      votes: Object.fromEntries(defaultOptions.map((o) => [o, 0])),
      status: 'draft',
    }
    const next = [newPoll, ...polls]
    savePublicPolls(next)
    navigate('/staff/polls')
  }

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="page-heading">
          <p className="eyebrow">{t('staff.ideas.heading')}</p>
          <h1>{t('staff.ideas.subheading')}</h1>
        </section>

        <section className="table-panel">
          <div className="table-header">
            <h2>{t('staff.ideas.queue')}</h2>
            <span>{ideas.length} {t('staff.ideas.total')}</span>
          </div>

          <div className="complaint-table">
            {ideas.map((idea) => (
              <article className="table-row" key={idea.id}>
                <div>
                  <strong>{idea.title}</strong>
                  <span>{idea.category} &middot; {idea.date}</span>
                  <span>{t('staff.ideas.by')} {idea.userName}</span>
                </div>
                <p style={{ gridColumn: '2 / -1', margin: '4px 0', fontSize: '14px', color: 'rgba(251,246,234,0.7)' }}>{idea.description}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <select
                    className={`status-select status-select--${idea.status}`}
                    value={idea.status}
                    onChange={(e) => handleStatusChange(idea.id, e.target.value)}
                  >
                    <option value="pending">{statusLabels.pending}</option>
                    <option value="reviewed">{statusLabels.reviewed}</option>
                    <option value="implemented">{statusLabels.implemented}</option>
                    <option value="declined">{statusLabels.declined}</option>
                  </select>
                  <button className="row-action" type="button" onClick={() => handleCreatePoll(idea)}>
                    {t('staff.ideas.createPoll')}
                  </button>
                </div>
              </article>
            ))}
            {ideas.length === 0 && (
              <p style={{ padding: 16, color: 'rgba(251,246,234,0.5)' }}>{t('staff.ideas.empty')}</p>
            )}
          </div>
        </section>
      </main>
    </>
  )
}

export default StaffIdeas
