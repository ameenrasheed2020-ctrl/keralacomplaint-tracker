import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LuClipboardList, LuTrendingUp, LuChartBarIncreasing, LuLightbulb, LuNewspaper } from 'react-icons/lu'
import Navbar from '../components/Navbar'
import AnimatedCounter from '../components/AnimatedCounter'
import PollCard from './PollCard'
import { translatePost, translatePoll } from '../i18n/translateContent'
import heroPhoto from '../assets/mla-crowd-wave.jpg'
import speechPhoto from '../assets/mla-podium-speech.jpg'
import posterPhoto from '../assets/vengara-development-poster.jpg'
import {
  getPublicPolls,
  getPublicPosts,
} from '../data/communityData'
import { getRoadReports, addRoadReport, resolveRoadReport } from '../data/roadData'

const dirCategories = {
  admin:     { label: 'govtDir.catAdmin',     color: '#1F5C3F', icon: '<path d="M3 21V9l9-7 9 7v12h-7v-7h-4v7H3z"/>' },
  police:    { label: 'govtDir.catPolice',    color: '#9A2B25', icon: '<path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 10.5h6c-.53 4.12-3.28 7.79-6 8.94V12.5H6V8.12l6-3.33v6.71z"/>' },
  health:    { label: 'govtDir.catHealth',    color: '#2B6E6E', icon: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>' },
  post:      { label: 'govtDir.catPost',      color: '#B8912F', icon: '<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>' },
  political: { label: 'govtDir.catPolitical', color: '#3D3A6B', icon: '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>' },
}

const roadCategories = {
  flood:        { label:'Flooded road',  color:'#2563eb', icon:'<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>', emoji:'🌊' },
  construction: { label:'Construction',  color:'#ea580c', icon:'<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>', emoji:'🚧' },
  traffic:      { label:'Traffic jam',   color:'#dc2626', icon:'<path d="M7 3h10l2 5v2H5V8l2-5zm0 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM5 10h14v3H5v-3z"/>', emoji:'🚦' },
}

const places = [
  { name: 'Vengara Block Panchayat Office',      lat: 11.0502598, lng: 75.9839803, cat: 'admin',     note: 'govtDir.noteBlockPanchayat' },
  { name: 'Vengara Grama Panchayat Office',       lat: 11.0502309, lng: 75.9846703, cat: 'admin',     note: 'govtDir.noteGramaPanchayat' },
  { name: 'Village Office Vengara',               lat: 11.0491583, lng: 75.9621364, cat: 'admin',     note: 'govtDir.noteVillageOffice' },
  { name: 'Sub Registrar Office, Vengara',        lat: 11.0518449, lng: 75.9776071, cat: 'admin',     note: 'govtDir.noteSubRegistrar' },
  { name: 'Office of Assistant Educational Officer', lat: 11.0488573, lng: 75.9780223, cat: 'admin', note: 'govtDir.noteAEO' },
  { name: 'Tirurangadi Taluk Industries Office',  lat: 11.0502312, lng: 75.9838761, cat: 'admin',     note: 'govtDir.noteIndustries' },
  { name: 'LSGD Engineer Office',                 lat: 11.0503191, lng: 75.9843961, cat: 'admin',     note: 'govtDir.noteLSGD' },
  { name: 'PIO, Block Development',               lat: 11.0503281, lng: 75.9843212, cat: 'admin',     note: 'govtDir.notePIO' },
  { name: 'KM Shaji MLA Office, Vengara',         lat: 11.0504197, lng: 75.9774864, cat: 'political', note: 'govtDir.noteMLA' },
  { name: 'Community Health Centre (CHC)',        lat: 11.0494988, lng: 75.9836277, cat: 'health',    note: 'govtDir.noteCHC' },
  { name: 'Government Ayurveda Hospital',         lat: 11.0516325, lng: 75.9805552, cat: 'health',    note: 'govtDir.noteAyurveda' },
  { name: 'Government Homeo Hospital',            lat: 11.050404,  lng: 75.9747198, cat: 'health',    note: 'govtDir.noteHomeo' },
  { name: 'Vengara Police Station',               lat: 11.0498603, lng: 75.984275,  cat: 'police',    note: 'govtDir.notePolice' },
  { name: 'Vengara Post Office',                  lat: 11.05065,   lng: 75.9757564, cat: 'post',      note: 'govtDir.notePost' },
  { name: 'Vengara Fire Station',                 lat: 11.0485,   lng: 75.9812,    cat: 'police',    note: 'govtDir.noteFire' },
  { name: 'KSEB Vengara Section Office',          lat: 11.0499,   lng: 75.9768,    cat: 'admin',     note: 'govtDir.noteKSEB' },
  { name: 'Vengara Co-operative Bank',            lat: 11.0508,   lng: 75.9752,    cat: 'admin',     note: 'govtDir.noteBank' },
  { name: 'Vengara Krishi Bhavan',                lat: 11.0501,   lng: 75.9829,    cat: 'admin',     note: 'govtDir.noteKrishi' },
  { name: 'Anganwadi Training Centre, Vengara',   lat: 11.0497,   lng: 75.9785,    cat: 'admin',     note: 'govtDir.noteAnganwadi' },
  { name: 'Vengara Public Library',               lat: 11.0512,   lng: 75.9761,    cat: 'admin',     note: 'govtDir.noteLibrary' },
]

const Home = () => {
  const { t } = useTranslation()
  const [posts] = useState(() =>
    getPublicPosts().filter((p) => p.status === 'published')
  )
  const [polls, setPolls] = useState(() =>
    getPublicPolls().filter((p) => p.status === 'published')
  )
  const [showAllPrograms, setShowAllPrograms] = useState(false)
  const [showAllNotifications, setShowAllNotifications] = useState(false)
  const [showAllPolls, setShowAllPolls] = useState(false)
  const [activeTab, setActiveTab] = useState('programs')

  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef([])
  const [dirActiveCat, setDirActiveCat] = useState('all')
  const [roadReports, setRoadReports] = useState(() => getRoadReports())
  const [reportMode, setReportMode] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [placingLat, setPlacingLat] = useState(null)
  const [placingLng, setPlacingLng] = useState(null)
  const [reportType, setReportType] = useState('flood')
  const [reportDesc, setReportDesc] = useState('')
  const [roadFilter, setRoadFilter] = useState('all')
  const [placingLat2, setPlacingLat2] = useState(null)
  const [placingLng2, setPlacingLng2] = useState(null)
  const [secondClickMode, setSecondClickMode] = useState(false)
  const roadLayerRef = useRef(null)

  const [news, setNews] = useState([])
  const [newsError, setNewsError] = useState('')
  const [newsIndex, setNewsIndex] = useState(0)

  function fetchNews() {
    const rss = 'https://news.google.com/rss/search?q=Vengara+Kerala&hl=en-IN&gl=IN&ceid=IN:en'
    const url = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rss)
    fetch(url).then(r => r.json()).then(d => {
      if (d.status === 'ok') {
        const out = []
        for (let i = 0; i < d.items.length && i < 8; i++) {
          const item = d.items[i]
          out.push({ title: item.title, link: item.link, date: item.pubDate ? item.pubDate.split(' ')[0] : '', source: item.author || 'News' })
        }
        setNews(out)
        setNewsError('')
      }
    }).catch(() => setNewsError('Could not load news'))
  }

  useEffect(() => {
    fetchNews()
    const id = setInterval(fetchNews, 300000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (news.length < 2) return
    const id = setInterval(() => setNewsIndex(i => (i + 1) % news.length), 5000)
    return () => clearInterval(id)
  }, [news.length])

  useEffect(() => {
    if (mapInstance.current) return
    const map = L.map(mapRef.current, { zoomControl: true, dragging: false }).setView([11.0502, 75.98], 15)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)
    const markers = places.map((p) => {
      const c = dirCategories[p.cat]
      const m = L.marker([p.lat, p.lng], {
        icon: L.divIcon({
          className: 'dir-marker-icon',
          html: `<div class="dir-marker-circle" style="background:${c.color}"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${c.icon}</svg></div>`,
          iconSize: [36, 36], iconAnchor: [18, 18],
        }),
      }).addTo(map)
      m.bindTooltip(p.name, { sticky: true, direction: 'top', offset: [0, -22], className: 'dir-marker-label' })
      m.bindPopup(`<b>${p.name}</b><br/><span style="color:#666;font-size:12px">${t(p.note)}</span><br/><a href="https://www.google.com/maps?q=${p.lat},${p.lng}" target="_blank" rel="noopener" style="font-size:12px;color:#1F5C3F;font-weight:600">Open in Google Maps &rarr;</a>`)
      m._cat = p.cat
      return m
    })
    markersRef.current = markers
    const bounds = L.featureGroup(markers).getBounds()
    map.fitBounds(bounds.pad(0.25))

    // ─── Weather widget (top-right) ───
    const weatherCodes = { 0:'☀️ Clear',1:'🌤 Mainly clear',2:'⛅ Partly cloudy',3:'☁️ Overcast',45:'🌫 Fog',48:'🌫 Rime fog',51:'🌦 Light drizzle',53:'🌦 Moderate drizzle',55:'🌧 Dense drizzle',61:'🌦 Slight rain',63:'🌧 Moderate rain',65:'🌧 Heavy rain',66:'🌧 Light freezing rain',67:'🌧 Heavy freezing rain',71:'❄️ Slight snow',73:'❄️ Moderate snow',75:'❄️ Heavy snow',77:'❄️ Snow grains',80:'🌦 Slight showers',81:'🌧 Moderate showers',82:'🌧 Violent showers',85:'❄️ Slight snow showers',86:'❄️ Heavy snow showers',95:'⛈ Thunderstorm',96:'⛈ Thunderstorm + hail',99:'⛈ Thunderstorm + heavy hail' }
    let weatherDiv
    const fetchWeather = () => {
      fetch('https://api.open-meteo.com/v1/forecast?latitude=11.05&longitude=75.98&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=precipitation_sum,precipitation_probability_max&timezone=auto&forecast_days=1')
        .then(r => r.json()).then(d => {
          const c = d.current
          const w = weatherCodes[c.weather_code] || '❓ Unknown'
          const precipToday = d.daily.precipitation_sum[0]
          const risk = precipToday > 40 ? 'high' : precipToday > 15 ? 'moderate' : 'low'
          if (!weatherDiv) return
          weatherDiv.innerHTML = `
            <div class="ww-main">${w.split(' ')[0]} ${Math.round(c.temperature_2m)}°C</div>
            <div class="ww-details">Feels ${Math.round(c.apparent_temperature)}° · ${c.relative_humidity_2m}% · ${c.wind_speed_10m} km/h</div>
            <div class="ww-details">${c.precipitation} mm now · ${precipToday} mm today</div>
            ${c.weather_code >= 95 ? '<div class="ww-alert">⛈ Thunderstorm warning</div>' : ''}
            ${precipToday > 40 ? '<div class="ww-alert">🌧 Flood risk: HIGH</div>' : precipToday > 15 ? '<div class="ww-alert">🌧 Flood risk: MODERATE</div>' : ''}
            <div class="ww-footer">Vengara, Kerala</div>`
          map.fire('weatherUpdate', { precip: precipToday, risk })
        }).catch(() => { if (weatherDiv) weatherDiv.innerHTML = '<div class="ww-error">⚠️ Weather unavailable</div>' })
    }
    const WeatherWidget = L.Control.extend({
      options: { position: 'topright' },
      onAdd: function () {
        weatherDiv = L.DomUtil.create('div', 'weather-widget')
        weatherDiv.innerHTML = '<div class="ww-loading">⟳</div>'
        fetchWeather()
        return weatherDiv
      }
    })
    map.addControl(new WeatherWidget())
    const weatherInterval = setInterval(fetchWeather, 300000)

    // ─── Flood-prone zone polygons ───
    const floodAreas = {
      type: 'FeatureCollection',
      features: [
        { type:'Feature', properties:{name:'Kadalundi River Basin'}, geometry:{type:'Polygon',coordinates:[[[75.93,11.02],[75.98,11.01],[75.99,11.04],[75.97,11.06],[75.93,11.05],[75.93,11.02]]]} },
        { type:'Feature', properties:{name:'Vengara Town Low-lying'}, geometry:{type:'Polygon',coordinates:[[[75.96,11.045],[75.99,11.045],[75.99,11.06],[75.96,11.06],[75.96,11.045]]]} },
        { type:'Feature', properties:{name:'Western Paddy Fields'}, geometry:{type:'Polygon',coordinates:[[[75.92,11.04],[75.95,11.04],[75.95,11.07],[75.92,11.07],[75.92,11.04]]]} },
        { type:'Feature', properties:{name:'Tirurangadi Floodplain'}, geometry:{type:'Polygon',coordinates:[[[75.96,11.03],[75.99,11.03],[76.00,11.045],[75.96,11.045],[75.96,11.03]]]} },
        { type:'Feature', properties:{name:'Anakkayam River Area'}, geometry:{type:'Polygon',coordinates:[[[75.94,11.06],[75.97,11.06],[75.97,11.08],[75.94,11.08],[75.94,11.06]]]} },
      ]
    }
    const floodColors = { low: { fill:'#22c55e', border:'#16a34a', op:0.15 }, moderate: { fill:'#f59e0b', border:'#d97706', op:0.25 }, high: { fill:'#ef4444', border:'#b91c1c', op:0.35 } }
    const floodLayer = L.geoJSON(floodAreas, {
      style: { fillColor:'#22c55e', fillOpacity:0.15, color:'#16a34a', weight:1.5, dashArray:'4 4' },
      onEachFeature: (feat, layer) => {
        layer.bindTooltip(`<b>${feat.properties.name}</b><br>Flood-prone zone`, { className:'flood-tooltip' })
      }
    }).addTo(map)
    map.on('weatherUpdate', function (e) {
      const c = floodColors[e.risk] || floodColors.low
      floodLayer.setStyle({ fillColor:c.fill, color:c.border, fillOpacity:c.op })
    })

    // ─── Legend ───
    const Legend = L.Control.extend({
      options: { position: 'bottomleft' },
      onAdd: function () {
        const div = L.DomUtil.create('div', 'map-legend')
        div.innerHTML = '<div class="map-legend-title">Flood risk</div>' +
          '<div class="map-legend-row"><span class="map-legend-dot" style="background:#22c55e"></span> Low</div>' +
          '<div class="map-legend-row"><span class="map-legend-dot" style="background:#f59e0b"></span> Moderate</div>' +
          '<div class="map-legend-row"><span class="map-legend-dot" style="background:#ef4444"></span> High</div>'
        return div
      }
    })
    map.addControl(new Legend())

    mapInstance.current = map
    return () => {
      clearInterval(weatherInterval)
      map.remove()
      mapInstance.current = null
    }
  }, [])

  useEffect(() => {
    markersRef.current.forEach((m) => {
      const show = dirActiveCat === 'all' || m._cat === dirActiveCat
      if (show) { if (!mapInstance.current.hasLayer(m)) m.addTo(mapInstance.current) }
      else { if (mapInstance.current.hasLayer(m)) mapInstance.current.removeLayer(m) }
    })
  }, [dirActiveCat])

  useEffect(() => {
    const map = mapInstance.current
    if (!map) return
    if (roadLayerRef.current) map.removeLayer(roadLayerRef.current)
    const layer = L.layerGroup()
    roadReports.forEach(r => {
      if (r.status !== 'active') return
      const cat = roadCategories[r.type]
      const m = L.marker([r.lat, r.lng], {
        icon: L.divIcon({
          className: 'dir-marker-icon',
          html: `<div class="dir-marker-circle road-marker-circle" style="background:${cat.color}"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${cat.icon}</svg></div>`,
          iconSize: [36, 36], iconAnchor: [18, 18],
        }),
      })
      m._rtype = r.type
      m._reportId = r.id
      const show = roadFilter === 'all' || r.type === roadFilter
      if (!show) return
      m.bindPopup(`
        <b>${cat.emoji} ${cat.label}</b><br/>
        ${r.description}<br/>
        <small style="color:#666">${r.date} · ${r.status}</small>
      `)
      layer.addLayer(m)
      if (r.lat2 != null && r.lng2 != null) {
        const line = L.polyline([[r.lat, r.lng], [r.lat2, r.lng2]], {
          color: cat.color, weight: 4, opacity: 0.7, dashArray: '8 6',
        })
        layer.addLayer(line)
      }
    })
    layer.addTo(map)
    roadLayerRef.current = layer
  }, [roadReports, roadFilter])

  useEffect(() => {
    const id = setInterval(() => setRoadReports(getRoadReports()), 30000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const map = mapInstance.current
    if (!map) return
    const handler = (e) => {
      if (!reportMode && !secondClickMode) return
      if (secondClickMode) {
        setPlacingLat2(e.latlng.lat)
        setPlacingLng2(e.latlng.lng)
        setShowForm(true)
        setSecondClickMode(false)
        setReportMode(false)
        return
      }
      setPlacingLat(e.latlng.lat)
      setPlacingLng(e.latlng.lng)
      if (reportType === 'traffic') {
        setSecondClickMode(true)
      } else {
        setShowForm(true)
        setReportMode(false)
      }
    }
    map.on('click', handler)
    if (!reportMode && !showForm && !secondClickMode) {
      setPlacingLat(null)
      setPlacingLng(null)
      setPlacingLat2(null)
      setPlacingLng2(null)
    }
    return () => map.off('click', handler)
  }, [reportMode, showForm, secondClickMode, reportType])

  const startReport = () => {
    setReportMode(true)
    setSecondClickMode(false)
    setShowForm(false)
    setPlacingLat(null)
    setPlacingLng(null)
    setPlacingLat2(null)
    setPlacingLng2(null)
    setReportDesc('')
  }

  const cancelReport = () => {
    setReportMode(false)
    setSecondClickMode(false)
    setShowForm(false)
    setPlacingLat(null)
    setPlacingLng(null)
    setPlacingLat2(null)
    setPlacingLng2(null)
    setReportType('flood')
    setReportDesc('')
  }

  const submitReport = () => {
    if (!reportDesc.trim()) return
    addRoadReport({
      type: reportType,
      lat: placingLat,
      lng: placingLng,
      ...(placingLat2 != null && placingLng2 != null ? { lat2: placingLat2, lng2: placingLng2 } : {}),
      description: reportDesc,
    })
    setRoadReports(getRoadReports())
    cancelReport()
  }

  const programs = posts.filter((p) => p.type !== 'Notification')
  const notifications = posts.filter((p) => p.type === 'Notification')

  const visiblePrograms = showAllPrograms ? programs : programs.slice(0, 6)
  const visibleNotifications = showAllNotifications ? notifications : notifications.slice(0, 6)
  const visiblePolls = showAllPolls ? polls : polls.slice(0, 6)

  const location = useLocation()
  const navigate = useNavigate()

  useLayoutEffect(() => {
    const savedTab = sessionStorage.getItem('login_redirect_tab')
    if (savedTab) {
      sessionStorage.removeItem('login_redirect_tab')
      setActiveTab(savedTab)
      document.getElementById('updates')?.scrollIntoView({ behavior: 'auto' })
    } else if (location.state?.tab) {
      setActiveTab(location.state.tab)
      document.getElementById('updates')?.scrollIntoView({ behavior: 'auto' })
    }
  }, [location.state])

  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const moments = [
    { image: heroPhoto, caption: t('gallery.img1Alt') },
    { image: speechPhoto, caption: t('gallery.img2Alt') },
    { image: posterPhoto, caption: t('gallery.img3Alt') },
  ]

  const services = [
    {
      icon: LuClipboardList,
      title: t('services.fileComplaint'),
      body: t('services.fileComplaintBody'),
      to: '/complaints/new',
    },
    {
      icon: LuTrendingUp,
      title: t('services.trackProgress'),
      body: t('services.trackProgressBody'),
      to: '/complaints/new',
    },
    {
      icon: LuChartBarIncreasing,
      title: t('services.publicPolls'),
      body: t('services.publicPollsBody'),
      to: '#updates',
    },
    {
      icon: LuLightbulb,
      title: t('services.shareIdea'),
      body: t('services.shareIdeaBody'),
      to: '/ideas/new',
    },
  ]

  const steps = [
    {
      n: t('howItWorks.step1Num'),
      title: t('howItWorks.step1Title'),
      body: t('howItWorks.step1Body'),
    },
    {
      n: t('howItWorks.step2Num'),
      title: t('howItWorks.step2Title'),
      body: t('howItWorks.step2Body'),
    },
    {
      n: t('howItWorks.step3Num'),
      title: t('howItWorks.step3Title'),
      body: t('howItWorks.step3Body'),
    },
  ]

  return (
    <>
      <Navbar />
      <main className="landing-page">

        {/* ───── HERO ───── */}
        <section
          className="lp-hero"
          style={{ backgroundImage: `url(${heroPhoto})` }}
        >
          <div className="lp-hero-overlay" />
          <div className="lp-hero-body">
            <p className="lp-hero-ornament" data-reveal>{t('hero.subtitle')}</p>
            <h1 className="lp-hero-title" data-reveal>
              <span className="lp-hero-mla">{t('hero.mlaName')}</span>
              <span className="lp-hero-tagline">{t('hero.title')}</span>
            </h1>
            <p className="lp-hero-desc" data-reveal>
              {t('hero.description')}
            </p>
            <div className="lp-hero-actions">
              <Link  style={{paddingRight:"10px"}}className="lp-btn lp-btn-primary" to="/complaints/new">
                {t('hero.cta')}
              </Link>
              <a className="lp-btn lp-btn-outline" href="#updates">
                {t('hero.latestUpdates')}
              </a>
            </div>
            {polls[0] && (
              <div className="lp-hero-banner" onClick={() => navigate(`/detail/${polls[0].id}`)} style={{ cursor: 'pointer' }}>
                <span className="lp-hero-banner-dot" />
                <span className="lp-hero-banner-label">{t('hero.activePoll')}</span>
                <span className="lp-hero-banner-text">{translatePoll(polls[0], t).question}</span>
                <span className="lp-hero-banner-link">{t('hero.vote')}</span>
              </div>
            )}
          </div>

          <div className="lp-hero-credit">
            <span>{t('hero.constituencyName')}</span>
            <span>{t('hero.officeName')}</span>
          </div>
        </section>

        {/* ───── MESSAGE FROM MLA ───── */}
        <section className="lp-section lp-section-light">
          <div className="lp-message">
            <div className="lp-message-image" data-reveal>
              <img src={speechPhoto} alt={t('gallery.img1Alt')} loading="lazy" />
            </div>
            <div className="lp-message-text" data-reveal>
              <p className="lp-eyebrow">{t('mlaMessage.heading')}</p>
              <h2>{t('mlaMessage.title')}</h2>
              <p>{t('mlaMessage.body1')}</p>
              <p>{t('mlaMessage.body2')}</p>
              <div className="lp-message-signoff">
                <strong>{t('mlaMessage.signoff')}</strong>
                <span>{t('mlaMessage.signoffTitle')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ───── PHOTO GALLERY ───── */}
        <section className="lp-section">
          <div className="lp-section-heading" data-reveal>
            <p className="lp-eyebrow">{t('gallery.heading')}</p>
            <h2>{t('gallery.subheading')}</h2>
            <p className="lp-section-sub">{t('gallery.description')}</p>
          </div>
          <div className="lp-gallery">
            {moments.map((moment, i) => (
              <figure className="lp-gallery-card" key={moment.caption} data-reveal>
                <div className="lp-gallery-image">
                  <img src={moment.image} alt={moment.caption} loading="lazy" />
                </div>
                <figcaption>{moment.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ───── SERVICES ───── */}
        <section className="lp-section lp-section-green">
          <div className="lp-section-heading lp-section-heading-light" data-reveal>
            <p className="lp-eyebrow">{t('services.heading')}</p>
            <h2>{t('services.subheading')}</h2>
            <p className="lp-section-sub">{t('services.description')}</p>
          </div>
          <div className="lp-services">
            {services.map((svc, i) => (
              <Link className="lp-service-card" to={svc.to} key={svc.title} data-reveal>
                <span className="lp-service-icon"><svc.icon size={36} /></span>
                <h3>{svc.title}</h3>
                <p>{svc.body}</p>
                <span className="lp-service-cta">{t('services.learnMore')}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ───── STATISTICS ───── */}
        <section className="lp-section lp-section-green">
          <div className="lp-stats" data-reveal>
            <div className="lp-stat">
              <span className="lp-stat-number"><AnimatedCounter end={programs.length} /></span>
              <span className="lp-stat-label">{t('stats.programs')}</span>
            </div>
            <div className="lp-stat">
              <span className="lp-stat-number"><AnimatedCounter end={polls.length} /></span>
              <span className="lp-stat-label">{t('stats.activePolls')}</span>
            </div>
            <div className="lp-stat">
              <span className="lp-stat-number"><AnimatedCounter end={142} /></span>
              <span className="lp-stat-label">{t('stats.complaintsResolved')}</span>
            </div>
            <div className="lp-stat">
              <span className="lp-stat-number"><AnimatedCounter end={95} suffix="%" /></span>
              <span className="lp-stat-label">{t('stats.successRate')}</span>
            </div>
          </div>
        </section>

        {/* ───── UPDATES ───── */}
        <section className="lp-section lp-section-light" id="updates">
          <div className="lp-section-heading" data-reveal>
            <p className="lp-eyebrow">{t('updates.heading')}</p>
            <h2>{t('updates.subheading')}</h2>
            <p className="lp-section-sub">{t('updates.description')}</p>
          </div>

          <div className="lp-tab-bar">
            <button
              className={`lp-tab${activeTab === 'programs' ? ' active' : ''}`}
              onClick={() => setActiveTab('programs')}
            >
              {t('updates.tabPrograms')} <span className="lp-tab-badge">{programs.length}</span>
            </button>
            <button
              className={`lp-tab${activeTab === 'notifications' ? ' active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              {t('updates.tabNotifications')} <span className="lp-tab-badge">{notifications.length}</span>
            </button>
            <button
              className={`lp-tab${activeTab === 'polls' ? ' active' : ''}`}
              onClick={() => setActiveTab('polls')}
            >
              {t('updates.tabPolls')} <span className="lp-tab-badge">{polls.length}</span>
            </button>
          </div>

          <div className="lp-feed">
            {activeTab === 'programs' && visiblePrograms.map((post) => {
              const tp = translatePost(post, t)
              return (
              <Link className="lp-post" key={post.id} to={`/detail/${post.id}`}>
                <div className="lp-post-header">
                  <span className="lp-post-type">{tp.type}</span>
                  <span className="lp-post-date">{post.date}</span>
                </div>
                <h3>{tp.title}</h3>
                <p>{tp.body}</p>
                <span className="lp-post-audience">{t('updates.for')} {tp.audience}</span>
              </Link>
              )
            })}
            {activeTab === 'programs' && !showAllPrograms && programs.length > 6 && (
              <button className="lp-show-more" onClick={() => setShowAllPrograms(true)}>
                {t('updates.showMore', { tab: t('updates.tabPrograms') })}
              </button>
            )}
            {activeTab === 'programs' && showAllPrograms && programs.length > 6 && (
              <button className="lp-show-more" onClick={() => setShowAllPrograms(false)}>
                {t('updates.showLess')}
              </button>
            )}

            {activeTab === 'notifications' && visibleNotifications.map((post) => {
              const tp = translatePost(post, t)
              return (
              <Link className="lp-post" key={post.id} to={`/detail/${post.id}`}>
                <div className="lp-post-header">
                  <span className="lp-post-type">{tp.type}</span>
                  <span className="lp-post-date">{post.date}</span>
                </div>
                <h3>{tp.title}</h3>
                <p>{tp.body}</p>
                <span className="lp-post-audience">{t('updates.for')} {tp.audience}</span>
              </Link>
              )
            })}
            {activeTab === 'notifications' && !showAllNotifications && notifications.length > 6 && (
              <button className="lp-show-more" onClick={() => setShowAllNotifications(true)}>
                {t('updates.showMore', { tab: t('updates.tabNotifications') })}
              </button>
            )}
            {activeTab === 'notifications' && showAllNotifications && notifications.length > 6 && (
              <button className="lp-show-more" onClick={() => setShowAllNotifications(false)}>
                {t('updates.showLess')}
              </button>
            )}

            {activeTab === 'polls' && visiblePolls.map((poll) => (
              <PollCard poll={poll} key={poll.id} onVoted={setPolls} />
            ))}
            {activeTab === 'polls' && !showAllPolls && polls.length > 6 && (
              <button className="lp-show-more" onClick={() => setShowAllPolls(true)}>
                {t('updates.showMore', { tab: t('updates.tabPolls') })}
              </button>
            )}
            {activeTab === 'polls' && showAllPolls && polls.length > 6 && (
              <button className="lp-show-more" onClick={() => setShowAllPolls(false)}>
                {t('updates.showLess')}
              </button>
            )}
          </div>
        </section>

        {/* ───── HOW IT WORKS ───── */}
        <section className="lp-section">
          <div className="lp-section-heading" data-reveal>
            <p className="lp-eyebrow">{t('howItWorks.heading')}</p>
            <h2>{t('howItWorks.subheading')}</h2>
          </div>
          <div className="lp-steps">
            {steps.map((step, i) => (
              <article className="lp-step" key={step.n} data-reveal>
                <span className="lp-step-num">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ───── GOVT DIRECTORY MAP ───── */}
        <section className="lp-section">
          <div className="lp-section-heading" data-reveal>
            <p className="lp-eyebrow">{t('govtDir.title')}</p>
            <h2>{t('govtDir.register')}</h2>
          </div>
          <div className="dir-tabs" style={{ marginBottom: 16 }}>
            <button className={`dir-tab${dirActiveCat === 'all' ? ' active' : ''}`} onClick={() => setDirActiveCat('all')}>
              {t('govtDir.all')} ({places.length})
            </button>
            {Object.entries(dirCategories).map(([key, c]) => {
              const count = places.filter((p) => p.cat === key).length
              return (
                <button key={key} className={`dir-tab${dirActiveCat === key ? ' active' : ''}`} onClick={() => setDirActiveCat(key)}>
                  <span className="dir-tab-dot" style={{ background: c.color }} />
                  {t(c.label)} ({count})
                </button>
              )
            })}
          </div>

          <div className="road-toolbar">
            {reportMode && !secondClickMode && (
              <div className="road-placement-status">Click on the map to place your report</div>
            )}
            {secondClickMode && (
              <div className="road-placement-status">📍 Start set — now click the <b>end</b> of the traffic jam</div>
            )}
            <div className="road-filters">
              <span style={{fontSize:11,fontWeight:600,marginRight:4,color:'var(--ink-light)'}}>{t('govtDir.roadReports') || 'Reports'}:</span>
              <button className={`road-filter-btn${roadFilter==='all'?' active':''}`} onClick={()=>setRoadFilter('all')}>All</button>
              {Object.entries(roadCategories).map(([k,c]) => (
                <button key={k} className={`road-filter-btn${roadFilter===k?' active':''}`} onClick={()=>setRoadFilter(k)}>
                  {c.emoji} {c.label}
                </button>
              ))}
              <button className={`road-filter-btn road-resolve-btn${(reportMode||secondClickMode)?' active':''}`} onClick={startReport}>
                📢 {(reportMode||secondClickMode) ? 'Cancel' : 'Report'}
              </button>
            </div>
          </div>

          <div className="dir-map-wrap" style={{ padding: 0, position: 'relative' }}>
            {showForm && (
              <div className="road-report-overlay">
                <div className="road-report-form">
                  <h4 style={{margin:'0 0 8px'}}>Report road issue</h4>
                  <p style={{fontSize:11,color:'var(--ink-light)',margin:'0 0 8px'}}>
                    📍 Start: {placingLat?.toFixed(4)}, {placingLng?.toFixed(4)}
                    {placingLat2 != null && <><br/>🏁 End: {placingLat2?.toFixed(4)}, {placingLng2?.toFixed(4)}</>}
                  </p>
                  <select value={reportType} onChange={e=>setReportType(e.target.value)} className="road-report-select">
                    <option value="flood">🌊 Flooded road</option>
                    <option value="construction">🚧 Construction / road work</option>
                    <option value="traffic">🚦 Traffic jam</option>
                  </select>
                  <textarea className="road-report-textarea" placeholder="Describe the issue (e.g. water depth, severity, location details)..." value={reportDesc} onChange={e=>setReportDesc(e.target.value)} rows={3} />
                  <div style={{display:'flex',gap:8,marginTop:8}}>
                    <button className="road-report-btn road-report-btn-primary" onClick={submitReport} disabled={!reportDesc.trim()}>Submit</button>
                    <button className="road-report-btn" onClick={cancelReport}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
            <div ref={mapRef} className="dir-map" />
          </div>
        </section>

        {/* ───── VENGARA NEWS ───── */}
        <section className="lp-section">
          <div className="lp-section-heading" data-reveal>
            <p className="lp-eyebrow"><LuNewspaper size={16} style={{marginRight:6}} />Vengara News</p>
            <h2>Latest News</h2>
          </div>
          <div style={{position:'relative',background:'linear-gradient(135deg,#1a3a5c,#2563eb)',borderRadius:12,padding:'28px 24px',color:'white',minHeight:100}}>
            {newsError && <p style={{color:'rgba(255,255,255,0.7)',textAlign:'center',margin:0}}>{newsError}</p>}
            {news.length === 0 && !newsError && <p style={{color:'rgba(255,255,255,0.7)',textAlign:'center',margin:0}}>Loading news...</p>}
            {news.length > 0 && (
              <a key={newsIndex} href={news[newsIndex].link} target="_blank" rel="noopener noreferrer"
                style={{textDecoration:'none',color:'white',display:'block',animation:'fadeIn 0.5s'}}>
                <div style={{fontSize:13,opacity:0.7,marginBottom:6}}>
                  <LuNewspaper size={14} style={{marginRight:6}} />{news[newsIndex].source} · {news[newsIndex].date}
                </div>
                <div style={{fontSize:17,fontWeight:600,lineHeight:1.4}}>{news[newsIndex].title}</div>
              </a>
            )}
            {news.length > 1 && (
              <div style={{display:'flex',justifyContent:'center',gap:6,marginTop:16}}>
                {news.map((_, i) => (
                  <div key={i} onClick={() => setNewsIndex(i)}
                    style={{width:8,height:8,borderRadius:'50%',background:i === newsIndex ? 'white' : 'rgba(255,255,255,0.4)',cursor:'pointer',transition:'0.3s'}} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ───── CTA ───── */}
        <section className="lp-section lp-section-gold">
          <div className="lp-cta" data-reveal>
            <h2>{t('cta.heading')}</h2>
            <p>{t('cta.body')}</p>
            <Link className="lp-btn lp-btn-dark" to="/complaints/new">
              {t('cta.button')}
            </Link>
          </div>
        </section>

        {/* ───── FOOTER ───── */}
        <footer className="lp-footer">
          <div className="lp-footer-inner" data-reveal>
            <div className="lp-footer-brand">
              <span className="lp-footer-seal">
                <svg viewBox="0 0 40 40" aria-hidden="true">
                  <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="20" cy="20" r="15.5" fill="none" stroke="currentColor" strokeWidth="0.75" />
                </svg>
                <span>{t('footer.kc')}</span>
              </span>
              <div>
                <strong>{t('footer.brand')}</strong>
                <span>{t('footer.tagline')}</span>
              </div>
            </div>
            <div className="lp-footer-info">
              <span>{t('footer.office')}</span>
              <span>{t('footer.constituency')}</span>
            </div>
          </div>
        </footer>

      </main>
    </>
  )
}

export default Home
