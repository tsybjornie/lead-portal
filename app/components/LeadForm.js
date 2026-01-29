'use client';

import { useState } from 'react';

export default function LeadForm({ pageType = 'general' }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        budget: '',
        propertyType: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Conversion tracking placeholder - connect to Google Ads later
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'form_submit', {
                event_category: 'lead_generation',
                event_label: pageType,
                value: formData.budget
            });
        }

        // Console log for now - replace with actual API endpoint
        console.log('Form submitted:', { ...formData, pageType, timestamp: new Date().toISOString() });

        // Show success message
        setSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setSubmitted(false);
            setFormData({
                name: '',
                email: '',
                phone: '',
                budget: '',
                propertyType: '',
                message: ''
            });
        }, 3000);
    };

    if (submitted) {
        return (
            <div className="lead-form" style={{ textAlign: 'center', padding: '3rem' }}>
                <h3 style={{ color: 'var(--success-color)', marginBottom: '1rem' }}>✓ Consultation Request Received</h3>
                <p>We&apos;ll contact you within 1 business day to discuss your renovation needs.</p>
            </div>
        );
    }

    return (
        <form className="lead-form" onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Get Your Consultation</h3>

            <div className="form-group">
                <label htmlFor="budget">Project Budget Range *</label>
                <select
                    id="budget"
                    name="budget"
                    required
                    value={formData.budget}
                    onChange={handleChange}
                >
                    <option value="">Select your budget range</option>
                    <option value="30k-80k">$30,000 - $80,000</option>
                    <option value="40k-100k">$40,000 - $100,000</option>
                    <option value="50k-120k">$50,000 - $120,000</option>
                    <option value="60k-140k">$60,000 - $140,000</option>
                    <option value="70k-160k">$70,000 - $160,000</option>
                    <option value="80k-180k">$80,000 - $180,000</option>
                    <option value="100k-200k">$100,000 - $200,000</option>
                    <option value="200k+">$200,000+</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="propertyType">Property Type *</label>
                <select
                    id="propertyType"
                    name="propertyType"
                    required
                    value={formData.propertyType}
                    onChange={handleChange}
                >
                    <option value="">Select property type</option>
                    <option value="hdb-3room">HDB 3-Room</option>
                    <option value="hdb-4room">HDB 4-Room</option>
                    <option value="hdb-5room">HDB 5-Room / Executive</option>
                    <option value="condo">Condominium</option>
                    <option value="landed">Landed Property</option>
                    <option value="commercial">Commercial Space</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="message">Project Details (Optional)</label>
                <textarea
                    id="message"
                    name="message"
                    placeholder="Brief description of your renovation needs..."
                    value={formData.message}
                    onChange={handleChange}
                ></textarea>
            </div>

            <button type="submit" className="btn-submit">
                Submit Consultation Request
            </button>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', marginTop: '1rem', textAlign: 'center' }}>
                By submitting, you agree to be contacted regarding your renovation inquiry.
            </p>
        </form>
    );
}
