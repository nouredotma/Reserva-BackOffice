import type { Subcategory } from "../reserva-types"

// ─── Subcategories ───────────────────────────────────────────────────────────
// Each subcategory belongs to one parent category via `category_key` (FK).
// Used as filter options in the search page — when a user selects a category,
// the related subcategories appear as a secondary dropdown.

export const subcategories: Subcategory[] = [
  // ── Fitness & Wellness ──────────────────────────────────────────────────
  { key: "hair-salon",        label: "Hair Salons & Barbers",           label_fr: "Salons de coiffure / barbiers",            category_key: "wellness" },
  { key: "manicure-pedicure", label: "Manicure & Pedicure",             label_fr: "Manucure & pédicure",                      category_key: "wellness" },
  { key: "hammam-wellness",   label: "Hammam & Wellness Rituals",       label_fr: "Hammam & rituels bien-être",               category_key: "wellness" },
  { key: "aesthetic-clinic",  label: "Aesthetic Clinics & Skincare",     label_fr: "Cliniques esthétiques & soins de la peau", category_key: "wellness" },
  { key: "home-massage",      label: "Home Massage",                     label_fr: "Massage à domicile",                       category_key: "wellness" },
  { key: "personal-coach",    label: "Personal Coaches / Private Training", label_fr: "Coachs sportifs personnels / coaching privé", category_key: "wellness" },
  { key: "gym",               label: "Gym",                              label_fr: "Salle de sport",                           category_key: "wellness" },
  { key: "nutritionist",      label: "Nutritionist Consultations",       label_fr: "Consultations avec nutritionnistes",       category_key: "wellness" },
  { key: "golf",              label: "Golf Course Booking",              label_fr: "Réservation de parcours de golf",          category_key: "wellness" },
  { key: "tennis-padel",      label: "Tennis / Padel Courts",            label_fr: "Terrains de tennis / padel",               category_key: "wellness" },

  // ── Day Pass / Loisirs ──────────────────────────────────────────────────
  { key: "beach-club",        label: "Beach Clubs",                      label_fr: "Accès aux beach clubs",                    category_key: "day-passes" },
  { key: "pool-day-pass",     label: "Pool Day Pass",                    label_fr: "Day pass piscine",                         category_key: "day-passes" },
  { key: "kids-club",         label: "Kids Club & Family Activities",    label_fr: "Kids club & activités familiales",         category_key: "day-passes" },
  { key: "private-villa",     label: "Private Villa Experiences",        label_fr: "Expériences en villas privées",            category_key: "day-passes" },
  { key: "yacht-boat",        label: "Yacht / Boat Rental",              label_fr: "Location de yachts / bateaux",             category_key: "day-passes" },
  { key: "bike-moto-quad",    label: "Bike / Moto / Quad Rental",        label_fr: "Location vélo/moto/quad",                  category_key: "day-passes" },
  { key: "desert-camp",       label: "Desert Camps & Excursions",        label_fr: "Camps & excursions dans le désert",        category_key: "day-passes" },
  { key: "city-tour",         label: "Guided City Tours",                label_fr: "Visites guidées de la ville",              category_key: "day-passes" },

  // ── VIP & Conciergerie ──────────────────────────────────────────────────
  { key: "airport-fast-track", label: "Airport Fast-Track",              label_fr: "Fast-track à l'aéroport",                  category_key: "conciergerie" },
  { key: "luxury-chauffeur",   label: "Luxury Chauffeur",                label_fr: "Chauffeur / voiture de luxe avec chauffeur", category_key: "conciergerie" },
  { key: "private-jet",        label: "Private Jets / Helicopters",      label_fr: "Jets privés / hélicoptères",               category_key: "conciergerie" },
  { key: "bodyguard",          label: "Bodyguard",                       label_fr: "Bodyguard",                                category_key: "conciergerie" },
  { key: "vip-nightlife",      label: "VIP Nightlife Tables",            label_fr: "Tables VIP en nightlife",                  category_key: "conciergerie" },
  { key: "chat-concierge",     label: "Chat Concierge Service",          label_fr: "Service de conciergerie par chat",         category_key: "conciergerie" },
  { key: "personal-shopper",   label: "Personal Shopper",                label_fr: "Personal shopper",                         category_key: "conciergerie" },
  { key: "last-minute",        label: "Last-Minute Bookings",            label_fr: "Réservations de dernière minute",          category_key: "conciergerie" },

  // ── Spectacles ─────────────────────────────────────────────────────────
  { key: "cinema",             label: "Cinema Tickets",                  label_fr: "Billets de cinéma",                        category_key: "spectacles" },
  { key: "theatre-comedy",     label: "Theatre & Comedy Shows",          label_fr: "Théâtre & spectacles d'humour",            category_key: "spectacles" },
  { key: "festival-pass",      label: "Festival Passes",                 label_fr: "Pass festivals",                           category_key: "spectacles" },
  { key: "museum-exhibition",  label: "Museums & Exhibitions",           label_fr: "Musées & expositions",                     category_key: "spectacles" },
  { key: "escape-game",        label: "Escape Games",                    label_fr: "Escape games",                             category_key: "spectacles" },
  { key: "gaming-lounge",      label: "Gaming Lounges",                  label_fr: "Espaces gaming / gaming lounges",          category_key: "spectacles" },

  // ── Voyage ──────────────────────────────────────────────────────────────
  { key: "flights",            label: "Flights",                         label_fr: "Vols",                                     category_key: "voyage" },
  { key: "train",              label: "Train Tickets",                   label_fr: "Billets de train",                         category_key: "voyage" },
  { key: "car-rental",         label: "Car Rental",                      label_fr: "Location de voitures",                     category_key: "voyage" },
  { key: "travel-insurance",   label: "Travel Insurance",                label_fr: "Assurance voyage",                         category_key: "voyage" },
  { key: "weekend-getaway",    label: "Weekend & Custom Stays",          label_fr: "Week-ends & séjours sur mesure",           category_key: "voyage" },

  // ── Corporate / B2B ────────────────────────────────────────────────────
  { key: "team-lunch",         label: "Team Lunch Booking",              label_fr: "Réservation de déjeuners d'équipe",        category_key: "corporate" },
  { key: "corporate-wellness", label: "Corporate Wellness Packs",        label_fr: "Packs bien-être pour entreprises",         category_key: "corporate" },
  { key: "meeting-room",       label: "Meeting Room Booking",            label_fr: "Réservation de salles de réunion",         category_key: "corporate" },
  { key: "corporate-event",    label: "Corporate Events",                label_fr: "Événements d'entreprise",                  category_key: "corporate" },
  { key: "employee-perks",     label: "Employee Benefits Marketplace",   label_fr: "Marketplace d'avantages salariés",         category_key: "corporate" },

  // ── Services Maison & Lifestyle ────────────────────────────────────────
  { key: "cleaning",           label: "Cleaning Services",               label_fr: "Services de ménage",                       category_key: "services" },
  { key: "pressing",           label: "Pressing Pickup & Delivery",      label_fr: "Collecte & livraison pressing",            category_key: "services" },
  { key: "private-chef",       label: "Private Chef Experiences",        label_fr: "Expériences de chef à domicile",           category_key: "services" },
  { key: "babysitting",        label: "Babysitting",                     label_fr: "Babysitting",                              category_key: "services" },
  { key: "pet-care",           label: "Pet Grooming & Sitting",          label_fr: "Toilettage & garde d'animaux",             category_key: "services" },
  { key: "chefs-table",        label: "Chef's Table Experiences",        label_fr: "Expériences Chef's Table",                 category_key: "services" },
  { key: "exclusive-tasting",  label: "Exclusive Tasting Menus",         label_fr: "Menus dégustation exclusifs",              category_key: "services" },
  { key: "private-event",      label: "Private Events",                  label_fr: "Événements réservés",                      category_key: "services" },
  { key: "art-workshop",       label: "Art Workshops",                   label_fr: "Ateliers artistiques",                     category_key: "services" },
  { key: "sunset-rooftop",     label: "Sunset Rooftop Experiences",      label_fr: "Expériences rooftop au coucher du soleil", category_key: "services" },

  // ── Restaurants & Expériences Culinaires ────────────────────────────────
  { key: "brunch-cafe",        label: "Brunch & Cafés",                  label_fr: "Brunchs & cafés",                          category_key: "restaurants" },
  { key: "buffet",             label: "Buffets & All-You-Can-Eat",       label_fr: "Buffets & all-you-can-eat",                category_key: "restaurants" },
  { key: "fine-dining",        label: "Fine Dining",                     label_fr: "Fine dining & gastronomie",                category_key: "restaurants" },
  { key: "rooftop-lounge",     label: "Rooftops & Lounges",              label_fr: "Rooftops & lounges",                       category_key: "restaurants" },
  { key: "chefs-table-dining", label: "Chef's Table & Private Dining",   label_fr: "Chef's Table & expériences privées",       category_key: "restaurants" },
  { key: "tea-time",           label: "Tea Time & Pastries",             label_fr: "Tea time & pâtisseries",                   category_key: "restaurants" },
  { key: "family-restaurant",  label: "Family Restaurants",              label_fr: "Restaurants familiaux",                     category_key: "restaurants" },
  { key: "romantic-restaurant", label: "Romantic Restaurants",            label_fr: "Restaurants romantiques",                   category_key: "restaurants" },
  { key: "live-music-dining",  label: "Live Music Restaurants",          label_fr: "Restaurants avec musique live",             category_key: "restaurants" },
  { key: "karaoke",            label: "Karaoke Rooms",                   label_fr: "Salles de karaoké",                        category_key: "restaurants" },
  { key: "tasting-menu",       label: "Tasting Menus",                   label_fr: "Menus dégustation",                        category_key: "restaurants" },
  { key: "event-dinner",       label: "Event Dinners",                   label_fr: "Dîners événementiels",                     category_key: "restaurants" },
  { key: "vip-table",          label: "VIP Tables",                      label_fr: "Tables VIP",                               category_key: "restaurants" },
  { key: "exclusive-offers",   label: "Exclusive Offers & Experiences",  label_fr: "Offres & expériences exclusives",           category_key: "restaurants" },
]

/** Get all subcategories for a given category */
export function getSubcategoriesByCategory(categoryKey: string): Subcategory[] {
  return subcategories.filter((s) => s.category_key === categoryKey)
}
