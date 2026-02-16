'use client';

import React, { useState } from 'react';
import {
    CustomerReview,
    VendorWorkmanshipReview,
    DefectReport,
    getGradeColor,
    getSeverityColor,
    getStatusColor,
    getRatingStars,
} from '@/types/reviews';

// ============================================================
// SAMPLE DATA
// ============================================================

const SAMPLE_CUSTOMER_REVIEWS: CustomerReview[] = [
    {
        id: 'REV-001',
        projectId: 'PRJ-2024-042',
        projectName: 'Marina Bay Residence',
        clientId: 'C001',
        clientName: 'Mr. & Mrs. Tan',
        designerId: 'D001',
        designerName: 'Sarah Chen',
        overallRating: 5,
        designRating: 5,
        workmanshipRating: 4,
        communicationRating: 5,
        timelinessRating: 4,
        valueRating: 4,
        testimonial: 'Exceeded our expectations! Sarah was patient with our many revisions and the final result is stunning.',
        wouldRecommend: true,
        submittedAt: '2024-01-25',
        isPublic: true,
        followUpRequired: false,
    },
    {
        id: 'REV-002',
        projectId: 'PRJ-2024-038',
        projectName: 'Bishan HDB 5-Room',
        clientId: 'C002',
        clientName: 'Jason Lim',
        designerId: 'D002',
        designerName: 'Mike Tan',
        overallRating: 3,
        designRating: 4,
        workmanshipRating: 2,
        communicationRating: 3,
        timelinessRating: 2,
        valueRating: 3,
        testimonial: 'Design was good but there were delays and quality issues with the carpentry that required multiple fixes.',
        wouldRecommend: false,
        submittedAt: '2024-01-20',
        isPublic: false,
        followUpRequired: true,
    },
];

const SAMPLE_DEFECTS: DefectReport[] = [
    {
        id: 'DEF-001',
        vendorId: 'V003',
        vendorName: 'Premium Carpentry Pte Ltd',
        projectId: 'PRJ-2024-038',
        projectName: 'Bishan HDB 5-Room',
        category: 'alignment',
        description: 'Kitchen cabinet doors not aligned, 5mm gap visible',
        location: 'Kitchen - Upper Cabinets',
        severity: 'moderate',
        photos: [],
        discoveredAt: '2024-01-18',
        discoveredBy: 'Mike Tan',
        status: 'in_progress',
        assignedTo: 'Vendor Tech Team',
        estimatedResolutionDate: '2024-01-30',
        chargedToVendor: true,
        delayedProject: true,
        delayDays: 3,
    },
    {
        id: 'DEF-002',
        vendorId: 'V005',
        vendorName: 'Elite Painters',
        projectId: 'PRJ-2024-042',
        projectName: 'Marina Bay Residence',
        category: 'finish',
        description: 'Paint drips on master bedroom feature wall',
        location: 'Master Bedroom',
        severity: 'minor',
        photos: [],
        discoveredAt: '2024-01-22',
        discoveredBy: 'Sarah Chen',
        status: 'resolved',
        resolvedAt: '2024-01-23',
        resolutionNotes: 'Vendor touched up same day',
        chargedToVendor: false,
        delayedProject: false,
    },
];

// ============================================================
// LEADS DATA
// ============================================================

interface Lead {
    id: string;
    name: string;
    phone: string;
    email?: string;
    source: 'website' | 'referral' | 'social' | 'walk_in' | 'exhibition';
    propertyType: string;
    estimatedBudget?: string;
    status: 'new' | 'contacted' | 'assigned' | 'quoted' | 'won' | 'lost';
    assignedTo?: string;
    notes?: string;
    createdAt: string;
    jurisdiction: 'SG' | 'MY';
}

