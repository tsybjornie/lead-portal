'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ============================================================
// TYPES
// ============================================================
interface MilestonePhase {
    id: string;
    name: string;
    status: 'completed' | 'active' | 'upcoming';
    date?: string;
    items: MilestoneItem[];
}

interface MilestoneItem {
    id: string;
    title: string;
    status: 'done' | 'in-progress' | 'pending' | 'flagged';
}

interface SitePhoto {
    id: string;
    zone: string;
    caption: string;
    date: string;
    uploadedBy: string;
    status: 'progress' | 'completed' | 'rectification';
}

interface Rectification {
    id: string;
    zone: string;
    issue: string;
    raisedBy: string;
    raisedAt: string;
    status: 'open' | 'in-progress' | 'resolved';
    response?: string;
}

interface PaymentMilestone {
    id: string;
    label: string;
    amount: number;
    percentage: number;
    status: 'paid' | 'due' | 'upcoming';
    paidAt?: string;
    dueDate?: string;
}

interface VariationOrder {
    id: string;
    code: string;
    description: string;
    amount: number;
    source: 'client' | 'designer' | 'site-condition';
    status: 'approved' | 'pending' | 'rejected';
}

interface Arrangement {
    id: string;
    service: string;
    vendor?: string;
    date?: string;
    time?: string;
    status: 'booked' | 'setup';
}

interface DrawingDoc {
    name: string;
    revision: string;
    status: 'Approved' | 'Pending' | 'N/A';
}

interface ChatMessage {
    id: string;
    from: string;
    role: 'client' | 'designer' | 'vendor' | 'pm';
    text: string;
    time: string;
}

interface Appliance {
    id: string;
    name: string;
    brand: string;
    model: string;
    category: 'appliance' | 'fixture' | 'furniture' | 'smart-home' | 'lighting';
    location: string;
    boughtFrom: string;
    price: number;
    warrantyYears?: number;
    purchaseDate?: string;
    deliveryDate?: string;
    dimensions?: string;
    status: 'purchased' | 'ordered' | 'wishlist';
    notes?: string;
    productUrl?: string;
}

interface QuoteSummary {
    total: number;
    approved: number;
    flagged: number;
    pending: number;
    totalItems: number;
    companyName: string;
    projectName: string;
    clientName: string;
}

type NavSection = 'home' | 'quote' | 'design' | 'progress' | 'payments' | 'photos' | 'documents' | 'arrangements' | 'appliances' | 'messages' | 'photoshoot';

// ============================================================
// SAMPLE DATA  Matching Roof's rich client view
// ============================================================
const MILESTONES: MilestonePhase[] = [
    {
        id: 'phase-1', name: 'Design', status: 'completed', date: 'Jan 10',
        items: [
            { id: 'm1', title: 'Site measurement', status: 'done' },
            { id: 'm2', title: 'Concept design', status: 'done' },
            { id: 'm3', title: 'Layout approval', status: 'done' },
            { id: 'm4', title: '3D renders', status: 'done' },
        ]
    },
    {
        id: 'phase-2', name: 'Quotation', status: 'completed', date: 'Jan 10',
        items: [
            { id: 'm5', title: 'Quote generated', status: 'done' },
            { id: 'm6', title: 'Client review', status: 'done' },
            { id: 'm7', title: 'Material selection', status: 'done' },
            { id: 'm8', title: 'Final approval', status: 'done' },
        ]
    },
    {
        id: 'phase-3', name: 'Hacking', status: 'completed', date: 'Jan 15',
        items: [
            { id: 'm9', title: 'Hacking & demolition', status: 'done' },
            { id: 'm10', title: 'Debris disposal', status: 'done' },
        ]
    },
    {
        id: 'phase-4', name: 'M&E Works', status: 'completed', date: 'Jan 22',
        items: [
            { id: 'm11', title: 'Electrical rewiring', status: 'done' },
            { id: 'm12', title: 'Plumbing rough-in', status: 'done' },
            { id: 'm13', title: 'Aircon piping', status: 'done' },
        ]
    },
    {
        id: 'phase-5', name: 'Tiling', status: 'active', date: 'Feb 3',
        items: [
            { id: 'm14', title: 'Kitchen tiling', status: 'done' },
            { id: 'm15', title: 'Bathroom tiling', status: 'in-progress' },
            { id: 'm16', title: 'Living room tiling', status: 'pending' },
        ]
    },
    {
        id: 'phase-6', name: 'Carpentry', status: 'upcoming', date: 'Feb 12',
        items: [
            { id: 'm17', title: 'Kitchen cabinets', status: 'pending' },
            { id: 'm18', title: 'Wardrobes', status: 'pending' },
            { id: 'm19', title: 'TV console', status: 'pending' },
            { id: 'm20', title: 'Shoe cabinet', status: 'pending' },
        ]
    },
    {
        id: 'phase-7', name: 'Painting', status: 'upcoming', date: 'Feb 18',
        items: [
            { id: 'm21', title: 'Walls & ceiling', status: 'pending' },
            { id: 'm22', title: 'Touch-up', status: 'pending' },
        ]
    },
    {
        id: 'phase-8', name: 'Handover', status: 'upcoming', date: 'Feb 25',
        items: [
            { id: 'm23', title: 'Deep cleaning', status: 'pending' },
            { id: 'm24', title: 'Defect inspection', status: 'pending' },
            { id: 'm25', title: 'Key handover', status: 'pending' },
        ]
    },
];

const PAYMENT_SCHEDULE: PaymentMilestone[] = [
    { id: 'p1', label: 'Deposit (30%)', amount: 25500, percentage: 30, status: 'paid', paidAt: 'Jan 10' },
    { id: 'p2', label: 'Hacking & M&E Complete', amount: 17000, percentage: 20, status: 'paid', paidAt: 'Jan 25' },
    { id: 'p3', label: 'Tiling Complete', amount: 12750, percentage: 15, status: 'due', dueDate: 'Feb 5' },
    { id: 'p4', label: 'Carpentry Install', amount: 17000, percentage: 20, status: 'upcoming', dueDate: 'Feb 15' },
    { id: 'p5', label: 'Final Handover (10%)', amount: 12750, percentage: 15, status: 'upcoming', dueDate: 'Feb 25' },
];

const VARIATION_ORDERS: VariationOrder[] = [
    { id: 'vo1', code: 'VO-001', description: 'Additional power point in kitchen island', amount: 180, source: 'client', status: 'approved' },
    { id: 'vo2', code: 'VO-002', description: 'Upgrade bathroom tiles to porcelain', amount: 1200, source: 'client', status: 'approved' },
    { id: 'vo3', code: 'VO-003', description: 'Change bedroom door from hollow to solid', amount: 450, source: 'designer', status: 'pending' },
    { id: 'vo4', code: 'VO-004', description: 'Additional LED strip lighting', amount: 320, source: 'site-condition', status: 'pending' },
];

