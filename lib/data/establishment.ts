import type { Establishment } from "../reserva-types";

const NOW = "2026-01-15T10:00:00Z";

/** The venue managed in this back office (Le Jardin — restaurants). */
export const ownerEstablishment: Establishment = {
  id: "r1",
  owner_id: "owner-6",
  name: "Le Jardin",
  name_fr: "Le Jardin",
  slug: "le-jardin",
  category: "restaurants",
  subcategory: "romantic-restaurant",
  short_description:
    "A hidden garden oasis in the Medina serving refined Moroccan and international cuisine.",
  short_description_fr:
    "Une oasis-jardin cachée dans la Médina servant une cuisine marocaine et internationale raffinée.",
  full_description:
    "Le Jardin is tucked away in the heart of the Medina, offering a peaceful garden setting with creative Moroccan dishes and fresh juices under banana trees.",
  full_description_fr:
    "Le Jardin est niché au cœur de la Médina, offrant un cadre de jardin paisible avec des plats marocains créatifs.",
  city_id: "marrakesh",
  address: "32 Souk Sidi Abdelaziz, Marrakesh 40000",
  coordinates: { lat: 31.63, lng: -7.982 },
  phone: "+212 5243-78295",
  email: "contact@lejardin-marrakech.com",
  website: "https://lejardin-marrakech.com",
  cover_image:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
  gallery_images: [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
  ],
  rating: 4.7,
  review_count: 523,
  price_level: "$$$",
  tags: ["Moroccan", "Garden", "Romantic", "Terrace"],
  is_featured: true,
  status: "active",
  sort_order: 1,
  created_at: NOW,
  updated_at: NOW,
};
