"use client";
import React from 'react';
import VendorDashboard, { EngagementType } from '@/components/dashboards/VendorDashboard';

export default function VendorPage() {
    return (
        <VendorDashboard
            vendorName="Ah Huat Tiling Services"
            engagementType="LABOUR_ONLY" // Change to 'FABRICATE_AND_INSTALL' to test variation
            workers={[
                { id: 'W01', name: 'Ah Beng', status: 'ONSITE', assignedProject: 'Hougang #12-04' },
                { id: 'W02', name: 'Kumar', status: 'ONSITE', assignedProject: 'Hougang #12-04' },
                { id: 'W03', name: 'John', status: 'LEAVE' },
            ]}
            logs={[
                { id: 'L1', type: 'INSTRUCTION', message: 'Use waterproof screed for Master Toilet.', timestamp: '09:00 AM', isRead: false },
                { id: 'L2', type: 'MISTAKE', message: 'Tiles in Kitchen misaligned (>2mm gap).', timestamp: '10:30 AM', isRead: false, actionRequired: true },
            ]}
            fabricationProgress={0}
        />
    );
}
