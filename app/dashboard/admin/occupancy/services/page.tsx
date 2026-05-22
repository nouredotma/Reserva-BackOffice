'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Download, Printer, ChevronLeft, ChevronRight, Users, TrendingUp, Activity, BarChart3, Filter, Clock, DollarSign, Percent } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { defaultAgendas } from '@/lib/mockData';

type ServiceData = {
  category: string;
  services: {
    name: string;
    occupancyRate: number;
    hoursWorked: string;
    totalRevenue: number;
  }[];
};

const StatistiquesPage = () => {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('services'); // services, heatmap
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [compareMode, setCompareMode] = useState(false);
  const [collaborators, setCollaborators] = useState<string[]>([]);

  // Service performance data
  const [servicesData] = useState<ServiceData[]>([
    {
      category: 'RESTAURANTS',
      services: [
        { name: 'Table VIP - Le Jardin', occupancyRate: 82.4, hoursWorked: '64h', totalRevenue: 14400 },
        { name: 'Brunch signature', occupancyRate: 68.5, hoursWorked: '42h 30', totalRevenue: 9120 },
        { name: 'Rooftop dinner', occupancyRate: 74.2, hoursWorked: '48h', totalRevenue: 11700 },
      ]
    },
    {
      category: 'ACCOMMODATION',
      services: [
        { name: 'Suite deluxe', occupancyRate: 69.1, hoursWorked: '38h', totalRevenue: 23100 },
        { name: 'Private riad', occupancyRate: 58.4, hoursWorked: '26h', totalRevenue: 31000 },
      ]
    },
    {
      category: 'DAY PASSES',
      services: [
        { name: 'Day pass rooftop pool', occupancyRate: 88.6, hoursWorked: '92h', totalRevenue: 13800 },
        { name: 'Private cabana', occupancyRate: 71.3, hoursWorked: '36h', totalRevenue: 8400 },
      ]
    },
    {
      category: 'WELLNESS',
      services: [
        { name: 'Rituel hammam & massage', occupancyRate: 76.5, hoursWorked: '48h 30', totalRevenue: 18900 },
        { name: 'Cabine duo spa', occupancyRate: 63.2, hoursWorked: '22h 30', totalRevenue: 12600 },
      ]
    },
    {
      category: 'CONCIERGERIE',
      services: [
        { name: 'Premium airport transfer', occupancyRate: 54.8, hoursWorked: '21h 15', totalRevenue: 11050 },
        { name: 'Custom request', occupancyRate: 47.6, hoursWorked: '18h', totalRevenue: 19200 },
      ]
    }
  ]);
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const storedAgendas = localStorage.getItem('employeeAgendas');
      if (storedAgendas) {
        try {
          const agendas = JSON.parse(storedAgendas);
          setCollaborators(agendas.map((a: any) => a.name));
        } catch {
          setCollaborators(defaultAgendas.map(a => a.name));
        }
      } else {
        setCollaborators(defaultAgendas.map(a => a.name));
      }
    }
  }, []);

  const getColorClass = (value: number) => {
    if (value === 0) return 'bg-gray-100 text-gray-400';
    if (value <= 25) return 'bg-emerald-100 text-emerald-700';
    if (value <= 50) return 'bg-emerald-200 text-emerald-800';
    if (value <= 75) return 'bg-emerald-400 text-emerald-900';
    return 'bg-emerald-600 text-white';
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const calculateServiceStats = () => {
    let totalRevenue = 0;
    let totalHours = 0;
    let avgOccupancy = 0;
    let count = 0;

    servicesData.forEach(category => {
      category.services.forEach(service => {
        totalRevenue += service.totalRevenue;
        avgOccupancy += service.occupancyRate;
        count++;

        // Parse hours
        const hoursMatch = service.hoursWorked.match(/(\d+)h/);
        const minutesMatch = service.hoursWorked.match(/(\d+)m/);
        if (hoursMatch) totalHours += parseInt(hoursMatch[1]);
        if (minutesMatch) totalHours += parseInt(minutesMatch[1]) / 60;
      });
    });

    return {
      totalRevenue,
      totalHours: Math.round(totalHours),
      avgOccupancy: (avgOccupancy / count).toFixed(2)
    };
  };

  const stats = calculateServiceStats();

  const exportData = () => {
    if (viewMode === 'services') {
      const csvContent = [
        ['Offer', 'Occupancy rate', 'Worked hours', 'Total reservations'].join(','),
        ...servicesData.flatMap(category =>
          category.services.map(service =>
            [service.name, `${service.occupancyRate}%`, service.hoursWorked, `${service.totalRevenue}MAD`].join(',')
          )
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `offres-${currentDate.toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  const printReport = () => {
    window.print();
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-12 rounded-xl w-1/3"></div>
          <div className="bg-gray-200 h-96 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-0 md:p-0">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }

        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <div className="mb-8 animate-slideDown pt-20">
        <div className="flex items-center justify-between mb-6">
          {/* Left: Title & Date */}
          <div className="flex items-center gap-8">
            <div className="flex items-baseline gap-3">
              <h1 className="text-5xl font-light text-gray-900 tracking-tight">
                Performance des services
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Activity size={16} />

              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4 no-print">
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Download size={16} />
              Exporter
            </button>
            <button
              onClick={printReport}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Printer size={16} />
              Print
            </button>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between">
          {/* Date Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-lg font-light text-gray-900 min-w-[180px] text-center">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => navigateMonth(1)}
              className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Today
            </button>
          </div>

          {/* Filters only (removed view toggle and compare mode) */}
          <div className="flex items-center gap-6 no-print">
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="w-[200px] rounded-full border-gray-200 text-sm">
                <SelectValue placeholder="All resources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All resources</SelectItem>
                {collaborators.map(collab => (
                  <SelectItem key={collab} value={collab.toLowerCase().split(' ')[0]}>
                    {collab}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fadeIn">
        <div className="bg-white rounded-xl border border-gray-100 p-6  transition-all group">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-colors">
              <Percent size={20} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">Moyenne</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Taux moyen d'occupation</p>
            <p className="text-3xl font-light text-gray-900">{stats.avgOccupancy}%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6  transition-all group">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-colors">
              <Clock size={20} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">Total</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Total worked hours</p>
            <p className="text-3xl font-light text-gray-900">{stats.totalHours}h</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6  transition-all group">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-colors">
              <DollarSign size={20} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">Total</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Total des reservations</p>
            <p className="text-3xl font-light text-gray-900">{stats.totalRevenue.toFixed(2)}MAD</p>
          </div>
        </div>
      </div>

      {/* Only Services Table view remains */}
      <div className="bg-white rounded-lg border border-gray-100  overflow-hidden animate-slideUp">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Offre
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occupancy rate*
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Worked hours*
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total des reservations*
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100">
              {servicesData.map((category, catIndex) => (
                <React.Fragment key={catIndex}>
                  {/* Category Header */}
                  <tr className="bg-gray-50/50">
                    <td colSpan={4} className="px-6 py-3">
                      <span className="text-sm font-medium text-gray-900">{category.category}</span>
                    </td>
                  </tr>

                  {/* Services */}
                  {category.services.map((service, serviceIndex) => (
                    <tr key={serviceIndex} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{service.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-900">{service.occupancyRate} %</span>
                          <div className="flex-1 max-w-[120px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all"
                              style={{ width: `${Math.min(service.occupancyRate * 5, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{service.hoursWorked}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{service.totalRevenue.toFixed(2)} MAD</span>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500 leading-relaxed">
            * <span className="font-medium">Occupancy rate</span>: Percentage of booked time over total available time
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatistiquesPage;
