'use client';

import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Users, Download, Filter, Search, X, BarChart2 } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ServiceCategory, generateSampleServiceCategories } from '@/lib/mockData';

export default function FrequencesGlobalesPage() {
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'total' | 'male' | 'female' | 'revenue' | 'growth'>('total');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year' | 'all'>('all');

  useEffect(() => {
    const sampleServices = generateSampleServiceCategories();
    setServices(sampleServices);
    setFilteredServices(sampleServices);
  }, []);
  useEffect(() => {
    let filtered = [...services];
    
    // Search
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'total':
        filtered.sort((a, b) => b.totalVisits - a.totalVisits);
        break;
      case 'male':
        filtered.sort((a, b) => b.maleVisits - a.maleVisits);
        break;
      case 'female':
        filtered.sort((a, b) => b.femaleVisits - a.femaleVisits);
        break;
      case 'revenue':
        filtered.sort((a, b) => b.revenue - a.revenue);
        break;
      case 'growth':
        filtered.sort((a, b) => b.growth - a.growth);
        break;
    }
    setFilteredServices(filtered);
  }, [searchTerm, sortBy, selectedPeriod, services]);

  const totalVisits = filteredServices.reduce((sum, s) => sum + s.totalVisits, 0);
  const totalMaleVisits = filteredServices.reduce((sum, s) => sum + s.maleVisits, 0);
  const totalFemaleVisits = filteredServices.reduce((sum, s) => sum + s.femaleVisits, 0);
  const totalRevenue = filteredServices.reduce((sum, s) => sum + s.revenue, 0);

  const exportToCSV = () => {
    const headers = ['Catégorie', 'Total Visites', 'Visites Hommes', 'Visites Femmes', '% Hommes', '% Femmes', 'Durée Moy.', 'Revenu', 'Croissance'];
    const rows = filteredServices.map(s => [
      s.name,
      s.totalVisits,
      s.maleVisits,
      s.femaleVisits,
      `${s.malePercentage}%`,
      `${s.femalePercentage}%`,
      `${s.avgDuration} min`,
      `${s.revenue} MAD`,
      `${s.growth}%`,
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'categories-services.csv';
    a.click();
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
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>

      {/* Header */}
      <div className="mb-8 pt-20 animate-slideUp">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-5xl font-light text-gray-900 tracking-tight">Catégories de Services</h1>
            </div>
            <p className="text-sm text-gray-400">Analyse détaillée par catégorie de service et répartition par genre</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Filter size={16} />
              Filtres
            </button>
            <button
              onClick={exportToCSV}
              className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Download size={16} />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 bg-white rounded-lg border border-gray-100 p-6 animate-slideUp">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Filtres et tri</h3>
            <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-900">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">Trier par</label>
              <Select value={sortBy} onValueChange={v => setSortBy(v as any)}>
                <SelectTrigger className="w-full rounded-full px-4 py-2 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 mt-2">
                  <SelectValue placeholder="Sélectionner le tri" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nom de catégorie</SelectItem>
                  <SelectItem value="total">Total visites</SelectItem>
                  <SelectItem value="male">Visites hommes</SelectItem>
                  <SelectItem value="female">Visites femmes</SelectItem>
                  <SelectItem value="revenue">Revenu</SelectItem>
                  <SelectItem value="growth">Croissance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Période</label>
              <Select value={selectedPeriod} onValueChange={v => setSelectedPeriod(v as any)}>
                <SelectTrigger className="w-full rounded-full px-4 py-2 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 mt-2">
                  <SelectValue placeholder="Sélectionner la période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                  <SelectItem value="all">Tout</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8 animate-fadeIn">
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Visites totales</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
              <Calendar className="text-gray-400" size={16} />
            </div>
          </div>
          <p className="text-3xl font-light text-gray-900">{totalVisits.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">Toutes catégories</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Visites Hommes</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
              <Users className="text-gray-500" size={16} />
            </div>
          </div>
          <p className="text-3xl font-light text-gray-900">{totalMaleVisits.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">{((totalMaleVisits / totalVisits) * 100).toFixed(1)}% du total</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Visites Femmes</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
              <Users className="text-gray-500" size={16} />
            </div>
          </div>
          <p className="text-3xl font-light text-gray-900">{totalFemaleVisits.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">{((totalFemaleVisits / totalVisits) * 100).toFixed(1)}% du total</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Revenu Total</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
              <TrendingUp className="text-gray-400" size={16} />
            </div>
          </div>
          <p className="text-3xl font-light text-gray-900">{(totalRevenue / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-400 mt-1">MAD</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 animate-fadeIn">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher une catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden animate-fadeIn">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Visites
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hommes
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Femmes
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Répartition
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée Moy.
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenu
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Croissance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{service.name}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-light text-gray-900">{service.totalVisits}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-base font-light text-gray-900">{service.maleVisits}</span>
                      <span className="text-xs text-blue-500">{service.malePercentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-base font-light text-gray-900">{service.femaleVisits}</span>
                      <span className="text-xs text-pink-500">{service.femalePercentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-blue-500 h-full"
                          style={{ width: `${service.malePercentage}%` }}
                        />
                        <div 
                          className="bg-pink-500 h-full"
                          style={{ width: `${service.femalePercentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-600">{service.avgDuration} min</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-gray-900">{service.revenue.toLocaleString()} MAD</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      service.growth >= 0 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {service.growth >= 0 ? '+' : ''}{service.growth}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredServices.length === 0 && (
          <div className="py-12 text-center">
            <BarChart2 className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500">Aucune catégorie trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}
