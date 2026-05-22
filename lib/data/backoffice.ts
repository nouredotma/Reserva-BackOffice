// Centralized sample records for the Reserva establishment back office.

import type {
  Appointment,
  ApprovedReview,
  BookableServiceFixture,
  Client,
  CollaboratorStats,
  DuplicateClient,
  EmployeeAgenda,
  EmployeeReviewStats,
  ModerationRule,
  PendingReview,
  Photo,
  RejectedReview,
  ReviewStats,
  Transaction,
  WorkingHours,
} from '../types';

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

export const sampleTransactions: Transaction[] = [
  {
    id: 'TX-1001',
    type: 'Sale',
    amount: 450,
    method: 'Card',
    client: 'Yasmine Alaoui',
    employee: 'Restaurant floor',
    date: daysAgo(0, 12, 12),
    note: 'Acompte reservation table VIP',
    category: 'Reservation'
  },
  {
    id: 'TX-1002',
    type: 'Sale',
    amount: 1650,
    method: 'Transfer',
    client: 'Karim Alami',
    employee: 'Rooms & stays',
    date: daysAgo(1, 17, 40),
    note: 'Deluxe suite, first night',
    category: 'Accommodation'
  },
  {
    id: 'TX-1003',
    type: 'Deposit',
    amount: 900,
    method: 'Card',
    client: 'Fatima Zahra',
    employee: 'Wellness suites',
    date: daysAgo(2, 15, 5),
    note: 'Spa ritual preauthorization',
    category: 'Wellness'
  },
  {
    id: 'TX-1004',
    type: 'Refund',
    amount: 300,
    method: 'Card',
    client: 'Leila Tazi',
    employee: 'Pool & beach',
    date: daysAgo(3, 10, 30),
    note: 'Day pass cancellation within the allowed window',
    category: 'Day pass'
  },
  {
    id: 'TX-1005',
    type: 'Sale',
    amount: 2400,
    method: 'Transfer',
    client: 'Ahmed Benali',
    employee: 'Events desk',
    date: daysAgo(4, 18, 20),
    note: 'Event table and tickets package',
    category: 'Event'
  },
  {
    id: 'TX-1006',
    type: 'Withdrawal',
    amount: 700,
    method: 'Cash',
    employee: 'Finance desk',
    date: daysAgo(5, 19, 0),
    note: 'Operational cash desk withdrawal',
    category: 'Cash Desk'
  }
];

export const sampleAppointments: Appointment[] = [
  {
    id: 1,
    clientName: 'Yasmine Alaoui',
    service: 'Table VIP - Le Jardin',
    time: '20:30',
    duration: 120,
    status: 'confirmed',
    employee: 'Restaurant floor',
    phone: '+212 6 11 24 83 90',
    email: 'yasmine.alaoui@email.com',
    date: daysFromNow(1, 20, 30),
    notes: 'Birthday, prefers the garden-side terrace.'
  },
  {
    id: 2,
    clientName: 'Fatima Zahra',
    service: 'Rituel hammam & massage',
    time: '16:00',
    duration: 90,
    status: 'pending',
    employee: 'Wellness suites',
    phone: '+212 6 42 18 55 09',
    email: 'fatima.zahra@email.com',
    date: daysFromNow(0, 16, 0),
    notes: 'Demande de cabine duo, payment at confirmer.'
  },
  {
    id: 3,
    clientName: 'Karim Alami',
    service: 'Suite deluxe',
    time: '15:00',
    duration: 60,
    status: 'completed',
    employee: 'Rooms & stays',
    phone: '+212 6 21 40 76 18',
    email: 'karim.alami@email.com',
    date: daysFromNow(2, 15, 0),
    notes: 'Likely late arrival, prepare express check-in.'
  },
  {
    id: 4,
    clientName: 'Leila Tazi',
    service: 'Day pass rooftop pool',
    time: '11:00',
    duration: 360,
    status: 'cancelled',
    employee: 'Pool & beach',
    phone: '+212 6 58 03 77 44',
    email: 'leila.tazi@email.com',
    date: daysFromNow(0, 11, 0),
    notes: 'Canceled by the guest.'
  },
  {
    id: 5,
    clientName: 'Ahmed Benali',
    service: 'Event table + tickets',
    time: '21:00',
    duration: 180,
    status: 'confirmed',
    employee: 'Events desk',
    phone: '+212 6 70 92 13 64',
    email: 'ahmed.benali@email.com',
    date: daysFromNow(4, 21, 0),
    notes: 'Group of 6, prefers center-stage seating.'
  },
  {
    id: 6,
    clientName: 'Nadia El Fassi',
    service: 'Premium airport transfer',
    time: '09:30',
    duration: 75,
    status: 'no_show',
    employee: 'Concierge desk',
    phone: '+212 6 33 29 41 88',
    email: 'nadia.elfassi@email.com',
    date: daysFromNow(3, 9, 30),
    notes: 'Vol AT411, deux valises.'
  }
];

