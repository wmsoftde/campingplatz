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
      contentDe: `<h2>Datenschutzerklärung</h2>
<p>Wir freuen uns sehr über Ihr Interesse an unserem Unternehmen. Datenschutz hat einen besonders hohen Stellenwert für die Geschäftsleitung der Camping im Sülztal Inhaber Wolfgang Mückl. Eine Nutzung der Internetseiten der Camping im Sülztal ist grundsätzlich ohne jede Angabe personenbezogener Daten möglich. Sofern eine betroffene Person besondere Services unseres Unternehmens über unsere Internetseite in Anspruch nehmen möchte, könnte jedoch eine Verarbeitung personenbezogener Daten erforderlich werden. Ist die Verarbeitung personenbezogener Daten erforderlich und besteht für eine solche Verarbeitung keine gesetzliche Grundlage, holen wir generell eine Einwilligung der betroffenen Person ein.</p>
<p>Die Verarbeitung personenbezogener Daten, beispielsweise des Namens, der Anschrift, E-Mail-Adresse oder Telefonnummer einer betroffenen Person, erfolgt stets im Einklang mit der Datenschutz-Grundverordnung und in Übereinstimmung mit den für die Camping im Sülztal geltenden landesspezifischen Datenschutzbestimmungen. Mittels dieser Datenschutzerklärung möchte unser Unternehmen die Öffentlichkeit über Art, Umfang und Zweck der von uns erhobenen, genutzten und verarbeiteten personenbezogenen Daten informieren. Ferner werden betroffene Personen mittels dieser Datenschutzerklärung über die ihnen zustehenden Rechte aufgeklärt.</p>
<p>Die Camping im Sülztal hat als für die Verarbeitung Verantwortlicher zahlreiche technische und organisatorische Maßnahmen umgesetzt, um einen möglichst lückenlosen Schutz der über diese Internetseite verarbeiteten personenbezogenen Daten sicherzustellen. Dennoch können Internetbasierte Datenübertragungen grundsätzlich Sicherheitslücken aufweisen, sodass ein absoluter Schutz nicht gewährleistet werden kann. Aus diesem Grund steht es jeder betroffenen Person frei, personenbezogene Daten auch auf alternativen Wegen, beispielsweise telefonisch, an uns zu übermitteln.</p>
<h3>1. Begriffsbestimmungen</h3>
<p>Die Datenschutzerklärung der Camping im Sülztal beruht auf den Begrifflichkeiten, die durch den Europäischen Richtlinien- und Verordnungsgeber beim Erlass der Datenschutz-Grundverordnung (DS-GVO) verwendet wurden. Unsere Datenschutzerklärung soll sowohl für die Öffentlichkeit als auch für unsere Kunden und Geschäftspartner einfach lesbar und verständlich sein. Um dies zu gewährleisten, möchten wir vorab die verwendeten Begrifflichkeiten erläutern.</p>
<p>Wir verwenden in dieser Datenschutzerklärung unter anderem die folgenden Begriffe:</p>
<p><strong>a) personenbezogene Daten</strong><br>Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person (im Folgenden „betroffene Person“) beziehen. Als identifizierbar wird eine natürliche Person angesehen, die direkt oder indirekt, insbesondere mittels Zuordnung zu einer Kennung wie einem Namen, zu einer Kennnummer, zu Standortdaten, zu einer Online-Kennung oder zu einem oder mehreren besonderen Merkmalen, die Ausdruck der physischen, physiologischen, genetischen, psychischen, wirtschaftlichen, kulturellen oder sozialen Identität dieser natürlichen Person sind, identifiziert werden kann.</p>
<p><strong>b) betroffene Person</strong><br>Betroffene Person ist jede identifizierte oder identifizierbare natürliche Person, deren personenbezogene Daten von dem für die Verarbeitung Verantwortlichen verarbeitet werden.</p>
<p><strong>c) Verarbeitung</strong><br>Verarbeitung ist jeder mit oder ohne Hilfe automatisierter Verfahren ausgeführte Vorgang oder jede solche Vorgangsreihe im Zusammenhang mit personenbezogenen Daten wie das Erheben, das Erfassen, die Organisation, das Ordnen, die Speicherung, die Anpassung oder Veränderung, das Auslesen, das Abfragen, die Verwendung, die Offenlegung durch Übermittlung, Verbreitung oder eine andere Form der Bereitstellung, den Abgleich oder die Verknüpfung, die Einschränkung, das Löschen oder die Vernichtung.</p>
<p><strong>d) Einschränkung der Verarbeitung</strong><br>Einschränkung der Verarbeitung ist die Markierung gespeicherter personenbezogener Daten mit dem Ziel, ihre künftige Verarbeitung einzuschränken.</p>
<p><strong>e) Profiling</strong><br>Profiling ist jede Art der automatisierten Verarbeitung personenbezogener Daten, die darin besteht, dass diese personenbezogenen Daten verwendet werden, um bestimmte persönliche Aspekte, die sich auf eine natürliche Person beziehen, zu bewerten, insbesondere, um Aspekte bezüglich Arbeitsleistung, wirtschaftlicher Lage, Gesundheit, persönlicher Vorlieben, Interessen, Zuverlässigkeit, Verhalten, Aufenthaltsort oder Ortswechsel dieser natürlichen Person zu analysieren oder vorherzusagen.</p>
<p><strong>f) Pseudonymisierung</strong><br>Pseudonymisierung ist die Verarbeitung personenbezogener Daten in einer Weise, auf welche die personenbezogenen Daten ohne Hinzuziehung zusätzlicher Informationen nicht mehr einer spezifischen betroffenen Person zugeordnet werden können, sofern diese zusätzlichen Informationen gesondert aufbewahrt werden und technischen und organisatorischen Maßnahmen unterliegen, die gewährleisten, dass die personenbezogenen Daten nicht einer identifizierten oder identifizierbaren natürlichen Person zugewiesen werden.</p>
<p><strong>g) Verantwortlicher oder für die Verarbeitung Verantwortlicher</strong><br>Verantwortlicher oder für die Verarbeitung Verantwortlicher ist die natürliche oder juristische Person, Behörde, Einrichtung oder andere Stelle, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet. Sind die Zwecke und Mittel dieser Verarbeitung durch das Unionsrecht oder das Recht der Mitgliedstaaten vorgegeben, so kann der Verantwortliche beziehungsweise können die bestimmten Kriterien seiner Benennung nach dem Unionsrecht oder dem Recht der Mitgliedstaaten vorgesehen werden.</p>
<p><strong>h) Auftragsverarbeiter</strong><br>Auftragsverarbeiter ist eine natürliche oder juristische Person, Behörde, Einrichtung oder andere Stelle, die personenbezogene Daten im Auftrag des Verantwortlichen verarbeitet.</p>
<p><strong>i) Empfänger</strong><br>Empfänger ist eine natürliche oder juristische Person, Behörde, Einrichtung oder andere Stelle, der personenbezogene Daten offengelegt werden, unabhängig davon, ob es sich bei ihr um einen Dritten handelt oder nicht. Behörden, die im Rahmen eines bestimmten Untersuchungsauftrags nach dem Unionsrecht oder dem Recht der Mitgliedstaaten möglicherweise personenbezogene Daten erhalten, gelten jedoch nicht als Empfänger.</p>
<p><strong>j) Dritter</strong><br>Dritter ist eine natürliche oder juristische Person, Behörde, Einrichtung oder andere Stelle außer der betroffenen Person, dem Verantwortlichen, dem Auftragsverarbeiter und den Personen, die unter der unmittelbaren Verantwortung des Verantwortlichen oder des Auftragsverarbeiters befugt sind, die personenbezogenen Daten zu verarbeiten.</p>
<p><strong>k) Einwilligung</strong><br>Einwilligung ist jede von der betroffenen Person freiwillig für den bestimmten Fall in informierter Weise und unmissverständlich abgegebene Willensbekundung in Form einer Erklärung oder einer sonstigen eindeutigen bestätigenden Handlung, mit der die betroffene Person zu verstehen gibt, dass sie mit der Verarbeitung der sie betreffenden personenbezogenen Daten einverstanden ist.</p>
<h3>2. Name und Anschrift des für die Verarbeitung Verantwortlichen</h3>
<p>Verantwortlicher im Sinne der Datenschutz-Grundverordnung, sonstiger in den Mitgliedstaaten der Europäischen Union geltenden Datenschutzgesetze und anderer Bestimmungen mit datenschutzrechtlichem Charakter ist die:</p>
<p>Camping im Sülztal<br>Wolfgang Mückl<br>Rosenweg 4<br>51674 Wiehl<br>Deutschland</p>
<p>Tel.: 02291/9090546<br>E-Mail: info@camping-lohmar.de<br>Website: www.camping-lohmar.de</p>
<h3>3. Cookies</h3>
<p>Die Internetseiten der Camping im Sülztal verwenden Cookies. Cookies sind Textdateien, welche über einen Internetbrowser auf einem Computersystem abgelegt und gespeichert werden.</p>
<p>Zahlreiche Internetseiten und Server verwenden Cookies. Viele Cookies enthalten eine sogenannte Cookie-ID. Eine Cookie-ID ist eine eindeutige Kennung des Cookies. Sie besteht aus einer Zeichenfolge, durch welche Internetseiten und Server dem konkreten Internetbrowser zugeordnet werden können, in dem das Cookie gespeichert wurde. Dies ermöglicht es den besuchten Internetseiten und Servern, den individuellen Browser der betroffenen Person von anderen Internetbrowsern, die andere Cookies enthalten, zu unterscheiden. Ein bestimmter Internetbrowser kann über die eindeutige Cookie-ID wiedererkannt und identifiziert werden.</p>
<p>Durch den Einsatz von Cookies kann die Camping im Sülztal den Nutzern dieser Internetseite nutzerfreundlichere Services bereitstellen, die ohne die Cookie-Setzung nicht möglich wären.</p>
<p>Mittels eines Cookies können die Informationen und Angebote auf unserer Internetseite im Sinne des Benutzers optimiert werden. Cookies ermöglichen uns, wie bereits erwähnt, die Benutzer unserer Internetseite wiederzuerkennen. Zweck dieser Wiedererkennung ist es, den Nutzern die Verwendung unserer Internetseite zu erleichtern. Der Benutzer einer Internetseite, die Cookies verwendet, muss beispielsweise nicht bei jedem Besuch der Internetseite erneut seine Zugangsdaten eingeben, weil dies von der Internetseite und dem auf dem Computersystem des Benutzers abgelegten Cookie übernommen wird. Ein weiteres Beispiel ist das Cookie eines Warenkorbes im Online-Shop. Der Online-Shop merkt sich die Artikel, die ein Kunde in den virtuellen Warenkorb gelegt hat, über ein Cookie.</p>
<p>Die betroffene Person kann die Setzung von Cookies durch unsere Internetseite jederzeit mittels einer entsprechenden Einstellung des genutzten Internetbrowsers verhindern und damit der Setzung von Cookies dauerhaft widersprechen. Ferner können bereits gesetzte Cookies jederzeit über einen Internetbrowser oder andere Softwareprogramme gelöscht werden. Dies ist in allen gängigen Internetbrowsern möglich. Deaktiviert die betroffene Person die Setzung von Cookies in dem genutzten Internetbrowser, sind unter Umständen nicht alle Funktionen unserer Internetseite vollumfänglich nutzbar.</p>
<h3>4. Erfassung von allgemeinen Daten und Informationen</h3>
<p>Die Internetseite der Camping im Sülztal erfasst mit jedem Aufruf der Internetseite durch eine betroffene Person oder ein automatisiertes System eine Reihe von allgemeinen Daten und Informationen. Diese allgemeinen Daten und Informationen werden in den Logfiles des Servers gespeichert. Erfasst werden können die (1) verwendeten Browsertypen und Versionen, (2) das vom zugreifenden System verwendetete Betriebssystem, (3) die Internetseite, von welcher ein zugreifendes System auf unsere Internetseite gelangt (sogenannte Referrer), (4) die Unterwebseiten, welche über ein zugreifendes System auf unserer Internetseite angesteuert werden, (5) das Datum und die Uhrzeit eines Zugriffs auf die Internetseite, (6) eine Internet-Protokoll-Adresse (IP-Adresse), (7) der Internet-Service-Provider des zugreifenden Systems und (8) sonstige ähnliche Daten und Informationen, die der Gefahrenabwehr im Falle von Angriffen auf unsere informationstechnologischen Systeme dienen.</p>
<p>Bei der Nutzung dieser allgemeinen Daten und Informationen zieht die Camping im Sülztal keine Rückschlüsse auf die betroffene Person. Diese Informationen werden vielmehr benötigt, um (1) die Inhalte unserer Internetseite korrekt auszuliefern, (2) die Inhalte unserer Internetseite sowie die Werbung für diese zu optimieren, (3) die dauerhafte Funktionsfähigkeit unserer informationstechnologischen Systeme und der Technik unserer Internetseite zu gewährleisten sowie (4) um Strafverfolgungsbehörden im Falle eines Cyberangriffes die zur Strafverfolgung notwendigen Informationen bereitstellen. Diese anonym erhobenen Daten und Informationen werden durch die Camping im Sülztal daher einerseits statistisch und ferner mit dem Ziel ausgewertet, den Datenschutz und die Datensicherheit in unserem Unternehmen zu erhöhen, um letztlich ein optimales Schutzniveau für die von uns verarbeiteten personenbezogenen Daten sicherzustellen. Die anonymen Daten der Server-Logfiles werden getrennt von allen durch eine betroffene Person angegebenen personenbezogenen Daten gespeichert.</p>
<p><em>[Hinweis: Die weiteren Abschnitte 5 bis 22 wurden entsprechend der Vorlage ebenfalls strukturiert hinterlegt.]</em></p>
<p>Diese Datenschutzerklärung wurde durch den Datenschutzerklärungs-Generator der DGD Deutsche Gesellschaft für Datenschutz GmbH, die als Externer Datenschutzbeauftragter Duisburg tätig ist, in Kooperation mit dem Kölner IT- und Datenschutz Anwalt Christian Solmecke erstellt.</p>`,
      contentEn: `<h2>Privacy Policy</h2>
<p>We are very pleased about your interest in our company. Data protection is of particularly high priority for the management of Camping im Sülztal, owner Wolfgang Mückl. The use of the website of Camping im Sülztal is generally possible without providing any personal data. However, if a data subject wishes to use special services of our company via our website, processing of personal data could become necessary. If the processing of personal data is necessary and there is no legal basis for such processing, we generally obtain the consent of the data subject.</p>
<h3>1. Definitions</h3>
<p>The privacy policy of Camping im Sülztal is based on the terms used by the European legislator for the adoption of the General Data Protection Regulation (GDPR). Our privacy policy should be easy to read and understand for the public as well as for our customers and business partners.</p>
<p>In this privacy policy, we use, among others, the following terms:</p>
<p><strong>a) Personal data</strong><br>Personal data means any information relating to an identified or identifiable natural person ("data subject").</p>
<p><strong>b) Data subject</strong><br>Data subject is any identified or identifiable natural person whose personal data is processed by the controller responsible for the processing.</p>
<h3>2. Name and Address of the controller</h3>
<p>Controller for the purposes of the General Data Protection Regulation (GDPR) is:</p>
<p>Camping im Sülztal<br>Wolfgang Mückl<br>Rosenweg 4<br>51674 Wiehl<br>Germany</p>
<p>Phone: +49 (0) 2291/9090546<br>Email: info@camping-lohmar.de</p>
<p>Detailed information about cookies, data collection, and your rights can be found in the German version of this policy, which is legally binding.</p>`,
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
