import { useState, useEffect, useCallback } from 'react';
import { Vendor, VENDOR_LIBRARY } from '@/data/vendor-library';

const STORAGE_KEY = 'vendor-library-data';

export function useVendorLibrary() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setVendors(parsed);
                } else {
                    // Fallback to default if empty array found (should shouldn't happen if we seed correctly)
                    setVendors(VENDOR_LIBRARY);
                }
            } catch (e) {
                console.error('Failed to parse vendor library', e);
                setVendors(VENDOR_LIBRARY);
            }
        } else {
            // Seed with default library
            setVendors(VENDOR_LIBRARY);
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever vendors change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(vendors));
        }
    }, [vendors, isLoaded]);

    const addVendor = useCallback((vendor: Vendor) => {
        setVendors(prev => [...prev, vendor]);
    }, []);

    const updateVendor = useCallback((id: string, updates: Partial<Vendor>) => {
        setVendors(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
    }, []);

    const deleteVendor = useCallback((id: string) => {
        setVendors(prev => prev.filter(v => v.id !== id));
    }, []);

    const getVendorPrice = useCallback((vendorId: string, itemKey: string) => {
        const vendor = vendors.find(v => v.id === vendorId);
        if (!vendor) return null;
        return vendor.priceList[itemKey] || null;
    }, [vendors]);

    return {
        vendors,
        isLoaded,
        addVendor,
        updateVendor,
        deleteVendor,
        getVendorPrice
    };
}
