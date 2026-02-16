'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getSuggestions, getGhostText, Suggestion } from '@/lib/ai/description-suggestions';
import { TradeCategory } from '@/types/trades';

// ============================================================
// TYPES
// ============================================================

interface AutoCompleteInputProps {
    value: string;
    onChange: (value: string) => void;
    onSelectSuggestion?: (suggestion: Suggestion) => void;
    placeholder?: string;
    category?: TradeCategory;           // Current trade section
    className?: string;
}

// ============================================================
// COMPONENT
// ============================================================

export default function AutoCompleteInput({
    value,
    onChange,
    onSelectSuggestion,
    placeholder = 'Enter description...',
    category,
    className = '',
}: AutoCompleteInputProps) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [ghostText, setGhostText] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // ─── UPDATE SUGGESTIONS ON INPUT ────────────────────────
    const updateSuggestions = useCallback((text: string) => {
        if (text.trim().length < 2) {
            setSuggestions([]);
            setGhostText('');
            setShowDropdown(false);
            return;
        }

        const results = getSuggestions(text, category, 6);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
        setSelectedIndex(-1);

        // Ghost text — only for prefix matches
        const ghost = getGhostText(text, category);
        setGhostText(ghost);
    }, [category]);

    useEffect(() => {
        if (isFocused) {
            updateSuggestions(value);
        }
    }, [value, isFocused, updateSuggestions]);

    // ─── ACCEPT SUGGESTION ──────────────────────────────────
    const acceptSuggestion = useCallback((suggestion: Suggestion) => {
        onChange(suggestion.text);
        setShowDropdown(false);
        setGhostText('');
        setSuggestions([]);
        if (onSelectSuggestion) onSelectSuggestion(suggestion);
    }, [onChange, onSelectSuggestion]);

    // ─── ACCEPT GHOST TEXT ──────────────────────────────────
    const acceptGhost = useCallback(() => {
        if (ghostText) {
            const fullText = value + ghostText;
            onChange(fullText);
            setGhostText('');
            setShowDropdown(false);
        }
    }, [value, ghostText, onChange]);

    // ─── KEYBOARD HANDLING ──────────────────────────────────
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab' && ghostText) {
            e.preventDefault();
            acceptGhost();
            return;
        }

        if (!showDropdown || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
                break;

            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
                break;

            case 'Enter':
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    e.preventDefault();
                    acceptSuggestion(suggestions[selectedIndex]);
                }
                break;

            case 'Escape':
                setShowDropdown(false);
                setGhostText('');
                break;
        }
    };

    // ─── CLICK OUTSIDE TO CLOSE ─────────────────────────────
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ─── SCROLL SELECTED INTO VIEW ──────────────────────────
    useEffect(() => {
        if (selectedIndex >= 0 && dropdownRef.current) {
            const items = dropdownRef.current.children;
            if (items[selectedIndex]) {
                (items[selectedIndex] as HTMLElement).scrollIntoView({
                    block: 'nearest',
                });
            }
        }
    }, [selectedIndex]);

    // ─── HIGHLIGHT MATCHING TEXT ─────────────────────────────
    const highlightMatch = (text: string, query: string) => {
        if (!query) return text;
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase().trim();
        const idx = lowerText.indexOf(lowerQuery);

        if (idx === -1) return text;

        return (
            <>
                {text.slice(0, idx)}
                <span className="font-semibold text-blue-700 bg-blue-50">
                    {text.slice(idx, idx + lowerQuery.length)}
                </span>
                {text.slice(idx + lowerQuery.length)}
            </>
        );
    };

    // ─── RENDER ─────────────────────────────────────────────
    return (
        <div ref={containerRef} className="relative w-full">
            {/* Input layer with ghost text */}
            <div className="relative">
                {/* Ghost text overlay */}
                {isFocused && ghostText && (
                    <div
                        className="absolute inset-0 pointer-events-none flex items-center px-2 py-1 -mx-2"
                        aria-hidden="true"
                    >
                        <span className="invisible whitespace-pre">{value}</span>
                        <span className="text-gray-300 whitespace-pre">{ghostText}</span>
                    </div>
                )}

                {/* Actual input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        // Delay to allow click on suggestion
                        setTimeout(() => setIsFocused(false), 200);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={`w-full border-0 bg-transparent focus:ring-2 focus:ring-blue-400 rounded px-2 py-1 -mx-2 ${className}`}
                    autoComplete="off"
                    spellCheck={false}
                />
            </div>

            {/* Tab hint */}
            {isFocused && ghostText && (
                <div className="absolute right-0 top-0 flex items-center h-full pr-1 pointer-events-none">
                    <span className="text-[9px] font-bold text-gray-300 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5">
                        TAB
                    </span>
                </div>
            )}

            {/* Suggestions dropdown */}
            {showDropdown && isFocused && suggestions.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden max-h-64 overflow-y-auto"
                    style={{ minWidth: '320px' }}
                >
                    {/* Header */}
                    <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                            ✨ AI Suggestions
                        </span>
                        <span className="text-[10px] text-gray-300">
                            ↑↓ navigate • Enter select • Esc close
                        </span>
                    </div>

                    {/* Suggestion items */}
                    {suggestions.map((suggestion, idx) => (
                        <button
                            key={`${suggestion.text}-${idx}`}
                            type="button"
                            className={`w-full text-left px-3 py-2.5 text-sm transition-colors border-b border-gray-50 last:border-0 ${idx === selectedIndex
                                    ? 'bg-blue-50 text-blue-900'
                                    : 'hover:bg-gray-50 text-gray-700'
                                }`}
                            onMouseDown={(e) => {
                                e.preventDefault(); // Prevent blur
                                acceptSuggestion(suggestion);
                            }}
                            onMouseEnter={() => setSelectedIndex(idx)}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <span className="flex-1 leading-snug">
                                    {highlightMatch(suggestion.text, value)}
                                </span>
                                {suggestion.rate && (
                                    <span className="shrink-0 text-[10px] font-mono text-gray-400 mt-0.5">
                                        ~${suggestion.rate}/{suggestion.unit}
                                    </span>
                                )}
                            </div>
                            {suggestion.category !== category && (
                                <span className="inline-block mt-1 text-[10px] text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">
                                    {suggestion.category}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