const SAMPLE_LEADS: Lead[] = [
    {
        id: 'LEAD-001',
        name: 'Michelle Wong',
        phone: '+65 9123 4567',
        email: 'michelle.w@email.com',
        source: 'website',
        propertyType: 'Condo 3BR',
        estimatedBudget: '$80,000 - $120,000',
        status: 'new',
        notes: 'Interested in Scandinavian style, moving in Q2',
        createdAt: '2024-01-28',
        jurisdiction: 'SG',
    },
    {
        id: 'LEAD-002',
        name: 'David & Sarah Ng',
        phone: '+65 8234 5678',
        source: 'referral',
        propertyType: 'HDB 5-Room',
        estimatedBudget: '$50,000 - $70,000',
        status: 'new',
        notes: 'Referred by Jason Lim (previous client)',
        createdAt: '2024-01-27',
        jurisdiction: 'SG',
    },
    {
        id: 'LEAD-003',
        name: 'Ahmad Razak',
        phone: '+60 12 345 6789',
        email: 'ahmad.r@email.com',
        source: 'exhibition',
        propertyType: 'Terrace House',
        estimatedBudget: 'RM 150,000 - RM 200,000',
        status: 'contacted',
        assignedTo: 'Jenny Lim',
        createdAt: '2024-01-26',
        jurisdiction: 'MY',
    },
];

const TEAM_MEMBERS = [
    { id: 'D001', name: 'Sarah Chen', activeProjects: 3 },
    { id: 'D002', name: 'Mike Tan', activeProjects: 2 },
    { id: 'D003', name: 'Jenny Lim', activeProjects: 4 },
    { id: 'D004', name: 'Ahmad Hassan', activeProjects: 1 },
    { id: 'D005', name: 'Lisa Wong', activeProjects: 2 },
];

// ============================================================
// COMPONENT
// ============================================================

