'use client';

import React, { useState, useRef, useEffect } from 'react';
import RoofNav from '@/components/RoofNav';
import RatingModal, { CRITERIA } from '@/components/RatingModal';
import { Send, Hash, Users, Calendar, MapPin, Clock, Plus, Search, Paperclip, ChevronRight, Video, Bell, Star, Check, Folder, FileText, Image, File, Download, Eye } from 'lucide-react';

// ============================================================
// TEAM HUB — DingTalk-style workspace: Chat + Calendar + Events
// ============================================================

type HubView = 'chat' | 'calendar' | 'events' | 'files';

interface SharedFile {
    id: string;
    name: string;
    type: 'pdf' | 'dwg' | 'image' | 'doc' | 'sheet';
    size: string;
    project: string;
    uploadedBy: string;
    uploadedAt: string;
    version: number;
}

const FILE_TYPE_CFG = {
    pdf: { color: '#DC2626', bg: '#FEF2F2', icon: FileText },
    dwg: { color: '#3B82F6', bg: '#EFF6FF', icon: File },
    image: { color: '#22C55E', bg: '#F0FDF4', icon: Image },
    doc: { color: '#7C3AED', bg: '#F5F3FF', icon: FileText },
    sheet: { color: '#16A34A', bg: '#F0FDF4', icon: FileText },
};

const PROJECT_FOLDERS = [
    { id: 'all', name: 'All Files', count: 20 },
    { id: 'tan', name: 'Tan Residence', count: 5 },
    { id: 'lim', name: 'Lim BTO', count: 3 },
    { id: 'wong', name: 'Wong Condo', count: 2 },
    { id: 'chen', name: 'Chen Landed', count: 2 },
    { id: 'templates', name: 'Templates', count: 4 },
    { id: 'certs', name: 'Company Certs', count: 8 },
];

const DEMO_FILES: SharedFile[] = [
    { id: 'F1', name: 'Kitchen_Elevation_v3.dwg', type: 'dwg', size: '2.4 MB', project: 'tan', uploadedBy: 'Alex Ong', uploadedAt: '2h ago', version: 3 },
    { id: 'F2', name: 'Client_Deck_Final.pdf', type: 'pdf', size: '8.1 MB', project: 'tan', uploadedBy: 'Jenny Lee', uploadedAt: '3h ago', version: 2 },
    { id: 'F3', name: 'Site_Survey_Photos.zip', type: 'image', size: '45 MB', project: 'tan', uploadedBy: 'Ahmad Shah', uploadedAt: '1d ago', version: 1 },
    { id: 'F4', name: 'Floor_Plan_Final.dwg', type: 'dwg', size: '1.8 MB', project: 'tan', uploadedBy: 'Alex Ong', uploadedAt: '2d ago', version: 4 },
    { id: 'F5', name: 'Material_Schedule.xlsx', type: 'sheet', size: '340 KB', project: 'tan', uploadedBy: 'Jenny Lee', uploadedAt: '3d ago', version: 2 },
    { id: 'F6', name: 'BTO_Layout_Plan.dwg', type: 'dwg', size: '1.2 MB', project: 'lim', uploadedBy: 'Alex Ong', uploadedAt: '1d ago', version: 2 },
    { id: 'F7', name: 'Lim_Quotation_v2.pdf', type: 'pdf', size: '520 KB', project: 'lim', uploadedBy: 'Bjorn Tan', uploadedAt: '2d ago', version: 2 },
    { id: 'F8', name: 'Mood_Board_Living.pdf', type: 'pdf', size: '12 MB', project: 'lim', uploadedBy: 'Jenny Lee', uploadedAt: '4d ago', version: 1 },
    { id: 'F9', name: 'Condo_Electrical.dwg', type: 'dwg', size: '980 KB', project: 'wong', uploadedBy: 'Alex Ong', uploadedAt: '3d ago', version: 1 },
    { id: 'F10', name: 'Wong_Contract.pdf', type: 'pdf', size: '1.1 MB', project: 'wong', uploadedBy: 'Michelle Ng', uploadedAt: '5d ago', version: 1 },
    { id: 'F11', name: 'Chen_Concept_Render.jpg', type: 'image', size: '3.4 MB', project: 'chen', uploadedBy: 'Jenny Lee', uploadedAt: '1d ago', version: 1 },
    { id: 'F12', name: 'Chen_Brief_Notes.docx', type: 'doc', size: '120 KB', project: 'chen', uploadedBy: 'Bjorn Tan', uploadedAt: '6d ago', version: 1 },
    // Company Certifications
    { id: 'C1', name: 'HDB_Renovation_License.pdf', type: 'pdf', size: '1.4 MB', project: 'certs', uploadedBy: 'Bjorn Tan', uploadedAt: '15 Jan', version: 1 },
    { id: 'C2', name: 'BizSAFE_Level3_Certificate.pdf', type: 'pdf', size: '820 KB', project: 'certs', uploadedBy: 'Bjorn Tan', uploadedAt: '10 Feb', version: 1 },
    { id: 'C3', name: 'BCA_Contractor_License_CW02.pdf', type: 'pdf', size: '950 KB', project: 'certs', uploadedBy: 'Bjorn Tan', uploadedAt: '5 Jan', version: 2 },
    { id: 'C4', name: 'Public_Liability_Insurance_AIG.pdf', type: 'pdf', size: '2.1 MB', project: 'certs', uploadedBy: 'Michelle Ng', uploadedAt: '20 Jan', version: 1 },
    { id: 'C5', name: 'CPF_Registration_Confirmation.pdf', type: 'pdf', size: '340 KB', project: 'certs', uploadedBy: 'Michelle Ng', uploadedAt: '3 Jan', version: 1 },
    { id: 'C6', name: 'GST_Registration_Certificate.pdf', type: 'pdf', size: '280 KB', project: 'certs', uploadedBy: 'Michelle Ng', uploadedAt: '3 Jan', version: 1 },
    { id: 'C7', name: 'ACRA_BizFile_2026.pdf', type: 'pdf', size: '520 KB', project: 'certs', uploadedBy: 'Bjorn Tan', uploadedAt: '2 Jan', version: 1 },
    { id: 'C8', name: 'Work_Injury_Comp_NTUC.pdf', type: 'pdf', size: '1.8 MB', project: 'certs', uploadedBy: 'Michelle Ng', uploadedAt: '15 Jan', version: 1 },
];

