// Renovation Costs, Margins, Market Pricing

// ── RENOVATION OVERHEAD COSTS (SG Market — What clients DON'T see) ──
// This is the "math" that proves designers aren't overcharging.
// Total project cost = Materials + Hardware + Labor + Transport + Overhead + Margin

export interface OverheadCostItem {
    category: string;
    item: string;
    costRange: string;
    unit: string;
    frequency: string;
    description: string;
    notes: string;
}

export const RENOVATION_OVERHEAD_COSTS: OverheadCostItem[] = [
    // Transport & Logistics
    { category: 'Transport', item: 'Material Delivery (Lorry 10ft)', costRange: '$80 — $150', unit: 'per trip', frequency: 'Multiple trips per project', description: 'Lorry delivery from supplier warehouse (Defu Lane, Kaki Bukit, Sungei Kadut) to site. 10ft open truck for plywood, tiles, etc.', notes: 'Minimum 3-5 deliveries per HDB reno. Some suppliers include delivery above $500 order. JB material delivery: $200-400/trip (customs, bridge toll, petrol)' },
    { category: 'Transport', item: 'Material Delivery (Lorry 14ft/24ft)', costRange: '$150 — $350', unit: 'per trip', frequency: '1-2 per project', description: 'Large lorry for bulk items: full kitchen cabinet set, wardrobes, countertops, large tile orders', notes: 'Needed when full kitchen arrives from workshop as assembled units. Crane/tailgate surcharge: +$50-100 for high-floor delivery without lift' },
    { category: 'Transport', item: 'Disposal / Debris Removal', costRange: '$300 — $800', unit: 'per project', frequency: '2-4 trips', description: 'Hacking debris, old cabinets, construction waste. Open-top bin or lorry trips to Tuas disposal facility', notes: 'NEA disposal fee included. HDB requires registered waste collector. Some contractors "hide" this cost — it\'s mandatory. Budget $500+ for full reno' },
    { category: 'Transport', item: 'Worker Transport (Daily)', costRange: '$20 — $40', unit: 'per day', frequency: 'Every workday', description: 'Van/transport for 2-4 workers from dormitory/pickup to site', notes: 'Often absorbed by contractor but factored into overall labor rate. Workers in SG typically need transport from Tuas/Woodlands dorms' },
    // Workshop & Rental
    { category: 'Workshop', item: 'Carpentry Workshop Rental', costRange: '$3,000 — $8,000', unit: 'per month', frequency: 'Ongoing', description: 'Industrial workshop space for cabinet fabrication (100-300 sqm). Includes CNC, panel saw, edge bander, spray booth', notes: 'SG workshop rents in Defu Lane, Woodlands, Ubi = $3-5/sqft. This is why SG carpentry costs more than JB/MY — workshop space alone is $3K-8K/month overhead' },
    { category: 'Workshop', item: 'JB/MY Workshop Rental', costRange: 'RM 2,000 — RM 5,000', unit: 'per month', frequency: 'Ongoing', description: 'Malaysian workshop space (200-500 sqm). Significantly cheaper than SG. Many SG firms fabricate in JB', notes: '60-70% cheaper than SG workshop. This is WHY JB-made cabinets are cheaper — not because quality is worse, but workshop rent is 1/3 the price' },
    { category: 'Workshop', item: 'CNC Machine Amortization', costRange: '$500 — $1,500', unit: 'per month', frequency: 'Ongoing', description: 'CNC router ($30K-80K), panel saw ($15K-30K), edge bander ($20K-50K) — monthly amortization over 5-7 years', notes: 'Quality workshops invest $100K-200K in machines. This overhead is spread across all projects. A workshop doing 10 kitchens/month: ~$100-150/kitchen for machine cost alone' },
    // Labor
    { category: 'Labor', item: 'Carpenter (Skilled)', costRange: '$120 — $200', unit: 'per day', frequency: 'Per workday', description: 'Skilled carpenter — read drawings, operate machines, install cabinets, problem-solve on site. SG work permit holder', notes: 'SG minimum: $120/day for experienced carpenter. A 4-room HDB kitchen takes 3-5 days carpentry on-site. Labor alone for kitchen: $360-1,000' },
    { category: 'Labor', item: 'Carpenter Helper', costRange: '$60 — $90', unit: 'per day', frequency: 'Per workday', description: 'General worker — carry materials, hold panels, clean site. Often paired with skilled carpenter', notes: 'Usually 1 helper per carpenter. Required for heavy lifting (18mm plywood sheets weigh 30-40kg). MOM work levy: $300-700/month/worker adds to cost' },
    { category: 'Labor', item: 'Spray Painter (2K PU)', costRange: '$150 — $250', unit: 'per day', frequency: '2-5 days per project', description: 'Specialized spray painter for 2K polyurethane cabinet doors. Needs spray booth, PPE, ventilation', notes: 'Spray painting is a SKILL — not every carpenter can do it well. 2K PU requires 6-8 coats, sanding between coats. A kitchen\'s worth of doors = 2-3 days spraying' },
    { category: 'Labor', item: 'Electrician', costRange: '$120 — $200', unit: 'per day/per point', frequency: '1-3 days', description: 'Licensed EMA electrician for power points, lighting circuits, DB box. SG requires licensed electrician', notes: 'Each new power point: $80-150. Moving a point: $100-180. New lighting circuit: $150-250. HDB MUST use licensed contractor for electrical works' },
    { category: 'Labor', item: 'Plumber', costRange: '$120 — $250', unit: 'per day/per point', frequency: '1-3 days', description: 'Licensed PUB plumber for water supply, drainage, trap installation. SG requires licensed plumber', notes: 'Moving kitchen sink point: $300-600 (involves floor hacking). New water point: $150-250. Bathtub to shower conversion: $500-1,200. All plumbing changes need PUB-licensed worker' },
    { category: 'Labor', item: 'Tiler', costRange: '$8 — $18', unit: 'per sqft', frequency: '3-7 days', description: 'Floor/wall tiling including waterproofing membrane, adhesive, grouting. Rate depends on tile size and pattern', notes: 'Small tiles (mosaic/subway) cost MORE to install: $12-18/sqft. Large format (600×1200mm): $10-15/sqft. Herringbone/pattern: +30% labor. Waterproofing: $3-5/sqft additional' },
    // Overhead & Insurance
    { category: 'Overhead', item: 'BCA / HDB Renovation Permit', costRange: '$0 (HDB) / $100-500', unit: 'per project', frequency: 'Each project', description: 'HDB renovation application (free but requires compliance). BCA permit for structural works in private property', notes: 'HDB: Free but MUST apply before starting. Processing: 3-5 working days. No permit = fine + forced restoration. Private: BCA for structural changes only' },
    { category: 'Overhead', item: 'Contractor All-Risk Insurance', costRange: '$300 — $800', unit: 'per project', frequency: 'Each project', description: 'Insurance covering property damage, worker injury, third-party liability during renovation', notes: 'REQUIRED in SG. Covers: fire risk, worker injury, damage to neighbor\'s unit. Without this = massive liability. Some condos require $1M coverage minimum' },
    { category: 'Overhead', item: 'MOM Work Permit Levy', costRange: '$300 — $700', unit: 'per worker/month', frequency: 'Monthly', description: 'Singapore MOM foreign worker levy for each work permit holder (carpenter, helper, etc.)', notes: 'A workshop with 5 foreign workers pays $1,500-3,500/MONTH in levies alone. This is a pure SG overhead that doesn\'t exist in MY/JB. Major cost driver' },
    { category: 'Overhead', item: 'Condo/Management Deposit', costRange: '$1,000 — $5,000', unit: 'per project', frequency: 'Refundable', description: 'Refundable deposit to condo management before renovation starts. Covers potential damage to common areas', notes: 'Ranges from $1K (small condo) to $5K (luxury). Refundable after completion + inspection. Ties up contractor\'s cash flow across multiple projects' },
    // Design Fees (what clients are actually paying for)
    { category: 'Design', item: 'Interior Design Fee', costRange: '$3,000 — $15,000', unit: 'per project', frequency: 'One-time', description: 'Conceptual design, 3D renders, material selection, space planning, contractor coordination, site supervision', notes: 'SG ID firms charge 10-15% of project value OR flat fee. For $50K reno: $5K-7.5K design fee. This covers: 2-3 site visits, 5-10 design revisions, 10-20 hours supervision, full material spec sheet. Designers do NOT make money on material markup — they make money HERE' },
    { category: 'Design', item: 'Drafting / 3D Rendering', costRange: '$500 — $3,000', unit: 'per project', frequency: 'One-time', description: 'Technical drawings for carpentry (CNC-ready), plumbing layout, electrical layout. 3D photorealistic renders for client approval', notes: 'AutoCAD/SketchUp drafting: 10-30 hours per project. 3D renders: $100-300 per view. A 4-room HDB needs ~15 drawings. This is where junior designers/drafters add value' },
];

