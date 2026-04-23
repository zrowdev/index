# Zrow Beta Waitlist Design

**Date:** 2026-04-23
**Status:** Approved in chat

## Goal

Redesign the existing `index/` Next.js site so it primarily collects high-quality beta waitlist applications for `Zrow`, while keeping access to the software preview manual and curated.

## Scope

This design covers:
- redesigning the existing site in `index/`
- a waitlist application flow
- server-side submission handling on Vercel
- storage for applications
- a manual review and invite workflow for preview access

This design does not cover:
- automated invite issuance
- a public community hub
- a full admin dashboard in v1
- pricing or self-serve onboarding
- software build distribution mechanics

## Product Intent

The first version of the site should do one job well: collect strong beta applications.

Joining the waitlist does not grant automatic product access. Applications are reviewed manually, and preview access is granted selectively by email.

## Architecture Overview

The first version is split into two layers:

1. **Marketing site on Vercel**
   - hosts the product narrative
   - contains the main `Join beta` CTA
   - contains the waitlist form and post-submit confirmation state

2. **Manual beta operations**
   - applications are stored server-side
   - the maintainer reviews applications manually
   - selected applicants receive preview access by manual email

## Site Structure

The v1 site should be a single focused page with one main conversion path.

### Hero
- concise product statement
- one primary CTA: `Join beta`
- optional secondary CTA only if it supports the story cleanly

### What It Helps With
- 3 to 4 concrete use-case blocks
- no abstract slogans

### Why Beta / Why Now
- explains that access is limited
- sets expectations for manual review and wave-based invites

### Beta Signup Block
Required fields in v1:
- `name`
- `email`
- `role`
- `use case`
- `contact handle`
- `referral source`

### Quiet Footer
- only essential links or identifiers

## Visual Direction

The site should use a strict, minimal aesthetic.

### Principles
- dark or near-dark foundation is acceptable if it stays readable
- high contrast text
- compact typography
- limited color palette
- little to no decorative effects
- clean spacing and conventional layout structure

### Explicitly Avoid
- glassmorphism
- generic SaaS gradients
- oversized rounded rectangles
- floating panel compositions
- fake dashboards or fabricated metrics
- AI-product visual clichés

## Waitlist Interaction Design

### Primary Path
1. user reads the page
2. user reaches the waitlist form
3. user submits an application
4. user sees a clear confirmation state on the page
5. no automatic outbound email is sent in v1

### Confirmation State
The confirmation state should clearly say:
- the application was received
- access is limited and reviewed manually
- follow-up will happen later if selected

## Submission Handling

### Runtime
Use a server-side Vercel function to handle form submission.

### Validation
Validate:
- required fields
- email format
- text length limits
- obviously empty or malformed submissions

### Storage Recommendation
Store applications in `Vercel Blob` as separate records rather than appending to one shared JSON file.

## Application Review Model
Recommended statuses:
- `new`
- `reviewed`
- `invited`
- `hold`
- `rejected`

## Beta Invite Workflow
1. applicant submits the waitlist form
2. the application is stored
3. the maintainer reviews new applications periodically
4. suitable applicants are chosen manually
5. preview access is sent manually by working email
6. the application is marked `invited`

## Preview Clarification
- Vercel Preview deployments are for testing site changes
- software preview access is separate from the site and granted manually

## Success Criteria
The first release is successful if:
- the site explains `Zrow` clearly enough for the right people to apply
- the page drives users into one clear beta flow
- valid applications are stored reliably
- the maintainer can manually review and invite candidates without chaos
