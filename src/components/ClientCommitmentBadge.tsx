'use client';

import React from 'react';
import { Eye, Clock, Users, CalendarCheck, TrendingUp, AlertCircle } from 'lucide-react';

type CommitmentLevel = 'just_looking' | 'engaged' | 'shortlisted' | 'deciding' | 'committed';

interface ClientCommitmentBadgeProps {
    level: CommitmentLevel;
    viewCount?: number;
    timeSpentSeconds?: number;
    shortlistPosition?: number;
    shortlistTotal?: number;
    sectionHeatmap?: Record<string, number>;
    siteVisitBooked?: boolean;
    budgetDeclared?: boolean;
    expiresAt?: string;
}

const LEVEL_STYLES: Record<CommitmentLevel, { bg: string; border: string; text: string; dot: string; label: string }> = {
    just_looking: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-500', label: 'Just Looking' },
    engaged: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500', label: 'Engaged' },
    shortlisted: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', dot: 'bg-yellow-500', label: 'Shortlisted' },
    deciding: { bg: 'bg-notion-blue-bg', border: 'border-notion-blue/30', text: 'text-notion-blue', dot: 'bg-notion-blue', label: 'Deciding' },
    committed: { bg: 'bg-notion-green-bg', border: 'border-notion-green/30', text: 'text-notion-green', dot: 'bg-notion-green', label: 'Committed' },
};

/**
 * ClientCommitmentBadge 
 * 
 * What the ID sees next to each client's quote.
 * Traffic-light system: 🔴 Just Looking → 🟠 Engaged → 🟡 Shortlisted → 🟢 Committed
 */
export function ClientCommitmentBadge({
    level,
    viewCount = 0,
    timeSpentSeconds = 0,
    shortlistPosition,
    shortlistTotal,
    sectionHeatmap,
    siteVisitBooked,
    budgetDeclared,
    expiresAt
}: ClientCommitmentBadgeProps) {
    const style = LEVEL_STYLES[level];
    const timeMinutes = Math.round(timeSpentSeconds / 60);

    // Sort sections by engagement
    const topSections = sectionHeatmap
        ? Object.entries(sectionHeatmap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
        : [];

    const daysUntilExpiry = expiresAt
        ? Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : null;

    return (
        <div className={`rounded-2xl border ${style.border} ${style.bg} p-4 space-y-3`}>
            {/* Header: Commitment Level */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${style.dot} animate-pulse`} />
                    <span className={`text-xs font-black ${style.text} uppercase tracking-widest`}>{style.label}</span>
                </div>
                {daysUntilExpiry !== null && (
                    <div className={`text-[9px] font-bold ${daysUntilExpiry <= 2 ? 'text-red-500' : 'text-notion-text-gray'} flex items-center gap-1`}>
                        <Clock className="w-3 h-3" />
                        {daysUntilExpiry}d left
                    </div>
                )}
            </div>

            {/* Engagement Metrics */}
            <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center p-2 bg-white rounded-lg border border-notion-border/50">
                    <Eye className="w-3.5 h-3.5 text-notion-text-gray mb-1" />
                    <span className="text-sm font-black text-notion-text">{viewCount}</span>
                    <span className="text-[8px] text-notion-text-gray font-bold uppercase">Views</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-white rounded-lg border border-notion-border/50">
                    <Clock className="w-3.5 h-3.5 text-notion-text-gray mb-1" />
                    <span className="text-sm font-black text-notion-text">{timeMinutes}m</span>
                    <span className="text-[8px] text-notion-text-gray font-bold uppercase">Reading</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-white rounded-lg border border-notion-border/50">
                    <Users className="w-3.5 h-3.5 text-notion-text-gray mb-1" />
                    <span className="text-sm font-black text-notion-text">
                        {shortlistPosition ? `${shortlistPosition}/${shortlistTotal}` : '—'}
                    </span>
                    <span className="text-[8px] text-notion-text-gray font-bold uppercase">Rank</span>
                </div>
            </div>

            {/* Section Heatmap */}
            {topSections.length > 0 && (
                <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-notion-text-gray uppercase tracking-widest">Interest Heatmap</span>
                    {topSections.map(([section, seconds]) => {
                        const maxSeconds = topSections[0][1] as number;
                        const widthPct = Math.round(((seconds as number) / maxSeconds) * 100);
                        return (
                            <div key={section} className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-notion-text w-20 truncate">{section}</span>
                                <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-notion-border/30">
                                    <div
                                        className={`h-full rounded-full ${(seconds as number) > 120 ? 'bg-notion-green' : (seconds as number) > 30 ? 'bg-notion-orange' : 'bg-notion-text-gray/30'}`}
                                        style={{ width: `${widthPct}%` }}
                                    />
                                </div>
                                <span className="text-[9px] font-bold text-notion-text-gray w-8 text-right">{Math.round((seconds as number) / 60)}m</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Commitment Signals */}
            <div className="flex gap-2">
                <div className={`flex-1 p-2 rounded-lg text-center ${budgetDeclared ? 'bg-notion-green-bg border border-notion-green/20' : 'bg-white border border-notion-border/30'}`}>
                    <TrendingUp className={`w-3 h-3 mx-auto mb-0.5 ${budgetDeclared ? 'text-notion-green' : 'text-notion-text-gray/30'}`} />
                    <span className={`text-[8px] font-black uppercase ${budgetDeclared ? 'text-notion-green' : 'text-notion-text-gray/30'}`}>Budget</span>
                </div>
                <div className={`flex-1 p-2 rounded-lg text-center ${siteVisitBooked ? 'bg-notion-green-bg border border-notion-green/20' : 'bg-white border border-notion-border/30'}`}>
                    <CalendarCheck className={`w-3 h-3 mx-auto mb-0.5 ${siteVisitBooked ? 'text-notion-green' : 'text-notion-text-gray/30'}`} />
                    <span className={`text-[8px] font-black uppercase ${siteVisitBooked ? 'text-notion-green' : 'text-notion-text-gray/30'}`}>Site Visit</span>
                </div>
            </div>
        </div>
    );
}
