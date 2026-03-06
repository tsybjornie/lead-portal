'use client';

import { useState, useRef, useEffect } from 'react';
import ClientQuoteInteractive from '../../app/quote/[code]/ClientQuoteInteractive';

// ============================================================
// DATA
// ============================================================

const SPECIALIST_BADGES: Record<string, { emoji: string; label: string; color: string; bg: string; desc: string }> = {
    'wood': { emoji: '🪵', label: 'Wood Specialist', color: '#8B4513', bg: '#FAF0E6', desc: 'Expert in timber selection & custom woodwork' },
    'lighting': { emoji: '💡', label: 'Lighting Design', color: '#D4A017', bg: '#FFF8DC', desc: 'Certified lighting layout & fixture curation' },
    'hdb': { emoji: '🏠', label: 'HDB Expert', color: '#2E8B57', bg: '#E8F5E9', desc: 'Deep knowledge of HDB reno guidelines' },
    'japandi': { emoji: '🎋', label: 'Japandi', color: '#6B8E23', bg: '#F1F8E9', desc: 'Japanese-Scandinavian fusion specialist' },
    'sourcing': { emoji: '🛒', label: 'Direct Sourcing', color: '#4682B4', bg: '#E3F2FD', desc: 'Direct factory sourcing MY/CN/EU' },
    'antiques': { emoji: '🏺', label: 'Antiques & Art', color: '#8B0000', bg: '#FBE9E7', desc: 'Curates antique furniture & art pieces' },
    'paintings': { emoji: '🖼️', label: 'Art Curation', color: '#663399', bg: '#F3E5F5', desc: 'Paintings, prints & gallery wall design' },
    'motifs': { emoji: '🔲', label: 'Motifs & Patterns', color: '#1A237E', bg: '#E8EAF6', desc: 'Custom motif work, accent walls, tiles' },
    'wetarea': { emoji: '🚿', label: 'Wet Area', color: '#0277BD', bg: '#E1F5FE', desc: 'Bathroom & kitchen waterproofing specialist' },
    'softfurnish': { emoji: '🛋️', label: 'Soft Furnishing', color: '#C2185B', bg: '#FCE4EC', desc: 'Curtains, upholstery, cushions & rugs' },
    'smart': { emoji: '📱', label: 'Smart Home', color: '#004D40', bg: '#E0F2F1', desc: 'IoT integration, automation systems' },
    'sustainable': { emoji: '♻️', label: 'Sustainable', color: '#33691E', bg: '#F1F8E9', desc: 'Eco-friendly materials & green practices' },
    'landed': { emoji: '🏡', label: 'Landed Homes', color: '#4A148C', bg: '#F3E5F5', desc: 'Terrace, semi-D, bungalow specialist' },
    'budget': { emoji: '💰', label: 'Budget Reno', color: '#E65100', bg: '#FFF3E0', desc: 'Cost-effective renovations without compromise' },
    'heritage': { emoji: '🏛️', label: 'Heritage/Colonial', color: '#3E2723', bg: '#EFEBE9', desc: 'Conservation shophouse & colonial style' },
    'luxury': { emoji: '✨', label: 'Luxury Finishes', color: '#BF360C', bg: '#FBE9E7', desc: 'Marble, premium stones, bespoke details' },
    'ergonomics': { emoji: '🧑‍💻', label: 'Human Ergonomics', color: '#00695C', bg: '#E0F2F1', desc: 'Workspace & living ergonomic optimization' },
    'colour': { emoji: '🎨', label: 'Colour Specialist', color: '#AD1457', bg: '#FCE4EC', desc: 'Colour theory, palettes & psychology' },
    'artmovements': { emoji: '🖼️', label: 'Art Movements', color: '#4527A0', bg: '#EDE7F6', desc: 'Art Deco, Bauhaus, Memphis, Mid-Century Modern' },
    'biophilic': { emoji: '🌿', label: 'Biophilic Design', color: '#2E7D32', bg: '#E8F5E9', desc: 'Nature-integrated living spaces' },
    'spaceplanning': { emoji: '📏', label: 'Space Planning', color: '#283593', bg: '#E8EAF6', desc: 'Traffic flow, zoning & spatial hierarchy' },
};

// Professional tiers — global standard, not SG CaseTrust/BCA compliance
const DESIGNER_TIERS: Record<string, { label: string; color: string; bg: string; scope: string; level: number }> = {
    'coordinator': { label: 'Design Coordinator', color: '#6B6B65', bg: '#F1F1EF', scope: 'Project management & contractor liaison', level: 1 },
    'junior': { label: 'Junior Designer', color: '#0277BD', bg: '#E1F5FE', scope: 'Drafting, 3D renders, material boards under supervision', level: 2 },
    'designer': { label: 'Designer', color: '#2E7D32', bg: '#E8F5E9', scope: 'Full design development, client management, site coordination', level: 3 },
    'senior': { label: 'Senior Designer', color: '#E65100', bg: '#FFF3E0', scope: 'Design leadership, art direction, mentoring, complex projects', level: 4 },
    'principal': { label: 'Principal / Design Director', color: '#4A148C', bg: '#F3E5F5', scope: 'Firm-level creative vision, client acquisition, brand identity', level: 5 },
};

const QUOTE_ITEMS = [
    { id: 'q1', room: 'Living Room', item: 'Custom TV Console', material: 'Walnut veneer, push-to-open', dimensions: '3200L x 450D x 600H', price: 4200, asset: '#D4C5B0' },
    { id: 'q2', room: 'Living Room', item: 'Feature Wall Panelling', material: 'Fluted panel, white oak finish', dimensions: '4000L x 2700H', price: 3800, asset: '#C9BAA5' },
    { id: 'q3', room: 'Kitchen', item: 'Kitchen Island', material: 'Quartz top, waterfall edge both sides', dimensions: '2400L x 900W x 900H', price: 8500, asset: '#B8A99A' },
    { id: 'q4', room: 'Kitchen', item: 'Upper & Lower Cabinets', material: 'Solid surface top, soft-close', dimensions: '3600L set', price: 12000, asset: '#E8D5B7' },
    { id: 'q5', room: 'Master Bedroom', item: 'Wardrobe System', material: 'Laminate carcass, sliding doors', dimensions: '2800L x 600D x 2400H', price: 6500, asset: '#C4B5A0' },
    { id: 'q6', room: 'Master Bathroom', item: 'Vanity with Mirror Cabinet', material: 'Sintered stone top, wall-hung', dimensions: '900L x 500D x 850H', price: 3200, asset: '#A8C4D4' },
    { id: 'q7', room: 'Bedroom 2', item: 'Study Desk & Shelving', material: 'Plywood with HPL finish', dimensions: '1800L x 600D x 750H', price: 2800, asset: '#B0C4B0' },
    { id: 'q8', room: 'Common Bathroom', item: 'Bathroom Renovation', material: 'Floor & wall tiles, fittings', dimensions: 'Full reno', price: 5500, asset: '#C8C8C8' },
    { id: 'q9', room: 'Whole Unit', item: 'Electrical Works', material: 'Rewiring, switches & sockets', dimensions: '4-room BTO', price: 4500, asset: '#D8D0C0' },
    { id: 'q10', room: 'Whole Unit', item: 'Painting', material: 'Nippon Odourless, 2 coats', dimensions: 'All rooms', price: 3500, asset: '#E8E0D8' },
];

