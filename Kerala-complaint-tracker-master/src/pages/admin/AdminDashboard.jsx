import { useTranslation } from 'react-i18next'
import Navbar from '../../components/Navbar'

const areaStats = [
  { area: 'Ward 12, Edappally', complaints: 42, resolved: 31, pending: 11 },
  { area: 'Ward 04, Kakkanad', complaints: 36, resolved: 27, pending: 9 },
  { area: 'Ward 19, Vyttila', complaints: 28, resolved: 22, pending: 6 },
  { area: 'Ward 08, Palarivattom', complaints: 21, resolved: 18, pending: 3 },
]

const AdminDashboard = () => {
  const { t } = useTranslation()
  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="page-heading">
          <p className="eyebrow">{t('admin.dashboard.heading')}</p>
          <h1>{t('admin.dashboard.subheading')}</h1>
        </section>

        <div className="stat-grid">
          <article className="stat-card">
            <strong>14</strong>
            <span>{t('admin.dashboard.areaQueues')}</span>
          </article>
          <article className="stat-card">
            <strong>383</strong>
            <span>{t('admin.dashboard.publicComplaints')}</span>
          </article>
          <article className="stat-card">
            <strong>312</strong>
            <span>{t('admin.dashboard.resolved')}</span>
          </article>
          <article className="stat-card">
            <strong>92%</strong>
            <span>{t('admin.dashboard.slaCompliance')}</span>
          </article>
        </div>

        <section className="table-panel">
          <div className="table-header">
            <h2>{t('admin.dashboard.areaPerformance')}</h2>
            <span>{t('admin.dashboard.dummyData')}</span>
          </div>

          <div className="admin-table">
            <div className="admin-row heading">
              <span>{t('admin.dashboard.area')}</span>
              <span>{t('admin.dashboard.total')}</span>
              <span>{t('admin.dashboard.resolved')}</span>
              <span>{t('admin.dashboard.pending')}</span>
            </div>
            {areaStats.map((item) => (
              <div className="admin-row" key={item.area}>
                <strong>{item.area}</strong>
                <span data-label={t('admin.dashboard.total')}>{item.complaints}</span>
                <span data-label={t('admin.dashboard.resolved')}>{item.resolved}</span>
                <span data-label={t('admin.dashboard.pending')}>{item.pending}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

export default AdminDashboard
