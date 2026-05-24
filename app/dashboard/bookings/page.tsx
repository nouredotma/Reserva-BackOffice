'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Calendar, ClipboardList, Clock, HelpCircle, Mail, Phone, Search, Ticket, Users } from 'lucide-react';
import {
  bookingModeLabels,
  sampleBookings,
  type BookingRecord,
} from '@/lib/mock-data';
import type { BookingMode } from '@/lib/reserva-types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const selectFilterClassName =
  'h-10 w-full md:w-[180px] cursor-pointer rounded-full border border-neutral-200 bg-white px-4 text-xs font-medium';

const modeIcons: Record<BookingMode, typeof Calendar> = {
  appointment: Clock,
  reservation: Calendar,
  ticket: Ticket,
  request: HelpCircle,
};

const statusStyles: Record<string, string> = {
  confirmed: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  cancelled: 'bg-rose-50 text-rose-700',
  completed: 'bg-blue-50 text-blue-700',
  no_show: 'bg-purple-50 text-purple-700',
};

function formatStatus(status: string) {
  return status.replace('_', ' ');
}

function formatBookingDate(booking: BookingRecord) {
  return booking.date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function BookingsPage() {
  const [query, setQuery] = useState('');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const selected = useMemo(
    () => sampleBookings.find((booking) => booking.id === selectedId) ?? null,
    [selectedId],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get('booking');
    const linkedBooking = bookingId
      ? sampleBookings.find((booking) => booking.id === bookingId)
      : null;

    if (linkedBooking) {
      setSelectedId(linkedBooking.id);
      setDetailOpen(true);
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sampleBookings.filter((booking) => {
      if (modeFilter !== 'all' && booking.mode !== modeFilter) return false;
      if (statusFilter !== 'all' && booking.status !== statusFilter) return false;
      if (!q) return true;
      return (
        booking.clientName.toLowerCase().includes(q) ||
        booking.serviceName.toLowerCase().includes(q) ||
        booking.clientEmail.toLowerCase().includes(q) ||
        booking.id.toLowerCase().includes(q)
      );
    });
  }, [query, modeFilter, statusFilter]);

  const openDetail = (booking: BookingRecord) => {
    setSelectedId(booking.id);
    setDetailOpen(true);
    window.history.pushState(null, '', `/dashboard/bookings?booking=${encodeURIComponent(booking.id)}`);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    window.history.pushState(null, '', '/dashboard/bookings');
  };

  if (detailOpen && selected) {
    const ModeIcon = modeIcons[selected.mode];

    return (
      <div className="min-h-screen">
        <div className="mb-5 md:mb-8 pt-32 md:pt-20">
          <button
            type="button"
            onClick={closeDetail}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-neutral-300 hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back to bookings
          </button>
          <div className="flex flex-col items-start gap-3 md:flex-row md:flex-wrap md:items-start md:justify-between md:gap-5">
            <div className="min-w-0">
              <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                <ModeIcon size={14} />
                {bookingModeLabels[selected.mode]}
              </p>
              <h1 className="text-2xl md:text-5xl font-light tracking-tight text-gray-900 break-words">{selected.serviceName}</h1>
              <p className="mt-2 text-sm text-gray-400">{selected.id}</p>
            </div>
            <span
              className={`self-start rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[selected.status] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {formatStatus(selected.status)}
            </span>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="rounded-xl border border-neutral-200 bg-white p-4 md:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                <Calendar size={18} className="text-gray-500" />
              </div>
              <div>
                <h2 className="text-xl font-light text-gray-900">Booking details</h2>
                <p className="text-sm text-gray-400">Schedule, mode, channel, and payment summary.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: 'Date', value: selected.date.toLocaleDateString('en-US') },
                { label: 'Time', value: selected.time },
                { label: 'Duration', value: `${selected.durationMinutes} min` },
                { label: 'Party size', value: `${selected.partySize} people` },
                { label: 'Channel', value: selected.channel === 'online' ? 'Online' : 'Direct' },
                {
                  label: 'Total',
                  value:
                    selected.totalPrice > 0
                      ? `${selected.totalPrice.toLocaleString()} ${selected.currency}`
                      : 'No charge',
                },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>

            {selected.notes && (
              <div className="mt-6 rounded-xl border border-neutral-200 p-4">
                <p className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
                  <ClipboardList size={14} />
                  Notes
                </p>
                <p className="text-sm text-gray-700">{selected.notes}</p>
              </div>
            )}
          </section>

          <aside className="rounded-xl border border-neutral-200 bg-white p-4 md:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="text-sm font-semibold text-primary-foreground">
                  {selected.clientName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-medium text-gray-900">{selected.clientName}</h2>
                <p className="text-sm text-gray-400">Client profile</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <span className="truncate">{selected.clientEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <span>{selected.clientPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-400" />
                <span>{selected.partySize} guests</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mb-5 md:mb-10 pt-32 md:pt-20">
        <h1 className="mb-2 text-2xl md:text-5xl font-light tracking-tight text-gray-900">Bookings</h1>
        <p className="text-xs md:text-sm text-gray-400">
          All client bookings across appointment, reservation, ticket, and request modes.
        </p>
      </div>

      <div className="mb-6 flex flex-col items-start md:flex-row md:flex-wrap md:items-center gap-3">
        <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3">
          <Search size={16} className="shrink-0 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search client, service, email, or ID"
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>
        <Select value={modeFilter} onValueChange={setModeFilter}>
          <SelectTrigger className={selectFilterClassName}>
            <SelectValue placeholder="Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              All modes
            </SelectItem>
            {(Object.keys(bookingModeLabels) as BookingMode[]).map((mode) => (
              <SelectItem key={mode} value={mode} className="cursor-pointer">
                {bookingModeLabels[mode]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className={`${selectFilterClassName} md:w-[160px]`}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              All statuses
            </SelectItem>
            <SelectItem value="pending" className="cursor-pointer">
              Pending
            </SelectItem>
            <SelectItem value="confirmed" className="cursor-pointer">
              Confirmed
            </SelectItem>
            <SelectItem value="completed" className="cursor-pointer">
              Completed
            </SelectItem>
            <SelectItem value="cancelled" className="cursor-pointer">
              Cancelled
            </SelectItem>
            <SelectItem value="no_show" className="cursor-pointer">
              No show
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="scroll-hint overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Booking</th>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Client</th>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Mode</th>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Date</th>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Guests</th>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.map((booking) => {
                const ModeIcon = modeIcons[booking.mode];

                return (
                  <tr
                    key={booking.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openDetail(booking)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openDetail(booking);
                      }
                    }}
                    className="cursor-pointer transition-colors hover:bg-primary/10"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{booking.serviceName}</p>
                      <p className="mt-1 text-xs text-gray-400">{booking.id}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{booking.clientName}</p>
                      <p className="mt-1 text-xs text-gray-400">{booking.clientEmail}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-gray-700">
                        <ModeIcon size={14} />
                        {bookingModeLabels[booking.mode]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      <p>{formatBookingDate(booking)}</p>
                      <p className="mt-1 text-xs text-gray-400">{booking.time}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{booking.partySize}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[booking.status] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        {formatStatus(booking.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {booking.totalPrice > 0 ? `${booking.totalPrice.toLocaleString()} ${booking.currency}` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
