'use client';

import React from 'react';
import { BarChart, LineChart, DonutChart, Gauge, Sparkline } from '../ui/Charts';

// ============================================================
// SAMPLE DATA FOR CHARTS
// ============================================================

const DAILY_SALES_DATA = Array.from({ length: 30 }, (_, i) => ({
    label: `${i + 1} Jan`,
    value: Math.floor(Math.random() * (12000 - 5000) + 5000)
}));

const WEEKLY_SALES_DATA = Array.from({ length: 12 }, (_, i) => ({
    label: `W${i + 1}`,
    value: Math.floor(Math.random() * (60000 - 30000) + 30000)
}));

const MONTHLY_SALES_DATA = [
    { label: 'Aug', value: 185000 },
    { label: 'Sep', value: 210000 },
    { label: 'Oct', value: 178000 },
    { label: 'Nov', value: 245000 },
    { label: 'Dec', value: 198000 },
    { label: 'Jan', value: 267000 },
];

const QUARTERLY_SALES_DATA = [
    { label: 'Q1 24', value: 520000 },
    { label: 'Q2 24', value: 580000 },
    { label: 'Q3 24', value: 610000 },
    { label: 'Q4 24', value: 750000 },
    { label: 'Q1 25', value: 680000 },
    { label: 'Q2 25', value: 720000 },
];

const YEARLY_SALES_DATA = [
    { label: '2021', value: 1200000 },
    { label: '2022', value: 1800000 },
    { label: '2023', value: 2400000 },
    { label: '2024', value: 3100000 },
    { label: '2025', value: 3800000 },
];

const QUOTE_STATUS_DATA = [
    { label: 'Won', value: 24, color: '#10B981' },
    { label: 'Pending', value: 18, color: '#F59E0B' },
    { label: 'Lost', value: 8, color: '#EF4444' },
];

const MARKET_BREAKDOWN_DATA = [
    { label: 'SG', value: 820000, color: '#3B82F6' },
    { label: 'MY', value: 420000, color: '#8B5CF6' },
];

const TRADE_MARGIN_DATA = [
    { label: 'Carpentry', value: 32 },
    { label: 'Electrical', value: 28 },
    { label: 'Plumbing', value: 25 },
    { label: 'Painting', value: 35 },
    { label: 'Flooring', value: 30 },
    { label: 'Ceiling', value: 27 },
];

const SPARKLINE_DATA = {
    revenue: [180, 195, 185, 210, 225, 245, 238, 267],
    margin: [28, 29, 27, 30, 32, 31, 33, 32],
    conversion: [60, 58, 65, 62, 68, 70, 72, 68],
};

// ============================================================
// COMPONENT
// ============================================================

type TimeRange = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';

export default function PerformanceCharts() {
    const [timeRange, setTimeRange] = React.useState<TimeRange>('Monthly');

    const chartData = React.useMemo(() => {
        switch (timeRange) {
            case 'Daily': return DAILY_SALES_DATA;
            case 'Weekly': return WEEKLY_SALES_DATA;
            case 'Monthly': return MONTHLY_SALES_DATA;
            case 'Quarterly': return QUARTERLY_SALES_DATA;
            case 'Yearly': return YEARLY_SALES_DATA;
            default: return MONTHLY_SALES_DATA;
        }
    }, [timeRange]);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                📊 Performance Analytics
            </h2>

            {/* TOP ROW: Key Metrics with Sparklines */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-blue-600 font-medium uppercase">Revenue (6M)</p>
                            <p className="text-2xl font-bold text-blue-900">$1.28M</p>
                            <p className="text-xs text-green-600 mt-1">↑ 18% vs last period</p>
                        </div>
                        <Sparkline data={SPARKLINE_DATA.revenue} color="#3B82F6" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-green-600 font-medium uppercase">Avg Margin</p>
                            <p className="text-2xl font-bold text-green-900">32.4%</p>
                            <p className="text-xs text-green-600 mt-1">↑ 2.1% vs target</p>
                        </div>
                        <Sparkline data={SPARKLINE_DATA.margin} color="#10B981" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-amber-600 font-medium uppercase">Conversion</p>
                            <p className="text-2xl font-bold text-amber-900">68%</p>
                            <p className="text-xs text-green-600 mt-1">↑ 5% vs last month</p>
                        </div>
                        <Sparkline data={SPARKLINE_DATA.conversion} color="#F59E0B" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-purple-600 font-medium uppercase">Active Projects</p>
                            <p className="text-2xl font-bold text-purple-900">42</p>
                            <p className="text-xs text-gray-500 mt-1">12 SG • 30 MY</p>
                        </div>
                        <div className="text-3xl">📋</div>
                    </div>
                </div>
            </div>

            {/* MIDDLE ROW: Charts (Aligned to 4-col grid) */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                {/* Monthly Sales Trend - Spans 3 columns */}
                <div className="col-span-3 bg-gray-50 rounded-xl p-4 relative">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-gray-700">Sales Trend</h3>
                        <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                            {(['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'] as TimeRange[]).map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeRange === range
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>
                    <LineChart
                        data={chartData.map(d => d.value)}
                        labels={chartData.map(d => d.label)}
                        height={220}
                        color="#3B82F6"
                    />
                </div>

                {/* Quote Status Donut - Spans 1 column */}
                <div className="col-span-1 bg-gray-50 rounded-xl p-4">
                    <DonutChart
                        data={QUOTE_STATUS_DATA}
                        title="Quote Status"
                        size={100}
                    />
                </div>
            </div>

            {/* BOTTOM ROW: More Charts (Aligned to 4-col grid) */}
            <div className="grid grid-cols-4 gap-6">
                {/* Trade Margin Performance - Spans 2 columns */}
                <div className="col-span-2 bg-gray-50 rounded-xl p-4">
                    <BarChart
                        data={TRADE_MARGIN_DATA}
                        title="Margin by Trade (%)"
                        height={160}
                        valueSuffix="%"
                    />
                </div>

                {/* Market Breakdown - Spans 1 column */}
                <div className="col-span-1 bg-gray-50 rounded-xl p-4">
                    <DonutChart
                        data={MARKET_BREAKDOWN_DATA}
                        title="Revenue by Market"
                        size={100}
                    />
                </div>

                {/* Target Gauges - Spans 1 column */}
                <div className="col-span-1 bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-gray-700 mb-4">Target Progress</h3>
                    <div className="flex flex-col items-center gap-4">
                        <Gauge
                            value={85}
                            max={100}
                            label="Q1 Revenue"
                            color="#3B82F6"
                            size={80}
                        />
                        <Gauge
                            value={72}
                            max={100}
                            label="Margin Target"
                            color="#10B981"
                            size={80}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
