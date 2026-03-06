'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, MapPin, Activity, Plus, ChevronDown, ChevronRight, Send } from 'lucide-react';
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
                { label: 'Veneer species', type: 'select', options: ['N/A — laminate', 'Oak (white)', 'Oak (red)', 'Walnut', 'Teak', 'Ash', 'Maple', 'Cherry', 'Nyatoh', 'Meranti', 'Rubberwood', 'Custom'] },
                { label: 'Solid timber species', type: 'select', options: ['N/A — engineered', 'Nyatoh', 'Chengal (outdoor grade)', 'Meranti', 'Teak', 'Oak', 'Walnut', 'Ash', 'Rubberwood', 'Pine', 'Bamboo', 'Custom'] },
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
            category: 'Tile Specification', fields: [
                { label: 'Tile layout', type: 'select', options: ['Stack bond', 'Brick bond (1/2 offset)', '1/3 offset', 'Herringbone', 'Double herringbone', 'Chevron', '45° diagonal', 'Basket weave', 'Versailles', 'Pinwheel', 'Windmill', 'Custom'], required: true },
                { label: 'Grout brand', type: 'select', options: ['Mapei Keracolor', 'Mapei Ultracolor Plus', 'Laticrete Permacolor', 'Weber', 'Generic'], required: true },
                { label: 'Grout color code', type: 'text', placeholder: 'e.g. Mapei #100 White / #114 Anthracite', required: true },
                { label: 'Silicone sealant', type: 'select', options: ['Neutral cure (standard)', 'Sanitary grade (anti-mould)', 'Matching grout color'] },
                { label: 'Grout width', type: 'select', options: ['1.5mm', '2mm', '3mm', '5mm'] },
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
                { label: 'Doorway threshold', type: 'select', options: ['Marble strip', 'Tile-to-tile (match cut)', 'Aluminium trim strip', 'PVC transition strip', 'Repair broken tiles only', 'No threshold'], required: true },
                { label: 'Threshold material', type: 'text', placeholder: 'e.g. Volakas marble / black granite / stainless steel strip' },
            ]
        },
        {
            category: 'Bathroom Floor', fields: [
                { label: 'Kerb', type: 'select', options: ['Kerb (standard)', 'No kerb (curbless)', 'Half-height kerb'], required: true },
                { label: 'Floor level', type: 'select', options: ['Depressed (standard bathroom)', 'Elevated (platform shower)', 'Same level as outside', 'Step-down entry'], required: true },
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
            category: 'Stone Specification', fields: [
                { label: 'Stone type', type: 'select', options: ['Marble', 'Granite', 'Travertine', 'Slate', 'Limestone', 'Sandstone', 'Quartzite', 'N/A'], required: true },
                { label: 'Stone name', type: 'text', placeholder: 'e.g. Volakas, Calacatta, Carrara, Emperador, Nero Marquina' },
                { label: 'Application', type: 'select', options: ['Floor', 'Wall', 'Feature wall', 'Countertop', 'Vanity top', 'Window sill', 'Threshold'] },
                { label: 'Finish', type: 'select', options: ['Polished', 'Honed', 'Brushed / leathered', 'Tumbled', 'Flamed'] },
                { label: 'Sealer required', type: 'select', options: ['Penetrating sealer', 'Topical sealer', 'Both', 'Not required (granite/quartzite)'] },
                { label: 'Bookmatching', type: 'toggle' },
                { label: 'Supplier', type: 'text', placeholder: 'e.g. stone fabricator name, quarry source' },
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
                { label: 'Curtain type', type: 'select', options: ['Day & night (sheer + blackout)', 'Blackout only', 'Sheer only', 'Eyelet curtain', 'S-fold / wave fold', 'Pinch pleat', 'N/A'], required: true },
                { label: 'Track type', type: 'select', options: ['Ceiling-mounted track', 'Wall-mounted rod', 'Motorized track (smart)', 'Curtain box / pelmet'], required: true },
                { label: 'Track color', type: 'select', options: ['White', 'Matt black', 'Silver', 'Match ceiling'] },
                { label: 'Fabric type', type: 'select', options: ['Polyester', 'Linen blend', 'Velvet', 'Cotton', 'Dimout fabric', 'Blackout coated'] },
                { label: 'Lining', type: 'select', options: ['Blackout lining', 'Thermal lining', 'Interlining (premium)', 'No lining'] },
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
                { label: 'Wallpaper brand', type: 'select', options: ['Sanderson', 'Cole & Son', 'Graham & Brown', 'Harlequin', 'Goodrich', 'Korea wallpaper', 'China wallpaper', 'Custom print', 'N/A'] },
                { label: 'Wallpaper type', type: 'select', options: ['Non-woven (easiest)', 'Vinyl (wet areas)', 'Fabric-backed', 'Grasscloth / natural', 'Peel & stick', 'N/A'], required: true },
                { label: 'Coverage', type: 'select', options: ['Accent wall only', 'Full room', 'Multiple rooms', 'Ceiling'] },
                { label: 'Location', type: 'textarea', placeholder: 'Which walls, rooms — e.g. living room TV wall, master bedroom headboard wall' },
            ]
        },
    ],
    'Metalwork': [
        {
            category: 'Metal Fabrication', fields: [
                { label: 'Work type', type: 'select', options: ['Railing / balustrade', 'Staircase (landed)', 'Custom shelving / frame', 'Gate / fencing', 'Awning / canopy', 'Partition screen'], required: true },
                { label: 'Material', type: 'select', options: ['Mild steel', 'Stainless steel (304)', 'Stainless steel (316 — outdoor)', 'Aluminium', 'Wrought iron', 'Brass / copper'], required: true },
                { label: 'Finish', type: 'select', options: ['Powder coat — matt black', 'Powder coat — custom RAL', 'Hairline stainless', 'Brushed brass', 'Raw / industrial', 'Hot-dip galvanized (outdoor)'] },
                { label: 'Glass infill', type: 'select', options: ['Tempered clear glass', 'Tempered tinted glass', 'Frosted glass', 'No glass', 'Wire mesh'] },
                { label: 'Dimensions', type: 'textarea', placeholder: 'Height, width, number of panels, spacing between balusters' },
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
            {/* Header */}
            <header style={{
                padding: '20px 32px', borderBottom: '1px solid #E9E9E7',
                background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                position: 'sticky', top: 0, zIndex: 30,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Link href="/hub" style={{ color: '#9B9A97', textDecoration: 'none' }}>
                        <ArrowLeft style={{ width: 20, height: 20 }} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#37352F', letterSpacing: '-0.02em' }}>Dispatch</h1>
                        <p style={{ fontSize: 10, color: '#9B9A97', margin: 0, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>Auto-price, source, and deploy vendors</p>
                    </div>
                </div>
                <button
                    onClick={() => { setShowNewPO(!showNewPO); if (!showNewPO) { setSelectedTrade(''); setFormValues({}); setExpandedCategories({}); } }}
                    style={{
                        padding: '8px 16px', fontSize: 12, fontWeight: 700, border: 'none', borderRadius: 6, cursor: 'pointer',
                        background: showNewPO ? '#F5F5F4' : '#37352F', color: showNewPO ? '#37352F' : 'white', fontFamily: f,
                        display: 'flex', alignItems: 'center', gap: 6,
                    }}
                >
                    {showNewPO ? 'Cancel' : <><Plus style={{ width: 14, height: 14 }} /> New PO</>}
                </button>
            </header>

            <div style={{ padding: '24px 32px' }}>
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

                {/* ===== EXISTING CONTENT: Price Index ===== */}
                <section style={{ marginBottom: 24 }}>
                    <h2 style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Price Index — Q1 2026</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                        {SEED_INDEX.map((idx) => {
                            const trendColor = idx.trend === 'UP' ? '#EF4444' : idx.trend === 'DOWN' ? '#22C55E' : '#9B9A97';
                            return (
                                <div key={idx.trade} style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: '#37352F' }}>{idx.trade}</span>
                                        {idx.trend === 'UP' && <TrendingUp style={{ width: 14, height: 14, color: trendColor }} />}
                                        {idx.trend === 'DOWN' && <TrendingDown style={{ width: 14, height: 14, color: trendColor }} />}
                                        {idx.trend === 'STABLE' && <Minus style={{ width: 14, height: 14, color: trendColor }} />}
                                    </div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: '#37352F' }}>
                                        ${idx.currentAvg.toFixed(2)}
                                        <span style={{ fontSize: 10, fontWeight: 500, color: '#9B9A97', marginLeft: 4 }}>/{idx.unit}</span>
                                    </div>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: trendColor, marginTop: 4 }}>
                                        {idx.changePercent > 0 ? '+' : ''}{idx.changePercent}% vs last quarter
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                        <span style={{ fontSize: 9, color: '#9B9A97' }}>Material: ${idx.breakdown.materialAvg}</span>
                                        <span style={{ fontSize: 9, color: '#9B9A97' }}>Labour: ${idx.breakdown.labourAvg}</span>
                                    </div>
                                    <div style={{ fontSize: 9, color: '#D4D3D0', marginTop: 4 }}>{idx.sampleSize} data points · {idx.confidence} confidence</div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Labour Benchmarks */}
                <section style={{ marginBottom: 24 }}>
                    <h2 style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Labour Rate Benchmarks</h2>
                    <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E9E9E7' }}>
                                    {['Trade', 'Unit', 'Min', 'Avg', 'Max', 'Notes'].map(h => (
                                        <th key={h} style={{ padding: '10px 16px', textAlign: h === 'Notes' || h === 'Trade' || h === 'Unit' ? 'left' : 'right', fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {LABOUR_BENCHMARKS.map((lb) => (
                                    <tr key={lb.trade} style={{ borderBottom: '1px solid #F5F5F4' }}>
                                        <td style={{ padding: '10px 16px', fontWeight: 600, color: '#37352F' }}>{lb.trade}</td>
                                        <td style={{ padding: '10px 16px', color: '#6B6A67' }}>{lb.unit}</td>
                                        <td style={{ padding: '10px 16px', textAlign: 'right', color: '#9B9A97' }}>${lb.rateMin.toFixed(2)}</td>
                                        <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: '#37352F' }}>${lb.rateAvg.toFixed(2)}</td>
                                        <td style={{ padding: '10px 16px', textAlign: 'right', color: '#9B9A97' }}>${lb.rateMax.toFixed(2)}</td>
                                        <td style={{ padding: '10px 16px', fontSize: 11, color: '#9B9A97' }}>{lb.notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Material Catalog */}
                <section>
                    <h2 style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Material Catalog</h2>

                    {/* Category Tabs */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                        {[{ key: 'all', label: 'All' }, { key: 'paint', label: 'Paint' }, { key: 'tile', label: 'Tile' }, { key: 'electrical', label: 'Electrical' }, { key: 'lighting', label: 'Lighting' }, { key: 'plumbing', label: 'Plumbing' }, { key: 'laminate', label: 'Laminate' }, { key: 'hardware', label: 'Hardware' }, { key: 'countertop', label: 'Countertop' }, { key: 'glass', label: 'Glass' }, { key: 'flooring', label: 'Flooring' }, { key: 'adhesive', label: 'Adhesive & Grout' }, { key: 'aircon', label: 'Aircon' }, { key: 'curtain', label: 'Curtain' }, { key: 'wallpaper', label: 'Wallpaper' }, { key: 'furniture', label: 'Furniture' }, { key: 'fixture', label: 'Fixture' }, { key: 'decor', label: 'Decor' }, { key: 'appliance', label: 'Appliance' }].map(cat => (
                            <button
                                key={cat.key}
                                onClick={() => setMaterialFilter(cat.key)}
                                style={{
                                    padding: '6px 14px', fontSize: 11, fontWeight: materialFilter === cat.key ? 700 : 500,
                                    border: '1px solid #E9E9E7', borderRadius: 6, cursor: 'pointer', fontFamily: f,
                                    background: materialFilter === cat.key ? '#37352F' : 'white',
                                    color: materialFilter === cat.key ? 'white' : '#6B6A67',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {cat.label}
                                <span style={{ fontSize: 9, marginLeft: 4, opacity: 0.6 }}>
                                    {cat.key === 'all' ? MATERIAL_CATALOG.length : MATERIAL_CATALOG.filter(m => m.category === cat.key).length}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {MATERIAL_CATALOG.filter(mat => materialFilter === 'all' || mat.category === materialFilter).map((mat) => (
                            <div key={mat.id} style={{
                                background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 16,
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                cursor: 'pointer', transition: 'border-color 0.15s',
                            }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = '#37352F')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = '#E9E9E7')}
                            >
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#37352F' }}>{mat.name}</div>
                                    <div style={{ fontSize: 10, color: '#9B9A97' }}>{mat.brand} · {mat.category}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 18, fontWeight: 800, color: '#37352F' }}>${mat.pricePerUnit.toFixed(2)}</div>
                                    <div style={{ fontSize: 9, color: '#9B9A97' }}>per {mat.unit}</div>
                                </div>
                            </div>
                        ))}
                        {MATERIAL_CATALOG.filter(mat => materialFilter === 'all' || mat.category === materialFilter).length === 0 && (
                            <div style={{ gridColumn: '1 / -1', padding: 24, textAlign: 'center', color: '#D4D3D0', fontSize: 12 }}>
                                No materials in this category yet
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

