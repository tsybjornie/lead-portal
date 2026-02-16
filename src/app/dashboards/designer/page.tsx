"use client";
import React from 'react';
import DesignerCommandCenter from '@/components/dashboards/DesignerCommandCenter';

export default function DesignerPage() {
    // Mock Data for Visualization
    const mockJobs = [
        {
            id: 'JOB-001',
            name: "Project Alpha - Tiling",
            type: 'LABOUR_ONLY' as const,
            status: 'DISPATCHING' as const,
            dispatchStage: 'COLD_POOL' as const,
            specSheetUrl: '#',
            location: { lat: 1.3521, lng: 103.8198 }
        },
        {
            id: 'JOB-002',
            name: "Project Beta - Carpentry",
            type: 'FABRICATE_INSTALL' as const,
            status: 'NO_SHOW' as const,
            dispatchStage: 'HOT_BACKUP' as const,
            sifuName: 'Ah Beng Carpentry', // Was assigned, but no show
            location: { lat: 1.3621, lng: 103.8298 }
        },
        {
            id: 'JOB-003',
            name: "Project Gamma - Electrical",
            type: 'LABOUR_ONLY' as const,
            status: 'ARRIVED' as const,
            sifuName: 'Sifu Kumar',
            location: { lat: 1.3421, lng: 103.8098 }
        }
    ];

    const mockSifuPool = [
        { id: 'S1', name: 'Ah Huat', role: 'SIFU' as const, avatarUrl: 'https://ui-avatars.com/api/?name=Ah+Huat', status: 'READY' as const },
        { id: 'S2', name: 'Sifu Ali', role: 'SIFU' as const, avatarUrl: 'https://ui-avatars.com/api/?name=Ali', status: 'BUSY' as const },
        { id: 'F1', name: 'Hup Kiong Wood', role: 'FABRICATOR' as const, avatarUrl: 'https://ui-avatars.com/api/?name=Hup+Kiong&square=true', status: 'READY' as const },
        { id: 'F2', name: 'Lite Metal Works', role: 'FABRICATOR' as const, avatarUrl: 'https://ui-avatars.com/api/?name=Lite+Metal&square=true', status: 'OFFLINE' as const },
    ];

    const mockFinancials = {
        cost: 15400,
        price: 22000,
        margin: 6600
    };

    return (
        <DesignerCommandCenter
            activeJobsCount={3}
            sifusOnlineCount={12}
            jobs={mockJobs}
            sifuPool={mockSifuPool}
            financials={mockFinancials}
        />
    );
}
