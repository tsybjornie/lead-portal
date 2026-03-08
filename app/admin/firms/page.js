'use client';

import { useState, useEffect } from 'react';

export default function FirmsPage() {
    const [firms, setFirms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFirm, setSelectedFirm] = useState(null);

    useEffect(() => {
        fetchFirms();
    }, []);

    const fetchFirms = async () => {
        try {
            const res = await fetch('/api/admin/firms');
            const data = await res.json();
            setFirms(data.firms || []);
        } catch (error) {
            console.error('Error fetching firms:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateFirmStatus = async (firmId, newStatus) => {
        try {
            await fetch('/api/admin/firms', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: firmId, status: newStatus })
            });
            fetchFirms();
            setSelectedFirm(null);
        } catch (error) {
            console.error('Error updating firm:', error);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: { background: '#fef3cd', color: '#856404' },
            approved: { background: '#d4edda', color: '#155724' },
            rejected: { background: '#f8d7da', color: '#721c24' },
            suspended: { background: '#f8d7da', color: '#721c24' }
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

    const getFirmTypeLabel = (type) => {
        const labels = {
            'ID': 'Interior Design (Design-Only)',
            'Design_Build': 'Design & Build',
            'Main_Con': 'Main Contractor',
            'Architect': 'Architect',
            'Specialist': 'Specialist'
        };
        return labels[type] || type;
    };

    if (loading) {
        return <div style={{ padding: '2rem' }}>Loading firms...</div>;
    }

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Firm Applications</h1>

            {firms.length === 0 ? (
                <div style={{
                    background: 'white',
                    padding: '3rem',
                    textAlign: 'center',
                    borderRadius: '8px',
                    color: '#666'
                }}>
                    No firm applications yet.
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
                                <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.85rem', color: '#666' }}>Company</th>
                                <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.85rem', color: '#666' }}>Type</th>
                                <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.85rem', color: '#666' }}>UEN</th>
                                <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.85rem', color: '#666' }}>Status</th>
                                <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.85rem', color: '#666' }}>Credits</th>
                                <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.85rem', color: '#666' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {firms.map(firm => (
                                <tr key={firm.id} style={{ borderTop: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <strong>{firm.company_name}</strong>
                                        <br />
                                        <span style={{ fontSize: '0.85rem', color: '#666' }}>{firm.contact_person}</span>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{getFirmTypeLabel(firm.firm_type)}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem', fontFamily: 'monospace' }}>{firm.company_reg}</td>
                                    <td style={{ padding: '1rem' }}>{getStatusBadge(firm.status)}</td>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{firm.credits || 0}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            onClick={() => setSelectedFirm(firm)}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid #ddd',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {selectedFirm && (
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
                            <h2 style={{ margin: 0 }}>{selectedFirm.company_name}</h2>
                            <button onClick={() => setSelectedFirm(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                            <div><strong>UEN:</strong> {selectedFirm.company_reg}</div>
                            <div><strong>Type:</strong> {getFirmTypeLabel(selectedFirm.firm_type)}</div>
                            <div><strong>Years:</strong> {selectedFirm.years_experience}</div>
                            <div><strong>Contact:</strong> {selectedFirm.contact_person} ({selectedFirm.email})</div>
                            <div><strong>Phone:</strong> {selectedFirm.phone}</div>
                            <div><strong>Portfolio:</strong> {selectedFirm.portfolio_url || 'N/A'}</div>
                            <div><strong>Project Types:</strong> {(selectedFirm.project_types || []).join(', ') || 'N/A'}</div>
                            <div><strong>Residential:</strong> {(selectedFirm.residential_familiarity || []).join(', ') || 'N/A'}</div>
                            <div><strong>Has License:</strong> {selectedFirm.has_main_con_license || 'N/A'}</div>
                            <div><strong>Status:</strong> {getStatusBadge(selectedFirm.status)}</div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {selectedFirm.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => updateFirmStatus(selectedFirm.id, 'approved')}
                                        className="btn btn-primary"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => updateFirmStatus(selectedFirm.id, 'rejected')}
                                        className="btn btn-secondary"
                                        style={{ background: '#dc3545', borderColor: '#dc3545', color: 'white' }}
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                            {selectedFirm.status === 'approved' && (
                                <button
                                    onClick={() => updateFirmStatus(selectedFirm.id, 'suspended')}
                                    className="btn btn-secondary"
                                    style={{ background: '#dc3545', borderColor: '#dc3545', color: 'white' }}
                                >
                                    Suspend (Payment Default)
                                </button>
                            )}
                            {selectedFirm.status === 'suspended' && (
                                <button
                                    onClick={() => updateFirmStatus(selectedFirm.id, 'approved')}
                                    className="btn btn-primary"
                                >
                                    Reactivate
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
