'use client';

import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, X, ChevronLeft, ChevronRight, Plus, CalendarIcon, MapPin, Ticket, HelpCircle } from 'lucide-react';
import { bookingModeLabels } from '@/lib/mock-data';
import type { BookingModeType } from '@/lib/types';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { sampleAppointments, sampleBookableServices, sampleClients } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DatePickerDemo from '@/components/ui/datepicker';
import type { Appointment } from '@/lib/types';

const controlTrackClass = 'inline-flex h-10 items-center rounded-full bg-neutral-200 p-1';

const controlNavButtonClass =
  'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:text-gray-900';

const newAppointmentButtonClass =
  'flex h-10 cursor-pointer items-center gap-2 rounded-full border border-primary bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:border-[var(--reserva-ink)] hover:bg-[var(--reserva-ink)] hover:text-white';

const viewOptions = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
] as const;

type AgendaView = (typeof viewOptions)[number]['value'];

function getAgendaDateLabel(currentDate: Date, view: string) {
  if (view === 'month') {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
  if (view === 'week') {
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const formatShort = (date: Date) =>
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${formatShort(start)} – ${formatShort(end)}`;
  }
  return currentDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function AgendaViewTabs({
  value,
  onChange,
}: {
  value: AgendaView;
  onChange: (value: AgendaView) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeButton = container.querySelector<HTMLButtonElement>(`[data-view="${value}"]`);
    if (!activeButton) return;
    setIndicatorStyle({
      left: activeButton.offsetLeft,
      width: activeButton.offsetWidth,
    });
  }, [value]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex h-10 max-w-full items-center overflow-x-auto rounded-full bg-neutral-200 p-1"
      role="tablist"
      aria-label="Calendar view"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1 bottom-1 rounded-full bg-white transition-[left,width] duration-300 ease-out"
        style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
      />
      {viewOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          data-view={option.value}
          onClick={() => onChange(option.value)}
          className={`relative z-10 flex h-8 cursor-pointer items-center whitespace-nowrap rounded-full px-4 text-xs font-medium transition-colors ${
            value === option.value ? 'text-gray-900' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status?: string;
  address?: string;
};

// Legacy appointment pattern removed

interface NewAppointmentModalProps {
  onClose: () => void;
  onCreateAppointment: (appointment: Appointment) => void;
}

const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ onClose, onCreateAppointment }) => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [service, setService] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('clients');
      if (stored) {
        setClients(JSON.parse(stored) as Client[]);
      } else {
        setClients(sampleClients.map(client => ({
          id: Number(client.id),
          name: client.name,
          email: client.email,
          phone: client.phone,
          status: client.status,
          address: client.address
        })));
      }
    } catch {
      setClients([]);
    }
  }, []);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [isNewClient, setIsNewClient] = useState(false);
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.phone.includes(clientSearch)
  );

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setClientSearch(client.name);
    setIsNewClient(false);
  };

  const handleClientSearchChange = (value: string) => {
    setClientSearch(value);
    setSelectedClient(null);
    setIsNewClient(value.length > 0 && filteredClients.length === 0);
  };

  const handleCreate = () => {
    // Validation
    if (!date || !time || !service || !duration) {
      alert('Please fill in all required fields');
      return;
    }

    if (!selectedClient && !isNewClient) {
      alert('Please select or create a client');
      return;
    }

    // Normalize the date to remove time component - CRITICAL for matching
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    normalizedDate.setHours(0, 0, 0, 0);

    // Normalize time to HH:mm format
    let normalizedTime = time;
    if (/^\d{1,2}:\d{2}:\d{2}$/.test(time)) {
      // If time is like '09:00:00', convert to '09:00'
      normalizedTime = time.slice(0,5);
    } else if (/^\d{1,2}$/.test(time)) {
      // If time is like '9', convert to '09:00'
      normalizedTime = time.padStart(2, '0') + ':00';
    }

    // Create new appointment
    const newAppointment: Appointment = {
      id: Date.now(),
      clientName: selectedClient ? selectedClient.name : clientSearch,
      service,
      time: normalizedTime,
      duration: parseInt(duration),
      status: 'pending',
      phone: selectedClient ? selectedClient.phone : newClientPhone,
      email: selectedClient ? selectedClient.email : newClientEmail,
      date: normalizedDate,
      notes
    };

    onCreateAppointment(newAppointment);
    onClose();
  };

  return (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4 animate-fadeIn">
    <div className="w-full max-w-3xl max-h-[calc(100vh-1.5rem)] md:max-h-[90vh] overflow-y-auto rounded-xl border border-neutral-200 bg-white animate-slideUp">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-gray-100 bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light text-gray-900">New</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">
        {/* Client Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium tracking-wide text-gray-500">Client</h3>

          {/* Client Search/Select */}
          <div className="space-y-2">
            <Label htmlFor="clientSearch">Search for a client</Label>
            <div className="relative">
              <Input
                id="clientSearch"
                type="text"
                value={clientSearch}
                onChange={(e) => handleClientSearchChange(e.target.value)}
                placeholder="Type a name, email, or phone..."
                className="mt-2 cursor-pointer rounded-full px-4 py-2"
              />

              {/* Dropdown with filtered clients */}
              {clientSearch && !selectedClient && (
                <div className="absolute z-30 w-full mt-1 bg-white border border-neutral-200 rounded-xl  max-h-60 overflow-y-auto">
                  {filteredClients.length > 0 ? (
                    <div className="py-2">
                      {filteredClients.map((client) => (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => handleClientSelect(client)}
                          className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                            <span className="text-white font-medium text-sm">
                              {client.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{client.name}</p>
                            <p className="text-xs text-gray-500 truncate">{client.email}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            client.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {client.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm text-gray-500 mb-3">No client found</p>
                      <button
                        type="button"
                        onClick={() => window.location.href = '/dashboard/bookings/clients'}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-800"
                      >
                        <Plus size={14} />
                        Add client
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Show selected client info or manual entry */}
          {selectedClient ? (
            <div className="p-4 bg-gray-50 rounded-xl border border-neutral-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {selectedClient.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedClient.name}</h4>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium mt-1 ${
                      selectedClient.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {selectedClient.status}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedClient(null);
                    setClientSearch('');
                  }}
                  className="cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={14} className="text-gray-400" />
                  <span>{selectedClient.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={14} className="text-gray-400" />
                  <span>{selectedClient.phone}</span>
                </div>
                {selectedClient.address && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{selectedClient.address}</span>
                  </div>
                )}
              </div>
            </div>
          ) : isNewClient ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  className="rounded-full mt-2 px-4 py-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="sophie.m@email.com"
                  className="rounded-full mt-2 px-4 py-2"
                />
              </div>
            </div>
          ) : null}

          {/* Service */}
          <div className="space-y-2">
            <Label htmlFor="service">Service</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger id="service" className="mt-2 cursor-pointer rounded-full px-4 py-2">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {sampleBookableServices.map((option) => (
                  <SelectItem key={option.id} value={option.name} className="cursor-pointer">
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* DateTime */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium tracking-wide text-gray-500">Scheduling</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'mt-2 h-auto w-full cursor-pointer justify-start rounded-full px-4 py-2 text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: enUS }) : <span>Choose a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={enUS}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="mb-2">Time</Label>
              <div className='mt-2'>
                <DatePickerDemo  value={time} onChange={setTime} id="rdv-time-picker" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration" className="mt-2 cursor-pointer rounded-full px-4 py-2">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30" className="cursor-pointer">30 min</SelectItem>
                  <SelectItem value="45" className="cursor-pointer">45 min</SelectItem>
                  <SelectItem value="60" className="cursor-pointer">60 min</SelectItem>
                  <SelectItem value="90" className="cursor-pointer">90 min</SelectItem>
                  <SelectItem value="120" className="cursor-pointer">120 min</SelectItem>
                  <SelectItem value="150" className="cursor-pointer">150 min</SelectItem>
                  <SelectItem value="180" className="cursor-pointer">180 min</SelectItem>
                  <SelectItem value="240" className="cursor-pointer">240 min</SelectItem>
                  <SelectItem value="360" className="cursor-pointer">360 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium tracking-wide text-gray-500">Notes</h3>
          <Textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes (optional)"
            className="rounded-xl px-4 py-2 border-neutral-200 focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 flex gap-3 border-t border-gray-100 bg-white px-8 py-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 cursor-pointer rounded-full border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCreate}
          className="flex-1 cursor-pointer rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-[var(--reserva-ink)] hover:text-white"
        >
          Create
        </button>
      </div>
    </div>
  </div>
);
}

const modeBadge: Record<BookingModeType, { label: string; Icon: typeof Calendar }> = {
  appointment: { label: bookingModeLabels.appointment, Icon: Clock },
  reservation: { label: bookingModeLabels.reservation, Icon: Calendar },
  ticket: { label: bookingModeLabels.ticket, Icon: Ticket },
  request: { label: bookingModeLabels.request, Icon: HelpCircle },
};

interface AppointmentCardProps {
  apt: Appointment;
  viewType: 'day' | 'week' | 'month';
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, appointment: Appointment) => void;
  onOpen?: (appointment: Appointment) => void;
}

const modeColors: Record<BookingModeType, string> = {
  appointment: '#6366F1', // Indigo
  reservation: '#10B981', // Emerald
  ticket: '#F59E0B',      // Amber
  request: '#EC4899',     // Rose
};

const fallbackColors = [
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#14B8A6', // Teal
  '#F43F5E', // Rose
  '#F59E0B', // Amber
  '#10B981', // Emerald
];

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  apt,
  viewType,
  onDragStart,
  onOpen,
}) => {
  const getCardColor = () => {
    if (apt.bookingMode && modeColors[apt.bookingMode]) {
      return modeColors[apt.bookingMode];
    }
    const index = Math.abs(apt.id) % fallbackColors.length;
    return fallbackColors[index];
  };

  const color = getCardColor();

  const getStyle = (colorStr: string) => {
    const hex = colorStr.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
      borderColor: `rgba(${r}, ${g}, ${b}, 0.3)`,
      color: colorStr,
    };
  };

  const mode = apt.bookingMode ? modeBadge[apt.bookingMode] : null;

  if (viewType === 'month') {
    return (
      <div
        draggable
        role="button"
        tabIndex={0}
        onClick={() => onOpen?.(apt)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen?.(apt);
          }
        }}
        onDragStart={(e) => onDragStart && onDragStart(e, apt)}
        className="flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-medium leading-none cursor-pointer transition-all hover:brightness-95 select-none truncate w-full"
        style={getStyle(color)}
      >
        <span className="font-semibold shrink-0 tabular-nums">{apt.time}</span>
        <span className="truncate">{apt.clientName}</span>
      </div>
    );
  }

  if (viewType === 'day') {
    return (
      <div
        draggable
        role="button"
        tabIndex={0}
        onClick={() => onOpen?.(apt)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen?.(apt);
          }
        }}
        onDragStart={(e) => onDragStart && onDragStart(e, apt)}
        className="flex h-full min-h-9 w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium leading-snug transition-all hover:brightness-95 select-none"
        style={getStyle(color)}
      >
        <span className="shrink-0 font-semibold tabular-nums">{apt.time}</span>
        <span className="shrink-0 truncate">{apt.clientName}</span>
        <span className="hidden shrink-0 text-current/40 sm:inline" aria-hidden>
          ·
        </span>
        <span className="min-w-0 flex-1 truncate opacity-80">{apt.service}</span>
        {apt.notes ? (
          <>
            <span className="hidden shrink-0 text-current/40 md:inline" aria-hidden>
              ·
            </span>
            <span className="hidden min-w-0 max-w-[30%] truncate opacity-65 md:inline">
              {apt.notes}
            </span>
          </>
        ) : null}
        {mode ? (
          <span className="ml-auto hidden shrink-0 items-center gap-1 rounded-full bg-white/50 px-2 py-0.5 text-[10px] lg:inline-flex">
            <mode.Icon size={10} />
            {mode.label}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div
      draggable
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(apt)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen?.(apt);
        }
      }}
      onDragStart={(e) => onDragStart && onDragStart(e, apt)}
      className="flex h-full min-h-[4.5rem] w-full cursor-pointer flex-col justify-center gap-1 rounded-xl border p-2.5 text-xs transition-all hover:brightness-95 select-none"
      style={getStyle(color)}
    >
      <div className="truncate font-semibold">{apt.clientName}</div>
      <div className="truncate text-[10px] opacity-75">{apt.service}</div>
      <div className="flex items-center gap-1 text-[10px] opacity-60 tabular-nums">
        <Clock size={10} />
        <span>
          {apt.time} ({apt.duration}m)
        </span>
      </div>
    </div>
  );
};

