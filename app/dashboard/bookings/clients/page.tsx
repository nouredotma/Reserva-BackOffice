'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, Calendar, Mail, MapPin, Phone, Search, Trash2, Users } from 'lucide-react';
import { sampleClients, type Client } from '@/lib/mock-data';

const filterTrackClass = 'inline-flex h-10 shrink-0 items-center rounded-full bg-neutral-200 p-1';

const filterPillClass = (active: boolean) =>
  `flex h-8 cursor-pointer items-center whitespace-nowrap rounded-full px-4 text-xs font-medium transition-colors ${
    active ? 'bg-white text-gray-900' : 'text-neutral-500 hover:text-neutral-700'
  }`;

const statusFilterOptions = [
  { value: 'all' as const, label: 'All' },
  { value: 'Active' as const, label: 'Active' },
  { value: 'Inactive' as const, label: 'Inactive' },
];

function formatDate(date?: Date, time?: string) {
  if (!date) return '-';
  const value = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return time ? `${value} at ${time}` : value;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  const activeCount = clients.filter((client) => client.status === 'Active').length;
  const inactiveCount = clients.filter((client) => client.status === 'Inactive').length;

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
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-neutral-300 hover:bg-gray-50"
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
          <section className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
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
                <div key={item.label} className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>

            {selectedClient.notes && (
              <div className="mt-6 rounded-xl border border-neutral-200 p-4">
                <p className="mb-2 text-xs font-medium text-gray-500">Notes</p>
                <p className="text-sm text-gray-700">{selectedClient.notes}</p>
              </div>
            )}
          </section>

          <aside className="rounded-xl border border-neutral-200 bg-white p-6">
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
      <div className="mb-8 pt-20">
        <div className="flex flex-wrap items-baseline gap-4">
          <h1 className="text-5xl font-light tracking-tight text-gray-900">Clients</h1>
          <span className="text-sm text-gray-400">{filteredClients.length} records</span>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3">
          <Search size={16} className="shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>
        <div className={filterTrackClass} role="group" aria-label="Client status">
          {statusFilterOptions.map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() => setStatusFilter(status.value)}
              className={filterPillClass(statusFilter === status.value)}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
            <Users size={18} className="text-gray-400" />
          </div>
          <p className="mb-1 text-xs font-medium text-gray-400">Total clients</p>
          <p className="text-3xl font-light text-gray-900">{clients.length}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
            <Calendar size={18} className="text-gray-400" />
          </div>
          <p className="mb-1 text-xs font-medium text-gray-400">Active clients</p>
          <p className="text-3xl font-light text-gray-900">{activeCount}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
            <Users size={18} className="text-gray-400" />
          </div>
          <p className="mb-1 text-xs font-medium text-gray-400">Inactive clients</p>
          <p className="text-3xl font-light text-gray-900">{inactiveCount}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Client</th>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Address</th>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Visits</th>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Next appointment</th>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredClients.map((client) => (
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
                  className="cursor-pointer transition-colors hover:bg-primary/10"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary">
                        <span className="text-sm font-medium text-primary-foreground">
                          {client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-900">{client.name}</p>
                        <p className="mt-1 truncate text-xs text-gray-400">ID {client.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    <p>{client.email}</p>
                    <p className="mt-1 text-xs text-gray-400">{client.phone}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{client.address ?? '—'}</td>
                  <td className="px-5 py-4 text-gray-600">{client.totalVisits ?? 0}</td>
                  <td className="px-5 py-4 text-gray-600">
                    {client.nextAppointment
                      ? client.nextAppointment.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : '—'}
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
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteClient(client.id);
                      }}
                      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-all hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete ${client.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
