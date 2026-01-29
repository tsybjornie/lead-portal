# RenoBuilders Lead Portal - Phase 1 MVP

A **match-first** renovation lead platform for Singapore that connects homeowners with qualified firms through structured intake and intelligent matching—without browsing, ratings, or payment handling.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
Copy the example environment file and update with your credentials:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your SMTP credentials for magic link emails.

### 3. Initialize Database
```bash
npm run db:setup
```

This creates:
- Database schema (6 tables)
- Admin user: `admin@renobuilders.sg`
- Test firm: `firm@test.com`

### 4. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

---

## 📁 Project Structure

```
lead_portal/
├── app/
│   ├── page.js                    # Homepage
│   ├── quiz/page.js               #  7-step homeowner quiz ⭐
│   ├── matches/page.js            # Match results display
│   ├── api/
│   │   ├── quiz/submit/route.js   # Quiz submission + matching
│   │   └── matches/[leadId]/route.js
│   └── layout.js
├── lib/
│   ├── db.js                      # Database & helpers
│   ├── auth.js                    # Magic link authentication
│   ├── email.js                   # Email notifications
│   └── matching.js                # Matching algorithm ⭐
├── scripts/
│   └── setup-db.js                # Database initialization
├── data.db                        # SQLite database
└── .env.local                     # Environment variables
```

---

## 🎯 Core Features

### ✅ Implemented (Phase 1a & 1b)

#### 1. Homeowner Quiz Intake
- **7-step progressive quiz:**
  1. Property type (HDB/Condo/Landed/Commercial)
  2. Renovation type (partial/full/A&A/fit-out)
  3. Budget range (mandatory, $30k-$200k+)
  4. Scope checklist (hacking, wet works, carpentry, etc.)
  5. Timeline (ASAP to planning)
  6. Working style (decision speed, communication, involvement)
  7. Contact info + expectations acknowledgment

#### 2. Matching Engine
- **Rule-based algorithm** with AI-ready scoring
- Filters firms by:
  - Capacity (seats × monthly limit)
  - High-touch opt-in (for complex/high-budget projects)
- Generates **2-4 matches** (no rankings shown)
- Internal match scoring (budget alignment, scope fit, response history)

#### 3. Database Schema
- **6 tables:** users, homeowners, firms, leads, lead_matches, signals
- **Constraints:** Lead expiry (7-14 days), firm capacity limits
- **Tracking:** Response times, complaint signals

#### 4. Core Infrastructure
- Magic link authentication (no passwords)
- Email notifications to firms
- Session management with JWT
- Environment configuration

---

## 🔐 User Flows

### Homeowner Journey
1. Land on homepage → Click "Start Your Match"
2. Complete 7-step quiz (~3-5 minutes)
3. Receive 2-4 firm matches immediately
4. Wait for firms to contact (they have 7-14 days)
5. Choose which firm(s) to work with (if any)

### Firm Journey *(Coming in Phase 1c)*
1. Receive email notification of new lead
2. Log into dashboard via magic link
3. View assigned leads in inbox
4. Accept or decline match
5. Contact homeowner if accepted

### Admin Journey *(Coming in Phase 1d)*
1. Log into admin dashboard
2. View all leads and matches
3. Manually reassign if needed
4. Generate invoices for firms
5. Track response times and signals

---

## 🎨 Design Principles

### Match-First (Non-Negotiable)
- ✅ No firm browsing or searching
- ✅ No public profiles or comparison
- ✅ No rankings (matches are unordered)
- ✅ 2-4 matches only, capped

### Company-Level Accountability
- ✅ Firm accounts (not individual contractors)
- ✅ Role declaration (ID vs MC)
- ✅ Seat-based capacity management

### No Guarantees
- ✅ Platform is introducer only
- ✅ No outcome guarantees
- ✅ No escrow or payment handling
- ✅ All AI scoring is internal/invisible

---

## 📊 Database Schema

### Users
- Authentication table (email + magic link tokens)
- Roles: `homeowner`, `firm`, `admin`

### Homeowners
- Contact details linked to users
- Lead history tracking

### Firms
- Company registration details
- Role: `ID` (Interior Designer) or `MC` (Main Contractor)
- Capacity: `seats` × `monthly_capacity` (e.g., 2 seats × 6 = 12 leads/month)
- Status: `active`, `paused`, `suspended`
- `opt_in_high_touch`: For projects >$150k or complex scope

### Leads
- Property type, renovation type, budget
- 7 scope flags (hacking, wet works, etc.)
- Working style preferences
- Status: `pending` → `matched` → `expired`/`closed`

### Lead Matches
- Links leads to 2-4 firms
- Match score (internal only)
- Expiry: 7-14 days from assignment
- Status: `assigned` → `accepted`/`declined`/`expired`

