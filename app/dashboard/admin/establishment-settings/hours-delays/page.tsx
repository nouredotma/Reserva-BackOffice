'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DatePickerDemo from '@/components/ui/datepicker';

type DaySchedule = {
  day: string;
  dayShort: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breaks: Array<{ start: string; end: string }>;
};

type ExceptionalSchedule = {
  id: number;
  date: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  reason?: string;
};

// Move ExceptionalEditModal outside the main component to avoid re-creation
const ExceptionalEditModal: React.FC<{ schedule: ExceptionalSchedule, onClose: () => void, onSave: (s: ExceptionalSchedule) => void }> = ({ schedule, onClose, onSave }) => {
  const [date, setDate] = useState(schedule.date);
  const [isOpen, setIsOpen] = useState(schedule.isOpen);
  const [openTime, setOpenTime] = useState(schedule.openTime || '10:00');
  const [closeTime, setCloseTime] = useState(schedule.closeTime || '20:00');
  const [reason, setReason] = useState(schedule.reason || '');

  useEffect(() => {
    setDate(schedule.date);
    setIsOpen(schedule.isOpen);
    setOpenTime(schedule.openTime || '10:00');
    setCloseTime(schedule.closeTime || '20:00');
    setReason(schedule.reason || '');
  }, [schedule]);

  const handleSubmit = () => {
    onSave({ ...schedule, date, isOpen, openTime, closeTime, reason });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-lg  max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 z-40 flex items-center justify-between">
          <h2 className="text-lg font-light text-gray-900">Edit horaire exceptionnel</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-6 space-y-6">
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="rounded-full" />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={isOpen ? 'open' : 'closed'} onValueChange={v => setIsOpen(v === 'open')}>
              <SelectTrigger className="rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Ouvert</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isOpen && (
            <div className="flex items-center gap-3">
              <Label>De</Label>
              <DatePickerDemo value={openTime} onChange={setOpenTime} />
              <span className="text-gray-400">to</span>
              <DatePickerDemo value={closeTime} onChange={setCloseTime} />
            </div>
          )}
          <div className="space-y-2">
            <Label>Motif</Label>
            <Input type="text" value={reason} onChange={e => setReason(e.target.value)} className="rounded-full" />
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
          <button onClick={onClose} className="flex-1 px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Annuler</button>
          <button onClick={handleSubmit} className="flex-1 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-[var(--reserva-ink)] hover:text-white cursor-pointer transition-colors">Save</button>
        </div>
      </div>
    </div>
  );
};

