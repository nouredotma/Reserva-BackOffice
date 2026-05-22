import type {
  ApprovedReview,
  ModerationRule,
  PendingReview,
  RejectedReview,
  ReviewStats,
} from "../../types";

const now = new Date();
const daysAgo = (days: number, hour = 10, minute = 0) => {
  const date = new Date(now);
  date.setDate(now.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date;
};

export const samplePendingReviews: PendingReview[] = [
  {
    id: "R-P-1",
    clientName: "Omar Slaoui",
    clientEmail: "omar.slaoui@email.com",
    rating: 5,
    comment: "Magical garden atmosphere and attentive service.",
    service: "Table Reservation",
    date: daysAgo(1, 22, 0),
    status: "pending",
  },
  {
    id: "R-P-2",
    clientName: "Salma Idrissi",
    clientEmail: "salma.idrissi@email.com",
    rating: 4,
    comment: "Wonderful dinner; slight wait for the terrace table.",
    service: "Private Garden Dining",
    date: daysAgo(2, 21, 10),
    status: "pending",
  },
];

export const sampleApprovedReviews: ApprovedReview[] = [
  {
    id: "R-A-1",
    clientName: "Ahmed Benali",
    clientEmail: "ahmed.benali@email.com",
    rating: 5,
    comment: "Chef's Table was outstanding — every course a surprise.",
    service: "Chef's Table Experience",
    date: daysAgo(4, 23, 0),
    status: "approved",
    isPublic: true,
    views: 184,
    reply: "Thank you Ahmed — the chef was delighted to host you.",
    replyDate: daysAgo(3, 12, 0),
  },
  {
    id: "R-A-2",
    clientName: "Yasmine Alaoui",
    clientEmail: "yasmine.alaoui@email.com",
    rating: 5,
    comment: "The private garden setup for our anniversary was perfect.",
    service: "Private Garden Dining",
    date: daysAgo(8, 22, 0),
    status: "approved",
    isPublic: true,
    views: 265,
  },
];

export const sampleRejectedReviews: RejectedReview[] = [
  {
    id: "R-R-1",
    clientName: "Test account",
    clientEmail: "test@example.com",
    rating: 1,
    comment: "Promotional link unrelated to Le Jardin.",
    service: "Table Reservation",
    date: daysAgo(6, 9, 0),
    status: "rejected",
    rejectReason: "Promotional spam",
    rejectedDate: daysAgo(6, 10, 0),
  },
];

export const sampleModerationRules: ModerationRule[] = [
  {
    id: "MR-1",
    name: "Block promotional content",
    description: "Auto-reject reviews with external links or promo codes.",
    type: "keyword",
    condition: "http, promo, coupon, external link",
    action: "auto-reject",
    isActive: true,
    createdDate: daysAgo(45, 10, 0),
    appliedCount: 18,
  },
];

const makeStats = (
  totalReviews: number,
  pendingReviews: number,
  approvedReviews: number,
  rejectedReviews: number,
  averageRating: number,
  totalViews: number,
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
    { rating: 1, count: Math.max(1, Math.round(totalReviews * 0.03)) },
  ],
  trendsLastMonth: {
    total: 12,
    approved: 9,
    rejected: 2,
    averageRating: 0.2,
  },
});

export const sampleReviewPeriodStats: Record<
  "week" | "month" | "year",
  {
    trendData: { name: string; reviews: number; vues: number }[];
    ratingTrendData: { month: string; rating: number }[];
    stats: ReviewStats;
  }
> = {
  week: {
    trendData: [
      { name: "Mon", reviews: 4, vues: 120 },
      { name: "Tue", reviews: 3, vues: 98 },
      { name: "Wed", reviews: 6, vues: 180 },
      { name: "Thu", reviews: 5, vues: 160 },
      { name: "Fri", reviews: 8, vues: 240 },
      { name: "Sat", reviews: 12, vues: 360 },
      { name: "Sun", reviews: 9, vues: 310 },
    ],
    ratingTrendData: [
      { month: "Mon", rating: 4.5 },
      { month: "Tue", rating: 4.6 },
      { month: "Wed", rating: 4.7 },
      { month: "Thu", rating: 4.6 },
      { month: "Fri", rating: 4.8 },
      { month: "Sat", rating: 4.9 },
      { month: "Sun", rating: 4.7 },
    ],
    stats: makeStats(47, 6, 38, 3, 4.7, 1468),
  },
  month: {
    trendData: [
      { name: "S1", reviews: 32, vues: 920 },
      { name: "S2", reviews: 41, vues: 1120 },
      { name: "S3", reviews: 48, vues: 1380 },
      { name: "S4", reviews: 55, vues: 1640 },
    ],
    ratingTrendData: [
      { month: "S1", rating: 4.5 },
      { month: "S2", rating: 4.6 },
      { month: "S3", rating: 4.7 },
      { month: "S4", rating: 4.8 },
    ],
    stats: makeStats(176, 18, 148, 10, 4.7, 5060),
  },
  year: {
    trendData: [
      { name: "Jan", reviews: 96, vues: 2400 },
      { name: "Feb", reviews: 104, vues: 2680 },
      { name: "Mar", reviews: 118, vues: 2940 },
      { name: "Apr", reviews: 132, vues: 3300 },
      { name: "May", reviews: 151, vues: 3880 },
      { name: "Jun", reviews: 164, vues: 4210 },
    ],
    ratingTrendData: [
      { month: "Jan", rating: 4.4 },
      { month: "Feb", rating: 4.5 },
      { month: "Mar", rating: 4.6 },
      { month: "Apr", rating: 4.6 },
      { month: "May", rating: 4.7 },
      { month: "Jun", rating: 4.8 },
    ],
    stats: makeStats(523, 12, 498, 13, 4.7, 19410),
  },
};
