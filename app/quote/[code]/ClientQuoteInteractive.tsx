'use client';

import { useState, useEffect, useMemo } from 'react';

// ============================================================
// TYPES
// ============================================================
interface MaterialOption {
    id: string;
    name: string;
    rate: number;
    description?: string;
    isRecommended?: boolean;
}

interface LineComment {
    id: string;
    text: string;
    author: 'client' | 'designer';
    timestamp: string;
}

interface LineItem {
    id: string;
    description: string;
    dimensions: { unit: string; quantity?: number; lengthFt?: number; widthFt?: number };
    sellingPrice: number;
    unitRate: number;
    margin: number;
    isGift?: boolean;
    materialOptions?: MaterialOption[];
    selectedOptionId?: string;
}

interface TradeSection {
    id: string;
    category: string;
    displayName: string;
    items: LineItem[];
    subtotalSelling: number;
    overallMargin: number;
}

interface ClientFeedbackItem {
    status: 'pending' | 'approved' | 'flagged';
    selectedOptionId?: string;
    comments: LineComment[];
}

interface QuoteData {
    shareCode: string;
    quoteNumber: string;
    companyName: string;
    companyTagline?: string;
    projectName: string;
    clientName?: string;
    jurisdiction: string;
    sections: TradeSection[];
    clientFeedback: Record<string, ClientFeedbackItem>;
    createdAt: string;
    updatedAt: string;
}

