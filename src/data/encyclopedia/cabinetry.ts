// Cabinetry Construction Encyclopedia
// Plywood grades, glue types, assembly methods, hardware, and SG/MY pricing


// ── CABINETRY CONSTRUCTION ENCYCLOPEDIA ──
// Plywood grades, glue types, assembly methods, hardware, and SG/MY pricing

export interface PlywoodGrade {
    name: string;
    core: string;
    origin: string;
    region: string;
    glueType: string;
    glueAbbreviation: string;
    emissionGrade: string;
    emissionStandard: string;
    formaldehyde: 'zero' | 'low' | 'medium' | 'high';
    waterResistance: 'poor' | 'moderate' | 'good' | 'excellent';
    thickness: string;
    pricePerSheet: string;
    bestFor: string;
    notes: string;
}

export interface AssemblyMethod {
    name: string;
    category: string;
    costPerJoint: string;
    strength: number; // 1-5
    speed: 'slow' | 'medium' | 'fast';
    visible: boolean;
    disassemblable: boolean;
    description: string;
    process: string;
    bestFor: string;
    avoidFor: string;
}

export interface CabinetHardware {
    name: string;
    brand: string;
    country: string;
    category: string;
    priceRange: string;
    quality: number; // 1-5
    warranty: string;
    description: string;
    notes: string;
}

export interface CabinetTier {
    tier: string;
    label: string;
    carcassMaterial: string;
    carcassAssembly: string;
    doorMaterial: string;
    doorFinish: string;
    drawerSystem: string;
    hinges: string;
    pricePerLM: string;
    description: string;
}