export const sampleClients: Client[] = [
  {
    id: '1',
    name: 'Yasmine Alaoui',
    email: 'yasmine.alaoui@email.com',
    phone: '+212 6 11 24 83 90',
    address: 'Marrakech, Gueliz',
    lastVisit: daysAgo(22, 21, 0),
    lastVisitTime: '21:00',
    nextAppointment: daysFromNow(1, 20, 30),
    nextAppointmentTime: '20:30',
    totalVisits: 8,
    status: 'Active',
    notes: 'Prefers premium experiences and WhatsApp confirmations.'
  },
  {
    id: '2',
    name: 'Karim Alami',
    email: 'karim.alami@email.com',
    phone: '+212 6 21 40 76 18',
    address: 'Casablanca, Racine',
    lastVisit: daysAgo(31, 15, 0),
    lastVisitTime: '15:00',
    nextAppointment: daysFromNow(2, 15, 0),
    nextAppointmentTime: '15:00',
    totalVisits: 5,
    status: 'Active',
    notes: 'Corporate client, often requests a company invoice.'
  },
  {
    id: '3',
    name: 'Fatima Zahra',
    email: 'fatima.zahra@email.com',
    phone: '+212 6 42 18 55 09',
    address: 'Rabat, Agdal',
    lastVisit: daysAgo(14, 17, 0),
    lastVisitTime: '17:00',
    nextAppointment: daysFromNow(0, 16, 0),
    nextAppointmentTime: '16:00',
    totalVisits: 12,
    status: 'Active',
    notes: 'Loyal to wellness offers.'
  },
  {
    id: '4',
    name: 'Leila Tazi',
    email: 'leila.tazi@email.com',
    phone: '+212 6 58 03 77 44',
    address: 'Tanger, Malabata',
    lastVisit: daysAgo(48, 12, 0),
    lastVisitTime: '12:00',
    totalVisits: 3,
    status: 'Inactive',
    notes: 'A canceled le dernier day pass.'
  },
  {
    id: '5',
    name: 'Ahmed Benali',
    email: 'ahmed.benali@email.com',
    phone: '+212 6 70 92 13 64',
    address: 'Marrakech, Hivernage',
    lastVisit: daysAgo(7, 22, 0),
    lastVisitTime: '22:00',
    nextAppointment: daysFromNow(4, 21, 0),
    nextAppointmentTime: '21:00',
    totalVisits: 18,
    status: 'Active',
    notes: 'Frequent group reservations.'
  },
  {
    id: '6',
    name: 'Nadia El Fassi',
    email: 'nadia.elfassi@email.com',
    phone: '+212 6 33 29 41 88',
    address: 'Fes, New City',
    lastVisit: daysAgo(65, 10, 0),
    lastVisitTime: '10:00',
    nextAppointment: daysFromNow(3, 9, 30),
    nextAppointmentTime: '09:30',
    totalVisits: 2,
    status: 'Active',
    notes: 'A besoin de coordination transport.'
  }
];