interface Message {
    id: string;
    sender: string;
    initials: string;
    color: string;
    text: string;
    time: string;
    channel: string;
    isSystem?: boolean;
}

interface Meeting {
    id: string;
    title: string;
    date: string;
    time: string;
    duration: string;
    location: string;
    attendees: string[];
    type: 'site_visit' | 'client_meet' | 'internal' | 'showroom' | 'vendor';
    status: 'upcoming' | 'in_progress' | 'completed';
}

interface CompanyEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    type: 'showroom' | 'training' | 'team_outing' | 'trade_fair' | 'supplier_visit';
    description: string;
    rsvp: number;
    capacity: number;
    organizer: string;
}

const CHANNELS = [
    { id: 'general', name: 'General', unread: 2 },
    { id: 'design', name: 'Design Team', unread: 0 },
    { id: 'site', name: 'Site Updates', unread: 5 },
    { id: 'vendor', name: 'Vendor Comms', unread: 1 },
    { id: 'urgent', name: 'Urgent', unread: 0 },
];

const DM_CONTACTS = [
    { id: 'bjorn', name: 'Bjorn Tan', initials: 'BT', color: '#6366F1', status: 'online' },
    { id: 'jenny', name: 'Jenny Lee', initials: 'JL', color: '#EC4899', status: 'online' },
    { id: 'alex', name: 'Alex Ong', initials: 'AO', color: '#3B82F6', status: 'away' },
    { id: 'ahmad', name: 'Ahmad Shah', initials: 'AS', color: '#22C55E', status: 'offline' },
    { id: 'michelle', name: 'Michelle Ng', initials: 'MN', color: '#F59E0B', status: 'online' },
];

const DEMO_MESSAGES: Message[] = [
    { id: 'M1', sender: 'Bjorn Tan', initials: 'BT', color: '#6366F1', text: 'Kitchen tile samples just arrived from Hafary. Looks really good. Will bring to the site tomorrow morning.', time: '9:42 AM', channel: 'general' },
    { id: 'M2', sender: 'Jenny Lee', initials: 'JL', color: '#EC4899', text: 'Client deck for Tan Residence is ready for review. I uploaded it to Sequence under Client Deck section.', time: '10:15 AM', channel: 'general' },
    { id: 'M3', sender: 'System', initials: '', color: '', text: 'Ahmad Shah marked ISS-001 (Uneven wall in master bath) as resolved', time: '10:30 AM', channel: 'general', isSystem: true },
    { id: 'M4', sender: 'Alex Ong', initials: 'AO', color: '#3B82F6', text: 'DWG-002 Kitchen Elevation revision done. Can someone review?', time: '10:45 AM', channel: 'design' },
    { id: 'M5', sender: 'Bjorn Tan', initials: 'BT', color: '#6366F1', text: 'Looking at it now. Give me 20 mins.', time: '10:48 AM', channel: 'design' },
    { id: 'M6', sender: 'Ahmad Shah', initials: 'AS', color: '#22C55E', text: 'Tiling at Tan Residence 60% done. On track for completion by Friday. Photos uploaded.', time: '11:00 AM', channel: 'site' },
    { id: 'M7', sender: 'Michelle Ng', initials: 'MN', color: '#F59E0B', text: 'Hock Seng confirmed delivery for the quartz countertop on Thursday. They need someone on site to receive.', time: '11:15 AM', channel: 'vendor' },
    { id: 'M8', sender: 'Jenny Lee', initials: 'JL', color: '#EC4899', text: 'New lead just came in from Qanvast. HDB Punggol, budget $40-50k. I assigned to Follow-Up.', time: '11:30 AM', channel: 'general' },
    { id: 'M9', sender: 'System', initials: '', color: '', text: 'Meeting reminder: Lim BTO - Client presentation at 2:00 PM today', time: '1:00 PM', channel: 'general', isSystem: true },
    { id: 'M10', sender: 'Bjorn Tan', initials: 'BT', color: '#6366F1', text: 'Alex, the backsplash height on DWG-002 should be 600mm not 500mm. Please revise.', time: '11:05 AM', channel: 'design' },
];

const DEMO_MEETINGS: Meeting[] = [
    { id: 'MT1', title: 'Tan Residence - Site Inspection', date: '2026-03-08', time: '09:00', duration: '1h', location: 'Clementi Ave 6, #08-12', attendees: ['Bjorn', 'Ahmad'], type: 'site_visit', status: 'completed' },
    { id: 'MT2', title: 'Lim BTO - Client Presentation', date: '2026-03-08', time: '14:00', duration: '1.5h', location: 'Studio (Ubi)', attendees: ['Bjorn', 'Jenny', 'Client'], type: 'client_meet', status: 'upcoming' },
    { id: 'MT3', title: 'Weekly Design Review', date: '2026-03-08', time: '16:30', duration: '45m', location: 'Studio (Ubi)', attendees: ['Bjorn', 'Jenny', 'Alex'], type: 'internal', status: 'upcoming' },
    { id: 'MT4', title: 'Hafary Tile Showroom Visit', date: '2026-03-09', time: '10:00', duration: '2h', location: 'Hafary Gallery, Tai Seng', attendees: ['Jenny', 'Client (Wong)'], type: 'showroom', status: 'upcoming' },
    { id: 'MT5', title: 'Hock Seng Quartz Selection', date: '2026-03-10', time: '11:00', duration: '1h', location: 'Hock Seng HQ, Defu Lane', attendees: ['Bjorn'], type: 'vendor', status: 'upcoming' },
    { id: 'MT6', title: 'Chen Landed - Concept Presentation', date: '2026-03-10', time: '15:00', duration: '2h', location: 'Client Home, Siglap', attendees: ['Jenny', 'Client'], type: 'client_meet', status: 'upcoming' },
    { id: 'MT7', title: 'TBM Sanitary Fitting Review', date: '2026-03-11', time: '09:30', duration: '1.5h', location: 'TBM Showroom, Kaki Bukit', attendees: ['Bjorn', 'Alex'], type: 'showroom', status: 'upcoming' },
];

const DEMO_EVENTS: CompanyEvent[] = [
    { id: 'E1', title: 'Hafary New Collection Preview', date: '2026-03-12', time: '10:00 AM', location: 'Hafary Gallery, Tai Seng', type: 'showroom', description: 'Exclusive preview of the Spring 2026 Italian tile collection. Complimentary lunch included. RSVP required.', rsvp: 4, capacity: 8, organizer: 'Jenny' },
    { id: 'E2', title: 'AutoCAD Advanced Workshop', date: '2026-03-15', time: '09:00 AM', location: 'Studio (Ubi)', type: 'training', description: 'Internal training on advanced AutoCAD techniques: dynamic blocks, custom linetypes, and sheet sets. For drafters and designers.', rsvp: 3, capacity: 6, organizer: 'Alex' },
    { id: 'E3', title: 'Team Lunch @ Lau Pa Sat', date: '2026-03-14', time: '12:00 PM', location: 'Lau Pa Sat, Raffles Quay', type: 'team_outing', description: 'Monthly team lunch. Company-sponsored. Partners welcome.', rsvp: 5, capacity: 10, organizer: 'Michelle' },
    { id: 'E4', title: 'BCA Expo 2026', date: '2026-03-20', time: '10:00 AM', location: 'Sands Expo, MBS', type: 'trade_fair', description: 'Annual Building & Construction Authority trade fair. New materials, technology demos, industry networking. Full-day event.', rsvp: 3, capacity: 6, organizer: 'Bjorn' },
    { id: 'E5', title: 'Kitchen Culture Appliance Tour', date: '2026-03-18', time: '02:00 PM', location: 'Kitchen Culture, Dempsey', type: 'supplier_visit', description: 'Private tour of Kitchen Culture showroom. Meeting with their project consultant for bulk pricing discussion.', rsvp: 2, capacity: 4, organizer: 'Jenny' },
];

const MEETING_TYPE_CFG = {
    site_visit: { color: '#22C55E', bg: '#F0FDF4', label: 'Site Visit' },
    client_meet: { color: '#3B82F6', bg: '#EFF6FF', label: 'Client' },
    internal: { color: '#6B6A67', bg: '#F7F6F3', label: 'Internal' },
    showroom: { color: '#F59E0B', bg: '#FEF9C3', label: 'Showroom' },
    vendor: { color: '#8B5CF6', bg: '#F5F3FF', label: 'Vendor' },
};

const EVENT_TYPE_CFG = {
    showroom: { color: '#F59E0B', bg: '#FEF9C3', label: 'Showroom' },
    training: { color: '#3B82F6', bg: '#EFF6FF', label: 'Training' },
    team_outing: { color: '#EC4899', bg: '#FDF2F8', label: 'Team' },
    trade_fair: { color: '#22C55E', bg: '#F0FDF4', label: 'Trade Fair' },
    supplier_visit: { color: '#8B5CF6', bg: '#F5F3FF', label: 'Supplier' },
};

export default function TeamHub() {
    const [view, setView] = useState<HubView>('chat');
    const [activeFolder, setActiveFolder] = useState('all');
    const [activeChannel, setActiveChannel] = useState('general');
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState(DEMO_MESSAGES);
    const [searchQuery, setSearchQuery] = useState('');
    const [ratingTarget, setRatingTarget] = useState<{ name: string; role: string } | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    const channelMessages = messages.filter(m => m.channel === activeChannel);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [channelMessages.length]);

    const sendMessage = () => {
        if (!newMessage.trim()) return;
        const msg: Message = {
            id: `M${Date.now()}`,
            sender: 'You',
            initials: 'ME',
            color: '#37352F',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            channel: activeChannel,
        };
        setMessages(prev => [...prev, msg]);
        setNewMessage('');
    };

    const today = '2026-03-08';
    const todayMeetings = DEMO_MEETINGS.filter(m => m.date === today);
    const upcomingMeetings = DEMO_MEETINGS.filter(m => m.date > today).slice(0, 5);
    const filteredFiles = activeFolder === 'all' ? DEMO_FILES : DEMO_FILES.filter(f2 => f2.project === activeFolder);

    return (
        <>
            <div style={{ fontFamily: f, minHeight: '100vh', background: '#FAFAF9' }}>
                <RoofNav />
                <div style={{ display: 'flex', height: 'calc(100vh - 48px)' }}>

                    {/* ===== LEFT SIDEBAR ===== */}
                    <div style={{ width: 260, background: '#F7F6F3', borderRight: '1px solid #E9E9E7', display: 'flex', flexDirection: 'column' }}>
                        {/* View Tabs */}
                        <div style={{ display: 'flex', borderBottom: '1px solid #E9E9E7' }}>
                            {([
                                { id: 'chat' as HubView, label: 'Chat', icon: Hash },
                                { id: 'calendar' as HubView, label: 'Schedule', icon: Calendar },
                                { id: 'events' as HubView, label: 'Events', icon: Star },
                                { id: 'files' as HubView, label: 'Files', icon: Folder },
                            ]).map(tab => (
                                <button key={tab.id} onClick={() => setView(tab.id)} style={{
                                    flex: 1, padding: '12px 0', fontSize: 10, fontWeight: 700, border: 'none', cursor: 'pointer',
                                    fontFamily: f, textTransform: 'uppercase', letterSpacing: '0.06em',
                                    background: view === tab.id ? 'white' : 'transparent',
                                    color: view === tab.id ? '#37352F' : '#9B9A97',
                                    borderBottom: view === tab.id ? '2px solid #37352F' : '2px solid transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                                }}>
                                    <tab.icon style={{ width: 12, height: 12 }} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {view === 'chat' && (
                            <div style={{ flex: 1, overflow: 'auto', padding: '10px 0' }}>
                                {/* Search */}
                                <div style={{ padding: '0 12px', marginBottom: 10 }}>
                                    <div style={{ position: 'relative' }}>
                                        <Search style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, color: '#D4D3D0' }} />
                                        <input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                            style={{ width: '100%', padding: '7px 8px 7px 28px', fontSize: 11, border: '1px solid #E9E9E7', borderRadius: 6, fontFamily: f, outline: 'none', background: 'white', boxSizing: 'border-box' }} />
                                    </div>
                                </div>

                                {/* Channels */}
                                <div style={{ padding: '0 8px' }}>
                                    <div style={{ fontSize: 9, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 8px' }}>Channels</div>
                                    {CHANNELS.map(ch => (
                                        <button key={ch.id} onClick={() => setActiveChannel(ch.id)} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                                            padding: '7px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                                            background: activeChannel === ch.id ? 'white' : 'transparent',
                                            fontFamily: f, textAlign: 'left',
                                            boxShadow: activeChannel === ch.id ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Hash style={{ width: 12, height: 12, color: activeChannel === ch.id ? '#37352F' : '#9B9A97' }} />
                                                <span style={{ fontSize: 12, fontWeight: activeChannel === ch.id ? 700 : 500, color: activeChannel === ch.id ? '#37352F' : '#6B6A67' }}>{ch.name}</span>
                                            </div>
                                            {ch.unread > 0 && (
                                                <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 10, background: '#37352F', color: 'white' }}>{ch.unread}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Direct Messages */}
                                <div style={{ padding: '0 8px', marginTop: 14 }}>
                                    <div style={{ fontSize: 9, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 8px' }}>Direct Messages</div>
                                    {DM_CONTACTS.map(dm => (
                                        <button key={dm.id} onClick={() => setActiveChannel(dm.id)} style={{
                                            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                                            padding: '6px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                                            background: activeChannel === dm.id ? 'white' : 'transparent',
                                            fontFamily: f, textAlign: 'left',
                                        }}>
                                            <div style={{ position: 'relative' }}>
                                                <div style={{
                                                    width: 24, height: 24, borderRadius: '50%', background: dm.color,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 8, fontWeight: 800, color: 'white',
                                                }}>{dm.initials}</div>
                                                <div style={{
                                                    position: 'absolute', bottom: -1, right: -1, width: 8, height: 8, borderRadius: '50%',
                                                    border: '2px solid #F7F6F3',
                                                    background: dm.status === 'online' ? '#22C55E' : dm.status === 'away' ? '#F59E0B' : '#D4D3D0',
                                                }} />
                                            </div>
                                            <span style={{ fontSize: 12, fontWeight: activeChannel === dm.id ? 700 : 500, color: activeChannel === dm.id ? '#37352F' : '#6B6A67', flex: 1 }}>{dm.name}</span>
                                            <button onClick={(e) => { e.stopPropagation(); setRatingTarget({ name: dm.name, role: dm.id === 'alex' ? 'Drafter' : dm.id === 'ahmad' ? 'Contractor' : 'Team Member' }); }} style={{
                                                padding: '2px 6px', fontSize: 8, fontWeight: 700, borderRadius: 4,
                                                background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A',
                                                cursor: 'pointer', fontFamily: f, opacity: 0.7,
                                            }} title="Rate this person">🔒</button>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {view === 'calendar' && (
                            <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#37352F', marginBottom: 10 }}>Today</div>
                                {todayMeetings.length === 0 && <div style={{ fontSize: 11, color: '#9B9A97', padding: 10 }}>No meetings today</div>}
                                {todayMeetings.map(m => {
                                    const cfg = MEETING_TYPE_CFG[m.type];
                                    return (
                                        <div key={m.id} style={{
                                            background: 'white', borderRadius: 8, padding: 10, marginBottom: 6,
                                            borderLeft: `3px solid ${cfg.color}`, cursor: 'pointer',
                                        }}>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: '#37352F' }}>{m.title}</div>
                                            <div style={{ fontSize: 10, color: '#9B9A97', marginTop: 2 }}>{m.time} · {m.duration}</div>
                                        </div>
                                    );
                                })}
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#37352F', marginTop: 14, marginBottom: 10 }}>Upcoming</div>
                                {upcomingMeetings.map(m => {
                                    const cfg = MEETING_TYPE_CFG[m.type];
                                    return (
                                        <div key={m.id} style={{
                                            background: 'white', borderRadius: 8, padding: 10, marginBottom: 6,
                                            borderLeft: `3px solid ${cfg.color}`, cursor: 'pointer',
                                        }}>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: '#37352F' }}>{m.title}</div>
                                            <div style={{ fontSize: 10, color: '#9B9A97', marginTop: 2 }}>{m.date.slice(5)} · {m.time} · {m.duration}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {view === 'events' && (
                            <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#37352F', marginBottom: 10 }}>Company Events</div>
                                {DEMO_EVENTS.map(ev => {
                                    const cfg = EVENT_TYPE_CFG[ev.type];
                                    return (
                                        <div key={ev.id} style={{
                                            background: 'white', borderRadius: 8, padding: 10, marginBottom: 6,
                                            borderLeft: `3px solid ${cfg.color}`, cursor: 'pointer',
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: 11, fontWeight: 700, color: '#37352F' }}>{ev.title}</span>
                                                <span style={{ fontSize: 8, padding: '2px 6px', borderRadius: 4, background: cfg.bg, color: cfg.color, fontWeight: 700 }}>{cfg.label}</span>
                                            </div>
                                            <div style={{ fontSize: 10, color: '#9B9A97', marginTop: 2 }}>{ev.date.slice(5)} · {ev.time}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {view === 'files' && (
                            <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#37352F', marginBottom: 10 }}>Project Folders</div>
                                {PROJECT_FOLDERS.map(pf => (
                                    <button key={pf.id} onClick={() => setActiveFolder(pf.id)} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                                        padding: '7px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                                        background: activeFolder === pf.id ? 'white' : 'transparent',
                                        fontFamily: f, textAlign: 'left',
                                        boxShadow: activeFolder === pf.id ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Folder style={{ width: 12, height: 12, color: activeFolder === pf.id ? '#F59E0B' : '#9B9A97' }} />
                                            <span style={{ fontSize: 12, fontWeight: activeFolder === pf.id ? 700 : 500, color: activeFolder === pf.id ? '#37352F' : '#6B6A67' }}>{pf.name}</span>
                                        </div>
                                        <span style={{ fontSize: 9, color: '#9B9A97' }}>{pf.count}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ===== MAIN CONTENT ===== */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {view === 'chat' && (
                            <>
                                {/* Chat Header */}
                                <div style={{
                                    padding: '12px 20px', borderBottom: '1px solid #E9E9E7', background: 'white',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Hash style={{ width: 14, height: 14, color: '#9B9A97' }} />
                                            <span style={{ fontSize: 14, fontWeight: 700, color: '#37352F' }}>
                                                {CHANNELS.find(c => c.id === activeChannel)?.name || DM_CONTACTS.find(d => d.id === activeChannel)?.name || activeChannel}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button style={{ padding: '6px 12px', fontSize: 10, fontWeight: 600, borderRadius: 6, border: '1px solid #E9E9E7', background: 'white', cursor: 'pointer', fontFamily: f, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Video style={{ width: 12, height: 12 }} /> Call
                                        </button>
                                        <button style={{ padding: '6px 12px', fontSize: 10, fontWeight: 600, borderRadius: 6, border: '1px solid #E9E9E7', background: 'white', cursor: 'pointer', fontFamily: f, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Users style={{ width: 12, height: 12 }} /> Members
                                        </button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
                                    {channelMessages.map(msg => (
                                        <div key={msg.id} style={{ marginBottom: 16, display: 'flex', gap: 10 }}>
                                            {msg.isSystem ? (
                                                <div style={{ width: '100%', textAlign: 'center', padding: '8px 0' }}>
                                                    <span style={{ fontSize: 10, color: '#9B9A97', background: '#F7F6F3', padding: '4px 12px', borderRadius: 10 }}>{msg.text}</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <div style={{
                                                        width: 32, height: 32, borderRadius: '50%', background: msg.color, flexShrink: 0,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: 9, fontWeight: 800, color: 'white',
                                                    }}>{msg.initials}</div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                                                            <span style={{ fontSize: 12, fontWeight: 700, color: '#37352F' }}>{msg.sender}</span>
                                                            <span style={{ fontSize: 9, color: '#D4D3D0' }}>{msg.time}</span>
                                                        </div>
                                                        <p style={{ fontSize: 12, color: '#37352F', margin: '3px 0 0', lineHeight: 1.5 }}>{msg.text}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Message Input */}
                                <div style={{ padding: '12px 20px', borderTop: '1px solid #E9E9E7', background: 'white' }}>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #E9E9E7', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Paperclip style={{ width: 14, height: 14, color: '#9B9A97' }} />
                                        </button>
                                        <input
                                            value={newMessage}
                                            onChange={e => setNewMessage(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                                            placeholder={`Message #${CHANNELS.find(c => c.id === activeChannel)?.name || activeChannel}...`}
                                            style={{
                                                flex: 1, padding: '8px 14px', fontSize: 12, border: '1px solid #E9E9E7',
                                                borderRadius: 8, fontFamily: f, outline: 'none', boxSizing: 'border-box',
                                            }}
                                        />
                                        <button onClick={sendMessage} style={{
                                            width: 36, height: 36, borderRadius: 8, border: 'none',
                                            background: newMessage.trim() ? '#37352F' : '#E9E9E7', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'background 0.15s',
                                        }}>
                                            <Send style={{ width: 14, height: 14, color: newMessage.trim() ? 'white' : '#9B9A97' }} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {view === 'calendar' && (
                            <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                    <div>
                                        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#37352F', margin: '0 0 4px' }}>Schedule</h2>
                                        <p style={{ fontSize: 11, color: '#9B9A97', margin: 0 }}>Meetings, site visits, showroom trips</p>
                                    </div>
                                    <button style={{
                                        padding: '8px 16px', fontSize: 11, fontWeight: 700, borderRadius: 8, border: 'none',
                                        background: '#37352F', color: 'white', cursor: 'pointer', fontFamily: f,
                                        display: 'flex', alignItems: 'center', gap: 4,
                                    }}>
                                        <Plus style={{ width: 12, height: 12 }} /> New Meeting
                                    </button>
                                </div>

                                {/* Today's Schedule */}
                                <div style={{ marginBottom: 24 }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Today — {today}</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {todayMeetings.map(m => {
                                            const cfg = MEETING_TYPE_CFG[m.type];
                                            return (
                                                <div key={m.id} style={{
                                                    background: 'white', borderRadius: 12, padding: 16, border: '1px solid #E9E9E7',
                                                    borderLeft: `4px solid ${cfg.color}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    transition: 'box-shadow 0.2s', cursor: 'pointer',
                                                }}
                                                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)')}
                                                    onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                                                >
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                            <span style={{ fontSize: 14, fontWeight: 700, color: '#37352F' }}>{m.title}</span>
                                                            <span style={{ fontSize: 8, padding: '2px 8px', borderRadius: 10, fontWeight: 700, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                                                            {m.status === 'completed' && <span style={{ fontSize: 8, padding: '2px 8px', borderRadius: 10, fontWeight: 700, background: '#F0FDF4', color: '#22C55E' }}>Done</span>}
                                                        </div>
                                                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                                            <span style={{ fontSize: 11, color: '#6B6A67', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                <Clock style={{ width: 11, height: 11 }} /> {m.time} ({m.duration})
                                                            </span>
                                                            <span style={{ fontSize: 11, color: '#6B6A67', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                <MapPin style={{ width: 11, height: 11 }} /> {m.location}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: -4 }}>
                                                        {m.attendees.map((a, i) => (
                                                            <div key={a} style={{
                                                                width: 28, height: 28, borderRadius: '50%', background: ['#6366F1', '#EC4899', '#3B82F6', '#22C55E', '#F59E0B'][i % 5],
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                fontSize: 8, fontWeight: 800, color: 'white', border: '2px solid white',
                                                                marginLeft: i > 0 ? -8 : 0,
                                                            }}>{a.charAt(0)}</div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Upcoming */}
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Upcoming</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {upcomingMeetings.map(m => {
                                            const cfg = MEETING_TYPE_CFG[m.type];
                                            return (
                                                <div key={m.id} style={{
                                                    background: 'white', borderRadius: 12, padding: 16, border: '1px solid #E9E9E7',
                                                    borderLeft: `4px solid ${cfg.color}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    cursor: 'pointer', transition: 'box-shadow 0.2s',
                                                }}
                                                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)')}
                                                    onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                                                >
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                            <span style={{ fontSize: 14, fontWeight: 700, color: '#37352F' }}>{m.title}</span>
                                                            <span style={{ fontSize: 8, padding: '2px 8px', borderRadius: 10, fontWeight: 700, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                                            <span style={{ fontSize: 11, color: '#6B6A67', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                <Calendar style={{ width: 11, height: 11 }} /> {m.date.slice(5)}
                                                            </span>
                                                            <span style={{ fontSize: 11, color: '#6B6A67', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                <Clock style={{ width: 11, height: 11 }} /> {m.time} ({m.duration})
                                                            </span>
                                                            <span style={{ fontSize: 11, color: '#6B6A67', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                <MapPin style={{ width: 11, height: 11 }} /> {m.location}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: -4 }}>
                                                        {m.attendees.slice(0, 3).map((a, i) => (
                                                            <div key={a} style={{
                                                                width: 28, height: 28, borderRadius: '50%', background: ['#6366F1', '#EC4899', '#3B82F6', '#22C55E', '#F59E0B'][i % 5],
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                fontSize: 8, fontWeight: 800, color: 'white', border: '2px solid white',
                                                                marginLeft: i > 0 ? -8 : 0,
                                                            }}>{a.charAt(0)}</div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {view === 'events' && (
                            <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                    <div>
                                        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#37352F', margin: '0 0 4px' }}>Company Events</h2>
                                        <p style={{ fontSize: 11, color: '#9B9A97', margin: 0 }}>Showroom visits, training, team outings, trade fairs</p>
                                    </div>
                                    <button style={{
                                        padding: '8px 16px', fontSize: 11, fontWeight: 700, borderRadius: 8, border: 'none',
                                        background: '#37352F', color: 'white', cursor: 'pointer', fontFamily: f,
                                        display: 'flex', alignItems: 'center', gap: 4,
                                    }}>
                                        <Plus style={{ width: 12, height: 12 }} /> Create Event
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 12 }}>
                                    {DEMO_EVENTS.map(ev => {
                                        const cfg = EVENT_TYPE_CFG[ev.type];
                                        const rsvpPct = ev.capacity > 0 ? (ev.rsvp / ev.capacity * 100) : 0;
                                        return (
                                            <div key={ev.id} style={{
                                                background: 'white', borderRadius: 14, padding: 18, border: '1px solid #E9E9E7',
                                                borderTop: `3px solid ${cfg.color}`, cursor: 'pointer', transition: 'all 0.2s',
                                            }}
                                                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)')}
                                                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                                    <span style={{ fontSize: 8, padding: '3px 10px', borderRadius: 10, fontWeight: 700, background: cfg.bg, color: cfg.color, textTransform: 'uppercase' }}>{cfg.label}</span>
                                                    <span style={{ fontSize: 10, color: '#9B9A97' }}>by {ev.organizer}</span>
                                                </div>

                                                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#37352F', margin: '0 0 6px' }}>{ev.title}</h3>
                                                <p style={{ fontSize: 11, color: '#6B6A67', margin: '0 0 12px', lineHeight: 1.5 }}>{ev.description}</p>

                                                <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                                                    <span style={{ fontSize: 11, color: '#6B6A67', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <Calendar style={{ width: 11, height: 11 }} /> {ev.date.slice(5)} · {ev.time}
                                                    </span>
                                                    <span style={{ fontSize: 11, color: '#6B6A67', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <MapPin style={{ width: 11, height: 11 }} /> {ev.location}
                                                    </span>
                                                </div>

                                                {/* RSVP Bar */}
                                                <div style={{ marginBottom: 10 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                        <span style={{ fontSize: 10, color: '#9B9A97' }}>RSVP</span>
                                                        <span style={{ fontSize: 10, fontWeight: 700, color: '#37352F' }}>{ev.rsvp}/{ev.capacity} spots</span>
                                                    </div>
                                                    <div style={{ height: 4, background: '#F5F5F4', borderRadius: 2, overflow: 'hidden' }}>
                                                        <div style={{ height: '100%', borderRadius: 2, background: cfg.color, width: `${rsvpPct}%`, transition: 'width 0.5s' }} />
                                                    </div>
                                                </div>

                                                <button style={{
                                                    width: '100%', padding: '8px', fontSize: 11, fontWeight: 700, borderRadius: 8,
                                                    border: `1px solid ${cfg.color}`, background: 'transparent', color: cfg.color,
                                                    cursor: 'pointer', fontFamily: f, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                                                    transition: 'all 0.15s',
                                                }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = cfg.bg; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                                >
                                                    <Check style={{ width: 12, height: 12 }} /> RSVP
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {view === 'files' && (
                            <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                    <div>
                                        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#37352F', margin: '0 0 4px' }}>Shared Files</h2>
                                        <p style={{ fontSize: 11, color: '#9B9A97', margin: 0 }}>
                                            {PROJECT_FOLDERS.find(pf => pf.id === activeFolder)?.name || 'All Files'} — {filteredFiles.length} files
                                        </p>
                                    </div>
                                    <button style={{
                                        padding: '8px 16px', fontSize: 11, fontWeight: 700, borderRadius: 8, border: 'none',
                                        background: '#37352F', color: 'white', cursor: 'pointer', fontFamily: f,
                                        display: 'flex', alignItems: 'center', gap: 4,
                                    }}>
                                        <Plus style={{ width: 12, height: 12 }} /> Upload File
                                    </button>
                                </div>

                                {/* File Header */}
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 80px 100px 120px 60px 80px', gap: 0, padding: '10px 16px', background: '#FAFAF9', borderRadius: '8px 8px 0 0', border: '1px solid #E9E9E7', borderBottom: 'none' }}>
                                    {['File Name', 'Size', 'Uploaded By', 'When', 'Ver', 'Actions'].map(h => (
                                        <span key={h} style={{ fontSize: 9, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
                                    ))}
                                </div>

                                {/* File Rows */}
                                <div style={{ background: 'white', border: '1px solid #E9E9E7', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
                                    {filteredFiles.map((file, idx) => {
                                        const ftCfg = FILE_TYPE_CFG[file.type];
                                        const FtIcon = ftCfg.icon;
                                        return (
                                            <div key={file.id} style={{
                                                display: 'grid', gridTemplateColumns: '2fr 80px 100px 120px 60px 80px', gap: 0,
                                                padding: '12px 16px', alignItems: 'center',
                                                borderBottom: idx < filteredFiles.length - 1 ? '1px solid #F5F5F4' : 'none',
                                                transition: 'background 0.15s', cursor: 'pointer',
                                            }}
                                                onMouseEnter={e => (e.currentTarget.style.background = '#FAFAF9')}
                                                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div style={{ width: 28, height: 28, borderRadius: 6, background: ftCfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <FtIcon style={{ width: 14, height: 14, color: ftCfg.color }} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: 12, fontWeight: 600, color: '#37352F' }}>{file.name}</div>
                                                        <div style={{ fontSize: 9, color: '#9B9A97', textTransform: 'uppercase' }}>{file.type}</div>
                                                    </div>
                                                </div>
                                                <span style={{ fontSize: 11, color: '#6B6A67' }}>{file.size}</span>
                                                <span style={{ fontSize: 11, color: '#6B6A67' }}>{file.uploadedBy.split(' ')[0]}</span>
                                                <span style={{ fontSize: 11, color: '#9B9A97' }}>{file.uploadedAt}</span>
                                                <span style={{ fontSize: 10, fontWeight: 700, color: '#3B82F6' }}>v{file.version}</span>
                                                <div style={{ display: 'flex', gap: 4 }}>
                                                    <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E9E9E7', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Eye style={{ width: 12, height: 12, color: '#9B9A97' }} />
                                                    </button>
                                                    <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E9E9E7', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Download style={{ width: 12, height: 12, color: '#9B9A97' }} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <RatingModal
                isOpen={!!ratingTarget}
                onClose={() => setRatingTarget(null)}
                onSubmit={(data) => { console.log('Team rating:', data); setRatingTarget(null); }}
                targetName={ratingTarget?.name || ''}
                targetRole={ratingTarget?.role || 'Team Member'}
                criteria={ratingTarget?.role === 'Drafter' ? CRITERIA.designerRatesDrafter : ratingTarget?.role === 'Contractor' ? CRITERIA.designerRatesContractor : CRITERIA.contractorRatesDesigner}
            />
        </>
    );
}
