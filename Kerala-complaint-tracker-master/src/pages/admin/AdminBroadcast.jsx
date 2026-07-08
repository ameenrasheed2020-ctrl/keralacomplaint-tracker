import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import { FontFamily } from '@tiptap/extension-font-family'
import { TextStyle, FontSize } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../../components/Navbar'
import { translatePost, translatePoll } from '../../i18n/translateContent'
import {
  getPublicPolls,
  getPublicPosts,
  savePublicPolls,
  savePublicPosts,
} from '../../data/communityData'

const fonts = ['Inter', 'Georgia', 'monospace', 'Arial', 'serif']
const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36]
const colors = ['#182620', '#4d5c53', '#175c40', '#8f6a24', '#a5462b', '#b91c1c', '#1d4ed8', '#6b21a8']

const MenuBar = ({ editor }) => {
  const { t } = useTranslation()
  if (!editor) return null

  const setLink = () => {
    const url = window.prompt(t('admin.broadcast.enterUrl'))
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const handleFontSize = (e) => {
    const size = e.target.value
    if (!size) return
    editor.chain().focus().setFontSize(`${size}px`).run()
  }

  const handleFontFamily = (e) => {
    const val = e.target.value
    if (val) {
      editor.chain().focus().setFontFamily(val).run()
    } else {
      editor.chain().focus().unsetFontFamily().run()
    }
  }

  return (
    <div className="editor-toolbar">
      <div className="editor-toolbar-group">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''} title={t('admin.broadcast.bold')}>B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''} title={t('admin.broadcast.italic')}>I</button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'active' : ''} title={t('admin.broadcast.underline')}>U</button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'active' : ''} title={t('admin.broadcast.strikethrough')}>S</button>
      </div>

      <div className="editor-toolbar-group">
        <select className="editor-select" onChange={handleFontFamily} defaultValue="">
          <option value="" disabled>{t('admin.broadcast.font')}</option>
          {fonts.map((f) => (<option key={f} value={f}>{f}</option>))}
        </select>
        <select className="editor-select" onChange={handleFontSize} defaultValue="">
          <option value="" disabled>{t('admin.broadcast.size')}</option>
          {fontSizes.map((s) => (<option key={s} value={s}>{s}px</option>))}
        </select>
        <span className="editor-color-wrap">
          <input type="color" className="editor-color-input" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} value={editor.getAttributes('textStyle').color || '#182620'} />
          <span className="editor-color-label">{t('admin.broadcast.color')}</span>
        </span>
      </div>

      <div className="editor-toolbar-group">
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''} title={t('admin.broadcast.alignLeft')}>&#8801;</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'active' : ''} title={t('admin.broadcast.center')}>&#8801;</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'active' : ''} title={t('admin.broadcast.alignRight')}>&#8801;</button>
      </div>

      <div className="editor-toolbar-group">
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'active' : ''} title={t('admin.broadcast.heading1')}>H1</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'active' : ''} title={t('admin.broadcast.heading2')}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'active' : ''} title={t('admin.broadcast.heading3')}>H3</button>
      </div>

      <div className="editor-toolbar-group">
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'active' : ''} title={t('admin.broadcast.bulletList')}>&#8226;</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'active' : ''} title={t('admin.broadcast.numberedList')}>1.</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'active' : ''} title={t('admin.broadcast.quote')}>&#8220;</button>
      </div>

      <div className="editor-toolbar-group">
        <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'active' : ''} title={t('admin.broadcast.highlight')}>&#10003;</button>
        <button type="button" onClick={setLink} className={editor.isActive('link') ? 'active' : ''} title={t('admin.broadcast.insertLink')}>&#128279;</button>
      </div>
    </div>
  )
}

