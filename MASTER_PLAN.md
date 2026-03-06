# Roof — Master Plan

> The Operating System for Renovations (SG & MY)

## Architecture

```
roofplatform.com (Homeowner Site)          roof-builder.vercel.app (Builder Platform)
├── Get Matched (designer matching)        ├── /landing — Dark theme landing
├── Guides & References                    ├── /hub — All 12 engines
├── FAQ                                    ├── /follow-up — Pipeline (leads)
├── For Firms (contractor signup)          ├── / — Numbers (quote builder)
├── SG | MY toggle                         ├── /dispatch — Trade deployment
└── For Builders ↗ (links to builder)      ├── /sequence — Design studio
                                           ├── /ledger — Financials
GitHub: tsybjornie/lead-portal             ├── /hardware-pos — Supply counter
├── main branch → homeowner site           ├── /forecast — Revenue projections
└── builder-platform branch → builder      ├── /chat — Masked messaging
                                           ├── /inspect — Defect tracking
Vercel Projects:                           ├── /measure — Site surveys
├── roofplatform → roofplatform.com        ├── /price-index — 113 materials
└── roof-builder → roof-builder.vercel.app ├── /vendor-rates — Supplier comparison
                                           ├── /irs — Reputation (ADMIN ONLY)
                                           ├── /signup/* — All signup flows
                                           └── /client/* — Client dashboards
```

## The 5 Core Protocols

| # | Protocol | Route | Status | Purpose |
|---|----------|-------|--------|---------|
| 01 | **Pipeline** | /follow-up | ✅ Built | Lead capture → prospect → client conversion |
| 02 | **Numbers** | / | ✅ Built | Quote builder with 113 SG-priced materials |
| 03 | **Dispatch** | /dispatch | ✅ Built | 20 trades, auto-pricing, kanban deployment |
| 04 | **Sequence** | /sequence | ✅ Built | Design studio, material uploads, zone tagging |
| 05 | **Ledger** | /ledger | ✅ Built | Payment tracking, invoice management |

## IRS — Internal Reputation System (Admin Only)

Hidden from all users. Only we see it.

### The Chain
```
Homeowner → ID (Interior Designer) → Contractor Boss (Towkay) → Worker
```

### 4 Tabs
- **Workers** — IRS score, boss/firm, trade, on-time %, defect %, loyalty points, tier
- **ID Firms** — HO rating vs contractor rating, TWO-FACED flag (gap > 1★), SERIAL flag
- **Complaints** — Credibility-weighted tickets. HO = 100%, contractor = IRS ÷ 10
- **Loyalty Drops** — Every point deduction logged. Ghost designer = -500, gossip = -40 to filer

### Anti-Manipulation
- Complaint credibility tied to filer's own IRS score
- False complaints penalize the FILER, not the target
- Suspicious loyalty flag for contractors who never report issues
- Two-faced detection: homeowner rates 4.5★ but contractors rate 2.1★ = flagged

## Markets

| Market | Currency | Regulatory | Status |
|--------|----------|------------|--------|
| 🇸🇬 Singapore | SGD | BCA, ACRA, HDB permits | ✅ Active |
| 🇲🇾 Malaysia | MYR | CIDB, SSM, DBKL | 🔲 Planned |

## Supporting Pages

| Page | Route | Purpose |
|------|-------|---------|
| Landing | /landing | Dark premium hero, engine showcase |
| Hub | /hub | Command center — all 12 engines |
| Why Roof | /why-roof | Value proposition |
| Founding 20 | /founding | Early adopter program |
| Price Index | /price-index | Public material pricing |
| Join | /join | Multi-role signup hub |
| Login | /login | Auth entry point |
| Chat | /chat | Masked messaging (identity protection) |
| Inspect | /inspect | Site verification |
| Hardware POS | /hardware-pos | Renovation supply counter |
| Vendor Dashboard | /vendor/dashboard | Supplier portal |
| Worker Tasks | /worker/tasks | Field worker view |
| Client Dashboard | /client-dashboard | Homeowner project tracker |

## What's Next (Roadmap)

### Phase 1 — Foundation (✅ DONE)
- [x] Quote builder with 113 materials
- [x] Lead pipeline (Follow Up)
- [x] Dispatch system (20 trades)
- [x] Design studio (Sequence)
- [x] Ledger & payments
- [x] Landing page rebuild
- [x] IRS reputation ecosystem
- [x] Hub with all engines
- [x] Deploy to Vercel (2 projects)
- [x] "For Builders" nav link on homeowner site

### Phase 2 — Backend & Auth
- [ ] Supabase/Firebase backend for real data persistence
- [ ] User authentication (ID firms, contractors, homeowners)
- [ ] Role-based access (admin sees IRS, users don't)
- [ ] Real-time chat with identity masking

### Phase 3 — Malaysia Market
- [ ] MYR pricing for all 113 materials
- [ ] CIDB/SSM verification (MY equivalent of BCA)
- [ ] RM exchange rate integration
- [ ] MY-specific trades and regulations

### Phase 4 — Revenue
- [ ] Stripe/payment integration
- [ ] Tiered commission model (2% → 0.5%)
- [ ] Escrow system for milestone payments
- [ ] Subscription for premium features

### Phase 5 — Scale
- [ ] Mobile app (PWA → native)
- [ ] Group Buy engine for BTO/TOP
- [ ] AI-powered designer matching
- [ ] Contractor recommendation engine (IRS-driven)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript/TSX
- **Styling**: Inline styles + CSS modules
- **Animation**: Framer Motion
- **Deployment**: Vercel
- **Domain**: roofplatform.com
- **Version Control**: GitHub (tsybjornie/lead-portal)

## Key Design Decisions

1. **Two separate Vercel projects** — homeowner site and builder platform are independent. Different audiences, different risk profiles
2. **IRS is invisible** — nobody outside admin sees reputation scores, flags, or algorithms
3. **SG first, MY second** — same codebase, market toggle, but SG is the priority market
4. **Commission model** — free to use, pay when you close (starts at 2%)
5. **Identity masking** — chat protects personal details until project is contracted