export const defaultWorkingHours: WorkingHours[] = [
  { day: 'Mondi', isWorking: true, startTime: '09:00', endTime: '20:00', breaks: [{ start: '13:00', end: '14:00' }] },
  { day: 'Tuedi', isWorking: true, startTime: '09:00', endTime: '20:00', breaks: [{ start: '13:00', end: '14:00' }] },
  { day: 'Wedcredi', isWorking: true, startTime: '09:00', endTime: '20:00', breaks: [{ start: '13:00', end: '14:00' }] },
  { day: 'Thudi', isWorking: true, startTime: '09:00', endTime: '21:00', breaks: [{ start: '13:00', end: '14:00' }] },
  { day: 'Fridredi', isWorking: true, startTime: '09:00', endTime: '22:00', breaks: [{ start: '13:00', end: '14:00' }] },
  { day: 'Satedi', isWorking: true, startTime: '10:00', endTime: '22:00', breaks: [] },
  { day: 'Sunanche', isWorking: false, startTime: '10:00', endTime: '18:00', breaks: [] }
];

export const defaultAgendas: EmployeeAgenda[] = [
  {
    id: 1,
    name: 'Restaurant floor',
    email: 'restaurant@reserva.ma',
    color: '#FFC900',
    role: 'Tables & restaurants',
    workingHours: defaultWorkingHours,
    timeSlotDuration: 30,
    bufferTime: 10,
    maxAppointmentsPerDay: 80,
    allowOnlineBooking: true,
    services: ['Table VIP - Le Jardin', 'Brunch signature', 'Rooftop dinner'],
    status: 'active'
  },
  {
    id: 2,
    name: 'Wellness suites',
    email: 'wellness@reserva.ma',
    color: '#10B981',
    role: 'Spa & wellness',
    workingHours: defaultWorkingHours,
    timeSlotDuration: 30,
    bufferTime: 15,
    maxAppointmentsPerDay: 36,
    allowOnlineBooking: true,
    services: ['Rituel hammam & massage', 'Cabine duo spa', 'Fitness private session'],
    status: 'active'
  },
  {
    id: 3,
    name: 'Rooms & stays',
    email: 'stays@reserva.ma',
    color: '#3B82F6',
    role: 'Accommodation',
    workingHours: defaultWorkingHours,
    timeSlotDuration: 60,
    bufferTime: 0,
    maxAppointmentsPerDay: 24,
    allowOnlineBooking: true,
    services: ['Suite deluxe', 'Private riad', 'Late check-out'],
    status: 'active'
  },
  {
    id: 4,
    name: 'Pool & beach',
    email: 'daypass@reserva.ma',
    color: '#06B6D4',
    role: 'Day pass',
    workingHours: defaultWorkingHours,
    timeSlotDuration: 60,
    bufferTime: 0,
    maxAppointmentsPerDay: 120,
    allowOnlineBooking: true,
    services: ['Day pass rooftop pool', 'Private cabana', 'Beach club access'],
    status: 'active'
  },
  {
    id: 5,
    name: 'Concierge desk',
    email: 'concierge@reserva.ma',
    color: '#8B5CF6',
    role: 'Conciergerie',
    workingHours: defaultWorkingHours,
    timeSlotDuration: 30,
    bufferTime: 5,
    maxAppointmentsPerDay: 60,
    allowOnlineBooking: true,
    services: ['Premium airport transfer', 'Personal assistant', 'Custom request'],
    status: 'active'
  },
  {
    id: 6,
    name: 'Events desk',
    email: 'events@reserva.ma',
    color: '#F97316',
    role: 'Events',
    workingHours: defaultWorkingHours,
    timeSlotDuration: 60,
    bufferTime: 30,
    maxAppointmentsPerDay: 20,
    allowOnlineBooking: true,
    services: ['Event table + tickets', 'Meeting room', 'Group package'],
    status: 'active'
  }
];

