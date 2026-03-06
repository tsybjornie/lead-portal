'use client';

import React, { useState } from 'react';
import { Camera, CheckCircle2, Clock, DollarSign, List, Search, Upload, FileText, QrCode } from 'lucide-react';

export function WorkerViewport() {
    const [activeTab, setActiveTab] = useState<'TASKS' | 'PAYOUTS' | 'PHOTOS' | 'PORTFOLIO'>('TASKS');

    const DEMO_TASKS = [
        { id: '1', title: 'Master Bedroom Cabinetry Installation', status: 'IN_PROGRESS', location: 'Master Bedroom', deadline: 'Today' },
        { id: '2', title: 'Kitchen Lower Cabinets - Alignment', status: 'PENDING', location: 'Kitchen', deadline: 'Tomorrow' },
        { id: '3', title: 'Living Room TV Console - Base', status: 'COMPLETED', location: 'Living Room', deadline: 'Done' },
    ];

    return (
        <div className="min-h-screen bg-notion-bg-secondary font-inter pb-20">
            {/* Header */}
            <div className="bg-white p-4 border-b border-notion-border sticky top-0 z-50">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-notion-text">Site Worker Portal</h1>
                        <p className="text-xs text-notion-text-gray font-medium">Project: 84BDRL - Bishan Residence</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="w-10 h-10 rounded-full bg-notion-blue-bg flex items-center justify-center text-notion-blue font-bold border-2 border-white shadow-sm mb-1">
                            KS
                        </div>
                        <div className="flex items-center gap-1 bg-notion-green-bg px-1.5 py-0.5 rounded border border-notion-green/30">
                            <div className="w-1.5 h-1.5 rounded-full bg-notion-green animate-pulse" />
                            <span className="text-[8px] font-bold text-notion-green uppercase tracking-tighter">Gold Karma</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    {/* Internal Status (Karma) */}
                    <div className="flex-1 bg-white p-4 rounded-2xl border border-notion-border shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-[10px] font-bold text-notion-text-gray uppercase tracking-widest">Internal Karma</span>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-2xl font-black text-notion-text">842</span>
                                <div className="px-2 py-0.5 bg-notion-green-bg rounded text-[8px] font-black text-notion-green uppercase tracking-tighter">Gold Tier</div>
                            </div>
                        </div>
                        <p className="text-[9px] text-notion-text-gray mt-2 leading-tight">
                            You are in the <span className="font-bold text-notion-text">Top 2%</span> of carpenters. 3.0x Karma Multiplier applied to next rescue mission.
                        </p>
                    </div>

                    {/* Secure Handshake Trigger */}
                    <div className="flex-1 bg-notion-blue-bg p-4 rounded-2xl border border-notion-blue/20 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-notion-blue/10 transition-all">
                        <QrCode className="w-8 h-8 text-notion-blue mb-2" />
                        <span className="text-[10px] font-black text-notion-blue uppercase tracking-widest">Secure Handshake</span>
                        <p className="text-[8px] text-notion-blue/60 mt-1">Show QR to client on-site</p>
                    </div>
                </div>

                {/* Tab Selector */}
                <div className="flex gap-2 p-1 bg-notion-bg-secondary rounded-lg border border-notion-border overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('TASKS')}
                        className={`min-w-[80px] py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'TASKS' ? 'bg-white shadow-sm text-notion-text border border-notion-border' : 'text-notion-text-gray'}`}
                    >
                        Daily Tasks
                    </button>
                    <button
                        onClick={() => setActiveTab('PHOTOS')}
                        className={`min-w-[80px] py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'PHOTOS' ? 'bg-white shadow-sm text-notion-text border border-notion-border' : 'text-notion-text-gray'}`}
                    >
                        Photo Logs
                    </button>
                    <button
                        onClick={() => setActiveTab('PORTFOLIO')}
                        className={`min-w-[80px] py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'PORTFOLIO' ? 'bg-white shadow-sm text-notion-text border border-notion-border' : 'text-notion-text-gray'}`}
                    >
                        Portfolio
                    </button>
                    <button
                        onClick={() => setActiveTab('PAYOUTS')}
                        className={`min-w-[80px] py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'PAYOUTS' ? 'bg-white shadow-sm text-notion-text border border-notion-border' : 'text-notion-text-gray'}`}
                    >
                        Earnings
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4 max-w-lg mx-auto">
                {activeTab === 'TASKS' && (
                    <div className="space-y-3">
                        <h2 className="text-[10px] uppercase font-bold text-notion-text-gray tracking-wider mb-2">Assigned For Today</h2>
                        {DEMO_TASKS.map(task => (
                            <div key={task.id} className="notion-card bg-white p-4 flex items-center gap-4 border border-notion-border rounded-xl">
                                <div className={`p-2 rounded-lg ${task.status === 'COMPLETED' ? 'bg-notion-green-bg text-notion-green' : 'bg-notion-orange-bg text-notion-orange'}`}>
                                    {task.status === 'COMPLETED' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-notion-text leading-tight">{task.title}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-notion-bg-secondary border border-notion-border text-notion-text-gray">{task.location}</span>
                                        <span className="text-[10px] font-bold text-notion-blue">{task.deadline}</span>
                                    </div>
                                </div>
                                <button className="p-2 rounded-full border border-notion-border hover:bg-notion-hover">
                                    <Camera className="w-5 h-5 text-notion-text-gray" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'PHOTOS' && (
                    <div className="space-y-4">
                        <div className="p-8 border-2 border-dashed border-notion-border rounded-2xl bg-white text-center">
                            <Upload className="w-10 h-10 text-notion-text-gray mx-auto mb-3" />
                            <h3 className="text-sm font-bold">Upload Photo Evidence</h3>
                            <p className="text-xs text-notion-text-gray mt-1">Take a photo to verify task completion</p>
                            <button className="mt-4 px-6 py-2 bg-notion-text text-white rounded-lg text-sm font-bold">Open Camera</button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <h2 className="col-span-2 text-[10px] uppercase font-bold text-notion-text-gray tracking-wider">Recently Uploaded</h2>
                            <div className="aspect-square rounded-xl bg-notion-hover border border-notion-border overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1581094794329-c811ce18dbf3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Evidence" className="w-full h-full object-cover" />
                            </div>
                            <div className="aspect-square rounded-xl bg-notion-hover border border-notion-border overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1504307651254-35680f3366d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Evidence" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'PORTFOLIO' && (
                    <div className="space-y-6">
                        <div className="text-center p-6 bg-white rounded-2xl border border-notion-border">
                            <div className="w-20 h-20 rounded-full bg-notion-blue-bg mx-auto flex items-center justify-center text-notion-blue text-2xl font-bold mb-3 border-2 border-white shadow-sm">
                                KS
                            </div>
                            <h2 className="text-lg font-bold">Kumar Saravanan</h2>
                            <p className="text-xs text-notion-text-gray font-medium">Expert Carpenter • 8 Years Exp</p>

                            <div className="flex justify-center gap-6 mt-4">
                                <div className="text-center">
                                    <p className="text-sm font-bold text-notion-blue">Precision</p>
                                    <p className="text-[10px] text-notion-text-gray uppercase tracking-wider">Mastery</p>
                                </div>
                                <div className="w-[1px] bg-notion-border h-8" />
                                <div className="text-center">
                                    <p className="text-sm font-bold text-notion-blue">Laser-Level</p>
                                    <p className="text-[10px] text-notion-text-gray uppercase tracking-wider">Tooling</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] uppercase font-bold text-notion-text-gray tracking-wider mb-3">Technical Capability Audit</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="bg-white p-4 rounded-xl border border-notion-border">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-notion-blue-bg text-notion-blue border border-notion-blue">Verified Technicality</span>
                                        <div className="flex gap-1">
                                            <span className="text-[9px] font-bold bg-notion-green-bg text-notion-green px-1.5 py-0.5 rounded border border-notion-green/30">End Result: PERFECT</span>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <p className="text-xs font-bold text-notion-text">Custom Kitchen Cabinetry - Bishan 84BDRL</p>
                                        <p className="text-[11px] text-notion-text-gray mt-1 leading-relaxed">
                                            Used specialized <span className="text-notion-text font-semibold">Festool extraction</span> for dustless cutting.
                                            Alignment verified via <span className="text-notion-text font-semibold">Laser Cross-Line</span>.
                                            Seamless edge-bonding methodology.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="text-[9px] font-bold bg-notion-bg-secondary text-notion-text px-2 py-1 rounded border border-notion-border">Festool TS-55</span>
                                        <span className="text-[9px] font-bold bg-notion-bg-secondary text-notion-text px-2 py-1 rounded border border-notion-border">Bosch Laser GLL</span>
                                        <span className="text-[9px] font-bold bg-notion-bg-secondary text-notion-text px-2 py-1 rounded border border-notion-border">Zero-Gap Jointing</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="aspect-video bg-notion-hover rounded-lg border border-notion-border overflow-hidden relative group">
                                            <img src="https://images.unsplash.com/photo-1541123351-ad3bad3e158a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Work" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[8px] text-white font-bold bg-notion-blue px-1 rounded">Laser-Verified</span>
                                            </div>
                                        </div>
                                        <div className="aspect-video bg-notion-hover rounded-lg border border-notion-border overflow-hidden relative group">
                                            <img src="https://images.unsplash.com/photo-1517581177682-a083bd00b35a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="End Result" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[8px] text-white font-bold bg-notion-green px-1 rounded">End Result</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-3 bg-white border border-notion-border rounded-xl text-xs font-bold text-notion-text-gray hover:bg-notion-hover transition-all">
                            Deep-link to Full Technical Resume
                        </button>
                    </div>
                ) as unknown as React.ReactNode}
            </div>

            {/* Bottom Nav Mobile Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-notion-border p-3 flex justify-around items-center h-16 safe-area-bottom">
                <button className="flex flex-col items-center gap-1 text-notion-blue">
                    <List className="w-5 h-5" />
                    <span className="text-[9px] font-bold">Tasks</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-notion-text-gray" onClick={() => setActiveTab('PHOTOS')}>
                    <Camera className="w-5 h-5" />
                    <span className="text-[9px] font-bold">Photos</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-notion-text-gray" onClick={() => setActiveTab('PORTFOLIO' as any)}>
                    <FileText className="w-5 h-5" />
                    <span className="text-[9px] font-bold">Resume</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-notion-text-gray" onClick={() => setActiveTab('PAYOUTS')}>
                    <DollarSign className="w-5 h-5" />
                    <span className="text-[9px] font-bold">Money</span>
                </button>
            </div>
        </div>
    );
}
