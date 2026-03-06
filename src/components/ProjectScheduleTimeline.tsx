'use client';

import { useState, useMemo } from 'react';
import {
    ProjectSchedule, ScheduleTask, TaskStatus,
    TRADE_DEPENDENCIES, CURING_REQUIREMENTS,
    canTaskStart, generateScheduleChangeNotifications
} from '@/types/project-schedule';
import { TradeCategory, TRADE_PROFILES } from '@/types/trades';
import {
    PaymentSchedule, PaymentMilestone,
    HDB_MILESTONE_TEMPLATE, generatePaymentSchedule, canUnlockMilestone, getPaymentSummary
} from '@/types/payment-milestones';

// ============================================================
// SAMPLE DATA
// ============================================================

const SAMPLE_TASKS: ScheduleTask[] = [
    {
        id: 'task_1', projectId: 'proj_001', trade: 'preliminaries', title: 'Site Protection & Setup',
        vendorName: 'Ah Seng Services', vendorPhone: '+6591234567',
        scheduledStart: '2026-03-10', scheduledEnd: '2026-03-11',
        actualStart: '2026-03-10', actualEnd: '2026-03-11',
        status: 'completed', dependsOn: [], blocks: ['task_2'],
        notificationsSent: [],
    },
    {
        id: 'task_2', projectId: 'proj_001', trade: 'demolition', title: 'Hacking & Disposal',
        vendorName: 'KS Demolition', vendorPhone: '+6598765432',
        scheduledStart: '2026-03-12', scheduledEnd: '2026-03-15',
        actualStart: '2026-03-12', actualEnd: '2026-03-15',
        status: 'completed', dependsOn: ['task_1'], blocks: ['task_3', 'task_4', 'task_5'],
        notificationsSent: [],
    },
    {
        id: 'task_3', projectId: 'proj_001', trade: 'masonry', title: 'Brickwork & Plastering',
        vendorName: 'Lim Builders', vendorPhone: '+6587654321',
        scheduledStart: '2026-03-16', scheduledEnd: '2026-03-22',
        status: 'in_progress', dependsOn: ['task_2'], blocks: ['task_6'],
        curingUntil: '2026-03-25T08:00:00Z', curingDescription: '3 days cure before painting',
        notificationsSent: [],
    },
    {
        id: 'task_4', projectId: 'proj_001', trade: 'plumbing', title: 'Piping & Sanitary Rough-in',
        vendorName: 'Tan Plumbing', vendorPhone: '+6576543210',
        scheduledStart: '2026-03-16', scheduledEnd: '2026-03-19',
        status: 'in_progress', dependsOn: ['task_2'], blocks: ['task_7'],
        notificationsSent: [],
    },
    {
        id: 'task_5', projectId: 'proj_001', trade: 'electrical', title: 'Wiring & Points',
        vendorName: 'Sparks SG', vendorPhone: '+6565432100',
        scheduledStart: '2026-03-16', scheduledEnd: '2026-03-20',
        status: 'scheduled', dependsOn: ['task_2'], blocks: ['task_7'],
        notificationsSent: [],
    },
    {
        id: 'task_6', projectId: 'proj_001', trade: 'waterproofing', title: 'Bathroom Waterproofing',
        vendorName: 'Lim Builders', vendorPhone: '+6587654321',
        scheduledStart: '2026-03-23', scheduledEnd: '2026-03-25',
        status: 'scheduled', dependsOn: ['task_3'], blocks: ['task_8'],
        notificationsSent: [],
    },
    {
        id: 'task_7', projectId: 'proj_001', trade: 'ceiling', title: 'Gypsum Ceiling',
        vendorName: 'CC Ceiling', vendorPhone: '+6554321000',
        scheduledStart: '2026-03-21', scheduledEnd: '2026-03-24',
        status: 'scheduled', dependsOn: ['task_4', 'task_5'], blocks: ['task_10'],
        notificationsSent: [],
    },
    {
        id: 'task_8', projectId: 'proj_001', trade: 'flooring', title: 'Tiling & Vinyl',
        vendorName: 'Ace Flooring', vendorPhone: '+6543210000',
        scheduledStart: '2026-03-27', scheduledEnd: '2026-04-01',
        status: 'scheduled', dependsOn: ['task_6'], blocks: ['task_9'],
        notificationsSent: [],
    },
    {
        id: 'task_9', projectId: 'proj_001', trade: 'carpentry', title: 'Carpentry Installation',
        vendorName: 'Ah Huat Carpentry', vendorPhone: '+6532100001',
        scheduledStart: '2026-04-02', scheduledEnd: '2026-04-12',
        status: 'scheduled', dependsOn: ['task_8', 'task_7'], blocks: ['task_10'],
        notificationsSent: [],
    },
    {
        id: 'task_10', projectId: 'proj_001', trade: 'painting', title: 'Painting & Touch-up',
        vendorName: 'Pro Coat SG', vendorPhone: '+6521000002',
        scheduledStart: '2026-04-13', scheduledEnd: '2026-04-17',
        status: 'scheduled', dependsOn: ['task_9'], blocks: ['task_11'],
        notificationsSent: [],
    },
    {
        id: 'task_11', projectId: 'proj_001', trade: 'cleaning', title: 'Final Cleaning & Handover',
        vendorName: 'Sparkle Clean', vendorPhone: '+6510000003',
        scheduledStart: '2026-04-18', scheduledEnd: '2026-04-19',
        status: 'scheduled', dependsOn: ['task_10'], blocks: [],
        notificationsSent: [],
    },
];

