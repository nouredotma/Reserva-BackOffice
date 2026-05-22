// ─── Enums & Shared Types ────────────────────────────────────────────────────

export type EstablishmentCategory =
  | "wellness"
  | "day-passes"
  | "conciergerie"
  | "spectacles"
  | "voyage"
  | "corporate"
  | "services"
  | "restaurants"
export type EstablishmentStatus = "draft" | "active" | "inactive" | "archived"
export type PriceLevel = "$" | "$$" | "$$$" | "$$$$"
export type DepositType = "fixed" | "percentage"
export type ServiceStatus = "draft" | "active" | "inactive" | "archived"
export type PropertyType = "hotel" | "riad" | "villa" | "apartment" | "resort" | "guesthouse"
export type DressCode = "casual" | "smart_casual" | "formal"
export type SpaType = "hammam" | "day_spa" | "wellness_center" | "resort_spa"
export type BookingMode = "appointment" | "reservation" | "ticket" | "request"

export interface Coordinates {
  lat: number
  lng: number
}

// ─── Table 1: Cities ─────────────────────────────────────────────────────────

export interface City {
  id: string
  name: string
  name_fr: string
  slug: string
  region: string
  region_fr: string
  image: string
  coordinates: Coordinates
  description?: string
  description_fr?: string
  listings_count: Record<EstablishmentCategory, number>
}

// ─── Table 2: Establishments ─────────────────────────────────────────────────

export interface Establishment {
  id: string
  owner_id: string
  name: string
  name_fr: string
  slug: string
  category: EstablishmentCategory
  subcategory?: string
  short_description: string
  short_description_fr: string
  full_description: string
  full_description_fr: string
  city_id: string
  address: string
  coordinates: Coordinates
  phone: string
  email: string
  website?: string
  cover_image: string
  gallery_images: string[]
  rating: number
  review_count: number
  price_level: PriceLevel
  tags: string[]
  is_featured: boolean
  status: EstablishmentStatus
  sort_order: number
  created_at: string
  updated_at: string
}

// ─── Table 3: Voyage Details (Hotels / Stays) ───────────────────────────────

export interface VoyageDetails {
  establishment_id: string
  star_rating: number
  property_type: PropertyType
  check_in_time: string
  check_out_time: string
  total_rooms: number
  amenities: string[]
  house_rules: {
    smoking: boolean
    pets: boolean
    parties: boolean
    [key: string]: boolean
  }
  languages_spoken: string[]
  cancellation_policy: string
}

// ─── Table 4: Restaurants Details ────────────────────────────────────────────

export interface RestaurantDetails {
  establishment_id: string
  cuisine_type: string[]
  opening_hours: Record<string, { open: string; close: string }>
  dress_code: DressCode
  seating_options: string[]
  total_seats: number
  average_meal_duration: number
  accepts_walkins: boolean
  alcohol_served: boolean
  dietary_options: string[]
  menu_url?: string
  cancellation_policy: string
}

// ─── Table 5: Wellness Details (Spas / Wellness) ─────────────────────────────

export interface WellnessDetails {
  establishment_id: string
  spa_type: SpaType
  facilities: string[]
  opening_hours: Record<string, { open: string; close: string }>
  therapist_gender_available: string[]
  couple_treatments: boolean
  products_used: string[]
  general_contraindications?: string
  preparation_time_minutes: number
  cancellation_policy: string
}

// ─── Table 6: Day Pass Details ───────────────────────────────────────────────

export interface DayPassDetails {
  establishment_id: string
  facilities_included: string[]
  opening_hours: Record<string, { open: string; close: string }>
  kids_allowed: boolean
  towels_provided: boolean
  cancellation_policy: string
}

// ─── Table 7: Spectacles Details (Events / Entertainment) ────────────────────

export interface SpectaclesDetails {
  establishment_id: string
  event_type: string
  date: string
  start_time: string
  end_time: string
  age_restriction?: string
  cancellation_policy: string
}

// ─── Table 8: Conciergerie Details (VIP & Concierge) ─────────────────────────

export interface ConciergerieDetails {
  establishment_id: string
  highlights: string[]
  highlights_fr: string[]
  booking_mode: BookingMode
  opening_hours?: Record<string, { open: string; close: string }>
  availability_note: string
  availability_note_fr: string
  cancellation_policy: string
}

// ─── Table 9: Corporate Details (B2B) ────────────────────────────────────────

