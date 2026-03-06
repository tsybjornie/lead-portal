'use client';

import { useState, useCallback, useMemo } from 'react';
import QuoteBuilderEnhanced, { TradeSection } from './components/QuoteBuilderEnhanced';
import PromptQuote from './components/PromptQuote';
import ClientQuotePreview from './components/ClientQuotePreview';
import BudgetPanel from './components/BudgetPanel';
import MaterialConfigurator from './components/MaterialConfigurator';
import ProspectProfile from './components/ProspectProfile';
import { GeneratedTradeSection } from '@/lib/ai/auto-quote';
import { Zone } from '@/components/ZoneManager';
import QuoteDocument from '@/components/QuoteDocument';
import { RenovationPhase, TradeRole } from '@/types/quotation-model';
import { analyzeBudget, getBudgetMessage } from '@/lib/budget-tracker';
import { generateQuoteSerial, getShortSerial } from '@/lib/quote-serial';

// 
// WORKFLOW & VERSIONING TYPES
// 

type QuoteWorkflowStatus = 'DRAFT' | 'SENT' | 'REVISION' | 'SIGNED' | 'PAID';
type QuoteDocType = 'QO' | 'VO';

interface QuoteVersion {
    docType: QuoteDocType;
    version: number;       // 1,2,3...
    label: string;         // "QO1", "VO2"
}

const WORKFLOW_STYLES: Record<QuoteWorkflowStatus, { label: string; bg: string; text: string }> = {
    DRAFT: { label: ' Draft', bg: 'bg-slate-200', text: 'text-slate-700' },
    SENT: { label: ' Sent', bg: 'bg-blue-100', text: 'text-blue-700' },
    REVISION: { label: ' Revision', bg: 'bg-orange-100', text: 'text-orange-700' },
    SIGNED: { label: ' Signed', bg: 'bg-emerald-100', text: 'text-emerald-700' },
    PAID: { label: ' Paid', bg: 'bg-amber-100', text: 'text-amber-700' },
};

type ViewMode = 'builder' | 'client' | 'boq';

type SequenceTab = 'drawings' | 'materials' | 'survey' | 'brief';

// Sequence demo data (from real Sequence project)
const SEQUENCE_DRAWINGS = [
    { id: 'dwg-001', title: 'Proposed Floor Plan', zone: 'Whole Unit', status: 'approved' as const, ref: 'DWG-001', date: '2026-02-28' },
    { id: 'dwg-002', title: 'Electrical Point Layout', zone: 'Whole Unit', status: 'pending' as const, ref: 'DWG-002', date: '2026-03-01' },
    { id: 'dwg-003', title: 'Kitchen Elevation A', zone: 'Kitchen', status: 'approved' as const, ref: 'DWG-003', date: '2026-03-02' },
    { id: 'dwg-004', title: 'Kitchen Layout Plan', zone: 'Kitchen', status: 'approved' as const, ref: 'DWG-004', date: '2026-03-02' },
    { id: 'dwg-005', title: 'Master Bath Elevation', zone: 'Master Bath', status: 'pending' as const, ref: 'DWG-005', date: '2026-03-03' },
];

const SEQUENCE_MATERIALS = [
    { id: 'mat-001', name: 'Marine Plywood 18mm', grade: 'E0/E1', supplier: 'SinLec Hardware', rate: '$85/sheet', leadTime: '3 days', category: 'Carpentry' },
    { id: 'mat-002', name: 'Niro Granite GHQ03', grade: 'R10 Slip-rated', supplier: 'Hafary', rate: '$4.20/sqft', leadTime: '5 days', category: 'Tiling' },
    { id: 'mat-003', name: 'Formica Elemental Concrete', grade: 'Matte Laminate', supplier: 'Goodrich', rate: '$3.80/sqft', leadTime: '3 days', category: 'Carpentry' },
    { id: 'mat-004', name: 'Blum Aventos HK-S', grade: 'Soft-close', supplier: 'Blum SG', rate: '$45/set', leadTime: '7 days', category: 'Hardware' },
    { id: 'mat-005', name: 'Nippon Odour-less Deluxe', grade: 'NP OW 1002P', supplier: 'Nippon Paint SG', rate: '$68/5L', leadTime: '2 days', category: 'Painting' },
];