export const samplePendingReviews: PendingReview[] = [
  {
    id: 'R-P-1',
    clientName: 'Wedyem Bennis',
    clientEmail: 'meryem.bennis@email.com',
    rating: 5,
    comment: 'The reservation was smooth and the rooftop welcome was excellent.',
    service: 'Day pass rooftop pool',
    employeeName: 'Pool & beach',
    date: daysAgo(1, 18, 0),
    status: 'pending'
  },
  {
    id: 'R-P-2',
    clientName: 'Omar Slaoui',
    clientEmail: 'omar.slaoui@email.com',
    rating: 4,
    comment: 'Very good dinner, only a small delay on arrival.',
    service: 'Table VIP - Le Jardin',
    employeeName: 'Restaurant floor',
    date: daysAgo(2, 21, 10),
    status: 'pending'
  },
  {
    id: 'R-P-3',
    clientName: 'Salma Idrissi',
    clientEmail: 'salma.idrissi@email.com',
    rating: 5,
    comment: 'The spa was quiet, clean, and perfectly prepared.',
    service: 'Rituel hammam & massage',
    employeeName: 'Wellness suites',
    date: daysAgo(3, 16, 30),
    status: 'pending'
  }
];

export const sampleApprovedReviews: ApprovedReview[] = [
  {
    id: 'R-A-1',
    clientName: 'Ahmed Benali',
    clientEmail: 'ahmed.benali@email.com',
    rating: 5,
    comment: 'Excellent follow-up for our event table, everything was ready before we arrived.',
    service: 'Event table + tickets',
    date: daysAgo(4, 23, 0),
    status: 'approved',
    isPublic: true,
    views: 184,
    reply: 'Thank you Ahmed, we are glad your evening went well.',
    replyDate: daysAgo(3, 12, 0),
    employeeName: 'Events desk'
  },
  {
    id: 'R-A-2',
    clientName: 'Yasmine Alaoui',
    clientEmail: 'yasmine.alaoui@email.com',
    rating: 5,
    comment: 'Reserva found me the perfect table at the last minute.',
    service: 'Table VIP - Le Jardin',
    date: daysAgo(8, 22, 0),
    status: 'approved',
    isPublic: true,
    views: 265,
    employeeName: 'Restaurant floor'
  },
  {
    id: 'R-A-3',
    clientName: 'Fatima Zahra',
    clientEmail: 'fatima.zahra@email.com',
    rating: 4,
    comment: 'Great wellness experience, quick confirmation and attentive team.',
    service: 'Rituel hammam & massage',
    date: daysAgo(11, 17, 0),
    status: 'approved',
    isPublic: true,
    views: 143,
    employeeName: 'Wellness suites'
  }
];

export const sampleRejectedReviews: RejectedReview[] = [
  {
    id: 'R-R-1',
    clientName: 'Compte test',
    clientEmail: 'test@example.com',
    rating: 1,
    comment: 'Advertising message unrelated to the establishment.',
    service: 'Custom request',
    employeeName: 'Concierge desk',
    date: daysAgo(6, 9, 0),
    status: 'rejected',
    rejectReason: 'Spam promotionnel',
    rejectedDate: daysAgo(6, 10, 0)
  },
  {
    id: 'R-R-2',
    clientName: 'Anonymous guest',
    clientEmail: 'anonymous@example.com',
    rating: 2,
    comment: 'Incomplete content that cannot be verified.',
    service: 'Suite deluxe',
    employeeName: 'Rooms & stays',
    date: daysAgo(12, 11, 0),
    status: 'rejected',
    rejectReason: 'Reviews non exploitable',
    rejectedDate: daysAgo(11, 14, 0)
  }
];

export const sampleModerationRules: ModerationRule[] = [
  {
    id: 'MR-1',
    name: 'Bloquer les contenus promotionnels',
    description: 'Refuse automatiquement les reviews qui contiennent des liens ou offres externes.',
    type: 'keyword',
    condition: 'http, promo, coupon, lien externe',
    action: 'auto-reject',
    isActive: true,
    createdDate: daysAgo(45, 10, 0),
    appliedCount: 18
  },
  {
    id: 'MR-2',
    name: 'Signaler les reviews courts',
    description: 'Flags reviews under 12 characters.',
    type: 'length',
    condition: '< 12 characters',
    action: 'flag',
    isActive: true,
    createdDate: daysAgo(38, 15, 0),
    appliedCount: 9
  },
  {
    id: 'MR-3',
    name: 'Publish verified 5-star reviews',
    description: 'Approves 5-star reviews linked to a confirmed reservation.',
    type: 'auto-approve',
    condition: 'rating = 5 et reservation confirmed',
    action: 'auto-approve',
    isActive: false,
    createdDate: daysAgo(20, 16, 0),
    appliedCount: 31
  }
];

