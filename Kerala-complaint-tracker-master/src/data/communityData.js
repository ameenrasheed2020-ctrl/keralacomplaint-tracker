export const seedPosts = [
  {
    id: 'POST-001',
    title: 'Free medical camp at Edappally',
    type: 'Program',
    audience: 'Ward 12 and nearby residents',
    date: '06 Jul 2026',
    body: 'MLA office is organizing a free medical camp with general checkup and basic medicines.',
    status: 'published',
  },
  {
    id: 'POST-002',
    title: 'Youth skill training registration',
    type: 'Organization',
    audience: 'All public users',
    date: '08 Jul 2026',
    body: 'Public users can register for the new skill training program coordinated through the MLA office.',
    status: 'published',
  },
  {
    id: 'POST-003',
    title: 'New library opening at Kunnamangalam',
    type: 'Program',
    audience: 'All public users',
    date: '12 Jul 2026',
    body: 'A new digital library with free internet access will open next week at the community hall.',
    status: 'published',
  },
  {
    id: 'POST-004',
    title: 'Ward 8 drinking water project completed',
    type: 'Public notice',
    audience: 'Ward 8 residents',
    date: '04 Jul 2026',
    body: 'The new borewell and pipeline installation in Ward 8 is now complete. Water supply will resume from tomorrow.',
    status: 'draft',
  },
  {
    id: 'POST-005',
    title: 'Free eye check-up camp for senior citizens',
    type: 'Program',
    audience: 'Senior citizens above 60',
    date: '15 Jul 2026',
    body: 'In partnership with District Hospital, a free eye check-up and cataract screening camp for senior citizens.',
    status: 'published',
  },
  {
    id: 'POST-006',
    title: 'Road widening work on Kozhikode-Mysore highway',
    type: 'Public notice',
    audience: 'Commuters on NH 766',
    date: '10 Jul 2026',
    body: 'Widening work will begin from July 15. Expect diversions between 9 AM and 5 PM. Plan your travel accordingly.',
    status: 'draft',
  },
  {
    id: 'POST-007',
    title: 'Plastic-free ward initiative launched',
    type: 'Organization',
    audience: 'All public users',
    date: '02 Jul 2026',
    body: 'Our office has launched a plastic-free awareness campaign. Collection bins installed at 10 locations. Join the movement.',
    status: 'published',
  },
  {
    id: 'POST-008',
    title: 'Monthly pension distribution schedule',
    type: 'Public notice',
    audience: 'Pension beneficiaries',
    date: '01 Jul 2026',
    body: 'July pension distribution will happen on July 12 at the Panchayat office. Bring your ID card and passbook.',
    status: 'published',
  },
  {
    id: 'POST-009',
    title: 'Emergency flood relief helpline numbers',
    type: 'Notification',
    audience: 'All public users',
    date: '09 Jul 2026',
    body: 'Due to heavy rainfall, a 24/7 flood relief control room is operational. Call 1800-123-4567 for rescue and supplies.',
    status: 'published',
  },
  {
    id: 'POST-010',
    title: 'New bus route from Kunnamangalam to Medical College',
    type: 'Program',
    audience: 'Daily commuters',
    date: '11 Jul 2026',
    body: 'KSRTC has introduced a new bus route (Route 42A) from Kunnamangalam junction to Medical College via the bypass.',
    status: 'published',
  },
]

