'use client';

import React, { useState } from 'react';
import { Star, Shield, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react';

interface ReviewSection {
    id: string;
    label: string;
    type: 'rating' | 'trait';
    value: number | string[];
}

interface MutualReviewPortalProps {
    targetName: string;
    targetRole: 'worker' | 'vendor' | 'designer' | 'client';
    reviewerRole: 'worker' | 'vendor' | 'designer' | 'admin';
    onSave: (data: any) => void;
}

export function MutualReviewPortal({ targetName, targetRole, reviewerRole, onSave }: MutualReviewPortalProps) {
    const [ratings, setRatings] = useState<Record<string, number>>({
        technical: 0,
        communication: 0,
        punctuality: 0
    });
    const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
    const [comment, setComment] = useState('');

    const isReviewingClient = targetRole === 'client';
    const isReviewingDesigner = targetRole === 'designer';

    const handleRating = (key: string, val: number) => {
        setRatings(prev => ({ ...prev, [key]: val }));
    };

    const toggleTrait = (trait: string) => {
        setSelectedTraits(prev =>
            prev.includes(trait) ? prev.filter(t => t !== trait) : [...prev, trait]
        );
    };

    return (
        <div className="bg-white rounded-2xl border border-notion-border overflow-hidden shadow-sm">
            <div className="p-4 bg-notion-bg-secondary border-b border-notion-border flex justify-between items-center">
                <div>
                    <h3 className="text-sm font-bold text-notion-text">Performance Audit: {targetName}</h3>
                    <p className="text-[10px] text-notion-text-gray font-medium uppercase tracking-wider">Role: {targetRole}</p>
                </div>
                <Shield className="w-5 h-5 text-notion-blue opacity-50" />
            </div>

            <div className="p-5 space-y-6">
                {/* Dynamic Rating Sections */}
                <div className="space-y-4">
                    <h4 className="text-[10px] uppercase font-bold text-notion-text-gray tracking-wider">Metric Breakdown</h4>

                    <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">
                            {isReviewingClient ? 'Payment Promptness' : isReviewingDesigner ? 'Drawing Clarity' : 'Technical Adherence'}
                        </span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 cursor-pointer transition-colors ${ratings.technical >= star ? 'fill-notion-orange text-notion-orange' : 'text-notion-border'}`}
                                    onClick={() => handleRating('technical', star)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">
                            {isReviewingClient ? 'Requirement Clarity' : isReviewingDesigner ? 'Site Preparation' : 'Tooling Appropriateness'}
                        </span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 cursor-pointer transition-colors ${ratings.communication >= star ? 'fill-notion-orange text-notion-orange' : 'text-notion-border'}`}
                                    onClick={() => handleRating('communication', star)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Internal Risk Taxonomy (Karen markers/Technical deviations) */}
                <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-bold text-notion-text-gray tracking-wider">Internal Contextual Markers</h4>
                    <div className="flex flex-wrap gap-2">
                        {isReviewingClient ? (
                            <>
                                {['Serial Scope Creep', 'Payment Friction', 'Communication Aggression'].map(trait => (
                                    <button
                                        key={trait}
                                        onClick={() => toggleTrait(trait)}
                                        className={`px-2 py-1 rounded text-[9px] font-bold border transition-all ${selectedTraits.includes(trait) ? 'bg-notion-orange-bg text-notion-orange border-notion-orange' : 'bg-notion-hover border-notion-border text-notion-text-gray'}`}
                                    >
                                        {trait}
                                    </button>
                                ))}
                            </>
                        ) : (
                            <>
                                {['Technical Deviation', 'Safety Risk', 'Masterpiece Potential'].map(trait => (
                                    <button
                                        key={trait}
                                        onClick={() => toggleTrait(trait)}
                                        className={`px-2 py-1 rounded text-[9px] font-bold border transition-all ${selectedTraits.includes(trait) ? 'bg-notion-blue-bg text-notion-blue border-notion-blue' : 'bg-notion-hover border-notion-border text-notion-text-gray'}`}
                                    >
                                        {trait}
                                    </button>
                                ))}
                            </>
                        )}
                    </div>
                    {selectedTraits.length > 0 && selectedTraits.includes('Technical Deviation') && (
                        <div className="bg-notion-orange-bg p-3 rounded-lg border border-notion-orange/20 flex gap-3">
                            <AlertTriangle className="w-4 h-4 text-notion-orange shrink-0 mt-0.5" />
                            <p className="text-[10px] text-notion-text leading-relaxed">
                                <span className="font-bold">Evidence Required:</span> Negative technical ratings must be linked to a photo log or site memo to be valid karma impact.
                            </p>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h4 className="text-[10px] uppercase font-bold text-notion-text-gray tracking-wider">Internal Audit Remarks</h4>
                    <textarea
                        className="w-full bg-notion-bg-secondary border border-notion-border rounded-xl p-3 text-xs min-h-[80px] focus:outline-none focus:border-notion-blue"
                        placeholder="Detail the technical reasoning..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>

                <button
                    className="w-full py-3 bg-notion-text text-white rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
                    onClick={() => onSave({ ratings, selectedTraits, comment })}
                >
                    <CheckCircle2 className="w-4 h-4" />
                    Submit Private Performance Audit
                </button>
            </div>
        </div>
    );
}
