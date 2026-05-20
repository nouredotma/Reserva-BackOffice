'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Calendar, TrendingUp, Star, Download, Filter, Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { NewClient, generateSampleNewClients } from '@/lib/mockData';

export default function NouveauxClientsPage() {
  const [clients, setClients] = useState<NewClient[]>([]);
  const [filteredClients, setFilteredClients] = useState<NewClient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'spent' | 'visits' | 'rating'>('date');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year' | 'all'>('month');

  useEffect(() => {
    const sampleClients = generateSampleNewClients(50);
    setClients(sampleClients);
    setFilteredClients(sampleClients);
  }, []);

  useEffect(() => {
    let filtered = [...clients];
    // Filter by period
    if (selectedPeriod !== 'all') {
      const now = new Date();
      filtered = filtered.filter(client => {
        const diff = (now.getTime() - client.joinedDate.getTime()) / (1000 * 60 * 60 * 24);
        if (selectedPeriod === 'month') return diff <= 30;
        if (selectedPeriod === 'quarter') return diff <= 90;
        if (selectedPeriod === 'year') return diff <= 365;
        return true;
      });
    }
    // Search
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Sort
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => b.joinedDate.getTime() - a.joinedDate.getTime());
        break;
      case 'spent':
        filtered.sort((a, b) => b.totalSpent - a.totalSpent);
        break;
      case 'visits':
        filtered.sort((a, b) => b.visits - a.visits);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }
    setFilteredClients(filtered);
  }, [searchTerm, sortBy, selectedPeriod, clients]);

  const totalNew = filteredClients.length;
  const totalSpent = filteredClients.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalVisits = filteredClients.reduce((sum, c) => sum + c.visits, 0);
  const averageRating = (filteredClients.reduce((sum, c) => sum + c.rating, 0) / (filteredClients.length || 1)).toFixed(1);

  const exportToCSV = () => {
    const headers = ['Nom', 'Email', 'Téléphone', 'Date d\'inscription', 'Visites', 'Total dépensé', 'Note', 'Croissance'];
    const rows = filteredClients.map(c => [
      c.name,
      c.email,
      c.phone,
      c.joinedDate.toLocaleDateString(),
      c.visits,
      `${c.totalSpent} MAD`,
      c.rating,
      `${c.growth}%`,
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nouveaux-clients.csv';
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
              <h1 className="text-5xl font-light text-gray-900 tracking-tight">Nouveaux Clients</h1>
            </div>
            <p className="text-sm text-gray-400">Suivi et analyse des nouveaux clients inscrits</p>
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
                  <SelectItem value="date">Date d'inscription</SelectItem>
                  <SelectItem value="spent">Total dépensé</SelectItem>
                  <SelectItem value="visits">Nombre de visites</SelectItem>
                  <SelectItem value="rating">Note</SelectItem>
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
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Nouveaux inscrits</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
              <UserPlus className="text-gray-400" size={16} />
            </div>
          </div>
          <p className="text-3xl font-light text-gray-900">{totalNew}</p>
          <p className="text-xs text-gray-400 mt-1">Sur la période</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total dépensé</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
              <TrendingUp className="text-gray-400" size={16} />
            </div>
          </div>
          <p className="text-3xl font-light text-gray-900">{totalSpent} MAD</p>
          <p className="text-xs text-gray-400 mt-1">Nouveaux clients</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Visites</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
              <Calendar className="text-gray-400" size={16} />
            </div>
          </div>
          <p className="text-3xl font-light text-gray-900">{totalVisits}</p>
          <p className="text-xs text-gray-400 mt-1">Rendez-vous cumulés</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Note moyenne</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
              <Star className="text-gray-400" size={16} />
            </div>
          </div>
          <p className="text-3xl font-light text-gray-900">{averageRating}</p>
          <p className="text-xs text-gray-400 mt-1">Sur 5 étoiles</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 animate-fadeIn">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher un nouveau client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* New Clients List */}
      <div className="space-y-2 animate-fadeIn">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className={`rounded-lg border p-5 hover:shadow-lg transition-all bg-white border-gray-100`}
          >
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="flex items-center justify-center w-12">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-medium bg-primary text-primary-foreground">
                  {client.name.charAt(0).toUpperCase()}
                </div>
              </div>
              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900" style={{fontFamily: 'Montserrat, Arial, sans-serif'}}>{client.name}</h3>
                    <p className="text-xs text-gray-500">{client.email}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  Inscrit le {client.joinedDate instanceof Date && !isNaN(client.joinedDate.getTime()) ? client.joinedDate.toLocaleDateString() : '-'}
                </p>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-4 gap-8 flex-1">
                <div>
                  <p className="text-xs mb-1 text-gray-400">Total dépensé</p>
                  <p className="text-lg font-light text-gray-900">{client.totalSpent} MAD</p>
                </div>
                <div>
                  <p className="text-xs mb-1 text-gray-400">Première visite</p>
                  <p className="text-lg font-light text-gray-900">{client.firstVisit instanceof Date && !isNaN(client.firstVisit.getTime()) ? client.firstVisit.toLocaleDateString() : '-'}</p>
                </div>
                <div>
                  <p className="text-xs mb-1 text-gray-400">Note</p>
                  <div className="flex items-center gap-1">
                    <Star className="text-foreground" size={14} fill="currentColor" />
                    <p className="text-lg font-light text-gray-900">{client.rating}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs mb-1 text-gray-400">Croissance</p>
                  <div className="flex items-center gap-1">
                    {client.growth >= 0 ? (
                      <ChevronUp className="text-emerald-600" size={14} />
                    ) : (
                      <ChevronDown className="text-red-600" size={14} />
                    )}
                    <p className={`text-lg font-light ${client.growth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{Math.abs(client.growth)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
