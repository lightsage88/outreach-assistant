"use client";
import { useState } from "react";
import { parseRecipients } from "@/lib/parseRecipients";
import { validateRecipients } from "@/lib/validateRecipients";

import type { Recipient } from "@/app/types/recipient";
import type { RecipientValidationIssue } from "@/lib/validateRecipients";

export default function Home() {
  const [input, setInput] = useState("");
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [error, setError] = useState("");

  // This will store problems discovered during validation
  const [validationIssues, setValidationIssues] = useState<RecipientValidationIssue[]>([])

  const handleParse = () => {
    try {
      // Step 1: Convert spreadsheet text input into recipient objects
      const parsed = parseRecipients(input);

      // Step 2: Check those resulting recipient objects for problems
      const issues = validateRecipients(parsed);

      // Step 3: Update our application state
      setRecipients(parsed);
      setValidationIssues(issues);
      setError("");
    } catch (err) {
      // If an error is caught, we clear the recipients and validation issues
      setRecipients([]);
      setValidationIssues([]);
      // and then we set an error emssage
      setError(
        err instanceof Error ? err.message : "Something went wrong while parsing."
      )
    }
  }

  // Count how many distinct recipients have problems
  const invalidRecipientIds = new Set(validationIssues.map((issue)=> issue.recipientId));
  // The 'readyCount' gives us the number of recipients total minus the number of recipients that have a problem
  const readyCount = recipients.length - invalidRecipientIds.size;
  
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
        <pre>{JSON.stringify(recipients, null, 2)}</pre>
      </section>
    </main>
  );
}