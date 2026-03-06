import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// PDF QUOTE PARSER — "Michelin Kitchen" Edition
// ============================================================
// Like a restaurant receiving ingredients from different suppliers:
// - Supplier sends salmon in KG → we convert to portions
// - Vendor quotes tiles in sqm → we convert to sqft
// - Vendor says "20 meters piping" → normalized to 20 lm
// - Vendor says "3 cartons of tiles (20pcs)" → 60 pcs at per-pc rate
//
// The ID doesn't care where the numbers come from.
// Every line item matches the quote builder's standard format.
// ============================================================

interface ParsedLineItem {
    description: string;
    quantity: number;
    unit: string;
    unitRate: number;
    totalPrice: number;
    category: string;
    location: string;
    taskType: string;
    specifications: string;
    originalUnit?: string;     // what the vendor said
    originalQty?: number;      // what the vendor said
    wasConverted?: boolean;    // flag if we normalized
    conversionNote?: string;   // e.g. "45 sqm → 484.4 sqft"
}

interface ParseResult {
    vendorName: string;
    quoteRef: string;
    date: string;
    items: ParsedLineItem[];
    subtotal: number;
    gst: number;
    total: number;
    rawText: string;
    confidence: number;
}

// ============================================================
// UNIT CONVERSION ENGINE
// ============================================================
// Standard units in the quote builder:
//   Area:   sqft (primary), sqm (allowed)
//   Linear: lm (primary), m (allowed), mm
//   Count:  pcs, set, lot, nos, unit, pair, panel, leaf
//   Weight: kg, ton
//   Volume: cu.m
//   Consumable: roll, sheet, bag, litre
//   Labour: day, hr, trip
//   Fixed:  ls (lump sum)

interface ConversionResult {
    quantity: number;
    unit: string;
    unitRate: number;
    note: string;
}

