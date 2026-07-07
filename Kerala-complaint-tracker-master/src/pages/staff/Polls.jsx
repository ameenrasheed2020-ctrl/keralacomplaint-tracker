import Navbar from '../../components/Navbar'

const Polls = () => {
  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="page-heading">
          <p className="eyebrow">Polls</p>
          <h1>Public feedback polls</h1>
        </section>

        <div className="data-grid">
          <article className="data-card">
            <span className="status progress">Active</span>
            <h2>Road maintenance satisfaction</h2>
            <p>124 responses received</p>
          </article>
          <article className="data-card">
            <span className="status open">Draft</span>
            <h2>Waste collection timing</h2>
            <p>Ready for review</p>
          </article>
        </div>
      </main>
    </>
  )
}

export default Polls
