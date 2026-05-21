'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Users, Clock, ArrowUpRight, Camera, ArrowDownRight,ChevronLeft,ChevronRight, DollarSign, Phone, Mail, MapPin, Eye, Star, MessageSquare, BarChart3, PieChart, FileText, Download, Globe, Smartphone, Store } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RePieChart, Pie } from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SMEDashboard() {
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year'>('month');
  const [mounted, setMounted] = useState(false);
  // Add month picker state
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper for month names
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  // Mock data based on time filter
  const dashboardData = {
    week: {
      onlineAppointments: 36,
      totalAppointments: 38,
      onlineRate: 94.7,
      newOnlineClients: 3,
      newDirectClients: 0,
      appointmentsTrend: [
        { day: '01', direct: 1, online: 2 },
        { day: '02', direct: 0, online: 0 },
        { day: '03', direct: 0, online: 0 },
        { day: '04', direct: 0, online: 1 },
        { day: '05', direct: 0, online: 0 },
        { day: '06', direct: 0, online: 2 },
        { day: '07', direct: 0, online: 2 },
      ],
      revenueData: [
        { name: 'Lun', value: 2400 },
        { name: 'Mar', value: 2800 },
        { name: 'Mer', value: 3200 },
        { name: 'Jeu', value: 2900 },
        { name: 'Ven', value: 3800 },
        { name: 'Sam', value: 4200 },
        { name: 'Dim', value: 3600 },
      ],
      totalRevenue: 23000,
      avgRevenue: 3285,
      peakDay: 'Samedi',
    },
    month: {
      onlineAppointments: 156,
      totalAppointments: 165,
      onlineRate: 94.5,
      newOnlineClients: 28,
      newDirectClients: 4,
      appointmentsTrend: [
        { day: '01', direct: 1, online: 2 },
        { day: '02', direct: 0, online: 0 },
        { day: '03', direct: 0, online: 0 },
        { day: '04', direct: 0, online: 1 },
        { day: '05', direct: 0, online: 0 },
        { day: '06', direct: 0, online: 2 },
        { day: '07', direct: 0, online: 2 },
        { day: '08', direct: 0, online: 2 },
        { day: '09', direct: 0, online: 0 },
        { day: '10', direct: 0, online: 0 },
        { day: '11', direct: 0, online: 1 },
        { day: '12', direct: 0, online: 1 },
        { day: '13', direct: 0, online: 1 },
        { day: '14', direct: 1, online: 3 },
        { day: '15', direct: 0, online: 4 },
        { day: '16', direct: 0, online: 0 },
        { day: '17', direct: 0, online: 3 },
        { day: '18', direct: 0, online: 0 },
        { day: '19', direct: 1, online: 1 },
        { day: '20', direct: 0, online: 4 },
        { day: '21', direct: 0, online: 3 },
        { day: '22', direct: 0, online: 3 },
        { day: '23', direct: 0, online: 0 },
        { day: '24', direct: 0, online: 0 },
        { day: '25', direct: 0, online: 1 },
        { day: '26', direct: 0, online: 1 },
        { day: '27', direct: 0, online: 1 },
        { day: '28', direct: 0, online: 1 },
        { day: '29', direct: 1, online: 1 },
        { day: '30', direct: 0, online: 1 },
      ],
      revenueData: [
        { name: 'S1', value: 12400 },
        { name: 'S2', value: 15800 },
        { name: 'S3', value: 18200 },
        { name: 'S4', value: 21900 },
      ],
      totalRevenue: 68300,
      avgRevenue: 2276,
      peakDay: 'Vendredi',
    },
    year: {
      onlineAppointments: 1842,
      totalAppointments: 1950,
      onlineRate: 94.5,
      newOnlineClients: 285,
      newDirectClients: 42,
      appointmentsTrend: [
        { day: 'Jan', direct: 8, online: 145 },
        { day: 'Fév', direct: 6, online: 152 },
        { day: 'Mar', direct: 9, online: 148 },
        { day: 'Avr', direct: 7, online: 156 },
        { day: 'Mai', direct: 5, online: 162 },
        { day: 'Jun', direct: 4, online: 158 },
        { day: 'Jul', direct: 3, online: 168 },
        { day: 'Août', direct: 2, online: 172 },
        { day: 'Sep', direct: 4, online: 165 },
        { day: 'Oct', direct: 5, online: 159 },
        { day: 'Nov', direct: 3, online: 155 },
        { day: 'Déc', direct: 4, online: 156 },
      ],
      revenueData: [
        { name: 'Jan', value: 45200 },
        { name: 'Fév', value: 48800 },
        { name: 'Mar', value: 52400 },
        { name: 'Avr', value: 55900 },
        { name: 'Mai', value: 58200 },
        { name: 'Jun', value: 61800 },
        { name: 'Jul', value: 65400 },
        { name: 'Aoû', value: 68900 },
        { name: 'Sep', value: 63200 },
        { name: 'Oct', value: 59800 },
        { name: 'Nov', value: 56400 },
        { name: 'Déc', value: 68300 },
      ],
      totalRevenue: 704300,
      avgRevenue: 58691,
      peakDay: 'Août',
    },
  };

  const currentData = timeFilter === 'month' ? dashboardData['month'] : dashboardData[timeFilter];

  // Service distribution data
  const serviceData = [
    { name: 'Restaurants', value: 420, color: '#FFC900' },
    { name: 'Hébergements', value: 280, color: '#3B82F6' },
    { name: 'Day passes', value: 190, color: '#60A5FA' },
    { name: 'Wellness', value: 150, color: '#93C5FD' },
    { name: 'Conciergerie', value: 110, color: '#DBEAFE' },
  ];
  // Employee performance data
  const employeeData = [
    { name: 'Restaurant floor', appointments: 82, revenue: 38400, rating: 4.8, growth: '+12%' },
    { name: 'Wellness suites', appointments: 38, revenue: 31500, rating: 4.7, growth: '+8%' },
    { name: 'Pool & beach', appointments: 96, revenue: 28800, rating: 4.6, growth: '+15%' },
    { name: 'Concierge desk', appointments: 31, revenue: 30250, rating: 4.9, growth: '+5%' },
  ];
  // Time slot popularity
  const timeSlotData = [
    { slot: '09:00', count: 12 },
    { slot: '10:00', count: 18 },
    { slot: '11:00', count: 22 },
    { slot: '12:00', count: 15 },
    { slot: '14:00', count: 25 },
    { slot: '15:00', count: 28 },
    { slot: '16:00', count: 24 },
    { slot: '17:00', count: 20 },
    { slot: '18:00', count: 16 },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3 py-2 rounded-lg  border border-gray-100">
          <p className="text-sm font-medium text-gray-900">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-12 rounded-xl w-1/3"></div>
          <div className="bg-gray-200 h-96 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-0">
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
            <h1 className="text-5xl font-light text-gray-900 tracking-tight mb-2">Tableau de Bord</h1>
            <p className="text-sm text-gray-400">Vue d'ensemble des performances</p>
          </div>
          <div className="flex items-center gap-6">
            {/* Date Navigation - same design as vue-ensemble */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedMonth(prev => (prev === 0 ? 11 : prev - 1))}
                className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-lg font-light text-gray-900 min-w-[180px] text-center">
                {monthNames[selectedMonth]} {selectedYear}
              </span>
              <button
                onClick={() => setSelectedMonth(prev => (prev === 11 ? 0 : prev + 1))}
                className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => {
                  setSelectedMonth(new Date().getMonth());
                  setSelectedYear(new Date().getFullYear());
                }}
                className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Aujourd'hui
              </button>
            </div>
            {/* Time Filter */}
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
            <div className="h-8 w-px bg-gray-200"></div>
            {/* Export Buttons */}
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors">
              <Download size={14} />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-5 gap-4 mb-8 animate-fadeIn">
        {/* Online Appointments */}
        <div className="bg-white rounded-lg border border-gray-100 p-6  transition-all group">
          <div className="flex items-start justify-between mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">+12%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Nombre de réservations en ligne</p>
            <p className="text-3xl font-light text-gray-900">{currentData.onlineAppointments}</p>
          </div>
        </div>

        {/* Total Appointments */}
        <div className="bg-white rounded-lg border border-gray-100 p-6  transition-all group">
          <div className="flex items-start justify-between mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
              <Users size={18} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">+8%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Nombre de réservations</p>
            <p className="text-3xl font-light text-gray-900">{currentData.totalAppointments}</p>
          </div>
        </div>

        {/* Online Rate */}
        <div className="bg-white rounded-lg border border-gray-100 p-6  transition-all group">
          <div className="flex items-start justify-between mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
              <BarChart3 size={18} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">+15%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Taux en ligne</p>
            <p className="text-3xl font-light text-emerald-600">{currentData.onlineRate}%</p>
          </div>
        </div>

        {/* New Online Guests */}
        <div className="bg-white rounded-lg border border-gray-100 p-6  transition-all group">
          <div className="flex items-start justify-between mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
              <Download size={18} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">+5%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Nouveaux invités en ligne</p>
            <p className="text-3xl font-light text-gray-900">{currentData.newOnlineClients}</p>
          </div>
        </div>

        {/* New Direct Guests */}
        <div className="bg-white rounded-lg border border-gray-100 p-6  transition-all group">
          <div className="flex items-start justify-between mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
              <Clock size={18} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">+2%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Nouveaux invités en direct</p>
            <p className="text-3xl font-light text-gray-900">{currentData.newDirectClients}</p>
          </div>
        </div>
      </div>

      {/* Main Chart - Appointments Taken */}
      <div className="bg-white rounded-lg border border-gray-100 p-6 mb-8 animate-fadeIn">
        <div className="mb-6">
          <h2 className="text-xl font-light text-gray-900 mb-1">Réservations pris</h2>
          <p className="text-xs text-gray-400">Évolution quotidienne</p>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={currentData.appointmentsTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis 
              dataKey="day" 
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
            <Line 
              type="monotone" 
              dataKey="direct" 
              stroke="#1f2937" 
              strokeWidth={2}
              dot={{ fill: '#1f2937', strokeWidth: 0, r: 3 }}
              name="Pris en direct"
            />
            <Line 
              type="monotone" 
              dataKey="online" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }}
              name="Pris en ligne"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-900"></div>
            <span className="text-xs text-gray-600">Pris en direct</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-gray-600">Pris en ligne</span>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8 animate-fadeIn">
        {/* Revenue Trend */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-1">Chiffre d'affaires</h3>
            <p className="text-xs text-gray-400">Performance financière</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={currentData.revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="value" 
                stroke="#FFC900" 
                strokeWidth={2}
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-400 mb-1">Total</p>
              <p className="text-lg font-medium text-gray-900">{currentData.totalRevenue.toLocaleString()} MAD</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Moyenne</p>
              <p className="text-lg font-medium text-gray-900">{currentData.avgRevenue.toLocaleString()} MAD</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Pic</p>
              <p className="text-lg font-medium text-gray-900">{currentData.peakDay}</p>
            </div>
          </div>
        </div>

        {/* Service Distribution */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-1">Services populaires</h3>
            <p className="text-xs text-gray-400">Répartition par type</p>
          </div>
          <div className="space-y-4">
            {serviceData.map((service, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">{service.name}</span>
                  <span className="text-sm font-medium text-gray-900">{service.value}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(service.value / serviceData.reduce((sum, s) => sum + s.value, 0)) * 100}%`,
                      backgroundColor: service.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Slot Popularity & Employee Performance */}
      <div className="grid grid-cols-2 gap-6 mb-8 animate-fadeIn">
        {/* Time Slots */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-1">Créneaux populaires</h3>
            <p className="text-xs text-gray-400">Fréquentation par heure</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={timeSlotData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis 
                dataKey="slot" 
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
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {timeSlotData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.count > 24 ? '#FFC900' : entry.count > 20 ? '#3B82F6' : '#93C5FD'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-1">Métriques clés</h3>
            <p className="text-xs text-gray-400">Indicateurs de performance</p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                  <TrendingUp size={18} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Taux de présence</p>
                  <p className="text-lg font-medium text-gray-900">92.5%</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <ArrowUpRight size={14} />
                <span className="text-xs font-medium">+3.2%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                  <Clock size={18} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Durée moyenne</p>
                  <p className="text-lg font-medium text-gray-900">48 min</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <ArrowUpRight size={14} />
                <span className="text-xs font-medium">+5 min</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                  <Star size={18} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Satisfaction invité</p>
                  <p className="text-lg font-medium text-gray-900">4.7/5</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <ArrowUpRight size={14} />
                <span className="text-xs font-medium">+0.3</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                  <Users size={18} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Taux de fidélisation</p>
                  <p className="text-lg font-medium text-gray-900">78%</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <ArrowUpRight size={14} />
                <span className="text-xs font-medium">+8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Performance */}
      <div className="animate-fadeIn">
        <div className="mb-6">
          <h2 className="text-2xl font-light text-gray-900 mb-1">Performance des ressources</h2>
          <p className="text-xs text-gray-400">Statistiques individuelles du mois</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {employeeData.map((employee, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-100 p-6  transition-all">
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
                    <p className="text-xs text-gray-400">Praticien</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-12">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Réservations</p>
                    <p className="text-lg font-medium text-gray-900">{employee.appointments}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Chiffre d'affaires</p>
                    <p className="text-lg font-medium text-gray-900">{employee.revenue.toLocaleString()} MAD</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Satisfaction</p>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-foreground fill-primary" />
                      <p className="text-lg font-medium text-gray-900">{employee.rating}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                    <ArrowUpRight size={12} />
                    <span className="text-xs font-medium">{employee.growth}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 min-w-[80px]">Performance</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(employee.rating / 5) * 100}%`, background: '#FFC900' }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-900 min-w-[40px] text-right">
                    {((employee.rating / 5) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-4 gap-4 mt-8 animate-fadeIn">
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-400">Taux d'annulation</p>
            <div className="flex items-center gap-1 text-emerald-600">
              <ArrowDownRight size={12} />
              <span className="text-[10px] font-medium">-2.1%</span>
            </div>
          </div>
          <p className="text-2xl font-light text-gray-900 mb-1">5.2%</p>
          <p className="text-xs text-gray-500">En baisse ce mois</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-400">Réservations anticipées</p>
            <div className="flex items-center gap-1 text-emerald-600">
              <ArrowUpRight size={12} />
              <span className="text-[10px] font-medium">+18%</span>
            </div>
          </div>
          <p className="text-2xl font-light text-gray-900 mb-1">72%</p>
          <p className="text-xs text-gray-500">Plus de 2 jours</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-400">Panier moyen</p>
            <div className="flex items-center gap-1 text-emerald-600">
              <ArrowUpRight size={12} />
              <span className="text-[10px] font-medium">+8.5%</span>
            </div>
          </div>
          <p className="text-2xl font-light text-gray-900 mb-1">385 MAD</p>
          <p className="text-xs text-gray-500">Par réservations</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-400">Invités fidèles</p>
            <div className="flex items-center gap-1 text-emerald-600">
              <ArrowUpRight size={12} />
              <span className="text-[10px] font-medium">+12%</span>
            </div>
          </div>
          <p className="text-2xl font-light text-gray-900 mb-1">248</p>
          <p className="text-xs text-gray-500">3+ visites</p>
        </div>
      </div>

      {/* Peak Hours Analysis */}
      <div className="grid grid-cols-2 gap-6 mt-8 animate-fadeIn">
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-1">Heures de pointe</h3>
            <p className="text-xs text-gray-400">Taux d'occupation moyen</p>
          </div>
          <div className="space-y-3">
            {[
              { time: '09:00 - 11:00', rate: 65, color: '#93C5FD' },
              { time: '11:00 - 13:00', rate: 78, color: '#60A5FA' },
              { time: '14:00 - 16:00', rate: 92, color: '#3B82F6' },
              { time: '16:00 - 18:00', rate: 88, color: '#FFC900' },
              { time: '18:00 - 20:00', rate: 71, color: '#60A5FA' },
            ].map((slot, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">{slot.time}</span>
                  <span className="text-sm font-medium text-gray-900">{slot.rate}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${slot.rate}%`, backgroundColor: slot.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-1">Canaux de réservation</h3>
            <p className="text-xs text-gray-400">Origine des réservations</p>
          </div>
          <div className="space-y-4">
            {[
              { channel: 'Site web', count: 89, percentage: 44, icon: <Globe size={18} className="text-foreground" /> },
              { channel: 'Instagram', count: 32, percentage: 16, icon: <Camera size={18} className="text-foreground" /> },
              { channel: 'WhatsApp', count: 28, percentage: 14, icon: <WhatsAppIcon /> },
              { channel: 'Téléphone', count: 18, percentage: 9, icon: <Phone size={18} className="text-foreground" /> },
              { channel: 'En personne', count: 13, percentage: 7, icon: <Store size={18} className="text-foreground" /> },
            ].map((channel, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-xl">{channel.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">{channel.channel}</span>
                      <span className="text-xs font-medium text-gray-900">{channel.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${channel.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400 ml-3">{channel.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guest Demographics */}
      <div className="mt-8 animate-fadeIn">
        <div className="mb-6">
          <h2 className="text-2xl font-light text-gray-900 mb-1">Analyse invités</h2>
          <p className="text-xs text-gray-400">Démographie et comportement</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Répartition par âge</h3>
              <p className="text-xs text-gray-400">Distribution des invités</p>
            </div>
            <div className="space-y-3">
              {[
                { age: '18-25 ans', count: 42, percentage: 18 },
                { age: '26-35 ans', count: 98, percentage: 42 },
                { age: '36-45 ans', count: 62, percentage: 27 },
                { age: '46-60 ans', count: 24, percentage: 10 },
                { age: '60+ ans', count: 8, percentage: 3 },
              ].map((segment, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">{segment.age}</span>
                    <span className="text-sm font-medium text-gray-900">{segment.count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${segment.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Fréquence de visite</h3>
              <p className="text-xs text-gray-400">Comportement invité</p>
            </div>
            <div className="space-y-4">
              {[
                { type: 'Réguliers', desc: 'Hebdomadaire', count: 45, color: '#FFC900' },
                { type: 'Fréquents', desc: 'Bi-mensuel', count: 89, color: '#3B82F6' },
                { type: 'Occasionnels', desc: 'Mensuel', count: 124, color: '#60A5FA' },
                { type: 'Nouveaux', desc: 'Première visite', count: 28, color: '#93C5FD' },
              ].map((segment, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{segment.type}</p>
                      <p className="text-xs text-gray-400">{segment.desc}</p>
                    </div>
                  </div>
                  <span className="text-lg font-light text-gray-900">{segment.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Préférences horaires</h3>
              <p className="text-xs text-gray-400">Moments favoris</p>
            </div>
            <div className="space-y-4">
              {[
                { day: 'Lundi', morning: 35, afternoon: 45, evening: 20 },
                { day: 'Mardi', morning: 40, afternoon: 38, evening: 22 },
                { day: 'Mercredi', morning: 32, afternoon: 48, evening: 20 },
                { day: 'Jeudi', morning: 38, afternoon: 42, evening: 20 },
                { day: 'Vendredi', morning: 30, afternoon: 45, evening: 25 },
                { day: 'Samedi', morning: 25, afternoon: 52, evening: 23 },
              ].map((day, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600 w-20">{day.day}</span>
                    <div className="flex-1 flex gap-1">
                      <div 
                        className="h-6 bg-blue-100 rounded transition-all duration-500 flex items-center justify-center"
                        style={{ width: `${day.morning}%` }}
                      >
                        {day.morning > 25 && <span className="text-[9px] text-blue-600 font-medium">{day.morning}%</span>}
                      </div>
                      <div 
                        className="h-6 bg-primary rounded transition-all duration-500 flex items-center justify-center"
                        style={{ width: `${day.afternoon}%` }}
                      >
                        {day.afternoon > 25 && <span className="text-[9px] text-white font-medium">{day.afternoon}%</span>}
                      </div>
                      <div 
                        className="h-6 bg-blue-200 rounded transition-all duration-500 flex items-center justify-center"
                        style={{ width: `${day.evening}%` }}
                      >
                        {day.evening > 25 && <span className="text-[9px] text-blue-700 font-medium">{day.evening}%</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-center gap-4 pt-3 border-t border-gray-100 mt-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-100"></div>
                  <span className="text-[10px] text-gray-500">Matin</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-[10px] text-gray-500">Après-midi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-200"></div>
                  <span className="text-[10px] text-gray-500">Soir</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// WhatsApp SVG icon as React component
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-whatsapp text-foreground">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
    <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
  </svg>
);
