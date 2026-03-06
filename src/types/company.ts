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

// Default company profile  Vinterior Pte Ltd (dogfood)
export const DEFAULT_COMPANY_PROFILE: CompanyProfile = {
    id: 'vinterior',
    name: 'Vinterior Pte Ltd',
    registrationNumber: '202XXXXXXX',  // TODO: Update with real UEN
    email: 'hello@vinterior.sg',       // TODO: Update
    phone: '+65 XXXX XXXX',            // TODO: Update
    address: {
        line1: 'TBC',                   // TODO: Update
        line2: '',
        city: 'Singapore',
        postalCode: '000000',           // TODO: Update
        country: 'Singapore',
    },
    logoUrl: undefined,                 // TODO: Upload logo
    website: 'www.vinterior.sg',        // TODO: Update
};
