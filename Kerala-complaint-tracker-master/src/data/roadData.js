const storageKey = 'kct_road_reports'

function parseDate(str) {
  const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 }
  const p = str.split(' ')
  if (p.length !== 3) return null
  const m = months[p[1]]
  if (m === undefined) return null
  return new Date(parseInt(p[2]), m, parseInt(p[0]))
}

function isExpired(report) {
  const d = parseDate(report.date)
  if (!d) return false
  const hours = (Date.now() - d.getTime()) / 3600000
  if (report.type === 'traffic' && hours > 4) return true
  if (report.type === 'flood' && hours > 48) return true
  if (report.type === 'construction' && hours > 168) return true
  return false
}

const seedReports = [
  { id:'ROAD-001', type:'flood', lat:11.0475, lng:75.9785, description:'Water logging on main road near Vengara junction, 2 feet deep', date:'09 Jul 2026', status:'active', reporter:'Anonymous' },
  { id:'ROAD-002', type:'flood', lat:11.0518, lng:75.9820, description:'Kadalundi river overflow near block office, road partially submerged', date:'08 Jul 2026', status:'resolved', reporter:'Anonymous' },
  { id:'ROAD-003', type:'construction', lat:11.0492, lng:75.9760, description:'Road widening work ongoing, single lane traffic from 9 AM to 5 PM', date:'09 Jul 2026', status:'active', reporter:'Anonymous' },
  { id:'ROAD-004', type:'construction', lat:11.0520, lng:75.9845, description:'Drainage work near Tirurangadi road, heavy equipment on site', date:'04 Jul 2026', status:'resolved', reporter:'Anonymous' },
  { id:'ROAD-005', type:'traffic', lat:11.0500, lng:75.9795, lat2:11.0470, lng2:75.9770, description:'Heavy traffic from Vengara market to Kunnamangalam junction, expect 20 min delay', date:'10 Jul 2026', status:'active', reporter:'Anonymous' },
  { id:'ROAD-006', type:'traffic', lat:11.0460, lng:75.9720, lat2:11.0430, lng2:75.9695, description:'Accident near Kunnamangalam junction, traffic backed up 500m', date:'10 Jul 2026', status:'active', reporter:'Anonymous' },
]

export function getRoadReports() {
  let data = JSON.parse(localStorage.getItem(storageKey) || JSON.stringify(seedReports))
  let changed = false
  for (let i = 0; i < data.length; i++) {
    if (data[i].status === 'active' && isExpired(data[i])) {
      data[i].status = 'resolved'
      changed = true
    }
  }
  if (changed) saveRoadReports(data)
  return data
}

export const saveRoadReports = (reports) =>
  localStorage.setItem(storageKey, JSON.stringify(reports))

export const addRoadReport = ({ type, lat, lng, lat2, lng2, description }, reporter) => {
  const reports = getRoadReports()
  const report = {
    id: `ROAD-${String(reports.length + 1).padStart(3, '0')}`,
    type, lat, lng, description,
    ...(lat2 != null && lng2 != null ? { lat2, lng2 } : {}),
    date: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
    status: 'active',
    reporter: reporter || 'Anonymous',
  }
  const next = [report, ...reports]
  saveRoadReports(next)
  return next
}

export const resolveRoadReport = (id) => {
  const reports = getRoadReports().map(r =>
    r.id === id ? { ...r, status:'resolved' } : r
  )
  saveRoadReports(reports)
  return reports
}
