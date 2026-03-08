'use client';

import { useState, useEffect } from 'react';

export default function PortalDashboard() {
    const [firmData, setFirmData] = useState(null);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const email = sessionStorage.getItem('firm_email');
        if (email) {
            fetchData(email);
        }
    }, []);

    const fetchData = async (email) => {
        try {
            const [firmRes, leadsRes] = await Promise.all([
                fetch(`/api/portal/auth?email=${encodeURIComponent(email)}`),
                fetch(`/api/portal/leads?email=${encodeURIComponent(email)}`)
            ]);
            const firmData = await firmRes.json();
            const leadsData = await leadsRes.json();

            setFirmData(firmData.firm);
            setLeads(leadsData.leads || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    const recentLeads = leads.slice(0, 3);
    const pendingLeads = leads.filter(l => l.status === 'new' || l.status === 'matched').length;

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Welcome, {firmData?.company_name}</h1>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>
                        {firmData?.credits || 0}
                    </div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>Available Credits</div>
                </div>

                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>
                        {leads.length}
                    </div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Leads Received</div>
                </div>

                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e67e22' }}>
                        {pendingLeads}
                    </div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>Pending Follow-up</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{
                background: '#e8f5e9',
                border: '1px solid #a5d6a7',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '2rem'
            }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#2e7d32' }}>💳 Top Up Credits</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#2e7d32' }}>
                    <strong>PayNow UEN:</strong> [Your Company UEN]<br />
                    <strong>Reference:</strong> RB-{firmData?.company_name?.replace(/\s+/g, '')}-Credits
                </p>
            </div>

            {/* Recent Leads */}
            <div style={{
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Recent Leads</h2>
                    <a href="/portal/leads" style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>View All →</a>
                </div>

                {recentLeads.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                        No leads assigned yet. Once you receive leads, they&apos;ll appear here.
                    </div>
                ) : (
                    <div>
                        {recentLeads.map(lead => (
                            <div key={lead.id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #eee' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <strong>{lead.name}</strong>
                                        <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                            {lead.property_type} • {lead.budget_range}
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        background: '#e3f2fd',
                                        color: '#1565c0'
                                    }}>
                                        {lead.timeline}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
