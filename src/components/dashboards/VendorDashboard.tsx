import React, { useState } from 'react';

/**
 * VendorDashboard.tsx
 * 
 * Role: Sub-Contractor/Vendor View (e.g. Tiling Boss, Carpenter, Supplier).
 * Features:
 *  - Worker Dispatch
 *  - Engagement Specific Tracking (Purchase, Fabricate, Labour)
 *  - Technical Logs & Mistake Tracking
 */

export type EngagementType = 'PURCHASE_AND_INSTALL' | 'FABRICATE_AND_INSTALL' | 'LABOUR_ONLY';

interface Worker {
    id: string;
    name: string;
    status: 'AVAILABLE' | 'ASSIGNED' | 'ONSITE' | 'LEAVE';
    assignedProject?: string;
}

interface LogEntry {
    id: string;
    type: 'INSTRUCTION' | 'MISTAKE' | 'INFO';
    message: string;
    timestamp: string;
    isRead: boolean;
    actionRequired?: boolean;
}

interface VendorDashboardProps {
    vendorName: string; // e.g., "Ah Huat Tiling"
    engagementType: EngagementType;

    // Specific Data Props
    workers: Worker[];
    logs: LogEntry[];

    // Engagement Specific Metrics
    materialDeliveryEta?: string; // For Purchase
    fabricationProgress?: number; // For Fabricate (0-100)
}

