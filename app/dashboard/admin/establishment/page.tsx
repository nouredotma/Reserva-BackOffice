'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
  cities,
  CUISINES_LOCALIZED,
  getOwnerCategory,
  getOwnerSubcategoryOptions,
  ownerEstablishment,
  ownerRestaurantDetails,
} from '@/lib/mock-data';

const cuisineOptions = Object.entries(CUISINES_LOCALIZED).map(([key, labels]) => ({
  key,
  label: labels.en,
}));

const MAX_GALLERY_IMAGES = 8;
const GALLERY_THUMB_WIDTH = 112;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function CollapsibleSection({
  title,
  icon: Icon,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-neutral-50/80"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100">
            <Icon size={18} className="text-gray-500" />
          </div>
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        </div>
        <ChevronDown
          size={20}
          className={`shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open ? <div className="border-t border-neutral-100 px-6 pb-6 pt-5">{children}</div> : null}
    </section>
  );
}

function GalleryCarousel({
  images,
  onRemove,
  onAdd,
}: {
  images: string[];
  onRemove: (index: number) => void;
  onAdd: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);
  const showAddSlot = images.length < MAX_GALLERY_IMAGES;

  const updateScrollState = useCallback(() => {
    const node = scrollRef.current;
    if (!node) {
      setCanScrollBack(false);
      setCanScrollForward(false);
      return;
    }
    const maxScroll = node.scrollWidth - node.clientWidth;
    setCanScrollBack(node.scrollLeft > 4);
    setCanScrollForward(node.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const node = scrollRef.current;
    if (!node) return;

    node.addEventListener('scroll', updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(node);

    return () => {
      node.removeEventListener('scroll', updateScrollState);
      observer.disconnect();
    };
  }, [images.length, showAddSlot, updateScrollState]);

  const scrollBy = (direction: 'back' | 'forward') => {
    scrollRef.current?.scrollBy({
      left: direction === 'back' ? -GALLERY_THUMB_WIDTH * 2 : GALLERY_THUMB_WIDTH * 2,
      behavior: 'smooth',
    });
  };

  const showNav = canScrollBack || canScrollForward;

  return (
    <div className="relative">
      {showNav ? (
        <>
          {canScrollBack ? (
            <button
              type="button"
              onClick={() => scrollBy('back')}
              className="absolute -left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-primary hover:text-gray-900"
              aria-label="Previous images"
            >
              <ChevronLeft size={16} />
            </button>
          ) : null}
          {canScrollForward ? (
            <button
              type="button"
              onClick={() => scrollBy('forward')}
              className="absolute -right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-primary hover:text-gray-900"
              aria-label="Next images"
            >
              <ChevronRight size={16} />
            </button>
          ) : null}
        </>
      ) : null}

      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((preview, index) => (
          <div
            key={`${preview}-${index}`}
            className="group relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-neutral-100"
          >
            <img src={preview} alt={`Gallery ${index + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute right-1.5 top-1.5 hidden h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-white text-gray-700 shadow group-hover:flex"
              aria-label={`Remove image ${index + 1}`}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        {showAddSlot ? (
          <label className="flex h-20 w-28 shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-neutral-100 text-gray-400 transition-colors hover:border-primary hover:bg-primary/5 hover:text-gray-700">
            <Plus size={20} className="text-gray-400 transition-colors group-hover:text-primary" />
            <input type="file" accept="image/*" multiple className="sr-only" onChange={onAdd} />
          </label>
        ) : null}
      </div>
    </div>
  );
}

export default function EstablishmentManagementPage() {
  const ownerCategory = getOwnerCategory();
  const subcategoryOptions = getOwnerSubcategoryOptions();

  const coverInputRef = useRef<HTMLInputElement>(null);
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
    shortDescriptionFr: ownerEstablishment.short_description_fr,
    fullDescription: ownerEstablishment.full_description,
    fullDescriptionFr: ownerEstablishment.full_description_fr,
    cityId: ownerEstablishment.city_id,
    address: ownerEstablishment.address,
    latitude: String(ownerEstablishment.coordinates.lat),
    longitude: String(ownerEstablishment.coordinates.lng),
    phone: ownerEstablishment.phone,
    email: ownerEstablishment.email,
    website: ownerEstablishment.website ?? '',
    priceLevel: ownerEstablishment.price_level,
    status: ownerEstablishment.status === 'active' ? 'active' : 'inactive',
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
    event.target.value = '';
  };

  const handleGalleryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setGalleryPreviews((current) =>
      [...current, ...files.map((file) => URL.createObjectURL(file))].slice(0, MAX_GALLERY_IMAGES),
    );
    event.target.value = '';
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
    () => subcategoryOptions.find((s) => s.key === form.subcategory)?.label ?? 'Select subcategory',
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

  const hasCover = Boolean(coverPreview);

  return (
    <div className="min-h-screen pb-16">
      <div className="mb-10 pt-20">
        <h1 className="mb-2 text-5xl font-light tracking-tight text-gray-900">Establishment</h1>
        <p className="text-sm text-neutral-500">
          Manage your {ownerCategory?.label?.toLowerCase() ?? 'venue'} public profile and listing details.
        </p>
      </div>

      <div className="space-y-4">
        <CollapsibleSection title="Photos" icon={ImageIcon} defaultOpen>
          <div className="space-y-5">
            <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-xl bg-neutral-100">
              {hasCover ? (
                <img
                  src={coverPreview}
                  alt="Establishment cover"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center border border-dashed border-neutral-200 bg-neutral-100">
                  <ImageIcon size={28} className="text-gray-300" />
                </div>
              )}
              <label className="absolute bottom-4 right-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:border-primary hover:bg-primary/5">
                <FileImage size={16} />
                {hasCover ? 'Change cover' : 'Add cover'}
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleCoverChange}
                />
              </label>
            </div>

            <GalleryCarousel
              images={galleryPreviews}
              onRemove={(index) =>
                setGalleryPreviews((current) => current.filter((_, imageIndex) => imageIndex !== index))
              }
              onAdd={handleGalleryChange}
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Identity" icon={Building2}>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Name (EN)</label>
              <Input value={form.name} onChange={(event) => handleNameChange(event.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Name (FR)</label>
              <Input value={form.nameFr} onChange={(event) => updateField('nameFr', event.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Short description (EN)</label>
              <Textarea
                value={form.shortDescription}
                onChange={(event) => updateField('shortDescription', event.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Short description (FR)</label>
              <Textarea
                value={form.shortDescriptionFr}
                onChange={(event) => updateField('shortDescriptionFr', event.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Full description (EN)</label>
              <Textarea
                className="min-h-28"
                value={form.fullDescription}
                onChange={(event) => updateField('fullDescription', event.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Full description (FR)</label>
              <Textarea
                className="min-h-28"
                value={form.fullDescriptionFr}
                onChange={(event) => updateField('fullDescriptionFr', event.target.value)}
              />
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Contact" icon={Mail}>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Slug</label>
              <Input value={form.slug} disabled className="cursor-not-allowed bg-neutral-50 text-gray-600" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
              <Select value={form.status} onValueChange={(value) => updateField('status', value)}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Price level</label>
              <Select value={form.priceLevel} onValueChange={(value) => updateField('priceLevel', value)}>
                <SelectTrigger className="cursor-pointer">
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
        </CollapsibleSection>

        <CollapsibleSection title="Category & cuisine" icon={Tag}>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Lock size={14} className="text-gray-400" />
                Category
              </label>
              <div className="flex h-10 items-center rounded-full border border-dashed border-neutral-200 bg-neutral-50 px-3 text-sm text-gray-700">
                {ownerCategory?.label ?? ownerEstablishment.category}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Subcategory</label>
              <Select value={form.subcategory} onValueChange={(value) => updateField('subcategory', value)}>
                <SelectTrigger className="cursor-pointer">
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

          <div className="mt-5">
            <label className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Utensils size={14} />
              Cuisine
            </label>
            <div className="flex flex-wrap gap-2">
              {cuisineOptions.map((cuisine) => {
                const selected = form.cuisineTypes.includes(cuisine.key);
                return (
                  <button
                    key={cuisine.key}
                    type="button"
                    onClick={() => toggleCuisine(cuisine.key)}
                    className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                      selected
                        ? 'border-primary bg-primary/10 text-gray-900'
                        : 'border-neutral-200 text-gray-600 hover:border-primary/60'
                    }`}
                  >
                    {cuisine.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">Tags</label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add a tag"
              />
              <Button type="button" variant="outline" onClick={addTag} className="cursor-pointer shrink-0">
                <Plus size={16} />
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="cursor-pointer rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Location" icon={MapPin}>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">City</label>
              <Select value={form.cityId} onValueChange={(value) => updateField('cityId', value)}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
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
            <Button type="button" variant="outline" onClick={useCurrentLocation} className="cursor-pointer">
              <Navigation size={16} />
              Use current location
            </Button>
            {locationStatus ? <span className="text-sm text-gray-500">{locationStatus}</span> : null}
          </div>
        </CollapsibleSection>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-neutral-100 pt-8">
          {saved ? (
            <span className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 size={16} />
              Saved
            </span>
          ) : null}
          <Button type="button" size="lg" onClick={saveProfile} className="cursor-pointer">
            <Save size={16} />
            Save establishment
          </Button>
        </div>
      </div>
    </div>
  );
}
