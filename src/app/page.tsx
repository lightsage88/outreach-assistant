"use client";
import { useState } from "react";
import { parseRecipients } from "@/lib/parseRecipients";
import { validateRecipients } from "@/lib/validateRecipients";
import { renderTemplate } from "@/lib/renderTemplate";

import type { Recipient } from "@/app/types/recipient";

// a TS Union Type - variables of type EditableRecipientField
// can contain any one of those four strings, but nothing else
type EditableRecipientField = 
| "email"
| "firstName"
| "lastName"
| "organization"
| "greeting";

export default function Home() {
  const [input, setInput] = useState("");
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [error, setError] = useState("");
  // TODO: Placeholder subject and body templates for now
  const [subjectTemplate, setSubjectTemplate] = useState("Introduction from {{firstName}}");
  const [bodyTemplate, setBodyTemplate] = useState(
    "{{greeting}}\n\nI'm reaching out regarding an opportunity with {{organization}}."
  );

  const previewRecipient = recipients[0];
  // TODO: Make these into one function.
  const renderedSubject = previewRecipient ?
    renderTemplate(
      subjectTemplate,
      previewRecipient
    ) : "";

    const renderedBody = previewRecipient ?
    renderTemplate(
      bodyTemplate,
      previewRecipient
    ) : "";

  const handleParse = () => {
    try {
      // Step 1: Convert spreadsheet text input into recipient objects
      const parsed = parseRecipients(input);

      // Step 2: Update our application state
      setRecipients(parsed);
      setError("");
    } catch (err) {
      // If an error is caught, we clear the recipients and validation issues
      setRecipients([]);
      // and then we set an error message
      setError(
        err instanceof Error ? err.message : "Something went wrong while parsing."
      )
    }
  }

  const handleRecipientFieldChange = (
    recipientId: string,
    field: EditableRecipientField,
    value: string
  ) => {
    // React sees that instead of passing a new array to setRecipients, we are passing a function that takes the current state and returns a new state. 
    // This is important because it ensures that we are always working with the most up-to-date state, 
    // especially in cases where multiple updates might be happening in quick succession.
    // tl;dr: Don't trip, 'currentRecipients' is a standin for 'recipients'
    setRecipients(currentRecipients => 
      currentRecipients.map(recipient => 
        recipient.id === recipientId
        ? {
          ...recipient,
          [field]: value,
        }
        : recipient
      )
    );
  };
  

  // Validation of recipients is done after parsing so we can still display them in the UI
  // through the machinations that follow
  const validationIssues = validateRecipients(recipients);

  // Count how many distinct recipients have problems
  const invalidRecipientIds = new Set(validationIssues.map((issue)=> issue.recipientId));
  // The 'readyCount' gives us the number of recipients total minus the number of recipients that have a problem
  const readyCount = recipients.length - invalidRecipientIds.size;
  const issuesByRecipient = new Map<string, string[]>();

  for (const issue of validationIssues) {
    const existingMessages = issuesByRecipient.get(issue.recipientId);

    if (existingMessages) {
      existingMessages.push(issue.message);
    } else {
      issuesByRecipient.set(issue.recipientId, [issue.message]);
    }
  }
  return (
    <main>
      <h1>Outreach Assistant</h1>

      <p>
        Paste recipient data from a spreadsheet to preview and validate imported contacts.
      </p>
      
      <section>
        <h2>Import Recipients</h2>

        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Paste spreadsheet rows here..."
          rows={8}
          // TODO: Make more bespoke styling useing styled-components later!
          style={{width: "100%" }}
        />
        <button type="button" onClick={handleParse}>
          Parse Recipients
        </button>

      </section>
      {error && (
        <p role="alert">{error}</p>
      )}
      <section aria-live="polite">
        <h2>Import Summary</h2>
        <p>Total recipients: {recipients.length}</p>
        <p>Recipients ready: {readyCount}</p>
        <p>Validation issues: {validationIssues.length}</p>
        {validationIssues.length > 0 && (
          <>
            <h3>Issues Found</h3>
            <ul>
              {validationIssues.map((issue) => (
                <li key={`${issue.recipientId}-${issue.type}`}>
                  <strong>{issue.recipientId}:</strong>{" "}
                  {issue.message}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
      <section>
        <h2>Parsed Recipients ({recipients.length})</h2>
        {recipients.length === 0 ? (
          <p>No recipients parsed yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Organization</th>
                <th scope="col">Greeting</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {recipients.map(recipient => {
                const issues = issuesByRecipient.get(recipient.id) ?? [];
                // const fullName = [recipient.firstName, recipient.lastName].filter(Boolean).join(" ");
                return (
                  <tr key={recipient.id}>
                    <td>
                      <input
                        type="text"
                        aria-label={`First name for ${recipient.id}`}
                        placeholder="First name"
                        value={recipient.firstName ?? ''}
                        onChange={event => handleRecipientFieldChange(recipient.id, "firstName", event.target.value)}
                    />
                    <input
                      type="text"
                      aria-label={`Last name for ${recipient.id}`}
                      placeholder="Last name"
                      value={recipient.lastName ?? ''}
                      onChange={event => handleRecipientFieldChange(recipient.id, "lastName", event.target.value)}
                      
                    />
                    </td>
                    <td>
                      <input 
                        type="email"
                        value={recipient.email}
                        aria-label={`Email for ${recipient.id}`}
                        onChange={(event => handleRecipientFieldChange(recipient.id, "email", event.target.value))}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        aria-label={`Organization for ${recipient.id}`}
                        value={recipient.organization ?? ''}
                        onChange={event => handleRecipientFieldChange(recipient.id, "organization", event.target.value)}
                        />
                    </td>
                    <td>
                      <input 
                        type="text"
                        aria-label={`Greeting for ${recipient.id}`}
                        placeholder="Dear..."
                        value={recipient.greeting ?? ''}
                        onChange={event => handleRecipientFieldChange(recipient.id, "greeting", event.target.value)}
                      />
                    </td>
                    <td>
                      {issues.length === 0 ?(<span>Ready</span>) : (
                        <ul>
                          {issues.map((message,index) => (
                            <li key={index}>
                              {message}
                            </li>
                          )
                        )}
                        </ul>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        <section>
          <h2>Email Template</h2>
          <div>
            <label htmlFor="subject-template">Subject</label>
            <input
              id="subject-template"
              type="text"
              value={subjectTemplate}
              onChange={event => setSubjectTemplate(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="body-template">
              Message
            </label>
            <textarea 
              id="body-template"
              value={bodyTemplate}
              onChange={event => setBodyTemplate(event.target.value)}
              rows={10}
              // TODO: Update this with styled-components later!
              style={{width: "100%"}}
            />
          </div>
          <p>
            Available Variables:
            {" "}
            <code>{"{{greeting}}"}</code>
            {" "}
            <code>{"{{firstName}}"}</code>
            {" "}
            <code>{"{{lastName}}"}</code>
            {" "}
            <code>{"{{organization}}"}</code>
            {" "}
            <code>{"{{email}}"}</code>
          </p>
        </section>
        <section>
          <h2>Email Preview</h2>

          {previewRecipient? (
            <>
              <p>
                Previewing email for{" "}
                <strong>
                  {previewRecipient.email}
                </strong>
              </p>

              <h3>Subject</h3>
              <p>{renderedSubject}</p>

              <h3>Message</h3>
              <pre
              // TODO: Use styled-components later
                style={{whiteSpace: "pre-wrap"}}
              >
                {renderedBody}
              </pre>
            </>
          ): (
            <p>Import at least one recipient to preview the email.

            </p>
          )}
        </section>
      </section>
    </main>
  );
}