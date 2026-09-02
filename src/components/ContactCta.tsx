import React, { useState } from 'react';
import { Sparkles, Check, Phone, Scissors, Calendar, Clock, MapPin, User, ArrowRight } from 'lucide-react';
import { BRAND_DATA, SERVICES_DATA, CRAFTSMEN_DATA } from '../data/salonData';
import { BookingReservation } from '../types';

interface ContactCtaProps {
  onOpenBooking: () => void;
  onBookingSubmit?: (booking: BookingReservation) => void;
}

export const ContactCta: React.FC<ContactCtaProps> = ({ onOpenBooking, onBookingSubmit }) => {
  const allServices = [
    ...SERVICES_DATA.signatureServices.map((s) => ({
      id: s.id,
      title: s.title,
      price: s.price,
      category: 'Signature',
    })),
    ...SERVICES_DATA.additionalServices.map((a) => ({
      id: a.id,
      title: a.name || a.title,
      price: a.price,
      category: 'Grooming/Add-on',
    })),
  ];

  const [selectedServiceId, setSelectedServiceId] = useState<string>(allServices[0].id);
  const [selectedStylistId, setSelectedStylistId] = useState<string>(CRAFTSMEN_DATA.craftsmen[0].id);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>('09:30 AM');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentService = allServices.find((s) => s.id === selectedServiceId) || allServices[0];
  const currentStylist =
    CRAFTSMEN_DATA.craftsmen.find((s) => s.id === selectedStylistId) || CRAFTSMEN_DATA.craftsmen[0];

  const timeSlots = [
    '09:30 AM',
    '10:30 AM',
    '11:30 AM',
    '01:00 PM',
    '02:00 PM',
    '03:30 PM',
    '04:30 PM',
    '05:30 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) return;

    const newBooking: BookingReservation = {
      serviceId: currentService.id,
      serviceTitle: currentService.title,
      servicePrice: currentService.price,
      stylistId: currentStylist.id,
      stylistName: currentStylist.name,
      date: selectedDate,
      time: selectedTime,
      name: clientName.trim(),
      phone: clientPhone.trim(),
      email: clientEmail.trim() || '',
      notes: notes.trim() || '',
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    if (onBookingSubmit) {
      onBookingSubmit(newBooking);
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsBooked(true);
    }, 350);
  };

  const handleReset = () => {
    setIsBooked(false);
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setNotes('');
  };

  return (
    <section
      className="dark:bg-[#121212] overflow-hidden fade-in text-[#FAF9F6] bg-[#1D1D1D] py-24 sm:py-28 relative transition-colors duration-300 font-sans"
      id="contact"
    >
      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#9A8C73_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start relative z-10">
        {/* Left Column: Brand Context & Direct Calling */}
        <div className="lg:col-span-4 text-left flex flex-col justify-start pt-2">
          <div className="flex items-center gap-2 text-[#9A8C73] mb-4">
            <Sparkles size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
              Direct Chair Reservation
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl text-[#FAF9F6] leading-[1.02] tracking-tight mb-6 font-normal">
            Reserve Your <br />
            <span className="text-[#C4B7A6] italic font-light">Haircut or Style.</span>
          </h2>

          <p className="text-[#FAF9F6]/75 text-sm sm:text-base font-normal leading-relaxed mb-8">
            Experience traditional scissor precision and unhurried Italian barber craft. Reserve your chair online or call Joe directly at the shop.
          </p>

          {/* Quick Call Box */}
          <div className="bg-white/5 border border-white/15 p-6 mb-8">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#9A8C73] font-bold block mb-2">
              Fastest Response
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <a
                  href={BRAND_DATA.phoneTel}
                  className="font-mono text-2xl font-bold text-white hover:text-[#9A8C73] transition-colors flex items-center gap-2"
                >
                  <Phone size={20} className="text-[#9A8C73]" /> {BRAND_DATA.phone}
                </a>
                <p className="text-xs text-white/50 mt-1">
                  Floor 1 · Bayview-Cummer Shopping Centre
                </p>
              </div>
              <a
                href={BRAND_DATA.phoneTel}
                className="bg-[#9A8C73] text-white px-4 py-2 text-xs uppercase tracking-wider font-bold hover:bg-white hover:text-black transition-colors text-center shrink-0"
              >
                Call Now
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10 text-xs text-white/70">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 block font-bold mb-1">
                Hours
              </span>
              <p>Tue–Fri: 9:00 AM – 6:30 PM</p>
              <p>Sat: 8:30 AM – 5:00 PM</p>
              <p className="text-white/40 mt-1">Sun & Mon: Closed</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 block font-bold mb-1">
                Location
              </span>
              <p>3285 Bayview Ave (at Cummer)</p>
              <p>Floor 1 (Interior Mall Entrance)</p>
              <p className="text-[#9A8C73] mt-1 font-medium">Free Surface & Plaza Parking</p>
            </div>
          </div>
        </div>

        {/* Right Column: Appointment Form matching the popup design */}
        <div className="lg:col-span-8 bg-[#0D0D0D] border border-white/15 p-6 sm:p-9 relative shadow-2xl">
          {/* Decorative corners */}
          <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#9A8C73] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[#9A8C73] pointer-events-none"></div>

          {isBooked ? (
            <div className="py-8 text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 border border-[#9A8C73] flex items-center justify-center mx-auto text-[#9A8C73]">
                <Check size={32} />
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal">
                Appointment Requested
              </h3>

              <div className="bg-white/5 border border-white/10 p-6 text-left max-w-md mx-auto space-y-3 font-normal text-sm">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/50 text-xs uppercase tracking-[0.2em]">Service</span>
                  <span className="font-medium text-white">
                    {currentService.title} ({currentService.price})
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/50 text-xs uppercase tracking-[0.2em]">Craftsman</span>
                  <span className="text-white">{currentStylist.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/50 text-xs uppercase tracking-[0.2em]">Date & Time</span>
                  <span className="text-white">
                    {selectedDate} at {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/50 text-xs uppercase tracking-[0.2em]">Client</span>
                  <span className="text-white">
                    {clientName} ({clientPhone})
                  </span>
                </div>
                {notes && (
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/50 text-xs uppercase tracking-[0.2em]">Note</span>
                    <span className="text-white text-xs italic truncate max-w-[200px]">{notes}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/50 text-xs uppercase tracking-[0.2em]">Location</span>
                  <span className="text-white text-xs">Floor 1, Bayview-Cummer Mall</span>
                </div>
              </div>

              <p className="text-white/70 text-xs max-w-md mx-auto font-normal">
                We look forward to seeing you. If you need to make immediate changes, please call the shop at{' '}
                <a href={BRAND_DATA.phoneTel} className="text-white font-mono underline">
                  {BRAND_DATA.phone}
                </a>.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-[#9A8C73] text-white px-8 py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#FAF9F6] hover:text-[#1D1D1D] transition-colors rounded-none cursor-pointer"
                >
                  Send Another Request
                </button>
                <a
                  href={BRAND_DATA.phoneTel}
                  className="border border-white/20 text-white px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold hover:border-[#9A8C73] hover:text-[#9A8C73] transition-colors flex items-center justify-center gap-2"
                >
                  <Phone size={14} /> Call Shop Directly
                </a>
              </div>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-[#9A8C73] mb-1">
                  <Scissors size={14} />
                  <span className="text-[10px] tracking-[0.25em] uppercase font-semibold">
                    Bayview Mall Creative Hair Dsn
                  </span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
                  Reserve Your Chair
                </h2>
                <p className="text-white/60 text-xs mt-1 font-normal">
                  Floor 1, Bayview-Cummer Shopping Centre · Free Parking
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" id="appointment-booking-form">
                {/* 1. SELECT SERVICE */}
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold block mb-2.5">
                    1. Select Service
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {allServices.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedServiceId(s.id)}
                        className={`p-3.5 border text-left transition-all rounded-none cursor-pointer flex flex-col justify-between min-h-[74px] ${
                          selectedServiceId === s.id
                            ? 'border-[#9A8C73] bg-[#9A8C73]/20 text-white ring-1 ring-[#9A8C73]/50'
                            : 'border-white/10 bg-white/5 text-white/75 hover:border-white/30 hover:bg-white/[0.08]'
                        }`}
                      >
                        <div className="font-serif text-sm leading-snug font-normal">{s.title}</div>
                        <div className="text-[11px] text-[#9A8C73] mt-1.5 font-mono">{s.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. SELECT CRAFTSMAN */}
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold block mb-2.5">
                    2. Select Craftsman
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CRAFTSMEN_DATA.craftsmen.map((stylist) => (
                      <button
                        key={stylist.id}
                        type="button"
                        onClick={() => setSelectedStylistId(stylist.id)}
                        className={`p-3.5 border text-left transition-all rounded-none flex items-center gap-3.5 cursor-pointer ${
                          selectedStylistId === stylist.id
                            ? 'border-[#9A8C73] bg-[#9A8C73]/20 text-white ring-1 ring-[#9A8C73]/50'
                            : 'border-white/10 bg-white/5 text-white/75 hover:border-white/30 hover:bg-white/[0.08]'
                        }`}
                      >
                        <img
                          src={stylist.image}
                          alt={stylist.name}
                          className="w-13 h-13 object-cover grayscale flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-serif text-base text-white font-normal">
                            {stylist.name}
                          </div>
                          <div className="text-[10px] text-[#9A8C73] uppercase tracking-wider font-semibold leading-tight mt-0.5">
                            {stylist.role}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. PREFERRED DATE & TIME */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold block mb-1.5">
                      3. Preferred Date (Tue–Sat)
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 text-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#9A8C73] focus:bg-white/10 transition-all rounded-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold block mb-1.5">
                      Preferred Time Slot
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full bg-[#121212] border border-white/15 text-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#9A8C73] rounded-none cursor-pointer"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* CLIENT INFO */}
                <div className="space-y-3.5 pt-2 border-t border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Jane Blow"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 text-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#9A8C73] focus:bg-white/10 transition-all rounded-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold block mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="416-512-6964"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 text-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#9A8C73] focus:bg-white/10 transition-all rounded-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 text-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#9A8C73] focus:bg-white/10 transition-all rounded-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold block mb-1">
                      Special Requests / Notes (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="first visit, beard trim"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 text-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#9A8C73] focus:bg-white/10 transition-all rounded-none"
                    />
                  </div>
                </div>

                {/* SUBMIT ACTION & DIRECT CALL */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto flex-1 bg-[#FAF9F6] text-[#1D1D1D] font-bold text-xs uppercase tracking-[0.2em] py-3.5 hover:bg-[#9A8C73] hover:text-white transition-all rounded-none cursor-pointer disabled:opacity-60"
                  >
                    {loading ? 'Submitting Request...' : 'Confirm Appointment Request'}
                  </button>
                  <a
                    href={BRAND_DATA.phoneTel}
                    className="text-white/60 hover:text-white text-[11px] uppercase tracking-[0.15em] transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Phone size={12} /> Call {BRAND_DATA.phone}
                  </a>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
