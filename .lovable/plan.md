# Businesses (tenants), terms gaps, and outsourced file storage

## 1. What your terms are missing

Your existing Terms of Service page is much longer and stronger than the uploaded General Terms of Use (that PDF is the government e-GP one). Comparing them, these clauses are genuinely missing from yours:

- **No scraping / bots / automated harvesting** — no spiders, scrapers, or bulk data extraction of tenders and supplier data.
- **No security probing** — no vulnerability scanning, password mining, or attempts to trace other users' accounts.
- **No impersonation or forged identifiers** — no pretending to represent another company.
- **No excessive load** — no activity that overloads the platform.
- **Third-party links disclaimer** — we don't endorse or take responsibility for linked sites.
- **Linking to us / no framing** — others may link to us but not load our pages inside their own frames.
- **Additional Terms and precedence** — role-specific terms for buyers and suppliers, and which document wins in a conflict.
- **Availability and planned maintenance** — reasonable-endeavours uptime, right to suspend for maintenance.

Two fixes as well: the current terms still say "Government Buyers" in the roles section, which contradicts your private-sector positioning, and it references only Kenyan law while you sell to multinationals.

Plan: add the missing clauses to `/terms`, rename the buyer role section, bump the version and date, and add short role annexes (Buyer Terms, Supplier Terms) on the same page.

## 2. Businesses / selling as tenants

Today a company is just a text field on someone's profile. Nothing separates one company's data from another's, and subscriptions belong to individuals — so you cannot yet sell a seat-based plan to a business.

What gets built:

- **Businesses** — name, legal name, registration number, tax number, country, industry, size, logo, billing email, plan.
- **Membership** — a person belongs to one or more businesses with a role: owner, admin, member. Owner can transfer ownership; last owner cannot be removed.
- **Invitations** — invite by email with a role, expiring token, accept flow. Replaces the current Team page stub so invites actually work.
- **Business context** — after sign-in you land in your business; a switcher in the header if you belong to more than one. New sign-ups either create a business or join one by invitation.
- **Data separation** — every tender, bid, contract, plan, requisition, budget, catalog item and document is stamped with its business, and access rules only ever return your own business's rows. Public tender listings stay public by design.
- **Billing per business** — subscription moves from the individual to the business, with seat counts; existing personal subscriptions migrate to a business created for that user.
- **Audit** — business ID recorded on every audit entry.

Migration safety: every existing user gets a business created from their current company name, and all their existing records are attached to it, so nothing disappears and nobody loses access.

## 3. Moving files off Supabase Storage

Pricing today (list prices, USD, per month):

| Provider | Storage per GB | Download (egress) per GB | Notes |
|---|---|---|---|
| Supabase (current) | $0.021 | $0.09 | 100 GB storage + 250 GB egress included on Pro ($25) |
| Cloudflare R2 | $0.015 | **$0** | 10 GB free; no egress charge at all |
| Backblaze B2 | $0.006 | $0.01 | Cheapest storage; 10 GB free |
| Amazon S3 (Standard) | $0.023 | $0.09 | Most expensive at scale, most integrations |

Worked example — 500 GB of tender and bid documents, 1 TB downloaded per month:
Supabase ≈ $10 storage + $90 egress ≈ **$100/mo** · R2 ≈ $7 + $0 ≈ **$7/mo** · B2 ≈ $3 + $10 ≈ **$13/mo** · S3 ≈ $12 + $90 ≈ **$102/mo**

Recommendation: **Cloudflare R2** — zero download charges, which matters because procurement documents get downloaded far more often than uploaded.

How it works: file records stay in your database; a small server-side function issues a short-lived upload link so the browser uploads straight to R2, and short-lived download links keep private documents private. Each file row remembers where it lives, so old Supabase files keep working while new ones go to R2 and existing ones copy across in the background. Nothing changes visually in any screen.

## 4. Order of work

1. Terms of use gaps (quick, no database change).
2. Businesses: database, membership, invitations, switcher, data separation, billing per business.
3. R2 storage: needs your Cloudflare account ID and R2 access keys before I can wire it.

## Technical notes

- New tables `businesses`, `business_members`, `business_invitations`; `business_id` column added to tenant-owned tables with backfill from `profiles.company_name`; security-definer helpers `is_business_member(business_id)` and `has_business_role(business_id, role)` used in RLS to avoid recursion; roles kept in `business_members`, never on profiles.
- `user_subscriptions` gains `business_id` and `seats`; enforcement functions updated to resolve the plan via business.
- Storage: `file_objects` table (bucket, key, provider, size, mime, owner, business_id); edge functions `storage-sign-upload` / `storage-sign-download` using S3-compatible presigned URLs against R2; secrets `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`. `DocumentUploadService` and `DocumentStorageService` gain a provider-aware path, keeping the Supabase path as fallback.
