'use client';

import React, { useState } from 'react';

interface RatingCriteria {
    key: string;
    label: string;
    description: string;
}

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RatingData) => void;
    targetName: string;
    targetRole: string;
    projectName?: string;
    criteria: RatingCriteria[];
}

export interface RatingData {
    scores: Record<string, number>;
    comment: string;
    wouldWorkAgain: boolean | null;
    flagIssue: string | null;
}

const STAR_COUNT = 5;

function StarRow({ label, description, value, onChange }: {
    label: string; description: string; value: number; onChange: (v: number) => void;
}) {
    const [hover, setHover] = useState(0);
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F3F2' }}>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#37352F' }}>{label}</div>
                <div style={{ fontSize: 10, color: '#9B9A97', marginTop: 2 }}>{description}</div>
            </div>
            <div style={{ display: 'flex', gap: 4, marginLeft: 16 }}>
                {Array.from({ length: STAR_COUNT }).map((_, i) => {
                    const filled = i < (hover || value);
                    return (
                        <button
                            key={i}
                            onClick={() => onChange(i + 1)}
                            onMouseEnter={() => setHover(i + 1)}
                            onMouseLeave={() => setHover(0)}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                                fontSize: 20, color: filled ? '#F59E0B' : '#E5E5E3',
                                transition: 'color 0.1s', transform: filled ? 'scale(1.1)' : 'scale(1)',
                            }}
                        >★</button>
                    );
                })}
            </div>
        </div>
    );
}

// ── Criteria presets for different rating scenarios ──
export const CRITERIA = {
    designerRatesContractor: [
        { key: 'punctuality', label: 'Punctuality', description: 'Shows up on time, meets deadlines' },
        { key: 'workmanship', label: 'Workmanship Quality', description: 'Quality of finished work' },
        { key: 'communication', label: 'Communication', description: 'Responsive, clear updates' },
        { key: 'cleanliness', label: 'Site Cleanliness', description: 'Cleans up after work' },
        { key: 'followSpecs', label: 'Follows Specifications', description: 'Builds according to drawings & specs' },
    ],
    designerRatesDrafter: [
        { key: 'speed', label: 'Turnaround Speed', description: 'Delivers drawings on time' },
        { key: 'accuracy', label: 'Accuracy', description: 'Minimal errors and revisions needed' },
        { key: 'detail', label: 'Attention to Detail', description: 'Catches small issues proactively' },
        { key: 'communication', label: 'Communication', description: 'Asks clarifying questions, gives updates' },
    ],
    contractorRatesDesigner: [
        { key: 'paymentSpeed', label: 'Payment Speed', description: 'Pays on time after invoicing' },
        { key: 'specClarity', label: 'Specification Clarity', description: 'Drawings and specs are clear and complete' },
        { key: 'fairness', label: 'Fairness', description: 'Reasonable expectations, no unfair blame' },
        { key: 'communication', label: 'Communication', description: 'Responsive and professional' },
    ],
    clientRatesDesigner: [
        { key: 'designQuality', label: 'Design Quality', description: 'Met your aesthetic vision' },
        { key: 'communication', label: 'Communication', description: 'Kept you informed throughout' },
        { key: 'timeline', label: 'Timeline Honesty', description: 'Accurate timeline estimates' },
        { key: 'value', label: 'Value for Money', description: 'Worth what you paid' },
        { key: 'trustworthy', label: 'Trustworthy', description: 'Honest, no hidden costs or surprises' },
    ],
    clientRatesContractor: [
        { key: 'workmanship', label: 'Workmanship', description: 'Quality of finished work' },
        { key: 'punctuality', label: 'Punctuality', description: 'Shows up when scheduled' },
        { key: 'cleanliness', label: 'Cleanliness', description: 'Keeps the site tidy' },
        { key: 'respectful', label: 'Respectful', description: 'Professional behavior in your home' },
    ],
    drafterRatesDesigner: [
        { key: 'briefClarity', label: 'Brief Clarity', description: 'Clear instructions and references' },
        { key: 'feedbackSpeed', label: 'Feedback Speed', description: 'Reviews and approves drawings quickly' },
        { key: 'respect', label: 'Professional Respect', description: 'Treats drafter as a valued team member' },
    ],
};

const FLAG_OPTIONS = [
    'No issues',
    'Ghosting / No-show',
    'Refused to pay',
    'Aggressive / Disrespectful',
    'Scope creep without compensation',
    'Safety violation',
    'Damaged property',
];

