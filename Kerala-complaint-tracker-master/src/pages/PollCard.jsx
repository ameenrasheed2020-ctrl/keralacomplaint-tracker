import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  castVote,
  getMyVote,
  hasUserVoted,
} from '../data/communityData'
import { translatePoll } from '../i18n/translateContent'

const getUser = () => JSON.parse(localStorage.getItem('kct_user') || 'null')

const PollCard = ({ poll, onVoted }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const user = getUser()
  const voterId = user?.email
  const alreadyVoted = hasUserVoted(poll.id, voterId)
  const myVote = alreadyVoted ? getMyVote(poll.id) : null
  const totalVotes = Object.values(poll.votes || {}).reduce((sum, count) => sum + count, 0)
  const tPoll = translatePoll(poll, t)

  const handleVote = (e, option) => {
    e.stopPropagation()
    if (!user) {
      sessionStorage.setItem('login_redirect_tab', 'polls')
      navigate('/login', { state: { from: '/', message: t('auth.loginToVoteMessage') } })
      return
    }
    if (alreadyVoted) return
    const nextPolls = castVote(poll.id, option, voterId)
    onVoted(nextPolls)
  }

  return (
    <article className="wa-poll" onClick={() => navigate(`/detail/${poll.id}`)} style={{ cursor: 'pointer' }}>
      <div className="wa-poll-header">
        <h3>{tPoll.question}</h3>
        <span className="wa-poll-audience">{tPoll.audience}</span>
      </div>
      <span className="wa-poll-expiry">{t('pollCard.voteBefore', { date: '14/06/26' })}</span>

      <div className="wa-poll-options">
        {poll.options.map((option, idx) => {
          const count = poll.votes?.[option] || 0
          const share = totalVotes ? Math.round((count / totalVotes) * 100) : 0
          const isSelected = myVote === option
          const displayOption = tPoll.options[idx]

          return (
            <button
              type="button"
              className={`wa-poll-option${isSelected ? ' selected' : ''}${alreadyVoted ? ' show-result' : ''}`}
              key={option}
              onClick={(e) => handleVote(e, option)}
              disabled={alreadyVoted}
            >
              <span className="wa-poll-option-text">{displayOption}</span>
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
          <span onClick={(e) => e.stopPropagation()}><Link to="/login">{t('pollCard.login')}</Link> {t('pollCard.loginPrompt')}</span>
        )}
        {user && !alreadyVoted && (
          <span onClick={(e) => e.stopPropagation()}>{t('pollCard.tapToVote')}</span>
        )}
        {user && alreadyVoted && (
          <span onClick={(e) => e.stopPropagation()}>{t('pollCard.thanksForVoting')}</span>
        )}
      </div>
    </article>
  )
}

export default PollCard
