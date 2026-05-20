// Centralized mock and sample data for wellbe/reserva application

// --- Types & Interfaces ---

export interface Transaction {
  id: string;
  type: 'Vente' | 'Remboursement' | 'Dépôt' | 'Retrait';
  amount: number;
  method: 'Espèces' | 'Carte' | 'Virement' | 'Chèque';
  client?: string;
  employee?: string;
  date: Date;
  note?: string;
  category?: string;
}

export interface Appointment {
  id: number;
  clientName: string;
  service: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled' | string;
  employee: string;
  phone?: string;
  email?: string;
  date: Date;
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  lastVisit?: Date;
  lastVisitTime?: string;
  nextAppointment?: Date;
  nextAppointmentTime?: string;
  totalVisits?: number;
  status: 'Active' | 'Inactive';
  notes?: string;
}

export interface WorkingHours {
  day: string;
  isWorking: boolean;
  startTime: string;
  endTime: string;
  breaks: { start: string; end: string }[];
}

export interface EmployeeAgenda {
  id: number;
  name: string;
  email: string;
  color: string;
  role: string;
  workingHours: WorkingHours[];
  timeSlotDuration: number;
  bufferTime: number;
  maxAppointmentsPerDay: number;
  allowOnlineBooking: boolean;
  services: string[];
  status: 'active' | 'inactive' | 'vacation';
}

export interface PendingReview {
  id: string;
  clientName: string;
  clientEmail: string;
  rating: number;
  comment: string;
  service?: string;
  employeeName?: string;
  date: Date;
  status: 'pending';
}

export interface ApprovedReview {
  id: string;
  clientName: string;
  clientEmail: string;
  rating: number;
  comment: string;
  service?: string;
  date: Date;
  status: 'approved';
  isPublic: boolean;
  views?: number;
  reply?: string;
  replyDate?: Date;
  employeeName?: string;
}

export interface RejectedReview {
  id: string;
  clientName: string;
  clientEmail: string;
  rating: number;
  comment: string;
  service?: string;
  employeeName?: string;
  date: Date;
  status: 'rejected';
  rejectReason?: string;
  rejectedDate?: Date;
}

export interface ModerationRule {
  id: string;
  name: string;
  description: string;
  type: 'keyword' | 'rating' | 'length' | 'auto-approve';
  condition: string;
  action: 'auto-reject' | 'flag' | 'auto-approve';
  isActive: boolean;
  createdDate: Date;
  appliedCount?: number;
}

export interface DuplicateClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  status: 'Active' | 'Inactive';
  notes?: string;
  duplicates: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    status: 'Active' | 'Inactive';
    notes?: string;
  }>;
}

export interface ServiceCategory {
  id: number;
  name: string;
  totalVisits: number;
  maleVisits: number;
  femaleVisits: number;
  malePercentage: number;
  femalePercentage: number;
  avgDuration: number;
  revenue: number;
  growth: number;
}

export interface CollaboratorStats {
  id: number;
  name: string;
  color: string;
  totalServices: number;
  inSalon: number;
  online: number;
  onlineRate: number;
  revenue: number;
  occupationRate?: number;
  workedHours?: number;
}

export interface Photo {
  id: number;
  url: string;
  title: string;
  status: string;
  date: Date;
  category: string;
  tags: string[];
  size: string;
  dimensions: string;
  rejectionReason?: string;
}
export interface ReviewStats {
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
  averageRating: number;
  totalViews: number;
  ratingDistribution: { rating: number; count: number }[];
  trendsLastMonth: {
    total: number;
    approved: number;
    rejected: number;
    averageRating: number;
  };
}

export interface EmployeeReviewStats {
  name: string;
  role: string;
  reviews: number;
  avgRating: number;
  stars5: number;
  stars4: number;
  stars3: number;
  responses: number;
  trend: string;
}

export interface NewClient {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinedDate: Date;
  visits: number;
  totalSpent: number;
  rating: number;
  growth: number;
  firstVisit: Date;
  lastVisit?: Date;
}

export interface ClientRanking {
  id: number;
  name: string;
  email: string;
  phone: string;
  status?: string;
  address?: string;
  totalSpent?: number;
  totalVisits?: number;
  averageRating?: number | string;
  lastVisit?: Date;
  lifetimeValue?: number;
  favoriteService?: string;
  rank: number;
  growth: number;
  loyaltyScore: number;
}

export interface CancelledAppointment {
  id: number;
  collaborator: string;
  date: string;
  client: string;
  takenOnline: boolean;
  creationDate: string;
  creationTime: string;
  cancellationDate: string;
  cancellationTime: string;
  cancelledByClient: boolean;
}

// --- Data Arrays ---