function normalizeUnit(qty: number, unit: string, rate: number, desc: string): ConversionResult {
    const u = unit.toLowerCase().trim();
    const d = desc.toLowerCase();

    // ── AREA CONVERSIONS ──
    // sqm → sqft (1 sqm = 10.764 sqft)
    if (u === 'sqm' || u === 'sq.m' || u === 'sq m' || u === 'm2' || u === 'm²') {
        const newQty = Math.round(qty * 10.764 * 100) / 100;
        const newRate = Math.round(rate / 10.764 * 100) / 100;
        return { quantity: newQty, unit: 'sqft', unitRate: newRate, note: `${qty} sqm → ${newQty} sqft` };
    }

    // sf, sq ft → sqft
    if (u === 'sf' || u === 'sq ft' || u === 'sq.ft' || u === 'sft') {
        return { quantity: qty, unit: 'sqft', unitRate: rate, note: '' };
    }

    // ── LINEAR CONVERSIONS ──
    // m (meters) → lm (linear meters) — just rename
    if (u === 'm' || u === 'meter' || u === 'meters' || u === 'mtr') {
        return { quantity: qty, unit: 'lm', unitRate: rate, note: `${qty}m → ${qty} lm` };
    }
    // cm → lm
    if (u === 'cm') {
        const newQty = Math.round(qty / 100 * 100) / 100;
        const newRate = Math.round(rate * 100 * 100) / 100;
        return { quantity: newQty, unit: 'lm', unitRate: newRate, note: `${qty} cm → ${newQty} lm` };
    }
    // ft (feet, linear) → lm (1 ft = 0.3048m)
    if (u === 'ft' || u === 'feet' || u === 'foot' || u === 'lft' || u === 'lin ft') {
        const newQty = Math.round(qty * 0.3048 * 100) / 100;
        const newRate = Math.round(rate / 0.3048 * 100) / 100;
        return { quantity: newQty, unit: 'lm', unitRate: newRate, note: `${qty} ft → ${newQty} lm` };
    }

    // ── BULK → PIECE CONVERSIONS ──
    // carton / ctn / box  (try to extract pieces-per-container from description)
    if (u === 'carton' || u === 'ctn' || u === 'box' || u === 'cartons' || u === 'boxes') {
        // Look for "Xpcs/carton" or "(X pcs)" or "X pieces" in description
        const pcsMatch = d.match(/(\d+)\s*(?:pcs?|pieces?)\s*(?:per|\/|each)\s*(?:carton|ctn|box)/i)
            || d.match(/\((\d+)\s*(?:pcs?|pieces?)\)/i)
            || d.match(/(\d+)\s*(?:pcs?|pieces?)\s*(?:in|per)\s*(?:carton|ctn|box)/i);
        if (pcsMatch) {
            const pcsPerUnit = parseInt(pcsMatch[1]);
            const newQty = qty * pcsPerUnit;
            const newRate = Math.round(rate / pcsPerUnit * 100) / 100;
            return { quantity: newQty, unit: 'pcs', unitRate: newRate, note: `${qty} cartons × ${pcsPerUnit} pcs = ${newQty} pcs` };
        }
        // Can't determine pcs per carton — keep as lot
        return { quantity: qty, unit: 'lot', unitRate: rate, note: `${qty} carton(s) → ${qty} lot` };
    }

    // ── WEIGHT CONVERSIONS ──
    // ton → kg
    if (u === 'ton' || u === 'tonne' || u === 'mt') {
        const newQty = qty * 1000;
        const newRate = Math.round(rate / 1000 * 100) / 100;
        return { quantity: newQty, unit: 'kg', unitRate: newRate, note: `${qty} ton → ${newQty} kg` };
    }

    // ── COUNT NORMALIZATION ──
    if (u === 'pc' || u === 'piece' || u === 'pieces' || u === 'ea' || u === 'each') {
        return { quantity: qty, unit: 'pcs', unitRate: rate, note: '' };
    }
    if (u === 'no' || u === 'no.' || u === 'number') {
        return { quantity: qty, unit: 'nos', unitRate: rate, note: '' };
    }
    if (u === 'sets') {
        return { quantity: qty, unit: 'set', unitRate: rate, note: '' };
    }
    if (u === 'pairs') {
        return { quantity: qty, unit: 'pair', unitRate: rate, note: '' };
    }
    if (u === 'units') {
        return { quantity: qty, unit: 'unit', unitRate: rate, note: '' };
    }

    // ── LUMP SUM NORMALIZATION ──
    if (u === 'lump sum' || u === 'lumpsum' || u === 'l/s' || u === 'l.s') {
        return { quantity: 1, unit: 'ls', unitRate: rate * qty, note: qty !== 1 ? `Consolidated to 1 ls` : '' };
    }

    // ── CONSUMABLE NORMALIZATION ──
    if (u === 'rolls') return { quantity: qty, unit: 'roll', unitRate: rate, note: '' };
    if (u === 'sheets') return { quantity: qty, unit: 'sheet', unitRate: rate, note: '' };
    if (u === 'bags') return { quantity: qty, unit: 'bag', unitRate: rate, note: '' };
    if (u === 'litres' || u === 'liter' || u === 'liters' || u === 'l') {
        return { quantity: qty, unit: 'litre', unitRate: rate, note: '' };
    }

    // ── LABOUR NORMALIZATION ──
    if (u === 'days' || u === 'manday' || u === 'man-day' || u === 'man day') {
        return { quantity: qty, unit: 'day', unitRate: rate, note: '' };
    }
    if (u === 'hours' || u === 'hrs') {
        return { quantity: qty, unit: 'hr', unitRate: rate, note: '' };
    }
    if (u === 'trips') {
        return { quantity: qty, unit: 'trip', unitRate: rate, note: '' };
    }

    // Already standard — pass through
    const standardUnits = ['sqft', 'sqm', 'lm', 'mm', 'cu.m', 'pcs', 'set', 'lot', 'nos', 'unit', 'pair', 'panel', 'leaf', 'kg', 'roll', 'sheet', 'bag', 'litre', 'day', 'hr', 'trip', 'ls'];
    if (standardUnits.includes(u)) {
        return { quantity: qty, unit: u, unitRate: rate, note: '' };
    }

    // Unknown unit — default to lot
    return { quantity: qty, unit: 'lot', unitRate: rate, note: `Unknown unit "${unit}" → lot` };
}

// ============================================================
// TEXT EXTRACTION
// ============================================================
function extractTextFromPDF(buffer: Buffer): string {
    const text = buffer.toString('latin1');
    const readable: string[] = [];

    const parenRegex = /\(([^)]+)\)/g;
    let match;
    while ((match = parenRegex.exec(text)) !== null) {
        const s = match[1].replace(/\\n/g, '\n').replace(/\\r/g, '');
        if (s.length > 1 && /[a-zA-Z0-9$]/.test(s)) {
            readable.push(s);
        }
    }

    const btRegex = /BT\s*([\s\S]*?)\s*ET/g;
    while ((match = btRegex.exec(text)) !== null) {
        const tjRegex = /\[([^\]]+)\]\s*TJ|<([^>]+)>\s*Tj|\(([^)]+)\)\s*Tj/g;
        let tjMatch;
        while ((tjMatch = tjRegex.exec(match[1])) !== null) {
            const content = tjMatch[1] || tjMatch[2] || tjMatch[3];
            if (content && content.length > 1) {
                readable.push(content.replace(/\\n/g, '\n'));
            }
        }
    }

    return readable.join(' ');
}

