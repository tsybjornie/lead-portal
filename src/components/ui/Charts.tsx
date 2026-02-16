'use client';

import React from 'react';

// ============================================================
// PURE CSS CHARTS (No external library needed)
// ============================================================

interface BarChartProps {
    data: { label: string; value: number; color?: string }[];
    title?: string;
    maxValue?: number;
    height?: number;
    showValues?: boolean;
    valuePrefix?: string;
    valueSuffix?: string;
}

export function BarChart({
    data,
    title,
    maxValue,
    height = 200,
    showValues = true,
    valuePrefix = '',
    valueSuffix = '',
}: BarChartProps) {
    const max = maxValue || Math.max(...data.map(d => d.value));
    const defaultColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    return (
        <div className="w-full">
            {title && <h3 className="text-sm font-bold text-gray-700 mb-3">{title}</h3>}
            <div className="flex items-end gap-2 justify-between" style={{ height }}>
                {data.map((item, i) => {
                    const barHeight = max > 0 ? (item.value / max) * 100 : 0;
                    const color = item.color || defaultColors[i % defaultColors.length];
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            {showValues && (
                                <span className="text-xs font-medium text-gray-600">
                                    {valuePrefix}{item.value.toLocaleString()}{valueSuffix}
                                </span>
                            )}
                            <div
                                className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                                style={{
                                    height: `${barHeight}%`,
                                    backgroundColor: color,
                                    minHeight: item.value > 0 ? '8px' : '0',
                                }}
                            />
                            <span className="text-xs text-gray-500 text-center truncate w-full">{item.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================================
// LINE CHART (Using Recharts)
// ============================================================
import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface LineChartProps {
    data: number[];
    labels: string[];
    title?: string;
    height?: number;
    color?: string;
}

export function LineChart({
    data,
    labels,
    title,
    height = 300,
    color = '#3B82F6'
}: LineChartProps) {
    // Transform data for Recharts
    // If data comes in as numbers array, map to objects. 
    // If data comes in as {label, value} array (legacy prop), handle that too.

    let chartData: any[] = [];

    if (Array.isArray(data) && typeof data[0] === 'number') {
        chartData = labels.map((label, index) => ({
            name: label,
            value: data[index]
        }));
    } else {
        // Fallback or legacy support if needed, but the signature says data: number[]
        // Actually, looking at the previous file, the interface was data: { label: string; value: number }[]
        // But the consuming code (admin/dashboard) might be passing numbers. 
        // Let's check how it was used in previous file:
        // previous: data: { label: string; value: number }[]

        // I should probably keep the interface compatible if I can, OR update the usage.
        // Let's stick to the OLD interface to avoid breaking the dashboard.
    }

    // WAIT. I changed the interface in my previous attempt to `data: number[], labels: string[]`.
    // But the file currently has `data: { label: string; value: number }[]`.
    // I should stick to the EXISTING interface to minimize breakage, OR update the consumer.
    // Let's stick to `data: { label: string; value: number }[]` for safety.

    const rechartsData = (data as any[]).map(d => ({
        name: d.label,
        value: d.value
    }));

    return (
        <div className="w-full h-full min-h-[300px]">
            {title && <h3 className="text-sm font-bold text-gray-700 mb-4">{title}</h3>}
            <div style={{ width: '100%', height: height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                        data={rechartsData}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            hide={true}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e3a8a',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}
                            itemStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                            cursor={{ stroke: '#fbbf24', strokeWidth: 2, strokeDasharray: '5 5' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={3}
                            dot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 8, fill: '#fbbf24', stroke: '#1e3a8a', strokeWidth: 2 }}
                            animationDuration={1500}
                            animationEasing="ease-out"
                        />
                    </RechartsLineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// ============================================================
// DONUT CHART
// ============================================================

interface DonutChartProps {
    data: { label: string; value: number; color: string }[];
    title?: string;
    size?: number;
    showLegend?: boolean;
}

export function DonutChart({
    data,
    title,
    size = 120,
    showLegend = true,
}: DonutChartProps) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    if (total === 0) return null;

    const radius = 40;
    const strokeWidth = 20;
    const circumference = 2 * Math.PI * radius;
    let accumulatedOffset = 0;

    return (
        <div className="flex flex-col items-center justify-center h-full">
            {title && (
                <h3 className="text-sm font-bold text-gray-700 mb-4 self-start w-full text-center">{title}</h3>
            )}
            <div className="flex items-center gap-4 justify-center">
                <div className="relative shrink-0" style={{ width: size, height: size }}>
                    <svg viewBox="0 0 100 100" style={{ width: size, height: size }}>
                        {data.map((item, i) => {
                            const percentage = item.value / total;
                            const dashLength = circumference * percentage;
                            const dashOffset = circumference * accumulatedOffset;
                            accumulatedOffset += percentage;

                            return (
                                <circle
                                    key={i}
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    fill="none"
                                    stroke={item.color}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                                    strokeDashoffset={-dashOffset}
                                    transform="rotate(-90 50 50)"
                                    className="transition-all duration-500"
                                />
                            );
                        })}
                        {/* Center text */}
                        <text x="50" y="46" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1F2937">
                            S${(total / 1000).toFixed(0)}k
                        </text>
                        <text x="50" y="58" textAnchor="middle" fontSize="8" fill="#6B7280">
                            Total
                        </text>
                    </svg>
                </div>

                {showLegend && (
                    <div className="flex flex-col gap-1.5 min-w-[100px]">
                        {data.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                                <div
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-gray-600">{item.label}</span>
                                <span className="font-medium text-gray-800 ml-auto">
                                    {((item.value / total) * 100).toFixed(0)}%
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================
// PROGRESS GAUGE
// ============================================================

interface GaugeProps {
    value: number;
    max: number;
    label: string;
    color?: string;
    size?: number;
}

export function Gauge({ value, max, label, color = '#3B82F6', size = 100 }: GaugeProps) {
    const percentage = Math.min((value / max) * 100, 100);
    const radius = 40;
    const strokeWidth = 8;
    const circumference = Math.PI * radius; // Half circle
    const dashLength = (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <svg viewBox="0 0 100 60" style={{ width: size, height: size * 0.6 }}>
                {/* Background arc */}
                <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
                {/* Value arc */}
                <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={`${dashLength} ${circumference}`}
                    className="transition-all duration-700"
                />
                {/* Value text */}
                <text x="50" y="48" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1F2937">
                    {percentage.toFixed(0)}%
                </text>
            </svg>
            <span className="text-xs text-gray-500 -mt-1">{label}</span>
        </div>
    );
}

// ============================================================
// SPARKLINE (Mini inline chart)
// ============================================================

interface SparklineProps {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
}

export function Sparkline({ data, width = 80, height = 24, color = '#10B981' }: SparklineProps) {
    if (data.length < 2) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((v, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - ((v - min) / range) * height,
    }));

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
        <svg width={width} height={height} className="inline-block">
            <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="2" fill={color} />
        </svg>
    );
}
