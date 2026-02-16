'use client';

import { useState, useMemo } from 'react';
import { MATERIAL_OPTIONS, MaterialTier, MaterialOption } from '@/lib/ai/budget-optimizer';

// ============================================================
// EXTENDED MATERIAL OPTIONS (including metals by usage)
// ============================================================

/**
 * Metal types mapped to specific usage contexts.
 * Different applications require different metals.
 */
export const METAL_BY_USAGE: Record<string, { metal: string; grade: string; finish: string; note: string }[]> = {
    'Window grilles': [
        { metal: 'Mild steel', grade: 'Hot-dip galvanised', finish: 'Powder-coated', note: 'Standard HDB. Must be galvanised to prevent rust.' },
        { metal: 'Aluminium', grade: '6063-T5', finish: 'Anodised / powder-coated', note: 'Lighter, no rust, more expensive. Popular for condos.' },
        { metal: 'Stainless steel', grade: '304', finish: 'Brushed / satin', note: 'Premium, no maintenance. Coastal areas recommended.' },
    ],
    'Main gate': [
        { metal: 'Mild steel', grade: 'Hot-dip galvanised', finish: 'Powder-coated', note: 'Sturdy, cost-effective. HDB standard.' },
        { metal: 'Wrought iron', grade: 'Forged', finish: 'Powder-coated / painted', note: 'Decorative, heavy, classic look.' },
        { metal: 'Aluminium', grade: '6063-T5', finish: 'Wood-grain laminate', note: 'Lightweight, modern look, wood-look options.' },
    ],
    'Cabinet handles': [
        { metal: 'Zinc alloy', grade: 'Die-cast', finish: 'Chrome / brushed nickel', note: 'Most common, affordable, many designs.' },
        { metal: 'Stainless steel', grade: '304', finish: 'Brushed / PVD gold', note: 'Durable, premium feel. PVD coating resists scratching.' },
        { metal: 'Aluminium', grade: 'Extruded', finish: 'Anodised black / silver', note: 'Lightweight, modern, integrated J-pull.' },
        { metal: 'Brass', grade: 'Solid', finish: 'Brushed / aged', note: 'Luxury, develops patina over time.' },
    ],
    'Glass door frame': [
        { metal: 'Aluminium', grade: '6063-T5', finish: 'Black anodised', note: 'Standard for glass panels and sliding doors.' },
        { metal: 'Stainless steel', grade: '304', finish: 'Brushed', note: 'Heavier, premium feel. For frameless glass doors.' },
        { metal: 'Mild steel', grade: 'Fabricated', finish: 'Powder-coated', note: 'Industrial look krisket frames and partitions.' },
    ],
    'Railings & balustrades': [
        { metal: 'Stainless steel', grade: '304', finish: 'Mirror / satin', note: 'Standard for condos & landed. BCA-compliant.' },
        { metal: 'Mild steel', grade: 'Fabricated', finish: 'Powder-coated', note: 'Cost-effective, many designs. Needs maintenance.' },
        { metal: 'Aluminium', grade: '6063-T5', finish: 'Powder-coated', note: 'Lightweight, low maintenance, good for balconies.' },
    ],
    'Roofing (landed)': [
        { metal: 'Zinc-aluminium (Zincalume)', grade: 'AZ150', finish: 'Mill finish / painted', note: 'Standard metal roofing. 20-year warranty.' },
        { metal: 'Standing seam aluminium', grade: '3003-H14', finish: 'PVDF coated', note: 'Premium, low maintenance, modern look.' },
        { metal: 'Copper', grade: 'C110', finish: 'Natural patina', note: 'Luxury. Develops green patina. 50+ year lifespan.' },
    ],
    'Shower fixtures': [
        { metal: 'Brass', grade: 'Dezincification-resistant', finish: 'Chrome plated', note: 'Industry standard. Chrome over brass core.' },
        { metal: 'Stainless steel', grade: '304', finish: 'Brushed', note: 'Modern, durable. Used by Grohe, Hansgrohe.' },
        { metal: 'Zinc alloy', grade: 'Die-cast', finish: 'Chrome', note: 'Budget option. Shorter lifespan, lighter feel.' },
    ],
};

// ============================================================
// CABINET COMPONENT SPECIFICATIONS
// ============================================================

export interface CabinetComponent {
    name: string;
    description: string;
    cost: string;          // cost indicator or range in SGD
    pros: string;
    cons: string;
    tier: 'budget' | 'standard' | 'premium' | 'luxury';
}

