'use client';

import React, { createContext, useContext, useState } from 'react';

export type RoleId = 'designer' | 'firm_owner' | 'drafter' | 'contractor' | 'admin';

interface RoleContextType {
    activeRole: RoleId;
    setActiveRole: (role: RoleId) => void;
}

const RoleContext = createContext<RoleContextType>({
    activeRole: 'designer',
    setActiveRole: () => { },
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
    const [activeRole, setActiveRole] = useState<RoleId>('designer');
    return (
        <RoleContext.Provider value={{ activeRole, setActiveRole }}>
            {children}
        </RoleContext.Provider>
    );
}

export function useRole() {
    return useContext(RoleContext);
}
