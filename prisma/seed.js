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
      contentDe: `<h2>Allgemeine Geschäftsbedingungen – Camping im Sülztal</h2>
<h3>1. Zustandekommen des Vertrags</h3>
<p>Reservierungen können schriftlich, per E-Mail oder Online-Buchungssystem vorgenommen werden. Mit der Anmeldung bietet der Campinggast dem Campingplatz den Abschluss eines Campingvertrages an. Der Campingvertrag kommt erst mir der schriftlichen Buchungsbestätigung durch den Campingplatz und der Überweisung der Anzahlung gem. Ziff. 3. zustande. Ein Anspruch auf einen bestimmten Stellplatz und/oder Stellplatznummer besteht nicht.</p>
<h3>2. Entgelt</h3>
<p>Die vom Campinggast zu zahlenden Preise ergeben sich aus den jährlich aktualisierten Preislisten des Campingplatzes. Der Gast hat sich über die im Anmeldezeitraum geltenden Preise für die angebotenen Leistungen zu informieren.</p>
<h3>3. Zahlungsbedingungen</h3>
<p>Mit Zugang der Buchungsanfrage wird eine Anzahlung fällig. Diese beträgt 30% der Gesamtkosten und ist innerhalb von 3 Tagen ab Zugang der Buchungsbestätigung auf unser Konto:</p>
<p>Kontoinhaber: Wolfgang Mückl<br>Bank: ING Bank<br>IBAN: DE60500105176000323861<br>BIC: INGDDEFFXXX</p>
<p>unter Angabe der Buchungsnummer (Anfrage ID) zu zahlen.</p>
<p>Der verbleibende Restbetrag ist bei Ankunft vor Ort beim Platzwart in bar zu begleichen.</p>
<p>Bei fruchtlosem Verstreichen der Frist für den Zahlungseingang wird die Reservierung ohne gesonderte Benachrichtigung gelöscht und es kommt kein wirksamer Vertrag zustande.</p>
<h3>4. An- und Abreisezeiten</h3>
<p>Der Stellplatz steht dem Campinggast am Anreisetag zur Verfügung. Bei Anreise nach 18.00 Uhr bitten wir um Benachrichtigung. Der Campinggast darf den Campingplatz nur mit angemeldeten Fahrzeugen befahren. Der Stellplatz muss am Abreisetag sauber verlassen werden. Die Berechung der Platzmiete erfolgt pro Tag. Die vertragsgerechte Räumung ist jedoch Hauptpflicht des Campinggastes.</p>
<h3>5. Aufenthalt / Besuch</h3>
<p>Der Campingplatz darf nur mit der angemeldeten Personenanzahl genutzt werden. Besucher müssen bei Betreten des Platzes beim Platzwart angemeldet werden. Der Stellplatz darf nur mit einer Campingausrüstung (1 Zelt oder 1 Wohnwagen inkl. 1 Auto oder 1 Wohnmobil) belegt werden.</p>
<p>Der Campinggast erkennt für sich und für die von ihm angemeldeten Personen die Platzordnung an. Diese ist Bestandteil des Vertrags. Sie ist auf dem Campingplatz ausgehängt, im Internet veröffentlicht und kann auf Wunsch übersandt werden.</p>
<h3>6. Mängel</h3>
<p>Sofern der zugewiesene Stellplatz bzw. sonstige Vertragsleistungen nicht den vertraglich vereinbarten Eigenschaften entsprechen, hat der Campinggast der Campingverwaltung die Mängel am Feststellungstag, spätestens aber am darauf folgenden Tag anzuzeigen.</p>
<h3>7. Haftung</h3>
<p>Der Gast und die ihn begleitenden Personen verpflichten sich, den Stellplatz sowie Gebäude, Einrichtungen, Inventar etc. des Campingplatzes pfleglich zu behandeln. Schäden die während des Aufenthaltes durch den Gast selbst oder dessen Begleitpersonen verursacht werden, sind dem Vermieter oder Erfüllungsgehilfen (Platzwart) umgehend mitzuteilen und mit Ausnahme der Beweisführung des Nichtverschuldens zu ersetzen. Ansprüche des Campinggastes auf Schadensersatz sind ausgeschlossen. Hiervon ausgenommen sind Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit, wenn der Campingplatz die Pflichtverletzung zu vertreten hat, sonstige Schäden, die auf einer vorsätzlichen oder grob fahrlässigen Pflichtverletzung des Campingplatzes beruhen und Schäden, die auf einer vorsätzlichen oder fahrlässigen Verletzung von vertragstypischen Pflichten des Campingplatzes beruhen. Einer Pflichtverletzung des Campingplatzes steht die eines gesetzlichen Vertreters oder Erfüllungsgehilfen gleich.</p>
<p>Der Campingplatz weist jedoch ausdrücklich darauf hin, dass aus der Natur herrührende Unregelmäßigkeiten, Beschädigungen oder Verluste (z.B. Baumfrüchte, Insekten, Tiere, Astwerk etc.) auftreten können.</p>
<h3>8. Umbuchung/Rücktritt</h3>
<p>Umbuchungen wirksamer Verträge sind ohne rechtsverbindlichen Anspruch des Gastes grundsätzlich möglich. Der Campinggast kann jederzeit vor Reisebeginn vom Vertrag zurücktreten. Die Rücktrittserklärung ist schriftlich vorzunehmen. Tritt der Campinggast vom Vertrag zurück, kann der Campingplatz pauschalierte Rücktrittskosten verlangen, bei deren Berechnung die gewöhnlich anderweitige Verwendung der Leistung sowie ersparte Aufwendungen berücksichtigt sind.</p>
<p>Bei Nichtanreise ohne Kündigungserklärung, verspäteter Anreise, Verkürzung oder vorzeitiger Abreise ist das vertragliche Entgelt in voller Höhe zu zahlen. Sowohl für diese Fälle als auch für den Fall einer Kündigungserklärung vor Reiseantritt steht dem Campinggast der Nachweis frei, dass die vorgenannten Ansprüche nicht oder nicht in der geforderten Höhe entstanden sind. In jeden Fall empfehlen wir den Abschluss einer Reiserücktrittsversicherung.</p>
<p>Bei Nichtinanspruchnahme des Stellplatzes durch den Campinggast ohne Abstimmung mit dem Campingplatz, besteht für diesen die Möglichkeit, sich anderweitig um die Vermietung zu bemühen. Eine Verpflichtung hierzu besteht nicht. Etwaige Zahlungsansprüche des Vermieters bleiben unter Berücksichtigung o. g. Vereinbarungen unberührt. Der Campinggast verzichtet jedoch auf seine ihm zustehenden Rechte gegenüber dem Campingplatz, wenn er diese nicht bis zum Folgetag der Anreise 11.00 Uhr dem Vermieter anzeigt und geltend macht.</p>
<h3>9. Sonstige Vereinbarungen</h3>
<p>Soweit in den Allgemeinen Geschäftsbedingungen der Begriff Campingplatz verwendet wird, ist hiermit das Unternehmen Campingplatz im Sülztal, Inhaber Herr Wolfgang Mückl gemeint. Telefonische Auskünfte, Nebenabreden und sonstige Zusicherungen, gleich welcher Art, bedürfen zu ihrer Wirksamkeit der schriftlichen Bestätigung. Im Übrigen gelten die gesetzlichen Bestimmungen.</p>
<p>(Stand 02/2026)</p>`,
      contentEn: `<h2>General Terms and Conditions – Camping im Sülztal</h2>
<h3>1. Conclusion of Contract</h3>
<p>Reservations can be made in writing, by email or through the online booking system. By registering, the camping guest offers the campsite the conclusion of a camping contract. The camping contract is only concluded with the written booking confirmation by the campsite and the transfer of the deposit according to section 3. There is no claim to a specific pitch and/or pitch number.</p>
<h3>2. Fee</h3>
<p>The prices to be paid by the camping guest are based on the campsite's annually updated price lists. The guest must inform themselves about the prices applicable for the services offered during the registration period.</p>
<h3>3. Payment Terms</h3>
<p>Upon receipt of the booking request, a deposit is due. This amounts to 30% of the total costs and must be paid to our account within 3 days of receipt of the booking confirmation:</p>
<p>Account holder: Wolfgang Mückl<br>Bank: ING Bank<br>IBAN: DE60500105176000323861<br>BIC: INGDDEFFXXX</p>
<p>stating the booking number (request ID).</p>
<p>The remaining balance must be paid in cash on arrival at the site to the site manager.</p>
<p>If the deadline for receipt of payment expires fruitlessly, the reservation will be deleted without separate notification and no effective contract is concluded.</p>
<h3>4. Arrival and Departure Times</h3>
<p>The pitch is available to the camping guest on the day of arrival. We ask for notification if arriving after 6.00 p.m. The camping guest may only enter the campsite with registered vehicles. The pitch must be left clean on the day of departure. The calculation of the pitch rent is per day. However, the evacuation in accordance with the contract is the main obligation of the camping guest.</p>
<h3>5. Stay / Visit</h3>
<p>The campsite may only be used by the registered number of people. Visitors must be registered with the site manager when entering the site. The pitch may only be occupied by one set of camping equipment (1 tent or 1 caravan incl. 1 car or 1 motorhome).</p>
<p>The camping guest accepts the site rules for themselves and for the persons registered by them. These are part of the contract. They are posted at the campsite, published on the Internet and can be sent on request.</p>
<h3>6. Defects</h3>
<p>If the assigned pitch or other contractual services do not correspond to the contractually agreed properties, the camping guest must notify the campsite administration of the defects on the day of discovery, but no later than the following day.</p>
<h3>7. Liability</h3>
<p>The guest and the persons accompanying them undertake to treat the pitch as well as buildings, facilities, inventory etc. of the campsite with care. Damage caused during the stay by the guest themselves or their accompanying persons must be reported immediately to the landlord or vicarious agents (site manager) and, with the exception of proof of no fault, replaced. Claims for damages by the camping guest are excluded. Exceptions to this are damages resulting from injury to life, body or health if the campsite is responsible for the breach of duty, other damages based on an intentional or grossly negligent breach of duty by the campsite and damages based on an intentional or negligent breach of duties typical of the contract by the campsite. A breach of duty by the campsite is equivalent to that of a legal representative or vicarious agent.</p>
<p>However, the campsite explicitly points out that irregularities, damages or losses originating from nature (e.g. tree fruits, insects, animals, branches etc.) can occur.</p>
<h3>8. Rebooking/Withdrawal</h3>
<p>Rebookings of effective contracts are generally possible without a legally binding claim by the guest. The camping guest can withdraw from the contract at any time before the start of the trip. The declaration of withdrawal must be made in writing. If the camping guest withdraws from the contract, the campsite can demand flat-rate withdrawal costs, the calculation of which takes into account the usual other use of the service as well as saved expenses.</p>
<p>In the event of non-arrival without a notice of termination, late arrival, shortening or early departure, the contractual fee must be paid in full. For these cases as well as for the case of a notice of termination before the start of the trip, the camping guest is free to prove that the aforementioned claims have not arisen or have not arisen in the amount demanded. In any case, we recommend taking out travel cancellation insurance.</p>
<p>In the event of non-use of the pitch by the camping guest without coordination with the campsite, the campsite has the possibility to try to rent it elsewhere. There is no obligation to do so. Any payment claims of the landlord remain unaffected, taking into account the above agreements. However, the camping guest waives their rights to the campsite if they do not report and assert them to the landlord by 11.00 a.m. on the day following arrival.</p>
<h3>9. Other Agreements</h3>
<p>Insofar as the term campsite is used in the General Terms and Conditions, this refers to the company Campingplatz im Sülztal, owner Mr. Wolfgang Mückl. Information provided by telephone, secondary agreements and other assurances, regardless of their nature, require written confirmation for their effectiveness. Otherwise, the legal provisions apply.</p>
<p>(As of 02/2026)</p>`,
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
