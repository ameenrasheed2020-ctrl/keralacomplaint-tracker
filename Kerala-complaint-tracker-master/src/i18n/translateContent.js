const postTypeMap = {
  Program: 'seedData.posts.typeProgram',
  Organization: 'seedData.posts.typeOrganization',
  'Public notice': 'seedData.posts.typePublicNotice',
  Notification: 'seedData.posts.typeNotification',
}

const audienceMap = {
  'Ward 12 and nearby residents': 'seedData.posts.audience1',
  'All public users': 'seedData.posts.audience2',
  'Ward 8 residents': 'seedData.posts.audience3',
  'Senior citizens above 60': 'seedData.posts.audience4',
  'Commuters on NH 766': 'seedData.posts.audience5',
  'Pension beneficiaries': 'seedData.posts.audience6',
  'Daily commuters': 'seedData.posts.audience7',
}

const optionMap = {
  'Road repair': 'seedData.polls.optRoadRepair',
  'Drainage cleaning': 'seedData.polls.optDrainage',
  'Street lights': 'seedData.polls.optStreetLights',
  'Water supply': 'seedData.polls.optWaterSupply',
  'Health camp': 'seedData.polls.optHealthCamp',
  'Skill training': 'seedData.polls.optSkillTraining',
  'Cultural event': 'seedData.polls.optCulturalEvent',
  'Sports tournament': 'seedData.polls.optSportsTournament',
  'Ward 3': 'seedData.polls.optWard3',
  'Ward 7': 'seedData.polls.optWard7',
  'Ward 11': 'seedData.polls.optWard11',
  'Ward 15': 'seedData.polls.optWard15',
  'Yes, with regulations': 'seedData.polls.optYesRegulations',
  'No': 'seedData.polls.optNo',
  'Only for farmers': 'seedData.polls.optOnlyFarmers',
  'Need more discussion': 'seedData.polls.optNeedDiscussion',
  '5 PM – 6 PM': 'seedData.polls.opt5to6',
  '6 PM – 7 PM': 'seedData.polls.opt6to7',
  '7 PM – 8 PM': 'seedData.polls.opt7to8',
  'Public toilets': 'seedData.polls.optPublicToilets',
  'Park and playground': 'seedData.polls.optParkPlayground',
  'Bus stop shelters': 'seedData.polls.optBusStopShelters',
  'Street lighting': 'seedData.polls.optStreetLighting',
}

const idToNum = (id) => {
  const m = id?.match(/\d+/)
  return m ? m[0] : null
}

export const translatePost = (post, t) => {
  const num = idToNum(post.id)
  const n = num ? parseInt(num, 10) : 0
  if (!n || n > 10) return post
  return {
    ...post,
    type: t(postTypeMap[post.type] || post.type),
    title: t(`seedData.posts.title${n}`),
    body: t(`seedData.posts.body${n}`),
    audience: t(audienceMap[post.audience] || post.audience),
  }
}

export const translatePoll = (poll, t) => {
  const num = idToNum(poll.id)
  const n = num ? parseInt(num, 10) : 0
  if (!n || n > 6) return poll
  return {
    ...poll,
    question: t(`seedData.polls.q${n}`),
    audience: t(audienceMap[poll.audience] || poll.audience),
    options: poll.options.map((opt) => t(optionMap[opt] || opt)),
  }
}
