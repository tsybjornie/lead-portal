'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatThread, ChatMessage, ChatParticipant, ParticipantRole, SYSTEM_MESSAGES } from '@/types/chat';

// ============================================================
// SAMPLE DATA
// ============================================================

const ME: ChatParticipant = { id: 'u1', name: 'Bjorn Teo', role: 'designer', online: true };

const SAMPLE_THREADS: ChatThread[] = [
    {
        id: 'th1', projectId: 'p1', projectName: '456 Tampines St 42',
        type: 'project', title: '456 Tampines St 42',
        participants: [
            ME,
            { id: 'u2', name: 'David Lim', role: 'client', online: false, lastSeen: '2026-03-18T14:30:00Z' },
            { id: 'u3', name: 'Ah Huat', role: 'vendor', online: true },
        ],
        unreadCount: { u1: 2 }, createdAt: '2026-03-10T09:00:00Z', updatedAt: '2026-03-18T14:35:00Z', archived: false,
    },
    {
        id: 'th2', projectId: 'p1', projectName: '456 Tampines St 42',
        type: 'designer_client', title: 'David Lim',
        participants: [ME, { id: 'u2', name: 'David Lim', role: 'client', online: false }],
        unreadCount: { u1: 0 }, createdAt: '2026-03-10T09:00:00Z', updatedAt: '2026-03-17T10:00:00Z', archived: false,
    },
    {
        id: 'th3', projectId: 'p1', projectName: '456 Tampines St 42',
        type: 'designer_vendor', title: 'Ah Huat  Carpentry',
        participants: [ME, { id: 'u3', name: 'Ah Huat', role: 'vendor', online: true }],
        tradeCategory: 'carpentry',
        unreadCount: { u1: 1 }, createdAt: '2026-03-12T09:00:00Z', updatedAt: '2026-03-18T11:20:00Z', archived: false,
    },
    {
        id: 'th4', projectId: 'p2', projectName: '322C Tengah Drive',
        type: 'project', title: '322C Tengah Drive',
        participants: [ME, { id: 'u4', name: 'Tan Wei Ming', role: 'client', online: true }],
        unreadCount: { u1: 0 }, createdAt: '2026-02-20T09:00:00Z', updatedAt: '2026-03-16T16:00:00Z', archived: false,
    },
];

const SAMPLE_MESSAGES: Record<string, ChatMessage[]> = {
    th1: [
        { id: 'm1', threadId: 'th1', senderId: 'system', senderName: 'System', senderRole: 'system', type: 'system', content: SYSTEM_MESSAGES.vendor_joined('Ah Huat Carpentry', 'Carpentry & Joinery'), timestamp: '2026-03-12T09:00:00Z', readBy: ['u1', 'u2', 'u3'] },
        { id: 'm2', threadId: 'th1', senderId: 'u1', senderName: 'Bjorn Teo', senderRole: 'designer', type: 'text', content: 'Hi David, site protection is done. Demolition starts tomorrow morning.', timestamp: '2026-03-11T17:00:00Z', readBy: ['u1', 'u2'] },
        { id: 'm3', threadId: 'th1', senderId: 'u2', senderName: 'David Lim', senderRole: 'client', type: 'text', content: 'Thanks Sarah! Will there be a lot of noise?', timestamp: '2026-03-11T17:15:00Z', readBy: ['u1', 'u2'] },
        { id: 'm4', threadId: 'th1', senderId: 'u1', senderName: 'Bjorn Teo', senderRole: 'designer', type: 'text', content: 'Yes, hacking is the noisiest part. Usually 9am-5pm. It will be done by Friday.', timestamp: '2026-03-11T17:20:00Z', readBy: ['u1', 'u2'] },
        { id: 'm5', threadId: 'th1', senderId: 'system', senderName: 'System', senderRole: 'system', type: 'system', content: SYSTEM_MESSAGES.task_completed('Demolition'), timestamp: '2026-03-15T17:00:00Z', readBy: ['u1', 'u2', 'u3'] },
        { id: 'm6', threadId: 'th1', senderId: 'u1', senderName: 'Bjorn Teo', senderRole: 'designer', type: 'text', content: 'Demolition complete. Masonry starts Monday. Brickwork crew is Lim Builders.', timestamp: '2026-03-15T17:10:00Z', readBy: ['u1', 'u2'] },
        { id: 'm7', threadId: 'th1', senderId: 'system', senderName: 'System', senderRole: 'system', type: 'system', content: 'Masonry is now curing. Next trade starts after 25 Mar.', timestamp: '2026-03-18T10:00:00Z', readBy: ['u1'] },
        { id: 'm8', threadId: 'th1', senderId: 'u3', senderName: 'Ah Huat', senderRole: 'vendor', type: 'text', content: 'Sarah, I need the updated elevation drawing for the kitchen cabinet. Can send?', timestamp: '2026-03-18T11:15:00Z', readBy: ['u3'] },
        { id: 'm9', threadId: 'th1', senderId: 'u2', senderName: 'David Lim', senderRole: 'client', type: 'text', content: 'Hi Sarah, can I visit the site this week to see the brickwork progress?', timestamp: '2026-03-18T14:30:00Z', readBy: ['u2'] },
    ],
    th3: [
        { id: 'mv1', threadId: 'th3', senderId: 'u1', senderName: 'Bjorn Teo', senderRole: 'designer', type: 'text', content: 'Ah Huat, please confirm you received the elevation pack for 456 Tampines.', timestamp: '2026-03-14T09:00:00Z', readBy: ['u1', 'u3'] },
        { id: 'mv2', threadId: 'th3', senderId: 'u3', senderName: 'Ah Huat', senderRole: 'vendor', type: 'text', content: 'Received. But dimension for kitchen island not clear. Can clarify the depth?', timestamp: '2026-03-14T10:30:00Z', readBy: ['u1', 'u3'] },
        { id: 'mv3', threadId: 'th3', senderId: 'u1', senderName: 'Bjorn Teo', senderRole: 'designer', type: 'text', content: 'Kitchen island: 2400L x 900W x 900H. Quartz top, waterfall edge both sides.', timestamp: '2026-03-14T10:45:00Z', readBy: ['u1', 'u3'] },
        { id: 'mv4', threadId: 'th3', senderId: 'u3', senderName: 'Ah Huat', senderRole: 'vendor', type: 'text', content: 'Noted. Factory QC photos will be ready by end of month.', timestamp: '2026-03-18T11:20:00Z', readBy: ['u3'] },
    ],
};