// ============================================================
// CATEGORIZER
// ============================================================
function categorize(desc: string): { category: string; taskType: string; location: string } {
    const d = desc.toLowerCase();

    let category = 'general';
    if (/hack|demolish|dismantle|remove|strip|rip.?out|tear.?out/.test(d)) category = 'hacking';
    else if (/tile|tiling|grout|porcelain|marble|granite|mosaic|ceramic|homogen/.test(d)) category = 'tiling';
    else if (/plumb|pipe|basin|tap|toilet|bidet|water|heater|shower.?set|rain.?shower|mixer/.test(d)) category = 'plumbing';
    else if (/electr|wire|switch|socket|light|power|point|db.?box|mcb|rccb|led|downlight|cove/.test(d)) category = 'electrical';
    else if (/paint|nippon|dulux|coat|emulsion|sealer|primer|skim/.test(d)) category = 'painting';
    else if (/carpentr|cabinet|wardrobe|shelf|drawer|panel|laminate|plywood|solid.?surface|quartz|countertop|vanity/.test(d)) category = 'carpentry';
    else if (/aircon|air.?con|trunking|fan.?coil|condenser|btu|compressor/.test(d)) category = 'aircon';
    else if (/glass|mirror|shower.?screen|tempered|aluminium|window|grille/.test(d)) category = 'glass_and_aluminium';
    else if (/ceiling|cornice|partition|drywall|gypsum|plasterboard/.test(d)) category = 'ceiling_partition';
    else if (/clean|polish|protect|disposal|debris|rubbish/.test(d)) category = 'cleaning';
    else if (/design|drawing|submission|permit|authority|bca/.test(d)) category = 'design_submissions';
    else if (/waterproof|membrane|sealant|torch.?on/.test(d)) category = 'waterproofing';
    else if (/door|gate|lock|handle|hinge/.test(d)) category = 'doors';
    else if (/screed|level|floor|overlay/.test(d)) category = 'flooring';

    let taskType = '';
    if (/supply\s*(?:&|and|\+)\s*install|s\s*[&+]\s*i|s\/i/.test(d)) taskType = 'supply + install';
    else if (/install|fix|mount|erect/.test(d)) taskType = 'install';
    else if (/supply|provide|furnish/.test(d)) taskType = 'supply only';
    else if (/hack|demolish|dismantle|remove|strip/.test(d)) taskType = 'dismantle';
    else if (/screed|level/.test(d)) taskType = 'screed';
    else if (/lay|tile|tiling/.test(d)) taskType = 'install';

    let location = 'nil';
    if (/kitchen/.test(d)) location = 'kitchen';
    else if (/master\s*(bed|bath|toilet|room|br|wc)/.test(d)) location = d.match(/bath|toilet|wc/) ? 'master bathroom' : 'master bedroom';
    else if (/common\s*(bath|toilet|wc)/.test(d)) location = 'common bathroom';
    else if (/guest\s*(bath|toilet|wc)/.test(d)) location = 'common bathroom';
    else if (/living/.test(d)) location = 'living room';
    else if (/dining/.test(d)) location = 'dining room';
    else if (/bed\s*(?:room)?\s*2|br\s*2|room\s*2/.test(d)) location = 'bedroom 2';
    else if (/bed\s*(?:room)?\s*3|br\s*3|room\s*3/.test(d)) location = 'bedroom 3';
    else if (/balcony/.test(d)) location = 'balcony';
    else if (/foyer|entrance|entry/.test(d)) location = 'foyer';
    else if (/whole\s*unit|entire|throughout/.test(d)) location = 'entire unit';
    else if (/study/.test(d)) location = 'study room';
    else if (/yard|service/.test(d)) location = 'service yard';
    else if (/utility/.test(d)) location = 'utility room';
    else if (/corridor|hallway/.test(d)) location = 'corridor';

    return { category, taskType, location };
}

