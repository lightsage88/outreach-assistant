
# Outreach Assistant

A personalized email campaign builder built with Next.js, React, and TypeScript.

[**Live Application**](https://luminous-tulumba-6edb1a.netlify.app/) · [**Interactive Demo**](https://luminous-tulumba-6edb1a.netlify.app/demo)

## Overview

Outreach Assistant helps turn spreadsheet contact lists into personalized email drafts.

The application supports importing recipient data, validating contact information, customizing message templates, previewing individualized drafts, and exporting campaign data.

I started this project to streamline professional outreach for work as an actor and opera singer while exploring practical application architecture, data validation, and modern React development. tl;dr: I didn't want to copy and paste an email to every conductor, director, and general manager on the planet while making small changes to who I was addressing. lol

## Features

- **Spreadsheet imports:** Paste tab-separated contact data, including custom columns.
- **Editable recipients:** Review and correct imported contact information.
- **Template personalization:** Insert recipient-specific values using placeholders such as `{{firstName}}` and `{{organization}}`.
- **Validation:** Identify incomplete recipient records and drafts that aren't ready.
- **Live previews:** Review personalized messages before exporting.
- **CSV export:** Download ready-to-use campaign data.
- **Local persistence:** Save private campaign data in browser storage during local development.
- **Public demo:** Explore the application using fictional contacts without saving changes.

The application currently prepares Gmail-compatible message data during local development. It does not authenticate with Gmail, create drafts in a Gmail account, or send emails.

## Technology Stack

| Technology | Purpose |
| --- | --- |
| Next.js | App Router, routing, and server endpoints |
| React | Interactive campaign workspace |
| TypeScript | Typed application data and components |
| Zod | Request validation |
| Papa Parse | Spreadsheet data parsing |
| Lodash | Data transformation utilities |
| Netlify | Deployment and hosting |

## Architecture

The application separates campaign processing from the user interface.

- `src/components/OutreachWorkspace.tsx` — Interactive campaign editor and preview.
- `src/lib/` — Parsing, validation, template rendering, draft generation, CSV export, and persistence utilities.
- `src/app/types/` — Shared TypeScript data models.
- `src/app/demo/` — Public demonstration using fictional campaign data.
- `src/app/workspace/` — Development-only private workspace.
- `src/app/api/gmail/prepare-drafts/` — Development-only endpoint for preparing Gmail-compatible message data.

The public demo and private workspace reuse the same workspace component with different modes.

## Getting Started

### Prerequisites

- Node.js compatible with Next.js 16
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/lightsage88/outreach-assistant.git
cd outreach-assistant
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Available routes:

- `/` — Portfolio landing page
- `/demo` — Interactive public demo
- `/workspace` — Private-mode workspace, available during development

## Development Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Deployment and Privacy

The public application is hosted on Netlify.

The production deployment restricts access to the private workspace and the Gmail preparation API. The workspace returns a 404 response, while the API rejects POST requests with HTTP 403.

The interactive demo uses fictional contacts. Demo edits are not persisted, and no emails are sent.

Private campaign persistence uses browser localStorage during development. It is not a substitute for encrypted storage or authenticated multi-user access.

## Roadmap

Planned improvements include:

- Rich HTML email composition
- Clickable, labeled media links
- PDF resume and headshot attachments
- Improved responsive workspace styling
- Automated tests for campaign-processing utilities
- Authenticated access to private campaign functionality
- Gmail integration for creating actual drafts
- AI feature to ensure that who I'm addressing is still with the company, alive, etc.

These features are planned and are not part of the current public demo.

## Project Status

Active development. The public demo is available as a portfolio preview while additional functionality & styling are being built.

## Author

Adrian Rosales

[GitHub](https://github.com/lightsage88)
[Portfolio](https://adrian-rosales.tech)
[Arts Site](https://adrian-rosales.art)
