import type { Client, DuplicateClient } from "../../types";

const now = new Date();
const daysFromNow = (days: number, hour = 10, minute = 0) => {
  const date = new Date(now);
  date.setDate(now.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date;
};
const daysAgo = (days: number, hour = 10, minute = 0) => {
  const date = new Date(now);
  date.setDate(now.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date;
};

export const sampleClients: Client[] = [
  {
    id: "1",
    name: "Yasmine Alaoui",
    email: "yasmine.alaoui@email.com",
    phone: "+212 6 11 24 83 90",
    address: "Marrakech, Gueliz",
    lastVisit: daysAgo(22, 21, 0),
    lastVisitTime: "21:00",
    nextAppointment: daysFromNow(1, 20, 30),
    nextAppointmentTime: "20:30",
    totalVisits: 8,
    status: "Active",
    notes: "Prefers garden seating; WhatsApp confirmations.",
  },
  {
    id: "2",
    name: "Karim Alami",
    email: "karim.alami@email.com",
    phone: "+212 6 21 40 76 18",
    address: "Casablanca, Racine",
    lastVisit: daysAgo(31, 21, 0),
    lastVisitTime: "21:00",
    nextAppointment: daysFromNow(2, 21, 0),
    nextAppointmentTime: "21:00",
    totalVisits: 5,
    status: "Active",
    notes: "Often requests company invoice.",
  },
  {
    id: "3",
    name: "Fatima Zahra",
    email: "fatima.zahra@email.com",
    phone: "+212 6 42 18 55 09",
    address: "Rabat, Agdal",
    lastVisit: daysAgo(14, 19, 0),
    lastVisitTime: "19:00",
    nextAppointment: daysFromNow(0, 19, 0),
    nextAppointmentTime: "19:00",
    totalVisits: 12,
    status: "Active",
    notes: "Regular terrace client.",
  },
  {
    id: "4",
    name: "Ahmed Benali",
    email: "ahmed.benali@email.com",
    phone: "+212 6 70 92 13 64",
    address: "Marrakech, Hivernage",
    lastVisit: daysAgo(7, 22, 0),
    lastVisitTime: "22:00",
    nextAppointment: daysFromNow(4, 20, 0),
    nextAppointmentTime: "20:00",
    totalVisits: 18,
    status: "Active",
    notes: "Chef's Table regular.",
  },
];

export const sampleDuplicates: DuplicateClient[] = [
  {
    id: "D-1",
    name: "Yasmine Alaoui",
    email: "yasmine.alaoui@email.com",
    phone: "+212 6 11 24 83 90",
    address: "Marrakech, Gueliz",
    status: "Active",
    notes: "Primary profile",
    duplicates: [
      {
        id: "D-1B",
        name: "Yasmine A.",
        email: "yasmine.a@email.com",
        phone: "+212 6 11 24 83 90",
        address: "Marrakech",
        status: "Active",
        notes: "Created from mobile booking",
      },
    ],
  },
];

export const moroccanNames = [
  "Yasmine",
  "Karim",
  "Fatima",
  "Ahmed",
  "Leila",
  "Nadia",
  "Omar",
  "Meryem",
  "Salma",
  "Mehdi",
];

/** Legacy label list used by ranking / stats helpers. */
export const servicesList = [
  "Table Reservation",
  "Private Garden Dining",
  "Chef's Table Experience",
];
