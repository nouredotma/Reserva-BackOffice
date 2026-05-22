'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Users, Calendar, DollarSign, Download, Printer, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { sampleCollaborators } from '@/lib/mockData';

export default function AnalyticsDashboard() {
  const [selectedMonth, setSelectedMonth] = useState(11); // December
  const [selectedYear, setSelectedYear] = useState(2024);
  const [compareMode, setCompareMode] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year'>('month');

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];

  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showDetails && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showDetails]);

  useEffect(() => {
  }, []);
  const collaborators = sampleCollaborators;
  const totals = {
    totalServices: collaborators.reduce((sum, c) => sum + c.totalServices, 0),
    inSalon: collaborators.reduce((sum, c) => sum + c.inSalon, 0),
    online: collaborators.reduce((sum, c) => sum + c.online, 0),
    revenue: collaborators.reduce((sum, c) => sum + c.revenue, 0),
    onlineRate: 0
  };

  totals.onlineRate = Number(((totals.online / totals.totalServices) * 100).toFixed(1));

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
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
            <h1 className="text-5xl font-light text-gray-900 tracking-tight mb-2">Resources</h1>
            <p className="text-sm text-gray-400">Detailed performance analysis by resource</p>
          </div>
          <div className="flex items-center gap-6">
            {/* Date Navigation - same design as vue-ensemble */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-lg font-light text-gray-900 min-w-[180px] text-center">
                {monthNames[selectedMonth]} {selectedYear}
              </span>
              <button
                onClick={() => navigateMonth('next')}
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
        <div className="bg-white rounded-xl border border-gray-100 p-6  transition-all group">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-colors">
              <Calendar size={20} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">+18%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Total Offers</p>
            <p className="text-3xl font-light text-gray-900">{totals.totalServices}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6  transition-all group">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-colors">
              <Users size={20} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">+12%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Booked online</p>
            <p className="text-3xl font-light text-gray-900">{totals.online}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6  transition-all group">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-colors">
              <TrendingUp size={20} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">+24%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Online rate</p>
            <p className="text-3xl font-light text-gray-900">{totals.onlineRate}%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6  transition-all group">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-colors">
              <DollarSign size={20} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">+15%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Total appointments</p>
            <p className="text-3xl font-light text-gray-900">{totals.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })} MAD</p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-fadeIn">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Offers
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pris en Salon
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booked online
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Online rate
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total appointments*
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {collaborators.map((collab, index) => (
                <tr key={collab.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{background: collab.color}}>
                        <span className="text-sm font-medium text-white">
                          {collab.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm text-gray-900 font-medium">{collab.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-gray-900">{collab.totalServices}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-gray-900">{collab.inSalon}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-emerald-600">{collab.online}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${collab.onlineRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 min-w-[45px]">
                        {collab.onlineRate.toFixed(1)} %
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {collab.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })} MAD
                    </span>
                  </td>
                </tr>
              ))}

              {/* Total Row */}
              <tr className="bg-gray-50 font-semibold border-t-2 border-gray-200">
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900 uppercase tracking-wide">Total</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-gray-900">{totals.totalServices}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-gray-900">{totals.inSalon}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-emerald-600">{totals.online}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-gray-900">{totals.onlineRate} %</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm text-gray-900">
                    {totals.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })} MAD
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Notes */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">
            <strong>Note:</strong> this is not accounting revenue; it is the sum of the prices shown in the agenda.
          </p>
          <p className="text-xs text-gray-500">
            <strong>Note:</strong> statistics are calculated every night. Actions made today will therefore be included the next day.
          </p>
        </div>
      </div>
    </div>
  );
}
