"use client";

import { useState, useEffect } from "react";
import { useRoofAuth } from "@/context/RoofAuthContext";
import { getProjects, getQuotes, getLeads } from "@/lib/supabase-data";
import RoofNav from "@/components/RoofNav";

// ── Cockpit Data ──

const MONTHLY_REVENUE = [
    { month: "Sep", value: 42000 },
    { month: "Oct", value: 58000 },
    { month: "Nov", value: 51000 },
    { month: "Dec", value: 73000 },
    { month: "Jan", value: 65000 },
    { month: "Feb", value: 89000 },
];

const PIPELINE_STAGES = [
    { stage: "New", count: 8, color: "#E5E5E5" },
    { stage: "Contacted", count: 5, color: "#93C5FD" },
    { stage: "Site Visit", count: 3, color: "#60A5FA" },
    { stage: "Quoting", count: 4, color: "#3B82F6" },
    { stage: "Negotiating", count: 2, color: "#1D4ED8" },
    { stage: "Won", count: 6, color: "#111" },
];

const TRADE_PROGRESS = [
    { trade: "Hacking", pct: 100 },
    { trade: "Electrical", pct: 60 },
    { trade: "Plumbing", pct: 40 },
    { trade: "Tiling", pct: 0 },
    { trade: "Carpentry", pct: 0 },
    { trade: "Painting", pct: 0 },
];

const WEEKLY_ACTIVITY = [3, 5, 2, 7, 4, 6, 8, 5, 9, 3, 6, 4, 7, 5];

interface Tool {
    name: string;
    desc: string;
    href: string;
    stat?: string;
}

interface Column {
    title: string;
    tools: Tool[];
}

