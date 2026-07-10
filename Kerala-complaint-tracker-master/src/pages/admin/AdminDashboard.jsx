import { useState } from 'react'
import Navbar from '../../components/Navbar'
import { getComplaints } from '../../data/complaintData'

const AdminDashboard = () => {
  const [complaints] = useState(getComplaints)

  const total = complaints.length
  let pending = 0
  let inProgress = 0
  let fieldVisit = 0
  let resolved = 0
  let declined = 0

  for (let i = 0; i < complaints.length; i++) {
    if (complaints[i].status === 'pending') pending++
    else if (complaints[i].status === 'in_progress') inProgress++
    else if (complaints[i].status === 'field_visit') fieldVisit++
    else if (complaints[i].status === 'resolved') resolved++
    else if (complaints[i].status === 'declined') declined++
  }

  const wardCounts = {}
  for (let i = 0; i < complaints.length; i++) {
    const w = complaints[i].ward || 'Unknown'
    wardCounts[w] = (wardCounts[w] || 0) + 1
  }
  const wards = Object.keys(wardCounts)

  const recent = []
  for (let i = complaints.length - 1; i >= 0 && i >= complaints.length - 5; i--) {
    recent.push(complaints[i])
  }

  const cards = [
    { label: 'Total', count: total, color: '#1e3a5f' },
    { label: 'Pending', count: pending, color: '#c2410c' },
    { label: 'In Progress', count: inProgress, color: '#1d4ed8' },
    { label: 'Field Visit', count: fieldVisit, color: '#7c3aed' },
    { label: 'Resolved', count: resolved, color: '#166534' },
    { label: 'Declined', count: declined, color: '#b91c1c' },
  ]

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
        <h1>Admin Dashboard</h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 30 }}>
          {cards.map((c, i) => (
            <div key={i} style={{ flex: '1 0 140px', padding: 16, background: c.color, color: 'white', borderRadius: 8, textAlign: 'center', minWidth: 100 }}>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{c.count}</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>{c.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 30 }}>
          <h3>By Ward</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={{ textAlign: 'left', borderBottom: '2px solid #ccc', padding: 6 }}>Ward</th><th style={{ textAlign: 'left', borderBottom: '2px solid #ccc', padding: 6 }}>Complaints</th></tr></thead>
            <tbody>
              {wards.map((w, i) => (
                <tr key={i}><td style={{ padding: 6, borderBottom: '1px solid #eee' }}>{w}</td><td style={{ padding: 6, borderBottom: '1px solid #eee' }}>{wardCounts[w]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3>Recent Complaints</h3>
          {recent.map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid #eee', fontSize: 14 }}>
              <span>{c.title}</span>
              <span style={{ color: '#666', fontSize: 12 }}>{c.date} · {c.status}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default AdminDashboard
