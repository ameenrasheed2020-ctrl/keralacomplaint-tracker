import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { getComplaints, updateComplaintStatus, markComplaintsViewed } from '../../data/complaintData'

function getStatusLabel(status) {
  if (status === 'pending') return 'Pending'
  if (status === 'in_progress') return 'In Progress'
  if (status === 'field_visit') return 'Field Visit'
  if (status === 'resolved') return 'Resolved'
  if (status === 'declined') return 'Declined'
  return status
}

const statuses = ['pending', 'in_progress', 'field_visit', 'resolved', 'declined']

const AdminComplaintDetail = () => {
  const { id } = useParams()
  const all = getComplaints()
  let found = null
  for (let i = 0; i < all.length; i++) {
    if (all[i].id === id) { found = all[i]; break }
  }
  const [c, setC] = useState(found)

  useEffect(() => {
    if (c) {
      const next = markComplaintsViewed([c.id])
      for (let i = 0; i < next.length; i++) {
        if (next[i].id === id) setC(next[i])
      }
    }
  }, [])

  if (!c) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
          <p>Not found.</p>
          <Link to="/admin/complaints">&larr; Back</Link>
        </div>
      </>
    )
  }

  function changeStatus(e) {
    const next = updateComplaintStatus(c.id, e.target.value)
    for (let i = 0; i < next.length; i++) {
      if (next[i].id === c.id) setC(next[i])
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
        <Link to="/admin/complaints" style={{ fontSize: 14 }}>&larr; Back</Link>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#666', marginTop: 10 }}>{c.id}</p>
        <h1 style={{ textAlign: 'center' }}>{c.title}</h1>

        <hr />

        <p><strong>Category:</strong> {c.category}</p>
        <p><strong>Department:</strong> {c.department}</p>
        <p><strong>Ward:</strong> {c.ward}</p>
        <p><strong>Reporter:</strong> {c.reporter}</p>
        <p><strong>Date:</strong> {c.date}</p>
        <p><strong>Description:</strong></p>
        <p style={{ whiteSpace: 'pre-wrap' }}>{c.description}</p>

        {c.files && c.files.length > 0 && (
          <div>
            <p><strong>Attachments:</strong></p>
            {c.files.map((f, i) => (
              <a key={i} href={f.data} download={f.name} target="_blank" rel="noreferrer"
                style={{ display: 'block', padding: 6, background: '#f5f5f5', marginBottom: 4, borderRadius: 4 }}>
                {f.name}
              </a>
            ))}
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <label><strong>Status:</strong></label>
          <select value={c.status} onChange={changeStatus} style={{ marginLeft: 8 }}>
            {statuses.map((s) => (
              <option key={s} value={s}>{getStatusLabel(s)}</option>
            ))}
          </select>
        </div>
      </div>
    </>
  )
}

export default AdminComplaintDetail
