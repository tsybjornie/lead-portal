'use client';

import { useState } from 'react';

// ============================================================
// TYPES
// ============================================================

interface Worker {
    id: string;
    name: string;
    trade: string;
    status: 'checked-in' | 'en-route' | 'off-duty' | 'no-response';
    currentSite: string;
    currentProject: string;
    checkinTime: string | null;
    kitStatus: 'ready' | 'missing' | 'unchecked';
    missingItems: string[];
    karmaScore: number;
    phone: string;
}

interface ActivePO {
    id: string;
    poNumber: string;
    project: string;
    client: string;
    address: string;
    trade: string;
    scope: string;
    value: number;
    status: 'active' | 'pending-start' | 'completed' | 'disputed';
    startDate: string;
    dueDate: string;
    progress: number;
    assignedWorkers: string[];
}

interface PaymentClaim {
    id: string;
    project: string;
    phase: string;
    amount: number;
    status: 'pending' | 'submitted' | 'approved' | 'paid' | 'rejected';
    submittedDate: string;
    expectedPayDate: string | null;
}

// ============================================================
// VENDOR IDENTITY & COMPLIANCE
// ============================================================
interface VendorIdentity {
    // Business Registration
    businessName: string;
    uen: string;              // Unique Entity Number (Singapore)
    ssmNumber?: string;       // SSM for Malaysia-based
    businessType: 'sole-prop' | 'partnership' | 'llp' | 'pte-ltd' | 'freelance';
    registeredAddress: string;
    dateOfRegistration: string;

    // Personal ID
    ownerName: string;
    idType: 'NRIC' | 'FIN' | 'Passport' | 'MyKad';
    idNumber: string;          // masked display: S****567A
    nationality: string;
    phone: string;
    email: string;

    // Trade Licenses
    licenses: {
        type: string;          // 'BCA Contractor License', 'HDB Registered', 'EMA Licensed', 'PUB Licensed'
        number: string;
        expiry: string;
        status: 'active' | 'expired' | 'pending';
    }[];

    // Insurance
    insurance: {
        type: string;          // 'Public Liability', 'Workman Compensation', 'CAR', 'Professional Indemnity'
        provider: string;
        policyNumber: string;
        coverage: number;
        expiry: string;
        status: 'active' | 'expired' | 'pending';
    }[];

    // Bank Details
    banking: {
        bankName: string;
        accountName: string;
        accountNumber: string; // masked: ****4567
        branchCode?: string;
        swiftCode?: string;
        payNowLinked: boolean;
    };

    // Worker Permits
    workerPermits: {
        name: string;
        finNumber: string;     // masked
        permitType: 'WP' | 'S-Pass' | 'EP' | 'PR' | 'Citizen' | 'MY-Pass';
        expiry: string;
        trade: string;
        status: 'valid' | 'expiring' | 'expired';
    }[];

    // Platform Metrics (auto-generated)
    platformJoinDate: string;
    totalJobsCompleted: number;
    totalEarnings: number;
    avgRating: number;
    disputeRate: number;       // percentage
    onTimeRate: number;        // percentage
}

interface PipelineItem {
    project: string;
    contractValue: number;
    startDate: string;
    endDate: string;
    status: 'confirmed' | 'in-progress' | 'pending-confirmation';
    progressPaid: number;     // % of contract value paid so far
}

// ============================================================
// DEMO DATA
// ============================================================

const WORKERS: Worker[] = [
    {
        id: 'w1', name: 'Kumar Saravanan', trade: 'Carpentry',
        status: 'checked-in', currentSite: 'Blk 412 #08-345 Punggol',
        currentProject: 'Lim Residence', checkinTime: '08:15',
        kitStatus: 'ready', missingItems: [], karmaScore: 88, phone: '+65 9123 4567',
    },
    {
        id: 'w2', name: 'Raju Krishnan', trade: 'Carpentry',
        status: 'checked-in', currentSite: 'Blk 88 #12-201 Sengkang',
        currentProject: 'Chen Condo', checkinTime: '08:32',
        kitStatus: 'missing', missingItems: ['Dowel jig', 'Wood glue (PU)'], karmaScore: 72, phone: '+65 9234 5678',
    },
    {
        id: 'w3', name: 'Suren Raj', trade: 'Carpentry',
        status: 'en-route', currentSite: 'Blk 15 #04-112 Tampines',
        currentProject: 'Wong HDB', checkinTime: null,
        kitStatus: 'unchecked', missingItems: [], karmaScore: 65, phone: '+65 9345 6789',
    },
    {
        id: 'w4', name: 'Babu Mani', trade: 'Carpentry (Finishing)',
        status: 'off-duty', currentSite: '—',
        currentProject: '—', checkinTime: null,
        kitStatus: 'unchecked', missingItems: [], karmaScore: 91, phone: '+65 9456 7890',
    },
    {
        id: 'w5', name: 'Tan Wei', trade: 'Foreman',
        status: 'no-response', currentSite: 'Blk 412 #08-345 Punggol',
        currentProject: 'Lim Residence', checkinTime: null,
        kitStatus: 'unchecked', missingItems: [], karmaScore: 55, phone: '+65 9567 8901',
    },
];

const ACTIVE_POS: ActivePO[] = [
    {
        id: 'po1', poNumber: 'PO-2026-0034', project: 'Lim Residence',
        client: 'David Lim (via Vinterior)', address: 'Blk 412 #08-345 Punggol',
        trade: 'Carpentry', scope: 'Kitchen cabinets, wardrobe, shoe cabinet, TV console',
        value: 12800, status: 'active', startDate: '2026-02-24',
        dueDate: '2026-03-14', progress: 45, assignedWorkers: ['Kumar', 'Tan Wei'],
    },
    {
        id: 'po2', poNumber: 'PO-2026-0035', project: 'Chen Condo',
        client: 'Sarah Chen (via SG Interiors)', address: 'Blk 88 #12-201 Sengkang',
        trade: 'Carpentry', scope: 'Walk-in wardrobe, study table, platform bed',
        value: 8500, status: 'active', startDate: '2026-03-01',
        dueDate: '2026-03-21', progress: 20, assignedWorkers: ['Raju'],
    },
    {
        id: 'po3', poNumber: 'PO-2026-0036', project: 'Wong HDB',
        client: 'Jenny Wong (via Vinterior)', address: 'Blk 15 #04-112 Tampines',
        trade: 'Carpentry', scope: 'Full carpentry package — kitchen, 3 bedrooms',
        value: 18200, status: 'pending-start', startDate: '2026-03-10',
        dueDate: '2026-04-04', progress: 0, assignedWorkers: ['Suren'],
    },
];