// ============================================================
// COLOUR MAP
// ============================================================

const TRADE_COLORS: Partial<Record<TradeCategory, string>> = {
    preliminaries: '#6B7280',
    demolition: '#EF4444',
    masonry: '#F59E0B',
    plumbing: '#3B82F6',
    electrical: '#8B5CF6',
    waterproofing: '#06B6D4',
    ceiling: '#EC4899',
    flooring: '#10B981',
    carpentry: '#D97706',
    metalworks: '#64748B',
    glassworks: '#0EA5E9',
    painting: '#A855F7',
    cleaning: '#22C55E',
    aircon: '#14B8A6',
};

const STATUS_STYLES: Record<TaskStatus, { bg: string; text: string; label: string }> = {
    scheduled: { bg: '#F1F5F9', text: '#64748B', label: 'Scheduled' },
    in_progress: { bg: '#DBEAFE', text: '#1D4ED8', label: 'In Progress' },
    curing: { bg: '#FEF3C7', text: '#D97706', label: 'Curing' },
    completed: { bg: '#D1FAE5', text: '#059669', label: 'Completed' },
    delayed: { bg: '#FEE2E2', text: '#DC2626', label: 'Delayed' },
    blocked: { bg: '#FCE7F3', text: '#BE185D', label: 'Blocked' },
};

// ============================================================
// COMPONENT
// ============================================================

