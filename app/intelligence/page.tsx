'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

/* ═══ MOCK DATA ═══ */
const DESIGNER_STATS = {
    name: 'Bjorn', firm: 'Multiply Carpentry', role: 'Senior Designer',
    closeRate: 58, platformAvg: 67, topPerformerAvg: 82,
    avgDealSize: 52000, avgTimeToDays: 18, responseTimeHrs: 4.2,
    totalLeads: 12, closed: 7, lost: 5, active: 3,
    marginQuoted: 35, marginActual: 28,
    monthlyTrend: [42, 48, 55, 58, 62, 58],
};

const LOST_REASONS = [
    { reason: 'Slow response time', count: 2, pct: 40, fix: 'Respond within 2 hours — your win rate doubles' },
    { reason: 'Price too high vs competitor', count: 1, pct: 20, fix: 'Lead with value/portfolio before discussing price' },
    { reason: 'Style mismatch', count: 1, pct: 20, fix: 'Ask about style preferences in first message' },
    { reason: 'Timeline didn\'t fit', count: 1, pct: 20, fix: 'Offer phased renovation option' },
];

const CALL_RECORDINGS = [
    { id: 'C1', client: 'Amanda Koh', date: '2026-03-05', duration: '24:30', score: 72, result: 'Closed', highlights: ['Good rapport', 'Clear pricing'], issues: ['Missed upsell on carpentry'] },
    { id: 'C2', client: 'David Lim', date: '2026-03-03', duration: '18:45', score: 45, result: 'Lost', highlights: ['Professional intro'], issues: ['Talked price at 3min', 'Didn\'t address timeline concern', 'No close attempt'] },
    { id: 'C3', client: 'Priya Nair', date: '2026-03-01', duration: '32:10', score: 88, result: 'Closed', highlights: ['Vision-first approach', 'Handled budget objection perfectly', 'Strong close'], issues: [] },
    { id: 'C4', client: 'Jason Lee', date: '2026-02-28', duration: '15:20', score: 38, result: 'Lost', highlights: [], issues: ['Rushed presentation', 'No portfolio shown', 'Client concern dismissed'] },
];

const SALES_SCRIPTS = [
    {
        id: 'S1', name: 'First Site Visit', scene: 'Meeting homeowner for the first time at their property', steps: [
            { time: '0-2 min', say: '"Thanks for having me over. Before we talk about anything, I\'d love to just walk through the space with you — tell me what you love about it and what drives you crazy."', why: 'Builds rapport, shows you care about their experience not just the sale' },
            { time: '5-10 min', say: '"Let me show you a few projects I\'ve done in similar spaces..." [Show portfolio on tablet]', why: 'Visual proof builds trust faster than talking' },
            { time: '15 min', say: '"Based on what I\'m seeing, a renovation like this typically runs between [range]. How does that sit with your budget?"', why: 'Anchoring budget expectation mid-conversation, not too early' },
            { time: '20 min', say: '"I\'ll prepare a detailed quote within 48 hours through our platform — you\'ll see every line item broken down. Sound good?"', why: 'Sets clear next step and timeline' },
        ]
    },
    {
        id: 'S2', name: 'Budget Objection', scene: 'Client says "That\'s more than I expected"', steps: [
            { time: 'Acknowledge', say: '"I totally understand — renovation costs can be surprising. Let me break down where the money actually goes..."', why: 'Never dismiss the concern' },
            { time: 'Reframe', say: '"The biggest cost here is [carpentry/tiling] at S$X. One option is [phased approach / alternative material]. That could bring it down to..."', why: 'Offer solutions, not excuses' },
            { time: 'Benchmark', say: '"For reference, a similar [property type] renovation on Roof\'s price index runs S$X-Y. We\'re right in range."', why: 'Third-party data builds credibility' },
        ]
    },
    {
        id: 'S3', name: 'Comparing Quotes', scene: 'Client says "I\'m getting 3 quotes"', steps: [
            { time: 'Welcome it', say: '"That\'s smart — you should compare. When you\'re reviewing, I\'d suggest looking at three things: how detailed the breakdown is, whether site protection is included, and the payment milestone structure."', why: 'Positions you as the transparent, confident option' },
            { time: 'Differentiate', say: '"What I offer through Roof is full milestone tracking, escrow protection on payments, and a dedicated project manager. Not every quote comes with that."', why: 'Sell the system, not just the price' },
        ]
    },
    {
        id: 'S4', name: 'Closing', scene: 'You\'ve presented the quote and the client seems interested', steps: [
            { time: 'Trial close', say: '"Based on everything we\'ve discussed, does this design direction feel right for you?"', why: 'Tests buying temperature without pressure' },
            { time: 'Address gaps', say: '"Is there anything you\'re still unsure about that I can clarify?"', why: 'Surfaces hidden objections' },
            { time: 'The ask', say: '"Great — shall I lock in the start date and send over the contract through Roof? The first milestone would be..."', why: 'Specific next step, not vague "let me know"' },
        ]
    },
];