const CLAIMS: PaymentClaim[] = [
    { id: 'c1', project: 'Lim Residence', phase: 'PC-001 (50% Site Work)', amount: 6400, status: 'approved', submittedDate: '2026-03-01', expectedPayDate: '2026-03-08' },
    { id: 'c2', project: 'Chen Condo', phase: 'PC-001 (30% Mobilization)', amount: 2550, status: 'submitted', submittedDate: '2026-03-04', expectedPayDate: null },
    { id: 'c3', project: 'Tan BTO (completed)', phase: 'PC-003 (Final 20%)', amount: 3200, status: 'paid', submittedDate: '2026-02-20', expectedPayDate: null },
    { id: 'c4', project: 'Ng Landed', phase: 'PC-002 (Materials)', amount: 4800, status: 'pending', submittedDate: '2026-03-05', expectedPayDate: null },
];

const VENDOR_IDENTITY: VendorIdentity = {
    businessName: 'WoodWork SG Pte Ltd',
    uen: '202312345K',
    businessType: 'pte-ltd',
    registeredAddress: '25 Mandai Estate #02-08, Innovation Place, S729930',
    dateOfRegistration: '2023-06-15',
    ownerName: 'Ahmad Bin Hassan',
    idType: 'NRIC',
    idNumber: 'S****456A',
    nationality: 'Singaporean',
    phone: '+65 9123 4567',
    email: 'ahmad@woodworksg.com',
    licenses: [
        { type: 'BCA Registered Contractor', number: 'BCA-CR-2023-04521', expiry: '2027-06-14', status: 'active' },
        { type: 'HDB Registered Renovator', number: 'HDB-RN-8834', expiry: '2026-12-31', status: 'active' },
        { type: 'bizSAFE Level 3', number: 'BS3-2024-1102', expiry: '2027-03-01', status: 'active' },
    ],
    insurance: [
        { type: 'Public Liability', provider: 'NTUC Income', policyNumber: 'PL-2024-88123', coverage: 500000, expiry: '2027-01-15', status: 'active' },
        { type: 'Workman Compensation', provider: 'AIG Singapore', policyNumber: 'WC-2024-56789', coverage: 200000, expiry: '2026-08-30', status: 'active' },
    ],
    banking: {
        bankName: 'DBS Bank',
        accountName: 'WoodWork SG Pte Ltd',
        accountNumber: '****4567',
        branchCode: '003',
        swiftCode: 'DBSSSGSG',
        payNowLinked: true,
    },
    workerPermits: [
        { name: 'Kumar Saravanan', finNumber: 'G****123N', permitType: 'WP', expiry: '2027-04-15', trade: 'Carpentry', status: 'valid' },
        { name: 'Raju Krishnan', finNumber: 'G****456M', permitType: 'WP', expiry: '2026-09-20', trade: 'Carpentry', status: 'valid' },
        { name: 'Suren Raj', finNumber: 'G****789K', permitType: 'S-Pass', expiry: '2026-06-10', trade: 'Carpentry', status: 'expiring' },
        { name: 'Babu Mani', finNumber: 'S****234B', permitType: 'PR', expiry: '—', trade: 'Carpentry (Finishing)', status: 'valid' },
        { name: 'Tan Wei', finNumber: 'S****567T', permitType: 'Citizen', expiry: '—', trade: 'Foreman', status: 'valid' },
    ],
    platformJoinDate: '2024-11-01',
    totalJobsCompleted: 47,
    totalEarnings: 284600,
    avgRating: 4.6,
    disputeRate: 2.1,
    onTimeRate: 91,
};

const PIPELINE: PipelineItem[] = [
    { project: 'Lim Residence (Punggol)', contractValue: 12800, startDate: '2026-02-24', endDate: '2026-03-14', status: 'in-progress', progressPaid: 50 },
    { project: 'Chen Condo (Sengkang)', contractValue: 8500, startDate: '2026-03-01', endDate: '2026-03-21', status: 'in-progress', progressPaid: 30 },
    { project: 'Wong HDB (Tampines)', contractValue: 18200, startDate: '2026-03-10', endDate: '2026-04-04', status: 'confirmed', progressPaid: 0 },
    { project: 'Tan BTO (Woodlands)', contractValue: 22000, startDate: '2026-04-07', endDate: '2026-05-02', status: 'pending-confirmation', progressPaid: 0 },
    { project: 'Ng Landed (Bukit Timah)', contractValue: 35000, startDate: '2026-04-14', endDate: '2026-06-01', status: 'pending-confirmation', progressPaid: 0 },
];

// ============================================================
// COMPONENT
// ============================================================

type Tab = 'workers' | 'jobs' | 'claims' | 'kit' | 'profile';