export const sampleTransactions: Transaction[] = [
  {
    id: '1',
    type: 'Vente',
    amount: 350,
    method: 'Espèces',
    client: 'Fatima Zahra El Amrani',
    employee: 'Yassine El Fassi',
    date: new Date('2024-06-01T10:15:00'),
    note: 'Coupe et brushing',
    category: 'Coiffure'
  },
  {
    id: '2',
    type: 'Vente',
    amount: 480,
    method: 'Carte',
    client: 'Mohamed Benali',
    employee: 'Samira Bouzid',
    date: new Date('2024-06-01T11:30:00'),
    note: 'Coloration',
    category: 'Coloration'
  },
  {
    id: '3',
    type: 'Remboursement',
    amount: -120,
    method: 'Espèces',
    client: 'Imane El Idrissi',
    employee: 'Khalid Ait Lahcen',
    date: new Date('2024-06-02T09:45:00'),
    note: 'Annulation RDV',
    category: 'Remboursement'
  },
  {
    id: '4',
    type: 'Dépôt',
    amount: 1000,
    method: 'Virement',
    employee: 'Nadia El Khatib',
    date: new Date('2024-06-02T14:00:00'),
    note: 'Dépôt caisse',
    category: 'Dépôt'
  },
  {
    id: '5',
    type: 'Retrait',
    amount: -500,
    method: 'Chèque',
    employee: 'Rachid Benjelloun',
    date: new Date('2024-06-03T16:30:00'),
    note: 'Retrait pour achat fournitures',
    category: 'Fournitures'
  },
  {
    id: '6',
    type: 'Vente',
    amount: 280,
    method: 'Carte',
    client: 'Laila Bennani',
    employee: 'Yassine El Fassi',
    date: new Date('2024-06-03T14:20:00'),
    note: 'Coupe homme',
    category: 'Coiffure'
  },
  {
    id: '7',
    type: 'Vente',
    amount: 650,
    method: 'Espèces',
    client: 'Hassan El Khatib',
    employee: 'Samira Bouzid',
    date: new Date('2024-06-03T15:45:00'),
    note: 'Soin capillaire complet',
    category: 'Soins'
  },
  {
    id: '8',
    type: 'Vente',
    amount: 420,
    method: 'Carte',
    client: 'Aisha Mansouri',
    employee: 'Khalid Ait Lahcen',
    date: new Date('2024-06-04T10:00:00'),
    note: 'Brushing et coiffure',
    category: 'Coiffure'
  },
  {
    id: '9',
    type: 'Vente',
    amount: 180,
    method: 'Espèces',
    client: 'Omar Ziani',
    employee: 'Nadia El Khatib',
    date: new Date('2024-06-04T11:30:00'),
    note: 'Coupe barbe',
    category: 'Barber'
  },
  {
    id: '10',
    type: 'Vente',
    amount: 550,
    method: 'Virement',
    client: 'Salma Tazi',
    employee: 'Rachid Benjelloun',
    date: new Date('2024-06-04T13:15:00'),
    note: 'Coloration premium',
    category: 'Coloration'
  }
];

export const sampleAppointments: Appointment[] = [
  {
    id: 1,
    clientName: 'Fatima Zahra El Amrani',
    service: 'Consultation',
    time: '09:00',
    duration: 60,
    status: 'confirmed',
    employee: 'Yassine El Fassi',
    phone: '+212 6 12 34 56 78',
    email: 'fatima.zahra@email.com',
    date: new Date(2025, 10, 10),
    notes: 'Première consultation'
  },
  {
    id: 2,
    clientName: 'Mohamed Benali',
    service: 'Suivi',
    time: '11:00',
    duration: 45,
    status: 'pending',
    employee: 'Samira Bouzid',
    phone: '+212 6 98 76 54 32',
    email: 'mohamed.benali@email.com',
    date: new Date(2025, 10, 11),
    notes: ''
  },
  {
    id: 3,
    clientName: 'Imane El Idrissi',
    service: 'Thérapie',
    time: '14:00',
    duration: 90,
    status: 'confirmed',
    employee: 'Khalid Ait Lahcen',
    phone: '+212 6 11 22 33 44',
    email: 'imane.idrissi@email.com',
    date: new Date(2025, 10, 12),
    notes: 'Session régulière'
  },
  {
    id: 4,
    clientName: 'Rachid El Mansouri',
    service: 'Consultation',
    time: '16:00',
    duration: 60,
    status: 'cancelled',
    employee: 'Nadia El Khatib',
    phone: '+212 6 55 66 77 88',
    email: 'rachid.elmansouri@email.com',
    date: new Date(2025, 10, 13),
    notes: 'Annulé par le client'
  },
  {
    id: 5,
    clientName: 'Sara El Baraka',
    service: 'Massage',
    time: '10:00',
    duration: 60,
    status: 'confirmed',
    employee: 'Yassine El Fassi',
    phone: '+212 6 77 88 99 00',
    email: 'sara.elbaraka@email.com',
    date: new Date(2025, 10, 14),
    notes: 'Massage relaxant'
  },
  {
    id: 6,
    clientName: 'Omar El Haddad',
    service: 'Manucure',
    time: '15:00',
    duration: 45,
    status: 'pending',
    employee: 'Samira Bouzid',
    phone: '+212 6 22 33 44 55',
    email: 'omar.elhaddad@email.com',
    date: new Date(2025, 10, 15),
    notes: 'Première manucure'
  }
];

