// Domain types for the Reserva establishment back office.


export interface Transaction {
  id: string;
  type: 'Sale' | 'Refund' | 'Deposit' | 'Withdrawal';
  amount: number;
  method: 'Cash' | 'Card' | 'Transfer' | 'Check';
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

export interface BookableServiceFixture {
  id: number;
  name: string;
  abbreviation: string;
  description: string;
  color: string;
  price: number;
  priceType: 'fixed' | 'from' | 'range';
  priceFrom?: number;
  priceTo?: number;
  onQuote: boolean;
  duration: number;
  category: string;
  visibility: 'bookable' | 'visible' | 'hidden';
  competences: string[];
  multipleProviders: boolean;
}