export default function VendorDashboardPage() {
    const [activeTab, setActiveTab] = useState<Tab>('workers');
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    const totalActive = ACTIVE_POS.filter(p => p.status === 'active').length;
    const totalValue = ACTIVE_POS.reduce((s, p) => s + p.value, 0);
    const pendingClaims = CLAIMS.filter(c => c.status === 'submitted' || c.status === 'pending').reduce((s, c) => s + c.amount, 0);
    const approvedClaims = CLAIMS.filter(c => c.status === 'approved').reduce((s, c) => s + c.amount, 0);
    const workersOnSite = WORKERS.filter(w => w.status === 'checked-in').length;
    const kitIssues = WORKERS.filter(w => w.kitStatus === 'missing').length;
    const pipelineTotal = PIPELINE.reduce((s, p) => s + p.contractValue, 0);
    const pipelineRemaining = PIPELINE.reduce((s, p) => s + p.contractValue * (1 - p.progressPaid / 100), 0);

    const statusColor = (s: string) => {
        const map: Record<string, string> = {
            'checked-in': '#10B981', 'en-route': '#F59E0B', 'off-duty': '#9B9A97', 'no-response': '#EF4444',
            'ready': '#10B981', 'missing': '#EF4444', 'unchecked': '#9B9A97',
            'active': '#3B82F6', 'pending-start': '#F59E0B', 'completed': '#10B981', 'disputed': '#EF4444',
            'pending': '#F59E0B', 'submitted': '#3B82F6', 'approved': '#10B981', 'paid': '#6366F1', 'rejected': '#EF4444',
            'valid': '#10B981', 'expiring': '#F59E0B', 'expired': '#EF4444',
            'confirmed': '#10B981', 'in-progress': '#3B82F6', 'pending-confirmation': '#F59E0B',
        };
        return map[s] || '#9B9A97';
    };

    const tabs: { key: Tab; label: string; count?: number }[] = [
        { key: 'workers', label: 'Workers', count: WORKERS.length },
        { key: 'jobs', label: 'Active Jobs', count: totalActive },
        { key: 'claims', label: 'Payment Claims', count: CLAIMS.length },
        { key: 'kit', label: 'Kit Readiness', count: kitIssues || undefined },
        { key: 'profile', label: 'Profile & Compliance' },
    ];

    return (
        <div style={{ fontFamily: f, minHeight: '100vh', background: '#FAFAF9' }}>
            {/* Header */}
            <div style={{
                padding: '24px 32px', borderBottom: '1px solid #E9E9E7',
                background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                        Vendor Portal
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#37352F', letterSpacing: '-0.02em' }}>
                        WoodWork SG
                    </h1>
                    <p style={{ fontSize: 12, color: '#9B9A97', margin: '2px 0 0' }}>Ahmad Bin Hassan — Contractor Boss</p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{
                        padding: '6px 12px', borderRadius: 6, background: '#F7F6F3',
                        fontSize: 11, fontWeight: 600, color: '#37352F',
                    }}>
                        Karma: <span style={{ color: '#10B981' }}>82</span>/100
                    </div>
                    <button style={{
                        padding: '8px 16px', borderRadius: 8, border: '1px solid #E9E9E7',
                        background: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        color: '#37352F', fontFamily: f,
                    }}>
                        + New Claim
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: '#E9E9E7', margin: '0' }}>
                {[
                    { label: 'Workers on Site', value: `${workersOnSite}/${WORKERS.length}`, color: '#10B981' },
                    { label: 'Active POs', value: totalActive.toString(), color: '#3B82F6' },
                    { label: 'Total Contract Value', value: `$${totalValue.toLocaleString()}`, color: '#37352F' },
                    { label: 'Pending Claims', value: `$${pendingClaims.toLocaleString()}`, color: '#F59E0B' },
                    { label: 'Approved (Incoming)', value: `$${approvedClaims.toLocaleString()}`, color: '#10B981' },
                ].map((s, i) => (
                    <div key={i} style={{ background: 'white', padding: '16px 20px' }}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                            {s.label}
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: '-0.02em' }}>
                            {s.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E9E9E7', background: 'white', padding: '0 32px' }}>
                {tabs.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        style={{
                            padding: '12px 20px', border: 'none', background: 'none',
                            fontSize: 13, fontWeight: activeTab === t.key ? 700 : 500,
                            color: activeTab === t.key ? '#37352F' : '#9B9A97',
                            borderBottom: activeTab === t.key ? '2px solid #37352F' : '2px solid transparent',
                            cursor: 'pointer', fontFamily: f,
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}
                    >
                        {t.label}
                        {t.count !== undefined && (
                            <span style={{
                                fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10,
                                background: t.key === 'kit' && t.count > 0 ? '#FEF2F2' : '#F7F6F3',
                                color: t.key === 'kit' && t.count > 0 ? '#EF4444' : '#9B9A97',
                            }}>{t.count}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div style={{ padding: '24px 32px' }}>
                {/* COCKPIT TAB */}
                {activeTab === 'workers' && (
                    <div>
                        {/* Alert Banner */}
                        {WORKERS.some(w => w.status === 'no-response') && (
                            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontSize: 18 }}>🚨</span>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#DC2626' }}>Worker No-Response Alert</div>
                                        <div style={{ fontSize: 11, color: '#7F1D1D' }}>{WORKERS.filter(w => w.status === 'no-response').map(w => w.name).join(', ')} — not responding since deployment</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <button style={{ padding: '6px 12px', fontSize: 11, fontWeight: 600, background: '#DC2626', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: f }}>📞 Call Now</button>
                                    <button style={{ padding: '6px 12px', fontSize: 11, fontWeight: 600, background: 'white', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 6, cursor: 'pointer', fontFamily: f }}>Send Backup</button>
                                </div>
                            </div>
                        )}
                        {WORKERS.some(w => w.kitStatus === 'missing') && (
                            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '12px 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontSize: 18 }}>⚠️</span>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>Kit Incomplete</div>
                                        <div style={{ fontSize: 11, color: '#78350F' }}>{WORKERS.filter(w => w.kitStatus === 'missing').map(w => `${w.name}: ${w.missingItems.join(', ')}`).join(' | ')}</div>
                                    </div>
                                </div>
                                <button style={{ padding: '6px 12px', fontSize: 11, fontWeight: 600, background: '#F59E0B', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: f }}>Resolve Kit</button>
                            </div>
                        )}

                        {/* Top Row: Worker Cards + Utilization Donut */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, marginBottom: 16 }}>
                            {/* Worker Status Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                                {WORKERS.map(w => (
                                    <div key={w.id} style={{
                                        background: 'white', borderRadius: 10, border: '1px solid #E9E9E7',
                                        padding: '16px', cursor: 'pointer', transition: 'box-shadow 0.2s',
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 700, color: '#37352F' }}>{w.name.split(' ')[0]}</div>
                                                <div style={{ fontSize: 10, color: '#9B9A97' }}>{w.trade}</div>
                                            </div>
                                            <div style={{ position: 'relative', width: 10, height: 10 }}>
                                                <div style={{
                                                    width: 8, height: 8, borderRadius: '50%', background: w.status === 'no-response' ? '#EF4444' : '#37352F',
                                                    opacity: w.status === 'off-duty' ? 0.3 : 1,
                                                }} />
                                            </div>
                                        </div>
                                        <div style={{ fontSize: 10, fontWeight: 600, color: w.status === 'no-response' ? '#EF4444' : '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                                            {w.status.replace('-', ' ')}
                                        </div>
                                        {w.currentProject !== '—' && (
                                            <div style={{ fontSize: 11, color: '#6B6A67', marginBottom: 4 }}>📍 {w.currentProject}</div>
                                        )}
                                        {w.checkinTime && (
                                            <div style={{ fontSize: 10, color: '#9B9A97', fontFamily: "'SF Mono', monospace" }}>⏰ {w.checkinTime}</div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid #F5F5F4' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: '#F7F6F3', color: w.kitStatus === 'missing' ? '#37352F' : '#9B9A97' }}>
                                                    {w.kitStatus === 'missing' ? '⚠ Kit' : w.kitStatus === 'ready' ? '✓ Kit' : '? Kit'}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: 12, fontWeight: 800, color: '#37352F' }}>
                                                {w.karmaScore}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Utilization Donut */}
                            <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 20 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#37352F', marginBottom: 16 }}>Workforce Utilization</div>
                                <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 16px' }}>
                                    <svg width="120" height="120" viewBox="0 0 120 120">
                                        <circle cx="60" cy="60" r="50" fill="none" stroke="#F0EFEB" strokeWidth="12" />
                                        <circle cx="60" cy="60" r="50" fill="none" stroke="#37352F" strokeWidth="12"
                                            strokeDasharray={`${(workersOnSite / WORKERS.length) * 314} 314`}
                                            strokeLinecap="round" transform="rotate(-90 60 60)" />
                                    </svg>
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                        <div style={{ fontSize: 24, fontWeight: 800, color: '#37352F' }}>{Math.round(workersOnSite / WORKERS.length * 100)}%</div>
                                        <div style={{ fontSize: 9, color: '#9B9A97' }}>ON SITE</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {[
                                        { label: 'Checked in', count: WORKERS.filter(w => w.status === 'checked-in').length, color: '#10B981' },
                                        { label: 'En route', count: WORKERS.filter(w => w.status === 'en-route').length, color: '#F59E0B' },
                                        { label: 'Off duty', count: WORKERS.filter(w => w.status === 'off-duty').length, color: '#9B9A97' },
                                        { label: 'No response', count: WORKERS.filter(w => w.status === 'no-response').length, color: '#EF4444' },
                                    ].map(s => (
                                        <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                                                <span style={{ fontSize: 11, color: '#6B6A67' }}>{s.label}</span>
                                            </div>
                                            <span style={{ fontSize: 12, fontWeight: 700, color: '#37352F' }}>{s.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Row: Revenue Chart + Schedule */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            {/* Revenue Bar Chart */}
                            <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <div>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: '#37352F' }}>Monthly Revenue</div>
                                        <div style={{ fontSize: 10, color: '#9B9A97' }}>Last 6 months (claims paid)</div>
                                    </div>
                                    <div style={{ fontSize: 18, fontWeight: 800, color: '#37352F' }}>$284.6k</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
                                    {[
                                        { month: 'Oct', value: 32000, max: 62000 },
                                        { month: 'Nov', value: 48000, max: 62000 },
                                        { month: 'Dec', value: 28000, max: 62000 },
                                        { month: 'Jan', value: 55000, max: 62000 },
                                        { month: 'Feb', value: 62000, max: 62000 },
                                        { month: 'Mar', value: 39500, max: 62000 },
                                    ].map(bar => (
                                        <div key={bar.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                            <div style={{ fontSize: 9, fontWeight: 700, color: '#37352F' }}>${(bar.value / 1000).toFixed(0)}k</div>
                                            <div style={{
                                                width: '100%', borderRadius: '4px 4px 0 0',
                                                height: `${(bar.value / bar.max) * 100}px`,
                                                background: bar.month === 'Mar' ? '#37352F' : '#E9E9E7',
                                                transition: 'height 0.5s ease',
                                            }} />
                                            <div style={{ fontSize: 9, color: '#9B9A97', fontWeight: 600 }}>{bar.month}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Today's Schedule / Job Timeline */}
                            <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 20 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#37352F', marginBottom: 16 }}>Today&apos;s Operations</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                    {[
                                        { time: '07:30', event: 'Tool check-in deadline', status: 'done', color: '#10B981' },
                                        { time: '08:00', event: 'Kumar & Raju check in at Punggol', status: 'done', color: '#10B981' },
                                        { time: '08:30', event: 'Suren en route to Tampines', status: 'live', color: '#F59E0B' },
                                        { time: '09:00', event: 'Supplier delivery — Blum hinges', status: 'upcoming', color: '#9B9A97' },
                                        { time: '12:00', event: 'Site photo upload due', status: 'upcoming', color: '#9B9A97' },
                                        { time: '14:00', event: 'QC inspection — Lim kitchen cabinets', status: 'upcoming', color: '#3B82F6' },
                                        { time: '17:00', event: 'Daily progress report submission', status: 'upcoming', color: '#9B9A97' },
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', gap: 12, position: 'relative' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 12 }}>
                                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, border: item.status === 'live' ? '2px solid #FDE68A' : 'none', flexShrink: 0 }} />
                                                {i < 6 && <div style={{ width: 2, flex: 1, background: '#F0EFEB', minHeight: 20 }} />}
                                            </div>
                                            <div style={{ paddingBottom: 12 }}>
                                                <div style={{ fontSize: 10, fontFamily: "'SF Mono', monospace", color: '#9B9A97', marginBottom: 2 }}>{item.time}</div>
                                                <div style={{ fontSize: 12, fontWeight: item.status === 'live' ? 700 : 500, color: item.status === 'done' ? '#9B9A97' : '#37352F', textDecoration: item.status === 'done' ? 'line-through' : 'none' }}>
                                                    {item.event}
                                                    {item.status === 'live' && <span style={{ fontSize: 9, fontWeight: 700, color: '#F59E0B', marginLeft: 6, padding: '1px 6px', background: '#FFFBEB', borderRadius: 4 }}>LIVE</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Cost Tracker Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                            {/* Monthly Overhead Breakdown */}
                            <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', overflow: 'hidden' }}>
                                <div style={{ padding: '16px 20px', borderBottom: '1px solid #E9E9E7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: '#37352F' }}>Monthly Overhead</div>
                                        <div style={{ fontSize: 10, color: '#9B9A97' }}>Fixed costs before project revenue</div>
                                    </div>
                                    <div style={{ fontSize: 18, fontWeight: 800, color: '#37352F' }}>$8,340</div>
                                </div>
                                <div style={{ padding: '0' }}>
                                    {[
                                        {
                                            category: 'MOM Foreign Worker Levy', items: [
                                                { label: 'Kumar (WP Tier 1)', amount: 300, note: 'Basic tier' },
                                                { label: 'Raju (WP Tier 1)', amount: 300, note: 'Basic tier' },
                                                { label: 'Suren (S-Pass)', amount: 650, note: 'Min $650/mth' },
                                            ], subtotal: 1250, icon: '🏛️'
                                        },
                                        {
                                            category: 'Worker Salaries', items: [
                                                { label: 'Kumar — Carpentry', amount: 1800, note: 'WP' },
                                                { label: 'Raju — Carpentry', amount: 1800, note: 'WP' },
                                                { label: 'Suren — Carpentry', amount: 2400, note: 'S-Pass' },
                                                { label: 'Babu — Finishing', amount: 2200, note: 'PR' },
                                                { label: 'Tan Wei — Foreman', amount: 3500, note: 'Local' },
                                            ], subtotal: 11700, icon: '👷'
                                        },
                                        {
                                            category: 'Workbench & Workshop', items: [
                                                { label: 'Workshop rental (Mandai)', amount: 2800, note: '800 sqft' },
                                                { label: 'Power & utilities', amount: 280, note: 'Avg/mth' },
                                                { label: 'Tool maintenance', amount: 200, note: 'Est' },
                                            ], subtotal: 3280, icon: '🔧'
                                        },
                                        {
                                            category: 'Insurance & Compliance', items: [
                                                { label: 'Public Liability (NTUC)', amount: 420, note: '/mth' },
                                                { label: 'Workman Comp (AIG)', amount: 180, note: '/mth' },
                                                { label: 'bizSAFE renewal', amount: 50, note: 'Amortized' },
                                            ], subtotal: 650, icon: '🛡️'
                                        },
                                    ].map((group, gi) => (
                                        <div key={gi} style={{ borderBottom: gi < 3 ? '1px solid #F0EFEB' : 'none' }}>
                                            <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFAF9' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <span style={{ fontSize: 14 }}>{group.icon}</span>
                                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#37352F', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{group.category}</span>
                                                </div>
                                                <span style={{ fontSize: 13, fontWeight: 800, color: '#37352F' }}>${group.subtotal.toLocaleString()}</span>
                                            </div>
                                            {group.items.map((item, ii) => (
                                                <div key={ii} style={{ padding: '8px 20px 8px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <span style={{ fontSize: 12, color: '#6B6A67' }}>{item.label}</span>
                                                        <span style={{ fontSize: 9, color: '#9B9A97', padding: '1px 5px', background: '#F7F6F3', borderRadius: 3 }}>{item.note}</span>
                                                    </div>
                                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#37352F', fontFamily: "'SF Mono', monospace" }}>${item.amount.toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ padding: '12px 20px', background: '#F7F6F3', borderTop: '1px solid #E9E9E7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: 11, fontWeight: 600, color: '#6B6A67' }}>Break-even: need $16,880/mth in revenue</div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: '#37352F' }}>Total: $16,880</div>
                                </div>
                            </div>

                            {/* Cost Trend + MOM Compliance */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {/* Cost Increase Trend */}
                                <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                        <div>
                                            <div style={{ fontSize: 12, fontWeight: 700, color: '#37352F' }}>Cost Trend</div>
                                            <div style={{ fontSize: 10, color: '#9B9A97' }}>Total monthly overhead — 6 month view</div>
                                        </div>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: '#37352F' }}>↑ 12.3%</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
                                        {[
                                            { month: 'Oct', value: 15200 },
                                            { month: 'Nov', value: 15600 },
                                            { month: 'Dec', value: 15400 },
                                            { month: 'Jan', value: 16200 },
                                            { month: 'Feb', value: 16500 },
                                            { month: 'Mar', value: 16880 },
                                        ].map(bar => (
                                            <div key={bar.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                                                <div style={{ fontSize: 8, fontWeight: 700, color: '#9B9A97' }}>${(bar.value / 1000).toFixed(1)}k</div>
                                                <div style={{
                                                    width: '100%', borderRadius: '3px 3px 0 0',
                                                    height: `${((bar.value - 14000) / 3000) * 80}px`,
                                                    background: bar.month === 'Mar' ? '#37352F' : '#E9E9E7',
                                                    transition: 'height 0.5s ease',
                                                }} />
                                                <div style={{ fontSize: 8, color: '#9B9A97', fontWeight: 600 }}>{bar.month}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: 12, padding: '8px 12px', background: '#FFFBEB', borderRadius: 6, display: 'flex', gap: 6, alignItems: 'center' }}>
                                        <span style={{ fontSize: 12 }}>💡</span>
                                        <span style={{ fontSize: 10, color: '#92400E' }}>S-Pass min salary rising to $3,150 from Sep 2026 — budget $750 more/mth</span>
                                    </div>
                                </div>

                                {/* MOM Compliance Panel */}
                                <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 20 }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#37352F', marginBottom: 12 }}>MOM & Compliance Deadlines</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {[
                                            { item: 'Foreign Worker Levy — Mar 2026', due: '14 Mar', status: 'due-soon', amount: '$1,250', color: '#F59E0B' },
                                            { item: 'Suren S-Pass renewal', due: '10 Jun', status: 'upcoming', amount: '$150', color: '#3B82F6' },
                                            { item: 'CPF contribution — all local', due: '14 Mar', status: 'due-soon', amount: '$680', color: '#F59E0B' },
                                            { item: 'SHN/MYE quota check', due: '30 Jun', status: 'ok', amount: '—', color: '#10B981' },
                                            { item: 'bizSAFE Level 3 audit', due: '01 Mar 2027', status: 'ok', amount: '—', color: '#10B981' },
                                            { item: 'Annual levy rate review', due: '01 Jul', status: 'upcoming', amount: 'Est +$50/WP', color: '#3B82F6' },
                                        ].map((d, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 6, background: d.status === 'due-soon' ? '#FFFBEB' : '#FAFAF9' }}>
                                                <div>
                                                    <div style={{ fontSize: 12, fontWeight: 600, color: '#37352F' }}>{d.item}</div>
                                                    <div style={{ fontSize: 10, color: '#9B9A97' }}>Due: {d.due}</div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "'SF Mono', monospace", color: '#37352F' }}>{d.amount}</span>
                                                    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: `${d.color}15`, color: d.color, textTransform: 'uppercase' }}>
                                                        {d.status.replace('-', ' ')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* JOBS TAB */}
                {activeTab === 'jobs' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px', color: '#37352F' }}>Active Purchase Orders</h2>
                        {ACTIVE_POS.map(po => (
                            <div key={po.id} style={{
                                background: 'white', borderRadius: 10, border: '1px solid #E9E9E7',
                                padding: '20px 24px',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: '#9B9A97', fontFamily: "'SF Mono', monospace" }}>{po.poNumber}</span>
                                            <span style={{
                                                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                                                background: `${statusColor(po.status)}15`, color: statusColor(po.status),
                                                textTransform: 'uppercase',
                                            }}>{po.status.replace('-', ' ')}</span>
                                        </div>
                                        <div style={{ fontSize: 16, fontWeight: 700, color: '#37352F', marginBottom: 2 }}>{po.project}</div>
                                        <div style={{ fontSize: 12, color: '#9B9A97' }}>{po.client}</div>
                                        <div style={{ fontSize: 11, color: '#9B9A97', marginTop: 2 }}>{po.address}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 22, fontWeight: 800, color: '#37352F' }}>${po.value.toLocaleString()}</div>
                                        <div style={{ fontSize: 10, color: '#9B9A97', marginTop: 2 }}>
                                            Due: {new Date(po.dueDate).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ fontSize: 12, color: '#6B6A67', marginBottom: 12, padding: '8px 12px', background: '#F7F6F3', borderRadius: 6 }}>
                                    <span style={{ fontWeight: 600 }}>Scope:</span> {po.scope}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: 11, color: '#9B9A97' }}>
                                        Workers: <span style={{ fontWeight: 600, color: '#37352F' }}>{po.assignedWorkers.join(', ')}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 200px' }}>
                                        <div style={{ flex: 1, height: 6, background: '#F0EFEB', borderRadius: 3 }}>
                                            <div style={{ width: `${po.progress}%`, height: '100%', background: '#37352F', borderRadius: 3, transition: 'width 0.3s' }} />
                                        </div>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: '#37352F' }}>{po.progress}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* CLAIMS TAB */}
                {activeTab === 'claims' && (
                    <div>
                        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: '#37352F' }}>Payment Claims</h2>
                        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #E9E9E7' }}>
                                        {['Project', 'Phase', 'Amount', 'Status', 'Submitted', 'Expected'].map(h => (
                                            <th key={h} style={{
                                                padding: '10px 16px', textAlign: 'left',
                                                fontSize: 10, fontWeight: 600, color: '#9B9A97',
                                                textTransform: 'uppercase', letterSpacing: '0.06em',
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {CLAIMS.map(c => (
                                        <tr key={c.id} style={{ borderBottom: '1px solid #F5F5F4' }}>
                                            <td style={{ padding: '12px 16px', fontWeight: 600, color: '#37352F' }}>{c.project}</td>
                                            <td style={{ padding: '12px 16px', color: '#6B6A67', fontSize: 12 }}>{c.phase}</td>
                                            <td style={{ padding: '12px 16px', fontWeight: 700, color: '#37352F' }}>
                                                ${c.amount.toLocaleString()}
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{
                                                    fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
                                                    background: `${statusColor(c.status)}15`,
                                                    color: statusColor(c.status),
                                                    textTransform: 'uppercase',
                                                }}>{c.status}</span>
                                            </td>
                                            <td style={{ padding: '12px 16px', color: '#9B9A97', fontSize: 12 }}>
                                                {new Date(c.submittedDate).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}
                                            </td>
                                            <td style={{ padding: '12px 16px', color: c.expectedPayDate ? '#37352F' : '#9B9A97', fontSize: 12, fontWeight: c.expectedPayDate ? 600 : 400 }}>
                                                {c.expectedPayDate ? new Date(c.expectedPayDate).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' }) : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* KIT READINESS TAB */}
                {activeTab === 'kit' && (
                    <div>
                        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px', color: '#37352F' }}>Pre-Site Kit Readiness</h2>
                        <p style={{ fontSize: 12, color: '#9B9A97', margin: '0 0 16px' }}>
                            Workers confirm their tools and materials the night before. Red = missing items that need action.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {WORKERS.filter(w => w.status !== 'off-duty').map(w => (
                                <div key={w.id} style={{
                                    background: 'white', borderRadius: 10,
                                    border: `1px solid ${w.kitStatus === 'missing' ? '#FECACA' : '#E9E9E7'}`,
                                    padding: '16px 20px',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: '#37352F' }}>{w.name}</div>
                                            <div style={{ fontSize: 11, color: '#9B9A97' }}>{w.currentProject} — {w.currentSite}</div>
                                        </div>
                                        <span style={{
                                            fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 6,
                                            background: w.kitStatus === 'ready' ? '#ECFDF5' : w.kitStatus === 'missing' ? '#FEF2F2' : '#F7F6F3',
                                            color: w.kitStatus === 'ready' ? '#10B981' : w.kitStatus === 'missing' ? '#EF4444' : '#9B9A97',
                                            textTransform: 'uppercase',
                                        }}>
                                            {w.kitStatus === 'ready' ? 'All Clear' : w.kitStatus === 'missing' ? 'Items Missing' : 'Not Checked'}
                                        </span>
                                    </div>
                                    {w.missingItems.length > 0 && (
                                        <div style={{ marginTop: 12, padding: '10px 12px', background: '#FEF2F2', borderRadius: 6 }}>
                                            <div style={{ fontSize: 10, fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', marginBottom: 6 }}>
                                                Missing Items — Action Required
                                            </div>
                                            {w.missingItems.map((item, i) => (
                                                <div key={i} style={{
                                                    fontSize: 12, color: '#37352F', padding: '4px 0',
                                                    display: 'flex', alignItems: 'center', gap: 8,
                                                }}>
                                                    <span style={{ color: '#EF4444', fontWeight: 700 }}>—</span> {item}
                                                </div>
                                            ))}
                                            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                                                <button style={{
                                                    padding: '6px 12px', fontSize: 11, fontWeight: 600,
                                                    background: '#37352F', color: 'white', border: 'none',
                                                    borderRadius: 6, cursor: 'pointer', fontFamily: f,
                                                }}>Send to Supplier</button>
                                                <button style={{
                                                    padding: '6px 12px', fontSize: 11, fontWeight: 600,
                                                    background: 'white', color: '#37352F', border: '1px solid #E9E9E7',
                                                    borderRadius: 6, cursor: 'pointer', fontFamily: f,
                                                }}>Reallocate from Other Worker</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PROFILE & COMPLIANCE TAB */}
                {activeTab === 'profile' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Business Identity */}
                        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', overflow: 'hidden' }}>
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E9E9E7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#37352F' }}>Business Identity</h3>
                                <button style={{ padding: '6px 12px', fontSize: 11, fontWeight: 600, background: '#F7F6F3', border: '1px solid #E9E9E7', borderRadius: 6, cursor: 'pointer', fontFamily: f }}>Edit</button>
                            </div>
                            <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px 24px' }}>
                                {[
                                    { label: 'Business Name', value: VENDOR_IDENTITY.businessName },
                                    { label: 'UEN', value: VENDOR_IDENTITY.uen, mono: true },
                                    { label: 'Business Type', value: VENDOR_IDENTITY.businessType.replace('-', ' ').toUpperCase() },
                                    { label: 'Owner / Director', value: VENDOR_IDENTITY.ownerName },
                                    { label: `${VENDOR_IDENTITY.idType}`, value: VENDOR_IDENTITY.idNumber, mono: true },
                                    { label: 'Nationality', value: VENDOR_IDENTITY.nationality },
                                    { label: 'Phone', value: VENDOR_IDENTITY.phone },
                                    { label: 'Email', value: VENDOR_IDENTITY.email },
                                    { label: 'Registered Address', value: VENDOR_IDENTITY.registeredAddress },
                                ].map((f, i) => (
                                    <div key={i}>
                                        <div style={{ fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{f.label}</div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#37352F', fontFamily: f.mono ? "'SF Mono', monospace" : 'inherit' }}>{f.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Licenses & Certifications */}
                        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', overflow: 'hidden' }}>
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E9E9E7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#37352F' }}>Trade Licenses & Certifications</h3>
                                <button style={{ padding: '6px 12px', fontSize: 11, fontWeight: 600, background: '#37352F', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: f }}>+ Add License</button>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #E9E9E7' }}>
                                        {['License Type', 'Number', 'Expiry', 'Status'].map(h => (
                                            <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {VENDOR_IDENTITY.licenses.map((lic, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #F5F5F4' }}>
                                            <td style={{ padding: '12px 16px', fontWeight: 600, color: '#37352F' }}>{lic.type}</td>
                                            <td style={{ padding: '12px 16px', fontFamily: "'SF Mono', monospace", fontSize: 12, color: '#6B6A67' }}>{lic.number}</td>
                                            <td style={{ padding: '12px 16px', color: '#6B6A67', fontSize: 12 }}>
                                                {new Date(lic.expiry).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: `${statusColor(lic.status)}15`, color: statusColor(lic.status), textTransform: 'uppercase' }}>{lic.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Insurance */}
                        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', overflow: 'hidden' }}>
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E9E9E7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#37352F' }}>Insurance Policies</h3>
                                <button style={{ padding: '6px 12px', fontSize: 11, fontWeight: 600, background: '#37352F', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: f }}>+ Add Policy</button>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #E9E9E7' }}>
                                        {['Type', 'Provider', 'Policy No.', 'Coverage', 'Expiry', 'Status'].map(h => (
                                            <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {VENDOR_IDENTITY.insurance.map((ins, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #F5F5F4' }}>
                                            <td style={{ padding: '12px 16px', fontWeight: 600, color: '#37352F' }}>{ins.type}</td>
                                            <td style={{ padding: '12px 16px', color: '#6B6A67' }}>{ins.provider}</td>
                                            <td style={{ padding: '12px 16px', fontFamily: "'SF Mono', monospace", fontSize: 12, color: '#6B6A67' }}>{ins.policyNumber}</td>
                                            <td style={{ padding: '12px 16px', fontWeight: 700, color: '#37352F' }}>${ins.coverage.toLocaleString()}</td>
                                            <td style={{ padding: '12px 16px', color: '#6B6A67', fontSize: 12 }}>
                                                {new Date(ins.expiry).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: `${statusColor(ins.status)}15`, color: statusColor(ins.status), textTransform: 'uppercase' }}>{ins.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Worker Permits */}
                        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', overflow: 'hidden' }}>
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E9E9E7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#37352F' }}>Worker Permits & IDs</h3>
                                <button style={{ padding: '6px 12px', fontSize: 11, fontWeight: 600, background: '#37352F', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: f }}>+ Add Worker</button>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #E9E9E7' }}>
                                        {['Name', 'FIN / NRIC', 'Permit Type', 'Trade', 'Expiry', 'Status'].map(h => (
                                            <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {VENDOR_IDENTITY.workerPermits.map((wp, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #F5F5F4' }}>
                                            <td style={{ padding: '12px 16px', fontWeight: 600, color: '#37352F' }}>{wp.name}</td>
                                            <td style={{ padding: '12px 16px', fontFamily: "'SF Mono', monospace", fontSize: 12, color: '#6B6A67' }}>{wp.finNumber}</td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#F0F0FF', color: '#6366F1' }}>{wp.permitType}</span>
                                            </td>
                                            <td style={{ padding: '12px 16px', color: '#6B6A67' }}>{wp.trade}</td>
                                            <td style={{ padding: '12px 16px', color: '#6B6A67', fontSize: 12 }}>{wp.expiry}</td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: `${statusColor(wp.status)}15`, color: statusColor(wp.status), textTransform: 'uppercase' }}>{wp.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Bank Details */}
                        <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', overflow: 'hidden' }}>
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E9E9E7' }}>
                                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#37352F' }}>Banking & Payment</h3>
                            </div>
                            <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px 24px' }}>
                                {[
                                    { label: 'Bank', value: VENDOR_IDENTITY.banking.bankName },
                                    { label: 'Account Name', value: VENDOR_IDENTITY.banking.accountName },
                                    { label: 'Account No.', value: VENDOR_IDENTITY.banking.accountNumber, mono: true },
                                    { label: 'Branch Code', value: VENDOR_IDENTITY.banking.branchCode || '—' },
                                    { label: 'SWIFT', value: VENDOR_IDENTITY.banking.swiftCode || '—', mono: true },
                                    { label: 'PayNow', value: VENDOR_IDENTITY.banking.payNowLinked ? '✓ Linked' : 'Not linked' },
                                ].map((f, i) => (
                                    <div key={i}>
                                        <div style={{ fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{f.label}</div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#37352F', fontFamily: f.mono ? "'SF Mono', monospace" : 'inherit' }}>{f.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pipeline Report — Bank Ready */}
                        <div style={{ background: 'white', borderRadius: 10, border: '2px solid #37352F', overflow: 'hidden' }}>
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E9E9E7', background: '#37352F', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: 'white' }}>Pipeline Report — Bank Ready</h3>
                                    <p style={{ fontSize: 10, color: '#9B9A97', margin: '2px 0 0' }}>Verified by Roof Platform • Shareable with financial institutions</p>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button style={{ padding: '6px 12px', fontSize: 11, fontWeight: 600, background: 'white', color: '#37352F', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: f }}>Download PDF</button>
                                    <button style={{ padding: '6px 12px', fontSize: 11, fontWeight: 600, background: '#10B981', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: f }}>Share with Bank</button>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: '#E9E9E7' }}>
                                {[
                                    { label: 'Total Pipeline', value: `$${pipelineTotal.toLocaleString()}`, color: '#37352F' },
                                    { label: 'Outstanding Receivables', value: `$${pipelineRemaining.toLocaleString()}`, color: '#3B82F6' },
                                    { label: 'Historical Earnings', value: `$${VENDOR_IDENTITY.totalEarnings.toLocaleString()}`, color: '#10B981' },
                                    { label: 'On-Time Delivery', value: `${VENDOR_IDENTITY.onTimeRate}%`, color: '#10B981' },
                                ].map((s, i) => (
                                    <div key={i} style={{ background: 'white', padding: '16px 20px' }}>
                                        <div style={{ fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{s.label}</div>
                                        <div style={{ fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</div>
                                    </div>
                                ))}
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #E9E9E7' }}>
                                        {['Project', 'Contract Value', 'Period', 'Status', 'Progress Paid'].map(h => (
                                            <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {PIPELINE.map((p, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #F5F5F4' }}>
                                            <td style={{ padding: '12px 16px', fontWeight: 600, color: '#37352F' }}>{p.project}</td>
                                            <td style={{ padding: '12px 16px', fontWeight: 700, color: '#37352F' }}>${p.contractValue.toLocaleString()}</td>
                                            <td style={{ padding: '12px 16px', color: '#6B6A67', fontSize: 12 }}>
                                                {new Date(p.startDate).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })} — {new Date(p.endDate).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: `${statusColor(p.status)}15`, color: statusColor(p.status), textTransform: 'uppercase' }}>{p.status.replace(/-/g, ' ')}</span>
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div style={{ flex: 1, height: 6, background: '#F0EFEB', borderRadius: 3 }}>
                                                        <div style={{ width: `${p.progressPaid}%`, height: '100%', background: '#10B981', borderRadius: 3, transition: 'width 0.3s' }} />
                                                    </div>
                                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#37352F', minWidth: 30 }}>{p.progressPaid}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ padding: '12px 20px', background: '#FAFAF9', borderTop: '1px solid #E9E9E7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: 10, color: '#9B9A97' }}>
                                    Platform-verified data • Jobs: {VENDOR_IDENTITY.totalJobsCompleted} completed • Rating: {VENDOR_IDENTITY.avgRating}/5.0 • Dispute rate: {VENDOR_IDENTITY.disputeRate}%
                                </div>
                                <div style={{ fontSize: 10, color: '#9B9A97' }}>
                                    Report generated: {new Date().toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
