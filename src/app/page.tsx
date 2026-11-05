import Link from 'next/link';
import styles from './page.module.css';


export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <span className={styles.brand}>
          Outreach Assistant
        </span>
        <a
          href="https://github.com/lightsage88/outreach-assistant"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </header>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>A Next.js + TypeScript project</p>
        <h1>Personalized outreach without the busywork.</h1>
        <p className={styles.description}>
          Turn spreadsheet contacts into personalized email drafts with dynamic templates, custom fields, validation, and previews.
        </p>
        <div className={styles.actions}>
          <Link href="/demo" className={styles.primary}>
            Try Interactive Demo
          </Link>
          <a href="https://github.com/lightsage88/outreach-assistant"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}>
            View Sourcecode
          </a>
        </div>
      </section>
      <section className={styles.features}>
        <h2>What it does</h2>
        <div className={styles.grid}>
          <article>
            <h3>Import contacts</h3>
            <p>Paste spreadsheet data, including custom columns</p>
          </article>
          <article>
            <h3>Personalize templates</h3>
            <p>Generate individualized messages using variables.</p>
          </article>
          <article>
            <h3>Validate drafts</h3>
            <p>Catch missing information before preparing outreach.</p>
          </article>
          <article>
            <h3>Export campaigns</h3>
            <p>Download ready-to-use campaign data as CSV.</p>
          </article>
        </div>
      </section>
      <footer className={styles.footer}>
        Built with Next.js, React, TypeScript, Zod, Papa Parse, and LoDash
      </footer>
    </main>
  );
}