# WhyUndefeated

> **Live Production**: [whyundefeated.com](https://www.whyundefeated.com)  
> An evidence-based software defensibility index and community alternative ecosystem analyzing why tech incumbents retain competitive moats against generative AI — backed by verified citations, community voting, and indie challenger tooling.

---

## 🏛️ Architecture & System Design

WhyUndefeated is built as a high-performance, hybrid web platform combining **Static Site Generation (SSG)** for immutable analytical content, **Server-Side Rendering (SSR) & Dynamic Routes** for live ecosystem discovery, and **PostgreSQL (Supabase)** for atomic community interactions.

```
                      ┌────────────────────────────────────────┐
                      │         Next.js 15 App Router          │
                      │    (React 19, TypeScript, Strict)      │
                      └──────────────────┬─────────────────────┘
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 │                       │                       │
                 ▼                       ▼                       ▼
     ┌──────────────────────┐┌──────────────────────┐┌──────────────────────┐
     │ Content Engine (SSG) ││ Dynamic Routes (SSR) ││   Interactive UI     │
     │ 52 Versioned Entries ││ /alternatives        ││  Hero Typewriter     │
     │ Zod Validation Gates ││ /submit              ││  3D Canvas Radar     │
     │ Markdown & Citations ││ /admin (Protected)   ││  Mobile 60fps Marquee│
     └──────────────────────┘└───────────┬──────────┘└──────────────────────┘
                                         │
                                         ▼
                             ┌──────────────────────┐
                             │ Supabase (PostgreSQL)│
                             │ • community_alts     │
                             │ • atomic votes       │
                             │ • aggregate views    │
                             └──────────────────────┘
```

---

## ✨ Key Engineering Features

### 1. Zero-Downtime Content Pipeline & Build-Time Gatekeeper
- **52 Deep-Dive Incumbent Profiles**: Categorized across Social, Knowledge, Content, and Community verticals.
- **Strict Schema Enforcement**: All analytical entries are stored as versioned JSON files in `content/entries/` and strictly validated at compile time using **Zod**. If an entry contains a dangling citation reference or invalid enum, `npm run build` fails immediately, preventing corrupted deploys.

### 2. Community Challenger & Submission Engine (`/alternatives` & `/submit`)
- **Indie Tooling Discovery**: Live searchable, filterable directory of challenger products competing with entrenched incumbents.
- **Automated Security & Sanitization**: Submissions pass through client-side and API-level input sanitization (URL validation, XSS prevention, keyword safety heuristics) before persisting to PostgreSQL.
- **Tiered Verification Support**: Built-in tiered data model supporting Verified Creator Badges and Express Review pipelines.
- **Admin Moderation Dashboard (`/admin`)**: Secure administrative portal with cookie-based session authentication to approve, reject, feature, or remove community submissions in real-time.

### 3. Community Consensus Voting Engine
- **Atomic Upsert Logic**: Visitors can cast `Agree` or `Disagree` votes on each platform's moat verdict.
- **Optimistic UI with Rollback**: Vote counts update instantaneously on click with automatic rollbacks if the network request fails.
- **Privacy-Preserving Fingerprinting**: Uses client-side UUID tokens stored in `localStorage` without tracking cookies or collecting PII.
- **PostgreSQL Views**: Real-time aggregation handled via indexed PostgreSQL views (`vote_counts`) to ensure sub-millisecond query performance.

### 4. Live Telemetry & Verified Sponsor Shelf (`/sponsor`)
- **Continuous 60 FPS Mobile Marquee**: Hardware-accelerated CSS marquee dock displaying sponsor slots with zero frame drops and touch/hover pause capabilities.
- **3D Canvas Earth Radar**: Custom HTML5 Canvas rendering mathematical latitude/longitude coordinate points without heavy external WebGL dependencies.
- **Dual Privacy-First Analytics**: Umami Analytics (cookieless telemetry) + `@vercel/analytics` running concurrently without layout shifts.

### 5. Progressive Enhancement & No-JS Resilience
- Core analytical content, navigation, and citation links are 100% accessible with JavaScript disabled.
- Responsive mobile drawer toggles, CSS-only fallbacks, and strict semantic HTML5 landmarks (`<main>`, `<section>`, `<nav>`, `<aside>`).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Components, Route Handlers) |
| **Language** | TypeScript (Strict Mode, 100% type-safe) |
| **Database & Auth** | Supabase (PostgreSQL, Row Level Security, Migration Versioning) |
| **Validation** | Zod (Runtime JSON schema validation) |
| **Styling** | Modern CSS Variables, CSS Grid, Fluid Typography (`clamp()`), Custom Animations |
| **Testing** | Jest (Unit & Integration) + Playwright (Cross-Browser & No-JS E2E) |
| **Analytics** | Vercel Analytics + Umami Analytics |
| **Deployment** | Vercel (Edge Network, Automated CI/CD) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 18.18.0`
- npm `>= 9.0.0`

### Installation

```bash
# Clone repository
git clone https://github.com/MateoGomez11/whyUndefeated.git
cd whyUndefeated

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

