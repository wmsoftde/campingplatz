'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

interface MapProps {
  latitude: number;
  longitude: number;
  zoom: number;
}

function LeafletMap({ latitude, longitude, zoom }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
      if (leaflet.default.Icon) {
        leaflet.default.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
      }
    });
  }, []);

  if (!isMounted) {
    return <div className="h-96 bg-gray-200 rounded-xl flex items-center justify-center">Loading...</div>;
  }

  const position: [number, number] = [latitude, longitude];

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} />
    </MapContainer>
  );
}

export default function ContactPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('contact');
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/settings?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);
  }, []);

  const lat = settings?.latitude ?? 51.5;
  const lng = settings?.longitude ?? 10.0;
  const zoom = settings?.mapZoom ?? 13;

  return (
    <>
      <Navigation locale={locale} />
      
      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary to-primary-light py-20">
          <div className="container-custom">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">
              {t('title')}
            </h1>
            <p className="text-white/80 text-xl mt-4">
              {t('subtitle')}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="font-heading text-2xl font-bold text-primary mb-6">
                  {locale === 'de' ? 'So erreichen Sie uns' : 'How to reach us'}
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <span className="text-2xl">📍</span>
                    <div>
                      <h4 className="font-bold text-gray-800">{t('address')}</h4>
                      <p className="text-gray-600">
                        {settings?.address || (locale === 'de' ? 'Helmgesmühle, 53797 Lohmar' : 'Helgesmuehle, 53797 Lohmar')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <span className="text-2xl">📞</span>
                    <div>
                      <h4 className="font-bold text-gray-800">{t('phone')}</h4>
                      <p className="text-gray-600">
                        {settings?.phone || (locale === 'de' ? '+49 2291 9090546' : '+49 2291 9090546')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <span className="text-2xl">✉️</span>
                    <div>
                      <h4 className="font-bold text-gray-800">{t('email')}</h4>
                      <p className="text-gray-600">
                        {settings?.email || 'info@camping-lohmar.de'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-heading text-xl font-bold text-primary mb-4">
                    {locale === 'de' ? 'Öffnungszeiten' : 'Opening hours'}
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>{locale === 'de' ? 'Montag - Freitag: 8:00 - 18:00' : 'Monday - Friday: 8:00 AM - 6:00 PM'}</li>
                    <li>{locale === 'de' ? 'Samstag: 9:00 - 17:00' : 'Saturday: 9:00 AM - 5:00 PM'}</li>
                    <li>{locale === 'de' ? 'Sonntag: 10:00 - 14:00' : 'Sunday: 10:00 AM - 2:00 PM'}</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-primary mb-6">
                  {locale === 'de' ? 'Hier finden Sie uns' : 'Find us here'}
                </h2>
                <div className="h-96 rounded-xl overflow-hidden shadow-lg">
                  <LeafletMap latitude={lat} longitude={lng} zoom={zoom} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
