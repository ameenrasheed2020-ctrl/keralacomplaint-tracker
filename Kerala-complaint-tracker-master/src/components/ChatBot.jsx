import { useState, useRef, useEffect } from 'react'
import { LuMessageCircle, LuX, LuSend, LuBot } from 'react-icons/lu'
import { getPublicPosts, getPublicPolls } from '../data/communityData'
import { getRoadReports } from '../data/roadData'
import { addIdea } from '../data/ideaData'
import { askVengaraAI } from '../data/geminiService'

const weatherCodes = { 0:'☀️ Clear',1:'🌤 Mainly clear',2:'⛅ Partly cloudy',3:'☁️ Overcast',45:'🌫 Fog',48:'🌫 Rime fog',51:'🌦 Light drizzle',53:'🌦 Moderate drizzle',55:'🌧 Dense drizzle',61:'🌦 Slight rain',63:'🌧 Moderate rain',65:'🌧 Heavy rain',80:'🌦 Slight showers',81:'🌧 Moderate showers',82:'🌧 Violent showers',95:'⛈ Thunderstorm',96:'⛈ Thunderstorm + hail',99:'⛈ Thunderstorm + heavy hail' }

const fetchItems = [
  { keywords: ['weather', 'temperature', 'rain', 'rain today', 'today weather', 'current weather', 'forecast'], fetch: async () => {
    const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=11.05&longitude=75.98&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto&forecast_days=1')
    const d = await r.json()
    const c = d.current
    const day = d.daily
    const w = weatherCodes[c.weather_code] || '❓ Unknown'
    return `🌤 Vengara Weather Now\n${w}  ${Math.round(c.temperature_2m)}°C (feels ${Math.round(c.apparent_temperature)}°)\n💧 ${c.precipitation} mm · 💨 ${c.wind_speed_10m} km/h · 💦 ${c.relative_humidity_2m}%\n\n📅 Today: ${Math.round(day.temperature_2m_min[0])}–${Math.round(day.temperature_2m_max[0])}°C · ${day.precipitation_sum[0]} mm expected · ${day.precipitation_probability_max[0]}% chance of rain`
  } },
  { keywords: ['traffic', 'road', 'jam', 'traffic jam', 'accident', 'road block', 'road report', 'road condition'], fetch: async () => {
    const reports = getRoadReports().filter(r => r.status === 'active')
    if (!reports.length) return 'No active road reports at the moment.'
    let out = '🚦 Active road reports:\n'
    let n = 1
    for (const r of reports) {
      const icons = { flood:'🌊', construction:'🚧', traffic:'🚦' }
      out += `\n${n}. ${icons[r.type] || '📍'} ${r.description} — ${r.date}`
      n++
    }
    return out
  } },
  { keywords: ['live update', 'live vengara', 'vengara live', 'vengara update', 'current status', 'situation'], fetch: async () => {
    let out = '📡 Live Vengara Update\n'
    try {
      const wr = await fetch('https://api.open-meteo.com/v1/forecast?latitude=11.05&longitude=75.98&current=temperature_2m,precipitation,weather_code,wind_speed_10m&daily=precipitation_sum&timezone=auto&forecast_days=1')
      const wd = await wr.json()
      const w = weatherCodes[wd.current.weather_code] || '❓'
      out += `\n🌤 Weather: ${w} ${Math.round(wd.current.temperature_2m)}°C · ${wd.current.precipitation} mm now · ${wd.daily.precipitation_sum[0]} mm today`
    } catch {} 
    const reports = getRoadReports().filter(r => r.status === 'active')
    if (reports.length) {
      const icons = { flood:'🌊', construction:'🚧', traffic:'🚦' }
      out += `\n🚦 Road alerts: ${reports.map(r => `${icons[r.type]||'📍'} ${r.description.split(',')[0]}`).join(' · ')}`
    }
    const posts = getPublicPosts().filter(p => p.status === 'published').slice(0, 2)
    if (posts.length) out += `\n📢 Updates: ${posts.map(p => p.title).join(' · ')}`
    const polls = getPublicPolls().filter(p => p.status === 'published')
    if (polls.length) out += `\n📊 Polls: ${polls.length} active`
    return out
  } },
  { keywords: ['poll', 'vote', 'voting', 'active poll', 'polls'], fetch: async () => {
    const polls = getPublicPolls().filter(p => p.status === 'published')
    if (!polls.length) return 'No active polls.'
    return 'Active polls:\n' + polls.map((p, i) =>
      `${i+1}. ${p.question} (${Object.values(p.votes || {}).reduce((a,b) => a + b, 0)} votes)`
    ).join('\n')
  } },
  { keywords: ['update', 'post', 'notification', 'announcement', 'latest', 'recent', 'what new'], fetch: async () => {
    const posts = getPublicPosts().filter(p => p.status === 'published').slice(0, 5)
    if (!posts.length) return 'No recent updates.'
    return 'Latest updates:\n' + posts.map((p, i) => `${i+1}. [${p.type}] ${p.title} — ${p.date}`).join('\n')
  } },
]

const ideaCategories = ['Infrastructure', 'Agriculture', 'Health', 'Education', 'Other']

const findFetchMatch = (query) => {
  const q = query.toLowerCase()
  for (const item of fetchItems) {
    if (item.keywords.some(k => q.includes(k))) return item
  }
  return null
}

