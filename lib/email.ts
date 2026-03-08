import nodemailer from 'nodemailer';
import { prisma } from './db';

interface EmailSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  smtpFrom: string;
  siteEmail: string;
  siteName: string;
}

export async function getEmailSettings(): Promise<EmailSettings | null> {
  const settings = await prisma.settings.findUnique({
    where: { id: 'default' }
  });
  
  if (!settings?.smtpHost || !settings?.smtpFrom) {
    console.error('Email settings incomplete:', { 
      host: !!settings?.smtpHost, 
      from: !!settings?.smtpFrom 
    });
    return null;
  }
  
  return {
    smtpHost: settings.smtpHost,
    smtpPort: settings.smtpPort,
    smtpUser: settings.smtpUser,
    smtpPassword: settings.smtpPassword,
    smtpFrom: settings.smtpFrom,
    siteEmail: settings.email, // This is the campsite's own email address
    siteName: settings.siteNameDe || 'Campingplatz'
  };
}

export async function sendEmail(to: string, subject: string, html: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const emailSettings = await getEmailSettings();
  
  if (!emailSettings) {
    const err = 'Email not configured in database';
    console.error(err, 'skipping send to:', to);
    return { success: false, error: err };
  }

  const port = parseInt(emailSettings.smtpPort) || 587;
  // Use secure: true for port 465, false for others (like 587 with STARTTLS)
  const isSecure = port === 465;

  const transporter = nodemailer.createTransport({
    host: emailSettings.smtpHost,
    port: port,
    secure: isSecure,
    auth: {
      user: emailSettings.smtpUser,
      pass: emailSettings.smtpPassword
    },
    tls: {
      // Do not fail on invalid certs (common on shared hosting)
      rejectUnauthorized: false
    }
  });

  try {
    const fromString = `"${emailSettings.siteName}" <${emailSettings.smtpFrom}>`;
    console.log(`Attempting to send email to ${to} from ${fromString}`);
    
    const info = await transporter.sendMail({
      from: fromString,
      to,
      subject,
      html
    });
    console.log('Email successfully sent to:', to, 'MessageID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('CRITICAL: Email send error for recipient', to, ':', error);
    return { success: false, error: error.message || String(error) };
  }
}

function formatDate(date: Date | string) {
  const d = new Date(date);
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();
  return `${day}.${month}.${year}`;
}

export async function sendBookingConfirmation(booking: any, locale: string = 'de') {
  const settings = await prisma.settings.findUnique({
    where: { id: 'default' }
  });
  
  if (!settings) return;

  const template = locale === 'de' ? settings.emailConfirmDe : settings.emailConfirmEn;
  const subject = locale === 'de' ? 'Eingang Ihrer Buchungsanfrage - Camping im Sülztal' : 'Booking Request Received - Camping im Sülztal';

  const bookingDetails = `
    <h2>Details Ihrer Buchungsanfrage / Booking Request Details:</h2>
    <ul>
      <li><strong>Name:</strong> ${booking.firstName} ${booking.lastName}</li>
      <li><strong>Anreise / Check-In:</strong> ${formatDate(booking.checkIn)}</li>
      <li><strong>Abreise / Check-Out:</strong> ${formatDate(booking.checkOut)}</li>
      <li><strong>Erwachsene / Adults:</strong> ${booking.adults}</li>
      <li><strong>Kinder / Children:</strong> ${booking.children}</li>
      <li><strong>Strom / Electricity:</strong> ${booking.electricity ? (locale === 'de' ? 'Ja' : 'Yes') : (locale === 'de' ? 'Nein' : 'No')}</li>
      <li><strong>Gesamtpreis / Total Price:</strong> €${booking.totalPrice.toFixed(2)}</li>
    </ul>
    <p><strong>Telefon:</strong> ${booking.phone}</p>
    <p><strong>E-Mail:</strong> ${booking.email}</p>
  `;

  // 1. Send to Guest
  const htmlGuest = `
    <h1>${subject}</h1>
    <p>${template}</p>
    ${bookingDetails}
  `;
  await sendEmail(booking.email, subject, htmlGuest);

  // 2. Send Notification to Campsite Owner (if email is set)
  if (settings.email) {
    const subjectAdmin = `NEUE BUCHUNGSANFRAGE: ${booking.firstName} ${booking.lastName}`;
    const htmlAdmin = `
      <h1>Neue Buchungsanfrage</h1>
      <p>Es ist eine neue Buchungsanfrage über die Website eingegangen:</p>
      ${bookingDetails}
      <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || ''}/admin/bookings">Hier klicken, um Buchungen im Admin-Bereich zu verwalten</a></p>
    `;
    await sendEmail(settings.email, subjectAdmin, htmlAdmin);
  }
}

export async function sendBookingStatusUpdate(
  booking: any, 
  status: 'confirmed' | 'cancelled' | 'rejected',
  locale: string = 'de'
) {
  const settings = await prisma.settings.findUnique({
    where: { id: 'default' }
  });
  
  if (!settings) return;

  let template = '';
  let subject = '';

  switch (status) {
    case 'confirmed':
      template = locale === 'de' ? settings.emailConfirmDe : settings.emailConfirmEn;
      subject = locale === 'de' ? 'Buchungsanfrage bestätigt - Camping im Sülztal' : 'Booking request confirmed - Camping im Sülztal';
      break;
    case 'cancelled':
      template = locale === 'de' ? settings.emailCancelDe : settings.emailCancelEn;
      subject = locale === 'de' ? 'Buchungsanfrage storniert - Camping im Sülztal' : 'Booking request cancelled - Camping im Sülztal';
      break;
    case 'rejected':
      template = locale === 'de' ? settings.emailRejectDe : settings.emailRejectEn;
      subject = locale === 'de' ? 'Buchungsanfrage abgelehnt - Camping im Sülztal' : 'Booking request rejected - Camping im Sülztal';
      break;
  }

  const html = `
    <h1>${subject}</h1>
    <p>${template}</p>
    <h2>Details:</h2>
    <ul>
      <li>Name: ${booking.firstName} ${booking.lastName}</li>
      <li>Anreise: ${formatDate(booking.checkIn)}</li>
      <li>Abreise: ${formatDate(booking.checkOut)}</li>
      <li>Status: <strong>${status}</strong></li>
    </ul>
  `;

  await sendEmail(booking.email, subject, html);
}