// ============================================================
// EXTRACT SPECS FROM DESCRIPTION
// ============================================================
function extractSpecs(desc: string): { cleanDesc: string; specifications: string } {
    const specs: string[] = [];

    // Extract dimensions like "600x600", "900mm x 450mm"
    const dimMatch = desc.match(/(\d+)\s*(?:mm)?\s*[x×]\s*(\d+)\s*(?:mm)?/i);
    if (dimMatch) specs.push(`${dimMatch[1]}×${dimMatch[2]}mm`);

    // Extract thickness like "18mm", "9mm"
    const thickMatch = desc.match(/(\d+(?:\.\d+)?)\s*mm\b/i);
    if (thickMatch && !dimMatch) specs.push(`${thickMatch[1]}mm`);

    // Extract material specifics in parentheses
    const parenMatch = desc.match(/\(([^)]+)\)/);
    if (parenMatch) specs.push(parenMatch[1]);

    // Extract brand names
    const brands = ['nippon', 'dulux', 'hafary', 'niro', 'blum', 'bosch', 'kohler', 'grohe', 'toto', 'laufen',
        'american standard', 'roca', 'hansgrohe', 'daikin', 'mitsubishi', 'panasonic', 'caesarstone'];
    const d = desc.toLowerCase();
    for (const brand of brands) {
        if (d.includes(brand)) specs.push(brand.charAt(0).toUpperCase() + brand.slice(1));
    }

    return {
        cleanDesc: desc.replace(/\([^)]+\)/g, '').replace(/\s+/g, ' ').trim(),
        specifications: specs.join(', '),
    };
}

// ============================================================
// QUOTE TEXT PARSER
// ============================================================
function parseQuoteText(rawText: string): ParseResult {
    const lines = rawText.split(/\n|\r/).filter(l => l.trim());
    const items: ParsedLineItem[] = [];

    let vendorName = 'Unknown Vendor';
    let quoteRef = '';
    let date = '';

    // Extended unit pattern — catches ALL unit variants before normalization
    const unitPattern = 'sqft|sqm|sq\\.?\\s?(?:ft|m)|sft|m2|m²|lot|nos|no\\.?|pcs?|pieces?|ea|each|set|sets|unit|units|lm|m|mtr|meter|meters|cm|ft|feet|foot|lft|pair|pairs|panel|leaf|day|days|manday|man-day|hr|hrs|hours|trip|trips|ls|l\\/s|lump\\s*sum|roll|rolls|sheet|sheets|bag|bags|litre|litres?|liter|liters?|kg|ton|tonne|carton|ctn|box|boxes';

    // Primary pattern: S/N Description Qty Unit Rate Amount
    const lineItemPattern = new RegExp(
        `^[\\d.)*\\-]*\\s*(.+?)\\s+(\\d+(?:\\.\\d+)?)\\s*(${unitPattern})\\s+\\$?\\s?(\\d+(?:,\\d{3})*(?:\\.\\d{2})?)\\s+\\$?\\s?(\\d+(?:,\\d{3})*(?:\\.\\d{2})?)`,
        'i'
    );

    // Secondary: Description Qty Unit Amount (no separate rate)
    const simplePattern = new RegExp(
        `^[\\d.)*\\-]*\\s*(.+?)\\s+(\\d+(?:\\.\\d+)?)\\s*(${unitPattern})\\s+\\$?\\s?(\\d+(?:,\\d{3})*(?:\\.\\d{2})?)\\s*$`,
        'i'
    );

    for (const line of lines) {
        let desc = '', qty = 0, unit = '', rate = 0, total = 0;

        const match = line.match(lineItemPattern);
        if (match) {
            desc = match[1].trim();
            qty = parseFloat(match[2]);
            unit = match[3];
            rate = parseFloat(match[4].replace(/,/g, ''));
            total = parseFloat(match[5].replace(/,/g, ''));
        } else {
            const simple = line.match(simplePattern);
            if (simple) {
                desc = simple[1].trim();
                qty = parseFloat(simple[2]);
                unit = simple[3];
                total = parseFloat(simple[4].replace(/,/g, ''));
                rate = qty > 0 ? Math.round(total / qty * 100) / 100 : total;
            }
        }

        if (desc && qty > 0 && total > 0) {
            // Normalize the unit
            const converted = normalizeUnit(qty, unit, rate, desc);
            const { category, taskType, location } = categorize(desc);
            const { cleanDesc, specifications } = extractSpecs(desc);

            items.push({
                description: cleanDesc || desc,
                quantity: converted.quantity,
                unit: converted.unit,
                unitRate: converted.unitRate,
                totalPrice: total, // total price stays the same — we just reframe qty × rate
                category,
                location,
                taskType,
                specifications,
                originalUnit: unit !== converted.unit ? unit : undefined,
                originalQty: qty !== converted.quantity ? qty : undefined,
                wasConverted: !!converted.note,
                conversionNote: converted.note || undefined,
            });
        }
    }

    // Fallback: look for any line with a dollar amount
    if (items.length === 0) {
        for (const line of lines) {
            const dollarMatches = line.match(/\$\s?(\d+(?:,\d{3})*(?:\.\d{2})?)/g);
            if (dollarMatches && dollarMatches.length >= 1) {
                const priceStr = dollarMatches[dollarMatches.length - 1].replace(/[\$,\s]/g, '');
                const price = parseFloat(priceStr);
                if (price > 0 && price < 100000) {
                    const desc = line.replace(/\$\s?\d+(?:,\d{3})*(?:\.\d{2})?/g, '').replace(/^\d+[.)]\s*/, '').trim();
                    if (desc.length > 3) {
                        const { category, taskType, location } = categorize(desc);
                        const { cleanDesc, specifications } = extractSpecs(desc);
                        items.push({
                            description: cleanDesc || desc,
                            quantity: 1,
                            unit: 'lot',
                            unitRate: price,
                            totalPrice: price,
                            category, location, taskType, specifications,
                        });
                    }
                }
            }
        }
    }

    const subtotal = items.reduce((sum, i) => sum + i.totalPrice, 0);
    const gst = subtotal * 0.09;

    return {
        vendorName, quoteRef, date, items, subtotal, gst,
        total: subtotal + gst,
        rawText: rawText.substring(0, 5000),
        confidence: items.length > 0 ? Math.min(0.95, 0.5 + items.length * 0.05) : 0,
    };
}

