'use client';

import { useMemo, useState } from 'react';
import { Calendar, Search, Ticket, ClipboardList, Clock, HelpCircle } from 'lucide-react';
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

export default function BookingsPage() {
  const [query, setQuery] = useState('');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<BookingRecord | null>(sampleBookings[0] ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sampleBookings.filter((booking) => {
      if (modeFilter !== 'all' && booking.mode !== modeFilter) return false;
      if (statusFilter !== 'all' && booking.status !== statusFilter) return false;
      if (!q) return true;
      return (
        booking.guestName.toLowerCase().includes(q) ||
        booking.serviceName.toLowerCase().includes(q) ||
        booking.id.toLowerCase().includes(q)
      );
    });
  }, [query, modeFilter, statusFilter]);

  return (
    <div className="min-h-screen">
      <div className="mb-10 pt-20">
        <h1 className="mb-2 text-5xl font-light tracking-tight text-gray-900">Bookings</h1>
        <p className="text-sm text-gray-400">
          All guest bookings across four modes: appointment, reservation, ticket, and request.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guest, service, or ID"
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

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-lg border border-gray-100 bg-white">
          <div className="border-b border-gray-100 px-5 py-4">
            <p className="text-sm font-medium text-gray-900">{filtered.length} bookings</p>
          </div>
          <div className="max-h-[calc(100vh-280px)] overflow-y-auto p-3 space-y-2">
            {filtered.map((booking) => {
              const ModeIcon = modeIcons[booking.mode];
              return (
                <button
                  key={booking.id}
                  type="button"
                  onClick={() => setSelected(booking)}
                  className={`w-full rounded-lg border p-4 text-left transition-all ${
                    selected?.id === booking.id
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                      <ModeIcon size={14} />
                      {bookingModeLabels[booking.mode]}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusStyles[booking.status] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{booking.guestName}</p>
                  <p className="mt-1 text-xs text-gray-500">{booking.serviceName}</p>
                  <p className="mt-2 text-xs text-gray-400">
                    {booking.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {booking.time}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="rounded-lg border border-gray-100 bg-white p-6">
          {selected ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    {bookingModeLabels[selected.mode]}
                  </p>
                  <h2 className="mt-1 text-2xl font-light text-gray-900">{selected.serviceName}</h2>
                  <p className="mt-1 text-sm text-gray-500">{selected.id}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[selected.status] ?? ''}`}
                >
                  {selected.status}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: 'Guest', value: selected.guestName },
                  { label: 'Email', value: selected.guestEmail },
                  { label: 'Phone', value: selected.guestPhone },
                  {
                    label: 'Date & time',
                    value: `${selected.date.toLocaleDateString('en-US')} at ${selected.time}`,
                  },
                  { label: 'Duration', value: `${selected.durationMinutes} min` },
                  { label: 'Guests', value: String(selected.guestCount) },
                  { label: 'Channel', value: selected.channel === 'online' ? 'Online' : 'Direct' },
                  {
                    label: 'Total',
                    value:
                      selected.totalPrice > 0
                        ? `${selected.totalPrice.toLocaleString()} ${selected.currency}`
                        : 'No charge',
                  },
                ].map((row) => (
                  <div key={row.label} className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">{row.label}</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">{row.value}</p>
                  </div>
                ))}
              </div>

              {selected.notes && (
                <div className="rounded-lg border border-gray-100 p-4">
                  <p className="mb-1 flex items-center gap-2 text-xs font-medium text-gray-500">
                    <ClipboardList size={14} />
                    Notes
                  </p>
                  <p className="text-sm text-gray-700">{selected.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Select a booking to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
}
