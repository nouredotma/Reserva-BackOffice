import type { BookingMode } from "../../reserva-types";

export type BookingRecord = {
  id: string;
  mode: BookingMode;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  serviceName: string;
  date: Date;
  time: string;
  durationMinutes: number;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
  guestCount: number;
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
    guestName: "Yasmine Alaoui",
    guestEmail: "yasmine.alaoui@email.com",
    guestPhone: "+212 6 11 24 83 90",
    serviceName: "Private Garden Dining",
    date: daysFromNow(1, 20, 30),
    time: "20:30",
    durationMinutes: 120,
    status: "confirmed",
    guestCount: 2,
    channel: "online",
    notes: "Birthday — garden corner.",
    totalPrice: 2000,
    currency: "MAD",
  },
  {
    id: "bk-002",
    mode: "reservation",
    guestName: "Fatima Zahra",
    guestEmail: "fatima.zahra@email.com",
    guestPhone: "+212 6 42 18 55 09",
    serviceName: "Table Reservation",
    date: daysFromNow(0, 19, 0),
    time: "19:00",
    durationMinutes: 90,
    status: "pending",
    guestCount: 2,
    channel: "online",
    totalPrice: 0,
    currency: "MAD",
  },
  {
    id: "bk-003",
    mode: "appointment",
    guestName: "Karim Alami",
    guestEmail: "karim.alami@email.com",
    guestPhone: "+212 6 21 40 76 18",
    serviceName: "Chef's Table Experience",
    date: daysFromNow(4, 20, 0),
    time: "20:00",
    durationMinutes: 150,
    status: "confirmed",
    guestCount: 3,
    channel: "direct",
    totalPrice: 3600,
    currency: "MAD",
  },
  {
    id: "bk-004",
    mode: "ticket",
    guestName: "Ahmed Benali",
    guestEmail: "ahmed.benali@email.com",
    guestPhone: "+212 6 70 92 13 64",
    serviceName: "Garden Jazz Night",
    date: daysFromNow(6, 21, 0),
    time: "21:00",
    durationMinutes: 180,
    status: "confirmed",
    guestCount: 4,
    channel: "online",
    totalPrice: 800,
    currency: "MAD",
  },
  {
    id: "bk-005",
    mode: "request",
    guestName: "Nadia El Fassi",
    guestEmail: "nadia.elfassi@email.com",
    guestPhone: "+212 6 33 29 41 88",
    serviceName: "Custom tasting menu",
    date: daysFromNow(3, 14, 0),
    time: "14:00",
    durationMinutes: 120,
    status: "pending",
    guestCount: 6,
    channel: "online",
    notes: "Halal menu, one vegan guest.",
    totalPrice: 0,
    currency: "MAD",
  },
  {
    id: "bk-006",
    mode: "reservation",
    guestName: "Omar Slaoui",
    guestEmail: "omar.slaoui@email.com",
    guestPhone: "+212 6 55 12 88 01",
    serviceName: "Table Reservation",
    date: daysFromNow(0, 13, 0),
    time: "13:00",
    durationMinutes: 90,
    status: "cancelled",
    guestCount: 2,
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