export const seedPolls = [
  {
    id: 'POLL-001',
    question: 'Which public issue should MLA staff prioritize this week?',
    audience: 'All public users',
    options: ['Road repair', 'Drainage cleaning', 'Street lights', 'Water supply'],
    votes: {
      'Road repair': 42,
      'Drainage cleaning': 27,
      'Street lights': 15,
      'Water supply': 33,
    },
    status: 'published',
  },
  {
    id: 'POLL-002',
    question: 'What type of community program do you want next?',
    audience: 'All public users',
    options: ['Health camp', 'Skill training', 'Cultural event', 'Sports tournament'],
    votes: {
      'Health camp': 38,
      'Skill training': 51,
      'Cultural event': 22,
      'Sports tournament': 19,
    },
    status: 'draft',
  },
  {
    id: 'POLL-003',
    question: 'Which ward needs road repairs most urgently?',
    audience: 'All public users',
    options: ['Ward 3', 'Ward 7', 'Ward 11', 'Ward 15'],
    votes: {
      'Ward 3': 63,
      'Ward 7': 45,
      'Ward 11': 29,
      'Ward 15': 37,
    },
    status: 'published',
  },
  {
    id: 'POLL-004',
    question: 'Should Sunday markets be allowed in the constituency?',
    audience: 'All public users',
    options: ['Yes, with regulations', 'No', 'Only for farmers', 'Need more discussion'],
    votes: {
      'Yes, with regulations': 88,
      'No': 34,
      'Only for farmers': 41,
      'Need more discussion': 27,
    },
    status: 'published',
  },
  {
    id: 'POLL-005',
    question: 'What time works best for evening town hall meetings?',
    audience: 'All public users',
    options: ['5 PM – 6 PM', '6 PM – 7 PM', '7 PM – 8 PM'],
    votes: {
      '5 PM – 6 PM': 24,
      '6 PM – 7 PM': 55,
      '7 PM – 8 PM': 47,
    },
    status: 'draft',
  },
  {
    id: 'POLL-006',
    question: 'Which public facility should be upgraded first?',
    audience: 'All public users',
    options: ['Public toilets', 'Park and playground', 'Bus stop shelters', 'Street lighting'],
    votes: {
      'Public toilets': 31,
      'Park and playground': 28,
      'Bus stop shelters': 19,
      'Street lighting': 16,
    },
    status: 'published',
  },
]

const postsKey = 'kct_public_posts'
const pollsKey = 'kct_public_polls'

// Voter registry only ever stores *who* has voted on a poll, never *what*
// they voted for — that link is never written anywhere, so it can't be
// looked up later, including by staff or admin accounts.
const votersKey = 'kct_poll_voters'

// A private, browser-local convenience so a person can see their own past
// choice on their own device. This is never sent anywhere, never merged
// with the voter registry above, and never readable for anyone else.
const myVotesKey = 'kct_my_votes'

export const getPublicPosts = () => {
  return JSON.parse(localStorage.getItem(postsKey) || JSON.stringify(seedPosts)).map(
    (p) => ({ status: 'published', ...p })
  )
}

export const savePublicPosts = (posts) => {
  localStorage.setItem(postsKey, JSON.stringify(posts))
}

export const getPublicPolls = () => {
  return JSON.parse(localStorage.getItem(pollsKey) || JSON.stringify(seedPolls)).map(
    (p) => ({ status: 'published', ...p })
  )
}

export const savePublicPolls = (polls) => {
  localStorage.setItem(pollsKey, JSON.stringify(polls))
}

const getPollVoters = () => JSON.parse(localStorage.getItem(votersKey) || '{}')

const savePollVoters = (voters) => {
  localStorage.setItem(votersKey, JSON.stringify(voters))
}

export const hasUserVoted = (pollId, voterId) => {
  if (!voterId) return false
  const voters = getPollVoters()
  return Boolean(voters[pollId]?.includes(voterId))
}

export const getMyVote = (pollId) => {
  const myVotes = JSON.parse(localStorage.getItem(myVotesKey) || '{}')
  return myVotes[pollId]
}

const rememberMyVoteLocally = (pollId, option) => {
  const myVotes = JSON.parse(localStorage.getItem(myVotesKey) || '{}')
  myVotes[pollId] = option
  localStorage.setItem(myVotesKey, JSON.stringify(myVotes))
}

/**
 * Casts one anonymous vote. Only a tally count is incremented and the
 * voter id is recorded separately to block a second vote — the two are
 * never stored together, so no record anywhere connects a person to the
 * option they picked.
 */
export const castVote = (pollId, option, voterId) => {
  if (hasUserVoted(pollId, voterId)) {
    return getPublicPolls()
  }

  const polls = getPublicPolls().map((poll) => {
    if (poll.id !== pollId) return poll
    const votes = { ...poll.votes, [option]: (poll.votes?.[option] || 0) + 1 }
    return { ...poll, votes }
  })

  savePublicPolls(polls)

  const voters = getPollVoters()
  voters[pollId] = [...(voters[pollId] || []), voterId]
  savePollVoters(voters)

  rememberMyVoteLocally(pollId, option)

  return polls
}
