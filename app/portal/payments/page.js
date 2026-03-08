'use client';

import { useState, useEffect } from 'react';

export default function PaymentsPage() {
    const [firmData, setFirmData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const email = sessionStorage.getItem('firm_email');
        if (email) {
            fetchFirm(email);
        }
    }, []);

    const fetchFirm = async (email) => {
        try {
            const res = await fetch(`/api/portal/auth?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            setFirmData(data.firm);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Payments & Credits</h1>

            {/* Current Balance */}
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                marginBottom: '2rem'
            }}>
                <h2 style={{ fontSize: '1rem', color: '#666', marginBottom: '0.5rem' }}>Current Balance</h2>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#27ae60' }}>
                    {firmData?.credits || 0} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#666' }}>credits</span>
                </div>
                <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
                    1 credit = 1 lead access. Credits are deducted when you receive a new lead.
                </p>
            </div>

            {/* PayNow Instructions */}
            <div style={{
                background: '#e8f5e9',
                border: '2px solid #a5d6a7',
                padding: '2rem',
                borderRadius: '8px',
                marginBottom: '2rem'
            }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#2e7d32' }}>💳 Top Up Credits via PayNow</h2>

                <div style={{ display: 'grid', gap: '1rem', background: 'white', padding: '1.5rem', borderRadius: '8px' }}>
                    <div>
                        <strong>PayNow UEN:</strong>
                        <div style={{ fontSize: '1.5rem', fontFamily: 'monospace', color: '#1565c0', marginTop: '0.25rem' }}>
                            [Your Company UEN]
                        </div>
                    </div>
                    <div>
                        <strong>Payment Reference (Important!):</strong>
                        <div style={{ fontSize: '1.1rem', fontFamily: 'monospace', background: '#f5f5f5', padding: '0.5rem', borderRadius: '4px', marginTop: '0.25rem' }}>
                            RB-{firmData?.company_name?.replace(/\s+/g, '').substring(0, 15)}-Credits
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#2e7d32' }}>Credit Packages</h3>
                    <table style={{ width: '100%', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa' }}>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Package</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Credits</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Price</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Per Lead</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderTop: '1px solid #eee' }}>
                                <td style={{ padding: '0.75rem' }}>Starter</td>
                                <td style={{ padding: '0.75rem' }}>5 credits</td>
                                <td style={{ padding: '0.75rem' }}>$150</td>
                                <td style={{ padding: '0.75rem' }}>$30/lead</td>
                            </tr>
                            <tr style={{ borderTop: '1px solid #eee' }}>
                                <td style={{ padding: '0.75rem' }}>Growth</td>
                                <td style={{ padding: '0.75rem' }}>15 credits</td>
                                <td style={{ padding: '0.75rem' }}>$375</td>
                                <td style={{ padding: '0.75rem' }}>$25/lead</td>
                            </tr>
                            <tr style={{ borderTop: '1px solid #eee', background: '#e8f5e9' }}>
                                <td style={{ padding: '0.75rem' }}><strong>Pro</strong></td>
                                <td style={{ padding: '0.75rem' }}><strong>30 credits</strong></td>
                                <td style={{ padding: '0.75rem' }}><strong>$600</strong></td>
                                <td style={{ padding: '0.75rem', color: '#27ae60' }}><strong>$20/lead</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p style={{ marginTop: '1.5rem', color: '#2e7d32', fontSize: '0.9rem' }}>
                    <strong>Note:</strong> Credits are typically added within 1 business day after payment confirmation.
                    For urgent requests, email payments@renobuilders.sg with your payment screenshot.
                </p>
            </div>

            {/* Payment History (placeholder) */}
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Credit History</h2>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    Coming soon: View your credit top-ups and usage history.
                </p>
            </div>
        </div>
    );
}
