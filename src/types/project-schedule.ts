/**
 * Project Schedule  Roof Scheduling Brain
 * 
 * Manages trade sequencing, curing time enforcement, and
 * auto-broadcasts schedule changes to ALL affected parties.
 * 
 * Problem: Designers spend 30% of their time calling vendors to coordinate.
 * Solution: One schedule, auto-notifications, curing time locks.
 * 
 * Lives in: Roof (project management)
 */

import { TradeCategory } from './trades';

// ============================================================
// CURING & DEPENDENCY RULES  Construction knowledge baked in
// ============================================================

export interface CuringRequirement {
    trade: TradeCategory;
    subTrade: string;
    curingHours: number;           // Minimum hours before next work
    description: string;
    blocksTradesUntilCured: TradeCategory[];  // Which trades can't start
    weatherSensitive: boolean;     // Extends if raining
}

/** Built-in construction curing knowledge */
export const CURING_REQUIREMENTS: CuringRequirement[] = [
    {
        trade: 'waterproofing', subTrade: 'bathroom_waterproofing',
        curingHours: 48, description: '48hr flood test mandatory before tiling',
        blocksTradesUntilCured: ['masonry', 'flooring', 'plumbing'],
        weatherSensitive: false,
    },
    {
        trade: 'masonry', subTrade: 'screeding',
        curingHours: 168, description: '7 days minimum cure for cement screed',
        blocksTradesUntilCured: ['flooring', 'carpentry'],
        weatherSensitive: true,
    },
    {
        trade: 'masonry', subTrade: 'plastering',
        curingHours: 72, description: '3 days cure before painting',
        blocksTradesUntilCured: ['painting'],
        weatherSensitive: true,
    },
    {
        trade: 'painting', subTrade: 'primer',
        curingHours: 4, description: '4hrs between primer and first coat',
        blocksTradesUntilCured: [],
        weatherSensitive: false,
    },
    {
        trade: 'painting', subTrade: 'paint_coat',
        curingHours: 8, description: '8hrs between paint coats',
        blocksTradesUntilCured: [],
        weatherSensitive: false,
    },
    {
        trade: 'masonry', subTrade: 'tiling',
        curingHours: 24, description: '24hrs before grouting after tile adhesive',
        blocksTradesUntilCured: [],
        weatherSensitive: false,
    },
    {
        trade: 'ceiling', subTrade: 'gypsum_ceiling',
        curingHours: 24, description: '24hrs for joint compound to dry before skim coat',
        blocksTradesUntilCured: ['painting'],
        weatherSensitive: false,
    },
    {
        trade: 'demolition', subTrade: 'wall_hacking',
        curingHours: 0, description: 'No curing, but dust must settle before painting',
        blocksTradesUntilCured: ['painting', 'ceiling'],
        weatherSensitive: false,
    },
];

// ============================================================
// TRADE DEPENDENCY CHAIN  Standard renovation Roof
// ============================================================

export interface TradeDependency {
    trade: TradeCategory;
    mustStartAfter: TradeCategory[];
    canOverlapWith: TradeCategory[];
    typicalDurationDays: { min: number; max: number };  // For scheduling
}

