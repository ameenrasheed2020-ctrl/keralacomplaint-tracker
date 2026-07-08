import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../../components/Navbar'
import { getViewedComplaints } from '../../data/communityData'

const ComplaintDetails = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const viewed = getViewedComplaints().includes(id)

  return (
    <>
      <Navbar />
      <main className="page-shell narrow">
        <section className="page-heading">
          <p className="eyebrow">{t('complaintDetails.heading')}</p>
          <h1>{id}</h1>
        </section>

        <section className="detail-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span className="status progress">{t('complaintDetails.inReview')}</span>
            {viewed && (
              <span style={{
                fontSize: '12px', fontWeight: 600, color: 'var(--green-700)',
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                ✓ Seen by MLA office
              </span>
            )}
          </div>
          <h2>{t('complaintDetails.timeline')}</h2>
          <ol>
            <li>{t('complaintDetails.step1')}</li>
            <li>{t('complaintDetails.step2')}</li>
            <li>{t('complaintDetails.step3')}</li>
          </ol>
        </section>
      </main>
    </>
  )
}

export default ComplaintDetails
