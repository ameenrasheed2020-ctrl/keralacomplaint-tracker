import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../../components/Navbar'
import { getIdeas, updateIdeaStatus, markIdeasViewed } from '../../data/ideaData'

const statusLabels = {
  pending: 'Pending',
  reviewed: 'Under review',
  implemented: 'Implemented',
  declined: 'Declined',
}

const AdminIdeas = () => {
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
    navigate('/admin/broadcast', { state: { pollQuestion: idea.title } })
  }

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="page-heading">
          <p className="eyebrow">{t('admin.ideas.heading')}</p>
          <h1>{t('admin.ideas.subheading')}</h1>
        </section>

        <section className="table-panel">
          <div className="table-header">
            <h2>{t('admin.ideas.queue')}</h2>
            <span>{ideas.length} {t('admin.ideas.total')}</span>
          </div>

          <div className="complaint-table">
            {ideas.map((idea) => (
              <article
                className="table-row"
                key={idea.id}
                onClick={() => navigate(`/admin/ideas/${idea.id}`)}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 8 }}
              >
                <div>
                  <strong>{idea.title}</strong>
                  <span>{idea.category} &middot; {idea.date}</span>
                  <span>{t('admin.ideas.by')} {idea.userName}</span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: 'rgba(251,246,234,0.7)', lineHeight: 1.5 }}>{idea.description}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
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
                    {t('admin.ideas.createPoll')}
                  </button>
                </div>
              </article>
            ))}
            {ideas.length === 0 && (
              <p style={{ padding: 16, color: 'rgba(251,246,234,0.5)' }}>{t('admin.ideas.empty')}</p>
            )}
          </div>
        </section>
      </main>
    </>
  )
}

export default AdminIdeas