export const sampleDuplicates: DuplicateClient[] = [
  {
    id: 'D-1',
    name: 'Yasmine Alaoui',
    email: 'yasmine.alaoui@email.com',
    phone: '+212 6 11 24 83 90',
    address: 'Marrakech, Gueliz',
    status: 'Active',
    notes: 'Compte principal',
    duplicates: [
      {
        id: 'D-1B',
        name: 'Yasmine A.',
        email: 'yasmine.a@email.com',
        phone: '+212 6 11 24 83 90',
        address: 'Marrakech',
        status: 'Active',
        notes: 'Created depuis une reservation mobile'
      }
    ]
  },
  {
    id: 'D-2',
    name: 'Karim Alami',
    email: 'karim.alami@email.com',
    phone: '+212 6 21 40 76 18',
    address: 'Casablanca, Racine',
    status: 'Active',
    duplicates: [
      {
        id: 'D-2B',
        name: 'Karim A',
        email: 'k.alami@company.ma',
        phone: '+212 6 21 40 76 18',
        address: 'Casablanca',
        status: 'Inactive',
        notes: 'Ancienne adresse corporate'
      }
    ]
  }
];

export const moroccanNames = [
  'Yasmine', 'Karim', 'Fatima', 'Ahmed', 'Leila', 'Nadia', 'Omar', 'Wedyem', 'Salma', 'Mehdi',
  'Hajar', 'Reda', 'Imane', 'Soufiane', 'Sara', 'Hassan', 'Zineb', 'Amina', 'Rachid', 'Rim',
  'Ismail', 'Malika', 'Zakaria', 'Bouchra', 'Walid', 'Aicha', 'Saad', 'Aya', 'Anas', 'Hind'
];

export const servicesList = [
  'Table restaurant',
  'Accommodation',
  'Day pass',
  'Spa & wellness',
  'Event',
  'Conciergerie',
  'Corporate',
  'Custom experience'
];

export const sampleBookableCategories = [
  'RESTAURANTS',
  'ACCOMMODATION',
  'DAY PASSES',
  'WELLNESS',
  'EVENTS',
  'CONCIERGERIE',
  'CORPORATE',
  'SUR MESURE'
];