const VendorDashboard: React.FC<VendorDashboardProps> = ({
    vendorName,
    engagementType,
    workers,
    logs,
    materialDeliveryEta,
    fabricationProgress
}) => {
    const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PROJECTS'>('DASHBOARD');

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans border-t-8 border-gray-900">

            {/* Heavy Industrial Header */}
            <header className="bg-gray-100 p-4 border-b-2 border-gray-900 flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter transform -skew-x-10 inline-block bg-black text-white px-2 py-1">
                        VENDOR OPS: <span className="text-yellow-400">{vendorName}</span>
                    </h1>
                    <div className="mt-1 flex items-center space-x-2">
                        <span className="text-xs font-bold bg-gray-300 px-2 py-0.5 rounded uppercase">
                            {engagementType.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs font-bold text-green-700 flex items-center">
                            <span className="w-2 h-2 bg-green-600 rounded-full mr-1 animate-pulse"></span> ONLINE
                        </span>
                    </div>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-xs font-bold text-gray-500 uppercase">System Time</p>
                    <p className="font-mono font-bold text-lg">10:42 AM</p>
                </div>
            </header>

            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* COL 1: WORKER DISPATCH (Common to all) */}
                <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0 flex flex-col">
                    <div className="bg-black text-white p-3 font-black text-xl uppercase flex justify-between">
                        <span>Worker Dispatch</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                        {workers.map(worker => (
                            <div key={worker.id} className="flex justify-between items-center border-b-2 border-gray-100 pb-2">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 flex items-center justify-center font-bold text-white rounded shadow-sm ${worker.status === 'ONSITE' ? 'bg-green-600' : 'bg-gray-800'
                                        }`}>
                                        {worker.name.substring(0, 1)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg leading-none">{worker.name}</p>
                                        <p className="text-xs font-mono text-gray-500">ID: {worker.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {worker.assignedProject ? (
                                        <span className="block bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 border border-yellow-300 rounded-sm mb-1">
                                            {worker.assignedProject}
                                        </span>
                                    ) : (
                                        <select className="text-xs border-2 border-dashed border-gray-300 rounded p-1">
                                            <option>Assign Project...</option>
                                            <option>Project Alpha</option>
                                            <option>Project Beta</option>
                                        </select>
                                    )}
                                    <span className={`text-xs font-bold ${worker.status === 'ONSITE' ? 'text-green-600' : 'text-gray-400'}`}>
                                        {worker.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="m-4 bg-black text-white py-3 font-bold uppercase hover:bg-yellow-400 hover:text-black transition-colors border-2 border-transparent hover:border-black">
                        + Add Worker
                    </button>
                </section>


                {/* COL 2: ONSITE TECHNICAL LOG (Common to all) */}
                <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0 flex flex-col">
                    <div className="bg-black text-white p-3 font-black text-xl uppercase flex justify-between">
                        <span className="flex items-center">
                            Onsite <span className="text-yellow-400 mx-1">::</span> Technical Log
                        </span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div className="p-4 space-y-4 bg-gray-50 flex-1">
                        {logs.map(log => (
                            <div key={log.id} className={`p-3 border-l-4 shadow-sm bg-white ${log.type === 'MISTAKE' ? 'border-red-600' : 'border-blue-600'
                                }`}>
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-xs font-black uppercase px-1 ${log.type === 'MISTAKE' ? 'bg-red-600 text-white' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {log.type}
                                    </span>
                                    <span className="text-xxs font-mono text-gray-400">{log.timestamp}</span>
                                </div>
                                <p className="font-bold text-sm leading-tight text-gray-800">
                                    {log.message}
                                </p>

                                {log.type === 'MISTAKE' && log.actionRequired && (
                                    <div className="mt-2 animate-pulse">
                                        <button className="w-full bg-red-600 text-white text-xs font-bold py-1 uppercase border border-red-800 hover:bg-red-700">
                                            Rectify ASAP
                                        </button>
                                    </div>
                                )}

                                {log.type === 'INSTRUCTION' && (
                                    <div className="mt-2 flex items-center space-x-2">
                                        <input type="checkbox" checked={log.isRead} className="form-checkbox h-4 w-4 text-black border-2 border-gray-400" readOnly />
                                        <label className="text-xs font-bold text-gray-500 uppercase">Mark as Read</label>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>


                {/* COL 3: ENGAGEMENT SPECIFIC TRACKER */}
                <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0 flex flex-col h-fit">
                    <div className="bg-yellow-400 text-black p-3 font-black text-xl uppercase border-b-4 border-black">
                        {engagementType === 'PURCHASE_AND_INSTALL' && 'LOGISTICS TRACKER'}
                        {engagementType === 'FABRICATE_AND_INSTALL' && 'WORKSHOP STATUS'}
                        {engagementType === 'LABOUR_ONLY' && 'SHIFT MANAGER'}
                    </div>

                    <div className="p-6 text-center">

                        {/* VARIANT: PURCHASE & INSTALL */}
                        {engagementType === 'PURCHASE_AND_INSTALL' && (
                            <div className="space-y-4">
                                <div className="bg-gray-100 p-4 border-2 border-dashed border-gray-400 rounded">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Material Delivery ETA</p>
                                    <p className="text-3xl font-black text-gray-900">{materialDeliveryEta || 'PENDING'}</p>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase">
                                    <span>Supplier: <span className="text-blue-600">Hup Kiong</span></span>
                                    <span>PO: #99281</span>
                                </div>
                                <button className="w-full bg-gray-900 text-white py-2 font-bold uppercase text-sm">
                                    Track Shipment
                                </button>
                            </div>
                        )}

                        {/* VARIANT: FABRICATE & INSTALL */}
                        {engagementType === 'FABRICATE_AND_INSTALL' && (
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-center uppercase mb-2">Fabrication Completion</p>
                                <div className="relative pt-1">
                                    <div className="overflow-hidden h-6 text-xs flex rounded bg-gray-200 border-2 border-black">
                                        <div
                                            style={{ width: `${fabricationProgress}%` }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 font-bold"
                                        >
                                            {fabricationProgress}%
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xxs font-bold uppercase mt-2">
                                    <div className="bg-green-100 p-2 text-green-800 rounded">Cutting: Done</div>
                                    <div className="bg-yellow-100 p-2 text-yellow-800 rounded">Laminating: In Prog</div>
                                </div>
                            </div>
                        )}

                        {/* VARIANT: LABOUR ONLY */}
                        {engagementType === 'LABOUR_ONLY' && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                                    <span className="font-bold">Total Headcount</span>
                                    <span className="text-xl font-black bg-black text-white px-2 py-0.5 rounded">{workers.length}</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                                    <span className="font-bold text-green-600">Onsite</span>
                                    <span className="text-xl font-black">{workers.filter(w => w.status === 'ONSITE').length}</span>
                                </div>
                                <div className="flex items-center justify-between pb-2">
                                    <span className="font-bold text-gray-400">Absent</span>
                                    <span className="text-xl font-black text-gray-400">{workers.filter(w => w.status === 'LEAVE').length}</span>
                                </div>
                                <button className="w-full mt-4 border-2 border-red-500 text-red-600 font-bold py-2 uppercase hover:bg-red-50">
                                    Report Incident
                                </button>
                            </div>
                        )}

                    </div>
                </section>

            </div>
        </div>
    );
};

export default VendorDashboard;
