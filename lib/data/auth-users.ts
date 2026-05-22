import type { EstablishmentCategory } from "../reserva-types";

export type DemoAuthUser = {
  email: string;
  password: string;
  name: string;
  category: EstablishmentCategory;
  establishmentName: string;
};

/** One demo owner per Reserva category (password: demo123). */
export const demoAuthUsers: DemoAuthUser[] = [
  {
    email: "restaurant@reserva.demo",
    password: "demo123",
    name: "Le Jardin Owner",
    category: "restaurants",
    establishmentName: "Le Jardin",
  },
  {
    email: "wellness@reserva.demo",
    password: "demo123",
    name: "So Spa Owner",
    category: "wellness",
    establishmentName: "So Spa Sofitel",
  },
  {
    email: "daypass@reserva.demo",
    password: "demo123",
    name: "Beach Club Owner",
    category: "day-passes",
    establishmentName: "Nikki Beach Marrakech",
  },
  {
    email: "concierge@reserva.demo",
    password: "demo123",
    name: "VIP Desk Owner",
    category: "conciergerie",
    establishmentName: "Reserva VIP Desk",
  },
  {
    email: "spectacles@reserva.demo",
    password: "demo123",
    name: "Events Owner",
    category: "spectacles",
    establishmentName: "Palais des Congrès",
  },
  {
    email: "travel@reserva.demo",
    password: "demo123",
    name: "Stays Owner",
    category: "voyage",
    establishmentName: "La Mamounia",
  },
  {
    email: "corporate@reserva.demo",
    password: "demo123",
    name: "Corporate Owner",
    category: "corporate",
    establishmentName: "Atlas Business Center",
  },
  {
    email: "services@reserva.demo",
    password: "demo123",
    name: "Lifestyle Owner",
    category: "services",
    establishmentName: "Maison Service Marrakech",
  },
];

export const categoryRegistrationOptions = [
  { key: "restaurants" as const, label: "Restaurants & dining" },
  { key: "wellness" as const, label: "Wellness & fitness" },
  { key: "day-passes" as const, label: "Day pass & leisure" },
  { key: "conciergerie" as const, label: "VIP & concierge" },
  { key: "spectacles" as const, label: "Tickets & spectacles" },
  { key: "voyage" as const, label: "Travel & stays" },
  { key: "corporate" as const, label: "Corporate & B2B" },
  { key: "services" as const, label: "Home & lifestyle services" },
];