const LAYOUT_COMMENTS_INIT = [
    { id: 'lc1', x: 35, y: 40, text: 'Can we move the kitchen island slightly left?', author: 'David Lim', time: '16 Mar' },
    { id: 'lc2', x: 70, y: 25, text: 'Love the master bedroom layout', author: 'David Lim', time: '16 Mar' },
];

const CHAT_INIT = [
    { sender: 'Bjorn Teo', role: 'Designer', text: 'Hi David, your design proposal is ready. Take a look and let me know what you think.', time: '15 Mar, 3pm' },
    { sender: 'David Lim', role: 'You', text: 'Looks great overall! Just a few things I want to change.', time: '16 Mar, 10am' },
    { sender: 'Bjorn Teo', role: 'Designer', text: 'Sure, use the flag button on any item you want to change. I can see your comments in real time.', time: '16 Mar, 10:05am' },
];

const MATCHED_DESIGNERS = [
    {
        id: 'id1', name: 'Bjorn Teo', initials: 'BT', firm: 'Vinterior Pte Ltd', uen: '202XXXXXXX',
        match: 94, yearsExp: 8,
        // Designer-level (personal)
        rank: 'Director / Lead Designer',
        tier: 'senior',
        education: 'NUS Interior Architecture (B.A.)',
        educationType: 'degree' as const,
        personalCreds: ['SIDAC Accredited (Level 1)', 'SIDS Member', 'NCIDQ Certified', 'Green Mark AP'],
        designLiteracy: ['Understands Bauhaus, Mid-Century Modern, Art Deco', 'Colour theory trained', 'Ergonomic workspace certification'],
        awards: ['🏆 HDB Design Award 2024 — Best 4-Room', '🏅 SIDS Best Residential Interior 2023'],
        verified: { singpass: true, faceVerified: true, stripeKYC: true },
        style: 'Modern Minimalist, Japandi',
        // Firm-level
        firmCreds: ['BCA L5', 'CaseTrust', 'HDB Registered', 'BizSafe Level 3', 'ISO 9001'],
        firmProfessionals: { hasArchitect: true, architectName: 'Tan Wei Ming (BOA)', hasQP: true, hasPE: false, hasFSM: true },
        // Specialist badges (earned)
        badges: ['wood', 'lighting', 'japandi', 'sourcing', 'antiques', 'paintings', 'artmovements', 'colour', 'ergonomics'],
        designDepth: 85,
        // Workshop & team
        workshop: { hasWorkshop: true, location: 'Woodlands Industrial', equipment: ['CNC Router', 'Spray Booth', 'Edge Bander'], sourcing: 'Direct MY + SG suppliers' },
        team: { direct: 8, subcon: 2, avgTenure: '3.2 years', lewGrade: '7', licensedPlumber: true },
        ratings: { design: 4.8, workmanship: 4.7, communication: 4.9, overall: 4.8 },
        stats: { projectsDone: 47, btoSpecialist: true, avgBudget: '$45k-65k', avgDuration: '8 weeks' },
        firm_score: { totalProjects: 120, onTimeRate: 92, defectRate: 0.3, bcaCompliant: true, yearsOp: 6, staffRetention: 85, disputeRate: 1.2 },
        portfolio: [
            { label: 'Tampines GreenCourt', type: '4-rm BTO', color: '#D4C5B0', budget: '$52k' },
            { label: 'Clementi Peaks', type: 'Condo', color: '#C9BAA5', budget: '$78k' },
            { label: 'Punggol Waterway', type: '5-rm BTO', color: '#B8A99A', budget: '$61k' },
            { label: 'Pasir Ris Elixir', type: '4-rm BTO', color: '#D0C4B8', budget: '$48k' },
            { label: 'Woodlands Glade', type: '3-rm BTO', color: '#C4B8A8', budget: '$38k' },
            { label: 'Bishan Loft', type: 'Condo', color: '#BDB0A0', budget: '$92k' },
            { label: 'Ang Mo Kio Rise', type: 'HDB Resale', color: '#D8CCBC', budget: '$42k' },
            { label: 'Toa Payoh Central', type: '4-rm BTO', color: '#C8BCA8', budget: '$55k' },
        ],
        selected: true,
    },
    {
        id: 'id2', name: 'Jenny Lim', initials: 'JL', firm: 'Atelier Haus Pte Ltd', uen: '201XXXXXXX',
        match: 87, yearsExp: 5,
        rank: 'Senior Interior Designer',
        tier: 'designer',
        education: 'LaSalle Interior Design Diploma',
        educationType: 'diploma' as const,
        personalCreds: ['SIDAC Accredited'],
        designLiteracy: ['Scandinavian design principles', 'Basic colour coordination'],
        awards: ['🏆 HDB Design Award 2025 — Best 5-Room'],
        verified: { singpass: true, faceVerified: true, stripeKYC: true },
        style: 'Scandinavian, Modern',
        firmCreds: ['BCA L5', 'CaseTrust', 'HDB Registered', 'BizSafe Level 2', 'WSH Officer'],
        firmProfessionals: { hasArchitect: false, architectName: null, hasQP: false, hasPE: false, hasFSM: false },
        badges: ['lighting', 'hdb', 'wetarea', 'motifs', 'softfurnish', 'spaceplanning'],
        designDepth: 72,
        workshop: { hasWorkshop: false, location: null, equipment: [], sourcing: 'SG trade showrooms' },
        team: { direct: 4, subcon: 5, avgTenure: '1.8 years', lewGrade: '7', licensedPlumber: true },
        ratings: { design: 4.6, workmanship: 4.5, communication: 4.7, overall: 4.6 },
        stats: { projectsDone: 28, btoSpecialist: true, avgBudget: '$35k-55k', avgDuration: '7 weeks' },
        firm_score: { totalProjects: 85, onTimeRate: 88, defectRate: 0.5, bcaCompliant: true, yearsOp: 4, staffRetention: 78, disputeRate: 2.1 },
        portfolio: [
            { label: 'Woodlands Glen', type: 'HDB Resale', color: '#A8C4D4', budget: '$35k' },
            { label: 'Bishan Residences', type: 'Condo', color: '#B0C4B0', budget: '$58k' },
            { label: 'Sengkang Grand', type: '5-rm BTO', color: '#C8C8C8', budget: '$45k' },
            { label: 'Hougang Olive', type: '4-rm BTO', color: '#A4B8C0', budget: '$42k' },
            { label: 'Yishun Sapphire', type: '4-rm BTO', color: '#B8C8B8', budget: '$39k' },
            { label: 'Sembawang Vista', type: '3-rm BTO', color: '#C0D0D0', budget: '$32k' },
        ],
        selected: false,
    },
    {
        id: 'id3', name: 'Mike Tan', initials: 'MT', firm: 'Craft Studio SG', uen: '203XXXXXXX',
        match: 72, yearsExp: 3,
        rank: 'Design Coordinator',
        tier: 'coordinator',
        education: 'Self-taught',
        educationType: 'self-taught' as const,
        personalCreds: [],
        designLiteracy: [],
        awards: [],
        verified: { singpass: false, faceVerified: false, stripeKYC: true },
        style: 'Budget Modern, Industrial',
        firmCreds: ['BCA L6', 'HDB Registered'],
        firmProfessionals: { hasArchitect: false, architectName: null, hasQP: false, hasPE: false, hasFSM: false },
        badges: ['hdb', 'budget'],
        designDepth: 45,
        workshop: { hasWorkshop: false, location: null, equipment: [], sourcing: 'Catalog-based' },
        team: { direct: 0, subcon: 8, avgTenure: 'N/A', lewGrade: null, licensedPlumber: false },
        ratings: { design: 4.3, workmanship: 4.4, communication: 4.2, overall: 4.3 },
        stats: { projectsDone: 15, btoSpecialist: false, avgBudget: '$25k-40k', avgDuration: '6 weeks' },
        firm_score: { totalProjects: 40, onTimeRate: 82, defectRate: 0.8, bcaCompliant: true, yearsOp: 2, staffRetention: 65, disputeRate: 3.5 },
        portfolio: [
            { label: 'Jurong WestEdge', type: '4-rm BTO', color: '#D8D0C0', budget: '$28k' },
            { label: 'Yishun Meadow', type: 'HDB Resale', color: '#E8D5B7', budget: '$32k' },
            { label: 'Bedok North', type: 'HDB Resale', color: '#E8E0D8', budget: '$25k' },
            { label: 'Bukit Batok West', type: '3-rm BTO', color: '#D0C8B8', budget: '$22k' },
            { label: 'Choa Chu Kang', type: '4-rm BTO', color: '#DCD4C4', budget: '$30k' },
        ],
        selected: false,
    },
];

