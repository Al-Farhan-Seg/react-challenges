import { useState } from "react"


function App() {


  return (
    <main className="bg-brand-green-light p-4 min-h-dvh flex items-center justify-center">
      <div className="bg-brand-white w-full max-w-[736px] p-6 md:p-10 rounded-2xl">
        <h1 className="text-brand-grey-dark text-3xl font-bold mb-6">Contact Us</h1>

        <form action="" className="flex flex-col gap-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="f-name-input" className="text-brand-grey-dark">First Name *</label>
              <input type="text" id="f-name-input" className="border border-brand-green rounded-lg px-4 py-3" />
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="l-name-input" className="text-brand-grey-dark">Last Name *</label>
              <input type="text" id="l-name-input" className="border border-brand-green rounded-lg px-4 py-3" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email-input" className="text-brand-grey-dark">Email Address *</label>
            <input type="email" id="email-input" className="border border-brand-green rounded-lg px-4 py-3" />
          </div>

          <fieldset className="flex flex-col gap-4 md:flex-row">
            <legend className="text-brand-grey-dark mb-2">Query Type *</legend>

            <div className="flex items-center gap-4 border border-brand-green rounded-lg px-6 py-3 md:flex-1">
              <input type="radio" name="query-type" id="general-query-input" className="accent-brand-green" />
              <label htmlFor="general-query-input" className="text-brand-grey-dark">General Enquiry</label>
            </div>

            <div className="flex items-center gap-4 border border-brand-green rounded-lg px-6 py-3 md:flex-1">
              <input type="radio" name="query-type" id="support-query-input" className="accent-brand-green" />
              <label htmlFor="support-query-input" className="text-brand-grey-dark">Support Request</label>
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <label htmlFor="message-box" className="text-brand-grey-dark">Message *</label>
            <textarea name="message-box" id="message-box" className="border border-brand-green rounded-lg px-4 py-3 h-26"></textarea>
          </div>

          <div className="flex items-center gap-4">
            <input type="checkbox" name="consent-input" id="consent-input" className="border border-brand-green accent-brand-green" />
            <label htmlFor="consent-input" className="text-brand-grey-dark">
              I consent to being contacted by the team *
            </label>
          </div>

          <button type="submit" className="bg-brand-green text-brand-white rounded-lg py-4 font-bold">Submit</button>
        </form>
      </div>
    </main>
  )
}

export default App
