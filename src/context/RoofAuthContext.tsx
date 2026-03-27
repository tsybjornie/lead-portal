'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

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
    firm?: { name: string; uen: string };
    code: string;
}

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

// Route mapping per role
const ROLE_DEFAULT_ROUTES: Record<UserRole, string> = {
    designer: '/hub',
    vendor: '/vendor/dashboard',
    client: '/client-dashboard',
    prospect: '/prospect',
    developer: '/hub',
    admin: '/hub',
    worker: '/worker/tasks',
};

// ============================================================
// CONTEXT
// ============================================================

interface RoofAuthContextType {
    user: RoofUser | null;
    supabaseUser: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    isApproved: boolean;
    login: (role: UserRole) => void;
    loginByCode: (code: string) => { success: boolean; route: string };
    logout: () => Promise<void>;
    switchRole: (role: UserRole) => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (v: boolean) => void;
    defaultRoute: string;
}

const RoofAuthContext = createContext<RoofAuthContextType | null>(null);

// Build a RoofUser from a Supabase user + profile
function buildRoofUser(supaUser: User, profile: any): RoofUser {
    const role = (profile?.role || 'designer') as UserRole;
    return {
        id: supaUser.id,
        name: profile?.full_name || supaUser.user_metadata?.full_name || supaUser.email?.split('@')[0] || 'User',
        email: supaUser.email || '',
        roles: [role],
        activeRole: role,
        firm: profile?.firm_name ? { name: profile.firm_name, uen: profile.uen || '' } : undefined,
        code: supaUser.id.substring(0, 6).toUpperCase(),
    };
}

export function RoofAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<RoofUser | null>(null);
    const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isApproved, setIsApproved] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Hydrate user from Supabase session on mount
    useEffect(() => {
        const hydrate = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setSupabaseUser(session.user);
                    // Fetch profile
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();
                    setUser(buildRoofUser(session.user, profile));
                    setIsApproved(profile?.approved === true);
                }
            } catch (err) {
                console.error('Auth hydration failed:', err);
            }
            setIsLoading(false);
        };

        hydrate();

        // Listen for auth state changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                setSupabaseUser(session.user);
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                setUser(buildRoofUser(session.user, profile));
                setIsApproved(profile?.approved === true);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setSupabaseUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Login by role — creates a dummy user for admin bypass, or updates existing user
    const login = (role: UserRole) => {
        if (user) {
            setUser({ ...user, activeRole: role, roles: [...new Set([...user.roles, role])] });
        } else {
            // Admin bypass: create a dummy RoofUser without Supabase
            setUser({
                id: 'admin-local',
                name: role === 'admin' ? 'Admin' : 'User',
                email: role === 'admin' ? 'admin@roof.sg' : '',
                roles: [role],
                activeRole: role,
                code: 'ADMIN0',
            });
            setIsLoading(false);
        }
    };

    // Legacy: login by code (kept for compat, no-op since we use Supabase now)
    const loginByCode = (code: string): { success: boolean; route: string } => {
        if (user) {
            return { success: true, route: ROLE_DEFAULT_ROUTES[user.activeRole] || '/hub' };
        }
        return { success: false, route: '/login' };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSupabaseUser(null);
    };

    const switchRole = (role: UserRole) => {
        if (user && user.roles.includes(role)) {
            setUser({ ...user, activeRole: role });
        }
    };

    const defaultRoute = user ? ROLE_DEFAULT_ROUTES[user.activeRole] || '/hub' : '/login';

    return (
        <RoofAuthContext.Provider value={{
            user, supabaseUser, isLoggedIn: !!user, isLoading, isApproved,
            login, loginByCode, logout, switchRole,
            sidebarCollapsed, setSidebarCollapsed, defaultRoute,
        }}>
            {children}
        </RoofAuthContext.Provider>
    );
}

export function useRoofAuth() {
    const ctx = useContext(RoofAuthContext);
    if (!ctx) {
        // Return safe defaults during SSR/prerender when provider isn't mounted yet
        return {
            user: null,
            supabaseUser: null,
            isLoggedIn: false,
            isLoading: true,
            isApproved: false,
            login: () => { },
            loginByCode: () => ({ success: false, route: '/login' }),
            logout: async () => { },
            switchRole: () => { },
            sidebarCollapsed: false,
            setSidebarCollapsed: () => { },
            defaultRoute: '/login',
        } as RoofAuthContextType;
    }
    return ctx;
}