// ============================================================
// COMPONENT
// ============================================================

const ROLE_COLORS: Record<ParticipantRole, string> = {
    designer: '#37352F',
    client: '#2383E2',
    vendor: '#6940A5',
    system: '#9B9A97',
};

export default function InAppChat() {
    const [activeThread, setActiveThread] = useState<string>('th1');
    const [draft, setDraft] = useState('');
    const [messages, setMessages] = useState(SAMPLE_MESSAGES);
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const thread = SAMPLE_THREADS.find(t => t.id === activeThread);
    const threadMessages = messages[activeThread] || [];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [threadMessages.length, activeThread]);

    const handleSend = () => {
        if (!draft.trim() || !thread) return;
        const newMsg: ChatMessage = {
            id: `m_${Date.now()}`, threadId: activeThread,
            senderId: 'u1', senderName: 'Bjorn Teo', senderRole: 'designer',
            type: 'text', content: draft.trim(),
            timestamp: new Date().toISOString(), readBy: ['u1'],
        };
        setMessages(prev => ({ ...prev, [activeThread]: [...(prev[activeThread] || []), newMsg] }));
        setDraft('');
    };

    const filteredThreads = SAMPLE_THREADS.filter(t =>
        !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatTime = (ts: string) => {
        const d = new Date(ts);
        const now = new Date('2026-03-18T15:00:00Z');
        const diff = now.getTime() - d.getTime();
        if (diff < 86400000) return d.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' });
        if (diff < 604800000) return d.toLocaleDateString('en-SG', { weekday: 'short' });
        return d.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' });
    };

    const font = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: font, color: '#37352F' }}>

            {/* Sidebar  Thread list */}
            <div style={{
                width: 300, borderRight: '1px solid #E9E9E7', display: 'flex', flexDirection: 'column',
                background: '#FBFBFA', flexShrink: 0,
            }}>
                {/* Search */}
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #E9E9E7' }}>
                    <input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search conversations"
                        style={{
                            width: '100%', padding: '8px 12px', borderRadius: 4,
                            border: '1px solid #E9E9E7', fontSize: 13, fontFamily: font,
                            background: '#FFFFFF', outline: 'none',
                        }}
                    />
                </div>

                {/* Threads */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {filteredThreads.map(t => {
                        const unread = t.unreadCount['u1'] || 0;
                        const isActive = t.id === activeThread;
                        return (
                            <div
                                key={t.id}
                                onClick={() => setActiveThread(t.id)}
                                style={{
                                    padding: '12px 16px', cursor: 'pointer',
                                    background: isActive ? '#F0F0EE' : 'transparent',
                                    borderLeft: isActive ? '2px solid #37352F' : '2px solid transparent',
                                    transition: 'background 0.1s',
                                }}
                                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F7F6F3'; }}
                                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 14, fontWeight: unread > 0 ? 600 : 400 }}>{t.title}</span>
                                    <span style={{ fontSize: 11, color: '#9B9A97' }}>{formatTime(t.updatedAt)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                    <span style={{
                                        fontSize: 12, color: '#9B9A97',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        maxWidth: 200,
                                    }}>
                                        {t.type === 'project' ? 'Project' : t.type === 'designer_client' ? 'Private' : t.type === 'designer_vendor' ? 'Vendor' : ''}
                                        {t.participants.length > 2 && ` · ${t.participants.length} people`}
                                    </span>
                                    {unread > 0 && (
                                        <span style={{
                                            width: 18, height: 18, borderRadius: '50%', background: '#37352F',
                                            color: 'white', fontSize: 10, fontWeight: 700,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>{unread}</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main  Chat area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>

                {/* Header */}
                {thread && (
                    <div style={{
                        padding: '14px 24px', borderBottom: '1px solid #E9E9E7',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <div>
                            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{thread.title}</h2>
                            <div style={{ fontSize: 12, color: '#9B9A97', marginTop: 2 }}>
                                {thread.participants.map(p => p.name).join(', ')}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                            {thread.participants.map(p => (
                                <div key={p.id} style={{
                                    width: 28, height: 28, borderRadius: '50%',
                                    background: ROLE_COLORS[p.role],
                                    color: 'white', fontSize: 10, fontWeight: 600,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    position: 'relative',
                                }}>
                                    {p.name.split(' ').map(n => n[0]).join('')}
                                    {p.online && (
                                        <div style={{
                                            width: 8, height: 8, borderRadius: '50%',
                                            background: '#35A855', border: '2px solid white',
                                            position: 'absolute', bottom: -1, right: -1,
                                        }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
                    {threadMessages.map((msg, i) => {
                        const isMe = msg.senderId === 'u1';
                        const isSystem = msg.senderRole === 'system';
                        const showAvatar = i === 0 || threadMessages[i - 1].senderId !== msg.senderId;

                        if (isSystem) {
                            return (
                                <div key={msg.id} style={{
                                    textAlign: 'center', margin: '16px 0', fontSize: 12, color: '#9B9A97',
                                }}>
                                    <span style={{
                                        background: '#F7F6F3', padding: '4px 12px', borderRadius: 12,
                                    }}>
                                        {msg.content}
                                    </span>
                                </div>
                            );
                        }

                        return (
                            <div key={msg.id} style={{
                                display: 'flex', gap: 10, marginTop: showAvatar ? 16 : 2,
                                alignItems: 'flex-start',
                            }}>
                                {/* Avatar */}
                                <div style={{ width: 28, flexShrink: 0 }}>
                                    {showAvatar && (
                                        <div style={{
                                            width: 28, height: 28, borderRadius: '50%',
                                            background: ROLE_COLORS[msg.senderRole],
                                            color: 'white', fontSize: 10, fontWeight: 600,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            {msg.senderName.split(' ').map(n => n[0]).join('')}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    {showAvatar && (
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 2 }}>
                                            <span style={{ fontSize: 13, fontWeight: 600 }}>{msg.senderName}</span>
                                            <span style={{
                                                fontSize: 10, color: '#9B9A97', textTransform: 'capitalize',
                                                padding: '1px 6px', borderRadius: 3, background: '#F7F6F3',
                                            }}>{msg.senderRole}</span>
                                            <span style={{ fontSize: 11, color: '#C8C7C3' }}>{formatTime(msg.timestamp)}</span>
                                        </div>
                                    )}
                                    <p style={{
                                        margin: 0, fontSize: 14, lineHeight: 1.6, color: '#37352F',
                                    }}>
                                        {msg.content}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Composer */}
                <div style={{ padding: '12px 24px 16px', borderTop: '1px solid #E9E9E7' }}>
                    <div style={{
                        display: 'flex', gap: 8, alignItems: 'flex-end',
                        background: '#F7F6F3', borderRadius: 8, padding: '8px 12px',
                        border: '1px solid #E9E9E7',
                    }}>
                        <textarea
                            value={draft}
                            onChange={e => setDraft(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            placeholder="Type a message..."
                            rows={1}
                            style={{
                                flex: 1, border: 'none', background: 'transparent', resize: 'none',
                                fontSize: 14, fontFamily: font, outline: 'none', color: '#37352F',
                                lineHeight: 1.5, padding: '4px 0',
                            }}
                        />
                        {/* Attach button */}
                        <button style={{
                            background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                            color: '#9B9A97', display: 'flex',
                        }}>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M15.5 8.5L9.5 14.5C8.17 15.83 6 15.83 4.67 14.5C3.34 13.17 3.34 11 4.67 9.67L10.67 3.67C11.44 2.9 12.69 2.9 13.46 3.67C14.23 4.44 14.23 5.69 13.46 6.46L7.46 12.46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                        {/* Send button */}
                        <button
                            onClick={handleSend}
                            disabled={!draft.trim()}
                            style={{
                                background: draft.trim() ? '#37352F' : '#D3D1CB',
                                color: 'white', border: 'none', borderRadius: 4,
                                padding: '6px 14px', fontSize: 13, fontWeight: 500,
                                cursor: draft.trim() ? 'pointer' : 'default',
                                transition: 'background 0.15s',
                            }}
                        >
                            Send
                        </button>
                    </div>
                    <div style={{ fontSize: 11, color: '#C8C7C3', marginTop: 6, textAlign: 'center' }}>
                        Press Enter to send, Shift+Enter for new line
                    </div>
                </div>
            </div>
        </div>
    );
}
