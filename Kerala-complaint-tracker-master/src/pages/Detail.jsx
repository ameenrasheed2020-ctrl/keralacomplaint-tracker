import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import PollCard from './PollCard'
import { translatePost, translatePoll } from '../i18n/translateContent'
import {
  getPublicPosts,
  getPublicPolls,
} from '../data/communityData'

const Detail = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const [posts] = useState(() =>
    getPublicPosts().filter((p) => p.status === 'published')
  )
  const [polls, setPolls] = useState(() =>
    getPublicPolls().filter((p) => p.status === 'published')
  )

  const post = posts.find((p) => p.id === id)
  const poll = polls.find((p) => p.id === id)
  const tp = post ? translatePost(post, t) : null
  const tPoll = poll ? translatePoll(poll, t) : null

  const tab = post
    ? post.type === 'Notification' ? 'notifications' : 'programs'
    : 'polls'

  if (!post && !poll) {
    return (
      <>
        <Navbar />
        <main className="page-shell">
          <section className="page-heading">
            <h1>{t('detail.notFound')}</h1>
            <Link to="/" state={{ tab: 'programs' }}>{t('detail.backToHome')}</Link>
          </section>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="page-heading">
          <Link className="detail-back" to="/" state={{ tab }}>{t('detail.back')}</Link>
          <h1>{tp?.title || tPoll?.question || post?.title || poll?.question}</h1>
        </section>

        <section className="table-panel">
          {post && (
            <article className="detail-card">
              <div className="detail-meta">
                <span className="status resolved">{tp.type}</span>
                <span className="detail-date">{post.date}</span>
              </div>
              <div className="detail-body" dangerouslySetInnerHTML={{ __html: tp.body }} />
              <p className="detail-audience">{t('detail.for')} {tp.audience}</p>
            </article>
          )}

          {poll && (
            <PollCard poll={poll} onVoted={setPolls} />
          )}
        </section>
      </main>
    </>
  )
}

export default Detail
