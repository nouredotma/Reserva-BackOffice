'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Download, Printer, ChevronLeft, ChevronRight, Users, TrendingUp, Activity, BarChart3, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type OccupancyData = {
  [key: string]: { [key: string]: number };
};

const StatistiquesPage = () => {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // week, day, month
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [timeRange, setTimeRange] = useState('all'); // all, morning, afternoon, evening
  const [draggedCell, setDraggedCell] = useState<{day: string, time: string} | null>(null);

  const daysOfWeek = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
  const timeSlots = [
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
    '18:00 - 19:00',
    '19:00 - 20:00'
  ];

  // Sample occupancy data
  const [occupancyData, setOccupancyData] = useState<OccupancyData>({
    'LUN': {
      '10:00 - 11:00': 0,
      '11:00 - 12:00': 0,
      '12:00 - 13:00': 0,
      '13:00 - 14:00': 0,
      '14:00 - 15:00': 0,
      '15:00 - 16:00': 0,
      '16:00 - 17:00': 0,
      '17:00 - 18:00': 0,
      '18:00 - 19:00': 0,
      '19:00 - 20:00': 0
    },
    'MAR': {
      '10:00 - 11:00': 20,
      '11:00 - 12:00': 20,
      '12:00 - 13:00': 40,
      '13:00 - 14:00': 38,
      '14:00 - 15:00': 40,
      '15:00 - 16:00': 40,
      '16:00 - 17:00': 27,
      '17:00 - 18:00': 30,
      '18:00 - 19:00': 40,
      '19:00 - 20:00': 40
    },
    'MER': {
      '10:00 - 11:00': 63,
      '11:00 - 12:00': 75,
      '12:00 - 13:00': 63,
      '13:00 - 14:00': 50,
      '14:00 - 15:00': 50,
      '15:00 - 16:00': 63,
      '16:00 - 17:00': 50,
      '17:00 - 18:00': 25,
      '18:00 - 19:00': 25,
      '19:00 - 20:00': 25
    },
    'JEU': {
      '10:00 - 11:00': 50,
      '11:00 - 12:00': 50,
      '12:00 - 13:00': 38,
      '13:00 - 14:00': 50,
      '14:00 - 15:00': 46,
      '15:00 - 16:00': 50,
      '16:00 - 17:00': 50,
      '17:00 - 18:00': 38,
      '18:00 - 19:00': 25,
      '19:00 - 20:00': 25
    },
    'VEN': {
      '10:00 - 11:00': 0,
      '11:00 - 12:00': 13,
      '12:00 - 13:00': 25,
      '13:00 - 14:00': 25,
      '14:00 - 15:00': 25,
      '15:00 - 16:00': 25,
      '16:00 - 17:00': 63,
      '17:00 - 18:00': 69,
      '18:00 - 19:00': 88,
      '19:00 - 20:00': 58
    },
    'SAM': {
      '10:00 - 11:00': 25,
      '11:00 - 12:00': 75,
      '12:00 - 13:00': 75,
      '13:00 - 14:00': 48,
      '14:00 - 15:00': 63,
      '15:00 - 16:00': 75,
      '16:00 - 17:00': 56,
      '17:00 - 18:00': 75,
      '18:00 - 19:00': 75,
      '19:00 - 20:00': 33
    },
    'DIM': {
      '10:00 - 11:00': 70,
      '11:00 - 12:00': 70,
      '12:00 - 13:00': 50,
      '13:00 - 14:00': 60,
      '14:00 - 15:00': 45,
      '15:00 - 16:00': 60,
      '16:00 - 17:00': 100,
      '17:00 - 18:00': 90,
      '18:00 - 19:00': 45,
      '19:00 - 20:00': 35
    }
  });

  useEffect(() => {
    setMounted(true);
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

  const calculateStats = () => {
    let total = 0;
    let count = 0;
    let max = 0;
    let maxDay = '';
    let maxTime = '';

    Object.entries(occupancyData).forEach(([day, times]) => {
      Object.entries(times).forEach(([time, value]) => {
        total += value;
        count++;
        if (value > max) {
          max = value;
          maxDay = day;
          maxTime = time;
        }
      });
    });

    return {
      average: Math.round(total / count),
      peak: max,
      peakDay: maxDay,
      peakTime: maxTime
    };
  };

  const stats = calculateStats();

  const handleDragStart = (day: string, time: string) => {
    setDraggedCell({ day, time });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetDay: string, targetTime: string) => {
    if (draggedCell) {
      const sourceValue = occupancyData[draggedCell.day][draggedCell.time];
      const targetValue = occupancyData[targetDay][targetTime];

      setOccupancyData(prev => ({
        ...prev,
        [draggedCell.day]: {
          ...prev[draggedCell.day],
          [draggedCell.time]: targetValue
        },
        [targetDay]: {
          ...prev[targetDay],
          [targetTime]: sourceValue
        }
      }));

      setDraggedCell(null);
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Horaire', ...daysOfWeek].join(','),
      ...timeSlots.map(time => 
        [time, ...daysOfWeek.map(day => occupancyData[day][time] + '%')].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taux-occupation-${currentDate.toISOString().split('T')[0]}.csv`;
    a.click();
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
                Vue d’ensemble
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
              Imprimer
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
              {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
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
              Aujourd'hui
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 no-print">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="w-[200px] rounded-full border-gray-200 text-sm">
                  <SelectValue placeholder="Tous les collaborateurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les collaborateurs</SelectItem>
                  <SelectItem value="yassine">Yassine El Fassi</SelectItem>
                  <SelectItem value="samira">Samira Bouzid</SelectItem>
                  <SelectItem value="khalid">Khalid Ait Lahcen</SelectItem>
                  <SelectItem value="nadia">Nadia El Khatib</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px] rounded-full border-gray-200 text-sm">
                <SelectValue placeholder="Toutes les heures" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les heures</SelectItem>
                <SelectItem value="morning">Matin (10h-14h)</SelectItem>
                <SelectItem value="afternoon">Après-midi (14h-18h)</SelectItem>
                <SelectItem value="evening">Soir (18h-20h)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8 animate-fadeIn">
        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all group">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-colors">
              <TrendingUp size={20} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">Moyenne</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Taux d'occupation moyen</p>
            <p className="text-3xl font-light text-gray-900">{stats.average}%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all group">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-colors">
              <Activity size={20} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">Pic</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Taux maximum atteint</p>
            <p className="text-3xl font-light text-gray-900">{stats.peak}%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all group">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-colors">
              <Calendar size={20} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">Jour Pic</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Jour le plus chargé</p>
            <p className="text-3xl font-light text-gray-900">{stats.peakDay}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all group">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-colors">
              <BarChart3 size={20} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span className="text-[10px] font-medium">Heure Pic</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Créneau le plus demandé</p>
            <p className="text-3xl font-light text-gray-900">{stats.peakTime}</p>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden animate-slideUp">
        {/* Title Bar */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-900">
            Moyenne des taux d'occupation* par jour de la semaine et par tranche horaire
          </h3>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[1000px] p-6">
            {/* Header Row */}
            <div className="grid grid-cols-8 gap-2 mb-2">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider"></div>
              {daysOfWeek.map(day => (
                <div key={day} className="text-center">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {day}
                  </span>
                </div>
              ))}
            </div>

            {/* Data Rows */}
            <div className="space-y-2">
              {timeSlots.map(time => (
                <div key={time} className="grid grid-cols-8 gap-2">
                  <div className="flex items-center">
                    <span className="text-xs font-light text-gray-500">{time}</span>
                  </div>
                  {daysOfWeek.map(day => {
                    const value = occupancyData[day][time];
                    return (
                      <div
                        key={`${day}-${time}`}
                        draggable
                        onDragStart={() => handleDragStart(day, time)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(day, time)}
                        className={`
                          ${getColorClass(value)}
                          rounded-lg p-4 text-center font-medium text-sm
                          cursor-move hover:scale-105 hover:shadow-md
                          transition-all duration-200
                          flex items-center justify-center
                          min-h-[56px]
                        `}
                      >
                        {value}%
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500 leading-relaxed">
            * <span className="font-medium">Taux d'occupation</span>: Ratio: total des heures travaillées ainsi que les pauses (plages horaires non associées à une prestation) divisé par le total des heures ouvrables (dépendant des horaires d'ouverture et du nombre d'agendas)
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500 no-print animate-fadeIn">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100"></div>
          <span>0%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-100"></div>
          <span>1-25%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-200"></div>
          <span>26-50%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-400"></div>
          <span>51-75%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-600"></div>
          <span>76-100%</span>
        </div>
      </div>
    </div>
  );
};

export default StatistiquesPage;