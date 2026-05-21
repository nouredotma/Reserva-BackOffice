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
      category: 'MAINS | ONGLES NATURELS',
      services: [
        { name: 'Manucure complète', occupancyRate: 5.21, hoursWorked: '67h 45', totalRevenue: 1700.00 },
        { name: 'Dépose + Gainage avec vernis semi-permanent (couleur)', occupancyRate: 17.12, hoursWorked: '44h 30', totalRevenue: 1080.00 },
        { name: 'Dépose + Gainage (nude)', occupancyRate: 3.85, hoursWorked: '10h', totalRevenue: 275.00 },
        { name: 'Gainage (nude)', occupancyRate: 2.02, hoursWorked: '5h 15', totalRevenue: 150.00 },
        { name: 'Gainage avec vernis semi-permanent', occupancyRate: 2.69, hoursWorked: '7h', totalRevenue: 165.00 },
        { name: 'Dépose + Manucure ukrainienne | Sans vernis', occupancyRate: 0.38, hoursWorked: '1h', totalRevenue: 30.00 },
      ]
    },
    {
      category: 'MAINS | RALLONGEMENTS',
      services: [
        { name: 'Pose complète rallongements', occupancyRate: 1.63, hoursWorked: '12h 45', totalRevenue: 305.00 },
        { name: 'Extensions d\'ongle | Gel + vernis semi-permanent', occupancyRate: 2.31, hoursWorked: '6h', totalRevenue: 140.00 },
        { name: 'Remplissage', occupancyRate: 1.54, hoursWorked: '4h', totalRevenue: 100.00 },
        { name: 'Extensions d\'ongle | Gel', occupancyRate: 1.06, hoursWorked: '2h 45', totalRevenue: 65.00 },
      ]
    },
    {
      category: 'BEAUTÉ DES PIEDS RUSSE',
      services: [
        { name: 'Pédicure russe complète', occupancyRate: 0.91, hoursWorked: '4h 45', totalRevenue: 150.00 },
        { name: 'Beauté des pieds russe - Vernis semi-permanent renforcé', occupancyRate: 1.35, hoursWorked: '3h 30', totalRevenue: 110.00 },
        { name: 'Beauté des pieds russe | Sans vernis', occupancyRate: 0.48, hoursWorked: '1h 15', totalRevenue: 40.00 },
      ]
    },
    {
      category: 'DÉPOSE',
      services: [
        { name: 'Dépose simple', occupancyRate: 0.06, hoursWorked: '10m', totalRevenue: 5.00 },
        { name: 'Dépose suivie d\'une prestation', occupancyRate: 0.06, hoursWorked: '10m', totalRevenue: 5.00 },
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
        ['Prestation', 'Taux d\'occupation', 'Heures travaillées', 'Total des RDV'].join(','),
        ...servicesData.flatMap(category => 
          category.services.map(service => 
            [service.name, `${service.occupancyRate}%`, service.hoursWorked, `${service.totalRevenue}€`].join(',')
          )
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prestations-${currentDate.toISOString().split('T')[0]}.csv`;
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

          {/* Filters only (removed view toggle and compare mode) */}
          <div className="flex items-center gap-6 no-print">
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="w-[200px] rounded-full border-gray-200 text-sm">
                <SelectValue placeholder="Tous les collaborateurs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les collaborateurs</SelectItem>
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
        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all group">
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

        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all group">
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
            <p className="text-xs text-gray-500 mb-1 font-medium">Total heures travaillées</p>
            <p className="text-3xl font-light text-gray-900">{stats.totalHours}h</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all group">
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
            <p className="text-xs text-gray-500 mb-1 font-medium">Total des rendez-vous</p>
            <p className="text-3xl font-light text-gray-900">{stats.totalRevenue.toFixed(2)}€</p>
          </div>
        </div>
      </div>

      {/* Only Services Table view remains */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden animate-slideUp">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prestation
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taux d'occupation*
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heures travaillées*
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total des RDV*
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
                        <span className="text-sm font-medium text-gray-900">{service.totalRevenue.toFixed(2)} €</span>
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
            * <span className="font-medium">Taux d'occupation</span>: Pourcentage du temps réservé sur le temps total disponible
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatistiquesPage;