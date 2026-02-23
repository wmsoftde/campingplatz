const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

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
