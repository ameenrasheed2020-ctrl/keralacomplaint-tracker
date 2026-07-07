import { useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'

const ComplaintDetails = () => {
  const { id } = useParams()

  return (
    <>
      <Navbar />
      <main className="page-shell narrow">
        <section className="page-heading">
          <p className="eyebrow">Complaint details</p>
          <h1>{id}</h1>
        </section>

        <section className="detail-panel">
          <span className="status progress">In review</span>
          <h2>Department action timeline</h2>
          <ol>
            <li>Complaint submitted by public user.</li>
            <li>Received by MLA office staff.</li>
            <li>Staff review and update the complaint status.</li>
          </ol>
        </section>
      </main>
    </>
  )
}

export default ComplaintDetails
