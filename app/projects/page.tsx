'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, FolderOpen, Clock, Plus, MoreHorizontal, TrendingUp, AlertCircle } from 'lucide-react';
import { getProjects, Project } from '@/lib/supabase-data';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    lead: { label: 'Lead', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
    quoted: { label: 'Quoted', bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-400' },
    signed: { label: 'Signed', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-400' },
    active: { label: 'Active', bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-400' },
    completed: { label: 'Completed', bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-400' },
};

function formatCurrency(n?: number): string {
    if (!n) return '—';
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`;
    return `$${n.toFixed(0)}`;
}

function timeAgo(dateStr: string): string {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 30) return `${diffDay}d ago`;
    return `${Math.floor(diffDay / 30)}mo ago`;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function load() {
            const data = await getProjects();
            setProjects(data);
            setLoading(false);
        }
        load();
    }, []);

    const filtered = projects.filter(p => {
        if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
        if (searchQuery && !p.client_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const stats = {
        total: projects.length,
        active: projects.filter(p => p.status === 'active' || p.status === 'signed').length,
        leads: projects.filter(p => p.status === 'lead').length,
        value: projects.reduce((sum, p) => sum + (p.budget_max || p.budget_min || 0), 0),
    };

    return (
        <div className="min-h-screen bg-[#fafafa]" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <header className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <Link href="/hub" className="text-[#999] hover:text-[#111] transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-[#111]">Projects</h1>
                        <p className="text-[11px] text-[#999] tracking-widest uppercase font-medium">Pipeline overview</p>
                    </div>
                </div>
                <Link
                    href="/quote-builder"
                    className="flex items-center gap-2 bg-[#111] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#333] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Quote
                </Link>
            </header>

            {/* Stats */}
            <div className="px-8 py-4 flex gap-4">
                {[
                    { label: 'Total Projects', value: stats.total, color: 'text-[#111]' },
                    { label: 'Active', value: stats.active, color: 'text-purple-600' },
                    { label: 'Leads', value: stats.leads, color: 'text-blue-600' },
                    { label: 'Pipeline Value', value: formatCurrency(stats.value), color: 'text-green-600' },
                ].map((stat) => (
                    <div key={stat.label} className="flex-1 bg-white rounded-xl border border-gray-100 p-4">
                        <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-[10px] font-bold text-[#999] uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div className="px-8 py-2 flex gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ccc]" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-100 text-sm focus:outline-none focus:border-[#111] transition-colors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-1 bg-white rounded-lg border border-gray-100 p-1">
                    {(['ALL', 'lead', 'quoted', 'signed', 'active', 'completed'] as const).map((s) => (
                        <button
                            key={s}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${statusFilter === s ? 'bg-[#111] text-white' : 'text-[#999] hover:text-[#111]'}`}
                            onClick={() => setStatusFilter(s)}
                        >
                            {s === 'ALL' ? 'All' : s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Project List */}
            <div className="px-8 py-4 space-y-2">
                {loading ? (
                    <div className="text-center py-20 text-[#999]">
                        <div className="animate-spin w-8 h-8 border-2 border-[#111] border-t-transparent rounded-full mx-auto mb-4" />
                        Loading projects...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <FolderOpen className="w-12 h-12 text-[#ddd] mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-[#999] mb-2">
                            {projects.length === 0 ? 'No projects yet' : 'No matching projects'}
                        </h3>
                        <p className="text-sm text-[#bbb] mb-6">
                            {projects.length === 0
                                ? 'Convert a lead from the Pipeline or create a new quote to get started.'
                                : 'Try adjusting your filters.'}
                        </p>
                        {projects.length === 0 && (
                            <div className="flex gap-3 justify-center">
                                <Link href="/follow-up" className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 text-[#666] hover:border-[#111] hover:text-[#111] transition-colors">
                                    View Pipeline
                                </Link>
                                <Link href="/quote-builder" className="px-4 py-2 rounded-lg text-sm font-medium bg-[#111] text-white hover:bg-[#333] transition-colors">
                                    New Quote
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    filtered.map((project) => {
                        const cfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.lead;
                        return (
                            <div key={project.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-[#111]/20 transition-all cursor-pointer group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-[#111] text-sm">{project.client_name}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${cfg.bg} ${cfg.text}`}>
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-[#999] mt-0.5">
                                                {project.property_type || '—'} · {project.property_address || '—'} · {formatCurrency(project.budget_min)}–{formatCurrency(project.budget_max)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        {project.style && (
                                            <div className="text-right">
                                                <div className="text-[10px] font-bold text-[#ccc] uppercase tracking-wider">Style</div>
                                                <div className="text-xs text-[#666]">{project.style}</div>
                                            </div>
                                        )}
                                        <div className="text-right">
                                            <div className="text-[10px] font-bold text-[#ccc] uppercase tracking-wider flex items-center gap-1 justify-end">
                                                <Clock className="w-3 h-3" />
                                                Created
                                            </div>
                                            <div className="text-xs text-[#999]">{timeAgo(project.created_at)}</div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href="/quote-builder"
                                                className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#111] text-white hover:bg-[#333] transition-colors"
                                            >
                                                Quote
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
