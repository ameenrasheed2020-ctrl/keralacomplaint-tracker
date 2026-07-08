import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../../components/Navbar'
import { addIdea, getIdeas } from '../../data/ideaData'

const categories = [
  { key: 'Infrastructure', label: 'ideas.catInfrastructure' },
  { key: 'Health & Sanitation', label: 'ideas.catHealth' },
  { key: 'Education', label: 'ideas.catEducation' },
  { key: 'Agriculture', label: 'ideas.catAgriculture' },
  { key: 'Public Safety', label: 'ideas.catSafety' },
  { key: 'Environment', label: 'ideas.catEnvironment' },
  { key: 'Culture & Sports', label: 'ideas.catCulture' },
  { key: 'Other', label: 'ideas.catOther' },
]

const NewIdea = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const ideaMessage = location.state?.message
  const user = JSON.parse(localStorage.getItem('kct_user') || 'null')
  const [submitted, setSubmitted] = useState(false)
  const [latestIdea, setLatestIdea] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const next = addIdea(
      {
        title: formData.get('title'),
        category: formData.get('category'),
        description: formData.get('description'),
      },
      user,
    )
    const created = next[0]
    setLatestIdea(created)
    setSubmitted(true)

    const myIdeas = JSON.parse(localStorage.getItem('kct_my_ideas') || '[]')
    if (!myIdeas.includes(created.id)) {
      myIdeas.push(created.id)
      localStorage.setItem('kct_my_ideas', JSON.stringify(myIdeas))
    }
  }

  useEffect(() => {
    if (submitted && latestIdea) {
      const interval = setInterval(() => {
        const updated = getIdeas().find((i) => i.id === latestIdea.id)
        if (updated) setLatestIdea(updated)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [submitted])

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="page-shell narrow">
        <section className="page-heading">
          <div>
            <p className="eyebrow">{t('ideas.eyebrow')}</p>
            <h1>{t('ideas.thanks')}</h1>
          </div>
        </section>
          <section className="table-panel">
            <p>{t('ideas.thanksBody')}</p>
            {latestIdea && (
              <p style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: '13px', fontWeight: 600,
                  color: latestIdea.viewed ? 'var(--green-700)' : 'var(--ink-faint)',
                }}>
                  <span style={{ fontSize: '16px' }}>{latestIdea.viewed ? '✓' : '○'}</span>
                  {latestIdea.viewed ? 'Seen by MLA office' : 'Awaiting review'}
                </span>
              </p>
            )}
            <button className="lp-btn lp-btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>
              {t('ideas.backHome')}
            </button>
          </section>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="page-shell narrow">
        <section className="page-heading">
          <div>
            <p className="eyebrow">{t('ideas.eyebrow')}</p>
            <h1>{t('ideas.heading')}</h1>
            <p>{t('ideas.description')}</p>
          </div>
        </section>

        {ideaMessage && (
          <p style={{ margin: '4px 0 16px', color: '#e2aa3e', fontSize: '13px', fontWeight: 500 }}>{ideaMessage}</p>
        )}

        <form className="panel-form" onSubmit={handleSubmit}>
          <label htmlFor="title">{t('ideas.titleLabel')}</label>
          <input id="title" name="title" type="text" placeholder={t('ideas.titlePlaceholder')} required />

          <label htmlFor="category">{t('ideas.categoryLabel')}</label>
          <select id="category" name="category" required>
            <option value="" disabled>{t('ideas.categoryPlaceholder')}</option>
            {categories.map((cat) => (
              <option key={cat.key} value={cat.key}>{t(cat.label)}</option>
            ))}
          </select>

          <label htmlFor="description">{t('ideas.descriptionLabel')}</label>
          <textarea id="description" name="description" rows="5" placeholder={t('ideas.descriptionPlaceholder')} required />

          <button type="submit">{t('ideas.submit')}</button>
        </form>
      </main>
    </>
  )
}

export default NewIdea
