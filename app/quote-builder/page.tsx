'use client';

import { useState, useCallback } from 'react';
import QuoteBuilderEnhanced, { TradeSection } from './components/QuoteBuilderEnhanced';
import PromptQuote from './components/PromptQuote';
import ClientQuotePreview from './components/ClientQuotePreview';
import BudgetPanel from './components/BudgetPanel';
import MaterialConfigurator from './components/MaterialConfigurator';
import ProspectProfile from './components/ProspectProfile';
import { GeneratedTradeSection } from '@/lib/ai/auto-quote';
import { Zone } from '@/components/ZoneManager';


type ViewMode = 'builder' | 'client';

export default function QuoteBuilderPage() {
    const [loadFn, setLoadFn] = useState<((sections: GeneratedTradeSection[]) => void) | null>(null);
    const [zoneImportFn, setZoneImportFn] = useState<((zones: Zone[]) => void) | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('builder');
    const [currentSections, setCurrentSections] = useState<TradeSection[]>([]);
    const [showSidebar, setShowSidebar] = useState(true);

    const handleReady = useCallback((fn: (sections: GeneratedTradeSection[]) => void) => {
        setLoadFn(() => fn);
    }, []);

    const handleZonesReady = useCallback((fn: (zones: Zone[]) => void) => {
        setZoneImportFn(() => fn);
    }, []);

    const handleGenerateQuote = useCallback((sections: GeneratedTradeSection[]) => {
        if (loadFn) loadFn(sections);
        setCurrentSections(sections as unknown as TradeSection[]);
    }, [loadFn]);

    const handleSectionsChange = useCallback((sections: TradeSection[]) => {
        setCurrentSections(sections);
    }, []);

    const handleApplyBudget = useCallback((optimizedSections: GeneratedTradeSection[]) => {
        if (loadFn) loadFn(optimizedSections);
        setCurrentSections(optimizedSections as unknown as TradeSection[]);
    }, [loadFn]);

    const handleRoomsToZones = useCallback((zones: Zone[]) => {
        if (zoneImportFn) zoneImportFn(zones);
    }, [zoneImportFn]);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* View Toggle Bar */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-bold text-gray-900">Numbers</h1>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-gray-500">Quote Builder</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {viewMode === 'builder' && (
                            <button
                                onClick={() => setShowSidebar(!showSidebar)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${showSidebar
                                    ? 'bg-violet-100 text-violet-700'
                                    : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {showSidebar ? '◀ Hide' : '▶ Show'} Tools
                            </button>
                        )}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('builder')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'builder'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                🔧 Builder
                            </button>
                            <button
                                onClick={() => setViewMode('client')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'client'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                📋 Client View
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Builder — always mounted, hidden via CSS when in client view */}
                <div style={{ display: viewMode === 'builder' ? 'block' : 'none' }}>
                    <div className="flex gap-6">
                        {/* Main builder area */}
                        <div className={`${showSidebar ? 'flex-1 min-w-0' : 'w-full'}`}>
                            <ProspectProfile onRoomsToZones={handleRoomsToZones} />
                            <PromptQuote onGenerateQuote={handleGenerateQuote} />
                            <QuoteBuilderEnhanced
                                onReady={handleReady}
                                onSectionsChange={handleSectionsChange}
                                onZonesReady={handleZonesReady}
                            />
                        </div>

                        {/* Tools sidebar */}
                        {showSidebar && (
                            <div className="w-[380px] shrink-0 space-y-4">
                                <BudgetPanel
                                    sections={currentSections as unknown as GeneratedTradeSection[]}
                                    onApplyBudget={handleApplyBudget}
                                />
                                <MaterialConfigurator />
                            </div>
                        )}
                    </div>
                </div>

                {/* Client View */}
                <div style={{ display: viewMode === 'client' ? 'block' : 'none' }}>
                    <div className="bg-white rounded-xl shadow-lg p-10 max-w-4xl mx-auto">
                        {currentSections.length > 0 ? (
                            <ClientQuotePreview sections={currentSections} />
                        ) : (
                            <div className="text-center py-20">
                                <div className="text-5xl mb-4">📋</div>
                                <h3 className="text-xl font-medium text-gray-700">No quote to preview</h3>
                                <p className="text-gray-500 mt-2">
                                    Switch to Builder view and generate a quote first
                                </p>
                                <button
                                    onClick={() => setViewMode('builder')}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                >
                                    Go to Builder
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

