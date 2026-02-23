# Campingplatz Website - Technische Spezifikation

## 1. Projektübersicht

**Projektname:** Campingplatz Buchungssystem  
**Typ:** Vollständige Webanwendung mit CMS  
**Framework:** Next.js 14 (App Router)  
**Datenbank:** SQLite mit Prisma ORM  
**Sprachen:** Deutsch (de), Englisch (en)

## 2. Design-System

### Farbpalette
- **Primary:** `#2D5A27` (Waldgrün)
- **Primary Light:** `#4A7C44`
- **Primary Dark:** `#1E3D1A`
- **Secondary:** `#3B82F6` (Himmelblau)
- **Accent:** `#D4A574` (Sand/Erde)
- **Background:** `#F8F6F1` (Warmer Weißton)
- **Surface:** `#FFFFFF`
- **Text Primary:** `#1F2937`
- **Text Secondary:** `#6B7280`
- **Error:** `#DC2626`
- **Success:** `#16A34A`

### Typografie
- **Headings:** "Nunito", sans-serif (freundlich, rounded)
- **Body:** "Open Sans", sans-serif
- **Font Sizes:**
  - H1: 3rem (48px)
  - H2: 2.25rem (36px)
  - H3: 1.5rem (24px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)

### Layout
- Max Content Width: 1280px
- Responsive Breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

## 3. Datenbank-Schema (Prisma)

### Tables
- **User** (Admin-Login)
- **Page** (Statische Seiten)
- **Post** (Blog-Beiträge)
- **Booking** (Buchungen)
- **Settings** (Systemeinstellungen)
- **Media** (Medien-Dateien)

## 4. Routing-Struktur

```
/                     → Startseite
/[locale]/            → Startseite (i18n)
/[locale]/about      → Über uns
/[locale]/prices     → Preise & Infos
/[locale]/calendar   → Buchungskalender
/[locale]/blog       → Blog-Übersicht
/[locale]/blog/[slug] → Blog-Detailseite
/[locale]/contact    → Kontakt mit Karte

/admin                → Admin Dashboard (admin/dashboard     → Übersicht
/admin/posts         → BeLogin)
/iträge verwalten
/admin/pages         → Seiten verwalten
/admin/media         → Medienverwaltung
/admin/bookings      → Buchungsverwaltung
/admin/settings      → Systemeinstellungen
```

## 5. Funktionale Anforderungen

### 5.1 Mehrsprachigkeit
- URL-basiertes Routing: `/de/...`, `/en/...`
- Sprachumschalter in Navigation
- Übersetzungen in JSON-Dateien
- Default: Deutsch

### 5.2 Buchungskalender
- 3-Monats-Ansicht (rollierend)
- Navigationspfeile für Monatswechsel
- Tagesanzeige: Datum, Preis, Verfügbarkeit
- Buchungsformular mit:
  - Personendaten (Vorname, Nachname, Adresse, Telefon, E-Mail)
  - Anzahl Personen (Erwachsene, Kinder)
  - Stromoption
  - AGB-Accept-Checkbox
- Dynamische Preisberechnung

### 5.3 Admin-Backend
- Session-basierte Authentifizierung
- CRUD für Beiträge und Seiten
- Bild-Upload mit Vorschau
- Buchungsverwaltung (Bestätigen/Ablehnen/Löschen)
- E-Mail-Vorlagen-Verwaltung
- Preise und Platzanzahl konfigurierbar
- CSV-Export

### 5.4 OpenStreetMap
- Leaflet-Karte auf Kontaktseite
- Marker für Campingplatz-Standort
- Konfigurierbare Koordinaten

### 5.5 E-Mail
- Nodemailer mit SMTP
- Konfigurierbare Vorlagen
- Automatische Bestätigungs-E-Mails

## 6. Technische Details

### Dependencies
- next: ^14.0.0
- react: ^18.0.0
- @prisma/client: ^5.0.0
- prisma: ^5.0.0
- next-intl: ^3.0.0
- tailwindcss: ^3.4.0
- react-leaflet: ^4.0.0
- leaflet: ^1.9.0
- nodemailer: ^6.9.0
- bcryptjs: ^2.4.0
- zod: ^3.0.0
- jose: ^5.0.0

### Netcup Deployment
- Node.js Startdatei: server.js
- SQLite-Datenbank: prisma/dev.db
- Statische Uploads: /public/uploads/
