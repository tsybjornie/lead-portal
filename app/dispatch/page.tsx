'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus, MapPin, Activity, Plus, ChevronDown, ChevronRight, Send } from 'lucide-react';
import RoofNav from '@/components/RoofNav';
import RatingModal, { CRITERIA } from '@/components/RatingModal';
import { SEED_INDEX } from '../../src/logic/PriceIndexTracker';
import { LABOUR_BENCHMARKS, MATERIAL_CATALOG, mmToFeet, sqmToSqft } from '../../src/logic/AutoPricingEngine';

// ============================================================
// TRADE-SPECIFIC DISPATCH SPECS
// ============================================================

interface SpecField {
    label: string;
    type: 'text' | 'select' | 'number' | 'toggle' | 'textarea';
    options?: string[];
    placeholder?: string;
    unit?: string;
    required?: boolean;
}

interface SpecCategory {
    category: string;
    fields: SpecField[];
}

const TRADE_SPECS: Record<string, SpecCategory[]> = {
    'Hacking & Demolition': [
        {
            category: 'Demolition Scope', fields: [
                { label: 'Hacking scope', type: 'select', options: ['Full unit hack', 'Partial hack (specific areas)', 'No hacking — overlay only'], required: true },
                { label: 'Walls to hack', type: 'textarea', placeholder: 'Which walls, full or half-height, load-bearing check done?', required: true },
                { label: 'Floor hacking', type: 'select', options: ['Full floor hack', 'Bathroom floors only', 'Kitchen floor only', 'No floor hacking'] },
                { label: 'Ceiling hacking', type: 'select', options: ['Remove false ceiling', 'Remove partial ceiling', 'No ceiling hacking'] },
                { label: 'Load-bearing wall check', type: 'select', options: ['Confirmed — not load-bearing', 'PE endorsement obtained', 'Not applicable', 'TBC — needs PE check'], required: true },
                { label: 'Debris disposal', type: 'select', options: ['Contractor arranges', 'Owner arranges', 'HDB bin chute rules apply'] },
                { label: 'Noise/time restrictions', type: 'textarea', placeholder: 'HDB renovation hours, condo management rules, neighbor agreements' },
            ]
        },
    ],
    'Carpentry': [
        {
            category: 'Hardware', fields: [
                { label: 'Hinge type', type: 'select', options: ['Blum Clip-top', 'Hettich Sensys', 'Hafele Metalla', 'Generic soft-close', 'Other'], required: true },
                { label: 'Opening angle', type: 'select', options: ['110°', '155°', '170°'], required: true },
                { label: 'Soft-close', type: 'toggle', required: true },
                { label: 'Drawer system', type: 'select', options: ['Blum Tandembox', 'Blum Movento', 'Hettich InnoTech', 'Generic slides', 'N/A'], required: true },
                { label: 'Full extension', type: 'toggle' },
                { label: 'Drawer load rating', type: 'select', options: ['30kg', '50kg', '65kg'] },
            ]
        },
        {
            category: 'Handles & Finishing', fields: [
                { label: 'Handle type', type: 'select', options: ['Recessed / J-profile', 'CNC routed grip', 'Surface-mount pull', 'Knob', 'Push-to-open', 'None'], required: true },
                { label: 'Handle finish', type: 'select', options: ['Matt black', 'Brushed brass', 'Satin nickel', 'Chrome', 'Stainless steel', 'Custom'] },
                { label: 'Handle length', type: 'text', placeholder: 'e.g. 160mm / 256mm' },
                { label: 'Edge banding', type: 'select', options: ['ABS 0.4mm', 'ABS 1mm', 'ABS 2mm', 'PVC', 'Veneer', 'None'], required: true },
                { label: 'Edge color code', type: 'text', placeholder: 'Match laminate code' },
            ]
        },
        {
            category: 'Panel & Material', fields: [
                { label: 'Carcass material', type: 'select', options: ['Plywood', 'MDF', 'MDF (moisture resistant MR)', 'Particle board / chipboard', 'Blockboard', 'Melamine faced board', 'OSB', 'Solid timber'], required: true },
                { label: 'Plywood grade', type: 'select', options: ['A/A (premium both faces)', 'A/B (one premium)', 'B/BB (standard carpentry)', 'BB/BB (good both faces)', 'BB/CC (one rough — hidden)', 'Marine grade (waterproof glue)', 'N/A — not plywood'] },
                { label: 'MDF grade', type: 'select', options: ['HDF (high density — heavy duty)', 'Standard MDF', 'Lightweight MDF (budget)', 'MR MDF (moisture resistant)', 'Fire-rated MDF', 'N/A — not MDF'] },
                { label: 'Particle board density', type: 'select', options: ['High density (heavy duty)', 'Standard density', 'Low density (budget)', 'Moisture resistant', 'N/A — not particle board'] },
                { label: 'Panel thickness', type: 'select', options: ['9mm', '12mm', '15mm', '18mm', '25mm'] },
                { label: 'Surface finish', type: 'select', options: ['HPL — high pressure laminate (Formica/Arborite)', 'LPL — low pressure laminate (budget)', 'Melamine paper (cheapest)', 'Veneer (real wood 0.5mm)', 'Lacquer / spray paint (on MDF)', 'Acrylic / PMMA (high gloss)', 'PET film (matte / soft touch)', 'Thermofoil / PVC wrap', 'Raw timber — oiled or waxed', 'N/A'], required: true },
                { label: 'Laminate brand & code', type: 'text', placeholder: 'e.g. Formica F2253 / Arborite P421 / Lamitak' },
                {
                    label: 'Veneer species', type: 'select', options: [
                        '── POPULAR (SG/MY) ──',
                        'Oak (White) — USA, Janka 1360, light grain',
                        'Oak (Red) — USA, Janka 1290, warm pink-red',
                        'Walnut (American) — USA, Janka 1010, rich dark brown',
                        'Walnut (European) — France, Janka 1220, greyish brown',
                        'Teak — Myanmar/Indonesia, Janka 1070, golden oily',
                        'Ash — USA/Europe, Janka 1320, blonde, prominent grain',
                        'Maple (Hard) — Canada, Janka 1450, pale cream',
                        'Cherry (American) — USA, Janka 950, warm reddish, darkens with age',
                        'Nyatoh — Malaysia, Janka 980, budget reddish',
                        'Meranti — Malaysia, Janka 800, reddish, common door frame',
                        '── PREMIUM ──',
                        'Ebony — Africa/Asia, Janka 3220, jet black, rare',
                        'Rosewood (Indian) — India, Janka 3170, dark with swirls',
                        'Rosewood (Santos) — Bolivia, Janka 2200, dark chocolate',
                        'Wenge — Congo, Janka 1630, dark espresso, coarse grain',
                        'Zebrawood — West Africa, Janka 1575, striped light/dark',
                        'Padauk — Africa, Janka 2170, vivid orange-red (fades)',
                        'Sapele — Africa, Janka 1410, mahogany alternative',
                        'Jarrah — Australia, Janka 1910, deep red-brown',
                        '── JAPANESE ──',
                        'Hinoki (Japanese Cypress) — Japan, Janka 580, pale blonde, citrus scent, spa/bath',
                        'Sugi (Japanese Cedar) — Japan, Janka 420, soft, aromatic, shou sugi ban',
                        'Kiri (Paulownia) — Japan, Janka 300, ultralight, tansu drawers',
                        '── SE ASIAN ──',
                        'Chengal — Malaysia, Janka 1750, ironwood, outdoor grade',
                        'Balau (Selangan Batu) — Malaysia, Janka 1900, heavy outdoor decking',
                        'Merbau (Kwila) — Indonesia, Janka 1925, dark red, decking',
                        'Rubberwood — Malaysia/Thailand, Janka 960, budget solid wood',
                        'Jelutong — Malaysia, Janka 390, carving wood, very soft',
                        'Kapur — Malaysia, Janka 1680, structural timber',
                        'Keruing — Malaysia, Janka 1430, heavy structural',
                        '── BAMBOO ──',
                        'Bamboo (Strand-woven) — China, Janka 3000+, harder than most hardwoods',
                        'Bamboo (Horizontal) — China, Janka 1180, shows knuckle pattern',
                        'Bamboo (Vertical) — China, Janka 1380, fine grain',
                        '── RECLAIMED / SPECIALTY ──',
                        'Reclaimed teak — Indonesia, Janka 1070, aged/weathered look',
                        'Shou sugi ban (charred cedar) — Japan, burnt black finish',
                        'Driftwood / salvaged — varies, rustic character',
                        '── N/A ──',
                        'N/A — laminate finish',
                    ]
                },
                {
                    label: 'Solid timber species', type: 'select', options: [
                        '── SOFTWOOD (Low Janka — furniture, trim) ──',
                        'Pine (Radiata) — NZ, Janka 570, budget, knots',
                        'Pine (Southern Yellow) — USA, Janka 870, stronger pine',
                        'Spruce — Europe, Janka 490, light construction',
                        'Western Red Cedar — Canada, Janka 350, outdoor trim, aromatic',
                        'Hinoki — Japan, Janka 580, spa/bath, citrus scent',
                        'Sugi (Cedar) — Japan, Janka 420, shou sugi ban, light',
                        '── MEDIUM HARDWOOD (Janka 800-1200) ──',
                        'Rubberwood — MY/TH, Janka 960, budget solid wood',
                        'Nyatoh — Malaysia, Janka 980, budget furniture',
                        'Cherry — USA, Janka 950, fine furniture, ages beautifully',
                        'Walnut — USA, Janka 1010, premium dark, live-edge tables',
                        'Teak — MY/Indonesia, Janka 1070, outdoor king, oily',
                        'Bamboo (Horizontal) — China, Janka 1180, eco alternative',
                        '── HARD HARDWOOD (Janka 1200-1800) ──',
                        'Oak (White) — USA, Janka 1360, most popular grain',
                        'Oak (Red) — USA, Janka 1290, warm pinkish tone',
                        'Ash — USA, Janka 1320, Scandi look, very durable',
                        'Maple (Hard) — Canada, Janka 1450, basketball courts',
                        'Beech — Europe, Janka 1300, fine grain, steambend',
                        'Sapele — Africa, Janka 1410, mahogany look for less',
                        'Chengal — Malaysia, Janka 1750, ironwood decking',
                        '── VERY HARD (Janka 1800+) ──',
                        'Merbau — Indonesia, Janka 1925, red decking staple',
                        'Balau — Malaysia, Janka 1900, bulletproof decking',
                        'Jarrah — Australia, Janka 1910, deep red outdoor',
                        'Ipe (Ironwood) — Brazil, Janka 3510, hardest commercial wood',
                        'Bamboo (Strand-woven) — China, Janka 3000+, extreme hardness',
                        'Cumaru (Brazilian Teak) — Brazil, Janka 3540, ultra-durable',
                        '── EXOTIC ──',
                        'Ebony — Africa, Janka 3220, jet black, rare',
                        'Padauk — Africa, Janka 2170, vivid orange (fades brown)',
                        'Purpleheart — South America, Janka 2520, turns purple on exposure',
                        'Zebrawood — West Africa, Janka 1575, dramatic stripes',
                        'Bocote — Mexico, Janka 2010, wild dark grain',
                        'Lignum Vitae — Caribbean, Janka 4500, hardest wood on earth',
                        '── LIVE EDGE / SLAB ──',
                        'Acacia (Rain Tree) — Thailand, Janka 1170, popular slab tables',
                        'Suar (Monkey Pod) — Indonesia, Janka 900, massive live-edge slabs',
                        'Camphor — SG/MY, Janka 1200, local heritage reclaimed',
                        '── N/A ──',
                        'N/A — engineered / no solid timber',
                    ]
                },
                { label: 'E-rating (formaldehyde)', type: 'select', options: ['E0 (lowest emission)', 'E1 (standard)', 'E2', 'Not specified'] },
            ]
        },
        {
            category: 'CNC & Special', fields: [
                { label: 'CNC required', type: 'toggle' },
                { label: 'CNC profile type', type: 'text', placeholder: 'e.g. V-groove, channel, pegboard, fluted panel, custom routing' },
                { label: 'Internal fittings', type: 'textarea', placeholder: 'Pull-out baskets, lazy susan, shoe rack inserts, cutlery trays, etc.' },
            ]
        },
    ],
    'Countertop': [
        {
            category: 'Countertop Specification', fields: [
                { label: 'Countertop material', type: 'select', options: ['Quartz (engineered)', 'Granite (natural)', 'Marble (natural)', 'Sintered stone (Dekton / Neolith)', 'Solid surface (Corian / Hi-Macs)', 'Compact laminate', 'Stainless steel', 'Concrete'], required: true },
                { label: 'Porosity', type: 'select', options: ['Non-porous (quartz / sintered / solid surface)', 'Porous — sealing required (marble / granite / concrete)'] },
                { label: 'Brand', type: 'text', placeholder: 'e.g. Caesarstone, Silestone, Dekton, Corian, local quarry' },
                { label: 'Color / code', type: 'text', placeholder: 'e.g. Caesarstone 5143 White Attica' },
                { label: 'Thickness', type: 'select', options: ['12mm', '15mm', '20mm', '30mm'] },
                { label: 'Edge profile', type: 'select', options: ['Square / eased', 'Beveled', 'Bullnose', 'Ogee', 'Waterfall', 'Mitered'] },
                { label: 'Backsplash', type: 'select', options: ['Same material upstand', 'Tile backsplash', 'Glass backsplash (back-painted)', 'Full-height slab', 'None'] },
                { label: 'Sink cutout', type: 'select', options: ['Undermount', 'Top-mount / drop-in', 'Integrated', 'N/A'] },
                { label: 'Hob cutout', type: 'text', placeholder: 'Hob model & cutout dimensions from supplier — e.g. Bosch PPI82560 (560x490mm)' },
                { label: 'Joint location', type: 'text', placeholder: 'For L-shape / U-shape: where the joint falls, mitered or butt joint' },
                { label: 'Drip groove', type: 'select', options: ['Front drip groove', 'Front + side drip groove', 'No drip groove'] },
                { label: 'Waterfall side panel', type: 'select', options: ['One side waterfall', 'Both sides waterfall', 'No waterfall', 'Island waterfall'] },
                { label: 'Fabricator', type: 'text', placeholder: 'Stone fabricator / supplier name' },
                { label: 'Silicone type', type: 'select', options: ['Neutral cure (safe for all surfaces)', 'Sanitary grade (anti-mould — wet areas)', 'Food grade (kitchen countertop)', 'Acetoxy (budget — not for stone)'] },
                { label: 'Silicone color', type: 'select', options: ['Clear', 'White', 'Black', 'Grey', 'Match countertop'] },
            ]
        },
    ],
    'Doors & Gate': [
        {
            category: 'Room Doors', fields: [
                { label: 'Door supplier', type: 'text', placeholder: 'e.g. Siong Door, Lamex, Keng Hua, or custom by carpenter' },
                { label: 'Room door type', type: 'select', options: ['Solid core', 'Solid timber', 'Hollow core', 'HDF moulded', 'Veneer', 'Laminate', 'Flush door', 'Ghost door (hidden frame)', 'Slide & swing', 'Bi-fold', 'Barn door'], required: true },
                { label: 'Door finish', type: 'select', options: ['Paint grade (white)', 'Laminate match', 'Veneer', 'Lacquer', 'Natural wood'] },
                { label: 'Door hardware', type: 'select', options: ['Lever handle', 'Knob', 'Flush pull (sliding)', 'Push-pull', 'Smart lock'] },
                { label: 'Hardware finish', type: 'select', options: ['Matt black', 'Satin nickel', 'Chrome', 'Brushed brass'] },
                { label: 'Door closer', type: 'select', options: ['Soft-close mechanism', 'Hydraulic closer', 'None'] },
                { label: 'Bathroom door', type: 'select', options: ['Aluminium bi-fold', 'Aluminium slide', 'Timber (waterproof)', 'PVC'] },
            ]
        },
        {
            category: 'Main Door & Gate', fields: [
                { label: 'Main door type', type: 'select', options: ['HDB fire-rated', 'Veneer overlay', 'Laminate overlay', 'Solid timber', 'Custom'], required: true },
                { label: 'Main door finish', type: 'text', placeholder: 'Laminate code / veneer species / paint color' },
                { label: 'Digital lock', type: 'select', options: ['Samsung', 'Yale', 'Hafele', 'Igloohome', 'Existing / N/A'] },
                { label: 'Lock type', type: 'select', options: ['Push-pull', 'Lever', 'Deadbolt + handle', 'Fingerprint only'] },
                { label: 'Main gate type', type: 'select', options: ['Mild steel', 'Wrought iron', 'Aluminium', 'Auto-gate (landed)', 'Sliding auto-gate (landed)', 'None / existing'] },
                { label: 'Gate finish', type: 'select', options: ['Powder coat (matt black)', 'Powder coat (white)', 'Powder coat (custom)', 'Raw metal'] },
                { label: 'Gate design', type: 'text', placeholder: 'Vertical bars / horizontal slats / laser-cut pattern / mesh' },
            ]
        },
    ],
    'Electrical': [
        {
            category: 'Distribution Board', fields: [
                { label: 'DB box size', type: 'select', options: ['8-way', '12-way', '16-way', '24-way'], required: true },
                { label: 'DB brand', type: 'select', options: ['Schneider', 'Hager', 'ABB', 'Legrand', 'Generic'] },
                { label: 'RCCB required', type: 'toggle', required: true },
                { label: 'Surge protection', type: 'toggle' },
            ]
        },
        {
            category: 'Socket & Switch', fields: [
                { label: 'Switch brand', type: 'select', options: ['Schneider (Affle / ZENcelo)', 'Legrand (Galion / Mallia)', 'ABB', 'Bticino (Matix / Living Now)', 'Clipsal', 'MK', 'Panasonic', 'Generic'], required: true },
                { label: 'Switch color', type: 'select', options: ['White', 'Matt black', 'Champagne / gold', 'Silver', 'Dark grey'] },
                { label: 'Socket layout', type: 'textarea', placeholder: 'Per room: qty, wall, height from FFL, distance from corner. E.g. "Living: 6x double, TV wall 300mm FFL"', required: true },
                { label: 'Switch plate heights', type: 'text', placeholder: 'Standard 1200mm or custom', required: true },
                { label: 'Switch type', type: 'select', options: ['Standard rocker', 'Smart switch', 'Dimmer', 'Scene controller', 'Touch panel'] },
                { label: 'Gang schedule', type: 'textarea', placeholder: 'E.g. "MBR entrance: 3-gang, Living: 4-gang + dimmer, Kitchen: 2-gang"' },
                { label: 'Isolator switches', type: 'textarea', placeholder: 'Water heater 20A, aircon 20A, cooker 45A — locations and amperage' },
                { label: 'USB sockets', type: 'select', options: ['USB-A + USB-C combo', 'USB-C only', 'No USB sockets', 'Selected rooms only'] },
                { label: 'Outdoor / weatherproof', type: 'toggle' },
            ]
        },
        {
            category: 'Lighting', fields: [
                { label: 'Pendant heights', type: 'textarea', placeholder: 'E.g. "Dining: Tom Dixon 700mm above table, Island: 3x pendant 800mm from counter"' },
                { label: 'LED profile', type: 'select', options: ['Recessed aluminum', 'Surface-mount', 'Corner profile', 'Suspended', 'N/A'] },
                { label: 'LED placement', type: 'textarea', placeholder: 'Cove light locations, cabinet under-light, mirror backlight, strip lengths' },
                { label: 'Color temperature', type: 'select', options: ['Warm white 2700K', 'Warm white 3000K', 'Neutral 4000K', 'Cool white 6000K', 'Tunable CCT'] },
                { label: 'Ceiling projector', type: 'select', options: ['Yes — power + HDMI in ceiling', 'Yes — power only (wireless)', 'No projector'] },
                { label: 'Projector mount location', type: 'text', placeholder: 'Distance from screen wall, centered or offset, false ceiling recess or exposed' },
                { label: 'Projector screen', type: 'select', options: ['Motorized ceiling-recessed', 'Manual pull-down', 'Fixed frame on wall', 'Paint on wall (UST projector)', 'N/A'] },
            ]
        },
        {
            category: 'Wiring & Routing', fields: [
                { label: 'Wire routing method', type: 'select', options: ['Ceiling chase', 'Wall chase', 'Trunking', 'Conduit (PVC)', 'Conduit (flexi)', 'Exposed'], required: true },
                { label: 'Concealed or exposed', type: 'select', options: ['Concealed', 'Exposed', 'Mixed'], required: true },
                { label: 'Network cable type', type: 'select', options: ['CAT5e', 'CAT6 (recommended)', 'CAT6A (10Gbps)', 'Fiber optic', 'N/A'], required: true },
                { label: 'Data/LAN points', type: 'textarea', placeholder: 'Per room: qty and locations for network points' },
                { label: 'TV installation', type: 'textarea', placeholder: 'Which walls, TV size, bracket type (fixed/tilt/full-motion), HDMI/power concealed in wall' },
                { label: 'TV wall reinforcement', type: 'select', options: ['Plywood backing in wall', 'Metal plate behind plaster', 'Masonry wall (no reinforcement needed)', 'N/A'] },
            ]
        },
    ],
    'Plumbing': [
        {
            category: 'Pipe Routing', fields: [
                { label: 'Hot/cold run', type: 'select', options: ['Hot & cold', 'Cold only', 'Existing — no change'], required: true },
                { label: 'Pipe type', type: 'select', options: ['PEX', 'Copper', 'CPVC', 'PPR'], required: true },
                { label: 'Concealed or exposed', type: 'select', options: ['Concealed', 'Exposed', 'Mixed'], required: true },
                { label: 'Trap type', type: 'select', options: ['S-trap', 'P-trap'], required: true },
                { label: 'Floor trap position', type: 'textarea', placeholder: 'Per bathroom: center of shower, beside WC, near door', required: true },
                { label: 'Floor trap size', type: 'select', options: ['100mm round', '120mm round', '150mm square', '200mm linear'] },
                { label: 'Pipe routing notes', type: 'textarea', placeholder: 'Where to run, riser access, waste pipe positions' },
            ]
        },
        {
            category: 'Sanitary Ware', fields: [
                { label: 'Toilet bowl brand', type: 'select', options: ['TOTO', 'Kohler', 'Duravit', 'American Standard', 'Roca', 'Laufen', 'Geberit', 'DERA', 'Generic'], required: true },
                { label: 'Toilet type', type: 'select', options: ['Wall-hung', 'Floor-mounted (close-coupled)', 'Floor-mounted (back-to-wall)', 'Smart toilet (Washlet)'], required: true },
                { label: 'Concealed cistern', type: 'select', options: ['Geberit concealed cistern', 'Brand concealed cistern', 'Exposed cistern', 'N/A — wall-hung'] },
                { label: 'Flush plate', type: 'select', options: ['Geberit Sigma', 'Chrome plate', 'Matt black plate', 'White plate', 'Custom'] },
                { label: 'Basin type', type: 'select', options: ['Undermount', 'Top-mount / drop-in', 'Vessel (sits on top)', 'Wall-hung basin', 'Pedestal', 'Semi-recessed'] },
                { label: 'Basin brand', type: 'text', placeholder: 'e.g. Duravit, Kohler,DERA, generic' },
            ]
        },
        {
            category: 'Shower Set', fields: [
                { label: 'Shower brand', type: 'select', options: ['Grohe', 'Hansgrohe', 'Kohler', 'American Standard', 'Gessi', 'Generic'] },
                { label: 'Rain shower size', type: 'select', options: ['200mm round', '250mm round', '300mm round', '300mm square', '400mm square', 'N/A'] },
                { label: 'Rain shower mount', type: 'select', options: ['Ceiling-mounted', 'Arm from wall', 'Exposed pipe set'] },
                { label: 'Handheld shower', type: 'select', options: ['Slide bar set', 'Wall bracket only', 'N/A'] },
                { label: 'Thermostatic mixer', type: 'select', options: ['Yes — concealed thermostatic', 'Yes — exposed thermostatic', 'Standard pressure balance', 'N/A'] },
                { label: 'Shower finish', type: 'select', options: ['Chrome', 'Matt black', 'Brushed gold', 'Brushed nickel', 'Gunmetal'] },
            ]
        },
        {
            category: 'Bathroom Fixtures', fields: [
                { label: 'Mirror height (center from FFL)', type: 'text', placeholder: 'e.g. 1500mm', unit: 'mm', required: true },
                { label: 'Mirror width', type: 'text', placeholder: 'Relative to basin or specific mm' },
                { label: 'Basin center height', type: 'text', placeholder: 'Standard 850mm or custom', unit: 'mm', required: true },
                { label: 'Faucet type', type: 'select', options: ['Wall-mount', 'Deck-mount', 'Tall vessel', 'Sensor'], required: true },
                { label: 'Faucet height from counter', type: 'text', placeholder: 'e.g. 200mm for vessel basin', unit: 'mm' },
                { label: 'Faucet profile', type: 'select', options: ['Round', 'Square', 'Curved spout', 'Waterfall'] },
                { label: 'Faucet finish', type: 'select', options: ['Chrome', 'Matt black', 'Brushed gold', 'Brushed nickel', 'Gunmetal'] },
                { label: 'Trim/valve finish', type: 'select', options: ['Match faucet', 'Chrome', 'Matt black', 'Brushed gold'] },
                { label: 'Mixer tap type', type: 'select', options: ['Single-lever', 'Dual-handle', 'Thermostatic', 'N/A'] },
                { label: 'Bidet spray position', type: 'select', options: ['Left of WC', 'Right of WC', 'N/A'] },
                { label: 'Bathroom door trim end', type: 'text', placeholder: 'Flush / step down / threshold strip — where tile meets door frame' },
            ]
        },
        {
            category: 'Niche & Soap Box', fields: [
                { label: 'Niche required', type: 'toggle', required: true },
                { label: 'Niche height from FFL', type: 'text', placeholder: 'e.g. 900mm bottom edge', unit: 'mm' },
                { label: 'Niche size', type: 'text', placeholder: 'W x H e.g. 300x300 or 600x300' },
                { label: 'Niche location', type: 'select', options: ['Shower wall — center', 'Shower wall — left', 'Shower wall — right', 'Above WC', 'Beside basin'] },
                { label: 'Shelf inside niche', type: 'toggle' },
                { label: 'Niche tile', type: 'select', options: ['Same as wall tile', 'Accent tile', 'Marble slab'] },
            ]
        },
        {
            category: 'Water Heater', fields: [
                { label: 'Heater type', type: 'select', options: ['Instant (electric)', 'Instant (gas)', 'Storage tank', 'Heat pump', 'N/A'], required: true },
                { label: 'Heater location', type: 'text', placeholder: 'Above WC, utility room, ceiling void' },
                { label: 'Plumber scope', type: 'textarea', placeholder: 'Run hot/cold pipes, connect inlet/outlet, test pressure' },
                { label: 'Electrician scope', type: 'textarea', placeholder: 'Run dedicated circuit, MCB rating, isolator switch' },
                { label: 'Who installs heater unit', type: 'select', options: ['Plumber', 'Electrician', 'Supplier / brand installer', 'TBC'], required: true },
            ]
        },
        {
            category: 'Bathroom Accessories', fields: [
                { label: 'Towel bar position', type: 'textarea', placeholder: 'Which wall, height from FFL, distance from shower. E.g. "Beside shower 1200mm FFL"', required: true },
                { label: 'Towel bar finish', type: 'select', options: ['Chrome', 'Matt black', 'Brushed gold', 'Stainless steel', 'Match faucet'] },
                { label: 'Toilet roll holder position', type: 'text', placeholder: 'Which side of WC, height from FFL. E.g. "Right of WC, 600mm FFL"', required: true },
                { label: 'Bum spray bracket height', type: 'text', placeholder: 'e.g. 200mm below cistern top', unit: 'mm' },
                { label: 'Robe hook position', type: 'text', placeholder: 'Behind door / beside shower / N/A' },
            ]
        },
        {
            category: 'Kitchen', fields: [
                { label: 'Sink brand', type: 'select', options: ['Franke', 'Blanco', 'Kohler', 'Hansgrohe', 'Teka', 'Generic / local'] },
                { label: 'Sink type', type: 'select', options: ['Undermount single', 'Undermount 1.5 bowl', 'Undermount double', 'Top-mount single', 'Top-mount double', 'Farmhouse apron', 'Bar sink'] },
                { label: 'Sink material', type: 'select', options: ['Stainless steel', 'Granite composite (Silgranit)', 'Ceramic', 'Copper'] },
                { label: 'Kitchen faucet', type: 'select', options: ['Pull-out spray', 'Pull-down spray', 'Standard swivel', 'Pot filler (wall)', 'Sensor / touchless'] },
                { label: 'Dishwasher connection', type: 'toggle' },
                { label: 'Instant heater point', type: 'toggle' },
                { label: 'Water filter point', type: 'toggle' },
                { label: 'Gas point', type: 'select', options: ['Existing gas point', 'New gas point required', 'Induction only — no gas', 'N/A'] },
            ]
        },
    ],
    'Aircon': [
        {
            category: 'Pipe Routing', fields: [
                { label: 'Contractor license', type: 'text', placeholder: 'BCA / NEA refrigerant handling license number' },
                { label: 'Pipe run path', type: 'textarea', placeholder: 'Room-by-room: where copper pipes run, which walls/ceiling, entry/exit points for each FCU', required: true },
                { label: 'Concealed or exposed', type: 'select', options: ['Fully concealed in ceiling', 'Concealed in trunking', 'Exposed along wall', 'Mixed'], required: true },
                { label: 'Trunking required', type: 'toggle' },
                { label: 'Trunking size & route', type: 'textarea', placeholder: 'Width x height, which walls, how to route around beams/doors' },
                { label: 'Pipe insulation', type: 'select', options: ['Armaflex (best)', 'Aeroflex', 'Superlon', 'Generic foam'], required: true },
                { label: 'Insulation thickness', type: 'select', options: ['6mm', '9mm', '13mm (recommended)'] },
                { label: 'Drain pipe route', type: 'textarea', placeholder: 'Condensate drain: to nearest floor trap / external / concealed in wall', required: true },
            ]
        },
        {
            category: 'Condenser & FCU', fields: [
                { label: 'Condenser location', type: 'textarea', placeholder: 'Aircon ledge, roof, yard — with clearance notes', required: true },
                { label: 'System type', type: 'select', options: ['System 1', 'System 2', 'System 3', 'System 4', 'Multi-split', 'VRV'], required: true },
                { label: 'FCU positions', type: 'textarea', placeholder: 'Per room: wall-mount position, ceiling cassette location, which wall/corner', required: true },
                { label: 'Brand', type: 'select', options: ['Daikin', 'Mitsubishi Electric', 'Mitsubishi Heavy', 'Panasonic', 'LG', 'Samsung', 'Midea', 'Other'] },
                { label: 'BTU per room', type: 'textarea', placeholder: 'E.g. "MBR: 12000, BR2: 9000, Living: 18000"' },
            ]
        },
        {
            category: 'Coordination with Ceiling & Carpentry', fields: [
                { label: 'False ceiling clearance', type: 'text', placeholder: 'Min gap above FCU for maintenance access', unit: 'mm' },
                { label: 'Piping vs false ceiling', type: 'select', options: ['Pipes before ceiling', 'Pipes after ceiling (access panel needed)', 'TBC with plasterer'] },
                { label: 'Carpentry conflicts', type: 'textarea', placeholder: 'Wardrobe blocking pipe run, overhead cabinet clearance, built-in aircon cover' },
            ]
        },
        {
            category: 'Installer Coordination', fields: [
                { label: 'Installer source', type: 'select', options: ['Gain City subcontractor', 'Harvey Norman subcontractor', 'Courts subcontractor', 'Direct from brand', 'Own aircon contractor'], required: true },
                { label: 'Installer contact', type: 'text', placeholder: 'Company name or contact person' },
                { label: 'Installation date', type: 'text', placeholder: 'Preferred date or phase (e.g. after false ceiling, before painting)' },
                { label: 'Site access notes', type: 'textarea', placeholder: 'Key collection, parking for condenser crane, lift access for condenser' },
                { label: 'ID responsibility', type: 'textarea', placeholder: 'What ID team needs to prep: power point, ceiling opening, bracket support, drain point' },
            ]
        },
    ],
    'Painting': [
        {
            category: 'Paint Specification', fields: [
                { label: 'Paint type', type: 'select', options: ['Water-based emulsion', 'Oil-based', 'Anti-mould (bathroom/kitchen)', 'Ceiling paint', 'Exterior paint'], required: true },
                { label: 'Brand', type: 'select', options: ['Dulux', 'Nippon Paint', 'Benjamin Moore', 'Jotun', 'Other'], required: true },
                { label: 'Finish', type: 'select', options: ['Matte / Flat', 'Eggshell', 'Satin', 'Semi-gloss', 'High gloss'], required: true },
                { label: 'Main color code', type: 'text', placeholder: 'e.g. Dulux 45YY 83/062', required: true },
                { label: 'Accent wall color', type: 'text', placeholder: 'Color code or "N/A"' },
                { label: 'Sealer / primer', type: 'select', options: ['Sealer required', 'Primer only', 'Both sealer + primer', 'None (direct over skim coat)'], required: true },
            ]
        },
        {
            category: 'Surface Prep', fields: [
                { label: 'Over existing paint', type: 'toggle' },
                { label: 'Skim coat required', type: 'toggle' },
                { label: 'Number of coats', type: 'select', options: ['2 coats', '3 coats'] },
                { label: 'Ceiling same color', type: 'toggle' },
            ]
        },
        {
            category: 'Special Finishes', fields: [
                { label: 'Feature wall treatment', type: 'select', options: ['N/A', 'Limewash', 'Textured', 'Venetian plaster'] },
                { label: 'Notes', type: 'textarea', placeholder: 'Microcement, color transitions, protection of surfaces' },
            ]
        },
    ],
    'Plastering & Ceiling': [
        {
            category: 'Skim Coat', fields: [
                { label: 'Skim coat areas', type: 'textarea', placeholder: 'Which walls, whole unit or selected rooms, ceiling Y/N', required: true },
                { label: 'Over existing', type: 'select', options: ['Over existing paint', 'After hack (bare wall)', 'New partition'], required: true },
            ]
        },
        {
            category: 'False Ceiling', fields: [
                { label: 'Ceiling type', type: 'select', options: ['L-box', 'Island', 'Full ceiling', 'Partial', 'None'], required: true },
                { label: 'Drop height', type: 'text', placeholder: 'e.g. 100mm / 150mm', unit: 'mm' },
                { label: 'Pelmet dimensions', type: 'text', placeholder: 'Width x depth for curtain pelmet' },
                { label: 'Cove light recess', type: 'text', placeholder: 'Recess depth for LED strip', unit: 'mm' },
            ]
        },
        {
            category: 'Moulding & Cornice', fields: [
                { label: 'Moulding profile', type: 'select', options: ['Cove', 'Step / shadow line', 'Crown', 'None'] },
                { label: 'Material', type: 'select', options: ['Plaster', 'PU foam', 'Gypsum'] },
                { label: 'Size', type: 'text', placeholder: 'e.g. 75mm / 100mm' },
            ]
        },
        {
            category: 'Partition', fields: [
                { label: 'Partition location', type: 'textarea', placeholder: 'Where, from wall to wall, with/without door' },
                { label: 'Thickness', type: 'select', options: ['75mm', '100mm', '125mm'] },
                { label: 'Fire-rated', type: 'toggle' },
                { label: 'Sound insulation', type: 'toggle' },
                { label: 'Reinforcement', type: 'textarea', placeholder: 'Plywood backing for TV mount / shelf / basin — specify which side and area (e.g. 1200x800mm)' },
            ]
        },
        {
            category: 'Ceiling & Partition Reinforcement', fields: [
                { label: 'Ceiling fan support', type: 'textarea', placeholder: 'Which rooms need ceiling fan noggins / structural support in false ceiling' },
                { label: 'Projector mount support', type: 'text', placeholder: 'Location and weight of projector — ceiling reinforcement needed' },
                { label: 'Chandelier / heavy pendant', type: 'textarea', placeholder: 'Weight, location, type of ceiling support bracket required' },
                { label: 'Partition hanging loads', type: 'textarea', placeholder: 'Wall-hung vanity, floating shelves, aircon bracket — where to embed plywood/metal plate' },
            ]
        },
    ],
    'Tiling': [
        {
            category: 'Waterproofing', fields: [
                { label: 'Waterproofing brand', type: 'select', options: ['Mapei Mapelastic', 'Fosroc Nitobond', 'Sika', 'Weber', 'Dr Fixit', 'Generic'], required: true },
                { label: 'Number of coats', type: 'select', options: ['2 coats (standard)', '3 coats (premium)', '1 coat'] },
                { label: 'Areas', type: 'select', options: ['All wet areas (bathrooms + kitchen)', 'Bathrooms only', 'Bathrooms + balcony', 'Full unit'], required: true },
                { label: 'Ponding test', type: 'select', options: ['24-hour ponding test', '48-hour ponding test', 'No ponding test'], required: true },
                { label: 'Membrane extension', type: 'text', placeholder: 'e.g. 300mm up wall from floor, full wall behind shower' },
            ]
        },
        {
            category: 'Tile Material', fields: [
                {
                    label: 'Tile material', type: 'select', options: [
                        '── CERAMIC & PORCELAIN ──',
                        'Porcelain — full body (color through, most durable)',
                        'Porcelain — glazed (printed surface)',
                        'Porcelain — polished (mirror finish, slippery)',
                        'Porcelain — matt / anti-slip (R10-R13)',
                        'Porcelain — rustic / textured',
                        'Porcelain — marble-look (budget alternative)',
                        'Porcelain — wood-look (plank format)',
                        'Porcelain — concrete-look (industrial)',
                        'Porcelain — terrazzo-look',
                        'Ceramic — wall only (softer, budget)',
                        'Ceramic — hand-glazed (artisan)',
                        '── SPECIALTY / ARTISAN ──',
                        'Zellige — Morocco, hand-cut, imperfect glaze, $$$$',
                        'Encaustic cement tile — pattern inlaid, not printed, $$$',
                        'Sukabumi (Green Bali Stone) — Indonesia, volcanic, pool/spa, $$$$',
                        'Terracotta — Italy/Mexico, traditional clay, warm, $$',
                        'Cotto — Italy, unglazed terracotta, Tuscan, $$',
                        'Majolica — Italy/Spain, hand-painted decorative, $$$$',
                        'Peranakan / Baba-Nonya — SG/MY, heritage shophouse motif, $$$$',
                        'Delft — Netherlands, blue & white hand-painted, $$$$',
                        'Talavera — Mexico, vibrant hand-painted, $$$',
                        'Iznik — Turkey, blue & turquoise pattern, $$$$$',
                        '── NATURAL / ORGANIC ──',
                        'Slate tile — natural cleft surface, $',
                        'Sandstone tile — warm earthy tones, $$',
                        'Limestone tile — fossil-rich, cream, $$$',
                        'Basalt tile — dark volcanic, $$',
                        'Quartzite tile — natural sparkle, $$$',
                        'Pebble mosaic — river stones on mesh, $$',
                        'Lava stone — volcanic, can be glazed, $$$',
                        '── GLASS & METAL ──',
                        'Glass mosaic — pool / backsplash, $$',
                        'Glass subway tile — translucent, $$',
                        'Mirror mosaic — reflective feature, $$$',
                        'Stainless steel mosaic — industrial, $$$',
                        'Copper / brass mosaic — warm metallic, $$$$',
                        '── BRICK & STONE LOOK ──',
                        'Brick veneer — thin real brick (20mm), $$',
                        'Brick-look porcelain — printed, $',
                        'Split-face stone cladding — rough natural 3D, $$$',
                        'Stacked stone ledger panel — feature wall, $$$',
                        'Culture stone — manufactured stone veneer, $$',
                        '── ROOF TILE (LANDED) ──',
                        'Concrete roof tile — flat / S-profile, $',
                        'Clay roof tile — traditional, $$',
                        'Japanese kawara — curved grey clay, $$$',
                        'Chinese imperial yellow glaze — heritage, $$$$$',
                        'Indonesian Joglo shingle — teak wood, $$$$',
                        'Spanish terracotta barrel — Mediterranean, $$$',
                        'Slate roofing — natural stone, $$$$',
                        '── OTHER ──',
                        'Custom / unlisted — specify in notes',
                    ], required: true
                },
            ]
        },
        {
            category: 'Tile Layout & Pattern', fields: [
                {
                    label: 'Tile layout', type: 'select', options: [
                        '── BASIC ──',
                        'Stack bond (grid)',
                        'Brick bond (1/2 offset)',
                        '1/3 offset',
                        '45° diagonal',
                        '── HERRINGBONE FAMILY ──',
                        'Herringbone (90° classic)',
                        'Double herringbone',
                        'Chevron (angled cuts)',
                        'Herringbone 45° (diagonal)',
                        '── COMPLEX ──',
                        'Basket weave',
                        'Pinwheel',
                        'Windmill',
                        'Versailles / French pattern (4 sizes)',
                        'Stretcher bond (running bond)',
                        'Flemish bond',
                        'Cross hatch',
                        'Hexagonal',
                        'Fish scale / scallop',
                        'Arabesque / lantern',
                        'Penny round mosaic',
                        'Subway (classic 1:2)',
                        'Stacked subway (vertical)',
                        'Diamond / rhombus',
                        'Random / crazy paving',
                        '── MIXED SIZE ──',
                        'Linear plank (wood-look)',
                        'Modular (2-3 sizes mixed)',
                        'Opus Romano (multi-size)',
                        'Hopscotch (large + small)',
                        'Custom — see notes',
                    ], required: true
                },
                { label: 'Grout brand', type: 'select', options: ['Mapei Keracolor', 'Mapei Ultracolor Plus', 'Laticrete Permacolor', 'Weber', 'Generic'], required: true },
                { label: 'Grout color code', type: 'text', placeholder: 'e.g. Mapei #100 White / #114 Anthracite', required: true },
                { label: 'Silicone sealant', type: 'select', options: ['Neutral cure (standard)', 'Sanitary grade (anti-mould)', 'Matching grout color'] },
                { label: 'Grout width', type: 'select', options: ['1mm (rectified only)', '1.5mm', '2mm', '3mm', '5mm', '8mm+ (rustic/zellige)'] },
                { label: 'Starting point', type: 'text', placeholder: 'Center of room / from door / from feature wall' },
                { label: 'Tile orientation', type: 'select', options: ['Portrait', 'Landscape', 'Mixed — see notes'] },
            ]
        },
        {
            category: 'Layout', fields: [
                { label: 'Floor tile size', type: 'text', placeholder: 'e.g. 600x600 / 600x1200 / 800x800', required: true },
                { label: 'Wall tile size', type: 'text', placeholder: 'e.g. 300x600 / subway 75x150' },
                { label: 'Wall tile height', type: 'text', placeholder: 'Full height / 1200mm / wainscot 900mm' },
                { label: 'Feature tile', type: 'textarea', placeholder: 'Location, pattern, different tile code' },
                {
                    label: 'Design motif / cultural reference', type: 'select', options: [
                        'N/A — no specific motif',
                        '── 🇯🇵 JAPAN ──',
                        'Seigaiha (wave) — overlapping circles = ocean waves, Edo period',
                        'Asanoha (hemp leaf) — geometric star, symbolizes growth',
                        'Shippo (seven treasures) — interlocking circles, Buddhist',
                        'Kumiko lattice — wooden geometric screen, joinery art',
                        'Sakura (cherry blossom) — fleeting beauty, spring',
                        'Koi fish — perseverance, good fortune',
                        'Crane (tsuru) — longevity, 1000 years',
                        'Cloud (kumo) — auspicious, heaven',
                        'Bamboo — resilience, flexibility',
                        'Shou sugi ban — charred cedar texture, wabi-sabi',
                        'Notan — light/dark balance, negative space',
                        '── 🇨🇳 CHINA ──',
                        'Dragon — imperial power, strength, 5-claw = emperor',
                        'Phoenix (fenghuang) — rebirth, empress, south',
                        'Cloud scroll (ruyi) — good fortune, authority',
                        'Double happiness (囍) — wedding, joy',
                        'Lattice window (花窗) — geometric timber screen, Song dynasty',
                        'Bagua (八卦) — octagonal, feng shui, cosmic balance',
                        'Blue & white porcelain — Ming dynasty cobalt, timeless',
                        'Longevity symbol (壽) — circular calligraphy',
                        'Bat (蝠) — homophone for fortune (福)',
                        'Peony — wealth, nobility, king of flowers',
                        'Bamboo + plum + pine — Three Friends of Winter',
                        'Fu dog / guardian lion — protection at entrance',
                        '── 🇰🇷 KOREA ──',
                        'Dancheong — multicolored bracket painting on temples',
                        'Taegeuk — yin-yang balance, national symbol',
                        'Lotus — purity, Buddhist, Joseon tiles',
                        'Maebyeong (vase silhouette) — celadon elegance',
                        'Bojagi patchwork — wrapping cloth geometry',
                        '── 🇮🇳 INDIA ──',
                        'Paisley (buta/boteh) — teardrop/mango, Kashmir, Mughal',
                        'Jali screen (jaali) — perforated stone/wood, Mughal',
                        'Mandala — radial geometry, universe, meditation',
                        'Kolam / Rangoli — geometric floor art, Tamil Nadu',
                        'Lotus — sacred, purity, Hindu/Buddhist',
                        'Pietra dura (Parchin kari) — stone inlay, Taj Mahal',
                        'Elephant procession — royal, auspicious',
                        'Peacock — national bird, beauty, grace',
                        'Chikankari embroidery pattern — Lucknow white-on-white',
                        'Warli art — tribal, stick figure narrative, Maharashtra',
                        'Madhubani — Bihar, geometric nature paintings',
                        'Kalamkari — Andhra Pradesh, hand-painted mythology',
                        '── 🇹🇭 THAILAND ──',
                        'Lai Thai — flame-like flowing curves, temple art',
                        'Naga serpent — mythical water serpent, stairway guardian',
                        'Kanok pattern — flame/vine scroll, royal',
                        'Garuda — divine bird, national emblem',
                        '── 🇮🇩 INDONESIA / BALI ──',
                        'Batik (parang) — diagonal wave, Javanese royal',
                        'Batik (kawung) — four-circle palm sugar motif',
                        'Balinese carved teak panel — floral deity relief',
                        'Joglo teak carving — traditional Javanese house detail',
                        'Wayang (shadow puppet) — Javanese mythology',
                        'Lombok weave — ikat geometric textile',
                        '── 🇲🇾 MALAYSIA / 🇸🇬 SINGAPORE ──',
                        'Peranakan tile (Baba-Nonya) — floral + phoenix, shophouse',
                        'Kebaya lace motif — intricate cutwork, Straits Chinese',
                        'Songket weave — gold thread brocade, Malay royal',
                        'Islamic geometric (Moorish) — star + polygon, mosque',
                        '── 🇲🇦 MOROCCO / ISLAMIC ──',
                        'Zellige mosaic — hand-cut geometric, Fez, 10th century',
                        'Arabesque — infinite interlocking vegetal scrolls',
                        'Muqarnas — 3D honeycomb vaulting, stalactite ceiling',
                        '8-point star (khatam) — Islamic geometry',
                        '16-point star (shamsa) — sun symbol',
                        'Zillij fountain — mosaic water feature',
                        '── 🇹🇷 TURKEY / OTTOMAN ──',
                        'Iznik tile — blue/turquoise/red tulip & floral, 1400s',
                        'Tulip motif — symbol of paradise, Ottoman',
                        'Kilim geometric — triangle, hooks, ram horn, Anatolian',
                        'Çini (tile art) — painted ceramic tradition',
                        '── 🇮🇷 PERSIA ──',
                        'Persian garden (chahar bagh) — four-part paradise garden',
                        'Herati pattern — fish-around-diamond, infinite repeat',
                        'Boteh (original paisley) — flame/leaf shape',
                        'Islimi vine scroll — continuous spiraling vine',
                        'Minakari enamel — blue + gold enamel metalwork',
                        '── 🇪🇬 EGYPT ──',
                        'Lotus column capital — papyrus/lotus, 3000 BC',
                        'Scarab — rebirth, protection, solar',
                        'Eye of Horus — protection, royal power',
                        'Ankh — key of life, eternal',
                        'Pharaonic frieze — procession, hieroglyphic border',
                        '── 🌍 AFRICA ──',
                        'Kente cloth — strip-woven geometry, Ghana/Ashanti',
                        'Mud cloth (Bogolan) — earth-dyed symbols, Mali',
                        'Ndebele — bold primary color geometry, South Africa',
                        'Shona sculpture — abstract stone carving, Zimbabwe',
                        'Dogon door panel — carved ancestral figures, Mali',
                        'Zulu beadwork — triangle geometry, bright colors',
                        'Adinkra symbols — Akan/Ghana, stamped wisdom symbols',
                        'Ankara / wax print — vibrant repeated pattern, West Africa',
                        'Maasai beadwork — flat disc collar, red/blue/white',
                        'Kuba cloth — cut-pile raffia, geometric, Congo',
                        'Berber rug pattern — diamond + zigzag, North Africa',
                        '── 🇬🇷 GREECE / ROME ──',
                        'Greek key (meander) — continuous right-angle spiral, 900 BC',
                        'Acanthus leaf — Corinthian capital, 450 BC',
                        'Palmette — fan-shaped palm leaf, frieze',
                        'Egg & dart — alternating moulding pattern',
                        'Roman mosaic — tessera stone scenes',
                        'Guilloche — interlocking circles, floor border',
                        '── 🇮🇹 ITALY ──',
                        'Florentine scroll — Renaissance cherub + acanthus, gilded',
                        'Grotesque — fantastical creatures + foliage, Roman villa',
                        'Terrazzo — Venice, marble chips in cement, 1500s',
                        'Pietra dura — Florentine stone inlay, floral',
                        'Pompeii fresco — ancient wall painting style',
                        '── 🇫🇷 FRANCE ──',
                        'Toile de Jouy — pastoral scenes, Jouy-en-Josas, 1760',
                        'Fleur-de-lis — stylized lily, royalty',
                        'Rococo scroll — asymmetric curves, shell, gold, 1730s',
                        'Empire laurel wreath — Napoleonic, neoclassical',
                        'Art Nouveau — organic flowing lines, Mucha style, 1890s',
                        '── 🇬🇧 ENGLAND ──',
                        'William Morris — Arts & Crafts nature print, 1860s',
                        'Tudor rose — stylized double rose, 1485',
                        'Damask — tone-on-tone woven silk, via Damascus',
                        'Tartan / plaid — Scottish clan patterns',
                        'Chintz — glazed floral cotton, imported from India',
                        '── 🇵🇹 PORTUGAL ──',
                        'Azulejo — hand-painted blue & white tile, 1500s',
                        'Manueline — nautical rope + coral carving, maritime',
                        '── 🇪🇸 SPAIN ──',
                        'Alhambra geometric — Moorish star tessellation',
                        'Talavera pottery motif — cobalt + yellow on white',
                        'Mudéjar — Islamic-Christian hybrid ornament',
                        '── 🇲🇽 MEXICO / AMERICAS ──',
                        'Talavera de Puebla — hand-painted cobalt + yellow tile',
                        'Otomí embroidery — colorful flora + fauna, Tenango',
                        'Aztec sun stone — calendar circle, geometric',
                        'Mayan step fret — stepped spiral, temple frieze',
                        'Navajo weave — diamond + arrow, earthy tones',
                        'Haida / Pacific NW — formline, eagle/raven/bear',
                        '── 🇷🇺 RUSSIA ──',
                        'Khokhloma — red + gold + black floral, lacquer',
                        'Gzhel — blue & white pottery, folk floral',
                        'Matryoshka silhouette — nesting doll shape',
                        'Onion dome — bulbous cupola profile',
                        '── 🇳🇴🇸🇪🇩🇰 SCANDINAVIA ──',
                        'Dala horse — Swedish folk, carved + painted',
                        'Rosemaling — Norwegian folk flower painting',
                        'Viking interlace — knotwork, animal style',
                        'Rune carvings — Norse symbols',
                        'Hygge minimalism — clean warmth, natural materials',
                        '── 🇮🇪 CELTIC ──',
                        'Celtic knot — endless interlace, no start/end',
                        'Trinity knot (triquetra) — three-cornered, eternal',
                        'Celtic cross — ring cross, stone carved',
                        'Celtic spiral (triskelion) — triple spiral, Newgrange',
                        '── 🌊 POLYNESIA / PACIFIC ──',
                        'Tapa cloth — bark cloth, geometric, Fiji/Samoa/Tonga',
                        'Maori Ta Moko — spiral koru + hook pattern',
                        'Hawaiian quilt — appliqué nature motif',
                        'Tribal tattoo pattern — bold black geometric',
                        '── 🏛️ PERIOD STYLES ──',
                        'Art Deco — geometric rays, symmetry, 1920s',
                        'Art Nouveau — organic curves, whiplash line, 1890s',
                        'Mid-century modern — retro atomic, starburst, 1950s',
                        'Bauhaus — geometric, primary colors, functionalism',
                        'Memphis — squiggle, terrazzo, bold 1980s',
                        'Brutalist — raw concrete, massive geometry',
                        '── CUSTOM ──',
                        'Custom / mixed reference — specify in notes',
                    ]
                },
                { label: 'Doorway threshold', type: 'select', options: ['Marble strip', 'Tile-to-tile (match cut)', 'Aluminium trim strip', 'PVC transition strip', 'Repair broken tiles only', 'No threshold'], required: true },
                { label: 'Threshold material', type: 'text', placeholder: 'e.g. Volakas marble / black granite / stainless steel strip' },
            ]
        },
        {
            category: 'Bathroom Floor', fields: [
                { label: 'Kerb', type: 'select', options: ['Kerb (standard)', 'No kerb (curbless)', 'Half-height kerb'], required: true },
                { label: 'Floor level', type: 'select', options: ['Ramp (standard bathroom)', 'Elevated (platform shower)', 'Same level as outside', 'Step-down entry'], required: true },
                { label: 'Floor trap tile treatment', type: 'select', options: ['X-cut (4 triangles to trap)', 'Cut tile around trap', 'Center trap in tile', 'Tile-insert trap cover', 'Linear drain with tile insert'], required: true },
                { label: 'Floor slope direction', type: 'text', placeholder: 'Towards floor trap / towards door / cross-fall' },
                { label: 'Concrete elevation for cabinetry', type: 'text', placeholder: 'Raise vanity area by Xmm, kitchen plinth height', unit: 'mm' },
            ]
        },
        {
            category: 'Skirting', fields: [
                { label: 'Skirting type', type: 'select', options: ['Tile skirting', 'Wooden skirting', 'PVC skirting', 'Aluminium skirting', 'None'], required: true },
                { label: 'Skirting height', type: 'select', options: ['60mm', '80mm', '100mm', '120mm'] },
                { label: 'Skirting material', type: 'text', placeholder: 'Match floor tile / match wood / paint grade' },
            ]
        },
        {
            category: 'Half Wall & Niche', fields: [
                { label: 'Half wall required', type: 'toggle' },
                { label: 'Half wall height', type: 'text', placeholder: 'e.g. 1000mm / 1200mm', unit: 'mm' },
                { label: 'Glass on half wall', type: 'select', options: ['N/A', 'Center', 'Left-aligned', 'Right-aligned', 'Full width'] },
                { label: 'Half wall tile', type: 'select', options: ['Same as wall', 'Same as floor', 'Accent tile'] },
                { label: 'Niche in shower', type: 'toggle' },
                { label: 'Niche position & size', type: 'text', placeholder: 'e.g. 300x300 at 900mm FFL, centered' },
            ]
        },
    ],
    'Vinyl & Flooring': [
        {
            category: 'Vinyl / SPC Flooring', fields: [
                { label: 'Vinyl brand', type: 'select', options: ['Pergo (Sweden)', 'Quick-Step (Belgium)', 'Tarkett (France)', 'Egger (Austria)', 'Moduleo (Belgium)', 'Meister (Germany)', 'Karndean (UK)', 'COREtec (US)', 'LG Hausys (Korea)', 'Kentier (China)', 'Protex (China)', 'Power Dekor (China)', 'Inovar (Malaysia)', 'Floor Depot (Malaysia)', 'Evorich (Malaysia)', 'Floorrich (SG)', 'Korean Vinyl', 'Generic / unbranded', 'Other'], required: true },
                { label: 'Vinyl type', type: 'select', options: ['SPC click', 'LVT glue-down', 'Loose lay', 'Sheet vinyl'], required: true },
                { label: 'Vinyl thickness', type: 'select', options: ['2mm', '3mm', '4mm', '5mm (recommended)', '6mm'] },
                { label: 'Foam underlay', type: 'select', options: ['IXPE foam (1.5mm)', 'IXPE foam (2mm)', 'EVA foam', 'Cork underlay', 'Built-in underlay (no extra needed)', 'None'] },
                { label: 'Vinyl orientation', type: 'select', options: ['Lengthwise (along room)', 'Widthwise (across room)', 'Diagonal', 'Follow corridor direction'] },
                { label: 'Vinyl plank size', type: 'text', placeholder: 'e.g. 1220x180mm / 600x600mm' },
                { label: 'Vinyl starting point', type: 'text', placeholder: 'From entrance / center / feature wall' },
            ]
        },
        {
            category: 'Epoxy & Specialty Flooring', fields: [
                { label: 'Flooring type', type: 'select', options: ['Epoxy coating', 'Polyurethane (PU)', 'Microcement / micro-topping', 'Polished concrete', 'Terrazzo', 'N/A'] },
                { label: 'Finish', type: 'select', options: ['Solid color', 'Metallic / marble effect', 'Flake / chip', 'Anti-slip textured', 'High gloss', 'Matte'] },
                { label: 'Color', type: 'text', placeholder: 'RAL code / brand color reference' },
                { label: 'Area', type: 'textarea', placeholder: 'Which rooms — balcony, yard, garage, utility, or full-unit overlay' },
            ]
        },
    ],
    'Natural Stone': [
        {
            category: 'Stone Selection', fields: [
                { label: 'Stone type', type: 'select', options: ['Marble', 'Granite', 'Travertine', 'Slate', 'Limestone', 'Sandstone', 'Quartzite', 'Soapstone', 'Onyx', 'Terrazzo', 'Sintered Stone', 'N/A'], required: true },
                {
                    label: 'Stone name', type: 'select', options: [
                        '── WHITE MARBLE ──',
                        'Carrara (Bianco Carrara) — Italy, grey veins, $$',
                        'Calacatta Oro — Italy, bold gold veins, $$$$',
                        'Calacatta Borghini — Italy, dramatic thick veins, $$$$$',
                        'Statuario — Italy, grey-blue veins on bright white, $$$$',
                        'Arabescato — Italy, swirly web-like grey veins, $$$',
                        'Bianco Lasa — South Tyrol, minimal vein pure white, $$$$',
                        'Volakas — Greece, grey-blue veins, $$',
                        'Thassos — Greece, crystal white, $$$',
                        'Sivec White — North Macedonia, solid white, $$$',
                        '── BEIGE / WARM MARBLE ──',
                        'Botticino — Italy, cream beige subtle veins, $$',
                        'Crema Marfil — Spain, cream yellow, $',
                        'Daino Reale — Sicily, warm beige with fossils, $$',
                        'Rosa Portogallo — Portugal, salmon pink, $$$',
                        'Breccia Oniciata — Italy, warm gold veins, $$$',
                        '── DARK MARBLE ──',
                        'Nero Marquina — Spain, black with white veins, $$$',
                        'Emperador Dark — Spain, dark brown, $$',
                        'Emperador Light — Spain, light brown, $$',
                        'Portoro — Italy, black with gold veins, $$$$$',
                        'Sahara Noir — Tunisia, black with gold-cream, $$$$',
                        'Verde Guatemala — India, deep green, $$$',
                        'Rosso Levanto — Italy/Turkey, dark red with white, $$$',
                        '── EXOTIC / STATEMENT ──',
                        'Blue Bahia — Brazil, blue with gold flecks, $$$$$',
                        'Azul Macaubas — Brazil, blue quartzite, $$$$$',
                        'Patagonia — Brazil, amber & blue quartzite, $$$$$',
                        'Sodalite Blue — Bolivia, vivid blue, $$$$$',
                        'Tiger Eye — South Africa, golden chatoyant, $$$$$',
                        '── TRAVERTINE ──',
                        'Travertine Classic (Filled) — Italy, smooth cream, $$',
                        'Travertine Classic (Unfilled) — Italy, natural holes, $$',
                        'Travertine Noce — Italy, walnut brown, $$',
                        'Travertine Silver — Italy/Turkey, grey, $$',
                        'Travertine Gold — Iran, warm yellow, $$',
                        '── GRANITE ──',
                        'Absolute Black — India/Zimbabwe, solid black, $$',
                        'Black Galaxy — India, black with gold flecks, $$',
                        'Steel Grey — India, dark grey, $$',
                        'Tan Brown — India, brown with black, $',
                        'Giallo Ornamental — Brazil, gold/cream, $',
                        'Blue Pearl — Norway, blue-grey shimmer, $$$',
                        'Viscount White — India, white with grey, $$',
                        'Colonial White — India, off-white, $',
                        'Kashmir White — India, white with garnets, $$',
                        '── SOAPSTONE ──',
                        'Soapstone (Grey) — Brazil, matte grey, $$',
                        'Soapstone (Green) — India, dark green, $$',
                        'Soapstone (Black) — Brazil, charcoal, $$',
                        '── QUARTZITE ──',
                        'Taj Mahal — Brazil, warm white, $$$$',
                        'Super White — Brazil, marble-look quartzite, $$$',
                        'Fantasy Brown — India, brown+grey+white, $$$',
                        'Fusion — Brazil, multicolor, $$$',
                        '── ONYX ──',
                        'Onyx Honey — Pakistan, translucent amber, $$$$',
                        'Onyx Verde — Pakistan, green translucent, $$$$',
                        'Onyx White — Iran, white translucent, $$$$',
                        '── SLATE ──',
                        'Brazilian Black Slate — matte black, $',
                        'Indian Autumn Slate — multicolor rustic, $',
                        'Chinese Grey Slate — uniform grey, $',
                        '── LIMESTONE ──',
                        'Jura Beige — Germany, fossil-rich cream, $$$',
                        'Moleanos — Portugal, beige, $$',
                        'Cabeca Veada — Portugal, grey-blue, $$',
                        '── SINTERED STONE ──',
                        'Dekton (Cosentino) — engineered, zero porosity, $$$',
                        'Neolith (TheSize) — ultra-compact, $$$',
                        'Laminam — Italy, large format, $$$',
                        '── OTHER ──',
                        'Custom / unlisted — specify in notes',
                    ], required: true
                },
                { label: 'Application', type: 'select', options: ['Floor', 'Wall', 'Feature wall', 'Countertop', 'Vanity top', 'Window sill', 'Threshold', 'Staircase', 'Fireplace surround', 'Backsplash', 'Shower niche'], required: true },
            ]
        },
        {
            category: 'Motif & Pattern', fields: [
                { label: 'Vein pattern', type: 'select', options: ['Fine linear veins', 'Bold dramatic veins', 'Web / spider veins', 'Cloud / flowing', 'Speckled / granular', 'Fossil imprints', 'Solid / uniform', 'Chatoyant (light-shifting)', 'Translucent (backlit)', 'N/A'] },
                { label: 'Vein direction', type: 'select', options: ['Horizontal run', 'Diagonal run', 'Random / organic', 'Bookmatched mirror', 'Cross-cut', 'Vein-cut', 'N/A'] },
                { label: 'Bookmatching', type: 'select', options: ['No', 'Yes — 2 slabs mirrored', 'Yes — 4 slabs (butterfly)', 'Diamond match', 'N/A'] },
                { label: 'Slab vs tile', type: 'select', options: ['Full slab (feature wall / countertop)', 'Large format tile (600×1200)', 'Standard tile (300×600 / 600×600)', 'Mosaic', 'Cut-to-size'] },
            ]
        },
        {
            category: 'Finish & Treatment', fields: [
                { label: 'Surface finish', type: 'select', options: ['Polished (mirror shine)', 'Honed (matte smooth)', 'Brushed / leathered (textured)', 'Tumbled (aged look)', 'Flamed (rough, anti-slip)', 'Sandblasted', 'Bush-hammered', 'Acid-washed'], required: true },
                { label: 'Edge profile', type: 'select', options: ['Flat / eased (standard)', 'Bullnose (rounded)', 'Beveled', 'Ogee (S-curve)', 'Waterfall (wraps down sides)', 'Mitered (45° join)', 'Pencil round', 'N/A'] },
                { label: 'Sealer required', type: 'select', options: ['Penetrating sealer (marble, limestone, travertine)', 'Topical sealer', 'Both', 'Not required (granite, quartzite, sintered)', 'Soapstone oil treatment'] },
                { label: 'Filling', type: 'select', options: ['N/A', 'Resin-filled (travertine)', 'Epoxy-filled (travertine)', 'Cement-filled', 'Unfilled (natural)'] },
            ]
        },
        {
            category: 'Installation & Sourcing', fields: [
                { label: 'Thickness', type: 'select', options: ['10mm (wall cladding)', '15mm (standard tile)', '20mm (countertop / floor)', '30mm (heavy-duty countertop)', '40mm+ (monolithic slab)'] },
                { label: 'Supplier / fabricator', type: 'text', placeholder: 'e.g. Stonehub, Classicstone, European Marble, direct quarry import' },
                { label: 'Country of origin', type: 'text', placeholder: 'e.g. Italy, Brazil, India, Spain, Turkey, Greece' },
                { label: 'Installation substrate', type: 'select', options: ['Cement screed', 'Plywood backing', 'Metal frame (feature wall)', 'Direct adhesive', 'Dry-hang system (lobby/feature)'] },
                { label: 'Notes', type: 'textarea', placeholder: 'Slab selection required at yard? Colour matching across batches? Waterfall edge details?' },
            ]
        },
    ],
    'Glass & Mirror': [
        {
            category: 'Glass', fields: [
                { label: 'Glass type', type: 'select', options: ['Tempered clear', 'Tempered tinted', 'Frosted', 'Fluted / reeded', 'Ribbed', 'Laminated', 'Low-E'], required: true },
                { label: 'Thickness', type: 'select', options: ['6mm', '8mm', '10mm', '12mm'], required: true },
                { label: 'Application', type: 'select', options: ['Shower screen', 'Glass door', 'Glass partition', 'Backsplash', 'Window'] },
                { label: 'Metal channel / frame color', type: 'select', options: ['Matt black', 'Chrome', 'Brushed gold', 'White', 'Dark grey', 'Frameless — no channel'] },
                { label: 'Hardware finish', type: 'select', options: ['Matt black', 'Chrome', 'Brushed gold', 'Frameless'] },
                { label: 'Half wall glass placement', type: 'select', options: ['N/A', 'Center of half wall', 'Left side', 'Right side', 'Full width on half wall'] },
                { label: 'Glass panel height', type: 'text', placeholder: 'From top of half wall or FFL', unit: 'mm' },
            ]
        },
        {
            category: 'Mirror', fields: [
                { label: 'Height from FFL', type: 'text', placeholder: 'Center point or bottom edge', unit: 'mm', required: true },
                { label: 'Mirror size', type: 'text', placeholder: 'W x H or match basin width' },
                { label: 'Backlight', type: 'toggle' },
                { label: 'Anti-fog', type: 'toggle' },
            ]
        },
        {
            category: 'Windows', fields: [
                { label: 'HDB window contractor license', type: 'text', placeholder: 'BCA-licensed window contractor registration no.' },
                { label: 'Window type', type: 'select', options: ['Casement (top-hung)', 'Casement (side-hung)', 'Sliding', 'Louvre', 'Fixed panel', 'Bay window'] },
                { label: 'Frame material', type: 'select', options: ['Aluminium (powder coat)', 'Aluminium (anodised)', 'uPVC', 'Timber'] },
                { label: 'Frame color', type: 'select', options: ['Matt black', 'White', 'Dark grey', 'Wood grain', 'Custom'] },
                { label: 'Glass spec', type: 'select', options: ['Clear 5mm', 'Clear 6mm', 'Tinted', 'Frosted', 'Double glazed'] },
                { label: 'Window grilles', type: 'select', options: ['Aluminium grille (HDB required)', 'Invisible grille', 'No grille', 'Existing — keep'] },
                { label: 'Grille color', type: 'select', options: ['Match window frame', 'Matt black', 'White', 'Silver'] },
            ]
        },
    ],
    'Smart Home': [
        {
            category: 'Smart Switches & Hub', fields: [
                { label: 'Smart switch brand', type: 'select', options: ['Aqara', 'Sonoff', 'Yeelight', 'TP-Link Kasa', 'Lutron Caseta', 'Crestron', 'Control4', 'Conventional only', 'TBC'], required: true },
                { label: 'Smart hub', type: 'select', options: ['Apple HomeKit', 'Google Home', 'Amazon Alexa', 'Aqara Hub', 'Samsung SmartThings', 'Home Assistant', 'TBC'] },
                { label: 'Hub location', type: 'text', placeholder: 'e.g. DB box area, living room, utility room' },
                { label: 'Sensor locations', type: 'textarea', placeholder: 'Motion sensors, door sensors, leak sensors — where to run power/data' },
            ]
        },
        {
            category: 'Network & Connectivity', fields: [
                { label: 'WiFi system', type: 'select', options: ['Mesh WiFi (UniFi / TP-Link Deco)', 'Ceiling-mount APs (UniFi / Aruba)', 'ISP router only', 'TBC'] },
                { label: 'Number of APs', type: 'text', placeholder: 'e.g. 3 ceiling-mounted APs' },
                { label: 'LAN backhaul', type: 'select', options: ['CAT6 wired backhaul', 'Wireless mesh only', 'Both'] },
                { label: 'Server / NAS location', type: 'text', placeholder: 'e.g. utility room, DB box, study' },
            ]
        },
        {
            category: 'Motorization', fields: [
                { label: 'Motorized curtain track', type: 'select', options: ['Yes — power point at track', 'No', 'TBC'] },
                { label: 'Motorized blinds', type: 'select', options: ['Yes — power point at pelmet', 'No', 'TBC'] },
                { label: 'Smart lock', type: 'select', options: ['Battery-powered (no wiring)', 'Hardwired', 'N/A'] },
                { label: 'Auto gate motor', type: 'select', options: ['Yes (landed)', 'No', 'N/A'] },
            ]
        },
    ],
    'Curtains & Blinds': [
        {
            category: 'Curtain Specification', fields: [
                { label: 'Curtain supplier', type: 'text', placeholder: 'e.g. MC Curtain, Zetta, Soon Bee Huat, Window Connection' },
                {
                    label: 'Curtain type', type: 'select', options: [
                        '── PLEAT STYLES ──',
                        'S-fold / wave fold — modern clean ripple, most popular',
                        'Pinch pleat (single) — classic tailored',
                        'Pinch pleat (double / French) — formal, fullest',
                        'Pinch pleat (triple) — ultra-formal, hotel grade',
                        'Goblet pleat — wine-glass shaped top, luxury',
                        'Box pleat — flat structured folds',
                        'Inverted box pleat — clean flat panels',
                        'Pencil pleat — gathered, casual, tape top',
                        'Cartridge pleat — tubular folds, modern',
                        '── HEADING STYLES ──',
                        'Eyelet / grommet — rings punched through fabric',
                        'Tab top — fabric loops on rod',
                        'Hidden tab — invisible loops, clean line',
                        'Rod pocket — fabric threaded over rod',
                        'Tie top — fabric ties knotted on rod, casual',
                        '── COMBINATION ──',
                        'Day & night (sheer + blackout layered)',
                        'Blackout only',
                        'Sheer only (voile / organza)',
                        'Sheer + dim-out layered',
                        '── SPECIALTY ──',
                        'Japanese panel (flat sliding panels)',
                        'Cafe curtain (bottom half only)',
                        'Swag & tail (formal draping)',
                        'Austrian balloon (gathered festoons)',
                        'N/A',
                    ], required: true
                },
                { label: 'Track type', type: 'select', options: ['Ceiling-mounted track', 'Ceiling-recessed track (hidden in pelmet)', 'Wall-mounted rod (decorative)', 'Wall-mounted rod (plain)', 'Motorized track (Somfy / Aqara)', 'Motorized track (battery)', 'Double track (sheer + main)', 'Curtain box / pelmet'], required: true },
                { label: 'Track color', type: 'select', options: ['White', 'Matt black', 'Brushed gold', 'Brushed nickel', 'Brass', 'Silver', 'Bronze', 'Match ceiling'] },
                {
                    label: 'Fabric type', type: 'select', options: [
                        '── NATURAL ──',
                        'Linen — breathable, natural drape, wrinkles',
                        'Cotton — crisp, casual, light drape',
                        'Silk — luxurious sheen, delicate, dry clean',
                        'Wool — heavy drape, insulating, premium',
                        'Jute / burlap — rustic, textured, casual',
                        'Hemp — eco, similar to linen',
                        '── SYNTHETIC ──',
                        'Polyester — most common, durable, easy',
                        'Nylon — strong, mildew resistant',
                        'Rayon / viscose — silk-like, budget',
                        'Acrylic — sun-resistant, outdoor safe',
                        '── BLENDS ──',
                        'Linen-poly blend — best of both',
                        'Cotton-poly blend — easy care',
                        'Silk-poly blend — affordable sheen',
                        '── SPECIALTY ──',
                        'Velvet (cotton) — heavy, rich, dramatic',
                        'Velvet (polyester) — lighter, cheaper velvet',
                        'Chenille — soft textured, good drape',
                        'Jacquard — woven pattern, formal',
                        'Damask — woven tone-on-tone pattern',
                        'Brocade — raised woven pattern, luxe',
                        'Organza — sheer, sparkle',
                        'Voile — sheer, soft, plain',
                        'Muslin — ultra-lightweight, gauzy',
                        'Taffeta — crisp, rustling, formal',
                        'Dimout fabric — blocks 70-90% light',
                        'Blackout coated — blocks 99%+ light',
                        'Sunbrella (outdoor) — UV + mildew resistant',
                    ], required: true
                },
                { label: 'Lining', type: 'select', options: ['Blackout lining', 'Thermal lining', 'Interlining (premium weight)', 'Bump interlining (heaviest)', 'No lining'] },
            ]
        },
        {
            category: 'Blinds Specification', fields: [
                { label: 'Blind type', type: 'select', options: ['Roller blinds', 'Venetian (aluminium)', 'Venetian (timber)', 'Roman blinds', 'Vertical blinds', 'Zebra / combi blinds', 'N/A'], required: true },
                { label: 'Light control', type: 'select', options: ['Blackout', 'Dimout', 'Sunscreen / light filtering', 'Sheer'] },
                { label: 'Motorized', type: 'select', options: ['Battery motor', 'Hardwired motor', 'Manual', 'N/A'] },
                { label: 'Color / fabric code', type: 'text', placeholder: 'Brand fabric reference code' },
            ]
        },
        {
            category: 'Room-by-Room Treatment', fields: [
                { label: 'Living room', type: 'text', placeholder: 'e.g. Day & night S-fold curtain + sheer' },
                { label: 'Master bedroom', type: 'text', placeholder: 'e.g. Blackout roller + sheer curtain' },
                { label: 'Bedroom 2', type: 'text', placeholder: 'e.g. Zebra blinds' },
                { label: 'Bedroom 3', type: 'text', placeholder: 'e.g. Roller blinds (blackout)' },
                { label: 'Study', type: 'text', placeholder: 'e.g. Venetian timber blinds' },
                { label: 'Kitchen', type: 'text', placeholder: 'e.g. Roller blind (fire-safe)' },
                { label: 'Balcony', type: 'text', placeholder: 'e.g. Outdoor roller / ziptrak / none' },
            ]
        },
    ],
    'Wallpaper': [
        {
            category: 'Wallpaper Specification', fields: [
                { label: 'Wallpaper brand', type: 'select', options: ['Sanderson', 'Cole & Son', 'Graham & Brown', 'Harlequin', 'Morris & Co', 'Designers Guild', 'Farrow & Ball', 'de Gournay (hand-painted)', 'Fromental (embroidered)', 'Phillip Jeffries', 'Elitis', 'Goodrich', 'Korea wallpaper', 'China wallpaper', 'Custom print', 'N/A'] },
                {
                    label: 'Wallpaper type', type: 'select', options: [
                        '── STANDARD ──',
                        'Non-woven (easiest install/remove, most popular)',
                        'Vinyl (wet areas, wipeable)',
                        'Pre-pasted (water-activated)',
                        'Peel & stick (removable)',
                        '── PREMIUM ──',
                        'Fabric-backed vinyl (commercial grade)',
                        'Paper-backed (traditional, UK/European)',
                        'Flocked (raised velvet texture)',
                        'Foil / metallic (reflective)',
                        'Embossed / textured',
                        '── NATURAL ──',
                        'Grasscloth (woven seagrass/jute)',
                        'Sisal (natural fiber)',
                        'Cork wallcovering',
                        'Mica / stone chip',
                        'Bamboo weave',
                        'Silk wallcovering',
                        '── ULTRA-LUXURY ──',
                        'Hand-painted scenic (de Gournay style)',
                        'Hand-embroidered (Fromental style)',
                        'Gold leaf / silver leaf',
                        'Leather panels',
                        'Suede panels',
                        '── SPECIALTY ──',
                        'Acoustic wallcovering (sound absorbing)',
                        'Magnetic wallpaper (for magnets)',
                        'Whiteboard / dry-erase wallpaper',
                        'Chalkboard wallpaper',
                        'N/A',
                    ], required: true
                },
                {
                    label: 'Pattern style', type: 'select', options: [
                        'Solid / plain texture',
                        'Geometric — modern lines, shapes',
                        'Damask — classic tone-on-tone',
                        'Floral — botanical, garden',
                        'Tropical — palm, banana leaf, jungle',
                        'Chinoiserie — Chinese-inspired birds, branches',
                        'Toile de Jouy — French pastoral scenes',
                        'Art Deco — fan, shell, gold geometric',
                        'Mid-century modern — retro, atomic',
                        'Moroccan / Moorish — zellige-inspired',
                        'Japanese — wave (seigaiha), cloud, crane',
                        'Brick / stone effect',
                        'Wood grain effect',
                        'Concrete effect',
                        'Marble / stone veining effect',
                        'Trellis / lattice',
                        'Stripes — vertical / horizontal',
                        'Plaid / tartan',
                        'Abstract / brushstroke',
                        'Mural / scenic landscape',
                        'Terrazzo effect',
                        'Animal print',
                        'Custom / digital print',
                    ]
                },
                { label: 'Coverage', type: 'select', options: ['Accent wall only', 'Full room', 'Multiple rooms', 'Ceiling', 'Ceiling + walls', 'Powder room (full wrap)'] },
                { label: 'Location', type: 'textarea', placeholder: 'Which walls, rooms — e.g. living room TV wall, master bedroom headboard wall' },
            ]
        },
    ],
    'Metalwork': [
        {
            category: 'Metal Fabrication', fields: [
                { label: 'Work type', type: 'select', options: ['Railing / balustrade', 'Staircase (landed)', 'Custom shelving / frame', 'Gate / fencing', 'Awning / canopy', 'Partition screen', 'Window grille', 'Shoe rack frame', 'Suspended shelf bracket', 'Display frame', 'Custom furniture base'], required: true },
                { label: 'Material', type: 'select', options: ['Mild steel', 'Stainless steel (304)', 'Stainless steel (316 — marine/outdoor)', 'Aluminium', 'Wrought iron', 'Brass (solid)', 'Copper (solid)', 'Bronze', 'Corten steel (weathering steel)', 'Cast iron'], required: true },
                {
                    label: 'Finish', type: 'select', options: [
                        '── POWDER COAT ──',
                        'Powder coat — matt black (RAL 9005)',
                        'Powder coat — satin black',
                        'Powder coat — gloss black',
                        'Powder coat — white (RAL 9016)',
                        'Powder coat — dark grey (RAL 7016)',
                        'Powder coat — custom RAL color',
                        'Powder coat — textured / wrinkle',
                        '── METAL FINISH ──',
                        'Hairline stainless steel',
                        'Mirror polish stainless',
                        'Brushed brass / PVD gold',
                        'Brushed nickel',
                        'Antique brass (aged patina)',
                        'Oil-rubbed bronze',
                        'Rose gold / copper PVD',
                        'Blackened steel (patina)',
                        'Raw / industrial (clear coat only)',
                        'Corten rust finish (weathered)',
                        '── OUTDOOR / HEAVY DUTY ──',
                        'Hot-dip galvanized',
                        'Electrostatic spray',
                        'Anodized aluminium',
                    ]
                },
                { label: 'Glass infill', type: 'select', options: ['Tempered clear glass', 'Tempered tinted glass', 'Frosted glass', 'Laminated glass (safety)', 'Reeded / fluted glass', 'Rain glass', 'Wire glass', 'No glass', 'Wire mesh', 'Perforated metal sheet', 'Expanded metal mesh'] },
                { label: 'Dimensions', type: 'textarea', placeholder: 'Height, width, number of panels, spacing between balusters' },
            ]
        },
        {
            category: 'Architectural Hardware', fields: [
                {
                    label: 'Door knocker', type: 'select', options: [
                        'N/A',
                        '── CLASSIC ──',
                        'Lion head knocker — brass',
                        'Lion head knocker — aged bronze',
                        'Lion head knocker — matt black iron',
                        'Ring knocker — simple round',
                        'Urn knocker — decorative',
                        'Doctors knocker — S-curve (Georgian)',
                        'Fox head knocker',
                        'Eagle / hawk knocker',
                        '── MODERN ──',
                        'Flat bar knocker — minimalist',
                        'Ball knocker — spherical',
                        'Cylinder knocker — tubular',
                        'Custom design — specify',
                    ]
                },
                { label: 'House numbers', type: 'select', options: ['Brushed stainless steel', 'Matt black', 'Brass', 'Bronze', 'Backlit LED', 'Ceramic tile (heritage)', 'Floating numbers (standoff mount)', 'N/A'] },
                { label: 'Letterbox / mail slot', type: 'select', options: ['Through-door mail slot — brass', 'Through-door mail slot — chrome', 'Wall-mounted letterbox — modern', 'Wall-mounted letterbox — heritage', 'Post-mounted letterbox', 'N/A'] },
                { label: 'Gate hardware', type: 'select', options: ['Auto-gate motor (swing)', 'Auto-gate motor (slide)', 'Manual latch — black iron', 'Manual latch — stainless', 'Ring pull — wrought iron', 'Thumb latch — heritage', 'Magnetic lock (access control)', 'N/A'] },
                { label: 'Outdoor lighting brackets', type: 'select', options: ['Lantern bracket — wrought iron', 'Lantern bracket — brass', 'Coach lamp mount', 'Modern wall arm — matt black', 'Gooseneck barn light bracket', 'N/A'] },
                { label: 'Decorative brackets', type: 'select', options: ['Shelf bracket — L-shape industrial', 'Shelf bracket — ornate scroll', 'Shelf bracket — hairpin', 'Shelf bracket — triangle', 'Curtain rod finial — ball', 'Curtain rod finial — spear', 'Curtain rod finial — scroll', 'Custom — specify', 'N/A'] },
            ]
        },
    ],
    'Cleaning': [
        {
            category: 'Post-Renovation Cleaning', fields: [
                { label: 'Cleaning scope', type: 'select', options: ['Full unit deep clean', 'Specific areas only', 'Chemical wash (tiles/glass)', 'Move-in ready package'], required: true },
                { label: 'Special treatment', type: 'select', options: ['Marble polishing / crystallization', 'Grout sealing', 'Floor polish', 'None'] },
                { label: 'Timing', type: 'select', options: ['After all trades complete', 'After hacking (mid-reno)', 'Before handover'] },
                { label: 'Cleaning company', type: 'text', placeholder: 'Company name or TBC' },
            ]
        },
    ],
    'Pest Control': [
        {
            category: 'Pest Treatment', fields: [
                { label: 'Treatment type', type: 'select', options: ['Pre-reno termite treatment', 'Post-reno termite barrier', 'General pest control', 'Bed bug treatment', 'N/A'], required: true },
                { label: 'Treatment method', type: 'select', options: ['Soil treatment (landed)', 'Corrective treatment (existing infestation)', 'Preventive barrier', 'Bait system'] },
                { label: 'Provider', type: 'text', placeholder: 'e.g. Rentokil, Anticimex, local vendor' },
                { label: 'Warranty period', type: 'select', options: ['1 year', '3 years', '5 years', 'No warranty'] },
            ]
        },
    ],
    'Security': [
        {
            category: 'Security System', fields: [
                { label: 'CCTV system', type: 'select', options: ['IP camera (WiFi)', 'IP camera (POE wired)', 'Analog CCTV', 'Video doorbell only', 'None'], required: true },
                { label: 'Number of cameras', type: 'text', placeholder: 'e.g. 4 indoor + 2 outdoor' },
                { label: 'NVR / storage', type: 'select', options: ['NVR with HDD', 'Cloud storage (subscription)', 'SD card per camera', 'N/A'] },
                { label: 'Video doorbell', type: 'select', options: ['Ring', 'Google Nest', 'Aqara', 'Hikvision', 'None'] },
                { label: 'Alarm system', type: 'select', options: ['Wired alarm panel', 'Wireless alarm (Aqara / SimpliSafe)', 'Monitored alarm (ADT)', 'None'] },
                { label: 'Intercom', type: 'select', options: ['IP video intercom', 'Audio-only intercom', 'Existing — keep', 'None'] },
            ]
        },
    ],
};

