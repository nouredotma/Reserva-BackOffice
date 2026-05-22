'use client';

import { useMemo, useState, type ChangeEvent } from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  FileImage,
  Image as ImageIcon,
  List,
  Plus,
  Save,
  Search,
  Settings2,
  Star,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ownerServices } from '@/lib/mock-data';
import type { Service } from '@/lib/reserva-types';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type ServiceEditor = {
  id: string;
  name: string;
  nameFr: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  serviceType: string;
  price: number;
  priceType: 'fixed' | 'from' | 'range';
  priceFrom?: number;
  priceTo?: number;
  currency: string;
  requiresDeposit: boolean;
  depositAmount: string;
  depositType: 'fixed' | 'percentage';
  taxIncluded: boolean;
  taxRate: string;
  durationMinutes: string;
  minPeople: string;
  maxPeople: string;
  capacityPerSlot: string;
  isAvailable: boolean;
  availableDays: string[];
  startTime: string;
  endTime: string;
  blackoutDates: string;
  advanceBookingHours: string;
  cancellationDeadlineHours: string;
  requiresConfirmation: boolean;
  instantBooking: boolean;
  allowCancellation: boolean;
  cancellationPolicy: string;
  includedItems: string;
  excludedItems: string;
  addOns: string;
  coverImage: string;
  galleryImages: string[];
  status: Service['status'];
  isFeatured: boolean;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function serviceToEditor(service: Service): ServiceEditor {
  const priceType: ServiceEditor['priceType'] =
    service.price === 0 ? 'fixed' : service.deposit_type === 'fixed' && service.requires_deposit ? 'from' : 'fixed';

  return {
    id: service.id,
    name: service.name,
    nameFr: service.name_fr,
    slug: service.slug,
    shortDescription: service.short_description,
    fullDescription: service.full_description ?? service.short_description,
    serviceType: service.service_type,
    price: service.price,
    priceType,
    priceFrom: service.price || undefined,
    currency: service.currency,
    requiresDeposit: service.requires_deposit,
    depositAmount: String(service.deposit_amount ?? 0),
    depositType: service.deposit_type ?? 'percentage',
    taxIncluded: service.tax_included,
    taxRate: String(Math.round(service.tax_rate * 100)),
    durationMinutes: String(service.duration_minutes ?? 90),
    minPeople: String(service.min_people),
    maxPeople: String(service.max_people),
    capacityPerSlot: String(service.capacity_per_slot),
    isAvailable: service.is_available,
    availableDays: service.available_days.map((d) => DAY_LABELS[d] ?? 'Mon'),
    startTime: service.start_time ?? '12:00',
    endTime: service.end_time ?? '23:00',
    blackoutDates: service.blackout_dates.join(', '),
    advanceBookingHours: String(service.advance_booking_hours),
    cancellationDeadlineHours: String(service.cancellation_deadline_hours),
    requiresConfirmation: service.requires_confirmation,
    instantBooking: service.instant_booking,
    allowCancellation: service.allow_cancellation,
    cancellationPolicy: service.cancellation_policy ?? '',
    includedItems: service.included_items.join('\n'),
    excludedItems: service.excluded_items.join('\n'),
    addOns: service.add_ons.map((a) => `${a.name} — ${a.price} MAD`).join('\n'),
    coverImage: service.cover_image,
    galleryImages: service.gallery_images.length ? service.gallery_images : [service.cover_image],
    status: service.status,
    isFeatured: service.is_featured,
  };
}

function buildInitialServices(): ServiceEditor[] {
  return ownerServices.map(serviceToEditor);
}

function ToggleButton({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
        checked
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
}

function SectionRow({
  title,
  description,
  icon: Icon,
  children,
  actions,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-100 bg-white p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
            <Icon size={18} className="text-gray-500" />
          </div>
          <div>
            <h2 className="text-xl font-light text-gray-900">{title}</h2>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export default function ServicesManagementPage() {
  const [saved, setSaved] = useState(false);
  const [query, setQuery] = useState('');
  const [services, setServices] = useState<ServiceEditor[]>(buildInitialServices);
  const [selectedId, setSelectedId] = useState<string | null>(ownerServices[0]?.id ?? null);
  const [detailOpen, setDetailOpen] = useState(false);

  const currentService = services.find((service) => service.id === selectedId);

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return services;
    return services.filter((service) =>
      [service.name, service.slug, service.serviceType, service.status].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [query, services]);

  const stats = useMemo(() => {
    const active = services.filter((service) => service.status === 'active').length;
    const featured = services.filter((service) => service.isFeatured).length;
    const avgPrice = Math.round(
      services.reduce((sum, service) => sum + service.price, 0) / Math.max(services.length, 1),
    );
    const totalCapacity = services.reduce(
      (sum, service) => sum + Number(service.capacityPerSlot || 0),
      0,
    );
    return { active, avgPrice, featured, totalCapacity };
  }, [services]);

  const updateService = <K extends keyof ServiceEditor>(field: K, value: ServiceEditor[K]) => {
    if (!currentService) return;
    setServices((current) =>
      current.map((service) => {
        if (service.id !== currentService.id) return service;
        return { ...service, [field]: value };
      }),
    );
  };

  const updateServiceName = (value: string) => {
    if (!currentService) return;
    setServices((current) =>
      current.map((service) => {
        if (service.id !== currentService.id) return service;
        return { ...service, name: value, slug: slugify(value) };
      }),
    );
  };

  const addService = () => {
    const nextId = `sv-new-${Date.now()}`;
    const nextService: ServiceEditor = {
      ...serviceToEditor(ownerServices[0]),
      id: nextId,
      name: 'New service',
      nameFr: 'Nouveau service',
      slug: 'new-service',
      shortDescription: '',
      fullDescription: '',
      price: 0,
      status: 'draft',
      isFeatured: false,
    };
    setServices((current) => [nextService, ...current]);
    setSelectedId(nextId);
    setDetailOpen(true);
  };

  const duplicateService = () => {
    if (!currentService) return;
    const nextId = `sv-copy-${Date.now()}`;
    const nextService = {
      ...currentService,
      id: nextId,
      name: `${currentService.name} (copy)`,
      slug: `${currentService.slug}-copy`,
      status: 'draft' as const,
    };
    setServices((current) => [nextService, ...current]);
    setSelectedId(nextId);
    setDetailOpen(true);
  };

  const deleteCurrentService = () => {
    if (!currentService || services.length <= 1) return;
    const remaining = services.filter((service) => service.id !== currentService.id);
    setServices(remaining);
    setSelectedId(remaining[0]?.id ?? null);
    if (!remaining.length) setDetailOpen(false);
  };

  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    updateService('coverImage', URL.createObjectURL(file));
  };

  const handleGalleryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length || !currentService) return;
    updateService('galleryImages', [
      ...currentService.galleryImages,
      ...files.map((file) => URL.createObjectURL(file)),
    ].slice(0, 6));
  };

  const toggleDay = (day: string) => {
    if (!currentService) return;
    updateService(
      'availableDays',
      currentService.availableDays.includes(day)
        ? currentService.availableDays.filter((d) => d !== day)
        : [...currentService.availableDays, day],
    );
  };

  const saveServices = () => {
    localStorage.setItem('establishment_services_settings', JSON.stringify(services));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
      `}</style>

      <div className="mb-10 pt-20 animate-slideUp">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="mb-2 text-5xl font-light tracking-tight text-gray-900">Services</h1>
            <p className="text-sm text-gray-400">
              Bookable units for Le Jardin — table reservations, private dining, and experiences.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                <CheckCircle2 size={16} />
                Saved
              </span>
            )}
            <Button type="button" variant="outline" onClick={addService}>
              <Plus size={16} />
              New service
            </Button>
            <Button type="button" size="lg" onClick={saveServices}>
              <Save size={16} />
              Save services
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Settings2, label: 'Active services', value: stats.active.toString() },
          { icon: Star, label: 'Featured', value: stats.featured.toString() },
          { icon: CreditCard, label: 'Average price', value: `${stats.avgPrice.toLocaleString()} MAD` },
          { icon: Calendar, label: 'Slot capacity', value: stats.totalCapacity.toString() },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-lg border border-gray-100 bg-white p-5">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                <Icon size={18} className="text-gray-500" />
              </div>
              <p className="mb-1 text-xs font-medium text-gray-400">{item.label}</p>
              <p className="text-3xl font-light text-gray-900">{item.value}</p>
            </div>
          );
        })}
      </div>

      {!detailOpen ? (
        <div className="overflow-hidden rounded-lg border border-gray-100 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <List size={16} />
              Your services ({services.length})
            </div>
            <div className="flex min-w-[260px] items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2">
              <Search size={16} className="text-gray-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search services"
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-separate border-spacing-0 text-left">
              <thead>
                <tr className="bg-gray-50/70 text-xs font-medium uppercase tracking-wider text-gray-400">
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Availability</th>
                  <th className="px-5 py-3">Capacity</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Featured</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredServices.map((service) => {
                  const isActive = service.id === selectedId;
                  return (
                    <tr
                      key={service.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelectedId(service.id);
                        setDetailOpen(true);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setSelectedId(service.id);
                          setDetailOpen(true);
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
                          <img
                            src={service.coverImage}
                            alt=""
                            className="h-11 w-11 shrink-0 rounded-md object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-gray-900">{service.name}</p>
                            <p className="mt-1 truncate text-xs text-gray-400">{service.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600 capitalize">{service.serviceType.replace('_', ' ')}</td>
                      <td className="px-5 py-4 text-gray-600">
                        <p>{service.startTime} - {service.endTime}</p>
                        <p className="mt-1 text-xs text-gray-400">{service.durationMinutes} min</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {service.minPeople}-{service.maxPeople} people
                        <p className="mt-1 text-xs text-gray-400">{service.capacityPerSlot} per slot</p>
                      </td>
                      <td className="px-5 py-4 font-medium text-gray-900">
                        {service.price > 0 ? `${service.price.toLocaleString()} ${service.currency}` : 'Free'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          service.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : service.status === 'draft'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-gray-100 text-gray-600'
                        }`}>
                          {service.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{service.isFeatured ? 'Yes' : 'No'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => setDetailOpen(false)}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back to services
          </button>

          <div className="min-w-0">
          {!currentService ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white p-12 text-center text-gray-400">
              Select a service from the list to edit its details.
            </div>
          ) : (
            <div className="space-y-6">
              <SectionRow
                title="Service identity"
                description="Name, slug, type, and publication state."
                icon={Settings2}
                actions={
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={duplicateService}>
                      <Copy size={16} />
                      Duplicate
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={deleteCurrentService}>
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </div>
                }
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Name (EN)</label>
                    <Input value={currentService.name} onChange={(e) => updateServiceName(e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Name (FR)</label>
                    <Input
                      value={currentService.nameFr}
                      onChange={(e) => updateService('nameFr', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Slug</label>
                    <Input
                      value={currentService.slug}
                      onChange={(e) => updateService('slug', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Service type</label>
                    <Select
                      value={currentService.serviceType}
                      onValueChange={(value) => updateService('serviceType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="table">Table</SelectItem>
                        <SelectItem value="private_dining">Private dining</SelectItem>
                        <SelectItem value="chefs_table">Chef&apos;s table</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
                    <Select
                      value={currentService.status}
                      onValueChange={(value) =>
                        updateService('status', value as ServiceEditor['status'])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">Short description</label>
                    <Textarea
                      value={currentService.shortDescription}
                      onChange={(e) => updateService('shortDescription', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">Full description</label>
                    <Textarea
                      className="min-h-32"
                      value={currentService.fullDescription}
                      onChange={(e) => updateService('fullDescription', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <ToggleButton
                    checked={currentService.isAvailable}
                    label="Available"
                    onClick={() => updateService('isAvailable', !currentService.isAvailable)}
                  />
                  <ToggleButton
                    checked={currentService.isFeatured}
                    label="Featured"
                    onClick={() => updateService('isFeatured', !currentService.isFeatured)}
                  />
                </div>
              </SectionRow>

              <SectionRow title="Pricing" description="Price, deposit, and tax rules." icon={CreditCard}>
                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Base price</label>
                    <Input
                      type="number"
                      value={currentService.price}
                      onChange={(e) => updateService('price', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Currency</label>
                    <Input
                      value={currentService.currency}
                      onChange={(e) => updateService('currency', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Price type</label>
                    <Select
                      value={currentService.priceType}
                      onValueChange={(value) =>
                        updateService('priceType', value as ServiceEditor['priceType'])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed</SelectItem>
                        <SelectItem value="from">From</SelectItem>
                        <SelectItem value="range">Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Deposit amount</label>
                    <Input
                      value={currentService.depositAmount}
                      onChange={(e) => updateService('depositAmount', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Deposit type</label>
                    <Select
                      value={currentService.depositType}
                      onValueChange={(value) =>
                        updateService('depositType', value as ServiceEditor['depositType'])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Tax rate (%)</label>
                    <Input
                      value={currentService.taxRate}
                      onChange={(e) => updateService('taxRate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <ToggleButton
                    checked={currentService.requiresDeposit}
                    label="Requires deposit"
                    onClick={() =>
                      updateService('requiresDeposit', !currentService.requiresDeposit)
                    }
                  />
                  <ToggleButton
                    checked={currentService.taxIncluded}
                    label="Tax included"
                    onClick={() => updateService('taxIncluded', !currentService.taxIncluded)}
                  />
                </div>
              </SectionRow>

              <SectionRow
                title="Availability"
                description="Duration, capacity, booking windows, and cancellation."
                icon={Clock}
              >
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Duration (min)</label>
                    <Input
                      value={currentService.durationMinutes}
                      onChange={(e) => updateService('durationMinutes', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Min people</label>
                    <Input
                      value={currentService.minPeople}
                      onChange={(e) => updateService('minPeople', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Max people</label>
                    <Input
                      value={currentService.maxPeople}
                      onChange={(e) => updateService('maxPeople', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Capacity / slot</label>
                    <Input
                      value={currentService.capacityPerSlot}
                      onChange={(e) => updateService('capacityPerSlot', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Start time</label>
                    <Input
                      type="time"
                      value={currentService.startTime}
                      onChange={(e) => updateService('startTime', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">End time</label>
                    <Input
                      type="time"
                      value={currentService.endTime}
                      onChange={(e) => updateService('endTime', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Advance booking (h)</label>
                    <Input
                      value={currentService.advanceBookingHours}
                      onChange={(e) => updateService('advanceBookingHours', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Cancel deadline (h)</label>
                    <Input
                      value={currentService.cancellationDeadlineHours}
                      onChange={(e) => updateService('cancellationDeadlineHours', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="mb-3 block text-sm font-medium text-gray-700">Available days</label>
                  <div className="flex flex-wrap gap-2">
                    {DAY_LABELS.slice(1).concat(DAY_LABELS[0]).map((day) => (
                      <ToggleButton
                        key={day}
                        checked={currentService.availableDays.includes(day)}
                        label={day}
                        onClick={() => toggleDay(day)}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Blackout dates</label>
                    <Input
                      value={currentService.blackoutDates}
                      onChange={(e) => updateService('blackoutDates', e.target.value)}
                      placeholder="2026-06-01, 2026-06-02"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Cancellation policy</label>
                    <Input
                      value={currentService.cancellationPolicy}
                      onChange={(e) => updateService('cancellationPolicy', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <ToggleButton
                    checked={currentService.requiresConfirmation}
                    label="Requires confirmation"
                    onClick={() =>
                      updateService('requiresConfirmation', !currentService.requiresConfirmation)
                    }
                  />
                  <ToggleButton
                    checked={currentService.instantBooking}
                    label="Instant booking"
                    onClick={() => updateService('instantBooking', !currentService.instantBooking)}
                  />
                  <ToggleButton
                    checked={currentService.allowCancellation}
                    label="Allow cancellation"
                    onClick={() =>
                      updateService('allowCancellation', !currentService.allowCancellation)
                    }
                  />
                </div>
              </SectionRow>

              <SectionRow
                title="Media & inclusions"
                description="Cover, gallery, included / excluded items, and add-ons."
                icon={ImageIcon}
              >
                <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
                  <div>
                    <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={currentService.coverImage}
                        alt="Service cover"
                        className="h-full w-full object-cover"
                      />
                      <label className="absolute bottom-3 right-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-900 shadow">
                        <FileImage size={14} />
                        Cover
                        <input type="file" accept="image/*" className="sr-only" onChange={handleCoverChange} />
                      </label>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700">
                      <Plus size={14} />
                      Gallery
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        onChange={handleGalleryChange}
                      />
                    </label>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {currentService.galleryImages.map((image, index) => (
                        <img
                          key={`${image}-${index}`}
                          src={image}
                          alt=""
                          className="aspect-square rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Included (one per line)</label>
                      <Textarea
                        className="min-h-28"
                        value={currentService.includedItems}
                        onChange={(e) => updateService('includedItems', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Excluded (one per line)</label>
                      <Textarea
                        className="min-h-28"
                        value={currentService.excludedItems}
                        onChange={(e) => updateService('excludedItems', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Add-ons</label>
                      <Textarea
                        className="min-h-24"
                        value={currentService.addOns}
                        onChange={(e) => updateService('addOns', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </SectionRow>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
}