const SEQUENCE_SURVEY = [
    { room: 'Living Room', dims: '5.2m × 4.1m', area: '21.32 sqm (230 sqft)', ceiling: '2.74m' },
    { room: 'Kitchen', dims: '3.2m × 2.8m', area: '8.96 sqm (96 sqft)', ceiling: '2.74m' },
    { room: 'Master Bedroom', dims: '4.0m × 3.5m', area: '14.00 sqm (151 sqft)', ceiling: '2.74m' },
    { room: 'Bedroom 2', dims: '3.0m × 3.0m', area: '9.00 sqm (97 sqft)', ceiling: '2.74m' },
    { room: 'Master Bathroom', dims: '2.4m × 1.8m', area: '4.32 sqm (47 sqft)', ceiling: '2.40m' },
];

const SEQUENCE_BRIEF = {
    project: 'Holland V Condo',
    address: '28 Holland Village Way #12-05',
    type: 'Condominium (1,200 sqft)',
    budget: '$80,000 - $100,000',
    timeline: '12 weeks',
    occupants: '2 Adults, 1 Child (6yo)',
    style: 'Warm Minimalism / Japandi',
    counterHeight: '920mm (optimized for 168cm primary user)',
};

export default function QuoteBuilderPage() {
    const [loadFn, setLoadFn] = useState<((sections: GeneratedTradeSection[]) => void) | null>(null);
    const [zoneImportFn, setZoneImportFn] = useState<((zones: Zone[]) => void) | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('builder');
    const [currentSections, setCurrentSections] = useState<TradeSection[]>([]);
    const [showPdfPreview, setShowPdfPreview] = useState(false);
    const [showSequence, setShowSequence] = useState(false);
    const [sequenceTab, setSequenceTab] = useState<SequenceTab>('drawings');

    //  WORKFLOW STATE 
    const [workflowStatus, setWorkflowStatus] = useState<QuoteWorkflowStatus>('DRAFT');
    const [qoVersion, setQoVersion] = useState(1);
    const [voVersion, setVoVersion] = useState(0);

    const isPreSign = workflowStatus === 'DRAFT' || workflowStatus === 'SENT' || workflowStatus === 'REVISION';
    const isLocked = workflowStatus === 'SIGNED' || workflowStatus === 'PAID';

    const currentVersion: QuoteVersion = isPreSign
        ? { docType: 'QO', version: qoVersion, label: `QO${qoVersion}` }
        : { docType: 'VO', version: voVersion, label: voVersion > 0 ? `VO${voVersion}` : `QO${qoVersion}` };

    // Serial number: DATE/FIRM/DESIGNER/CLIENT/QO1
    const quoteSerial = useMemo(() =>
        generateQuoteSerial('Vinterior Pte Ltd', 1, 1, currentVersion.docType, currentVersion.version),
        [currentVersion.docType, currentVersion.version]
    );
    const shortSerial = getShortSerial(quoteSerial);

    //  BUDGET STATE 
    const [clientBudget, setClientBudget] = useState(0);

    //  SHARE STATE 
    const [shareCode, setShareCode] = useState<string | null>(null);
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [isSharing, setIsSharing] = useState(false);
    const [shareCopied, setShareCopied] = useState(false);

    //  PDF UPLOAD STATE 
    const [pdfParsing, setPdfParsing] = useState(false);
    const [pdfResult, setPdfResult] = useState<{
        tradeSections: Array<{ category: string; displayName: string; items: Array<{ description: string; quantity: number; unit: string; unitRate: number; sellingPrice: number; location: string; taskType: string; specifications: string }> }>;
        totalItems: number;
        confidence: number;
        parsed: { subtotal: number; gst: number; total: number; vendorName: string };
    } | null>(null);
    const [pdfError, setPdfError] = useState<string | null>(null);
    const [showPasteMode, setShowPasteMode] = useState(false);
    const [pasteText, setPasteText] = useState('');

    const handlePdfUpload = async (file: File) => {
        setPdfParsing(true);
        setPdfError(null);
        setPdfResult(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/parse-quote', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                setPdfResult(data);
            } else {
                setPdfError(data.error || 'Failed to parse PDF');
            }
        } catch (err) {
            setPdfError('Upload failed — check file format');
        } finally {
            setPdfParsing(false);
        }
    };

    const handlePasteQuote = async () => {
        if (!pasteText.trim()) return;
        setPdfParsing(true);
        setPdfError(null);
        setPdfResult(null);
        try {
            const res = await fetch('/api/parse-quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: pasteText }),
            });
            const data = await res.json();
            if (data.success) {
                setPdfResult(data);
            } else {
                setPdfError(data.error || 'Failed to parse text');
            }
        } catch (err) {
            setPdfError('Parse failed');
        } finally {
            setPdfParsing(false);
        }
    };

    const loadParsedIntoBuilder = () => {
        if (!pdfResult?.tradeSections) return;
        const sections: GeneratedTradeSection[] = pdfResult.tradeSections.map((ts, i) => ({
            id: `parsed-${Date.now()}-${i}`,
            category: ts.category as any,
            displayName: ts.displayName,
            items: ts.items.map((item, j) => ({
                id: `parsed-item-${Date.now()}-${i}-${j}`,
                description: item.description,
                dimensions: { unit: item.unit as any, quantity: item.quantity },
                unitRate: item.unitRate,
                costPrice: item.unitRate * item.quantity * 0.7,
                margin: 0.3,
                sellingPrice: item.sellingPrice,
                productivityMultiplier: 1,
                materialCost: item.sellingPrice * 0.6,
                labourCost: item.sellingPrice * 0.4,
                isOwnerSupplied: false,
                phase: 'CONSTRUCTION' as any,
                tradeRole: 'CUSTOM' as any,
                wastage: 0.05,
                risk: 0.03,
                location: item.location,
                taskType: item.taskType,
                specifications: item.specifications,
            })),
            subtotalCost: ts.items.reduce((s, i) => s + i.sellingPrice * 0.7, 0),
            subtotalSelling: ts.items.reduce((s, i) => s + i.sellingPrice, 0),
            overallMargin: 30,
            isExpanded: true,
        }));
        handleGenerateQuote(sections);
        setPdfResult(null);
    };

    const handleShare = async () => {
        setIsSharing(true);
        try {
            const res = await fetch('/api/quotes/share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sections: currentSections,
                    zones: [],
                    quoteNumber: quoteSerial,
                    companyName: 'VINTERIOR STUDIO',
                    projectName: '4-Room HDB Renovation',
                    jurisdiction: 'SG',
                }),
            });
            const data = await res.json();
            if (data.shareCode) {
                setShareCode(data.shareCode);
                const fullUrl = `${window.location.origin}${data.shareUrl}`;
                setShareUrl(fullUrl);
                await navigator.clipboard.writeText(fullUrl);
                setShareCopied(true);
                setTimeout(() => setShareCopied(false), 3000);
            }
        } catch (err) {
            console.error('Share failed:', err);
        } finally {
            setIsSharing(false);
        }
    };

    const quoteTotal = useMemo(() => {
        return currentSections.reduce((sum, s) =>
            sum + s.items.reduce((itemSum, item) => itemSum + (item.sellingPrice || 0), 0), 0
        );
    }, [currentSections]);

    const budgetAnalysis = useMemo(() => {
        if (clientBudget <= 0) return null;
        return analyzeBudget(clientBudget, quoteTotal);
    }, [clientBudget, quoteTotal]);

    //  WORKFLOW ACTIONS 
    const handleWorkflowChange = (newStatus: QuoteWorkflowStatus) => {
        // Going to REVISION from SENT = bump QO version
        if (newStatus === 'REVISION' && workflowStatus === 'SENT') {
            setQoVersion(prev => prev + 1);
        }
        // Post-sign: create VO
        if ((newStatus === 'SIGNED' || newStatus === 'PAID') && isPreSign) {
            // No-op, just lock
        }
        setWorkflowStatus(newStatus);
    };

    const createVariationOrder = () => {
        setVoVersion(prev => prev + 1);
        // In future: snapshot current quote, create VO as delta
    };

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
            {/*  */}
            {/* STICKY HEADER  2-Row Layout */}
            {/*  */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                {/*  ROW 1: Serial + Status + Views  */}
                <div className="w-full px-6 py-2 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-bold text-gray-900">Roof</h1>
                        <span className="text-gray-200">|</span>

                        {/* Full Serial Number */}
                        <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2.5 py-1 rounded tracking-wide" title={quoteSerial}>
                            {quoteSerial}
                        </span>

                        {/* Workflow Status Dropdown */}
                        <select
                            value={workflowStatus}
                            onChange={e => handleWorkflowChange(e.target.value as QuoteWorkflowStatus)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 cursor-pointer ${WORKFLOW_STYLES[workflowStatus].bg} ${WORKFLOW_STYLES[workflowStatus].text}`}
                        >
                            <option value="DRAFT">Draft</option>
                            <option value="SENT">Sent to Client</option>
                            <option value="REVISION">Client Revision</option>
                            <option value="SIGNED">Signed</option>
                            <option value="PAID">Paid</option>
                        </select>

                        {/* Post-sign: VO button */}
                        {isLocked && (
                            <button
                                onClick={createVariationOrder}
                                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                            >
                                + New VO{voVersion + 1}
                            </button>
                        )}
                    </div>

                    {/* Right: View Toggles */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setShowPdfPreview(true)}
                            className="px-3 py-1 rounded-md text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-all shadow-sm"
                        >
                            PDF
                        </button>
                        <button
                            onClick={() => setViewMode('builder')}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${viewMode === 'builder'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Builder
                        </button>
                        <button
                            onClick={() => setViewMode('client')}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${viewMode === 'client'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Client
                        </button>
                        <button
                            onClick={() => setViewMode('boq')}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${viewMode === 'boq'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            BOQ
                        </button>
                        <a
                            href="/vendor-rates"
                            className="px-3 py-1 rounded-md text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all"
                        >
                            Vendors
                        </a>
                        <div className="w-px h-5 bg-gray-300 mx-1" />
                        <button
                            onClick={() => setShowSequence(!showSequence)}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${showSequence
                                ? 'bg-amber-100 text-amber-700'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Sequence
                        </button>
                    </div>

                    {/* Share Button */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleShare}
                            disabled={isSharing}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-sm disabled:opacity-50 flex items-center gap-1"
                        >
                            {isSharing ? 'Sharing...' : 'Share with Client'}
                        </button>
                        {shareUrl && (
                            <div className="flex items-center gap-1 bg-purple-50 border border-purple-200 rounded-lg px-2 py-1">
                                <code className="text-[10px] text-purple-700 font-mono">{shareUrl}</code>
                                <button
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(shareUrl);
                                        setShareCopied(true);
                                        setTimeout(() => setShareCopied(false), 2000);
                                    }}
                                    className="text-[10px] text-purple-600 hover:text-purple-800 font-bold"
                                >
                                    {shareCopied ? ' Copied!' : 'Copy'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/*  ROW 2: Budget + Total + Indicator  */}
                <div className="w-full px-6 py-2 flex items-center gap-6">
                    {/* Budget Input */}
                    <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Client Budget</label>
                        <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                            <input
                                type="number"
                                value={clientBudget || ''}
                                onChange={e => setClientBudget(Number(e.target.value))}
                                placeholder="50,000"
                                className="w-28 pl-5 pr-2 py-1 text-sm font-mono border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="h-5 w-px bg-gray-200" />

                    {/* Quote Total */}
                    <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Total</label>
                        <span className="text-lg font-black text-emerald-600 font-mono">
                            ${quoteTotal.toLocaleString()}
                        </span>
                    </div>

                    {/* Budget Indicator */}
                    {budgetAnalysis && (
                        <>
                            <div className="h-5 w-px bg-gray-200" />
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${budgetAnalysis.status === 'under' || budgetAnalysis.status === 'on_target' ? 'bg-green-100 text-green-700' :
                                budgetAnalysis.status === 'over_10' ? 'bg-amber-100 text-amber-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                <span>{budgetAnalysis.statusEmoji}</span>
                                <span>{budgetAnalysis.percentOver > 0 ? '+' : ''}{budgetAnalysis.percentOver}%</span>
                                <span className="text-[10px] font-normal opacity-70">
                                    ({budgetAnalysis.difference > 0 ? '+' : ''}${Math.abs(budgetAnalysis.difference).toLocaleString()})
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Budget Alert Bar */}
                {budgetAnalysis && budgetAnalysis.status !== 'under' && budgetAnalysis.status !== 'on_target' && (
                    <div className={`px-6 py-2 text-sm border-t ${budgetAnalysis.status === 'over_10' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                        budgetAnalysis.status === 'over_25' ? 'bg-orange-50 border-orange-200 text-orange-800' :
                            'bg-red-50 border-red-200 text-red-800'
                        }`}>
                        {getBudgetMessage(budgetAnalysis)}
                    </div>
                )}

                {/* Post-sign Lock Banner */}
                {isLocked && (
                    <div className="px-6 py-2 bg-emerald-50 border-t border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
                        <strong>Quote locked ({currentVersion.label})</strong>  Changes require a Variation Order (VO).
                        {voVersion > 0 && <span className="ml-2 font-mono bg-purple-100 text-purple-700 px-2 rounded">Active: VO{voVersion}</span>}
                    </div>
                )}
            </div>

            {/* Content — Split Screen with Sequence */}
            <div className="flex flex-1 min-h-0" style={{ height: 'calc(100vh - 130px)' }}>
                {/* LEFT: Main Content */}
                <div className={`overflow-y-auto p-6 transition-all duration-300 ${showSequence ? 'w-[60%]' : 'w-full'}`}>
                    {/* Builder View */}
                    <div style={{ display: viewMode === 'builder' ? 'block' : 'none' }}>
                        <div className="w-full">
                            <ProspectProfile onRoomsToZones={handleRoomsToZones} />
                            <PromptQuote onGenerateQuote={handleGenerateQuote} />

                            {/* PDF Upload Zone */}
                            <div className="bg-white rounded-xl border border-dashed border-gray-300 mb-6 overflow-hidden">
                                <div
                                    className="p-5 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                                    onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#EEF2FF'; }}
                                    onDragLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = ''; }}
                                    onDrop={e => {
                                        e.preventDefault();
                                        e.currentTarget.style.borderColor = '#d1d5db';
                                        e.currentTarget.style.background = '';
                                        const file = e.dataTransfer.files?.[0];
                                        if (file) handlePdfUpload(file);
                                    }}
                                    onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = '.pdf';
                                        input.onchange = e => {
                                            const file = (e.target as HTMLInputElement).files?.[0];
                                            if (file) handlePdfUpload(file);
                                        };
                                        input.click();
                                    }}
                                >
                                    {pdfParsing ? (
                                        <div className="flex items-center justify-center gap-3 py-3">
                                            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                            <p className="text-sm font-medium text-indigo-600">Parsing vendor quote...</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-2xl mb-2">📄</p>
                                            <p className="text-sm font-semibold text-gray-700">Drop vendor quote PDF here</p>
                                            <p className="text-[10px] text-gray-400 mt-1">AI auto-extracts line items, prices, and categories</p>
                                            <div className="flex items-center justify-center gap-3 mt-3">
                                                <button
                                                    onClick={e => { e.stopPropagation(); setShowPasteMode(!showPasteMode); }}
                                                    className="text-[10px] text-indigo-500 font-medium hover:underline"
                                                >
                                                    or paste quote text
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Paste mode */}
                                {showPasteMode && (
                                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                                        <textarea
                                            value={pasteText}
                                            onChange={e => setPasteText(e.target.value)}
                                            placeholder={`Paste vendor quote text here, e.g.:\n1. Hacking of existing tiles - Kitchen  1 lot  $800.00  $800.00\n2. Supply & install porcelain tiles  45 sqft  $6.50  $292.50`}
                                            className="w-full h-32 text-xs font-mono p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                                        />
                                        <button
                                            onClick={handlePasteQuote}
                                            disabled={!pasteText.trim() || pdfParsing}
                                            className="mt-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            Parse Quote Text
                                        </button>
                                    </div>
                                )}

                                {/* Error */}
                                {pdfError && (
                                    <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-xs text-red-600">{pdfError}</div>
                                )}

                                {/* Parse Results */}
                                {pdfResult && (
                                    <div className="border-t border-gray-200 p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-800">Parsed: {pdfResult.parsed.vendorName}</h3>
                                                <p className="text-[10px] text-gray-400">{pdfResult.totalItems} items extracted • Confidence: {Math.round(pdfResult.confidence * 100)}%</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-emerald-600 font-mono">${pdfResult.parsed.subtotal.toLocaleString()}</span>
                                                <button
                                                    onClick={loadParsedIntoBuilder}
                                                    className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800"
                                                >
                                                    Load into Quote ↓
                                                </button>
                                                <button
                                                    onClick={() => setPdfResult(null)}
                                                    className="px-3 py-2 text-xs text-gray-400 hover:text-gray-600"
                                                >✕</button>
                                            </div>
                                        </div>
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {pdfResult.tradeSections.map(section => (
                                                <div key={section.category} className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">{section.displayName}</p>
                                                    {section.items.map((item, i) => (
                                                        <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs text-gray-700 truncate">{item.description}</p>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    {item.location !== 'nil' && <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">{item.location}</span>}
                                                                    {item.taskType && <span className="text-[9px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded">{item.taskType}</span>}
                                                                </div>
                                                            </div>
                                                            <div className="text-right shrink-0 ml-3">
                                                                <p className="text-xs font-mono font-bold text-gray-800">${item.sellingPrice.toLocaleString()}</p>
                                                                <p className="text-[9px] text-gray-400">{item.quantity} {item.unit} × ${item.unitRate}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <QuoteBuilderEnhanced
                                onReady={handleReady}
                                onSectionsChange={handleSectionsChange}
                                onZonesReady={handleZonesReady}
                            />
                        </div>
                    </div>

                    {/* Client View */}
                    <div style={{ display: viewMode === 'client' ? 'block' : 'none' }}>
                        <div className={`bg-white rounded-xl shadow-lg p-10 ${showSequence ? '' : 'max-w-4xl mx-auto'}`}>
                            {currentSections.length > 0 ? (
                                <ClientQuotePreview sections={currentSections} />
                            ) : (
                                <div className="text-center py-20">
                                    <div className="text-5xl mb-4"></div>
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

                    {/* BOQ View */}
                    <div style={{ display: viewMode === 'boq' ? 'block' : 'none' }}>
                        <div className={`bg-white rounded-xl shadow-lg ${showSequence ? '' : 'max-w-5xl mx-auto'}`}>
                            {currentSections.length > 0 ? (
                                <div>
                                    {/* BOQ Header */}
                                    <div className="px-8 pt-8 pb-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-lg font-black text-gray-900 tracking-tight">BILL OF QUANTITIES</h2>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Standard BOQ Format — Grouped by Trade</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 uppercase">Ref</p>
                                                <p className="font-mono text-xs font-bold text-gray-700">{quoteSerial}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BOQ Table */}
                                    <div className="px-8 py-6">
                                        <table className="w-full border-collapse text-sm">
                                            <thead>
                                                <tr className="border-b-2 border-gray-900">
                                                    <th className="text-left py-2 pr-2 text-[9px] font-bold text-gray-500 uppercase w-12">S/N</th>
                                                    <th className="text-left py-2 pr-2 text-[9px] font-bold text-gray-500 uppercase">Description</th>
                                                    <th className="text-right py-2 pr-2 text-[9px] font-bold text-gray-500 uppercase w-16">Qty</th>
                                                    <th className="text-left py-2 pr-2 text-[9px] font-bold text-gray-500 uppercase w-16">Unit</th>
                                                    <th className="text-right py-2 pr-2 text-[9px] font-bold text-gray-500 uppercase w-24">Rate ($)</th>
                                                    <th className="text-right py-2 text-[9px] font-bold text-gray-500 uppercase w-28">Amount ($)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentSections.map((section, sIdx) => {
                                                    const sectionTotal = section.items.reduce((s, i) => s + (i.sellingPrice || 0), 0);
                                                    return (
                                                        <>
                                                            {/* Trade Header */}
                                                            <tr key={`header-${sIdx}`}>
                                                                <td colSpan={6} className="pt-6 pb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs font-black text-gray-900 uppercase tracking-wider">
                                                                            {String.fromCharCode(65 + sIdx)}. {section.displayName || section.category}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            {/* Line Items */}
                                                            {section.items.map((item, iIdx) => {
                                                                const qty = item.dimensions?.quantity || (item.dimensions?.lengthFt || 0) * (item.dimensions?.widthFt || 0) || 1;
                                                                const rate = qty > 0 ? (item.sellingPrice || 0) / qty : 0;
                                                                return (
                                                                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                                        <td className="py-2.5 pr-2 text-gray-400 text-xs">{iIdx + 1}</td>
                                                                        <td className="py-2.5 pr-2">
                                                                            <span className="text-xs text-gray-800">{item.description || 'Line item'}</span>
                                                                            {item.location && item.location !== 'nil' && (
                                                                                <span className="ml-2 text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded">{item.location}</span>
                                                                            )}
                                                                        </td>
                                                                        <td className="py-2.5 pr-2 text-right font-mono text-xs text-gray-700">{qty.toLocaleString()}</td>
                                                                        <td className="py-2.5 pr-2 text-xs text-gray-500">{item.dimensions?.unit || 'lot'}</td>
                                                                        <td className="py-2.5 pr-2 text-right font-mono text-xs text-gray-600">{rate.toFixed(2)}</td>
                                                                        <td className="py-2.5 text-right font-mono text-xs font-bold text-gray-900">{(item.sellingPrice || 0).toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                                    </tr>
                                                                );
                                                            })}
                                                            {/* Section Subtotal */}
                                                            <tr key={`sub-${sIdx}`} className="border-b border-gray-300">
                                                                <td colSpan={5} className="py-2 text-right text-[10px] font-bold text-gray-500 uppercase pr-2">Subtotal — {section.displayName || section.category}</td>
                                                                <td className="py-2 text-right font-mono text-sm font-black text-gray-900">${sectionTotal.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                            </tr>
                                                        </>
                                                    );
                                                })}
                                            </tbody>
                                        </table>

                                        {/* Grand Total */}
                                        <div className="mt-6 border-t-2 border-gray-900 pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-gray-500 uppercase">Subtotal (excl. GST)</span>
                                                <span className="font-mono text-lg font-black text-gray-900">${quoteTotal.toLocaleString('en-SG', { minimumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-xs text-gray-400">GST @ 9%</span>
                                                <span className="font-mono text-sm text-gray-600">${(quoteTotal * 0.09).toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                                                <span className="text-sm font-black text-gray-900 uppercase">Grand Total (incl. GST)</span>
                                                <span className="font-mono text-xl font-black text-emerald-600">${(quoteTotal * 1.09).toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Notes</p>
                                            <ul className="text-[11px] text-gray-500 space-y-1">
                                                <li>• All prices are in Singapore Dollars (SGD)</li>
                                                <li>• Provisional sums are subject to final measurement and adjustment</li>
                                                <li>• Quotation valid for 30 days from date of issue</li>
                                                <li>• Variations to scope will be issued as separate Variation Orders (VO)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <div className="text-5xl mb-4">📋</div>
                                    <h3 className="text-xl font-medium text-gray-700">No BOQ to display</h3>
                                    <p className="text-gray-500 mt-2">Generate a quote in Builder first — the BOQ formats it automatically</p>
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

                {/* RIGHT: Sequence Context Panel */}
                {showSequence && (
                    <div className="w-[40%] bg-white border-l border-gray-200 overflow-y-auto flex flex-col">
                        {/* Sequence Header */}
                        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
                            <div className="px-4 py-3 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">Sequence</h3>
                                    <p className="text-[10px] text-gray-400">Design studio context</p>
                                </div>
                                <button onClick={() => setShowSequence(false)} className="text-gray-300 hover:text-gray-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </button>
                            </div>
                            {/* Tabs */}
                            <div className="flex border-t border-gray-100">
                                {(['drawings', 'materials', 'survey', 'brief'] as const).map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setSequenceTab(tab)}
                                        className={`flex-1 px-3 py-2.5 text-xs font-medium capitalize transition-all border-b-2 ${sequenceTab === tab
                                            ? 'border-amber-500 text-gray-900'
                                            : 'border-transparent text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="p-4 space-y-3 flex-1">
                            {/* DRAWINGS */}
                            {sequenceTab === 'drawings' && SEQUENCE_DRAWINGS.map(d => (
                                <div key={d.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-semibold text-gray-800">{d.title}</h4>
                                                <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded font-medium">{d.zone}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-1">{d.ref} · {d.date}</p>
                                        </div>
                                        <span className={`text-[9px] px-2 py-1 rounded-full font-bold ${d.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
                                            }`}>{d.status}</span>
                                    </div>
                                    <div className="mt-3 h-32 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center">
                                        <div className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-200 mx-auto mb-1"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
                                            <span className="text-[10px] text-gray-300">{d.ref}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* MATERIALS */}
                            {sequenceTab === 'materials' && SEQUENCE_MATERIALS.map(m => (
                                <div key={m.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-800">{m.name}</h4>
                                            <p className="text-[11px] text-gray-500 mt-0.5">{m.grade}</p>
                                        </div>
                                        <span className="text-[9px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded font-medium">{m.category}</span>
                                    </div>
                                    <div className="mt-3 flex items-center gap-4 text-[11px] text-gray-500">
                                        <span>Supplier: <strong className="text-gray-700">{m.supplier}</strong></span>
                                        <span>Rate: <strong className="text-gray-700">{m.rate}</strong></span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                        Lead time: {m.leadTime}
                                    </div>
                                </div>
                            ))}

                            {/* SURVEY */}
                            {sequenceTab === 'survey' && (
                                <>
                                    <div className="border border-gray-100 rounded-xl p-4">
                                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Floor Areas</h4>
                                        <div className="space-y-0">
                                            {SEQUENCE_SURVEY.map(s => (
                                                <div key={s.room} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                                    <span className="text-sm text-gray-700">{s.room}</span>
                                                    <div className="text-right">
                                                        <span className="text-xs font-bold text-gray-800">{s.dims}</span>
                                                        <span className="text-[10px] text-gray-400 ml-2">{s.area}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                                            <span className="text-xs font-bold text-gray-700">Total Floor Area</span>
                                            <span className="text-xs font-bold text-amber-600">111.48 sqm (1,200 sqft)</span>
                                        </div>
                                    </div>
                                    <div className="border border-gray-100 rounded-xl p-4 border-l-3 border-l-amber-300">
                                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Structural Issues</h4>
                                        <div className="space-y-2">
                                            <div className="p-2 bg-amber-50 rounded-lg text-xs">
                                                <strong className="text-amber-700">Uneven Wall</strong>
                                                <p className="text-gray-500 mt-0.5">Master bathroom — 15mm deviation over 2m</p>
                                            </div>
                                            <div className="p-2 bg-red-50 rounded-lg text-xs">
                                                <strong className="text-red-600">Water Stain</strong>
                                                <p className="text-gray-500 mt-0.5">Ceiling near AC unit — needs inspection</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* BRIEF */}
                            {sequenceTab === 'brief' && (
                                <div className="border border-gray-100 rounded-xl p-4">
                                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Client Brief</h4>
                                    <div className="space-y-0">
                                        {Object.entries(SEQUENCE_BRIEF).map(([key, value]) => (
                                            <div key={key} className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0">
                                                <span className="text-[11px] text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                <span className="text-xs font-medium text-gray-800 text-right max-w-[60%]">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sequence Footer */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3">
                            <a href="/sequence" className="block text-center text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors">
                                Open Full Sequence →
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {/* PDF Modal */}
            {showPdfPreview && (
                <QuoteDocument
                    quoteData={{
                        quoteNumber: 'Q-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-001',
                        date: new Date().toLocaleDateString(),
                        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                        clientName: 'Valued Client',
                        projectAddress: 'Project Site Address',
                        accountManager: 'Sales Designer',
                        currency: 'SGD',
                        lineItems: currentSections.flatMap((section, sectIdx) =>
                            section.items.map((item, itemIdx) => ({
                                id: item.id,
                                no: itemIdx + 1,
                                item: item.description || 'Item Name',
                                description: item.tradeRole !== TradeRole.GENERAL_BUILDER ? `[${item.tradeRole}]` : undefined,
                                qty: item.dimensions.quantity || (item.dimensions.lengthFt || 0) * (item.dimensions.widthFt || 0) || 1,
                                unit: item.dimensions.unit,
                                rate: item.sellingPrice / (item.dimensions.quantity || 1),
                                amount: item.sellingPrice,
                                category: section.displayName,
                                phase: item.phase || RenovationPhase.HARD
                            }))
                        )
                    }}
                    onClose={() => setShowPdfPreview(false)}
                />
            )}
        </div>
    );
}

