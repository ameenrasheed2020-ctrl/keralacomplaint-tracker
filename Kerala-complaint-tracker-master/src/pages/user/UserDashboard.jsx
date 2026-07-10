import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { getComplaints } from '../../data/complaintData'
import { getIdeas } from '../../data/ideaData'

function getStatusColor(status) {
  if (status === 'pending') return '#f59e0b'
  if (status === 'in_progress') return '#3b82f6'
  if (status === 'field_visit') return '#8b5cf6'
  if (status === 'resolved') return '#22c55e'
  if (status === 'declined') return '#ef4444'
  return '#999'
}

const UserDashboard = () => {
  const [complaints] = useState(getComplaints)
  const [ideas] = useState(getIdeas)

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
        <h1>My Dashboard</h1>

        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <div style={{ flex: 1, padding: 16, border: '1px solid #ddd', borderRadius: 8, textAlign: 'center' }}>
            <strong style={{ fontSize: 24 }}>{complaints.length}</strong>
            <p style={{ fontSize: 13, color: '#666' }}>Complaints</p>
          </div>
          <div style={{ flex: 1, padding: 16, border: '1px solid #ddd', borderRadius: 8, textAlign: 'center' }}>
            <strong style={{ fontSize: 24 }}>{ideas.length}</strong>
            <p style={{ fontSize: 13, color: '#666' }}>Ideas</p>
          </div>
          <Link to="/complaints/new" style={{ flex: 1, padding: 16, border: '1px solid #ddd', borderRadius: 8, textAlign: 'center', textDecoration: 'none', color: '#333' }}>
            <strong style={{ fontSize: 24 }}>+</strong>
            <p style={{ fontSize: 13, color: '#666' }}>New Complaint</p>
          </Link>
        </div>

        <div style={{ border: '1px solid #ddd', borderRadius: 8, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid #eee' }}>
            <h2 style={{ fontSize: 16, margin: 0 }}>My Complaints</h2>
            <Link to="/track" style={{ fontSize: 13 }}>Track &rarr;</Link>
          </div>
          {complaints.map((c) => (
            <Link to={'/complaints/' + c.id} key={c.id}
              style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid #eee', textDecoration: 'none', color: '#333' }}>
              <div>
                <strong>{c.title}</strong>
                <p style={{ fontSize: 12, color: '#999', margin: 0 }}>{c.id} &middot; {c.date}</p>
              </div>
              <span style={{ color: getStatusColor(c.status), fontWeight: 600, fontSize: 13 }}>
                {c.status.replace('_', ' ')}
              </span>
            </Link>
          ))}
          {complaints.length === 0 && (
            <p style={{ padding: 14, color: '#999', textAlign: 'center' }}>
              No complaints. <Link to="/complaints/new">File one</Link>
            </p>
          )}
        </div>

        <div style={{ border: '1px solid #ddd', borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid #eee' }}>
            <h2 style={{ fontSize: 16, margin: 0 }}>My Ideas</h2>
            <Link to="/ideas/new" style={{ fontSize: 13 }}>Submit &rarr;</Link>
          </div>
          {ideas.map((idea) => (
            <div key={idea.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid #eee' }}>
              <div>
                <strong>{idea.title}</strong>
                <p style={{ fontSize: 12, color: '#999', margin: 0 }}>{idea.id} &middot; {idea.category}</p>
              </div>
              <span style={{ color: idea.viewed ? '#22c55e' : '#999', fontWeight: 600, fontSize: 13 }}>
                {idea.viewed ? 'Seen' : 'Pending'}
              </span>
            </div>
          ))}
          {ideas.length === 0 && (
            <p style={{ padding: 14, color: '#999', textAlign: 'center' }}>
              No ideas. <Link to="/ideas/new">Submit one</Link>
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export default UserDashboard
