'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// ============================================================
// TYPES
// ============================================================

export type UserRole = 'designer' | 'vendor' | 'client' | 'prospect' | 'developer' | 'admin' | 'worker';

export interface RoofUser {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    roles: UserRole[];
    activeRole: UserRole;
    firm?: {
        name: string;
        uen: string;
    };
    code: string;
}

// ============================================================
// USER DIRECTORY — Code-based login
// When Supabase is connected, this lookups from the `users` table instead
// ============================================================

export interface UserEntry {
    user: RoofUser;
    defaultRoute: string;
    username: string;
    password: string;
}

const USER_DIRECTORY: Record<string, UserEntry> = {
    // Designers
    'BJORN': {
        username: 'bjorn', password: 'roof123',
        user: {
            id: 'u_designer_1', code: 'BJORN',
            name: 'Bjorn Teo', email: 'bjorn@vinterior.sg',
            roles: ['designer'], activeRole: 'designer',
            firm: { name: 'Vinterior Pte Ltd', uen: '202312345X' },
        },
        defaultRoute: '/hub',
    },
    'TINA': {
        username: 'tina', password: 'roof123',
        user: {
            id: 'u_designer_2', code: 'TINA',
            name: 'Tina Wong', email: 'tina@vinterior.sg',
            roles: ['designer'], activeRole: 'designer',
            firm: { name: 'Vinterior Pte Ltd', uen: '202312345X' },
        },
        defaultRoute: '/hub',
    },

    // Admin / Boss
    'BOSS': {
        username: 'admin', password: 'roof123',
        user: {
            id: 'u_admin_1', code: 'BOSS',
            name: 'Roof Admin', email: 'admin@roof.sg',
            roles: ['designer', 'vendor', 'client', 'prospect', 'developer', 'admin', 'worker'],
            activeRole: 'admin',
        },
        defaultRoute: '/hub',
    },

    // Vendors
    'AHMAD': {
        username: 'ahmad', password: 'roof123',
        user: {
            id: 'u_vendor_1', code: 'AHMAD',
            name: 'Ahmad Bin Hassan', email: 'ahmad@woodworksg.com',
            roles: ['vendor'], activeRole: 'vendor',
            firm: { name: 'WoodWork SG', uen: '202198765Y' },
        },
        defaultRoute: '/vendor/dashboard',
    },
    'LEONG': {
        username: 'leong', password: 'roof123',
        user: {
            id: 'u_vendor_2', code: 'LEONG',
            name: 'Leong Electrical', email: 'leong@sparkssg.com',
            roles: ['vendor'], activeRole: 'vendor',
            firm: { name: 'Sparks Electrical Pte Ltd', uen: '201987654Z' },
        },
        defaultRoute: '/vendor/dashboard',
    },

    // Workers
    'KUMAR': {
        username: 'kumar', password: 'roof123',
        user: {
            id: 'u_worker_1', code: 'KUMAR',
            name: 'Kumar Saravanan', email: 'kumar@woodworksg.com',
            roles: ['worker'], activeRole: 'worker',
            firm: { name: 'WoodWork SG', uen: '202198765Y' },
        },
        defaultRoute: '/worker/tasks',
    },

    // Clients
    'DAVID': {
        username: 'david', password: 'roof123',
        user: {
            id: 'u_client_1', code: 'DAVID',
            name: 'David Lim', email: 'david.lim@gmail.com',
            roles: ['client'], activeRole: 'client',
        },
        defaultRoute: '/client-dashboard',
    },

    // Prospects
    'SARAH': {
        username: 'sarah', password: 'roof123',
        user: {
            id: 'u_prospect_1', code: 'SARAH',
            name: 'Sarah Chen', email: 'sarah.chen@gmail.com',
            roles: ['prospect'], activeRole: 'prospect',
        },
        defaultRoute: '/prospect',
    },

    // Developer
    'CAPITA': {
        username: 'capita', password: 'roof123',
        user: {
            id: 'u_dev_1', code: 'CAPITA',
            name: 'CapitaLand Dev', email: 'projects@capitaland.com',
            roles: ['developer'], activeRole: 'developer',
            firm: { name: 'CapitaLand Residential', uen: '198301876K' },
        },
        defaultRoute: '/hub',
    },
};

// Lookup by code (case-insensitive)
export function lookupUserByCode(code: string): UserEntry | null {
    return USER_DIRECTORY[code.toUpperCase().trim()] || null;
}

// Lookup by username (case-insensitive)
export function lookupUserByUsername(username: string): UserEntry | null {
    const entry = Object.values(USER_DIRECTORY).find(
        e => e.username.toLowerCase() === username.toLowerCase().trim()
    );
    return entry || null;
}

// Validate username + password
export function validateCredentials(username: string, password: string): UserEntry | null {
    const entry = lookupUserByUsername(username);
    if (entry && entry.password === password) return entry;
    return null;
}

// Get all users for display
export function getAllUsers(): { username: string; name: string; role: UserRole; code: string }[] {
    return Object.entries(USER_DIRECTORY).map(([code, entry]) => ({
        code,
        username: entry.username,
        name: entry.user.name,
        role: entry.user.activeRole,
    }));
}