export const sampleBookableServices: BookableServiceFixture[] = [
  {
    id: 1,
    name: 'Table VIP - Le Jardin',
    abbreviation: 'Table VIP',
    description: 'Reservation de table avec placement premium et acompte configurable.',
    color: '#FFC900',
    price: 450,
    priceType: 'from',
    priceFrom: 450,
    onQuote: false,
    duration: 120,
    category: 'RESTAURANTS',
    visibility: 'bookable',
    competences: ['Restaurant floor'],
    multipleProviders: true
  },
  {
    id: 2,
    name: 'Brunch signature',
    abbreviation: 'Brunch',
    description: 'Brunch slot with service capacity and children options.',
    color: '#F59E0B',
    price: 380,
    priceType: 'fixed',
    onQuote: false,
    duration: 150,
    category: 'RESTAURANTS',
    visibility: 'bookable',
    competences: ['Restaurant floor'],
    multipleProviders: true
  },
  {
    id: 3,
    name: 'Suite deluxe',
    abbreviation: 'Suite',
    description: 'Stay request with arrival time and deposit rules.',
    color: '#3B82F6',
    price: 1650,
    priceType: 'from',
    priceFrom: 1650,
    onQuote: false,
    duration: 60,
    category: 'ACCOMMODATION',
    visibility: 'bookable',
    competences: ['Rooms & stays'],
    multipleProviders: false
  },
  {
    id: 4,
    name: 'Day pass rooftop pool',
    abbreviation: 'Day pass',
    description: 'Day access with capacity, loungers, and cancellation terms.',
    color: '#06B6D4',
    price: 300,
    priceType: 'fixed',
    onQuote: false,
    duration: 360,
    category: 'DAY PASSES',
    visibility: 'bookable',
    competences: ['Pool & beach'],
    multipleProviders: true
  },
  {
    id: 5,
    name: 'Rituel hammam & massage',
    abbreviation: 'Spa',
    description: 'Wellness experience with cabin, duration, and assigned resources.',
    color: '#10B981',
    price: 900,
    priceType: 'range',
    priceFrom: 900,
    priceTo: 1400,
    onQuote: false,
    duration: 90,
    category: 'WELLNESS',
    visibility: 'bookable',
    competences: ['Wellness suites'],
    multipleProviders: false
  },
  {
    id: 6,
    name: 'Event table + tickets',
    abbreviation: 'Event',
    description: 'Group package avec table, tickets, minimum spend et confirmation manuelle.',
    color: '#F97316',
    price: 2400,
    priceType: 'from',
    priceFrom: 2400,
    onQuote: true,
    duration: 180,
    category: 'EVENTS',
    visibility: 'bookable',
    competences: ['Events desk', 'Concierge desk'],
    multipleProviders: true
  },
  {
    id: 7,
    name: 'Premium airport transfer',
    abbreviation: 'Transfer',
    description: 'Concierge service with flight number, pickup time, and driver.',
    color: '#8B5CF6',
    price: 650,
    priceType: 'from',
    priceFrom: 650,
    onQuote: false,
    duration: 75,
    category: 'CONCIERGERIE',
    visibility: 'bookable',
    competences: ['Concierge desk'],
    multipleProviders: false
  },
  {
    id: 8,
    name: 'Meeting room',
    abbreviation: 'Meeting',
    description: 'Corporate reservation with room setup, equipment, and coffee break.',
    color: '#64748B',
    price: 1200,
    priceType: 'from',
    priceFrom: 1200,
    onQuote: true,
    duration: 240,
    category: 'CORPORATE',
    visibility: 'visible',
    competences: ['Events desk'],
    multipleProviders: true
  }
];

export const sampleOccupancyData = {
  LUN: {
    '10:00 - 11:00': 35, '11:00 - 12:00': 42, '12:00 - 13:00': 58, '13:00 - 14:00': 76,
    '14:00 - 15:00': 64, '15:00 - 16:00': 48, '16:00 - 17:00': 52, '17:00 - 18:00': 67,
    '18:00 - 19:00': 81, '19:00 - 20:00': 88
  },
  MAR: {
    '10:00 - 11:00': 28, '11:00 - 12:00': 36, '12:00 - 13:00': 49, '13:00 - 14:00': 62,
    '14:00 - 15:00': 55, '15:00 - 16:00': 44, '16:00 - 17:00': 51, '17:00 - 18:00': 70,
    '18:00 - 19:00': 79, '19:00 - 20:00': 84
  },
  MER: {
    '10:00 - 11:00': 31, '11:00 - 12:00': 39, '12:00 - 13:00': 57, '13:00 - 14:00': 69,
    '14:00 - 15:00': 60, '15:00 - 16:00': 46, '16:00 - 17:00': 54, '17:00 - 18:00': 73,
    '18:00 - 19:00': 86, '19:00 - 20:00': 92
  },
  JEU: {
    '10:00 - 11:00': 40, '11:00 - 12:00': 48, '12:00 - 13:00': 61, '13:00 - 14:00': 72,
    '14:00 - 15:00': 66, '15:00 - 16:00': 57, '16:00 - 17:00': 63, '17:00 - 18:00': 78,
    '18:00 - 19:00': 91, '19:00 - 20:00': 96
  },
  VEN: {
    '10:00 - 11:00': 45, '11:00 - 12:00': 53, '12:00 - 13:00': 69, '13:00 - 14:00': 80,
    '14:00 - 15:00': 74, '15:00 - 16:00': 62, '16:00 - 17:00': 71, '17:00 - 18:00': 85,
    '18:00 - 19:00': 94, '19:00 - 20:00': 98
  },
  SAM: {
    '10:00 - 11:00': 68, '11:00 - 12:00': 74, '12:00 - 13:00': 82, '13:00 - 14:00': 89,
    '14:00 - 15:00': 84, '15:00 - 16:00': 77, '16:00 - 17:00': 83, '17:00 - 18:00': 91,
    '18:00 - 19:00': 97, '19:00 - 20:00': 99
  },
  DIM: {
    '10:00 - 11:00': 52, '11:00 - 12:00': 60, '12:00 - 13:00': 72, '13:00 - 14:00': 78,
    '14:00 - 15:00': 70, '15:00 - 16:00': 64, '16:00 - 17:00': 68, '17:00 - 18:00': 75,
    '18:00 - 19:00': 82, '19:00 - 20:00': 86
  }
};

