'use client';

import { useState, useEffect } from 'react';

export default function EnquiriesPage() {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const res = await fetch('/api/admin/enquiries');
            const data = await res.json();
            setEnquiries(data.enquiries || []);
        } catch (error) {
            console.error('Error fetching enquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            new: { background: '#cce5ff', color: '#004085' },
            matched: { background: '#d4edda', color: '#155724' },
            closed: { background: '#e2e3e5', color: '#383d41' }
        };
        return (
            <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 500,
                ...styles[status]
            }}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (loading) {
        return <div style={{ padding: '2rem' }}>Loading enquiries...</div>;
    }

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Homeowner Enquiries</h1>

            {enquiries.length === 0 ? (
                <div style={{
                    background: 'white',
                    padding: '3rem',
                    textAlign: 'center',
                    borderRadius: '8px',
                    color: '#666'
                }}>
                    No enquiries yet.
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
                                <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.85rem', color: '#666' }}>Status</th>
                                <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.85rem', color: '#666' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enquiries.map(enq => (
                                <tr key={enq.id} style={{ borderTop: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <strong>{enq.name}</strong>
                                        <br />
                                        <span style={{ fontSize: '0.85rem', color: '#666' }}>{enq.email}</span>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{enq.property_type}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{enq.budget_range}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{enq.timeline}</td>
                                    <td style={{ padding: '1rem' }}>{getStatusBadge(enq.status || 'new')}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            onClick={() => setSelectedEnquiry(enq)}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid #ddd',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                marginRight: '0.5rem'
                                            }}
                                        >
                                            View
                                        </button>
                                        <a
                                            href={`/admin/matching?enquiry=${enq.id}`}
                                            style={{
                                                background: 'var(--accent)',
                                                color: 'white',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '4px',
                                                fontSize: '0.85rem',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            Match
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail Modal */}
            {selectedEnquiry && (
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
                        maxWidth: '700px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>Enquiry Details</h2>
                            <button onClick={() => setSelectedEnquiry(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                            <div><strong>Name:</strong> {selectedEnquiry.name}</div>
                            <div><strong>Email:</strong> {selectedEnquiry.email}</div>
                            <div><strong>Phone:</strong> {selectedEnquiry.phone}</div>
                            <div><strong>Property:</strong> {selectedEnquiry.property_type}</div>
                            <div><strong>Renovation:</strong> {selectedEnquiry.renovation_type}</div>
                            <div><strong>Budget:</strong> {selectedEnquiry.budget_range}</div>
                            <div><strong>Timeline:</strong> {selectedEnquiry.timeline}</div>
                            <div><strong>Status:</strong> {getStatusBadge(selectedEnquiry.status || 'new')}</div>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <strong>Scope of Works:</strong>
                            <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {(selectedEnquiry.scope || []).map(s => (
                                    <span key={s} style={{ background: '#f0f0f0', padding: '0.25rem 0.75rem', borderRadius: '15px', fontSize: '0.85rem' }}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {selectedEnquiry.additional_notes && (
                            <div style={{ marginTop: '1.5rem' }}>
                                <strong>Notes:</strong>
                                <p style={{ marginTop: '0.5rem', color: '#666' }}>{selectedEnquiry.additional_notes}</p>
                            </div>
                        )}

                        <div style={{ marginTop: '2rem' }}>
                            <a
                                href={`/admin/matching?enquiry=${selectedEnquiry.id}`}
                                className="btn btn-primary"
                            >
                                Open Matching Interface
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
