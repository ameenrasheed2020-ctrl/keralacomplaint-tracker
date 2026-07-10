import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { addComplaint } from '../../data/complaintData'

const NewComplaint = () => {
  const navigate = useNavigate()
  const [files, setFiles] = useState([])
  const [done, setDone] = useState(false)
  const [trackId, setTrackId] = useState('')

  function pickFiles(e) {
    const picked = Array.from(e.target.files)
    const out = []
    for (let i = 0; i < picked.length; i++) {
      const f = picked[i]
      if (f.size > 2 * 1024 * 1024) { alert('File too big (max 2MB)'); return }
      const r = new FileReader()
      r.onload = () => {
        out.push({ name: f.name, type: f.type, data: r.result })
        if (out.length === picked.length) setFiles(prev => [...prev, ...out])
      }
      r.readAsDataURL(f)
    }
    if (picked.length > 0) e.target.value = ''
  }

  function removeFile(i) {
    const next = []
    for (let j = 0; j < files.length; j++) if (j !== i) next.push(files[j])
    setFiles(next)
  }

  function submit(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const user = JSON.parse(localStorage.getItem('kct_user') || '{}')
    const next = addComplaint({
      title: fd.get('title'),
      ward: fd.get('ward'),
      department: fd.get('department'),
      category: fd.get('category'),
      description: fd.get('description'),
      files,
    }, user)
    setTrackId(next[0].id)
    setDone(true)
  }

  if (done) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: 500, margin: '0 auto', padding: 20, textAlign: 'center' }}>
          <h1>Complaint Filed!</h1>
          <p>Tracking ID:</p>
          <strong style={{ fontSize: 20, color: '#166534' }}>{trackId}</strong>
          <p style={{ fontSize: 13, color: '#666', marginTop: 20 }}>Use this ID to track your complaint status.</p>
          <button onClick={() => navigate('/dashboard')} style={{ marginTop: 16, padding: '8px 20px', background: '#166534', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Dashboard</button>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 500, margin: '0 auto', padding: 20 }}>
        <h1>New Complaint</h1>
        <form onSubmit={submit}>
          <label>Title</label>
          <input name="title" required style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }} />

          <label>Ward</label>
          <input name="ward" required style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }} />

          <label>Department</label>
          <select name="department" required style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }}>
            <option value="">Select...</option>
            <optgroup label="Infrastructure">
              <option>PWD</option><option>Transport</option><option>LSGD</option>
            </optgroup>
            <optgroup label="Utilities">
              <option>Water Authority</option><option>KSEB</option><option>Environment</option>
            </optgroup>
            <optgroup label="Health">
              <option>Health Department</option><option>Social Justice</option>
            </optgroup>
            <optgroup label="Education">
              <option>Education Department</option><option>Labour</option>
            </optgroup>
            <optgroup label="Land">
              <option>Revenue</option><option>Housing</option><option>Agriculture</option>
            </optgroup>
          </select>

          <label>Problem Type</label>
          <select name="category" required style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }}>
            <option value="">Select...</option>
            <option>Road</option><option>Drainage</option><option>Water</option><option>Streetlight</option>
            <option>Waste</option><option>Health</option><option>Ration</option><option>Education</option>
            <option>Land</option><option>Safety</option><option>Other</option>
          </select>

          <label>Description</label>
          <textarea name="description" rows={5} required style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }} />

          <label>Attachments (optional)</label>
          <div style={{ marginBottom: 10 }}>
            <input type="file" multiple accept="image/*,.pdf" onChange={pickFiles} />
            {files.map((f, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#eee', padding: '3px 8px', borderRadius: 4, margin: 3, fontSize: 13 }}>
                {f.name} <span onClick={() => removeFile(i)} style={{ cursor: 'pointer', fontWeight: 700 }}>x</span>
              </span>
            ))}
          </div>

          <button type="submit" style={{ padding: '8px 20px', background: '#166534', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Submit</button>
        </form>
      </div>
    </>
  )
}

export default NewComplaint
