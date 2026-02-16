import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Jurisdiction } from '@/types/core';
import {
    UniversalQuoteLine,
    createEmptyQuoteLine,
    recalculateQuoteLine,
    detectMeasurementUnit,
    getMeasurementLabel,
    MeasurementUnit,
    LinearInputUnit,
    AreaInputUnit,
    LINEAR_TO_MM,
    AREA_TO_SQMM,
    MAIN_CATEGORIES,
    LOCATION_PRESETS
} from '@/types/quote';
import QuoteDocument from './QuoteDocument';
import { TERMS_TEMPLATES, ProjectType } from '@/data/terms-templates';
import { ChevronDown, ChevronUp, Plus, Trash2, GripVertical, FileText, AlertTriangle, Info, X } from 'lucide-react';
import { runSmartAlerts, checkMarginAlerts, SmartAlert } from '@/lib/smart-alerts';

export default function QuoteBuilder() {
    const { clients, suppliers } = useData();

    // --- PROJECT STATE ---
    const [projectName, setProjectName] = useState('');
    const [selectedClientId, setSelectedClientId] = useState('');
    const [prospectName, setProspectName] = useState(''); // For estimates without formal client
    const [quoteStatus, setQuoteStatus] = useState<'ESTIMATE' | 'DRAFT' | 'SENT'>('ESTIMATE');
    const [areaSize, setAreaSize] = useState(1000);
    const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('SG');
    const [projectType, setProjectType] = useState<ProjectType>('HDB');
    const [showPreview, setShowPreview] = useState(false);

    // --- LINE ITEMS STATE ---
    const [lines, setLines] = useState<UniversalQuoteLine[]>([]);
    const [expandedLines, setExpandedLines] = useState<Set<string>>(new Set());
    const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

    // --- CALCULATIONS ---
    const quoteSummary = useMemo(() => {
        let totalCost = 0;
        let totalPrice = 0;

        lines.forEach(line => {
            if (line.type === 'ITEM') {
                totalCost += line.lineCost;
                totalPrice += line.lineTotal;
            }
        });

        const margin = totalPrice > 0 ? (totalPrice - totalCost) / totalPrice : 0;
        return { totalCost, totalPrice, margin, lineCount: lines.filter(l => l.type === 'ITEM').length };
    }, [lines]);

    // --- SMART ALERTS ---
    const activeAlerts = useMemo(() => {
        const lineData = lines.map(l => ({
            id: l.id,
            mainCategory: l.mainCategory,
            taskDescription: l.taskDescription,
            sellingRate: l.sellingRate,
            internalCost: l.internalCostRate
        }));

        const scopeAlerts = runSmartAlerts(lineData);
        const marginAlert = checkMarginAlerts(quoteSummary.totalCost, quoteSummary.totalPrice, 20);

        const allAlerts = marginAlert ? [...scopeAlerts, marginAlert] : scopeAlerts;

        // Filter out dismissed alerts
        return allAlerts.filter(a => !dismissedAlerts.has(a.id));
    }, [lines, quoteSummary, dismissedAlerts]);

    const dismissAlert = (alertId: string) => {
        setDismissedAlerts(prev => new Set([...prev, alertId]));
    };

    // --- LINE ITEM HANDLERS ---
    const addLine = (type: UniversalQuoteLine['type'] = 'ITEM') => {
        const newLine = createEmptyQuoteLine(lines.length + 1);
        newLine.type = type;
        if (type === 'HEADING') newLine.mainCategory = 'NEW SECTION';
        if (type === 'REMARK') newLine.taskDescription = 'Note: ';
        setLines([...lines, newLine]);
        setExpandedLines(new Set([...expandedLines, newLine.id]));
    };

    const updateLine = (id: string, updates: Partial<UniversalQuoteLine>) => {
        setLines(prev => prev.map(line => {
            if (line.id !== id) return line;

            let updated = { ...line, ...updates };

            // Auto-detect measurement unit when category changes
            if (updates.mainCategory && updates.mainCategory !== line.mainCategory) {
                updated.measurementUnit = detectMeasurementUnit(updates.mainCategory);
            }

            // Recalculate derived fields
            if (updates.displayQuantity !== undefined || updates.internalCostRate !== undefined || updates.sellingRate !== undefined) {
                updated = recalculateQuoteLine(updated);
            }

            return updated;
        }));
    };

    const removeLine = (id: string) => {
        setLines(prev => prev.filter(l => l.id !== id));
        setExpandedLines(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const toggleExpand = (id: string) => {
        setExpandedLines(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // Get unit options based on measurement type
    const getUnitOptions = (unit: MeasurementUnit): { value: string, label: string }[] => {
        switch (unit) {
            case 'LinearMm':
                return [
                    { value: 'mm', label: 'mm' },
                    { value: 'cm', label: 'cm' },
                    { value: 'm', label: 'metre' },
                    { value: 'ft', label: 'feet' }
                ];
            case 'AreaSqMm':
                return [
                    { value: 'sqm', label: 'sqm' },
                    { value: 'sqft', label: 'sqft' }
                ];
            case 'Unit':
            default:
                return [{ value: 'unit', label: 'unit' }];
        }
    };

    return (
        <div className="flex flex-col h-full">

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* OVERALL BAR (Sticky Header) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-lg border-b border-white/10 p-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div>
                            <input
                                value={projectName}
                                onChange={e => setProjectName(e.target.value)}
                                placeholder="Project Name..."
                                className="bg-transparent text-xl font-bold text-white border-b border-transparent hover:border-white/30 focus:border-blue-400 focus:outline-none transition-colors"
                            />
                            <p className="text-xs text-slate-400 mt-1">
                                {clients.find(c => c.id === selectedClientId)?.name || 'No Client Selected'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        {/* Line Count */}
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Items</p>
                            <p className="text-2xl font-black text-white">{quoteSummary.lineCount}</p>
                        </div>

                        {/* Total */}
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total ({jurisdiction === 'SG' ? 'SGD' : 'MYR'})</p>
                            <p className="text-2xl font-black text-emerald-400">${quoteSummary.totalPrice.toLocaleString()}</p>
                        </div>

                        {/* Margin */}
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Margin</p>
                            <p className={`text-2xl font-black ${quoteSummary.margin >= 0.25 ? 'text-green-400' : 'text-red-400'}`}>
                                {(quoteSummary.margin * 100).toFixed(1)}%
                            </p>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={() => setShowPreview(true)}
                            disabled={quoteSummary.lineCount === 0}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95"
                        >
                            <FileText className="w-4 h-4" />
                            Generate
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* SMART ALERTS PANEL */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {activeAlerts.length > 0 && (
                <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
                    <div className="max-w-6xl mx-auto space-y-2">
                        {activeAlerts.map(alert => (
                            <div
                                key={alert.id}
                                className={`flex items-start gap-3 p-3 rounded-lg ${alert.severity === 'CRITICAL' ? 'bg-red-100 border border-red-200' :
                                    alert.severity === 'WARNING' ? 'bg-amber-100 border border-amber-200' :
                                        'bg-blue-50 border border-blue-100'
                                    }`}
                            >
                                {alert.severity === 'CRITICAL' || alert.severity === 'WARNING' ? (
                                    <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${alert.severity === 'CRITICAL' ? 'text-red-600' : 'text-amber-600'
                                        }`} />
                                ) : (
                                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className={`font-semibold text-sm ${alert.severity === 'CRITICAL' ? 'text-red-800' :
                                        alert.severity === 'WARNING' ? 'text-amber-800' :
                                            'text-blue-800'
                                        }`}>
                                        {alert.title}
                                    </p>
                                    <p className="text-xs text-slate-600 mt-0.5">{alert.message}</p>
                                    {alert.suggestedAction && (
                                        <p className="text-xs text-slate-500 mt-1 italic">💡 {alert.suggestedAction}</p>
                                    )}
                                </div>
                                {alert.dismissable && (
                                    <button
                                        onClick={() => dismissAlert(alert.id)}
                                        className="p-1 hover:bg-white/50 rounded transition-colors"
                                        title="Dismiss"
                                    >
                                        <X className="w-4 h-4 text-slate-400" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* MAIN CONTENT AREA */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                <div className="max-w-6xl mx-auto space-y-4">

                    {/* Project Settings Row */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Client</label>
                                <select
                                    value={selectedClientId}
                                    onChange={e => setSelectedClientId(e.target.value)}
                                    className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="">Select Client...</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Project Type</label>
                                <select
                                    value={projectType}
                                    onChange={e => setProjectType(e.target.value as ProjectType)}
                                    className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="HDB">HDB Residential</option>
                                    <option value="Condo">Condominium</option>
                                    <option value="Landed">Landed Property</option>
                                    <option value="Commercial">Commercial</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Area (sqft)</label>
                                <input
                                    type="number"
                                    value={areaSize}
                                    onChange={e => setAreaSize(Number(e.target.value))}
                                    className="w-full p-2 text-sm border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Jurisdiction</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setJurisdiction('SG')}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${jurisdiction === 'SG' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                        SG
                                    </button>
                                    <button
                                        onClick={() => setJurisdiction('MY')}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${jurisdiction === 'MY' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                        MY
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════════════ */}
                    {/* LINE ITEMS */}
                    {/* ═══════════════════════════════════════════════════════════════ */}
                    {lines.map((line, index) => (
                        <div
                            key={line.id}
                            className={`bg-white rounded-xl border transition-all ${line.type === 'HEADING'
                                ? 'border-slate-300 bg-slate-100'
                                : line.type === 'REMARK'
                                    ? 'border-amber-200 bg-amber-50'
                                    : 'border-slate-200 hover:border-blue-300 hover:shadow-sm'
                                }`}
                        >
                            {/* Line Header (Always Visible) */}
                            <div
                                className="flex items-center gap-3 p-4 cursor-pointer"
                                onClick={() => toggleExpand(line.id)}
                            >
                                <GripVertical className="w-4 h-4 text-slate-300" />

                                <span className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 text-xs font-bold rounded-lg">
                                    {index + 1}
                                </span>

                                {line.type === 'HEADING' ? (
                                    <input
                                        value={line.mainCategory}
                                        onChange={e => updateLine(line.id, { mainCategory: e.target.value })}
                                        onClick={e => e.stopPropagation()}
                                        className="flex-1 text-sm font-bold text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-400 focus:outline-none uppercase"
                                        placeholder="Section Title..."
                                    />
                                ) : line.type === 'REMARK' ? (
                                    <input
                                        value={line.taskDescription}
                                        onChange={e => updateLine(line.id, { taskDescription: e.target.value })}
                                        onClick={e => e.stopPropagation()}
                                        className="flex-1 text-sm text-amber-700 bg-transparent border-b border-transparent hover:border-amber-300 focus:border-amber-500 focus:outline-none italic"
                                        placeholder="Remark or note..."
                                    />
                                ) : (
                                    <>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-800 text-sm">{line.mainCategory || 'Untitled Item'}</p>
                                            <p className="text-xs text-slate-400 truncate">{line.taskDescription || 'No description'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900">${line.lineTotal.toLocaleString()}</p>
                                            <p className={`text-xs ${line.margin >= 0.25 ? 'text-green-600' : 'text-red-500'}`}>
                                                {(line.margin * 100).toFixed(0)}% margin
                                            </p>
                                        </div>
                                    </>
                                )}

                                <button
                                    onClick={(e) => { e.stopPropagation(); removeLine(line.id); }}
                                    className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                {line.type === 'ITEM' && (
                                    expandedLines.has(line.id)
                                        ? <ChevronUp className="w-5 h-5 text-slate-400" />
                                        : <ChevronDown className="w-5 h-5 text-slate-400" />
                                )}
                            </div>

                            {/* Expanded Content (Item Details) */}
                            {line.type === 'ITEM' && expandedLines.has(line.id) && (
                                <div className="border-t border-slate-100 p-4 space-y-4 animate-in slide-in-from-top-2">
                                    {/* 3-Tier Hierarchy: Category, Sub-Category (Location), Vendor */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Main Category</label>
                                            <select
                                                value={line.mainCategory}
                                                onChange={e => updateLine(line.id, { mainCategory: e.target.value })}
                                                className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            >
                                                <option value="">Select Category...</option>
                                                {MAIN_CATEGORIES.map((cat: string) => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sub-Category (Location)</label>
                                            <select
                                                value={line.subCategory}
                                                onChange={e => updateLine(line.id, { subCategory: e.target.value })}
                                                className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            >
                                                <option value="">Select Location...</option>
                                                {LOCATION_PRESETS.map((loc: string) => <option key={loc} value={loc}>{loc}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Vendor</label>
                                            <select
                                                value={line.vendorId || ''}
                                                onChange={e => {
                                                    const supplier = suppliers?.find((s: { id: string }) => s.id === e.target.value);
                                                    updateLine(line.id, { vendorId: e.target.value, vendorName: supplier?.name });
                                                }}
                                                className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            >
                                                <option value="">No Vendor</option>
                                                {suppliers?.map((s: { id: string; name: string }) => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Task Description</label>
                                        <textarea
                                            value={line.taskDescription}
                                            onChange={e => updateLine(line.id, { taskDescription: e.target.value })}
                                            rows={2}
                                            className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                            placeholder="Describe the scope of work..."
                                        />
                                    </div>

                                    {/* Cost Grid */}
                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                                        <div className="grid grid-cols-5 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Internal Cost</label>
                                                <div className="relative">
                                                    <span className="absolute left-2 top-2 text-xs text-slate-400">$</span>
                                                    <input
                                                        type="number"
                                                        value={line.internalCostRate || ''}
                                                        onChange={e => updateLine(line.id, { internalCostRate: Number(e.target.value) })}
                                                        className="w-full pl-6 p-2 text-sm border border-slate-200 rounded-lg font-mono text-right focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Selling Rate</label>
                                                <div className="relative">
                                                    <span className="absolute left-2 top-2 text-xs text-slate-400">$</span>
                                                    <input
                                                        type="number"
                                                        value={line.sellingRate || ''}
                                                        onChange={e => updateLine(line.id, { sellingRate: Number(e.target.value) })}
                                                        className="w-full pl-6 p-2 text-sm border border-slate-200 rounded-lg font-mono text-right focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Unit</label>
                                                <select
                                                    value={line.measurementUnit}
                                                    onChange={e => updateLine(line.id, { measurementUnit: e.target.value as MeasurementUnit })}
                                                    className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                >
                                                    <option value="Unit">Per Unit</option>
                                                    <option value="LinearMm">Linear (mm/cm/m)</option>
                                                    <option value="AreaSqMm">Area (sqm/sqft)</option>
                                                    <option value="LumpSum">Lump Sum</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                                                    Quantity {line.measurementUnit === 'LinearMm' ? '(m)' : line.measurementUnit === 'AreaSqMm' ? '(sqm)' : ''}
                                                </label>
                                                <input
                                                    type="number"
                                                    value={line.displayQuantity || ''}
                                                    onChange={e => updateLine(line.id, { displayQuantity: Number(e.target.value) })}
                                                    className="w-full p-2 text-sm border border-slate-200 rounded-lg font-mono text-right focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Line Total</label>
                                                <div className="bg-slate-100 p-2 text-sm font-bold text-right rounded-lg text-slate-800">
                                                    ${line.lineTotal.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Internal Notes */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Internal Notes (Hidden from Client)</label>
                                        <input
                                            value={line.internalRemarks || ''}
                                            onChange={e => updateLine(line.id, { internalRemarks: e.target.value })}
                                            className="w-full p-2 text-sm border border-dashed border-slate-300 rounded-lg bg-amber-50/50 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                            placeholder="Private notes, vendor contacts, etc."
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Add Line Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => addLine('ITEM')}
                            className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-bold text-sm">Add Line Item</span>
                        </button>
                        <button
                            onClick={() => addLine('HEADING')}
                            className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-slate-400 hover:bg-slate-50 transition-all"
                        >
                            <span className="font-bold text-sm">+ Section</span>
                        </button>
                        <button
                            onClick={() => addLine('REMARK')}
                            className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed border-amber-300 rounded-xl text-amber-600 hover:border-amber-400 hover:bg-amber-50 transition-all"
                        >
                            <span className="font-bold text-sm">+ Note</span>
                        </button>
                    </div>

                    {/* Empty State */}
                    {lines.length === 0 && (
                        <div className="text-center py-16 text-slate-400">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p className="font-bold">No items yet</p>
                            <p className="text-sm">Click "Add Line Item" to start building your quote.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quote Document Preview Modal */}
            {showPreview && (
                <QuoteDocument
                    quoteData={{
                        quoteNumber: `QT-${Date.now().toString(36).toUpperCase()}`,
                        date: new Date().toLocaleDateString('en-GB'),
                        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
                        clientName: clients.find(c => c.id === selectedClientId)?.name || 'Walk-In Client',
                        projectAddress: projectName || `${areaSize} sqft Project`,
                        accountManager: 'Designer',
                        currency: jurisdiction === 'SG' ? 'SGD' : 'MYR',
                        lineItems: lines.filter(l => l.type !== 'REMARK').map((line, idx) => ({
                            id: line.id,
                            no: idx + 1,
                            item: line.mainCategory,
                            description: line.taskDescription,
                            qty: line.displayQuantity,
                            unit: getMeasurementLabel(line.measurementUnit),
                            rate: line.sellingRate,
                            amount: line.lineTotal,
                            category: line.mainCategory,
                            type: line.type
                        }))
                    }}
                    termsAndConditions={TERMS_TEMPLATES[projectType].content}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </div>
    );
}
