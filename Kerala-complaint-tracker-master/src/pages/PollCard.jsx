import { Link } from 'react-router-dom'
import {
  castVote,
  getMyVote,
  hasUserVoted,
} from '../data/communityData'

const getUser = () => JSON.parse(localStorage.getItem('kct_user') || 'null')

const PollCard = ({ poll, onVoted }) => {
  const user = getUser()
  const voterId = user?.email
  const alreadyVoted = hasUserVoted(poll.id, voterId)
  const myVote = alreadyVoted ? getMyVote(poll.id) : null
  const totalVotes = Object.values(poll.votes || {}).reduce((sum, count) => sum + count, 0)

  const handleVote = (option) => {
    if (!user || alreadyVoted) return
    const nextPolls = castVote(poll.id, option, voterId)
    onVoted(nextPolls)
  }

  return (
    <article className="wa-poll">
      <div className="wa-poll-header">
        <h3><Link to={`/detail/${poll.id}`}>{poll.question}</Link></h3>
        <span className="wa-poll-audience">{poll.audience}</span>
      </div>
      <span className="wa-poll-expiry">Vote before: 14/06/26</span>

      <div className="wa-poll-options">
        {poll.options.map((option) => {
          const count = poll.votes?.[option] || 0
          const share = totalVotes ? Math.round((count / totalVotes) * 100) : 0
          const isSelected = myVote === option

          return (
            <button
              type="button"
              className={`wa-poll-option${isSelected ? ' selected' : ''}${alreadyVoted ? ' show-result' : ''}`}
              key={option}
              onClick={() => handleVote(option)}
              disabled={alreadyVoted}
            >
              <span className="wa-poll-option-text">{option}</span>
              {alreadyVoted && <span className="wa-poll-option-pct">{share}%</span>}
              {alreadyVoted && (
                <span className="wa-poll-option-bar">
                  <span style={{ width: `${share}%` }} />
                </span>
              )}
              {isSelected && <span className="wa-poll-check">&#10003;</span>}
            </button>
          )
        })}
      </div>

      <div className="wa-poll-footer">
        {!user && (
          <span><Link to="/login">Login</Link> to vote — results are anonymous.</span>
        )}
        {user && !alreadyVoted && (
          <span>Tap an option above to cast your vote</span>
        )}
        {user && alreadyVoted && (
          <span>· Thanks for voting</span>
        )}
      </div>
    </article>
  )
}

export default PollCard
