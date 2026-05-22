'use client';

import { useMemo, useState, type ChangeEvent } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  FileImage,
  Image as ImageIcon,
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
import { sampleBookableServices } from '@/lib/mockData';

type ServiceEditor = {
  id: number;
  name: string;
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
  status: 'draft' | 'active' | 'inactive' | 'archived';
  isFeatured: boolean;
};

const dayOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildInitialServices(): ServiceEditor[] {
  return sampleBookableServices.map((service) => ({
    id: service.id,
    name: service.name,
    slug: slugify(service.name),
    shortDescription: service.description,
    fullDescription: `${service.description} Guests can book this item from the Reserva client website with the rules configured here.`,
    serviceType: service.category.toLowerCase().replace(/\s+/g, '_'),
    price: service.price,
    priceType: service.priceType,
    priceFrom: service.priceFrom,
    priceTo: service.priceTo,
    currency: 'MAD',
    requiresDeposit: service.price >= 500,
    depositAmount: service.price >= 500 ? '30' : '0',
    depositType: 'percentage',
    taxIncluded: true,
    taxRate: '20',
    durationMinutes: service.duration.toString(),
    minPeople: '1',
    maxPeople: service.category === 'EVENTS' ? '12' : '6',
    capacityPerSlot: service.multipleProviders ? '4' : '1',
    isAvailable: service.visibility !== 'hidden',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    startTime: '10:00',
    endTime: '20:00',
    blackoutDates: '',
    advanceBookingHours: '24',
    cancellationDeadlineHours: '12',
    requiresConfirmation: service.onQuote,
    instantBooking: !service.onQuote,
    allowCancellation: true,
    cancellationPolicy: 'Cancellation allowed until 12 hours before the reservation.',
    includedItems: 'Reservation handling, guest confirmation, establishment follow-up',
    excludedItems: 'Transport, extra consumption, late arrival charges',
    addOns: 'Welcome drink - 80 MAD\nPrivate setup - 250 MAD',
    coverImage: '/tile.webp',
    galleryImages: ['/tile.webp'],
    status: service.visibility === 'hidden' ? 'inactive' : 'active',
    isFeatured: service.id <= 3,
  }));
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
        checked ? 'border-primary bg-primary text-primary-foreground' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
}

export default function ServicesManagementPage() {
  const [saved, setSaved] = useState(false);
  const [query, setQuery] = useState('');
  const [services, setServices] = useState<ServiceEditor[]>(buildInitialServices);
  const [selectedId, setSelectedId] = useState(1);

  const currentService = services.find((service) => service.id === selectedId) ?? services[0];

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return services;

    return services.filter((service) =>
      [service.name, service.slug, service.serviceType, service.status].some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [query, services]);

  const stats = useMemo(() => {
    const active = services.filter((service) => service.status === 'active').length;
    const featured = services.filter((service) => service.isFeatured).length;
    const avgPrice = Math.round(services.reduce((sum, service) => sum + service.price, 0) / Math.max(services.length, 1));
    const totalCapacity = services.reduce((sum, service) => sum + Number(service.capacityPerSlot || 0), 0);

    return { active, avgPrice, featured, totalCapacity };
  }, [services]);

  const updateService = <K extends keyof ServiceEditor>(field: K, value: ServiceEditor[K]) => {
    setServices((current) =>
      current.map((service) => {
        if (service.id !== currentService.id) return service;
        return { ...service, [field]: value };
      }),
    );
  };

  const updateServiceName = (value: string) => {
    setServices((current) =>
      current.map((service) => {
        if (service.id !== currentService.id) return service;
        return { ...service, name: value, slug: slugify(value) };
      }),
    );
  };

  const addService = () => {
    const nextId = Math.max(...services.map((service) => service.id)) + 1;
    const nextService: ServiceEditor = {
      ...currentService,
      id: nextId,
      name: 'New service',
      slug: 'new-service',
      shortDescription: '',
      fullDescription: '',
      price: 0,
      status: 'draft',
      isFeatured: false,
    };

    setServices((current) => [nextService, ...current]);
    setSelectedId(nextId);
  };

  const duplicateService = () => {
    const nextId = Math.max(...services.map((service) => service.id)) + 1;
    const nextService = {
      ...currentService,
      id: nextId,
      name: `${currentService.name} copy`,
      slug: `${currentService.slug}-copy`,
      status: 'draft' as const,
    };

    setServices((current) => [nextService, ...current]);
    setSelectedId(nextId);
  };

  const deleteCurrentService = () => {
    if (services.length <= 1) return;
    setServices((current) => current.filter((service) => service.id !== currentService.id));
    setSelectedId(services.find((service) => service.id !== currentService.id)?.id ?? 1);
  };

  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    updateService('coverImage', URL.createObjectURL(file));
  };

  const handleGalleryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    updateService('galleryImages', [...currentService.galleryImages, ...files.map((file) => URL.createObjectURL(file))].slice(0, 6));
  };

  const toggleDay = (day: string) => {
    updateService(
      'availableDays',
      currentService.availableDays.includes(day)
        ? currentService.availableDays.filter((currentDay) => currentDay !== day)
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
            <p className="text-sm text-gray-400">Bookable units attached to the establishment and shown on the client website.</p>
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

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <aside className="rounded-lg border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search services"
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            {filteredServices.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedId(service.id)}
                className={`w-full rounded-lg border p-4 text-left transition-all ${
                  service.id === currentService.id ? 'border-primary bg-primary/10' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{service.name}</p>
                    <p className="mt-1 text-xs text-gray-400">{service.slug}</p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] font-medium capitalize text-gray-600">{service.status}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{service.durationMinutes} min</span>
                  <span>{service.price.toLocaleString()} {service.currency}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-6">
          <section className="rounded-lg border border-gray-100 bg-white p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                  <Settings2 size={18} className="text-gray-500" />
                </div>
                <div>
                  <h2 className="text-xl font-light text-gray-900">Service identity</h2>
                  <p className="text-sm text-gray-400">Name, slug, type, and publication state.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={duplicateService}>
                  <Copy size={16} />
                  Duplicate
                </Button>
                <Button type="button" variant="outline" onClick={deleteCurrentService}>
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Name</label>
                <Input value={currentService.name} onChange={(event) => updateServiceName(event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Slug</label>
                <Input value={currentService.slug} onChange={(event) => updateService('slug', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Service type</label>
                <Select value={currentService.serviceType} onValueChange={(value) => updateService('serviceType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurants">Restaurants</SelectItem>
                    <SelectItem value="accommodation">Accommodation</SelectItem>
                    <SelectItem value="day_passes">Day passes</SelectItem>
                    <SelectItem value="wellness">Wellness</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="conciergerie">Conciergerie</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="custom_experience">Custom experience</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
                <Select value={currentService.status} onValueChange={(value) => updateService('status', value as ServiceEditor['status'])}>
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
                <Textarea value={currentService.shortDescription} onChange={(event) => updateService('shortDescription', event.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">Full description</label>
                <Textarea className="min-h-32" value={currentService.fullDescription} onChange={(event) => updateService('fullDescription', event.target.value)} />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <ToggleButton checked={currentService.isAvailable} label="Available" onClick={() => updateService('isAvailable', !currentService.isAvailable)} />
              <ToggleButton checked={currentService.isFeatured} label="Featured" onClick={() => updateService('isFeatured', !currentService.isFeatured)} />
            </div>
          </section>

          <section className="rounded-lg border border-gray-100 bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                <CreditCard size={18} className="text-gray-500" />
              </div>
              <div>
                <h2 className="text-xl font-light text-gray-900">Pricing</h2>
                <p className="text-sm text-gray-400">Price, deposit, and tax rules for checkout.</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Base price</label>
                <Input type="number" value={currentService.price} onChange={(event) => updateService('price', Number(event.target.value))} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Currency</label>
                <Input value={currentService.currency} onChange={(event) => updateService('currency', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Price type</label>
                <Select value={currentService.priceType} onValueChange={(value) => updateService('priceType', value as ServiceEditor['priceType'])}>
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
                <Input value={currentService.depositAmount} onChange={(event) => updateService('depositAmount', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Deposit type</label>
                <Select value={currentService.depositType} onValueChange={(value) => updateService('depositType', value as ServiceEditor['depositType'])}>
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
                <label className="mb-2 block text-sm font-medium text-gray-700">Tax rate</label>
                <Input value={currentService.taxRate} onChange={(event) => updateService('taxRate', event.target.value)} />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <ToggleButton checked={currentService.requiresDeposit} label="Requires deposit" onClick={() => updateService('requiresDeposit', !currentService.requiresDeposit)} />
              <ToggleButton checked={currentService.taxIncluded} label="Tax included" onClick={() => updateService('taxIncluded', !currentService.taxIncluded)} />
            </div>
          </section>

          <section className="rounded-lg border border-gray-100 bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                <Clock size={18} className="text-gray-500" />
              </div>
              <div>
                <h2 className="text-xl font-light text-gray-900">Availability</h2>
                <p className="text-sm text-gray-400">Duration, capacity, booking windows, and cancellation rules.</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Duration minutes</label>
                <Input value={currentService.durationMinutes} onChange={(event) => updateService('durationMinutes', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Min people</label>
                <Input value={currentService.minPeople} onChange={(event) => updateService('minPeople', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Max people</label>
                <Input value={currentService.maxPeople} onChange={(event) => updateService('maxPeople', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Capacity per slot</label>
                <Input value={currentService.capacityPerSlot} onChange={(event) => updateService('capacityPerSlot', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Start time</label>
                <Input type="time" value={currentService.startTime} onChange={(event) => updateService('startTime', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">End time</label>
                <Input type="time" value={currentService.endTime} onChange={(event) => updateService('endTime', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Advance booking hours</label>
                <Input value={currentService.advanceBookingHours} onChange={(event) => updateService('advanceBookingHours', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Cancellation deadline</label>
                <Input value={currentService.cancellationDeadlineHours} onChange={(event) => updateService('cancellationDeadlineHours', event.target.value)} />
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-3 block text-sm font-medium text-gray-700">Available days</label>
              <div className="flex flex-wrap gap-2">
                {dayOptions.map((day) => (
                  <ToggleButton key={day} checked={currentService.availableDays.includes(day)} label={day} onClick={() => toggleDay(day)} />
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Blackout dates</label>
                <Input value={currentService.blackoutDates} onChange={(event) => updateService('blackoutDates', event.target.value)} placeholder="2026-06-01, 2026-06-02" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Cancellation policy</label>
                <Input value={currentService.cancellationPolicy} onChange={(event) => updateService('cancellationPolicy', event.target.value)} />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <ToggleButton
                checked={currentService.requiresConfirmation}
                label="Requires confirmation"
                onClick={() => updateService('requiresConfirmation', !currentService.requiresConfirmation)}
              />
              <ToggleButton checked={currentService.instantBooking} label="Instant booking" onClick={() => updateService('instantBooking', !currentService.instantBooking)} />
              <ToggleButton
                checked={currentService.allowCancellation}
                label="Allow cancellation"
                onClick={() => updateService('allowCancellation', !currentService.allowCancellation)}
              />
            </div>
          </section>

          <section className="rounded-lg border border-gray-100 bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                <ImageIcon size={18} className="text-gray-500" />
              </div>
              <div>
                <h2 className="text-xl font-light text-gray-900">Media and details</h2>
                <p className="text-sm text-gray-400">Cover image, gallery, included items, excluded items, and add-ons.</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <div>
                <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                  <img src={currentService.coverImage} alt="Service cover" className="h-full w-full object-cover" />
                  <label className="absolute bottom-3 right-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-900">
                    <FileImage size={14} />
                    Cover
                    <input type="file" accept="image/*" className="sr-only" onChange={handleCoverChange} />
                  </label>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700">
                  <Plus size={14} />
                  Add gallery
                  <input type="file" accept="image/*" multiple className="sr-only" onChange={handleGalleryChange} />
                </label>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {currentService.galleryImages.map((image, index) => (
                    <img key={`${image}-${index}`} src={image} alt={`Service gallery ${index + 1}`} className="aspect-square rounded-lg object-cover" />
                  ))}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Included items</label>
                  <Textarea className="min-h-32" value={currentService.includedItems} onChange={(event) => updateService('includedItems', event.target.value)} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Excluded items</label>
                  <Textarea className="min-h-32" value={currentService.excludedItems} onChange={(event) => updateService('excludedItems', event.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Add-ons</label>
                  <Textarea className="min-h-28" value={currentService.addOns} onChange={(event) => updateService('addOns', event.target.value)} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
