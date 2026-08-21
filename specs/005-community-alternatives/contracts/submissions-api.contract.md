# Interface Contract: Community Submissions & Alternatives Query API

**Feature**: `005-community-alternatives`  
**Protocol**: Next.js Server Actions / API Route Handlers  

---

## 1. Submission Endpoint (`POST /api/alternatives/submit` or Server Action `submitAlternative`)

### Request
```json
{
  "target_slug": "wikipedia",
  "name": "Kagi FastGPT Assistant",
  "url": "https://kagi.com",
  "icon": "⚡",
  "description": "Ad-free privacy search engine with instant direct factual answers.",
  "creator_email": "founder@example.com",
  "is_verified_request": true,
  "website_hp": ""
}
```

### Validation Rules:
- `target_slug`: string matching a valid entry slug, or `'general'` / `null`.
- `name`: string, 1 to 60 characters.
- `url`: string, strictly beginning with `https://` or `http://`.
- `description`: string, 5 to 160 characters.
- `creator_email`: string, valid email format.
- `website_hp`: must be empty string (honeypot check).

### Response (Success: 201 Created)
```json
{
  "success": true,
  "message": "Alternative submitted successfully and queued for review.",
  "id": "c1f76d72-749d-472e-8395-812048e9196b"
}
```

### Response (Validation Error: 400 Bad Request)
```json
{
  "success": false,
  "message": "Invalid URL protocol. Only https:// or http:// are permitted."
}
```

---

## 2. Query Client Contract (`fetchAlternativesForSlug(slug)` & `fetchAllAlternatives()`)

### Function: `fetchAlternativesForSlug(targetSlug: string): Promise<CommunityAlternative[]>`
- Queries `community_alternatives` where `target_slug = targetSlug` and `status = 'approved'`.
- Returns array sorted by `is_verified DESC, created_at DESC`.
- On database failure, catches error and returns `[]` without throwing.

### Function: `fetchAllAlternatives(): Promise<CommunityAlternative[]>`
- Queries all approved `community_alternatives`.
- Returns array sorted by `is_verified DESC, created_at DESC`.
- On database failure, returns `[]`.