export const sampleClients: Client[] = [
  {
    id: '1',
    name: 'Fatima Zahra El Amrani',
    email: 'fatima.zahra@email.com',
    phone: '+212 6 12 34 56 78',
    address: '12 Rue Ibn Khaldoun, Casablanca',
    status: 'Active',
    lastVisit: new Date('2026-01-15'),
    nextAppointment: new Date('2026-02-20'),
    totalVisits: 14,
    notes: 'Cliente fidèle, préfère les rendez-vous du soir'
  },
  {
    id: '2',
    name: 'Mohamed Benali',
    email: 'mohamed.benali@email.com',
    phone: '+212 6 98 76 54 32',
    address: '45 Avenue Hassan II, Rabat',
    status: 'Active',
    lastVisit: new Date('2026-01-10'),
    nextAppointment: new Date('2026-02-15'),
    totalVisits: 9,
    notes: ''
  },
  {
    id: '3',
    name: 'Imane El Idrissi',
    email: 'imane.idrissi@email.com',
    phone: '+212 6 11 22 33 44',
    address: '78 Boulevard Zerktouni, Marrakech',
    status: 'Inactive',
    lastVisit: new Date('2025-12-01'),
    totalVisits: 4,
    notes: "N'a pas répondu aux derniers appels"
  }
];

export const employees = [
  'Yassine El Fassi',
  'Samira Bouzid',
  'Khalid Ait Lahcen',
  'Nadia El Khatib'
];