const AdminBroadcast = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const [posts, setPosts] = useState(getPublicPosts)
  const [polls, setPolls] = useState(getPublicPolls)
  const [showForms, setShowForms] = useState(false)
  const [activeView, setActiveView] = useState('posts')
  const [search, setSearch] = useState('')
  const [initialPollQuestion, setInitialPollQuestion] = useState(location.state?.pollQuestion || '')

  useEffect(() => {
    if (location.state?.pollQuestion) {
      setActiveView('polls')
      setShowForms(true)
      window.history.replaceState({}, '')
    }
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontSize,
      Color,
      FontFamily,
      Highlight,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: t('admin.broadcast.editorPlaceholder') }),
    ],
    content: '',
    editorProps: { attributes: { class: 'editor-content' } },
  })

  const handlePostSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const html = editor?.getHTML() || formData.get('body')
    const nextPosts = [{
      id: `POST-${String(posts.length + 1).padStart(3, '0')}`,
      title: formData.get('title'),
      type: formData.get('type'),
      audience: formData.get('audience'),
      date: formData.get('date'),
      body: html,
      status: 'draft',
    }, ...posts]
    setPosts(nextPosts)
    savePublicPosts(nextPosts)
    editor?.commands.setContent('')
    event.currentTarget.reset()
    setShowForms(false)
  }

  const handlePollSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const options = ['option1', 'option2', 'option3', 'option4'].map((name) => formData.get(name)).filter(Boolean)
    const nextPolls = [{
      id: `POLL-${String(polls.length + 1).padStart(3, '0')}`,
      question: formData.get('question'),
      audience: formData.get('pollAudience'),
      options,
      votes: Object.fromEntries(options.map((option) => [option, 0])),
      status: 'draft',
    }, ...polls]
    setPolls(nextPolls)
    savePublicPolls(nextPolls)
    event.currentTarget.reset()
    setShowForms(false)
  }

  const toggleStatus = (type, id) => {
    if (type === 'posts') {
      const next = posts.map((p) => p.id === id ? { ...p, status: p.status === 'published' ? 'draft' : 'published' } : p)
      setPosts(next)
      savePublicPosts(next)
    } else {
      const next = polls.map((p) => p.id === id ? { ...p, status: p.status === 'published' ? 'draft' : 'published' } : p)
      setPolls(next)
      savePublicPolls(next)
    }
  }

  const filteredPosts = posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
  const filteredPolls = polls.filter((p) => p.question.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="page-heading">
          <div>
            <p className="eyebrow">{t('admin.broadcast.heading')}</p>
            <h1>{t('admin.broadcast.subheading')}</h1>
          </div>
        </section>

        <section className="table-panel publish-preview">
          <div className="table-header">
            <div className="table-header-nav">
              <button className={`table-header-link${activeView === 'posts' ? ' active' : ''}`} onClick={() => setActiveView('posts')}>
                {t('admin.broadcast.posts')} <span className="table-header-badge">{posts.length}</span>
              </button>
              <button className={`table-header-link${activeView === 'polls' ? ' active' : ''}`} onClick={() => setActiveView('polls')}>
                {t('admin.broadcast.polls')} <span className="table-header-badge">{polls.length}</span>
              </button>
            </div>
          </div>

          <div className="public-feed public-feed--single">
            <div className="feed-bar">
              {!showForms && <input className="feed-search" type="text" placeholder={t('admin.broadcast.search')} value={search} onChange={(e) => setSearch(e.target.value)} />}
              {!showForms && <button className="publish-create-btn" onClick={() => setShowForms(true)}>{t('admin.broadcast.create')}</button>}
              {showForms && <button className="publish-create-btn cancel" onClick={() => setShowForms(false)}>{t('admin.broadcast.cancel')}</button>}
            </div>

            {!showForms && activeView === 'posts' && (
              <div className="public-feed-col">
                {filteredPosts.map((post) => {
                  const tp = translatePost(post, t)
                  return (
                  <article className="public-card" key={post.id}>
                    <select className={`status-select status-select--${post.status}`} value={post.status} onChange={() => toggleStatus('posts', post.id)}>
                      <option value="draft">{t('admin.broadcast.draft')}</option>
                      <option value="published">{t('admin.broadcast.published')}</option>
                    </select>
                    <span className="status resolved">{tp.type}</span>
                    <h3><RouterLink to={`/detail/${post.id}`}>{tp.title}</RouterLink></h3>
                    <div dangerouslySetInnerHTML={{ __html: tp.body }} />
                    <dl>
                      <div><dt>{t('admin.broadcast.audience')}</dt><dd>{tp.audience}</dd></div>
                      <div><dt>{t('admin.broadcast.date')}</dt><dd>{post.date}</dd></div>
                    </dl>
                  </article>
                  )
                })}
              </div>
            )}

            {!showForms && activeView === 'polls' && (
              <div className="public-feed-col">
                {filteredPolls.map((poll) => {
                  const tPol = translatePoll(poll, t)
                  return (
                  <article className="public-card poll-card" key={poll.id}>
                    <select className={`status-select status-select--${poll.status}`} value={poll.status} onChange={() => toggleStatus('polls', poll.id)}>
                      <option value="draft">{t('admin.broadcast.draft')}</option>
                      <option value="published">{t('admin.broadcast.published')}</option>
                    </select>
                    <span className="status progress">{t('admin.broadcast.poll')}</span>
                    <h3><RouterLink to={`/detail/${poll.id}`}>{tPol.question}</RouterLink></h3>
                    <p>{tPol.audience}</p>
                    <p className="poll-expiry">{t('admin.broadcast.timeLeft')}</p>
                    <div className="poll-options">{tPol.options.map((option) => (<span key={option}>{option}</span>))}</div>
                  </article>
                  )
                })}
              </div>
            )}

            {showForms && activeView === 'posts' && (
              <form className="panel-form panel-form--post" onSubmit={handlePostSubmit}>
                <h2>{t('admin.broadcast.createPost')}</h2>
                <label htmlFor="title">{t('admin.broadcast.postTitle')}</label>
                <input id="title" name="title" type="text" placeholder={t('admin.broadcast.postTitlePlaceholder')} required />
                <label htmlFor="type">{t('admin.broadcast.postType')}</label>
                <select id="type" name="type" defaultValue="Program">
                  <option>{t('admin.broadcast.typeProgram')}</option>
                  <option>{t('admin.broadcast.typeOrganization')}</option>
                  <option>{t('admin.broadcast.typePublicNotice')}</option>
                  <option>{t('admin.broadcast.typeNotification')}</option>
                </select>
                <label htmlFor="audience">{t('admin.broadcast.audience')}</label>
                <input id="audience" name="audience" type="text" placeholder={t('admin.broadcast.audiencePlaceholder')} required />
                <label htmlFor="date">{t('admin.broadcast.date')}</label>
                <input id="date" name="date" type="text" placeholder={t('admin.broadcast.datePlaceholder')} required />
                <label htmlFor="body">{t('admin.broadcast.details')}</label>
                <MenuBar editor={editor} />
                <EditorContent editor={editor} />
                <button type="submit">{t('admin.broadcast.publishPost')}</button>
              </form>
            )}

            {showForms && activeView === 'polls' && (
              <form className="panel-form panel-form--poll" onSubmit={handlePollSubmit}>
                <h2>{t('admin.broadcast.createPoll')}</h2>
                <label htmlFor="question">{t('admin.broadcast.pollQuestion')}</label>
                <input id="question" name="question" type="text" placeholder={t('admin.broadcast.pollQuestionPlaceholder')} defaultValue={initialPollQuestion} required />
                <label htmlFor="option1">{t('admin.broadcast.option1')}</label>
                <input id="option1" name="option1" type="text" placeholder={t('admin.broadcast.option1Placeholder')} required />
                <label htmlFor="option2">{t('admin.broadcast.option2')}</label>
                <input id="option2" name="option2" type="text" placeholder={t('admin.broadcast.option2Placeholder')} required />
                <label htmlFor="option3">{t('admin.broadcast.option3')}</label>
                <input id="option3" name="option3" type="text" placeholder={t('admin.broadcast.option3Placeholder')} />
                <label htmlFor="option4">{t('admin.broadcast.option4')}</label>
                <input id="option4" name="option4" type="text" placeholder={t('admin.broadcast.option4Placeholder')} />
                <button type="submit">{t('admin.broadcast.publishPoll')}</button>
              </form>
            )}
          </div>
        </section>
      </main>
    </>
  )
}

export default AdminBroadcast
