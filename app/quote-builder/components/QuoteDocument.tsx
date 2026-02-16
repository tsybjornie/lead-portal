'use client';

import { useRef, useEffect, useState } from 'react';
import {
    CompanyProfile,
    CompanySettings as CompanySettingsType,
    PaymentTerm,
    DEFAULT_COMPANY_PROFILE,
    DEFAULT_PAYMENT_TERMS,
    DEFAULT_TERMS_AND_CONDITIONS,
} from '@/types/company';

const STORAGE_KEY = 'arc-quote-company-settings';

// Load settings from localStorage
function loadSettings(): CompanySettingsType | null {
    if (typeof window === 'undefined') return null;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch {
        return null;
    }
    return null;
}

interface LineItem {
    id: string;
    no: number;
    item: string;
    description?: string;
    qty: number;
    unit: string;
    rate: number;
    amount: number;
    category: string;
}

interface QuoteData {
    quoteNumber: string;
    date: string;
    validUntil: string;
    clientName: string;
    clientEmail?: string;
    clientPhone?: string;
    clientNric?: string;
    projectAddress: string;
    accountManager: string;
    lineItems: LineItem[];
    currency: 'SGD' | 'MYR';
}

interface Props {
    quoteData: QuoteData;
    companyProfile?: CompanyProfile;
    paymentTerms?: PaymentTerm[];
    termsAndConditions?: React.ReactNode;
    onClose?: () => void;
}

