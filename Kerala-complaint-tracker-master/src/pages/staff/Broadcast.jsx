import { useTranslation } from 'react-i18next'
import Navbar from '../../components/Navbar'

const Broadcast = () => {
  const { t } = useTranslation()
  return (
    <>
      <Navbar />
      <main className="page-shell narrow">
        <section className="page-heading">
          <p className="eyebrow">{t('staff.broadcast.heading')}</p>
          <h1>{t('staff.broadcast.description')}</h1>
        </section>

        <form className="panel-form">
          <label htmlFor="subject">{t('staff.broadcast.subject')}</label>
          <input id="subject" type="text" placeholder={t('staff.broadcast.subjectPlaceholder')} />

          <label htmlFor="message">{t('staff.broadcast.message')}</label>
          <textarea id="message" rows="6" placeholder={t('staff.broadcast.messagePlaceholder')} />

          <button type="submit">{t('staff.broadcast.send')}</button>
        </form>
      </main>
    </>
  )
}

export default Broadcast