// ── SG RENOVATION MARKET PRICE RANGES (What clients typically pay) ──
export interface RenovationPriceRange {
    propertyType: string;
    scope: string;
    budgetRange: string;
    standardRange: string;
    premiumRange: string;
    luxuryRange: string;
    timeline: string;
    notes: string;
}

export const SG_RENOVATION_PRICES: RenovationPriceRange[] = [
    { propertyType: 'HDB 3-Room (65 sqm)', scope: 'Full renovation', budgetRange: '$18,000 — $28,000', standardRange: '$28,000 — $45,000', premiumRange: '$45,000 — $70,000', luxuryRange: '$70,000 — $100,000+', timeline: '6-10 weeks', notes: 'Budget = repaint + laminate + basic kitchen. Standard = hacking + new layout + good carpentry. Premium = full Blum, spray paint, feature walls, designer lighting' },
    { propertyType: 'HDB 4-Room (90 sqm)', scope: 'Full renovation', budgetRange: '$25,000 — $38,000', standardRange: '$38,000 — $58,000', premiumRange: '$58,000 — $90,000', luxuryRange: '$90,000 — $130,000+', timeline: '8-12 weeks', notes: 'THE most common SG renovation. 4-room HDB is the benchmark. "$40K reno" is the SG median. Below $35K = cutting corners somewhere' },
    { propertyType: 'HDB 5-Room / EA (110 sqm)', scope: 'Full renovation', budgetRange: '$30,000 — $45,000', standardRange: '$45,000 — $70,000', premiumRange: '$70,000 — $110,000', luxuryRange: '$110,000 — $160,000+', timeline: '8-14 weeks', notes: 'Larger space = more carpentry. Extra bedroom often converted to study/walk-in. Premium tier includes built-in wardrobes for all rooms' },
    { propertyType: 'BTO (New HDB)', scope: 'First-time renovation', budgetRange: '$20,000 — $35,000', standardRange: '$35,000 — $55,000', premiumRange: '$55,000 — $85,000', luxuryRange: '$85,000 — $120,000+', timeline: '6-10 weeks', notes: 'BTO = no hacking needed (save $3-8K). But flooring/tiling still needed. Most BTO owners budget $40-60K. Couples often combine BTO grant savings with reno' },
    { propertyType: 'Condo (80-120 sqm)', scope: 'Full renovation', budgetRange: '$35,000 — $55,000', standardRange: '$55,000 — $85,000', premiumRange: '$85,000 — $140,000', luxuryRange: '$140,000 — $250,000+', timeline: '10-16 weeks', notes: 'Condo reno costs 20-40% more than HDB: management deposits, stricter rules, often more detailed finishes. Permit timelines slow things down. Material delivery restricted to certain hours' },
    { propertyType: 'Landed (Terrace/Semi-D)', scope: 'Full renovation (interior)', budgetRange: '$60,000 — $100,000', standardRange: '$100,000 — $180,000', premiumRange: '$180,000 — $350,000', luxuryRange: '$350,000 — $800,000+', timeline: '16-30 weeks', notes: 'Landed = multiple floors, outdoor areas, possibly A&A (additions & alterations). BCA structural permit needed for A&A. Premium includes marble, custom joinery, smart home, landscaping' },
    { propertyType: 'Kitchen Only', scope: 'Kitchen renovation', budgetRange: '$5,000 — $10,000', standardRange: '$10,000 — $20,000', premiumRange: '$20,000 — $35,000', luxuryRange: '$35,000 — $60,000+', timeline: '2-4 weeks', notes: 'Most common standalone reno. Budget = reface doors + new countertop. Standard = new carcass + countertop + backsplash. Premium = full Blum + stone countertop + feature lighting' },
    { propertyType: 'Bathroom Only', scope: 'Bathroom renovation', budgetRange: '$4,000 — $8,000', standardRange: '$8,000 — $15,000', premiumRange: '$15,000 — $25,000', luxuryRange: '$25,000 — $50,000+', timeline: '2-3 weeks', notes: 'Must include waterproofing ($3-5/sqft). Budget = overlay tiles. Standard = hack + retile + new fittings. Premium = rain shower, freestanding tub, heated towel rail, niche lighting' },
];

