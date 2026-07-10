import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

const AdminComplaints = () => {
  const navigate = useNavigate()
  const [list, setList] = useState(getComplaints)

  useEffect(() => {
    const ids = []
    for (let i = 0; i < list.length; i++) ids.push(list[i].id)
    setList(markComplaintsViewed(ids))
  }, [])

  function changeStatus(id, val) {
    setList(updateComplaintStatus(id, val))
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
        <h1>Complaints</h1>
        <p style={{ fontSize: 14, color: '#666' }}>{list.length} total</p>

        {list.map((c) => (
          <div key={c.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 14, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/complaints/' + c.id)}>
                {c.title}
              </strong>
              <span style={{ fontSize: 12, color: '#999' }}>
                {c.viewed ? 'Seen' : 'New'} &middot; {getStatusLabel(c.status)}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#666', margin: '4px 0' }}>{c.ward} &middot; {c.date}</p>
            <p style={{ fontSize: 13, color: '#444' }}>{c.description}</p>
            <div style={{ marginTop: 6 }}>
              <label style={{ fontSize: 13 }}>Status: </label>
              <select value={c.status} onChange={(e) => changeStatus(c.id, e.target.value)} style={{ fontSize: 13 }}>
                {statuses.map((s) => (
                  <option key={s} value={s}>{getStatusLabel(s)}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
        {list.length === 0 && <p style={{ color: '#999' }}>No complaints.</p>}
      </div>
    </>
  )
}

export default AdminComplaints
