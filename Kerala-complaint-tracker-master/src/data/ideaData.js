const KEY = 'kct_ideas'

function save(d) {
  localStorage.setItem(KEY, JSON.stringify(d))
}

export function getIdeas() {
  const s = localStorage.getItem(KEY)
  return s ? JSON.parse(s) : []
}

export function addIdea(data, user) {
  const list = getIdeas()
  const pad = String(list.length + 101).slice(-3)
  const item = {
    id: 'IDEA-' + pad,
    title: data.title || '',
    description: data.description || '',
    files: data.files || [],
    userId: user?.id || 'anonymous',
    userName: user?.name || 'Anonymous',
    userPhone: user?.phone || '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    votes: 0,
  }
  list.push(item)
  save(list)
  return [item, list.length]
}

export function updateIdeaStatus(id, status) {
  const list = getIdeas()
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) { list[i].status = status; break }
  }
  save(list)
  return list
}

export function markIdeasViewed(ids) {
  const list = getIdeas()
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < ids.length; j++) {
      if (list[i].id === ids[j]) { list[i].viewed = true; break }
    }
  }
  save(list)
  return list
}
