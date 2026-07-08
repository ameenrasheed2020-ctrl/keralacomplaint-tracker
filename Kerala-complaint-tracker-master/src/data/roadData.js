const storageKey = 'kct_road_reports'

const seedReports = [
  { id:'ROAD-001', type:'flood', lat:11.0475, lng:75.9785, description:'Water logging on main road near Vengara junction, 2 feet deep', date:'06 Jul 2026', status:'active', reporter:'Anonymous' },
  { id:'ROAD-002', type:'flood', lat:11.0518, lng:75.9820, description:'Kadalundi river overflow near block office, road partially submerged', date:'06 Jul 2026', status:'active', reporter:'Anonymous' },
  { id:'ROAD-003', type:'construction', lat:11.0492, lng:75.9760, description:'Road widening work ongoing, single lane traffic from 9 AM to 5 PM', date:'05 Jul 2026', status:'active', reporter:'Anonymous' },
  { id:'ROAD-004', type:'construction', lat:11.0520, lng:75.9845, description:'Drainage work near Tirurangadi road, heavy equipment on site', date:'04 Jul 2026', status:'active', reporter:'Anonymous' },
  { id:'ROAD-005', type:'traffic', lat:11.0500, lng:75.9795, lat2:11.0470, lng2:75.9770, description:'Heavy traffic from Vengara market to Kunnamangalam junction, expect 20 min delay', date:'06 Jul 2026', status:'active', reporter:'Anonymous' },
  { id:'ROAD-006', type:'traffic', lat:11.0460, lng:75.9720, lat2:11.0430, lng2:75.9695, description:'Accident near Kunnamangalam junction, traffic backed up 500m', date:'06 Jul 2026', status:'active', reporter:'Anonymous' },
]

export const getRoadReports = () =>
  JSON.parse(localStorage.getItem(storageKey) || JSON.stringify(seedReports))

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
