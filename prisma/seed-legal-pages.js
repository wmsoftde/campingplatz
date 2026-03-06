const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const pages = [
  {
    slug: 'agb',
    titleDe: 'Allgemeine Geschäftsbedingungen',
    titleEn: 'Terms and Conditions',
    contentDe: `<h2>1. Geltungsbereich</h2><p>Diese Geschäftsbedingungen gelten für alle Reservierungen und Verträge auf unserem Campingplatz.</p><h2>2. Buchungen</h2><p>Eine Buchung wird erst nach unserer Bestätigung verbindlich.</p><h2>3. Stornierungen</h2><p>Stornierungen müssen schriftlich erfolgen. Es können Stornogebühren anfallen.</p>`,
    contentEn: `<h2>1. Scope</h2><p>These terms and conditions apply to all reservations and contracts at our campsite.</p><h2>2. Bookings</h2><p>A booking only becomes binding after our confirmation.</p><h2>3. Cancellations</h2><p>Cancellations must be made in writing. Cancellation fees may apply.</p>`,
    published: true,
  },
  {
    slug: 'datenschutz',
    titleDe: 'Datenschutzerklärung',
    titleEn: 'Privacy Policy',
    contentDe: `<h2>Datenschutz</h2><p>Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Personenbezogene Daten werden nur im Rahmen der gesetzlichen Vorschriften erhoben und verarbeitet.</p><h2>Cookies</h2><p>Wir verwenden nur technisch notwendige Cookies zur Bereitstellung unserer Dienste.</p>`,
    contentEn: `<h2>Privacy</h2><p>We take the protection of your personal data very seriously. Personal data is only collected and processed within the framework of legal regulations.</p><h2>Cookies</h2><p>We only use technically necessary cookies to provide our services.</p>`,
    published: true,
  },
  {
    slug: 'impressum',
    titleDe: 'Impressum',
    titleEn: 'Imprint',
    contentDe: `<h2>Angaben gemäß § 5 DDG</h2><p>Campingplatz Lohmar<br>Musterstraße 1<br>53797 Lohmar</p><h2>Kontakt</h2><p>Telefon: +49 (0) 123 456789<br>E-Mail: info@camping-lohmar.de</p>`,
    contentEn: `<h2>Information according to § 5 DDG</h2><p>Campsite Lohmar<br>Muster Street 1<br>53797 Lohmar</p><h2>Contact</h2><p>Phone: +49 (0) 123 456789<br>Email: info@camping-lohmar.de</p>`,
    published: true,
  }
];

async function seed() {
  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
    console.log(`Updated/Created page: ${page.slug}`);
  }
}

seed().catch(console.error).finally(() => prisma.$disconnect());
