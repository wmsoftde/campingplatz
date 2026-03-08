import nodemailer from 'nodemailer';
import { prisma } from './db';

interface EmailSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  smtpFrom: string;
}

export async function getEmailSettings(): Promise<EmailSettings | null> {
  const settings = await prisma.settings.findFirst();
  if (!settings?.smtpHost || !settings?.smtpFrom) {
    return null;
  }
  return {
    smtpHost: settings.smtpHost,
    smtpPort: settings.smtpPort,
    smtpUser: settings.smtpUser,
    smtpPassword: settings.smtpPassword,
    smtpFrom: settings.smtpFrom
  };
}

export async function sendEmail(to: string, subject: string, html: string) {
  const emailSettings = await getEmailSettings();
  
  if (!emailSettings) {
    console.log('Email not configured, skipping send:', { to, subject });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: emailSettings.smtpHost,
    port: parseInt(emailSettings.smtpPort) || 587,
    secure: false,
    auth: {
      user: emailSettings.smtpUser,
      pass: emailSettings.smtpPassword
    }
  });

  try {
    await transporter.sendMail({
      from: emailSettings.smtpFrom,
      to,
      subject,
      html
    });
    console.log('Email sent:', { to, subject });
  } catch (error) {
    console.error('Email send error:', error);
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
  const settings = await prisma.settings.findFirst();
  if (!settings) return;

  const template = locale === 'de' ? settings.emailConfirmDe : settings.emailConfirmEn;
  const subject = locale === 'de' ? 'Buchungsbestätigung' : 'Booking Confirmation';

  const html = `
    <h1>${subject}</h1>
    <p>${template}</p>
    <h2>Buchungsdetails:</h2>
    <ul>
      <li>Name: ${booking.firstName} ${booking.lastName}</li>
      <li>Anreise: ${formatDate(booking.checkIn)}</li>
      <li>Abreise: ${formatDate(booking.checkOut)}</li>
      <li>Erwachsene: ${booking.adults}</li>
      <li>Kinder: ${booking.children}</li>
      <li>Gesamtpreis: €${booking.totalPrice.toFixed(2)}</li>
    </ul>
  `;

  await sendEmail(booking.email, subject, html);
}

export async function sendBookingStatusUpdate(
  booking: any, 
  status: 'confirmed' | 'cancelled' | 'rejected',
  locale: string = 'de'
) {
  const settings = await prisma.settings.findFirst();
  if (!settings) return;

  let template = '';
  let subject = '';

  switch (status) {
    case 'confirmed':
      template = locale === 'de' ? settings.emailConfirmDe : settings.emailConfirmEn;
      subject = locale === 'de' ? 'Buchung bestätigt' : 'Booking confirmed';
      break;
    case 'cancelled':
      template = locale === 'de' ? settings.emailCancelDe : settings.emailCancelEn;
      subject = locale === 'de' ? 'Buchung storniert' : 'Booking cancelled';
      break;
    case 'rejected':
      template = locale === 'de' ? settings.emailRejectDe : settings.emailRejectEn;
      subject = locale === 'de' ? 'Buchung abgelehnt' : 'Booking rejected';
      break;
  }

  const html = `
    <h1>${subject}</h1>
    <p>${template}</p>
    <h2>Buchungsdetails:</h2>
    <ul>
      <li>Name: ${booking.firstName} ${booking.lastName}</li>
      <li>Anreise: ${formatDate(booking.checkIn)}</li>
      <li>Abreise: ${formatDate(booking.checkOut)}</li>
    </ul>
  `;

  await sendEmail(booking.email, subject, html);
}
