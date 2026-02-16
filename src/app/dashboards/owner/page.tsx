"use client";
import React from 'react';
import OwnerDashboard, { JobStage, Photo } from '@/components/dashboards/OwnerDashboard';

export default function OwnerPage() {
    const mockStages: JobStage[] = [
        { id: '1', name: 'Hacking & Demolition', status: 'COMPLETED', date: 'Jan 10' },
        { id: '2', name: 'Tiling & Wet Works', status: 'COMPLETED', date: 'Jan 24' },
        { id: '3', name: 'Carpentry Fabrication', status: 'ACTIVE' },
        { id: '4', name: 'Installation', status: 'PENDING' },
        { id: '5', name: 'Final Chemical Wash', status: 'PENDING' },
    ];

    const mockPhotos: Photo[] = [
        { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400', caption: 'Kitchen View', timestamp: 'Today 10:00 AM' },
        { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400', caption: 'Living Room', timestamp: 'Yesterday 4:30 PM' },
    ];

    return (
        <OwnerDashboard
            ownerName="Ms. Tina"
            projectProgress={65}
            currentStatus="Carpentry Fabrication"
            currentStatusDescription="Specific measurements confirmed. Fabrication underway at workshop."
            stages={mockStages}
            recentPhotos={mockPhotos}
            aiWorkmanshipScore={92}
        />
    );
}
