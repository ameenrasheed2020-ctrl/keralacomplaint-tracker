const ideasKey = 'kct_public_ideas'

const seedIdeas = [
  {
    id: 'IDEA-001',
    title: 'Install more street lights in Ward 3',
    category: 'Infrastructure',
    description: 'Many roads in Ward 3 are completely dark at night. Installing LED street lights will improve safety for women and elderly residents.',
    userId: 'guest@example.com',
    userName: 'Anonymous',
    status: 'pending',
    date: '01 Jul 2026',
    viewed: true,
  },
  {
    id: 'IDEA-002',
    title: 'Weekly farmers market at Edappally',
    category: 'Agriculture',
    description: 'Setting up a weekly farmers market will help local farmers sell directly to residents and reduce middlemen.',
    userId: 'guest@example.com',
    userName: 'Anonymous',
    status: 'reviewed',
    date: '28 Jun 2026',
    viewed: true,
  },
]

export const getIdeas = () => {
  return JSON.parse(localStorage.getItem(ideasKey) || JSON.stringify(seedIdeas))
}

export const saveIdeas = (ideas) => {
  localStorage.setItem(ideasKey, JSON.stringify(ideas))
}

export const addIdea = ({ title, category, description }, user) => {
  const ideas = getIdeas()
  const newIdea = {
    id: `IDEA-${String(ideas.length + 1).padStart(3, '0')}`,
    title,
    category,
    description,
    userId: user?.email || 'anonymous',
    userName: user?.name || user?.phone || 'Anonymous',
    status: 'pending',
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    viewed: false,
  }
  const next = [newIdea, ...ideas]
  saveIdeas(next)
  return next
}

export const updateIdeaStatus = (id, status) => {
  const ideas = getIdeas().map((idea) =>
    idea.id === id ? { ...idea, status } : idea
  )
  saveIdeas(ideas)
  return ideas
}

export const markIdeasViewed = (ids) => {
  const ideas = getIdeas().map((idea) =>
    ids.includes(idea.id) && !idea.viewed ? { ...idea, viewed: true } : idea
  )
  saveIdeas(ideas)
  return ideas
}