const TEAM_MEMBERS = [
    { name: 'Bjorn', role: 'Senior Designer', closeRate: 58, avgDeal: 52000, responseHrs: 4.2, calls: 8, score: 72, trend: 'up', color: '#059669' },
    { name: 'Sarah', role: 'Designer', closeRate: 71, avgDeal: 38000, responseHrs: 1.8, calls: 12, score: 81, trend: 'up', color: '#2563EB' },
    { name: 'Ahmad', role: 'Junior Designer', closeRate: 42, avgDeal: 28000, responseHrs: 6.5, calls: 5, score: 55, trend: 'down', color: '#D97706' },
    { name: 'Mei Ling', role: 'Designer', closeRate: 65, avgDeal: 45000, responseHrs: 2.1, calls: 10, score: 76, trend: 'flat', color: '#8B5CF6' },
];

export default function IntelligencePage() {
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', monospace";

    const [tab, setTab] = useState<'overview' | 'calls' | 'scripts' | 'team'>('overview');
    const [expandedCall, setExpandedCall] = useState<string | null>(null);
    const [expandedScript, setExpandedScript] = useState<string | null>('S1');
    const [tier, setTier] = useState<'free' | 'pro' | 'studio'>('studio');

    // Audio Recorder State
    const [recState, setRecState] = useState<'idle' | 'recording' | 'analyzing' | 'result'>('idle');
    const [recTime, setRecTime] = useState(0);
    const [waveData, setWaveData] = useState<number[]>(new Array(40).fill(2));
    const [aiResult, setAiResult] = useState<{ score: number, transcript: { time: string, text: string, tag?: string }[], highlights: string[], issues: string[] } | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animFrameRef = useRef<number>(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const drawWaveform = useCallback(() => {
        if (!analyserRef.current || !canvasRef.current) return;
        const analyser = analyserRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#DC2626';
        ctx.beginPath();
        const sliceWidth = canvas.width / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * canvas.height) / 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            x += sliceWidth;
        }
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        // Update bar data for mini bars
        const bars: number[] = [];
        const step = Math.floor(bufferLength / 40);
        for (let i = 0; i < 40; i++) {
            const val = Math.abs(dataArray[i * step] - 128) / 128;
            bars.push(Math.max(2, val * 36));
        }
        setWaveData(bars);

        animFrameRef.current = requestAnimationFrame(drawWaveform);
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            const mediaRecorder = new MediaRecorder(stream);
            chunksRef.current = [];
            mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;

            setRecState('recording');
            setRecTime(0);
            setAiResult(null);
            timerRef.current = setInterval(() => setRecTime(t => t + 1), 1000);
            drawWaveform();
        } catch (err) {
            alert('Microphone access required for call recording.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
        }
        if (audioContextRef.current) audioContextRef.current.close();
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        if (timerRef.current) clearInterval(timerRef.current);

        setRecState('analyzing');
        setWaveData(new Array(40).fill(2));

        // Simulate AI analysis (in production: upload to Supabase → Whisper → GPT-4)
        setTimeout(() => {
            setAiResult({
                score: 68,
                transcript: [
                    { time: '0:00', text: 'Good afternoon, thanks for meeting me here at your flat.', tag: 'rapport' },
                    { time: '0:45', text: 'Can you walk me through what you\'re hoping to change?', tag: 'discovery' },
                    { time: '2:30', text: 'Based on similar 4-room BTOs, renovation typically runs S$45-65k.', tag: 'anchoring' },
                    { time: '5:10', text: 'Let me show you some projects I\'ve done in this area...', tag: 'portfolio' },
                    { time: '8:00', text: 'The carpentry alone would be about S$18k for the built-ins.', tag: 'pricing' },
                    { time: '12:30', text: 'I\'ll send the detailed quote through Roof within 48 hours.', tag: 'next-step' },
                ],
                highlights: ['Strong opening rapport', 'Good use of portfolio', 'Clear next step defined'],
                issues: ['Price mentioned at 2:30 — too early (ideal: after minute 10)', 'No trial close attempted', 'Didn\'t ask about their budget range first'],
            });
            setRecState('result');
        }, 3000);
    };

    useEffect(() => {
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            if (timerRef.current) clearInterval(timerRef.current);
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, []);

    const tabs = [
        { id: 'overview', label: 'Performance', icon: '📊' },
        { id: 'calls', label: 'Call Intelligence', icon: '🎙️', pro: true },
        { id: 'scripts', label: 'Sales Scripts', icon: '📋', pro: true },
        { id: 'team', label: 'Team', icon: '👥', studio: true },
    ];

    const S = DESIGNER_STATS;

    return (
        <div style={{ fontFamily: f, background: '#fafafa', color: '#111', minHeight: '100vh' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            <style>{`
                .intel-card { transition: all 0.2s; }
                .intel-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); transform: translateY(-1px); }
                .call-row { transition: all 0.15s; cursor: pointer; }
                .call-row:hover { background: rgba(0,0,0,0.015) !important; }
                .script-card { transition: all 0.2s; cursor: pointer; }
                .script-card:hover { border-color: rgba(0,0,0,0.15) !important; }
                .tab-btn { transition: all 0.15s; }
                .tab-btn:hover { color: #111 !important; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
                .animate-in { animation: fade-in 0.3s ease forwards; }
            `}</style>

            {/* Nav */}
            <nav style={{ padding: '0 48px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <Link href="/landing" style={{ fontFamily: mono, fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.14em', textDecoration: 'none' }}>ROOF</Link>
                    <span style={{ color: 'rgba(0,0,0,0.12)' }}>/</span>
                    <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.1em' }}>INTELLIGENCE</span>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {(['free', 'pro', 'studio'] as const).map(t => (
                        <button key={t} onClick={() => setTier(t)} style={{
                            padding: '4px 12px', fontSize: 10, fontWeight: 600, borderRadius: 6, fontFamily: mono,
                            border: `1px solid ${tier === t ? '#111' : 'rgba(0,0,0,0.08)'}`,
                            background: tier === t ? '#111' : 'transparent',
                            color: tier === t ? 'white' : 'rgba(0,0,0,0.3)',
                            cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase' as const,
                        }}>{t}</button>
                    ))}
                </div>
            </nav>

            <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 48px' }}>
                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.15em', marginBottom: 8 }}>SALES INTELLIGENCE</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h1 style={{ fontSize: 26, fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 4px' }}>
                                {S.name}'s <span style={{ color: 'rgba(0,0,0,0.2)', fontStyle: 'italic' }}>Performance</span>
                            </h1>
                            <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.35)', margin: 0 }}>{S.firm} · {S.role}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.3)' }}>Plan:</span>
                            <span style={{
                                fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 6, fontFamily: mono,
                                background: tier === 'studio' ? 'rgba(139,92,246,0.08)' : tier === 'pro' ? 'rgba(37,99,235,0.08)' : 'rgba(0,0,0,0.04)',
                                color: tier === 'studio' ? '#8B5CF6' : tier === 'pro' ? '#2563EB' : 'rgba(0,0,0,0.3)',
                            }}>{tier === 'studio' ? 'STUDIO S$249/mo' : tier === 'pro' ? 'PRO S$99/mo' : 'FREE'}</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: 0 }}>
                    {tabs.map(t => {
                        const locked = (t.pro && tier === 'free') || (t.studio && tier !== 'studio');
                        return (
                            <button key={t.id} className="tab-btn" onClick={() => !locked && setTab(t.id as typeof tab)} style={{
                                padding: '10px 18px', fontSize: 12, fontWeight: tab === t.id ? 600 : 400,
                                color: locked ? 'rgba(0,0,0,0.15)' : tab === t.id ? '#111' : 'rgba(0,0,0,0.35)',
                                background: 'transparent', border: 'none', cursor: locked ? 'not-allowed' : 'pointer',
                                borderBottom: tab === t.id ? '2px solid #111' : '2px solid transparent',
                                fontFamily: f, marginBottom: -1,
                            }}>
                                {t.icon} {t.label} {locked && '🔒'}
                            </button>
                        );
                    })}
                </div>

                {/* ═══ OVERVIEW TAB ═══ */}
                {tab === 'overview' && (
                    <div className="animate-in">
                        {/* KPI Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                            {[
                                { label: 'Close Rate', value: `${S.closeRate}%`, sub: `Platform avg: ${S.platformAvg}%`, color: S.closeRate >= S.platformAvg ? '#059669' : '#DC2626' },
                                { label: 'Avg Deal Size', value: `S$${(S.avgDealSize / 1000).toFixed(0)}k`, sub: 'Per closed project', color: '#2563EB' },
                                { label: 'Response Time', value: `${S.responseTimeHrs}h`, sub: 'Top closers: 2h', color: S.responseTimeHrs <= 3 ? '#059669' : '#D97706' },
                                { label: 'Margin Health', value: `${S.marginActual}%`, sub: `Quoted: ${S.marginQuoted}%`, color: S.marginActual >= S.marginQuoted - 5 ? '#059669' : '#DC2626' },
                            ].map(kpi => (
                                <div key={kpi.label} className="intel-card" style={{ background: 'white', borderRadius: 12, padding: '18px 16px', border: '1px solid rgba(0,0,0,0.06)' }}>
                                    <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 8 }}>{kpi.label.toUpperCase()}</div>
                                    <div style={{ fontFamily: mono, fontSize: 28, fontWeight: 800, color: kpi.color, letterSpacing: '-0.02em' }}>{kpi.value}</div>
                                    <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.3)', marginTop: 4 }}>{kpi.sub}</div>
                                </div>
                            ))}
                        </div>

                        {/* Pipeline Funnel */}
                        <div style={{ background: 'white', borderRadius: 14, padding: 24, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 20 }}>
                            <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 16 }}>SALES FUNNEL</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {[
                                    { stage: 'Leads', count: S.totalLeads, width: 100, color: '#E0F2FE' },
                                    { stage: 'Site Visits', count: 10, width: 83, color: '#BAE6FD' },
                                    { stage: 'Quoted', count: 9, width: 75, color: '#7DD3FC' },
                                    { stage: 'Negotiating', count: S.active, width: 25, color: '#38BDF8' },
                                    { stage: 'Closed', count: S.closed, width: 58, color: '#059669' },
                                ].map((s, i) => (
                                    <div key={s.stage} style={{ flex: 1, textAlign: 'center' }}>
                                        <div style={{
                                            height: 40, background: s.color, borderRadius: 8,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            width: `${s.width}%`, margin: '0 auto', minWidth: 40,
                                        }}>
                                            <span style={{ fontFamily: mono, fontSize: 14, fontWeight: 700, color: i === 4 ? 'white' : '#0369A1' }}>{s.count}</span>
                                        </div>
                                        <div style={{ fontSize: 9, color: 'rgba(0,0,0,0.35)', marginTop: 6, fontFamily: mono }}>{s.stage}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Why You Lose */}
                        <div style={{ background: 'white', borderRadius: 14, padding: 24, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 20 }}>
                            <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 16 }}>WHY YOU LOSE DEALS</div>
                            {LOST_REASONS.map((r, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < LOST_REASONS.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                                    <div style={{ width: 36, fontFamily: mono, fontSize: 14, fontWeight: 800, color: 'rgba(0,0,0,0.06)', textAlign: 'center' }}>{r.count}×</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{r.reason}</div>
                                        <div style={{ fontSize: 11, color: '#059669', fontStyle: 'italic' }}>💡 {r.fix}</div>
                                    </div>
                                    <div style={{ width: 60 }}>
                                        <div style={{ height: 4, background: 'rgba(0,0,0,0.04)', borderRadius: 2, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${r.pct}%`, background: '#DC2626', borderRadius: 2 }} />
                                        </div>
                                        <div style={{ fontFamily: mono, fontSize: 9, color: 'rgba(0,0,0,0.25)', textAlign: 'right', marginTop: 2 }}>{r.pct}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* AI Coaching */}
                        <div style={{ background: 'rgba(37,99,235,0.02)', borderRadius: 14, padding: 24, border: '1px solid rgba(37,99,235,0.08)' }}>
                            <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: '#2563EB', letterSpacing: '0.1em', marginBottom: 14 }}>AI COACHING — TOP 3 ACTIONS</div>
                            {[
                                { priority: 1, action: 'Cut response time to under 2 hours', impact: 'Your close rate could jump from 58% → 70%+', metric: 'Currently 4.2h avg' },
                                { priority: 2, action: 'Don\'t discuss price before minute 15', impact: 'Leads that hear price early are 2.3× more likely to ghost', metric: '2 calls had early price reveal' },
                                { priority: 3, action: 'Always ask for the close', impact: '3 of 5 lost calls had zero close attempt', metric: 'Top closers ask by minute 20' },
                            ].map((a, i) => (
                                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(37,99,235,0.06)' : 'none' }}>
                                    <div style={{ fontFamily: mono, fontSize: 18, fontWeight: 800, color: 'rgba(37,99,235,0.15)', width: 28 }}>#{a.priority}</div>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 2 }}>{a.action}</div>
                                        <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)' }}>{a.impact}</div>
                                        <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.25)', fontFamily: mono, marginTop: 2 }}>{a.metric}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══ CALLS TAB ═══ */}
                {tab === 'calls' && (
                    <div className="animate-in">
                        {/* Live Recorder */}
                        <div style={{
                            background: recState === 'recording' ? 'rgba(220,38,38,0.02)' : 'white',
                            borderRadius: 14, padding: 24, marginBottom: 20,
                            border: `1px solid ${recState === 'recording' ? 'rgba(220,38,38,0.15)' : 'rgba(0,0,0,0.06)'}`,
                            transition: 'all 0.3s',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: recState === 'recording' ? '#DC2626' : 'rgba(0,0,0,0.3)', letterSpacing: '0.1em' }}>
                                    {recState === 'recording' ? '● RECORDING' : recState === 'analyzing' ? '⏳ ANALYZING...' : recState === 'result' ? '✅ ANALYSIS COMPLETE' : '🎙️ RECORD A CALL'}
                                </div>
                                {recState === 'recording' && (
                                    <div style={{ fontFamily: mono, fontSize: 18, fontWeight: 700, color: '#DC2626' }}>{formatTime(recTime)}</div>
                                )}
                            </div>

                            {recState === 'idle' && (
                                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                    <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.35)', margin: '0 0 16px' }}>Tap to start recording your site visit or sales call. AI will analyze and score it.</p>
                                    <button onClick={startRecording} style={{
                                        padding: '12px 32px', fontSize: 14, fontWeight: 600, background: '#DC2626', color: 'white',
                                        border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: f,
                                        boxShadow: '0 2px 8px rgba(220,38,38,0.2)',
                                    }}>🎙️ Start Recording</button>
                                </div>
                            )}

                            {recState === 'recording' && (
                                <div>
                                    {/* Waveform */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 40, marginBottom: 16, justifyContent: 'center' }}>
                                        {waveData.map((h, i) => (
                                            <div key={i} style={{
                                                width: 4, height: h, borderRadius: 2, background: '#DC2626',
                                                opacity: 0.4 + (h / 36) * 0.6, transition: 'height 0.1s',
                                            }} />
                                        ))}
                                    </div>
                                    <canvas ref={canvasRef} width={800} height={60} style={{ width: '100%', height: 60, borderRadius: 8, background: 'rgba(0,0,0,0.02)', marginBottom: 16 }} />
                                    <div style={{ textAlign: 'center' }}>
                                        <button onClick={stopRecording} style={{
                                            padding: '10px 28px', fontSize: 13, fontWeight: 600, background: '#111', color: 'white',
                                            border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: f,
                                        }}>⏹ Stop & Analyze</button>
                                    </div>
                                </div>
                            )}

                            {recState === 'analyzing' && (
                                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                    <div style={{ fontSize: 28, marginBottom: 8, animation: 'pulse-soft 1.5s infinite' }}>🧠</div>
                                    <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', margin: 0 }}>Transcribing with Whisper... Analyzing with AI...</p>
                                    <style>{`@keyframes pulse-soft { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
                                </div>
                            )}

                            {recState === 'result' && aiResult && (
                                <div>
                                    {/* Score + Summary */}
                                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                                        <div style={{
                                            width: 72, height: 72, borderRadius: 16, flexShrink: 0,
                                            background: aiResult.score >= 70 ? 'rgba(5,150,105,0.06)' : aiResult.score >= 50 ? 'rgba(245,158,11,0.06)' : 'rgba(220,38,38,0.06)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <span style={{
                                                fontFamily: mono, fontSize: 28, fontWeight: 800,
                                                color: aiResult.score >= 70 ? '#059669' : aiResult.score >= 50 ? '#D97706' : '#DC2626',
                                            }}>{aiResult.score}</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 9, fontWeight: 600, color: '#059669', fontFamily: mono, letterSpacing: '0.1em', marginBottom: 6 }}>✅ STRENGTHS</div>
                                            {aiResult.highlights.map((h, i) => <div key={i} style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)', padding: '1px 0' }}>• {h}</div>)}
                                            <div style={{ fontSize: 9, fontWeight: 600, color: '#DC2626', fontFamily: mono, letterSpacing: '0.1em', marginBottom: 4, marginTop: 8 }}>⚠️ IMPROVE</div>
                                            {aiResult.issues.map((iss, i) => <div key={i} style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)', padding: '1px 0' }}>• {iss}</div>)}
                                        </div>
                                    </div>

                                    {/* Transcript */}
                                    <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 8 }}>AI TRANSCRIPT</div>
                                    <div style={{ background: 'rgba(0,0,0,0.02)', borderRadius: 10, padding: 14 }}>
                                        {aiResult.transcript.map((t, i) => (
                                            <div key={i} style={{ display: 'flex', gap: 10, padding: '6px 0', borderBottom: i < aiResult.transcript.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                                                <div style={{ fontFamily: mono, fontSize: 10, color: '#2563EB', fontWeight: 600, minWidth: 36 }}>{t.time}</div>
                                                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.6)', flex: 1, lineHeight: 1.5 }}>{t.text}</div>
                                                {t.tag && <span style={{ fontSize: 8, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: 'rgba(37,99,235,0.06)', color: '#2563EB', alignSelf: 'flex-start', textTransform: 'uppercase' as const }}>{t.tag}</span>}
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                                        <button onClick={() => { setRecState('idle'); setAiResult(null); }} style={{
                                            padding: '8px 20px', fontSize: 11, fontWeight: 600, background: 'rgba(37,99,235,0.06)', color: '#2563EB',
                                            border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: f,
                                        }}>Record Another</button>
                                        <button style={{
                                            padding: '8px 20px', fontSize: 11, fontWeight: 600, background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.4)',
                                            border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: f,
                                        }}>Save to History</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ background: 'white', borderRadius: 14, padding: 24, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em' }}>RECORDED CALLS</div>
                                <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.25)' }}>{CALL_RECORDINGS.length} calls this month</div>
                            </div>
                            {CALL_RECORDINGS.map((call, i) => (
                                <div key={call.id}>
                                    <div className="call-row" onClick={() => setExpandedCall(expandedCall === call.id ? null : call.id)} style={{
                                        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
                                        borderBottom: expandedCall !== call.id && i < CALL_RECORDINGS.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                                    }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                                            background: call.score >= 70 ? 'rgba(5,150,105,0.06)' : call.score >= 50 ? 'rgba(245,158,11,0.06)' : 'rgba(220,38,38,0.06)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <span style={{
                                                fontFamily: mono, fontSize: 14, fontWeight: 700,
                                                color: call.score >= 70 ? '#059669' : call.score >= 50 ? '#D97706' : '#DC2626',
                                            }}>{call.score}</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 13, fontWeight: 600 }}>{call.client}</div>
                                            <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.35)' }}>{call.date} · {call.duration}</div>
                                        </div>
                                        <div style={{
                                            padding: '3px 10px', borderRadius: 10, fontSize: 10, fontWeight: 600,
                                            background: call.result === 'Closed' ? 'rgba(5,150,105,0.06)' : 'rgba(220,38,38,0.06)',
                                            color: call.result === 'Closed' ? '#059669' : '#DC2626',
                                        }}>{call.result}</div>
                                        <span style={{ color: 'rgba(0,0,0,0.2)', fontSize: 12, transform: expandedCall === call.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>▶</span>
                                    </div>
                                    {expandedCall === call.id && (
                                        <div style={{ padding: '16px 0 16px 54px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                                            {call.highlights.length > 0 && (
                                                <div style={{ marginBottom: 10 }}>
                                                    <div style={{ fontSize: 9, fontWeight: 600, color: '#059669', fontFamily: mono, letterSpacing: '0.1em', marginBottom: 6 }}>✅ WHAT WORKED</div>
                                                    {call.highlights.map((h, j) => (
                                                        <div key={j} style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)', padding: '2px 0' }}>• {h}</div>
                                                    ))}
                                                </div>
                                            )}
                                            {call.issues.length > 0 && (
                                                <div>
                                                    <div style={{ fontSize: 9, fontWeight: 600, color: '#DC2626', fontFamily: mono, letterSpacing: '0.1em', marginBottom: 6 }}>⚠️ IMPROVE</div>
                                                    {call.issues.map((issue, j) => (
                                                        <div key={j} style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)', padding: '2px 0' }}>• {issue}</div>
                                                    ))}
                                                </div>
                                            )}
                                            <button style={{
                                                marginTop: 10, padding: '6px 14px', fontSize: 10, fontWeight: 600,
                                                background: 'rgba(37,99,235,0.06)', color: '#2563EB', border: 'none',
                                                borderRadius: 6, cursor: 'pointer', fontFamily: f,
                                            }}>▶ Play Recording</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Call Score Trend */}
                        <div style={{ background: 'white', borderRadius: 14, padding: 24, border: '1px solid rgba(0,0,0,0.06)' }}>
                            <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 16 }}>CALL SCORE TREND</div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
                                {CALL_RECORDINGS.map((c, i) => (
                                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                        <div style={{ fontFamily: mono, fontSize: 9, color: 'rgba(0,0,0,0.25)' }}>{c.score}</div>
                                        <div style={{
                                            width: '100%', maxWidth: 40, borderRadius: 4,
                                            height: `${c.score * 0.8}px`,
                                            background: c.score >= 70 ? '#059669' : c.score >= 50 ? '#D97706' : '#DC2626',
                                            opacity: 0.6,
                                        }} />
                                        <div style={{ fontSize: 8, color: 'rgba(0,0,0,0.2)', fontFamily: mono }}>{c.client.split(' ')[0]}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ SCRIPTS TAB ═══ */}
                {tab === 'scripts' && (
                    <div className="animate-in">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {SALES_SCRIPTS.map(script => (
                                <div key={script.id} className="script-card" onClick={() => setExpandedScript(expandedScript === script.id ? null : script.id)} style={{
                                    background: 'white', borderRadius: 14, border: `1px solid ${expandedScript === script.id ? 'rgba(37,99,235,0.15)' : 'rgba(0,0,0,0.06)'}`,
                                    overflow: 'hidden',
                                }}>
                                    <div style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{script.name}</div>
                                            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)' }}>{script.scene}</div>
                                        </div>
                                        <span style={{ color: 'rgba(0,0,0,0.15)', fontSize: 12, transform: expandedScript === script.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>▶</span>
                                    </div>
                                    {expandedScript === script.id && (
                                        <div style={{ padding: '0 22px 22px', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                                            {script.steps.map((step, i) => (
                                                <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: i < script.steps.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                                                    <div style={{
                                                        fontFamily: mono, fontSize: 9, fontWeight: 600, color: '#2563EB',
                                                        minWidth: 70, paddingTop: 2,
                                                    }}>{step.time}</div>
                                                    <div>
                                                        <div style={{
                                                            fontSize: 12, color: '#111', lineHeight: 1.6, marginBottom: 6,
                                                            padding: '8px 12px', background: 'rgba(37,99,235,0.03)', borderRadius: 8,
                                                            borderLeft: '3px solid rgba(37,99,235,0.2)',
                                                        }}>{step.say}</div>
                                                        <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.35)', fontStyle: 'italic' }}>↳ {step.why}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══ TEAM TAB ═══ */}
                {tab === 'team' && (
                    <div className="animate-in">
                        <div style={{ background: 'white', borderRadius: 14, padding: 24, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 20 }}>
                            <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em', marginBottom: 16 }}>TEAM PERFORMANCE — {S.firm.toUpperCase()}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0 }}>
                                {/* Header */}
                                <div style={{ display: 'grid', gridTemplateColumns: '200px 80px 90px 80px 70px 70px', gap: 8, padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                                    {['Designer', 'Close Rate', 'Avg Deal', 'Response', 'Calls', 'Score'].map(h => (
                                        <div key={h} style={{ fontFamily: mono, fontSize: 8, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em' }}>{h.toUpperCase()}</div>
                                    ))}
                                </div>
                                {/* Rows */}
                                {TEAM_MEMBERS.map((m, i) => (
                                    <div key={m.name} style={{
                                        display: 'grid', gridTemplateColumns: '200px 80px 90px 80px 70px 70px', gap: 8,
                                        padding: '14px 0', borderBottom: i < TEAM_MEMBERS.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                                        alignItems: 'center',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{
                                                width: 28, height: 28, borderRadius: '50%', background: m.color,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 10, fontWeight: 700, color: 'white', flexShrink: 0,
                                            }}>{m.name[0]}</div>
                                            <div>
                                                <div style={{ fontSize: 12, fontWeight: 600 }}>{m.name}</div>
                                                <div style={{ fontSize: 9, color: 'rgba(0,0,0,0.3)' }}>{m.role}</div>
                                            </div>
                                        </div>
                                        <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: m.closeRate >= 60 ? '#059669' : m.closeRate >= 50 ? '#D97706' : '#DC2626' }}>
                                            {m.closeRate}% {m.trend === 'up' ? '↑' : m.trend === 'down' ? '↓' : '→'}
                                        </div>
                                        <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 600, color: '#111' }}>S${(m.avgDeal / 1000).toFixed(0)}k</div>
                                        <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 600, color: m.responseHrs <= 3 ? '#059669' : '#D97706' }}>{m.responseHrs}h</div>
                                        <div style={{ fontFamily: mono, fontSize: 12, color: 'rgba(0,0,0,0.4)' }}>{m.calls}</div>
                                        <div style={{
                                            fontFamily: mono, fontSize: 12, fontWeight: 700,
                                            color: m.score >= 70 ? '#059669' : m.score >= 50 ? '#D97706' : '#DC2626',
                                        }}>{m.score}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Team Insights */}
                        <div style={{ background: 'rgba(139,92,246,0.02)', borderRadius: 14, padding: 24, border: '1px solid rgba(139,92,246,0.08)' }}>
                            <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: '#8B5CF6', letterSpacing: '0.1em', marginBottom: 14 }}>TEAM INSIGHTS</div>
                            {[
                                { insight: 'Sarah has the highest close rate (71%) — consider having her mentor Ahmad', type: 'opportunity' },
                                { insight: 'Ahmad\'s response time (6.5h) is hurting conversion — needs to go under 3h', type: 'alert' },
                                { insight: 'Team is spending S$297/month on individual Pro plans. Studio saves S$48/month.', type: 'upsell' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0' }}>
                                    <span style={{ fontSize: 12 }}>{item.type === 'alert' ? '⚠️' : item.type === 'upsell' ? '💰' : '💡'}</span>
                                    <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', lineHeight: 1.5 }}>{item.insight}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pricing CTA for locked features */}
                {tier === 'free' && tab === 'overview' && (
                    <div style={{ marginTop: 28, background: 'white', borderRadius: 14, padding: 28, border: '1px solid rgba(37,99,235,0.1)', textAlign: 'center' }}>
                        <div style={{ fontSize: 22, marginBottom: 8 }}>🔓</div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 4px' }}>Unlock Call Intelligence & Sales Scripts</h3>
                        <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', margin: '0 0 16px' }}>Upgrade to Pro for AI call analysis, coaching, and proven sales scripts.</p>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                            <button onClick={() => setTier('pro')} style={{
                                padding: '10px 28px', fontSize: 13, fontWeight: 600, background: '#2563EB', color: 'white',
                                border: 'none', borderRadius: 8, cursor: 'pointer',
                            }}>Pro — S$99/month</button>
                            <button onClick={() => setTier('studio')} style={{
                                padding: '10px 28px', fontSize: 13, fontWeight: 600, background: 'white', color: '#8B5CF6',
                                border: '1px solid rgba(139,92,246,0.2)', borderRadius: 8, cursor: 'pointer',
                            }}>Studio — S$249/month</button>
                        </div>
                    </div>
                )}
            </div>

            <footer style={{ padding: '28px 48px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 60 }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.25)', letterSpacing: '0.05em' }}>© 2026 ROOF · INTELLIGENCE</span>
                <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.2)' }}>Close more. Lose less. Know why.</span>
            </footer>
        </div>
    );
}