// ── PLYWOOD ENCYCLOPEDIA (Comprehensive — grades, glues, emissions, pricing) ──
export const PLYWOOD_ENCYCLOPEDIA: PlywoodGrade[] = [
    { name: 'China Poplar (Budget)', core: 'Poplar veneer', origin: 'China (Shandong/Jiangsu)', region: ' China', glueType: 'Urea Formaldehyde', glueAbbreviation: 'UF', emissionGrade: 'E2', emissionStandard: '≤5.0 mg/L', formaldehyde: 'high', waterResistance: 'poor', thickness: '18mm (often under-sized at 17.2mm)', pricePerSheet: '$18 — $25/sheet', bestFor: ' Temporary structures only. Avoid for residential cabinetry', notes: 'Cheapest option. Strong chemical smell = off-gassing. Not recommended for SG/MY homes. Some vendors sell E2 as "standard" — always ask for emission cert' },
    { name: 'China Poplar (Standard)', core: 'Poplar veneer', origin: 'China (Shandong/Jiangsu)', region: ' China', glueType: 'Melamine Urea Formaldehyde', glueAbbreviation: 'MUF', emissionGrade: 'E1', emissionStandard: '≤1.5 mg/L (EN 13966)', formaldehyde: 'medium', waterResistance: 'moderate', thickness: '18mm', pricePerSheet: '$28 — $40/sheet', bestFor: 'Budget carcass (hidden inside cabinets). Kitchen carcass where doors cover everything', notes: 'Most common budget option in SG/MY. Acceptable for adult bedrooms with good ventilation. Smell dissipates in 2-4 weeks' },
    { name: 'Malaysian Meranti', core: 'Meranti/tropical hardwood veneer', origin: 'Malaysia (Sarawak/Sabah)', region: ' Malaysia', glueType: 'Melamine Urea Formaldehyde', glueAbbreviation: 'MUF', emissionGrade: 'E1', emissionStandard: '≤1.5 mg/L', formaldehyde: 'medium', waterResistance: 'moderate', thickness: '18mm (true 18mm)', pricePerSheet: '$40 — $55/sheet', bestFor: ' THE standard SG/MY renovation plywood. 80% of all carpentry uses this', notes: 'Stronger than poplar core. True 18mm thickness (China ply often undersized). Tropical hardwood core resists humidity better. The "safe default" choice' },
    { name: 'Malaysian Meranti (ENF)', core: 'Meranti hardwood veneer', origin: 'Malaysia', region: ' Malaysia', glueType: 'MDI (Methylene Diphenyl Diisocyanate)', glueAbbreviation: 'MDI', emissionGrade: 'ENF', emissionStandard: '≤0.025 mg/m³ (GB/T 39600)', formaldehyde: 'zero', waterResistance: 'excellent', thickness: '18mm', pricePerSheet: '$55 — $75/sheet', bestFor: 'Children\'s rooms, master bedrooms, homes with allergies/asthma. Premium residential choice', notes: 'Zero formaldehyde glue. No smell from day 1. Worth 30-50% premium for sleeping areas. Ask vendor for GB/T 39600 test cert — some fake ENF labels exist' },
    { name: 'Indonesian Falcata', core: 'Falcata/albasia veneer', origin: 'Indonesia (Java/Sumatra)', region: ' Indonesia', glueType: 'Melamine Urea Formaldehyde', glueAbbreviation: 'MUF', emissionGrade: 'E1', emissionStandard: '≤1.5 mg/L', formaldehyde: 'medium', waterResistance: 'moderate', thickness: '18mm', pricePerSheet: '$35 — $50/sheet', bestFor: 'Lightweight carcass, shelving, wardrobe carcass', notes: 'Lighter than meranti (easier for wall-hung cabinets). Fast-growing sustainable wood. Slightly softer than meranti — not ideal for heavy-load kitchen bases' },
    { name: 'Finnish Birch', core: '13+ layers Baltic birch veneer', origin: 'Finland/Russia/Baltic states', region: ' Finland', glueType: 'Phenol Formaldehyde', glueAbbreviation: 'PF', emissionGrade: 'E1', emissionStandard: '≤0.124 mg/m³', formaldehyde: 'low', waterResistance: 'excellent', thickness: '18mm (13 layers, void-free)', pricePerSheet: '$85 — $120/sheet', bestFor: 'Premium visible shelving, exposed plywood edges, furniture, CNC projects', notes: 'The "designer plywood." Beautiful layered birch edge when exposed. 13+ layers = no voids. Brands: UPM, Metsä. Popular with architects for exposed-edge aesthetic' },
    { name: 'Japanese Shin-ei', core: 'Japanese cedar/larch veneer', origin: 'Japan', region: ' Japan', glueType: 'EPI (Emulsion Polymer Isocyanate)', glueAbbreviation: 'EPI', emissionGrade: 'F (F4 Star)', emissionStandard: '≤0.3 mg/L (JIS A 1460)', formaldehyde: 'zero', waterResistance: 'good', thickness: '18mm', pricePerSheet: '$120 — $200/sheet', bestFor: 'Ultra-premium cabinetry, Japanese-inspired interiors, health-conscious clients', notes: 'F is Japan\'s strictest standard. EPI glue is formaldehyde-free. Used in Japanese hospitals and schools. The gold standard globally. Worth it for clients who ask "what\'s the absolute safest?"' },
    { name: 'Marine Plywood (Meranti)', core: 'Meranti hardwood, graded BS1088', origin: 'Malaysia/Indonesia', region: ' Malaysia', glueType: 'Phenol Formaldehyde', glueAbbreviation: 'PF', emissionGrade: 'Exterior', emissionStandard: 'N/A (PF cures fully)', formaldehyde: 'low', waterResistance: 'excellent', thickness: '18mm', pricePerSheet: '$60 — $90/sheet', bestFor: 'Bathroom vanities, outdoor cabinetry, kitchen sink area, laundry room', notes: 'MUST use for wet areas. PF glue is waterproof (dark brown glue line visible). BS1088 standard = no voids in core. Will NOT delaminate when exposed to water. Required for areas near water' },
];