export const defaultWorkingHours: WorkingHours[] = [
  { day: 'Lundi', isWorking: true, startTime: '09:00', endTime: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
  { day: 'Mardi', isWorking: true, startTime: '09:00', endTime: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
  { day: 'Mercredi', isWorking: true, startTime: '09:00', endTime: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
  { day: 'Jeudi', isWorking: true, startTime: '09:00', endTime: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
  { day: 'Vendredi', isWorking: true, startTime: '09:00', endTime: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
  { day: 'Samedi', isWorking: false, startTime: '09:00', endTime: '18:00', breaks: [] },
  { day: 'Dimanche', isWorking: false, startTime: '09:00', endTime: '18:00', breaks: [] }
];

export const defaultAgendas: EmployeeAgenda[] = [
  {
    id: 1,
    name: 'Yassine El Fassi',
    email: 'yassine.fassi@wellbe.com',
    color: '#3B82F6',
    role: 'Coiffeur Senior',
    workingHours: defaultWorkingHours,
    timeSlotDuration: 30,
    bufferTime: 5,
    maxAppointmentsPerDay: 12,
    allowOnlineBooking: true,
    services: ['Coupe Homme', 'Coupe Femme', 'Soin Capillaire Complet', 'Barbe'],
    status: 'active'
  },
  {
    id: 2,
    name: 'Samira Bouzid',
    email: 'samira.bouzid@wellbe.com',
    color: '#EC4899',
    role: 'Styliste Visagiste',
    workingHours: defaultWorkingHours,
    timeSlotDuration: 45,
    bufferTime: 10,
    maxAppointmentsPerDay: 10,
    allowOnlineBooking: true,
    services: ['Coupe Femme', 'Coloration', 'Brushing', 'Mèches/Balayage'],
    status: 'active'
  },
  {
    id: 3,
    name: 'Khalid Ait Lahcen',
    email: 'khalid.lahcen@wellbe.com',
    color: '#10B981',
    role: 'Barbier & Coiffeur',
    workingHours: defaultWorkingHours,
    timeSlotDuration: 30,
    bufferTime: 0,
    maxAppointmentsPerDay: 15,
    allowOnlineBooking: false,
    services: ['Coupe Homme Classique', 'Coupe + Barbe', 'Rasage Traditionnel'],
    status: 'active'
  },
  {
    id: 4,
    name: 'Nadia El Khatib',
    email: 'nadia.khatib@wellbe.com',
    color: '#10B981',
    role: 'Esthéticienne',
    workingHours: defaultWorkingHours,
    timeSlotDuration: 60,
    bufferTime: 15,
    maxAppointmentsPerDay: 6,
    allowOnlineBooking: true,
    services: ['Soin du Visage Complet', 'Massage Relaxant Corps Complet', 'Manucure Classique'],
    status: 'active'
  }
];

export const samplePendingReviews: PendingReview[] = [
  {
    id: '1',
    clientName: 'Fatima Zahra El Amrani',
    clientEmail: 'fatima.zahra@email.com',
    rating: 5,
    comment: 'Service exceptionnel ! Équipe très professionnelle et accueillante. Je recommande vivement.',
    service: 'Coupe et brushing',
    employeeName: 'Yassine El Fassi',
    date: new Date('2024-02-15'),
    status: 'pending',
  },
  {
    id: '2',
    clientName: 'Mohamed Benali',
    clientEmail: 'mohamed.benali@email.com',
    rating: 4,
    comment: 'Très satisfait de ma coupe. Ambiance agréable, bon rapport qualité-prix.',
    service: 'Coupe homme',
    employeeName: 'Samira Bouzid',
    date: new Date('2024-02-14'),
    status: 'pending',
  },
  {
    id: '3',
    clientName: 'Imane El Idrissi',
    clientEmail: 'imane.idrissi@email.com',
    rating: 5,
    comment: "Première visite et déjà conquise ! Le personnel est à l'écoute et très compétent.",
    service: 'Coloration',
    employeeName: 'Khalid Ait Lahcen',
    date: new Date('2024-02-13'),
    status: 'pending',
  },
  {
    id: '4',
    clientName: 'Rachid El Mansouri',
    clientEmail: 'rachid.elmansouri@email.com',
    rating: 3,
    comment: "Service correct mais temps d'attente un peu long. Résultat satisfaisant.",
    service: 'Barbe',
    employeeName: 'Nadia El Khatib',
    date: new Date('2024-02-12'),
    status: 'pending',
  }
];

export const sampleApprovedReviews: ApprovedReview[] = [
  {
    id: 'a1',
    clientName: 'Fatima Zahra El Amrani',
    clientEmail: 'fatima.zahra@email.com',
    rating: 5,
    comment: 'Service exceptionnel ! Équipe très professionnelle et accueillante. Je recommande vivement.',
    service: 'Coupe et brushing',
    date: new Date('2024-02-15'),
    status: 'approved',
    isPublic: true,
    views: 124,
    reply: 'Merci beaucoup pour votre retour ! Nous sommes ravis de vous avoir satisfaite. À bientôt !',
    replyDate: new Date('2024-02-16'),
    employeeName: 'Yassine El Fassi',
  },
  {
    id: 'a2',
    clientName: 'Mohamed Benali',
    clientEmail: 'mohamed.benali@email.com',
    rating: 4,
    comment: 'Très satisfait de ma coupe. Ambiance agréable, bon rapport qualité-prix.',
    service: 'Coupe homme',
    date: new Date('2024-02-14'),
    status: 'approved',
    isPublic: true,
    views: 89,
    employeeName: 'Samira Bouzid',
  },
  {
    id: 'a3',
    clientName: 'Imane El Idrissi',
    clientEmail: 'imane.idrissi@email.com',
    rating: 5,
    comment: "Première visite et déjà conquise ! Le personnel est à l'écoute et très compétent.",
    service: 'Coloration',
    date: new Date('2024-02-13'),
    status: 'approved',
    isPublic: true,
    views: 156,
    reply: 'Nous sommes très heureux de vous compter parmi nos clients ! Merci pour votre confiance.',
    replyDate: new Date('2024-02-14'),
    employeeName: 'Khalid Ait Lahcen',
  },
  {
    id: 'a4',
    clientName: 'Rachid El Mansouri',
    clientEmail: 'rachid.elmansouri@email.com',
    rating: 5,
    comment: 'Excellent service, personnel sympathique et professionnel. Je reviendrai certainement.',
    service: 'Barbe et coupe',
    date: new Date('2024-02-10'),
    status: 'approved',
    isPublic: false,
    views: 45,
    employeeName: 'Nadia El Khatib',
  }
];

export const sampleRejectedReviews: RejectedReview[] = [
  {
    id: 'r1',
    clientName: 'Rachid El Mansouri',
    clientEmail: 'rachid.elmansouri@email.com',
    rating: 3,
    comment: "Service correct mais temps d'attente un peu long. Résultat satisfaisant.",
    service: 'Barbe',
    employeeName: 'Nadia El Khatib',
    date: new Date('2024-02-12'),
    status: 'rejected',
    rejectReason: "Commentaire négatif sur le temps d'attente",
    rejectedDate: new Date('2024-02-13'),
  },
  {
    id: 'r2',
    clientName: 'Samira Bouzid',
    clientEmail: 'samira.bouzid@email.com',
    rating: 2,
    comment: "Déçue par la prestation. Le résultat ne correspond pas à ce qui était demandé.",
    service: 'Coupe femme',
    employeeName: 'Yassine El Fassi',
    date: new Date('2024-02-10'),
    status: 'rejected',
    rejectReason: 'Avis trop négatif sans détails constructifs',
    rejectedDate: new Date('2024-02-11'),
  },
  {
    id: 'r3',
    clientName: 'Khalid Ait Lahcen',
    clientEmail: 'khalid.aitlahcen@email.com',
    rating: 1,
    comment: 'Très mauvaise expérience, prix exorbitants pour une qualité moyenne.',
    service: 'Coloration',
    employeeName: 'Imane El Idrissi',
    date: new Date('2024-02-08'),
    status: 'rejected',
    rejectReason: 'Langage inapproprié et accusations non fondées',
    rejectedDate: new Date('2024-02-09'),
  }
];

export const sampleModerationRules: ModerationRule[] = [
  {
    id: '1',
    name: 'Langage inapproprié',
    description: 'Bloque automatiquement les avis contenant des insultes ou propos offensants',
    type: 'keyword',
    condition: 'nul, horrible, arnaque',
    action: 'auto-reject',
    isActive: true,
    createdDate: new Date('2024-01-15'),
    appliedCount: 12,
  },
  {
    id: '2',
    name: 'Notes faibles',
    description: 'Signale les avis avec moins de 3 étoiles pour révision manuelle',
    type: 'rating',
    condition: '< 3 étoiles',
    action: 'flag',
    isActive: true,
    createdDate: new Date('2024-01-10'),
    appliedCount: 28,
  },
  {
    id: '3',
    name: 'Avis trop courts',
    description: 'Rejette les commentaires de moins de 10 caractères',
    type: 'length',
    condition: '< 10 caractères',
    action: 'auto-reject',
    isActive: true,
    createdDate: new Date('2024-01-05'),
    appliedCount: 5,
  },
  {
    id: '4',
    name: 'Validation 5 étoiles',
    description: 'Approuve automatiquement les excellents avis détaillés',
    type: 'auto-approve',
    condition: '5 étoiles + > 50 caractères',
    action: 'auto-approve',
    isActive: false,
    createdDate: new Date('2024-01-20'),
    appliedCount: 0,
  }
];

export const sampleDuplicates: DuplicateClient[] = [
  {
    id: '1',
    name: 'Fatima Zahra El Amrani',
    email: 'fatima.zahra@email.com',
    phone: '+212 6 12 34 56 78',
    address: '12 Rue Ibn Khaldoun, Casablanca',
    status: 'Active',
    notes: 'Cliente régulière',
    duplicates: [
      {
        id: '4',
        name: 'F. Z. El Amrani',
        email: 'fatima.zahra@email.com',
        phone: '+212 6 12 34 56 78',
        address: '12 Rue Ibn Khaldoun, Casablanca',
        status: 'Active',
        notes: 'Doublon détecté par email et téléphone',
      }
    ]
  },
  {
    id: '2',
    name: 'Mohamed Benali',
    email: 'mohamed.benali@email.com',
    phone: '+212 6 98 76 54 32',
    address: '45 Avenue Hassan II, Rabat',
    status: 'Active',
    notes: '',
    duplicates: [
      {
        id: '5',
        name: 'M. Benali',
        email: 'mohamed.benali@email.com',
        phone: '+212 6 98 76 54 32',
        address: '45 Avenue Hassan II, Rabat',
        status: 'Active',
        notes: 'Doublon détecté par nom et email',
      }
    ]
  },
  {
    id: '3',
    name: 'Imane El Idrissi',
    email: 'imane.idrissi@email.com',
    phone: '+212 6 11 22 33 44',
    address: '78 Boulevard Zerktouni, Marrakech',
    status: 'Inactive',
    notes: "N'a pas répondu aux derniers appels",
    duplicates: [
      {
        id: '6',
        name: 'I. El Idrissi',
        email: 'imane.idrissi@email.com',
        phone: '+212 6 11 22 33 44',
        address: '78 Boulevard Zerktouni, Marrakech',
        status: 'Inactive',
        notes: 'Doublon détecté par téléphone',
      }
    ]
  }
];

export const moroccanNames = [
  'Yassine', 'Fatima', 'Mohamed', 'Khadija', 'Omar', 'Sara', 'Hassan', 'Imane', 'Soufiane', 'Nadia',
  'Abdelkader', 'Amina', 'Rachid', 'Samira', 'Mehdi', 'Meryem', 'Hamza', 'Salma', 'Ayoub', 'Zineb',
  'Mustapha', 'Laila', 'Reda', 'Siham', 'Anas', 'Hajar', 'Karim', 'Asmaa', 'Adil', 'Ilham',
  'Abdelilah', 'Rania', 'Youssef', 'Sofia', 'Abderrahim', 'Nawal', 'Tarik', 'Houda', 'Othmane', 'Ikram',
  'Abdellah', 'Latifa', 'Walid', 'Aicha', 'Saad', 'Rim', 'Ismail', 'Malika', 'Zakaria', 'Bouchra'
];

export const servicesList = [
  'Coiffure Homme',
  'Coiffure Femme',
  'Spa & Bien-être',
  'Massage Thérapeutique',
  'Manucure & Pédicure',
  'Soins du Visage',
  'Épilation',
  'Coloration',
  'Maquillage',
  'Consultation Beauté',
  'Soins Capillaires',
  'Barbier'
];

export const sampleOccupancyData = {
  'LUN': {
    '10:00 - 11:00': 0, '11:00 - 12:00': 0, '12:00 - 13:00': 0, '13:00 - 14:00': 0,
    '14:00 - 15:00': 0, '15:00 - 16:00': 0, '16:00 - 17:00': 0, '17:00 - 18:00': 0,
    '18:00 - 19:00': 0, '19:00 - 20:00': 0
  },
  'MAR': {
    '10:00 - 11:00': 20, '11:00 - 12:00': 20, '12:00 - 13:00': 40, '13:00 - 14:00': 38,
    '14:00 - 15:00': 40, '15:00 - 16:00': 40, '16:00 - 17:00': 27, '17:00 - 18:00': 30,
    '18:00 - 19:00': 40, '19:00 - 20:00': 40
  },
  'MER': {
    '10:00 - 11:00': 63, '11:00 - 12:00': 75, '12:00 - 13:00': 63, '13:00 - 14:00': 50,
    '14:00 - 15:00': 50, '15:00 - 16:00': 63, '16:00 - 17:00': 50, '17:00 - 18:00': 25,
    '18:00 - 19:00': 25, '19:00 - 20:00': 25
  },
  'JEU': {
    '10:00 - 11:00': 50, '11:00 - 12:00': 50, '12:00 - 13:00': 38, '13:00 - 14:00': 50,
    '14:00 - 15:00': 46, '15:00 - 16:00': 50, '16:00 - 17:00': 50, '17:00 - 18:00': 38,
    '18:00 - 19:00': 25, '19:00 - 20:00': 25
  },
  'VEN': {
    '10:00 - 11:00': 0, '11:00 - 12:00': 13, '12:00 - 13:00': 25, '13:00 - 14:00': 25,
    '14:00 - 15:00': 25, '15:00 - 16:00': 25, '16:00 - 17:00': 63, '17:00 - 18:00': 69,
    '18:00 - 19:00': 88, '19:00 - 20:00': 58
  },
  'SAM': {
    '10:00 - 11:00': 25, '11:00 - 12:00': 75, '12:00 - 13:00': 75, '13:00 - 14:00': 48,
    '14:00 - 15:00': 63, '15:00 - 16:00': 75, '16:00 - 17:00': 56, '17:00 - 18:00': 75,
    '18:00 - 19:00': 75, '19:00 - 20:00': 33
  },
  'DIM': {
    '10:00 - 11:00': 70, '11:00 - 12:00': 70, '12:00 - 13:00': 50, '13:00 - 14:00': 60,
    '14:00 - 15:00': 45, '15:00 - 16:00': 60, '16:00 - 17:00': 100, '17:00 - 18:00': 90,
    '18:00 - 19:00': 45, '19:00 - 20:00': 35
  }
};

export const sampleCollaborators: CollaboratorStats[] = [
  {
    id: 1,
    name: 'Yassine El Fassi',
    color: '#3B82F6',
    totalServices: 52,
    inSalon: 8,
    online: 44,
    onlineRate: 84.6,
    revenue: 2847.50,
    occupationRate: 92.3,
    workedHours: 128
  },
  {
    id: 2,
    name: 'Samira Bouzid',
    color: '#EC4899',
    totalServices: 48,
    inSalon: 12,
    online: 36,
    onlineRate: 75.0,
    revenue: 2615.00,
    occupationRate: 88.7,
    workedHours: 120
  },
  {
    id: 3,
    name: 'Khalid Ait Lahcen',
    color: '#10B981',
    totalServices: 41,
    inSalon: 6,
    online: 35,
    onlineRate: 85.4,
    revenue: 2234.80,
    occupationRate: 95.1,
    workedHours: 110
  },
  {
    id: 4,
    name: 'Nadia El Khatib',
    color: '#F59E0B',
    totalServices: 38,
    inSalon: 10,
    online: 28,
    onlineRate: 73.7,
    revenue: 2068.40,
    occupationRate: 90.2,
    workedHours: 105
  }
];

export const samplePhotos: Photo[] = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400',
    title: 'Manucure élégante',
    status: 'validated',
    date: new Date('2025-11-08'),
    category: 'Manucure',
    tags: ['rouge', 'élégant'],
    size: '2.4 MB',
    dimensions: '1920x1080'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400',
    title: 'Manucure pastel',
    status: 'validated',
    date: new Date('2025-11-07'),
    category: 'Manucure',
    tags: ['bleu', 'pastel'],
    size: '1.8 MB',
    dimensions: '1920x1080'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400',
    title: 'Coiffure moderne',
    status: 'validated',
    date: new Date('2025-11-06'),
    category: 'Coiffure',
    tags: ['moderne', 'professionnel'],
    size: '3.2 MB',
    dimensions: '1920x1080'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1522337094846-8a818192de1f?w=400',
    title: 'Spa relaxant',
    status: 'validated',
    date: new Date('2025-11-05'),
    category: 'Spa',
    tags: ['relaxation', 'bien-être'],
    size: '2.9 MB',
    dimensions: '1920x1080'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
    title: 'Massage thérapeutique',
    status: 'rejected',
    date: new Date('2025-11-04'),
    category: 'Massage',
    tags: ['thérapie'],
    size: '2.1 MB',
    dimensions: '1920x1080',
    rejectionReason: 'Qualité insuffisante'
  }
];

export const sampleReviewPeriodStats: Record<'week' | 'month' | 'year', {
  trendData: { name: string; avis: number; vues: number }[];
  ratingTrendData: { month: string; rating: number }[];
  stats: ReviewStats;
}> = {
  week: {
    trendData: [
      { name: 'Lun', avis: 12, vues: 340 },
      { name: 'Mar', avis: 19, vues: 520 },
      { name: 'Mer', avis: 15, vues: 480 },
      { name: 'Jeu', avis: 22, vues: 650 },
      { name: 'Ven', avis: 18, vues: 590 },
      { name: 'Sam', avis: 25, vues: 720 },
      { name: 'Dim', avis: 20, vues: 610 },
    ],
    ratingTrendData: [
      { month: 'Jan', rating: 4.2 },
      { month: 'Fév', rating: 4.3 },
      { month: 'Mar', rating: 4.1 },
      { month: 'Avr', rating: 4.4 },
      { month: 'Mai', rating: 4.6 },
      { month: 'Jun', rating: 4.5 },
    ],
    stats: {
      totalReviews: 50,
      pendingReviews: 10,
      approvedReviews: 35,
      rejectedReviews: 5,
      averageRating: 4.3,
      totalViews: 3200,
      ratingDistribution: [
        { rating: 5, count: 20 },
        { rating: 4, count: 15 },
        { rating: 3, count: 10 },
        { rating: 2, count: 3 },
        { rating: 1, count: 2 },
      ],
      trendsLastMonth: {
        total: 12,
        approved: 8,
        rejected: 2,
        averageRating: 4.5,
      },
    },
  },
  month: {
    trendData: [
      { name: 'S1', avis: 60, vues: 1200 },
      { name: 'S2', avis: 75, vues: 1500 },
      { name: 'S3', avis: 80, vues: 1700 },
      { name: 'S4', avis: 90, vues: 2000 },
    ],
    ratingTrendData: [
      { month: 'Jan', rating: 4.1 },
      { month: 'Fév', rating: 4.2 },
      { month: 'Mar', rating: 4.3 },
      { month: 'Avr', rating: 4.4 },
      { month: 'Mai', rating: 4.5 },
      { month: 'Jun', rating: 4.6 },
    ],
    stats: {
      totalReviews: 305,
      pendingReviews: 40,
      approvedReviews: 240,
      rejectedReviews: 25,
      averageRating: 4.4,
      totalViews: 6400,
      ratingDistribution: [
        { rating: 5, count: 120 },
        { rating: 4, count: 80 },
        { rating: 3, count: 60 },
        { rating: 2, count: 30 },
        { rating: 1, count: 15 },
      ],
      trendsLastMonth: {
        total: 90,
        approved: 70,
        rejected: 10,
        averageRating: 4.4,
      },
    },
  },
  year: {
    trendData: [
      { name: 'Jan', avis: 120, vues: 2400 },
      { name: 'Fév', avis: 150, vues: 3000 },
      { name: 'Mar', avis: 170, vues: 3400 },
      { name: 'Avr', avis: 180, vues: 3600 },
      { name: 'Mai', avis: 200, vues: 4000 },
      { name: 'Jun', avis: 210, vues: 4200 },
      { name: 'Jul', avis: 220, vues: 4400 },
      { name: 'Aoû', avis: 230, vues: 4600 },
      { name: 'Sep', avis: 240, vues: 4800 },
      { name: 'Oct', avis: 250, vues: 5000 },
      { name: 'Nov', avis: 260, vues: 5200 },
      { name: 'Déc', avis: 270, vues: 5400 },
    ],
    ratingTrendData: [
      { month: 'Jan', rating: 4.0 },
      { month: 'Fév', rating: 4.1 },
      { month: 'Mar', rating: 4.2 },
      { month: 'Avr', rating: 4.3 },
      { month: 'Mai', rating: 4.4 },
      { month: 'Jun', rating: 4.5 },
    ],
    stats: {
      totalReviews: 2500,
      pendingReviews: 300,
      approvedReviews: 2000,
      rejectedReviews: 200,
      averageRating: 4.2,
      totalViews: 48000,
      ratingDistribution: [
        { rating: 5, count: 900 },
        { rating: 4, count: 700 },
        { rating: 3, count: 500 },
        { rating: 2, count: 250 },
        { rating: 1, count: 150 },
      ],
      trendsLastMonth: {
        total: 270,
        approved: 220,
        rejected: 30,
        averageRating: 4.3,
      },
    },
  },
};

export const sampleEmployeeReviewStats: EmployeeReviewStats[] = [
  { name: 'Yassine El Fassi', role: 'Coiffeur', reviews: 45, avgRating: 4.8, stars5: 35, stars4: 8, stars3: 2, responses: 42, trend: '+12%' },
  { name: 'Samira Bouzid', role: 'Manager', reviews: 38, avgRating: 4.6, stars5: 28, stars4: 7, stars3: 3, responses: 35, trend: '+8%' },
  { name: 'Khalid Ait Lahcen', role: 'Coiffeur', reviews: 52, avgRating: 4.9, stars5: 48, stars4: 3, stars3: 1, responses: 50, trend: '+15%' },
  { name: 'Nadia El Khatib', role: 'Esthéticienne', reviews: 31, avgRating: 4.5, stars5: 22, stars4: 6, stars3: 3, responses: 28, trend: '+5%' },
  { name: 'Rachid Benjelloun', role: 'Responsable', reviews: 29, avgRating: 4.7, stars5: 23, stars4: 5, stars3: 1, responses: 27, trend: '+10%' },
];

export function generateSampleNewClients(length: number = 50): NewClient[] {
  const now = Date.now();
  return Array.from({ length }, (_, i) => {
    const name = moroccanNames[i % moroccanNames.length] + ' ' + ['El', 'Ben', 'Ait', 'Bou', 'Al'][Math.floor(Math.random() * 5)] + ' ' + moroccanNames[(i * 3) % moroccanNames.length];
    const visits = Math.floor(Math.random() * 5) + 1;
    const firstVisit = new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const lastVisitOffset = Math.random() * (now - firstVisit.getTime());
    const lastVisit = new Date(firstVisit.getTime() + lastVisitOffset);
    return {
      id: i + 1,
      name,
      email: `${name.replace(/\s/g, '').toLowerCase()}@email.com`,
      phone: `+212 6 ${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      joinedDate: new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000),
      visits,
      totalSpent: Math.floor(Math.random() * 2000) + 100,
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
      growth: Math.floor(Math.random() * 40) - 10,
      firstVisit,
      lastVisit,
    };
  });
}

export function generateSampleServiceCategories(): ServiceCategory[] {
  return servicesList.map((name, i) => {
    let malePercentage: number;
    let femalePercentage: number;
    if (name === 'Coiffure Homme' || name === 'Barbier') {
      malePercentage = 100;
      femalePercentage = 0;
    } else if (
      name === 'Coiffure Femme' ||
      name === 'Manucure & Pédicure' ||
      name === 'Maquillage'
    ) {
      malePercentage = 0;
      femalePercentage = 100;
    } else {
      malePercentage = Math.floor(Math.random() * 60) + 20;
      femalePercentage = 100 - malePercentage;
    }
    const totalVisits = Math.floor(Math.random() * 300) + 50;
    const maleVisits = Math.floor((totalVisits * malePercentage) / 100);
    const femaleVisits = totalVisits - maleVisits;
    
    return {
      id: i + 1,
      name,
      totalVisits,
      maleVisits,
      femaleVisits,
      malePercentage,
      femalePercentage,
      avgDuration: Math.floor(Math.random() * 90) + 30,
      revenue: Math.floor(Math.random() * 50000) + 10000,
      growth: Math.floor(Math.random() * 50) - 10,
    };
  });
}

export function enrichAndRankClients(parsedClients: any[]): ClientRanking[] {
  const enrichedClients: ClientRanking[] = parsedClients.map((client: any, index: number) => {
    const totalSpent = client.totalSpent || Math.floor(Math.random() * 19500) + 500;
    const totalVisits = client.totalVisits || Math.floor(Math.random() * 50) + 5;
    const averageRating = client.averageRating ? parseFloat(String(client.averageRating)) : parseFloat((Math.random() * 2 + 3).toFixed(1));
    const lastVisit = client.lastVisit ? new Date(client.lastVisit) : new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
    const growth = client.growth !== undefined ? client.growth : Math.floor(Math.random() * 60) - 20;
    const loyaltyScore = client.loyaltyScore !== undefined ? client.loyaltyScore : Math.floor(Math.random() * 40) + 60;
    const favoriteService = client.favoriteService || ['Coiffeur', 'Spa', 'Massage', 'Manucure'][Math.floor(Math.random() * 4)];

    return {
      ...client,
      rank: index + 1,
      totalSpent,
      totalVisits,
      averageRating,
      lastVisit,
      growth,
      loyaltyScore,
      favoriteService,
    };
  });

  enrichedClients.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
  
  enrichedClients.forEach((client, index) => {
    client.rank = index + 1;
  });

  return enrichedClients;
}

export function generateSampleRankedClients(length: number = 100): ClientRanking[] {
  const generatedClients: ClientRanking[] = Array.from({ length }, (_, i) => {
    const nameIdx = i % moroccanNames.length;
    const name = `${moroccanNames[nameIdx]} ${moroccanNames[(nameIdx + 5) % moroccanNames.length]}`;
    return {
      id: i + 1,
      name,
      email: `${moroccanNames[nameIdx].toLowerCase()}@email.com`,
      phone: `+212 6 ${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      status: 'Active',
      rank: i + 1,
      totalSpent: Math.floor(Math.random() * 5500) + 500, // MAD realistic, max 6000
      totalVisits: Math.floor(Math.random() * 50) + 5,
      averageRating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
      lastVisit: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      growth: Math.floor(Math.random() * 60) - 20,
      loyaltyScore: Math.floor(Math.random() * 40) + 60,
      favoriteService: ['Coiffeur', 'Spa', 'Massage', 'Manucure'][Math.floor(Math.random() * 4)],
    };
  });

  generatedClients.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
  generatedClients.forEach((client, index) => {
    client.rank = index + 1;
  });

  return generatedClients;
}

export function generateSampleCancelledAppointments(length: number = 10): CancelledAppointment[] {
  const collaboratorNames = employees;
  const actualClients = Array.from({ length: 10 }, (_, i) => {
    const nameIdx = i % moroccanNames.length;
    return `${moroccanNames[nameIdx]} ${['El', 'Ben', 'Ait', 'Bou', 'Al'][i % 5]} ${moroccanNames[(nameIdx + 5) % moroccanNames.length]}`;
  });

  function formatDate(date: Date) {
    return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  const baseDate = new Date('2025-11-12T10:00:00');
  return Array.from({ length }).map((_, i) => {
    const daysAgo = 29 - i * 3;
    const rdvDate = new Date(baseDate);
    rdvDate.setDate(baseDate.getDate() - daysAgo);
    rdvDate.setHours(9 + (i % 8), 0);
    const creationDate = new Date(rdvDate);
    creationDate.setDate(rdvDate.getDate() - 1);
    creationDate.setHours(rdvDate.getHours() - 1, 30);
    const cancellationDate = new Date(rdvDate);
    cancellationDate.setHours(rdvDate.getHours() - 1, 45);
    return {
      id: i + 1,
      collaborator: collaboratorNames[i % collaboratorNames.length],
      date: formatDate(rdvDate),
      client: actualClients[i % actualClients.length],
      takenOnline: i % 2 === 0,
      creationDate: creationDate.toLocaleDateString('fr-FR'),
      creationTime: creationDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      cancellationDate: cancellationDate.toLocaleDateString('fr-FR'),
      cancellationTime: cancellationDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      cancelledByClient: i % 2 === 1
    };
  });
}
