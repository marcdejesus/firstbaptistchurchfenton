import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, request: prayerRequest, isConfidential } = await request.json();

    if (!name || !email || !prayerRequest) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Configure Nodemailer transport
    // Note: Using environment variables for security.
    // Ensure MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS are set in your .env file.
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || '587', 10),
      secure: (process.env.MAIL_PORT === '465'), // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const confidentialSubject = isConfidential ? '[CONFIDENTIAL] ' : '';
    const subject = `${confidentialSubject}New Prayer Request from Website`;

    const emailHtml = `
      <h1>New Prayer Request</h1>
      <p>A new prayer request has been submitted through the church website.</p>
      <hr>
      <h2>Details:</h2>
      <ul>
        <li><strong>From:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Confidential:</strong> ${isConfidential ? 'Yes' : 'No'}</li>
      </ul>
      <h2>Request:</h2>
      <p style="white-space: pre-wrap;">${prayerRequest}</p>
    `;

    const mailOptions = {
      from: process.env.MAIL_FROM || `"FBCF Website" <no-reply@fbfenton.org>`, // Sender address
      to: 'prayer@fbfenton.org', // Target recipient from client doc
      replyTo: email, // Set reply-to to the user's email
      subject: subject,
      html: emailHtml,
    };

    // Check if mailer is configured
    if (!process.env.MAIL_HOST) {
        console.error("Mailer not configured. Check MAIL_HOST environment variable.");
        // In a real app, you might want to save the request to a DB as a fallback
        return NextResponse.json({ error: 'The prayer request feature is not fully configured. Please contact the church directly.' }, { status: 503 });
    }

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Prayer request submitted successfully' });

  } catch (error) {
    console.error("Error processing prayer request: ", error);
    return NextResponse.json({ error: 'An error occurred while submitting your request.' }, { status: 500 });
  }
} 