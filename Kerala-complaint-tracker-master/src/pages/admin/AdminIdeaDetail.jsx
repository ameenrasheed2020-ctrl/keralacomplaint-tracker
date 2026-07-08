import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../../components/Navbar'
import { getIdeas, updateIdeaStatus, markIdeasViewed } from '../../data/ideaData'

const statusLabels = {
  pending: 'Pending',
  reviewed: 'Under review',
  implemented: 'Implemented',
  declined: 'Declined',
}

const AdminIdeaDetail = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const allIdeas = getIdeas()
  const [idea, setIdea] = useState(allIdeas.find((i) => i.id === id))

  useEffect(() => {
    if (idea) {
      const next = markIdeasViewed([idea.id])
      setIdea(next.find((i) => i.id === id))
    }
  }, [])

  if (!idea) {
    return (
      <>
        <Navbar />
        <main className="page-shell narrow">
          <p>Idea not found.</p>
          <Link to="/admin/ideas">{t('admin.ideas.heading')}</Link>
        </main>
      </>
    )
  }

  const handleStatusChange = (e) => {
    const next = updateIdeaStatus(idea.id, e.target.value)
    setIdea(next.find((i) => i.id === idea.id))
  }

  const handleCreatePoll = () => {
    navigate('/admin/broadcast', { state: { pollQuestion: idea.title } })
  }

  return (
    <>
      <Navbar />
      <main className="page-shell narrow">
        <section className="page-heading">
          <Link to="/admin/ideas" className="back-link">&larr; {t('admin.ideas.heading')}</Link>
          <p className="eyebrow">{t('admin.ideas.subheading')}</p>
          <h1>{idea.title}</h1>
        </section>

        <section className="detail-panel" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <strong>Category</strong>
            <p>{idea.category}</p>
          </div>

          <div>
            <strong>Description</strong>
            <p style={{ lineHeight: 1.7 }}>{idea.description}</p>
          </div>

          <div>
            <strong>Submitted by</strong>
            <p>{idea.userName}</p>
          </div>

          <div>
            <strong>Date</strong>
            <p>{idea.date}</p>
          </div>

          <div>
            <strong>Status</strong>
            <select
              className={`status-select status-select--${idea.status}`}
              value={idea.status}
              onChange={handleStatusChange}
            >
              <option value="pending">{statusLabels.pending}</option>
              <option value="reviewed">{statusLabels.reviewed}</option>
              <option value="implemented">{statusLabels.implemented}</option>
              <option value="declined">{statusLabels.declined}</option>
            </select>
          </div>

          <button className="row-action" type="button" onClick={handleCreatePoll} style={{ alignSelf: 'flex-start' }}>
            {t('admin.ideas.createPoll')}
          </button>
        </section>
      </main>
    </>
  )
}

export default AdminIdeaDetail