### Signals
- Tracks complaints, no-response, slow-response
- Used for future match quality improvements

---

## 🧮 Matching Algorithm

```javascript
function matchLeadToFirms(lead) {
  // 1. Get active firms
  // 2. Filter by capacity (current leads < seats × monthly_capacity)
  // 3. Check if high-touch (budget >$150k OR complex scope)
  //    → If yes, filter to opt_in_high_touch firms only
  // 4. Score each eligible firm (internal):
  //    - Budget alignment (30%)
  //    - Scope expertise (25%)
  //    - Response history (20%)
  //    - Working style fit (10%)
  //    - Complaint penalty (-15%)
  // 5. Select top 2-4 firms (random between 2-4)
  // 6. Return matches (scores hidden from users)
}
```

---

## 🚧 Still To Build (Phase 1c-1e)

### Phase 1c: Firm Account System
- [ ] Firm signup flow
- [ ] Magic link login
- [ ] Lead inbox dashboard
- [ ] Accept/decline functionality
- [ ] Capacity display

### Phase 1d: Admin Dashboard
- [ ] View all leads table
- [ ] Manual lead assignment
- [ ] Firm management (pause/suspend)
- [ ] Invoice generation (manual)
- [ ] PayNow reconciliation
- [ ] Response time analytics

### Phase 1e: Legal & Polish
- [ ] Trust & Transparency page
- [ ] Roles & Responsibilities page
- [ ] No Guarantees disclaimer
- [ ] Mobile optimization
- [ ] Full end-to-end testing

---

## 🧪 Testing Locally

### Test Homeowner Flow
1. Go to http://localhost:3000
2. Click "Start Your Match"
3. Complete quiz with test data
4. View matched firms

### Test Matching
The test firm (`firm@test.com`) will only match if:
- Budget is reasonable (has capacity)
- If budget >$150k, firm must have `opt_in_high_touch=1` (test firm has this)

### Check Database
```bash
# Install SQLite CLI if needed
npm install -g sqlite3

# Open database
sqlite3 data.db

# View tables
.tables

# Check leads
SELECT * FROM leads;

# Check matches
SELECT * FROM lead_matches;
```

---

## 🔧 Environment Variables

Required in `.env.local`:

```bash
# Database
DATABASE_URL=./data.db

# Email (for magic links)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
FROM_EMAIL=noreply@renobuilders.sg

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Session (change in production!)
SESSION_SECRET=your-random-32-char-secret

# Admin
ADMIN_EMAIL=admin@renobuilders.sg
```

### Gmail Setup (for development)
1. Enable 2FA on your Google account
2. Generate App Password: Google Account → Security → App Passwords
3. Use app password as `SMTP_PASS`

---

## 📝 Key Files to Edit

### Copy/Content
- `app/page.js` - Homepage copy
- `app/quiz/page.js` - Quiz questions and options
- `lib/matching.js` - Matching algorithm weights

### Styling
- `app/globals.css` - All global styles and colors

### Logic
- `lib/db.js` - Database helpers
- `lib/matching.js` - Match scoring
- `app/api/quiz/submit/route.js` - Quiz processing

---

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import repo in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Note:** SQLite database will reset on each deployment. For production, migrate to PostgreSQL/MySQL.

### Environment Setup (Production)
- Use proper SMTP service (SendGrid, AWS SES)
- Generate secure `SESSION_SECRET` (32+ characters)
- Set `NEXT_PUBLIC_APP_URL` to your domain

---

## ⚠️ Important Constraints

### What We DON'T Do
- ❌ No firm browsing or searching
- ❌ No public ratings or reviews
- ❌ No guarantees about outcomes
- ❌ No escrow or payment handling
- ❌ No unlimited lead delivery
- ❌ No AI explanations shown to users

### Business Rules
- Leads capped to 2-4 firms (no more, no less)
- Leads expire in 7-14 days
- Firms have monthly capacity limits
- High-touch projects require opt-in
- All payments handled manually (Phase 1)

---

## 📞 Support

For questions about the codebase:
1. Check this README
2. Review code comments in key files
3. Inspect database schema in `lib/db.js`

---

## 🎯 Next Steps

1. **Complete Phase 1c:** Build firm dashboard and lead management
2. **Complete Phase 1d:** Build admin controls and manual invoicing
3. **Complete Phase 1e:** Add legal pages and polish
4. **Test thoroughly:** End-to-end flows for all user types
5. **Deploy:** Push to Vercel and test in production

---

**Status: Phase 1b Complete ✅**  
Homeowner quiz flow and matching engine are functional. Ready to build firm and admin dashboards next.
