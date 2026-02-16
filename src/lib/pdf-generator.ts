/**
 * PDF Generator for Quotations
 * Creates professional PDF quotes for client presentation
 */

// Privacy mode options for quote generation
export type QuotePrivacyMode = 'BRANDED' | 'ANONYMOUS' | 'WATERMARKED';

export interface QuotePDFData {
    // Privacy Settings (NEW)
    privacyMode?: QuotePrivacyMode; // Default: BRANDED
    watermarkText?: string; // For WATERMARKED mode: "CONFIDENTIAL - Prepared for John Doe"

    // Company Info
    companyName: string;
    companyAddress?: string;
    companyContact?: string;
    companyLogo?: string;
    gstNumber?: string;

    // Quote Info
    quoteNumber: string;
    quoteDate: string;
    validUntil: string;
    version: number;

    // Client Info
    clientName: string;
    clientAddress?: string;
    projectName: string;
    projectAddress?: string;

    // Line Items
    items: QuotePDFLineItem[];

    // Totals
    subtotal: number;
    gstRate?: number;
    gstAmount?: number;
    total: number;

    // Terms
    paymentTerms?: string;
    notes?: string;
}

export interface QuotePDFLineItem {
    sn: number;
    category: string;
    description: string;
    unit: string;
    quantity: number;
    rate: number;
    amount: number;
}

/**
 * Generate HTML content that can be converted to PDF
 * Uses print-optimized styling
 */
