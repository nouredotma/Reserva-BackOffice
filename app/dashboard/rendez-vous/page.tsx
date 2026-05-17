'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, X, ChevronLeft, ChevronRight, MoreVertical, Plus, CalendarIcon, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
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

// New types to clarify props and state
type Appointment = {
  id: number;
  clientName: string;
  service: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled' | string;
  employee: string;
  phone?: string;
  email?: string;
  date: Date;
  notes?: string;
};

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status?: string;
  address?: string;
};

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
  const [clients] = useState<Client[]>(() => {
    try {
      if (typeof window === 'undefined') return [];
      const stored = localStorage.getItem('clients');
      return stored ? (JSON.parse(stored) as Client[]) : [];
    } catch {
      return [];
    }
  });
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
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!selectedClient && !isNewClient) {
      alert('Veuillez sélectionner ou créer un client');
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
    <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 z-40">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light text-gray-900">Nouveau rendez-vous</h2>
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
            <Label htmlFor="clientSearch">Rechercher un client</Label>
            <div className="relative">
              <Input 
                id="clientSearch"
                type="text"
                value={clientSearch}
                onChange={(e) => handleClientSearchChange(e.target.value)}
                placeholder="Taper le nom, email ou téléphone..."
                className="rounded-full px-4 py-2 mt-2"
              />
              
              {/* Dropdown with filtered clients */}
              {clientSearch && !selectedClient && (
                <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                      <p className="text-sm text-gray-500 mb-3">Aucun client trouvé</p>
                      <button
                        type="button"
                        onClick={() => window.location.href = '/dashboard/clients/gestion'}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors"
                      >
                        <Plus size={14} />
                        Ajouter un nouveau client
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
                <Label htmlFor="phone">Téléphone</Label>
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
              <SelectTrigger id="service" className="rounded-full px-4 py-2 mt-2">
                <SelectValue placeholder="Sélectionner un service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Coiffeur">Coiffeur</SelectItem>
                <SelectItem value="Spa">Spa</SelectItem>
                <SelectItem value="Massage">Massage</SelectItem>
                <SelectItem value="Manucure">Manucure</SelectItem>
                <SelectItem value="Soins du visage">Soins du visage</SelectItem>
                <SelectItem value="Consultation">Consultation</SelectItem>
                <SelectItem value="Suivi">Suivi</SelectItem>
                <SelectItem value="Thérapie">Thérapie</SelectItem>
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
                    {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="mb-2">Heure</Label>
              <div className='mt-2'>
                <DatePickerDemo  value={time} onChange={setTime} id="rdv-time-picker" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Durée</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration" className="rounded-full px-4 py-2 mt-2">
                  <SelectValue placeholder="Sélectionner la durée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                  <SelectItem value="90">90 min</SelectItem>
                  <SelectItem value="120">120 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Employee */}
        <div className="space-y-4">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Praticien</h3>
          <Select value={employee} onValueChange={setEmployee}>
            <SelectTrigger className="rounded-full px-4 py-2 border-gray-200 focus:ring-2 focus:ring-gray-900">
              <SelectValue placeholder="Sélectionner un praticien" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yassine El Fassi">Yassine El Fassi</SelectItem>
              <SelectItem value="Samira Bouzid">Samira Bouzid</SelectItem>
              <SelectItem value="Khalid Ait Lahcen">Khalid Ait Lahcen</SelectItem>
              <SelectItem value="Nadia El Khatib">Nadia El Khatib</SelectItem>
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
            placeholder="Ajouter des notes..."
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
          className="flex-1 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
        >
          Créer
        </button>
      </div>
    </div>
  </div>
);
}

interface AppointmentCardProps {
  apt: Appointment;
  isCompact?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, appointment: Appointment) => void;
  employeeColor?: string;
  serviceColor?: string;
  showColorInRDV?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  apt, 
  isCompact = false, 
  onDragStart,
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
        case 'cancelled': return 'bg-gray-50 border-gray-200 text-gray-500';
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

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, apt)}
      className={`${getStatusBg(apt.status)} rounded-lg p-3 cursor-move hover:shadow-md transition-all border ${
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
      <div className="flex items-center gap-1.5 text-xs opacity-60">
        <Clock size={11} />
        <span>{apt.time} · {apt.duration}min</span>
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

const RendezVousPage = () => {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState('week'); // day, week, month
  const [currentDate, setCurrentDate] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNewRDV, setShowNewRDV] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<Appointment | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Load employee agendas and services for colors
  const [employeeAgendas, setEmployeeAgendas] = useState<Array<{id: number, name: string, color: string}>>([]);
  const [services, setServices] = useState<Array<{id: number, name: string, color: string}>>([]);
  const [displaySettings, setDisplaySettings] = useState<{showColorInRDV: boolean}>({ showColorInRDV: true });

  // Load settings and data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    const handleEmployeeFilter = (event: Event) => {
      const ev = event as CustomEvent<string>;
      setSelectedEmployee(ev.detail);
    };
    const handleStatusFilter = (event: Event) => {
      const ev = event as CustomEvent<string>;
      setFilterStatus(ev.detail);
    };
    const handleSidebarDateChange = (event: Event) => {
      const ev = event as CustomEvent<string>;
      setCurrentDate(new Date(ev.detail));
    };
    window.addEventListener('employeeFilterChange', handleEmployeeFilter as EventListener);
    window.addEventListener('statusFilterChange', handleStatusFilter as EventListener);
    window.addEventListener('sidebarDateChange', handleSidebarDateChange as EventListener);
    return () => {
      window.removeEventListener('employeeFilterChange', handleEmployeeFilter as EventListener);
      window.removeEventListener('statusFilterChange', handleStatusFilter as EventListener);
      window.removeEventListener('sidebarDateChange', handleSidebarDateChange as EventListener);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearTimeout(t);
      clearInterval(timer);
    };
  }, []);

  // Sample appointments data - normalize dates and load from localStorage
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const normalizeDate = (year: number, month: number, day: number) => {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      return date;
    };
    
    // Try to load from localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('appointments');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Array<Omit<Appointment, 'date'> & { date: string }>;
          // Convert date strings back to Date objects
          return parsed.map(apt => ({
            ...apt,
            date: new Date(apt.date)
          }));
        } catch (e) {
          console.error('Error loading appointments:', e);
        }
      }
    }
    
    // Default appointments if nothing in localStorage
    return [
      {
        id: 1,
        clientName: 'Fatima Zahra El Amrani',
        service: 'Consultation',
        time: '09:00',
        duration: 60,
        status: 'confirmed',
        employee: 'Yassine El Fassi',
        phone: '+212 6 12 34 56 78',
        email: 'fatima.zahra@email.com',
        date: normalizeDate(2025, 10, 10),
        notes: 'Première consultation'
      },
      {
        id: 2,
        clientName: 'Mohamed Benali',
        service: 'Suivi',
        time: '11:00',
        duration: 45,
        status: 'pending',
        employee: 'Samira Bouzid',
        phone: '+212 6 98 76 54 32',
        email: 'mohamed.benali@email.com',
        date: normalizeDate(2025, 10, 11),
        notes: ''
      },
      {
        id: 3,
        clientName: 'Imane El Idrissi',
        service: 'Thérapie',
        time: '14:00',
        duration: 90,
        status: 'confirmed',
        employee: 'Khalid Ait Lahcen',
        phone: '+212 6 11 22 33 44',
        email: 'imane.idrissi@email.com',
        date: normalizeDate(2025, 10, 12),
        notes: 'Session régulière'
      },
      {
        id: 4,
        clientName: 'Rachid El Mansouri',
        service: 'Consultation',
        time: '16:00',
        duration: 60,
        status: 'cancelled',
        employee: 'Nadia El Khatib',
        phone: '+212 6 55 66 77 88',
        email: 'rachid.elmansouri@email.com',
        date: normalizeDate(2025, 10, 13),
        notes: 'Annulé par le client'
      },
      {
        id: 5,
        clientName: 'Sara El Baraka',
        service: 'Massage',
        time: '10:00',
        duration: 60,
        status: 'confirmed',
        employee: 'Yassine El Fassi',
        phone: '+212 6 77 88 99 00',
        email: 'sara.elbaraka@email.com',
        date: normalizeDate(2025, 10, 14),
        notes: 'Massage relaxant'
      },
      {
        id: 6,
        clientName: 'Omar El Haddad',
        service: 'Manucure',
        time: '15:00',
        duration: 45,
        status: 'pending',
        employee: 'Samira Bouzid',
        phone: '+212 6 22 33 44 55',
        email: 'omar.elhaddad@email.com',
        date: normalizeDate(2025, 10, 15),
        notes: 'Première manucure'
      }
    ];
  });

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
    if (mounted) {
      window.dispatchEvent(new CustomEvent('mainCalendarDateChange', { detail: currentDate }));
    }
  }, [currentDate, mounted]);

  const timeSlots = Array.from({ length: 15 }, (_, i) => `${(i + 9).toString().padStart(2, '0')}:00`);

  // Get week days - normalized
  const getWeekDays = () => {
    const start = new Date(currentDate);
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
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
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
    const newDate = new Date(currentDate);
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
    // Ensure sample appointments exist in localStorage without deleting user's data
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('appointments');
    if (!stored) {
      const moroccanAppointments = [
        {
          id: 1,
          clientName: 'Fatima Zahra El Amrani',
          service: 'Consultation',
          time: '09:00',
          phone: '+212 6 98 76 54 32',
          email: 'mohamed.benali@email.com',
          date: new Date(2025, 10, 11),
          notes: ''
        },
        {
          id: 2,
          clientName: 'Mohamed Benali',
          service: 'Suivi',
          time: '11:00',
          duration: 45,
          status: 'pending',
          employee: 'Samira Bouzid',
          phone: '+212 6 98 76 54 32',
          email: 'mohamed.benali@email.com',
          date: new Date(2025, 10, 11),
          notes: ''
        },
        {
          id: 3,
          clientName: 'Imane El Idrissi',
          service: 'Thérapie',
          time: '14:00',
          duration: 90,
          status: 'confirmed',
          employee: 'Khalid Ait Lahcen',
          phone: '+212 6 11 22 33 44',
          email: 'imane.idrissi@email.com',
          date: new Date(2025, 10, 12),
          notes: 'Session régulière'
        },
        {
          id: 4,
          clientName: 'Rachid El Mansouri',
          service: 'Consultation',
          time: '16:00',
          duration: 60,
          status: 'cancelled',
          employee: 'Nadia El Khatib',
          phone: '+212 6 55 66 77 88',
          email: 'rachid.elmansouri@email.com',
          date: new Date(2025, 10, 13),
          notes: 'Annulé par le client'
        },
        {
          id: 5,
          clientName: 'Sara El Baraka',
          service: 'Massage',
          time: '10:00',
          status: 'confirmed',
          employee: 'Yassine El Fassi',
          phone: '+212 6 77 88 99 00',
          email: 'sara.elbaraka@email.com',
          date: new Date(2025, 10, 14),
          notes: 'Massage relaxant'
        },
        {
          id: 6,
          clientName: 'Omar El Haddad',
          service: 'Manucure',
          time: '15:00',
          duration: 45,
          status: 'pending',
          employee: 'Samira Bouzid',
          phone: '+212 6 22 33 44 55',
          email: 'omar.elhaddad@email.com',
          date: new Date(2025, 10, 15),
          notes: 'Première manucure'
        }
      ];
      localStorage.setItem('appointments', JSON.stringify(moroccanAppointments));
    }
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-12 rounded-xl w-1/3"></div>
          <div className="bg-gray-200 h-96 rounded-2xl"></div>
        </div>
      </div>
    );
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
                  {currentDate.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}
                </span>
                <span className="text-xs text-gray-400">
                  {currentDate.getFullYear()}
                </span>
              </div>
              <div className="h-12 w-px bg-gray-200 mx-2"></div>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {currentDate.toLocaleDateString('fr-FR', { weekday: 'long' })}
                </span>
                <span className="text-xs text-gray-400">
                  Semaine {Math.ceil((currentDate.getDate() + new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()) / 7)}
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-1">
              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Aujourd&apos;hui
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
            {/* Live Time */}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-light text-gray-900 tabular-nums tracking-tight">
                {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-xs text-gray-400 tabular-nums">
                :{currentTime.toLocaleTimeString('fr-FR', { second: '2-digit' })}
              </span>
            </div>

            <div className="h-8 w-px bg-gray-200"></div>

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
                Jour
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
                Semaine
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
                Mois
              </button>
            </div>

            <div className="h-8 w-px bg-gray-200"></div>

            {/* CTA */}
            <button
              onClick={() => setShowNewRDV(true)}
              className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
            >
              Nouveau
              <Plus size={16} className="inline-block ml-2 -mt-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Views */}
      <div key={refreshKey} className=" overflow-hidden animate-fadeIn">
        {view === 'week' && (
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="min-w-[1000px]">
              {/* Header */}
              <div className="grid grid-cols-8 border-b border-gray-100">
                <div className="p-4 border-r border-gray-100"></div>
                {getWeekDays().map((date, i) => {
                  const isToday = date.toDateString() === new Date().toDateString();
                  return (
                    <div key={i} className="p-4 text-center border-r border-gray-100 last:border-r-0">
                      <div className={`text-xs font-medium uppercase tracking-wider mb-2 ${isToday ? 'text-gray-900' : 'text-gray-400'}`}>
                        {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
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
                            (selectedEmployee === 'all' || apt.employee === selectedEmployee) &&
                            (filterStatus === 'all' || apt.status === filterStatus);
                          
                          // Debug logging for this specific time slot
                          if (time === '09:00' && date.getDate() === 11) {
                            console.log(`Week filter - ${time} on ${date.getDate()}:`, {
                              aptName: apt.clientName,
                              aptTime: apt.time,
                              aptDate: aptDate.getTime(),
                              compareDate: compareDate.getTime(),
                              matches
                            });
                          }
                          
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
                          (selectedEmployee === 'all' || apt.employee === selectedEmployee) &&
                          (filterStatus === 'all' || apt.status === filterStatus);
                        
                        // Debug logging
                        if (time === '09:00') {
                          console.log(`Day filter - ${time}:`, {
                            aptName: apt.clientName,
                            aptTime: apt.time,
                            aptDate: aptDate.getTime(),
                            compareDate: compareDate.getTime(),
                            currentDate: currentDate.toString(),
                            matches
                          });
                        }
                        
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
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            {/* Month Header */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
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
                    (selectedEmployee === 'all' || apt.employee === selectedEmployee) &&
                    (filterStatus === 'all' || apt.status === filterStatus);
                });
                const confirmedCount = dayAppointments.filter(apt => apt.status === 'confirmed').length;
                const pendingCount = dayAppointments.filter(apt => apt.status === 'pending').length;
                const cancelledCount = dayAppointments.filter(apt => apt.status === 'cancelled').length;
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
                      className="absolute bottom-2 right-2 w-5 h-5 rounded-md bg-white border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 hover:border-gray-300 flex items-center justify-center opacity-0 group-hover/date:opacity-100 transition-all z-20 shadow-sm"
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
                            employeeColor={employeeColor}
                            serviceColor={serviceColor}
                            showColorInRDV={displaySettings.showColorInRDV}
                          />
                        );
                      })}
                      {/* More indicator */}
                      {dayAppointments.length > 3 && (
                        <div className="text-[10px] text-gray-500 font-medium px-1.5 py-1 hover:text-gray-900 transition-colors">
                          +{dayAppointments.length - 3} autre{dayAppointments.length - 3 > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>

                    {/* Status Summary (on hover) */}
                    {dayAppointments.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 text-[9px] font-medium">
                          {confirmedCount > 0 && (
                            <div className="flex items-center gap-1 text-emerald-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                              <span>{confirmedCount}</span>
                            </div>
                          )}
                          {pendingCount > 0 && (
                            <div className="flex items-center gap-1 text-amber-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                              <span>{pendingCount}</span>
                            </div>
                          )}
                          {cancelledCount > 0 && (
                            <div className="flex items-center gap-1 text-gray-500">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                              <span>{cancelledCount}</span>
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

      {showNewRDV && (
        <NewAppointmentModal 
          onClose={() => setShowNewRDV(false)} 
          onCreateAppointment={(newAppointment) => {
            console.log('=== Creating New Appointment ===');
            console.log('Raw appointment:', newAppointment);
            console.log('Date object:', newAppointment.date);
            console.log('Date ISO:', newAppointment.date.toISOString());
            console.log('Date toString:', newAppointment.date.toString());
            console.log('Date getTime:', newAppointment.date.getTime());
            
            // Log all existing appointments for comparison
            console.log('=== Existing Appointments ===');
            appointments.forEach(apt => {
              console.log(`${apt.clientName}: ${apt.date.toISOString()} (${apt.date.getTime()})`);
            });
            
            const updatedAppointments = [...appointments, newAppointment];
            setAppointments(updatedAppointments);
            
            // Force refresh
            setRefreshKey(prev => prev + 1);
            
            console.log('=== Updated Appointments ===');
            console.log('Total appointments:', updatedAppointments.length);
          }}
        />
      )}
    </div>
  );
};

export default RendezVousPage;
