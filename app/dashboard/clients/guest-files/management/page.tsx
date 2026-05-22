// filepath: /Users/x/Desktop/WbePro/wbepro/app/dashboard/clients/gestion/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, X, Phone, Mail, User as UserIcon, MapPin, Calendar, MoreVertical, ChevronDown, Filter } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { sampleClients } from '@/lib/mockData';

interface Appointment {
  id: number;
  clientName: string;
  service: string;
  time: string;
  duration: number;
  status: string;
  employee: string;
  phone: string;
  email: string;
  date: Date;
  notes?: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  lastVisit?: Date;
  lastVisitTime?: string;
  nextAppointment?: Date;
  nextAppointmentTime?: string;
  totalVisits?: number;
  status: 'Active' | 'Inactive';
  notes?: string;
}

export default function ClientsGestionPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [editingAppointment, setEditingAppointment] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'Active' as 'Active' | 'Inactive',
    notes: ''
  });

  // Function to sync clients with appointments from rendez-vous page
  const syncClientsWithAppointments = (clientsList: Client[]) => {
    const storedAppointments = localStorage.getItem('appointments');
    if (storedAppointments) {
      try {
        const appointments: Appointment[] = JSON.parse(storedAppointments);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const updatedClients = clientsList.map(client => {
          // Find appointments for this client by name, email, or phone
          const clientAppointments = appointments.filter((apt: Appointment) =>
            apt.clientName === client.name ||
            apt.email === client.email ||
            apt.phone === client.phone
          );

          if (clientAppointments.length > 0) {
            // Find next upcoming appointment
            const upcomingAppointments = clientAppointments
              .filter((apt: Appointment) => new Date(apt.date) >= now)
              .sort((a: Appointment, b: Appointment) => new Date(a.date).getTime() - new Date(b.date).getTime());

            // Find last visit (past appointments)
            const pastAppointments = clientAppointments
              .filter((apt: Appointment) => new Date(apt.date) < now)
              .sort((a: Appointment, b: Appointment) => new Date(b.date).getTime() - new Date(a.date).getTime());

            return {
              ...client,
              nextAppointment: upcomingAppointments.length > 0 ? new Date(upcomingAppointments[0].date) : undefined,
              nextAppointmentTime: upcomingAppointments.length > 0 ? upcomingAppointments[0].time : undefined,
              lastVisit: pastAppointments.length > 0 ? new Date(pastAppointments[0].date) : client.lastVisit,
              lastVisitTime: pastAppointments.length > 0 ? pastAppointments[0].time : client.lastVisitTime,
              totalVisits: clientAppointments.length
            };
          }
          return client;
        });

        setClients(updatedClients);
        localStorage.setItem('clients', JSON.stringify(updatedClients));
      } catch (error) {
        console.error('Error syncing appointments:', error);
        setClients(clientsList);
      }
    } else {
      setClients(clientsList);
    }
  };

  // Load clients from localStorage on client only
  useEffect(() => {
    const storedClients = localStorage.getItem('clients');
    if (storedClients && JSON.parse(storedClients).length > 0) {
      const parsedClients = JSON.parse(storedClients);
      // Sync with appointments from rendez-vous page
      setTimeout(() => {
        syncClientsWithAppointments(parsedClients);
      }, 0);
    } else {
      localStorage.setItem('clients', JSON.stringify(sampleClients));
      setTimeout(() => setClients(sampleClients), 0);
    }
  }, []);

  // Listen for appointment changes and sync
  useEffect(() => {
    const handleStorageChange = () => {
      const storedClients = localStorage.getItem('clients');
      if (storedClients) {
        const parsedClients = JSON.parse(storedClients);
        syncClientsWithAppointments(parsedClients);
      }
    };

    // Listen for custom event when appointments are updated
    window.addEventListener('appointmentsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('appointmentsUpdated', handleStorageChange);
    };
  }, []);

  const saveClients = (updatedClients: Client[]) => {
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setFormData({ name: '', email: '', phone: '', address: '', status: 'Active', notes: '' });
    setShowModal(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address || '',
      status: client.status,
      notes: client.notes || ''
    });
    setShowModal(true);
  };

  const handleDeleteClient = (id: string) => {
    if (confirm('Are you sure you want to delete this guest?')) {
      const updatedClients = clients.filter(c => c.id !== id);
      saveClients(updatedClients);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      const updatedClients = clients.map(c =>
        c.id === editingClient.id ? {
          ...editingClient,
          ...formData,
          lastVisit: editingClient.lastVisit,
          nextAppointment: editingClient.nextAppointment,
          totalVisits: editingClient.totalVisits
        } : c
      );
      saveClients(updatedClients);
    } else {
      // Always persist new client in localStorage
      const storedClients = localStorage.getItem('clients');
      const currentClients: Client[] = storedClients ? JSON.parse(storedClients) : [];
      const newId = (currentClients.length > 0 ? (parseInt(currentClients[currentClients.length - 1].id) + 1).toString() : '1');
      const newClient: Client = {
        id: newId,
        ...formData,
        totalVisits: 0
      };
      const updatedClients = [...currentClients, newClient];
      saveClients(updatedClients);
    }
    setShowModal(false);
  };

  const handleUpdateAppointment = (clientId: string, newDate: string) => {
    const updatedClients = clients.map(c =>
      c.id === clientId ? { ...c, nextAppointment: newDate ? new Date(newDate) : undefined } : c
    );
    saveClients(updatedClients);
    setEditingAppointment(null);
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>

      {/* Header */}
      <div className="mb-8 pt-20 animate-slideUp">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-4">
            <h1 className="text-5xl font-light text-gray-900 tracking-tight">Guest profiles</h1>
            <span className="text-sm text-gray-400 mt-4">
              {filteredClients.length} {filteredClients.length === 1 ? 'guest' : 'guests'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === 'grid' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Grille
              </button>
              <span className="text-gray-300">/</span>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === 'list' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                List
              </button>
            </div>

            <div className="h-8 w-px bg-gray-200"></div>

            {/* New Client Button */}
            <button
              onClick={handleAddClient}
              className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-[var(--reserva-ink)] hover:text-white cursor-pointer transition-colors flex items-center gap-2"
            >
              New
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search for a guest..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                statusFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('Active')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                statusFilter === 'Active' ? 'bg-primary text-primary-foreground' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Actifs
            </button>
            <button
              onClick={() => setStatusFilter('Inactive')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                statusFilter === 'Inactive' ? 'bg-primary text-primary-foreground' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Inactifs
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-lg border border-gray-100 p-6  hover:border-gray-200 transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {client.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{client.name}</h3>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium mt-1 ${
                      client.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {client.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditClient(client)}
                    className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2.5 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} className="text-gray-400" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} className="text-gray-400" />
                  <span>{client.phone}</span>
                </div>
                {client.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="truncate">{client.address}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400">Next reservation</span>
                  <span className="text-gray-400">{client.totalVisits || 0} reservations</span>
                </div>
                {editingAppointment === client.id ? (
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 px-2 py-1 text-xs rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
                        >
                          {client.nextAppointment
                            ? format(new Date(client.nextAppointment), 'PPP', { locale: enUS })
                            : 'Choose a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={client.nextAppointment ? new Date(client.nextAppointment) : undefined}
                          onSelect={(date) => {
                            handleUpdateAppointment(client.id, date ? date.toISOString().slice(0, 16) : '');
                          }}
                          locale={enUS}
                        />
                      </PopoverContent>
                    </Popover>
                    <button
                      onClick={() => setEditingAppointment(null)}
                      className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                      title="Annuler"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Calendar size={12} />
                      <span className="text-xs">
                        {client.nextAppointment
                          ? `${new Date(client.nextAppointment).toLocaleDateString('en-US', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}${client.nextAppointmentTime ? ` at ${client.nextAppointmentTime}` : ''}`
                          : 'Not scheduled'}
                      </span>
                    </div>
                    <button
                      onClick={() => setEditingAppointment(client.id)}
                      className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                      title="Edit reservation"
                    >
                      <Pencil size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg border border-gray-100  overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Guest</th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Contact</th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">Address</th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">Next reservation</th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Visites</th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3 min-w-[160px]">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-medium text-sm">
                            {client.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="font-medium text-gray-900 truncate">{client.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1 min-w-[180px]">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={12} className="text-gray-400 flex-shrink-0" />
                          <span className="truncate">{client.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={12} className="text-gray-400 flex-shrink-0" />
                          <span className="whitespace-nowrap">{client.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 hidden xl:table-cell">
                      {client.address ? (
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                          <span className="truncate">{client.address}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap hidden lg:table-cell">
                      {editingAppointment === client.id ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="px-2 py-1 text-xs rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
                            >
                              {client.nextAppointment
                                ? format(new Date(client.nextAppointment), 'PPP', { locale: enUS })
                                : 'Choose a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={client.nextAppointment ? new Date(client.nextAppointment) : undefined}
                              onSelect={(date) => {
                                handleUpdateAppointment(client.id, date ? date.toISOString().slice(0, 16) : '');
                              }}
                              locale={enUS}
                            />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>
                            {client.nextAppointment
                              ? `${new Date(client.nextAppointment).toLocaleDateString('en-US', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}${client.nextAppointmentTime ? ` at ${client.nextAppointmentTime}` : ''}`
                              : 'Not scheduled'}
                          </span>
                          <button
                            onClick={() => setEditingAppointment(client.id)}
                            className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                            title="Edit reservation"
                          >
                            <Pencil size={12} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap hidden md:table-cell">
                      {client.totalVisits || 0}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        client.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditClient(client)}
                          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-100 p-12 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <UserIcon size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No guest found</h3>
          <p className="text-gray-500 text-sm mb-6">
            {searchTerm ? 'Essayez de modifier votre recherche' : 'Commencez par ajouter votre premier guest'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAddClient}
              className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Add guest
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-lg  max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-gray-900">
                  {editingClient ? 'Edit guest' : 'New guest'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-6">
              <div className="space-y-6">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Informations personnelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name complet
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                        placeholder="Sophie Tuetin"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                        placeholder="+33 6 12 34 56 78"
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                        placeholder="sophie.martin@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <input
                        id="address"
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                        placeholder="15 Rue de la Paix, Paris"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-4">
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Status</h3>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'Active' })}
                      className={`flex-1 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                        formData.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-300'
                          : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Actif
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'Inactive' })}
                      className={`flex-1 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                        formData.status === 'Inactive'
                          ? 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                          : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Inactif
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-4">
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Notes</h3>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    placeholder="Add des notes sur cet guest..."
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="sticky bottom-0 bg-white border-t border-gray-100 -mx-8 px-8 py-4 mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-[var(--reserva-ink)] hover:text-white cursor-pointer transition-colors"
                >
                  {editingClient ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