export const CABINET_COMPONENTS: Record<string, CabinetComponent[]> = {
    'Edge Banding': [
        {
            name: 'PVC Edge (0.4mm)',
            description: 'Thin PVC strip glued with EVA hot-melt. Visible glue line, basic finish. Older technology.',
            cost: '$0.50–1/lm',
            pros: 'Cheapest option available',
            cons: 'Visible glue line, peels in humid SG climate, yellows over time',
            tier: 'budget',
        },
        {
            name: 'ABS Edge (0.8–1mm)',
            description: 'Acrylonitrile Butadiene Styrene strip. More eco-friendly than PVC, bonded with EVA hot-melt adhesive.',
            cost: '$1–2/lm',
            pros: 'No chlorine (eco), good colour matching, decent durability',
            cons: 'Still has visible seam line, EVA glue can yellow',
            tier: 'budget',
        },
        {
            name: 'ABS + PUR Glue (1–2mm)',
            description: 'ABS edging bonded with PUR (Polyurethane Reactive) hot-melt. Thinner glue line, moisture-resistant bond.',
            cost: '$2–4/lm',
            pros: 'Moisture-proof bond, tight glue line, won\'t peel in wet areas',
            cons: 'Slight seam still visible, costs more than EVA',
            tier: 'standard',
        },
        {
            name: 'Laser Edge / Zero-Joint',
            description: 'Edging with integrated functional layer activated by laser or hot-air (e.g., Rehau RAUKANTEX, Döllken). No glue line visible — seamless finish.',
            cost: '$4–8/lm',
            pros: 'Zero visible seam, waterproof, premium look, no glue discolouration',
            cons: 'Requires specialised machine (not all carpenters can do), higher cost',
            tier: 'premium',
        },
    ],
    'Board Type': [
        {
            name: 'Particle Board (PB)',
            description: 'Wood chips + resin compressed into boards. Most affordable carcass material. Swells when wet.',
            cost: '$15–22/sheet (1220×2440mm)',
            pros: 'Cheapest, consistent flatness, takes laminate well',
            cons: 'Swells with moisture, weaker screw hold, cannot be wet-sanded',
            tier: 'budget',
        },
        {
            name: 'MDF (Medium Density Fibreboard)',
            description: 'Fine wood fibres + resin pressed flat. Smooth surface ideal for painting and lacquer. Not for wet areas.',
            cost: '$25–40/sheet',
            pros: 'Ultra-smooth surface for paint/lacquer, no grain direction, tight edges',
            cons: 'Heavier than PB, swells badly if wet, weaker than plywood',
            tier: 'standard',
        },
        {
            name: 'Plywood (Marine Grade)',
            description: '18mm marine plywood — cross-laminated hardwood veneers with waterproof WBP glue. SG industry standard for quality work.',
            cost: '$45–65/sheet',
            pros: 'Water-resistant, strong screw hold, durable long-term, industry standard in SG',
            cons: 'More expensive, core voids possible in lower grades, heavier',
            tier: 'standard',
        },
        {
            name: 'Birch Plywood (Baltic/Finnish)',
            description: 'Premium birch veneer plywood, all-birch core. Extremely consistent, beautiful exposed edges. Used in premium furniture.',
            cost: '$80–120/sheet',
            pros: 'Beautiful edges (can leave exposed), strongest plywood, consistent quality',
            cons: 'Expensive, limited availability in SG, heavier',
            tier: 'premium',
        },
    ],
    'Surface Finish': [
        {
            name: 'Melamine / LPL (Low Pressure Laminate)',
            description: 'Resin-impregnated decorative paper fused directly onto board at low pressure. Budget finish — the paper IS the surface.',
            cost: 'Included in board price',
            pros: 'Cheapest, pre-applied to particle board, basic colour range',
            cons: 'Thin (0.2mm), chips easily, limited textures, not repairable',
            tier: 'budget',
        },
        {
            name: 'HPL (High Pressure Laminate)',
            description: 'Multiple kraft paper layers + decorative layer pressed at high heat/pressure. Brands: Lamitak, Formica, Arborite. SG standard for cabinet doors.',
            cost: '$3–8/sqm',
            pros: 'Durable, huge range of patterns/textures, moisture-resistant, stain-proof',
            cons: 'Seams visible at edges (needs edge banding), can chip on impact',
            tier: 'standard',
        },
        {
            name: 'Acrylic Face',
            description: 'High-gloss acrylic sheet bonded to MDF/plywood substrate. Mirror-like reflective finish. Popular for modern kitchens.',
            cost: '$8–15/sqm',
            pros: 'High-gloss mirror finish, easy to clean, vibrant colours',
            cons: 'Shows fingerprints, scratches more visible, needs careful handling',
            tier: 'premium',
        },
        {
            name: 'Real Wood Veneer',
            description: 'Thin slice of real wood (0.5–3mm) bonded to plywood/MDF. Natural grain variation. Brands: Decowood, Shinnoki.',
            cost: '$10–25/sqm',
            pros: 'Real wood look and feel, unique grain, can be refinished (thick veneer)',
            cons: 'UV fading, moisture sensitive, requires skilled application, more expensive',
            tier: 'premium',
        },
        {
            name: '2K Lacquer Spray / Polyurethane',
            description: 'Multi-coat spray finish (primer → colour → clear coat) on MDF/timber. Factory-sprayed for flawless finish. Any colour possible.',
            cost: '$15–35/sqm',
            pros: 'Any custom colour, seamless finish, premium feel, repairable',
            cons: 'Expensive, long production time (2-3 weeks), chips if knocked hard',
            tier: 'luxury',
        },
        {
            name: 'Sintered Stone (Dekton/Laminam)',
            description: 'Ultra-compact surface made from natural minerals. Heat-proof, scratch-proof, UV-stable. Used for countertops and premium cabinet faces.',
            cost: '$30–60/sqm',
            pros: 'Indestructible (heat, scratch, stain proof), UV-stable, natural stone look',
            cons: 'Very expensive, heavy, needs specialist fabrication, limited edge profiles',
            tier: 'luxury',
        },
        {
            name: 'Rattan Weave / Cane Inlay',
            description: 'Natural or synthetic rattan cane woven into door panels or cabinet fronts. Very popular in SEA tropical and boho-Scandinavian interiors. Can be natural cane, plastic rattan, or rattan-print laminate.',
            cost: '$12–30/sqm (natural), $5–12 (synthetic)',
            pros: 'Tropical aesthetic, breathable (ventilated doors), lightweight, Instagram-friendly, pairs with wood tones',
            cons: 'Natural rattan yellows and loosens over time, not moisture-proof, dust collects in weave',
            tier: 'standard',
        },
        {
            name: 'Fluted / Tambour Panel',
            description: 'Vertically-grooved panel (wood, MDF, or PVC) creating a ribbed texture. Can be used on cabinet doors, feature walls, and vanities. Very trendy in modern and Japandi interiors.',
            cost: '$8–25/sqm',
            pros: 'Adds texture and depth, hides fingerprints, very trendy, works as accent or full wall',
            cons: 'Dust collects in grooves, harder to clean, MDF version not water-safe',
            tier: 'standard',
        },
    ],
    'Hardware': [
        {
            name: 'Standard Hinge (no-brand)',
            description: 'Basic concealed cup hinge, no soft-close. Functional but slams shut.',
            cost: '$2–4/pc',
            pros: 'Cheapest, widely available, easy to replace',
            cons: 'No soft-close, wears faster, less adjustment range',
            tier: 'budget',
        },
        {
            name: 'Blum Clip Top (soft-close)',
            description: 'Austrian-made clip-on concealed hinge with integrated Blumotion soft-close damper. Industry standard for quality.',
            cost: '$8–12/pc',
            pros: 'Soft-close, tool-free clip mounting, 3-way adjustment, proven durability',
            cons: 'Higher cost, proprietary clips',
            tier: 'standard',
        },
        {
            name: 'Roller Drawer Runner',
            description: 'Basic side-mount roller runners. White epoxy-coated steel. No soft-close.',
            cost: '$3–6/pair',
            pros: 'Cheapest drawer option, easy to install',
            cons: 'No soft-close, limited load (15kg), partial extension only',
            tier: 'budget',
        },
        {
            name: 'Ball-Bearing Runner (soft-close)',
            description: 'Full-extension ball-bearing runners with soft-close. 30-45kg load capacity.',
            cost: '$12–20/pair',
            pros: 'Full extension, smooth glide, soft-close, good load capacity',
            cons: 'Side-mount reduces drawer width slightly',
            tier: 'standard',
        },
        {
            name: 'Blum Tandem / Tandembox',
            description: 'Premium under-mount or box drawer system by Blum. Hidden runners, integrated soft-close. Used in high-end cabinetry.',
            cost: '$35–80/pair',
            pros: 'Hidden runners (clean look), 30-65kg load, full extension, silky smooth',
            cons: 'Expensive, requires precise routing, proprietary parts',
            tier: 'premium',
        },
        {
            name: 'Gas Strut / Hydraulic Lift',
            description: 'Lift-up stay for overhead cabinets or platform bed lids. Aventos HK/HF by Blum for flip-up cabinet doors.',
            cost: '$15–60/pc (Blum Aventos: $100–180/set)',
            pros: 'Hands-free hold-open, smooth operation, adjustable tension',
            cons: 'Loses pressure over 5-8 years, Blum sets are expensive',
            tier: 'standard',
        },
        {
            name: 'Push-to-Open (Tip-On)',
            description: 'Handleless mechanism — push the door/drawer to open. Blum Tip-On or Hettich Push-to-Open.',
            cost: '$8–15/pc',
            pros: 'Clean handleless look, modern aesthetic, no pulls needed',
            cons: 'Shows fingerprints on surface, can misfire, needs flat surfaces',
            tier: 'premium',
        },
        {
            name: 'Flip-Up Power Switch Panel',
            description: 'Concealed desktop power unit that flips or pops up to reveal sockets + USB ports. Brands: Bachmann, Kondator, EVOline.',
            cost: '$120–350/unit',
            pros: 'Clean desk surface, protected from spills, integrated USB-A/C',
            cons: 'Requires precise cutout, limited socket count, needs electrician hookup',
            tier: 'premium',
        },
        {
            name: 'Rubber Gasket Cable Grommet',
            description: 'Desk cable pass-through hole with rubber gasket/brush seal. Seals gap when cables are removed, prevents dust and dropped items.',
            cost: '$5–15/pc',
            pros: 'Clean cable routing, seals when not in use, easy to install',
            cons: 'Fixed hole size, rubber can degrade over time',
            tier: 'standard',
        },
    ],
    'Doors': [
        {
            name: 'HDB Fire-Rated Door (FRD)',
            description: 'Mandatory 1-hour fire-rated main door for HDB flats. SCDF-compliant. Usually comes with unit, replaced for aesthetic reasons.',
            cost: '$350–600/set',
            pros: 'Compulsory (SCDF), available in many laminate finishes, self-closing',
            cons: 'Heavy, limited design freedom, must meet fire-rating specs',
            tier: 'standard',
        },
        {
            name: 'Solid Laminate Door (Bedroom)',
            description: 'Hollow-core or semi-solid door with HPL/melamine laminate face. Standard for HDB/condo bedrooms.',
            cost: '$250–450/set (with frame)',
            pros: 'Affordable, huge colour range, lightweight, easy to install',
            cons: 'Hollow-core dents easily, melamine chips, limited sound insulation',
            tier: 'budget',
        },
        {
            name: 'Solid Timber Door',
            description: 'Full solid wood door (nyatoh, meranti, or teak). Heavy, excellent sound insulation. Used for master bedrooms or entrance.',
            cost: '$600–1,200/set',
            pros: 'Premium feel, heavy = sound-proof, can be stained/refinished',
            cons: 'Warps in humidity if not kiln-dried, expensive, heavy hinges needed',
            tier: 'premium',
        },
        {
            name: 'Veneer Flush Door',
            description: 'Engineered core with real wood veneer face. Modern flat profile. Brands: Masonite, Lambri.',
            cost: '$450–800/set',
            pros: 'Real wood look, lighter than solid, consistent grain, modern flush profile',
            cons: 'Veneer can chip at edges, cannot be deeply sanded, moisture-sensitive',
            tier: 'premium',
        },
        {
            name: 'Glass Aluminium Sliding Door',
            description: 'Aluminium-framed sliding door with tempered/frosted glass. Top-hung (premium) or bottom-roller system.',
            cost: '$500–1,500/set',
            pros: 'Space-saving (no swing radius), natural light flow, modern look',
            cons: 'Limited sound insulation, track needs regular cleaning, less privacy',
            tier: 'standard',
        },
        {
            name: 'Barn Door (Sliding on Rail)',
            description: 'Wall-mounted sliding door on exposed rail. Industrial or rustic aesthetic. Can be timber, metal, or glass.',
            cost: '$600–1,200/set',
            pros: 'Statement piece, no floor track, space-efficient, exposed hardware design',
            cons: 'Gaps at sides (no seal), heavy, needs strong wall mounting, no lock',
            tier: 'premium',
        },
        {
            name: 'Pocket Door (Hidden Slide)',
            description: 'Slides into a cavity inside the wall. Completely hidden when open. Requires wall modification during renovation.',
            cost: '$1,200–2,500/set',
            pros: 'Invisible when open, maximum space saving, ultra-clean look',
            cons: 'Expensive, requires wall cavity, hard to repair if jammed, must plan early',
            tier: 'luxury',
        },
        {
            name: 'Ghost Rack Door (Concealed Hinge)',
            description: 'Frameless flush door with concealed "ghost" hinges — sits completely flush with the wall when closed. No visible frame or hardware. Can be painted/wallpapered to match wall for a hidden door effect. Popular for feature walls and hidden storage.',
            cost: '$800–1,800/set',
            pros: 'Invisible when closed, seamless wall finish, wow-factor, great for hidden rooms/closets',
            cons: 'Expensive hinges (Argenta, Tectus), needs precise installation, no standard door frame, maintenance on concealed hardware harder',
            tier: 'luxury',
        },
        {
            name: 'Ghost Track Sliding Door (隐形轨道门)',
            description: 'Concealed top-mounted track sliding door — track is hidden inside ceiling or pelmet. No visible rail, frame, or floor guide. The door appears to float. Hugely trending in China/Xiaohongshu.',
            cost: '$1,200–3,000/set',
            pros: 'Ultra-clean look, no floor track (wheelchair/robot-friendly), silent operation, dramatic reveal',
            cons: 'Must plan during false ceiling, expensive concealed hardware, needs precise ceiling alignment',
            tier: 'luxury',
        },
        {
            name: 'Bus Door / Bi-parting Door (公交门)',
            description: 'Two door panels that slide open from center simultaneously — like bus/elevator doors. Can be glass, wood, or aluminium frame. Very popular on Xiaohongshu/Douyin for kitchen separation.',
            cost: '$1,500–3,500/set',
            pros: 'Dramatic opening, wide aperture, modern wow-factor, great for kitchen/living divide',
            cons: 'Needs space on both sides for panels, complex mechanism, expensive, needs skilled installer',
            tier: 'luxury',
        },
        {
            name: 'Narrow Frame Glass Door (极窄边框)',
            description: 'Ultra-thin aluminium frame (15–20mm visible edge) with large glass panels. Maximises glass area, minimises frame visibility. Trending for kitchen/balcony separation.',
            cost: '$600–1,500/panel',
            pros: 'Maximum light and view, sleek modern look, feels almost frameless, trending aesthetic',
            cons: 'Thinner frame = less structural rigidity, premium pricing, limited colour options',
            tier: 'premium',
        },
        {
            name: 'Rock Slab Door (岩板门)',
            description: 'Door panel faced with thin sintered stone (rock slab / 岩板). Stone-textured surface that is heat-proof and scratch-proof. Luxury material trending in Chinese high-end interiors.',
            cost: '$1,200–2,800/panel',
            pros: 'Unique stone texture, heat/scratch proof, high-end look, UV-stable',
            cons: 'Very heavy (needs heavy-duty hinges), expensive, brittle if not handled carefully, limited supply in SG',
            tier: 'luxury',
        },
        {
            name: 'PET Board Door (PET膜板)',
            description: 'MDF/plywood door wrapped with PET (polyethylene terephthalate) film. Matte smooth finish, fingerprint-resistant, eco-friendly. The "it" material in Chinese cream-style (奶油风) interiors.',
            cost: '$350–700/panel',
            pros: 'Super matte finish, anti-fingerprint, eco-friendly, soft warm colours, very Instagram/Xiaohongshu-friendly',
            cons: 'Not scratch-proof (can mark), limited to matte finishes, newer material with less track record',
            tier: 'standard',
        },
        {
            name: 'Carbon Crystal Board Door (碳晶板)',
            description: 'Wood-plastic composite board with carbon crystal skin surface. Waterproof, formaldehyde-free, UV-resistant. Budget-friendly alternative to solid wood with natural wood-grain texture.',
            cost: '$250–550/panel',
            pros: 'Waterproof, zero formaldehyde, realistic wood grain, affordable, kitchen/bathroom safe',
            cons: 'Plastic feel up close, limited design sophistication, newer material, durability unproven long-term',
            tier: 'budget',
        },
        {
            name: 'Cream Style Panel Door (奶油风)',
            description: 'Soft matte panel door in warm cream/milk tea/off-white tones. Typically PET or lacquer finish on MDF. Defines the popular "cream style" Chinese interior aesthetic — warm, soft, Scandinavian-meets-Chinese.',
            cost: '$400–900/panel',
            pros: 'Warm inviting aesthetic, hugely trendy, photographs beautifully, pairs with rounded furniture',
            cons: 'Light colours show dirt, matte finish marks easier, trend may date, limited to soft palette',
            tier: 'premium',
        },
        {
            name: 'Honeycomb Aluminium Door (铝蜂窝板门)',
            description: 'Aluminium skin bonded to honeycomb aluminium core. Ultra-lightweight, waterproof, fireproof. Used for large format doors and tall panels where wood would warp.',
            cost: '$500–1,200/panel',
            pros: 'Featherweight (5kg/sqm), waterproof, fireproof, no warping, huge panels possible',
            cons: 'Metallic feel, limited texture options, dents on impact, sounds hollow when knocked',
            tier: 'premium',
        },
    ],
    'Countertops': [
        {
            name: 'Compact Laminate (Postform)',
            description: 'HPL sheet bonded to particle board or plywood substrate with postformed (rounded) front edge. Budget kitchen standard.',
            cost: '$15–30/lft',
            pros: 'Cheapest, many colours, integrated backsplash, fast to fabricate',
            cons: 'Not heat-proof, seams visible, scratches over time, absorbs stains at joints',
            tier: 'budget',
        },
        {
            name: 'Solid Surface (Corian/Hi-Macs)',
            description: 'Acrylic/polyester resin with minerals. Seamless joins, integrated sinks. Brands: Corian, Hi-Macs, Samsung Staron.',
            cost: '$50–100/lft',
            pros: 'Seamless (invisible joints), repairable (sand out scratches), integrated sink',
            cons: 'Not heat-proof (hot pans mark it), softer than stone, yellows with UV',
            tier: 'standard',
        },
        {
            name: 'Quartz (Engineered Stone)',
            description: '93% natural quartz + resin binder. Non-porous, consistent pattern. Brands: Caesarstone, Silestone, Quantra.',
            cost: '$80–180/lft',
            pros: 'Non-porous (no sealing needed), stain-proof, consistent pattern, durable',
            cons: 'Not heat-proof (resin burns), visible seams on long runs, heavy',
            tier: 'standard',
        },
        {
            name: 'Granite (Natural Stone)',
            description: 'Natural granite slab. Each piece unique. Needs periodic sealing. Traditional choice for wet/dry kitchens.',
            cost: '$60–150/lft',
            pros: 'Heat-proof, natural beauty, unique patterns, very hard-wearing',
            cons: 'Porous (needs sealing), can crack, heavy, limited colour consistency',
            tier: 'standard',
        },
        {
            name: 'Sintered Stone (Dekton/Laminam)',
            description: 'Ultra-compact surface (Dekton, Laminam, Neolith). Heat-proof, scratch-proof, UV-stable. 12–20mm thick slabs.',
            cost: '$150–300/lft',
            pros: 'Indestructible (heat, scratch, stain proof), thin slabs possible, UV-stable',
            cons: 'Very expensive, brittle at edges, needs specialist fabrication',
            tier: 'luxury',
        },
        {
            name: 'Stainless Steel (SS304)',
            description: 'Commercial-grade SS304 countertop. Seamless welded with integrated backsplash + sink. Standard for commercial kitchens.',
            cost: '$100–200/lft',
            pros: 'Heat-proof, hygienic, seamless, indestructible, commercial-grade',
            cons: 'Scratches (develops patina), shows fingerprints, noisy, industrial look',
            tier: 'premium',
        },
    ],
    'Electrical / LEW': [
        {
            name: 'Standard Point (switch/socket)',
            description: 'Single electrical point — switch or 13A socket installation. Includes conduit, wiring, and wall box.',
            cost: '$80–120/point',
            pros: 'Essential, straightforward, any electrician can do',
            cons: 'Costs add up fast with many points, chasing walls can be messy',
            tier: 'standard',
        },
        {
            name: 'DB Box Upgrade (SP-approved)',
            description: 'Replace old distribution board (fuse box) with new MCB/RCCB board. Required for old flats or major rewiring. Must use LEW.',
            cost: '$350–600',
            pros: 'Safety upgrade, supports modern load, trip protection per circuit',
            cons: 'Requires Licensed Electrical Worker (LEW), SP Group coordination, downtime',
            tier: 'standard',
        },
        {
            name: 'Full Rewiring (LEW required)',
            description: 'Complete replacement of all electrical wiring in the unit. Mandatory for old resale flats (pre-1990). Requires LEW + SLD submission.',
            cost: '$2,500–5,000 (3-rm), $4,000–8,000 (5-rm)',
            pros: 'Safety, supports modern appliance load, new circuit breakers, peace of mind',
            cons: 'Expensive, requires Licensed Electrical Worker (LEW), must do before other trades',
            tier: 'premium',
        },
        {
            name: 'LEW + SLD Submission',
            description: 'Licensed Electrical Worker (LEW) prepares and submits Single Line Diagram (SLD) to SP Group / EMA. Required for DB upgrade, rewiring, or capacity increase. SLD shows the complete electrical schematic of the unit.',
            cost: '$200–500 (LEW fee for SLD)',
            pros: 'Legally required, ensures safety compliance, formal SP Group approval',
            cons: 'Takes 1–2 weeks for approval, must engage LEW separately from contractor',
            tier: 'standard',
        },
        {
            name: 'Ceiling Fan Point (with isolator)',
            description: 'Dedicated fan point with isolator switch. Requires reinforced ceiling box and separate circuit.',
            cost: '$120–180/point',
            pros: 'Safe isolated circuit, supports heavy fans, proper load bearing',
            cons: 'Needs ceiling access, harder to add after false ceiling is done',
            tier: 'standard',
        },
        {
            name: 'Smart Home Wiring (pre-wire)',
            description: 'Cat6 / smart switch pre-wiring for home automation. Includes data points, smart switch neutral wires, hub power.',
            cost: '$150–300/point',
            pros: 'Future-proof, enables smart switches/sensors, centralised control',
            cons: 'Must plan during renovation, wasted if not used, compatibility risks',
            tier: 'premium',
        },
    ],
    'Door Panel Profiles': [
        {
            name: 'Slab / Flat Panel',
            description: 'Completely flat, featureless door surface. Clean modern look. The most common profile in contemporary and Scandinavian interiors.',
            cost: 'Base price (no added profile cost)',
            pros: 'Simplest, cheapest, easiest to clean, pairs with any style',
            cons: 'Can look plain, shows dents/scratches easily, no visual interest',
            tier: 'budget',
        },
        {
            name: 'Shaker Panel',
            description: 'Recessed center panel with clean square-edge frame. Originated from US Shaker furniture. Timeless and extremely popular for kitchens.',
            cost: '+$30–80/door over slab',
            pros: 'Classic versatile look, works modern or traditional, hides minor warping',
            cons: 'Dust collects in grooves, harder to clean, routing adds cost',
            tier: 'standard',
        },
        {
            name: 'Raised Panel (Cathedral/Arch)',
            description: 'Center panel is raised with decorative edge moulding. Traditional/colonial style. Often seen in solid timber or MDF with lacquer.',
            cost: '+$60–150/door over slab',
            pros: 'Classic high-end look, adds depth, suits colonial/traditional interiors',
            cons: 'Dated look for modern spaces, expensive, more dust collection, hard to repaint cleanly',
            tier: 'premium',
        },
        {
            name: 'Louvred / Ventilated Panel',
            description: 'Angled slats allowing airflow through door. Common for laundry rooms, shoe cabinets, wardrobes in humid SG climate.',
            cost: '+$50–120/door over slab',
            pros: 'Ventilation (prevents mould), tropical aesthetic, reduces odour in closed spaces',
            cons: 'Dust magnet, weak structural integrity, difficult to paint evenly, less privacy',
            tier: 'standard',
        },
        {
            name: 'Glass Insert Panel',
            description: 'Door with glass (clear, frosted, fluted, or stained) set into frame. Used for display cabinets, kitchen uppers.',
            cost: '+$40–200/door (depends on glass type)',
            pros: 'Visual lightness, shows off contents, natural light flow, decorative',
            cons: 'Glass can break, shows messy storage, fingerprints, heavier',
            tier: 'standard',
        },
        {
            name: 'J-Profile / Handleless (Gola)',
            description: 'Recessed channel at top or bottom of door eliminating visible handles. Clean continuous surface. Very popular in modern European kitchens.',
            cost: '+$20–50/door (aluminium channel)',
            pros: 'Ultra-clean look, no protruding handles, child-safe, continuous line design',
            cons: 'Dust collects in channel, harder to grip with wet hands, alignment must be precise',
            tier: 'premium',
        },
        {
            name: 'Board & Batten Panel',
            description: 'Vertical boards with narrow raised strips (battens) on top. Farmhouse/rustic aesthetic. Popular in Scandinavian and cottagecore interiors.',
            cost: '+$40–100/door over slab',
            pros: 'Textured rustic charm, great for feature pieces, hides minor imperfections',
            cons: 'Trendy (may date), dust in grooves, harder to clean, limited to specific styles',
            tier: 'standard',
        },
    ],
    'Ceiling Types': [
        {
            name: 'Gypsum Board (Plasterboard)',
            description: 'Standard false ceiling material. Can be flat, stepped (L-box/pelmet), or curved. Skim-coated and painted. Most common in SG. Load capacity: ≤5kg/point (lights, small fixtures). Use toggle bolts for heavier items.',
            cost: '$5–8/sqm (flat), $8–15/sqm (L-box/pelmet)',
            pros: 'Smooth finish, hides piping/wiring/trunking, supports cove lighting, affordable',
            cons: 'Not waterproof (avoid in bathrooms), cracks at joints over time, ≤5kg load only, adds height loss',
            tier: 'standard',
        },
        {
            name: 'Cement Board Ceiling',
            description: 'Fibre cement board for wet areas (bathrooms, balconies). Water-resistant. Can be painted. Load capacity: ≤8kg/point — stronger than gypsum, handles heavier bathroom fixtures.',
            cost: '$6–10/sqm',
            pros: 'Waterproof, suitable for wet areas, paintable, fire-rated, stronger than gypsum',
            cons: 'Heavier than gypsum, harder to cut, less smooth finish, limited design flexibility',
            tier: 'standard',
        },
        {
            name: 'Metal Strip Ceiling (Aluminium)',
            description: 'Linear aluminium strips with concealed clip system. Modern industrial look. Load capacity: ≤3kg/point per strip — lightweight fixtures only. For heavier items, mount to structural frame above.',
            cost: '$8–15/sqm',
            pros: 'Waterproof, durable, easy to remove individual strips for access, modern look',
            cons: 'Industrial appearance, limited warmth, shows dents, noisy in rain, low load capacity per strip',
            tier: 'premium',
        },
        {
            name: 'PVC Ceiling Panel',
            description: 'Plastic tongue-and-groove ceiling panels. Budget waterproof option for bathrooms and service yards. Load capacity: ≤1kg — NO fixtures, lights only via separate slab mounting.',
            cost: '$3–6/sqm',
            pros: 'Cheapest waterproof option, easy to install, no painting needed',
            cons: 'Looks cheap, yellows over time, not fire-rated, cannot bear any load, limited design',
            tier: 'budget',
        },
        {
            name: 'Wood Strip / Timber Ceiling',
            description: 'Solid wood or engineered wood strips installed as feature ceiling. Popular in Japandi and Scandinavian interiors. Load capacity: ≤10kg/point if secured to structural battens — can hang pendants and fans with proper reinforcement.',
            cost: '$15–35/sqm',
            pros: 'Warm natural look, acoustic dampening, premium feel, moderate load with battens',
            cons: 'Expensive, moisture-sensitive, fire risk, maintenance needed, heavy',
            tier: 'luxury',
        },
        {
            name: 'Exposed Ceiling (Industrial)',
            description: 'No false ceiling — concrete slab left exposed, painted or sealed. Conduits and pipes become design elements. Load capacity: Direct slab mount — unlimited (structural). Can hang anything directly from slab with rawl bolts.',
            cost: '$2–5/sqm (cleaning + painting only)',
            pros: 'Maximum ceiling height, unlimited load (direct slab), industrial chic, cheapest option',
            cons: 'Noisy (no insulation), no space to hide wiring, dust on pipes, cold feel',
            tier: 'budget',
        },
    ],
    'Flooring': [
        {
            name: 'SPC Vinyl Plank (Click-lock)',
            description: 'Stone Polymer Composite vinyl with click-lock installation. 100% waterproof. Most popular non-tile flooring in SG. Brands: Inovar, FloorPlus.',
            cost: '$3–7/sqm (supply + install)',
            pros: 'Waterproof, easy DIY install, no hacking needed (overlay), quiet, wood-look',
            cons: 'Feels synthetic underfoot, expands in heat, hard to repair single planks, hollow sound',
            tier: 'budget',
        },
        {
            name: 'Luxury Vinyl Tile (LVT)',
            description: 'Flexible vinyl with realistic texture (wood/stone). Glue-down or loose-lay. Softer and warmer than SPC. Brands: Karndean, Amtico.',
            cost: '$5–12/sqm',
            pros: 'Softer underfoot, quieter than SPC, very realistic textures, repairable',
            cons: 'Needs flat subfloor, glue-down is permanent, can indent under heavy furniture',
            tier: 'standard',
        },
        {
            name: 'Homogeneous Tile',
            description: 'Full-body porcelain tile — colour runs through entire thickness. Very durable, stain-proof. Standard for HDB/condo common areas.',
            cost: '$4–8/sqm (supply), $4–6/sqm (install)',
            pros: 'Extremely durable, scratch-proof, stain-proof, colour consistent when chipped',
            cons: 'Cold underfoot, hard on joints, installation noise/dust, heavy',
            tier: 'standard',
        },
        {
            name: 'Porcelain / Ceramic Tile',
            description: 'Standard wall and floor tiles. Huge variety of sizes (300×300 to 1200×600), textures (wood-look, marble-look, cement-look).',
            cost: '$3–15/sqm (supply varies wildly)',
            pros: 'Massive variety, waterproof, easy to clean, durable, suits any style',
            cons: 'Cold, hard, grout maintenance, can crack, slippery when wet (check R-rating)',
            tier: 'standard',
        },
        {
            name: 'Natural Marble / Granite',
            description: 'Natural stone slab flooring. Each piece unique. Needs sealing. Luxury option for living rooms and bathrooms.',
            cost: '$15–50/sqm (supply + install)',
            pros: 'Unique natural beauty, cool underfoot (good for SG), premium feel, durable',
            cons: 'Porous (needs sealing), scratches, stains from acid, heavy, expensive',
            tier: 'luxury',
        },
        {
            name: 'Engineered Wood / Parquet',
            description: 'Real wood veneer on plywood core. Click-lock or glue-down. Warm underfoot. Brands: Kährs, Quick-Step.',
            cost: '$8–20/sqm',
            pros: 'Real wood feel and warmth, can be refinished (thick veneer), natural look',
            cons: 'Not waterproof, swells in humidity, scratches from furniture, expensive',
            tier: 'premium',
        },
        {
            name: 'Epoxy / Microcement Floor',
            description: 'Poured seamless floor finish. No grout lines, continuous surface. Industrial or ultra-modern aesthetic.',
            cost: '$12–30/sqm',
            pros: 'Seamless (no grout lines), unique look, easy to clean, customisable colours',
            cons: 'Cracks over time, slippery when wet, hard to repair, specialist application',
            tier: 'premium',
        },
    ],
    'Glass Types': [
        {
            name: 'Clear Tempered Glass',
            description: 'Standard safety glass (4× stronger than annealed). Required for shower screens, balcony panels, glass doors. Shatters into small cubes.',
            cost: '$15–25/sqm',
            pros: 'Safety compliant, transparent, clean look, allows maximum light',
            cons: 'No privacy, shows fingerprints and water marks, cannot be cut after tempering',
            tier: 'standard',
        },
        {
            name: 'Frosted / Sandblasted Glass',
            description: 'Tempered glass with acid-etched or sandblasted surface for privacy. Translucent but not transparent. Common for bathroom doors/partitions.',
            cost: '$18–30/sqm',
            pros: 'Privacy while allowing light, elegant look, hides fingerprints better',
            cons: 'Stains more easily, harder to clean, one-sided frosting can peel',
            tier: 'standard',
        },
        {
            name: 'Fluted / Reeded Glass',
            description: 'Vertically-ribbed glass that distorts view for semi-privacy. Hugely trending — the "it" glass for 2024-2026 interiors. Used for kitchen dividers, cabinet fronts.',
            cost: '$25–45/sqm',
            pros: 'Stylish semi-privacy, diffuses light beautifully, very trendy, architectural interest',
            cons: 'Dust in grooves, one-directional privacy, trend may date, fragile thin ribs',
            tier: 'premium',
        },
        {
            name: 'Tinted Glass (Grey/Bronze/Blue)',
            description: 'Tempered glass with integral colour tint. Reduces glare and heat. Common for balcony/window panels.',
            cost: '$20–35/sqm',
            pros: 'Reduces glare, adds warmth/coolness, design accent, better UV protection',
            cons: 'Darker interiors, colour cannot be changed, limited tones available',
            tier: 'standard',
        },
        {
            name: 'Smart Glass (Switchable Privacy)',
            description: 'PDLC film laminated between glass layers. Switches from opaque to transparent electronically. Brands: Smartglass, Gauzy.',
            cost: '$80–150/sqm',
            pros: 'Instant privacy on demand, zero blinds needed, futuristic wow-factor',
            cons: 'Very expensive, needs wiring, cloudy when opaque (not frosted-white), can fail',
            tier: 'luxury',
        },
        {
            name: 'Low-E Glass (Energy Efficient)',
            description: 'Low-emissivity coating that reflects heat while allowing light. Reduces aircon load. Mandatory in some green building certifications.',
            cost: '$25–45/sqm',
            pros: 'Reduces heat gain (lower aircon bill), UV protection, green building compliant',
            cons: 'Slight colour tint, expensive, may affect phone signal, needs specialist supply',
            tier: 'premium',
        },
    ],
    'Wall Finishes': [
        {
            name: 'Emulsion Paint (Standard)',
            description: 'Standard interior latex/acrylic wall paint. Matt, eggshell, or semi-gloss. Brands: Nippon, Dulux, Jotun.',
            cost: '$1.50–3/sqm (2 coats, labour incl.)',
            pros: 'Cheapest, huge colour range, easy to repaint, standard for all rooms',
            cons: 'Marks easily (matt), needs prep (sanding, priming), fade over time',
            tier: 'budget',
        },
        {
            name: 'Limewash / Mineral Paint',
            description: 'Natural lime-based paint that creates soft, chalky, textured finish. Trending for Mediterranean and wabi-sabi interiors.',
            cost: '$5–12/sqm',
            pros: 'Unique depth and texture, breathable, anti-mould, natural material, ages beautifully',
            cons: 'Uneven coverage (by design), comes off on contact when wet, limited durability',
            tier: 'premium',
        },
        {
            name: 'Wallpaper / Wall Mural',
            description: 'Decorative paper or vinyl adhesive covering. Available in thousands of patterns. Brands: Farrow & Ball, Cole & Son, Photowall.',
            cost: '$3–15/sqm (supply + install)',
            pros: 'Limitless patterns/textures, hides wall imperfections, easy to change, dramatic impact',
            cons: 'Peels in humidity (use vinyl-coated), seams visible, hard to remove cleanly',
            tier: 'standard',
        },
        {
            name: 'Microcement / Skim Coat Feature',
            description: 'Thin cementitious coating (2–3mm) applied over existing surfaces. Creates industrial concrete-look finish. Seamless, no grout.',
            cost: '$12–25/sqm',
            pros: 'Seamless concrete look, works over tiles, waterproof (sealed), unique character',
            cons: 'Cracks possible, specialist skill needed, colour variation between batches, expensive',
            tier: 'premium',
        },
        {
            name: 'Wood Slat / Batten Wall Panel',
            description: 'Vertical or horizontal timber/MDF battens mounted on black felt backing. Popular feature wall treatment in Japandi and modern interiors.',
            cost: '$15–35/sqm',
            pros: 'Instant feature wall, acoustic dampening, hides imperfect walls, very trendy',
            cons: 'Dust collector, expensive for large areas, fire risk (real wood), limits wall use',
            tier: 'premium',
        },
        {
            name: 'Feature Stone / Stacked Stone',
            description: 'Natural or cultured stone cladding for accent walls. Slate, limestone, or manufactured stone veneer. Common for TV walls.',
            cost: '$10–30/sqm',
            pros: 'Dramatic texture, premium feel, natural material, great for TV/fireplace walls',
            cons: 'Heavy, expensive, dust in crevices, hard to remove/change, bugs in gaps',
            tier: 'premium',
        },
        {
            name: 'Venetian Plaster (Stucco)',
            description: 'Multi-layered lime or marble dust plaster hand-applied and polished. Creates marble-like depth and sheen. Very labour-intensive.',
            cost: '$20–50/sqm',
            pros: 'Stunning depth and sheen, each wall unique, breathable, premium European look',
            cons: 'Very expensive, needs skilled artisan, long application time, hard to repair',
            tier: 'luxury',
        },
    ],
    'Waterproofing': [
        {
            name: 'Cementitious Waterproofing',
            description: 'Cement-based coating mixed with acrylic binder. Brush-applied in 2–3 coats. Standard for HDB/condo bathroom floors + walls. Brands: Mapei, Sika.',
            cost: '$4–8/sqm (material + labour)',
            pros: 'Industry standard, affordable, proven track record, easy to apply',
            cons: 'Rigid (cracks if substrate moves), must cure 7 days before tiling, manual skill-dependent',
            tier: 'standard',
        },
        {
            name: 'Liquid Membrane (Acrylic/Polyurethane)',
            description: 'Flexible liquid coating that cures into a rubber-like membrane. Better crack-bridging than cementitious. Brands: Davco, Fosroc.',
            cost: '$6–12/sqm',
            pros: 'Flexible (bridges hairline cracks), faster cure time, seamless coverage',
            cons: 'More expensive, UV-sensitive (must be covered), application consistency matters',
            tier: 'standard',
        },
        {
            name: 'Sheet Membrane (Torch-on / Peel-stick)',
            description: 'Pre-formed waterproof sheet rolled onto surface and heat-bonded or adhesive-applied. Used for flat roofs, large wet areas, balconies.',
            cost: '$8–15/sqm',
            pros: 'Consistent thickness, factory-controlled quality, excellent for flat roofs',
            cons: 'Seam joints are weak points, skilled application needed, expensive, not for small areas',
            tier: 'premium',
        },
        {
            name: 'Polyurethane (PU) Injection',
            description: 'Injected into existing cracks/leaks to expand and seal. Used for remedial waterproofing without hacking. Emergency leak repair.',
            cost: '$300–800/treatment area',
            pros: 'No hacking needed, expands into cracks, fast fix for active leaks',
            cons: 'Temporary fix (not permanent), expensive per treatment, specialist work only',
            tier: 'premium',
        },
    ],
    'Window Treatments': [
        {
            name: 'Curtain Track (Ceiling-mounted)',
            description: 'Aluminium or stainless steel track mounted in false ceiling or directly to slab. Supports sheer + blackout curtain combo.',
            cost: '$8–15/m (track), $15–50/m (fabric)',
            pros: 'Full fabric flexibility, elegant drape, ceiling-mount looks premium, adjustable fullness',
            cons: 'Collects dust, needs washing, takes up wall space when open, track can jam',
            tier: 'standard',
        },
        {
            name: 'Roller Blinds (Blackout/Sunscreen)',
            description: 'Single-roller blind in blackout or sunscreen mesh. Clean minimal look. Cheapest window treatment.',
            cost: '$5–12/sqm',
            pros: 'Cheapest, clean look, easy to operate, space-saving, many colours',
            cons: 'No texture/softness, edge light gaps, cheap look if thin fabric, limited stacking',
            tier: 'budget',
        },
        {
            name: 'Korean Day/Night Blind (Combi/Zebra)',
            description: 'Alternating sheer and opaque horizontal bands. Adjusts by shifting bands to control light and privacy. Very popular in SG.',
            cost: '$8–18/sqm',
            pros: 'Adjustable privacy + light, modern aesthetic, no separate sheer needed, compact',
            cons: 'Harder to clean, mechanism can jam, limited fabric options, can\'t fully block light',
            tier: 'standard',
        },
        {
            name: 'Timber / Faux Wood Venetian',
            description: 'Horizontal slat blinds in real timber (basswood) or PVC faux-wood. Tilt for light control. Classic look.',
            cost: '$10–25/sqm',
            pros: 'Classic look, precise light control, faux-wood is waterproof, durable',
            cons: 'Dust collector, noisy in wind, strings tangle, heavy (real wood)',
            tier: 'standard',
        },
        {
            name: 'Motorised Blinds / Curtains',
            description: 'Electric motor integration for any blind/curtain type. Controlled via remote, app, or voice (Alexa/Google). Brands: Somfy, Xiaomi Aqara.',
            cost: '+$150–400/window (motor cost)',
            pros: 'Smart home integration, timed schedules, hard-to-reach windows, wow-factor',
            cons: 'Expensive per window, battery/wiring needed, motor can fail, compatibility issues',
            tier: 'premium',
        },
    ],
    'Partitions': [
        {
            name: 'Brick Wall (Non-load-bearing)',
            description: 'Standard clay brick wall built on-site. 100mm (half-brick) or 200mm (full-brick). Plastered and painted. Most common traditional partition. Non-structural — does NOT bear load from above.',
            cost: '$18–30/sqm',
            pros: 'Solid feel, good sound insulation, can hang heavy items (shelves, TV), proven method',
            cons: 'Slow to build, wet trade (messy), heavy (check floor load), cannot bear structural load',
            tier: 'standard',
        },
        {
            name: 'Concrete Blockwork (Load-bearing option)',
            description: 'Hollow or solid concrete blocks (100/150/200mm). Can be reinforced with rebar/grout to become load-bearing. Used for structural walls, boundary walls, service risers.',
            cost: '$20–35/sqm',
            pros: 'Can be load-bearing (reinforced), fire-rated, excellent sound insulation, very strong',
            cons: 'Very heavy (check floor slab capacity), wet trade, slow, needs PE endorsement if load-bearing',
            tier: 'standard',
        },
        {
            name: 'Gypsum Board Stud Wall (Drywall)',
            description: 'Metal stud frame with gypsum board on both sides. Fast, lightweight, no wet works. Standard office/commercial partition. Non-load-bearing.',
            cost: '$8–15/sqm',
            pros: 'Fast to build, lightweight, clean (no wet work), easy to run wiring inside, relocatable',
            cons: 'Non-load-bearing, poor sound insulation (hollow), can\'t hold heavy items (>5kg needs toggle bolt), dents easily',
            tier: 'budget',
        },
        {
            name: 'Gypsum Board + Rockwool (Acoustic Rated)',
            description: 'Double-layer gypsum on metal stud with rockwool insulation infill. STC 45-55 sound rating. Used for bedrooms, studios, home offices. Non-load-bearing.',
            cost: '$15–25/sqm',
            pros: 'Good sound insulation (STC 45-55), still lightweight, configurable thickness',
            cons: 'Non-load-bearing, more expensive than single-layer, thicker profile, still limited hanging capacity',
            tier: 'standard',
        },
        {
            name: 'Glass Partition (Fixed/Frameless)',
            description: 'Tempered glass panels (10–12mm) in aluminium frame or frameless patch fittings. Popular for kitchens, studies. Non-load-bearing.',
            cost: '$25–60/sqm',
            pros: 'Light flow, open feel, modern aesthetic, easy to clean, frameless option is stunning',
            cons: 'Non-load-bearing, zero sound insulation, no privacy (unless frosted/fluted), fingerprints, expensive',
            tier: 'premium',
        },
        {
            name: 'Folding / Movable Partition',
            description: 'Multi-panel folding or sliding partition that can be stacked open. Aluminium frame with glass, wood, or fabric panels. Non-load-bearing.',
            cost: '$30–80/sqm',
            pros: 'Flexible space division, open when not needed, great for multi-purpose rooms',
            cons: 'Non-load-bearing, poor sound insulation, track maintenance, expensive, floor track can trip',
            tier: 'premium',
        },
        {
            name: 'Lightweight Concrete Panel (Hebel/ALC)',
            description: 'Autoclaved Lightweight Concrete panels (75/100mm). Pre-formed, light, fire-rated. Can be non-load-bearing or lightly load-bearing depending on thickness/reinforcement.',
            cost: '$12–22/sqm',
            pros: 'Lightweight, fire-rated, faster than brick, can hold moderate loads (with proper anchors)',
            cons: 'Needs specialist adhesive, crumbly edges, less robust than brick for heavy items',
            tier: 'standard',
        },
    ],
    'Plastering & Skim Coat': [
        {
            name: 'Cement Sand Plaster (Wet Plaster)',
            description: 'Traditional cement-sand mix (1:3 or 1:4 ratio) applied to brick/block walls in 12–20mm thickness. Creates flat base for painting. Requires skilled plasterer.',
            cost: '$4–8/sqm',
            pros: 'Strong, proven, good adhesion to brick/block, smooth finish achievable, affordable',
            cons: 'Wet trade (needs curing time), can crack, skill-dependent, messy, heavy',
            tier: 'standard',
        },
        {
            name: 'Skim Coat (2–3mm)',
            description: 'Thin polymer-modified plaster (2–3mm) applied over existing walls or ceilings to create a smooth, paint-ready surface. Used on new gypsum board, concrete, or old painted walls.',
            cost: '$2–4/sqm',
            pros: 'Smooth paint-ready finish, hides minor imperfections, thin application, fast',
            cons: 'Cannot fix major unevenness, cracks if substrate moves, needs proper surface prep',
            tier: 'standard',
        },
        {
            name: 'Self-Levelling Screed (Floor)',
            description: 'Polymer-modified cementitious compound poured onto floor to create perfectly level surface. Self-levels to ±2mm tolerance. Essential before vinyl/laminate overlay.',
            cost: '$3–6/sqm',
            pros: 'Perfectly level floor, fast cure (24h walkable), ideal prep for overlay flooring',
            cons: 'Cannot fix major height differences (>30mm), expensive for large areas, needs primer',
            tier: 'standard',
        },
        {
            name: 'Cement Screeding (Floor)',
            description: 'Traditional cement-sand floor screed (20–50mm) to level and raise floor. Multiple grades for drainage fall in wet areas. Needs 14–28 day cure.',
            cost: '$4–8/sqm',
            pros: 'Can fix major level differences, creates drainage fall, proven method, affordable',
            cons: 'Long cure time (14–28 days), heavy, wet trade, can crack if too thin',
            tier: 'standard',
        },
        {
            name: 'Bonding Agent / Plaster Primer',
            description: 'SBR (Styrene Butadiene Rubber) or PVA bonding liquid applied to smooth concrete surfaces before plastering to improve adhesion. Prevents plaster from delaminating.',
            cost: '$0.50–1.50/sqm',
            pros: 'Essential for adhesion, prevents plaster failure, cheap insurance, easy to apply',
            cons: 'Must wait for it to become tacky (not dry) before plastering, adds a step, not optional on smooth surfaces',
            tier: 'budget',
        },
    ],
    'Paint Types & Brands': [
        {
            name: 'Interior Emulsion / Latex (Matt)',
            description: 'Standard interior wall paint with flat/matt finish. Hides imperfections well. Brands: Nippon Odour-Less All-in-1, Dulux Ambiance, Jotun Majestic.',
            cost: '$25–45/5L tin, covers 50–60sqm/coat',
            pros: 'Hides wall imperfections, non-reflective, affordable, most colour options',
            cons: 'Marks and scuffs easily, harder to clean, not for high-traffic areas',
            tier: 'budget',
        },
        {
            name: 'Interior Emulsion (Eggshell/Satin)',
            description: 'Slight sheen finish — easier to clean than matt. Best balance of cleanability and appearance. Brands: Nippon Odour-Less Premium, Dulux Pentalite, Jotun Essence.',
            cost: '$35–55/5L tin',
            pros: 'Washable, better durability than matt, subtle sheen, good for living areas and bedrooms',
            cons: 'Shows wall imperfections more than matt, slightly more expensive',
            tier: 'standard',
        },
        {
            name: 'Interior Emulsion (Semi-Gloss/Gloss)',
            description: 'High-sheen finish for moisture-prone areas. Very durable and washable. Brands: Nippon Spot-Less, Dulux Wash & Wear.',
            cost: '$40–60/5L tin',
            pros: 'Most washable, moisture-resistant, durable, great for kitchens/bathrooms/trim',
            cons: 'Shows every wall imperfection, glossy look not for all tastes, needs smooth wall prep',
            tier: 'standard',
        },
        {
            name: 'Anti-Mould / Antibacterial Paint',
            description: 'Paint with built-in anti-fungal and antibacterial agents. Essential for bathrooms, kitchens, and humid SG climate. Brands: Nippon VirusGuard, Dulux EasyCare.',
            cost: '$50–80/5L tin',
            pros: 'Prevents mould growth, antibacterial, washable, essential for SG humidity',
            cons: 'More expensive, limited colour range in some brands, needs recoating every 3-5 years',
            tier: 'standard',
        },
        {
            name: 'Textured / Feature Paint',
            description: 'Specialty paint creating texture effects — suede, concrete, sand, metallic. Brands: Nippon Momento, Dulux Ambiance Special Effects, Asian Paints Royale Play.',
            cost: '$60–120/5L tin + specialist applicator',
            pros: 'Unique feature wall effect, hides imperfections, no wallpaper needed, dramatic look',
            cons: 'Expensive, needs trained applicator, hard to repaint over, limited to accent walls',
            tier: 'premium',
        },
        {
            name: 'Primer / Sealer',
            description: 'Base coat applied before topcoat. Seals porous surfaces, blocks stains, improves adhesion. Types: alkali-resistant (new walls), stain-block (old walls), bonding primer (tiles).',
            cost: '$20–40/5L tin',
            pros: 'Essential for proper adhesion, blocks rising stains, evens out absorption, extends topcoat life',
            cons: 'Extra step and cost, different primers for different substrates, must be matched correctly',
            tier: 'budget',
        },
        {
            name: 'Exterior Paint (Weatherproof)',
            description: 'UV-resistant, rain-proof exterior paint. Flexible to resist cracking. Brands: Nippon Weatherbond, Dulux Weathershield, Jotun Jotashield.',
            cost: '$50–80/5L tin',
            pros: 'UV-resistant, waterproof, flexible (crack-resistant), 5–8 year lifespan, fade-resistant',
            cons: 'More expensive, limited to exterior use, fewer decorative finishes',
            tier: 'standard',
        },
    ],
    'Surface Prep & Adhesives': [
        {
            name: 'Tile Adhesive (Cement-based)',
            description: 'Pre-mixed or powder cement-based adhesive for bonding tiles to walls/floors. Types: C1 (standard), C2 (improved), C2TE (deformable). Brands: Mapei, Sika, Laticrete.',
            cost: '$15–35/25kg bag (covers 4–6sqm)',
            pros: 'Industry standard, strong bond, suitable for most tiles, available everywhere',
            cons: 'Mixing required (powder), working time limited, needs clean substrate, heavy bags',
            tier: 'standard',
        },
        {
            name: 'Large Format Tile Adhesive (C2TE-S2)',
            description: 'High-flex adhesive for large format tiles (600×600 and above). Deformable to handle thermal movement. Mandatory for tiles >600mm. Brands: Mapei Keraflex Maxi, Sika Ceram-255.',
            cost: '$25–50/25kg bag (covers 3–4sqm)',
            pros: 'Prevents cracking/tenting of large tiles, high flexibility, handles substrate movement',
            cons: 'Expensive, must use notched trowel (full-back buttering), slower application',
            tier: 'premium',
        },
        {
            name: 'Tile Grout (Cement vs Epoxy)',
            description: 'Cement grout: standard, $8–15/kg. Epoxy grout (Mapei Kerapoxy, Laticrete Spectralock): stain-proof, waterproof, $30–60/kg. Epoxy for wet areas and light-coloured grout.',
            cost: '$8–15/kg (cement), $30–60/kg (epoxy)',
            pros: 'Cement: cheap, easy to apply. Epoxy: stain-proof, waterproof, no yellowing, colour-consistent',
            cons: 'Cement: stains, cracks. Epoxy: expensive, very hard to apply (fast cure), needs specialist',
            tier: 'standard',
        },
        {
            name: 'Contact Adhesive (Laminate/Formica)',
            description: 'Solvent-based or water-based contact glue for bonding laminates, veneers to substrates. Both surfaces coated, dried, then pressed. Brands: Dunlop, Bostik.',
            cost: '$15–30/L',
            pros: 'Instant bond on contact, works on large surfaces, industry standard for laminates',
            cons: 'Fumes (solvent-based), one-shot positioning (no adjustment), flammable, needs ventilation',
            tier: 'standard',
        },
        {
            name: 'Construction Sealant (Silicone/PU)',
            description: 'Flexible gap sealant for joints. Silicone: waterproof (bathroom). PU: paintable (general). Hybrid: best of both. Brands: Sika, Dow Corning, Bostik.',
            cost: '$5–15/tube (280ml)',
            pros: 'Flexible (absorbs movement), waterproof (silicone), paintable (PU), essential for finishing',
            cons: 'Silicone cannot be painted, cheap silicone yellows/mould, PU degrades in UV, needs gun',
            tier: 'budget',
        },
        {
            name: 'Wall Preparation (Hacking + Plastering)',
            description: 'Full wall prep sequence: hack existing finish → apply bonding agent → plaster/skim coat → sand smooth → prime → paint. Each step affects final quality.',
            cost: '$8–18/sqm (full hack-to-paint)',
            pros: 'Proper prep = perfect finish, prevents peeling/cracking, professional result',
            cons: 'Expensive total cost, multi-day process (curing between steps), messy, cannot rush',
            tier: 'standard',
        },
    ],
    'Scaffolding': [
        {
            name: 'Tubular Steel Scaffolding (Standard)',
            description: 'Traditional steel tube-and-coupler scaffolding erected on-site. Most common for HDB/condo exterior and interior high-ceiling work. Requires MOM-licensed scaffold erector for >4m height.',
            cost: '$3–6/sqm/month (rental)',
            pros: 'Versatile (any configuration), strong, suits irregular building shapes, proven',
            cons: 'Slow to erect/dismantle, heavy, needs licensed erector, blocks access during use',
            tier: 'standard',
        },
        {
            name: 'Mobile Scaffold Tower',
            description: 'Lightweight aluminium tower on lockable castors. Self-erecting for <4m height. Used for interior painting, ceiling work, light fixture installation.',
            cost: '$50–150/day (rental)',
            pros: 'Mobile (repositionable), fast setup, no specialist needed (<4m), lightweight',
            cons: 'Limited height (max ~8m), small working platform, unstable on uneven floors, easy to tip',
            tier: 'budget',
        },
        {
            name: 'System / Modular Scaffolding (Ringlock/Cuplock)',
            description: 'Pre-engineered modular scaffold with quick-lock connections. Faster to erect than tubular. Used for large-scale residential and commercial projects.',
            cost: '$4–8/sqm/month (rental)',
            pros: 'Faster erection (50% quicker than tubular), standardised safety, cleaner look, stronger joints',
            cons: 'More expensive, less flexible configuration, heavy components, specialist crew needed',
            tier: 'premium',
        },
        {
            name: 'Suspended Scaffold / Gondola',
            description: 'Motorised or manual platform suspended from roof by wire ropes. Used for high-rise exterior work (painting, cladding, window installation). Requires MOM permit.',
            cost: '$200–500/day (rental + operator)',
            pros: 'Access any height (unlimited), no ground obstruction, good for high-rise exterior',
            cons: 'Expensive, MOM permit required, weather-dependent, needs roof anchor points, specialist operator',
            tier: 'premium',
        },
        {
            name: 'Ladder / Platform (Simple Access)',
            description: 'A-frame ladder, extension ladder, or hop-up platform for low-level work (<3m). No permit needed. Standard for most interior residential renovation.',
            cost: '$20–80 (purchase) or included in contractor quote',
            pros: 'Cheapest, simplest, no permit, portable, every contractor has them',
            cons: 'Very limited height, safety risk (falls), small work area, fatigue from climbing',
            tier: 'budget',
        },
    ],
    'Lighting': [
        {
            name: 'Cove Lighting (LED Strip)',
            description: 'LED strip hidden in L-box/pelmet recess creating indirect ambient glow. Warm white (2700-3000K) most popular in SG homes. Brands: Philips, Osram, Megaman.',
            cost: '$5–15/m (strip + driver)',
            pros: 'Creates ambience, hides light source, even wash, dimmable, energy-efficient',
            cons: 'Needs false ceiling (L-box/pelmet), LED failure means strip replacement, driver can buzz',
            tier: 'standard',
        },
        {
            name: 'Downlight (Recessed)',
            description: 'Recessed ceiling light (75mm/100mm/150mm cut-out). LED types: fixed, adjustable/gimbal, anti-glare (deep recess). Most common residential ceiling light in SG.',
            cost: '$15–60/unit (supply), $20–40/point (install)',
            pros: 'Clean flush look, focused light, huge variety, energy-efficient LED, dimmable options',
            cons: 'Needs false ceiling depth (min 80mm), too many = ceiling full of holes, glare if untreated',
            tier: 'standard',
        },
        {
            name: 'Track Light / Spot',
            description: 'Surface-mounted track with adjustable spotlight heads. Can be repositioned along track. Popular for artwork, retail, and feature lighting.',
            cost: '$80–250/track set (1.5m + 3 heads)',
            pros: 'Adjustable direction, no false ceiling needed, flexible layout, easy to add/move heads',
            cons: 'Industrial look, visible track, limited beam spread, dust on track',
            tier: 'standard',
        },
        {
            name: 'Pendant Light',
            description: 'Suspended decorative light fixture on cord/chain/rod from ceiling. Statement piece for dining tables, kitchen islands, entryways. Huge design variety.',
            cost: '$50–500+/unit (design-dependent)',
            pros: 'Design statement, defines zones (dining/island), huge style range, can be grouped',
            cons: 'Fixed position, head-bump risk if too low, needs ceiling point, dust collects',
            tier: 'standard',
        },
        {
            name: 'Linear LED Profile (Aluminium)',
            description: 'Extruded aluminium channel with diffused LED strip inside. Surface-mount, recessed, or suspended. Creates clean architectural lighting lines.',
            cost: '$15–40/m (profile + LED)',
            pros: 'Architectural clean lines, even diffused light, recessed = seamless, very modern',
            cons: 'Expensive for long runs, needs precise carpentry/ceiling work, LED not user-replaceable',
            tier: 'premium',
        },
        {
            name: 'Ceiling Fan with Light',
            description: 'Combined ceiling fan and light fixture. DC motor types are quiet and energy-efficient. Brands: KDK, Fanco, Haiku. Requires reinforced ceiling point.',
            cost: '$200–800/unit (fan + installation)',
            pros: 'Air circulation + lighting in one, reduces aircon use, DC motor = quiet + low energy',
            cons: 'Needs reinforced ceiling mount, clearance requirements, vibration risk, cleaning blades',
            tier: 'standard',
        },
        {
            name: 'Wall Sconce / Wall Washer',
            description: 'Wall-mounted decorative or functional light. Up-light, down-light, or both. Used for corridors, bedside, feature walls. Brands: Philips, Eglo.',
            cost: '$40–200/unit',
            pros: 'Ambient layered lighting, decorative, space-saving (no table lamp needed), accent lighting',
            cons: 'Needs concealed wiring (plan early), fixed position, limited light output',
            tier: 'standard',
        },
        {
            name: 'Floor Lamp / Standing Lamp',
            description: 'Free-standing plug-in lamp. No installation needed. Used for reading nooks, living room corners. Brands: IKEA, FLOS, Artemide.',
            cost: '$50–500+/unit',
            pros: 'No installation, instantly relocatable, adds layered lighting, design accent',
            cons: 'Takes floor space, cord management, can tip over, not integrated into design',
            tier: 'budget',
        },
        {
            name: 'Under-Cabinet LED Strip',
            description: 'LED strip or puck lights mounted under kitchen upper cabinets or vanity mirrors. Provides task lighting for countertops. Often 3000-4000K for work areas.',
            cost: '$3–10/m (strip) or $15–30/puck',
            pros: 'Essential task lighting, eliminates shadows on countertop, easy retrofit, energy-efficient',
            cons: 'Visible strip/wire if not properly concealed, driver placement, can yellow over time',
            tier: 'budget',
        },
    ],
};

