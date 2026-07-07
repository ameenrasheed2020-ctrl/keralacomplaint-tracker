import Navbar from '../../components/Navbar'

const Broadcast = () => {
  return (
    <>
      <Navbar />
      <main className="page-shell narrow">
        <section className="page-heading">
          <p className="eyebrow">Broadcast</p>
          <h1>Send update to public users</h1>
        </section>

        <form className="panel-form">
          <label htmlFor="subject">Subject</label>
          <input id="subject" type="text" placeholder="Update subject" />

          <label htmlFor="message">Message</label>
          <textarea id="message" rows="6" placeholder="Write broadcast message" />

          <button type="submit">Send broadcast</button>
        </form>
      </main>
    </>
  )
}

export default Broadcast
