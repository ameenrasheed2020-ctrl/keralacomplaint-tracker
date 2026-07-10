let cachedKey = null

const getKey = async () => {
  if (cachedKey) return cachedKey
  try {
    const res = await fetch('/api/config')
    const data = await res.json()
    cachedKey = data.geminiApiKey
    return cachedKey
  } catch {
    return import.meta.env.VITE_GEMINI_API_KEY || ''
  }
}

const FALLBACK = [
  'I can only answer questions about Vengara constituency.',
  'That is outside my scope — I only assist with Vengara constituency matters.',
  'Please ask me something related to Vengara constituency.',
]

const SYSTEM_PROMPT = `You are a helpful assistant for Vengara constituency (Malappuram district, Kerala, India).

Guidelines:
- Only answer questions related to Vengara constituency.
- If a question is outside this scope, say that you only answer Vengara questions.
- Be concise and direct. Answer only what was asked.
- If asked about something not in your knowledge, say you don't have that information.

Vengara constituency covers: Vengara town, Ooragam, Kannamangalam, Parappanangadi, Vallikkunnu, Moodadi, et cetera.

Here is reference information about Vengara:

HOSPITALS:
- Govt Taluk Hospital, Vengara (main hospital)
- Govt Ayurveda Dispensary, Vengara
- AL Shifa Hospital, Parappanangadi
- Markaz Medical College

SCHOOLS:
- GHSS Vengara, GVHSS Ooragam, GHSS Kannamangalam, GHSS Parappanangadi, Markaz Residential School, Ideal English School, MES Higher Secondary School, Crescent English School, Al-Huda Academy, Noorul Islam English School

TEA SHOPS / COOL BARS / BAKERIES:
- Chakkara Cool Bar (Vengara town)
- Karim Bakery (near bus stand)
- Zam Zam Bakery (main road)
- Pathan's Tea Stall (near market)
- Munnar Tea Shop (Ooragam junction)
- Kunnath Cool Bar (Kannamangalam)
- Sana Bakery (Parappanangadi)
- Modern Bakery (Vengara town)
- Ashirvad Bakery (near taluk hospital)
- Thajudheen Cool Bar (Vallikkunnu)

RESTAURANTS BY CUISINE:
- Biryani / Arabian: Zam Zam Restaurant, Al-Noor Hotel, Malabar Palace, Thalassery Restaurant, Hotel Saffron, Star Kitchen (Vengara town), Al-Baik Arabian Restaurant (Parappanangadi), Fragrant Hub (Ooragam)
- Kerala meals: Hotel Vengara, Annapoorna Hotel, Hotel Saffron
- Mandhi / Alfaham: Mandhi Point, Arabian Nights, Al-Reem Mandhi

POLICE:
- Vengara Police Station: 0483-2890222
- Parappanangadi Police Station: 0483-2890223
- Vallikkunnu Police Station: 0483-2890224

WARD MEMBERS: 20 wards under Vengara Grama Panchayat.

OFFICE HOURS: 9:30 AM to 5:30 PM, Monday to Friday.

WATER: Kerala Water Authority (KWA) office in Vengara town. 0483-2890225.

KSEB: KSEB office Vengara. 0483-2890226. Outage: 1912.

BUS: Vengara bus stand to Malappuram, Kozhikode, Parappanangadi, Kottakkal, Kondotty, Manjeri.

RATION: Civil Supplies Office 0483-2890228.

PENSION: Vengara Panchayat office 0483-2890229.

CERTIFICATES: Birth/death/marriage/income/residence at Vengara Panchayat office.

LAND: Village office Vengara 0483-2890230.

LIBRARY: Vengara Public Library, 10 AM to 8 PM, closed Mondays.

WASTE: Haritha Karma Sena. Panchayat 0483-2890231.

BANK: Vengara Service Co-operative Bank, SBI, Canara Bank, Kerala Gramin Bank.

POST: Vengara Post Office 0483-2890232. PIN 676501.

SPORTS: Vengara Football Stadium, Indoor Stadium, Sports Complex, Gymnasium.

COMMUNITY HALL: Vengara Community Hall at Panchayat office.

MLA: K. N. A. Khader (as of 2021).

FIRE: Fire Station Vengara. 101 / 0483-2890233.

ANGANWADI: Multiple centers under ICDS.

AGRICULTURE: Krishi Bhavan Vengara 0483-2890234.

EMPLOYMENT: Vengara Employment Exchange 0483-2890235.

PERMITS: Building permits, trade licenses at Panchayat office.

NATURE:
- Kadalundi Bird Sanctuary (Kadalundi River)
- Paddy fields of Ooragam and Vallikkunnu
- Kunnathupadi Hills viewpoint
- Kadalundi backwaters
- Beypore beach (nearby)

LIVE DATA COMMANDS (include these in your response if relevant):
- fetch_weather — current weather in Vengara
- fetch_traffic — current road issues
- fetch_live — recent constituency posts and polls
- fetch_polls — active polls in the constituency`

export async function askVengaraAI(userMessage, conversationHistory) {
  const apiKey = await getKey()
  if (!apiKey) {
    return 'Gemini API key not configured. Ask the admin to set VITE_GEMINI_API_KEY in Railway dashboard.'
  }
  try {
    const contents = []
    for (const m of conversationHistory) {
      if (m.role === 'bot' || m.role === 'model') {
        contents.push({ role: 'model', parts: [{ text: m.text }] })
      } else if (m.role === 'user') {
        contents.push({ role: 'user', parts: [{ text: m.text }] })
      }
    }
    contents.push({ role: 'user', parts: [{ text: userMessage }] })

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        }),
      }
    )
    const data = await res.json()
    if (!res.ok) {
      console.error('Gemini API error:', data)
      const msg = data.error?.message || ''
      if (msg.includes('API_KEY') || msg.includes('not found') || msg.includes('API key')) {
        return 'Invalid or missing Gemini API key. Set a valid VITE_GEMINI_API_KEY in Railway dashboard.'
      }
      if (msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
        return 'Gemini API quota exceeded. The free tier has a daily limit — try again later or get a new key at https://aistudio.google.com/apikey'
      }
      return FALLBACK[Math.floor(Math.random() * FALLBACK.length)]
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''
    if (!text) return FALLBACK[Math.floor(Math.random() * FALLBACK.length)]

    const fetchKeywords = {
      fetch_weather: 'weather',
      fetch_traffic: 'traffic',
      fetch_live: 'live',
      fetch_polls: 'polls',
    }
    for (const [cmd, key] of Object.entries(fetchKeywords)) {
      if (text.includes(cmd)) {
        return { text: text.replace(cmd, '').trim(), fetch: key }
      }
    }
    return text
  } catch (err) {
    console.error('Gemini error:', err)
    return FALLBACK[Math.floor(Math.random() * FALLBACK.length)]
  }
}