/** Standard renovation trade Roof */
export const TRADE_DEPENDENCIES: TradeDependency[] = [
    { trade: 'preliminaries', mustStartAfter: [], canOverlapWith: [], typicalDurationDays: { min: 1, max: 2 } },
    { trade: 'demolition', mustStartAfter: ['preliminaries'], canOverlapWith: [], typicalDurationDays: { min: 2, max: 5 } },
    { trade: 'masonry', mustStartAfter: ['demolition'], canOverlapWith: ['electrical', 'plumbing'], typicalDurationDays: { min: 3, max: 7 } },
    { trade: 'waterproofing', mustStartAfter: ['masonry'], canOverlapWith: [], typicalDurationDays: { min: 2, max: 3 } },
    { trade: 'plumbing', mustStartAfter: ['demolition'], canOverlapWith: ['masonry', 'electrical'], typicalDurationDays: { min: 2, max: 4 } },
    { trade: 'electrical', mustStartAfter: ['demolition'], canOverlapWith: ['masonry', 'plumbing'], typicalDurationDays: { min: 3, max: 5 } },
    { trade: 'ceiling', mustStartAfter: ['electrical', 'plumbing', 'aircon'], canOverlapWith: [], typicalDurationDays: { min: 2, max: 4 } },
    { trade: 'aircon', mustStartAfter: ['demolition'], canOverlapWith: ['electrical'], typicalDurationDays: { min: 1, max: 2 } },
    { trade: 'flooring', mustStartAfter: ['waterproofing', 'masonry'], canOverlapWith: [], typicalDurationDays: { min: 3, max: 6 } },
    { trade: 'carpentry', mustStartAfter: ['masonry', 'ceiling', 'flooring'], canOverlapWith: [], typicalDurationDays: { min: 5, max: 14 } },
    { trade: 'metalworks', mustStartAfter: ['masonry'], canOverlapWith: ['carpentry'], typicalDurationDays: { min: 2, max: 4 } },
    { trade: 'glassworks', mustStartAfter: ['masonry', 'waterproofing'], canOverlapWith: ['carpentry'], typicalDurationDays: { min: 1, max: 3 } },
    { trade: 'painting', mustStartAfter: ['ceiling', 'carpentry'], canOverlapWith: [], typicalDurationDays: { min: 3, max: 5 } },
    { trade: 'cleaning', mustStartAfter: ['painting', 'carpentry', 'glassworks'], canOverlapWith: [], typicalDurationDays: { min: 1, max: 2 } },
];

// ============================================================
// SCHEDULE TASK  Individual scheduled item
// ============================================================

export type TaskStatus = 'scheduled' | 'in_progress' | 'curing' | 'completed' | 'delayed' | 'blocked';

export interface ScheduleTask {
    id: string;
    projectId: string;
    trade: TradeCategory;
    subTrade?: string;
    title: string;
    description?: string;

    // Vendor assignment
    vendorId?: string;
    vendorName?: string;
    vendorPhone?: string;

    // Timing
    scheduledStart: string;          // ISO date
    scheduledEnd: string;
    actualStart?: string;
    actualEnd?: string;

    // Curing lock
    curingUntil?: string;            // ISO datetime  system blocks next task
    curingDescription?: string;

    // Status
    status: TaskStatus;
    blockedBy?: string[];            // IDs of tasks that must complete first
    blockedReason?: string;

    // Dependencies
    dependsOn: string[];             // Task IDs
    blocks: string[];                // Task IDs this blocks

    // Zone
    zone?: string;

    // Notifications sent
    notificationsSent: ScheduleNotification[];
}

// ============================================================
// SCHEDULE CHANGE NOTIFICATION  Auto-broadcast
// ============================================================

export type NotificationType =
    | 'schedule_change'       // Date/time changed
    | 'delay_alert'           // Task is running late
    | 'curing_start'          // Curing period started  don't come
    | 'curing_complete'       // Curing done  you can start
    | 'vendor_assigned'       // You've been assigned this task
    | 'task_completed'        // Previous trade done  you're next
    | 'defect_reported'       // Defect found in your work
    | 'site_access'           // Site access hours changed
    | 'material_arrived';     // Materials ready for collection/install

export interface ScheduleNotification {
    id: string;
    type: NotificationType;
    projectId: string;
    taskId?: string;

    // Who receives
    recipientRole: 'designer' | 'vendor' | 'client' | 'inspector' | 'all';
    recipientName: string;
    recipientPhone?: string;         // For WhatsApp delivery

    // Message
    title: string;
    message: string;

    // Delivery
    sentAt: string;
    sentVia: 'whatsapp' | 'push' | 'email' | 'in_app';
    delivered: boolean;
    readAt?: string;

