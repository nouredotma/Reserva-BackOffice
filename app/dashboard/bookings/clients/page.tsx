'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, Calendar, Mail, MapPin, Merge, Phone, Search, Trash2, User as UserIcon, Users } from 'lucide-react';
import { sampleClients, sampleDuplicates, type Client, type DuplicateClient } from '@/lib/mock-data';

function formatDate(date?: Date, time?: string) {
  if (!date) return '-';
  const value = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return time ? `${value} at ${time}` : value;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [duplicates, setDuplicates] = useState<DuplicateClient[]>(sampleDuplicates);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [viewMode, setViewMode] = useState<'all' | 'duplicates'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(sampleClients[0]?.id ?? null);
  const [detailOpen, setDetailOpen] = useState(false);

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === selectedId) ?? null,
    [clients, selectedId],
  );

  const filteredClients = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return clients.filter((client) => {
      const matchesSearch =
        !query ||
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone.includes(query) ||
        client.address?.toLowerCase().includes(query);
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
    if (selectedId === id) {
      setDetailOpen(false);
      setSelectedId(null);
    }
  };

  const openDetail = (client: Client) => {
    setSelectedId(client.id);
    setDetailOpen(true);
  };

  if (detailOpen && selectedClient) {
    return (
      <div className="min-h-screen">
        <div className="mb-8 pt-20">
          <button
            type="button"
            onClick={() => setDetailOpen(false)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back to clients
          </button>
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                <span className="text-2xl font-medium text-primary-foreground">
                  {selectedClient.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-5xl font-light tracking-tight text-gray-900">{selectedClient.name}</h1>
                <p className="mt-2 text-sm text-gray-400">Client profile</p>
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                selectedClient.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {selectedClient.status}
            </span>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="rounded-lg border border-gray-100 bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                <Users size={18} className="text-gray-500" />
              </div>
              <div>
                <h2 className="text-xl font-light text-gray-900">Client activity</h2>
                <p className="text-sm text-gray-400">Visits, next appointment, and preference notes.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: 'Total visits', value: String(selectedClient.totalVisits ?? 0) },
                { label: 'Last visit', value: formatDate(selectedClient.lastVisit, selectedClient.lastVisitTime) },
                { label: 'Next appointment', value: formatDate(selectedClient.nextAppointment, selectedClient.nextAppointmentTime) },
                { label: 'Status', value: selectedClient.status },
                { label: 'Client ID', value: selectedClient.id },
                { label: 'Address', value: selectedClient.address ?? '-' },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>

            {selectedClient.notes && (
              <div className="mt-6 rounded-lg border border-gray-100 p-4">
                <p className="mb-2 text-xs font-medium text-gray-500">Notes</p>
                <p className="text-sm text-gray-700">{selectedClient.notes}</p>
              </div>
            )}
          </section>

          <aside className="rounded-lg border border-gray-100 bg-white p-6">
            <h2 className="mb-5 text-xl font-light text-gray-900">Contact</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <span className="truncate">{selectedClient.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <span>{selectedClient.phone}</span>
              </div>
              {selectedClient.address && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{selectedClient.address}</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => deleteClient(selectedClient.id)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition-all hover:bg-rose-100"
            >
              <Trash2 size={16} />
              Delete client
            </button>
          </aside>
        </div>
      </div>
    );
  }

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
            <h1 className="text-5xl font-light tracking-tight text-gray-900">Clients</h1>
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
              placeholder="Search clients..."
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
          <p className="mb-1 text-xs text-gray-400">Client profiles</p>
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
          <p className="mb-1 text-xs text-gray-400">Active clients</p>
          <p className="text-3xl font-light text-gray-900">{clients.filter((client) => client.status === 'Active').length}</p>
        </div>
      </div>

      {viewMode === 'all' ? (
        <div className="overflow-hidden rounded-lg border border-gray-100 bg-white animate-fadeIn">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <p className="text-sm font-medium text-gray-900">{filteredClients.length} profiles</p>
            <p className="text-xs text-gray-400">Click a row to open details</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-separate border-spacing-0 text-left">
              <thead>
                <tr className="bg-gray-50/70 text-xs font-medium uppercase tracking-wider text-gray-400">
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Address</th>
                  <th className="px-5 py-3">Visits</th>
                  <th className="px-5 py-3">Next appointment</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredClients.map((client) => {
                  const isActive = selectedId === client.id;
                  return (
                    <tr
                      key={client.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => openDetail(client)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          openDetail(client);
                        }
                      }}
                      className={`cursor-pointer border-l-4 transition-colors ${
                        isActive
                          ? 'border-l-primary bg-primary/10 outline outline-1 outline-primary/30'
                          : 'border-l-transparent hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                            <span className="text-sm font-medium text-primary-foreground">{client.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{client.name}</p>
                            <p className="mt-1 text-xs text-gray-400">ID {client.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-gray-900">{client.email}</p>
                        <p className="mt-1 text-xs text-gray-400">{client.phone}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{client.address ?? '-'}</td>
                      <td className="px-5 py-4 text-gray-600">{client.totalVisits ?? 0}</td>
                      <td className="px-5 py-4 text-gray-600">
                        {client.nextAppointment
                          ? client.nextAppointment.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : '-'}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            client.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {client.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteClient(client.id);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-all hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${client.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-100 bg-white animate-fadeIn">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <p className="text-sm font-medium text-gray-900">{filteredDuplicates.length} duplicate groups</p>
            <p className="text-xs text-gray-400">Review and merge duplicate profiles</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left">
              <thead>
                <tr className="bg-gray-50/70 text-xs font-medium uppercase tracking-wider text-gray-400">
                  <th className="px-5 py-3">Primary profile</th>
                  <th className="px-5 py-3">Duplicates</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredDuplicates.map((duplicate) => (
                  <tr key={duplicate.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{duplicate.name}</p>
                      <p className="mt-1 text-xs text-gray-400">{duplicate.email} - {duplicate.phone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-2">
                        {duplicate.duplicates.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 text-xs text-gray-600">
                            <UserIcon size={13} className="text-gray-400" />
                            <span>{item.name}</span>
                            <span className="text-gray-300">/</span>
                            <span>{item.email}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        {duplicate.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => mergeDuplicate(duplicate)}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-[var(--reserva-ink)] hover:text-white"
                      >
                        <Merge size={16} />
                        Merge
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