const SITE_PHOTOS: SitePhoto[] = [
    { id: 'sp1', zone: 'Kitchen', caption: 'Kitchen tiling complete', date: '2026-02-03', uploadedBy: 'Ahmad', status: 'completed' },
    { id: 'sp2', zone: 'Bathroom', caption: 'Bathroom waterproofing', date: '2026-02-03', uploadedBy: 'Ahmad', status: 'progress' },
    { id: 'sp3', zone: 'Living Room', caption: 'Living room before carpentry', date: '2026-02-02', uploadedBy: 'Raju', status: 'progress' },
    { id: 'sp4', zone: 'All', caption: 'Electrical points marked', date: '2026-01-30', uploadedBy: 'Muthu', status: 'completed' },
    { id: 'sp5', zone: 'All', caption: 'Hacking in progress', date: '2026-01-18', uploadedBy: 'Ali', status: 'completed' },
    { id: 'sp6', zone: 'Living Room', caption: 'Before reno  living room', date: '2026-01-15', uploadedBy: 'Site', status: 'completed' },
    { id: 'sp7', zone: 'Kitchen', caption: 'Before reno  kitchen', date: '2026-01-15', uploadedBy: 'Site', status: 'completed' },
    { id: 'sp8', zone: 'Master Bath', caption: 'Before reno  master bath', date: '2026-01-15', uploadedBy: 'Site', status: 'completed' },
];

const RECTIFICATIONS: Rectification[] = [
    { id: 'r1', zone: 'Kitchen', issue: 'Tile crack near kitchen stove', raisedBy: 'Client', raisedAt: '2026-01-29', status: 'resolved', response: 'Tile replaced and re-grouted.' },
    { id: 'r2', zone: 'Bedroom', issue: 'Paint touch-up in bedroom', raisedBy: 'PM', raisedAt: '2026-01-30', status: 'in-progress', response: 'Scheduled for next week.' },
    { id: 'r3', zone: 'Entrance', issue: 'Door alignment issue', raisedBy: 'Client', raisedAt: '2026-01-31', status: 'open' },
];

const DRAWINGS: DrawingDoc[] = [
    { name: 'Floor Plan', revision: 'Rev B', status: 'Approved' },
    { name: 'Elevation Drawing', revision: 'Rev A', status: 'Approved' },
    { name: 'Electrical Layout', revision: 'Rev B', status: 'Approved' },
    { name: 'LEW Single Line Diagram', revision: 'Rev A', status: 'Approved' },
    { name: 'Plumbing Layout', revision: 'Rev A', status: 'Approved' },
    { name: 'Fire Sprinkler Plan', revision: 'Rev A', status: 'N/A' },
    { name: 'Lighting Cutsheet', revision: 'Rev A', status: 'Approved' },
    { name: 'Equipment Cutsheet', revision: 'Rev A', status: 'Approved' },
    { name: 'Ceiling Plan', revision: 'Rev A', status: 'Approved' },
    { name: '3D Renders', revision: 'Final', status: 'Approved' },
];

const ARRANGEMENTS: Arrangement[] = [
    { id: 'a1', service: 'Aircon', vendor: 'Cool Air Pte Ltd', date: 'Feb 20', time: '9am-12pm', status: 'booked' },
    { id: 'a2', service: 'Digital Lock', vendor: 'Yale Authorized', date: 'Feb 18', time: '2pm-5pm', status: 'booked' },
    { id: 'a3', service: 'ISP / Fibre', vendor: 'Singtel', date: 'Feb 22', time: '9am-12pm', status: 'booked' },
    { id: 'a4', service: 'Curtains & Blinds', status: 'setup' },
    { id: 'a5', service: 'Movers', status: 'setup' },
    { id: 'a6', service: 'Deep Cleaning', status: 'setup' },
    { id: 'a7', service: 'Furniture Delivery', vendor: 'FortyTwo', date: 'Feb 26', time: '10am-2pm', status: 'booked' },
    { id: 'a8', service: 'Door Vendor', status: 'setup' },
    { id: 'a9', service: 'Taobao / Shopee', vendor: 'Various', date: 'Feb 15-25', time: 'Various', status: 'booked' },
];

const RECENT_ACTIVITY = [
    { text: 'Kitchen tiling completed', time: 'Today 2:30 PM' },
    { text: 'Bathroom waterproofing in progress', time: 'Today 11:15 AM' },
    { text: 'VO-003 pending your approval', time: 'Yesterday' },
    { text: 'Tiling payment due  S$12,750', time: '2 days ago' },
    { text: 'Ahmad uploaded 2 site photos', time: '3 days ago' },
];

const CHAT_MESSAGES: ChatMessage[] = [
    { id: 'c1', from: 'Sarah (Designer)', role: 'designer', text: 'Hi! Kitchen tiling is done. I\'ll be visiting the site tomorrow to check the grout lines.', time: 'Today 3:15 PM' },
    { id: 'c2', from: 'You', role: 'client', text: 'Thanks Sarah! Can you also check the bathroom waterproofing? Want to make sure it\'s properly sealed around the shower area.', time: 'Today 3:22 PM' },
    { id: 'c3', from: 'Ahmad (Tiler)', role: 'vendor', text: 'Bathroom waterproofing membrane applied today. Need 24 hours to cure before tiling.', time: 'Today 11:15 AM' },
    { id: 'c4', from: 'Jason (PM)', role: 'pm', text: 'All on track. Carpentry materials arriving next week. Will update the schedule.', time: 'Yesterday 5:30 PM' },
    { id: 'c5', from: 'Sarah (Designer)', role: 'designer', text: 'Just uploaded the latest renders for the living room feature wall. Please take a look!', time: 'Yesterday 2:00 PM' },
];

