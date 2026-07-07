import { useState, useLayoutEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LuClipboardList, LuTrendingUp, LuChartBarIncreasing } from 'react-icons/lu'
import Navbar from '../components/Navbar'
import AnimatedCounter from '../components/AnimatedCounter'
import PollCard from './PollCard'
import heroPhoto from '../assets/mla-crowd-wave.jpg'
import speechPhoto from '../assets/mla-podium-speech.jpg'
import posterPhoto from '../assets/vengara-development-poster.jpg'
import {
  getPublicPolls,
  getPublicPosts,
} from '../data/communityData'

const moments = [
  {
    image: heroPhoto,
    caption: 'MLA K. M. Shaji greeting residents at a public event in the constituency',
  },
  {
    image: speechPhoto,
    caption: "Speaking at the ICAR-CTCRI 'Punarjeevana Madhuram' product launch, Thiruvananthapuram",
  },
  {
    image: posterPhoto,
    caption: 'New development works announced for Vengara constituency',
  },
]

const services = [
  {
    icon: LuClipboardList,
    title: 'File a Complaint',
    body: 'Submit a grievance to the right department — roads, water, lighting, and more.',
    to: '/complaints/new',
  },
  {
    icon: LuTrendingUp,
    title: 'Track Progress',
    body: 'Follow your complaint from submission through to resolution, updated at every step.',
    to: '/complaints/new',
  },
  {
    icon: LuChartBarIncreasing,
    title: 'Public Polls',
    body: 'Voice your opinion on local issues and help shape constituency priorities.',
    to: '#updates',
  },
]

const steps = [
  {
    n: '01',
    title: 'You file it',
    body: 'Pick the ward, the department it belongs to, and describe the issue in plain words.',
  },
  {
    n: '02',
    title: 'Staff take it up',
    body: 'The MLA office queue picks up the complaint, assigns priority, and starts work.',
  },
  {
    n: '03',
    title: 'You see the outcome',
    body: 'Status moves from received to in progress to resolved — visible the whole way.',
  },
]

