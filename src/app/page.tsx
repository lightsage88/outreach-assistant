"use client";
import { useState } from "react";
import { parseRecipients } from "@/lib/parseRecipients";
import type { Recipient } from "@/app/types/recipient";

export default function Home() {
  const [input, setInput] = useState("");
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [error, setError] = useState("");

  const handleParse = () => {
    try {
      const parsed = parseRecipients(input);

      setRecipients(parsed);
      setError("");
    } catch (err) {

      setRecipients([]);
      setError(
        err instanceof Error ? err.message : "Something went wrong while parsing."
      )
    }
  }
  
  return (
    <main>
      <h1>Outreach Assistant</h1>

      <p>
        Paste recipient data from a spreadsheet to preview the imported contacts.
      </p>
      
      <section>
        <h2>Import Recipients</h2>

        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Paste spreadsheet rows here..."
          rows={8}
          // Make more bespoke styling useing styled-components later!
          style={{width: "100%" }}
        />
        <button type="button" onClick={handleParse}>
          Parse Recipients
        </button>

      </section>
      {error && (
        <p role="alert">{error}</p>
      )}

      <section>
        <h2>Parsed Recipients ({recipients.length})</h2>
        <pre>{JSON.stringify(recipients, null, 2)}</pre>
      </section>
    </main>
  );
}