function BookingDetailModal({
  appointment,
  onClose,
}: {
  appointment: Appointment;
  onClose: () => void;
}) {
  const mode = appointment.bookingMode
    ? modeBadge[appointment.bookingMode]
    : { label: 'Booking', Icon: Calendar };
  const detailsHref = appointment.bookingId
    ? `/dashboard/bookings?booking=${encodeURIComponent(appointment.bookingId)}`
    : '/dashboard/bookings';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-3 md:p-4">
      <div className="w-full max-w-lg max-h-[calc(100vh-1.5rem)] overflow-y-auto rounded-xl border border-neutral-200 bg-white p-5 md:p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-400">
              <mode.Icon size={14} />
              {mode.label}
            </p>
            <h2 className="mt-1 text-2xl font-light text-gray-900">{appointment.service}</h2>
            <p className="mt-1 text-sm capitalize text-gray-500">{appointment.status}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <User size={16} className="text-gray-400" />
            {appointment.clientName}
          </div>
          {appointment.phone && (
            <div className="flex items-center gap-2 text-gray-700">
              <Phone size={16} className="text-gray-400" />
              {appointment.phone}
            </div>
          )}
          {appointment.email && (
            <div className="flex items-center gap-2 text-gray-700">
              <Mail size={16} className="text-gray-400" />
              {appointment.email}
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-700">
            <CalendarIcon size={16} className="text-gray-400" />
            {appointment.date.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}{' '}
            at {appointment.time}
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock size={16} className="text-gray-400" />
            {appointment.duration} minutes
            {appointment.partySize ? ` · ${appointment.partySize} people` : ''}
          </div>
          {appointment.channel && (
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin size={16} className="text-gray-400" />
              {appointment.channel === 'online' ? 'Online' : 'Direct'}
            </div>
          )}
          {appointment.notes && (
            <p className="rounded-xl bg-gray-50 p-3 text-gray-600">{appointment.notes}</p>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-neutral-200 bg-white py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Close
          </button>
          <Link
            href={detailsHref}
            className="flex-1 rounded-full bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-[var(--reserva-ink)] hover:text-white"
          >
            Open details
          </Link>
        </div>
      </div>
    </div>
  );
}

const AgendaPage = () => {
  const [view, setView] = useState<AgendaView>('week');
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showNewRDV, setShowNewRDV] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<Appointment | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleStatusFilter = (event: Event) => {
      const ev = event as CustomEvent<string>;
      setFilterStatus(ev.detail);
    };
    window.addEventListener('statusFilterChange', handleStatusFilter as EventListener);
    return () => {
      window.removeEventListener('statusFilterChange', handleStatusFilter as EventListener);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setView('day');
    }
  }, []);

  // Sample appointments data - normalize dates and load from localStorage
  const [appointments, setAppointments] = useState<Appointment[]>(sampleAppointments);

  // Load settings and hydrate data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize currentDate
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setCurrentDate(today);

      // Hydrate appointments with legacy check
      const stored = localStorage.getItem('appointments');
      if (stored) {
        try {
          const isLegacy = /Consultation|Follow-up|Therapy|Manicure|Hairdresser|Massage|Samira|Khalid|Yassine|Nadia El Khatib|2025/.test(stored);
          if (isLegacy) {
            setAppointments(sampleAppointments);
            localStorage.setItem('appointments', JSON.stringify(sampleAppointments));
          } else {
            const parsed = JSON.parse(stored) as Array<Omit<Appointment, 'date'> & { date: string }>;
            setAppointments(parsed.map(apt => ({
              ...apt,
              date: new Date(apt.date)
            })));
          }
        } catch (e) {
          console.error('Error loading appointments:', e);
          setAppointments(sampleAppointments);
          localStorage.setItem('appointments', JSON.stringify(sampleAppointments));
        }
      } else {
        setAppointments(sampleAppointments);
        localStorage.setItem('appointments', JSON.stringify(sampleAppointments));
      }
    }
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && appointments.length > 0) {
      localStorage.setItem('appointments', JSON.stringify(appointments));
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('appointmentsUpdated'));
    }
  }, [appointments]);

  const timeSlots = Array.from({ length: 15 }, (_, i) => `${(i + 9).toString().padStart(2, '0')}:00`);

  // Get week days - normalized
  const getWeekDays = () => {
    const start = new Date(currentDate!);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      date.setHours(0, 0, 0, 0);
      return date;
    });
  };

  // Get month days - normalized
  const getMonthDays = () => {
    const year = currentDate!.getFullYear();
    const month = currentDate!.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    const days = [];
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }
    return days;
  };

  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate!);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    newDate.setHours(0, 0, 0, 0);
    setCurrentDate(newDate);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, appointment: Appointment) => {
    setDraggedEvent(appointment);
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newTime: string, newDate: Date) => {
    e.preventDefault();
    if (draggedEvent) {
      // Normalize the new date
      const normalizedDate = new Date(newDate);
      normalizedDate.setHours(0, 0, 0, 0);

      setAppointments(appointments.map(apt =>
        apt.id === draggedEvent.id
          ? { ...apt, time: newTime, date: normalizedDate }
          : apt
      ));
      setDraggedEvent(null);
    }
  };

  // Combined legacy patterns into the initial mount hydration hook

  // Don't render until currentDate is initialized on the client
  if (!currentDate) {
    return <div className="min-h-screen p-0 md:p-0" />;
  }

  return (
    <div suppressHydrationWarning className="min-h-screen p-0 md:p-0">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>

      <div className="mb-6 md:mb-8 pt-20">
        <div className="mb-4 md:mb-6 flex flex-col items-start gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-6">
          <div>
            <h1 className="mb-1.5 text-2xl md:text-5xl font-light tracking-tight text-gray-900">Agenda</h1>
            <p className="text-xs md:text-sm text-neutral-500">Manage appointments and your daily schedule</p>
          </div>
          <button type="button" onClick={() => setShowNewRDV(true)} className={newAppointmentButtonClass}>
            <Plus size={14} />
            New
          </button>
        </div>

        <div className="flex flex-col items-start gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-4">
          <AgendaViewTabs value={view} onChange={setView} />

          <div className={controlTrackClass}>
            <button
              type="button"
              onClick={() => navigateDate(-1)}
              className={controlNavButtonClass}
              aria-label="Previous period"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="flex h-8 min-w-0 md:min-w-[9rem] items-center justify-center px-2 text-xs font-medium text-gray-900">
              {getAgendaDateLabel(currentDate, view)}
            </span>
            <button
              type="button"
              onClick={() => navigateDate(1)}
              className={controlNavButtonClass}
              aria-label="Next period"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Views */}
      <div key={refreshKey} className=" overflow-hidden animate-fadeIn">
        {view === 'week' && (
          <div className="scroll-hint overflow-x-auto bg-white rounded-xl border border-neutral-200 ">
            <div className="min-w-[1000px]">
              {/* Header */}
              <div className="grid grid-cols-8 border-b border-gray-100">
                <div className="p-4 border-r border-gray-100"></div>
                {getWeekDays().map((date, i) => {
                  const isToday = date.toDateString() === new Date().toDateString();
                  return (
                    <div key={i} className="p-4 text-center border-r border-gray-100 last:border-r-0">
                      <div className={`text-xs font-medium uppercase tracking-wider mb-2 ${isToday ? 'text-gray-900' : 'text-gray-400'}`}>
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className={`text-xl font-light ${
                        isToday
                          ? 'w-8 h-8 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center'
                          : 'text-gray-900'
                      }`}>
                        {date.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Time slots */}
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-8 border-b border-gray-100 hover:bg-gray-50/30 transition-colors">
                  <div className="p-3 border-r border-gray-100 text-xs font-light text-gray-400">
                    {time}
                  </div>
                  {getWeekDays().map((date, i) => (
                    <div
                      key={i}
                      className="p-2 border-r border-gray-100 last:border-r-0 min-h-20 relative group/cell"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, time, date)}
                    >
                      <button
                        onClick={() => setShowNewRDV(true)}
                        className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-all z-10"
                      >
                        <Plus size={12} />
                      </button>
                      {appointments
                        .filter(apt => {
                          // Normalize both dates for comparison
                          const aptDate = new Date(apt.date);
                          aptDate.setHours(0, 0, 0, 0);
                          const compareDate = new Date(date);
                          compareDate.setHours(0, 0, 0, 0);

                          const matches = aptDate.getTime() === compareDate.getTime() &&
                            apt.time === time &&
                            (filterStatus === 'all' || apt.status === filterStatus);

                          return matches;
                        })
                        .map(apt => (
                          <AppointmentCard
                            key={apt.id}
                            apt={apt}
                            viewType="week"
                            onDragStart={handleDragStart}
                            onOpen={setSelectedAppointment}
                          />
                        ))
                      }
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'day' && (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <div className="scroll-hint overflow-x-auto">
              <div className="min-w-[640px]">
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className="group/time relative grid grid-cols-[5rem_1fr] border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50/30"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, time, currentDate)}
                  >
                    <div className="border-r border-gray-100 p-3 text-xs font-light text-gray-400">
                      {time}
                    </div>
                    <div className="relative flex min-h-[4.5rem] flex-col justify-center gap-1.5 p-2">
                      <button
                        type="button"
                        onClick={() => setShowNewRDV(true)}
                        className="absolute bottom-2 right-2 z-10 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-400 opacity-0 transition-all hover:bg-gray-200 hover:text-gray-600 group-hover/time:opacity-100"
                      >
                        <Plus size={12} />
                      </button>
                      {appointments
                        .filter((apt) => {
                          const aptDate = new Date(apt.date);
                          aptDate.setHours(0, 0, 0, 0);
                          const compareDate = new Date(currentDate);
                          compareDate.setHours(0, 0, 0, 0);

                          return (
                            aptDate.getTime() === compareDate.getTime() &&
                            apt.time === time &&
                            (filterStatus === 'all' || apt.status === filterStatus)
                          );
                        })
                        .map((apt) => (
                          <AppointmentCard
                            key={apt.id}
                            apt={apt}
                            viewType="day"
                            onDragStart={handleDragStart}
                            onOpen={setSelectedAppointment}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'month' && (
          <div className="bg-white rounded-xl border border-neutral-200  overflow-hidden">
            {/* Month Header */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-400 uppercase tracking-wider py-4 border-r border-gray-100 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {getMonthDays().map((date, i) => {
                if (!date) return (
                  <div
                    key={i}
                    className="min-h-[80px] md:min-h-[140px] bg-gray-50/30 border-r border-b border-gray-100"
                  ></div>
                );
                const isToday = date.toDateString() === new Date().toDateString();
                const dayAppointments = appointments.filter(apt => {
                  // Normalize both dates for comparison
                  const aptDate = new Date(apt.date);
                  aptDate.setHours(0, 0, 0, 0);
                  const compareDate = new Date(date);
                  compareDate.setHours(0, 0, 0, 0);
                  return aptDate.getTime() === compareDate.getTime() &&
                    (filterStatus === 'all' || apt.status === filterStatus);
                });
                const pendingCount = dayAppointments.filter(apt => apt.status === 'pending').length;
                const confirmedCount = dayAppointments.filter(apt => apt.status === 'confirmed').length;
                const completedCount = dayAppointments.filter(apt => apt.status === 'completed').length;
                const cancelledCount = dayAppointments.filter(apt => apt.status === 'cancelled').length;
                const noShowCount = dayAppointments.filter(apt => apt.status === 'no_show').length;
                return (
                  <div
                    key={i}
                    className={`min-h-[80px] md:min-h-[140px] border-r border-b border-gray-100 p-1 md:p-2 hover:bg-gray-50/50 transition-all group/date relative ${
                      isToday ? 'bg-gray-50/50' : 'bg-white'
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, dayAppointments.length > 0 ? dayAppointments[0].time : '09:00', date)}
                  >
                    <button
                      onClick={() => setShowNewRDV(true)}
                      className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-white border border-neutral-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 hover:border-neutral-300 flex items-center justify-center opacity-0 group-hover/date:opacity-100 transition-all z-20 "
                    >
                      <Plus size={12} />
                    </button>
                    {/* Date Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className={`text-sm font-light ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium'
                          : 'text-gray-600'
                      }`}>
                        {date.getDate()}
                      </div>
                      {dayAppointments.length > 0 && (
                        <div className="flex items-center gap-0.5">
                          <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                          <span className="text-[10px] font-medium text-gray-400">
                            {dayAppointments.length}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Appointments - use AppointmentCard for color logic */}
                    <div className="space-y-1">
                      <div className="hidden md:block space-y-1">
                        {dayAppointments.slice(0, 3).map(apt => (
                          <AppointmentCard
                            key={apt.id}
                            apt={apt}
                            viewType="month"
                            onDragStart={handleDragStart}
                            onOpen={setSelectedAppointment}
                          />
                        ))}
                        {dayAppointments.length > 3 && (
                          <div className="text-[10px] text-gray-500 font-medium px-1.5 py-1 hover:text-gray-900 transition-colors">
                            +{dayAppointments.length - 3} more
                          </div>
                        )}
                      </div>
                      {/* Mobile: just show count dot */}
                      {dayAppointments.length > 0 && (
                        <div className="md:hidden flex items-center justify-center mt-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        </div>
                      )}
                    </div>

                    {/* Status Summary (on hover) */}
                    {dayAppointments.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 text-[9px] font-medium">
                          {pendingCount > 0 && (
                            <div className="flex items-center gap-1 text-amber-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                              <span>{pendingCount}</span>
                            </div>
                          )}
                          {confirmedCount > 0 && (
                            <div className="flex items-center gap-1 text-emerald-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                              <span>{confirmedCount}</span>
                            </div>
                          )}
                          {completedCount > 0 && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                              <span>{completedCount}</span>
                            </div>
                          )}
                          {cancelledCount > 0 && (
                            <div className="flex items-center gap-1 text-red-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                              <span>{cancelledCount}</span>
                            </div>
                          )}
                          {noShowCount > 0 && (
                            <div className="flex items-center gap-1 text-purple-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                              <span>{noShowCount}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedAppointment && (
        <BookingDetailModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

      {showNewRDV && (
        <NewAppointmentModal
          onClose={() => setShowNewRDV(false)}
          onCreateAppointment={(newAppointment) => {
            const updatedAppointments = [...appointments, newAppointment];
            setAppointments(updatedAppointments);

            // Force refresh
            setRefreshKey(prev => prev + 1);
          }}
        />
      )}
    </div>
  );
};

export default AgendaPage;
