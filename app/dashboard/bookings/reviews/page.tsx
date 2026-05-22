'use client';

import { useMemo, useState } from 'react';
import {
  AlertCircle,
  BarChart3,
  Check,
  Eye,
  MessageSquare,
  Search,
  Shield,
  Star,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import {
  sampleApprovedReviews,
  sampleModerationRules,
  samplePendingReviews,
  sampleRejectedReviews,
  sampleReviewPeriodStats,
} from '@/lib/mock-data';

type ReviewStatus = 'pending' | 'published' | 'hidden';

type UnifiedReview = {
  id: string;
  clientName: string;
  clientEmail: string;
  rating: number;
  comment: string;
  service?: string;
  employeeName?: string;
  date: Date;
  status: ReviewStatus;
  views?: number;
  reply?: string;
  rejectReason?: string;
  isPublic?: boolean;
};

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={14} className={star <= rating ? 'fill-primary text-foreground' : 'text-gray-300'} />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | ReviewStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [reviews, setReviews] = useState<UnifiedReview[]>([
    ...samplePendingReviews.map((review) => ({ ...review, status: 'pending' as const })),
    ...sampleApprovedReviews.map((review) => ({ ...review, status: 'published' as const })),
    ...sampleRejectedReviews.map((review) => ({ ...review, status: 'hidden' as const })),
  ]);

  const filteredReviews = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesSearch =
        !query ||
        review.clientName.toLowerCase().includes(query) ||
        review.clientEmail.toLowerCase().includes(query) ||
        review.comment.toLowerCase().includes(query) ||
        review.service?.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reviews, searchTerm, statusFilter]);

  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';
  const publishedViews = reviews.reduce((sum, review) => sum + (review.views ?? 0), 0);
  const reviewStats = sampleReviewPeriodStats.month.stats;

  const updateStatus = (reviewId: string, status: ReviewStatus) => {
    setReviews((current) => current.map((review) => (review.id === reviewId ? { ...review, status } : review)));
  };

  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
      `}</style>

      <div className="mb-8 pt-20 animate-slideUp">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="mb-2 text-5xl font-light tracking-tight text-gray-900">Reviews</h1>
            <p className="text-sm text-gray-400">Moderation, published feedback, hidden reviews, rules, and statistics in one place.</p>
          </div>
          <div className="flex items-center gap-0.5">
            {(['all', 'pending', 'published', 'hidden'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  statusFilter === status ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5 animate-fadeIn">
        {[
          { label: 'Total reviews', value: reviews.length, icon: MessageSquare },
          { label: 'Pending', value: reviews.filter((review) => review.status === 'pending').length, icon: AlertCircle },
          { label: 'Published', value: reviews.filter((review) => review.status === 'published').length, icon: Check },
          { label: 'Hidden', value: reviews.filter((review) => review.status === 'hidden').length, icon: ThumbsDown },
          { label: 'Average rating', value: averageRating, icon: Star },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-xl border border-neutral-200 bg-white p-6">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                <Icon size={18} className="text-gray-400" />
              </div>
              <p className="mb-1 text-xs text-gray-400">{item.label}</p>
              <p className="text-3xl font-light text-gray-900">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mb-6 animate-fadeIn">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search reviews..."
            className="w-full rounded-full border border-neutral-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-700 placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 animate-fadeIn">
        {filteredReviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-900">
                  <span className="text-sm font-medium text-white">{review.clientName.charAt(0).toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-medium text-gray-900">{review.clientName}</h3>
                  <div className="mt-1">{renderStars(review.rating)}</div>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${
                  review.status === 'published'
                    ? 'bg-emerald-50 text-emerald-700'
                    : review.status === 'pending'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-gray-100 text-gray-600'
                }`}
              >
                {review.status}
              </span>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              {review.service && <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600">{review.service}</span>}
              {review.employeeName && <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600">{review.employeeName}</span>}
              <span className="text-[10px] text-gray-400">
                {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-gray-600">{review.comment}</p>
            {review.rejectReason && <p className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-700">{review.rejectReason}</p>}
            {review.reply && <p className="mb-4 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">Reply: {review.reply}</p>}

            <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
              <button
                onClick={() => updateStatus(review.id, 'published')}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-[var(--reserva-ink)] hover:text-white"
              >
                <ThumbsUp size={12} />
                Publish
              </button>
              <button
                onClick={() => updateStatus(review.id, 'hidden')}
                className="rounded-full border border-neutral-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Hide
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr] animate-fadeIn">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-light text-gray-900">Moderation rules</h2>
              <p className="text-xs text-gray-400">Active review validation rules.</p>
            </div>
            <Shield size={18} className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {sampleModerationRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between rounded-xl border border-neutral-200 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{rule.name}</p>
                  <p className="mt-1 text-xs text-gray-500">{rule.description}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${rule.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                  {rule.isActive ? 'Active' : 'Paused'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-light text-gray-900">Review statistics</h2>
              <p className="text-xs text-gray-400">Monthly quality signals.</p>
            </div>
            <BarChart3 size={18} className="text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-400">Public views</p>
              <p className="mt-2 text-2xl font-light text-gray-900">{publishedViews || reviewStats.totalViews}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-400">Verified average</p>
              <p className="mt-2 text-2xl font-light text-gray-900">{reviewStats.averageRating}</p>
            </div>
            {reviewStats.ratingDistribution.slice().reverse().map((item) => (
              <div key={item.rating} className="col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-gray-600">{item.rating} stars</span>
                  <span className="text-xs font-medium text-gray-900">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(item.count / Math.max(reviewStats.totalReviews, 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
            <Eye size={14} />
            {reviewStats.totalReviews} tracked reviews this month
          </div>
        </div>
      </div>
    </div>
  );
}
