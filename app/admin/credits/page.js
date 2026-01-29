'use client';

import { useState, useEffect } from 'react';

export default function CreditsPage() {
    const [firms, setFirms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingFirm, setEditingFirm] = useState(null);
    const [newCredits, setNewCredits] = useState(0);

    useEffect(() => {
        fetchFirms();
    }, []);

    const fetchFirms = async () => {
        try {
            const res = await fetch('/api/admin/firms');
            const data = await res.json();
            setFirms((data.firms || []).filter(f => f.status === 'approved'));
        } catch (error) {
            console.error('Error fetching firms:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateCredits = async () => {
        try {
            await fetch('/api/admin/firms', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingFirm.id, credits: newCredits })
            });
            fetchFirms();
            setEditingFirm(null);
        } catch (error) {
            console.error('Error updating credits:', error);
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem' }}>Loading...</div>;
    }

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Credit Management</h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
                Add credits after receiving PayNow payment. 1 credit = 1 lead access.
            </p>

            {/* PayNow Info Box */}
            <div style={{
                background: '#e3f2fd',
                border: '1px solid #90caf9',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '2rem'
            }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#1565c0' }}>💳 Payment Instructions for Firms</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#1565c0' }}>
                    <strong>PayNow UEN:</strong> [Your Company UEN]<br />
                    <strong>Reference:</strong> RB-[Firm Name]-Credits<br />
                    After receiving payment, add credits below.
                </p>
            </div>

            {firms.length === 0 ? (
                <div style={{
                    background: 'white',
                    padding: '3rem',
                    textAlign: 'center',
                    borderRadius: '8px',
                    color: '#666'
                }}>
                    No approved firms yet.
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
                                <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.85rem', color: '#666' }}>Credits</th>
                                <th style={{ padding: '1rem', fontWeight: 500, fontSize: '0.85rem', color: '#666' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {firms.map(firm => (
                                <tr key={firm.id} style={{ borderTop: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <strong>{firm.company_name}</strong>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{firm.firm_type}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            background: (firm.credits || 0) > 0 ? '#d4edda' : '#f8d7da',
                                            color: (firm.credits || 0) > 0 ? '#155724' : '#721c24',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontWeight: 500
                                        }}>
                                            {firm.credits || 0} credits
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            onClick={() => {
                                                setEditingFirm(firm);
                                                setNewCredits(firm.credits || 0);
                                            }}
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
                                            Edit Credits
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            {editingFirm && (
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
                        maxWidth: '400px',
                        width: '90%'
                    }}>
                        <h2 style={{ marginBottom: '1rem' }}>Update Credits</h2>
                        <p style={{ marginBottom: '1rem', color: '#666' }}>{editingFirm.company_name}</p>

                        <div className="form-group">
                            <label>Credits</label>
                            <input
                                type="number"
                                value={newCredits}
                                onChange={(e) => setNewCredits(parseInt(e.target.value) || 0)}
                                min="0"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button onClick={updateCredits} className="btn btn-primary">
                                Save
                            </button>
                            <button onClick={() => setEditingFirm(null)} className="btn btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
