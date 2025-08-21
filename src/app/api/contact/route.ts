import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

// Helper function to send contact form email
async function sendContactEmail(formData: ContactFormData) {
  try {
    if (!process.env.MAIL_HOST) {
      console.error("Mailer not configured. Check MAIL_HOST environment variable.");
      return { success: false, message: 'The contact form is not fully configured. Please contact the church directly.' };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || '587', 10),
      secure: (process.env.MAIL_PORT === '465'),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const subject = `New Contact Form Message from ${formData.firstName} ${formData.lastName}`;

    const emailHtml = `
      <h1>New Contact Form Submission</h1>
      <p>A new message has been submitted through the church website's contact form.</p>
      <hr>
      <h2>Details:</h2>
      <ul>
        <li><strong>From:</strong> ${formData.firstName} ${formData.lastName}</li>
        <li><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></li>
      </ul>
      <h2>Message:</h2>
      <p style="white-space: pre-wrap;">${formData.message}</p>
    `;

    const mailOptions = {
      from: process.env.MAIL_FROM || `"FBCF Website" <no-reply@fbfenton.org>`,
      to: 'info@fbfenton.org',
      replyTo: formData.email,
      subject: subject,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: 'Message sent successfully' };

  } catch (error) {
    console.error("Error processing contact form: ", error);
    return { success: false, message: 'An error occurred while sending your message.' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, subject: submittedSubject } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Save contact submission to database
    const savedSubmission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        subject: submittedSubject || 'General Inquiry',
        message,
      },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || '587', 10),
      secure: (process.env.MAIL_PORT === '465'),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const emailSubject = `New Contact Form Message from ${name}`;

    const emailHtml = `
      <h1>New Contact Form Submission</h1>
      <p>A new message has been submitted through the church website's contact form.</p>
      <hr>
      <h2>Details:</h2>
      <ul>
        <li><strong>From:</strong> ${name}</li>
        <li><strong>Email:</strong> <a href="mailto:${email}">${email}</a></li>
      </ul>
      <h2>Message:</h2>
      <p style="white-space: pre-wrap;">${message}</p>
    `;

    const mailOptions = {
      from: process.env.MAIL_FROM || `"FBCF Website" <no-reply@fbfenton.org>`,
      to: 'info@fbfenton.org',
      replyTo: email,
      subject: emailSubject,
      html: emailHtml,
    };

    if (!process.env.MAIL_HOST) {
        console.error("Mailer not configured. Check MAIL_HOST environment variable.");
        return NextResponse.json({ error: 'The contact form is not fully configured. Please contact the church directly.' }, { status: 503 });
    }

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      message: 'Message sent successfully',
      id: savedSubmission.id 
    });

  } catch (error) {
    console.error("Error processing contact form: ", error);
    return NextResponse.json({ error: 'An error occurred while sending your message.' }, { status: 500 });
  }
} 