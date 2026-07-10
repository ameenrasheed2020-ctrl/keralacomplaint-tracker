const key = () => window.__VENGARA_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || ''

export async function askVengaraAI(msg, history) {
  const k = key()
  if (!k) return 'API key not set.'

  const contents = []
  for (let i = 0; i < history.length; i++) {
    const m = history[i]
    if (m.role === 'bot') contents.push({ role: 'model', parts: [{ text: m.text }] })
    else if (m.role === 'user') contents.push({ role: 'user', parts: [{ text: m.text }] })
  }
  contents.push({ role: 'user', parts: [{ text: msg }] })

  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=' + k, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        system_instruction: { parts: [{ text: 'You are an assistant for Vengara constituency (Malappuram, Kerala). Only answer questions about Vengara. Be short. Answer what was asked.' }] },
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      if (data.error?.message?.includes('quota') || data.error?.message?.includes('RESOURCE_EXHAUSTED')) {
        return 'API quota exceeded. Try later or get a new key at https://aistudio.google.com/apikey'
      }
      return 'Sorry, I can only answer Vengara questions.'
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    return text || 'Sorry, I can only answer Vengara questions.'
  } catch {
    return 'Sorry, I can only answer Vengara questions.'
  }
}
