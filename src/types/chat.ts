/**
 * In-App Chat  Project Communication
 * 
 * All project communication logged and traceable. No more WhatsApp
 * telephone games or lost messages. Every message is tied to a 
 * project, participant, and timestamp.
 * 
 * Lives in: All apps (each app shows relevant threads)
 *   - Designer sees all project threads
 *   - Client sees their project thread only
 *   - Vendor sees threads they're tagged in
 */

// ============================================================
// CORE TYPES
// ============================================================

export type ParticipantRole = 'designer' | 'client' | 'vendor' | 'system';

export interface ChatParticipant {
    id: string;
    name: string;
    role: ParticipantRole;
    avatar?: string;            // Initials fallback
    phone?: string;             // For WhatsApp bridge
    online?: boolean;
    lastSeen?: string;
}

export type MessageType =
    | 'text'                    // Regular message
    | 'image'                   // Photo (site progress, defect)
    | 'file'                    // Document (quotation PDF, drawing)
    | 'system'                  // Auto-generated (schedule change, payment received)
    | 'approval_request'        // Needs sign-off (material change, extra cost)
    | 'milestone'               // Payment milestone notification
    | 'defect_report';          // Defect with photo evidence

export interface ChatMessage {
    id: string;
    threadId: string;
    senderId: string;
    senderName: string;
    senderRole: ParticipantRole;

    type: MessageType;
    content: string;

    // Attachments
    attachments?: ChatAttachment[];

    // Approval-specific
    approvalStatus?: 'pending' | 'approved' | 'rejected';
    approvalBy?: string;
    approvalAt?: string;

    // Metadata
    timestamp: string;
    editedAt?: string;
    readBy: string[];           // Participant IDs who've read it

    // Threading
    replyTo?: string;           // Quote another message
    pinned?: boolean;
}

export interface ChatAttachment {
    id: string;
    name: string;
    url: string;
    type: 'image' | 'pdf' | 'document';
    size: number;               // bytes
    thumbnailUrl?: string;
}

// ============================================================
// THREAD
// ============================================================

export type ThreadType =
    | 'project'                 // Main project chat (all parties)
    | 'designer_client'         // Private: designer + client only
    | 'designer_vendor'         // Private: designer + specific vendor
    | 'trade_specific'          // About a specific trade/task
    | 'defect';                 // Defect discussion thread

export interface ChatThread {
    id: string;
    projectId: string;
    projectName: string;        // "456 Tampines St 42"

    type: ThreadType;
    title: string;              // Auto-generated or custom

    participants: ChatParticipant[];

    // State
    lastMessage?: ChatMessage;
    unreadCount: Record<string, number>;  // Per participant

    // Metadata
    createdAt: string;
    updatedAt: string;
    archived: boolean;

    // Linked items
    tradeCategory?: string;     // If trade_specific
    defectId?: string;          // If defect thread
    taskId?: string;            // If linked to schedule task
}

// ============================================================
// SYSTEM MESSAGE TEMPLATES
// ============================================================

export const SYSTEM_MESSAGES = {
    schedule_change: (trade: string, oldDate: string, newDate: string) =>
        `Schedule updated: ${trade} moved from ${oldDate} to ${newDate}`,

    payment_received: (milestone: string, amount: number) =>
        `Payment received for ${milestone}: $${amount.toLocaleString()}`,

    payment_due: (milestone: string, amount: number) =>
        `Payment due for ${milestone}: $${amount.toLocaleString()}. Quality gate passed.`,

    defect_reported: (location: string, severity: string) =>
        `Defect reported at ${location} (${severity}). Please review.`,

    defect_resolved: (location: string) =>
        `Defect at ${location} has been resolved and verified.`,

    vendor_joined: (vendorName: string, trade: string) =>
        `${vendorName} has joined the project for ${trade}.`,

    task_completed: (trade: string) =>
        `${trade} has been marked as completed.`,

    curing_complete: (trade: string) =>
        `Curing period for ${trade} is complete. Next trade can proceed.`,

    factory_qc_submitted: (vendor: string) =>
        `${vendor} has submitted factory QC photos for review.`,

    approval_needed: (item: string) =>
        `Approval needed: ${item}. Please review and respond.`,
};

// ============================================================
// HELPERS
// ============================================================

/** Generate thread title based on type */
export function generateThreadTitle(type: ThreadType, context: {
    projectName?: string;
    tradeName?: string;
    vendorName?: string;
    clientName?: string;
}): string {
    switch (type) {
        case 'project':
            return context.projectName || 'Project Chat';
        case 'designer_client':
            return `Chat with ${context.clientName || 'Client'}`;
        case 'designer_vendor':
            return `${context.vendorName || 'Vendor'}  ${context.tradeName || 'General'}`;
        case 'trade_specific':
            return context.tradeName || 'Trade Discussion';
        case 'defect':
            return `Defect  ${context.tradeName || 'Issue'}`;
        default:
            return 'Chat';
    }
}

/** Get unread count for a participant across all threads */
export function getTotalUnread(threads: ChatThread[], participantId: string): number {
    return threads.reduce((sum, t) => sum + (t.unreadCount[participantId] || 0), 0);
}
