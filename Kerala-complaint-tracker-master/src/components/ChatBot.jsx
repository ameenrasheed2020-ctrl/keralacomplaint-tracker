import { useState, useRef } from 'react'
import { LuMessageCircle, LuX, LuSend } from 'react-icons/lu'
import { getPublicPosts, getPublicPolls } from '../data/communityData'
import { getRoadReports } from '../data/roadData'
import { addIdea } from '../data/ideaData'
import { askVengaraAI } from '../data/geminiService'

const wCodes = { 0:'☀️ Clear',1:'🌤 Mainly clear',2:'⛅ Partly cloudy',3:'☁️ Overcast',45:'🌫 Fog',51:'🌦 Drizzle',61:'🌦 Slight rain',63:'🌧 Rain',65:'🌧 Heavy rain',80:'🌦 Showers',95:'⛈ Thunderstorm',99:'⛈ Thunderstorm+hail' }

function getWeather() {
  return fetch('https://api.open-meteo.com/v1/forecast?latitude=11.05&longitude=75.98&current=temperature_2m,precipitation,weather_code,wind_speed_10m&daily=precipitation_sum&timezone=auto&forecast_days=1').then(r => r.json()).then(d => {
    const w = wCodes[d.current.weather_code] || '❓'
    return '🌤 Weather: ' + w + ' ' + Math.round(d.current.temperature_2m) + '°C, ' + d.current.precipitation + 'mm rain, wind ' + d.current.wind_speed_10m + 'km/h'
  })
}

function getTraffic() {
  const r = getRoadReports()
  let active = []
  for (let i = 0; i < r.length; i++) if (r[i].status === 'active') active.push(r[i])
  if (active.length === 0) return 'No road reports.'
  let out = 'Road reports:\n'
  for (let i = 0; i < active.length; i++) {
    const icons = { flood:'🌊', construction:'🚧', traffic:'🚦' }
    out += (i + 1) + '. ' + (icons[active[i].type] || '📍') + ' ' + active[i].description + '\n'
  }
  return out
}

function getLive() {
  let out = 'Live Update:\n'
  getWeather().then(w => { out += w + '\n' }).catch(() => {})
  const r = getRoadReports()
  for (let i = 0; i < r.length; i++) if (r[i].status === 'active') out += '🚦 ' + r[i].description + '\n'
  const posts = getPublicPosts()
  for (let i = 0; i < posts.length && i < 2; i++) if (posts[i].status === 'published') out += '📢 ' + posts[i].title + '\n'
  return out
}

function getPolls() {
  const polls = getPublicPolls()
  let active = []
  for (let i = 0; i < polls.length; i++) if (polls[i].status === 'published') active.push(polls[i])
  if (active.length === 0) return 'No active polls.'
  let out = 'Polls:\n'
  for (let i = 0; i < active.length; i++) {
    let votes = 0
    if (active[i].votes) for (let k in active[i].votes) votes += active[i].votes[k]
    out += (i + 1) + '. ' + active[i].question + ' (' + votes + ' votes)\n'
  }
  return out
}

function getUpdates() {
  const posts = getPublicPosts()
  let pub = []
  for (let i = 0; i < posts.length; i++) if (posts[i].status === 'published') pub.push(posts[i])
  if (pub.length === 0) return 'No updates.'
  let out = 'Updates:\n'
  for (let i = 0; i < pub.length && i < 5; i++) out += (i + 1) + '. [' + pub[i].type + '] ' + pub[i].title + ' - ' + pub[i].date + '\n'
  return out
}

const ChatBot = () => {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([{ role: 'bot', text: '👋 Ask me about Vengara constituency.' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)

  function scroll() {
    setTimeout(() => { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight }, 50)
  }

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMsgs(prev => [...prev, { role: 'user', text }])
    setLoading(true)
    scroll()

    const q = text.toLowerCase()

    if (q.includes('weather') || q.includes('temperature') || q.includes('rain') || q.includes('forecast')) {
      const reply = await getWeather()
      setMsgs(prev => [...prev, { role: 'bot', text: reply }])
      setLoading(false)
      scroll()
      return
    }

    if (q.includes('traffic') || q.includes('road') || q.includes('jam') || q.includes('accident')) {
      const reply = getTraffic()
      setMsgs(prev => [...prev, { role: 'bot', text: reply }])
      setLoading(false)
      scroll()
      return
    }

    if (q.includes('poll') || q.includes('vote')) {
      const reply = getPolls()
      setMsgs(prev => [...prev, { role: 'bot', text: reply }])
      setLoading(false)
      scroll()
      return
    }

    if (q.includes('update') || q.includes('latest') || q.includes('recent') || q.includes('new') || q.includes('announcement')) {
      const reply = getUpdates()
      setMsgs(prev => [...prev, { role: 'bot', text: reply }])
      setLoading(false)
      scroll()
      return
    }

    if (q.includes('live') || q.includes('current status') || q.includes('situation')) {
      const reply = await getLive()
      setMsgs(prev => [...prev, { role: 'bot', text: reply }])
      setLoading(false)
      scroll()
      return
    }

    const ai = await askVengaraAI(text, msgs)
    setMsgs(prev => [...prev, { role: 'bot', text: ai }])
    setLoading(false)
    scroll()
  }

  function keydown(e) {
    if (e.key === 'Enter') send()
  }

  return (
    <>
      <button className="chatbot-toggle" onClick={() => setOpen(!open)}>
        {open ? <LuX size={22} /> : <LuMessageCircle size={22} />}
      </button>

      {open && (
        <div className="chatbot" style={{ position: 'fixed', bottom: 80, right: 20, width: 340, height: 450, background: 'white', border: '1px solid #ddd', borderRadius: 12, display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 9999 }}>
          <div style={{ background: '#166534', color: 'white', padding: '10px 14px', borderRadius: '12px 12px 0 0', fontWeight: 600 }}>
            Constituency Assistant
          </div>

          <div ref={listRef} style={{ flex: 1, overflow: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? '#166534' : '#f0f0f0', color: m.role === 'user' ? 'white' : '#333', padding: '8px 12px', borderRadius: 10, maxWidth: '85%', fontSize: 14, whiteSpace: 'pre-wrap' }}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: '#f0f0f0', padding: '8px 12px', borderRadius: 10, fontSize: 14 }}>
                Thinking...
              </div>
            )}
          </div>

          <div style={{ display: 'flex', borderTop: '1px solid #ddd', padding: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={keydown} placeholder="Type here..." style={{ flex: 1, border: 'none', outline: 'none', padding: '8px 10px', fontSize: 14 }} />
            <button onClick={send} disabled={!input.trim() || loading} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
              <LuSend size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatBot
