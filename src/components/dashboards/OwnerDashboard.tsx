import React from 'react';

/**
 * OwnerDashboard.tsx
 * 
 * Role: Client View (Read-only) for Property Owner.
 * Context: "My Home Renovation"
 * Privacy: No visible costs/margins.
 */

export interface JobStage {
    id: string;
    name: string;
    status: 'COMPLETED' | 'ACTIVE' | 'PENDING';
    date?: string;
}

export interface Photo {
    url: string;
    caption: string;
    timestamp: string;
}

interface OwnerDashboardProps {
    ownerName: string;
    projectProgress: number; // 0-100
    currentStatus: string; // e.g., "Kitchen Cabinet Installation"
    currentStatusDescription: string;
    stages: JobStage[];
    recentPhotos: Photo[]; // MUST be compressed images
    aiWorkmanshipScore: number; // 0-100
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
    ownerName,
    projectProgress,
    currentStatus,
    currentStatusDescription,
    stages,
    recentPhotos,
    aiWorkmanshipScore,
}) => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans p-6">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Home Renovation</h1>
                <p className="text-sm text-gray-500">Welcome back, {ownerName}</p>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                        <span>Overall Progress</span>
                        <span>{projectProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-teal-500 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${projectProgress}%` }}
                        ></div>
                    </div>
                </div>
            </header>

            {/* Main Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M... icon path ..." /></svg>
                </div>
                <div className="flex items-start space-x-4">
                    <div className="p-3 bg-teal-50 rounded-full text-teal-600 animate-pulse">
                        {/* Pulsing Status Icon */}
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-teal-600">Current Status</span>
                        <h2 className="text-xl font-bold text-gray-900 mt-1">{currentStatus}</h2>
                        <p className="text-gray-600 text-sm mt-1">{currentStatusDescription}</p>
                    </div>
                </div>
            </div>

            {/* Live Site Updates (Photos) */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Live Site Updates</h3>
                    <button className="text-teal-600 text-sm font-medium">View All</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {recentPhotos.slice(0, 4).map((photo, idx) => (
                        <div key={idx} className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                <p className="text-xs text-white font-medium">{photo.timestamp}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Timeline & Quality Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Timeline */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="text-md font-bold text-gray-900 mb-4">Timeline</h3>
                    <div className="space-y-4">
                        {stages.map((stage) => (
                            <div key={stage.id} className="flex items-start group">
                                <div className="flex flex-col items-center mr-3">
                                    <div className={`w-3 h-3 rounded-full mt-1.5 ${stage.status === 'COMPLETED' ? 'bg-teal-500' :
                                        stage.status === 'ACTIVE' ? 'bg-teal-500 ring-4 ring-teal-100' : 'bg-gray-300'
                                        }`}></div>
                                    <div className="w-0.5 h-full bg-gray-100 my-1 group-last:hidden"></div>
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${stage.status === 'PENDING' ? 'text-gray-400' : 'text-gray-900'}`}>
                                        {stage.name}
                                    </p>
                                    {stage.date && <p className="text-xs text-gray-500">{stage.date}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* AI Workmanship Score */}
                <section className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl shadow-lg p-5 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-sm rounded-full mb-3">
                            <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path d="M...shield icon..." /></svg>
                        </div>
                        <h3 className="text-sm font-medium text-indigo-200 uppercase tracking-wider">AI Quality Score</h3>
                        <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-400 mt-1">
                            {aiWorkmanshipScore}/100
                        </div>
                        <p className="text-xs text-indigo-300 mt-2">Analyzed from 24 HD site photos</p>
                    </div>
                </section>
            </div>

        </div>
    );
};

export default OwnerDashboard;
