'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMarket } from '../../../context/MarketContext';

export default function HomeownerEnquiryPage() {
    const { market } = useMarket();
    const [currentStep, setCurrentStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [assessmentStep, setAssessmentStep] = useState(0); // 0 to 9 for the 10 questions
    const [karenScore, setKarenScore] = useState(0);
    const [assessmentResponses, setAssessmentResponses] = useState([]); // Store selected answers
    const [uploadedFiles, setUploadedFiles] = useState({
        floorplan: null,
        tenancyGuide: null,
        applianceList: null,
        moodboard: null
    });

    const [formData, setFormData] = useState({
        // Contact info
        name: '',
        email: '',
        phone: '',

        // Project details
        property_type: '',
        renovation_type: '',
        budget_range: '',
        scope: [],
        scope_other: '', // Free-text for unlisted scope items
        timeline: '',
        decision_speed: '',
        communication_pref: '',
        involvement_level: '',
        additional_notes: ''
    });

    const totalSteps = 7;
    const progress = (currentStep / totalSteps) * 100;

    const questions = [
        {
            id: 1,
            question: "When planning your investment, what is your approach to the budget?",
            options: [
                { text: "My budget is strict to maximize ROI. I track every cent.", score: 2 },
                { text: "I have a target, but I prioritize value and quality over cost.", score: 0 },
                { text: "I am willing to invest whatever is necessary for the perfect result.", score: 0 },
                { text: "I expect competitive pricing and value-added discounts.", score: 3 }
            ]
        },
        {
            id: 2,
            question: "Communication Flow: How do you prefer to stay informed?",
            options: [
                { text: "Standard weekly progress reports are sufficient.", score: 0 },
                { text: "A few updates a week to keep things on track.", score: 1 },
                { text: "I value high-touch, daily updates to ensure nothing is missed.", score: 3 },
                { text: "I prefer to be physically present daily to collaborate on decisions.", score: 5 }
            ]
        },
        {
            id: 3,
            question: "During a defect inspection, you notice a minor imperfection. Your philosophy is:",
            options: [
                { text: "Note it down for the final consolidated touch-up phase.", score: 0 },
                { text: "Zero tolerance. It should be rectified immediately before moving on.", score: 4 },
                { text: "Character is part of the charm (wabi-sabi).", score: 0 },
                { text: "Details define quality. I expect precision.", score: 2 }
            ]
        },
        {
            id: 4,
            question: "Reflecting on previous renovation experiences:",
            options: [
                { text: "This is my first journey into renovation.", score: 0 },
                { text: "It was a collaborative partnership.", score: 0 },
                { text: "I've had to step in heavily to ensure standards were met.", score: 5 },
                { text: "There were challenges, but we navigated them professionally.", score: 0 }
            ]
        },
        {
            id: 5,
            question: "Design Evolution: If you feel a change is needed mid-project (e.g., wall color), you believe:",
            options: [
                { text: "It's a variation order that incurs standard cost and time.", score: 0 },
                { text: "Service should be flexible; minor tweaks shouldn't be nickeled and dimed.", score: 4 },
                { text: "A good designer should have anticipated my preference earlier.", score: 3 },
                { text: "I'm happy to supply materials if they handle the labor.", score: 2 }
            ]
        },
        {
            id: 6,
            question: "Timeline Priorities:",
            options: [
                { text: "I prefer quality over speed.", score: 0 },
                { text: "Efficiency is key. I need an accelerated timeline.", score: 3 },
                { text: "I have a comfortable timeline.", score: 0 },
                { text: "Adherence to the schedule is critical and non-negotiable.", score: 2 }
            ]
        },
        {
            id: 7,
            question: "Decision Making Style:",
            options: [
                { text: "I rely on the professional's expertise to guide me.", score: 0 },
                { text: "I provide the vision and specs; they provide the execution.", score: 3 },
                { text: "I am hands-on and want to sign off on every detail.", score: 4 },
                { text: "I have a strong vision but welcome creative input.", score: 0 }
            ]
        },
        {
            id: 8,
            question: "It's after hours and you have an important thought about the project. You:",
            options: [
                { text: "Make a note to discuss it during the next scheduled update.", score: 0 },
                { text: "Send a message immediately to keep the momentum going.", score: 4 },
                { text: "Email it so it's the first thing they see in the morning.", score: 0 },
                { text: "Reach out via multiple channels to ensure it's seen.", score: 5 }
            ]
        },
        {
            id: 9,
            question: "Material Selection: The expert advises against your chosen material due to maintenance. You:",
            options: [
                { text: "Value their technical expertise and explore alternatives.", score: 0 },
                { text: "Wonder if there's a commercial motivation behind the advice.", score: 4 },
                { text: "Will do my own independent research to verify.", score: 1 },
                { text: "Trust their experience implicitly.", score: 0 }
            ]
        },
        {
            id: 10,
            question: "Financial Management Preference:",
            options: [
                { text: "I adhere to the standard progressive payment structure.", score: 0 },
                { text: "I prefer to retain the majority of funds until total completion.", score: 5 },
                { text: "I pay promptly to maintain goodwill and project pace.", score: 0 },
                { text: "I believe payment release should strictly correlate with my satisfaction.", score: 4 }
            ]
        }
    ];

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleScope = (item) => {
        setFormData(prev => ({
            ...prev,
            scope: prev.scope.includes(item)
                ? prev.scope.filter(i => i !== item)
                : [...prev.scope, item]
        }));
    };

    const handleAssessmentAnswer = (score, answerText) => {
        setKarenScore(prev => prev + score);
        setAssessmentResponses(prev => [...prev, answerText]);
        if (assessmentStep < questions.length - 1) {
            setAssessmentStep(prev => prev + 1);
        } else {
            // Assessment done, go to final contact step
            setFormData(prev => ({ ...prev, assessment_score: karenScore + score }));
            setCurrentStep(currentStep + 1);
        }
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            if (currentStep === 5 && assessmentStep > 0) {
                // Check if we are inside the assessment
                setAssessmentStep(prev => prev - 1);
            } else {
                setCurrentStep(currentStep - 1);
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const isHighMaintenance = karenScore >= 12;
            const finalData = {
                ...formData,
                karenScore,
                tier: isHighMaintenance ? 'Concierge' : 'Standard'
            };

            const response = await fetch('/api/homeowner-enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData)
            });

            if (response.ok) {
                setSubmitted(true);
            } else {
                alert('Failed to submit. Please try again or contact us directly.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit. Please try again or contact us directly.');
        }
    };

    if (submitted) {
        const isHighMaintenance = karenScore >= 12;
        return (
            <div className="success-container">
                <div className="success-header">
                    <div className="success-icon">✅</div>
                    <h1>Match Complete!</h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginBottom: 0 }}>
                        Thank you, <strong>{formData.name}</strong>. We have analyzed your profile.
                    </p>
                </div>

                <div style={{
                    background: isHighMaintenance ? '#fcfbf8' : 'white',
                    padding: '2.5rem',
                    borderRadius: '0',
                    boxShadow: 'var(--shadow)',
                    marginBottom: '2rem',
                    textAlign: 'center',
                    border: '1px solid var(--border)'
                }}>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--primary-dark)', marginBottom: '1rem' }}>
                        {isHighMaintenance ? '"Concierge Tier" Match' : '"Standard Tier" Match'}
                    </h2>
                    <p style={{ color: 'var(--text-light)', lineHeight: 1.8 }}>
                        {isHighMaintenance
                            ? "Based on your preferences for high-touch management and precision, we have routed your enquiry to our Executive Partners."
                            : "Based on your balanced preferences, we have matched you with our Core Design Partners."}
                    </p>
                    <p style={{ marginTop: '1rem', fontWeight: 500 }}>
                        You will hear from {market === 'SG' ? '5' : '3'} selected Interior Design Partners within 24 hours.
                    </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <Link href={`/${market}`} className="btn btn-secondary">Return Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-wrapper">
            <div className="quiz-container">
                <div className="quiz-progress">
                    <div className="quiz-progress-bar" style={{ width: `${progress}%` }} />
                </div>

                {/* Step 1: Property Type */}
                {currentStep === 1 && (
                    <div className="quiz-step">
                        <h2>What type of property are you renovating?</h2>
                        <p className="quiz-subtitle">This helps us understand your project scope</p>

                        <div className="option-grid">
                            {[
                                {
                                    value: market !== 'SG' ? 'Apartment' : 'HDB',
                                    icon: '🏢',
                                    title: market !== 'SG' ? 'Apartment' : 'HDB Flat',
                                    desc: market !== 'SG' ? 'Flat, Apartment, Studio' : '3-room, 4-room, 5-room, Executive'
                                },
                                { value: 'Condo', icon: '🏙️', title: 'Condominium', desc: 'Private condo or apartment' },
                                { value: 'Landed', icon: '🏡', title: 'Landed Property', desc: 'Terrace, semi-D, bungalow' },
                                { value: 'Commercial', icon: '🏪', title: 'Commercial', desc: 'Office, retail, F&B' }
                            ].map(option => (
                                <div
                                    key={option.value}
                                    className={`option-card ${formData.property_type === option.value ? 'selected' : ''}`}
                                    onClick={() => updateField('property_type', option.value)}
                                >
                                    <div className="option-icon">{option.icon}</div>
                                    <div className="option-title">{option.title}</div>
                                    <div className="option-desc">{option.desc}</div>
                                </div>
                            ))}
                        </div>

                        <div className="quiz-nav">
                            <div></div>
                            <button
                                className="btn btn-primary"
                                onClick={nextStep}
                                disabled={!formData.property_type}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Budget & Renovation Type */}
                {currentStep === 2 && (
                    <div className="quiz-step">
                        <h2>Budget Range & Renovation Type</h2>
                        <p className="quiz-subtitle">Required information for matching</p>

                        <div className="form-group">
                            <label>Renovation Type</label>
                            <select
                                value={formData.renovation_type}
                                onChange={(e) => updateField('renovation_type', e.target.value)}
                            >
                                <option value="">Select renovation type...</option>
                                <option value="partial">Partial Renovation (Selected rooms)</option>
                                <option value="full">Full Home Renovation</option>
                                <option value="A&A">A&A Works (Additions & Alterations)</option>
                                <option value="fit-out">Commercial Fit-Out</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Budget Range</label>
                            <select
                                value={formData.budget_range}
                                onChange={(e) => updateField('budget_range', e.target.value)}
                            >
                                <option value="">Select budget range...</option>
                                {market === 'SG' ? (
                                    <>
                                        <option value="$30k-$60k">$30,000 - $60,000</option>
                                        <option value="$60k-$100k">$60,000 - $100,000</option>
                                        <option value="$100k-$150k">$100,000 - $150,000</option>
                                        <option value="$150k-$200k">$150,000 - $200,000</option>
                                        <option value="$200k+">$200,000+</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="RM30k-RM60k">RM30,000 - RM60,000</option>
                                        <option value="RM60k-RM100k">RM60,000 - RM100,000</option>
                                        <option value="RM100k-RM150k">RM100,000 - RM150,000</option>
                                        <option value="RM150k-RM200k">RM150,000 - RM200,000</option>
                                        <option value="RM200k+">RM200,000+</option>
                                    </>
                                )}
                            </select>
                        </div>

                        <div className="quiz-nav">
                            <button className="btn btn-secondary" onClick={prevStep}>Back</button>
                            <button
                                className="btn btn-primary"
                                onClick={nextStep}
                                disabled={!formData.renovation_type || !formData.budget_range}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Scope of Works */}
                {currentStep === 3 && (
                    <div className="quiz-step">
                        <h2>What work needs to be done?</h2>
                        <p className="quiz-subtitle">Select all that apply</p>

                        <div className="checkbox-grid">
                            {[
                                'Hacking/Demolition',
                                'Wet Works (Kitchen/Bathroom)',
                                'Carpentry & Built-ins',
                                'Electrical Works',
                                'Plumbing',
                                'Painting',
                                'Flooring',
                                'Ceiling & Partition',
                                'Air-Con (Installation/Replacement)',
                                'Roofing Works',
                                'Glass & Awning',
                                'Facade / External Works',
                                'Structural Works',
                                'Smart Home / Automation'
                            ].map(item => (
                                <div
                                    key={item}
                                    className={`checkbox-item ${formData.scope.includes(item) ? 'checked' : ''}`}
                                    onClick={() => toggleScope(item)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.scope.includes(item)}
                                        readOnly
                                    />
                                    <span className="checkbox-label">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="form-group" style={{ marginTop: '1.5rem' }}>
                            <label htmlFor="scope_other">Other Works (Please specify)</label>
                            <input
                                type="text"
                                id="scope_other"
                                value={formData.scope_other}
                                onChange={(e) => updateField('scope_other', e.target.value)}
                                placeholder="e.g., Lift installation, Pool works, Landscape, Security systems..."
                            />
                        </div>

                        <div className="quiz-nav">
                            <button className="btn btn-secondary" onClick={prevStep}>Back</button>
                            <button className="btn btn-primary" onClick={nextStep}>
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Timeline */}
                {currentStep === 4 && (
                    <div className="quiz-step">
                        <h2>When do you need to start?</h2>
                        <p className="quiz-subtitle">This helps professionals prioritize</p>

                        <div className="radio-group">
                            {[
                                { value: 'ASAP', label: 'ASAP (within 1 month)' },
                                { value: '1-3 months', label: '1-3 months' },
                                { value: '3-6 months', label: '3-6 months' },
                                { value: 'planning', label: 'Just planning / exploring' }
                            ].map(option => (
                                <div
                                    key={option.value}
                                    className={`radio-option ${formData.timeline === option.value ? 'selected' : ''}`}
                                    onClick={() => updateField('timeline', option.value)}
                                >
                                    <input
                                        type="radio"
                                        checked={formData.timeline === option.value}
                                        readOnly
                                    />
                                    <span>{option.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="quiz-nav">
                            <button className="btn btn-secondary" onClick={prevStep}>Back</button>
                            <button
                                className="btn btn-primary"
                                onClick={nextStep}
                                disabled={!formData.timeline}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 5: The Assessment (Replaces Old Working Style) */}
                {currentStep === 5 && (
                    <div className="quiz-step">
                        <h2>The Compatibility Index</h2>
                        <p className="quiz-subtitle">Step {assessmentStep + 1} of 10: {questions[assessmentStep].question}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {questions[assessmentStep].options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAssessmentAnswer(option.score, option.text)}
                                    style={{
                                        padding: '1.2rem',
                                        background: 'white',
                                        border: '1px solid var(--border)',
                                        textAlign: 'left',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        color: 'var(--text)',
                                        borderRadius: '4px'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--bg-cream)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'white'; }}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>

                        <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#888', textAlign: 'center' }}>
                            Answering honestly helps us find your best match.
                        </div>

                        <div className="quiz-nav" style={{ marginTop: '1rem' }}>
                            {assessmentStep === 0 && <button className="btn btn-secondary" onClick={prevStep}>Back</button>}
                        </div>
                    </div>
                )}

                {/* Step 6: Contact Details */}
                {currentStep === 6 && (
                    <div className="quiz-step">
                        <h2>Your Contact Information</h2>
                        <p className="quiz-subtitle">We&apos;ll use this to connect you with professionals</p>

                        <div className="form-group">
                            <label htmlFor="name">Full Name *</label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address *</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number *</label>
                            <input
                                type="tel"
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => updateField('phone', e.target.value)}
                                placeholder={market === 'SG' ? "+65 XXXX XXXX" : "+60 1X XXX XXXX"}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="notes">Additional Notes (Optional)</label>
                            <textarea
                                id="notes"
                                value={formData.additional_notes}
                                onChange={(e) => updateField('additional_notes', e.target.value)}
                                rows="4"
                                placeholder="Any specific requirements, preferences, or questions..."
                            />
                        </div>

                        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                            <h3 style={{ fontSize: '1rem', color: 'var(--primary-dark)', marginBottom: '1rem', fontFamily: 'Playfair Display, serif' }}>Optional Documents</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1rem' }}>Upload any supporting documents to help us understand your project better.</p>

                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label htmlFor="floorplan" style={{ fontSize: '0.9rem' }}>Floorplan (PDF or Image)</label>
                                <input
                                    type="file"
                                    id="floorplan"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => setUploadedFiles(prev => ({ ...prev, floorplan: e.target.files[0] }))}
                                    style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                                />
                            </div>

                            {formData.renovation_type === 'fit-out' && (
                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <label htmlFor="tenancyGuide" style={{ fontSize: '0.9rem' }}>Tenancy Fit-Out Guide (PDF)</label>
                                    <input
                                        type="file"
                                        id="tenancyGuide"
                                        accept=".pdf"
                                        onChange={(e) => setUploadedFiles(prev => ({ ...prev, tenancyGuide: e.target.files[0] }))}
                                        style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                                    />
                                    <small style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                                        From your landlord or managing agent
                                    </small>
                                </div>
                            )}

                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label htmlFor="applianceList" style={{ fontSize: '0.9rem' }}>Appliance List / Wishlist</label>
                                <input
                                    type="file"
                                    id="applianceList"
                                    accept=".pdf,.xls,.xlsx,.doc,.docx,.txt"
                                    onChange={(e) => setUploadedFiles(prev => ({ ...prev, applianceList: e.target.files[0] }))}
                                    style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label htmlFor="moodboard" style={{ fontSize: '0.9rem' }}>Moodboard / Inspiration (Images or PDF)</label>
                                <input
                                    type="file"
                                    id="moodboard"
                                    accept=".pdf,.jpg,.jpeg,.png,.zip"
                                    onChange={(e) => setUploadedFiles(prev => ({ ...prev, moodboard: e.target.files[0] }))}
                                    style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                                />
                            </div>
                        </div>

                        <div className="quiz-nav">
                            <button className="btn btn-secondary" onClick={prevStep}>Back</button>
                            <button
                                className="btn btn-primary"
                                onClick={nextStep}
                                disabled={!formData.name || !formData.email || !formData.phone}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 7: Review & Confirm (The "Assistive AI" Brief Generation) */}
                {currentStep === 7 && (
                    <div className="quiz-step">
                        <h2>Review Your Project Brief</h2>
                        <p className="quiz-subtitle">We have structured your requirements for clarity.</p>

                        <div style={{
                            background: 'white',
                            border: '1px solid var(--border)',
                            padding: '2rem',
                            marginBottom: '2rem',
                            borderRadius: '4px',
                            textAlign: 'left'
                        }}>
                            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '0.5rem', fontFamily: 'Playfair Display, serif' }}>Project Overview</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
                                    <div>
                                        <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.85rem' }}>Property Type</span>
                                        {formData.property_type || '-'}
                                    </div>
                                    <div>
                                        <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.85rem' }}>Renovation Type</span>
                                        {formData.renovation_type || '-'}
                                    </div>
                                    <div>
                                        <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.85rem' }}>Budget Range</span>
                                        {formData.budget_range || '-'}
                                    </div>
                                    <div>
                                        <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.85rem' }}>Timeline</span>
                                        {formData.timeline || '-'}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '0.5rem', fontFamily: 'Playfair Display, serif' }}>Scope of Works</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {formData.scope.length > 0 ? formData.scope.map(s => (
                                        <span key={s} style={{
                                            background: 'var(--bg-cream)',
                                            padding: '0.3rem 0.8rem',
                                            fontSize: '0.85rem',
                                            borderRadius: '20px',
                                            color: 'var(--primary-dark)'
                                        }}>
                                            {s}
                                        </span>
                                    )) : <span style={{ color: '#999' }}>No specific scope selected</span>}
                                </div>
                            </div>

                            {assessmentResponses.length > 0 && (
                                <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '0.5rem', fontFamily: 'Playfair Display, serif' }}>Your Preferences</h3>
                                    <ol style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem', color: 'var(--text)', lineHeight: '1.8' }}>
                                        {assessmentResponses.map((response, idx) => (
                                            <li key={idx} style={{ marginBottom: '0.3rem' }}>{response}</li>
                                        ))}
                                    </ol>
                                </div>
                            )}

                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '0.5rem', fontFamily: 'Playfair Display, serif' }}>Structured Notes</h3>
                                <div style={{
                                    background: '#fafaf9',
                                    padding: '1rem',
                                    borderRadius: '4px',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.6',
                                    color: 'var(--text)',
                                    fontStyle: formData.additional_notes ? 'normal' : 'italic'
                                }}>
                                    {formData.additional_notes ? formData.additional_notes : "No additional notes provided."}
                                </div>
                            </div>

                            {(uploadedFiles.floorplan || uploadedFiles.tenancyGuide || uploadedFiles.applianceList || uploadedFiles.moodboard) && (
                                <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '0.5rem', fontFamily: 'Playfair Display, serif' }}>Uploaded Documents</h3>
                                    <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem', color: 'var(--text)', lineHeight: '1.8' }}>
                                        {uploadedFiles.floorplan && (
                                            <li>📐 Floorplan: {uploadedFiles.floorplan.name}</li>
                                        )}
                                        {uploadedFiles.tenancyGuide && (
                                            <li>📄 Tenancy Guide: {uploadedFiles.tenancyGuide.name}</li>
                                        )}
                                        {uploadedFiles.applianceList && (
                                            <li>🏠 Appliance List: {uploadedFiles.applianceList.name}</li>
                                        )}
                                        {uploadedFiles.moodboard && (
                                            <li>🎨 Moodboard: {uploadedFiles.moodboard.name}</li>
                                        )}
                                    </ul>
                                </div>
                            )}

                            <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '1.5rem', textAlign: 'center' }}>
                                Information may be structured or summarised to improve clarity.
                            </div>
                        </div>

                        <div className="quiz-nav">
                            <button className="btn btn-secondary" onClick={prevStep}>Back</button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmit}
                            >
                                Confirm & Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
