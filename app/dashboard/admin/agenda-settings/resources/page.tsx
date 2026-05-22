'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Copy } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Sketch } from '@uiw/react-color';
import { Checkbox } from '@/components/ui/checkbox';
import DatePickerDemo from '@/components/ui/datepicker';
import { defaultAgendas, defaultWorkingHours } from '@/lib/mockData';

type WorkingHours = {
  day: string;
  isWorking: boolean;
  startTime: string;
  endTime: string;
  breaks: { start: string; end: string }[];
};

type EmployeeAgenda = {
  id: number;
  name: string;
  email: string;
  color: string;
  role: string;
  workingHours: WorkingHours[];
  timeSlotDuration: number;
  bufferTime: number;
  maxAppointmentsPerDay: number;
  allowOnlineBooking: boolean;
  services: string[];
  status: 'active' | 'inactive' | 'vacation';
};

const legacyAgendaPattern = /Samira|Yassine|Khalid|Nadia El Khatib|Hairdresser|Barber|Beautician|Massage|Manicure/i;

const GestionDesAgendas = () => {
  const [agendas, setAgendas] = useState<EmployeeAgenda[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState<EmployeeAgenda | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('employeeAgendas');
      if (stored) {
        if (legacyAgendaPattern.test(stored)) {
          setAgendas(defaultAgendas);
          localStorage.setItem('employeeAgendas', JSON.stringify(defaultAgendas));
        } else {
          setAgendas(JSON.parse(stored));
        }
      } else {
        setAgendas(defaultAgendas);
        localStorage.setItem('employeeAgendas', JSON.stringify(defaultAgendas));
      }
    }
  }, []);

  useEffect(() => {
    if (agendas.length > 0) {
      localStorage.setItem('employeeAgendas', JSON.stringify(agendas));
    }
  }, [agendas]);

  const handleDeleteAgenda = (id: number) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      setAgendas(agendas.filter(a => a.id !== id));
    }
  };

  const handleDuplicateAgenda = (agenda: EmployeeAgenda) => {
    setAgendas(prev => {
      const newAgenda = {
        ...agenda,
        id: Date.now(),
        name: `${agenda.name} (Copie)`,
        email: ''
      };
      return [...prev, newAgenda];
    });
  };

  const filteredAgendas = agendas.filter(agenda => {
    const matchesSearch = agenda.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agenda.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agenda.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || agenda.status === filterStatus;
    return matchesSearch && matchesStatus;
  });


  return (
    <div className="min-h-screen p-0 md:p-0 lg:p-0">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>

      {/* Header */}
      <div className="mb-8 animate-slideUp pt-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-2">
              Resources & capacity
            </h1>
            <p className="text-sm text-gray-500">
              Manage resources, capacity, availability, and reservation rules
            </p>
          </div>

          <button
            onClick={() => {
              setEditingAgenda(null);
              setShowModal(true);
            }}
            className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-[var(--reserva-ink)] hover:text-white cursor-pointer transition-colors "
          >
            <Plus size={16} className="inline-block mr-2 -mt-0.5" />
            New resource
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search une ressource..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-12 pr-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="px-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm bg-white w-[220px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
              <SelectItem value="vacation">En vacances</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Agendas List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
        {filteredAgendas.map(agenda => (
          <AgendaCard
            key={agenda.id}
            agenda={agenda}
            onEdit={() => {
              setEditingAgenda(agenda);
              setShowModal(true);
            }}
            onDelete={() => handleDeleteAgenda(agenda.id)}
            onDuplicate={() => handleDuplicateAgenda(agenda)}
          />
        ))}
      </div>

      {filteredAgendas.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 mb-4">No resource found</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('all');
            }}
            className="text-sm text-foreground hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <AgendaModal
          agenda={editingAgenda}
          onClose={() => {
            setShowModal(false);
            setEditingAgenda(null);
          }}
          onSave={(agenda) => {
            if (editingAgenda) {
              setAgendas(agendas.map(a => a.id === agenda.id ? agenda : a));
            } else {
              setAgendas([...agendas, { ...agenda, id: Date.now() }]);
            }
            setShowModal(false);
            setEditingAgenda(null);
          }}
        />
      )}
    </div>
  );
};

