'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function MatchingPage() {
    const searchParams = useSearchParams();
    const enquiryId = searchParams.get('enquiry');

    const [enquiry, setEnquiry] = useState(null);
    const [firms, setFirms] = useState([]);
    const [filteredFirms, setFilteredFirms] = useState([]);
    const [selectedFirms, setSelectedFirms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [enquiryId]);

    const fetchData = async () => {
        try {
            const [enqRes, firmsRes] = await Promise.all([
                fetch('/api/admin/enquiries'),
                fetch('/api/admin/firms')
            ]);
            const enqData = await enqRes.json();
            const firmsData = await firmsRes.json();

            if (enquiryId) {
                const found = enqData.enquiries.find(e => e.id === enquiryId);
                setEnquiry(found);
            }
            setFirms(firmsData.firms || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Apply hard filters when enquiry changes
    useEffect(() => {
        if (!enquiry || firms.length === 0) return;

        const approved = firms.filter(f => f.status === 'approved' && (f.credits || 0) > 0);

        // Hard filters
        const filtered = approved.filter(firm => {
            // Project type compatibility
            const projectMatch =
                (enquiry.renovation_type === 'fit-out' && (firm.project_types || []).includes('Commercial')) ||
                (enquiry.renovation_type !== 'fit-out' && (firm.project_types || []).includes('Residential'));

            if (!projectMatch) return false;

            // Property type compatibility (for residential)
            if (enquiry.renovation_type !== 'fit-out') {
                const propertyMatch = (firm.residential_familiarity || []).some(p =>
                    p.toLowerCase() === enquiry.property_type?.toLowerCase()
                );
                if (!propertyMatch && (firm.residential_familiarity || []).length > 0) return false;
            }

            // Role compatibility - not strict for now
            return true;
        });

        setFilteredFirms(filtered);
    }, [enquiry, firms]);

    const toggleFirmSelection = (firmId) => {
        if (selectedFirms.includes(firmId)) {
            setSelectedFirms(prev => prev.filter(id => id !== firmId));
        } else if (selectedFirms.length < 4) {
            setSelectedFirms(prev => [...prev, firmId]);
        } else {
            alert('Maximum 4 firms can be selected');
        }
    };

    const assignFirms = async () => {
        if (selectedFirms.length < 2) {
            alert('Select at least 2 firms');
            return;
        }

        try {
            // Update enquiry with assigned firms
            await fetch('/api/admin/enquiries', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: enquiry.id,
                    status: 'matched',
                    assignedFirms: selectedFirms
                })
            });

            // Deduct credits from each firm
            for (const firmId of selectedFirms) {
                const firm = firms.find(f => f.id === firmId);
                if (firm) {
                    await fetch('/api/admin/firms', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: firmId,
                            credits: Math.max(0, (firm.credits || 0) - 1)
                        })
                    });
                }
            }

            alert('Firms assigned successfully! Credits deducted.');
            window.location.href = '/admin/enquiries';
        } catch (error) {
            console.error('Error assigning firms:', error);
            alert('Failed to assign firms');
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem' }}>Loading...</div>;
    }

    if (!enquiry) {
        return (
            <div>
                <h1 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Matching Interface</h1>
                <p>Select an enquiry from the <a href="/admin/enquiries">Enquiries page</a> to start matching.</p>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Match Firms to Enquiry</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Left: Enquiry Details */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Enquiry Details</h2>
                    <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.95rem' }}>
                        <div><strong>Name:</strong> {enquiry.name}</div>
                        <div><strong>Property:</strong> {enquiry.property_type}</div>
                        <div><strong>Renovation:</strong> {enquiry.renovation_type}</div>
                        <div><strong>Budget:</strong> {enquiry.budget_range}</div>
                        <div><strong>Timeline:</strong> {enquiry.timeline}</div>
                        <div>
                            <strong>Scope:</strong>
                            <div style={{ marginTop: '0.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                {(enquiry.scope || []).map(s => (
                                    <span key={s} style={{ background: '#f0f0f0', padding: '0.15rem 0.5rem', borderRadius: '10px', fontSize: '0.8rem' }}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Firm Selection */}
                <div>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                        Eligible Firms ({filteredFirms.length})
                        <span style={{ fontSize: '0.85rem', fontWeight: 'normal', marginLeft: '1rem', color: '#666' }}>
                            Selected: {selectedFirms.length}/4
                        </span>
                    </h2>

                    {filteredFirms.length === 0 ? (
                        <div style={{ background: '#fff3cd', padding: '1rem', borderRadius: '4px', color: '#856404' }}>
                            No eligible firms found. Check firm approvals and project type compatibility.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {filteredFirms.map(firm => (
                                <div
                                    key={firm.id}
                                    onClick={() => toggleFirmSelection(firm.id)}
                                    style={{
                                        background: selectedFirms.includes(firm.id) ? '#d4edda' : 'white',
                                        border: selectedFirms.includes(firm.id) ? '2px solid #28a745' : '1px solid #ddd',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong>{firm.company_name}</strong>
                                            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                                                {firm.firm_type} • Credits: {firm.credits || 0}
                                            </div>
                                        </div>
                                        <div style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            border: '2px solid #28a745',
                                            background: selectedFirms.includes(firm.id) ? '#28a745' : 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '0.8rem'
                                        }}>
                                            {selectedFirms.includes(firm.id) && '✓'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button
                    onClick={assignFirms}
                    disabled={selectedFirms.length < 2}
                    className="btn btn-primary"
                    style={{ opacity: selectedFirms.length < 2 ? 0.5 : 1 }}
                >
                    Assign {selectedFirms.length} Firms (Deduct Credits)
                </button>
                <a href="/admin/enquiries" className="btn btn-secondary">
                    Cancel
                </a>
            </div>

            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>
                Note: 1 credit will be deducted from each selected firm.
            </p>
        </div>
    );
}
