import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '../../components/Navbar'
import { markMultipleComplaintsViewed } from '../../data/communityData'

const assignedComplaints = [
  { id: 'KCT-2026-0108', title: 'Drainage overflow', publicUser: 'Asha Nair', ward: 'Ward 12', priority: 'High', status: 'Needs action', due: 'Today' },
  { id: 'KCT-2026-0114', title: 'Water supply disruption', publicUser: 'Ravi Menon', ward: 'Ward 04', priority: 'Medium', status: 'In progress', due: 'Tomorrow' },
  { id: 'KCT-2026-0120', title: 'Waste collection delay', publicUser: 'Fathima C', ward: 'Ward 19', priority: 'Low', status: 'Field visit', due: '05 Jul 2026' },
]

const StaffDashboard = () => {
  const { t } = useTranslation()

  useEffect(() => {
    markMultipleComplaintsViewed(assignedComplaints.map((c) => c.id))
  }, [])
  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="page-heading">
          <p className="eyebrow">{t('staff.dashboard.heading')}</p>
          <h1>{t('staff.dashboard.subheading')}</h1>
        </section>

        <div className="stat-grid">
          <article className="stat-card"><strong>18</strong><span>{t('staff.dashboard.publicComplaints')}</span></article>
          <article className="stat-card"><strong>6</strong><span>{t('staff.dashboard.needsAction')}</span></article>
          <article className="stat-card"><strong>9</strong><span>{t('staff.dashboard.inProgress')}</span></article>
          <article className="stat-card"><strong>3</strong><span>{t('staff.dashboard.dueToday')}</span></article>
        </div>

        <section className="table-panel">
          <div className="table-header">
            <h2>{t('staff.dashboard.queue')}</h2>
            <span>{t('staff.dashboard.visibleToStaff')}</span>
          </div>

          <div className="complaint-table">
            {assignedComplaints.map((complaint) => (
              <article className="table-row" key={complaint.id}>
                <div>
                  <strong>{complaint.title}</strong>
                  <span>{complaint.id}</span>
                </div>
                <div>
                  <span>{complaint.ward}</span>
                  <span>{t('staff.dashboard.by')} {complaint.publicUser}</span>
                </div>
                <span className={complaint.status === 'Needs action' ? 'status open' : 'status progress'}>{complaint.status}</span>
                <div>
                  <span>{t('staff.dashboard.due')}</span>
                  <span>{complaint.due}</span>
                </div>
                <button className="row-action" type="button">{t('staff.dashboard.update')}</button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

export default StaffDashboard