export const sampleCollaborators: CollaboratorStats[] = [
  { id: 1, name: 'Restaurant floor', color: '#FFC900', totalServices: 320, inSalon: 126, online: 194, onlineRate: 61, revenue: 148600, occupationRate: 82, workedHours: 214 },
  { id: 2, name: 'Wellness suites', color: '#10B981', totalServices: 146, inSalon: 44, online: 102, onlineRate: 70, revenue: 132400, occupationRate: 74, workedHours: 172 },
  { id: 3, name: 'Rooms & stays', color: '#3B82F6', totalServices: 82, inSalon: 21, online: 61, onlineRate: 74, revenue: 231800, occupationRate: 69, workedHours: 190 },
  { id: 4, name: 'Pool & beach', color: '#06B6D4', totalServices: 410, inSalon: 90, online: 320, onlineRate: 78, revenue: 123000, occupationRate: 88, workedHours: 205 },
  { id: 5, name: 'Concierge desk', color: '#8B5CF6', totalServices: 118, inSalon: 38, online: 80, onlineRate: 68, revenue: 95600, occupationRate: 63, workedHours: 168 },
  { id: 6, name: 'Events desk', color: '#F97316', totalServices: 54, inSalon: 13, online: 41, onlineRate: 76, revenue: 178200, occupationRate: 71, workedHours: 142 }
];

export const samplePhotos: Photo[] = [
  {
    id: 1,
    url: '/tile.webp',
    title: 'Terrasse principale',
    status: 'approved',
    date: daysAgo(12),
    category: 'Establishment',
    tags: ['terrasse', 'restaurant', 'ambiance'],
    size: '428 KB',
    dimensions: '1200 x 800'
  },
  {
    id: 2,
    url: '/logo.png',
    title: 'Establishment identity',
    status: 'approved',
    date: daysAgo(18),
    category: 'Branding',
    tags: ['logo', 'fiche', 'reserva'],
    size: '81 KB',
    dimensions: '512 x 512'
  },
  {
    id: 3,
    url: '/tile.webp',
    title: 'Suite deluxe',
    status: 'pending',
    date: daysAgo(4),
    category: 'Accommodation',
    tags: ['suite', 'stay', 'premium'],
    size: '512 KB',
    dimensions: '1600 x 1067'
  },
  {
    id: 4,
    url: '/tile.webp',
    title: 'Cabine spa duo',
    status: 'approved',
    date: daysAgo(9),
    category: 'Wellness',
    tags: ['spa', 'hammam', 'duo'],
    size: '474 KB',
    dimensions: '1400 x 933'
  },
  {
    id: 5,
    url: '/tile.webp',
    title: 'Photo trop sombre',
    status: 'rejected',
    date: daysAgo(15),
    category: 'Event',
    tags: ['evening'],
    size: '390 KB',
    dimensions: '1200 x 800',
    rejectionReason: 'Image trop sombre pour la fiche publique.'
  }
];