export default function ReviewsAndLeadsPanel() {
    const [activeTab, setActiveTab] = useState<'leads' | 'reviews' | 'defects'>('leads');
    const [assignModalOpen, setAssignModalOpen] = useState<string | null>(null);

    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-SG', {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    const getSourceBadge = (source: Lead['source']) => {
        const colors: Record<Lead['source'], string> = {
            website: 'bg-blue-100 text-blue-700',
            referral: 'bg-green-100 text-green-700',
            social: 'bg-purple-100 text-purple-700',
            walk_in: 'bg-amber-100 text-amber-700',
            exhibition: 'bg-pink-100 text-pink-700',
        };
        return colors[source] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header with Tabs */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('leads')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'leads' ? 'bg-navy-900 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}
                    >
                        New Leads <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-red-500 text-white">2</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'reviews' ? 'bg-navy-900 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}
                    >
                        Customer Reviews
                    </button>
                    <button
                        onClick={() => setActiveTab('defects')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'defects' ? 'bg-navy-900 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}
                    >
                        Defects <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-500 text-white">1</span>
                    </button>
                </div>

                {/* CONNECT SOURCE BUTTON */}
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Auto-ingest from:</span>
                    <div className="flex gap-1">
                        <button className="w-8 h-8 rounded bg-green-100 flex items-center justify-center text-green-700 hover:bg-green-200" title="WhatsApp Connected">
                            W
                        </button>
                        <button className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-700 hover:bg-blue-200" title="Email Connected">
                            @
                        </button>
                        <button className="w-8 h-8 rounded bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600" title="Add Source">
                            +
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* LEADS TAB */}
                {activeTab === 'leads' && (
                    <div className="space-y-4">
                        {SAMPLE_LEADS.filter(l => l.status === 'new' || l.status === 'contacted').map(lead => (
                            <div key={lead.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg">{lead.jurisdiction === 'SG' ? '🇸🇬' : '🇲🇾'}</span>
                                            <h3 className="font-bold text-gray-900">{lead.name}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${getSourceBadge(lead.source)}`}>
                                                {lead.source.replace('_', ' ')}
                                            </span>
                                            {lead.status === 'new' && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">NEW</span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-0.5">
                                            <p><span className="text-gray-400">📞</span> {lead.phone} {lead.email && `• ${lead.email}`}</p>
                                            <p><span className="text-gray-400">🏠</span> {lead.propertyType} {lead.estimatedBudget && `• ${lead.estimatedBudget}`}</p>
                                            {lead.notes && <p className="text-gray-500 italic">"{lead.notes}"</p>}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">Received: {formatDate(lead.createdAt)}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {lead.assignedTo ? (
                                            <span className="text-xs text-green-600 font-medium">Assigned: {lead.assignedTo}</span>
                                        ) : (
                                            <div className="relative">
                                                <button
                                                    onClick={() => setAssignModalOpen(assignModalOpen === lead.id ? null : lead.id)}
                                                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700"
                                                >
                                                    ASSIGN →
                                                </button>
                                                {assignModalOpen === lead.id && (
                                                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-2 w-48">
                                                        {TEAM_MEMBERS.map(member => (
                                                            <button
                                                                key={member.id}
                                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex justify-between"
                                                                onClick={() => setAssignModalOpen(null)}
                                                            >
                                                                <span>{member.name}</span>
                                                                <span className="text-gray-400">{member.activeProjects} active</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* REVIEWS TAB */}
                {activeTab === 'reviews' && (
                    <div className="space-y-4">
                        {SAMPLE_CUSTOMER_REVIEWS.map(review => (
                            <div
                                key={review.id}
                                className={`p-4 border rounded-lg ${review.followUpRequired ? 'border-red-200 bg-red-50/50' : 'border-gray-200'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{review.clientName}</h3>
                                        <p className="text-sm text-gray-500">{review.projectName} • Designer: {review.designerName}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl text-amber-500">{getRatingStars(review.overallRating)}</div>
                                        <p className="text-xs text-gray-400">{formatDate(review.submittedAt)}</p>
                                    </div>
                                </div>
                                {review.testimonial && (
                                    <p className="text-sm text-gray-600 italic mb-3">"{review.testimonial}"</p>
                                )}
                                <div className="flex gap-4 text-xs text-gray-500">
                                    <span>Design: {review.designRating}★</span>
                                    <span>Workmanship: {review.workmanshipRating}★</span>
                                    <span>Communication: {review.communicationRating}★</span>
                                    <span>Timeliness: {review.timelinessRating}★</span>
                                </div>
                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                                    <div className="flex gap-2">
                                        {review.wouldRecommend ? (
                                            <span className="text-xs text-green-600">✓ Would recommend</span>
                                        ) : (
                                            <span className="text-xs text-red-500">✗ Would not recommend</span>
                                        )}
                                        {review.followUpRequired && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">Follow-up Required</span>
                                        )}
                                    </div>
                                    {review.isPublic && (
                                        <span className="text-xs text-blue-600">📢 Public testimonial</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* DEFECTS TAB */}
                {activeTab === 'defects' && (
                    <div className="space-y-4">
                        {SAMPLE_DEFECTS.map(defect => (
                            <div key={defect.id} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-gray-900">{defect.description}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(defect.severity)}`}>
                                                {defect.severity}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(defect.status)}`}>
                                                {defect.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {defect.projectName} • {defect.location}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Vendor: <span className="font-medium">{defect.vendorName}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 text-xs text-gray-500 mt-3">
                                    <span>Discovered: {formatDate(defect.discoveredAt)}</span>
                                    {defect.assignedTo && <span>Assigned: {defect.assignedTo}</span>}
                                    {defect.delayedProject && (
                                        <span className="text-red-500">⚠️ Delayed project by {defect.delayDays} days</span>
                                    )}
                                    {defect.chargedToVendor && (
                                        <span className="text-amber-600">💰 Charged to vendor</span>
                                    )}
                                </div>
                                {defect.status === 'resolved' && defect.resolutionNotes && (
                                    <p className="text-xs text-green-600 mt-2">✓ {defect.resolutionNotes}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
