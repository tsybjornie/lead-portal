import { ReactNode } from 'react';

export type ProjectType = 'HDB' | 'Condo' | 'Landed' | 'Commercial';

interface TermsTemplate {
    title: string;
    content: ReactNode; // Using ReactNode to allow formatting
}

export const TERMS_TEMPLATES: Record<ProjectType, TermsTemplate> = {
    HDB: {
        title: 'HDB Renovation Standard Terms',
        content: (
            <div className="space-y-2 text-xs text-gray-600">
                <p>1. <strong>HDB Permits:</strong> Use of HDB approved demolition contractors is mandatory. All haulage/debris removal is included as per Clause 4.1.</p>
                <p>2. <strong>Working Hours:</strong> Strictly 9:00 AM - 6:00 PM Mon-Sat. No noisy works on Saturdays/Sundays/PH.</p>
                <p>3. <strong>Payment Schedule:</strong> 10% Booking, 40% Commencement, 40% Measurement, 10% Completion.</p>
                <p>4. <strong>Warranty:</strong> 12 months on workmanship from handover date.</p>
            </div>
        )
    },
    Condo: {
        title: 'Private Condominium Terms',
        content: (
            <div className="space-y-2 text-xs text-gray-600">
                <p>1. <strong>MCST Deposit:</strong> Client to bear renovation deposit payable to Management Office.</p>
                <p>2. <strong>Lift Padding:</strong> Contractor to provide padding for lift lobby and lift interior.</p>
                <p>3. <strong>Working Hours:</strong> Strictly 9:00 AM - 5:00 PM Mon-Fri, 9:00 AM - 1:00 PM Sat. No noisy works on weekends.</p>
                <p>4. <strong>Haulage:</strong> Debris disposal via authorized disposal grounds only.</p>
            </div>
        )
    },
    Landed: {
        title: 'Landed Property Reconstruction Terms',
        content: (
            <div className="space-y-2 text-xs text-gray-600">
                <p>1. <strong>BCA Permits:</strong> Structural works subject to PE endorsement and BCA approval.</p>
                <p>2. <strong>Site Protection:</strong> Hoarding to be erected around site perimeter if external works involved.</p>
                <p>3. <strong>Insurance:</strong> Contractor's All Risk (CAR) Policy included.</p>
                <p>4. <strong>Progress Claim:</strong> Monthly progress claims based on work done.</p>
            </div>
        )
    },
    Commercial: {
        title: 'Commercial / Retail Fit-out Terms',
        content: (
            <div className="space-y-2 text-xs text-gray-600">
                <p>1. <strong>Reinstatement:</strong> Quote excludes reinstatement of existing unit unless specified.</p>
                <p>2. <strong>Fire Safety:</strong> FSSD submission fees excluded unless specified.</p>
                <p>3. <strong>Night Works:</strong> Surcharge applicable for Mall-mandated night works (10 PM - 6 AM).</p>
                <p>4. <strong>Payment:</strong> 50% Deposit, 50% Completion (7 days).</p>
            </div>
        )
    }
};
