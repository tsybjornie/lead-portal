'use client';

import React from 'react';
import { Shield, Zap, Info, Camera, ArrowRight, DollarSign } from 'lucide-react';

interface RescueDispatchProps {
    projectAddress: string;
    taskCategory: string;
    reservedFunds: number;
    rescueBonus?: number;
    karmaMultiplier?: number; // e.g. 2
    isInstantPayoutEligible: boolean;
    previousLogs: string[];
    ghostingReason: string;
    onAccept: () => void;
}

/**
 * RescueDispatchCard
 * 
 * What a "Backup Vendor" sees when a ghosting event occurs.
 * Priority: Confidence (Money is there) & Context (I know what I'm walking into).
 */
export function RescueDispatchCard({
    projectAddress,
    taskCategory,
    reservedFunds,
    rescueBonus,
    previousLogs,
    ghostingReason,
    onAccept
}: RescueDispatchProps) {
    return (
        <div className="bg-white rounded-2xl border-2 border-notion-blue shadow-xl overflow-hidden max-w-sm">
            {/* Header: High Priority */}
            <div className="p-4 bg-notion-blue-bg flex items-center justify-between border-b border-notion-blue/20">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-notion-blue rounded-lg">
                        <Zap className="w-4 h-4 text-white fill-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-notion-blue uppercase tracking-tighter italic">Rescue Dispatch</h3>
                        <p className="text-[10px] text-notion-blue/70 font-bold">Priority Coverage Required</p>
                    </div>
                </div>
                <div className="px-2 py-1 bg-white rounded-full border border-notion-blue/30 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-notion-blue" />
                    <span className="text-[9px] font-black text-notion-blue">ESCROW LOCKED</span>
                </div>
            </div>

            {/* Site Context Snapshot */}
            <div className="relative h-40 bg-notion-bg-secondary group">
                {previousLogs.length > 0 ? (
                    <img
                        src={previousLogs[0]}
                        alt="Current Site State"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-notion-text-gray opacity-30">
                        <Camera className="w-8 h-8 mb-2" />
                        <span className="text-[10px] font-bold uppercase">No State Photos Available</span>
                    </div>
                )}
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-white text-[9px] font-bold flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Last Site State: 4h ago
                </div>
            </div>

            <div className="p-5 space-y-4">
                {/* Details */}
                <div>
                    <h4 className="text-xs font-black text-notion-text mb-1 uppercase tracking-tight">{taskCategory} Replacement</h4>
                    <p className="text-[11px] text-notion-text-gray font-medium leading-tight">{projectAddress}</p>
                    <div className="mt-2 text-[10px] text-notion-orange font-bold flex gap-2 items-center bg-notion-orange-bg px-2 py-1 rounded inline-block">
                        <ArrowRight className="w-3 h-3" />
                        Prev. Vendor: {ghostingReason}
                    </div>
                </div>

                {/* Financial Guarantee */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-white rounded-xl border border-notion-blue/30 shadow-sm">
                        <div className="text-[9px] font-black text-notion-blue uppercase mb-1">Guaranteed Fund</div>
                        <div className="text-sm font-black text-notion-text tracking-tight">${reservedFunds.toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-notion-blue-bg rounded-xl border border-notion-blue/30">
                        <div className="text-[9px] font-black text-notion-blue uppercase mb-1">Karma Boost</div>
                        <div className="text-sm font-black text-notion-blue tracking-tight">3.0x Multiplier</div>
                    </div>
                </div>

                {/* Rescue Bounty & Fee Waiver */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between p-2.5 bg-notion-green-bg rounded-lg border border-notion-green/30">
                        <div className="flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-notion-green" />
                            <span className="text-[10px] font-black text-notion-green uppercase">Rectification Fee</span>
                        </div>
                        <span className="text-xs font-black text-notion-green">INCLUDED</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-notion-blue-bg rounded-lg border border-notion-blue/20">
                        <div className="flex items-center gap-2">
                            <Camera className="w-3.5 h-3.5 text-notion-blue" />
                            <span className="text-[10px] font-black text-notion-blue uppercase">Site Audit Verified</span>
                        </div>
                        <span className="text-xs font-black text-notion-blue italic">5 Photos</span>
                    </div>
                </div>

                {/* Liability Shield Badge */}
                <div className="flex items-center gap-2 p-2 bg-black rounded-lg border border-white/10">
                    <div className="w-6 h-6 rounded bg-notion-blue/20 flex items-center justify-center">
                        <Shield className="w-3 h-3 text-notion-blue" />
                    </div>
                    <div>
                        <div className="text-[9px] font-black text-white uppercase leading-none">Liability Hybrid Shield</div>
                        <div className="text-[8px] text-white/50 font-bold uppercase tracking-widest mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">You are not responsible for legacy defects</div>
                    </div>
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                    <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-notion-blue mt-1.5" />
                        <p className="text-[10px] text-notion-text-gray font-medium">Payment released <span className="font-bold text-notion-text">INSTANTLY</span> on verified mobilization photo.</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-notion-blue mt-1.5" />
                        <p className="text-[10px] text-notion-text-gray font-medium">All drawings and IFC context pre-shared for zero-lag start.</p>
                    </div>
                </div>

                <button
                    onClick={onAccept}
                    className="w-full py-3 bg-notion-blue text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-notion-blue/20 hover:bg-notion-blue/90 transition-all flex items-center justify-center gap-2"
                >
                    <Zap className="w-4 h-4 fill-white" />
                    Accept Rescue Mission
                </button>
            </div>
        </div>
    );
}
