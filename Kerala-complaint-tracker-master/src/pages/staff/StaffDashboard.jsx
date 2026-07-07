import Navbar from '../../components/Navbar'

const assignedComplaints = [
  {
    id: 'KCT-2026-0108',
    title: 'Drainage overflow',
    publicUser: 'Asha Nair',
    ward: 'Ward 12',
    priority: 'High',
    status: 'Needs action',
    due: 'Today',
  },
  {
    id: 'KCT-2026-0114',
    title: 'Water supply disruption',
    publicUser: 'Ravi Menon',
    ward: 'Ward 04',
    priority: 'Medium',
    status: 'In progress',
    due: 'Tomorrow',
  },
  {
    id: 'KCT-2026-0120',
    title: 'Waste collection delay',
    publicUser: 'Fathima C',
    ward: 'Ward 19',
    priority: 'Low',
    status: 'Field visit',
    due: '05 Jul 2026',
  },
]

const StaffDashboard = () => {
  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="page-heading">
          <p className="eyebrow">Staff dashboard</p>
          <h1>Public complaints received</h1>
        </section>

        <div className="stat-grid">
          <article className="stat-card">
            <strong>18</strong>
            <span>Public complaints</span>
          </article>
          <article className="stat-card">
            <strong>6</strong>
            <span>Needs action</span>
          </article>
          <article className="stat-card">
            <strong>9</strong>
            <span>In progress</span>
          </article>
          <article className="stat-card">
            <strong>3</strong>
            <span>Due today</span>
          </article>
        </div>

        <section className="table-panel">
          <div className="table-header">
            <h2>Public complaint queue</h2>
            <span>Visible to staff</span>
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
                  <span>By {complaint.publicUser}</span>
                </div>
                <span className={complaint.status === 'Needs action' ? 'status open' : 'status progress'}>
                  {complaint.status}
                </span>
                <div>
                  <span>Due</span>
                  <span>{complaint.due}</span>
                </div>
                <button className="row-action" type="button">Update</button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

export default StaffDashboard
