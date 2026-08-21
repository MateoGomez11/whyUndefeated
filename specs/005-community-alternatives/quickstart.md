# Quickstart & Validation Guide: Community Alternatives & Submissions

**Feature**: `005-community-alternatives`  

---

## 1. Prerequisites

- Node.js 18+
- Supabase Project URL & Anon Key (configured in `.env.local`)
- Table `community_alternatives` created in Supabase with RLS enabled

---

## 2. Validation Scenarios

### Scenario 1: Submitting a new alternative on `/submit`
1. Navigate to `http://localhost:3000/submit`.
2. Select Target App: "Wikipedia".
3. Fill App Name: "Kagi Assistant", URL: `https://kagi.com`, Description: "Instant factual summaries".
4. Enter email: `test@example.com` and submit.
5. Expected Outcome: Green confirmation screen confirming submission is queued for review.

### Scenario 2: Community alternatives in right rail of `/entries/wikipedia`
1. Approve the alternative in Supabase (or mock seed).
2. Navigate to `http://localhost:3000/entries/wikipedia`.
3. Expected Outcome:
   - Header shows badge: `"1 Community Alternative"`.
   - Right rail shows card with icon, name, description, and visit link.

### Scenario 3: Global Directory on `/alternatives`
1. Click `Alternatives` in NavBar.
2. Expected Outcome:
   - Page loads `/alternatives` showing the global catalogue.
   - Shows badge for target company ("Alternative to Wikipedia").

### Scenario 4: Anti-Spam protection
1. Attempt submission with `javascript:alert(1)` as URL.
2. Expected Outcome: Form displays red validation error and prevents submission.
