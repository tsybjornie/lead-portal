import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FIRMS_FILE = path.join(DATA_DIR, 'firms.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(FIRMS_FILE)) {
    fs.writeFileSync(FIRMS_FILE, JSON.stringify({ firms: [] }, null, 2));
  }
}

function saveFirmApplication(formData) {
  ensureDataDir();
  const data = JSON.parse(fs.readFileSync(FIRMS_FILE, 'utf-8'));

  const firm = {
    id: Date.now().toString(),
    ...formData,
    status: 'pending',
    credits: 0,
    submittedAt: new Date().toISOString()
  };

  data.firms.push(firm);
  fs.writeFileSync(FIRMS_FILE, JSON.stringify(data, null, 2));
  return firm;
}

export async function POST(request) {
  try {
    const formData = await request.json();

    // Save to JSON file
    saveFirmApplication(formData);

    // Create email transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Email to admin
    const adminEmail = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `🏢 New Contractor/ID Application - ${formData.company_name}`,
      html: `
        <h2>New Contractor/ID Application</h2>
        
        <h3>Company Information</h3>
        <p><strong>Company Name:</strong> ${formData.company_name}</p>
        <p><strong>Registration Number:</strong> ${formData.company_reg}</p>
        <p><strong>Business Type:</strong> ${formData.role}</p>
        <p><strong>Years in Business:</strong> ${formData.years_experience}</p>
        
        <h3>Contact Person</h3>
        <p><strong>Name:</strong> ${formData.contact_person}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        
        <h3>Capacity & Preferences</h3>
        <p><strong>Monthly Project Capacity:</strong> ${formData.monthly_capacity} projects/month</p>
        <p><strong>High-Budget Projects (>$150k):</strong> ${formData.opt_in_high_touch ? 'YES' : 'NO'}</p>
        ${formData.portfolio_url ? `<p><strong>Portfolio:</strong> <a href="${formData.portfolio_url}">${formData.portfolio_url}</a></p>` : ''}
        
        ${formData.additional_info ? `
          <h3>Additional Information</h3>
          <p>${formData.additional_info}</p>
        ` : ''}
        
        <hr>
        <p style="color: #666; font-size: 0.9em;">
          Submitted: ${new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })}
        </p>
      `
    };

    // Confirmation email to applicant
    const confirmationEmail = {
      from: process.env.SMTP_USER,
      to: formData.email,
      subject: 'RenoBuilders - Application Received',
      html: `
        <h2>Application Received</h2>
        
        <p>Dear ${formData.contact_person},</p>
        
        <p>Thank you for applying to join the RenoBuilders network. We've received your application for <strong>${formData.company_name}</strong>.</p>
        
        <p><strong>What happens next:</strong></p>
        <ul>
          <li>Our team will review your credentials and capacity</li>
          <li>We may reach out for additional information</li>
          <li>You'll hear from us within 3-5 business days</li>
        </ul>
        
        <p>If you have any questions in the meantime, feel free to reply to this email.</p>
        
        <p>Best regards,<br>The RenoBuilders Team</p>
        
        <hr>
        <p style="color: #666; font-size: 0.9em;">
          This is an automated confirmation. Please do not reply to this email.
        </p>
      `
    };

    // Try to send emails (optional - don't fail if SMTP not configured)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        await transporter.sendMail(adminEmail);
        await transporter.sendMail(confirmationEmail);
      } catch (emailError) {
        console.error('Email error (non-fatal):', emailError);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    );
  }
}