// Legacy compatibility — still kept for components that use role-based login
const DEMO_USERS: Record<UserRole, RoofUser> = {
    designer: USER_DIRECTORY['BJORN'].user,
    vendor: USER_DIRECTORY['AHMAD'].user,
    client: USER_DIRECTORY['DAVID'].user,
    prospect: USER_DIRECTORY['SARAH'].user,
    developer: USER_DIRECTORY['CAPITA'].user,
    admin: USER_DIRECTORY['BOSS'].user,
    worker: USER_DIRECTORY['KUMAR'].user,
};

// ============================================================
// NAVIGATION CONFIG PER ROLE
// ============================================================

export interface NavItem {
    icon: string;
    label: string;
    href: string;
    badge?: number;
}

export const ROLE_NAV: Record<UserRole, NavItem[]> = {
    designer: [
        { icon: '', label: 'Projects', href: '/prospect' },
        { icon: '', label: 'Quote Builder', href: '/quote-builder' },
        { icon: '', label: 'Ledger', href: '/ledger' },
        { icon: '', label: 'Vendor Rates', href: '/vendor-rates' },
    ],
    vendor: [
        { icon: '', label: 'Jobs', href: '/vendor/jobs' },
        { icon: '', label: 'Payments', href: '/vendor/payments' },
        { icon: '', label: 'Documents', href: '/vendor/documents' },
        { icon: '', label: 'Analytics', href: '/vendor/analytics' },
    ],
    client: [
        { icon: '', label: 'Dashboard', href: '/client-dashboard' },
        { icon: '', label: 'Quotation', href: '/quote/B4BDRL' },
        { icon: '', label: 'Messages', href: '/client/messages' },
        { icon: '', label: 'Timeline', href: '/client/timeline' },
        { icon: '', label: 'Payments', href: '/client/payments' },
    ],
    prospect: [
        { icon: '', label: 'Review Quote', href: '/prospect' },
        { icon: '', label: 'Messages', href: '/client/messages' },
    ],
    developer: [
        { icon: '️', label: 'Projects', href: '/developer/projects' },
        { icon: '', label: 'Analytics', href: '/developer/analytics' },
        { icon: '', label: 'Partners', href: '/developer/partners' },
    ],
    admin: [
        { icon: '', label: 'Workspace Hub', href: '/hub' },
        { icon: '', label: 'Quote Builder', href: '/quote-builder' },
        { icon: '', label: 'Ledger', href: '/ledger' },
        { icon: '', label: 'Prospect Review', href: '/prospect' },
        { icon: '', label: 'Client Dashboard', href: '/client-dashboard' },
    ],
    worker: [
        { icon: '', label: 'My Tasks', href: '/worker/tasks' },
        { icon: '', label: 'Photo Logs', href: '/worker/photos' },
        { icon: '', label: 'Check-in', href: '/worker/check-in' },
    ],
};

export const ROLE_LABELS: Record<UserRole, string> = {
    designer: 'Interior Designer',
    vendor: 'Vendor / Supplier',
    client: 'Client',
    prospect: 'Prospect',
    developer: 'Developer',
    admin: 'Administrator',
    worker: 'Site Worker',
};

export const ROLE_COLORS: Record<UserRole, string> = {
    designer: '#6366F1',
    vendor: '#F59E0B',
    client: '#10B981',
    prospect: '#8B5CF6',
    developer: '#3B82F6',
    admin: '#EF4444',
    worker: '#14B8A6',
};

// ============================================================
// CONTEXT
// ============================================================

interface RoofAuthContextType {
    user: RoofUser | null;
    isLoggedIn: boolean;
    login: (role: UserRole) => void;
    loginByCode: (code: string) => { success: boolean; route: string };
    logout: () => void;
    switchRole: (role: UserRole) => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (v: boolean) => void;
}

const RoofAuthContext = createContext<RoofAuthContextType | null>(null);

export function RoofAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<RoofUser | null>(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Legacy: login by role (for backward compat)
    const login = (role: UserRole) => {
        setUser(DEMO_USERS[role]);
    };

    // New: login by unique code
    const loginByCode = (code: string): { success: boolean; route: string } => {
        const entry = lookupUserByCode(code);
        if (entry) {
            setUser(entry.user);
            return { success: true, route: entry.defaultRoute };
        }
        return { success: false, route: '/login' };
    };

    const logout = () => {
        setUser(null);
    };

    const switchRole = (role: UserRole) => {
        if (user && user.roles.includes(role)) {
            setUser({ ...user, activeRole: role });
        }
    };

    return (
        <RoofAuthContext.Provider value={{ user, isLoggedIn: !!user, login, loginByCode, logout, switchRole, sidebarCollapsed, setSidebarCollapsed }}>
            {children}
        </RoofAuthContext.Provider>
    );
}

export function useRoofAuth() {
    const ctx = useContext(RoofAuthContext);
    if (!ctx) throw new Error('useRoofAuth must be inside RoofAuthProvider');
    return ctx;
}

