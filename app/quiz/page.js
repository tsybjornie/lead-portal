'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Contact info
        email: '',
        name: '',
        phone: '',

        // Quiz answers
        property_type: '',
        renovation_type: '',
        budget_min: 0,
        budget_max: 0,
        scope_hacking: false,
        scope_wet_works: false,
        scope_carpentry: false,
        scope_electrical: false,
        scope_plumbing: false,
        scope_painting: false,
        scope_flooring: false,
        timeline: '',
        decision_speed: '',
        communication_pref: '',
        involvement_level: '',
        expectations_acknowledged: false
    });

    const totalSteps = 7;
    const progress = (currentStep / totalSteps) * 100;

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        if (!formData.expectations_acknowledged) {
            alert('Please acknowledge the expectations before submitting');
            return;
        }

        try {
            const response = await fetch('/api/quiz/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect to matches page
                router.push(`/matches?leadId=${data.leadId}`);
            } else {
                alert(data.error || 'Failed to submit quiz');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit quiz. Please try again.');
        }
    };

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
                        <p className="quiz-subtitle">This helps us match you with the right firms</p>

                        <div className="option-grid">
                            {[
                                { value: 'HDB', icon: '🏢', title: 'HDB Flat', desc: '3-room, 4-room, 5-room, Executive' },
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

                {/* Step 2: Renovation Type */}
                {currentStep === 2 && (
                    <div className="quiz-step">
                        <h2>What type of renovation do you need?</h2>
                        <p className="quiz-subtitle">Different scopes require different expertise</p>

                        <div className="option-grid">
                            {[
                                { value: 'partial', icon: '🔧', title: 'Partial Renovation', desc: 'Selected rooms or areas' },
                                { value: 'full', icon: '🛠️', title: 'Full Home Renovation', desc: 'Complete overhaul' },
                                { value: 'A&A', icon: '📐', title: 'A&A Works', desc: 'Additions & alterations' },
                                { value: 'fit-out', icon: '💼', title: 'Commercial Fit-Out', desc: 'Office or retail space' }
                            ].map(option => (
                                <div
                                    key={option.value}
                                    className={`option-card ${formData.renovation_type === option.value ? 'selected' : ''}`}
                                    onClick={() => updateField('renovation_type', option.value)}
                                >
                                    <div className="option-icon">{option.icon}</div>
                                    <div className="option-title">{option.title}</div>
                                    <div className="option-desc">{option.desc}</div>
                                </div>
                            ))}
                        </div>

                        <div className="quiz-nav">
                            <button className="btn btn-secondary" onClick={prevStep}>Back</button>
                            <button
                                className="btn btn-primary"
                                onClick={nextStep}
                                disabled={!formData.renovation_type}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Budget */}
                {currentStep === 3 && (
                    <div className="quiz-step">
                        <h2>What&apos;s your budget range?</h2>
                        <p className="quiz-subtitle">Required - helps us match you with firms in your price range</p>

                        <div className="option-grid">
                            {[
                                { min: 30000, max: 60000, label: '$30k - $60k' },
                                { min: 60000, max: 100000, label: '$60k - $100k' },
                                { min: 100000, max: 150000, label: '$100k - $150k' },
                                { min: 150000, max: 200000, label: '$150k - $200k' },
                                { min: 200000, max: 999999, label: '$200k+' }
                            ].map(option => (
                                <div
                                    key={option.label}
                                    className={`option-card ${formData.budget_min === option.min ? 'selected' : ''}`}
                                    onClick={() => {
                                        updateField('budget_min', option.min);
                                        updateField('budget_max', option.max);
                                    }}
                                >
                                    <div className="option-title">{option.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="quiz-nav">
                            <button className="btn btn-secondary" onClick={prevStep}>Back</button>
                            <button
                                className="btn btn-primary"
                                onClick={nextStep}
                                disabled={!formData.budget_min}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Scope */}
                {currentStep === 4 && (
                    <div className="quiz-step">
                        <h2>What work needs to be done?</h2>
                        <p className="quiz-subtitle">Select all that apply</p>

                        <div className="checkbox-grid">
                            {[
                                { field: 'scope_hacking', label: 'Hacking / Demolition' },
                                { field: 'scope_wet_works', label: 'Wet Works (Kitchen/Bathroom)' },
                                { field: 'scope_carpentry', label: 'Carpentry & Built-ins' },
                                { field: 'scope_electrical', label: 'Electrical Works' },
                                { field: 'scope_plumbing', label: 'Plumbing' },
                                { field: 'scope_painting', label: 'Painting' },
                                { field: 'scope_flooring', label: 'Flooring' }
                            ].map(item => (
                                <div
                                    key={item.field}
                                    className={`checkbox-item ${formData[item.field] ? 'checked' : ''}`}
                                    onClick={() => updateField(item.field, !formData[item.field])}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData[item.field]}
                                        readOnly
                                    />
                                    <span className="checkbox-label">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="quiz-nav">
                            <button className="btn btn-secondary" onClick={prevStep}>Back</button>
                            <button className="btn btn-primary" onClick={nextStep}>
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 5: Timeline */}
                {currentStep === 5 && (
                    <div className="quiz-step">
                        <h2>When do you need to start?</h2>
                        <p className="quiz-subtitle">This helps firms prioritize their schedule</p>

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

                {/* Step 6: Working Style */}
                {currentStep === 6 && (
                    <div className="quiz-step">
                        <h2>Tell us about your working style</h2>
                        <p className="quiz-subtitle">This helps us match you with compatible firms</p>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Decision Speed</h3>
                            <div className="radio-group">
                                {[
                                    { value: 'fast', label: 'Fast - I decide quickly' },
                                    { value: 'moderate', label: 'Moderate - I take my time' },
                                    { value: 'deliberate', label: 'Deliberate - I research thoroughly' }
                                ].map(option => (
                                    <div
                                        key={option.value}
                                        className={`radio-option ${formData.decision_speed === option.value ? 'selected' : ''}`}
                                        onClick={() => updateField('decision_speed', option.value)}
                                    >
                                        <input
                                            type="radio"
                                            checked={formData.decision_speed === option.value}
                                            readOnly
                                        />
                                        <span>{option.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Communication Preference</h3>
                            <div className="radio-group">
                                {[
                                    { value: 'frequent', label: 'Frequent updates - I want to stay in the loop' },
                                    { value: 'moderate', label: 'Weekly check-ins - balanced approach' },
                                    { value: 'minimal', label: 'Milestone-based - just the key updates' }
                                ].map(option => (
                                    <div
                                        key={option.value}
                                        className={`radio-option ${formData.communication_pref === option.value ? 'selected' : ''}`}
                                        onClick={() => updateField('communication_pref', option.value)}
                                    >
                                        <input
                                            type="radio"
                                            checked={formData.communication_pref === option.value}
                                            readOnly
                                        />
                                        <span>{option.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Involvement Level</h3>
                            <div className="radio-group">
                                {[
                                    { value: 'hands-on', label: 'Hands-on - I want to be involved in details' },
                                    { value: 'collaborative', label: 'Collaborative - I work with the team' },
                                    { value: 'hands-off', label: 'Hands-off - I trust the professionals' }
                                ].map(option => (
                                    <div
                                        key={option.value}
                                        className={`radio-option ${formData.involvement_level === option.value ? 'selected' : ''}`}
                                        onClick={() => updateField('involvement_level', option.value)}
                                    >
                                        <input
                                            type="radio"
                                            checked={formData.involvement_level === option.value}
                                            readOnly
                                        />
                                        <span>{option.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="quiz-nav">
                            <button className="btn btn-secondary" onClick={prevStep}>Back</button>
                            <button
                                className="btn btn-primary"
                                onClick={nextStep}
                                disabled={!formData.decision_speed || !formData.communication_pref || !formData.involvement_level}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 7: Contact & Expectations */}
                {currentStep === 7 && (
                    <div className="quiz-step">
                        <h2>Almost done! Your contact information</h2>
                        <p className="quiz-subtitle">Matched firms will use this to reach out to you</p>

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
                                required
                            />
                        </div>

                        <div style={{
                            background: 'var(--bg-light)',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            marginTop: '2rem',
                            marginBottom: '1.5rem'
                        }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Important: Please Acknowledge</h3>

                            <div className="checkbox-item" style={{ marginBottom: '1rem', background: 'white' }}
                                onClick={() => updateField('expectations_acknowledged', !formData.expectations_acknowledged)}
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.expectations_acknowledged}
                                    readOnly
                                />
                                <span className="checkbox-label" style={{ fontSize: '0.95rem' }}>
                                    I understand that:
                                    <br />• This platform introduces me to 2-4 firms (no rankings)
                                    <br />• Firms have 7-14 days to respond
                                    <br />• There are no guarantees about outcomes or closing
                                    <br />• Payments/contracts are directly with firms, not this platform
                                </span>
                            </div>
                        </div>

                        <div className="quiz-nav">
                            <button className="btn btn-secondary" onClick={prevStep}>Back</button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={!formData.name || !formData.email || !formData.phone || !formData.expectations_acknowledged}
                            >
                                Submit & Get My Matches
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