// ══════════════════════════════════════════════════════════════
// DESIGNER MARGIN CALCULATOR
// The "receipts, not feelings" transparency tool.
// Shows cost vs client price vs margin for every line item.
// When clients kaopeh, show them THIS.
// ══════════════════════════════════════════════════════════════

export interface MarginLineItem {
    category: string;
    item: string;
    costPrice: string; // What designer/contractor pays
    clientPrice: string; // What client sees on quotation
    markupPercent: string; // Typical markup
    marginDollar: string; // Dollar margin per unit
    justification: string; // Why this markup is fair
}

export interface ProjectCostBreakdown {
    projectType: string;
    totalClientPrice: string;
    lineItems: { item: string; costPrice: number; clientPrice: number; markupPercent: number }[];
    totalCost: number;
    totalMargin: number;
    marginPercent: number;
    fixedOverheads: string;
    netProfitEstimate: string;
    reality: string;
}

// ── LINE ITEM MARGINS (What designers actually make per item) ──
export const MARGIN_LINE_ITEMS: MarginLineItem[] = [
    // Materials
    { category: 'Materials', item: 'Plywood 18mm E1 Meranti (per sheet)', costPrice: '$42', clientPrice: '$52 — $58', markupPercent: '24 — 38%', marginDollar: '$10 — $16', justification: 'Covers: sourcing time, supplier relationship, quality inspection (rejecting warped/wet sheets), wastage allowance (10-15% cut-off waste is REAL), storage at workshop, and the risk of buying 50 sheets upfront for YOUR project' },
    { category: 'Materials', item: 'Plywood 18mm ENF (per sheet)', costPrice: '$60', clientPrice: '$78 — $90', markupPercent: '30 — 50%', marginDollar: '$18 — $30', justification: 'Premium product = higher margin. Requires sourcing from certified suppliers, verifying ENF test certs (some fakes exist), and the knowledge to RECOMMEND the right grade for children\'s rooms' },
    { category: 'Materials', item: 'Quartz Countertop (per ft run)', costPrice: '$28 — $45/ft', clientPrice: '$45 — $80/ft', markupPercent: '40 — 60%', marginDollar: '$17 — $35/ft', justification: 'Covers: templating visit, factory cutting to exact dimensions, polishing edges, transport (heavy + fragile), installation, and CRITICAL: warranty if countertop cracks during install (happens 5% of time — who absorbs that cost?)' },
    { category: 'Materials', item: 'Tiles (per sqft, mid-range)', costPrice: '$3 — $6/sqft', clientPrice: '$5 — $10/sqft', markupPercent: '40 — 70%', marginDollar: '$2 — $4/sqft', justification: 'Includes: showroom time helping client choose (2-3 visits), ordering correct quantity + 10% spare, checking lot numbers match, arranging delivery, handling breakage/returns. Also storing leftover tiles for future repairs' },
    { category: 'Materials', item: 'Laminate Sheet (Formica/Lamitak)', costPrice: '$35 — $55/sheet', clientPrice: '$48 — $75/sheet', markupPercent: '30 — 40%', marginDollar: '$13 — $20/sheet', justification: 'Covers: maintaining laminate sample library (100+ colors) for clients to see, ordering from distributor, cutting waste, and the expertise to know which laminates are durable vs which will peel in SG humidity' },
    // Hardware
    { category: 'Hardware', item: 'Blum TANDEMBOX antaro (per drawer)', costPrice: '$22 — $30', clientPrice: '$35 — $50', markupPercent: '40 — 65%', marginDollar: '$13 — $20', justification: 'Authorized dealer pricing. Includes: stocking inventory, correct sizing (different depths), installation expertise, and LIFETIME WARRANTY processing if anything fails. You\'re not paying for a drawer slide — you\'re paying for a SYSTEM' },
    { category: 'Hardware', item: 'Blum CLIP top Hinge (per pair)', costPrice: '$3.50 — $5', clientPrice: '$6 — $10', markupPercent: '50 — 100%', marginDollar: '$2.50 — $5', justification: 'Small item, high markup % but LOW absolute margin. A kitchen has 20-30 hinges = $50-150 total hinge margin. Covers: stocking 4+ types, proper 3-way adjustment during install, warranty claims' },
    { category: 'Hardware', item: 'Blum AVENTOS HF Lift (per unit)', costPrice: '$55 — $75', clientPrice: '$80 — $130', markupPercent: '35 — 55%', marginDollar: '$25 — $55', justification: 'Specialty mechanism requiring precise installation. Wrong spring strength = door too heavy or slams up. Designer needs to calculate door weight × height to order correct spring. Installation takes 30-45min per unit' },
    { category: 'Hardware', item: 'Häfele Pull-out Basket/Organizer', costPrice: '$40 — $120', clientPrice: '$65 — $200', markupPercent: '50 — 65%', marginDollar: '$25 — $80', justification: 'Client sees a basket. Designer sees: measuring cabinet width to nearest mm, ordering from catalog (500+ options), checking fitment, installing rails, adjusting height. Returns/exchanges on wrong sizes are common' },
    // Labor
    { category: 'Labor', item: 'Carpentry (per day, site install)', costPrice: '$120 — $160', clientPrice: '$180 — $280', markupPercent: '40 — 75%', marginDollar: '$60 — $120', justification: 'Contractor margin covers: finding reliable workers, MOM levy ($300-700/worker/month), CPF for local workers, transport, tools, supervision. If worker doesn\'t show up — contractor still has to deliver. That RISK is the markup' },
    { category: 'Labor', item: 'Hacking Works (per sqft)', costPrice: '$3 — $5/sqft', clientPrice: '$5 — $8/sqft', markupPercent: '50 — 60%', marginDollar: '$2 — $3/sqft', justification: 'Dirty, dangerous, physical work. Includes: safety barriers, dust protection for existing furniture, debris disposal, and the risk of discovering hidden pipes/wires (who pays for THAT rework?)' },
    { category: 'Labor', item: 'Electrical Point (per new point)', costPrice: '$50 — $80', clientPrice: '$80 — $150', markupPercent: '50 — 90%', marginDollar: '$30 — $70', justification: 'Licensed EMA electrician mandatory in SG. Licensing costs $2K+/year. Insurance costs $500+/year. One wrong wire = fire hazard. Margin covers: liability, licensing overhead, and the KNOWLEDGE of where to route cables safely' },
    { category: 'Labor', item: 'Plumbing Point (per new point)', costPrice: '$80 — $150', clientPrice: '$150 — $280', markupPercent: '60 — 90%', marginDollar: '$70 — $130', justification: 'PUB-licensed plumber mandatory. Moving a water point involves: floor hacking, new pipe routing, pressure testing, waterproofing repair. If it leaks after handover = contractor\'s problem (and cost). HIGH margin = HIGH risk' },
    // Design
    { category: 'Design', item: 'Design Fee (4-room HDB)', costPrice: '$1,500 — $3,000 (designer salary allocation)', clientPrice: '$3,000 — $8,000', markupPercent: '100 — 170%', marginDollar: '$1,500 — $5,000', justification: 'Looks like high markup but includes: 20-40 hours of design work, 2-5 site visits, 5-15 revisions, material library maintenance, software licenses (AutoCAD $2K/yr, SketchUp $300/yr, 3D render $500/yr), CPF, office rent. A designer doing 2 projects/month = $6-16K revenue to cover ALL of this' },
    { category: 'Design', item: '3D Rendering (per view)', costPrice: '$50 — $100', clientPrice: '$100 — $300', markupPercent: '100 — 200%', marginDollar: '$50 — $200', justification: 'Each 3D render takes 2-4 hours: modeling, texturing, lighting, rendering, revisions. Software costs $500-2000/year. Hardware (GPU) costs $2-5K. The render is what SELLS the project to the client — it\'s the visualization of their future home' },
];