// ── ASSEMBLY METHODS ──
export const ASSEMBLY_METHODS: AssemblyMethod[] = [
    { name: 'Staple/Nail Gun', category: 'Budget', costPerJoint: '$0.02', strength: 1, speed: 'fast', visible: true, disassemblable: false, description: 'Pneumatic staples or brad nails shot through panels', process: 'Align panels → pneumatic staple/nail gun → done. No glue, no pre-drilling', bestFor: 'Temporary installations, site hoardings', avoidFor: 'ALL permanent cabinetry. Staples loosen in SG/MY humidity' },
    { name: 'Cam Lock (Flat-Pack)', category: 'Knock-Down', costPerJoint: '$0.30 — $0.50', strength: 3, speed: 'fast', visible: true, disassemblable: true, description: 'Pre-drilled holes with cam bolt + wooden dowel. IKEA system', process: 'Factory pre-drills holes in 32mm system grid → insert cam bolt → insert dowel → turn cam 90° to lock', bestFor: 'Modular furniture, rental properties, IKEA-style systems', avoidFor: 'Heavy-use kitchens (cam holes widen over time, especially in particleboard)' },
    { name: 'Confirmat Screw + PVA Glue', category: 'Standard', costPerJoint: '$0.10 — $0.20', strength: 4, speed: 'fast', visible: true, disassemblable: false, description: 'Thick-threaded furniture screws (7×50mm) with PVA wood glue on joint faces. THE SG/MY standard', process: '1. Cut panels (CNC/panel saw) → 2. Edge band → 3. Pre-drill with confirmat jig (5mm pilot + 7mm countersink) → 4. Apply PVA glue → 5. Drive confirmat screw → 6. Cover with plastic cap/sticker', bestFor: ' 80% of all SG/MY residential cabinetry. Best value for money', avoidFor: 'Ultra-premium visible cabinetry (screw caps visible)' },
    { name: 'Dowel + Glue', category: 'European', costPerJoint: '$0.05 — $0.10', strength: 4, speed: 'medium', visible: false, disassemblable: false, description: 'Hardwood dowels (8mm beech) glued into precision-drilled holes. European factory standard', process: '1. CNC multi-spindle drill dowel holes (8mm, 32mm spacing) → 2. Insert pre-glued dowels (swell with moisture for tight fit) → 3. Apply PVA/PUR glue to faces → 4. Clamp → 5. No visible fasteners', bestFor: 'European-style kitchens, premium workshops that have CNC boring machines', avoidFor: 'Site carpentry without CNC (alignment is critical — hand-drilling dowels is risky)' },
    { name: 'Biscuit Joint (Lamello)', category: 'Premium', costPerJoint: '$0.15 — $0.30', strength: 5, speed: 'medium', visible: false, disassemblable: false, description: 'Compressed beech biscuits (#0/#10/#20) in biscuit-joiner-cut slots + glue. Biscuit swells with glue moisture → locks tight', process: '1. Mark joint positions → 2. Cut slots with biscuit joiner (Lamello) → 3. Apply PVA glue in slot + on face → 4. Insert biscuit → 5. Clamp until cured (30-60 min)', bestFor: 'Mitered joints (45° corners), wide panel edge joints, premium built-ins', avoidFor: 'Standard box construction (overkill — use confirmat or dowel instead)' },
    { name: 'Minifix / Rafix', category: 'Premium Knock-Down', costPerJoint: '$2 — $5', strength: 4, speed: 'medium', visible: true, disassemblable: true, description: 'Precision cam + bolt system from Häfele/Hettich. Can fully disassemble and reassemble without losing strength', process: '1. Drill 15mm Forstner hole for cam housing → 2. Drill connecting bolt hole → 3. Insert cam housing → 4. Thread connecting bolt → 5. Turn cam to lock', bestFor: 'Premium modular kitchens (Blum/Hettich system), furniture that may need to relocate', avoidFor: 'Budget projects (hardware cost is 10-50× more than confirmat)' },
    { name: 'Dado/Rabbet + Glue', category: 'Traditional Premium', costPerJoint: '$0.05 (glue only)', strength: 5, speed: 'slow', visible: false, disassemblable: false, description: 'Grooves (dado) or shelf slots (rabbet) routed into panels — mating panel slides into groove + glued. Maximum strength', process: '1. Route 6-9mm dado groove (table saw with dado blade or router) → 2. Dry-fit panel into groove → 3. Apply PVA/epoxy glue → 4. Slide panel in → 5. Clamp or pin-nail for alignment → 6. Clean squeeze-out', bestFor: 'Back panels (9mm ply in dado is strongest back), drawer boxes, premium bookcases', avoidFor: 'Projects without router/table saw access. Requires skilled carpentry' },
];

