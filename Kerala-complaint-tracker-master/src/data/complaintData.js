function seed() {
  const k = 'kct_complaints'
  let d = localStorage.getItem(k)
  if (d) return
  const now = new Date()
  const seeds = [
    { id: 'KCT-001', title: 'Road potholes near Town Hall', department: 'PWD', category: 'Road', ward: 'Ward 1', description: 'Multiple potholes on the main road near Town Hall causing traffic and accidents.', status: 'resolved', files: [], userId: 'admin', userName: 'Admin', userPhone: '', date: '2025-12-10', resolvedDate: '2025-12-18', updatedAt: '2025-12-18', viewed: false },
    { id: 'KCT-002', title: 'Street light not working', department: 'KSEB', category: 'Streetlight', ward: 'Ward 3', description: 'Street light opposite the school has been broken for a week. Children are facing issues in the evening.', status: 'in_progress', files: [], userId: 'U001', userName: 'Rahul', userPhone: '9876543210', date: '2025-12-28', resolvedDate: null, updatedAt: '2025-12-30', viewed: true },
    { id: 'KCT-003', title: 'Drainage overflow', department: 'LSGD', category: 'Drainage', ward: 'Ward 5', description: 'Drainage line overflowing near the market area. Foul smell and health hazard.', status: 'pending', files: [], userId: 'U002', userName: 'Fathima', userPhone: '9876543211', date: '2026-01-02', resolvedDate: null, updatedAt: '2026-01-02', viewed: false },
    { id: 'KCT-004', title: 'Water shortage in colony', department: 'Water Authority', category: 'Water', ward: 'Ward 2', description: 'No water supply for 3 days in the housing colony.', status: 'field_visit', files: [], userId: 'U003', userName: 'John', userPhone: '9876543212', date: '2026-01-03', resolvedDate: null, updatedAt: '2026-01-04', viewed: true },
    { id: 'KCT-005', title: 'Garbage not collected', department: 'LSGD', category: 'Waste', ward: 'Ward 4', description: 'No garbage collection for 2 weeks. Waste piling up on the roadside.', status: 'pending', files: [], userId: 'U004', userName: 'Mariya', userPhone: '9876543213', date: '2026-01-05', resolvedDate: null, updatedAt: '2026-01-05', viewed: false },
    { id: 'KCT-006', title: 'Ration card not updated', department: 'Revenue', category: 'Ration', ward: 'Ward 3', description: 'Ration card not updated after change in family members. Applied 2 months ago.', status: 'resolved', files: [], userId: 'U005', userName: 'Suresh', userPhone: '9876543214', date: '2025-12-20', resolvedDate: '2025-12-28', updatedAt: '2025-12-28', viewed: true },
    { id: 'KCT-007', title: 'School boundary wall damaged', department: 'Education', category: 'Education', ward: 'Ward 1', description: 'School boundary wall collapsed after heavy rain. Safety issue for students.', status: 'in_progress', files: [], userId: 'U006', userName: 'Lakshmi', userPhone: '9876543215', date: '2026-01-01', resolvedDate: null, updatedAt: '2026-01-03', viewed: true },
    { id: 'KCT-008', title: 'Mosquito menace', department: 'Health Department', category: 'Health', ward: 'Ward 6', description: 'Increase in mosquito population in the area. Need fumigation.', status: 'pending', files: [], userId: 'U007', userName: 'Ashraf', userPhone: '9876543216', date: '2026-01-06', resolvedDate: null, updatedAt: '2026-01-06', viewed: false },
    { id: 'KCT-009', title: 'Land dispute', department: 'Revenue', category: 'Land', ward: 'Ward 4', description: 'Neighbour encroaching on property. Need revenue officials to visit.', status: 'pending', files: [], userId: 'U008', userName: 'Rajesh', userPhone: '9876543217', date: '2026-01-07', resolvedDate: null, updatedAt: '2026-01-07', viewed: false },
    { id: 'KCT-010', title: 'Bus stop damaged', department: 'Transport', category: 'Road', ward: 'Ward 2', description: 'Bus shelter near the junction is broken. Senior citizens having difficulty.', status: 'declined', files: [], userId: 'U009', userName: 'Geetha', userPhone: '9876543218', date: '2025-12-15', resolvedDate: null, updatedAt: '2025-12-17', viewed: true },
  ]
  localStorage.setItem(k, JSON.stringify(seeds))
}

function save(d) {
  localStorage.setItem('kct_complaints', JSON.stringify(d))
}

export function getComplaints() {
  seed()
  const s = localStorage.getItem('kct_complaints')
  return s ? JSON.parse(s) : []
}

export function addComplaint(data, user) {
  const list = getComplaints()
  const pad = String(list.length + 101).slice(-3)
  const item = {
    id: 'KCT-' + pad,
    title: data.title || '',
    department: data.department || '',
    category: data.category || '',
    ward: data.ward || '',
    description: data.description || '',
    status: 'pending',
    files: data.files || [],
    userId: user?.id || 'anonymous',
    userName: user?.name || 'Anonymous',
    userPhone: user?.phone || '',
    date: new Date().toISOString().split('T')[0],
    resolvedDate: null,
    updatedAt: null,
    viewed: false,
  }
  list.push(item)
  save(list)
  return [item, list.length]
}

export function updateComplaintStatus(id, status) {
  const list = getComplaints()
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      list[i].status = status
      if (status === 'resolved') list[i].resolvedDate = new Date().toISOString().split('T')[0]
      list[i].updatedAt = new Date().toISOString().split('T')[0]
      break
    }
  }
  save(list)
  return list
}

export function markComplaintsViewed(ids) {
  const list = getComplaints()
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < ids.length; j++) {
      if (list[i].id === ids[j]) { list[i].viewed = true; break }
    }
  }
  save(list)
  return list
}
