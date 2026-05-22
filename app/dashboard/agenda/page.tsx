'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, X, ChevronLeft, ChevronRight, MoreVertical, Plus, CalendarIcon, MapPin, Ticket, HelpCircle } from 'lucide-react';
import { bookingModeLabels } from '@/lib/mock-data';
import type { BookingModeType } from '@/lib/types';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { sampleAppointments, defaultAgendas, sampleBookableServices, sampleClients } from '@/lib/mock-data';
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

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status?: string;
  address?: string;
};

const legacyAppointmentPattern = /Consultation|Follow-up|Therapy|Manicure|Hairdresser|Massage|Samira|Khalid|Yassine|Nadia El Khatib|2025/;

interface NewAppointmentModalProps {
  onClose: () => void;
  onCreateAppointment: (appointment: Appointment) => void;
}

const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ onClose, onCreateAppointment }) => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [service, setService] = useState('');
  const [duration, setDuration] = useState('');
  const [employee, setEmployee] = useState('');
  const [notes, setNotes] = useState('');
  const [collaborators, setCollaborators] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAgendas = localStorage.getItem('employeeAgendas');
      if (storedAgendas) {
        try {
          const agendas = JSON.parse(storedAgendas);
          setCollaborators(agendas.map((a: any) => a.name));
        } catch {
          setCollaborators(defaultAgendas.map(a => a.name));
        }
      } else {
        setCollaborators(defaultAgendas.map(a => a.name));
      }
    }
  }, []);

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
    if (!date || !time || !service || !duration || !employee) {
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
      employee,
      phone: selectedClient ? selectedClient.phone : newClientPhone,
      email: selectedClient ? selectedClient.email : newClientEmail,
      date: normalizedDate,
      notes
    };

    onCreateAppointment(newAppointment);
    onClose();
  };

  return (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
    <div className="bg-white rounded-lg  max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 z-40">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light text-gray-900">New reservation</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">
        {/* Client Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Client</h3>

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
                className="rounded-full px-4 py-2 mt-2"
              />

              {/* Dropdown with filtered clients */}
              {clientSearch && !selectedClient && (
                <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg  max-h-60 overflow-y-auto">
                  {filteredClients.length > 0 ? (
                    <div className="py-2">
                      {filteredClients.map((client) => (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => handleClientSelect(client)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
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
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors"
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
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
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
                  className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
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
            <Label htmlFor="service">Offre</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger id="service" className="rounded-full px-4 py-2 mt-2">
                <SelectValue placeholder="Select une offre" />
              </SelectTrigger>
              <SelectContent>
                {sampleBookableServices.map((option) => (
                  <SelectItem key={option.id} value={option.name}>{option.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* DateTime */}
        <div className="space-y-4">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Planification</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-full px-4 py-2 mt-2 h-auto",
                      !date && "text-muted-foreground"
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
                <SelectTrigger id="duration" className="rounded-full px-4 py-2 mt-2">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                  <SelectItem value="90">90 min</SelectItem>
                  <SelectItem value="120">120 min</SelectItem>
                  <SelectItem value="150">150 min</SelectItem>
                  <SelectItem value="180">180 min</SelectItem>
                  <SelectItem value="240">240 min</SelectItem>
                  <SelectItem value="360">360 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Resource */}
        <div className="space-y-4">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Resource</h3>
          <Select value={employee} onValueChange={setEmployee}>
            <SelectTrigger className="rounded-full px-4 py-2 border-gray-200 focus:ring-2 focus:ring-gray-900">
              <SelectValue placeholder="Select une ressource" />
            </SelectTrigger>
            <SelectContent>
              {collaborators.map(collab => (
                <SelectItem key={collab} value={collab}>
                  {collab}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div className="space-y-4">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Notes</h3>
          <Textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add des notes..."
            className="rounded-lg px-4 py-2 border-gray-200 focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-4 flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={handleCreate}
          className="flex-1 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-[var(--reserva-ink)] hover:text-white cursor-pointer transition-colors"
        >
          Create la reservation
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
  isCompact?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, appointment: Appointment) => void;
  onOpen?: (appointment: Appointment) => void;
  employeeColor?: string;
  serviceColor?: string;
  showColorInRDV?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  apt,
  isCompact = false,
  onDragStart,
  onOpen,
  employeeColor,
  serviceColor,
  showColorInRDV = true
}) => {
  const getStatusBg = (status: string) => {
    // If showColorInRDV is false, use status colors
    if (!showColorInRDV) {
      switch (status) {
        case 'confirmed': return 'bg-emerald-50 border-emerald-200 text-emerald-900';
        case 'pending': return 'bg-amber-50 border-amber-200 text-amber-900';
        case 'completed': return 'bg-blue-50 border-blue-200 text-blue-900';
        case 'cancelled': return 'bg-rose-50 border-rose-200 text-rose-900';
        case 'no_show': return 'bg-purple-50 border-purple-200 text-purple-900';
        default: return 'bg-gray-50 border-gray-200 text-gray-900';
      }
    }

    // If showColorInRDV is true, use employee or service color
    const color = employeeColor || serviceColor || '#3B82F6';
    return '';
  };

  // Generate lighter background and border colors from the main color
  const getLightColorStyle = (color: string) => {
    if (!showColorInRDV) return {};

    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
      borderColor: `rgba(${r}, ${g}, ${b}, 0.3)`,
      color: color
    };
  };

  const color = employeeColor || serviceColor || '#3B82F6';
  const mode = apt.bookingMode ? modeBadge[apt.bookingMode] : null;

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
      className={`${getStatusBg(apt.status)} rounded-lg p-3 cursor-pointer transition-all border ${
        isCompact ? 'text-xs' : 'text-sm'
      }`}
      style={showColorInRDV ? getLightColorStyle(color) : {}}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate break-words w-full">{apt.clientName}</p>
          <p className="text-xs opacity-60 truncate break-words w-full mt-0.5">{apt.service}</p>
        </div>
        {!isCompact && (
          <button className="p-1 opacity-40 hover:opacity-100 transition-opacity">
            <MoreVertical size={14} />
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-1.5 text-xs opacity-60">
        <Clock size={11} />
        <span>{apt.time} · {apt.duration}min</span>
        {mode && (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-white/60 px-1.5 py-0.5 text-[10px] font-medium">
            <mode.Icon size={10} />
            {mode.label}
          </span>
        )}
      </div>
      {!isCompact && (
        <div className="mt-2 pt-2 border-t border-current/10 text-xs opacity-60">
          <div className="flex items-center gap-1">
            <User size={11} />
            <span className="truncate break-words w-full">{apt.employee}</span>
          </div>
        </div>
      )}
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

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
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
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin size={16} className="text-gray-400" />
            {appointment.employee}
            {appointment.channel ? ` · ${appointment.channel === 'online' ? 'Online' : 'Direct'}` : ''}
          </div>
          {appointment.notes && (
            <p className="rounded-lg bg-gray-50 p-3 text-gray-600">{appointment.notes}</p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground"
        >
          Close
        </button>
      </div>
    </div>
  );
}

const AgendaPage = () => {
  const [view, setView] = useState('week'); // day, week, month
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showNewRDV, setShowNewRDV] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<Appointment | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Load employee agendas and services for colors
  const [employeeAgendas, setEmployeeAgendas] = useState<Array<{id: number, name: string, color: string}>>([]);
  const [services, setServices] = useState<Array<{id: number, name: string, color: string}>>([]);
  const [displaySettings, setDisplaySettings] = useState<{showColorInRDV: boolean}>({ showColorInRDV: true });

  // Load settings and data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize currentDate
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setCurrentDate(today);

      // Load employee agendas
      const storedAgendas = localStorage.getItem('employeeAgendas');
      if (storedAgendas) {
        const agendas = JSON.parse(storedAgendas);
        setEmployeeAgendas(agendas.map((a: any) => ({ id: a.id, name: a.name, color: a.color })));
      }

      // Load services
      const storedServices = localStorage.getItem('services');
      if (storedServices) {
        const servicesData = JSON.parse(storedServices);
        setServices(servicesData.map((s: any) => ({ id: s.id, name: s.name, color: s.color })));
      }

      // Load display settings
      const storedSettings = localStorage.getItem('rdvDisplaySettings');
      if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        setDisplaySettings(settings);
      }
    }
  }, []);

  // Listen for sidebar filter changes and sidebar date changes
  useEffect(() => {
    const handleStatusFilter = (event: Event) => {
      const ev = event as CustomEvent<string>;
      setFilterStatus(ev.detail);
    };
    const handleSidebarDateChange = (event: Event) => {
      const ev = event as CustomEvent<string>;
      setCurrentDate(new Date(ev.detail));
    };
    window.addEventListener('statusFilterChange', handleStatusFilter as EventListener);
    window.addEventListener('sidebarDateChange', handleSidebarDateChange as EventListener);
    return () => {
      window.removeEventListener('statusFilterChange', handleStatusFilter as EventListener);
      window.removeEventListener('sidebarDateChange', handleSidebarDateChange as EventListener);
    };
  }, []);

  // Sample appointments data - normalize dates and load from localStorage
  const [appointments, setAppointments] = useState<Appointment[]>(sampleAppointments);

  // Hydrate appointments from localStorage after mount
  useEffect(() => {
    const stored = localStorage.getItem('appointments');
    if (stored) {
      try {
        if (legacyAppointmentPattern.test(stored)) {
          setAppointments(sampleAppointments);
          return;
        }
        const parsed = JSON.parse(stored) as Array<Omit<Appointment, 'date'> & { date: string }>;
        setAppointments(parsed.map(apt => ({
          ...apt,
          date: new Date(apt.date)
        })));
      } catch (e) {
        console.error('Error loading appointments:', e);
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

  // Dispatch event when main calendar date changes to sync sidebar
  useEffect(() => {
    if (currentDate) {
      window.dispatchEvent(new CustomEvent('mainCalendarDateChange', { detail: currentDate }));
    }
  }, [currentDate]);

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

  const goToToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setCurrentDate(today);
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('appointments');
    if (!stored || legacyAppointmentPattern.test(stored)) {
      setAppointments(sampleAppointments);
      localStorage.setItem('appointments', JSON.stringify(sampleAppointments));
    }
  }, []);

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
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>

      {/* Header - Ultra Minimalist Premium */}
      <div className="mb-8 animate-slideDown pt-20">
        <div className="flex items-center justify-between">
          {/* Left: Date & Time */}
          <div className="flex items-center gap-8">
            {/* Date Block */}
            <div className="flex items-baseline gap-3">
              <h1 className="text-5xl font-light text-gray-900 tracking-tight">
                {currentDate.getDate().toString().padStart(2, '0')}
              </h1>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-medium text-gray-900">
                  {currentDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                </span>
                <span className="text-xs text-gray-400">
                  {currentDate.getFullYear()}
                </span>
              </div>
              <div className="h-12 w-px bg-gray-200 mx-2"></div>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
                </span>
                <span className="text-xs text-gray-400">
                  Week {Math.ceil((currentDate.getDate() + new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()) / 7)}
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-1">
              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => navigateDate(-1)}
                className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => navigateDate(1)}
                className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-6">
            {/* View Toggle */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setView('day')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === 'day'
                    ? 'text-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Day
              </button>
              <span className="text-gray-300">/</span>
              <button
                onClick={() => setView('week')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === 'week'
                    ? 'text-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Week
              </button>
              <span className="text-gray-300">/</span>
              <button
                onClick={() => setView('month')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === 'month'
                    ? 'text-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Month
              </button>
            </div>

            <div className="h-8 w-px bg-gray-200"></div>

            {/* CTA */}
            <button
              onClick={() => setShowNewRDV(true)}
              className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-[var(--reserva-ink)] hover:text-white cursor-pointer transition-colors"
            >
              New
              <Plus size={16} className="inline-block ml-2 -mt-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Views */}
      <div key={refreshKey} className=" overflow-hidden animate-fadeIn">
        {view === 'week' && (
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-100 ">
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
                        className="absolute bottom-1 right-1 w-5 h-5 rounded-md bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-all z-10"
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
                        .map(apt => {
                          const employeeColor = employeeAgendas.find(e => e.name === apt.employee)?.color;
                          const serviceColor = services.find(s => s.name === apt.service)?.color;
                          return (
                            <AppointmentCard
                              key={apt.id}
                              apt={apt}
                              isCompact
                              onDragStart={handleDragStart}
                              onOpen={setSelectedAppointment}
                              employeeColor={employeeColor}
                              serviceColor={serviceColor}
                              showColorInRDV={displaySettings.showColorInRDV}
                            />
                          );
                        })
                      }
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'day' && (
          <div className="p-0">
            <div className="space-y-1">
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className="grid bg-white grid-cols-12 gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50/50 transition-colors group/time relative"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, time, currentDate)}
                >
                  <button
                    onClick={() => setShowNewRDV(true)}
                    className="absolute right-3 top-3 w-6 h-6 rounded-md bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 flex items-center justify-center opacity-0 group-hover/time:opacity-100 transition-all z-10"
                  >
                    <Plus size={14} />
                  </button>
                  <div className="col-span-2 text-xs font-light text-gray-400">
                    {time}
                  </div>
                  <div className="col-span-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {appointments
                      .filter(apt => {
                        // Normalize both dates for comparison
                        const aptDate = new Date(apt.date);
                        aptDate.setHours(0, 0, 0, 0);
                        const compareDate = new Date(currentDate);
                        compareDate.setHours(0, 0, 0, 0);

                        const matches = aptDate.getTime() === compareDate.getTime() &&
                          apt.time === time &&
                          (filterStatus === 'all' || apt.status === filterStatus);

                        return matches;
                      })
                      .map(apt => {
                        const employeeColor = employeeAgendas.find(e => e.name === apt.employee)?.color;
                        const serviceColor = services.find(s => s.name === apt.service)?.color;
                        return (
                          <AppointmentCard
                            key={apt.id}
                            apt={apt}
                            onDragStart={handleDragStart}
                            onOpen={setSelectedAppointment}
                            employeeColor={employeeColor}
                            serviceColor={serviceColor}
                            showColorInRDV={displaySettings.showColorInRDV}
                          />
                        );
                      })
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'month' && (
          <div className="bg-white rounded-lg border border-gray-100  overflow-hidden">
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
                    className="min-h-[140px] bg-gray-50/30 border-r border-b border-gray-100"
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
                    className={`min-h-[140px] border-r border-b border-gray-100 p-2 hover:bg-gray-50/50 transition-all group/date relative ${
                      isToday ? 'bg-gray-50/50' : 'bg-white'
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, dayAppointments.length > 0 ? dayAppointments[0].time : '09:00', date)}
                  >
                    <button
                      onClick={() => setShowNewRDV(true)}
                      className="absolute bottom-2 right-2 w-5 h-5 rounded-md bg-white border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 hover:border-gray-300 flex items-center justify-center opacity-0 group-hover/date:opacity-100 transition-all z-20 "
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
                      {dayAppointments.slice(0, 3).map(apt => {
                        const employeeColor = employeeAgendas.find(e => e.name === apt.employee)?.color;
                        const serviceColor = services.find(s => s.name === apt.service)?.color;
                        return (
                          <AppointmentCard
                            key={apt.id}
                            apt={apt}
                            isCompact
                            onDragStart={handleDragStart}
                            onOpen={setSelectedAppointment}
                            employeeColor={employeeColor}
                            serviceColor={serviceColor}
                            showColorInRDV={displaySettings.showColorInRDV}
                          />
                        );
                      })}
                      {/* More indicator */}
                      {dayAppointments.length > 3 && (
                        <div className="text-[10px] text-gray-500 font-medium px-1.5 py-1 hover:text-gray-900 transition-colors">
                          +{dayAppointments.length - 3} more
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