const COMPONENT_CATEGORIES = Object.keys(CABINET_COMPONENTS);

interface MaterialConfiguratorProps {
    /** Current line items from the quote to show configurable materials for */
    onMaterialChange?: (itemType: string, newOption: MaterialOption) => void;
}

export default function MaterialConfigurator({ onMaterialChange }: MaterialConfiguratorProps) {
    const [activeTab, setActiveTab] = useState<'materials' | 'metals' | 'parts'>('materials');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activeMetalUsage, setActiveMetalUsage] = useState<string | null>(null);
    const [activePartCat, setActivePartCat] = useState<string | null>(null);
    const [selectedTiers, setSelectedTiers] = useState<Record<string, MaterialTier>>({});

    const categoryKeys = useMemo(() => Object.keys(MATERIAL_OPTIONS), []);

    const categoryLabels: Record<string, string> = {
        wall_tiling: '🧱 Wall Tiles',
        floor_tiling: '🪨 Floor Tiles',
        vinyl_flooring: '🪵 Vinyl / Timber',
        countertop_quartz: '🔲 Countertop',
        base_cabinet: '🗄️ Base Cabinets',
        upper_cabinet: '🗄️ Upper Cabinets',
        wardrobe: '👔 Wardrobes',
        painting: '🎨 Paint',
        aircon_system: '❄️ Air-con',
        wc: '🚽 WC / Toilet',
        shower_screen: '🚿 Shower Screen',
        vanity_basin: '🪞 Vanity',
        bedroom_door: '🚪 Doors',
    };

    const metalUsageKeys = Object.keys(METAL_BY_USAGE);

    const tierColor: Record<MaterialTier, string> = {
        budget: 'border-green-300 bg-green-50',
        standard: 'border-blue-300 bg-blue-50',
        premium: 'border-purple-300 bg-purple-50',
        luxury: 'border-amber-300 bg-amber-50',
    };

    const tierBadge: Record<MaterialTier, string> = {
        budget: 'bg-green-100 text-green-700',
        standard: 'bg-blue-100 text-blue-700',
        premium: 'bg-purple-100 text-purple-700',
        luxury: 'bg-amber-100 text-amber-700',
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">🔧 Material Configurator</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                    Click any category to compare material tiers side-by-side
                </p>
            </div>

            {/* Tabs: Materials | Metals | Cabinet Parts */}
            <div className="flex border-b border-gray-100">
                <button
                    onClick={() => setActiveTab('materials')}
                    className={`flex-1 py-2.5 text-xs font-medium transition-colors ${activeTab === 'materials'
                        ? 'text-violet-700 border-b-2 border-violet-500 bg-violet-50/50'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    🏗️ Materials
                </button>
                <button
                    onClick={() => setActiveTab('metals')}
                    className={`flex-1 py-2.5 text-xs font-medium transition-colors ${activeTab === 'metals'
                        ? 'text-violet-700 border-b-2 border-violet-500 bg-violet-50/50'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    ⚙️ Metal Guide
                </button>
                <button
                    onClick={() => setActiveTab('parts')}
                    className={`flex-1 py-2.5 text-xs font-medium transition-colors ${activeTab === 'parts'
                        ? 'text-violet-700 border-b-2 border-violet-500 bg-violet-50/50'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    🧩 Build Specs
                </button>
            </div>

            {/* Materials tab content */}
            {activeTab === 'materials' && (
                <div className="p-4">
                    {/* Category pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {categoryKeys.map(key => (
                            <button
                                key={key}
                                onClick={() => setActiveCategory(activeCategory === key ? null : key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${activeCategory === key
                                    ? 'bg-violet-100 border-violet-300 text-violet-700 shadow-sm'
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-violet-200'
                                    }`}
                            >
                                {categoryLabels[key] || key}
                            </button>
                        ))}
                    </div>

                    {/* Selected category options */}
                    {activeCategory && MATERIAL_OPTIONS[activeCategory] && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                {categoryLabels[activeCategory] || activeCategory} — Options
                            </h4>
                            {MATERIAL_OPTIONS[activeCategory].map((opt, i) => {
                                const isSelected = selectedTiers[activeCategory] === opt.tier;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setSelectedTiers(prev => ({ ...prev, [activeCategory!]: opt.tier }));
                                            onMaterialChange?.(activeCategory!, opt);
                                        }}
                                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${isSelected ? tierColor[opt.tier] + ' shadow-sm' : 'border-gray-100 hover:border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${tierBadge[opt.tier]}`}>
                                                    {opt.tier}
                                                </span>
                                                <span className="text-sm font-medium text-gray-800">{opt.label}</span>
                                                {opt.brand && (
                                                    <span className="text-xs text-gray-400">({opt.brand})</span>
                                                )}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700">
                                                S${opt.materialRate}/unit
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{opt.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {!activeCategory && (
                        <p className="text-center text-sm text-gray-400 py-6">
                            Select a category above to compare material options
                        </p>
                    )}
                </div>
            )}

            {/* Metal Guide tab content */}
            {activeTab === 'metals' && (
                <div className="p-4">
                    {/* Metal usage pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {metalUsageKeys.map(key => (
                            <button
                                key={key}
                                onClick={() => setActiveMetalUsage(activeMetalUsage === key ? null : key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${activeMetalUsage === key
                                    ? 'bg-slate-700 border-slate-700 text-white shadow-sm'
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-slate-300'
                                    }`}
                            >
                                {key}
                            </button>
                        ))}
                    </div>

                    {/* Metal options for selected usage */}
                    {activeMetalUsage && METAL_BY_USAGE[activeMetalUsage] && (
                        <div>
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                                {activeMetalUsage} — Metal options
                            </h4>
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="text-left text-gray-400 border-b border-gray-100">
                                        <th className="py-2 font-medium">Metal</th>
                                        <th className="py-2 font-medium">Grade</th>
                                        <th className="py-2 font-medium">Finish</th>
                                        <th className="py-2 font-medium">Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {METAL_BY_USAGE[activeMetalUsage].map((m, i) => (
                                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-2.5 font-medium text-gray-800">{m.metal}</td>
                                            <td className="py-2.5 text-gray-600">{m.grade}</td>
                                            <td className="py-2.5 text-gray-600">{m.finish}</td>
                                            <td className="py-2.5 text-gray-500">{m.note}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!activeMetalUsage && (
                        <p className="text-center text-sm text-gray-400 py-6">
                            Select a usage context above to see recommended metals
                        </p>
                    )}
                </div>
            )}

            {/* Cabinet Parts tab content */}
            {activeTab === 'parts' && (
                <div className="p-4">
                    {/* Part category pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {COMPONENT_CATEGORIES.map(key => (
                            <button
                                key={key}
                                onClick={() => setActivePartCat(activePartCat === key ? null : key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${activePartCat === key
                                    ? 'bg-orange-100 border-orange-300 text-orange-700 shadow-sm'
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-orange-200'
                                    }`}
                            >
                                {key}
                            </button>
                        ))}
                    </div>

                    {/* Component list for selected category */}
                    {activePartCat && CABINET_COMPONENTS[activePartCat] && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                {activePartCat} — Options
                            </h4>
                            {CABINET_COMPONENTS[activePartCat].map((part, i) => (
                                <div
                                    key={i}
                                    className={`p-3 rounded-lg border-2 transition-all ${tierColor[part.tier]}`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${tierBadge[part.tier]}`}>
                                                {part.tier}
                                            </span>
                                            <span className="text-sm font-medium text-gray-800">{part.name}</span>
                                        </div>
                                        <span className="text-xs font-semibold text-gray-600">{part.cost}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-2">{part.description}</p>
                                    <div className="flex gap-3 text-[11px]">
                                        <span className="text-green-700">✓ {part.pros}</span>
                                    </div>
                                    <div className="flex gap-3 text-[11px] mt-0.5">
                                        <span className="text-red-600">✗ {part.cons}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!activePartCat && (
                        <p className="text-center text-sm text-gray-400 py-6">
                            Select a component type to see all options with pros/cons
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