export interface CorporateDetails {
  establishment_id: string
  highlights: string[]
  highlights_fr: string[]
  booking_mode: BookingMode
  min_group_size?: number
  max_group_size?: number
  opening_hours?: Record<string, { open: string; close: string }>
  availability_note: string
  availability_note_fr: string
  cancellation_policy: string
}

// ─── Table 10: Services Details (Home & Lifestyle) ───────────────────────────

export interface ServicesDetails {
  establishment_id: string
  highlights: string[]
  highlights_fr: string[]
  booking_mode: BookingMode
  service_area?: string[]
  opening_hours?: Record<string, { open: string; close: string }>
  availability_note: string
  availability_note_fr: string
  cancellation_policy: string
}

// ─── Table 11: Services (Bookable Units) ─────────────────────────────────────

export interface AddOn {
  name: string
  name_fr: string
  price: number
  description?: string
}

export interface Service {
  id: string
  establishment_id: string
  name: string
  name_fr: string
  slug: string
  short_description: string
  short_description_fr?: string
  full_description?: string
  full_description_fr?: string
  service_type: string
  price: number
  currency: string
  requires_deposit: boolean
  deposit_amount?: number
  deposit_type?: DepositType
  tax_included: boolean
  tax_rate: number
  duration_minutes?: number
  min_people: number
  max_people: number
  capacity_per_slot: number
  is_available: boolean
  available_days: number[]
  start_time?: string
  end_time?: string
  blackout_dates: string[]
  advance_booking_hours: number
  cancellation_deadline_hours: number
  requires_confirmation: boolean
  instant_booking: boolean
  allow_cancellation: boolean
  cancellation_policy?: string
  included_items: string[]
  excluded_items: string[]
  add_ons: AddOn[]
  cover_image: string
  gallery_images: string[]
  status: ServiceStatus
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// ─── UI Helper Types ─────────────────────────────────────────────────────────

export interface Category {
  key: EstablishmentCategory
  label: string
  label_fr: string
  image: string
  description: string
  description_fr: string
}

/** Subcategory linked to a parent category — used for search page filters */
export interface Subcategory {
  key: string
  label: string
  label_fr: string
  category_key: EstablishmentCategory
}

/** Backward-compatible flat listing view (derived from Establishment + Services) */
export interface Listing {
  id: string
  name: string
  name_fr: string
  slug: string
  category: EstablishmentCategory
  subcategory?: string
  city: string
  city_fr: string
  image: string
  rating: number
  reviewCount: number
  priceLevel: PriceLevel
  pricePerNight?: number
  pricePerSession?: number
  shortDescription: string
  shortDescription_fr: string
  tags: string[]
  coordinates: Coordinates
  featured: boolean
  galleryImages?: string[]
  cuisine?: string[]
}

// ─── Table 12: Users ─────────────────────────────────────────────────────────

export type UserRole = "guest" | "owner" | "admin"

export interface User {
  id: string
  email: string
  phone?: string
  first_name: string
  last_name: string
  avatar_url?: string
  preferred_language: "en" | "fr"
  role: UserRole
  email_verified: boolean
  created_at: string
  updated_at: string
}

// ─── Table 13: Bookings ─────────────────────────────────────────────────────

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed" | "no_show"

export interface Booking {
  id: string
  user_id: string
  establishment_id: string
  service_id: string
  status: BookingStatus
  booking_date: string
  start_time: string
  end_time: string
  guest_count: number
  special_requests?: string
  total_price: number
  deposit_paid: number
  confirmation_code: string
  cancelled_at?: string
  cancellation_reason?: string
  created_at: string
  updated_at: string
}

// ─── Table 14: Payments ─────────────────────────────────────────────────────

export type PaymentMethod = "card" | "bank_transfer" | "cash" | "wallet"
export type PaymentType = "deposit" | "full" | "refund"
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded"

export interface Payment {
  id: string
  booking_id: string
  user_id: string
  amount: number
  currency: string
  payment_method: PaymentMethod
  payment_type: PaymentType
  status: PaymentStatus
  gateway_ref?: string
  paid_at?: string
  refunded_at?: string
  created_at: string
  updated_at: string
}

// ─── Table 15: Reviews ──────────────────────────────────────────────────────

export type ReviewStatus = "pending" | "published" | "hidden" | "flagged"

export interface Review {
  id: string
  booking_id: string
  user_id: string
  establishment_id: string
  rating: number
  title?: string
  content: string
  photos: string[]
  owner_reply?: string
  owner_reply_at?: string
  is_verified: boolean
  status: ReviewStatus
  created_at: string
  updated_at: string
}
