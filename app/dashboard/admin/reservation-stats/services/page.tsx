'use client';

import React, { useState, useEffect } from 'react';
import { Download, ChevronLeft, ChevronRight, Calendar, TrendingUp } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function OffersPage() {
  const [mounted, setMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('December 2024');
  const [compareMode, setCompareMode] = useState(false);
  const [timeFilter, setTimeFilter] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    setMounted(true);
  }, []);

  const offresData = [
    {
      category: 'RESTAURANTS',
      items: [
        { name: 'Table VIP - Le Jardin', total: 32, salon: 6, ligne: 26, taux: 81.3, revenue: '14 400 MAD' },
        { name: 'Brunch signature', total: 24, salon: 4, ligne: 20, taux: 83.3, revenue: '9 120 MAD' },
        { name: 'Rooftop dinner', total: 18, salon: 3, ligne: 15, taux: 83.3, revenue: '11 700 MAD' },
      ]
    },
    {
      category: 'ACCOMMODATION',
      items: [
        { name: 'Suite deluxe', total: 14, salon: 2, ligne: 12, taux: 85.7, revenue: '23 100 MAD' },
        { name: 'Private riad', total: 5, salon: 1, ligne: 4, taux: 80, revenue: '31 000 MAD' },
      ]
    },
    {
      category: 'DAY PASSES',
      items: [
        { name: 'Day pass rooftop pool', total: 46, salon: 8, ligne: 38, taux: 82.6, revenue: '13 800 MAD' },
        { name: 'Private cabana', total: 12, salon: 2, ligne: 10, taux: 83.3, revenue: '8 400 MAD' },
      ]
    },
    {
      category: 'WELLNESS',
      items: [
        { name: 'Rituel hammam & massage', total: 21, salon: 3, ligne: 18, taux: 85.7, revenue: '18 900 MAD' },
        { name: 'Cabine duo spa', total: 9, salon: 1, ligne: 8, taux: 88.9, revenue: '12 600 MAD' },
      ]
    },
    {
      category: 'CONCIERGERIE',
      items: [
        { name: 'Premium airport transfer', total: 17, salon: 2, ligne: 15, taux: 88.2, revenue: '11 050 MAD' },
        { name: 'Custom request', total: 8, salon: 3, ligne: 5, taux: 62.5, revenue: '19 200 MAD' },
      ]
    },
  ];
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
        .accent-bg { background-color: #0A0A0A; }
      `}</style>

      {/* Header */}
      <div className="mb-12 pt-20 animate-slideUp">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-light text-gray-900 tracking-tight mb-2">Offers</h1>
            <p className="text-sm text-gray-400">Detailed analysis of bookable offers</p>
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
                Today
              </button>
            </div>
            {/* Time Filter */}
            <div className="flex items-center gap-2">
              {["week", "month", "year"].map((period) => (
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
            {/* Export Button */}
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors">
              <Download size={14} />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8 animate-fadeIn">
        <div className="bg-white rounded-lg border border-gray-100 p-6  transition-all">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">+12%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Total offres</p>
            <p className="text-3xl font-light text-gray-900">39</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-6  transition-all">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">+8%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Pris en direct</p>
            <p className="text-3xl font-light text-gray-900">2</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-6  transition-all">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">+15%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Pris en ligne</p>
            <p className="text-3xl font-light text-gray-900">37</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-6  transition-all">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">+18%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Taux en ligne</p>
            <p className="text-3xl font-light text-gray-900">94.9%</p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden animate-fadeIn">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Offre
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total offres
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pris en direct
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pris en ligne
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taux en ligne
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total des reservations*
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {offresData.map((category, catIndex) => (
                <React.Fragment key={catIndex}>
                  {category.items.map((item, itemIndex) => {
                    const isCategory = itemIndex === 0;
                    return (
                      <tr
                        key={itemIndex}
                        className={`hover:bg-gray-50 transition-colors ${
                          isCategory ? 'bg-gray-50/50 font-medium' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <span className={`text-sm ${isCategory ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                            {item.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-sm ${isCategory ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                            {item.total}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-sm ${isCategory ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                            {item.salon}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-sm ${isCategory ? 'font-semibold text-emerald-600' : 'text-emerald-600'}`}>
                            {item.ligne}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[100px]">
                              <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${item.taux}%` }}
                              />
                            </div>
                            <span className={`text-sm min-w-[50px] ${isCategory ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                              {item.taux} %
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-sm ${isCategory ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                            {item.revenue}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 text-xs text-gray-400">
        * Total reservations represent the revenue generated by offers
      </div>
    </div>
  );
}