# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Original thinkers of any age or background who have not yet founded a company — the defining criterion is genuine originality and first-principles thinking, not career stage. A secondary audience for Cohort 0.5 is community members (dinner attendees, early believers) who may not be immediate applicants but are part of building the cultural substrate.

## Product Purpose

Threshold is a residential institution for the most original inventors before they become founders. It exists to give people the space, intensity, and community to profoundly understand themselves before they build — so that what they build is intrinsic and original, not reactive or mimetic.

Success means producing founders with a vision so personal and unreasonable they cannot do anything but act — and companies that are genuinely category-defining as a result.

## Positioning

Threshold is a British cultural project, not an accelerator. Its mission is to reshape the founding culture of the UK — reclaiming science, progress, and rationalism from the legacy of British polymaths and scientists — rather than incrementally improving individual outcomes. This mission cannot be truthfully claimed by a US-origin or outcomes-first programme.

Secondary differentiators: entirely free (no fees, no equity taken), and pre-idea rather than post-idea. The programme is about identity and direction, not product-market fit.

## Operating Context

- **Current phase:** Cohort 0.5 — simultaneously scouting for residential participants and building early community (dinners, gatherings). The format is partly exploratory and being shaped through this first cohort.
- **Future format:** Full residential (participants live together at a physical UK location for a defined duration).
- **Application:** Multi-step form on /apply with an AI-gated intent field (Claude Haiku evaluates the applicant's "I will..." statement for specificity, personal ownership, and ambition). Binary pass/fail, no triage tiers yet. Submissions write to Google Sheets and notify finn@thresholdresidency.org and jack@thresholdresidency.org via Resend.
- **Archive:** Password-gated page at /archive. Dinner invitation passwords unlock a single (currently empty) archive page. Passwords stored in Netlify env var, updatable without redeploy.
- **Website:** Static HTML/CSS site with Netlify Functions for the application backend and archive auth. Three pages: Manifesto (index), Apply, Archive. Contact: jack@thresholdresidency.org, jamie@thresholdresidency.org.

## Capabilities and Constraints

- Static HTML/CSS site with Netlify Functions (serverless). Dependencies: @anthropic-ai/sdk, googleapis, resend.
- Three Netlify Functions: score-intent (AI gate), submit-application (Sheets + email), archive-auth (password check).
- No pricing page, no alumni page, no programme detail page yet — the site is deliberately sparse.
- Programme details (location, duration, cohort size, selection criteria) are not publicly committed on the site.
- Rate-limiting on the AI gate is a known gap — not yet implemented (in-memory counters don't persist across Netlify Function cold starts).

## Brand Commitments

- **Name:** Threshold / Threshold Residency
- **Voice:** Manifesto-register — philosophical, bold, sweeping, literary. References Sartre, Simmel, the Delphic Maxim, Jung. Rejects corporate/tech idiom.
- **Visual identity:** Near-black ground (#080808), white type, grain texture, no images. Cormorant Garamond (display/body) + IBM Plex Mono (utility/labels). Logo mark is a horizontal white rectangle — not a logotype.
- **Tone commitment:** The site addresses the reader directly and presupposes they may be the person being sought. It does not explain or justify itself to skeptics.

## Evidence on Hand

- Manifesto copy (in index.html) — this is the primary brand asset.
- Application form with AI-gated intent field (apply.html).
- Contact emails for Jack and Jamie (the founders/organisers).
- No testimonials, press, alumni, or case studies yet — future work must not fabricate these.

## Product Principles

1. **Originality over pattern-matching.** Threshold selects for people who think from first principles, not people who fit a startup archetype.
2. **Self-knowledge before building.** The residency's primary output is a founder who understands their own direction — not a pitch deck or a product.
3. **Cultural mission, not individual acceleration.** Every design and copy decision should reinforce that this is a project for Britain's founding culture, not a personal development service.
4. **Free and unconditional.** No equity, no fees — the selection criterion is merit and originality, nothing else.
5. **Seriousness.** The aesthetic and voice signal that this is not a networking event or a bootcamp. It is a serious institution.
