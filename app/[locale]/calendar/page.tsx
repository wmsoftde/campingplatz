'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Check, X, Info } from 'lucide-react';
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
  const [pitchCount, setPitchCount] = useState(1);
  const [smallTent, setSmallTent] = useState(false);
  const [prepayment, setPrepayment] = useState(false);
  const [electricity, setElectricity] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingNumber, setBookingNumber] = useState<string | null>(null);
  
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

  // Comprehensive Price Calculation
  useEffect(() => {
    if (!checkIn || !checkOut || !settings) return;

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) return;

    let currentPitchPrice = settings.pricePlace;

    // 1. Small Tent Discount (-40%)
    if (smallTent) {
      currentPitchPrice *= 0.6;
    }

    // 2. Prepayment Discount (-15%)
    if (prepayment) {
      currentPitchPrice *= 0.85;
    }

    // 3. Duration Discounts
    if (days > 30) {
      currentPitchPrice *= 0.8; // -20% for > 1 month
    } else if (days > 7) {
      currentPitchPrice *= 0.9; // -10% for > 1 week
    }

    const pricePerDay = (currentPitchPrice * pitchCount) + 
      (adults * settings.priceAdult) + 
      (children * settings.priceChild) +
      (electricity ? settings.priceElectricity : 0);
    
    setTotalPrice(pricePerDay * days);
  }, [checkIn, checkOut, adults, children, pitchCount, smallTent, prepayment, electricity, settings]);

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

  const formatDisplayDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}.${m}.${y}`;
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
          pitchCount,
          smallTent,
          prepayment,
          electricity,
          totalPrice,
          locale
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookingNumber(data.bookingNumber);
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
                <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 mb-8">
                  <p className="text-gray-600 mb-4">
                    {t('successDesc')}
                  </p>
                  {bookingNumber && (
                    <div className="text-lg font-bold text-primary">
                      {locale === 'de' ? 'Ihre Buchungsnummer:' : 'Your Booking Number:'} {bookingNumber}
                    </div>
                  )}
                </div>
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
              <h2 className="font-heading text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                <Info className="w-6 h-6" />
                {locale === 'de' ? 'Informationen für Kurzzeitmieter' : 'Information for Short-term Renters'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700 leading-relaxed">
                <div className="space-y-4 text-sm">
                  <p className="font-semibold text-base">
                    {locale === 'de' 
                      ? 'Hier können Sie Ihren Campingstellplatz direkt online anfragen.'
                      : 'Here you can request your camping pitch directly online.'
                    }
                  </p>
                  <p>
                    {locale === 'de' 
                      ? 'Im Kalender werden die noch zur Verfügung stehenden Stellplätze für Caravan/Wohnwagen/Zelt inklusive der aktuellen Tagespreise angezeigt. Wählen Sie den gewünschten Zeitraum durch Markieren im Kalender oder über die Datumsfelder.'
                      : 'The calendar shows available pitches for caravan/trailer/tent including current daily prices. Select your desired period by marking the calendar or using the date fields.'
                    }
                  </p>
                  <p>
                    {locale === 'de' 
                      ? 'Geben Sie die Anzahl der Personen an. Falls Sie mit mehreren Einheiten (z.B. 2 Wohnwagen) anreisen, erhöhen Sie bitte die Anzahl der Stellplätze. Für kleine Zelte (1-4 Personen) wählen Sie bitte die entsprechende Option für einen Preisnachlass.'
                      : 'Enter the number of people. If you are arriving with multiple units (e.g., 2 caravans), please increase the number of pitches. For small tents (1-4 people), please select the corresponding option for a discount.'
                    }
                  </p>
                  <p>
                    {locale === 'de' 
                      ? 'Wir bieten ein pauschales Strompaket an (keine Wartezeit bei Abreise). Alternativ ist die Abrechnung nach Zähler möglich.'
                      : 'We offer a flat-rate electricity package (no waiting time on departure). Alternatively, billing by meter is possible.'
                    }
                  </p>
                </div>
                <div className="space-y-4 text-sm">
                  <p>
                    {locale === 'de' 
                      ? 'Bei Vorauszahlung (Vorkasse) des gesamten Betrags gewähren wir 15% Nachlass auf den Stellplatzpreis. Längere Aufenthalte (> 1 Woche: 10%, > 1 Monat: 20%) werden automatisch rabattiert.'
                      : 'For prepayment of the total amount, we grant a 15% discount on the pitch price. Longer stays (> 1 week: 10%, > 1 month: 20%) are automatically discounted.'
                    }
                  </p>
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                    <p className="font-semibold mb-2">
                      {locale === 'de' ? 'Zahlungsinformationen:' : 'Payment Information:'}
                    </p>
                    <p className="font-mono text-xs">
                      Wolfgang Mueckl<br />
                      IBAN: DE60 5001 0517 6000 3238 61<br />
                      BIC: INGDDEFFXXX<br />
                      Bank: ING Bank
                    </p>
                  </div>
                  <p className="text-red-600 font-medium italic">
                    {locale === 'de' 
                      ? 'Die (An-)Zahlung muss innerhalb von 3 Tagen eingegangen sein, sonst wird die Anfrage automatisch gelöscht. Geben Sie bitte immer Ihre Buchungsnummer als Verwendungszweck an.'
                      : 'The (down) payment must be received within 3 days, otherwise the request will be automatically deleted. Please always state your booking number as the payment reference.'
                    }
                  </p>
                  <p className="text-xs text-gray-500">
                    {locale === 'de' 
                      ? 'Eine verbindliche Buchung kommt erst durch min. 30% Anzahlung und unsere Bestätigung zustande. Restzahlung vor Ort nur in Bar möglich.'
                      : 'A binding booking is only concluded with a minimum 30% deposit and our confirmation. Remaining payment on site only possible in cash.'
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {months.map((monthData, monthIdx) => (
                    <div key={monthIdx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="font-heading text-sm font-semibold text-primary mb-4 text-center border-b pb-2">
                        {getMonthName(new Date(currentDate.getFullYear(), currentDate.getMonth() + monthIdx, 1).getMonth())}
                      </h3>
                      <div className="grid grid-cols-7 gap-1 text-[10px]">
                        {weekDays.map((day, idx) => (
                          <div key={idx} className="text-center py-1 text-gray-400 font-bold uppercase">
                            {day.substring(0, 2)}
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
                              type="button"
                              onClick={() => handleDayClick(dateStr, day.booked, day.total)}
                              disabled={isBooked}
                              className={clsx(
                                'relative p-1 rounded flex flex-col items-center justify-center transition-all min-h-[40px]',
                                isBooked && 'bg-gray-100 text-gray-300 cursor-not-allowed',
                                !isBooked && isSelected && 'bg-primary text-white z-10 scale-110 shadow-md',
                                !isBooked && isInRange && 'bg-primary/20 text-primary-dark',
                                !isBooked && !isSelected && !isInRange && 'hover:bg-primary/10',
                                isToday && !isSelected && 'ring-1 ring-accent ring-inset'
                              )}
                            >
                              <span className="font-bold text-xs">{dayIdx + 1}</span>
                              {!isBooked && (
                                <span className={clsx(
                                  'text-[7px] mt-0.5',
                                  isSelected || isInRange ? 'text-white/80' : 'text-gray-400'
                                )}>
                                  {day.total - day.booked} {locale === 'de' ? 'frei' : 'free'}
                                </span>
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
                <form onSubmit={handleSubmit} className="card p-6 space-y-4 sticky top-20">
                  <h3 className="font-heading text-lg font-bold text-primary mb-4 border-b pb-2">
                    {t('selectDates')}
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        {t('checkIn')}
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={checkIn || ''}
                          onChange={(e) => setCheckIn(e.target.value)}
                          min={getLocalDateString(new Date())}
                          className="input-field appearance-none"
                          style={{ color: 'transparent' }}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 text-sm pointer-events-none">
                          {checkIn ? formatDisplayDate(checkIn) : 'TT.MM.JJJJ'}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        {t('checkOut')}
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={checkOut || ''}
                          onChange={(e) => setCheckOut(e.target.value)}
                          min={checkIn || getLocalDateString(new Date())}
                          className="input-field appearance-none"
                          style={{ color: 'transparent' }}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 text-sm pointer-events-none">
                          {checkOut ? formatDisplayDate(checkOut) : 'TT.MM.JJJJ'}
                        </div>
                      </div>
                    </div>
                  </div>
                  {errors.dates && <p className="text-red-500 text-xs font-medium">{errors.dates}</p>}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        {locale === 'de' ? 'Stellplätze' : 'Pitches'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={pitchCount}
                        onChange={(e) => setPitchCount(parseInt(e.target.value) || 1)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
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
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      {t('children')} ({locale === 'de' ? 'unter 16' : 'under 16'})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={children}
                      onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={smallTent}
                          onChange={(e) => setSmallTent(e.target.checked)}
                          className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">
                        {locale === 'de' ? 'Kleines Zelt (< 4 Pers.) -40%' : 'Small tent (< 4 pers.) -40%'}
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={prepayment}
                          onChange={(e) => setPrepayment(e.target.checked)}
                          className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">
                        {locale === 'de' ? 'Vorkasse (Rabatt 15%)' : 'Prepayment (15% discount)'}
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={electricity}
                          onChange={(e) => setElectricity(e.target.checked)}
                          className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">{t('electricity')}</span>
                    </label>
                  </div>

                  <hr className="my-4" />

                  <h4 className="font-heading font-semibold text-primary text-sm uppercase tracking-wider">
                    {locale === 'de' ? 'Persönliche Daten' : 'Personal details'}
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder={tForm('firstName')}
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="input-field text-sm"
                      />
                      {errors.firstName && <p className="text-red-500 text-[10px]">{errors.firstName}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder={tForm('lastName')}
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="input-field text-sm"
                      />
                      {errors.lastName && <p className="text-red-500 text-[10px]">{errors.lastName}</p>}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder={tForm('street')}
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="input-field text-sm"
                  />
                  {errors.street && <p className="text-red-500 text-[10px]">{errors.street}</p>}

                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder={tForm('postalCode')}
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="input-field text-sm"
                    />
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder={tForm('city')}
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="input-field text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="tel"
                      placeholder={tForm('phone')}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field text-sm"
                    />
                    {errors.phone && <p className="text-red-500 text-[10px]">{errors.phone}</p>}
                    
                    <input
                      type="email"
                      placeholder={tForm('email')}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field text-sm"
                    />
                    {errors.email && <p className="text-red-500 text-[10px]">{errors.email}</p>}
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agb}
                        onChange={(e) => setFormData({ ...formData, agb: e.target.checked })}
                        className="w-4 h-4 mt-0.5 text-primary"
                      />
                      <span className="text-[11px] text-gray-500 leading-tight">
                        Ich akzeptiere die <Link href={locale === 'de' ? '/de/agb' : '/en/agb'} target="_blank" className="text-primary hover:underline">AGB</Link> und den <Link href={locale === 'de' ? '/de/datenschutz' : '/en/privacy'} target="_blank" className="text-primary hover:underline">{locale === 'de' ? 'Datenschutz' : 'Privacy'}</Link>
                      </span>
                    </label>
                    {errors.agb && <p className="text-red-500 text-[10px] mt-1">{errors.agb}</p>}
                  </div>

                  {checkIn && checkOut && (
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-600 uppercase">{t('price')}:</span>
                        <span className="text-2xl font-black text-primary">
                          €{totalPrice.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 text-center italic">
                        {locale === 'de' ? 'Inkl. aller gewählten Nachlässe' : 'Incl. all selected discounts'}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 text-lg shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
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
      
      <style jsx global>{`
        /* Hide default date text and placeholder */
        input[type="date"]::-webkit-datetime-edit,
        input[type="date"]::-webkit-inner-spin-button,
        input[type="date"]::-webkit-clear-button {
          display: none;
          -webkit-appearance: none;
        }
        
        /* Hide default date icon but keep input functional and covering the whole area */
        input[type="date"]::-webkit-calendar-picker-indicator {
          background: transparent;
          bottom: 0;
          color: transparent;
          cursor: pointer;
          height: auto;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: auto;
          z-index: 2;
        }

        /* Ensure input text is always transparent */
        input[type="date"] {
          color: transparent !important;
        }
      `}</style>
    </>
  );
}