const makeStats = (
  totalReviews: number,
  pendingReviews: number,
  approvedReviews: number,
  rejectedReviews: number,
  averageRating: number,
  totalViews: number
): ReviewStats => ({
  totalReviews,
  pendingReviews,
  approvedReviews,
  rejectedReviews,
  averageRating,
  totalViews,
  ratingDistribution: [
    { rating: 5, count: Math.round(totalReviews * 0.58) },
    { rating: 4, count: Math.round(totalReviews * 0.25) },
    { rating: 3, count: Math.round(totalReviews * 0.1) },
    { rating: 2, count: Math.round(totalReviews * 0.04) },
    { rating: 1, count: Math.max(1, Math.round(totalReviews * 0.03)) }
  ],
  trendsLastMonth: {
    total: 12,
    approved: 9,
    rejected: 2,
    averageRating: 0.2
  }
});

export const sampleReviewPeriodStats: Record<'week' | 'month' | 'year', {
  trendData: { name: string; reviews: number; vues: number }[];
  ratingTrendData: { month: string; rating: number }[];
  stats: ReviewStats;
}> = {
  week: {
    trendData: [
      { name: 'Mon', reviews: 4, vues: 120 },
      { name: 'Tue', reviews: 3, vues: 98 },
      { name: 'Wed', reviews: 6, vues: 180 },
      { name: 'Thu', reviews: 5, vues: 160 },
      { name: 'Fri', reviews: 8, vues: 240 },
      { name: 'Sat', reviews: 12, vues: 360 },
      { name: 'Sun', reviews: 9, vues: 310 }
    ],
    ratingTrendData: [
      { month: 'Mon', rating: 4.5 },
      { month: 'Tue', rating: 4.4 },
      { month: 'Wed', rating: 4.7 },
      { month: 'Thu', rating: 4.6 },
      { month: 'Fri', rating: 4.8 },
      { month: 'Sat', rating: 4.9 },
      { month: 'Sun', rating: 4.7 }
    ],
    stats: makeStats(47, 6, 38, 3, 4.7, 1468)
  },
  month: {
    trendData: [
      { name: 'S1', reviews: 32, vues: 920 },
      { name: 'S2', reviews: 41, vues: 1120 },
      { name: 'S3', reviews: 48, vues: 1380 },
      { name: 'S4', reviews: 55, vues: 1640 }
    ],
    ratingTrendData: [
      { month: 'S1', rating: 4.5 },
      { month: 'S2', rating: 4.6 },
      { month: 'S3', rating: 4.7 },
      { month: 'S4', rating: 4.8 }
    ],
    stats: makeStats(176, 18, 148, 10, 4.7, 5060)
  },
  year: {
    trendData: [
      { name: 'Jan', reviews: 96, vues: 2400 },
      { name: 'Feb', reviews: 104, vues: 2680 },
      { name: 'Tue', reviews: 118, vues: 2940 },
      { name: 'Apr', reviews: 132, vues: 3300 },
      { name: 'May', reviews: 151, vues: 3880 },
      { name: 'Jun', reviews: 164, vues: 4210 }
    ],
    ratingTrendData: [
      { month: 'Jan', rating: 4.4 },
      { month: 'Feb', rating: 4.5 },
      { month: 'Tue', rating: 4.6 },
      { month: 'Apr', rating: 4.6 },
      { month: 'May', rating: 4.7 },
      { month: 'Jun', rating: 4.8 }
    ],
    stats: makeStats(765, 42, 681, 42, 4.7, 19410)
  }
};

export const sampleEmployeeReviewStats: EmployeeReviewStats[] = [
  { name: 'Restaurant floor', role: 'Tables & restaurants', reviews: 210, avgRating: 4.8, stars5: 152, stars4: 46, stars3: 12, responses: 198, trend: '+14%' },
  { name: 'Wellness suites', role: 'Spa & wellness', reviews: 138, avgRating: 4.7, stars5: 92, stars4: 34, stars3: 12, responses: 122, trend: '+9%' },
  { name: 'Pool & beach', role: 'Day pass', reviews: 184, avgRating: 4.6, stars5: 118, stars4: 48, stars3: 18, responses: 165, trend: '+11%' },
  { name: 'Concierge desk', role: 'Conciergerie', reviews: 93, avgRating: 4.9, stars5: 78, stars4: 12, stars3: 3, responses: 90, trend: '+18%' }
];

