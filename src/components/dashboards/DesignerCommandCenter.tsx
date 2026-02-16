import React from 'react';

/**
 * DesignerCommandCenter.tsx
 * 
 * Role: Admin/Manager View for Interior Designer/Renovator.
 * Context: "Sifu Command Center"
 * Function: Dispatch management, Sifu tracking, Financials.
 */

interface ActiveJob {
    id: string;
    name: string; // e.g. "Project Alpha - Tiling"
    type: 'LABOUR_ONLY' | 'FABRICATE_INSTALL'; // New: Differentiate job types
    status: 'ARRIVED' | 'DISPATCHING' | 'DONE_PENDING_AUDIT' | 'PROBLEM' | 'NO_SHOW';
    dispatchStage?: 'PRIMARY' | 'HOT_BACKUP' | 'COLD_POOL';
    sifuName?: string;
    location: { lat: number, lng: number };
    specSheetUrl?: string; // New: Link to job requirements
}

interface SifuStatus {
    id: string;
    name: string;
    role: 'SIFU' | 'FABRICATOR'; // New: Differentiate vendor roles
    avatarUrl: string;
    status: 'READY' | 'BUSY' | 'OFFLINE';
}

interface FinancialData {
    cost: number;
    price: number;
    margin: number;
}

interface DesignerDashboardProps {
    activeJobsCount: number;
    sifusOnlineCount: number;
    jobs: ActiveJob[];
    sifuPool: SifuStatus[];
    financials: FinancialData; // In real app, might be per job
}

