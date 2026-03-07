const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({});

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      email: 'admin@campingplatz.de'
    }
  });

  await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteNameDe: 'Campingplatz',
      siteNameEn: 'Campsite',
      totalPlaces: 100,
      pricePlace: 8.00,
      priceAdult: 5.00,
      priceChild: 3.00,
      priceElectricity: 3.00,
      latitude: 51.5,
      longitude: 10.0,
      mapZoom: 13
    }
  });

  // Create/Update Legal Pages
  const legalPages = [
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

  for (const page of legalPages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {}, // We keep existing content if already present
      create: page
    });
    console.log(`Ensured legal page: ${page.slug}`);
  }

  // Check if nav links already exist
  const existingLinks = await prisma.navLink.count();
  
  if (existingLinks === 0) {
    // Create default navigation links
    const navLinks = [
      { labelDe: 'Über uns', labelEn: 'About us', url: '/about', position: 0, location: 'navbar' },
      { labelDe: 'Preise & Infos', labelEn: 'Prices & Info', url: '/prices', position: 1, location: 'navbar' },
      { labelDe: 'Buchung', labelEn: 'Booking', url: '/calendar', position: 2, location: 'navbar' },
      { labelDe: 'Neuigkeiten', labelEn: 'News', url: '/blog', position: 3, location: 'navbar' },
      { labelDe: 'Kontakt', labelEn: 'Contact', url: '/contact', position: 4, location: 'navbar' },
    ];

    for (const link of navLinks) {
      await prisma.navLink.create({ data: link });
    }
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