### Environment Configuration (`.env.local`)

```env
# Supabase PostgreSQL connection
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key

# Production Domain
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin Moderation
ADMIN_PASSWORD=your_secure_password

# Analytics (Optional)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-umami-id
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://cloud.umami.is/script.js
```

### Database Setup

Apply the database migrations in `supabase/migrations/` to your Supabase project:
- `0001_votes.sql`: Schema for votes and `vote_counts` aggregate view.
- `0002_community_alternatives.sql`: Schema and RLS policies for community alternative submissions.

### Running Locally

```bash
npm run dev
# Open http://localhost:3000 in your browser
```

---

## 🧪 Quality Assurance & Testing Suite

WhyUndefeated enforces rigorous quality standards across both unit logic and browser interactions.

```bash
# Run all unit and integration tests (Jest)
npm test

# Run end-to-end browser tests (Playwright)
npx playwright test

# Execute production build verification gate
npm run build

# Run code style and lint analysis
npm run lint
```

### Test Coverage Highlights:
- **85 Unit & Integration Tests (Jest)**:
  - Zod content schema validation & broken reference assertions.
  - Sorting algorithms (threat levels, community upvotes, tier precedence).
  - Safety and regex input validation pipelines.
  - Supabase client mock resilience and error fallback handling.
- **65 End-to-End Tests (Playwright)**:
  - Cross-browser responsive rendering across Mobile (375px), Tablet (768px), and Desktop (1440px).
  - Progressive Enhancement validation (`javaScriptEnabled: false`).
  - Optimistic vote mutations and multi-click debounce checks.
  - Full submission workflow and form validation states.

---

## 📂 Project Structure

```
whyUndefeated/
├── app/                        # Next.js App Router routes & API endpoints
│   ├── (legal)/                # Privacy, Terms, Methodology static routes
│   ├── admin/                  # Secure moderation dashboard
│   ├── alternatives/           # Dynamic community challenger directory
│   ├── api/                    # Route handlers (votes, submissions, admin actions)
│   ├── entries/[slug]/         # Dynamic entry detail pages
│   ├── sponsor/                # Sponsorship telemetry & pricing page
│   ├── submit/                 # Alternative submission workflow
│   ├── layout.tsx              # Root layout with fonts, analytics, & global dock
│   └── page.tsx                # Homepage featuring 52 indexed platforms
├── components/                 # Modular, accessible React UI components
│   ├── admin/                  # Admin dashboard controls & moderation tables
│   ├── alternatives/           # Directory grids, cards, submission forms, voting
│   ├── sponsor/                # 3D Canvas radar, live telemetry, sponsor marquee
│   ├── EntryCard.tsx           # Monospace-initial platform card
│   ├── HeroHeadline.tsx        # Hydration-safe typewriter animation
│   └── ThreatBadge.tsx         # Accessible threat level indicator
├── content/entries/            # 52 Versioned analytical platform entries (JSON)
├── lib/                        # Core business logic & domain services
│   ├── admin/                  # Admin authentication & session security
│   ├── alternatives/           # Alternative validation, sorting, & database clients
│   ├── content/                # Zod schemas, content loader, & relationship graphs
│   ├── security/               # Rate limiting & input sanitization
│   └── votes/                  # Client voter ID generation & atomic voting client
├── supabase/migrations/        # Version-controlled PostgreSQL schemas & RLS rules
├── tests/                      # Jest unit & integration test suites
└── e2e/                        # Playwright automated browser test specs
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
