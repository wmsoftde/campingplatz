'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import clsx from 'clsx';

interface DayData {
  date: string;
  price: number;
  booked: number;
  total: number;
}

interface Settings {
  pricePlace: number;
  priceAdult: number;
  priceChild: number;
  priceElectricity: number;
  totalPlaces: number;
  agbUrlDe: string;
  agbUrlEn: string;
  privacyUrlDe: string;
  privacyUrlEn: string;
}

export default function BookingPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('calendar');
  const tForm = useTranslations('calendar.form');
  
  const [settings, setSettings] = useState<Settings | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [months, setMonths] = useState<DayData[][]>([]);
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [electricity, setElectricity] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    postalCode: '',
    city: '',
    country: 'Deutschland',
    phone: '',
    email: '',
    agb: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);
  }, []);

  const fetchMonthData = useCallback(async (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const response = await fetch(`/api/bookings/availability?year=${year}&month=${month + 1}`);
    const data = await response.json();
    return data;
  }, []);

  useEffect(() => {
    const fetchThreeMonths = async () => {
      const m1 = await fetchMonthData(currentDate);
      const m2 = await fetchMonthData(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
      const m3 = await fetchMonthData(new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 1));
      setMonths([m1, m2, m3]);
    };
    fetchThreeMonths();
  }, [currentDate, fetchMonthData]);

  useEffect(() => {
    if (!checkIn || !checkOut || !settings) return;

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    const pricePerDay = settings.pricePlace + 
      (adults * settings.priceAdult) + 
      (children * settings.priceChild);
    
    const electricityCost = electricity ? settings.priceElectricity : 0;
    const total = (pricePerDay + electricityCost) * days;
    
    setTotalPrice(total);
  }, [checkIn, checkOut, adults, children, electricity, settings]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getLocalDateString = (date: Date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDayClick = (dateStr: string, booked: number, total: number) => {
    if (booked >= total) return;
    
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr);
      setCheckOut(null);
    } else {
      const d1 = new Date(checkIn);
      const d2 = new Date(dateStr);
      if (d2 > d1) {
        setCheckOut(dateStr);
      } else {
        setCheckIn(dateStr);
        setCheckOut(null);
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = tForm('required');
    if (!formData.lastName.trim()) newErrors.lastName = tForm('required');
    if (!formData.street.trim()) newErrors.street = tForm('required');
    if (!formData.postalCode.trim()) newErrors.postalCode = tForm('required');
    if (!formData.city.trim()) newErrors.city = tForm('required');
    if (!formData.phone.trim()) newErrors.phone = tForm('required');
    if (!formData.email.trim()) newErrors.email = tForm('required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    if (!formData.agb) newErrors.agb = tForm('required');
    if (!checkIn || !checkOut) newErrors.dates = tForm('required');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !settings) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          checkIn,
          checkOut,
          adults,
          children,
          electricity,
          totalPrice,
          locale
        })
      });
      
      if (response.ok) {
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Navigation locale={locale} />
        <main className="flex-1">
          <section className="py-20 bg-background">
            <div className="container-custom">
              <div className="max-w-lg mx-auto text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="font-heading text-3xl font-bold text-primary mb-4">
                  {t('success')}
                </h1>
                <p className="text-gray-600 mb-8">
                  {t('successDesc')}
                </p>
                <Link href={`/${locale}`} className="btn-primary">
                  {locale === 'de' ? 'Zurück zur Startseite' : 'Back to home'}
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer locale={locale} />
      </>
    );
  }

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];
  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getMonthName = (month: number) => {
    return locale === 'de' ? monthNames[month] : monthNamesEn[month];
  };

  const weekDays = locale === 'de' 
    ? ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

        <section className="py-12">
          <div className="container-custom">
            {/* Info Box for Short-term Renters */}
            <div className="bg-white border-l-4 border-primary rounded-xl p-8 shadow-sm mb-12">
              <h2 className="font-heading text-2xl font-bold text-primary mb-4">
                {locale === 'de' ? 'Kurzzeitmieter' : 'Short-term Renters'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700 leading-relaxed">
                <div className="space-y-4 text-sm">
                  <p className="font-semibold text-base">
                    {locale === 'de' 
                      ? 'Buchung von Stellplätzen für Kurzzeitmieter, hier können Sie ihren Campingstellplatz buchen.'
                      : 'Booking of pitches for short-term renters, here you can book your camping pitch.'
                    }
                  </p>
                  <p>
                    {locale === 'de' 
                      ? 'Im Kalender werden die noch zur Verfügung stehenden Stellplätze für Caravan/Wohnwagen/Zelt inklusive der aktuellen Tagespreise angezeigt. Wählen sie erst im Feld Anreise und Abreise den gewünschten Zeitraum und geben sie danach die gewünschten Optionen an. Alternativ kann die Eingabe durch Markieren auf dem Kalender erfolgen.'
                      : 'The calendar shows the available pitches for caravan/trailer/tent including current daily prices. First select the desired period in the check-in and check-out fields and then specify the desired options. Alternatively, you can enter dates by marking them on the calendar.'
                    }
                  </p>
                  <p>
                    {locale === 'de' 
                      ? 'Geben Sie die Anzahl der Personen und eventuell Kinder unter 16 Jahren an. Falls Sie mit einem weiteren Caravan/Wohnwagen/Zelt anreisen wollen, können Sie dies unter dem Punkt „No book items“ angeben. Sollten Sie nur mit einem kleinen Zelt unterwegs sein z.B. 1-4 Personen Zelt dann wählen Sie bitte als zusätzliche Option kleines Zelt – dadurch wird ein Nachlass auf den Stellplatzpreis berechnet.'
                      : 'Specify the number of people and any children under 16. If you want to arrive with another caravan/trailer/tent, you can specify this under "No book items". If you are only traveling with a small tent, e.g. 1-4 person tent, please select small tent as an additional option – this will calculate a discount on the pitch price.'
                    }
                  </p>
                  <p>
                    {locale === 'de' 
                      ? 'Des Weiteren bieten wir ein pauschales Strompaket zum Tagespreis an. Vorteil keine lange Wartezeiten bei Abreise. Alternativ ist die Versorgung mit Strom über Zählerabrechnung möglich, zu den in der Preisliste genannten Konditionen.'
                      : 'Furthermore, we offer a flat-rate electricity package at a daily price. Advantage: no long waiting times on departure. Alternatively, electricity supply via meter billing is possible, at the conditions mentioned in the price list.'
                    }
                  </p>
                </div>
                <div className="space-y-4 text-sm">
                  <p>
                    {locale === 'de' 
                      ? 'Bei Vorauszahlung des gesamten Mietpreises gewähren wir einen Nachlass in Höhe von 15% auf den Grundpreis. Dies müssten Sie unter „Vorkasse“ anklicken. Für längere Mietdauer größer eine Woche oder Monat sind entsprechende Nachlässe im Buchungssystem enthalten.'
                      : 'If the total rent is paid in advance, we grant a discount of 15% on the basic price. You would have to click on "Prepayment" for this. For longer rental periods of more than a week or month, corresponding discounts are included in the booking system.'
                    }
                  </p>
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                    <p className="font-semibold mb-2">
                      {locale === 'de' ? 'Zahlungsinformationen:' : 'Payment Information:'}
                    </p>
                    <p className="font-mono text-xs">
                      Wolfgang Mueckl<br />
                      IBAN: DE60 5001 0517 6000 3238 61<br />
                      BIC: INGDDEFFXXX
                    </p>
                  </div>
                  <p className="text-red-600 font-medium italic">
                    {locale === 'de' 
                      ? 'Bitte beachten Sie, dass die Zahlung / Anzahlung innerhalb von 3 Tagen nach Ihrer Buchungsanfrage auf unserem Konto eingegangen sein muss, sonst wird Ihre Anfrage vom System automatisch zurückgewiesen bzw. gelöscht.'
                      : 'Please note that the payment / deposit must be received in our account within 3 days after your booking request, otherwise your request will be automatically rejected or deleted by the system.'
                    }
                  </p>
                  <p className="text-xs text-gray-500">
                    {locale === 'de' 
                      ? 'Bitte beachten Sie unsere AGB. Eine verbindliche Buchung kommt erst durch eine min. 30% Anzahlung und unsere Bestätigung zustande. Eine eventuell erforderliche Restzahlung erfolgt bei Anreise vor Ort beim Platzwart in bar. Andere Zahlweisen sind nicht verfügbar.'
                      : 'Please note our GTC. A binding booking is only concluded with a minimum 30% deposit and our confirmation. Any remaining payment required will be made in cash on site to the site manager upon arrival. Other payment methods are not available.'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <button 
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="font-heading text-xl font-bold">
                    {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
                  </h2>
                  <button 
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {months.map((monthData, monthIdx) => (
                    <div key={monthIdx}>
                      <h3 className="font-heading text-sm font-semibold text-gray-600 mb-2 text-center">
                        {getMonthName(new Date(currentDate.getFullYear(), currentDate.getMonth() + monthIdx, 1).getMonth())}
                      </h3>
                      <div className="grid grid-cols-7 gap-1 text-xs">
                        {weekDays.map((day, idx) => (
                          <div key={idx} className="text-center py-1 text-gray-400 font-medium">
                            {day}
                          </div>
                        ))}
                        {Array.from({ length: 7 }).map((_, idx) => {
                          const firstDayDate = new Date(Date.UTC(
                            currentDate.getFullYear(),
                            currentDate.getMonth() + monthIdx,
                            1
                          ));
                          const firstDay = firstDayDate.getUTCDay();
                          const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
                          return idx < adjustedFirstDay ? (
                            <div key={`empty-${idx}`} />
                          ) : null;
                        })}
                        {monthData.map((day, dayIdx) => {
                          const date = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth() + monthIdx, dayIdx + 1));
                          const dateStr = getLocalDateString(date);
                          const isBooked = day.booked >= day.total;
                          const isSelected = checkIn === dateStr || checkOut === dateStr;
                          const isInRange = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut;
                          const today = new Date();
                          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                          const isToday = todayStr === dateStr;

                          return (
                            <button
                              key={dayIdx}
                              onClick={() => handleDayClick(dateStr, day.booked, day.total)}
                              disabled={isBooked}
                              className={clsx(
                                'p-1 rounded text-center transition-all',
                                isBooked && 'bg-gray-100 text-gray-400 cursor-not-allowed',
                                !isBooked && isSelected && 'bg-primary text-white',
                                !isBooked && isInRange && 'bg-primary/20',
                                !isBooked && !isSelected && !isInRange && 'hover:bg-primary/10'
                              )}
                            >
                              <div className="font-medium">{dayIdx + 1}</div>
                              {!isBooked && (
                                <div className={clsx(
                                  'text-[8px]',
                                  isSelected || isInRange ? 'text-white/80' : 'text-gray-500'
                                )}>
                                  {day.total - day.booked}/{day.total}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                  <h3 className="font-heading text-lg font-bold text-primary mb-4">
                    {t('selectDates')}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('checkIn')}
                      </label>
                      <input
                        type="date"
                        value={checkIn || ''}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={getLocalDateString(new Date())}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('checkOut')}
                      </label>
                      <input
                        type="date"
                        value={checkOut || ''}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || getLocalDateString(new Date())}
                        className="input-field"
                      />
                    </div>
                  </div>
                  {errors.dates && <p className="text-red-500 text-sm">{errors.dates}</p>}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('adults')}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={adults}
                      onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('children')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={children}
                      onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={electricity}
                        onChange={(e) => setElectricity(e.target.checked)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm text-gray-700">{t('electricity')}</span>
                    </label>
                  </div>

                  <hr className="my-4" />

                  <h4 className="font-heading font-semibold text-primary">
                    {locale === 'de' ? 'Persönliche Daten' : 'Personal details'}
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {tForm('firstName')} *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="input-field"
                      />
                      {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {tForm('lastName')} *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="input-field"
                      />
                      {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {tForm('street')} *
                    </label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="input-field"
                    />
                    {errors.street && <p className="text-red-500 text-xs">{errors.street}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {tForm('postalCode')} *
                      </label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="input-field"
                      />
                      {errors.postalCode && <p className="text-red-500 text-xs">{errors.postalCode}</p>}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {tForm('city')} *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="input-field"
                      />
                      {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {tForm('country')}
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {tForm('phone')} *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field"
                    />
                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {tForm('email')} *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agb}
                        onChange={(e) => setFormData({ ...formData, agb: e.target.checked })}
                        className="w-4 h-4 mt-1 text-primary"
                      />
                      <span className="text-sm text-gray-600">
                        Ich akzeptiere die <Link href={locale === 'de' ? '/de/agb' : '/en/agb'} className="text-primary hover:underline">AGB</Link> und den <Link href={locale === 'de' ? '/de/datenschutz' : '/en/privacy'} className="text-primary hover:underline">{locale === 'de' ? 'Datenschutz' : 'Privacy Policy'}</Link>
                      </span>
                    </label>
                    {errors.agb && <p className="text-red-500 text-xs">{errors.agb}</p>}
                  </div>

                  {checkIn && checkOut && (
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{t('price')}:</span>
                        <span className="text-2xl font-bold text-primary">
                          €{totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {loading ? '...' : t('submit')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