// Agenda Card Component
const AgendaCard = ({ agenda, onEdit, onDelete, onDuplicate }: {
  agenda: EmployeeAgenda;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) => {
  const workingDays = agenda.workingHours.filter(h => h.isWorking);
  const totalHoursPerWeek = workingDays.reduce((sum, day) => {
    const start = parseInt(day.startTime.split(':')[0]);
    const end = parseInt(day.endTime.split(':')[0]);
    const breakTime = day.breaks.reduce((breakSum, b) => {
      const bStart = parseInt(b.start.split(':')[0]);
      const bEnd = parseInt(b.end.split(':')[0]);
      return breakSum + (bEnd - bStart);
    }, 0);
    return sum + (end - start - breakTime);
  }, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'inactive': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'vacation': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'vacation': return 'En vacances';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6  transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: agenda.color }}
          >
            <span className="text-white font-semibold text-lg">
              {agenda.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{agenda.name}</h3>
            <p className="text-sm text-gray-500">{agenda.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onDuplicate}
            className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
            title="Dupliquer"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(agenda.status)}`}>
          {getStatusText(agenda.status)}
        </span>
        {agenda.allowOnlineBooking && (
          <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium">
            Reservation en ligne
          </span>
        )}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Working days</p>
          <p className="text-sm font-medium text-gray-900">{workingDays.length} days/week</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Hours/week</p>
          <p className="text-sm font-medium text-gray-900">{totalHoursPerWeek}h</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Time slots</p>
          <p className="text-sm font-medium text-gray-900">{agenda.timeSlotDuration} min</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Reservations max/jour</p>
          <p className="text-sm font-medium text-gray-900">{agenda.maxAppointmentsPerDay}</p>
        </div>
      </div>

      {/* Working Days */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Days de travail</p>
        <div className="flex flex-wrap gap-2">
          {agenda.workingHours.map((day, idx) => (
            <div
              key={idx}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                day.isWorking
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-gray-50 text-gray-400 border border-gray-200'
              }`}
            >
              {day.day.substring(0, 3)}
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      {agenda.services.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">{agenda.services.length} offres</p>
          <div className="flex flex-wrap gap-1">
            {agenda.services.slice(0, 3).map((service, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs"
              >
                {service}
              </span>
            ))}
            {agenda.services.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                +{agenda.services.length - 3}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Agenda Modal Component
const AgendaModal = ({ agenda, onClose, onSave }: {
  agenda: EmployeeAgenda | null;
  onClose: () => void;
  onSave: (agenda: EmployeeAgenda) => void;
}) => {
  const [formData, setFormData] = useState<EmployeeAgenda>(
    agenda || {
      id: 0,
      name: '',
      email: '',
      color: '#3B82F6',
      role: '',
      workingHours: defaultWorkingHours,
      timeSlotDuration: 30,
      bufferTime: 5,
      maxAppointmentsPerDay: 12,
      allowOnlineBooking: true,
      services: [],
      status: 'active'
    }
  );

  const [activeTab, setActiveTab] = useState<'info' | 'hours' | 'settings'>('info');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(formData);
  };

  const updateWorkingHours = (dayIndex: number, updates: Partial<WorkingHours>) => {
    const newHours = [...formData.workingHours];
    newHours[dayIndex] = { ...newHours[dayIndex], ...updates };
    setFormData({ ...formData, workingHours: newHours });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <style>{`
        input[type=number].no-arrows {
          appearance: textfield;
        }
        input[type=number].no-arrows::-webkit-inner-spin-button,
        input[type=number].no-arrows::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number].no-arrows {
          -moz-appearance: textfield;
        }
      `}</style>
      <div className="bg-white rounded-2xl  max-w-4xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-light text-gray-900">
              {agenda ? 'Edit resource' : 'New resource'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors border ${
                activeTab === 'info'
                  ? 'bg-primary text-primary-foreground border-primary shadow'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              Informations
            </button>
            <button
              onClick={() => setActiveTab('hours')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors border ${
                activeTab === 'hours'
                  ? 'bg-primary text-primary-foreground border-primary shadow'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              Horaires
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors border ${
                activeTab === 'settings'
                  ? 'bg-primary text-primary-foreground border-primary shadow'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Ex: Tueie Dupont"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="marie.dupont@wellbe.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Ex: Coiffeur Senior"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleur
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="flex items-center gap-3 px-3 py-2.5 border border-gray-200 rounded-full hover:border-gray-300 transition-colors"
                    >
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-200 "
                        style={{ backgroundColor: formData.color }}
                      />
                      <span className="text-sm text-gray-700 font-mono">{formData.color}</span>
                    </button>
                    {showColorPicker && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowColorPicker(false)}
                        />
                        <div className="absolute top-full mt-2 z-20 bg-white rounded-lg  border border-gray-200 p-4">
                          <Sketch
                            color={formData.color}
                            onChange={(color) => {
                              setFormData({ ...formData, color: color.hex });
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v as 'active' | 'inactive' | 'vacation' })}>
                    <SelectTrigger className="w-full px-4 py-2.5 rounded-full bg-white border border-gray-200 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                      <SelectItem value="vacation">En vacances</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Hours Tab */}
          {activeTab === 'hours' && (
            <div className="space-y-4">
              {formData.workingHours.map((day, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={`isWorking-${idx}`}
                        checked={day.isWorking}
                        onCheckedChange={(checked) => updateWorkingHours(idx, { isWorking: !!checked })}
                        className="w-4 h-4 rounded-full text-foreground border-gray-300 focus:ring-gray-900"
                      />
                      <span className="font-medium text-gray-900">{day.day}</span>
                    </div>
                  </div>

                  {day.isWorking && (
                    <div className="grid grid-cols-2 gap-3 ml-7">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Start</label>
                        <DatePickerDemo
                          value={day.startTime}
                          onChange={(val: string) => updateWorkingHours(idx, { startTime: val })}
                          id={`startTime-${idx}`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Fin</label>
                        <DatePickerDemo
                          value={day.endTime}
                          onChange={(val: string) => updateWorkingHours(idx, { endTime: val })}
                          id={`endTime-${idx}`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time slot duration (min)
                  </label>
                  <input
                    type="number"
                    value={formData.timeSlotDuration}
                    onChange={(e) => setFormData({ ...formData, timeSlotDuration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                    min={5}
                    step={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temps tampon (min)
                  </label>
                  <input
                    type="number"
                    value={formData.bufferTime}
                    onChange={(e) => setFormData({ ...formData, bufferTime: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                    min={0}
                    step={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reservations max/jour
                  </label>
                  <input
                    type="number"
                    value={formData.maxAppointmentsPerDay}
                    onChange={(e) => setFormData({ ...formData, maxAppointmentsPerDay: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                    min={1}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="allowOnlineBooking"
                  checked={formData.allowOnlineBooking}
                  onCheckedChange={(checked) => setFormData({ ...formData, allowOnlineBooking: !!checked })}
                  className="w-4 h-4 rounded-full text-foreground border-gray-300 focus:ring-gray-900"
                />
                <label htmlFor="allowOnlineBooking" className="text-sm text-gray-700">
                  Autoriser la reservation en ligne
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-4 rounded-b-2xl flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-[var(--reserva-ink)] hover:text-white cursor-pointer transition-colors"
          >
            {agenda ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GestionDesAgendas;
