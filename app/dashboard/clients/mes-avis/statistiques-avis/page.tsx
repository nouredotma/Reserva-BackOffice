'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Star, MessageSquare, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ReviewStats, sampleReviewPeriodStats, sampleEmployeeReviewStats } from '@/lib/mockData';

export default function StatistiquesAvisPage() {
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    pendingReviews: 0,
    approvedReviews: 0,
    rejectedReviews: 0,
    averageRating: 0,
    totalViews: 0,
    ratingDistribution: [],
    trendsLastMonth: {
      total: 0,
      approved: 0,
      rejected: 0,
      averageRating: 0,
    },
  });
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const pending = JSON.parse(localStorage.getItem('pendingReviews') || '[]');
    const approved = JSON.parse(localStorage.getItem('approvedReviews') || '[]');
    const rejected = JSON.parse(localStorage.getItem('rejectedReviews') || '[]');

    const allReviews = [...pending, ...approved, ...rejected];
    const totalReviews = allReviews.length;

    const ratingsSum = allReviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0);
    const averageRating = totalReviews > 0 ? ratingsSum / totalReviews : 0;

    const totalViews = approved.reduce((sum: number, r: any) => sum + (r.views || 0), 0);

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allReviews.forEach((r: any) => {
      if (r.rating) distribution[r.rating]++;
    });
    const ratingDistribution = Object.entries(distribution).map(([rating, count]) => ({
      rating: Number(rating),
      count,
    }));

    setStats({
      totalReviews,
      pendingReviews: pending.length,
      approvedReviews: approved.length,
      rejectedReviews: rejected.length,
      averageRating,
      totalViews,
      ratingDistribution,
      trendsLastMonth: {
        total: 12,
        approved: 8,
        rejected: 2,
        averageRating: 4.5,
      },
    });
  };

  // Use filtered data based on timeFilter
  const filteredStats = sampleReviewPeriodStats[timeFilter].stats;
  const trendData = sampleReviewPeriodStats[timeFilter].trendData;
  const ratingTrendData = sampleReviewPeriodStats[timeFilter].ratingTrendData;
  const distributionData = filteredStats.ratingDistribution
    .sort((a, b) => b.rating - a.rating)
    .map(item => ({
      rating: `${item.rating}★`,
      count: item.count,
      percentage: filteredStats.totalReviews > 0 ? ((item.count / filteredStats.totalReviews) * 100).toFixed(0) : '0'
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-900">{payload[0].value}</p>
        </div>
      );
    }
    return null;
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
        .accent-color { color: #0A0A0A; }
      `}</style>

      {/* Header */}
      <div className="mb-12 pt-20 animate-slideUp">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-light text-gray-900 tracking-tight mb-2">Statistiques</h1>
            <p className="text-sm text-gray-400">Vue d'ensemble des performances</p>
          </div>
          <div className="flex items-center gap-2">
            {(['week', 'month', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeFilter(period)}
                className={`px-4 py-2 text-xs font-medium transition-all ${
                  timeFilter === period 
                    ? 'accent-color' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {period === 'week' ? '7j' : period === 'month' ? '30j' : '1an'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8 animate-fadeIn">
        {/* Total Reviews */}
        <div className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
              <MessageSquare size={18} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              <ArrowUpRight size={14} />
              <span className="text-xs font-medium">+12%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Total avis</p>
            <p className="text-3xl font-light text-gray-900">{filteredStats.totalReviews}</p>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
              <Star size={18} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              <ArrowUpRight size={14} />
              <span className="text-xs font-medium">+0.2</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Note moyenne</p>
            <p className="text-3xl font-light text-gray-900">{filteredStats.averageRating.toFixed(1)}</p>
          </div>
        </div>

        {/* Approval Rate */}
        <div className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
              <TrendingUp size={18} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              <ArrowUpRight size={14} />
              <span className="text-xs font-medium">+8%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Taux approbation</p>
            <p className="text-3xl font-light text-gray-900">{filteredStats.approvedReviews > 0 
              ? ((filteredStats.approvedReviews / filteredStats.totalReviews) * 100).toFixed(1)
              : '0'}%</p>
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
              <Eye size={18} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              <ArrowUpRight size={14} />
              <span className="text-xs font-medium">+156</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Vues totales</p>
            <p className="text-3xl font-light text-gray-900">{filteredStats.totalViews}</p>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Reviews Trend - Large */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-100 p-6 animate-fadeIn">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-1">Tendance des avis</h3>
            <p className="text-xs text-gray-400">Évolution sur 7 jours</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorAvis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFC900" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#FFC900" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={{ stroke: '#f0f0f0' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="avis" 
                stroke="#FFC900" 
                strokeWidth={2}
                fill="url(#colorAvis)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-lg border border-gray-100 p-6 animate-fadeIn">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-1">Répartition</h3>
            <p className="text-xs text-gray-400">Status des avis</p>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Approuvés</span>
                <span className="text-sm font-medium text-gray-900">{filteredStats.approvedReviews}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-900 rounded-full transition-all duration-500"
                  style={{ width: `${(filteredStats.approvedReviews / filteredStats.totalReviews) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">En attente</span>
                <span className="text-sm font-medium text-gray-900">{filteredStats.pendingReviews}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-400 rounded-full transition-all duration-500"
                  style={{ width: `${(filteredStats.pendingReviews / filteredStats.totalReviews) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Refusés</span>
                <span className="text-sm font-medium text-gray-900">{filteredStats.rejectedReviews}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-300 rounded-full transition-all duration-500"
                  style={{ width: `${(filteredStats.rejectedReviews / filteredStats.totalReviews) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Temps moyen</span>
              <span className="text-lg font-light text-gray-900">2.5h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-2 gap-6 animate-fadeIn">
        {/* Rating Distribution */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-1">Distribution des notes</h3>
            <p className="text-xs text-gray-400">Répartition par étoiles</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={distributionData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis 
                type="category" 
                dataKey="rating" 
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 || index === 1 ? '#FFC900' : '#d1d5db'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Rating Trend */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-1">Évolution de la note</h3>
            <p className="text-xs text-gray-400">6 derniers mois</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={ratingTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={{ stroke: '#f0f0f0' }}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 5]}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="rating" 
                stroke="#FFC900" 
                strokeWidth={2}
                dot={{ fill: '#FFC900', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-3 gap-4 mt-6 animate-fadeIn">
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-400">Avis positifs</p>
            <div className="flex items-center gap-1 text-emerald-600">
              <ArrowUpRight size={12} />
              <span className="text-[10px] font-medium">+15%</span>
            </div>
          </div>
          <p className="text-2xl font-light text-gray-900 mb-1">
            {filteredStats.ratingDistribution.filter(d => d.rating >= 4).reduce((sum, d) => sum + d.count, 0)}
          </p>
          <p className="text-xs text-gray-500">4-5 étoiles</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-400">Taux de réponse</p>
            <div className="flex items-center gap-1 text-emerald-600">
              <ArrowUpRight size={12} />
              <span className="text-[10px] font-medium">+5%</span>
            </div>
          </div>
          <p className="text-2xl font-light text-gray-900 mb-1">
            {filteredStats.approvedReviews > 0 ? ((filteredStats.approvedReviews * 0.6).toFixed(0)) : 0}%
          </p>
          <p className="text-xs text-gray-500">Réponses données</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-400">Vues par avis</p>
            <div className="flex items-center gap-1 text-emerald-600">
              <ArrowUpRight size={12} />
              <span className="text-[10px] font-medium">+8%</span>
            </div>
          </div>
          <p className="text-2xl font-light text-gray-900 mb-1">
            {filteredStats.approvedReviews > 0 ? Math.round(filteredStats.totalViews / filteredStats.approvedReviews) : 0}
          </p>
          <p className="text-xs text-gray-500">Moyenne</p>
        </div>
      </div>

      {/* Employee Statistics */}
      <div className="mt-8 animate-fadeIn">
        <div className="mb-6">
          <h2 className="text-2xl font-light text-gray-900 mb-1">Performance des employés</h2>
          <p className="text-xs text-gray-400">Statistiques individuelles par employé</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {sampleEmployeeReviewStats.map((employee, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                {/* Employee Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{employee.name}</h3>
                    <p className="text-xs text-gray-400">{employee.role}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="flex items-center gap-8">
                  {/* Total Reviews */}
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Avis reçus</p>
                    <p className="text-lg font-medium text-gray-900">{employee.reviews}</p>
                  </div>

                  {/* Average Rating */}
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Note moyenne</p>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-foreground fill-primary" />
                      <p className="text-lg font-medium text-gray-900">{employee.avgRating}</p>
                    </div>
                  </div>

                  {/* Star Distribution */}
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">5★</p>
                      <p className="text-sm font-medium text-gray-900">{employee.stars5}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">4★</p>
                      <p className="text-sm font-medium text-gray-900">{employee.stars4}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">3★</p>
                      <p className="text-sm font-medium text-gray-900">{employee.stars3}</p>
                    </div>
                  </div>

                  {/* Response Rate */}
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Réponses</p>
                    <p className="text-lg font-medium text-gray-900">
                      {Math.round((employee.responses / employee.reviews) * 100)}%
                    </p>
                  </div>

                  {/* Trend */}
                  <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                    <ArrowUpRight size={12} />
                    <span className="text-xs font-medium">{employee.trend}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 min-w-[80px]">Satisfaction</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(employee.avgRating / 5) * 100}%`, background: '#FFC900' }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-900 min-w-[40px] text-right">
                    {((employee.avgRating / 5) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}