// ============================================================
// HELPERS
// ============================================================
function formatPrice(amount: number, jurisdiction: string = 'SG'): string {
    const prefix = jurisdiction === 'MY' ? 'RM' : 'S$';
    return `${prefix}${amount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function parseDescription(desc: string): { title: string; details: string } {
    const parts = desc.split('  ');
    return {
        title: parts[0] || desc,
        details: parts.slice(1).join('  '),
    };
}

function getQuantity(dims: { quantity?: number; lengthFt?: number; widthFt?: number }): number {
    if (dims.quantity) return dims.quantity;
    if (dims.lengthFt && dims.widthFt) return dims.lengthFt * dims.widthFt;
    return 1;
}

// ============================================================
// ASSET TYPES (inline for simplicity)
// ============================================================
interface AssetComment {
    id: string;
    text: string;
    author: 'client' | 'designer';
    timestamp: string;
}

interface ProjectAsset {
    id: string;
    category: 'layout' | 'renders' | 'elevations' | 'materials' | 'documents';
    title: string;
    description?: string;
    zone?: string;
    status: 'pending' | 'approved' | 'flagged';
    comments: AssetComment[];
    uploadedBy: string;
    uploadedAt: string;
}

// ============================================================
// COMPONENT
// ============================================================
export default function ClientQuoteInteractive({ shareCode }: { shareCode: string }) {
    const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
    const [activeVisualTab, setActiveVisualTab] = useState<'layout' | 'renders' | 'elevations' | 'materials' | 'documents'>('layout');

    // Asset state
    const [assets, setAssets] = useState<ProjectAsset[]>([]);
    const [assetCommentInputs, setAssetCommentInputs] = useState<Record<string, string>>({});
    const [expandedAssetComments, setExpandedAssetComments] = useState<Set<string>>(new Set());

    // Load quote + assets
    useEffect(() => {
        async function load() {
            try {
                const [quoteRes, assetsRes] = await Promise.all([
                    fetch(`/api/quotes/${shareCode}`),
                    fetch(`/api/assets/${shareCode}`),
                ]);
                if (!quoteRes.ok) throw new Error('Quote not found');
                const quoteJson = await quoteRes.json();
                setQuoteData(quoteJson);
                if (assetsRes.ok) {
                    const assetsJson = await assetsRes.json();
                    setAssets(assetsJson.assets || []);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load quote');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [shareCode]);

    // Send action to API
    const sendAction = async (itemId: string, action: string, payload?: Record<string, unknown>) => {
        try {
            const res = await fetch(`/api/quotes/${shareCode}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId, action, payload }),
            });
            const data = await res.json();
            if (data.feedback && quoteData) {
                setQuoteData({ ...quoteData, clientFeedback: data.feedback });
            }
        } catch (err) {
            console.error('Action failed:', err);
        }
    };

    const getFeedback = (itemId: string): ClientFeedbackItem => {
        return quoteData?.clientFeedback?.[itemId] || { status: 'pending', comments: [] };
    };

    // Stats
    const stats = useMemo(() => {
        if (!quoteData) return { total: 0, approved: 0, flagged: 0, pending: 0 };
        const allItems = quoteData.sections.flatMap(s => s.items);
        const total = allItems.length;
        const approved = allItems.filter(i => getFeedback(i.id).status === 'approved').length;
        const flagged = allItems.filter(i => getFeedback(i.id).status === 'flagged').length;
        return { total, approved, flagged, pending: total - approved - flagged };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quoteData]);

    const grandTotal = useMemo(() => {
        if (!quoteData) return 0;
        return quoteData.sections.reduce((sum, s) =>
            sum + s.items.reduce((iSum, item) => {
                if (item.isGift) return iSum;
                // If client picked a different option, recalculate
                const fb = getFeedback(item.id);
                if (fb.selectedOptionId && item.materialOptions) {
                    const opt = item.materialOptions.find(o => o.id === fb.selectedOptionId);
                    if (opt) {
                        const qty = getQuantity(item.dimensions);
                        return iSum + (opt.rate * qty * (1 + item.margin));
                    }
                }
                return iSum + item.sellingPrice;
            }, 0), 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quoteData]);

    //  LOADING / ERROR 
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">Loading your quote...</p>
                </div>
            </div>
        );
    }

    if (error || !quoteData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm border">
                    <p className="text-red-500 text-lg font-bold mb-2">Quote Not Found</p>
                    <p className="text-gray-400 text-sm">This link may have expired or is invalid.</p>
                    <code className="mt-4 block text-xs text-gray-300">{shareCode}</code>
                </div>
            </div>
        );
    }

    //  RENDER 
    return (
        <div className="h-screen flex flex-col bg-gray-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">{quoteData.companyName || 'Quote'}</h1>
                            <p className="text-xs text-gray-400">{quoteData.projectName}  {quoteData.quoteNumber}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">{formatPrice(grandTotal, quoteData.jurisdiction)}</div>
                            <p className="text-[10px] text-gray-400 mt-0.5">Total (excl. GST)</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${stats.total > 0 ? (stats.approved / stats.total * 100) : 0}%` }} />
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-medium shrink-0">
                            <span className="text-emerald-600">Approved: {stats.approved}</span>
                            <span className="text-amber-600">Flagged: {stats.flagged}</span>
                            <span className="text-gray-400">Pending: {stats.pending}</span>
                            <span className="text-gray-300">of {stats.total} items</span>
                        </div>
                    </div>

                    <p className="text-[10px] text-gray-400 mt-2 italic">
                        Review each item below. Approve items you are happy with, or flag items that need changes.
                    </p>
                </div>
            </div>

            {/* Split Screen Layout */}
            <div className="flex flex-1 min-h-0">
                {/* LEFT PANEL  Quotation */}
                <div className="w-[55%] overflow-y-auto px-6 py-6 space-y-6 border-r border-gray-200">
                    {quoteData.sections.map(section => {
                        const sectionTotal = section.items.reduce((sum, item) => {
                            if (item.isGift) return sum;
                            const fb = getFeedback(item.id);
                            if (fb.selectedOptionId && item.materialOptions) {
                                const opt = item.materialOptions.find(o => o.id === fb.selectedOptionId);
                                if (opt) {
                                    const qty = getQuantity(item.dimensions);
                                    return sum + (opt.rate * qty * (1 + item.margin));
                                }
                            }
                            return sum + item.sellingPrice;
                        }, 0);

                        return (
                            <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                {/* Section Header */}
                                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                    <h2 className="font-bold text-gray-900 text-sm">{section.displayName}</h2>
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-gray-900">{formatPrice(sectionTotal, quoteData.jurisdiction)}</span>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="divide-y divide-gray-100">
                                    {section.items.map((item, idx) => {
                                        const { title, details } = parseDescription(item.description);
                                        const feedback = getFeedback(item.id);
                                        const isApproved = feedback.status === 'approved';
                                        const isFlagged = feedback.status === 'flagged';
                                        const hasOptions = item.materialOptions && item.materialOptions.length > 0;
                                        const hasComments = feedback.comments?.length > 0;
                                        const isCommentOpen = expandedComments.has(item.id);

                                        // Calculate price (considering selected option)
                                        let displayPrice = item.sellingPrice;
                                        let recommendedPrice = item.sellingPrice;
                                        if (hasOptions && item.materialOptions) {
                                            const recommended = item.materialOptions.find(o => o.isRecommended) || item.materialOptions[0];
                                            const qty = getQuantity(item.dimensions);
                                            recommendedPrice = recommended.rate * qty * (1 + item.margin);

                                            if (feedback.selectedOptionId) {
                                                const selected = item.materialOptions.find(o => o.id === feedback.selectedOptionId);
                                                if (selected) {
                                                    displayPrice = selected.rate * qty * (1 + item.margin);
                                                }
                                            }
                                        }

                                        return (
                                            <div key={item.id} className={`px-5 py-3 transition-colors ${isApproved ? 'bg-emerald-50/30' : isFlagged ? 'bg-amber-50/30' : ''}`}>
                                                <div className="flex items-start gap-3">
                                                    {/* Number */}
                                                    <span className="text-[10px] font-mono text-gray-300 mt-1 w-4 shrink-0">{idx + 1}</span>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="min-w-0">
                                                                <p className={`text-sm font-medium ${isApproved ? 'text-gray-500' : 'text-gray-900'}`}>{title}</p>
                                                                {details && (
                                                                    <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{details}</p>
                                                                )}
                                                            </div>
                                                            <div className="text-right shrink-0">
                                                                {item.isGift ? (
                                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-bold rounded">Complimentary</span>
                                                                ) : (
                                                                    <span className={`text-sm font-bold ${isApproved ? 'text-gray-500' : 'text-gray-900'}`}>
                                                                        {formatPrice(displayPrice, quoteData.jurisdiction)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Material Options Cards */}
                                                        {hasOptions && item.materialOptions && (
                                                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                                {item.materialOptions.map(opt => {
                                                                    const isSelected = feedback.selectedOptionId === opt.id || (!feedback.selectedOptionId && opt.isRecommended);
                                                                    const qty = getQuantity(item.dimensions);
                                                                    const optPrice = opt.rate * qty * (1 + item.margin);
                                                                    const diff = optPrice - recommendedPrice;

                                                                    return (
                                                                        <button
                                                                            key={opt.id}
                                                                            onClick={() => sendAction(item.id, 'selectOption', { optionId: opt.id })}
                                                                            className={`text-left p-3 rounded-lg border-2 transition-all ${isSelected
                                                                                ? 'border-purple-500 bg-purple-50 shadow-sm'
                                                                                : 'border-gray-200 bg-white hover:border-purple-300'
                                                                                }`}
                                                                        >
                                                                            <div className="flex items-center justify-between">
                                                                                <span className={`text-xs font-bold ${isSelected ? 'text-purple-700' : 'text-gray-700'}`}>{opt.name || 'Option'}</span>
                                                                                {opt.isRecommended && (
                                                                                    <span className="text-[9px] px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded font-bold uppercase tracking-wide">Recommended</span>
                                                                                )}
                                                                            </div>
                                                                            <div className="mt-1 text-xs text-gray-500">{formatPrice(opt.rate, quoteData.jurisdiction)}/{item.dimensions.unit}</div>
                                                                            {opt.description && (
                                                                                <div className="mt-1 text-[10px] text-gray-400 line-clamp-1">{opt.description}</div>
                                                                            )}
                                                                            {diff !== 0 && !opt.isRecommended && (
                                                                                <div className={`mt-1 text-[10px] font-bold ${diff > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                                                                    {diff > 0 ? '+' : ''}{formatPrice(diff, quoteData.jurisdiction)}
                                                                                </div>
                                                                            )}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}

                                                        {/* Comments */}
                                                        {(hasComments || isCommentOpen) && (
                                                            <div className="mt-2 space-y-1.5">
                                                                {feedback.comments?.map(c => (
                                                                    <div key={c.id} className={`text-[11px] px-2 py-1 rounded ${c.author === 'client' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                                                        <span className="font-bold">{c.author === 'client' ? 'You' : 'Designer'}:</span> {c.text}
                                                                    </div>
                                                                ))}
                                                                {isCommentOpen && (
                                                                    <div className="flex items-center gap-1 mt-1">
                                                                        <input
                                                                            type="text"
                                                                            value={commentInputs[item.id] || ''}
                                                                            onChange={e => setCommentInputs({ ...commentInputs, [item.id]: e.target.value })}
                                                                            onKeyDown={e => {
                                                                                if (e.key === 'Enter' && commentInputs[item.id]?.trim()) {
                                                                                    sendAction(item.id, 'comment', { text: commentInputs[item.id].trim() });
                                                                                    setCommentInputs({ ...commentInputs, [item.id]: '' });
                                                                                }
                                                                            }}
                                                                            placeholder="Type your comment and press Enter..."
                                                                            className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:border-purple-400 focus:outline-none"
                                                                        />
                                                                        <button
                                                                            onClick={() => {
                                                                                if (commentInputs[item.id]?.trim()) {
                                                                                    sendAction(item.id, 'comment', { text: commentInputs[item.id].trim() });
                                                                                    setCommentInputs({ ...commentInputs, [item.id]: '' });
                                                                                }
                                                                            }}
                                                                            className="px-2 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700"
                                                                        >Send</button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex flex-col gap-1.5 shrink-0">
                                                        <button
                                                            onClick={() => sendAction(item.id, 'approve')}
                                                            className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-sm transition-all ${isApproved
                                                                ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                                                                : 'border-gray-200 text-gray-300 hover:border-emerald-400 hover:text-emerald-500'
                                                                }`}
                                                            title="Approve this item"
                                                        ></button>
                                                        <button
                                                            onClick={() => {
                                                                sendAction(item.id, 'flag');
                                                                if (!isFlagged) {
                                                                    setExpandedComments(new Set([...expandedComments, item.id]));
                                                                }
                                                            }}
                                                            className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${isFlagged
                                                                ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                                                                : 'border-gray-200 text-gray-300 hover:border-amber-400 hover:text-amber-500'
                                                                }`}
                                                            title="Flag for changes"
                                                        ><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg></button>
                                                        <button
                                                            onClick={() => {
                                                                const next = new Set(expandedComments);
                                                                if (next.has(item.id)) next.delete(item.id);
                                                                else next.add(item.id);
                                                                setExpandedComments(next);
                                                            }}
                                                            className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${hasComments
                                                                ? 'border-blue-300 bg-blue-50 text-blue-500'
                                                                : 'border-gray-200 text-gray-300 hover:border-blue-300 hover:text-blue-400'
                                                                }`}
                                                            title="Leave a comment"
                                                        ><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}

                    {/* Payment Schedule */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="font-bold text-gray-900 text-sm">Payment Schedule</h2>
                        </div>
                        <div className="p-5">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 text-gray-500 font-medium text-xs">Stage</th>
                                        <th className="text-left py-2 text-gray-500 font-medium text-xs">Details</th>
                                        <th className="text-right py-2 text-gray-500 font-medium text-xs">%</th>
                                        <th className="text-right py-2 text-gray-500 font-medium text-xs">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { stage: 'Upon Confirmation', details: 'Designing Stage  Deposit', pct: 20 },
                                        { stage: 'Start of Renovation', details: 'Masonry Stage  Site commencement', pct: 40 },
                                        { stage: 'Carpentry Measurement', details: 'Carpentry Stage  Factory order', pct: 35 },
                                        { stage: 'Upon Completion', details: 'Handover Stage  Final inspection', pct: 5 },
                                    ].map((term, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 last:border-b-0">
                                            <td className="py-2.5 font-medium text-gray-800">{term.stage}</td>
                                            <td className="py-2.5 text-gray-500">{term.details}</td>
                                            <td className="py-2.5 text-right font-bold text-gray-700">{term.pct}%</td>
                                            <td className="py-2.5 text-right font-bold text-gray-900">
                                                {formatPrice(grandTotal * term.pct / 100, quoteData.jurisdiction)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-gray-300">
                                        <td colSpan={2} className="py-2.5 font-bold text-gray-900">Total</td>
                                        <td className="py-2.5 text-right font-bold text-gray-900">100%</td>
                                        <td className="py-2.5 text-right font-bold text-gray-900">
                                            {formatPrice(grandTotal, quoteData.jurisdiction)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="font-bold text-gray-900 text-sm">Terms & Conditions</h2>
                        </div>
                        <div className="p-5">
                            <ol className="space-y-2 text-xs text-gray-600 leading-relaxed list-decimal list-inside">
                                <li>This quotation is valid for 30 days from the date of issue.</li>
                                <li>All prices are quoted in the specified currency and are subject to prevailing GST.</li>
                                <li>A minimum deposit as per payment terms is required upon confirmation.</li>
                                <li>Any additional works not specified in this quotation will be charged separately.</li>
                                <li>The client is responsible for ensuring clear site access for works to commence.</li>
                                <li>Timeline estimates are subject to site conditions and permit approvals.</li>
                                <li>Variations to the scope of works may result in price adjustments.</li>
                                <li>Final measurements will be taken on-site and may differ from initial estimates.</li>
                                <li>The company reserves the right to engage sub-contractors where necessary.</li>
                                <li>Disputes shall be resolved under the laws of the specified jurisdiction.</li>
                            </ol>
                        </div>
                    </div>

                    {/* Grand Total */}
                    <div className="bg-gray-900 rounded-xl p-6 text-white text-center">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Estimated Total</p>
                        <p className="text-3xl font-bold mt-1">{formatPrice(grandTotal, quoteData.jurisdiction)}</p>
                        <p className="text-xs text-gray-500 mt-2">Excludes GST  Subject to final measurement</p>
                        <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                            <span className="text-emerald-400">{stats.approved} approved</span>
                            <span className="text-amber-400">{stats.flagged} flagged</span>
                            <span className="text-gray-500">{stats.pending} pending</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-[10px] text-gray-300 py-4">
                        Powered by Roof  {quoteData.companyName}
                    </div>
                </div>

                {/* RIGHT PANEL  Visual Assets from Roof */}
                <div className="w-[45%] bg-white overflow-y-auto">
                    {/* Tabs */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
                        <div className="flex">
                            {(['layout', 'renders', 'elevations', 'materials', 'documents'] as const).map(tab => {
                                const count = assets.filter(a => a.category === tab).length;
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveVisualTab(tab)}
                                        className={`flex-1 px-3 py-3 text-xs font-medium capitalize transition-all border-b-2 ${activeVisualTab === tab
                                                ? 'border-gray-900 text-gray-900'
                                                : 'border-transparent text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        {tab}
                                        {count > 0 && (
                                            <span className={`ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full ${activeVisualTab === tab ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
                                                }`}>{count}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Asset Cards */}
                    <div className="p-4 space-y-3">
                        {assets.filter(a => a.category === activeVisualTab).length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-200 mb-3">
                                    {activeVisualTab === 'layout' && <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></>}
                                    {activeVisualTab === 'renders' && <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>}
                                    {activeVisualTab === 'elevations' && <><line x1="3" y1="21" x2="21" y2="21" /><path d="M5 21V7l7-4 7 4v14" /><rect x="9" y="13" width="6" height="8" /></>}
                                    {activeVisualTab === 'materials' && <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>}
                                    {activeVisualTab === 'documents' && <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>}
                                </svg>
                                <p className="text-xs text-gray-300">Nothing uploaded yet</p>
                                <p className="text-[10px] text-gray-200 mt-1">Assets sync from Roof</p>
                            </div>
                        ) : (
                            assets.filter(a => a.category === activeVisualTab).map(asset => (
                                <div key={asset.id} className={`border rounded-xl p-4 transition-all ${asset.status === 'approved' ? 'border-emerald-200 bg-emerald-50/30' :
                                        asset.status === 'flagged' ? 'border-amber-200 bg-amber-50/30' :
                                            'border-gray-100 bg-white hover:border-gray-200'
                                    }`}>
                                    {/* Asset Header */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-semibold text-gray-800 truncate">{asset.title}</h4>
                                                {asset.zone && (
                                                    <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded font-medium shrink-0">{asset.zone}</span>
                                                )}
                                            </div>
                                            {asset.description && (
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{asset.description}</p>
                                            )}
                                            <p className="text-[10px] text-gray-300 mt-1.5">By {asset.uploadedBy}  {new Date(asset.uploadedAt).toLocaleDateString()}</p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-1 shrink-0">
                                            <button
                                                onClick={() => {
                                                    setAssets(prev => prev.map(a =>
                                                        a.id === asset.id ? { ...a, status: a.status === 'approved' ? 'pending' : 'approved' } : a
                                                    ));
                                                }}
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all ${asset.status === 'approved'
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-gray-100 text-gray-400 hover:bg-emerald-50 hover:text-emerald-500'
                                                    }`}
                                                title="Approve"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setAssets(prev => prev.map(a =>
                                                        a.id === asset.id ? { ...a, status: a.status === 'flagged' ? 'pending' : 'flagged' } : a
                                                    ));
                                                    // Auto-expand comments when flagging
                                                    setExpandedAssetComments(prev => {
                                                        const next = new Set(prev);
                                                        next.add(asset.id);
                                                        return next;
                                                    });
                                                }}
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all ${asset.status === 'flagged'
                                                        ? 'bg-amber-500 text-white'
                                                        : 'bg-gray-100 text-gray-400 hover:bg-amber-50 hover:text-amber-500'
                                                    }`}
                                                title="Flag for changes"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setExpandedAssetComments(prev => {
                                                        const next = new Set(prev);
                                                        if (next.has(asset.id)) next.delete(asset.id);
                                                        else next.add(asset.id);
                                                        return next;
                                                    });
                                                }}
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all ${expandedAssetComments.has(asset.id)
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-500'
                                                    }`}
                                                title="Comment"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                                {asset.comments.length > 0 && (
                                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[8px] rounded-full flex items-center justify-center">{asset.comments.length}</span>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Comments Thread */}
                                    {expandedAssetComments.has(asset.id) && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            {asset.comments.length > 0 && (
                                                <div className="space-y-2 mb-2">
                                                    {asset.comments.map(c => (
                                                        <div key={c.id} className={`text-xs p-2 rounded-lg ${c.author === 'client' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-600'
                                                            }`}>
                                                            <span className="font-medium">{c.author === 'client' ? 'You' : 'Designer'}:</span> {c.text}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={assetCommentInputs[asset.id] || ''}
                                                    onChange={e => setAssetCommentInputs(prev => ({ ...prev, [asset.id]: e.target.value }))}
                                                    placeholder="Add a comment..."
                                                    className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-300"
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter' && assetCommentInputs[asset.id]?.trim()) {
                                                            const newComment: AssetComment = {
                                                                id: `ac-${Date.now()}`,
                                                                text: assetCommentInputs[asset.id].trim(),
                                                                author: 'client',
                                                                timestamp: new Date().toISOString(),
                                                            };
                                                            setAssets(prev => prev.map(a =>
                                                                a.id === asset.id ? { ...a, comments: [...a.comments, newComment] } : a
                                                            ));
                                                            setAssetCommentInputs(prev => ({ ...prev, [asset.id]: '' }));
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={() => {
                                                        if (assetCommentInputs[asset.id]?.trim()) {
                                                            const newComment: AssetComment = {
                                                                id: `ac-${Date.now()}`,
                                                                text: assetCommentInputs[asset.id].trim(),
                                                                author: 'client',
                                                                timestamp: new Date().toISOString(),
                                                            };
                                                            setAssets(prev => prev.map(a =>
                                                                a.id === asset.id ? { ...a, comments: [...a.comments, newComment] } : a
                                                            ));
                                                            setAssetCommentInputs(prev => ({ ...prev, [asset.id]: '' }));
                                                        }
                                                    }}
                                                    className="px-3 py-2 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                                                >
                                                    Send
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

