"use client";
import { useState } from "react";
import { parseRecipients } from "@/lib/parseRecipients";
import { validateRecipients } from "@/lib/validateRecipients";

import type { Recipient } from "@/app/types/recipient";

export default function Home() {
  const [input, setInput] = useState("");
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [error, setError] = useState("");

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

  const handleEmailChange = (recipientId: string, email: string) => {
    // React sees that instead of passing a new array to setRecipients, we are passing a function that takes the current state and returns a new state. 
    // This is important because it ensures that we are always working with the most up-to-date state, 
    // especially in cases where multiple updates might be happening in quick succession.
    // tl;dr: Don't trip, 'currentRecipients' is a standin for 'recipients'
    setRecipients((currentRecipients) => 
    currentRecipients.map((recipient) =>
     recipient.id === recipientId ? 
    { ...recipient, email } 
    : recipient
    ));
  }

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

      {/* <section>
        <h2>Parsed Recipients ({recipients.length})</h2>
        <pre>{JSON.stringify(recipients, null, 2)}</pre>
      </section> */}
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
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {recipients.map(recipient => {
                const issues = issuesByRecipient.get(recipient.id) ?? [];
                const fullName = [recipient.firstName, recipient.lastName].filter(Boolean).join(" ");
                return (
                  <tr key={recipient.id}>
                    <td>{fullName || "-"}</td>
                    <td>
                      <input 
                        type="email"
                        value={recipient.email}
                        aria-label={`Email for ${fullName || recipient.id}`}
                        onChange={((event) =>handleEmailChange(recipient.id, event.target.value))}
                      />
                    </td>
                    <td>{recipient.organization || "-"}</td>
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
      </section>
    </main>
  );
}