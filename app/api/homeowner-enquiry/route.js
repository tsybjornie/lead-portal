import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force Node.js runtime (required for nodemailer)
export const runtime = 'nodejs';

const DATA_DIR = path.join(process.cwd(), 'data');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ENQUIRIES_FILE)) {
    fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify({ enquiries: [] }, null, 2));
  }
}

function saveEnquiry(formData) {
  ensureDataDir();
  const data = JSON.parse(fs.readFileSync(ENQUIRIES_FILE, 'utf-8'));

  const enquiry = {
    id: Date.now().toString(),
    ...formData,
    status: 'new',
    assignedFirms: [],
    submittedAt: new Date().toISOString()
  };

  data.enquiries.push(enquiry);
  fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(data, null, 2));
  return enquiry;
}

export async function POST(request) {
  try {
    const formData = await request.json();

    // Save to JSON file (Only works locally or in non-serverless)
    try {
      saveEnquiry(formData);
    } catch (fsError) {
      console.warn('Could not save to local file system (expected on Vercel):', fsError.message);
    }

    // Create email transporter (wrapped to prevent crashes)
    // Use dynamic import to bypass webpack bundling issues
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    let transporter;
    try {
      console.log('[SMTP] Creating transporter with config:', {
        host: process.env.SMTP_HOST,
        port: smtpPort,
        secure: smtpPort === 465,
        requireTLS: smtpPort === 587,
        user: process.env.SMTP_USER
      });

      // Dynamic import of nodemailer to bypass webpack
      const nodemailerModule = await import('nodemailer');
      const nodemailer = nodemailerModule.default;

      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: smtpPort,
        secure: smtpPort === 465, // Use true for 465, false for other ports (587 uses STARTTLS)
        requireTLS: smtpPort === 587, // Force STARTTLS for port 587
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: {
          rejectUnauthorized: false // Accept self-signed certificates (needed for some shared hosting)
        }
      });

      console.log('[SMTP] Transporter created successfully');
    } catch (transporterError) {
      console.error('[SMTP] Failed to create transporter:', {
        message: transporterError.message,
        stack: transporterError.stack
      });
    }

    // Format scope list
    const scopeList = formData.scope && formData.scope.length > 0
      ? formData.scope.join(', ')
      : 'Not specified';

    // Email to admin
    const adminEmail = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `🏠 New Homeowner Enquiry - ${formData.name}`,
      html: `
        <h2>New Homeowner Enquiry Received</h2>
        
        <h3>Contact Information</h3>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        
        <h3>Project Details</h3>
        <p><strong>Property Type:</strong> ${formData.property_type}</p>
        <p><strong>Renovation Type:</strong> ${formData.renovation_type}</p>
        <p><strong>Budget Range:</strong> ${formData.budget_range}</p>
        <p><strong>Timeline:</strong> ${formData.timeline}</p>
        <p><strong>Scope of Works:</strong> ${scopeList}</p>
        
        <h3>Working Style</h3>
        <p><strong>Decision Speed:</strong> ${formData.decision_speed}</p>
        <p><strong>Communication:</strong> ${formData.communication_pref}</p>
        <p><strong>Involvement Level:</strong> ${formData.involvement_level}</p>
        
        ${formData.additional_notes ? `
          <h3>Additional Notes</h3>
          <p>${formData.additional_notes}</p>
        ` : ''}
        
        <hr>
        <p style="color: #666; font-size: 0.9em;">
          Submitted: ${new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })}
        </p>
      `
    };

    // Confirmation email to homeowner
    const confirmationEmail = {
      from: process.env.SMTP_USER,
      to: formData.email,
      subject: 'roof - Enquiry Received',
      html: `
        <h2>Thank you for your enquiry!</h2>
        
        <p>Dear ${formData.name},</p>
        
        <p>We've received your renovation enquiry and will review your requirements shortly.</p>
        
        <p><strong>What happens next:</strong></p>
        <ul>
          <li>Our team will review your submission</li>
          <li>We'll match you with 2-4 suitable professionals</li>
          <li>You'll hear from us within 1-3 business days</li>
        </ul>
        
        <p>In the meantime, if you have any questions, feel free to reply to this email.</p>
        
        <p>Best regards,<br>The roof Team</p>
        
        <hr>
        <p style="color: #666; font-size: 0.9em;">
          This is an automated confirmation. Please do not reply to this email.
        </p>
      `
    };

    // Try to send emails (optional - don't fail if SMTP not configured)
    if (transporter && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        console.log('[EMAIL] Starting email send process...');
        console.log('[EMAIL] SMTP Config:', {
          host: process.env.SMTP_HOST,
          port: smtpPort,
          user: process.env.SMTP_USER,
          secure: smtpPort === 465
        });

        await transporter.sendMail(adminEmail);
        console.log('[EMAIL] Admin email sent successfully');

        await transporter.sendMail(confirmationEmail);
        console.log('[EMAIL] Confirmation email sent successfully');
      } catch (emailError) {
        console.error('[EMAIL] Email error (non-fatal):', {
          message: emailError.message,
          code: emailError.code,
          command: emailError.command,
          response: emailError.response
        });
      }
    } else {
      console.warn('[EMAIL] SMTP credentials not configured, skipping email');
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process enquiry' },
      { status: 500 }
    );
  }
}
