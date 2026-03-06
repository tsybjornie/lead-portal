'use client';

import React, { useState, useRef, useEffect } from 'react';
import { parsePrompt, ParsedPrompt } from '@/lib/ai/prompt-parser';
import { generateAutoQuote, AutoQuoteResult, GeneratedTradeSection } from '@/lib/ai/auto-quote';
import { TRADE_PROFILES } from '@/types/trades';

// ============================================================
// TYPES
// ============================================================

interface PromptQuoteProps {
    onGenerateQuote: (sections: GeneratedTradeSection[]) => void;
}

// ============================================================
// EXAMPLE PROMPTS
// ============================================================

const EXAMPLE_PROMPTS = [
    '3-room HDB, hack both bathrooms, kitchen cabinets with quartz, wardrobes for all bedrooms, vinyl flooring, repaint',
    '4-room BTO full renovation with aircon',
    'Condo master bathroom retile + new vanity + shower screen',
    '5-room HDB kitchen cabinets, feature wall, TV console, 3 wardrobes',
    'Hack 2 bathrooms, new tiles, waterproofing, WC and vanity, painting',
];

// ============================================================
// TRADE EMOJI MAP
// ============================================================

const TRADE_EMOJI: Record<string, string> = {
    preliminaries: '️',
    demolition: '',
    masonry: '',
    waterproofing: '',
    carpentry: '',
    metalworks: '️',
    glassworks: '',
    ceiling: '️',
    flooring: '',
    painting: '',
    electrical: '',
    plumbing: '',
    aircon: '️',
    cleaning: '',
};

// ============================================================
// COMPONENT
// ============================================================

