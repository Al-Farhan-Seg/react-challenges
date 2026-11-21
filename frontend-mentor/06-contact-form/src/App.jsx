import { useState } from 'react'

/*
==================== PROMPT FOR NEXT SESSION (paste to Claude) ====================

Continue guiding me on the Frontend Mentor "Contact form" challenge
(frontend-mentor/06-contact-form). Read this file, contact-form-main/README.md
and contact-form-main/design/*.jpg first.

HOW TO HELP ME
- React LOGIC (state, handlers, validation, accessibility): act as a mentor.
  Guide me with questions and hints, explain the "why" in simple, non-technical
  English, and let me write the code. Review what I write. Only write the code
  yourself if I explicitly ask.
- STYLING (Tailwind): I already know it, so give a short plan first, wait for my OK,
  then implement in small steps so I can review each one.
- Never add AI attribution to commits or PRs.

THE CHALLENGE
Build an accessible contact form that matches the design. Users should be able to:
- Fill in the form and see a success toast after a valid submit
- See validation messages when a required field is missed or the email is badly formatted
- Complete the form with the keyboard only
- Have inputs, errors and the success message announced by a screen reader
- See a good layout on every screen size
- See hover and focus states on every interactive element
Stack: React + Vite + Tailwind v4 (brand colors are in src/index.css under @theme).

DONE SO FAR
- Form markup: labels linked with htmlFor, fieldset/legend for the query type.
- Styling: mobile-first flex layout, desktop two-column rows, borders, rounded corners,
  accent colors, button. Committed and pushed as 85968e3.
- State: ONE object (personalInfo) with firstName, lastName, email, messageBox and
  consentInput (false).
- ONE shared handleChange for text inputs, the textarea and the checkbox.
  It uses destructuring and a checkbox ternary.
- Controlled inputs: first name, last name, email, message and the checkbox.
  They use value/checked plus onChange, and each name matches its state key.

PENDING (in suggested order)
1. Radios: they have no value attribute and no state yet. Needs a queryType key
   (what start value?), a value on each radio, and a checked comparison.
   Also decide whether handleChange needs to change for radios.
2. Rename personalInfo to something that fits now that it holds more than personal info.
3. Validation on submit: required fields, radios and consent, and email format.
   Likely needs noValidate on the form and an errors state.
4. Success toast after a valid submit, and whether the form resets.
5. Accessibility: aria-invalid, aria-describedby, role="alert" or aria-live for errors,
   role="status" for the toast, a keyboard-only test, and the "*" read aloud.
6. Styling still missing: hover/focus states, error state styles (brand-red),
   custom radio/checkbox visuals (assets/images), and a check against mobile-design.jpg.
7. Cleanup: remove the console.log lines and the old commented code, write my own
   README from README-template.md, then deploy and submit.

PROBLEMS I RAN INTO AND WHAT I LEARNED
- onChange={handleChange()} crashed the page: it calls the function during render.
  Pass the function (handleChange) and React calls it on each event.
- Checkbox got stuck ticked: the handler saved event.target.value, which is always
  "on" for a checkbox. A checkbox's real data is event.target.checked.
- A shared handler only works if the input's name matches the state key
  (so firstName, not first-name).
- Object state: use setState((prev) => ({ ...prev, [name]: newValue })) so the other
  keys are kept. [name] means "use the variable's contents as the key".
- Destructuring (const { name, type, value, checked } = event.target) is just a shortcut
  for four separate const lines.
- Debugging habits that helped: console.log(personalInfo) and logging event.target details.

START BY asking me what I think the radio inputs need, before giving any hints.

====================================================================================
*/

function App() {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    messageBox: '',
    consentInput: false,
  })

  /* // Before adding for the CheckBoX
  function handleChange(event) {
    setPersonalInfo((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
    console.log(event.target.value, event.target.checked)
  }*/


  function handleChange(event) {
    const { name, type, value, checked } = event.target
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    console.log(name, type, value, checked)
  }



  return (
    <main className="bg-brand-green-light flex min-h-dvh items-center justify-center p-4">
      <div className="bg-brand-white w-full max-w-[736px] rounded-2xl p-6 md:p-10">
        <h1 className="text-brand-grey-dark mb-6 text-3xl font-bold">Contact Us</h1>

        <form action="" className="flex flex-col gap-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="f-name-input" className="text-brand-grey-dark">
                First Name *
              </label>
              <input
                name="firstName"
                value={personalInfo.firstName}
                onChange={handleChange}
                type="text"
                id="f-name-input"
                className="border-brand-green rounded-lg border px-4 py-3"
              />
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="l-name-input" className="text-brand-grey-dark">
                Last Name *
              </label>
              <input
                name="lastName"
                value={personalInfo.lastName}
                onChange={handleChange}
                type="text"
                id="l-name-input"
                className="border-brand-green rounded-lg border px-4 py-3"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email-input" className="text-brand-grey-dark">
              Email Address *
            </label>
            <input
              name="email"
              value={personalInfo.email}
              onChange={handleChange}
              type="email"
              id="email-input"
              className="border-brand-green rounded-lg border px-4 py-3"
            />
          </div>

          <fieldset className="flex flex-col gap-4 md:flex-row">
            <legend className="text-brand-grey-dark mb-2">Query Type *</legend>

            <div className="border-brand-green flex items-center gap-4 rounded-lg border px-6 py-3 md:flex-1">
              <input
                type="radio"
                name="query-type"
                id="general-query-input"
                className="accent-brand-green"
              />
              <label htmlFor="general-query-input" className="text-brand-grey-dark">
                General Enquiry
              </label>
            </div>

            <div className="border-brand-green flex items-center gap-4 rounded-lg border px-6 py-3 md:flex-1">
              <input
                type="radio"
                name="query-type"
                id="support-query-input"
                className="accent-brand-green"
              />
              <label htmlFor="support-query-input" className="text-brand-grey-dark">
                Support Request
              </label>
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <label htmlFor="message-box" className="text-brand-grey-dark">
              Message *
            </label>
            <textarea
              name="messageBox"
              value={personalInfo.messageBox}
              onChange={handleChange}
              id="message-box"
              className="border-brand-green h-26 rounded-lg border px-4 py-3"
            ></textarea>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={personalInfo.consentInput}
              onChange={handleChange}
              name="consentInput"
              id="consent-input"
              className="border-brand-green accent-brand-green border"
            />
            <label htmlFor="consent-input" className="text-brand-grey-dark">
              I consent to being contacted by the team *
            </label>
          </div>

          <button
            type="submit"
            className="bg-brand-green text-brand-white rounded-lg py-4 font-bold"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  )
}

export default App



/* // Same handler WITHOUT destructuring (for reference)
  function handleChange(event) {
    // Pull each detail out of event.target one by one
    const name = event.target.name // which field was touched, e.g. "consentInput"
    const type = event.target.type // what kind of input it is, e.g. "checkbox"
    const value = event.target.value // the typed text (always "on" for a checkbox)
    const checked = event.target.checked // true/false, only meaningful for a checkbox

    // Decide what to save: ticked/unticked for a checkbox, typed text for everything else
    let newValue
    if (type === 'checkbox') {
      newValue = checked
    } else {
      newValue = value
    }

    // Copy the old state, then overwrite just the one field that was touched
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: newValue,
    }))
  }*/