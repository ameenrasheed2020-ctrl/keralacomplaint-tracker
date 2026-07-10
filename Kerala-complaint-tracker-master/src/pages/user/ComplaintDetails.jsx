import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { getComplaints } from '../../data/complaintData'

function getStatusStyle(status) {
  if (status === 'pending') return { color: '#f59e0b', label: 'Pending' }
  if (status === 'in_progress') return { color: '#3b82f6', label: 'In Progress' }
  if (status === 'field_visit') return { color: '#8b5cf6', label: 'Field Visit' }
  if (status === 'resolved') return { color: '#22c55e', label: 'Resolved' }
  if (status === 'declined') return { color: '#ef4444', label: 'Declined' }
  return { color: '#999', label: 'Unknown' }
}

const steps = ['pending', 'in_progress', 'field_visit', 'resolved']

const ComplaintDetails = () => {
  const { id } = useParams()
  const all = getComplaints()
  let complaint = null
  for (let i = 0; i < all.length; i++) {
    if (all[i].id === id) {
      complaint = all[i]
      break
    }
  }

  if (!complaint) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 20, textAlign: 'center' }}>
          <h1>Not Found</h1>
          <p>No complaint with ID <strong>{id}</strong></p>
          <p><Link to="/track">Track another</Link></p>
        </div>
      </>
    )
  }

  const statusInfo = getStatusStyle(complaint.status)
  let currentStep = -1
  for (let i = 0; i < steps.length; i++) {
    if (steps[i] === complaint.status) currentStep = i
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
        <Link to="/track" style={{ fontSize: 14 }}>&larr; Back</Link>
        <p style={{ textAlign: 'center', fontSize: 13, color: '#666', marginTop: 10 }}>{complaint.id}</p>
        <h1 style={{ textAlign: 'center', fontSize: 22 }}>{complaint.title}</h1>

        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <span style={{ color: statusInfo.color, fontWeight: 700 }}>
            {statusInfo.label}
          </span>
          {complaint.viewed && (
            <span style={{ marginLeft: 8, color: '#22c55e', fontSize: 13 }}>
              ✓ Seen by MLA office
            </span>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap', marginBottom: 16 }}>
          {steps.map((s, i) => {
            const labels = { pending: 'Pending', in_progress: 'In Progress', field_visit: 'Field Visit', resolved: 'Resolved' }
            const done = i <= currentStep
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ background: done ? getStatusStyle(s).color : '#eee', color: done ? 'white' : '#999', padding: '3px 8px', borderRadius: 12, fontSize: 12 }}>
                  {labels[s]}
                </span>
                {i < steps.length - 1 && <span style={{ color: '#ccc' }}>&rarr;</span>}
              </div>
            )
          })}
        </div>

        <hr />

        <p><strong>Category:</strong> {complaint.category}</p>
        <p><strong>Department:</strong> {complaint.department}</p>
        <p><strong>Ward:</strong> {complaint.ward}</p>
        <p><strong>Date:</strong> {complaint.date}</p>
        <p><strong>Description:</strong></p>
        <p style={{ whiteSpace: 'pre-wrap' }}>{complaint.description}</p>

        {complaint.files && complaint.files.length > 0 && (
          <div>
            <p><strong>Attachments:</strong></p>
            {complaint.files.map((f, i) => (
              <a key={i} href={f.data} download={f.name} target="_blank" rel="noreferrer"
                style={{ display: 'block', padding: 6, background: '#f5f5f5', marginBottom: 4, borderRadius: 4 }}>
                {f.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default ComplaintDetails