const GestionHoraires = () => {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'establishment' | 'exceptional' | 'agenda' | 'delays'>('establishment');
  const [onlineBooking, setOnlineBooking] = useState<'open' | 'closed'>('open');

  // Establishment hours state
  const [schedules, setSchedules] = useState<DaySchedule[]>([
    { day: 'Mondi', dayShort: 'Lu', isOpen: false, openTime: '10:00', closeTime: '20:00', breaks: [] },
    { day: 'Tuedi', dayShort: 'Ma', isOpen: true, openTime: '10:00', closeTime: '20:00', breaks: [] },
    { day: 'Wedcredi', dayShort: 'Me', isOpen: true, openTime: '10:00', closeTime: '20:00', breaks: [] },
    { day: 'Thudi', dayShort: 'Je', isOpen: true, openTime: '10:00', closeTime: '20:00', breaks: [] },
    { day: 'Fridredi', dayShort: 'Ve', isOpen: true, openTime: '10:00', closeTime: '20:00', breaks: [] },
    { day: 'Satedi', dayShort: 'Sa', isOpen: true, openTime: '10:00', closeTime: '20:00', breaks: [] },
    { day: 'Sunanche', dayShort: 'Di', isOpen: true, openTime: '10:00', closeTime: '20:00', breaks: [] }
  ]);

  // Exceptional schedules state
  const [exceptionalSchedules, setExceptionalSchedules] = useState<ExceptionalSchedule[]>([
    { id: 1, date: '2024-10-17', isOpen: true, openTime: '10:00', closeTime: '18:00', reason: 'Early closing' },
    { id: 2, date: '2024-04-22', isOpen: false, reason: 'Public holiday' },
    { id: 3, date: '2024-04-17', isOpen: true, openTime: '09:00', closeTime: '19:00', reason: 'Special hours' }
  ]);

  // Agenda display times
  const [agendaStart, setAgendaStart] = useState('08:00');
  const [agendaEnd, setAgendaEnd] = useState('23:55');

  // Booking delays
  const [bookingDelay, setBookingDelay] = useState({ value: '1', unit: 'jours' });
  const [cancellationDelay, setCancellationDelay] = useState({ value: '1', unit: 'jours' });
  const [advanceBooking, setAdvanceBooking] = useState({ value: '1', unit: 'mois' });

  // Modal state for editing exceptional schedules
  const [showEditExceptionalModal, setShowEditExceptionalModal] = useState(false);
  const [selectedExceptionalSchedule, setSelectedExceptionalSchedule] = useState<ExceptionalSchedule | null>(null);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleDay = (index: number) => {
    const newSchedules = [...schedules];
    newSchedules[index].isOpen = !newSchedules[index].isOpen;
    setSchedules(newSchedules);
  };

  const updateSchedule = (index: number, field: 'openTime' | 'closeTime', value: string) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };

  const addBreak = (index: number) => {
    const newSchedules = [...schedules];
    newSchedules[index].breaks.push({ start: '12:00', end: '14:00' });
    setSchedules(newSchedules);
  };

  const removeBreak = (scheduleIndex: number, breakIndex: number) => {
    const newSchedules = [...schedules];
    newSchedules[scheduleIndex].breaks.splice(breakIndex, 1);
    setSchedules(newSchedules);
  };

  const addExceptionalSchedule = () => {
    const newSchedule: ExceptionalSchedule = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      isOpen: true,
      openTime: '10:00',
      closeTime: '20:00'
    };
    setExceptionalSchedules([...exceptionalSchedules, newSchedule]);
  };

  const deleteExceptionalSchedule = (id: number) => {
    setExceptionalSchedules(exceptionalSchedules.filter(s => s.id !== id));
  };

  const handleEditExceptional = (schedule: ExceptionalSchedule) => {
    setSelectedExceptionalSchedule(schedule);
    setShowEditExceptionalModal(true);
  };

  const handleSaveExceptional = (updatedSchedule: ExceptionalSchedule) => {
    setExceptionalSchedules(schedules => schedules.map(s => s.id === updatedSchedule.id ? updatedSchedule : s));
    setShowEditExceptionalModal(false);
    setSelectedExceptionalSchedule(null);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-6">
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

      {/* Header - Ultra Minimalist Premium */}
      <div className="mb-8 animate-slideDown pt-20">
        <div className="flex items-center justify-between">
          {/* Left: Title */}
          <div className="flex items-center gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-5xl font-light text-gray-900 tracking-tight">
                Horaires
              </h1>
              {/* Time below title */}
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-light text-gray-900 tabular-nums tracking-tight">
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-xs text-gray-400 tabular-nums">
                  :{currentTime.toLocaleTimeString('en-US', { second: '2-digit' })}
                </span>
              </div>
              {/* Month and year below time */}
              <div className="text-sm text-gray-500 mt-1">
                {currentTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
          {/* Right: Save Button */}
          <div className="flex items-center gap-6">
            {activeTab === 'establishment' && (
              <button className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-[var(--reserva-ink)] hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                <Save size={16} />
                Save
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('establishment')}
            className={`px-6 py-3 text-sm font-medium transition-all relative ${
              activeTab === 'establishment'
                ? 'text-foreground'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Establishment hours
            {activeTab === 'establishment' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('exceptional')}
            className={`px-6 py-3 text-sm font-medium transition-all relative ${
              activeTab === 'exceptional'
                ? 'text-foreground'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Exceptional establishment hours
            {activeTab === 'exceptional' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('agenda')}
            className={`px-6 py-3 text-sm font-medium transition-all relative ${
              activeTab === 'agenda'
                ? 'text-foreground'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Hours shown in the agenda
            {activeTab === 'agenda' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('delays')}
            className={`px-6 py-3 text-sm font-medium transition-all relative ${
              activeTab === 'delays'
                ? 'text-foreground'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Online reservation timing
            {activeTab === 'delays' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">
        {/* Establishment Hours Tab */}
        {activeTab === 'establishment' && (
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
              <p className="text-sm text-gray-600">
                Manage establishment opening hours and online reservations here
              </p>
            </div>

            {/* Online Booking Status */}
            <div className="p-0">
              <div className="flex items-center gap-6 mb-12 pt-4">
                <Label className="text-base font-medium text-gray-900">Prise de reservation en ligne</Label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="online-booking"
                      checked={onlineBooking === 'open'}
                      onChange={() => setOnlineBooking('open')}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm font-medium text-gray-900">Ouverte</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="online-booking"
                      checked={onlineBooking === 'closed'}
                      onChange={() => setOnlineBooking('closed')}
                      className="w-4 h-4 accent-gray-900"
                    />
                    <span className="text-sm font-medium text-gray-900">Closed</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Day Selection */}
            <div className="">
              <Label className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4 block">
                Please select opening days
              </Label>

              <div className="flex items-center gap-2 mb-8">
                {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map((label, index) => (
                  <button
                    key={label}
                    onClick={() => toggleDay(index)}
                    className={`w-24 h-10 rounded-full text-sm font-medium transition-all ${
                      schedules[index].isOpen
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Schedule Details */}
              <div className="space-y-4">
                {schedules.filter(s => s.isOpen).map((schedule, index) => {
                  const originalIndex = schedules.findIndex(s => s.day === schedule.day);
                  return (
                    <div key={schedule.day} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-24 text-sm font-medium text-gray-900">
                        {schedule.day}
                      </div>
                      <div className="flex items-center gap-2">
                        <DatePickerDemo
                          value={schedule.openTime}
                          onChange={(value) => updateSchedule(originalIndex, 'openTime', value)}
                        />
                        <span className="text-gray-400">-</span>
                        <DatePickerDemo
                          value={schedule.closeTime}
                          onChange={(value) => updateSchedule(originalIndex, 'closeTime', value)}
                        />
                      </div>
                      <button
                        onClick={() => addBreak(originalIndex)}
                        className="text-sm text-gray-500 hover:text-gray-900 underline ml-4"
                      >
                        Add une plage d'ouverture
                      </button>

                      {/* Breaks */}
                      {schedule.breaks.map((breakTime, breakIndex) => (
                        <div key={breakIndex} className="flex items-center gap-2 ml-4">
                          <DatePickerDemo
                            value={breakTime.start}
                            onChange={value => {
                              const newSchedules = [...schedules];
                              newSchedules[originalIndex].breaks[breakIndex].start = value;
                              setSchedules(newSchedules);
                            }}
                          />
                          <span className="text-gray-400">-</span>
                          <DatePickerDemo
                            value={breakTime.end}
                            onChange={value => {
                              const newSchedules = [...schedules];
                              newSchedules[originalIndex].breaks[breakIndex].end = value;
                              setSchedules(newSchedules);
                            }}
                          />
                          <button
                            onClick={() => removeBreak(originalIndex, breakIndex)}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Exceptional Hours Tab */}
        {activeTab === 'exceptional' && (
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
              <p className="text-sm text-gray-600">
                Define exceptional openings and closures for your establishment here
              </p>
            </div>

            {/* Add Button */}
            <div className="flex justify-start">
              <button
                onClick={addExceptionalSchedule}
                className="px-5 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add des horaires exceptionnels
              </button>
            </div>

            {/* Exceptional Schedules List */}
            <div className="space-y-3">
              {exceptionalSchedules.map((schedule) => (
                <div key={schedule.id} className="bg-white rounded-lg border border-gray-100 p-6 flex items-center justify-between  transition-shadow">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="font-medium">
                        Le {new Date(schedule.date).toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    {schedule.isOpen ? (
                      <div className="flex items-center gap-2 text-sm text-emerald-600">
                        <Clock size={16} />
                        <span>{schedule.openTime} - {schedule.closeTime}</span>
                      </div>
                    ) : (
                      <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                        Closed
                      </span>
                    )}
                    {schedule.reason && (
                      <span className="text-sm text-gray-500 italic">
                        {schedule.reason}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 underline" onClick={() => handleEditExceptional(schedule)}>
                      Edit
                    </button>
                    <button
                      onClick={() => deleteExceptionalSchedule(schedule.id)}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {showEditExceptionalModal && selectedExceptionalSchedule && (
              <ExceptionalEditModal
                schedule={selectedExceptionalSchedule}
                onClose={() => { setShowEditExceptionalModal(false); setSelectedExceptionalSchedule(null); }}
                onSave={handleSaveExceptional}
              />
            )}
          </div>
        )}

        {/* Agenda Display Tab */}
        {activeTab === 'agenda' && (
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
              <p className="text-sm text-gray-600">
                Define the display hours for your Pro agenda here. These hours do not appear on the portal and do not affect online reservation booking. By default, they span from the earliest to the latest establishment hours.
              </p>
            </div>
            {/* Time Selection */}
            <div className="bg-white rounded-lg border border-gray-100 p-8">
              <div className="flex items-center gap-6">
                <Label className="text-base font-medium text-gray-900">Afficher l'agenda de</Label>
                <div className="flex items-center gap-3">
                  <DatePickerDemo
                    value={agendaStart}
                    onChange={(value) => setAgendaStart(value)}
                  />
                  <span className="text-gray-400">to</span>
                  <DatePickerDemo
                    value={agendaEnd}
                    onChange={(value) => setAgendaEnd(value)}
                  />
                </div>
              </div>
            </div>
            {/* Save Button */}
            <div className="flex justify-end">
              <button className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-[var(--reserva-ink)] hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                <Save size={16} />
                Save
              </button>
            </div>
          </div>
        )}

        {/* Booking Delays Tab */}
        {activeTab === 'delays' && (
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
              <p className="text-sm text-gray-600 font-medium mb-2">
                Online reservation lead times
              </p>
            </div>

            {/* Booking Delay */}
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <Label className="text-base font-medium text-gray-900 mb-4 block">
                A guest can book online:
              </Label>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      id="last-moment"
                      name="booking-delay"
                      checked={false}
                      onChange={() => setBookingDelay({ value: '', unit: '' })}
                      className="w-4 h-4 accent-primary"
                    />
                    <Label htmlFor="last-moment" className="text-sm text-gray-700 cursor-pointer">
                      Jusqu'au dernier moment avant sa reservation
                    </Label>
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      id="before-delay"
                      name="booking-delay"
                      checked={true}
                      onChange={() => {}}
                      className="w-4 h-4 accent-primary"
                    />
                    <Label htmlFor="before-delay" className="text-sm text-gray-700 cursor-pointer">
                      Until
                    </Label>
                    <Input
                      type="number"
                      value={bookingDelay.value}
                      onChange={(e) => setBookingDelay({ ...bookingDelay, value: e.target.value })}
                      className="w-20 rounded-full"
                      min="1"
                    />
                    <Select
                      value={bookingDelay.unit}
                      onValueChange={(value) => setBookingDelay({ ...bookingDelay, unit: value })}
                    >
                      <SelectTrigger className="w-32 rounded-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jours">jours</SelectItem>
                        <SelectItem value="hours">hours</SelectItem>
                        <SelectItem value="weeks">weeks</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-700">avant la reservation</span>
                  </label>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 pl-7">
                Example: a guest can book for January 9 until January 8 at 8:00 PM
              </p>
            </div>
            {/* Cancellation Delay */}
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <Label className="text-base font-medium text-gray-900 mb-4 block">
                Un guest peut annuler sa reservation en ligne:
              </Label>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      id="cancel-last-moment"
                      name="cancel-delay"
                      checked={false}
                      onChange={() => setCancellationDelay({ value: '', unit: '' })}
                      className="w-4 h-4 accent-primary"
                    />
                    <Label htmlFor="cancel-last-moment" className="text-sm text-gray-700 cursor-pointer">
                      Jusqu'au dernier moment avant sa reservation
                    </Label>
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      id="cancel-before-delay"
                      name="cancel-delay"
                      checked={true}
                      onChange={() => {}}
                      className="w-4 h-4 accent-primary"
                    />
                    <Label htmlFor="cancel-before-delay" className="text-sm text-gray-700 cursor-pointer">
                      Until
                    </Label>
                    <Input
                      type="number"
                      value={cancellationDelay.value}
                      onChange={(e) => setCancellationDelay({ ...cancellationDelay, value: e.target.value })}
                      className="w-20 rounded-full"
                      min="1"
                    />
                    <Select
                      value={cancellationDelay.unit}
                      onValueChange={(value) => setCancellationDelay({ ...cancellationDelay, unit: value })}
                    >
                      <SelectTrigger className="w-32 rounded-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jours">jours</SelectItem>
                        <SelectItem value="hours">hours</SelectItem>
                        <SelectItem value="weeks">weeks</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-700">avant la reservation</span>
                  </label>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 pl-7">
                Example: a guest can cancel a January 9 reservation until January 8 at 8:00 PM
              </p>
            </div>
            {/* Advance Booking */}
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <Label className="text-base font-medium text-gray-900 mb-4 block">
                A guest can book online:
              </Label>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      id="advance-booking"
                      name="advance-booking"
                      checked={true}
                      onChange={() => {}}
                      className="w-4 h-4 accent-primary"
                    />
                    <Label htmlFor="advance-booking" className="text-sm text-gray-700 cursor-pointer">
                      From
                    </Label>
                    <Input
                      type="number"
                      value={advanceBooking.value}
                      onChange={(e) => setAdvanceBooking({ ...advanceBooking, value: e.target.value })}
                      className="w-20 rounded-full"
                      min="1"
                    />
                    <Select
                      value={advanceBooking.unit}
                      onValueChange={(value) => setAdvanceBooking({ ...advanceBooking, unit: value })}
                    >
                      <SelectTrigger className="w-32 rounded-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mois">mois</SelectItem>
                        <SelectItem value="weeks">weeks</SelectItem>
                        <SelectItem value="jours">jours</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-700">avant la reservation</span>
                  </label>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 pl-7">
                Example: a guest can book for January 9 starting December 10 at 8:00 PM
              </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-[var(--reserva-ink)] hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                <Save size={16} />
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionHoraires;