const MY_APPLIANCES: Appliance[] = [
    { id: 'ap1', name: 'Digital Lock', brand: 'Samsung', model: 'SHP-DP609', category: 'smart-home', location: 'Main Door', boughtFrom: 'Qoo10', price: 489, warrantyYears: 2, purchaseDate: '2026-02-01', status: 'purchased', productUrl: 'https://www.qoo10.sg/item/SAMSUNG-SHP-DP609/123456' },
    { id: 'ap2', name: 'Fridge (4-Door)', brand: 'Samsung', model: 'Bespoke RF60A91C1AP', category: 'appliance', location: 'Kitchen', boughtFrom: 'Courts', price: 2899, warrantyYears: 10, purchaseDate: '2026-01-28', dimensions: '700×920×1850mm', status: 'purchased', productUrl: 'https://www.courts.com.sg/samsung-bespoke-fridge' },
    { id: 'ap3', name: 'Washing Machine', brand: 'LG', model: 'FV1409S4W 9kg', category: 'appliance', location: 'Yard', boughtFrom: 'Harvey Norman', price: 899, warrantyYears: 2, purchaseDate: '2026-01-28', dimensions: '600×560×850mm', status: 'purchased', productUrl: 'https://www.harveynorman.com.sg/lg-fv1409s4w' },
    { id: 'ap4', name: 'Dryer (Heat Pump)', brand: 'Samsung', model: 'DV90T8240SH 9kg', category: 'appliance', location: 'Yard', boughtFrom: 'Lazada', price: 1299, warrantyYears: 2, purchaseDate: '2026-02-05', dimensions: '600×600×850mm', status: 'purchased', productUrl: 'https://www.lazada.sg/products/samsung-dv90t8240sh-i2345.html' },
    { id: 'ap5', name: 'Built-in Oven', brand: 'Bosch', model: 'HBG634BS1B', category: 'appliance', location: 'Kitchen', boughtFrom: 'Bosch Experience Centre', price: 1599, warrantyYears: 2, purchaseDate: '2026-02-10', dimensions: '595×548×595mm', status: 'purchased', productUrl: 'https://www.bosch-home.com.sg/product/HBG634BS1B' },
    { id: 'ap6', name: 'Induction Hob', brand: 'Bosch', model: 'PIE631BB1E', category: 'appliance', location: 'Kitchen', boughtFrom: 'Bosch Experience Centre', price: 899, warrantyYears: 2, purchaseDate: '2026-02-10', dimensions: '592×522mm', status: 'purchased', productUrl: 'https://www.bosch-home.com.sg/product/PIE631BB1E' },
    { id: 'ap7', name: 'Dishwasher', brand: 'Bosch', model: 'SMS2HVI72E', category: 'appliance', location: 'Kitchen', boughtFrom: 'Lazada', price: 1099, warrantyYears: 2, dimensions: '600×600×845mm', status: 'ordered', notes: 'Arriving Feb 20', deliveryDate: '2026-02-20', productUrl: 'https://www.lazada.sg/products/bosch-sms2hvi72e-i6789.html' },
    { id: 'ap8', name: 'LED Downlight ×16', brand: 'Philips', model: 'Hue White Ambiance', category: 'lighting', location: 'Living + Kitchen + Bedrooms', boughtFrom: 'Shopee', price: 720, purchaseDate: '2026-02-08', status: 'purchased', notes: '$45 each × 16 units', productUrl: 'https://shopee.sg/Philips-Hue-White-Ambiance-i.123.456' },
    { id: 'ap9', name: 'Pendant Light', brand: 'Tom Dixon', model: 'Beat Wide', category: 'lighting', location: 'Dining', boughtFrom: 'Space Furniture', price: 680, status: 'ordered', notes: 'Lead time 3 weeks', deliveryDate: '2026-02-28', productUrl: 'https://www.spacefurniture.com.sg/tom-dixon-beat-wide' },
    { id: 'ap10', name: 'Smart Hub + Sensors', brand: 'Aqara', model: 'M2 Hub + 6 sensors', category: 'smart-home', location: 'Whole Unit', boughtFrom: 'Shopee', price: 199, purchaseDate: '2026-02-12', status: 'purchased', productUrl: 'https://shopee.sg/Aqara-M2-Hub-Kit-i.789.012' },
    { id: 'ap11', name: 'Sofa (L-Shape)', brand: 'Castlery', model: 'Dawson L-Shape', category: 'furniture', location: 'Living Room', boughtFrom: 'Castlery.com', price: 2899, dimensions: '2700×1800×850mm', status: 'ordered', notes: 'Delivery after handover', deliveryDate: '2026-03-01', productUrl: 'https://www.castlery.com/sg/product/dawson-l-shape-sofa' },
    { id: 'ap12', name: 'Dining Table', brand: 'FortyTwo', model: 'Rena Sintered Stone 1.6m', category: 'furniture', location: 'Dining', boughtFrom: 'FortyTwo', price: 599, dimensions: '1600×800×750mm', status: 'wishlist', productUrl: 'https://www.fortytwo.sg/rena-sintered-stone-table' },
    { id: 'ap13', name: 'Shower Set (Rainhead)', brand: 'Grohe', model: 'Euphoria 260', category: 'fixture', location: 'Master Bath', boughtFrom: 'SIM SIANG CHOON', price: 489, status: 'purchased', purchaseDate: '2026-02-03', productUrl: 'https://www.simsianghoon.com/grohe-euphoria-260' },
    { id: 'ap14', name: 'Basin Mixer Tap', brand: 'Grohe', model: 'Eurosmart', category: 'fixture', location: 'Master Bath + Common Bath', boughtFrom: 'SIM SIANG CHOON', price: 318, status: 'purchased', purchaseDate: '2026-02-03', notes: '$159 × 2 units', productUrl: 'https://www.simsianghoon.com/grohe-eurosmart' },
    { id: 'ap15', name: 'Ceiling Fan', brand: 'Fanco', model: 'Acon 52"', category: 'appliance', location: 'Master Bedroom', boughtFrom: 'Taobao via ezbuy', price: 289, status: 'ordered', notes: 'Shipped from China, ETA 2-3 weeks', deliveryDate: '2026-02-25', productUrl: 'https://item.taobao.com/item.htm?id=654321789' },
    { id: 'ap16', name: 'Cabinet Handles ×24', brand: 'No Brand', model: 'Gold Brass T-Bar 160mm', category: 'fixture', location: 'Kitchen + Wardrobe', boughtFrom: 'Taobao via ezbuy', price: 72, status: 'purchased', purchaseDate: '2026-02-01', notes: '$3 each × 24pcs', productUrl: 'https://item.taobao.com/item.htm?id=987654321' },
];

