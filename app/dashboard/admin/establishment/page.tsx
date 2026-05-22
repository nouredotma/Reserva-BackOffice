'use client';

import { useMemo, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import {
  Building2,
  CheckCircle2,
  FileImage,
  Globe2,
  Image as ImageIcon,
  Lock,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Plus,
  Save,
  Tag,
  Trash2,
  Utensils,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  CUISINES_LOCALIZED,
  getOwnerCategory,
  getOwnerCity,
  getOwnerSubcategoryOptions,
  ownerEstablishment,
  ownerRestaurantDetails,
} from '@/lib/mock-data';

const cuisineOptions = Object.entries(CUISINES_LOCALIZED).map(([key, labels]) => ({
  key,
  label: labels.en,
}));

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function SectionRow({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
          <Icon size={18} className="text-gray-500" />
        </div>
        <div>
          <h2 className="text-xl font-light text-gray-900">{title}</h2>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function EstablishmentManagementPage() {
  const ownerCategory = getOwnerCategory();
  const ownerCity = getOwnerCity();
  const subcategoryOptions = getOwnerSubcategoryOptions();

  const [saved, setSaved] = useState(false);
  const [coverPreview, setCoverPreview] = useState(ownerEstablishment.cover_image);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(ownerEstablishment.gallery_images);
  const [tagInput, setTagInput] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [form, setForm] = useState({
    name: ownerEstablishment.name,
    nameFr: ownerEstablishment.name_fr,
    slug: ownerEstablishment.slug,
    subcategory: ownerEstablishment.subcategory ?? '',
    cuisineTypes: [...ownerRestaurantDetails.cuisine_type],
    shortDescription: ownerEstablishment.short_description,
    fullDescription: ownerEstablishment.full_description,
    cityId: ownerEstablishment.city_id,
    address: ownerEstablishment.address,
    latitude: String(ownerEstablishment.coordinates.lat),
    longitude: String(ownerEstablishment.coordinates.lng),
    phone: ownerEstablishment.phone,
    email: ownerEstablishment.email,
    website: ownerEstablishment.website ?? '',
    priceLevel: ownerEstablishment.price_level,
    status: ownerEstablishment.status,
    tags: [...ownerEstablishment.tags],
  });

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
    setGalleryPreviews((current) =>
      [...current, ...files.map((file) => URL.createObjectURL(file))].slice(0, 8),
    );
  };

  const toggleCuisine = (key: string) => {
    setForm((current) => ({
      ...current,
      cuisineTypes: current.cuisineTypes.includes(key)
        ? current.cuisineTypes.filter((item) => item !== key)
        : [...current.cuisineTypes, key],
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

  const selectedSubcategoryLabel = useMemo(
    () => subcategoryOptions.find((s) => s.key === form.subcategory)?.label ?? 'Not set',
    [form.subcategory, subcategoryOptions],
  );

  const saveProfile = () => {
    localStorage.setItem(
      'establishment_profile_settings',
      JSON.stringify({ ...form, coverPreview, galleryPreviews }),
    );
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
            <p className="text-sm text-gray-400">
              Public venue profile for {ownerCategory?.label ?? 'your category'} — aligned with the Reserva client model.
            </p>
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

      <div className="space-y-6">
        {/* Row 1 — Media */}
        <SectionRow
          title="Photos"
          description="Cover image and gallery shown on your public listing."
          icon={ImageIcon}
        >
          <div className="space-y-6">
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">Cover image</label>
              <div className="relative h-56 overflow-hidden rounded-xl bg-gray-100 md:h-72">
                <img src={coverPreview} alt="Establishment cover" className="h-full w-full object-cover" />
                <label className="absolute bottom-4 right-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm">
                  <FileImage size={16} />
                  Change cover
                  <input type="file" accept="image/*" className="sr-only" onChange={handleCoverChange} />
                </label>
              </div>
            </div>
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Gallery</label>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-gray-700">
                  <Plus size={14} />
                  Add images
                  <input type="file" accept="image/*" multiple className="sr-only" onChange={handleGalleryChange} />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {galleryPreviews.map((preview, index) => (
                  <div
                    key={`${preview}-${index}`}
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100"
                  >
                    <img src={preview} alt={`Gallery ${index + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        setGalleryPreviews((current) => current.filter((_, imageIndex) => imageIndex !== index))
                      }
                      className="absolute right-2 top-2 hidden h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-gray-700 shadow group-hover:flex"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionRow>

        {/* Row 2 — Name & descriptions */}
        <SectionRow
          title="Identity"
          description="Name and descriptions in English and French."
          icon={Building2}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Name (EN)</label>
              <Input value={form.name} onChange={(event) => handleNameChange(event.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Name (FR)</label>
              <Input value={form.nameFr} onChange={(event) => updateField('nameFr', event.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">Short description</label>
              <Textarea
                value={form.shortDescription}
                onChange={(event) => updateField('shortDescription', event.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">Full description</label>
              <Textarea
                className="min-h-32"
                value={form.fullDescription}
                onChange={(event) => updateField('fullDescription', event.target.value)}
              />
            </div>
          </div>
        </SectionRow>

        {/* Row 3 — Contact & publication */}
        <SectionRow
          title="Contact & status"
          description="Slug, publication state, price level, and client contact channels."
          icon={Mail}
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
        </SectionRow>

        {/* Row 4 — Category, subcategory, cuisines, tags */}
        <SectionRow
          title="Category & discovery"
          description="Category is set by Reserva super admin. Choose one subcategory and your cuisines."
          icon={Tag}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Lock size={14} className="text-gray-400" />
                Category (super admin)
              </label>
              <div className="flex h-10 items-center rounded-full border border-dashed border-neutral-200 bg-gray-50 px-3 text-sm text-gray-700">
                {ownerCategory?.label ?? ownerEstablishment.category}
              </div>
              <p className="mt-1 text-xs text-gray-400">Each establishment belongs to one category only.</p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Subcategory</label>
              <Select value={form.subcategory} onValueChange={(value) => updateField('subcategory', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory">{selectedSubcategoryLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {subcategoryOptions.map((sub) => (
                    <SelectItem key={sub.key} value={sub.key}>
                      {sub.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Utensils size={14} />
              Cuisines (super admin catalog)
            </label>
            <div className="flex flex-wrap gap-2">
              {cuisineOptions.map((cuisine) => {
                const selected = form.cuisineTypes.includes(cuisine.key);
                return (
                  <button
                    key={cuisine.key}
                    type="button"
                    onClick={() => toggleCuisine(cuisine.key)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                      selected
                        ? 'border-primary bg-primary/10 text-gray-900'
                        : 'border-neutral-200 text-gray-600 hover:border-neutral-300'
                    }`}
                  >
                    {cuisine.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">Tags</label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add a tag"
              />
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
        </SectionRow>

        {/* Row 5 — Location */}
        <SectionRow
          title="Location"
          description={`${ownerCity?.name ?? 'City'}, address, and map coordinates.`}
          icon={MapPin}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">City</label>
              <div className="flex h-10 items-center rounded-full border border-neutral-200 bg-white px-3 text-sm text-gray-700">
                {ownerCity?.name ?? form.cityId}
              </div>
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
        </SectionRow>
      </div>
    </div>
  );
}
