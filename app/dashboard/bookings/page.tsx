'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Calendar, ClipboardList, Clock, HelpCircle, Mail, Phone, Search, Ticket, Users } from 'lucide-react';
import {
  bookingModeLabels,
  sampleBookings,
  type BookingRecord,
} from '@/lib/mock-data';
import type { BookingMode } from '@/lib/reserva-types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const [selectedId, setSelectedId] = useState<string | null>(sampleBookings[0]?.id ?? null);
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
        <div className="mb-8 pt-20">
          <button
            type="button"
            onClick={closeDetail}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back to bookings
          </button>
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                <ModeIcon size={14} />
                {bookingModeLabels[selected.mode]}
              </p>
              <h1 className="text-5xl font-light tracking-tight text-gray-900">{selected.serviceName}</h1>
              <p className="mt-2 text-sm text-gray-400">{selected.id}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[selected.status] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {formatStatus(selected.status)}
            </span>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="rounded-lg border border-gray-100 bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
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
                <div key={item.label} className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>

            {selected.notes && (
              <div className="mt-6 rounded-lg border border-gray-100 p-4">
                <p className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
                  <ClipboardList size={14} />
                  Notes
                </p>
                <p className="text-sm text-gray-700">{selected.notes}</p>
              </div>
            )}
          </section>

          <aside className="rounded-lg border border-gray-100 bg-white p-6">
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
      <div className="mb-10 pt-20">
        <h1 className="mb-2 text-5xl font-light tracking-tight text-gray-900">Bookings</h1>
        <p className="text-sm text-gray-400">
          All client bookings across appointment, reservation, ticket, and request modes.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search client, service, email, or ID"
            className="border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>
        <Select value={modeFilter} onValueChange={setModeFilter}>
          <SelectTrigger className="w-[180px] rounded-full">
            <SelectValue placeholder="Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All modes</SelectItem>
            {(Object.keys(bookingModeLabels) as BookingMode[]).map((mode) => (
              <SelectItem key={mode} value={mode}>
                {bookingModeLabels[mode]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] rounded-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="no_show">No show</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <p className="text-sm font-medium text-gray-900">{filtered.length} bookings</p>
          <p className="text-xs text-gray-400">Click a row to open details</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-gray-50/70 text-xs font-medium uppercase tracking-wider text-gray-400">
                <th className="px-5 py-3">Booking</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Mode</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Guests</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.map((booking) => {
                const ModeIcon = modeIcons[booking.mode];
                const isActive = selectedId === booking.id;

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
                    className={`cursor-pointer border-l-4 transition-colors ${
                      isActive
                        ? 'border-l-primary bg-primary/10 outline outline-1 outline-primary/30'
                        : 'border-l-transparent hover:bg-gray-50'
                    }`}
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
                    <td className="px-5 py-4 text-right font-medium text-gray-900">
                      {booking.totalPrice > 0 ? `${booking.totalPrice.toLocaleString()} ${booking.currency}` : '-'}
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