// ============================================================
// API HANDLER
// ============================================================
export async function POST(request: NextRequest) {
    try {
        const contentType = request.headers.get('content-type') || '';
        let parseResult: ParseResult;

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file') as File | null;

            if (!file) {
                return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
            }

            if (!file.name.toLowerCase().endsWith('.pdf')) {
                return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const rawText = extractTextFromPDF(buffer);
            parseResult = parseQuoteText(rawText);
            parseResult.vendorName = file.name.replace('.pdf', '').replace(/[_-]/g, ' ');

        } else {
            const body = await request.json();
            if (!body.text) {
                return NextResponse.json({ error: 'No text provided' }, { status: 400 });
            }
            parseResult = parseQuoteText(body.text);
        }

        // Convert to QuoteBuilder-compatible trade sections
        const tradeSections: Record<string, {
            category: string;
            displayName: string;
            items: Array<{
                description: string;
                quantity: number;
                unit: string;
                unitRate: number;
                sellingPrice: number;
                location: string;
                taskType: string;
                specifications: string;
                conversionNote?: string;
            }>;
        }> = {};

        const categoryNames: Record<string, string> = {
            hacking: 'Hacking & Demolition',
            tiling: 'Tiling',
            plumbing: 'Plumbing',
            electrical: 'Electrical',
            painting: 'Painting',
            carpentry: 'Carpentry',
            aircon: 'Aircon',
            glass_and_aluminium: 'Glass & Aluminium',
            ceiling_partition: 'Ceiling & Partition',
            cleaning: 'Cleaning & Protection',
            design_submissions: 'Design & Submissions',
            general: 'General Works',
            waterproofing: 'Waterproofing',
            doors: 'Doors & Hardware',
            flooring: 'Flooring & Screed',
        };

        for (const item of parseResult.items) {
            if (!tradeSections[item.category]) {
                tradeSections[item.category] = {
                    category: item.category,
                    displayName: categoryNames[item.category] || item.category,
                    items: [],
                };
            }
            tradeSections[item.category].items.push({
                description: item.description,
                quantity: item.quantity,
                unit: item.unit,
                unitRate: item.unitRate,
                sellingPrice: item.totalPrice,
                location: item.location,
                taskType: item.taskType,
                specifications: item.specifications,
                conversionNote: item.conversionNote,
            });
        }

        // Count conversions for confidence display
        const conversions = parseResult.items.filter(i => i.wasConverted).length;

        return NextResponse.json({
            success: true,
            parsed: parseResult,
            tradeSections: Object.values(tradeSections),
            totalItems: parseResult.items.length,
            conversions,
            confidence: parseResult.confidence,
        });

    } catch (error) {
        console.error('PDF parse error:', error);
        return NextResponse.json({ error: 'Failed to parse document' }, { status: 500 });
    }
}