const Home = () => {
  const [posts] = useState(() =>
    getPublicPosts().filter((p) => p.status === 'published')
  )
  const [polls, setPolls] = useState(() =>
    getPublicPolls().filter((p) => p.status === 'published')
  )
  const [showAllPrograms, setShowAllPrograms] = useState(false)
  const [showAllNotifications, setShowAllNotifications] = useState(false)
  const [showAllPolls, setShowAllPolls] = useState(false)
  const [activeTab, setActiveTab] = useState('programs')

  const programs = posts.filter((p) => p.type !== 'Notification')
  const notifications = posts.filter((p) => p.type === 'Notification')

  const visiblePrograms = showAllPrograms ? programs : programs.slice(0, 6)
  const visibleNotifications = showAllNotifications ? notifications : notifications.slice(0, 6)
  const visiblePolls = showAllPolls ? polls : polls.slice(0, 6)

  const location = useLocation()

  useLayoutEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab)
      document.getElementById('updates')?.scrollIntoView({ behavior: 'auto' })
    }
  }, [location.state])

  return (
    <>
      <Navbar />
      <main className="landing-page">

        {/* ───── HERO ───── */}
        <section
          className="lp-hero"
          style={{ backgroundImage: `url(${heroPhoto})` }}
        >
          <div className="lp-hero-overlay" />
          <div className="lp-hero-body">
            <p className="lp-hero-ornament">വേങ്ങര നിയോജകമണ്ഡലം</p>
            <h1 className="lp-hero-title">
              <span className="lp-hero-mla">K. M. Shaji, MLA</span>
              <span className="lp-hero-tagline">Your Voice in Vengara</span>
            </h1>
            <p className="lp-hero-desc">
              A direct channel between the residents of Vengara constituency
              and the MLA office — file grievances, track resolutions, and
              stay informed about programs, notices, and local initiatives.
            </p>
            <div className="lp-hero-actions">
              <Link className="lp-btn lp-btn-primary" to="/complaints/new">
                File a Complaint
              </Link>
              <a className="lp-btn lp-btn-outline" href="#updates">
                Latest Updates
              </a>
            </div>
            {polls[0] && (
              <div className="lp-hero-banner">
                <span className="lp-hero-banner-dot" />
                <span className="lp-hero-banner-label">Active Poll</span>
                <span className="lp-hero-banner-text">{polls[0].question}</span>
                <a className="lp-hero-banner-link" href="#updates">Vote &rarr;</a>
              </div>
            )}
          </div>

          <div className="lp-hero-credit">
            <span>Vengara Constituency</span>
            <span>Office of K. M. Shaji, MLA</span>
          </div>
        </section>

        {/* ───── MESSAGE FROM MLA ───── */}
        <section className="lp-section lp-section-light">
          <div className="lp-message">
            <div className="lp-message-image">
              <img src={speechPhoto} alt="MLA K. M. Shaji speaking at a public event" loading="lazy" />
            </div>
            <div className="lp-message-text">
              <p className="lp-eyebrow">A word from your MLA</p>
              <h2>Working together for Vengara</h2>
              <p>
                My office is committed to addressing every concern raised by the
                people of Vengara. This platform is part of our effort to make
                constituency services more accessible, transparent, and
                responsive. Every complaint filed here reaches my team directly.
              </p>
              <p>
                Whether it is road repairs, drainage, street lights, or water
                supply — your issues become our priority. Together, we can build
                a better Vengara.
              </p>
              <div className="lp-message-signoff">
                <strong>K. M. Shaji</strong>
                <span>Member of Legislative Assembly, Vengara</span>
              </div>
            </div>
          </div>
        </section>

        {/* ───── PHOTO GALLERY ───── */}
        <section className="lp-section">
          <div className="lp-section-heading">
            <p className="lp-eyebrow">In the constituency</p>
            <h2>Recent moments from the MLA office</h2>
            <p className="lp-section-sub">
              Launches, inaugurations, and public events across Vengara
            </p>
          </div>
          <div className="lp-gallery">
            {moments.map((moment) => (
              <figure className="lp-gallery-card" key={moment.caption}>
                <div className="lp-gallery-image">
                  <img src={moment.image} alt={moment.caption} loading="lazy" />
                </div>
                <figcaption>{moment.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ───── SERVICES ───── */}
        <section className="lp-section lp-section-green">
          <div className="lp-section-heading lp-section-heading-light">
            <p className="lp-eyebrow">Constituency services</p>
            <h2>How we help</h2>
            <p className="lp-section-sub">
              Simple tools to connect you with the MLA office
            </p>
          </div>
          <div className="lp-services">
            {services.map((svc) => (
              <Link className="lp-service-card" to={svc.to} key={svc.title}>
                <span className="lp-service-icon"><svc.icon size={36} /></span>
                <h3>{svc.title}</h3>
                <p>{svc.body}</p>
                <span className="lp-service-cta">Learn more &rarr;</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ───── STATISTICS ───── */}
        <section className="lp-section lp-section-green">
          <div className="lp-stats">
            <div className="lp-stat">
              <span className="lp-stat-number"><AnimatedCounter end={programs.length} /></span>
              <span className="lp-stat-label">Programs</span>
            </div>
            <div className="lp-stat">
              <span className="lp-stat-number"><AnimatedCounter end={polls.length} /></span>
              <span className="lp-stat-label">Active polls</span>
            </div>
            <div className="lp-stat">
              <span className="lp-stat-number"><AnimatedCounter end={142} /></span>
              <span className="lp-stat-label">Complaints resolved</span>
            </div>
            <div className="lp-stat">
              <span className="lp-stat-number"><AnimatedCounter end={95} suffix="%" /></span>
              <span className="lp-stat-label">Success rate</span>
            </div>
          </div>
        </section>

        {/* ───── UPDATES (broadcasts + polls) ───── */}
        <section className="lp-section lp-section-light" id="updates">
          <div className="lp-section-heading">
            <p className="lp-eyebrow">Public broadcast</p>
            <h2>Programs, notices &amp; polls</h2>
            <p className="lp-section-sub">
              Stay current on what is happening in your constituency
            </p>
          </div>

          <div className="lp-tab-bar">
            <button
              className={`lp-tab${activeTab === 'programs' ? ' active' : ''}`}
              onClick={() => setActiveTab('programs')}
            >
              Programs <span className="lp-tab-badge">{programs.length}</span>
            </button>
            <button
              className={`lp-tab${activeTab === 'notifications' ? ' active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications <span className="lp-tab-badge">{notifications.length}</span>
            </button>
            <button
              className={`lp-tab${activeTab === 'polls' ? ' active' : ''}`}
              onClick={() => setActiveTab('polls')}
            >
              Polls <span className="lp-tab-badge">{polls.length}</span>
            </button>
          </div>

          <div className="lp-feed">
            {activeTab === 'programs' && visiblePrograms.map((post) => (
              <Link className="lp-post" key={post.id} to={`/detail/${post.id}`}>
                <div className="lp-post-header">
                  <span className="lp-post-type">{post.type}</span>
                  <span className="lp-post-date">{post.date}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <span className="lp-post-audience">For: {post.audience}</span>
              </Link>
            ))}
            {activeTab === 'programs' && !showAllPrograms && programs.length > 6 && (
              <button className="lp-show-more" onClick={() => setShowAllPrograms(true)}>
                Show more programs &rarr;
              </button>
            )}
            {activeTab === 'programs' && showAllPrograms && programs.length > 6 && (
              <button className="lp-show-more" onClick={() => setShowAllPrograms(false)}>
                Show less &uarr;
              </button>
            )}

            {activeTab === 'notifications' && visibleNotifications.map((post) => (
              <Link className="lp-post" key={post.id} to={`/detail/${post.id}`}>
                <div className="lp-post-header">
                  <span className="lp-post-type">{post.type}</span>
                  <span className="lp-post-date">{post.date}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <span className="lp-post-audience">For: {post.audience}</span>
              </Link>
            ))}
            {activeTab === 'notifications' && !showAllNotifications && notifications.length > 6 && (
              <button className="lp-show-more" onClick={() => setShowAllNotifications(true)}>
                Show more notifications &rarr;
              </button>
            )}
            {activeTab === 'notifications' && showAllNotifications && notifications.length > 6 && (
              <button className="lp-show-more" onClick={() => setShowAllNotifications(false)}>
                Show less &uarr;
              </button>
            )}

            {activeTab === 'polls' && visiblePolls.map((poll) => (
              <PollCard poll={poll} key={poll.id} onVoted={setPolls} />
            ))}
            {activeTab === 'polls' && !showAllPolls && polls.length > 6 && (
              <button className="lp-show-more" onClick={() => setShowAllPolls(true)}>
                Show more polls &rarr;
              </button>
            )}
            {activeTab === 'polls' && showAllPolls && polls.length > 6 && (
              <button className="lp-show-more" onClick={() => setShowAllPolls(false)}>
                Show less &uarr;
              </button>
            )}
          </div>
        </section>

        {/* ───── HOW IT WORKS ───── */}
        <section className="lp-section">
          <div className="lp-section-heading">
            <p className="lp-eyebrow">How a complaint moves</p>
            <h2>From your word to a closed case</h2>
          </div>
          <div className="lp-steps">
            {steps.map((step) => (
              <article className="lp-step" key={step.n}>
                <span className="lp-step-num">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ───── CTA ───── */}
        <section className="lp-section lp-section-gold">
          <div className="lp-cta">
            <h2>Have a concern to raise?</h2>
            <p>
              File a complaint directly with the MLA office and track it
              until it is resolved.
            </p>
            <Link className="lp-btn lp-btn-dark" to="/complaints/new">
              File a Complaint
            </Link>
          </div>
        </section>

        {/* ───── FOOTER ───── */}
        <footer className="lp-footer">
          <div className="lp-footer-inner">
            <div className="lp-footer-brand">
              <span className="lp-footer-seal">
                <svg viewBox="0 0 40 40" aria-hidden="true">
                  <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="20" cy="20" r="15.5" fill="none" stroke="currentColor" strokeWidth="0.75" />
                </svg>
                <span>KC</span>
              </span>
              <div>
                <strong>Kerala Complaint Tracker</strong>
                <span>A public grievance channel for Vengara constituency</span>
              </div>
            </div>
            <div className="lp-footer-info">
              <span>Office of K. M. Shaji, MLA</span>
              <span>Vengara Constituency, Kerala</span>
            </div>
          </div>
        </footer>

      </main>
    </>
  )
}

export default Home