// ── COMPLETE PROJECT COST BREAKDOWN (The "No More Kaopeh" Example) ──
// Real-world 4-room HDB standard renovation breakdown
export const PROJECT_COST_EXAMPLE: ProjectCostBreakdown = {
    projectType: 'HDB 4-Room Standard Renovation',
    totalClientPrice: '$45,000',
    lineItems: [
        // Carpentry
        { item: 'Kitchen cabinets (L-shaped, 4.5m)', costPrice: 3600, clientPrice: 5400, markupPercent: 50 },
        { item: 'Kitchen countertop (quartz)', costPrice: 800, clientPrice: 1200, markupPercent: 50 },
        { item: 'Kitchen backsplash (subway tile)', costPrice: 400, clientPrice: 650, markupPercent: 63 },
        { item: 'Kitchen hardware (Blum full set)', costPrice: 900, clientPrice: 1350, markupPercent: 50 },
        { item: 'Master bedroom wardrobe (8ft)', costPrice: 2200, clientPrice: 3300, markupPercent: 50 },
        { item: 'Common room wardrobe (6ft)', costPrice: 1600, clientPrice: 2400, markupPercent: 50 },
        { item: 'Study room built-in desk + shelf', costPrice: 1200, clientPrice: 1800, markupPercent: 50 },
        { item: 'Shoe cabinet + feature wall', costPrice: 1000, clientPrice: 1500, markupPercent: 50 },
        { item: 'TV console + wall panel', costPrice: 800, clientPrice: 1200, markupPercent: 50 },
        // Wet works
        { item: 'Bathroom 1 renovation (hack + retile + fittings)', costPrice: 3500, clientPrice: 5500, markupPercent: 57 },
        { item: 'Bathroom 2 renovation (hack + retile + fittings)', costPrice: 3200, clientPrice: 5000, markupPercent: 56 },
        // Electrical & Plumbing
        { item: 'Electrical works (15 new points + rewiring)', costPrice: 1800, clientPrice: 2800, markupPercent: 56 },
        { item: 'Plumbing works (relocate kitchen sink + 2 bathrooms)', costPrice: 1200, clientPrice: 2000, markupPercent: 67 },
        // Painting
        { item: 'Full house painting (Nippon/Dulux)', costPrice: 1200, clientPrice: 1800, markupPercent: 50 },
        // Flooring
        { item: 'Vinyl flooring (living + 3 rooms, 60sqm)', costPrice: 1500, clientPrice: 2400, markupPercent: 60 },
        // Overhead (hidden costs absorbed)
        { item: 'Transport & delivery (5 trips)', costPrice: 600, clientPrice: 800, markupPercent: 33 },
        { item: 'Debris disposal (hacking waste)', costPrice: 500, clientPrice: 700, markupPercent: 40 },
        { item: 'Insurance + permit + deposit', costPrice: 800, clientPrice: 800, markupPercent: 0 },
        // Design
        { item: 'Design fee + 3D renders + site supervision', costPrice: 3000, clientPrice: 4500, markupPercent: 50 },
    ],
    totalCost: 29800,
    totalMargin: 15200,
    marginPercent: 34,
    fixedOverheads: 'From the $15,200 margin, deduct: Workshop rent allocation ($800), worker levies ($400), showroom/office rent ($600), software licenses ($200), accounting ($150), phone/transport ($200), CPF ($400), misc ($200) = $2,950 fixed overhead per project',
    netProfitEstimate: '$15,200 gross margin — $2,950 fixed overheads = $12,250 net profit on $45,000 project (27%). BUT: if doing 2 projects/month, that\'s $24,500/month for a firm with 2-3 staff. After salaries ($8-12K), rent ($3-5K), the business owner takes home $7-14K. For managing $90K+ in monthly project value, coordinating 10+ workers, and being on-call 7 days a week — that\'s FAIR.',
    reality: 'The 34% markup LOOKS high to clients. But after ALL overheads, the REAL profit is 15-20%. Compare to: property agent (2% commission on $1M = $20K for 1 week of work). Car dealer (10-15% on $150K = $15-22K). Restaurant (60-70% markup on food). Interior design markup of 30-40% with 8-12 weeks of work is one of the LOWEST margin professional services in Singapore.',
};

