'use client';

import { useState, useEffect } from 'react';

export default function LeadsPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null);

    useEffect(() => {
        const email = sessionStorage.getItem('firm_email');
        if (email) {
            fetchLeads(email);
        }
    }, []);

    const fetchLeads = async (email) => {
        try {
            const res = await fetch(`/api/portal/leads?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            setLeads(data.leads || []);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading leads...</div>;
    }

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>My Leads</h1>

            {leads.length === 0 ? (
                <div style={{
                    background: 'white',
                    padding: '3rem',
                    textAlign: 'center',
                    borderRadius: '8px',
                    color: '#666'
                }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No leads assigned yet</p>
                    <p style={{ fontSize: '0.9rem' }}>Once homeowners are matched to your firm, their details will appear here.</p>
                </div>
            ) : (
                <div style={{
                    background: 'white',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.85rem', color: '#666' }}>Contact</th>
                                <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.85rem', color: '#666' }}>Property</th>
                                <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.85rem', color: '#666' }}>Budget</th>
                                <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.85rem', color: '#666' }}>Timeline</th>
                                <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.85rem', color: '#666' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map(lead => (
                                <tr key={lead.id} style={{ borderTop: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <strong>{lead.name}</strong>
                                        <br />
                                        <span style={{ fontSize: '0.85rem', color: '#666' }}>{lead.email}</span>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{lead.property_type}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{lead.budget_range}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{lead.timeline}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            onClick={() => setSelectedLead(lead)}
                                            style={{
                                                background: 'var(--accent)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Lead Detail Modal */}
            {selectedLead && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>Lead Details</h2>
                            <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                            <div><strong>Name:</strong> {selectedLead.name}</div>
                            <div><strong>Email:</strong> <a href={`mailto:${selectedLead.email}`}>{selectedLead.email}</a></div>
                            <div><strong>Phone:</strong> <a href={`tel:${selectedLead.phone}`}>{selectedLead.phone}</a></div>
                            <div><strong>Property:</strong> {selectedLead.property_type}</div>
                            <div><strong>Renovation:</strong> {selectedLead.renovation_type}</div>
                            <div><strong>Budget:</strong> {selectedLead.budget_range}</div>
                            <div><strong>Timeline:</strong> {selectedLead.timeline}</div>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <strong>Scope of Works:</strong>
                            <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {(selectedLead.scope || []).map(s => (
                                    <span key={s} style={{ background: '#f0f0f0', padding: '0.25rem 0.75rem', borderRadius: '15px', fontSize: '0.85rem' }}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {selectedLead.additional_notes && (
                            <div style={{ marginTop: '1.5rem' }}>
                                <strong>Notes:</strong>
                                <p style={{ marginTop: '0.5rem', color: '#666', background: '#f9f9f9', padding: '1rem', borderRadius: '4px' }}>
                                    {selectedLead.additional_notes}
                                </p>
                            </div>
                        )}

                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                            <a href={`mailto:${selectedLead.email}`} className="btn btn-primary">
                                Email Client
                            </a>
                            <a href={`tel:${selectedLead.phone}`} className="btn btn-secondary">
                                Call Client
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
