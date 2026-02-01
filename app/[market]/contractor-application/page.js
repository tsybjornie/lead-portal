'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMarket } from '../../../context/MarketContext';

export default function ContractorApplicationPage() {
    const { market } = useMarket();
    const [submitted, setSubmitted] = useState(false);
    const [uploadedLicense, setUploadedLicense] = useState(null); // License PDF
    const [formData, setFormData] = useState({
        // Company Info
        company_name: '',
        company_reg: '',
        years_experience: '',

        // Firm Type & Role
        firm_type: '',

        // Project Types
        project_types: [], // Residential, Commercial

        // Residential Familiarity
        residential_familiarity: [], // HDB, Condo, Landed

        // Commercial Familiarity
        commercial_scdf: false,
        commercial_bca: false,
        commercial_nea: false,
        commercial_wica: false,

        // Licensing
        has_main_con_license: '',
        uses_licensed_partners: '',

        // Specialist Category (for Specialists only)
        specialist_category: '',

        // Architect specific
        handles_authority_submissions: '',

        // Contact
        contact_person: '',
        email: '',
        phone: '',

        // Capacity
        monthly_capacity: '',
        portfolio_url: '',
        additional_info: ''
    });

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleArrayField = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter(v => v !== value)
                : [...prev[field], value]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/contractor-application', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
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

    // Generate disclosure preview based on firm type
    const getDisclosurePreview = () => {
        switch (formData.firm_type) {
            case 'ID':
                return 'This firm focuses on design services. Licensed execution is handled separately where required.';
            case 'Design_Build':
                return 'This firm provides design and licensed execution services for applicable projects.';
            case 'Main_Con':
                return 'This firm provides construction and execution services. Design is handled separately or by client.';
            case 'Architect':
                return 'This practice provides architectural design and authority submission services.';
            case 'Specialist':
                return 'This firm provides specialist consultation and supply services. Introduced via design professionals.';
            default:
                return '';
        }
    };

    if (submitted) {
        return (
            <div className="success-container">
                <div className="success-header">
                    <div className="success-icon">✅</div>
                    <h1>Application Submitted!</h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginBottom: 0 }}>
                        Thank you, <strong>{formData.company_name}</strong>. We&apos;ve received your application.
                    </p>
                </div>

                <div style={{
                    background: 'white',
                    padding: '2.5rem',
                    borderRadius: '0',
                    boxShadow: 'var(--shadow)',
                    marginBottom: '2rem',
                    textAlign: 'center',
                    border: '1px solid var(--border)'
                }}>
                    <h3 style={{ marginBottom: '1rem' }}>What Happens Next?</h3>
                    <p style={{ color: 'var(--text-light)', lineHeight: 1.8 }}>
                        Our team will review your application and credentials. If approved, we&apos;ll contact you
                        within <strong>3-5 business days</strong> to discuss onboarding and lead access.
                    </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <Link href={`/${market}`} className="btn btn-secondary">Return Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '4rem 0' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '0',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border)'
                }}>
                    <h1 style={{ marginBottom: '0.5rem' }}>Firm Application</h1>
                    <p style={{ color: 'var(--text-light)', marginBottom: '3rem', fontStyle: 'italic' }}>
                        Join our network of renovation professionals
                    </p>

                    <form onSubmit={handleSubmit}>
                        {/* Section 1: Company Information */}
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Company Information</h3>

                        <div className="form-group">
                            <label htmlFor="company_name">Legal Business Entity Name *</label>
                            <input
                                type="text"
                                id="company_name"
                                value={formData.company_name}
                                onChange={(e) => updateField('company_name', e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="company_reg">UEN (Company Registration Number) *</label>
                            <input
                                type="text"
                                id="company_reg"
                                value={formData.company_reg}
                                onChange={(e) => updateField('company_reg', e.target.value)}
                                placeholder="e.g., 201234567A"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="years_experience">Years in Operation *</label>
                            <select
                                id="years_experience"
                                value={formData.years_experience}
                                onChange={(e) => updateField('years_experience', e.target.value)}
                                required
                            >
                                <option value="">Select...</option>
                                <option value="<2">Less than 2 years</option>
                                <option value="2-5">2-5 years</option>
                                <option value="5-10">5-10 years</option>
                                <option value="10+">10+ years</option>
                            </select>
                        </div>

                        {/* Section 2: Firm Type (The 5 Categories) */}
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', marginTop: '3rem' }}>Declared Role</h3>

                        <div className="form-group">
                            <label htmlFor="firm_type">Firm Type *</label>
                            <select
                                id="firm_type"
                                value={formData.firm_type}
                                onChange={(e) => updateField('firm_type', e.target.value)}
                                required
                            >
                                <option value="">Select your firm type...</option>
                                <option value="ID">Interior Design Firm (Design-Only)</option>
                                <option value="Design_Build">Interior Design & Build (Licensed Main Contractor)</option>
                                <option value="Main_Con">Main Contractor (No Design Services)</option>
                                <option value="Architect">Architect (Registered Practice)</option>
                                <option value="Specialist">Specialist Consultant / Supplier</option>
                            </select>
                        </div>

                        {/* Specialist Category (Conditional) */}
                        {formData.firm_type === 'Specialist' && (
                            <div className="form-group">
                                <label htmlFor="specialist_category">Specialist Category *</label>
                                <select
                                    id="specialist_category"
                                    value={formData.specialist_category}
                                    onChange={(e) => updateField('specialist_category', e.target.value)}
                                    required
                                >
                                    <option value="">Select category...</option>
                                    <option value="stone_surfaces">Custom Stone & Surfaces</option>
                                    <option value="lighting">Lighting Specialist</option>
                                    <option value="signage">Signage Specialist</option>
                                    <option value="carpentry">Bespoke Carpentry</option>
                                    <option value="audio_visual">Audio/Visual Systems</option>
                                    <option value="other">Other</option>
                                </select>
                                <small style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                                    Specialists are introduced to design professionals first, not matched directly to homeowners.
                                </small>
                            </div>
                        )}

                        {/* Section 3: Project Types */}
                        {formData.firm_type && formData.firm_type !== 'Specialist' && (
                            <>
                                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', marginTop: '3rem' }}>Project Types</h3>

                                <div className="form-group">
                                    <label>Primary Project Types *</label>
                                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.project_types.includes('Residential')}
                                                onChange={() => toggleArrayField('project_types', 'Residential')}
                                                style={{ marginRight: '0.5rem' }}
                                            />
                                            Residential
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.project_types.includes('Commercial')}
                                                onChange={() => toggleArrayField('project_types', 'Commercial')}
                                                style={{ marginRight: '0.5rem' }}
                                            />
                                            Commercial
                                        </label>
                                    </div>
                                </div>

                                {/* Residential Familiarity */}
                                {formData.project_types.includes('Residential') && (
                                    <div className="form-group" style={{ background: 'var(--bg-cream)', padding: '1.5rem', border: '1px solid var(--border)', marginTop: '1rem' }}>
                                        <label style={{ marginBottom: '0.75rem', display: 'block' }}>Residential Project Familiarity</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                            {['HDB', 'Condo', 'Landed'].map(type => (
                                                <label key={type} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.residential_familiarity.includes(type)}
                                                        onChange={() => toggleArrayField('residential_familiarity', type)}
                                                        style={{ marginRight: '0.5rem' }}
                                                    />
                                                    {type}
                                                </label>
                                            ))}
                                        </div>
                                        <small style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '0.75rem', display: 'block' }}>
                                            HDB: Familiarity with HDB renovation guidelines. Condo: MCST requirements. Landed: A&A works.
                                        </small>
                                    </div>
                                )}

                                {/* Commercial Familiarity */}
                                {formData.project_types.includes('Commercial') && (
                                    <div className="form-group" style={{ background: 'var(--bg-cream)', padding: '1.5rem', border: '1px solid var(--border)', marginTop: '1rem' }}>
                                        <label style={{ marginBottom: '0.75rem', display: 'block' }}>Commercial Compliance Familiarity</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={formData.commercial_scdf} onChange={(e) => updateField('commercial_scdf', e.target.checked)} style={{ marginRight: '0.5rem' }} />
                                                SCDF (Fire Safety)
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={formData.commercial_bca} onChange={(e) => updateField('commercial_bca', e.target.checked)} style={{ marginRight: '0.5rem' }} />
                                                BCA
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={formData.commercial_nea} onChange={(e) => updateField('commercial_nea', e.target.checked)} style={{ marginRight: '0.5rem' }} />
                                                NEA
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={formData.commercial_wica} onChange={(e) => updateField('commercial_wica', e.target.checked)} style={{ marginRight: '0.5rem' }} />
                                                WICA (Workplace Safety)
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Section 4: Licensing Disclosure */}
                        {(formData.firm_type === 'ID' || formData.firm_type === 'Design_Build' || formData.firm_type === 'Main_Con') && (
                            <>
                                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', marginTop: '3rem' }}>Licensing & Execution</h3>

                                {formData.firm_type === 'ID' && (
                                    <div className="form-group">
                                        <label htmlFor="uses_licensed_partners">How do you handle licensed execution works? *</label>
                                        <select
                                            id="uses_licensed_partners"
                                            value={formData.uses_licensed_partners}
                                            onChange={(e) => updateField('uses_licensed_partners', e.target.value)}
                                            required
                                        >
                                            <option value="">Select...</option>
                                            <option value="platform_partners">I work with licensed partners from this platform</option>
                                            <option value="own_partners">I have my own licensed main contractor partners</option>
                                            <option value="client_arranges">Client arranges their own main contractor</option>
                                        </select>
                                    </div>
                                )}

                                {(formData.firm_type === 'Design_Build' || formData.firm_type === 'Main_Con') && (
                                    <div className="form-group">
                                        <label htmlFor="has_main_con_license">Do you hold a main contractor license? *</label>
                                        <select
                                            id="has_main_con_license"
                                            value={formData.has_main_con_license}
                                            onChange={(e) => updateField('has_main_con_license', e.target.value)}
                                            required
                                        >
                                            <option value="">Select...</option>
                                            <option value="yes">Yes, we are a licensed main contractor</option>
                                            <option value="via_partner">Execution is via licensed partners</option>
                                        </select>
                                    </div>
                                )}

                                {/* License Upload - conditional on 'yes' */}
                                {(formData.firm_type === 'Design_Build' || formData.firm_type === 'Main_Con') && formData.has_main_con_license === 'yes' && (
                                    <div className="form-group" style={{ marginTop: '1rem' }}>
                                        <label htmlFor="license_upload">Upload License Document (PDF)</label>
                                        <input
                                            type="file"
                                            id="license_upload"
                                            accept=".pdf"
                                            onChange={(e) => setUploadedLicense(e.target.files[0])}
                                            style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                                        />
                                        <small style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                                            Optional but recommended. Helps expedite verification.
                                        </small>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Architect: Authority Submissions */}
                        {formData.firm_type === 'Architect' && (
                            <>
                                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', marginTop: '3rem' }}>Architectural Services</h3>
                                <div className="form-group">
                                    <label htmlFor="handles_authority_submissions">Do you handle authority submissions (BCA, URA)? *</label>
                                    <select
                                        id="handles_authority_submissions"
                                        value={formData.handles_authority_submissions}
                                        onChange={(e) => updateField('handles_authority_submissions', e.target.value)}
                                        required
                                    >
                                        <option value="">Select...</option>
                                        <option value="yes">Yes, we handle full authority submissions</option>
                                        <option value="partial">Partial - depends on project scope</option>
                                        <option value="no">No - design consultation only</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Disclosure Preview */}
                        {formData.firm_type && (
                            <div style={{
                                background: '#f8f9fa',
                                border: '1px solid var(--border)',
                                padding: '1.5rem',
                                marginTop: '2rem',
                                marginBottom: '2rem'
                            }}>
                                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>Your Profile Will Display:</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text)', margin: 0, fontStyle: 'italic' }}>
                                    &ldquo;Declared Role & Scope: {getDisclosurePreview()}&rdquo;
                                </p>
                            </div>
                        )}

                        {/* Section 5: Contact Person */}
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', marginTop: '3rem' }}>Contact Person</h3>

                        <div className="form-group">
                            <label htmlFor="contact_person">Full Name *</label>
                            <input
                                type="text"
                                id="contact_person"
                                value={formData.contact_person}
                                onChange={(e) => updateField('contact_person', e.target.value)}
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
                                placeholder={market === 'MY' ? "+60 XXX XXX XXX" : "+65 XXXX XXXX"}
                                required
                            />
                        </div>

                        {/* Section 6: Capacity */}
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', marginTop: '3rem' }}>Capacity & Portfolio</h3>

                        <div className="form-group">
                            <label htmlFor="monthly_capacity">Monthly Project Capacity *</label>
                            <input
                                type="number"
                                id="monthly_capacity"
                                value={formData.monthly_capacity}
                                onChange={(e) => updateField('monthly_capacity', e.target.value)}
                                min="1"
                                max="20"
                                placeholder="How many new projects can you take per month?"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="portfolio_url">Portfolio/Website URL</label>
                            <input
                                type="url"
                                id="portfolio_url"
                                value={formData.portfolio_url}
                                onChange={(e) => updateField('portfolio_url', e.target.value)}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="additional_info">Additional Information (Optional)</label>
                            <textarea
                                id="additional_info"
                                value={formData.additional_info}
                                onChange={(e) => updateField('additional_info', e.target.value)}
                                rows="4"
                                placeholder="Specializations, certifications, unique selling points..."
                            />
                        </div>

                        {/* Disclaimer */}
                        <div style={{
                            background: 'var(--bg-cream)',
                            padding: '1.5rem',
                            borderRadius: '0',
                            marginBottom: '2rem',
                            border: '1px solid var(--border)'
                        }}>
                            <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                                <strong>Important:</strong> ROOF does not issue licenses or certify firms.
                            </p>
                            <p style={{ fontSize: '0.85rem', marginBottom: 0, color: 'var(--text-light)' }}>
                                By submitting, you confirm that the information provided is accurate. Homeowners remain responsible for verifying suitability for their specific project requirements.
                            </p>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Submit Application
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
