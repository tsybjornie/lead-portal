'use client';

import { useRoofAuth, ROLE_NAV, ROLE_LABELS, ROLE_COLORS, UserRole } from '@/context/RoofAuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function UnifiedSidebar() {
    const { user, isLoggedIn, logout, switchRole, sidebarCollapsed, setSidebarCollapsed } = useRoofAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

    if (!isLoggedIn || !user) return null;

    const navItems = ROLE_NAV[user.activeRole] || [];
    const roleColor = ROLE_COLORS[user.activeRole];
    const w = sidebarCollapsed ? 60 : 240;

    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    return (
        <div style={{
            width: w, minHeight: '100vh', background: '#FAFAF9', borderRight: '1px solid #E9E9E7',
            display: 'flex', flexDirection: 'column', transition: 'width 0.2s ease',
            position: 'fixed', top: 0, left: 0, zIndex: 50, fontFamily: f,
        }}>
            {/* Logo + collapse */}
            <div style={{
                padding: sidebarCollapsed ? '16px 12px' : '16px 20px',
                borderBottom: '1px solid #E9E9E7',
                display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'space-between',
            }}>
                {!sidebarCollapsed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: 6, background: '#37352F',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: 14, fontWeight: 800,
                        }}>R</div>
                        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>Roof</span>
                    </div>
                )}
                <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: 16,
                    color: '#9B9A97', padding: 4,
                }}>
                    {sidebarCollapsed ? '' : ''}
                </button>
            </div>

            {/* Role badge */}
            {!sidebarCollapsed && (
                <div style={{ padding: '12px 20px', borderBottom: '1px solid #F1F1EF' }}>
                    <div
                        onClick={() => user.roles.length > 1 && setShowRoleSwitcher(!showRoleSwitcher)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '6px 10px', borderRadius: 6,
                            background: `${roleColor}10`, cursor: user.roles.length > 1 ? 'pointer' : 'default',
                        }}
                    >
                        <div style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: roleColor,
                        }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: roleColor }}>
                            {ROLE_LABELS[user.activeRole]}
                        </span>
                        {user.roles.length > 1 && (
                            <span style={{ fontSize: 10, color: '#9B9A97', marginLeft: 'auto' }}>
                                {showRoleSwitcher ? '' : ''}
                            </span>
                        )}
                    </div>

                    {/* Role switcher dropdown */}
                    {showRoleSwitcher && user.roles.length > 1 && (
                        <div style={{
                            marginTop: 4, background: 'white', border: '1px solid #E9E9E7',
                            borderRadius: 6, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        }}>
                            {user.roles.filter(r => r !== user.activeRole).map(role => (
                                <button key={role} onClick={() => { switchRole(role); setShowRoleSwitcher(false); }} style={{
                                    display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                                    padding: '8px 12px', background: 'none', border: 'none',
                                    cursor: 'pointer', fontSize: 11, fontWeight: 500, color: '#37352F',
                                    borderBottom: '1px solid #F1F1EF',
                                }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: ROLE_COLORS[role] }} />
                                    {ROLE_LABELS[role]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Nav items */}
            <div style={{ flex: 1, padding: '8px', overflow: 'auto' }}>
                {navItems.map(item => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <button
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            title={sidebarCollapsed ? item.label : undefined}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                                padding: sidebarCollapsed ? '10px 0' : '8px 12px',
                                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                                background: isActive ? '#37352F' : 'transparent',
                                color: isActive ? 'white' : '#37352F',
                                border: 'none', borderRadius: 6, cursor: 'pointer',
                                fontSize: 13, fontWeight: isActive ? 600 : 400,
                                marginBottom: 2, transition: 'all 0.1s',
                                position: 'relative',
                            }}
                        >
                            <span style={{ fontSize: 16, lineHeight: 1 }}>{item.icon}</span>
                            {!sidebarCollapsed && <span>{item.label}</span>}
                            {item.badge && !sidebarCollapsed && (
                                <span style={{
                                    marginLeft: 'auto', background: '#EB5757', color: 'white',
                                    fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 8,
                                }}>{item.badge}</span>
                            )}
                            {item.badge && sidebarCollapsed && (
                                <div style={{
                                    position: 'absolute', top: 4, right: 8, width: 6, height: 6,
                                    borderRadius: '50%', background: '#EB5757',
                                }} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* User profile + logout */}
            <div style={{
                padding: sidebarCollapsed ? '12px' : '12px 16px',
                borderTop: '1px solid #E9E9E7',
            }}>
                {!sidebarCollapsed ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: '50%', background: '#37352F',
                            color: 'white', fontSize: 12, fontWeight: 600,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            {user.name.split(' ').map(w => w[0]).join('')}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                            <div style={{ fontSize: 10, color: '#9B9A97', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                        </div>
                        <button onClick={logout} title="Logout" style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 14, color: '#9B9A97', padding: 4,
                        }}></button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: '50%', background: '#37352F',
                            color: 'white', fontSize: 12, fontWeight: 600,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                        }} onClick={logout} title="Logout">
                            {user.name.split(' ').map(w => w[0]).join('')}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