// ── CABINET HARDWARE ──
export const CABINET_HARDWARE: CabinetHardware[] = [
    // Drawer Systems
    { name: 'Roller Slide', brand: 'Various/No-brand', country: ' China', category: 'Drawer slide', priceRange: '$5 — $10/drawer', quality: 1, warranty: '1 year', description: 'Basic white roller slides. Noisy, no soft-close, partial extension only (75%). Will fail in 1-2 years under daily kitchen use', notes: ' AVOID for kitchens. Acceptable only for bedroom closet drawers with light use. The #1 indicator of "budget reno"' },
    { name: 'Ball Bearing Slide', brand: 'Various', country: ' China / Taiwan', category: 'Drawer slide', priceRange: '$10 — $20/drawer', quality: 3, warranty: '3 years', description: 'Steel ball bearing slides. Smooth, full extension, some models include soft-close. The "mid-range default"', notes: 'Acceptable for most residential use. Full extension lets you see entire drawer. Brands: King Slide (TW), DTC (CN), FGV (IT budget)' },
    { name: 'Blum MOVENTO', brand: 'Blum', country: ' Austria', category: 'Drawer slide (concealed)', priceRange: '$25 — $35/drawer', quality: 4, warranty: 'Lifetime', description: 'Concealed undermount runner with BLUMOTION soft-close. Invisible from outside. TIP-ON option (push-to-open for handleless kitchens)', notes: 'Entry-level Blum quality. Concealed = cleaner look. Lifetime warranty means Blum replaces free if it fails. The "sweet spot" for quality vs cost' },
    { name: 'Blum TANDEMBOX antaro', brand: 'Blum', country: ' Austria', category: 'Drawer system (complete)', priceRange: '$35 — $50/drawer', quality: 5, warranty: 'Lifetime', description: ' Complete drawer system: steel sides + concealed runners + BLUMOTION soft-close + SERVO-DRIVE (optional electric open). 40-65kg capacity', notes: 'THE gold standard for SG/MY kitchen drawers. Every premium ID firm specifies this. Steel sides = no drawer box carpentry needed. Just cut plywood base + back' },
    { name: 'Blum LEGRABOX', brand: 'Blum', country: ' Austria', category: 'Drawer system (slim)', priceRange: '$50 — $80/drawer', quality: 5, warranty: 'Lifetime', description: 'Thinnest drawer side walls (12.8mm). Maximum interior space. Available in silk white, orion grey, terra black, stainless steel. Premium aesthetic', notes: 'For clients who want the thinnest, most premium drawer aesthetic. Internal space is 15% more than TANDEMBOX. The "Rolls Royce" of drawer systems' },
    { name: 'Hettich ArciTech', brand: 'Hettich', country: ' Germany', category: 'Drawer system (complete)', priceRange: '$30 — $45/drawer', quality: 5, warranty: 'Lifetime', description: 'Hettich\'s answer to Blum TANDEMBOX. Steel sides, Push to Open Silent option, 40-80kg capacity. Same quality, sometimes slightly cheaper', notes: 'Premium alternative to Blum. Some SG/MY carpentry shops prefer Hettich pricing. Both are equally excellent — brand preference only' },
    { name: 'Grass Nova Pro Scala', brand: 'Grass', country: ' Austria', category: 'Drawer system', priceRange: '$25 — $40/drawer', quality: 4, warranty: 'Lifetime', description: 'Austrian drawer system with integrated Tipmatic push-to-open. Slimline steel sides. Good mid-premium option', notes: 'Third major European drawer brand. Less common in SG/MY than Blum/Hettich but equally good quality. Usually slightly cheaper' },
    // Hinges
    { name: 'No-Brand Hydraulic Hinge', brand: 'Various/No-brand', country: ' China', category: 'Cabinet hinge', priceRange: '$1 — $3/pair', quality: 1, warranty: '6-12 months', description: 'Budget soft-close hinges. Initial soft-close fades in 6-12 months → doors start slamming. Pot screws strip easily', notes: ' The #1 source of "my kitchen doors are slamming" complaints 1 year after reno. Save $2/pair now, pay for replacement + labor later' },
    { name: 'Blum CLIP top BLUMOTION', brand: 'Blum', country: ' Austria', category: 'Cabinet hinge', priceRange: '$5 — $8/pair', quality: 5, warranty: 'Lifetime (200,000 cycles tested)', description: ' Industry standard concealed hinge. Integrated BLUMOTION soft-close. Tool-free CLIP mounting (click on, click off). 110°/155° opening', notes: 'THE hinge. Every premium kitchen uses this. Tool-free mounting means doors can be removed for cleaning without screwdriver. Lifetime warranty. $3 more than budget = decades of difference' },
    { name: 'Hettich Sensys', brand: 'Hettich', country: ' Germany', category: 'Cabinet hinge', priceRange: '$4 — $7/pair', quality: 5, warranty: 'Lifetime (200,000 cycles)', description: 'Hettich equivalent of Blum CLIP top. Integrated Silent System soft-close. TIP-ON option for handleless. Zero-protrusion option', notes: 'Equal to Blum in every way. Some carpenters prefer Sensys because of easier 3-way adjustment (horizontal, vertical, depth)' },
    { name: 'Salice C2 Silentia', brand: 'Salice', country: ' Italy', category: 'Cabinet hinge', priceRange: '$3 — $5/pair', quality: 4, warranty: '10 years', description: 'Italian-made soft-close hinge. Good quality at lower price point than Blum/Hettich. Silentia = integrated damper', notes: 'Good budget-premium option. Italian engineering without Blum pricing. Popular in SG/MY among cost-conscious quality workshops' },
    // Fittings
    { name: 'Häfele Loox LED System', brand: 'Häfele', country: ' Germany', category: 'Cabinet lighting', priceRange: '$20 — $100/cabinet', quality: 5, warranty: '5 years', description: 'Plug-and-play LED strip/puck system for cabinet interiors. Warm white 3000K. Door-activated switch. Dimmable', notes: 'Under-cabinet and in-cabinet lighting is the #1 "wow factor" upgrade clients notice. Loox system makes it easy — no electrician needed, 12V/24V safe' },
    { name: 'Blum SERVO-DRIVE', brand: 'Blum', country: ' Austria', category: 'Electric opener', priceRange: '$80 — $150/unit', quality: 5, warranty: 'Lifetime', description: 'Electric push-to-open system for handleless drawers/doors. Touch front panel → drawer opens automatically. Works with TANDEMBOX/LEGRABOX/AVENTOS', notes: 'The "luxury kitchen" detail. Handleless design = completely flush fronts → contemporary minimal aesthetic. Battery or mains powered' },
    { name: 'Blum AVENTOS Lift System', brand: 'Blum', country: ' Austria', category: 'Wall cabinet lift', priceRange: '$40 — $120/unit', quality: 5, warranty: 'Lifetime', description: 'Wall cabinet lift-up mechanisms. HF (bi-fold), HL (parallel), HK-XS (small), HS (up/over). Replaces swing-out doors on wall cabinets', notes: 'AVENTOS HF (bi-fold) is the most popular in SG/MY kitchens — door folds up instead of swinging out. No head-bumping. Essential for small kitchens' },
];

