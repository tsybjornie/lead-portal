'use client';

import { useState, useEffect } from 'react';
import {
    CompanyProfile,
    CompanySettings as CompanySettingsType,
    PaymentTerm,
    DEFAULT_COMPANY_PROFILE,
    DEFAULT_PAYMENT_TERMS,
    DEFAULT_TERMS_AND_CONDITIONS,
} from '@/types/company';

const STORAGE_KEY = 'arc-quote-company-settings';

interface Props {
    onSave?: (settings: CompanySettingsType) => void;
}

// Helper to safely access localStorage (client-side only)
function loadSettings(): CompanySettingsType | null {
    if (typeof window === 'undefined') return null;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch {
        console.warn('Failed to load company settings from localStorage');
    }
    return null;
}

function saveSettings(settings: CompanySettingsType) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
        console.warn('Failed to save company settings to localStorage');
    }
}

export default function CompanySettings({ onSave }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<CompanyProfile>(DEFAULT_COMPANY_PROFILE);
    const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>(DEFAULT_PAYMENT_TERMS);
    const [termsAndConditions, setTermsAndConditions] = useState(DEFAULT_TERMS_AND_CONDITIONS);
    const [quoteValidityDays, setQuoteValidityDays] = useState(30);

    // Load settings from localStorage on mount
    useEffect(() => {
        const stored = loadSettings();
        if (stored) {
            setProfile(stored.profile);
            setPaymentTerms(stored.paymentTerms);
            setTermsAndConditions(stored.termsAndConditions);
            setQuoteValidityDays(stored.quoteValidityDays);
        }
    }, []);

    const handleSave = () => {
        const settings: CompanySettingsType = {
            profile,
            paymentTerms,
            termsAndConditions,
            quoteValidityDays,
            defaultCurrency: 'SGD',
        };
        saveSettings(settings);
        onSave?.(settings);
        setIsEditing(false);
    };

    const updatePaymentTerm = (index: number, field: keyof PaymentTerm, value: string | number) => {
        const updated = [...paymentTerms];
        updated[index] = { ...updated[index], [field]: value };
        setPaymentTerms(updated);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-navy-900">️ Company Settings</h3>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={`px-4 py-2 rounded text-sm font-bold transition-colors ${isEditing
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-navy-900 text-white hover:bg-navy-800'
                        }`}
                >
                    {isEditing ? ' SAVE CHANGES' : 'EDIT SETTINGS'}
                </button>
            </div>

            {/* COMPANY PROFILE */}
            <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
                    Company Profile
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Company Name</label>
                        <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            disabled={!isEditing}
                            className="w-full p-2 border rounded text-sm disabled:bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Registration No. (UEN)</label>
                        <input
                            type="text"
                            value={profile.registrationNumber}
                            onChange={(e) => setProfile({ ...profile, registrationNumber: e.target.value })}
                            disabled={!isEditing}
                            className="w-full p-2 border rounded text-sm disabled:bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            disabled={!isEditing}
                            className="w-full p-2 border rounded text-sm disabled:bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
                        <input
                            type="text"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            disabled={!isEditing}
                            className="w-full p-2 border rounded text-sm disabled:bg-gray-50"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Address Line 1</label>
                        <input
                            type="text"
                            value={profile.address.line1}
                            onChange={(e) => setProfile({ ...profile, address: { ...profile.address, line1: e.target.value } })}
                            disabled={!isEditing}
                            className="w-full p-2 border rounded text-sm disabled:bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Address Line 2</label>
                        <input
                            type="text"
                            value={profile.address.line2 || ''}
                            onChange={(e) => setProfile({ ...profile, address: { ...profile.address, line2: e.target.value } })}
                            disabled={!isEditing}
                            className="w-full p-2 border rounded text-sm disabled:bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Postal Code</label>
                        <input
                            type="text"
                            value={profile.address.postalCode}
                            onChange={(e) => setProfile({ ...profile, address: { ...profile.address, postalCode: e.target.value } })}
                            disabled={!isEditing}
                            className="w-full p-2 border rounded text-sm disabled:bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Logo URL (optional)</label>
                        <input
                            type="text"
                            value={profile.logoUrl || ''}
                            onChange={(e) => setProfile({ ...profile, logoUrl: e.target.value })}
                            disabled={!isEditing}
                            placeholder="https://..."
                            className="w-full p-2 border rounded text-sm disabled:bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Quote Validity (days)</label>
                        <input
                            type="number"
                            value={quoteValidityDays}
                            onChange={(e) => setQuoteValidityDays(Number(e.target.value))}
                            disabled={!isEditing}
                            className="w-full p-2 border rounded text-sm disabled:bg-gray-50"
                        />
                    </div>
                </div>
            </div>

            {/* PAYMENT TERMS */}
            <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
                    Default Payment Terms
                </h4>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 text-left font-semibold">%</th>
                            <th className="p-2 text-left font-semibold">Stage</th>
                            <th className="p-2 text-left font-semibold">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentTerms.map((term, index) => (
                            <tr key={term.id} className="border-b">
                                <td className="p-2 w-20">
                                    <input
                                        type="number"
                                        value={term.percentage}
                                        onChange={(e) => updatePaymentTerm(index, 'percentage', Number(e.target.value))}
                                        disabled={!isEditing}
                                        className="w-full p-1 border rounded text-center disabled:bg-gray-50"
                                    />
                                </td>
                                <td className="p-2">
                                    <input
                                        type="text"
                                        value={term.stage}
                                        onChange={(e) => updatePaymentTerm(index, 'stage', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full p-1 border rounded disabled:bg-gray-50"
                                    />
                                </td>
                                <td className="p-2">
                                    <input
                                        type="text"
                                        value={term.details}
                                        onChange={(e) => updatePaymentTerm(index, 'details', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full p-1 border rounded disabled:bg-gray-50"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className="text-xs text-gray-500 mt-2">
                    Total: {paymentTerms.reduce((sum, t) => sum + t.percentage, 0)}% (must equal 100%)
                </p>
            </div>

            {/* TERMS & CONDITIONS */}
            <div>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
                    Terms & Conditions
                </h4>
                <textarea
                    value={termsAndConditions}
                    onChange={(e) => setTermsAndConditions(e.target.value)}
                    disabled={!isEditing}
                    rows={10}
                    className="w-full p-3 border rounded text-sm font-mono disabled:bg-gray-50"
                />
            </div>
        </div>
    );
}
