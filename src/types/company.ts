/**
 * Company Profile & Settings Types
 * For multi-tenant quotation system
 */

export interface CompanyProfile {
    id: string;
    name: string;
    registrationNumber: string; // UEN in Singapore
    email: string;
    phone: string;
    address: {
        line1: string;
        line2?: string;
        city: string;
        postalCode: string;
        country: string;
    };
    logoUrl?: string;
    website?: string;
}

export interface PaymentTerm {
    id: string;
    percentage: number;
    stage: string;
    details: string;
}

export interface CompanySettings {
    profile: CompanyProfile;
    paymentTerms: PaymentTerm[];
    termsAndConditions: string;
    quoteValidityDays: number;
    defaultCurrency: 'SGD' | 'MYR';
}

// Default payment terms (matching the reference PDF)
export const DEFAULT_PAYMENT_TERMS: PaymentTerm[] = [
    { id: '1', percentage: 20, stage: 'Upon Confirmation', details: 'Designing Stage' },
    { id: '2', percentage: 40, stage: 'Start of Renovation', details: 'Masonry Stage' },
    { id: '3', percentage: 35, stage: 'Carpentry Measurement', details: 'Carpentry Stage' },
    { id: '4', percentage: 5, stage: 'Upon Completion of Renovation', details: 'Handover Stage' },
];

// Default T&Cs (generic)
export const DEFAULT_TERMS_AND_CONDITIONS = `
1. This quotation is valid for 30 days from the date of issue.
2. All prices are quoted in the specified currency and are subject to prevailing GST.
3. A minimum deposit as per payment terms is required upon confirmation.
4. Any additional works not specified in this quotation will be charged separately.
5. The client is responsible for ensuring clear site access for works to commence.
6. Timeline estimates are subject to site conditions and permit approvals.
7. Variations to the scope of works may result in price adjustments.
8. Final measurements will be taken on-site and may differ from initial estimates.
9. The company reserves the right to engage sub-contractors where necessary.
10. Disputes shall be resolved under the laws of the specified jurisdiction.
`.trim();

// Default company profile (placeholder)
export const DEFAULT_COMPANY_PROFILE: CompanyProfile = {
    id: 'default',
    name: 'Your Company Name',
    registrationNumber: '000000000X',
    email: 'hello@yourcompany.com',
    phone: '+65 0000 0000',
    address: {
        line1: '123 Sample Street',
        line2: '#01-01 Sample Building',
        city: 'Singapore',
        postalCode: '000000',
        country: 'Singapore',
    },
    logoUrl: undefined,
    website: 'www.yourcompany.com',
};