// ── COMPLETE CABINET TIER PRICING (SG/MY Market, per linear meter) ──
export const CABINET_TIERS: CabinetTier[] = [
    { tier: 'budget', label: ' Budget', carcassMaterial: 'China E2 poplar ply', carcassAssembly: 'Staples/nail gun', doorMaterial: 'Melamine-faced chipboard', doorFinish: 'Melamine wrap', drawerSystem: 'Roller slides', hinges: 'No-brand hydraulic', pricePerLM: '$200 — $350/LM', description: 'The "$25K HDB package" tier. Maximum cost cutting at every step. Will look acceptable for 2-3 years, then drawers fail, doors sag, chemical smell lingers. Common in mass-market reno packages' },
    { tier: 'standard', label: ' Standard', carcassMaterial: 'Malaysian E1 meranti ply', carcassAssembly: 'Confirmat screws + PVA glue', doorMaterial: 'Laminate (Formica/Lamitak) on plywood', doorFinish: 'High-pressure laminate', drawerSystem: 'Ball bearing slides', hinges: 'Mixed brand (DTC/King Slide)', pricePerLM: '$400 — $600/LM', description: 'The "responsible standard" tier. Solid E1 meranti plywood, proper assembly, decent hardware. This is where most SG/MY renovations should start. Good for 8-10+ years' },
    { tier: 'good', label: ' Good', carcassMaterial: 'Malaysian E1 meranti ply', carcassAssembly: 'Dowel + PVA glue (or confirmat)', doorMaterial: 'MDF spray-painted or timber veneer on ply', doorFinish: '2K PU spray paint or veneer + clear coat', drawerSystem: 'Blum TANDEMBOX antaro', hinges: 'Blum CLIP top BLUMOTION', pricePerLM: '$600 — $900/LM', description: ' The "worth it" tier. Full Blum hardware = lifetime warranty on all moving parts. Spray-painted doors look premium. This is the quality leap most clients notice immediately' },
    { tier: 'premium', label: ' Premium', carcassMaterial: 'Malaysian ENF meranti (MDI glue)', carcassAssembly: 'Dowel + PUR glue', doorMaterial: 'Premium veneer (walnut/oak) on MDF or solid timber', doorFinish: '2K PU spray paint (8+ coats) or natural veneer + matte lacquer', drawerSystem: 'Blum LEGRABOX', hinges: 'Blum CLIP top BLUMOTION + SERVO-DRIVE', pricePerLM: '$900 — $1,400/LM', description: ' Zero-formaldehyde carcass, premium finishes, electric push-to-open for handleless design. Häfele LED lighting inside. This is ID-firm-specified quality — what design magazines photograph' },
    { tier: 'luxury', label: ' Luxury', carcassMaterial: 'Finnish birch or Japanese F ply', carcassAssembly: 'Dado/rabbet joinery + epoxy', doorMaterial: 'Solid timber or stone/Fenix/Dekton panels', doorFinish: 'Hand-finished oil/lacquer or engineered stone face', drawerSystem: 'Blum LEGRABOX + SERVO-DRIVE (electric)', hinges: 'Blum + full Häfele fittings', pricePerLM: '$1,400 — $2,500+/LM', description: 'Bespoke joinery-level. European import-grade materials, traditional woodworking joints, solid timber or stone doors. This is the tier where a 3m kitchen island costs $10,000-20,000+. Landed property and penthouse territory' },
];