const ChatBot = () => {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([
    { role: 'bot', text: '👋 I am the Vengara constituency assistant. How can I help you?', typed: true },
  ])
  const [input, setInput] = useState('')
  const [isBotTyping, setIsBotTyping] = useState(false)
  const [typingText, setTypingText] = useState('')
  const conv = useRef(null)
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const typingTimer = useRef(null)

  useEffect(() => {
    return () => clearTimeout(typingTimer.current)
  }, [])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [msgs, typingText, isBotTyping])

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [open])

  const findMatch = (query) => {
    const q = query.toLowerCase()
    const words = q.split(/\s+/).filter(Boolean)
    let best = null
    let bestScore = 0
    let bestWordCover = 0
    for (const item of faq) {
      const allKwWords = [...new Set(item.q.flatMap(kw => kw.split(/\s+/)))]
      const score = item.q.reduce((acc, kw) => acc + (q.includes(kw) ? 1 : 0), 0)
      const wordCover = words.filter(w => allKwWords.some(kw => kw.includes(w) || w.includes(kw))).length
      if (score > bestScore || (score === bestScore && wordCover > bestWordCover)) {
        bestScore = score
        bestWordCover = wordCover
        best = item
      }
    }
    return best
  }

  const botSay = async (text) => {
    setIsBotTyping(true)
    setTypingText('')
    const chars = text.split('')
    let i = 0
    const type = () => {
      if (i >= chars.length) {
        setMsgs((prev) => [...prev, { role: 'bot', text }])
        setTypingText('')
        setIsBotTyping(false)
        return
      }
      setTypingText((prev) => prev + chars[i])
      i++
      const delay = chars[i - 1] === '\n' ? 80 : 8 + Math.random() * 20
      typingTimer.current = setTimeout(type, delay)
    }
    await new Promise((r) => setTimeout(r, 200))
    type()
  }

  const send = async () => {
    const text = input.trim()
    if (!text || isBotTyping) return
    setInput('')
    setMsgs((prev) => [...prev, { role: 'user', text }])
    setIsBotTyping(true)

    if (conv.current) {
      if (conv.current.step === 'idea_title') {
        conv.current.idea.title = text
        conv.current.step = 'idea_category'
        await botSay('Choose a category:\n' + ideaCategories.map((c, i) => `${i+1}. ${c}`).join('\n'))
        return
      }
      if (conv.current.step === 'idea_category') {
        const num = parseInt(text)
        const cat = (num >= 1 && num <= ideaCategories.length) ? ideaCategories[num - 1] : text
        conv.current.idea.category = cat
        conv.current.step = 'idea_description'
        await botSay('Describe your idea in detail.')
        return
      }
      if (conv.current.step === 'idea_description') {
        conv.current.idea.description = text
        conv.current.step = 'idea_confirm'
        await botSay(`Summary:\nTitle: ${conv.current.idea.title}\nCategory: ${conv.current.idea.category}\nDescription: ${conv.current.idea.description}\n\nReply "yes" to submit or "no" to cancel.`)
        return
      }
      if (conv.current.step === 'idea_confirm') {
        if (text.toLowerCase() === 'yes' || text.toLowerCase() === 'y') {
          addIdea(conv.current.idea, { email: 'chatbot@user', name: 'Chatbot User' })
          conv.current = null
          await botSay('Your idea has been submitted.')
          return
        }
        conv.current = null
        await botSay('Idea cancelled.')
        return
      }
    }

    if (text.toLowerCase().includes('idea') && (text.toLowerCase().includes('submit') || text.toLowerCase().includes('new') || text.toLowerCase().includes('create') || text.toLowerCase().includes('have an idea'))) {
      conv.current = { step: 'idea_title', idea: {} }
      await botSay('What is the title of your idea?')
      return
    }

    const fetchMatch = findFetchMatch(text)
    if (fetchMatch) {
      try {
        const reply = await fetchMatch.fetch()
        await botSay(reply)
        return
      } catch {
        await botSay('Could not fetch that information.')
        return
      }
    }

    const aiReply = await askVengaraAI(text, msgs.slice(-10))
    if (typeof aiReply === 'object' && aiReply.fetch) {
      const liveMatch = fetchItems.find(i => i.keywords.includes(aiReply.fetch))
      if (liveMatch) {
        try {
          const reply = await liveMatch.fetch()
          await botSay(aiReply.text + '\n\n' + reply)
        } catch {
          await botSay(aiReply.text)
        }
      } else {
        await botSay(aiReply.text)
      }
    } else {
      await botSay(aiReply)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      <button className={`chatbot-toggle ${open ? 'chatbot-toggle--open' : ''}`} onClick={() => setOpen(!open)} aria-label="Toggle chatbot">
        {open ? <LuX size={22} /> : <LuMessageCircle size={22} />}
      </button>

      {open && (
        <div className="chatbot">
          <div className="chatbot-header">
            <LuBot size={18} />
            <span>Constituency Assistant</span>
          </div>
          <div className="chatbot-msgs" ref={listRef}>
            {msgs.map((m, i) => (
              <div key={i} className={`chatbot-msg chatbot-msg--${m.role}`}>
                {m.text.split('\n').map((line, j) => <div key={j}>{line}</div>)}
              </div>
            ))}
            {isBotTyping && (
              <div className="chatbot-msg chatbot-msg--bot chatbot-typing">
                {typingText.split('\n').map((line, j) => <div key={j}>{line}</div>)}
                <span className="chatbot-cursor">|</span>
              </div>
            )}
          </div>
          <div className="chatbot-input">
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} placeholder="Type a message..." className="chatbot-input-field" />
            <button className="chatbot-send" onClick={send} disabled={!input.trim() || isBotTyping}>
              <LuSend size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatBot
