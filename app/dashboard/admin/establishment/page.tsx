'use client';

import { useMemo, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import {
  Building2,
  CheckCircle2,
  FileImage,
  Globe2,
  Image as ImageIcon,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Plus,
  Save,
  Tag,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const categories = [
  { key: 'wellness', label: 'Wellness & Fitness' },
  { key: 'day-passes', label: 'Day pass' },
  { key: 'conciergerie', label: 'Concierge' },
  { key: 'spectacles', label: 'Tickets & Spectacles' },
  { key: 'voyage', label: 'Travel' },
  { key: 'corporate', label: 'Corporate' },
  { key: 'services', label: 'Services' },
  { key: 'restaurants', label: 'Restaurants' },
];

const subcategories: Record<string, string[]> = {
  wellness: [
    'Hair Salons & Barbers',
    'Manicure & Pedicure',
    'Hammam & Wellness Rituals',
    'Aesthetic Clinics & Skincare',
    'Home Massage',
    'Personal Coaches',
    'Gym',
    'Nutritionist Consultations',
    'Golf Course Booking',
    'Tennis / Padel Courts',
  ],
  'day-passes': [
    'Beach Clubs',
    'Pool Day Pass',
    'Kids Club & Family Activities',
    'Private Villa Experiences',
    'Yacht / Boat Rental',
    'Bike / Moto / Quad Rental',
    'Desert Camps & Excursions',
    'Guided City Tours',
  ],
  conciergerie: [
    'Airport Fast-Track',
    'Luxury Chauffeur',
    'Private Jets / Helicopters',
    'Bodyguard',
    'VIP Nightlife Tables',
    'Chat Concierge',
    'Personal Shopper',
    'Last-Minute Bookings',
  ],
  spectacles: ['Cinema Tickets', 'Theatre & Comedy Shows', 'Festival Passes', 'Museums & Exhibitions', 'Escape Games', 'Gaming Lounges'],
  voyage: ['Flights', 'Train Tickets', 'Car Rental', 'Travel Insurance', 'Weekend & Custom Stays'],
  corporate: ['Team Lunch Booking', 'Corporate Wellness Packs', 'Meeting Room Booking', 'Corporate Events', 'Employee Benefits Marketplace'],
  services: [
    'Cleaning',
    'Pressing Pickup & Delivery',
    'Private Chef',
    'Babysitting',
    'Pet Grooming & Sitting',
    "Chef's Table",
    'Exclusive Tasting Menus',
    'Private Events',
    'Art Workshops',
    'Sunset Rooftop Experiences',
  ],
  restaurants: [
    'Brunch & Cafes',
    'Buffets & All-You-Can-Eat',
    'Fine Dining',
    'Rooftops & Lounges',
    "Chef's Table & Private Dining",
    'Tea Time & Pastries',
    'Family Restaurants',
    'Romantic Restaurants',
    'Live Music Restaurants',
    'Karaoke Rooms',
    'Tasting Menus',
    'Event Dinners',
    'VIP Tables',
    'Exclusive Offers & Experiences',
  ],
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function EstablishmentManagementPage() {
  const [saved, setSaved] = useState(false);
  const [coverPreview, setCoverPreview] = useState('/tile.webp');
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(['/tile.webp', '/logo.png']);
  const [tagInput, setTagInput] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [form, setForm] = useState({
    name: 'Le Jardin Reserva',
    nameFr: 'Le Jardin Reserva',
    slug: 'le-jardin-reserva',
    category: 'restaurants',
    subcategoryValues: ['Fine Dining', 'Rooftops & Lounges'],
    shortDescription: 'Premium dining and private event reservations in the heart of Marrakech.',
    fullDescription:
      'A refined establishment profile built for public booking pages, with table reservations, private events, deposits, and guest follow-up.',
    city: 'Marrakesh',
    address: 'Rue Haroun Errachid, Hivernage, Marrakech',
    latitude: '31.6211',
    longitude: '-8.0023',
    phone: '+212 5 24 44 00 00',
    email: 'contact@lejardin-reserva.ma',
    website: 'https://lejardin-reserva.ma',
    priceLevel: '$$$',
    status: 'active',
    tags: ['terrace', 'fine dining', 'private events'],
  });

  const availableSubcategories = useMemo(() => subcategories[form.category] ?? [], [form.category]);

  const updateField = (field: keyof typeof form, value: string | string[]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleNameChange = (value: string) => {
    setForm((current) => ({ ...current, name: value, slug: slugify(value) }));
  };

  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setGalleryPreviews((current) => [...current, ...files.map((file) => URL.createObjectURL(file))].slice(0, 8));
  };

  const toggleSubcategory = (value: string) => {
    setForm((current) => ({
      ...current,
      subcategoryValues: current.subcategoryValues.includes(value)
        ? current.subcategoryValues.filter((item) => item !== value)
        : [...current.subcategoryValues, value],
    }));
  };

  const addTag = () => {
    const nextTag = tagInput.trim();
    if (!nextTag || form.tags.includes(nextTag)) return;
    setForm((current) => ({ ...current, tags: [...current.tags, nextTag] }));
    setTagInput('');
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag: string) => {
    setForm((current) => ({ ...current, tags: current.tags.filter((item) => item !== tag) }));
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Current location is not available in this browser.');
      return;
    }

    setLocationStatus('Requesting current location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => ({
          ...current,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setLocationStatus('Coordinates updated from this device.');
      },
      () => setLocationStatus('Location access was not allowed.'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const saveProfile = () => {
    localStorage.setItem('establishment_profile_settings', JSON.stringify(form));
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
            <h1 className="mb-2 text-5xl font-light tracking-tight text-gray-900">Establishment</h1>
            <p className="text-sm text-gray-400">Public venue profile mapped to the client-side establishment model.</p>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                <CheckCircle2 size={16} />
                Saved
              </span>
            )}
            <Button type="button" size="lg" onClick={saveProfile}>
              <Save size={16} />
              Save establishment
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-lg border border-gray-100 bg-white">
            <div className="relative h-56 bg-gray-100">
              <img src={coverPreview} alt="Establishment cover" className="h-full w-full object-cover" />
              <label className="absolute bottom-4 right-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900">
                <FileImage size={16} />
                Cover
                <input type="file" accept="image/*" className="sr-only" onChange={handleCoverChange} />
              </label>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-light text-gray-900">{form.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{form.shortDescription}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-light text-gray-900">Gallery</h2>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700">
                <Plus size={14} />
                Add images
                <input type="file" accept="image/*" multiple className="sr-only" onChange={handleGalleryChange} />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {galleryPreviews.map((preview, index) => (
                <div key={`${preview}-${index}`} className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                  <img src={preview} alt={`Gallery ${index + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setGalleryPreviews((current) => current.filter((_, imageIndex) => imageIndex !== index))}
                    className="absolute right-2 top-2 hidden h-8 w-8 items-center justify-center rounded-full bg-white text-gray-700 group-hover:flex"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-gray-100 bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                <Building2 size={18} className="text-gray-500" />
              </div>
              <div>
                <h2 className="text-xl font-light text-gray-900">Identity</h2>
                <p className="text-sm text-gray-400">Core fields from the establishments table.</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Name</label>
                <Input value={form.name} onChange={(event) => handleNameChange(event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Name FR</label>
                <Input value={form.nameFr} onChange={(event) => updateField('nameFr', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Slug</label>
                <Input value={form.slug} onChange={(event) => updateField('slug', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
                <Select value={form.status} onValueChange={(value) => updateField('status', value)}>
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
                <Textarea value={form.shortDescription} onChange={(event) => updateField('shortDescription', event.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">Full description</label>
                <Textarea className="min-h-32" value={form.fullDescription} onChange={(event) => updateField('fullDescription', event.target.value)} />
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-gray-100 bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                <Tag size={18} className="text-gray-500" />
              </div>
              <div>
                <h2 className="text-xl font-light text-gray-900">Category and tags</h2>
                <p className="text-sm text-gray-400">Categories are managed by the super admin; the owner selects where this venue appears.</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
                <Select
                  value={form.category}
                  onValueChange={(value) => setForm((current) => ({ ...current, category: value, subcategoryValues: [] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.key} value={category.key}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Price level</label>
                <Select value={form.priceLevel} onValueChange={(value) => updateField('priceLevel', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$">$</SelectItem>
                    <SelectItem value="$$">$$</SelectItem>
                    <SelectItem value="$$$">$$$</SelectItem>
                    <SelectItem value="$$$$">$$$$</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-3 block text-sm font-medium text-gray-700">Subcategories</label>
              <div className="grid gap-3 md:grid-cols-2">
                {availableSubcategories.map((subcategory) => (
                  <button
                    key={subcategory}
                    type="button"
                    onClick={() => toggleSubcategory(subcategory)}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all ${
                      form.subcategoryValues.includes(subcategory)
                        ? 'border-primary bg-primary/10 text-gray-900'
                        : 'border-gray-100 text-gray-600 hover:border-gray-200'
                    }`}
                  >
                    <Checkbox checked={form.subcategoryValues.includes(subcategory)} onCheckedChange={() => undefined} />
                    {subcategory}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Tags</label>
              <div className="flex gap-2">
                <Input value={tagInput} onChange={(event) => setTagInput(event.target.value)} onKeyDown={handleTagKeyDown} placeholder="Add a tag" />
                <Button type="button" variant="outline" onClick={addTag}>
                  <Plus size={16} />
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-red-50 hover:text-red-600"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-gray-100 bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                <MapPin size={18} className="text-gray-500" />
              </div>
              <div>
                <h2 className="text-xl font-light text-gray-900">Location</h2>
                <p className="text-sm text-gray-400">City, address, and exact map coordinates for the public listing.</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">City</label>
                <Select value={form.city} onValueChange={(value) => updateField('city', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Casablanca">Casablanca</SelectItem>
                    <SelectItem value="Marrakesh">Marrakesh</SelectItem>
                    <SelectItem value="Rabat">Rabat</SelectItem>
                    <SelectItem value="Tangier">Tangier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Address</label>
                <Input value={form.address} onChange={(event) => updateField('address', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Latitude</label>
                <Input value={form.latitude} onChange={(event) => updateField('latitude', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Longitude</label>
                <Input value={form.longitude} onChange={(event) => updateField('longitude', event.target.value)} />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button type="button" variant="outline" onClick={useCurrentLocation}>
                <Navigation size={16} />
                Use current location
              </Button>
              {locationStatus && <span className="text-sm text-gray-500">{locationStatus}</span>}
            </div>
          </section>

          <section className="rounded-lg border border-gray-100 bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                <ImageIcon size={18} className="text-gray-500" />
              </div>
              <div>
                <h2 className="text-xl font-light text-gray-900">Contact</h2>
                <p className="text-sm text-gray-400">Public communication channels shown on the client website.</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Phone size={14} />
                  Phone
                </label>
                <Input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail size={14} />
                  Email
                </label>
                <Input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Globe2 size={14} />
                  Website
                </label>
                <Input value={form.website} onChange={(event) => updateField('website', event.target.value)} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