export function generateQuoteHTML(data: QuotePDFData): string {
    // Privacy mode handling
    const privacyMode = data.privacyMode || 'BRANDED';
    const displayCompanyName = privacyMode === 'ANONYMOUS'
        ? 'Interior Design Firm'
        : data.companyName;
    const showCompanyDetails = privacyMode !== 'ANONYMOUS';
    const watermarkCSS = privacyMode === 'WATERMARKED' ? `
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 60px;
            color: rgba(0, 0, 0, 0.05);
            white-space: nowrap;
            z-index: -1;
            pointer-events: none;
        }
    ` : '';
    const watermarkHTML = privacyMode === 'WATERMARKED'
        ? `<div class="watermark">${data.watermarkText || 'CONFIDENTIAL'}</div>`
        : '';

    const itemsHTML = data.items.map(item => `
        <tr>
            <td class="sn">${item.sn}</td>
            <td class="cat">${item.category}</td>
            <td class="desc">${item.description}</td>
            <td class="unit">${item.unit}</td>
            <td class="qty">${item.quantity.toLocaleString()}</td>
            <td class="rate">$${item.rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            <td class="amt">$${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Quotation ${data.quoteNumber}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #1e293b; line-height: 1.4; }
        .container { max-width: 800px; margin: 0 auto; padding: 40px; }
        
        /* Header */
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
        .company-info h1 { font-size: 24px; color: #1e40af; margin-bottom: 5px; }
        .company-info p { color: #64748b; font-size: 10px; }
        .quote-info { text-align: right; }
        .quote-info .quote-number { font-size: 18px; font-weight: bold; color: #1e40af; }
        .quote-info p { color: #64748b; font-size: 10px; margin-top: 3px; }
        
        /* Client Section */
        .parties { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .party { width: 48%; }
        .party h3 { font-size: 10px; text-transform: uppercase; color: #64748b; margin-bottom: 5px; letter-spacing: 1px; }
        .party p { font-size: 12px; }
        .party .name { font-weight: bold; font-size: 14px; }
        
        /* Items Table */
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        thead { background: #1e40af; color: white; }
        th { padding: 10px 8px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
        th.sn { width: 30px; }
        th.cat { width: 120px; }
        th.unit { width: 50px; }
        th.qty { width: 60px; text-align: right; }
        th.rate { width: 80px; text-align: right; }
        th.amt { width: 90px; text-align: right; }
        
        tbody tr { border-bottom: 1px solid #e2e8f0; }
        tbody tr:nth-child(even) { background: #f8fafc; }
        td { padding: 8px; vertical-align: top; }
        td.sn { text-align: center; color: #94a3b8; }
        td.qty, td.rate, td.amt { text-align: right; font-family: 'Consolas', monospace; }
        
        /* Totals */
        .totals { margin-left: auto; width: 280px; margin-bottom: 30px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 12px; border-bottom: 1px solid #e2e8f0; }
        .total-row.grand { background: #1e40af; color: white; font-weight: bold; font-size: 14px; }
        .total-row .label { color: #64748b; }
        .total-row.grand .label { color: white; }
        .total-row .value { font-family: 'Consolas', monospace; font-weight: bold; }
        
        /* Terms */
        .terms { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .terms h3 { font-size: 11px; text-transform: uppercase; color: #64748b; margin-bottom: 10px; letter-spacing: 1px; }
        .terms p { font-size: 10px; color: #475569; margin-bottom: 5px; }
        
        /* Footer */
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
        .signature-line { display: flex; justify-content: space-between; margin-top: 40px; }
        .signature { width: 45%; }
        .signature-box { border-top: 1px solid #1e293b; margin-top: 50px; padding-top: 10px; }
        .signature p { font-size: 10px; color: #64748b; }
        
        /* Print styles */
        @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            .container { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="company-info">
                <h1>${data.companyName}</h1>
                ${data.companyAddress ? `<p>${data.companyAddress}</p>` : ''}
                ${data.companyContact ? `<p>${data.companyContact}</p>` : ''}
                ${data.gstNumber ? `<p>GST Reg: ${data.gstNumber}</p>` : ''}
            </div>
            <div class="quote-info">
                <div class="quote-number">${data.quoteNumber}</div>
                <p>Date: ${data.quoteDate}</p>
                <p>Valid Until: ${data.validUntil}</p>
                <p>Version: ${data.version}</p>
            </div>
        </div>

        <div class="parties">
            <div class="party">
                <h3>Client</h3>
                <p class="name">${data.clientName}</p>
                ${data.clientAddress ? `<p>${data.clientAddress}</p>` : ''}
            </div>
            <div class="party">
                <h3>Project</h3>
                <p class="name">${data.projectName}</p>
                ${data.projectAddress ? `<p>${data.projectAddress}</p>` : ''}
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th class="sn">S/N</th>
                    <th class="cat">Category</th>
                    <th>Description</th>
                    <th class="unit">Unit</th>
                    <th class="qty">Qty</th>
                    <th class="rate">Rate</th>
                    <th class="amt">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML}
            </tbody>
        </table>

        <div class="totals">
            <div class="total-row">
                <span class="label">Subtotal</span>
                <span class="value">$${data.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            ${data.gstRate ? `
            <div class="total-row">
                <span class="label">GST (${data.gstRate}%)</span>
                <span class="value">$${(data.gstAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            ` : ''}
            <div class="total-row grand">
                <span class="label">Total</span>
                <span class="value">$${data.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
        </div>

        ${data.paymentTerms ? `
        <div class="terms">
            <h3>Payment Terms</h3>
            <p>${data.paymentTerms}</p>
        </div>
        ` : ''}

        ${data.notes ? `
        <div class="terms">
            <h3>Notes</h3>
            <p>${data.notes}</p>
        </div>
        ` : ''}

        <div class="footer">
            <div class="signature-line">
                <div class="signature">
                    <div class="signature-box">
                        <p>Authorized Signature (Company)</p>
                    </div>
                </div>
                <div class="signature">
                    <div class="signature-box">
                        <p>Client Acceptance</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `;
}

/**
 * Trigger PDF download via browser print dialog
 */
export function downloadQuotePDF(data: QuotePDFData): void {
    const html = generateQuoteHTML(data);

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Please allow popups to generate PDF');
        return;
    }

    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for content to load, then trigger print
    printWindow.onload = () => {
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };
}

/**
 * Format date for PDF display
 */
export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-SG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Calculate valid until date (default: 30 days)
 */
export function getValidUntilDate(daysValid: number = 30): string {
    const date = new Date();
    date.setDate(date.getDate() + daysValid);
    return formatDate(date);
}
