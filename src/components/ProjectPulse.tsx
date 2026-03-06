'use client';

import React from 'react';
import { User, Camera, FileText, CheckCircle2, MessageSquare, AlertCircle, Clock } from 'lucide-react';

export interface PulseEvent {
    id: string;
    type: 'PHOTO' | 'DOC' | 'IFC_STATUS' | 'PAYMENT' | 'MESSAGE' | 'CHECKIN';
    user: {
        name: string;
        role: string;
        avatar?: string;
    };
    description: string;
    timestamp: string;
    metadata?: {
        photoUrl?: string;
        status?: string;
        amount?: number;
    };
}

const PULSE_ICONS = {
    PHOTO: <Camera className="w-4 h-4 text-notion-blue" />,
    DOC: <FileText className="w-4 h-4 text-notion-text-gray" />,
    IFC_STATUS: <Clock className="w-4 h-4 text-notion-orange" />,
    PAYMENT: <CheckCircle2 className="w-4 h-4 text-notion-green" />,
    MESSAGE: <MessageSquare className="w-4 h-4 text-notion-blue" />,
    CHECKIN: <AlertCircle className="w-4 h-4 text-notion-red" />,
};

interface ProjectPulseProps {
    events: PulseEvent[];
}

export function ProjectPulse({ events }: ProjectPulseProps) {
    return (
        <div className="notion-card bg-white" style={{ border: '1px solid var(--notion-border)', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="p-4 border-b bg-notion-bg-secondary flex justify-between items-center" style={{ borderBottom: '1px solid var(--notion-border)' }}>
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Project Pulse
                </h3>
                <span className="text-[10px] uppercase font-bold text-notion-text-gray tracking-wider">Live</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {events.map((event) => (
                    <div key={event.id} className="relative pl-6 group">
                        {/* Timeline Connector */}
                        <div className="absolute left-[7px] top-[24px] bottom-[-24px] w-[1px] bg-notion-border group-last:hidden" />

                        {/* Event Icon Dot */}
                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white border border-notion-border flex items-center justify-center z-10 shadow-sm">
                            {PULSE_ICONS[event.type]}
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[11px] text-notion-text-gray font-medium">
                                <span className="text-notion-text font-bold">{event.user.name}</span>
                                <span>•</span>
                                <span className="uppercase text-[9px] tracking-tighter opacity-70">{event.user.role}</span>
                                <span>•</span>
                                <span>{event.timestamp}</span>
                            </div>

                            <p className="text-sm leading-relaxed text-notion-text">
                                {event.description}
                            </p>

                            {event.metadata?.photoUrl && (
                                <div className="mt-2 rounded-lg overflow-hidden border border-notion-border bg-notion-hover cursor-pointer hover:opacity-90 transition-opacity">
                                    <img
                                        src={event.metadata.photoUrl}
                                        alt="Pulse Asset"
                                        className="w-full h-32 object-cover"
                                    />
                                </div>
                            )}

                            {event.type === 'IFC_STATUS' && event.metadata?.status && (
                                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-notion-bg-secondary border border-notion-border text-[11px] font-medium text-notion-orange">
                                    <Clock className="w-3 h-3" />
                                    {event.metadata.status}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 border-t bg-notion-bg-secondary" style={{ borderTop: '1px solid var(--notion-border)' }}>
                <button className="w-full py-2 text-xs font-medium text-notion-text-gray hover:bg-notion-hover rounded border border-transparent hover:border-notion-border transition-all">
                    View Activity Log
                </button>
            </div>
        </div>
    );
}