    // Change details
    oldValue?: string;               // "Mon 15 Mar"
    newValue?: string;               // "Wed 17 Mar"
    reason?: string;                  // "Waterproofing curing extended due to rain"
}

// ============================================================
// PROJECT SCHEDULE  Full schedule for a project
// ============================================================

export interface ProjectSchedule {
    projectId: string;
    tasks: ScheduleTask[];
    startDate: string;
    targetCompletionDate: string;
    actualCompletionDate?: string;

    // Auto-calculated
    totalDurationDays: number;
    criticalPath: string[];          // Task IDs on critical path
    currentDelay: number;            // Days behind schedule

    lastUpdated: string;
    lastUpdatedBy: string;
}

// ============================================================
// HELPERS
// ============================================================

/** Check if a task can start (all dependencies met, curing done) */
export function canTaskStart(task: ScheduleTask, allTasks: ScheduleTask[]): { canStart: boolean; reason?: string } {
    // Check dependencies
    for (const depId of task.dependsOn) {
        const dep = allTasks.find(t => t.id === depId);
        if (!dep) continue;
        if (dep.status !== 'completed') {
            return { canStart: false, reason: `Waiting for ${dep.title} to complete` };
        }
        // Check curing
        if (dep.curingUntil && new Date(dep.curingUntil) > new Date()) {
            const hoursLeft = Math.ceil((new Date(dep.curingUntil).getTime() - Date.now()) / 3600000);
            return {
                canStart: false,
                reason: ` ${dep.curingDescription || 'Curing in progress'}  ${hoursLeft}hrs remaining`,
            };
        }
    }
    return { canStart: true };
}

/** Generate schedule change notifications for all affected parties */
export function generateScheduleChangeNotifications(
    task: ScheduleTask,
    allTasks: ScheduleTask[],
    changeReason: string,
    oldDate: string,
    newDate: string,
): ScheduleNotification[] {
    const notifications: ScheduleNotification[] = [];
    const now = new Date().toISOString();

    // Notify the vendor assigned to this task
    if (task.vendorName) {
        notifications.push({
            id: `notif_${Date.now()}_vendor`,
            type: 'schedule_change',
            projectId: task.projectId,
            taskId: task.id,
            recipientRole: 'vendor',
            recipientName: task.vendorName,
            recipientPhone: task.vendorPhone,
            title: `Schedule Change: ${task.title}`,
            message: `Your ${task.trade} task has been rescheduled from ${oldDate} to ${newDate}. Reason: ${changeReason}`,
            sentAt: now,
            sentVia: 'whatsapp',
            delivered: false,
            oldValue: oldDate,
            newValue: newDate,
            reason: changeReason,
        });
    }

    // Notify all downstream vendors (tasks that depend on this one)
    for (const blockedId of task.blocks) {
        const blocked = allTasks.find(t => t.id === blockedId);
        if (!blocked || !blocked.vendorName) continue;
        notifications.push({
            id: `notif_${Date.now()}_${blocked.id}`,
            type: 'delay_alert',
            projectId: task.projectId,
            taskId: blocked.id,
            recipientRole: 'vendor',
            recipientName: blocked.vendorName,
            recipientPhone: blocked.vendorPhone,
            title: `Heads up: ${task.title} rescheduled`,
            message: `The ${task.trade} work before yours has moved to ${newDate}. Your ${blocked.trade} task may shift accordingly. We'll confirm your new date shortly.`,
            sentAt: now,
            sentVia: 'whatsapp',
            delivered: false,
            reason: changeReason,
        });
    }

    return notifications;
}

/** Get curing requirement for a trade/subtrade */
export function getCuringRequirement(trade: TradeCategory, subTrade?: string): CuringRequirement | undefined {
    if (subTrade) {
        return CURING_REQUIREMENTS.find(c => c.trade === trade && c.subTrade === subTrade);
    }
    return CURING_REQUIREMENTS.find(c => c.trade === trade);
}
