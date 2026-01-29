'use client';

import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Dashboard Overview</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem'
            }}>
                <Link href="/admin/firms" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                    }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#333' }}>Firm Applications</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Review and approve firm applications</p>
                    </div>
                </Link>

                <Link href="/admin/enquiries" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        cursor: 'pointer'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#333' }}>Homeowner Enquiries</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>View and manage lead submissions</p>
                    </div>
                </Link>

                <Link href="/admin/matching" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        cursor: 'pointer'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#333' }}>Matching</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Assign firms to enquiries</p>
                    </div>
                </Link>

                <Link href="/admin/credits" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        cursor: 'pointer'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#333' }}>Credits</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Manage firm credit balances</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