// ============================================================
// COMPONENT
// ============================================================
export default function ClientDashboard({ shareCode }: { shareCode: string }) {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState<NavSection>('home');
    const [quoteSummary, setQuoteSummary] = useState<QuoteSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [voStatuses, setVoStatuses] = useState<Record<string, string>>({});
    const [chatInput, setChatInput] = useState('');

    const contractTotal = 85000;
    const totalPaid = PAYMENT_SCHEDULE.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
    const totalApprovedVO = VARIATION_ORDERS.filter(v => v.status === 'approved').reduce((s, v) => s + v.amount, 0);
    const progressPct = Math.round(
        (MILESTONES.flatMap(m => m.items).filter(i => i.status === 'done').length /
            MILESTONES.flatMap(m => m.items).length) * 100
    );

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/quotes/${shareCode}`);
                if (!res.ok) { router.push('/client/login'); return; }
                const data = await res.json();
                const allItems = data.sections?.flatMap((s: { items: unknown[] }) => s.items) || [];
                setQuoteSummary({
                    total: data.total || 0,
                    approved: allItems.filter((i: { status?: string }) => i.status === 'approved').length,
                    flagged: allItems.filter((i: { status?: string }) => i.status === 'flagged').length,
                    pending: allItems.filter((i: { status?: string }) => !i.status || i.status === 'pending').length,
                    totalItems: allItems.length,
                    companyName: data.companyName || '',
                    projectName: data.projectName || '',
                    clientName: data.clientName || 'Mr & Mrs Tan',
                });
            } catch { router.push('/client/login'); }
            finally { setLoading(false); }
        }
        load();
    }, [shareCode, router]);

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
    );

    const formatPrice = (n: number) => `$${n.toLocaleString()}`;

    const navItems: { id: NavSection; label: string; badge?: number; icon: React.ReactNode }[] = [
        { id: 'home', label: 'Home', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
        { id: 'quote', label: 'Quotation', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg> },
        { id: 'progress', label: 'Progress', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg> },
        { id: 'payments', label: 'Payments', badge: PAYMENT_SCHEDULE.filter(p => p.status === 'due').length, icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> },
        { id: 'photos', label: 'Site Photos', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg> },
        { id: 'documents', label: 'Approved Drawings', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg> },
        { id: 'arrangements', label: 'Arrangements', badge: ARRANGEMENTS.filter(a => a.status === 'setup').length, icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> },
        { id: 'appliances', label: 'My Purchases', badge: MY_APPLIANCES.filter(a => a.status === 'ordered').length, icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="12" y2="14" /></svg> },
        { id: 'messages', label: 'Messages', badge: 2, icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
        { id: 'photoshoot', label: 'Photoshoot', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg> },
    ];

    const statusDot = (s: string) => {
        if (s === 'done' || s === 'completed' || s === 'resolved' || s === 'paid') return 'bg-emerald-500';
        if (s === 'in-progress' || s === 'active' || s === 'due') return 'bg-blue-500';
        if (s === 'flagged' || s === 'rectification' || s === 'open') return 'bg-amber-500';
        return 'bg-gray-200';
    };

    return (
        <>
            <style>{`
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideInLeft { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes progressFill { from { width: 0; } }
            .anim-fade-up { animation: fadeInUp 0.4s ease-out both; }
            .anim-fade { animation: fadeIn 0.3s ease-out both; }
            .anim-slide { animation: slideInLeft 0.3s ease-out both; }
            .anim-delay-1 { animation-delay: 0.05s; }
            .anim-delay-2 { animation-delay: 0.1s; }
            .anim-delay-3 { animation-delay: 0.15s; }
            .anim-delay-4 { animation-delay: 0.2s; }
            .anim-delay-5 { animation-delay: 0.25s; }
            .anim-progress { animation: progressFill 1s ease-out both; animation-delay: 0.3s; }
            .hover-lift { transition: transform 0.2s, box-shadow 0.2s; }
            .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        `}</style>
            <div className="min-h-screen bg-white flex" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                {/* SIDEBAR */}
                <aside className="w-52 bg-white border-r border-gray-100 flex flex-col shrink-0 h-screen sticky top-0">
                    <div className="px-4 py-4 border-b border-gray-50">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-white font-bold text-[10px]">{(quoteSummary?.clientName || 'CP').split(' ').filter(w => w[0]?.match(/[A-Z]/)).map(w => w[0]).join('').slice(0, 2) || 'TT'}</span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-[11px] font-semibold text-gray-800 truncate">{quoteSummary?.clientName || 'Client Portal'}</p>
                                <p className="text-[10px] text-gray-400 truncate">{quoteSummary?.projectName}</p>
                            </div>
                        </div>
                        <p className="text-[9px] text-gray-300 mt-2">Designer: {quoteSummary?.companyName}</p>
                    </div>

                    <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${activeSection === item.id
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                    }`}
                            >
                                {item.icon}
                                <span className="flex-1 text-left">{item.label}</span>
                                {item.badge && item.badge > 0 && (
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${activeSection === item.id ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-600'
                                        }`}>{item.badge}</span>
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="p-3 border-t border-gray-50 space-y-2">
                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
                            Escalate to Platform
                        </button>
                        <button
                            onClick={() => router.push('/client/login')}
                            className="w-full text-left px-3 py-1 text-[9px] text-gray-300 hover:text-gray-500"
                        >
                            Switch Project
                        </button>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 overflow-y-auto min-h-screen" key={activeSection}>
                    {/*  HOME  */}
                    {activeSection === 'home' && (
                        <div className="p-8 px-10 anim-fade">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8 anim-fade-up">
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Welcome, {quoteSummary?.clientName}</h1>
                                    <p className="text-xs text-gray-400 mt-0.5">{quoteSummary?.projectName}  Block 123 Tampines St 45 #12-345</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900">{progressPct}%</p>
                                    <p className="text-[10px] text-gray-400">Est. Feb 25</p>
                                </div>
                            </div>

                            {/* Needs Your Attention — ABOVE THE FOLD */}
                            {(VARIATION_ORDERS.filter(v => v.status === 'pending').length > 0 || RECTIFICATIONS.filter(r => r.status === 'open').length > 0) && (
                                <div className="bg-amber-50 rounded-xl border border-amber-100 p-5 mb-6 anim-fade-up">
                                    <h3 className="text-xs font-semibold text-amber-700 mb-3">⚡ Needs Your Attention</h3>
                                    <div className="space-y-2">
                                        {VARIATION_ORDERS.filter(v => v.status === 'pending').map(vo => (
                                            <div key={vo.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-amber-100">
                                                <div>
                                                    <p className="text-[10px] text-gray-400">{vo.code}  {vo.source === 'designer' ? 'ID suggestion' : vo.source === 'site-condition' ? 'Site condition' : 'Your request'}</p>
                                                    <p className="text-xs text-gray-700 font-medium">{vo.description}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs font-semibold text-gray-800">+{formatPrice(vo.amount)}</p>
                                                    <button
                                                        onClick={() => setVoStatuses(p => ({ ...p, [vo.id]: 'approved' }))}
                                                        className={`text-[9px] px-2 py-1 rounded font-medium ${voStatuses[vo.id] === 'approved' ? 'bg-emerald-500 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'
                                                            }`}
                                                    >
                                                        {voStatuses[vo.id] === 'approved' ? 'Approved ✓' : 'Approve'}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Delivery Timeline — Step by Step with Accountability */}
                            <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-sm font-semibold text-gray-800">Delivery Timeline</h2>
                                        <p className="text-[10px] text-gray-400 mt-0.5">Step-by-step progress with accountability tracking</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[9px] text-gray-400">Verified</span></div>
                                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-[9px] text-gray-400">Active</span></div>
                                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-200" /><span className="text-[9px] text-gray-400">Upcoming</span></div>
                                    </div>
                                </div>
                                {/* Progress bar */}
                                <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
                                    <div className="bg-gray-900 h-2 rounded-full transition-all anim-progress" style={{ width: `${progressPct}%` }} />
                                </div>
                                <div className="space-y-0">
                                    {MILESTONES.map((phase, idx) => {
                                        const doneCount = phase.items.filter(i => i.status === 'done').length;
                                        const totalCount = phase.items.length;
                                        const isComplete = phase.status === 'completed';
                                        const isActive = phase.status === 'active';
                                        const responsibleMap: Record<string, { label: string; color: string }> = {
                                            'Design': { label: 'ID', color: 'bg-purple-100 text-purple-600' },
                                            'Quotation': { label: 'ID + Client', color: 'bg-indigo-100 text-indigo-600' },
                                            'Hacking': { label: 'Vendor', color: 'bg-amber-100 text-amber-600' },
                                            'M&E Works': { label: 'Vendor', color: 'bg-amber-100 text-amber-600' },
                                            'Tiling': { label: 'Vendor', color: 'bg-amber-100 text-amber-600' },
                                            'Carpentry': { label: 'Vendor', color: 'bg-amber-100 text-amber-600' },
                                            'Painting': { label: 'Vendor', color: 'bg-amber-100 text-amber-600' },
                                            'Handover': { label: 'All Parties', color: 'bg-gray-100 text-gray-600' },
                                        };
                                        const responsible = responsibleMap[phase.name] || { label: 'TBC', color: 'bg-gray-100 text-gray-400' };
                                        return (
                                            <div key={phase.id}>
                                                <div className={`flex items-center gap-3 py-3 ${idx < MILESTONES.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                                    {/* Step number */}
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${isComplete ? 'bg-emerald-500 text-white' :
                                                        isActive ? 'bg-blue-500 text-white ring-3 ring-blue-100' :
                                                            'bg-gray-100 text-gray-400'
                                                        }`}>
                                                        {isComplete ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                        ) : idx + 1}
                                                    </div>
                                                    {/* Connector line */}
                                                    {idx < MILESTONES.length - 1 && (
                                                        <div className="absolute ml-3.5 mt-10 w-px h-4" style={{ background: isComplete ? '#10b981' : '#e5e7eb' }} />
                                                    )}
                                                    {/* Phase info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className={`text-xs font-semibold ${isComplete ? 'text-gray-800' :
                                                                isActive ? 'text-blue-600' :
                                                                    'text-gray-400'
                                                                }`}>{phase.name}</p>
                                                            <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium ${responsible.color}`}>{responsible.label}</span>
                                                            {isComplete && <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">✓ ID Verified</span>}
                                                        </div>
                                                        {/* Sub-tasks inline */}
                                                        <div className="flex items-center gap-1 mt-1">
                                                            {phase.items.map(item => (
                                                                <div key={item.id} title={item.title} className={`w-3 h-1.5 rounded-sm ${item.status === 'done' ? 'bg-emerald-400' :
                                                                    item.status === 'in-progress' ? 'bg-blue-400' :
                                                                        item.status === 'flagged' ? 'bg-amber-400' :
                                                                            'bg-gray-200'
                                                                    }`} />
                                                            ))}
                                                            <span className="text-[9px] text-gray-400 ml-1">{doneCount}/{totalCount}</span>
                                                        </div>
                                                    </div>
                                                    {/* Date + gate */}
                                                    <div className="text-right shrink-0">
                                                        <p className={`text-[11px] font-medium ${isActive ? 'text-blue-600' : isComplete ? 'text-gray-600' : 'text-gray-300'}`}>{phase.date}</p>
                                                        {isComplete && idx < MILESTONES.length - 1 && (
                                                            <p className="text-[8px] text-emerald-500 font-medium">GATE PASSED ✓</p>
                                                        )}
                                                        {isActive && (
                                                            <p className="text-[8px] text-blue-500 font-medium">IN PROGRESS</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Stage Gate between phases */}
                                                {isComplete && idx < MILESTONES.length - 1 && MILESTONES[idx + 1].status !== 'completed' && MILESTONES[idx + 1].status === 'active' && (
                                                    <div className="ml-3 pl-7 py-1 border-l-2 border-emerald-300">
                                                        <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-1.5">
                                                            <span className="text-[9px] text-emerald-700 font-medium">⚡ Stage gate cleared — ID verified all {phase.name.toLowerCase()} work before proceeding</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Payment + Activity Row */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white rounded-xl border border-gray-100 p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xs font-semibold text-gray-700">Payment Schedule</h3>
                                        <p className="text-[10px] text-gray-400">Contract: {formatPrice(contractTotal)}</p>
                                    </div>
                                    <div className="space-y-2">
                                        {PAYMENT_SCHEDULE.slice(0, 3).map(p => (
                                            <div key={p.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${statusDot(p.status)}`} />
                                                    <p className="text-[11px] text-gray-600">{p.label}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[11px] font-medium text-gray-700">{formatPrice(p.amount)}</p>
                                                    {p.status === 'due' && (
                                                        <span className="text-[8px] px-1.5 py-0.5 bg-blue-500 text-white rounded font-medium">DUE</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => setActiveSection('payments')} className="text-[10px] text-blue-500 mt-3 hover:underline">View all </button>
                                </div>

                                <div className="bg-white rounded-xl border border-gray-100 p-5">
                                    <h3 className="text-xs font-semibold text-gray-700 mb-3">Recent Activity</h3>
                                    <div className="space-y-2.5">
                                        {RECENT_ACTIVITY.slice(0, 4).map((a, i) => (
                                            <div key={i} className="flex items-start gap-2.5">
                                                <div className="w-1 h-1 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                                                <div>
                                                    <p className="text-[11px] text-gray-600">{a.text}</p>
                                                    <p className="text-[9px] text-gray-300">{a.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>


                        </div>
                    )}

                    {/*  QUOTE  */}
                    {activeSection === 'quote' && (
                        <div className="h-full">
                            <div className="border-b border-gray-100 bg-white px-6 py-3 flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-gray-800">Quotation Review</h2>
                                <a href={`/quote/${shareCode}`} target="_blank" className="text-xs text-blue-500 hover:text-blue-600">Open full view </a>
                            </div>
                            <iframe src={`/quote/${shareCode}`} className="w-full border-0" style={{ height: 'calc(100vh - 49px)' }} title="Quote Review" />
                        </div>
                    )}

                    {/*  PROGRESS (KANBAN)  */}
                    {activeSection === 'progress' && (
                        <div className="p-8">
                            <h2 className="text-lg font-bold text-gray-900 mb-1">Project Progress</h2>
                            <p className="text-xs text-gray-400 mb-6">{progressPct}% complete  Est. handover Feb 25</p>

                            <div className="flex gap-3 overflow-x-auto pb-4">
                                {MILESTONES.map(phase => (
                                    <div key={phase.id} className="min-w-[200px] w-[200px] shrink-0">
                                        <div className={`rounded-t-xl px-3 py-2.5 ${phase.status === 'completed' ? 'bg-emerald-500' :
                                            phase.status === 'active' ? 'bg-blue-500' : 'bg-gray-200'
                                            }`}>
                                            <div className="flex items-center justify-between">
                                                <p className={`text-[11px] font-semibold ${phase.status === 'upcoming' ? 'text-gray-500' : 'text-white'}`}>{phase.name}</p>
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${phase.status === 'upcoming' ? 'bg-gray-300 text-gray-500' : 'bg-white/20 text-white'
                                                    }`}>{phase.items.filter(i => i.status === 'done').length}/{phase.items.length}</span>
                                            </div>
                                            <p className={`text-[9px] mt-0.5 ${phase.status === 'upcoming' ? 'text-gray-400' : 'text-white/70'}`}>{phase.date}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-b-xl p-2 space-y-1.5 min-h-[140px]">
                                            {phase.items.map(item => (
                                                <div key={item.id} className="bg-white rounded-lg p-2.5 border border-gray-100">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(item.status)}`} />
                                                        <p className="text-[11px] text-gray-700">{item.title}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Defects & Issues */}
                            <div className="mt-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-800">Defects & Issues</h3>
                                    <button className="text-xs text-blue-500 hover:text-blue-600">+ Report</button>
                                </div>
                                <div className="space-y-2">
                                    {RECTIFICATIONS.map(rect => (
                                        <div key={rect.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-700 font-medium">{rect.issue}</p>
                                                <p className="text-[10px] text-gray-400">{new Date(rect.raisedAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</p>
                                            </div>
                                            <span className={`text-[9px] px-2 py-1 rounded border font-medium ${rect.status === 'resolved' ? 'border-emerald-200 text-emerald-600' :
                                                rect.status === 'in-progress' ? 'border-blue-200 text-blue-600' :
                                                    'border-amber-200 text-amber-600'
                                                }`}>{rect.status === 'in-progress' ? 'In Progress' : rect.status === 'resolved' ? 'Rectified' : 'Pending'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/*  PAYMENTS  */}
                    {activeSection === 'payments' && (
                        <div className="p-8 max-w-3xl">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Payment Schedule</h2>
                                    <p className="text-xs text-gray-400 mt-0.5">Contract: {formatPrice(contractTotal)}</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                {PAYMENT_SCHEDULE.map(p => (
                                    <div key={p.id} className={`bg-white rounded-xl border p-4 flex items-center justify-between ${p.status === 'due' ? 'border-blue-200' : 'border-gray-100'
                                        }`}>
                                        <div>
                                            <p className={`text-sm font-medium ${p.status === 'paid' ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{p.label}</p>
                                            <p className="text-[10px] text-gray-400">{p.status === 'paid' ? `Paid ${p.paidAt}` : `Due: ${p.dueDate}`}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-sm font-semibold text-gray-800">{formatPrice(p.amount)}</p>
                                            {p.status === 'due' && (
                                                <button className="text-xs px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium">Pay Now</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary Bar */}
                            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase">Paid</p>
                                    <p className="text-sm font-bold text-emerald-600">{formatPrice(totalPaid)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 uppercase">Remaining</p>
                                    <p className="text-sm font-bold text-gray-800">{formatPrice(contractTotal - totalPaid)}</p>
                                </div>
                            </div>

                            {/* Variation Orders */}
                            <div className="mt-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-800">Variation Orders</h3>
                                    <p className="text-xs text-gray-400">{VARIATION_ORDERS.filter(v => v.status === 'pending').length} pending</p>
                                </div>
                                <div className="space-y-2">
                                    {VARIATION_ORDERS.map(vo => (
                                        <div key={vo.id} className="bg-white rounded-xl border border-gray-100 p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] text-gray-400">{vo.code}  {vo.source === 'client' ? 'Your request' : vo.source === 'designer' ? 'ID suggestion' : 'Site condition'}</p>
                                                    <p className="text-xs text-gray-800 font-medium mt-0.5">{vo.description}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-xs font-semibold text-gray-700">+{formatPrice(vo.amount)}</p>
                                                    {(voStatuses[vo.id] || vo.status) === 'approved' ? (
                                                        <span className="text-[9px] text-emerald-600 font-medium">Approved</span>
                                                    ) : (voStatuses[vo.id] || vo.status) === 'pending' ? (
                                                        <div className="flex gap-1">
                                                            <button onClick={() => setVoStatuses(p => ({ ...p, [vo.id]: 'rejected' }))} className="text-[9px] px-2 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50">Reject</button>
                                                            <button onClick={() => setVoStatuses(p => ({ ...p, [vo.id]: 'approved' }))} className="text-[9px] px-2 py-1 bg-gray-900 text-white rounded hover:bg-gray-800">Approve</button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[9px] text-red-500 font-medium">Rejected</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {totalApprovedVO > 0 && (
                                    <div className="mt-3 text-right text-xs text-gray-500">
                                        Approved VOs total: <span className="font-semibold text-gray-800">+{formatPrice(totalApprovedVO)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/*  SITE PHOTOS  */}
                    {activeSection === 'photos' && (
                        <div className="p-8 px-10 anim-fade">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Live Site Photos</h2>
                                    <p className="text-xs text-gray-400 mt-0.5">Progress photos uploaded by your project team</p>
                                </div>
                                <p className="text-xs text-blue-500">Updated 2h ago</p>
                            </div>

                            <div className="grid grid-cols-4 gap-3">
                                {SITE_PHOTOS.map(photo => (
                                    <div key={photo.id} className="rounded-xl overflow-hidden border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
                                        <div className={`h-36 flex items-end p-3 relative ${photo.status === 'rectification' ? 'bg-gradient-to-t from-amber-900/60 to-amber-100' :
                                            photo.status === 'completed' ? 'bg-gradient-to-t from-gray-900/60 to-gray-200' :
                                                'bg-gradient-to-t from-gray-900/60 to-gray-100'
                                            }`}>
                                            {photo.status === 'rectification' && (
                                                <span className="absolute top-2 left-2 text-[8px] px-1.5 py-0.5 bg-amber-500 text-white rounded font-medium">Issue</span>
                                            )}
                                            <div>
                                                <p className="text-xs font-medium text-white">{photo.caption}</p>
                                                <p className="text-[9px] text-white/60">{photo.uploadedBy}  {new Date(photo.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-4 py-3 border border-gray-200 rounded-xl text-xs text-gray-500 hover:bg-gray-50 transition-colors">View all photos</button>
                        </div>
                    )}

                    {/*  DRAWINGS & DOCUMENTS  */}
                    {activeSection === 'documents' && (
                        <div className="p-8 max-w-3xl">
                            <h2 className="text-lg font-bold text-gray-900 mb-1">Drawings & Documents</h2>
                            <p className="text-xs text-gray-400 mb-6">All project drawings and documentation. Click to view.</p>

                            <div className="space-y-1">
                                {DRAWINGS.map((doc, i) => (
                                    <div key={i} className="bg-white rounded-lg border border-gray-50 p-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                                        <div>
                                            <p className="text-xs font-medium text-gray-700">{doc.name}</p>
                                            <p className="text-[10px] text-gray-400">{doc.revision}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[10px] font-medium ${doc.status === 'Approved' ? 'text-emerald-600' : doc.status === 'N/A' ? 'text-gray-400' : 'text-amber-500'
                                                }`}>{doc.status}</span>
                                            <span className="text-[10px] text-blue-500">View</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Links */}
                            <div className="grid grid-cols-3 gap-3 mt-6">
                                {['Quotation', 'Contract', 'Specifications'].map(label => (
                                    <button key={label} className="bg-white rounded-xl border border-gray-100 p-4 text-left hover:bg-gray-50 transition-colors">
                                        <p className="text-xs font-semibold text-gray-700">{label}</p>
                                        <p className="text-[10px] text-blue-500 mt-1">View</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/*  ARRANGEMENTS  */}
                    {activeSection === 'arrangements' && (
                        <div className="p-8 max-w-3xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900">Your Arrangements</h2>
                                <p className="text-xs text-gray-400">{ARRANGEMENTS.filter(a => a.status === 'booked').length}/{ARRANGEMENTS.length} booked</p>
                            </div>

                            <div className="space-y-1">
                                {ARRANGEMENTS.map(arr => (
                                    <div key={arr.id} className="bg-white rounded-lg border border-gray-50 p-4 flex items-center justify-between">
                                        <div>
                                            <p className={`text-xs font-medium ${arr.status === 'booked' ? 'text-gray-800' : 'text-blue-600'}`}>{arr.service}</p>
                                            {arr.vendor && <p className="text-[10px] text-gray-400">{arr.vendor}</p>}
                                        </div>
                                        <div className="text-right">
                                            {arr.status === 'booked' ? (
                                                <>
                                                    <p className="text-xs font-medium text-gray-700">{arr.date}</p>
                                                    <p className="text-[10px] text-gray-400">{arr.time}</p>
                                                </>
                                            ) : (
                                                <span className="text-[10px] text-gray-400 italic">Set up</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/*  PHOTOSHOOT  */}
                    {activeSection === 'photoshoot' && (
                        <div className="p-8 max-w-3xl">
                            <h2 className="text-lg font-bold text-gray-900 mb-1">Photoshoot</h2>
                            <p className="text-xs text-gray-400 mb-6">Professional photography after handover for your designer&apos;s portfolio and your memories</p>

                            <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">Professional Home Photoshoot</p>
                                        <p className="text-xs text-gray-400">Scheduled after handover & styling</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                        <p className="text-xs text-gray-600">Status</p>
                                        <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium">Pending Handover</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                        <p className="text-xs text-gray-600">Estimated Date</p>
                                        <p className="text-xs text-gray-800 font-medium">Mar 1  Mar 5</p>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                        <p className="text-xs text-gray-600">Deliverables</p>
                                        <p className="text-xs text-gray-800 font-medium">20 edited photos + 1 video tour</p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <p className="text-xs text-gray-600">Usage</p>
                                        <p className="text-xs text-gray-800 font-medium">Portfolio + Your personal collection</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
                                <p className="text-xs text-blue-700">
                                    <span className="font-semibold">Note:</span> Your designer will coordinate the photoshoot schedule after deep cleaning. You&apos;ll receive the edited photos within 5 working days. These will also be featured in your designer&apos;s portfolio (with your permission).
                                </p>
                            </div>
                        </div>
                    )}

                    {/*  MESSAGES  */}
                    {activeSection === 'messages' && (
                        <div className="flex flex-col h-screen anim-fade">
                            <div className="border-b border-gray-100 px-8 py-4">
                                <h2 className="text-lg font-bold text-gray-900">Messages</h2>
                                <p className="text-xs text-gray-400">Chat with your design team, vendors, and project manager</p>
                            </div>
                            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
                                {CHAT_MESSAGES.map((msg, i) => (
                                    <div key={msg.id} className={`flex ${msg.role === 'client' ? 'justify-end' : 'justify-start'} anim-fade-up anim-delay-${Math.min(i + 1, 5)}`}>
                                        <div className={`max-w-[70%] ${msg.role === 'client' ? 'order-2' : ''}`}>
                                            {msg.role !== 'client' && (
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${msg.role === 'designer' ? 'bg-purple-500' :
                                                        msg.role === 'vendor' ? 'bg-amber-500' :
                                                            'bg-blue-500'
                                                        }`}>{msg.from[0]}</div>
                                                    <p className="text-[10px] font-medium text-gray-500">{msg.from}</p>
                                                </div>
                                            )}
                                            <div className={`rounded-2xl px-4 py-3 ${msg.role === 'client'
                                                ? 'bg-gray-900 text-white rounded-br-md'
                                                : 'bg-gray-100 text-gray-700 rounded-bl-md'
                                                }`}>
                                                <p className="text-xs leading-relaxed">{msg.text}</p>
                                            </div>
                                            <p className={`text-[9px] text-gray-300 mt-1 ${msg.role === 'client' ? 'text-right' : ''}`}>{msg.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 px-8 py-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-xs border border-gray-100 focus:outline-none focus:border-gray-300 transition-colors"
                                    />
                                    <button className="px-5 py-3 bg-gray-900 text-white rounded-xl text-xs font-medium hover:bg-gray-800 transition-colors">
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/*  MY PURCHASES / APPLIANCE TRACKER  */}
                    {activeSection === 'appliances' && (
                        <div className="p-8 max-w-4xl anim-fade">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">My Purchases</h2>
                                    <p className="text-xs text-gray-400 mt-0.5">Track all your appliances, furniture, fixtures &amp; equipment</p>
                                </div>
                                <button className="text-xs px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium">+ Add Item</button>
                            </div>
                            <p className="text-[10px] text-blue-500 mb-6">💡 Your designer can see this list for FF&amp;E layout planning &amp; equipment cutsheet coordination</p>

                            {/* Summary cards */}
                            <div className="grid grid-cols-4 gap-3 mb-6">
                                {[
                                    { label: 'Total Spent', value: formatPrice(MY_APPLIANCES.filter(a => a.status === 'purchased').reduce((s, a) => s + a.price, 0)), color: 'text-gray-900' },
                                    { label: 'On Order', value: formatPrice(MY_APPLIANCES.filter(a => a.status === 'ordered').reduce((s, a) => s + a.price, 0)), color: 'text-blue-600' },
                                    { label: 'Wishlist', value: formatPrice(MY_APPLIANCES.filter(a => a.status === 'wishlist').reduce((s, a) => s + a.price, 0)), color: 'text-gray-400' },
                                    { label: 'Total Items', value: String(MY_APPLIANCES.length), color: 'text-gray-900' },
                                ].map(card => (
                                    <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-4">
                                        <p className="text-[10px] text-gray-400 uppercase mb-1">{card.label}</p>
                                        <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Category tabs */}
                            {(['all', 'appliance', 'fixture', 'furniture', 'lighting', 'smart-home'] as const).map(cat => {
                                const count = cat === 'all' ? MY_APPLIANCES.length : MY_APPLIANCES.filter(a => a.category === cat).length;
                                return null; // Using inline filter below instead
                            })}

                            {/* Items list */}
                            <div className="space-y-2">
                                {(['appliance', 'fixture', 'furniture', 'lighting', 'smart-home'] as const).map(cat => {
                                    const items = MY_APPLIANCES.filter(a => a.category === cat);
                                    if (items.length === 0) return null;
                                    const catLabels: Record<string, string> = { 'appliance': '🔌 Appliances', 'fixture': '🚿 Fixtures', 'furniture': '🛋️ Furniture', 'lighting': '💡 Lighting', 'smart-home': '📱 Smart Home' };
                                    return (
                                        <div key={cat} className="mb-4">
                                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">{catLabels[cat]}</h3>
                                            {items.map(item => (
                                                <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 mb-1.5 hover:border-gray-200 transition-colors">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                                                                <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${item.status === 'purchased' ? 'bg-emerald-50 text-emerald-600' : item.status === 'ordered' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>{item.status}</span>
                                                            </div>
                                                            <p className="text-[11px] text-gray-500 mt-0.5">{item.brand} {item.model}</p>
                                                            <div className="flex items-center gap-4 mt-2">
                                                                <span className="text-[10px] text-gray-400">📍 {item.location}</span>
                                                                <span className="text-[10px] text-gray-400">🛒 {item.boughtFrom}</span>
                                                                {item.deliveryDate && <span className="text-[10px] text-amber-600 font-medium">📦 Delivery: {item.deliveryDate}</span>}
                                                                {item.dimensions && <span className="text-[10px] text-gray-400">📐 {item.dimensions}</span>}
                                                                {item.warrantyYears && <span className="text-[10px] text-gray-400">🛡️ {item.warrantyYears}yr warranty</span>}
                                                                {item.productUrl && <a href={item.productUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:text-blue-600 hover:underline" onClick={e => e.stopPropagation()}>🔗 View product</a>}
                                                            </div>
                                                            {item.notes && <p className="text-[10px] text-blue-500 mt-1">{item.notes}</p>}
                                                        </div>
                                                        <div className="text-right shrink-0 ml-4">
                                                            <p className="text-sm font-bold text-gray-900">{formatPrice(item.price)}</p>
                                                            {item.purchaseDate && <p className="text-[9px] text-gray-300 mt-0.5">{item.purchaseDate}</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Total bar */}
                            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between mt-4">
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase">Total Purchases (All)</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{MY_APPLIANCES.length} items across {new Set(MY_APPLIANCES.map(a => a.boughtFrom)).size} stores</p>
                                </div>
                                <p className="text-lg font-bold text-gray-900">{formatPrice(MY_APPLIANCES.reduce((s, a) => s + a.price, 0))}</p>
                            </div>

                            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 mt-4">
                                <p className="text-xs text-blue-700">
                                    <span className="font-semibold">For your designer:</span> This list auto-syncs to your FF&amp;E schedule. Your designer can see dimensions for equipment layout planning and cutsheet coordination. Items marked &quot;ordered&quot; will be flagged for delivery scheduling.
                                </p>
                            </div>

                            {/* Upcoming Deliveries Timeline */}
                            {MY_APPLIANCES.filter(a => a.deliveryDate && a.status === 'ordered').length > 0 && (
                                <div className="bg-white rounded-xl border border-gray-100 p-5 mt-4">
                                    <h3 className="text-sm font-semibold text-gray-800 mb-3">📦 Upcoming Deliveries</h3>
                                    <p className="text-[10px] text-gray-400 mb-3">Your ID and vendors can see this schedule for site coordination</p>
                                    <div className="space-y-2">
                                        {MY_APPLIANCES
                                            .filter(a => a.deliveryDate && a.status === 'ordered')
                                            .sort((a, b) => (a.deliveryDate || '').localeCompare(b.deliveryDate || ''))
                                            .map(item => (
                                                <div key={item.id} className="flex items-center justify-between bg-amber-50 rounded-lg p-3 border border-amber-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-center shrink-0 bg-white rounded-lg px-2 py-1 border border-amber-200">
                                                            <p className="text-[9px] text-amber-600 font-medium">{item.deliveryDate ? new Date(item.deliveryDate).toLocaleDateString('en-GB', { month: 'short' }) : ''}</p>
                                                            <p className="text-sm font-bold text-amber-700">{item.deliveryDate ? new Date(item.deliveryDate).getDate() : ''}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-800">{item.name}</p>
                                                            <p className="text-[10px] text-gray-500">{item.brand} {item.model} • {item.location}</p>
                                                            <p className="text-[10px] text-gray-400">from {item.boughtFrom}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-bold text-gray-800">{formatPrice(item.price)}</p>
                                                        {item.productUrl && <a href={item.productUrl} target="_blank" rel="noopener noreferrer" className="text-[9px] text-blue-500 hover:underline">Track order →</a>}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Budget Breakdown by Category */}
                            <div className="bg-white rounded-xl border border-gray-100 p-5 mt-4">
                                <h3 className="text-sm font-semibold text-gray-800 mb-1">📊 Budget Breakdown</h3>
                                <p className="text-[10px] text-gray-400 mb-4">Your appliance + furniture spend vs renovation contract</p>
                                <div className="space-y-3">
                                    {(['appliance', 'fixture', 'furniture', 'lighting', 'smart-home'] as const).map(cat => {
                                        const items = MY_APPLIANCES.filter(a => a.category === cat);
                                        if (items.length === 0) return null;
                                        const total = items.reduce((s, a) => s + a.price, 0);
                                        const grandTotal = MY_APPLIANCES.reduce((s, a) => s + a.price, 0);
                                        const pct = Math.round((total / grandTotal) * 100);
                                        const catLabels: Record<string, string> = { 'appliance': 'Appliances', 'fixture': 'Fixtures', 'furniture': 'Furniture', 'lighting': 'Lighting', 'smart-home': 'Smart Home' };
                                        const catColors: Record<string, string> = { 'appliance': 'bg-blue-500', 'fixture': 'bg-emerald-500', 'furniture': 'bg-purple-500', 'lighting': 'bg-amber-500', 'smart-home': 'bg-indigo-500' };
                                        return (
                                            <div key={cat}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${catColors[cat]}`} />
                                                        <span className="text-[11px] text-gray-600">{catLabels[cat]}</span>
                                                        <span className="text-[9px] text-gray-300">{items.length} items</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[11px] font-semibold text-gray-800">{formatPrice(total)}</span>
                                                        <span className="text-[9px] text-gray-400">{pct}%</span>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                    <div className={`h-1.5 rounded-full ${catColors[cat]}`} style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-gray-400">Renovation Contract</p>
                                        <p className="text-sm font-bold text-gray-900">{formatPrice(contractTotal)}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-400">Your Purchases</p>
                                        <p className="text-sm font-bold text-blue-600">{formatPrice(MY_APPLIANCES.reduce((s, a) => s + a.price, 0))}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400">Total Project Cost</p>
                                        <p className="text-sm font-bold text-gray-900">{formatPrice(contractTotal + MY_APPLIANCES.reduce((s, a) => s + a.price, 0))}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