// ============================================================
// COMPONENT
// ============================================================

type Tab = 'compare' | 'quote' | 'messages' | 'about';
type ItemFlag = 'love' | 'remove' | 'change' | null;

export default function ProspectReview() {
    const [tab, setTab] = useState<Tab>('compare');
    const [selectedDesigner, setSelectedDesigner] = useState('id1');
    const [portfolioModal, setPortfolioModal] = useState<string | null>(null);
    const [flags, setFlags] = useState<Record<string, ItemFlag>>({});
    const [comments, setComments] = useState<Record<string, string>>({});
    const [layoutComments, setLayoutComments] = useState(LAYOUT_COMMENTS_INIT);
    const [chatMsgs, setChatMsgs] = useState(CHAT_INIT);
    const [chatDraft, setChatDraft] = useState('');
    const [selectedItem, setSelectedItem] = useState<string | null>('q1');
    const [showSignModal, setShowSignModal] = useState(false);
    const [signStep, setSignStep] = useState<'sign' | 'escrow' | 'processing' | 'success'>('sign');
    const [agreed, setAgreed] = useState(false);
    const [addingPin, setAddingPin] = useState(false);
    const [pinDraft, setPinDraft] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMsgs.length]);

    const setFlag = (id: string, flag: ItemFlag) => {
        setFlags(prev => ({ ...prev, [id]: prev[id] === flag ? null : flag }));
    };

    const activeItems = QUOTE_ITEMS.filter(q => flags[q.id] !== 'remove');
    const total = activeItems.reduce((s, q) => s + q.price, 0);
    const removedCount = QUOTE_ITEMS.filter(q => flags[q.id] === 'remove').length;
    const changeCount = QUOTE_ITEMS.filter(q => flags[q.id] === 'change').length;
    const selectedQuote = QUOTE_ITEMS.find(q => q.id === selectedItem);
    const deposit = Math.round(total * 0.2);
    const gst = Math.round(deposit * 0.09);

    // Contact info masking — prevent off-platform communication
    const maskContactInfo = (text: string): { masked: string; detected: boolean } => {
        let detected = false;
        let masked = text;
        // Phone numbers (SG: 8/9xxx, MY: 01x, intl: +65/+60, generic 8+ digits)
        masked = masked.replace(/(\+?\d{2,3}[\s-]?\d{4}[\s-]?\d{3,4})/g, () => { detected = true; return '[hidden by Roof]'; });
        masked = masked.replace(/\b[89]\d{3}[\s-]?\d{4}\b/g, () => { detected = true; return '[hidden by Roof]'; });
        masked = masked.replace(/\b01\d[\s-]?\d{3,4}[\s-]?\d{3,4}\b/g, () => { detected = true; return '[hidden by Roof]'; });
        // Email addresses
        masked = masked.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, () => { detected = true; return '[hidden by Roof]'; });
        // WhatsApp / Telegram handles
        masked = masked.replace(/(whatsapp|wa\.me|t\.me|telegram)[\s:/@]*[\w.+-]+/gi, () => { detected = true; return '[hidden by Roof]'; });
        return { masked, detected };
    };

    const handleSend = () => {
        if (!chatDraft.trim()) return;
        const { masked, detected } = maskContactInfo(chatDraft.trim());
        setChatMsgs(prev => [
            ...prev,
            { sender: 'David Lim', role: 'You', text: masked, time: 'Just now' },
            ...(detected ? [{ sender: 'Roof', role: 'System', text: '⚠️ Contact info detected and masked. All communication must stay on Roof to protect both parties.', time: 'Just now' }] : []),
        ]);
        setChatDraft('');
    };

    const handleLayoutClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!addingPin) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
        if (pinDraft.trim()) {
            setLayoutComments(prev => [...prev, { id: `lc_${Date.now()}`, x, y, text: pinDraft.trim(), author: 'David Lim', time: 'Just now' }]);
            setPinDraft('');
            setAddingPin(false);
        }
    };

    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    const card = { background: '#FBFBFA', borderRadius: 8, border: '1px solid #E9E9E7' };

    const statusColors = {
        love: { bg: '#DDEDDA', fg: '#35A855', label: 'Love it' },
        remove: { bg: '#FDECEA', fg: '#EB5757', label: 'Remove' },
        change: { bg: '#FBF3DB', fg: '#9F6B00', label: 'Change' },
    };

    return (
        <div style={{ fontFamily: f, background: '#FFFFFF', minHeight: '100vh', color: '#37352F' }}>

            {/* Top bar */}
            <div style={{
                borderBottom: '1px solid #E9E9E7', padding: '10px 32px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                position: 'sticky', top: 0, background: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(8px)', zIndex: 20,
            }}>
                <div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>456 Tampines St 42</span>
                    <span style={{ fontSize: 12, color: '#9B9A97', marginLeft: 8 }}>Proposal Review</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {removedCount > 0 && <span style={{ fontSize: 11, color: '#EB5757' }}>{removedCount} removed</span>}
                    {changeCount > 0 && <span style={{ fontSize: 11, color: '#9F6B00' }}>{changeCount} to change</span>}
                    <button onClick={() => { setSignStep('sign'); setAgreed(false); setShowSignModal(true); }} style={{
                        background: '#37352F', color: 'white', border: 'none', borderRadius: 4,
                        padding: '6px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}>Accept & Sign</button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ borderBottom: '1px solid #E9E9E7', padding: '0 32px', display: 'flex', gap: 0 }}>
                {([
                    { key: 'compare' as Tab, label: 'Compare Designers' },
                    { key: 'quote' as Tab, label: 'Quote & Design' },
                    { key: 'messages' as Tab, label: 'Messages' },
                    { key: 'about' as Tab, label: 'About Your Team' },
                ]).map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{
                        padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 13, fontWeight: 500, color: tab === t.key ? '#37352F' : '#9B9A97',
                        borderBottom: tab === t.key ? '2px solid #37352F' : '2px solid transparent',
                        marginBottom: -1,
                    }}>{t.label}</button>
                ))}
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 32px 80px' }}>

                {/* ============================================================ */}
                {/* COMPARE DESIGNERS TAB */}
                {/* ============================================================ */}
                {tab === 'compare' && (
                    <div>
                        <div style={{ marginBottom: 20 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Your Matches</h2>
                            <p style={{ fontSize: 12, color: '#9B9A97', margin: '4px 0 0' }}>Matched by Roof based on your budget, style, and property type</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, alignItems: 'stretch' }}>
                            {MATCHED_DESIGNERS.map(d => (
                                <div key={d.id} onClick={() => setSelectedDesigner(d.id)} style={{
                                    ...card, padding: '20px', cursor: 'pointer',
                                    border: selectedDesigner === d.id ? '2px solid #37352F' : '1px solid #E9E9E7',
                                    position: 'relative', transition: 'border 0.15s',
                                    display: 'flex', flexDirection: 'column',
                                }}>
                                    {/* Match badge */}
                                    <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 10, background: d.match >= 90 ? '#DDEDDA' : d.match >= 80 ? '#FBF3DB' : '#F1F1EF', color: d.match >= 90 ? '#35A855' : d.match >= 80 ? '#9F6B00' : '#9B9A97' }}>
                                        {d.match}% match
                                    </div>

                                    {/* Profile */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#37352F', color: 'white', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{d.initials}</div>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 700 }}>{d.name}</div>
                                            <div style={{ fontSize: 11, color: '#9B9A97' }}>{d.rank}</div>
                                        </div>
                                    </div>

                                    {/* Firm + Rank */}
                                    <div style={{ fontSize: 12, fontWeight: 600 }}>{d.firm}</div>
                                    <div style={{ fontSize: 10, color: '#9B9A97' }}>UEN {d.uen} · {d.firm_score.yearsOp}y operating</div>
                                    <div style={{ fontSize: 10, color: '#37352F', fontWeight: 500, marginBottom: 10 }}>Rank: {d.rank}</div>

                                    {/* Divider */}
                                    <div style={{ borderTop: '1px solid #F1F1EF', marginBottom: 10 }} />

                                    {/* Rating + projects row */}
                                    <div style={{ display: 'flex', marginBottom: 10, padding: '10px 0', background: '#FAFAF8', borderRadius: 4 }}>
                                        <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #EDECE9' }}>
                                            <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{d.ratings.overall}</div>
                                            <div style={{ fontSize: 9, color: '#9B9A97', marginTop: 2 }}>Rating</div>
                                        </div>
                                        <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #EDECE9' }}>
                                            <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{d.stats.projectsDone}</div>
                                            <div style={{ fontSize: 9, color: '#9B9A97', marginTop: 2 }}>Projects</div>
                                        </div>
                                        <div style={{ flex: 1, textAlign: 'center' }}>
                                            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1, paddingTop: 4 }}>{d.stats.avgBudget}</div>
                                            <div style={{ fontSize: 9, color: '#9B9A97', marginTop: 2 }}>Avg Budget</div>
                                        </div>
                                    </div>

                                    {/* Style + specialist tags  fixed height */}
                                    <div style={{ marginBottom: 6, display: 'flex', flexWrap: 'wrap', gap: 4, minHeight: 22 }}>
                                        {d.style.split(', ').map(s => (
                                            <span key={s} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: '#F1F1EF', color: '#6B6B65' }}>{s}</span>
                                        ))}
                                        {d.stats.btoSpecialist && <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 6px', borderRadius: 3, background: '#DDEDDA', color: '#35A855' }}>BTO Specialist</span>}
                                    </div>

                                    {/* Specialist badges */}
                                    <div style={{ marginBottom: 10, display: 'flex', flexWrap: 'wrap', gap: 3, minHeight: 20 }}>
                                        {d.badges.map(b => {
                                            const badge = SPECIALIST_BADGES[b];
                                            if (!badge) return null;
                                            return (
                                                <span key={b} title={badge.desc} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 10, background: badge.bg, color: badge.color, fontWeight: 600, cursor: 'help' }}>{badge.emoji} {badge.label}</span>
                                            );
                                        })}
                                    </div>

                                    {/* Firm scorecard compact */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 2, marginBottom: 8, fontSize: 10, textAlign: 'center', padding: '8px 0', borderTop: '1px solid #F1F1EF', borderBottom: '1px solid #F1F1EF' }}>
                                        <div><div style={{ fontWeight: 600, fontSize: 12 }}>{d.firm_score.onTimeRate}%</div><div style={{ color: '#9B9A97', marginTop: 1 }}>On-time</div></div>
                                        <div><div style={{ fontWeight: 600, fontSize: 12 }}>{d.firm_score.defectRate}</div><div style={{ color: '#9B9A97', marginTop: 1 }}>Defects</div></div>
                                        <div><div style={{ fontWeight: 600, fontSize: 12 }}>{d.firm_score.staffRetention}%</div><div style={{ color: '#9B9A97', marginTop: 1 }}>Retention</div></div>
                                        <div><div style={{ fontWeight: 600, fontSize: 12, color: d.firm_score.disputeRate > 3 ? '#EB5757' : '#37352F' }}>{d.firm_score.disputeRate}%</div><div style={{ color: '#9B9A97', marginTop: 1 }}>Disputes</div></div>
                                    </div>
                                    {/* FIRM credentials */}
                                    <div style={{ marginBottom: 6 }}>
                                        <div style={{ fontSize: 9, fontWeight: 500, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Firm</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                            {d.firmCreds.map(c => (
                                                <span key={c} style={{ fontSize: 9, padding: '1px 5px', borderRadius: 2, background: '#DDEDDA', color: '#1A7A34', border: '1px solid #C3DFC0' }}> {c}</span>
                                            ))}
                                        </div>
                                        {/* Architects & QPs on staff */}
                                        {(d as any).firmProfessionals && ((d as any).firmProfessionals.hasArchitect || (d as any).firmProfessionals.hasQP || (d as any).firmProfessionals.hasFSM) && (
                                            <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                                {(d as any).firmProfessionals.hasArchitect && (
                                                    <span style={{ fontSize: 8, padding: '1px 6px', borderRadius: 2, background: '#E3F2FD', color: '#0D47A1', fontWeight: 600, border: '1px solid #BBDEFB' }}>🏛️ BOA Architect{(d as any).firmProfessionals.architectName ? `: ${(d as any).firmProfessionals.architectName}` : ''}</span>
                                                )}
                                                {(d as any).firmProfessionals.hasQP && (
                                                    <span style={{ fontSize: 8, padding: '1px 6px', borderRadius: 2, background: '#E3F2FD', color: '#0D47A1', fontWeight: 600, border: '1px solid #BBDEFB' }}>📐 QP (Qualified Person)</span>
                                                )}
                                                {(d as any).firmProfessionals.hasFSM && (
                                                    <span style={{ fontSize: 8, padding: '1px 6px', borderRadius: 2, background: '#FFF3E0', color: '#E65100', fontWeight: 600, border: '1px solid #FFE0B2' }}>🔥 Fire Safety Manager</span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Designer tier + credentials */}
                                    <div style={{ marginBottom: 10 }}>
                                        <div style={{ fontSize: 9, fontWeight: 500, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Designer</div>
                                        {(() => {
                                            const tierData = DESIGNER_TIERS[d.tier];
                                            return tierData ? (
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 3, marginBottom: 4, background: tierData.bg, color: tierData.color }}>
                                                    {'★'.repeat(tierData.level)} {tierData.label}
                                                </div>
                                            ) : (
                                                <div style={{ display: 'inline-block', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 3, marginBottom: 4, background: '#F1F1EF', color: '#6B6B65' }}>{d.tier}</div>
                                            );
                                        })()}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 3 }}>
                                            <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 2, background: '#F7F6F3', color: '#37352F', border: '1px solid #E9E9E7' }}>{d.educationType === 'degree' ? '🎓' : d.educationType === 'diploma' ? '📜' : '🔧'} {d.education}</span>
                                            {d.personalCreds.map(c => (
                                                <span key={c} style={{ fontSize: 9, padding: '1px 5px', borderRadius: 2, background: '#F7F6F3', color: '#37352F', border: '1px solid #E9E9E7' }}>✓ {c}</span>
                                            ))}
                                            <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 2, background: '#F7F6F3', color: '#37352F', border: '1px solid #E9E9E7' }}>{d.yearsExp}y exp</span>
                                        </div>
                                        {(d as any).designLiteracy?.length > 0 && (
                                            <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                                {(d as any).designLiteracy.map((lit: string) => (
                                                    <span key={lit} style={{ fontSize: 8, padding: '1px 5px', borderRadius: 2, background: '#EDE7F6', color: '#4527A0', border: '1px solid #D1C4E9' }}>✦ {lit}</span>
                                                ))}
                                            </div>
                                        )}
                                        {/* Awards */}
                                        {(d as any).awards?.length > 0 && (
                                            <div style={{ marginTop: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                {(d as any).awards.map((a: string) => (
                                                    <span key={a} style={{ fontSize: 8, padding: '1px 5px', borderRadius: 2, background: '#FFF8E1', color: '#F57F17', border: '1px solid #FFE082' }}>{a}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Identity Verification */}
                                    <div style={{ marginBottom: 6, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                        {(d as any).verified?.singpass && <span style={{ fontSize: 8, padding: '1px 5px', borderRadius: 2, background: '#E8F5E9', color: '#2E7D32', fontWeight: 600 }}>✅ Singpass</span>}
                                        {(d as any).verified?.faceVerified && <span style={{ fontSize: 8, padding: '1px 5px', borderRadius: 2, background: '#E8F5E9', color: '#2E7D32', fontWeight: 600 }}>🔐 Face Verified</span>}
                                        {(d as any).verified?.stripeKYC && <span style={{ fontSize: 8, padding: '1px 5px', borderRadius: 2, background: '#E8F5E9', color: '#2E7D32', fontWeight: 600 }}>💳 KYC</span>}
                                        {!(d as any).verified?.singpass && !(d as any).verified?.faceVerified && (
                                            <span style={{ fontSize: 8, padding: '1px 5px', borderRadius: 2, background: '#FFF3E0', color: '#E65100', fontWeight: 600 }}>⚠️ Not Verified</span>
                                        )}
                                    </div>

                                    {/* Spacer pushes buttons to bottom */}
                                    <div style={{ flex: 1 }} />

                                    {/* Action buttons */}
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={e => { e.stopPropagation(); setPortfolioModal(d.id); }} style={{
                                            flex: 1, padding: '8px', borderRadius: 4, fontSize: 12, cursor: 'pointer',
                                            background: 'transparent', color: '#37352F', border: '1px solid #E9E9E7', fontWeight: 500,
                                        }}>View {d.portfolio.length} Projects </button>
                                        <button onClick={e => { e.stopPropagation(); setSelectedDesigner(d.id); setTab('quote'); }} style={{
                                            flex: 1, padding: '8px', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                            background: selectedDesigner === d.id ? '#37352F' : 'transparent',
                                            color: selectedDesigner === d.id ? 'white' : '#37352F',
                                            border: selectedDesigner === d.id ? 'none' : '1px solid #E9E9E7',
                                        }}>{selectedDesigner === d.id ? 'Selected ' : 'View Proposal'}</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Portfolio Modal */}
                        {portfolioModal && (() => {
                            const designer = MATCHED_DESIGNERS.find(d => d.id === portfolioModal);
                            if (!designer) return null;
                            return (
                                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setPortfolioModal(null)}>
                                    <div style={{ background: 'white', borderRadius: 8, padding: '28px', maxWidth: 720, width: '90%', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                            <div>
                                                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{designer.name}&apos;s Portfolio</h3>
                                                <p style={{ fontSize: 12, color: '#9B9A97', margin: '2px 0 0' }}>{designer.firm} · {designer.portfolio.length} projects</p>
                                            </div>
                                            <button onClick={() => setPortfolioModal(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9B9A97' }}></button>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                                            {designer.portfolio.map((p, i) => (
                                                <div key={i} style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid #E9E9E7' }}>
                                                    <div style={{ aspectRatio: '16/10', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(55,53,47,0.2)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                                                    </div>
                                                    <div style={{ padding: '8px 10px' }}>
                                                        <div style={{ fontSize: 12, fontWeight: 600 }}>{p.label}</div>
                                                        <div style={{ fontSize: 11, color: '#9B9A97' }}>{p.type} · {p.budget}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Divider */}
                                        <div style={{ borderTop: '1px solid #F1F1EF', margin: '20px 0' }} />

                                        {/* Specialist Badges */}
                                        <div style={{ marginBottom: 16 }}>
                                            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Specialist Badges</div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                {designer.badges.map(b => {
                                                    const badge = SPECIALIST_BADGES[b];
                                                    if (!badge) return null;
                                                    return (
                                                        <div key={b} title={badge.desc} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, padding: '6px 12px', borderRadius: 12, background: badge.bg, color: badge.color, fontWeight: 600, cursor: 'help' }}>
                                                            <span style={{ fontSize: 14 }}>{badge.emoji}</span>
                                                            <div>
                                                                <div>{badge.label}</div>
                                                                <div style={{ fontSize: 9, fontWeight: 400, opacity: 0.8, marginTop: 1 }}>{badge.desc}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div style={{ fontSize: 10, color: '#9B9A97', marginTop: 4 }}>Design Depth Score: {designer.designDepth}/100</div>
                                        </div>

                                        {/* Workshop & Team */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                            {/* Workshop */}
                                            <div style={{ padding: 12, background: '#FAFAF8', borderRadius: 6, border: '1px solid #F1F1EF' }}>
                                                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6 }}> Workshop</div>
                                                {designer.workshop.hasWorkshop ? (
                                                    <>
                                                        <div style={{ fontSize: 10, color: '#35A855', fontWeight: 500, marginBottom: 4 }}> In-house workshop</div>
                                                        <div style={{ fontSize: 10, color: '#6B6B65' }}>{designer.workshop.location}</div>
                                                        <div style={{ fontSize: 10, color: '#6B6B65', marginTop: 2 }}>{designer.workshop.equipment?.join(', ')}</div>
                                                        <div style={{ fontSize: 10, color: '#6B6B65', marginTop: 2 }}>Sourcing: {designer.workshop.sourcing}</div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div style={{ fontSize: 10, color: '#9B9A97' }}> No in-house workshop</div>
                                                        <div style={{ fontSize: 10, color: '#9B9A97', marginTop: 2 }}>All carpentry outsourced</div>
                                                        <div style={{ fontSize: 10, color: '#6B6B65', marginTop: 2 }}>Sourcing: {designer.workshop.sourcing}</div>
                                                    </>
                                                )}
                                            </div>
                                            {/* Team */}
                                            <div style={{ padding: 12, background: '#FAFAF8', borderRadius: 6, border: '1px solid #F1F1EF' }}>
                                                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6 }}> Team Composition</div>
                                                <div style={{ fontSize: 10, color: '#6B6B65' }}>Direct workers: <b>{designer.team.direct}</b></div>
                                                <div style={{ fontSize: 10, color: '#6B6B65', marginTop: 2 }}>Regular subcon: <b>{designer.team.subcon}</b></div>
                                                <div style={{ fontSize: 10, color: '#6B6B65', marginTop: 2 }}>Avg tenure: <b>{designer.team.avgTenure}</b></div>
                                                {designer.team.lewGrade && <div style={{ fontSize: 10, color: '#35A855', marginTop: 2 }}> LEW Grade {designer.team.lewGrade}</div>}
                                                {designer.team.licensedPlumber && <div style={{ fontSize: 10, color: '#35A855', marginTop: 2 }}> Licensed Plumber (PUB)</div>}
                                                {!designer.team.lewGrade && <div style={{ fontSize: 10, color: '#9B9A97', marginTop: 2 }}> No LEW on team</div>}
                                                {!designer.team.licensedPlumber && <div style={{ fontSize: 10, color: '#9B9A97', marginTop: 2 }}> No Licensed Plumber</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}




                {/* ============================================================ */}
                {/* QUOTE & DESIGN TAB  Full Split Screen */}
                {/* ============================================================ */}
                {tab === 'quote' && (
                    <div style={{ margin: '0 -32px', minHeight: 700 }}>
                        <ClientQuoteInteractive shareCode="B4BDRL" />
                    </div>
                )}

                {/* ============================================================ */}
                {/* MESSAGES TAB */}
                {/* ============================================================ */}
                {tab === 'messages' && (
                    <div style={{ maxWidth: 640 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px' }}>Messages</h2>
                        <div style={{ ...card, display: 'flex', flexDirection: 'column', height: 500 }}>
                            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                                {chatMsgs.map((msg, i) => (
                                    <div key={i} style={{ marginBottom: 16 }}>
                                        {msg.role === 'System' ? (
                                            <div style={{ background: '#FFF3E0', border: '1px solid #FFE0B2', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#E65100', fontWeight: 500, textAlign: 'center' }}>
                                                {msg.text}
                                            </div>
                                        ) : (
                                            <>
                                                <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
                                                    <span style={{ fontSize: 13, fontWeight: 600 }}>{msg.sender}</span>
                                                    <span style={{ fontSize: 10, color: '#9B9A97', background: '#F1F1EF', padding: '1px 5px', borderRadius: 3 }}>{msg.role}</span>
                                                    <span style={{ fontSize: 10, color: '#C8C7C3' }}>{msg.time}</span>
                                                </div>
                                                <p style={{ fontSize: 14, margin: '4px 0 0', lineHeight: 1.6 }}>{msg.text}</p>
                                            </>
                                        )}
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                            <div style={{ padding: '12px 16px', borderTop: '1px solid #E9E9E7', display: 'flex', gap: 8 }}>
                                <input value={chatDraft} onChange={e => setChatDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
                                    placeholder="Type a message..." style={{ flex: 1, border: '1px solid #E9E9E7', borderRadius: 4, padding: '10px 14px', fontSize: 13, fontFamily: f, outline: 'none' }} />
                                <button onClick={handleSend} disabled={!chatDraft.trim()} style={{ background: chatDraft.trim() ? '#37352F' : '#D3D1CB', color: 'white', border: 'none', borderRadius: 4, padding: '10px 20px', fontSize: 13, fontWeight: 500, cursor: chatDraft.trim() ? 'pointer' : 'default' }}>Send</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ============================================================ */}
                {/* ABOUT TAB */}
                {/* ============================================================ */}
                {tab === 'about' && (
                    <div style={{ maxWidth: 640 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px' }}>Your Team</h2>
                        <div style={{ ...card, padding: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#37352F', color: 'white', fontSize: 20, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>BT</div>
                                <div>
                                    <div style={{ fontSize: 18, fontWeight: 700 }}>Bjorn Teo</div>
                                    <div style={{ fontSize: 13, color: '#9B9A97' }}>Interior Designer</div>
                                </div>
                            </div>
                            <div style={{ borderTop: '1px solid #F1F1EF', paddingTop: 16, fontSize: 13, color: '#6B6B65', lineHeight: 2 }}>
                                <div style={{ fontWeight: 600, fontSize: 15, color: '#37352F' }}>Vinterior Pte Ltd</div>
                                <div>UEN: 202XXXXXXX</div>
                                <div>Singapore</div>
                                <div style={{ marginTop: 8 }}>hello@vinterior.sg</div>
                                <div>+65 XXXX XXXX</div>
                                <div><span style={{ color: '#2383E2' }}>www.vinterior.sg</span></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Sign Modal  Multi-step flow */}
            {
                showSignModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                        <div style={{ background: 'white', borderRadius: 8, padding: '32px', maxWidth: 520, width: '90%', maxHeight: '85vh', overflowY: 'auto' }}>

                            {/* Step 1: Sign */}
                            {signStep === 'sign' && (<>
                                <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>Accept &amp; Sign</h3>
                                <p style={{ fontSize: 13, color: '#9B9A97', margin: '0 0 16px', lineHeight: 1.6 }}>
                                    By signing, you confirm acceptance of the quotation for ${total.toLocaleString()} (excl. 9% GST).
                                    {removedCount > 0 && ` ${removedCount} item(s) have been removed per your request.`}
                                    {changeCount > 0 && ` ${changeCount} item(s) marked for revision will be updated by your designer.`}
                                </p>

                                <div style={{ background: '#F7F6F3', borderRadius: 6, padding: '14px 16px', marginBottom: 16, maxHeight: 180, overflowY: 'auto', fontSize: 11, color: '#6B6B65', lineHeight: 1.8 }}>
                                    <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6, color: '#37352F' }}>Terms &amp; Conditions</div>
                                    <div>1. This quotation is valid for 30 days from the date of issue.</div>
                                    <div>2. All prices are in SGD and subject to prevailing GST (currently 9%).</div>
                                    <div>3. A deposit of 20% is required upon confirmation to commence design works.</div>
                                    <div>4. Additional works not specified will be charged separately via a Variation Order (VO).</div>
                                    <div>5. The contractor must hold a valid BCA Builders Licence for works exceeding $30,000.</div>
                                    <div>6. All HDB renovation works must comply with HDB&apos;s renovation guidelines.</div>
                                    <div>7. Timeline estimates are subject to site conditions and permit approvals.</div>
                                    <div>8. Final measurements will be taken on-site and may differ from initial estimates.</div>
                                    <div>9. A defects liability period of 30 days applies from project handover.</div>
                                    <div>10. Disputes shall be resolved through mediation under CASE or Small Claims Tribunal.</div>
                                    <div style={{ marginTop: 8, fontWeight: 500, color: '#37352F' }}>Data Protection</div>
                                    <div>11. By proceeding, you consent to data collection under the PDPA 2012.</div>
                                    <div style={{ marginTop: 8, fontWeight: 500, color: '#37352F' }}>Electronic Signature</div>
                                    <div>12. This digital signature is legally binding under the Electronic Transactions Act (Cap. 88).</div>
                                </div>

                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 16, cursor: 'pointer' }}>
                                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 3 }} />
                                    <span style={{ fontSize: 12, color: '#6B6B65', lineHeight: 1.5 }}>
                                        I have read and agree to the Terms &amp; Conditions. I consent to data collection under the PDPA.
                                    </span>
                                </label>

                                <div style={{ border: '1px solid #E9E9E7', borderRadius: 6, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C8C7C3', fontSize: 13, marginBottom: 16, cursor: 'pointer' }}>
                                    Sign here (tap or draw)
                                </div>
                                <div style={{ fontSize: 10, color: '#C8C7C3', textAlign: 'center', marginBottom: 16 }}>
                                    Protected under the Electronic Transactions Act (Cap. 88)
                                </div>
                                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                    <button onClick={() => setShowSignModal(false)} style={{ background: '#F7F6F3', border: '1px solid #E9E9E7', borderRadius: 4, padding: '8px 20px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                                    <button disabled={!agreed} onClick={() => setSignStep('escrow')} style={{ background: agreed ? '#37352F' : '#D3D1CB', color: 'white', border: 'none', borderRadius: 4, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: agreed ? 'pointer' : 'default' }}>Continue to Payment </button>
                                </div>
                            </>)}

                            {/* Step 2: Escrow Deposit */}
                            {signStep === 'escrow' && (<>
                                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                    <div style={{ fontSize: 32, marginBottom: 8 }}></div>
                                    <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>Escrow Deposit</h3>
                                    <p style={{ fontSize: 12, color: '#9B9A97', margin: 0 }}>Your payment is held securely. Released to the firm only upon milestone completion.</p>
                                </div>

                                <div style={{ background: '#F7F6F3', borderRadius: 6, padding: 16, marginBottom: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                                        <span style={{ color: '#9B9A97' }}>Contract Value</span>
                                        <span style={{ fontWeight: 600 }}>${total.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                                        <span style={{ color: '#9B9A97' }}>Deposit (20%)</span>
                                        <span style={{ fontWeight: 600 }}>${deposit.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                                        <span style={{ color: '#9B9A97' }}>GST (9%)</span>
                                        <span>${gst.toLocaleString()}</span>
                                    </div>
                                    <div style={{ borderTop: '1px solid #E9E9E7', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }}>
                                        <span>Due Now</span>
                                        <span>${(deposit + gst).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#37352F' }}>Payment Milestones</div>
                                    {[
                                        { step: '1', label: 'Deposit  Upon signing', pct: '20%', amt: deposit, status: 'now' },
                                        { step: '2', label: 'Demolition complete', pct: '15%', amt: Math.round(total * 0.15), status: 'upcoming' },
                                        { step: '3', label: 'Carpentry installed', pct: '30%', amt: Math.round(total * 0.30), status: 'upcoming' },
                                        { step: '4', label: 'Painting & fixtures done', pct: '20%', amt: Math.round(total * 0.20), status: 'upcoming' },
                                        { step: '5', label: 'Handover + defect clear', pct: '15%', amt: Math.round(total * 0.15), status: 'upcoming' },
                                    ].map(m => (
                                        <div key={m.step} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                                            <div style={{
                                                width: 20, height: 20, borderRadius: '50%', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: m.status === 'now' ? '#37352F' : '#F1F1EF', color: m.status === 'now' ? 'white' : '#9B9A97'
                                            }}>{m.step}</div>
                                            <div style={{ flex: 1, fontSize: 12 }}>{m.label}</div>
                                            <div style={{ fontSize: 12, color: '#9B9A97' }}>{m.pct}</div>
                                            <div style={{ fontSize: 12, fontWeight: 600, minWidth: 60, textAlign: 'right' }}>${m.amt.toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ background: '#DDEDDA', borderRadius: 6, padding: '10px 14px', marginBottom: 16, fontSize: 11, color: '#1A7A34', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: 14 }}>️</span>
                                    <span>Your payments are held in escrow by Roof. Funds are only released to the contractor when you confirm each milestone is completed satisfactorily.</span>
                                </div>

                                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                    <button onClick={() => setSignStep('sign')} style={{ background: '#F7F6F3', border: '1px solid #E9E9E7', borderRadius: 4, padding: '8px 20px', fontSize: 13, cursor: 'pointer' }}> Back</button>
                                    <button onClick={() => { setSignStep('processing'); setTimeout(() => setSignStep('success'), 2500); }} style={{ background: '#37352F', color: 'white', border: 'none', borderRadius: 4, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Pay ${(deposit + gst).toLocaleString()} </button>
                                </div>
                            </>)}

                            {/* Step 3: Processing */}
                            {signStep === 'processing' && (
                                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <div style={{ fontSize: 48, marginBottom: 16, animation: 'spin 1s linear infinite' }}></div>
                                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                                    <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>Processing Payment...</h3>
                                    <p style={{ fontSize: 13, color: '#9B9A97', margin: 0 }}>Securing your escrow deposit with Roof</p>
                                </div>
                            )}

                            {/* Step 4: Success */}
                            {signStep === 'success' && (
                                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                    <div style={{ fontSize: 56, marginBottom: 12 }}></div>
                                    <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>You&apos;re all set!</h3>
                                    <p style={{ fontSize: 13, color: '#9B9A97', margin: '0 0 20px' }}>Your renovation project has officially started.</p>

                                    <div style={{ background: '#F7F6F3', borderRadius: 6, padding: 16, marginBottom: 20, textAlign: 'left' }}>
                                        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: '#37352F' }}>Project Kickoff Summary</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
                                            <div><span style={{ color: '#9B9A97' }}>Designer:</span> <b>Bjorn Teo</b></div>
                                            <div><span style={{ color: '#9B9A97' }}>Firm:</span> <b>Vinterior Pte Ltd</b></div>
                                            <div><span style={{ color: '#9B9A97' }}>Contract:</span> <b>${total.toLocaleString()}</b></div>
                                            <div><span style={{ color: '#9B9A97' }}>Deposit Paid:</span> <b style={{ color: '#35A855' }}>${(deposit + gst).toLocaleString()}</b></div>
                                            <div><span style={{ color: '#9B9A97' }}>Status:</span> <b style={{ color: '#35A855' }}>Pre-Construction</b></div>
                                            <div><span style={{ color: '#9B9A97' }}>Est. Start:</span> <b>10 Mar 2026</b></div>
                                        </div>
                                    </div>

                                    <div style={{ background: '#DDEDDA', borderRadius: 6, padding: '10px 14px', marginBottom: 20, fontSize: 11, color: '#1A7A34', textAlign: 'left' }}>
                                        Escrow deposit secured &nbsp;·&nbsp;  Contract signed &nbsp;·&nbsp;  Designer notified &nbsp;·&nbsp;  Dashboard activated
                                    </div>

                                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12, color: '#37352F' }}>What happens next:</div>
                                    <div style={{ textAlign: 'left', marginBottom: 20 }}>
                                        {[
                                            { icon: '', text: 'Bjorn will finalize your design drawings within 5 working days' },
                                            { icon: '', text: 'HDB renovation permit will be submitted on your behalf' },
                                            { icon: '', text: 'Your project timeline will be published to your dashboard' },
                                            { icon: '', text: 'You can chat with your designer anytime through the dashboard' },
                                        ].map((item, i) => (
                                            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, fontSize: 12, color: '#6B6B65' }}>
                                                <span style={{ fontSize: 16 }}>{item.icon}</span>
                                                <span>{item.text}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button onClick={() => { window.location.href = '/client-dashboard'; }} style={{ width: '100%', background: '#37352F', color: 'white', border: 'none', borderRadius: 6, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                                        Go to Your Dashboard
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                )
            }
        </div >
    );
}