// ── INDUSTRY STANDARD MARKUPS (for designer reference) ──
export interface IndustryMarkup {
    industry: string;
    typicalMarkup: string;
    comparison: string;
}

export const INDUSTRY_MARKUP_COMPARISON: IndustryMarkup[] = [
    { industry: 'Interior Design / Renovation', typicalMarkup: '25 — 40%', comparison: 'Lowest margin professional service. 8-12 weeks per project. High coordination, high risk (rework, delays, defaults)' },
    { industry: 'Property Agent', typicalMarkup: '1 — 2% (of property value)', comparison: 'On a $1M property = $10-20K commission for ~1-4 weeks work. Lower effort per dollar earned' },
    { industry: 'Restaurant / F&B', typicalMarkup: '60 — 300%', comparison: 'Coffee costs $0.30 to make, sells for $5-7. Pasta costs $3, sells for $18-28. Accepted without question' },
    { industry: 'Car Dealer', typicalMarkup: '8 — 15%', comparison: 'On $150K car = $12-22K margin. Less project management than reno, shorter transaction cycle' },
    { industry: 'Fashion Retail', typicalMarkup: '100 — 400%', comparison: 'T-shirt costs $5 to make, sells for $30-80. Designer brands: $10 cost → $200+ retail. Nobody questions this' },
    { industry: 'Optician / Eyewear', typicalMarkup: '200 — 1000%', comparison: 'Frames cost $5-15, sell for $100-500. Lenses cost $5-20, sell for $50-300. The markup nobody complains about' },
    { industry: 'Wedding Industry', typicalMarkup: '50 — 200%', comparison: 'Wedding dinner costs hotel $30/pax, charges $150-300/pax. Photographer: 4 hours = $3-8K. Flowers: $500 cost = $2-5K. But "it\'s my special day" so nobody questions' },
    { industry: 'Dental', typicalMarkup: '200 — 500%', comparison: 'Crown costs $50-100 in materials/lab, charges $800-2000. Filling: $5 material = $100-300 charge. Expertise premium' },
    { industry: 'Legal Services', typicalMarkup: '300 — 800%', comparison: 'Junior lawyer costs firm $3-5K/month, bills at $300-600/hour. 10 hours work = $3-6K bill. "Professional service" premium' },
];

