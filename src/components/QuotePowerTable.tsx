'use client';

import React, { useState } from 'react';
import { UniversalQuoteLine, getMeasurementLabel, formatQuantityWithUnit } from '@/types/quote';
import { useRoofAuth } from '@/context/RoofAuthContext';
import { Search, Filter, ArrowUpDown, AlertCircle, Clock, User, CheckCircle2 } from 'lucide-react';

interface QuotePowerTableProps {
    items: UniversalQuoteLine[];
    onUpdateItem?: (id: string, updates: Partial<UniversalQuoteLine>) => void;
}

export function QuotePowerTable({ items, onUpdateItem }: QuotePowerTableProps) {
    const { user } = useRoofAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Simple filtering logic
    const filteredItems = items.filter(item => {
        const matchesSearch = item.taskDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.mainCategory.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || item.mainCategory === filterCategory;
        const matchesStatus = filterStatus === 'all' || item.ifcStatus === filterStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const categories = Array.from(new Set(items.map(i => i.mainCategory)));

    return (
        <div className="notion-card p-0 overflow-hidden" style={{ border: '1px solid var(--notion-border)' }}>
            {/* Search & Filter Bar */}
            <div className="flex items-center gap-4 p-3 border-bottom bg-notion-bg-secondary" style={{ borderBottom: '1px solid var(--notion-border)' }}>
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-notion-text-gray" />
                    <input
                        type="text"
                        placeholder="Search tasks or categories..."
                        className="w-full pl-9 pr-4 py-1.5 text-sm bg-white border border-notion-border rounded focus:outline-none focus:ring-1 focus:ring-notion-blue"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <select
                    className="text-sm bg-white border border-notion-border rounded px-2 py-1.5 focus:outline-none"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select
                    className="text-sm bg-white border border-notion-border rounded px-2 py-1.5 focus:outline-none"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">Any Status</option>
                    <option value="IFC_OPEN">IFC Open</option>
                    <option value="IFC_STALLED">Stalled</option>
                    <option value="IFC_RESOLVED">Resolved</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-notion-bg-secondary">
                            <th className="notion-table-header text-left min-w-[300px]">Description</th>
                            <th className="notion-table-header text-left">Category</th>
                            <th className="notion-table-header text-right">Quantity</th>
                            <th className="notion-table-header text-right">Rate</th>
                            <th className="notion-table-header text-right">Total</th>
                            <th className="notion-table-header text-left">Assigned To</th>
                            <th className="notion-table-header text-left">IFC Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map(item => (
                            <tr key={item.id} className="hover:bg-notion-hover group transition-colors">
                                <td className="notion-table-cell font-medium">
                                    {item.taskDescription}
                                </td>
                                <td className="notion-table-cell">
                                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-notion-bg-secondary text-notion-text-gray border border-notion-border">
                                        {item.mainCategory}
                                    </span>
                                </td>
                                <td className="notion-table-cell text-right text-notion-text-gray">
                                    {formatQuantityWithUnit(item.quantity, item.measurementUnit)}
                                </td>
                                <td className="notion-table-cell text-right text-notion-text-gray">
                                    ${item.sellingRate.toLocaleString()}
                                </td>
                                <td className="notion-table-cell text-right font-semibold">
                                    ${item.lineTotal.toLocaleString()}
                                </td>
                                <td className="notion-table-cell">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-notion-hover flex items-center justify-center text-[10px] font-bold">
                                            {item.assignedToTeamMember?.charAt(0) || <User className="w-3 h-3" />}
                                        </div>
                                        <span className="text-[12px]">{item.assignedToTeamMember || 'Unassigned'}</span>
                                    </div>
                                </td>
                                <td className="notion-table-cell">
                                    {item.ifcStatus === 'IFC_OPEN' && (
                                        <div className="flex items-center gap-1.5 text-notion-orange">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-[12px] font-medium">Open</span>
                                        </div>
                                    )}
                                    {item.ifcStatus === 'IFC_STALLED' && (
                                        <div className="flex items-center gap-1.5 text-notion-red">
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="text-[12px] font-medium">Stalled</span>
                                        </div>
                                    )}
                                    {(!item.ifcStatus || item.ifcStatus === 'IFC_RESOLVED') && (
                                        <div className="flex items-center gap-1.5 text-notion-green">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span className="text-[12px] font-medium">Resolved</span>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary Footer */}
            <div className="p-3 bg-notion-bg-secondary flex justify-end items-center gap-6 border-t" style={{ borderTop: '1px solid var(--notion-border)' }}>
                <div className="text-xs text-notion-text-gray">
                    Total Items: <span className="text-notion-text font-semibold">{filteredItems.length}</span>
                </div>
                <div className="text-sm font-bold">
                    Total Amount: <span className="text-notion-blue">
                        ${filteredItems.reduce((sum, item) => sum + item.lineTotal, 0).toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
}
