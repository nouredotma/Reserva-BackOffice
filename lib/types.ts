// Domain types for the Reserva establishment back office.


export interface Transaction {
  id: string;
  type: 'Sale' | 'Refund' | 'Deposit' | 'Withdrawal';
  amount: number;
  method: 'Cash' | 'Card' | 'Transfer' | 'Check';
  client?: string;
  date: Date;
  note?: string;
  category?: string;
}

export type BookingModeType = 'appointment' | 'reservation' | 'ticket' | 'request';

export interface Appointment {
  id: number;
  bookingId?: string;
  clientName: string;
  service: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no_show' | string;
  phone?: string;
  email?: string;
  date: Date;
  notes?: string;
  bookingMode?: BookingModeType;
  partySize?: number;
  channel?: 'online' | 'direct';
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

export interface PendingReview {
  id: string;
  clientName: string;
  clientEmail: string;
  rating: number;
  comment: string;
  service?: string;
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
}

export interface RejectedReview {
  id: string;
  clientName: string;
  clientEmail: string;
  rating: number;
  comment: string;
  service?: string;
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
}