export default function HubPage() {
    const { user } = useRoofAuth();
    const [stats, setStats] = useState<Record<string, string>>({});
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [projects, quotes, leads] = await Promise.all([
                    getProjects(), getQuotes(), getLeads(),
                ]);
                setStats({
                    leads: leads.length.toString(),
                    quotes: quotes.length.toString(),
                    projects: projects.length.toString(),
                    won: projects.filter(p => p.status === 'signed').length.toString(),
                });
            } catch { /* silent */ }
        }
        fetchStats();
    }, []);

    const maxRev = Math.max(...MONTHLY_REVENUE.map(m => m.value));
    const totalPipeline = PIPELINE_STAGES.reduce((s, p) => s + p.count, 0);
    const maxActivity = Math.max(...WEEKLY_ACTIVITY);

    const columns: Column[] = [
        {
            title: "Pre-sale",
            tools: [
                { name: "Follow-Up", desc: "Lead pipeline", href: "/follow-up", stat: stats.leads && stats.leads !== "0" ? stats.leads : undefined },
                { name: "Intelligence", desc: "Market insights", href: "/intelligence" },
                { name: "Autopilot", desc: "Auto outreach", href: "/autopilot" },
            ],
        },
        {
            title: "Design",
            tools: [
                { name: "Sequence", desc: "Design studio + 3D", href: "/sequence" },
                { name: "Quote Builder", desc: "Build quotes", href: "/quote-builder", stat: stats.quotes && stats.quotes !== "0" ? stats.quotes : undefined },
            ],
        },
        {
            title: "Ops",
            tools: [
                { name: "Dispatch", desc: "Vendor deployment", href: "/dispatch" },
                { name: "PaddleDuck", desc: "Site command", href: "/paddleduck" },
                { name: "Ledger", desc: "Financials", href: "/ledger" },
            ],
        },
        {
            title: "Tools",
            tools: [
                { name: "Projects", desc: "Portfolio", href: "/projects", stat: stats.projects && stats.projects !== "0" ? stats.projects : undefined },
                { name: "Forecast", desc: "Revenue model", href: "/forecast" },
                { name: "Price Index", desc: "Market rates", href: "/price-index" },
                { name: "Inspect", desc: "Quality control", href: "/inspect" },
                { name: "Measure", desc: "Site survey", href: "/measure" },
            ],
        },
    ];

    const f = "'Inter', 'Helvetica Neue', -apple-system, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

    return (
        <div style={{ fontFamily: f, minHeight: "100vh", background: "#0A0A0A", color: "#E5E5E5" }}>
            <RoofNav />

            <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 32px 60px" }}>
                {/* ── Top Strip: Time + Status ── */}
                <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                            Command Center
                        </div>
                        <div style={{ fontFamily: mono, fontSize: 28, fontWeight: 300, letterSpacing: "-0.02em", color: "#fff", marginTop: 2 }}>
                            {time.toLocaleTimeString("en-SG", { hour12: false })}
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 32 }}>
                        {[
                            { label: "Pipeline", value: stats.leads || "0", sub: "leads" },
                            { label: "Active", value: stats.projects || "0", sub: "projects" },
                            { label: "Quotes", value: stats.quotes || "0", sub: "drafted" },
                            { label: "Won", value: stats.won || "0", sub: "signed" },
                        ].map(m => (
                            <div key={m.label} style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                                    {m.label}
                                </div>
                                <div style={{ fontFamily: mono, fontSize: 24, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>
                                    {m.value}
                                </div>
                                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{m.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Analytics Row ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>

                    {/* Revenue Bar Chart */}
                    <div style={{
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 10, padding: "16px 20px",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                Monthly Revenue
                            </span>
                            <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: "#4ADE80" }}>
                                +37%
                            </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
                            {MONTHLY_REVENUE.map((m, i) => (
                                <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                    <div style={{
                                        width: "100%", borderRadius: 3,
                                        height: Math.max(8, (m.value / maxRev) * 80),
                                        background: i === MONTHLY_REVENUE.length - 1
                                            ? "linear-gradient(to top, #3B82F6, #60A5FA)"
                                            : "rgba(255,255,255,0.08)",
                                        transition: "height 0.3s",
                                    }} />
                                    <span style={{ fontSize: 8, color: "rgba(255,255,255,0.2)" }}>{m.month}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ fontFamily: mono, fontSize: 18, fontWeight: 700, color: "#fff", marginTop: 8 }}>
                            ${(MONTHLY_REVENUE[MONTHLY_REVENUE.length - 1].value / 1000).toFixed(0)}k
                        </div>
                    </div>

                    {/* Pipeline Funnel */}
                    <div style={{
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 10, padding: "16px 20px",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                Pipeline
                            </span>
                            <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: "#fff" }}>
                                {totalPipeline} leads
                            </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {PIPELINE_STAGES.map(p => (
                                <div key={p.stage} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", width: 56, textAlign: "right" }}>{p.stage}</span>
                                    <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.04)", borderRadius: 3, overflow: "hidden" }}>
                                        <div style={{
                                            height: "100%", borderRadius: 3,
                                            width: `${(p.count / 10) * 100}%`,
                                            background: p.color, transition: "width 0.3s",
                                        }} />
                                    </div>
                                    <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, color: "#fff", width: 20, textAlign: "right" }}>{p.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activity Sparkline + Trade Progress */}
                    <div style={{
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 10, padding: "16px 20px",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                Active Project
                            </span>
                            <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 10, background: "rgba(74,222,128,0.15)", color: "#4ADE80", fontWeight: 700 }}>
                                ON TRACK
                            </span>
                        </div>

                        {/* Mini sparkline */}
                        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 28, marginBottom: 12 }}>
                            {WEEKLY_ACTIVITY.map((v, i) => (
                                <div key={i} style={{
                                    flex: 1, borderRadius: 1,
                                    height: Math.max(3, (v / maxActivity) * 24),
                                    background: i >= WEEKLY_ACTIVITY.length - 3
                                        ? "rgba(74,222,128,0.5)"
                                        : "rgba(255,255,255,0.06)",
                                }} />
                            ))}
                        </div>

                        {/* Trade bars */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            {TRADE_PROGRESS.map(t => (
                                <div key={t.trade} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", width: 48, textAlign: "right" }}>{t.trade}</span>
                                    <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 2, overflow: "hidden" }}>
                                        <div style={{
                                            height: "100%", borderRadius: 2,
                                            width: `${t.pct}%`,
                                            background: t.pct === 100 ? "#4ADE80" : t.pct > 0 ? "#3B82F6" : "transparent",
                                        }} />
                                    </div>
                                    <span style={{ fontFamily: mono, fontSize: 9, color: t.pct === 100 ? "#4ADE80" : t.pct > 0 ? "#60A5FA" : "rgba(255,255,255,0.15)", width: 24, textAlign: "right" }}>
                                        {t.pct}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Tool Grid (Kanban) ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
                    {columns.map(col => (
                        <div key={col.title}>
                            <div style={{
                                display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
                                paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.06)",
                            }}>
                                <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                                    {col.title}
                                </span>
                                <span style={{ fontFamily: mono, fontSize: 9, color: "rgba(255,255,255,0.12)" }}>
                                    {col.tools.length}
                                </span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                {col.tools.map(tool => (
                                    <a
                                        key={tool.name}
                                        href={tool.href}
                                        style={{
                                            display: "block", textDecoration: "none",
                                            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: 8, padding: "10px 14px",
                                            transition: "all 0.15s",
                                        }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: "#E5E5E5" }}>
                                                {tool.name}
                                            </span>
                                            {tool.stat && (
                                                <span style={{
                                                    fontFamily: mono, fontSize: 9, fontWeight: 700,
                                                    padding: "2px 6px", borderRadius: 8,
                                                    background: "rgba(59,130,246,0.15)", color: "#60A5FA",
                                                }}>
                                                    {tool.stat}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 2 }}>
                                            {tool.desc}
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
