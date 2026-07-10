import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { addIdea } from '../../data/ideaData'

const NewIdea = () => {
  const navigate = useNavigate()
  const [files, setFiles] = useState([])
  const [done, setDone] = useState(false)

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
    addIdea({
      title: fd.get('title'),
      description: fd.get('description'),
      files,
    }, user)
    setDone(true)
  }

  if (done) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: 500, margin: '0 auto', padding: 20, textAlign: 'center' }}>
          <h1>Idea Submitted!</h1>
          <p>The admin will review your suggestion.</p>
          <button onClick={() => navigate('/dashboard')} style={{ marginTop: 16, padding: '8px 20px', background: '#166534', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Dashboard</button>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 500, margin: '0 auto', padding: 20 }}>
        <h1>New Idea</h1>
        <form onSubmit={submit}>
          <label>Title</label>
          <input name="title" required style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }} />

          <label>Description</label>
          <textarea name="description" rows={5} required style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8, resize: 'vertical' }} />

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

export default NewIdea