const DesignerCommandCenter: React.FC<DesignerDashboardProps> = ({
    activeJobsCount,
    sifusOnlineCount,
    jobs,
    sifuPool,
    financials
}) => {
    // Derived state for filtering
    const fabricators = sifuPool.filter(s => s.role === 'FABRICATOR');
    const laborSifus = sifuPool.filter(s => s.role === 'SIFU');

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-mono p-4">
            {/* Top Bar */}
            <header className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <h1 className="text-2xl font-bold text-cyan-400 tracking-wider glow-text">
                    SIFU COMMAND CENTER
                </h1>
                <div className="flex space-x-6 text-sm">
                    <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Active Jobs:</span>
                        <span className="text-white font-bold text-lg">{activeJobsCount}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-500 uppercase">Labor</span>
                            <span className="text-green-400 font-bold">{laborSifus.length} Online</span>
                        </div>
                        <div className="w-px h-8 bg-gray-700"></div>
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-500 uppercase">Fabricators</span>
                            <span className="text-purple-400 font-bold">{fabricators.length} Online</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">

                {/* Sidebar: Vendor Pool (Col 2) */}
                <aside className="col-span-2 bg-gray-800/50 rounded-xl border border-gray-700 p-4 flex flex-col space-y-6">

                    {/* Fabricators List */}
                    <div>
                        <h3 className="text-xs font-semibold text-purple-400 uppercase mb-3 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                            Fabricators (Custom)
                        </h3>
                        <ul className="space-y-3">
                            {fabricators.map(sifu => (
                                <li key={sifu.id} className="flex items-center space-x-3 group cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition-colors">
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded bg-purple-900 overflow-hidden border border-purple-600">
                                            <img src={sifu.avatarUrl} alt={sifu.name} />
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-gray-900 ${sifu.status === 'READY' ? 'bg-green-500' : 'bg-gray-500'
                                            }`}></div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-200 group-hover:text-purple-300 transition-colors">{sifu.name}</p>
                                        <p className="text-[10px] text-gray-500">{sifu.status}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="w-full h-px bg-gray-700/50"></div>

                    {/* Labour Sifus List */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3 text-cyan-400 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                            General Sifus
                        </h3>
                        <ul className="space-y-3">
                            {laborSifus.map(sifu => (
                                <li key={sifu.id} className="flex items-center space-x-3 group cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition-colors">
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden border border-gray-600">
                                            <img src={sifu.avatarUrl} alt={sifu.name} />
                                        </div>
                                        <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-gray-900 ${sifu.status === 'READY' ? 'bg-green-500' : 'bg-gray-500'
                                            }`}></div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-200 group-hover:text-cyan-300 transition-colors">{sifu.name}</p>
                                        <p className="text-[10px] text-gray-500">{sifu.status}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </aside>

                {/* Main: Live Dispatch Board (Col 6) */}
                <main className="col-span-6 space-y-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Live Dispatch Board</h3>

                    {jobs.map(job => (
                        <div key={job.id} className={`relative p-4 rounded-lg border backdrop-blur-sm transition-all hover:scale-[1.01] ${job.status === 'NO_SHOW' ? 'border-red-500/80 bg-gray-800/40' :
                            job.type === 'FABRICATE_INSTALL' ? 'border-purple-500/30 bg-purple-900/10' :
                                'border-cyan-500/30 bg-gray-800/40'
                            }`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                        {job.type === 'FABRICATE_INSTALL' && (
                                            <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30 uppercase tracking-wide">
                                                Fabricate & Install
                                            </span>
                                        )}
                                        <h4 className="text-lg font-bold text-white">{job.name}</h4>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {/* Status Badge */}
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${job.status === 'ARRIVED' ? 'bg-green-900/30 text-green-400' :
                                            job.status === 'DISPATCHING' ? 'bg-gray-700/50 text-gray-300' :
                                                job.status === 'NO_SHOW' ? 'bg-red-900/50 text-red-500 animate-pulse' :
                                                    job.status === 'DONE_PENDING_AUDIT' ? 'bg-purple-900/30 text-purple-400' :
                                                        'bg-gray-700 text-gray-300'
                                            }`}>
                                            {job.status.replace(/_/g, ' ')}
                                        </span>

                                        {/* Spec Sheet Attachment Indicator */}
                                        {job.specSheetUrl && (
                                            <a href={job.specSheetUrl} target="_blank" rel="noopener noreferrer" className="flex items-center px-1.5 py-0.5 rounded bg-gray-700 hover:bg-gray-600 text-[10px] text-gray-300 transition-colors border border-gray-600">
                                                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                View Specs
                                            </a>
                                        )}

                                        {/* Dispatch Stage Indicators */}
                                        {job.dispatchStage === 'HOT_BACKUP' && (
                                            <span className="flex items-center text-xs text-orange-400 font-bold border border-orange-500/30 px-1 rounded">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.45-.412-1.725a1 1 0 00-1.332-1.298c-.429.176-.78.49-1.026.886-.445.717-.506 1.72-.187 2.783.218.726.634 1.488 1.144 2.14.733.936 1.7 1.63 2.723 2.067.892.38 1.84.536 2.78.47.905-.064 1.794-.36 2.535-.867.69-.473 1.258-1.125 1.614-1.894.408-.881.564-1.889.444-2.887-.19-1.579-.884-3.006-1.867-4.148-.204-.236-.425-.46-.66-.671z" clipRule="evenodd" /></svg>
                                                HOT BACKUP
                                            </span>
                                        )}

                                        {job.dispatchStage === 'COLD_POOL' && (
                                            <div className="flex flex-col items-end">
                                                <span className="flex items-center text-xs text-blue-400 font-bold border border-blue-500/30 px-1 rounded mb-1">
                                                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                                                    COLD POOL
                                                </span>
                                                <span className="text-[10px] text-red-300 font-mono bg-red-900/40 px-1 rounded">
                                                    $$ SURGE RATE (+15%)
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Context Alert for No Show */}
                                    {job.status === 'NO_SHOW' && (
                                        <div className="mt-2 text-xs text-red-400 font-mono bg-red-900/10 p-2 rounded">
                                            <p>{'>'} ALERT: Primary Vendor unresponsive (15m).</p>
                                            <p>{'>'} ACTION: Hot Backup triggered.</p>
                                            <p className="text-red-300 font-bold mt-1">{'>'} SYSTEM: Penalty applied to Sifu (Strike 1).</p>
                                        </div>
                                    )}

                                    {/* Context Alert for Cold Pool */}
                                    {job.dispatchStage === 'COLD_POOL' && (
                                        <div className="mt-2 text-xs text-blue-400 font-mono">
                                            {'>'} WAITING: Accepting first responder...
                                        </div>
                                    )}
                                </div>

                                {/* Map Pin Icon */}
                                <button className="text-gray-500 hover:text-cyan-400 transition-colors">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </button>
                            </div>

                            {/* Metadata */}
                            {job.sifuName && (
                                <div className="mt-3 pt-3 border-t border-gray-700/50 flex justify-between text-xs text-gray-400">
                                    <span>Assigned to: <span className="text-gray-300">{job.sifuName}</span></span>
                                    <span>ETA: 10 mins</span>
                                </div>
                            )}
                        </div>
                    ))}

                </main>

                {/* Right Col: Map & Financials (Col 4) */}
                <aside className="col-span-4 flex flex-col space-y-6">
                    {/* Map Widget Placeholder */}
                    <div className="flex-1 bg-gray-800 rounded-xl border border-gray-700 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/103.8198,1.3521,11,0/400x300@2x?access_token=YOUR_TOKEN')] bg-cover bg-center opacity-70 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded text-xs text-white border border-gray-600">
                            Singapore Operations
                        </div>
                        {/* Fake Sifu Pins */}
                        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4] animate-ping"></div>
                        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-cyan-500 rounded-full"></div>

                        <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-purple-500 rounded-full"></div>
                    </div>

                    {/* Financials Panel */}
                    <div className="h-1/3 bg-gray-800 rounded-xl border border-gray-700 p-4 flex flex-col justify-between relative overflow-hidden">
                        {/* Neon Grid Effect */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(19,78,74,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(19,78,74,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                        <h3 className="text-xs font-semibold text-gray-400 uppercase z-10">Real-time Job Margin</h3>
                        <div className="grid grid-cols-3 gap-2 z-10">
                            <div>
                                <p className="text-xxs text-gray-500 uppercase">Cost</p>
                                <p className="text-xl font-mono text-red-400">${financials.cost}</p>
                            </div>
                            <div>
                                <p className="text-xxs text-gray-500 uppercase">Price</p>
                                <p className="text-xl font-mono text-cyan-400">${financials.price}</p>
                            </div>
                            <div className="bg-gray-700/50 rounded p-1 border border-green-500/30">
                                <p className="text-xxs text-green-300 uppercase">Margin</p>
                                <p className="text-xl font-bold font-mono text-green-400">${financials.margin}</p>
                            </div>
                        </div>

                        {/* Mini Sparkline Graph */}
                        <div className="h-10 mt-2 flex items-end space-x-1 opacity-50 z-10">
                            {[40, 60, 45, 70, 80, 50, 90, 85].map((h, i) => (
                                <div key={i} className="flex-1 bg-cyan-500/50 hover:bg-cyan-400 transition-colors rounded-t-sm" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
};

export default DesignerCommandCenter;
