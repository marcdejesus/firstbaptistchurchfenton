import nodemailer from 'nodemailer';

export interface EmailConfig {
  service?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailOptions {
  to: string | string[];
  from?: string;
  replyTo?: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure for Google SMTP (Gmail)
    const config: EmailConfig = {
      service: 'gmail', // Use Gmail service
      auth: {
        user: process.env.GOOGLE_SMTP_USER || process.env.MAIL_USER || '',
        pass: process.env.GOOGLE_SMTP_PASSWORD || process.env.MAIL_PASS || '',
      },
    };

    // Fallback to manual SMTP configuration if Google SMTP not configured
    if (!config.auth.user || !config.auth.pass) {
      const fallbackConfig: EmailConfig = {
        host: process.env.MAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.MAIL_PORT || '587', 10),
        secure: process.env.MAIL_PORT === '465',
        auth: {
          user: process.env.MAIL_USER || '',
          pass: process.env.MAIL_PASS || '',
        },
      };
      this.transporter = nodemailer.createTransport(fallbackConfig);
    } else {
      this.transporter = nodemailer.createTransport(config);
    }
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.isConfigured()) {
        throw new Error('Email service not configured. Please check environment variables.');
      }

      const mailOptions = {
        from: options.from || process.env.MAIL_FROM || `"${process.env.CHURCH_NAME || 'First Baptist Church'}" <${process.env.GOOGLE_SMTP_USER || process.env.MAIL_USER}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        replyTo: options.replyTo,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown email error',
      };
    }
  }

  async sendContactFormNotification(formData: {
    name: string;
    email: string;
    subject?: string;
    message: string;
    phone?: string;
    submissionId?: number;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const churchEmail = process.env.CHURCH_CONTACT_EMAIL || 'info@fbfenton.org';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .info-box { background: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; }
          .message-box { background: #fff; border: 1px solid #e2e8f0; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b; }
          .button { background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📧 New Contact Form Submission</h1>
          <p>Someone has reached out through your church website</p>
        </div>
        
        <div class="content">
          <div class="info-box">
            <h2>📋 Contact Information</h2>
            <ul style="list-style: none; padding: 0;">
              <li><strong>👤 Name:</strong> ${formData.name}</li>
              <li><strong>📧 Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></li>
              ${formData.phone ? `<li><strong>📞 Phone:</strong> <a href="tel:${formData.phone}">${formData.phone}</a></li>` : ''}
              <li><strong>📝 Subject:</strong> ${formData.subject || 'General Inquiry'}</li>
              ${formData.submissionId ? `<li><strong>🆔 Submission ID:</strong> #${formData.submissionId}</li>` : ''}
            </ul>
          </div>

          <div class="message-box">
            <h3>💬 Message</h3>
            <p style="white-space: pre-wrap;">${formData.message}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${formData.email}?subject=Re: ${encodeURIComponent(formData.subject || 'Your Inquiry')}" class="button">
              📧 Reply to ${formData.name}
            </a>
          </div>
        </div>

        <div class="footer">
          <p>This message was sent from your church website contact form.</p>
          <p>Submitted on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: churchEmail,
      replyTo: formData.email,
      subject: `🔔 New Contact: ${formData.subject || 'Website Inquiry'} - ${formData.name}`,
      html: htmlContent,
      text: `New Contact Form Submission

From: ${formData.name}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ''}
Subject: ${formData.subject || 'General Inquiry'}

Message:
${formData.message}

Reply to this email to respond directly to ${formData.name}.
`,
    });
  }

  async sendPrayerRequestNotification(requestData: {
    name: string;
    email?: string;
    phone?: string;
    message: string;
    isPublic: boolean;
    submissionId?: number;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const prayerEmail = process.env.CHURCH_PRAYER_EMAIL || 'prayer@fbfenton.org';
    
    const confidentialLabel = requestData.isPublic ? '' : '🔒 CONFIDENTIAL ';
    const privacyNote = requestData.isPublic 
      ? 'This prayer request may be shared publicly with the congregation.' 
      : 'This is a confidential prayer request and should not be shared publicly.';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .header { background: ${requestData.isPublic ? '#059669' : '#dc2626'}; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .info-box { background: #f8fafc; border-left: 4px solid ${requestData.isPublic ? '#059669' : '#dc2626'}; padding: 15px; margin: 20px 0; }
          .prayer-box { background: #fef7ff; border: 1px solid #e879f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .privacy-notice { background: ${requestData.isPublic ? '#ecfdf5' : '#fef2f2'}; border: 1px solid ${requestData.isPublic ? '#bbf7d0' : '#fecaca'}; padding: 15px; margin: 20px 0; border-radius: 8px; color: ${requestData.isPublic ? '#047857' : '#dc2626'}; }
          .footer { background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b; }
          .button { background: #8b5cf6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🙏 ${confidentialLabel}New Prayer Request</h1>
          <p>A community member needs prayer</p>
        </div>
        
        <div class="content">
          <div class="info-box">
            <h2>📋 Contact Information</h2>
            <ul style="list-style: none; padding: 0;">
              <li><strong>👤 Name:</strong> ${requestData.name}</li>
              ${requestData.email ? `<li><strong>📧 Email:</strong> <a href="mailto:${requestData.email}">${requestData.email}</a></li>` : ''}
              ${requestData.phone ? `<li><strong>📞 Phone:</strong> <a href="tel:${requestData.phone}">${requestData.phone}</a></li>` : ''}
              <li><strong>🔒 Privacy:</strong> ${requestData.isPublic ? 'Public (may be shared)' : 'Confidential (private)'}</li>
              ${requestData.submissionId ? `<li><strong>🆔 Request ID:</strong> #${requestData.submissionId}</li>` : ''}
            </ul>
          </div>

          <div class="prayer-box">
            <h3>🙏 Prayer Request</h3>
            <p style="white-space: pre-wrap;">${requestData.message}</p>
          </div>

          <div class="privacy-notice">
            <strong>📋 Privacy Notice:</strong> ${privacyNote}
          </div>

          ${requestData.email ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${requestData.email}?subject=Your Prayer Request" class="button">
              💌 Contact ${requestData.name}
            </a>
          </div>
          ` : ''}
        </div>

        <div class="footer">
          <p>This prayer request was submitted through your church website.</p>
          <p>Submitted on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p><em>"Therefore confess your sins to each other and pray for each other so that you may be healed." - James 5:16</em></p>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: prayerEmail,
      replyTo: requestData.email,
      subject: `🙏 ${confidentialLabel}Prayer Request from ${requestData.name}`,
      html: htmlContent,
      text: `${confidentialLabel}Prayer Request

From: ${requestData.name}
${requestData.email ? `Email: ${requestData.email}` : ''}
${requestData.phone ? `Phone: ${requestData.phone}` : ''}
Privacy: ${requestData.isPublic ? 'Public' : 'Confidential'}

Prayer Request:
${requestData.message}

Privacy Note: ${privacyNote}

${requestData.email ? `Reply to this email to contact ${requestData.name} directly.` : ''}
`,
    });
  }

  async sendAutoReply(type: 'contact' | 'prayer', recipientEmail: string, recipientName: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const churchName = process.env.CHURCH_NAME || 'First Baptist Church Fenton';
    const churchPhone = process.env.CHURCH_PHONE || '(810) 629-9425';
    const churchEmail = process.env.CHURCH_CONTACT_EMAIL || 'info@fbfenton.org';

    let subject: string;
    let htmlContent: string;
    let textContent: string;

    if (type === 'contact') {
      subject = `Thank you for contacting ${churchName}`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .info-box { background: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; }
            .footer { background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✅ Message Received</h1>
            <p>Thank you for reaching out!</p>
          </div>
          
          <div class="content">
            <p>Dear ${recipientName},</p>
            
            <p>Thank you for contacting ${churchName}! We have received your message and someone from our team will get back to you within 24-48 hours.</p>
            
            <div class="info-box">
              <h3>📞 Need Immediate Assistance?</h3>
              <p>If you have an urgent matter, please feel free to call us directly:</p>
              <ul>
                <li><strong>Phone:</strong> <a href="tel:${churchPhone}">${churchPhone}</a></li>
                <li><strong>Email:</strong> <a href="mailto:${churchEmail}">${churchEmail}</a></li>
              </ul>
            </div>

            <p>We look forward to connecting with you!</p>
            
            <p>Blessings,<br/>
            The ${churchName} Team</p>
          </div>

          <div class="footer">
            <p><em>"Be joyful in hope, patient in affliction, faithful in prayer." - Romans 12:12</em></p>
          </div>
        </body>
        </html>
      `;
      textContent = `Dear ${recipientName},

Thank you for contacting ${churchName}! We have received your message and someone from our team will get back to you within 24-48 hours.

Need immediate assistance?
Phone: ${churchPhone}
Email: ${churchEmail}

We look forward to connecting with you!

Blessings,
The ${churchName} Team

"Be joyful in hope, patient in affliction, faithful in prayer." - Romans 12:12`;
    } else {
      subject = `Prayer Request Received - ${churchName}`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
            .header { background: #8b5cf6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .info-box { background: #fef7ff; border-left: 4px solid #8b5cf6; padding: 15px; margin: 20px 0; }
            .footer { background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🙏 Prayer Request Received</h1>
            <p>We're praying for you</p>
          </div>
          
          <div class="content">
            <p>Dear ${recipientName},</p>
            
            <p>Thank you for sharing your prayer request with ${churchName}. We want you to know that we have received your request and are lifting you up in prayer.</p>
            
            <div class="info-box">
              <h3>🙏 Our Commitment to You</h3>
              <ul>
                <li>Your prayer request has been shared with our prayer team</li>
                <li>We will be praying for you regularly</li>
                <li>If you provided contact information, someone may reach out to offer additional support</li>
                <li>Your privacy and confidentiality are important to us</li>
              </ul>
            </div>

            <p>If you have any additional prayer needs or would like to talk with someone from our pastoral team, please don't hesitate to contact us:</p>
            <ul>
              <li><strong>Phone:</strong> <a href="tel:${churchPhone}">${churchPhone}</a></li>
              <li><strong>Email:</strong> <a href="mailto:${churchEmail}">${churchEmail}</a></li>
            </ul>

            <p>May God's peace and comfort be with you.</p>
            
            <p>In Christ,<br/>
            The ${churchName} Prayer Team</p>
          </div>

          <div class="footer">
            <p><em>"Therefore confess your sins to each other and pray for each other so that you may be healed. The prayer of a righteous person is powerful and effective." - James 5:16</em></p>
          </div>
        </body>
        </html>
      `;
      textContent = `Dear ${recipientName},

Thank you for sharing your prayer request with ${churchName}. We want you to know that we have received your request and are lifting you up in prayer.

Our Commitment to You:
- Your prayer request has been shared with our prayer team
- We will be praying for you regularly
- If you provided contact information, someone may reach out to offer additional support
- Your privacy and confidentiality are important to us

If you have any additional prayer needs or would like to talk with someone from our pastoral team, please contact us:
Phone: ${churchPhone}
Email: ${churchEmail}

May God's peace and comfort be with you.

In Christ,
The ${churchName} Prayer Team

"Therefore confess your sins to each other and pray for each other so that you may be healed. The prayer of a righteous person is powerful and effective." - James 5:16`;
    }

    return this.sendEmail({
      to: recipientEmail,
      subject,
      html: htmlContent,
      text: textContent,
    });
  }

  isConfigured(): boolean {
    const user = process.env.GOOGLE_SMTP_USER || process.env.MAIL_USER;
    const pass = process.env.GOOGLE_SMTP_PASSWORD || process.env.MAIL_PASS;
    return !!(user && pass);
  }
}

// Export a singleton instance
export const emailService = new EmailService();
