'use client';

import React, { useState } from 'react';
import { Shield, QrCode, CheckCircle2, AlertCircle, MapPin, Clock, Info } from 'lucide-react';

interface SecureHandshakeProps {
    role: 'client' | 'pro';
    alias: string;
    karmaStatus: string;
    onVerified?: () => void;
}

/**
 * SecureHandshake Component
 * 
 * Solves the "Not sure if it's you" problem by bridging the masked alias 
 * and the physical person via a secure QR exchange.
 */
export function SecureHandshake({ role, alias, karmaStatus, onVerified }: SecureHandshakeProps) {
    const [status, setStatus] = useState<'idle' | 'scanning' | 'verified' | 'failed'>('idle');

    if (role === 'pro') {
        return (
            <div className="bg-white p-6 rounded-3xl border border-notion-border shadow-sm flex flex-col items-center text-center">
                <div className="mb-4 p-4 bg-notion-bg-secondary rounded-2xl border-2 border-dashed border-notion-border">
                    <QrCode className="w-48 h-48 text-notion-text opacity-80" />
                </div>
                <h4 className="text-sm font-bold text-notion-text mb-1">Secure Check-in</h4>
                <p className="text-[10px] text-notion-text-gray mb-4 max-w-[200px]">
                    Display this to the client to verify your <span className="text-notion-blue font-bold">{alias}</span> identity.
                </p>
                <div className="flex items-center gap-2 bg-notion-green-bg px-3 py-1.5 rounded-full border border-notion-green/20">
                    <Shield className="w-3 h-3 text-notion-green" />
                    <span className="text-[10px] font-black text-notion-green uppercase tracking-wider">{karmaStatus} STATUS</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-notion-bg-secondary p-8 rounded-3xl border border-notion-border text-center">
            {status === 'idle' && (
                <div className="space-y-6">
                    <div className="w-16 h-16 bg-notion-blue-bg rounded-full flex items-center justify-center mx-auto">
                        <Shield className="w-8 h-8 text-notion-blue" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-notion-text mb-2">Verify Professional</h3>
                        <p className="text-xs text-notion-text-gray leading-relaxed">
                            Masked accountability protects everyone. Scan the Professional's QR code to verify they are the <span className="font-bold text-notion-text">{alias}</span> assigned to this task.
                        </p>
                    </div>
                    <button
                        onClick={() => setStatus('scanning')}
                        className="w-full py-4 bg-notion-blue text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-notion-blue/20"
                    >
                        <QrCode className="w-5 h-5" />
                        Scan Secure ID
                    </button>
                </div>
            )}

            {status === 'scanning' && (
                <div className="space-y-6">
                    <div className="relative w-full aspect-square bg-black rounded-2xl overflow-hidden border-2 border-notion-blue">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 border-2 border-notion-blue animate-pulse rounded-lg" />
                            <div className="absolute top-0 left-0 w-full h-1 bg-notion-blue shadow-[0_0_15px_rgba(0,121,191,1)] animate-scan" />
                        </div>
                    </div>
                    <p className="text-xs font-bold text-notion-blue animate-pulse uppercase tracking-widest">Identifying Professional...</p>
                    <button onClick={() => setStatus('verified')} className="text-[10px] font-bold text-notion-text-gray underline">Bypass for Demo</button>
                </div>
            )}

            {status === 'verified' && (
                <div className="space-y-6 py-4 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-notion-green-bg rounded-full flex items-center justify-center mx-auto border-2 border-notion-green shadow-sm shadow-notion-green/30">
                        <CheckCircle2 className="w-10 h-10 text-notion-green" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-notion-text mb-1 uppercase tracking-tighter">Verification Success</h3>
                        <p className="text-xs text-notion-text-gray">Identity Confirmed</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-notion-border text-left space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-notion-border/50">
                            <span className="text-[10px] font-bold text-notion-text-gray uppercase">Masked Alias</span>
                            <span className="text-xs font-black text-notion-blue">{alias}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-notion-border/50">
                            <span className="text-[10px] font-bold text-notion-text-gray uppercase">Karma Tier</span>
                            <span className="text-xs font-black text-notion-green uppercase tracking-widest italic">{karmaStatus}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1 text-notion-text-gray">
                            <Clock className="w-3 h-3" />
                            <span className="text-[9px] font-medium">Session Logged: {new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 p-3 bg-notion-blue-bg rounded-xl border border-notion-blue/20">
                        <Info className="w-4 h-4 text-notion-blue shrink-0 mt-0.5" />
                        <p className="text-[10px] text-notion-text text-left leading-relaxed">
                            This professional is verified by the Roof Platform. You are protected by our <span className="font-bold">Anti-Ghosting Protocol</span> and <span className="font-bold">Escrow Guarantee</span>.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
