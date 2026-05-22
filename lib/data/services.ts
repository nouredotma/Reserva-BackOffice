import type { Service } from "../reserva-types";
import { OWNER_ESTABLISHMENT_ID } from "./owner";

const NOW = "2026-01-15T10:00:00Z";
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

const D: Omit<
  Service,
  | "id"
  | "establishment_id"
  | "name"
  | "name_fr"
  | "slug"
  | "short_description"
  | "service_type"
  | "price"
  | "cover_image"
> = {
  currency: "MAD",
  requires_deposit: false,
  tax_included: true,
  tax_rate: 0.1,
  min_people: 1,
  max_people: 2,
  capacity_per_slot: 5,
  is_available: true,
  available_days: ALL_DAYS,
  start_time: "12:00",
  end_time: "23:00",
  blackout_dates: [],
  advance_booking_hours: 24,
  cancellation_deadline_hours: 2,
  requires_confirmation: false,
  instant_booking: true,
  allow_cancellation: true,
  cancellation_policy: "Free cancellation up to 2 hours before reservation.",
  included_items: [],
  excluded_items: [],
  add_ons: [],
  gallery_images: [],
  status: "active",
  is_featured: false,
  sort_order: 1,
  created_at: NOW,
  updated_at: NOW,
};

/** Bookable units for the logged-in establishment. */
export const ownerServices: Service[] = [
  {
    ...D,
    id: "sv-r1-1",
    establishment_id: OWNER_ESTABLISHMENT_ID,
    name: "Table Reservation",
    name_fr: "Réservation de Table",
    slug: "table-reservation",
    short_description: "Reserve a table in the garden or indoor dining area.",
    short_description_fr:
      "Réservez une table dans le jardin ou la salle intérieure.",
    full_description:
      "Standard table booking with garden or indoor seating. Ideal for lunch or dinner in the Medina oasis.",
    full_description_fr:
      "Réservation de table standard avec sièges au jardin ou en salle.",
    service_type: "table",
    price: 0,
    duration_minutes: 90,
    min_people: 1,
    max_people: 6,
    capacity_per_slot: 12,
    advance_booking_hours: 2,
    cover_image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
    ],
    is_featured: true,
    sort_order: 1,
  },
  {
    ...D,
    id: "sv-r1-2",
    establishment_id: OWNER_ESTABLISHMENT_ID,
    name: "Private Garden Dining",
    name_fr: "Dîner Privé au Jardin",
    slug: "private-garden",
    short_description:
      "Exclusive private dining setup in a secluded corner of the garden.",
    short_description_fr:
      "Dîner privé exclusif dans un coin isolé du jardin.",
    full_description:
      "Private garden corner with dedicated waiter, candles, and flowers. Deposit required; confirmation by the team.",
    full_description_fr:
      "Coin privé du jardin avec serveur dédié. Acompte requis ; confirmation par l'équipe.",
    service_type: "private_dining",
    price: 2000,
    duration_minutes: 120,
    min_people: 2,
    max_people: 10,
    capacity_per_slot: 1,
    requires_deposit: true,
    deposit_amount: 2000,
    deposit_type: "fixed",
    requires_confirmation: true,
    instant_booking: false,
    advance_booking_hours: 48,
    included_items: ["Private setup", "Dedicated waiter", "Candles & flowers"],
    add_ons: [
      {
        name: "Welcome juice pairing",
        name_fr: "Accord jus de bienvenue",
        price: 120,
      },
      {
        name: "Birthday cake",
        name_fr: "Gâteau d'anniversaire",
        price: 350,
      },
    ],
    cover_image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80",
    ],
    sort_order: 2,
  },
  {
    ...D,
    id: "sv-r1-3",
    establishment_id: OWNER_ESTABLISHMENT_ID,
    name: "Chef's Table Experience",
    name_fr: "Expérience Chef's Table",
    slug: "chefs-table",
    short_description: "Intimate tasting menu at the chef's table with wine pairing.",
    short_description_fr:
      "Menu dégustation intimiste à la table du chef avec accord mets-vins.",
    full_description:
      "Six-course tasting menu for up to 4 guests. Requires 72h advance booking and full prepayment.",
    full_description_fr:
      "Menu dégustation six services pour 4 convives maximum.",
    service_type: "chefs_table",
    price: 1200,
    duration_minutes: 150,
    min_people: 2,
    max_people: 4,
    capacity_per_slot: 1,
    requires_deposit: true,
    deposit_amount: 50,
    deposit_type: "percentage",
    requires_confirmation: true,
    instant_booking: false,
    advance_booking_hours: 72,
    cancellation_deadline_hours: 48,
    included_items: ["Six-course menu", "Wine pairing", "Chef introduction"],
    cover_image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
    status: "active",
    is_featured: true,
    sort_order: 3,
  },
];
