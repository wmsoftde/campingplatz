'use client';

import { useState, useEffect } from 'react';

interface Settings {
  siteNameDe: string;
  siteNameEn: string;
  email: string;
  phone: string;
  address: string;
  totalPlaces: number;
  pricePlace: number;
  priceAdult: number;
  priceChild: number;
  priceElectricity: number;
  latitude: number;
  longitude: number;
  mapZoom: number;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  smtpFrom: string;
  emailConfirmDe: string;
  emailConfirmEn: string;
  emailCancelDe: string;
  emailCancelEn: string;
  emailRejectDe: string;
  emailRejectEn: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestEmail = async () => {
    if (!settings || !settings.email) {
      alert('Bitte geben Sie zuerst eine E-Mail-Adresse unter "Allgemeine Einstellungen" an, an die der Test gesendet werden soll.');
      return;
    }
    
    setTestingEmail(true);
    setTestResult(null);
    
    try {
      const res = await fetch('/api/admin/settings/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: settings.email })
      });
      
      const data = await res.json();
      if (data.success) {
        setTestResult({ success: true, message: 'Test-E-Mail wurde erfolgreich versendet!' });
      } else {
        setTestResult({ success: false, message: 'Fehler: ' + (data.error || 'Unbekannter SMTP-Fehler') });
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Netzwerkfehler beim Senden des Tests.' });
    } finally {
      setTestingEmail(false);
    }
  };

  if (loading) return <div className="text-center py-12">Laden...</div>;
  if (!settings) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl font-bold text-gray-800">
          Einstellungen
        </h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary"
        >
          {saving ? 'Speichern...' : saved ? '✓ Gespeichert!' : 'Speichern'}
        </button>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-primary mb-6">
            Allgemeine Einstellungen
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seitenname (Deutsch)
              </label>
              <input
                type="text"
                value={settings.siteNameDe}
                onChange={(e) => setSettings({ ...settings, siteNameDe: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seitenname (              </label>
Englisch)
              <input
                type="text"
                value={settings.siteNameEn}
                onChange={(e) => setSettings({ ...settings, siteNameEn: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-primary mb-6">
            Preise (pro Nacht)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gesamtplätze
              </label>
              <input
                type="number"
                value={settings.totalPlaces}
                onChange={(e) => setSettings({ ...settings, totalPlaces: parseInt(e.target.value) || 0 })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stellplatz (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.pricePlace}
                onChange={(e) => setSettings({ ...settings, pricePlace: parseFloat(e.target.value) || 0 })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Erwachsener (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.priceAdult}
                onChange={(e) => setSettings({ ...settings, priceAdult: parseFloat(e.target.value) || 0 })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kind (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.priceChild}
                onChange={(e) => setSettings({ ...settings, priceChild: parseFloat(e.target.value) || 0 })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Strom (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.priceElectricity}
                onChange={(e) => setSettings({ ...settings, priceElectricity: parseFloat(e.target.value) || 0 })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-primary mb-6">
            Kartenposition
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Breitengrad
              </label>
              <input
                type="number"
                step="0.0001"
                value={settings.latitude}
                onChange={(e) => setSettings({ ...settings, latitude: parseFloat(e.target.value) || 0 })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Längengrad
              </label>
              <input
                type="number"
                step="0.0001"
                value={settings.longitude}
                onChange={(e) => setSettings({ ...settings, longitude: parseFloat(e.target.value) || 0 })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zoom
              </label>
              <input
                type="number"
                min="1"
                max="18"
                value={settings.mapZoom}
                onChange={(e) => setSettings({ ...settings, mapZoom: parseInt(e.target.value) || 13 })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-heading text-xl font-bold text-primary">
              SMTP-Einstellungen
            </h2>
            <button
              onClick={handleTestEmail}
              disabled={testingEmail || !settings.smtpHost}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {testingEmail ? 'Sende Test...' : 'Test-E-Mail senden'}
            </button>
          </div>
          
          {testResult && (
            <div className={`mb-6 p-4 rounded-lg text-sm ${testResult.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {testResult.message}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP-Host
              </label>
              <input
                type="text"
                value={settings.smtpHost}
                onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                className="input-field"
                placeholder="smtp.example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP-Port
              </label>
              <input
                type="text"
                value={settings.smtpPort}
                onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                className="input-field"
                placeholder="587"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP-Benutzer
              </label>
              <input
                type="text"
                value={settings.smtpUser}
                onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP-Passwort
              </label>
              <input
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Absender-E-Mail
              </label>
              <input
                type="email"
                value={settings.smtpFrom}
                onChange={(e) => setSettings({ ...settings, smtpFrom: e.target.value })}
                className="input-field"
                placeholder="noreply@example.com"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-primary mb-6">
            E-Mail-Vorlagen
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bestätigung (Deutsch)
              </label>
              <textarea
                value={settings.emailConfirmDe}
                onChange={(e) => setSettings({ ...settings, emailConfirmDe: e.target.value })}
                className="input-field h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bestätigung (Englisch)
              </label>
              <textarea
                value={settings.emailConfirmEn}
                onChange={(e) => setSettings({ ...settings, emailConfirmEn: e.target.value })}
                className="input-field h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stornierung (Deutsch)
              </label>
              <textarea
                value={settings.emailCancelDe}
                onChange={(e) => setSettings({ ...settings, emailCancelDe: e.target.value })}
                className="input-field h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stornierung (Englisch)
              </label>
              <textarea
                value={settings.emailCancelEn}
                onChange={(e) => setSettings({ ...settings, emailCancelEn: e.target.value })}
                className="input-field h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ablehnung (Deutsch)
              </label>
              <textarea
                value={settings.emailRejectDe}
                onChange={(e) => setSettings({ ...settings, emailRejectDe: e.target.value })}
                className="input-field h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ablehnung (Englisch)
              </label>
              <textarea
                value={settings.emailRejectEn}
                onChange={(e) => setSettings({ ...settings, emailRejectEn: e.target.value })}
                className="input-field h-24"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
