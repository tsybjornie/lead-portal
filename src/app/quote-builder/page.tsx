'use client';

import { useState, useCallback } from 'react';
import QuoteBuilderEnhanced from '@/components/QuoteBuilderEnhanced';
import PromptQuote from '@/components/PromptQuote';
import { GeneratedTradeSection } from '@/lib/ai/auto-quote';

export default function QuoteBuilderPage() {
    const [loadFn, setLoadFn] = useState<((sections: GeneratedTradeSection[]) => void) | null>(null);

    const handleReady = useCallback((fn: (sections: GeneratedTradeSection[]) => void) => {
        setLoadFn(() => fn);
    }, []);

    const handleGenerateQuote = useCallback((sections: GeneratedTradeSection[]) => {
        if (loadFn) loadFn(sections);
    }, [loadFn]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <PromptQuote onGenerateQuote={handleGenerateQuote} />
            <QuoteBuilderEnhanced onReady={handleReady} />
        </div>
    );
}
