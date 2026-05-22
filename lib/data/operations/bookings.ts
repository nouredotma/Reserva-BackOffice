import type { BookingMode } from "../../reserva-types";

export type BookingRecord = {
  id: string;
  mode: BookingMode;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceName: string;
  date: Date;
  time: string;
  durationMinutes: number;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
  partySize: number;
  channel: "online" | "direct";
  notes?: string;
  totalPrice: number;
  currency: string;
};

const now = new Date();
const daysFromNow = (days: number, hour = 10, minute = 0) => {
  const date = new Date(now);
  date.setDate(now.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date;
};

export const sampleBookings: BookingRecord[] = [
  {
    id: "bk-001",
    mode: "reservation",
    clientName: "Yasmine Alaoui",
    clientEmail: "yasmine.alaoui@email.com",
    clientPhone: "+212 6 11 24 83 90",
    serviceName: "Private Garden Dining",
    date: daysFromNow(1, 20, 30),
    time: "20:30",
    durationMinutes: 120,
    status: "confirmed",
    partySize: 2,
    channel: "online",
    notes: "Birthday — garden corner.",
    totalPrice: 2000,
    currency: "MAD",
  },
  {
    id: "bk-002",
    mode: "reservation",
    clientName: "Fatima Zahra",
    clientEmail: "fatima.zahra@email.com",
    clientPhone: "+212 6 42 18 55 09",
    serviceName: "Table Reservation",
    date: daysFromNow(0, 19, 0),
    time: "19:00",
    durationMinutes: 90,
    status: "pending",
    partySize: 2,
    channel: "online",
    totalPrice: 0,
    currency: "MAD",
  },
  {
    id: "bk-003",
    mode: "appointment",
    clientName: "Karim Alami",
    clientEmail: "karim.alami@email.com",
    clientPhone: "+212 6 21 40 76 18",
    serviceName: "Chef's Table Experience",
    date: daysFromNow(4, 20, 0),
    time: "20:00",
    durationMinutes: 150,
    status: "confirmed",
    partySize: 3,
    channel: "direct",
    totalPrice: 3600,
    currency: "MAD",
  },
  {
    id: "bk-004",
    mode: "ticket",
    clientName: "Ahmed Benali",
    clientEmail: "ahmed.benali@email.com",
    clientPhone: "+212 6 70 92 13 64",
    serviceName: "Garden Jazz Night",
    date: daysFromNow(6, 21, 0),
    time: "21:00",
    durationMinutes: 180,
    status: "confirmed",
    partySize: 4,
    channel: "online",
    totalPrice: 800,
    currency: "MAD",
  },
  {
    id: "bk-005",
    mode: "request",
    clientName: "Nadia El Fassi",
    clientEmail: "nadia.elfassi@email.com",
    clientPhone: "+212 6 33 29 41 88",
    serviceName: "Custom tasting menu",
    date: daysFromNow(3, 14, 0),
    time: "14:00",
    durationMinutes: 120,
    status: "pending",
    partySize: 6,
    channel: "online",
    notes: "Halal menu, one vegan diner.",
    totalPrice: 0,
    currency: "MAD",
  },
  {
    id: "bk-006",
    mode: "reservation",
    clientName: "Omar Slaoui",
    clientEmail: "omar.slaoui@email.com",
    clientPhone: "+212 6 55 12 88 01",
    serviceName: "Table Reservation",
    date: daysFromNow(0, 13, 0),
    time: "13:00",
    durationMinutes: 90,
    status: "cancelled",
    partySize: 2,
    channel: "online",
    totalPrice: 0,
    currency: "MAD",
  },
];

export const bookingModeLabels: Record<BookingMode, string> = {
  appointment: "Appointment",
  reservation: "Reservation",
  ticket: "Ticket",
  request: "Request",
};