export default function ProjectScheduleTimeline() {
    const [tasks, setTasks] = useState<ScheduleTask[]>(SAMPLE_TASKS);
    const [selectedTask, setSelectedTask] = useState<string | null>(null);
    const [showPayments, setShowPayments] = useState(true);

    // Payment schedule
    const paymentSchedule = useMemo(() =>
        generatePaymentSchedule('proj_001', 'David Lim', 75000, 'SGD', HDB_MILESTONE_TEMPLATE),
        []
    );
    const paymentSummary = getPaymentSummary(paymentSchedule);

    // Timeline calculations
    const timelineData = useMemo(() => {
        const allDates = tasks.flatMap(t => [new Date(t.scheduledStart), new Date(t.scheduledEnd)]);
        const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
        // Add padding
        minDate.setDate(minDate.getDate() - 2);
        maxDate.setDate(maxDate.getDate() + 3);
        const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
        return { minDate, maxDate, totalDays };
    }, [tasks]);

    const getBarPosition = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const left = ((startDate.getTime() - timelineData.minDate.getTime()) / (1000 * 60 * 60 * 24)) / timelineData.totalDays * 100;
        const width = ((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) / timelineData.totalDays * 100;
        return { left: `${Math.max(0, left)}%`, width: `${Math.max(2, width)}%` };
    };

    // Generate week markers
    const weekMarkers = useMemo(() => {
        const markers: { date: Date; label: string; position: number }[] = [];
        const current = new Date(timelineData.minDate);
        while (current <= timelineData.maxDate) {
            const pos = ((current.getTime() - timelineData.minDate.getTime()) / (1000 * 60 * 60 * 24)) / timelineData.totalDays * 100;
            markers.push({ date: new Date(current), label: current.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' }), position: pos });
            current.setDate(current.getDate() + 7);
        }
        return markers;
    }, [timelineData]);

    // Today marker
    const todayPos = useMemo(() => {
        const today = new Date('2026-03-18'); // Simulated
        const pos = ((today.getTime() - timelineData.minDate.getTime()) / (1000 * 60 * 60 * 24)) / timelineData.totalDays * 100;
        return `${Math.max(0, Math.min(100, pos))}%`;
    }, [timelineData]);

    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const progressPercent = Math.round((completedCount / tasks.length) * 100);

    const selectedTaskData = tasks.find(t => t.id === selectedTask);
    const selectedCanStart = selectedTaskData ? canTaskStart(selectedTaskData, tasks) : null;

    return (
        <div style={{ background: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: 'white', padding: '20px 32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}> Project Schedule</h1>
                        <p style={{ color: '#94A3B8', margin: '4px 0 0', fontSize: 13 }}>456 Tampines St 42  David Lim</p>
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <button
                            onClick={() => setShowPayments(!showPayments)}
                            style={{
                                background: showPayments ? '#22C55E' : 'rgba(255,255,255,0.1)',
                                color: 'white', border: 'none', padding: '8px 16px',
                                borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                            }}
                        >
                             {showPayments ? 'Payments On' : 'Payments Off'}
                        </button>
                    </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94A3B8', marginBottom: 4 }}>
                        <span>{completedCount} of {tasks.length} trades complete</span>
                        <span>{progressPercent}%</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', height: 6, borderRadius: 3 }}>
                        <div style={{
                            background: 'linear-gradient(90deg, #22C55E, #10B981)',
                            height: '100%', borderRadius: 3, width: `${progressPercent}%`,
                            transition: 'width 0.5s ease',
                        }} />
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
                    <div style={{ background: 'rgba(34,197,94,0.15)', padding: '8px 16px', borderRadius: 8, flex: 1 }}>
                        <div style={{ fontSize: 11, color: '#86EFAC', letterSpacing: '0.05em' }}>TARGET COMPLETION</div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>19 Apr 2026</div>
                    </div>
                    <div style={{ background: 'rgba(59,130,246,0.15)', padding: '8px 16px', borderRadius: 8, flex: 1 }}>
                        <div style={{ fontSize: 11, color: '#93C5FD', letterSpacing: '0.05em' }}>TOTAL DURATION</div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{timelineData.totalDays - 5} days</div>
                    </div>
                    {showPayments && (
                        <div style={{ background: 'rgba(168,85,247,0.15)', padding: '8px 16px', borderRadius: 8, flex: 1 }}>
                            <div style={{ fontSize: 11, color: '#C4B5FD', letterSpacing: '0.05em' }}>PAID / TOTAL</div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>${paymentSummary.paid.toLocaleString()} / ${paymentSchedule.contractValue.toLocaleString()}</div>
                        </div>
                    )}
                    <div style={{
                        background: tasks.some(t => t.curingUntil) ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)',
                        padding: '8px 16px', borderRadius: 8, flex: 1,
                    }}>
                        <div style={{ fontSize: 11, color: '#FCD34D', letterSpacing: '0.05em' }}>CURING ACTIVE</div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>
                            {tasks.filter(t => t.curingUntil).length > 0 ? ' Yes' : ' None'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div style={{ padding: '24px 32px' }}>
                {/* Week headers */}
                <div style={{ position: 'relative', height: 30, marginLeft: 200, marginBottom: 4 }}>
                    {weekMarkers.map((m, i) => (
                        <div key={i} style={{
                            position: 'absolute', left: `${m.position}%`,
                            fontSize: 11, color: '#94A3B8', fontWeight: 600,
                            transform: 'translateX(-50%)',
                        }}>
                            {m.label}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div style={{ position: 'relative' }}>
                    {/* Today line */}
                    <div style={{
                        position: 'absolute', left: `calc(200px + (100% - 200px) * ${parseFloat(todayPos)} / 100)`,
                        top: 0, bottom: 0, width: 2, background: '#EF4444', zIndex: 10,
                    }}>
                        <div style={{
                            position: 'absolute', top: -8, left: -20,
                            background: '#EF4444', color: 'white', fontSize: 10,
                            padding: '2px 6px', borderRadius: 4, fontWeight: 700,
                        }}>TODAY</div>
                    </div>

                    {/* Task rows */}
                    {tasks.map((task, i) => {
                        const bar = getBarPosition(task.scheduledStart, task.scheduledEnd);
                        const color = TRADE_COLORS[task.trade] || '#6B7280';
                        const statusStyle = STATUS_STYLES[task.status];
                        const isSelected = selectedTask === task.id;
                        const profile = TRADE_PROFILES[task.trade];

                        return (
                            <div
                                key={task.id}
                                onClick={() => setSelectedTask(isSelected ? null : task.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', height: 48,
                                    borderBottom: '1px solid #E2E8F0',
                                    background: isSelected ? '#EFF6FF' : i % 2 === 0 ? 'white' : '#F8FAFC',
                                    cursor: 'pointer',
                                    transition: 'background 0.15s',
                                }}
                            >
                                {/* Label */}
                                <div style={{ width: 200, padding: '0 12px', flexShrink: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{
                                            width: 10, height: 10, borderRadius: 2,
                                            background: color, flexShrink: 0,
                                        }} />
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', lineHeight: 1.2 }}>
                                                {profile?.displayName || task.trade}
                                            </div>
                                            <div style={{ fontSize: 11, color: '#94A3B8' }}>{task.vendorName}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bar area */}
                                <div style={{ flex: 1, position: 'relative', height: '100%' }}>
                                    {/* Background grid lines */}
                                    {weekMarkers.map((m, j) => (
                                        <div key={j} style={{
                                            position: 'absolute', left: `${m.position}%`,
                                            top: 0, bottom: 0, width: 1,
                                            background: '#F1F5F9',
                                        }} />
                                    ))}

                                    {/* Task bar */}
                                    <div style={{
                                        position: 'absolute', top: '25%', height: '50%',
                                        left: bar.left, width: bar.width,
                                        background: task.status === 'completed'
                                            ? `linear-gradient(90deg, ${color}, ${color}cc)`
                                            : task.status === 'in_progress'
                                                ? `linear-gradient(90deg, ${color}, ${color}88)`
                                                : `${color}44`,
                                        borderRadius: 4,
                                        border: `1px solid ${color}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        overflow: 'hidden',
                                    }}>
                                        <span style={{
                                            fontSize: 10, fontWeight: 700,
                                            color: task.status === 'completed' || task.status === 'in_progress' ? 'white' : color,
                                            whiteSpace: 'nowrap', padding: '0 4px',
                                        }}>
                                            {task.title}
                                        </span>
                                    </div>

                                    {/* Curing indicator */}
                                    {task.curingUntil && (
                                        <div style={{
                                            position: 'absolute', top: '25%', height: '50%',
                                            left: getBarPosition(task.scheduledEnd, task.curingUntil).left,
                                            width: getBarPosition(task.scheduledEnd, task.curingUntil).width,
                                            background: 'repeating-linear-gradient(45deg, #FEF3C7, #FEF3C7 4px, #FDE68A 4px, #FDE68A 8px)',
                                            borderRadius: '0 4px 4px 0',
                                            border: '1px dashed #D97706',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <span style={{ fontSize: 9, fontWeight: 700, color: '#92400E' }}> CURE</span>
                                        </div>
                                    )}
                                </div>

                                {/* Status badge */}
                                <div style={{ width: 90, flexShrink: 0, padding: '0 8px', textAlign: 'center' }}>
                                    <span style={{
                                        display: 'inline-block', padding: '3px 8px', borderRadius: 12,
                                        fontSize: 10, fontWeight: 700,
                                        background: statusStyle.bg, color: statusStyle.text,
                                    }}>
                                        {statusStyle.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Selected task details */}
                {selectedTaskData && (
                    <div style={{
                        marginTop: 16, padding: 20, background: 'white',
                        borderRadius: 12, border: '1px solid #E2E8F0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1E293B' }}>
                                    {selectedTaskData.title}
                                </h3>
                                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748B' }}>
                                    {selectedTaskData.vendorName}  {selectedTaskData.vendorPhone}
                                </p>
                            </div>
                            <span style={{
                                padding: '4px 12px', borderRadius: 12,
                                fontSize: 12, fontWeight: 700,
                                background: STATUS_STYLES[selectedTaskData.status].bg,
                                color: STATUS_STYLES[selectedTaskData.status].text,
                            }}>
                                {STATUS_STYLES[selectedTaskData.status].label}
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
                            <div>
                                <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.05em' }}>SCHEDULED</div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>
                                    {new Date(selectedTaskData.scheduledStart).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}  {new Date(selectedTaskData.scheduledEnd).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}
                                </div>
                            </div>
                            {selectedTaskData.curingUntil && (
                                <div>
                                    <div style={{ fontSize: 11, color: '#D97706', fontWeight: 600, letterSpacing: '0.05em' }}> CURING UNTIL</div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: '#D97706' }}>
                                        {new Date(selectedTaskData.curingUntil).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            )}
                            <div>
                                <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.05em' }}>CAN START?</div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: selectedCanStart?.canStart ? '#059669' : '#DC2626' }}>
                                    {selectedCanStart?.canStart ? ' Ready' : ` ${selectedCanStart?.reason}`}
                                </div>
                            </div>
                        </div>

                        {/* Dependencies */}
                        <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>DEPENDS ON:</span>
                            {selectedTaskData.dependsOn.length === 0 ? (
                                <span style={{ fontSize: 11, color: '#10B981' }}>None (first task)</span>
                            ) : (
                                selectedTaskData.dependsOn.map(depId => {
                                    const dep = tasks.find(t => t.id === depId);
                                    return dep ? (
                                        <span key={depId} style={{
                                            fontSize: 11, padding: '2px 8px', borderRadius: 12,
                                            background: dep.status === 'completed' ? '#D1FAE5' : '#FEF3C7',
                                            color: dep.status === 'completed' ? '#059669' : '#D97706',
                                            fontWeight: 600,
                                        }}>
                                            {dep.status === 'completed' ? '' : ''} {TRADE_PROFILES[dep.trade]?.displayName}
                                        </span>
                                    ) : null;
                                })
                            )}
                        </div>
                    </div>
                )}

                {/* Payment Milestones */}
                {showPayments && (
                    <div style={{ marginTop: 24 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 12 }}> Payment Milestones</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                            {paymentSchedule.milestones.map((ms) => {
                                const unlock = canUnlockMilestone(ms);
                                return (
                                    <div key={ms.id} style={{
                                        padding: 16, borderRadius: 12, background: 'white',
                                        border: `2px solid ${ms.status === 'paid' ? '#10B981' : ms.qualityGatePassed ? '#3B82F6' : '#E2E8F0'}`,
                                    }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.05em' }}>
                                            #{ms.milestoneNumber}
                                        </div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', margin: '4px 0' }}>
                                            {ms.name}
                                        </div>
                                        <div style={{ fontSize: 20, fontWeight: 800, color: ms.status === 'paid' ? '#10B981' : '#1E293B' }}>
                                            ${ms.amount.toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
                                            {ms.percentage}% of contract
                                        </div>
                                        <div style={{
                                            marginTop: 8, fontSize: 11, fontWeight: 700, padding: '3px 8px',
                                            borderRadius: 8, display: 'inline-block',
                                            background: ms.status === 'paid' ? '#D1FAE5'
                                                : ms.qualityGatePassed ? '#DBEAFE'
                                                    : '#F1F5F9',
                                            color: ms.status === 'paid' ? '#059669'
                                                : ms.qualityGatePassed ? '#1D4ED8'
                                                    : '#94A3B8',
                                        }}>
                                            {ms.status === 'paid' ? ' Paid'
                                                : ms.qualityGatePassed ? ' Unlocked'
                                                    : ' Quality gate pending'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
