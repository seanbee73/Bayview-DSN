import React, { useState } from 'react';
import { X, Calendar, Clock, Check, Phone, User, Scissors } from 'lucide-react';
import { SERVICES_DATA, CRAFTSMEN_DATA, BRAND_DATA } from '../data/salonData';
import { SignatureService, AdditionalService, Stylist, BookingReservation } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: SignatureService | AdditionalService | null;
  initialStylistId?: string;
  onBookingSubmit?: (booking: BookingReservation) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialService,
  initialStylistId,
  onBookingSubmit,
}) => {
  const allServices = [
    ...SERVICES_DATA.signatureServices.map(s => ({ id: s.id, title: s.title, price: s.price, category: 'Signature' })),
    ...SERVICES_DATA.additionalServices.map(a => ({ id: a.id, title: a.name, price: a.price, category: 'Grooming/Add-on' })),
  ];

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialService?.id || allServices[0].id
  );
  const [selectedStylistId, setSelectedStylistId] = useState<string>(
    initialStylistId || CRAFTSMEN_DATA.craftsmen[0].id
  );
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  if (!isOpen) return null;

  const currentService = allServices.find((s) => s.id === selectedServiceId) || allServices[0];
  const currentStylist = CRAFTSMEN_DATA.craftsmen.find((s) => s.id === selectedStylistId) || CRAFTSMEN_DATA.craftsmen[0];

  const handleBookingSubmit = (e: React.FormEvent) => {
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

    setIsBooked(true);
  };

  const handleClose = () => {
    setIsBooked(false);
    onClose();
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#0D0D0D] text-white border border-white/15 w-full max-w-2xl max-h-[90vh] overflow-y-auto hide-scrollbar relative rounded-none shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
          aria-label="Close booking modal"
        >
          <X size={20} />
        </button>

        {isBooked ? (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 border border-[#9A8C73] flex items-center justify-center mx-auto text-[#9A8C73]">
              <Check size={32} />
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl font-normal">Appointment Requested</h3>
            <div className="bg-white/5 border border-white/10 p-6 text-left max-w-md mx-auto space-y-3 font-normal text-sm">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/50 text-xs uppercase tracking-[0.2em]">Service</span>
                <span className="font-medium text-white">{currentService.title} ({currentService.price})</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/50 text-xs uppercase tracking-[0.2em]">Craftsman</span>
                <span className="text-white">{currentStylist.name}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/50 text-xs uppercase tracking-[0.2em]">Date & Time</span>
                <span className="text-white">{selectedDate} at {selectedTime}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/50 text-xs uppercase tracking-[0.2em]">Client</span>
                <span className="text-white">{clientName} ({clientPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50 text-xs uppercase tracking-[0.2em]">Location</span>
                <span className="text-white text-xs">Floor 1, Bayview-Cummer Mall</span>
              </div>
            </div>
            <p className="text-white/70 text-xs max-w-md mx-auto font-normal">
              We look forward to seeing you. If you need to make changes, please call the shop at <a href={BRAND_DATA.phoneTel} className="text-white font-mono underline">{BRAND_DATA.phone}</a>.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleClose}
                className="bg-[#9A8C73] text-white px-8 py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#FAF9F6] hover:text-[#1D1D1D] transition-colors rounded-none cursor-pointer"
              >
                Done
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

            <form onSubmit={handleBookingSubmit} className="space-y-5">
              {/* Service Selection */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold block mb-2">
                  1. Select Service
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1 border border-white/10 bg-white/5">
                  {allServices.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedServiceId(s.id)}
                      className={`p-2.5 border text-left transition-all rounded-none ${
                        selectedServiceId === s.id
                          ? 'border-[#9A8C73] bg-[#9A8C73]/25 text-white'
                          : 'border-white/10 bg-transparent text-white/70 hover:border-white/30'
                      }`}
                    >
                      <div className="font-serif text-sm leading-snug">{s.title}</div>
                      <div className="text-[11px] text-[#9A8C73] mt-1 font-mono">{s.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stylist Selection */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold block mb-2">
                  2. Select Craftsman
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CRAFTSMEN_DATA.craftsmen.map((stylist) => (
                    <button
                      key={stylist.id}
                      type="button"
                      onClick={() => setSelectedStylistId(stylist.id)}
                      className={`p-3 border text-left transition-all rounded-none flex items-center gap-3 ${
                        selectedStylistId === stylist.id
                          ? 'border-[#9A8C73] bg-[#9A8C73]/25 text-white'
                          : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30'
                      }`}
                    >
                      <img
                        src={stylist.image}
                        alt={stylist.name}
                        className="w-12 h-12 object-cover grayscale flex-shrink-0"
                      />
                      <div>
                        <div className="font-serif text-base text-white">{stylist.name}</div>
                        <div className="text-[10px] text-[#9A8C73] uppercase tracking-wider font-semibold">
                          {stylist.role}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold block mb-1.5">
                    3. Preferred Date (Tue–Sat)
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 text-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#9A8C73] rounded-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold block mb-1.5">
                    Preferred Time Slot
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-[#121212] border border-white/15 text-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#9A8C73] rounded-none"
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Client Info */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Smith"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 text-white px-3.5 py-2 text-sm focus:outline-none focus:border-[#9A8C73] rounded-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(416) 555-0199"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 text-white px-3.5 py-2 text-sm focus:outline-none focus:border-[#9A8C73] rounded-none font-mono"
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
                    className="w-full bg-white/5 border border-white/15 text-white px-3.5 py-2 text-sm focus:outline-none focus:border-[#9A8C73] rounded-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold block mb-1">
                    Special Requests / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Scissor trim only, beard lineup, first visit"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 text-white px-3.5 py-2 text-sm focus:outline-none focus:border-[#9A8C73] rounded-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="submit"
                  className="w-full sm:w-auto flex-1 bg-[#FAF9F6] text-[#1D1D1D] font-bold text-xs uppercase tracking-[0.2em] py-3.5 hover:bg-[#9A8C73] hover:text-white transition-all rounded-none cursor-pointer"
                >
                  Confirm Appointment Request
                </button>
                <a
                  href={BRAND_DATA.phoneTel}
                  className="text-white/60 hover:text-white text-[11px] uppercase tracking-[0.15em] transition-colors flex items-center gap-1.5"
                >
                  <Phone size={12} /> Call {BRAND_DATA.phone}
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
