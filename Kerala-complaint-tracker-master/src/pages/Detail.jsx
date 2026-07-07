import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PollCard from './PollCard'
import {
  getPublicPosts,
  getPublicPolls,
} from '../data/communityData'

const Detail = () => {
  const { id } = useParams()
  const [posts] = useState(() =>
    getPublicPosts().filter((p) => p.status === 'published')
  )
  const [polls, setPolls] = useState(() =>
    getPublicPolls().filter((p) => p.status === 'published')
  )

  const post = posts.find((p) => p.id === id)
  const poll = polls.find((p) => p.id === id)

  const tab = post
    ? post.type === 'Notification' ? 'notifications' : 'programs'
    : 'polls'

  if (!post && !poll) {
    return (
      <>
        <Navbar />
        <main className="page-shell">
          <section className="page-heading">
            <h1>Not found</h1>
            <Link to="/" state={{ tab: 'programs' }}>Back to home</Link>
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
          <Link className="detail-back" to="/" state={{ tab }}>&larr; Back</Link>
          <h1>{post?.title || poll?.question}</h1>
        </section>

        <section className="table-panel">
          {post && (
            <article className="detail-card">
              <div className="detail-meta">
                <span className="status resolved">{post.type}</span>
                <span className="detail-date">{post.date}</span>
              </div>
              <div className="detail-body" dangerouslySetInnerHTML={{ __html: post.body }} />
              <p className="detail-audience">For: {post.audience}</p>
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
