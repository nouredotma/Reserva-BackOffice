'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, DollarSign, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

export default function RdvPasFriusPage() {
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year'>('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Generate daily data for the selected month
  const generateDailyData = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const dailyData = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const random = Math.random();
      const totalRdv = Math.floor(Math.random() * 5);
      const pasFrius = totalRdv > 0 ? Math.floor(random * totalRdv) : 0;
      const tauxPasFrius = totalRdv > 0 ? ((pasFrius / totalRdv) * 100).toFixed(1) : '0';
      dailyData.push({
        date: `${day.toString().padStart(2, '0')}/${(selectedMonth + 1).toString().padStart(2, '0')}`,
        totalRdv,
        pasFrius,
        tauxPasFrius: tauxPasFrius + '%'
      });
    }
    return dailyData;
  };

  const dailyData = generateDailyData();

  const totals = dailyData.reduce((acc, day) => ({
    totalRdv: acc.totalRdv + day.totalRdv,
    pasFrius: acc.pasFrius + day.pasFrius
  }), { totalRdv: 0, pasFrius: 0 });

  const totalTauxPasFrius = totals.totalRdv > 0 ? ((totals.pasFrius / totals.totalRdv) * 100).toFixed(1) : '0';


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
            <h1 className="text-5xl font-light text-gray-900 tracking-tight mb-2">No-shows</h1>
            <p className="text-sm text-gray-400">No-show appointment statistics</p>
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
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors">
              <Download size={14} />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8 animate-fadeIn">
        <div className="bg-white rounded-xl border border-gray-100 p-6  transition-all group">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-colors">
              <Calendar size={20} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">+8%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Total Offers</p>
            <p className="text-3xl font-light text-gray-900">{totals.totalRdv}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6  transition-all group">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-colors">
              <Users size={20} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">+5%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Pris en Salon</p>
            <p className="text-3xl font-light text-gray-900">{totals.pasFrius}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6  transition-all group">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-colors">
              <DollarSign size={20} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">+2%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Booked online</p>
            <p className="text-3xl font-light text-gray-900">{totalTauxPasFrius}%</p>
          </div>
        </div>
      </div>

      {/* Daily Statistics Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-fadeIn">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL PRESTATIONS</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">PRIS EN SALON</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">PRIS EN LIGNE</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ONLINE RATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dailyData.map((day, index) => (
                <tr key={index} className={`hover:bg-gray-50 transition-colors ${day.totalRdv === 0 ? 'bg-gray-50/50' : ''}`}>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{day.date}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-gray-900">{day.totalRdv}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-medium ${day.pasFrius > 0 ? 'text-emerald-600' : 'text-gray-900'}`}>{day.pasFrius}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-gray-900">0</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {day.totalRdv > 0 ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500" style={{ width: day.tauxPasFrius }} />
                        </div>
                        <span className="text-sm font-medium text-gray-900 min-w-[50px]">{day.tauxPasFrius}</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-sm font-medium text-gray-400">0%</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Footer Notes */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">
            <strong>Attention:</strong> No-show appointments represent absences or cancellations without notice.
          </p>
          <p className="text-xs text-gray-500">
            <strong>Note:</strong> statistics are calculated every night. Actions made today will be included the next day.
          </p>
        </div>
      </div>
    </div>
  );
}
