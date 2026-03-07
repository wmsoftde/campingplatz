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
      contentDe: `<p>Camping im Sülztal<br>Helmgesmühle<br>53797 Lohmar</p>
<h2>Betreiber:</h2>
<p>Wolfgang Mückl<br>Rosenweg 4<br>51674 Wiehl</p>
<p>Tel: 02291-9090546<br>Email: info@camping-lohmar.de</p>
<p>USt.-IdNr.: DE 253602888</p>
<h2>Angaben nach § 5 DDG</h2>
<p>Verantwortlich für die Inhalte ist: Wolfgang Mückl</p>
<h3>HAFTUNGSAUSSCHLUSS HAFTUNG FÜR INHALTE</h3>
<p>DIE INHALTE UNSERER SEITEN WURDEN MIT GRÖSSTER SORGFALT ERSTELLT. FÜR DIE RICHTIGKEIT, VOLLSTÄNDIGKEIT UND AKTUALITÄT DER INHALTE KÖNNEN WIR JEDOCH KEINE GEWÄHR ÜBERNEHMEN. BEI BEKANNT WERDEN VON ENTSPRECHENDEN RECHTSVERLETZUNGEN WERDEN WIR DIESE INHALTE UMGEHEND ENTFERNEN.</p>
<h3>HAFTUNG FÜR LINKS</h3>
<p>UNSER ANGEBOT ENTHÄLT LINKS ZU EXTERNEN WEBSEITEN DRITTER, AUF DEREN INHALTE WIR KEINEN EINFLUSS HABEN. DESHALB KÖNNEN WIR FÜR DIESE FREMDEN INHALTE AUCH KEINE GEWÄHR ÜBERNEHMEN. FÜR DIE INHALTE DER VERLINKTEN SEITEN IST STETS DER JEWEILIGE ANBIETER ODER BETREIBER DER SEITEN VERANTWORTLICH. DIE VERLINKTEN SEITEN WURDEN ZUM ZEITPUNKT DER VERLINKUNG AUF MÖGLICHE RECHTSVERSTÖSSE ÜBERPRÜFT. RECHTSWIDRIGE INHALTE WAREN ZUM ZEITPUNKT DER VERLINKUNG NICHT ERKENNBAR. EINE PERMANENTE INHALTLICHE KONTROLLE DER VERLINKTEN SEITEN IST JEDOCH OHNE KONKRETE ANHALTSPUNKTE EINER RECHTSVERLETZUNG NICHT ZUMUTBAR. BEI BEKANNT WERDEN VON RECHTSVERLETZUNGEN WERDEN WIR DERARTIGE LINKS UMGEHEND ENTFERNEN.</p>
<h3>URHEBERRECHT</h3>
<p>DIE DURCH DIE SEITENBETREIBER ERSTELLTEN INHALTE UND WERKE AUF DIESEN SEITEN UNTERLIEGEN DEM DEUTSCHEN URHEBERRECHT. DIE VERVIELFÄLTIGUNG, BEARBEITUNG, VERBREITUNG UND JEDE ART DER VERWERTUNG AUSSERHALB DER GRENZEN DES URHEBERRECHTES BEDÜRFEN DER SCHRIFTLICHEN ZUSTIMMUNG DES JEWEILIGEN AUTORS BZW. ERSTELLERS. DOWNLOADS UND KOPIEN DIESER SEITE SIND NUR FÜR DEN PRIVATEN, NICHT KOMMERZIELLEN GEBRAUCH GESTATTET. SOWEIT DIE INHALTE AUF DIESER SEITE NICHT VOM BETREIBER ERSTELLT WURDEN, WERDEN DIE URHEBERRECHTE DRITTER BEACHTET. INSBESONDERE WERDEN INHALTE DRITTER ALS SOLCHE GEKENNZEICHNET. SOLLTEN SIE TROTZDEM AUF EINE URHEBERRECHTSVERLETZUNG AUFMERKSAM WERDEN, BITTEN WIR UM EINEN ENTSPRECHENDEN HINWEIS. BEI BEKANNTWERDEN VON RECHTSVERLETZUNGEN WERDEN WIR DERARTIGE INHALTE UMGEHEND ENTFERNEN.</p>
<h3>DATENSCHUTZ</h3>
<p>DIE NUTZUNG UNSERER WEBSEITE IST IN DER REGEL OHNE ANGABE PERSONENBEZOGENER DATEN MÖGLICH. SOWEIT AUF UNSEREN SEITEN PERSONENBEZOGENE DATEN (BEISPIELSWEISE NAME, ANSCHRIFT ODER EMAIL-ADRESSEN) ERHOBEN WERDEN, ERFOLGT DIES, SOWEIT MÖGLICH, STETS AUF FREIWILLIGER BASIS. DIESE DATEN WERDEN OHNE IHRE AUSDRÜCKLICHE ZUSTIMMUNG NICHT AN DRITTE WEITERGEGEBEN. WIR WEISEN DARAUF HIN, DASS DIE DATENÜBERTRAGUNG IM INTERNET (Z.B. BEI DER KOMMUNIKATION PER E-MAIL) SICHERHEITSLÜCKEN AUFWEISEN KANN. EIN LÜCKENLOSER SCHUTZ DER DATEN VOR DEM ZUGRIFF DURCH DRITTE IST NICHT MÖGLICH. DER NUTZUNG VON IM RAHMEN DER IMPRESSUMSPFLICHT VERÖFFENTLICHTEN KONTAKTDATEN DURCH DRITTE ZUR ÜBERSENDUNG VON NICHT AUSDRÜCKLICH ANGEFORDERTER WERBUNG UND INFORMATIONSMATERIALIEN WIRD HIERMIT AUSDRÜCKLICH WIDERSPROCHEN. DIE BETREIBER DER SEITEN BEHALTEN SICH AUSDRÜCKLICH RECHTLICHE SCHRITTE IM FALLE DER UNVERLANGTEN ZUSENDUNG VON WERBEINFORMATIONEN, ETWA DURCH SPAM-MAILS, VOR.</p>`,
      contentEn: `<p>Camping im Sülztal<br>Helmgesmühle<br>53797 Lohmar</p>
<h2>Operator:</h2>
<p>Wolfgang Mückl<br>Rosenweg 4<br>51674 Wiehl</p>
<p>Phone: +49 (0) 2291-9090546<br>Email: info@camping-lohmar.de</p>
<p>VAT ID: DE 253602888</p>
<h2>Information according to § 5 DDG</h2>
<p>Responsible for the content is: Wolfgang Mückl</p>
<h3>DISCLAIMER - LIABILITY FOR CONTENT</h3>
<p>THE CONTENT OF OUR PAGES WAS CREATED WITH THE GREATEST CARE. HOWEVER, WE CANNOT ASSUME ANY LIABILITY FOR THE ACCURACY, COMPLETENESS AND TOPICALITY OF THE CONTENT. UPON BECOMING AWARE OF CORRESPONDING LEGAL VIOLATIONS, WE WILL REMOVE THIS CONTENT IMMEDIATELY.</p>
<h3>LIABILITY FOR LINKS</h3>
<p>OUR OFFER CONTAINS LINKS TO EXTERNAL THIRD-PARTY WEBSITES OVER WHOSE CONTENT WE HAVE NO INFLUENCE. THEREFORE, WE CANNOT ASSUME ANY LIABILITY FOR THIS EXTERNAL CONTENT. THE RESPECTIVE PROVIDER OR OPERATOR OF THE PAGES IS ALWAYS RESPONSIBLE FOR THE CONTENT OF THE LINKED PAGES. THE LINKED PAGES WERE CHECKED FOR POSSIBLE LEGAL VIOLATIONS AT THE TIME OF LINKING. ILLEGAL CONTENT WAS NOT RECOGNIZABLE AT THE TIME OF LINKING. HOWEVER, PERMANENT MONITORING OF THE CONTENT OF THE LINKED PAGES IS NOT REASONABLE WITHOUT CONCRETE EVIDENCE OF A LEGAL VIOLATION. UPON BECOMING AWARE OF LEGAL VIOLATIONS, WE WILL REMOVE SUCH LINKS IMMEDIATELY.</p>
<h3>COPYRIGHT</h3>
<p>THE CONTENT AND WORKS CREATED BY THE PAGE OPERATORS ON THESE PAGES ARE SUBJECT TO GERMAN COPYRIGHT LAW. THE DUPLICATION, EDITING, DISTRIBUTION AND ANY KIND OF EXPLOITATION OUTSIDE THE LIMITS OF COPYRIGHT LAW REQUIRE THE WRITTEN CONSENT OF THE RESPECTIVE AUTHOR OR CREATOR. DOWNLOADS AND COPIES OF THIS PAGE ARE ONLY PERMITTED FOR PRIVATE, NON-COMMERCIAL USE. AS FAR AS THE CONTENT ON THIS PAGE WAS NOT CREATED BY THE OPERATOR, THE COPYRIGHTS OF THIRD PARTIES ARE OBSERVED. IN PARTICULAR, THIRD-PARTY CONTENT IS MARKED AS SUCH. SHOULD YOU NEVERTHELESS BECOME AWARE OF A COPYRIGHT INFRINGEMENT, WE ASK FOR A CORRESPONDING NOTICE. UPON BECOMING AWARE OF LEGAL VIOLATIONS, WE WILL REMOVE SUCH CONTENT IMMEDIATELY.</p>
<h3>PRIVACY</h3>
<p>THE USE OF OUR WEBSITE IS GENERALLY POSSIBLE WITHOUT PROVIDING PERSONAL DATA. AS FAR AS PERSONAL DATA (FOR EXAMPLE NAME, ADDRESS OR EMAIL ADDRESSES) IS COLLECTED ON OUR PAGES, THIS IS ALWAYS DONE ON A VOLUNTARY BASIS AS FAR AS POSSIBLE. THIS DATA WILL NOT BE PASSED ON TO THIRD PARTIES WITHOUT YOUR EXPRESS CONSENT. WE POINT OUT THAT DATA TRANSMISSION OVER THE INTERNET (E.G. WHEN COMMUNICATING BY E-MAIL) CAN HAVE SECURITY GAPS. COMPLETE PROTECTION OF DATA FROM ACCESS BY THIRD PARTIES IS NOT POSSIBLE. THE USE OF CONTACT DATA PUBLISHED AS PART OF THE IMPRINT OBLIGATION BY THIRD PARTIES FOR SENDING ADVERTISING AND INFORMATION MATERIALS NOT EXPRESSLY REQUESTED IS HEREBY EXPRESSLY OBJECTED TO. THE OPERATORS OF THE PAGES EXPRESSLY RESERVE THE RIGHT TO TAKE LEGAL ACTION IN THE EVENT OF THE UNSOLICITED SENDING OF ADVERTISING INFORMATION, SUCH AS SPAM EMAILS.</p>`,
      published: true,
    }
  ];

  for (const page of legalPages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: page, // Use full page object for update to overwrite content
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