export default function PromptQuote({ onGenerateQuote }: PromptQuoteProps) {
    const [prompt, setPrompt] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AutoQuoteResult | null>(null);
    const [parsed, setParsed] = useState<ParsedPrompt | null>(null);
    const [showExamples, setShowExamples] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [prompt]);

    // Scroll to result when analysis completes
    useEffect(() => {
        if (result && resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [result]);

    const handleAnalyze = () => {
        if (!prompt.trim()) return;

        setIsAnalyzing(true);
        setIsGenerated(false);

        // Simulated brief delay for perceived "thinking"
        setTimeout(() => {
            const parsedResult = parsePrompt(prompt);
            setParsed(parsedResult);

            const quoteResult = generateAutoQuote(parsedResult);
            setResult(quoteResult);
            setIsAnalyzing(false);
        }, 600);
    };

    const handleGenerate = () => {
        if (!result) return;
        onGenerateQuote(result.sections);
        setIsGenerated(true);
    };

    const handleExampleClick = (example: string) => {
        setPrompt(example);
        setShowExamples(false);
        setResult(null);
        setParsed(null);
        setIsGenerated(false);
    };

    const handleClear = () => {
        setPrompt('');
        setResult(null);
        setParsed(null);
        setIsGenerated(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAnalyze();
        }
    };

    const formatCurrency = (amount: number) => {
        return `S$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    return (
        <div className="mb-6">
            {/* PROMPT INPUT CARD */}
            <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0d0d2b 100%)',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(99, 102, 241, 0.15)',
                }}
            >
                {/* Animated gradient border */}
                <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'exclude',
                        WebkitMaskComposite: 'xor',
                        padding: '1px',
                    }}
                />

                <div className="relative p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                                style={{
                                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                    boxShadow: '0 2px 12px rgba(99, 102, 241, 0.4)',
                                }}
                            >
                                
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-lg">Auto Quote</h2>
                                <p className="text-gray-400 text-xs">Describe the project  get an instant quote</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowExamples(!showExamples)}
                            className="text-xs px-3 py-1.5 rounded-full transition-all"
                            style={{
                                background: showExamples ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                                color: showExamples ? '#a5b4fc' : '#9ca3af',
                                border: '1px solid',
                                borderColor: showExamples ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            {showExamples ? 'Hide examples' : ' Examples'}
                        </button>
                    </div>

                    {/* Example Prompts */}
                    {showExamples && (
                        <div className="mb-4 space-y-2">
                            {EXAMPLE_PROMPTS.map((example, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleExampleClick(example)}
                                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        color: '#d1d5db',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                                        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                                        e.currentTarget.style.color = '#e0e7ff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                        e.currentTarget.style.color = '#d1d5db';
                                    }}
                                >
                                    <span className="text-gray-500 mr-2"></span>
                                    {example}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Textarea + Button */}
                    <div className="flex gap-3 items-end">
                        <div className="flex-1 relative">
                            <textarea
                                ref={textareaRef}
                                value={prompt}
                                onChange={(e) => {
                                    setPrompt(e.target.value);
                                    if (result) { setResult(null); setParsed(null); setIsGenerated(false); }
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g. 3-room HDB, hack both bathrooms, kitchen cabinets, wardrobes, vinyl, repaint..."
                                rows={1}
                                className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-gray-600"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.07)',
                                    color: '#f3f4f6',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    minHeight: '48px',
                                    maxHeight: '120px',
                                }}
                            />
                            {prompt && (
                                <button
                                    onClick={handleClear}
                                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    
                                </button>
                            )}
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={!prompt.trim() || isAnalyzing}
                            className="px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{
                                background: isAnalyzing
                                    ? 'rgba(99, 102, 241, 0.4)'
                                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                boxShadow: !isAnalyzing && prompt.trim()
                                    ? '0 2px 16px rgba(99, 102, 241, 0.4)'
                                    : 'none',
                            }}
                        >
                            {isAnalyzing ? (
                                <>
                                    <span className="inline-block animate-spin">️</span>
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                     Analyze
                                </>
                            )}
                        </button>
                    </div>

                    <p className="text-gray-600 text-xs mt-2 ml-1">
                        Press Enter to analyze  Shift+Enter for new line
                    </p>
                </div>
            </div>

            {/* RESULT PREVIEW */}
            {result && (
                <div ref={resultRef} className="mt-4 rounded-2xl overflow-hidden" style={{
                    background: '#fff',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.06)',
                }}>
                    {/* Summary Header */}
                    <div className="p-5 border-b border-gray-100" style={{
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0f9ff 100%)',
                    }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-green-600 text-lg"></span>
                                    <h3 className="font-bold text-gray-900">Quote Preview</h3>
                                </div>
                                <p className="text-gray-500 text-sm">
                                    {result.tradeCount} trades  {result.itemCount} line items {' '}
                                    <span className="font-semibold text-gray-700">{formatCurrency(result.totalSelling)}</span>
                                    {' '}estimated
                                </p>
                            </div>

                            <div className="text-right">
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Est. Margin</div>
                                <div className={`text-2xl font-bold ${result.overallMargin >= 0.35 ? 'text-green-600' : result.overallMargin >= 0.25 ? 'text-amber-500' : 'text-red-500'}`}>
                                    {(result.overallMargin * 100).toFixed(0)}%
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trade Breakdown */}
                    <div className="p-5">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                            {result.sections.map(section => (
                                <div
                                    key={section.id}
                                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                                    style={{
                                        background: '#f9fafb',
                                        border: '1px solid #f3f4f6',
                                    }}
                                >
                                    <span className="text-lg">{TRADE_EMOJI[section.category] || ''}</span>
                                    <div className="min-w-0">
                                        <div className="text-xs font-medium text-gray-900 truncate">{section.displayName}</div>
                                        <div className="text-xs text-gray-500">
                                            {section.items.length} items  {formatCurrency(section.subtotalSelling)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Warnings */}
                        {result.warnings.length > 0 && (
                            <div className="mb-4 space-y-1.5">
                                {result.warnings.map((warning, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                                        <span className="shrink-0 mt-0.5">️</span>
                                        <span>{warning}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Suggestions */}
                        {result.suggestions.length > 0 && (
                            <div className="mb-4 space-y-1.5">
                                {result.suggestions.map((suggestion, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-sm text-blue-700 bg-blue-50 rounded-lg px-3 py-2">
                                        <span className="shrink-0 mt-0.5"></span>
                                        <span>{suggestion}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Detected Context */}
                        {parsed && (
                            <div className="flex flex-wrap gap-2 mb-5">
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{
                                    background: '#eff6ff', color: '#3b82f6', border: '1px solid #dbeafe'
                                }}>
                                    {parsed.propertyType === 'hdb' ? ' HDB' : parsed.propertyType === 'condo' ? '️ Condo' : parsed.propertyType === 'landed' ? ' Landed' : ' Commercial'}
                                </span>
                                {parsed.roomSize !== 'unknown' && (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{
                                        background: '#eff6ff', color: '#3b82f6', border: '1px solid #dbeafe'
                                    }}>
                                         {parsed.roomSize}
                                    </span>
                                )}
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{
                                    background: '#f0fdf4', color: '#16a34a', border: '1px solid #dcfce7'
                                }}>
                                     {parsed.jurisdiction}
                                </span>
                                {parsed.rooms.bathrooms > 0 && (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{
                                        background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a'
                                    }}>
                                         {parsed.rooms.bathrooms} bathroom{parsed.rooms.bathrooms > 1 ? 's' : ''}
                                    </span>
                                )}
                                {parsed.rooms.bedrooms > 0 && (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{
                                        background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a'
                                    }}>
                                        ️ {parsed.rooms.bedrooms} bedroom{parsed.rooms.bedrooms > 1 ? 's' : ''}
                                    </span>
                                )}
                                {parsed.scope.wardrobes > 0 && (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{
                                        background: '#faf5ff', color: '#9333ea', border: '1px solid #e9d5ff'
                                    }}>
                                        ️ {parsed.scope.wardrobes} wardrobe{parsed.scope.wardrobes > 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerated}
                                className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                style={{
                                    background: isGenerated
                                        ? '#22c55e'
                                        : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    boxShadow: isGenerated
                                        ? '0 2px 12px rgba(34, 197, 94, 0.3)'
                                        : '0 2px 16px rgba(99, 102, 241, 0.35)',
                                }}
                            >
                                {isGenerated ? (
                                    <> Loaded into Quote Builder</>
                                ) : (
                                    <> Generate Quote  {result.itemCount} items</>
                                )}
                            </button>

                            {!isGenerated && (
                                <button
                                    onClick={handleClear}
                                    className="px-5 py-3 rounded-xl text-sm font-medium transition-all"
                                    style={{
                                        background: '#f9fafb',
                                        color: '#6b7280',
                                        border: '1px solid #e5e7eb',
                                    }}
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
