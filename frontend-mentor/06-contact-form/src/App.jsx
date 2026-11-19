function App() {
  return (
    <main>
      <div>
        <h1>Contact Us</h1>

        <form action="">
          <div>
            <div>
              <label htmlFor="f-name-input">First Name *</label>
              <input type="text" id="f-name-input" />
            </div>

            <div>
              <label htmlFor="l-name-input">Last Name *</label>
              <input type="text" id="l-name-input" />
            </div>
          </div>

          <div>
            <label htmlFor="email-input">Email Address *</label>
            <input type="email" id="email-input" />
          </div>

          <fieldset>
            <legend>Query Type *</legend>

            <div>
              <input type="radio" name="query-type" id="general-query-input" />
              <label htmlFor="general-query-input">General Enquiry</label>
            </div>

            <div>
              <input type="radio" name="query-type" id="support-query-input" />
              <label htmlFor="support-query-input">Support Request</label>
            </div>
          </fieldset>

          <div>
            <label htmlFor="message-box">Message *</label>
            <textarea name="message-box" id="message-box"></textarea>
          </div>

          <div>
            <input type="checkbox" name="consent-input" id="consent-input" />
            <label htmlFor="consent-input">
              I consent to being contacted by the team *
            </label>
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </main>
  )
}

export default App