export default function QuoteDocument({
    quoteData,
    companyProfile: propCompanyProfile,
    paymentTerms: propPaymentTerms,
    termsAndConditions: propTermsAndConditions,
    onClose,
}: Props) {
    const documentRef = useRef<HTMLDivElement>(null);

    // State for settings loaded from localStorage
    const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(propCompanyProfile || DEFAULT_COMPANY_PROFILE);
    const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>(propPaymentTerms || DEFAULT_PAYMENT_TERMS);
    const [termsAndConditions, setTermsAndConditions] = useState<React.ReactNode>(propTermsAndConditions || DEFAULT_TERMS_AND_CONDITIONS);

    // Load settings from localStorage on mount
    useEffect(() => {
        const stored = loadSettings();
        if (stored) {
            setCompanyProfile(stored.profile);
            setPaymentTerms(stored.paymentTerms);
            setTermsAndConditions(stored.termsAndConditions);
        }
    }, []);

    const handlePrint = () => {
        window.print();
    };

    // Group line items by category
    const groupedItems = quoteData.lineItems.reduce((acc, item) => {
        const cat = item.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<string, LineItem[]>);

    // Calculate category totals
    const categoryTotals = Object.entries(groupedItems).map(([category, items]) => ({
        category,
        total: items.reduce((sum, item) => sum + item.amount, 0),
    }));

    const grandTotal = categoryTotals.reduce((sum, cat) => sum + cat.total, 0);

    const formatCurrency = (amount: number) => {
        return `${quoteData.currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-auto print:relative print:bg-white print:inset-auto">
            {/* PRINT CONTROLS - Hidden when printing */}
            <div className="fixed top-4 right-4 flex gap-2 print:hidden z-50">
                <button
                    onClick={handlePrint}
                    className="bg-navy-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-navy-800 transition-colors shadow-lg"
                >
                    🖨️ Print / Download PDF
                </button>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="bg-gray-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-gray-500 transition-colors shadow-lg"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* DOCUMENT CONTAINER */}
            <div
                ref={documentRef}
                className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:max-w-none"
            >
                {/* PAGE 1: COVER + SUMMARY */}
                <div className="p-12 min-h-[297mm] print:p-8">
                    {/* HEADER */}
                    <div className="flex justify-between items-start mb-12">
                        {/* LOGO / COMPANY NAME */}
                        <div>
                            {companyProfile.logoUrl ? (
                                <img src={companyProfile.logoUrl} alt={companyProfile.name} className="h-16 object-contain" />
                            ) : (
                                <h1 className="text-3xl font-serif italic text-gray-800">{companyProfile.name}</h1>
                            )}
                        </div>

                        {/* QUOTATION TITLE + COMPANY DETAILS */}
                        <div className="text-right">
                            <h2 className="text-3xl font-light tracking-[0.3em] text-gray-800 mb-4">QUOTATION</h2>
                            <div className="text-sm text-gray-600 space-y-0.5">
                                <p className="font-semibold">{companyProfile.name}</p>
                                <p>UEN: {companyProfile.registrationNumber}</p>
                                <p>{companyProfile.email}</p>
                                <p>{companyProfile.address.line1}</p>
                                {companyProfile.address.line2 && <p>{companyProfile.address.line2}</p>}
                                <p>Singapore {companyProfile.address.postalCode}</p>
                            </div>
                        </div>
                    </div>

                    {/* CLIENT DETAILS */}
                    <div className="mb-10">
                        <h3 className="font-semibold text-gray-800 mb-4">Attention To</h3>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
                            <div className="flex">
                                <span className="font-semibold w-28 text-gray-600">Client Name</span>
                                <span className="border-b border-gray-300 flex-1 pb-1">{quoteData.clientName}</span>
                            </div>
                            <div className="flex">
                                <span className="font-semibold w-32 text-gray-600">Quotation</span>
                                <span className="border-b border-gray-300 flex-1 pb-1">{quoteData.quoteNumber}</span>
                            </div>
                            {quoteData.clientEmail && (
                                <div className="flex">
                                    <span className="font-semibold w-28 text-gray-600">Client Email</span>
                                    <span className="border-b border-gray-300 flex-1 pb-1">{quoteData.clientEmail}</span>
                                </div>
                            )}
                            <div className="flex">
                                <span className="font-semibold w-32 text-gray-600">Date</span>
                                <span className="border-b border-gray-300 flex-1 pb-1">{quoteData.date}</span>
                            </div>
                            {quoteData.clientPhone && (
                                <div className="flex">
                                    <span className="font-semibold w-28 text-gray-600">Phone No.</span>
                                    <span className="border-b border-gray-300 flex-1 pb-1">{quoteData.clientPhone}</span>
                                </div>
                            )}
                            <div className="flex">
                                <span className="font-semibold w-32 text-gray-600">Account Manager</span>
                                <span className="border-b border-gray-300 flex-1 pb-1">{quoteData.accountManager}</span>
                            </div>
                            <div className="flex col-span-2">
                                <span className="font-semibold w-28 text-gray-600">Project Title</span>
                                <span className="border-b border-gray-300 flex-1 pb-1">{quoteData.projectAddress}</span>
                            </div>
                        </div>
                    </div>

                    {/* SUMMARY TABLE */}
                    <div className="mb-10">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-gray-300">
                                    <th className="text-left py-3 font-semibold text-gray-800">Description</th>
                                    <th className="text-right py-3 font-semibold text-gray-800">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoryTotals.map((cat, index) => (
                                    <tr key={cat.category} className={index % 2 === 1 ? 'bg-gray-50' : ''}>
                                        <td className="py-2 text-gray-700">{cat.category}</td>
                                        <td className="py-2 text-right font-mono text-gray-700">{formatCurrency(cat.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-gray-800">
                                    <td className="py-3 font-bold text-gray-900">Total</td>
                                    <td className="py-3 text-right font-bold font-mono text-gray-900">{formatCurrency(grandTotal)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* PAGE FOOTER */}
                    <div className="absolute bottom-8 left-12 right-12 flex justify-between text-xs text-gray-400 print:fixed">
                        <span>{quoteData.quoteNumber} - {companyProfile.name}</span>
                        <span>Page 1</span>
                    </div>
                </div>

                {/* PAGE 2+: DETAILED LINE ITEMS */}
                <div className="p-12 print:p-8 print:break-before-page">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Detailed Breakdown</h3>

                    {Object.entries(groupedItems).map(([category, items]) => (
                        <div key={category} className="mb-8">
                            {/* CATEGORY HEADER */}
                            <div className="bg-gray-100 px-4 py-2 mb-2">
                                <h4 className="font-bold text-gray-800">{category}</h4>
                            </div>

                            {/* LINE ITEMS TABLE */}
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-300">
                                        <th className="text-left py-2 w-10 text-gray-600">No</th>
                                        <th className="text-left py-2 text-gray-600">Item</th>
                                        <th className="text-right py-2 w-16 text-gray-600">Qty</th>
                                        <th className="text-center py-2 w-16 text-gray-600">Unit</th>
                                        <th className="text-right py-2 w-24 text-gray-600">Rate</th>
                                        <th className="text-right py-2 w-28 text-gray-600">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={item.id} className={`border-b border-gray-100 ${index % 2 === 1 ? 'bg-gray-50' : ''}`}>
                                            <td className="py-2 text-gray-500">{item.no}</td>
                                            <td className="py-2">
                                                <div className="font-medium text-gray-800">{item.item}</div>
                                                {item.description && (
                                                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                                                )}
                                            </td>
                                            <td className="py-2 text-right font-mono text-gray-700">{item.qty.toFixed(2)}</td>
                                            <td className="py-2 text-center text-gray-600">{item.unit}</td>
                                            <td className="py-2 text-right font-mono text-gray-700">{formatCurrency(item.rate)}</td>
                                            <td className="py-2 text-right font-mono font-medium text-gray-800">{formatCurrency(item.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={5} className="py-2 text-right font-semibold text-gray-600">Total Amount:</td>
                                        <td className="py-2 text-right font-bold font-mono text-gray-800">
                                            {formatCurrency(items.reduce((sum, item) => sum + item.amount, 0))}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ))}

                    {/* GRAND TOTAL */}
                    <div className="mt-8 pt-4 border-t-2 border-gray-800 flex justify-end">
                        <div className="text-right">
                            <span className="text-lg font-semibold text-gray-600 mr-8">Grand Total:</span>
                            <span className="text-2xl font-bold font-mono text-gray-900">{formatCurrency(grandTotal)}</span>
                        </div>
                    </div>
                </div>

                {/* PAGE: PAYMENT TERMS */}
                <div className="p-12 print:p-8 print:break-before-page">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Payment Terms</h3>
                    <table className="w-full text-sm border">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Based on latest quotation</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Stage</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentTerms.map((term, index) => (
                                <tr key={term.id} className={`border-b ${index % 2 === 1 ? 'bg-gray-50' : ''}`}>
                                    <td className="py-3 px-4 font-medium">{term.percentage.toFixed(2)}%</td>
                                    <td className="py-3 px-4">{term.stage}</td>
                                    <td className="py-3 px-4 text-gray-600">{term.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGE: TERMS & CONDITIONS */}
                <div className="p-12 print:p-8 print:break-before-page">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Terms & Conditions</h3>
                    <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                        {termsAndConditions}
                    </div>
                </div>

                {/* PAGE: SIGNATURES */}
                <div className="p-12 print:p-8 print:break-before-page">
                    <h3 className="text-xl font-semibold text-gray-800 mb-8">Acceptance</h3>
                    <p className="text-sm text-gray-600 mb-8">
                        By signing below, both parties agree to the terms and conditions outlined in this quotation.
                    </p>

                    <div className="grid grid-cols-2 gap-12">
                        {/* CLIENT SIGNATURE */}
                        <div className="border p-6">
                            <h4 className="font-semibold text-gray-700 mb-4">Signed By (Client)</h4>
                            <div className="border-b border-gray-300 h-20 mb-4"></div>
                            <div className="text-sm space-y-2">
                                <div className="flex">
                                    <span className="w-24 text-gray-500">Name:</span>
                                    <span className="border-b border-gray-300 flex-1"></span>
                                </div>
                                <div className="flex">
                                    <span className="w-24 text-gray-500">NRIC:</span>
                                    <span className="border-b border-gray-300 flex-1"></span>
                                </div>
                                <div className="flex">
                                    <span className="w-24 text-gray-500">Date:</span>
                                    <span className="border-b border-gray-300 flex-1"></span>
                                </div>
                            </div>
                        </div>

                        {/* COMPANY SIGNATURE */}
                        <div className="border p-6">
                            <h4 className="font-semibold text-gray-700 mb-4">For and on behalf of {companyProfile.name}</h4>
                            <div className="border-b border-gray-300 h-20 mb-4"></div>
                            <div className="text-sm space-y-2">
                                <div className="flex">
                                    <span className="w-24 text-gray-500">Name:</span>
                                    <span className="border-b border-gray-300 flex-1">{quoteData.accountManager}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-24 text-gray-500">Designation:</span>
                                    <span className="border-b border-gray-300 flex-1">Account Manager</span>
                                </div>
                                <div className="flex">
                                    <span className="w-24 text-gray-500">Date:</span>
                                    <span className="border-b border-gray-300 flex-1">{quoteData.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PRINT STYLES */}
            <style jsx global>{`
                @media print {
                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .print\\:break-before-page {
                        break-before: page;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
