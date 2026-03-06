'use client';

import { useEffect } from 'react';

/**
 * ContentProtection — client-side anti-copy measures.
 * Disables right-click context menu, text selection, and keyboard shortcuts
 * (Ctrl+U, Ctrl+S, Ctrl+Shift+I) on protected pages.
 *
 * Usage: <ContentProtection /> anywhere in a page layout.
 * Does NOT block legitimate users — just raises the bar for lazy copycats.
 */
export default function ContentProtection() {
    useEffect(() => {
        // Disable right-click context menu
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };

        // Disable common dev tool / save shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+U (view source), Ctrl+S (save page), Ctrl+Shift+I (dev tools)
            if (
                (e.ctrlKey && e.key === 'u') ||
                (e.ctrlKey && e.key === 's') ||
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.shiftKey && e.key === 'J') ||
                (e.key === 'F12')
            ) {
                e.preventDefault();
                return false;
            }
        };

        // Disable text selection via CSS
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return null; // Invisible component
}