const CROSS_TRADE_SPECS: SpecCategory = {
    category: 'Cross-Trade Coordination',
    fields: [
        { label: 'Concealed or exposed installations', type: 'select', options: ['All concealed', 'All exposed', 'Mixed — see notes'], required: true },
        { label: 'Casing allowance', type: 'textarea', placeholder: 'Door/window casing thickness, clearance requirements, anything that cannot sit flush' },
        { label: 'Wire management', type: 'textarea', placeholder: 'TV cables, data runs, how to hide wires behind carpentry' },
        { label: 'Curtains / blinds', type: 'select', options: ['Curtain track (ceiling-mounted)', 'Curtain rod (wall-mounted)', 'Roller blinds', 'Venetian blinds', 'Roman blinds', 'Day & night blinds', 'None'] },
        { label: 'Curtain pelmet', type: 'select', options: ['Built into false ceiling', 'Separate pelmet box', 'No pelmet — exposed track', 'N/A'] },
        { label: 'Coordination notes', type: 'textarea', placeholder: 'Which trades depend on each other, sequencing requirements, site constraints' },
        { label: 'Appliance coordination', type: 'textarea', placeholder: 'Built-in oven cutout dimensions, fridge gap, washer/dryer plumbing point, hood ducting' },
        { label: 'Balcony / outdoor', type: 'textarea', placeholder: 'Decking material (composite/teak), planter box, laundry rack type (ceiling/wall), outdoor wash point' },
        { label: 'HDB renovation permit', type: 'text', placeholder: 'HDB permit number / condo management approval date' },
        { label: 'Defect inspection', type: 'select', options: ['Pre-reno defect list done', 'Post-reno snag list scheduled', 'Both', 'N/A'] },
        { label: 'Renovation insurance', type: 'select', options: ['All-risk insurance obtained', 'Contractor has public liability', 'No insurance', 'TBC'] },
        { label: 'Feature wall', type: 'textarea', placeholder: 'Material (fluted panel/slat wall/stone veneer/metal), which trade executes, LED integration, location' },
    ],
};

