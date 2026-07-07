import Navbar from '../../components/Navbar'

const areaStats = [
  { area: 'Ward 12, Edappally', complaints: 42, resolved: 31, pending: 11 },
  { area: 'Ward 04, Kakkanad', complaints: 36, resolved: 27, pending: 9 },
  { area: 'Ward 19, Vyttila', complaints: 28, resolved: 22, pending: 6 },
  { area: 'Ward 08, Palarivattom', complaints: 21, resolved: 18, pending: 3 },
]

const AdminDashboard = () => {
  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="page-heading">
          <p className="eyebrow">MLA staff dashboard</p>
          <h1>Constituency complaint overview</h1>
        </section>

        <div className="stat-grid">
          <article className="stat-card">
            <strong>14</strong>
            <span>Area queues</span>
          </article>
          <article className="stat-card">
            <strong>383</strong>
            <span>Public complaints</span>
          </article>
          <article className="stat-card">
            <strong>312</strong>
            <span>Resolved</span>
          </article>
          <article className="stat-card">
            <strong>92%</strong>
            <span>SLA compliance</span>
          </article>
        </div>

        <section className="table-panel">
          <div className="table-header">
            <h2>Area performance</h2>
            <span>Dummy data</span>
          </div>

          <div className="admin-table">
            <div className="admin-row heading">
              <span>Area</span>
              <span>Total</span>
              <span>Resolved</span>
              <span>Pending</span>
            </div>
            {areaStats.map((item) => (
              <div className="admin-row" key={item.area}>
                <strong>{item.area}</strong>
                <span data-label="Total">{item.complaints}</span>
                <span data-label="Resolved">{item.resolved}</span>
                <span data-label="Pending">{item.pending}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

export default AdminDashboard
