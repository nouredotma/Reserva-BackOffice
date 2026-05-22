'use client';

import { useMemo, useState } from 'react';
import { Calendar, Mail, MapPin, Merge, Phone, Search, Trash2, User as UserIcon, Users } from 'lucide-react';
import { sampleClients, sampleDuplicates, type Client, type DuplicateClient } from '@/lib/mock-data';

export default function GuestsPage() {
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [duplicates, setDuplicates] = useState<DuplicateClient[]>(sampleDuplicates);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [viewMode, setViewMode] = useState<'all' | 'duplicates'>('all');

  const filteredClients = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return clients.filter((client) => {
      const matchesSearch =
        !query ||
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone.includes(query);
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, statusFilter]);

  const filteredDuplicates = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return duplicates.filter((duplicate) => {
      const matchesSearch =
        !query ||
        duplicate.name.toLowerCase().includes(query) ||
        duplicate.email.toLowerCase().includes(query) ||
        duplicate.phone.includes(query) ||
        duplicate.duplicates.some(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.email.toLowerCase().includes(query) ||
            item.phone.includes(query),
        );
      const matchesStatus = statusFilter === 'all' || duplicate.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [duplicates, searchTerm, statusFilter]);

  const mergeDuplicate = (duplicate: DuplicateClient) => {
    setDuplicates((current) => current.filter((item) => item.id !== duplicate.id));
    setClients((current) => {
      const exists = current.some((client) => client.email === duplicate.email || client.phone === duplicate.phone);
      return exists ? current : [...current, { ...duplicate, totalVisits: 0 }];
    });
  };

  const deleteClient = (id: string) => {
    setClients((current) => current.filter((client) => client.id !== id));
  };

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

      <div className="mb-8 pt-20 animate-slideUp">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-baseline gap-4">
            <h1 className="text-5xl font-light tracking-tight text-gray-900">Guests</h1>
            <span className="text-sm text-gray-400">
              {viewMode === 'all' ? filteredClients.length : filteredDuplicates.length} records
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === 'all' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Profiles
            </button>
            <span className="text-gray-300">/</span>
            <button
              onClick={() => setViewMode('duplicates')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === 'duplicates' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Duplicates
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 animate-fadeIn">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative min-w-[260px] flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search guests..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-700 placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div className="flex items-center gap-2">
            {(['all', 'Active', 'Inactive'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  statusFilter === status ? 'bg-primary text-primary-foreground' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status === 'all' ? 'All' : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3 animate-fadeIn">
        <div className="rounded-lg border border-gray-100 bg-white p-6">
          <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
            <Users size={18} className="text-gray-400" />
          </div>
          <p className="mb-1 text-xs text-gray-400">Guest profiles</p>
          <p className="text-3xl font-light text-gray-900">{clients.length}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-6">
          <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
            <Merge size={18} className="text-gray-400" />
          </div>
          <p className="mb-1 text-xs text-gray-400">Detected duplicates</p>
          <p className="text-3xl font-light text-gray-900">{duplicates.length}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-6">
          <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
            <Calendar size={18} className="text-gray-400" />
          </div>
          <p className="mb-1 text-xs text-gray-400">Active guests</p>
          <p className="text-3xl font-light text-gray-900">{clients.filter((client) => client.status === 'Active').length}</p>
        </div>
      </div>

      {viewMode === 'all' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 animate-fadeIn">
          {filteredClients.map((client) => (
            <div key={client.id} className="group rounded-lg border border-gray-100 bg-white p-6 transition-all hover:border-gray-200">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                    <span className="text-lg font-medium text-primary-foreground">{client.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{client.name}</h3>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        client.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {client.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteClient(client.id)}
                  className="rounded-md p-1.5 text-gray-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="space-y-2.5">
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
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                <div>
                  <p className="text-xs text-gray-400">Visits</p>
                  <p className="text-sm font-medium text-gray-900">{client.totalVisits ?? 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Next</p>
                  <p className="text-sm font-medium text-gray-900">
                    {client.nextAppointment ? new Date(client.nextAppointment).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 animate-fadeIn">
          {filteredDuplicates.map((duplicate) => (
            <div key={duplicate.id} className="rounded-lg border border-gray-100 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                    <span className="text-lg font-medium text-primary-foreground">{duplicate.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{duplicate.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{duplicate.email} — {duplicate.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => mergeDuplicate(duplicate)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-[var(--reserva-ink)] hover:text-white"
                >
                  <Merge size={16} />
                  Merge
                </button>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {duplicate.duplicates.map((item) => (
                  <div key={item.id} className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900">
                      <UserIcon size={14} className="text-gray-400" />
                      {item.name}
                    </div>
                    <p className="text-xs text-gray-500">{item.email}</p>
                    <p className="mt-1 text-xs text-gray-500">{item.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