// ============================================================
// COMPONENT
// ============================================================

export default function DispatchPage() {
    const [showNewPO, setShowNewPO] = useState(false);
    const [selectedTrade, setSelectedTrade] = useState<string>('');
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [formValues, setFormValues] = useState<Record<string, string | boolean>>({});
    const [materialFilter, setMaterialFilter] = useState<string>('all');
    const [dispatchView, setDispatchView] = useState<'po' | 'site' | 'deliveries'>('po');
    const [ratingTarget, setRatingTarget] = useState<{ name: string; trade: string; project: string } | null>(null);
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    const toggleCategory = (cat: string) => {
        setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    const setField = (key: string, value: string | boolean) => {
        setFormValues(prev => ({ ...prev, [key]: value }));
    };

    const trades = Object.keys(TRADE_SPECS);
    const specs = selectedTrade ? TRADE_SPECS[selectedTrade] : [];
    const filledRequired = specs.flatMap(s => s.fields.filter(f => f.required)).every(f => {
        const key = `${selectedTrade}:${f.label}`;
        const val = formValues[key];
        return val !== undefined && val !== '' && val !== false;
    });

    return (
        <div style={{ fontFamily: f, minHeight: '100vh', background: '#FAFAF9' }}>
            <RoofNav />

            <div style={{ padding: '24px 32px' }}>
                {/* ===== TAB BAR ===== */}
                <div style={{ display: 'flex', gap: 2, marginBottom: 20, background: '#F7F6F3', borderRadius: 8, padding: 3 }}>
                    {(['po', 'site', 'deliveries'] as const).map(t => (
                        <button key={t} onClick={() => setDispatchView(t)} style={{
                            flex: 1, padding: '8px 0', fontSize: 12, fontWeight: 600, borderRadius: 6,
                            border: 'none', cursor: 'pointer', fontFamily: f,
                            background: dispatchView === t ? 'white' : 'transparent',
                            color: dispatchView === t ? '#37352F' : '#9B9A97',
                            boxShadow: dispatchView === t ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                        }}>
                            {t === 'po' ? 'PO Board' : t === 'site' ? 'Site Command' : 'Deliveries'}
                        </button>
                    ))}
                </div>

                {/* ===== PO VIEW ===== */}
                {dispatchView === 'po' && (<>
                    {/* ===== NEW PO CREATION ===== */}
                    {showNewPO && (
                        <div style={{ marginBottom: 24 }}>
                            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#37352F', margin: '0 0 16px' }}>Create Purchase Order</h2>

                            {/* Trade Selector */}
                            <div style={{ marginBottom: 20 }}>
                                <div style={{ fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Select Trade</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {trades.map(t => (
                                        <button key={t} onClick={() => {
                                            setSelectedTrade(t);
                                            setFormValues({});
                                            const cats: Record<string, boolean> = {};
                                            TRADE_SPECS[t].forEach((s, i) => { cats[s.category] = i === 0; });
                                            cats[CROSS_TRADE_SPECS.category] = false;
                                            setExpandedCategories(cats);
                                        }} style={{
                                            padding: '8px 14px', fontSize: 12, fontWeight: selectedTrade === t ? 700 : 500, border: '1px solid #E9E9E7',
                                            borderRadius: 6, cursor: 'pointer', fontFamily: f,
                                            background: selectedTrade === t ? '#37352F' : 'white',
                                            color: selectedTrade === t ? 'white' : '#6B6A67',
                                        }}>{t}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Trade-Specific Specs */}
                            {selectedTrade && (
                                <div>
                                    <div style={{ fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                                        {selectedTrade} — Site Instructions
                                    </div>

                                    {/* General PO Info */}
                                    <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 20, marginBottom: 12 }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                                            <div>
                                                <label style={{ fontSize: 10, fontWeight: 600, color: '#9B9A97', display: 'block', marginBottom: 4 }}>Project</label>
                                                <input type="text" placeholder="e.g. Lim Residence (Punggol)" style={{ width: '100%', padding: '8px 10px', fontSize: 12, border: '1px solid #E9E9E7', borderRadius: 6, fontFamily: f, outline: 'none', boxSizing: 'border-box' }} />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: 10, fontWeight: 600, color: '#9B9A97', display: 'block', marginBottom: 4 }}>Vendor</label>
                                                <input type="text" placeholder="Select or type vendor name" style={{ width: '100%', padding: '8px 10px', fontSize: 12, border: '1px solid #E9E9E7', borderRadius: 6, fontFamily: f, outline: 'none', boxSizing: 'border-box' }} />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: 10, fontWeight: 600, color: '#9B9A97', display: 'block', marginBottom: 4 }}>Site Address</label>
                                                <input type="text" placeholder="Block, unit, postal code" style={{ width: '100%', padding: '8px 10px', fontSize: 12, border: '1px solid #E9E9E7', borderRadius: 6, fontFamily: f, outline: 'none', boxSizing: 'border-box' }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Trade-Specific Categories */}
                                    {[...specs, CROSS_TRADE_SPECS].map(specCat => {
                                        const isExpanded = expandedCategories[specCat.category] !== false;
                                        const catRequiredCount = specCat.fields.filter(f => f.required).length;
                                        const catFilledCount = specCat.fields.filter(f => {
                                            if (!f.required) return false;
                                            const key = `${selectedTrade}:${f.label}`;
                                            const val = formValues[key];
                                            return val !== undefined && val !== '' && val !== false;
                                        }).length;

                                        return (
                                            <div key={specCat.category} style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', marginBottom: 8, overflow: 'hidden' }}>
                                                <button onClick={() => toggleCategory(specCat.category)} style={{
                                                    width: '100%', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    background: 'none', border: 'none', cursor: 'pointer', fontFamily: f,
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        {isExpanded ? <ChevronDown style={{ width: 14, height: 14, color: '#9B9A97' }} /> : <ChevronRight style={{ width: 14, height: 14, color: '#9B9A97' }} />}
                                                        <span style={{ fontSize: 12, fontWeight: 700, color: '#37352F' }}>{specCat.category}</span>
                                                        {catRequiredCount > 0 && (
                                                            <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: catFilledCount === catRequiredCount ? '#F0FDF4' : '#F7F6F3', color: catFilledCount === catRequiredCount ? '#22C55E' : '#9B9A97' }}>
                                                                {catFilledCount}/{catRequiredCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>

                                                {isExpanded && (
                                                    <div style={{ padding: '0 20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                        {specCat.fields.map(field => {
                                                            const key = `${selectedTrade}:${field.label}`;
                                                            const value = formValues[key] ?? '';
                                                            return (
                                                                <div key={field.label}>
                                                                    <label style={{ fontSize: 11, fontWeight: 600, color: '#37352F', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                                                                        {field.label}
                                                                        {field.required && <span style={{ color: '#EF4444', fontSize: 10 }}>*</span>}
                                                                        {field.unit && <span style={{ fontSize: 9, color: '#9B9A97', fontWeight: 400 }}>({field.unit})</span>}
                                                                    </label>
                                                                    {field.type === 'select' && (
                                                                        <select
                                                                            value={value as string}
                                                                            onChange={e => setField(key, e.target.value)}
                                                                            style={{ width: '100%', padding: '8px 10px', fontSize: 12, border: '1px solid #E9E9E7', borderRadius: 6, fontFamily: f, outline: 'none', background: 'white', color: value ? '#37352F' : '#9B9A97' }}
                                                                        >
                                                                            <option value="">Select...</option>
                                                                            {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                                                                        </select>
                                                                    )}
                                                                    {field.type === 'text' && (
                                                                        <input
                                                                            type="text"
                                                                            value={value as string}
                                                                            onChange={e => setField(key, e.target.value)}
                                                                            placeholder={field.placeholder}
                                                                            style={{ width: '100%', padding: '8px 10px', fontSize: 12, border: '1px solid #E9E9E7', borderRadius: 6, fontFamily: f, outline: 'none', boxSizing: 'border-box' }}
                                                                        />
                                                                    )}
                                                                    {field.type === 'number' && (
                                                                        <input
                                                                            type="number"
                                                                            value={value as string}
                                                                            onChange={e => setField(key, e.target.value)}
                                                                            placeholder={field.placeholder}
                                                                            style={{ width: '100%', padding: '8px 10px', fontSize: 12, border: '1px solid #E9E9E7', borderRadius: 6, fontFamily: f, outline: 'none', boxSizing: 'border-box' }}
                                                                        />
                                                                    )}
                                                                    {field.type === 'textarea' && (
                                                                        <textarea
                                                                            value={value as string}
                                                                            onChange={e => setField(key, e.target.value)}
                                                                            placeholder={field.placeholder}
                                                                            rows={2}
                                                                            style={{ width: '100%', padding: '8px 10px', fontSize: 12, border: '1px solid #E9E9E7', borderRadius: 6, fontFamily: f, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                                                                        />
                                                                    )}
                                                                    {field.type === 'toggle' && (
                                                                        <button
                                                                            onClick={() => setField(key, !value)}
                                                                            style={{
                                                                                padding: '6px 14px', fontSize: 11, fontWeight: 600, border: '1px solid #E9E9E7',
                                                                                borderRadius: 6, cursor: 'pointer', fontFamily: f,
                                                                                background: value ? '#37352F' : 'white',
                                                                                color: value ? 'white' : '#9B9A97',
                                                                            }}
                                                                        >
                                                                            {value ? 'Yes' : 'No'}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* Dispatch Button */}
                                    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                        <button style={{ padding: '10px 20px', fontSize: 12, fontWeight: 600, background: 'white', color: '#37352F', border: '1px solid #E9E9E7', borderRadius: 6, cursor: 'pointer', fontFamily: f }}>
                                            Save Draft
                                        </button>
                                        <button
                                            disabled={!filledRequired}
                                            style={{
                                                padding: '10px 20px', fontSize: 12, fontWeight: 700, border: 'none', borderRadius: 6, cursor: filledRequired ? 'pointer' : 'not-allowed', fontFamily: f,
                                                background: filledRequired ? '#37352F' : '#E9E9E7',
                                                color: filledRequired ? 'white' : '#9B9A97',
                                                display: 'flex', alignItems: 'center', gap: 6,
                                                opacity: filledRequired ? 1 : 0.6,
                                            }}
                                        >
                                            <Send style={{ width: 12, height: 12 }} />
                                            Dispatch PO
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {/* ===== KANBAN BOARD ===== */}
                    {!showNewPO && (
                        <div style={{ marginBottom: 32 }}>
                            {/* Trade Filter */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Filter:</span>
                                {['All', ...Object.keys(TRADE_SPECS)].map(t => (
                                    <button key={t} style={{
                                        padding: '4px 10px', fontSize: 10, fontWeight: 600, border: '1px solid #E9E9E7',
                                        borderRadius: 4, cursor: 'pointer', fontFamily: f,
                                        background: t === 'All' ? '#37352F' : 'white',
                                        color: t === 'All' ? 'white' : '#9B9A97',
                                    }}>{t}</button>
                                ))}
                            </div>

                            {/* Kanban Columns */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, overflowX: 'auto' }}>
                                {[
                                    {
                                        status: 'Draft', color: '#9B9A97', items: [
                                            { project: 'Tan Residence (Clementi)', trade: 'Tiling', vendor: '—', updated: '2h ago' },
                                            { project: 'Tan Residence (Clementi)', trade: 'Painting', vendor: '—', updated: '2h ago' },
                                        ]
                                    },
                                    {
                                        status: 'Sent', color: '#3B82F6', items: [
                                            { project: 'Lim Residence (Punggol)', trade: 'Carpentry', vendor: 'Hock Seng Carpentry', updated: '1h ago' },
                                            { project: 'Lim Residence (Punggol)', trade: 'Electrical', vendor: 'KH Electrical', updated: '45m ago' },
                                            { project: 'Wong Condo (Bishan)', trade: 'Countertop', vendor: 'Qi Quartz', updated: '30m ago' },
                                        ]
                                    },
                                    {
                                        status: 'Accepted', color: '#8B5CF6', items: [
                                            { project: 'Lim Residence (Punggol)', trade: 'Hacking & Demolition', vendor: 'Soon Huat Demo', updated: 'Today 9am' },
                                            { project: 'Wong Condo (Bishan)', trade: 'Plumbing', vendor: 'Ah Kow Plumbing', updated: 'Yesterday' },
                                        ]
                                    },
                                    {
                                        status: 'In Progress', color: '#F59E0B', items: [
                                            { project: 'Chen BTO (Tampines)', trade: 'Plastering & Ceiling', vendor: 'Union Plaster', updated: 'Day 3 of 5' },
                                            { project: 'Chen BTO (Tampines)', trade: 'Aircon', vendor: 'CoolAire Pte Ltd', updated: 'Day 2 of 3' },
                                        ]
                                    },
                                    {
                                        status: 'Completed', color: '#22C55E', items: [
                                            { project: 'Chen BTO (Tampines)', trade: 'Hacking & Demolition', vendor: 'KL Demolition', updated: '3 days ago' },
                                        ]
                                    },
                                ].map(col => (
                                    <div key={col.status} style={{ minWidth: 220 }}>
                                        {/* Column Header */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '0 4px' }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                                            <span style={{ fontSize: 11, fontWeight: 700, color: '#37352F' }}>{col.status}</span>
                                            <span style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', background: '#F7F6F3', padding: '1px 6px', borderRadius: 4 }}>{col.items.length}</span>
                                        </div>

                                        {/* PO Cards */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {col.items.map((item, i) => (
                                                <div key={i} style={{
                                                    background: 'white', borderRadius: 8, border: '1px solid #E9E9E7', padding: 12,
                                                    borderLeft: `3px solid ${col.color}`, cursor: 'pointer',
                                                    transition: 'box-shadow 0.15s',
                                                }}
                                                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)')}
                                                    onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                                                >
                                                    <div style={{ fontSize: 11, fontWeight: 700, color: '#37352F', marginBottom: 4 }}>{item.trade}</div>
                                                    <div style={{ fontSize: 10, color: '#6B6A67', marginBottom: 6 }}>{item.project}</div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontSize: 9, color: '#9B9A97' }}>{item.vendor}</span>
                                                        <span style={{ fontSize: 9, color: '#D4D3D0' }}>{item.updated}</span>
                                                    </div>
                                                    {col.status === 'Completed' && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setRatingTarget({ name: item.vendor, trade: item.trade, project: item.project }); }}
                                                            style={{
                                                                marginTop: 8, width: '100%', padding: '6px 0', fontSize: 10, fontWeight: 600,
                                                                background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A',
                                                                borderRadius: 5, cursor: 'pointer', fontFamily: f,
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                                                            }}
                                                        >🔒 Rate Contractor</button>
                                                    )}
                                                </div>
                                            ))}

                                            {/* Empty state */}
                                            {col.items.length === 0 && (
                                                <div style={{ padding: 16, textAlign: 'center', color: '#D4D3D0', fontSize: 10, border: '1px dashed #E9E9E7', borderRadius: 8 }}>
                                                    No POs
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>)}

                {/* ===== SITE COMMAND VIEW ===== */}
                {dispatchView === 'site' && (
                    <div>
                        {/* Project Info Bar */}
                        <div style={{ background: 'white', border: '1px solid #E9E9E7', borderRadius: 10, padding: '14px 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <h2 style={{ fontSize: 14, fontWeight: 700, color: '#37352F', margin: 0 }}>Site Command</h2>
                                <span style={{ fontSize: 8, padding: '2px 8px', background: '#EFF6FF', color: '#3B82F6', borderRadius: 10, fontWeight: 700, textTransform: 'uppercase' }}>Live</span>
                                <span style={{ fontSize: 10, color: '#9B9A97' }}>Mr & Mrs Tan — Block 123 Tampines St 45 #12-345</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 9, color: '#9B9A97', textTransform: 'uppercase', fontWeight: 600 }}>Progress</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <div style={{ width: 80, height: 4, background: '#F5F5F4', borderRadius: 2, overflow: 'hidden' }}>
                                            <div style={{ width: '56%', height: '100%', background: '#37352F', borderRadius: 2 }} />
                                        </div>
                                        <span style={{ fontSize: 12, fontWeight: 800, color: '#37352F' }}>56%</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 9, color: '#9B9A97', textTransform: 'uppercase', fontWeight: 600 }}>Days Left</div>
                                    <span style={{ fontSize: 16, fontWeight: 900, color: '#37352F' }}>19</span>
                                </div>
                            </div>
                        </div>

                        {/* No-Show Alert */}
                        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 16 }}>🚨</span>
                                <div>
                                    <p style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', margin: 0 }}>Vendor No-Show Alert</p>
                                    <p style={{ fontSize: 10, color: '#EF4444', margin: '2px 0 0' }}>CoolAir SG (CA-001) — Xiao Ming did not check in for trunking installation</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <button style={{ fontSize: 10, padding: '5px 12px', background: 'white', border: '1px solid #FECACA', color: '#DC2626', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>Call Vendor</button>
                                <button style={{ fontSize: 10, padding: '5px 12px', background: '#DC2626', border: 'none', color: 'white', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>Dispatch Backup</button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 16 }}>
                            {[
                                { label: 'On Site Now', value: '2', color: '#22C55E', bg: '#F0FDF4' },
                                { label: 'En Route', value: '1', color: '#3B82F6', bg: '#EFF6FF' },
                                { label: 'Completed', value: '1', color: '#6B6A67', bg: '#F7F6F3' },
                                { label: 'No Shows', value: '1', color: '#DC2626', bg: '#FEF2F2' },
                                { label: 'Open Defects', value: '1', color: '#F59E0B', bg: '#FEF9C3' },
                                { label: 'Delayed', value: '1', color: '#DC2626', bg: '#FEF2F2' },
                            ].map(s => (
                                <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: 14, border: '1px solid #E9E9E7' }}>
                                    <div style={{ fontSize: 9, color: '#9B9A97', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                                    <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                            {/* Today's Crew */}
                            <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                    <h3 style={{ fontSize: 13, fontWeight: 700, color: '#37352F', margin: 0 }}>Today&apos;s Crew</h3>
                                    <span style={{ fontSize: 10, color: '#9B9A97' }}>{new Date().toLocaleDateString('en-SG', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                                </div>
                                {[
                                    { name: 'Ah Kow', trade: 'Tiler', vendor: 'WW-001', status: 'on-site', checkIn: '8:15 AM', task: 'Kitchen floor tiling (600×600)', location: 'Kitchen' },
                                    { name: 'Raju', trade: 'Tiler Helper', vendor: 'WW-001', status: 'on-site', checkIn: '8:20 AM', task: 'Cutting & grouting support', location: 'Kitchen' },
                                    { name: 'Ah Beng', trade: 'Plumber', vendor: 'PM-001', status: 'en-route', checkIn: '', task: 'Basin rough-in for master bath', location: 'Master Bath' },
                                    { name: 'Kumar', trade: 'Electrician', vendor: 'ST-001', status: 'completed', checkIn: '7:30 AM → 11:45 AM', task: 'DB box wiring + point marking', location: 'Whole Unit' },
                                    { name: 'Xiao Ming', trade: 'Aircon', vendor: 'CA-001', status: 'no-show', checkIn: '', task: 'Trunking installation', location: 'MBR + Living' },
                                ].map((crew, i) => (
                                    <div key={i} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 8, marginBottom: 6,
                                        background: crew.status === 'no-show' ? '#FEF2F2' : '#FAFAF9',
                                        border: `1px solid ${crew.status === 'no-show' ? '#FECACA' : '#F3F3F2'}`,
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{
                                                width: 8, height: 8, borderRadius: '50%',
                                                background: crew.status === 'on-site' ? '#22C55E' : crew.status === 'en-route' ? '#3B82F6' : crew.status === 'completed' ? '#9B9A97' : '#EF4444',
                                            }} />
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#37352F' }}>{crew.name}</span>
                                                    <span style={{ fontSize: 8, padding: '1px 5px', background: '#F7F6F3', color: '#6B6A67', borderRadius: 3, fontWeight: 600 }}>{crew.trade}</span>
                                                    <span style={{ fontSize: 8, padding: '1px 5px', background: '#FEF9C3', color: '#CA8A04', borderRadius: 3, fontFamily: "'SF Mono', monospace", fontWeight: 700 }}>{crew.vendor}</span>
                                                </div>
                                                <span style={{ fontSize: 10, color: '#9B9A97' }}>{crew.task} · 📍 {crew.location}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {crew.checkIn && <span style={{ fontSize: 9, color: '#9B9A97' }}>{crew.checkIn}</span>}
                                            <span style={{
                                                fontSize: 8, padding: '2px 8px', borderRadius: 10, fontWeight: 700, textTransform: 'uppercase', color: 'white',
                                                background: crew.status === 'on-site' ? '#22C55E' : crew.status === 'en-route' ? '#3B82F6' : crew.status === 'completed' ? '#9B9A97' : '#EF4444',
                                            }}>{crew.status === 'on-site' ? 'ON SITE' : crew.status === 'en-route' ? 'EN ROUTE' : crew.status === 'completed' ? 'DONE' : 'NO SHOW'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Right: Activity Feed + Quick Actions */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 20 }}>
                                    <h3 style={{ fontSize: 13, fontWeight: 700, color: '#37352F', margin: '0 0 12px' }}>Live Activity</h3>
                                    {[
                                        { icon: '📸', text: 'Uploaded 4 photos — Kitchen floor tiling 60%', who: 'Ah Kow', time: '12:30 PM', urgent: false },
                                        { icon: '👋', text: 'Checked out — DB box wiring complete', who: 'Kumar', time: '11:45 AM', urgent: false },
                                        { icon: '⚠️', text: 'Tile lippage at entrance >2mm', who: 'You', time: '11:20 AM', urgent: true },
                                        { icon: '📦', text: 'Bosch Dishwasher delivery confirmed for tomorrow', who: 'System', time: '10:00 AM', urgent: false },
                                        { icon: '💬', text: 'Can we change grout to dark grey?', who: 'Mrs Tan', time: '9:30 AM', urgent: false },
                                        { icon: '✅', text: 'Checked in — GPS verified', who: 'Raju', time: '8:20 AM', urgent: false },
                                    ].map((a, i) => (
                                        <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: i < 5 ? '1px solid #F5F5F3' : 'none' }}>
                                            <span style={{ fontSize: 13, flexShrink: 0 }}>{a.icon}</span>
                                            <div>
                                                <p style={{ fontSize: 10, color: a.urgent ? '#DC2626' : '#37352F', fontWeight: a.urgent ? 600 : 400, margin: 0 }}>{a.text}</p>
                                                <p style={{ fontSize: 9, color: '#9B9A97', margin: '1px 0 0' }}>{a.who} · {a.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 20 }}>
                                    <h3 style={{ fontSize: 13, fontWeight: 700, color: '#37352F', margin: '0 0 10px' }}>Quick Actions</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                        {[
                                            { label: 'Flag Defect', icon: '⚠️', bg: '#FEF9C3', color: '#CA8A04' },
                                            { label: 'Approve Work', icon: '✅', bg: '#F0FDF4', color: '#22C55E' },
                                            { label: 'Call Vendor', icon: '📞', bg: '#EFF6FF', color: '#3B82F6' },
                                            { label: 'Message Client', icon: '💬', bg: '#F5F3FF', color: '#8B5CF6' },
                                            { label: 'Upload Photos', icon: '📸', bg: '#F7F6F3', color: '#6B6A67' },
                                            { label: 'Add VO', icon: '📝', bg: '#EEF2FF', color: '#6366F1' },
                                        ].map(a => (
                                            <button key={a.label} style={{
                                                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', borderRadius: 8,
                                                border: '1px solid #E9E9E7', background: a.bg, fontSize: 10, fontWeight: 600,
                                                color: a.color, cursor: 'pointer', fontFamily: f,
                                            }}>
                                                <span>{a.icon}</span> {a.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== DELIVERIES VIEW ===== */}
                {dispatchView === 'deliveries' && (
                    <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 20 }}>
                        <div style={{ marginBottom: 16 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#37352F', margin: 0 }}>Delivery Coordination</h3>
                            <p style={{ fontSize: 10, color: '#9B9A97', margin: '4px 0 0' }}>Site deliveries + client purchases requiring coordination</p>
                        </div>
                        {[
                            { item: 'Bosch Dishwasher SMS2HVI72E', from: 'Lazada', eta: 'Tomorrow 2-5 PM', status: 'arriving-today', client: true, location: 'Kitchen', dims: '600×600×845mm' },
                            { item: 'Niro Granite Tiles 600×600 (Kitchen)', from: 'Hafary', eta: 'Today (delivered)', status: 'arriving-today', client: false, location: 'Kitchen' },
                            { item: 'Fanco Ceiling Fan', from: 'Taobao via ezbuy', eta: 'Feb 25', status: 'arriving-this-week', client: true, location: 'Master Bedroom' },
                            { item: 'Castlery Sofa (L-Shape)', from: 'Castlery.com', eta: 'Mar 1 (post-handover)', status: 'arriving-this-week', client: true, location: 'Living Room', dims: '2700×1800×850mm' },
                            { item: 'Aircon units ×3', from: 'CoolAir SG', eta: 'Delayed — vendor no-show', status: 'delayed', client: false, location: 'MBR + BR2 + Living' },
                        ].map((d, i) => (
                            <div key={i} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: 8, marginBottom: 6,
                                background: d.status === 'delayed' ? '#FEF2F2' : d.status === 'arriving-today' ? '#FEF9C3' : '#FAFAF9',
                                border: `1px solid ${d.status === 'delayed' ? '#FECACA' : d.status === 'arriving-today' ? '#FDE68A' : '#F3F3F2'}`,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                                        background: d.status === 'delayed' ? '#FEE2E2' : d.status === 'arriving-today' ? '#FEF3C7' : '#DBEAFE',
                                    }}>
                                        {d.status === 'delayed' ? '⚠️' : '📦'}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: '#37352F' }}>{d.item}</span>
                                            {d.client && <span style={{ fontSize: 7, padding: '1px 5px', background: '#F5F3FF', color: '#8B5CF6', borderRadius: 10, fontWeight: 700, textTransform: 'uppercase' }}>Client Purchase</span>}
                                        </div>
                                        <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
                                            <span style={{ fontSize: 10, color: '#9B9A97' }}>from {d.from}</span>
                                            <span style={{ fontSize: 10, color: '#9B9A97' }}>📍 {d.location}</span>
                                            {d.dims && <span style={{ fontSize: 10, color: '#9B9A97' }}>📐 {d.dims}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 11, fontWeight: 600, color: d.status === 'delayed' ? '#DC2626' : d.status === 'arriving-today' ? '#CA8A04' : '#37352F' }}>{d.eta}</div>
                                    <span style={{
                                        fontSize: 8, fontWeight: 700, padding: '2px 8px', borderRadius: 10, textTransform: 'uppercase',
                                        background: d.status === 'delayed' ? '#FEE2E2' : d.status === 'arriving-today' ? '#FEF3C7' : '#DBEAFE',
                                        color: d.status === 'delayed' ? '#DC2626' : d.status === 'arriving-today' ? '#CA8A04' : '#3B82F6',
                                    }}>{d.status === 'delayed' ? 'DELAYED' : d.status === 'arriving-today' ? 'TODAY/TOMORROW' : 'THIS WEEK'}</span>
                                </div>
                            </div>
                        ))}

                        <div style={{ background: '#EFF6FF', borderRadius: 8, padding: 12, marginTop: 14, fontSize: 10, color: '#3B82F6' }}>
                            <strong>Synced from client&apos;s My Purchases:</strong> Items marked &quot;Client Purchase&quot; were added by the homeowner. Dimensions auto-loaded for equipment layout planning.
                        </div>
                    </div>
                )}

            </div>

            {/* Rating Modal */}
            <RatingModal
                isOpen={!!ratingTarget}
                onClose={() => setRatingTarget(null)}
                onSubmit={(data) => { console.log('Rating submitted:', data); setRatingTarget(null); }}
                targetName={ratingTarget?.name || ''}
                targetRole={ratingTarget?.trade || ''}
                projectName={ratingTarget?.project}
                criteria={CRITERIA.designerRatesContractor}
            />
        </div>
    );
}

