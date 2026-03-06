'use client';

import React from 'react';

interface IdentityMaskProps {
    realName: string;
    publicAlias: string;
    role: string;
    viewerRole: 'client' | 'admin' | 'designer' | 'worker' | 'vendor';
    children?: (maskedName: string) => React.ReactNode;
}

/**
 * IdentityMask Component
 * 
 * Enforces "Masked Accountability":
 * - Clients only see the 'publicAlias' (e.g., "Master Carpenter #42")
 * - Internal roles (ID, Admin, Worker) see the 'realName'
 * 
 * This prevents side-deals/poaching while maintaining internal accountability.
 */
export function IdentityMask({ realName, publicAlias, role, viewerRole, children }: IdentityMaskProps) {
    const isClient = viewerRole === 'client';
    const maskedName = isClient ? publicAlias : realName;

    if (children) {
        return <>{children(maskedName)}</>;
    }

    return (
        <span className="font-medium">
            {maskedName}
            {isClient && <span className="ml-1 text-[10px] text-notion-text-gray font-normal italic">(Verified {role})</span>}
        </span>
    );
}