export default function RatingModal({ isOpen, onClose, onSubmit, targetName, targetRole, projectName, criteria }: RatingModalProps) {
    const [scores, setScores] = useState<Record<string, number>>({});
    const [comment, setComment] = useState('');
    const [wouldWorkAgain, setWouldWorkAgain] = useState<boolean | null>(null);
    const [flagIssue, setFlagIssue] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const avgScore = Object.values(scores).length > 0
        ? (Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length).toFixed(1)
        : '—';

    const allRated = criteria.every(c => scores[c.key] && scores[c.key] > 0);

    const handleSubmit = () => {
        onSubmit({ scores, comment, wouldWorkAgain, flagIssue: flagIssue === 'No issues' ? null : flagIssue });
        setSubmitted(true);
        setTimeout(() => { setSubmitted(false); onClose(); }, 1500);
    };

    if (submitted) {
        return (
            <div style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            }}>
                <div style={{
                    background: 'white', borderRadius: 16, padding: 48, textAlign: 'center', maxWidth: 400,
                    boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
                }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#37352F', margin: '0 0 8px' }}>Review Submitted</h2>
                    <p style={{ fontSize: 13, color: '#9B9A97', margin: 0 }}>
                        This review is <strong>completely private</strong>. Only you (admin) can see it.
                        {targetName} will never see this review or any score.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }} onClick={onClose}>
            <div onClick={e => e.stopPropagation()} style={{
                background: 'white', borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto',
                boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
            }}>
                {/* Header */}
                <div style={{ padding: '24px 28px 16px', borderBottom: '1px solid #F3F3F2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <span style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '2px 8px', borderRadius: 4, background: '#FEF3C7', color: '#D97706' }}>Confidential Review</span>
                                <span style={{ fontSize: 8, color: '#9B9A97' }}>🔒 Only AI & Admin can see this</span>
                            </div>
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#37352F', margin: 0 }}>Rate {targetName}</h2>
                            <p style={{ fontSize: 12, color: '#9B9A97', margin: '4px 0 0' }}>{targetRole}{projectName ? ` · ${projectName}` : ''}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 28, fontWeight: 800, color: '#37352F', fontFamily: "'JetBrains Mono', monospace" }}>{avgScore}</div>
                            <div style={{ fontSize: 9, color: '#9B9A97', textTransform: 'uppercase' }}>Avg Score</div>
                        </div>
                    </div>
                </div>

                {/* Criteria */}
                <div style={{ padding: '8px 28px' }}>
                    {criteria.map(c => (
                        <StarRow
                            key={c.key}
                            label={c.label}
                            description={c.description}
                            value={scores[c.key] || 0}
                            onChange={v => setScores(prev => ({ ...prev, [c.key]: v }))}
                        />
                    ))}
                </div>

                {/* Would work again */}
                <div style={{ padding: '16px 28px', borderTop: '1px solid #F3F3F2' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#37352F', marginBottom: 10 }}>Would you work with {targetName} again?</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {[
                            { val: true, label: '👍 Yes', bg: wouldWorkAgain === true ? '#ECFDF5' : '#FAFAF9', border: wouldWorkAgain === true ? '#10B981' : '#E9E9E7' },
                            { val: false, label: '👎 No', bg: wouldWorkAgain === false ? '#FEF2F2' : '#FAFAF9', border: wouldWorkAgain === false ? '#EF4444' : '#E9E9E7' },
                        ].map(opt => (
                            <button key={String(opt.val)} onClick={() => setWouldWorkAgain(opt.val)} style={{
                                flex: 1, padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                                background: opt.bg, border: `2px solid ${opt.border}`, cursor: 'pointer', fontFamily: 'inherit',
                                color: '#37352F', transition: 'all 0.15s',
                            }}>{opt.label}</button>
                        ))}
                    </div>
                </div>

                {/* Flag issue */}
                <div style={{ padding: '16px 28px', borderTop: '1px solid #F3F3F2' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#37352F', marginBottom: 10 }}>Flag an issue? <span style={{ fontWeight: 400, color: '#9B9A97' }}>(optional)</span></div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {FLAG_OPTIONS.map(opt => (
                            <button key={opt} onClick={() => setFlagIssue(flagIssue === opt ? null : opt)} style={{
                                padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                                background: flagIssue === opt ? (opt === 'No issues' ? '#ECFDF5' : '#FEF2F2') : '#FAFAF9',
                                border: `1px solid ${flagIssue === opt ? (opt === 'No issues' ? '#10B981' : '#EF4444') : '#E9E9E7'}`,
                                color: flagIssue === opt ? (opt === 'No issues' ? '#059669' : '#DC2626') : '#6B6A67',
                                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                            }}>{opt}</button>
                        ))}
                    </div>
                </div>

                {/* Comment */}
                <div style={{ padding: '16px 28px', borderTop: '1px solid #F3F3F2' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#37352F', marginBottom: 8 }}>Private notes <span style={{ fontWeight: 400, color: '#9B9A97' }}>(only you & admin see this)</span></div>
                    <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Any additional observations about this person's work..."
                        style={{
                            width: '100%', minHeight: 72, padding: 12, borderRadius: 8, border: '1px solid #E9E9E7',
                            fontSize: 12, fontFamily: 'inherit', resize: 'vertical', outline: 'none', color: '#37352F',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>

                {/* Submit */}
                <div style={{ padding: '16px 28px 24px', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{
                        padding: '10px 20px', borderRadius: 8, border: '1px solid #E9E9E7', background: 'white',
                        fontSize: 12, fontWeight: 500, color: '#6B6A67', cursor: 'pointer', fontFamily: 'inherit',
                    }}>Cancel</button>
                    <button onClick={handleSubmit} disabled={!allRated} style={{
                        padding: '10px 24px', borderRadius: 8, border: 'none',
                        background: allRated ? '#37352F' : '#E9E9E7',
                        fontSize: 12, fontWeight: 600, color: allRated ? 'white' : '#9B9A97',
                        cursor: allRated ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
                        transition: 'all 0.15s',
                    }}>🔒 Submit Confidential Review</button>
                </div>
            </div>
        </div>
    );
}
