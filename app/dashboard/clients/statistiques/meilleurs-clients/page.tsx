'use client';

import { useState, useEffect } from 'react';
import { Crown, TrendingUp, Calendar, DollarSign, Star, Award, Medal, Trophy, ChevronDown, ChevronUp, Filter, Download, Search, X } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  status?: string;
  address?: string;
  totalSpent?: number;
  totalVisits?: number;
  averageRating?: number;
  lastVisit?: Date;
  lifetimeValue?: number;
  favoriteService?: string;
}

interface ClientRanking extends Client {
  rank: number;
  growth: number;
  loyaltyScore: number;
}

export default function MeilleursClientsPage() {
  const [clients, setClients] = useState<ClientRanking[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientRanking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'spent' | 'visits' | 'rating' | 'loyalty'>('spent');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year' | 'all'>('all');

  useEffect(() => {
    // Load clients from localStorage
    const storedClients = localStorage.getItem('clients');
    if (storedClients) {
      const parsedClients = JSON.parse(storedClients);
      
      // Enrich with ranking data
      const enrichedClients: ClientRanking[] = parsedClients.map((client: Client, index: number) => ({
        ...client,
        rank: index + 1,
        totalSpent: client.totalSpent || Math.floor(Math.random() * 19500) + 500, // MAD realistic
        totalVisits: client.totalVisits || Math.floor(Math.random() * 50) + 5,
        averageRating: client.averageRating || (Math.random() * 2 + 3).toFixed(1),
        lastVisit: client.lastVisit || new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        growth: Math.floor(Math.random() * 60) - 20,
        loyaltyScore: Math.floor(Math.random() * 40) + 60,
        favoriteService: client.favoriteService || ['Coiffeur', 'Spa', 'Massage', 'Manucure'][Math.floor(Math.random() * 4)],
      }));

      // Sort by total spent by default
      enrichedClients.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
      
      // Assign ranks
      enrichedClients.forEach((client, index) => {
        client.rank = index + 1;
      });

      setClients(enrichedClients);
      setFilteredClients(enrichedClients.slice(0, 100));
    } else {
      // Generate sample data if no clients exist
      const sampleClients: ClientRanking[] = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Client ${i + 1}`,
        email: `client${i + 1}@email.com`,
        phone: `+33 6 ${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        status: 'Active',
        rank: i + 1,
        totalSpent: Math.floor(Math.random() * 5500) + 500, // MAD realistic, max 6000
        totalVisits: Math.floor(Math.random() * 50) + 5,
        averageRating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
        lastVisit: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        growth: Math.floor(Math.random() * 60) - 20,
        loyaltyScore: Math.floor(Math.random() * 40) + 60,
        favoriteService: ['Coiffeur', 'Spa', 'Massage', 'Manucure'][Math.floor(Math.random() * 4)],
      }));

      sampleClients.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
      setClients(sampleClients);
      setFilteredClients(sampleClients);
    }
  }, []);

  // Search and filter
  useEffect(() => {
    let filtered = [...clients];

    // Search
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'spent':
        filtered.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
        break;
      case 'visits':
        filtered.sort((a, b) => (b.totalVisits || 0) - (a.totalVisits || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'loyalty':
        filtered.sort((a, b) => (b.loyaltyScore || 0) - (a.loyaltyScore || 0));
        break;
    }

    // Update ranks
    filtered.forEach((client, index) => {
      client.rank = index + 1;
    });

    setFilteredClients(filtered.slice(0, 100));
  }, [searchTerm, sortBy, clients]);

  const topClient = filteredClients[0];
  const totalRevenue = filteredClients.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const totalVisits = filteredClients.reduce((sum, c) => sum + (c.totalVisits || 0), 0);
  const averageSpending = totalRevenue / filteredClients.length || 0;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return (
      <span className="inline-block" style={{width: 24, height: 24}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6.436 8a8.6 8.6 0 0 0 -.436 2.727c0 4.017 2.686 7.273 6 7.273s6 -3.256 6 -7.273a8.6 8.6 0 0 0 -.436 -2.727" /><path d="M14.5 21s-.682 -3 -2.5 -3s-2.5 3 -2.5 3" /><path d="M18.52 5.23c.292 1.666 -1.02 2.77 -1.02 2.77s-1.603 -.563 -1.895 -2.23c-.292 -1.666 1.02 -2.77 1.02 -2.77s1.603 .563 1.895 2.23" /><path d="M21.094 12.14c-1.281 1.266 -3.016 .76 -3.016 .76s-.454 -1.772 .828 -3.04c1.281 -1.266 3.016 -.76 3.016 -.76s.454 1.772 -.828 3.04" /><path d="M17.734 18.826c-1.5 -.575 -1.734 -2.19 -1.734 -2.19s1.267 -1.038 2.767 -.462c1.5 .575 1.733 2.19 1.733 2.19s-1.267 1.038 -2.767 .462" /><path d="M6.267 18.826c1.5 -.575 1.733 -2.19 1.733 -2.19s-1.267 -1.038 -2.767 -.462c-1.5 .575 -1.733 2.19 -1.733 2.19s1.267 1.038 2.767 .462" /><path d="M2.906 12.14c1.281 1.266 3.016 .76 3.016 .76s.454 -1.772 -.828 -3.04c-1.281 -1.265 -3.016 -.76 -3.016 -.76s-.454 1.772 .828 3.04" /><path d="M5.48 5.23c-.292 1.666 1.02 2.77 1.02 2.77s1.603 -.563 1.895 -2.23c.292 -1.666 -1.02 -2.77 -1.02 -2.77s-1.603 .563 -1.895 2.23" /><path d="M10.6 8h2a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-1a1 1 0 0 0 -1 1v1a1 1 0 0 0 1 1h2" /></svg>
      </span>
    );
    if (rank === 2) return (
      <span className="inline-block" style={{width: 24, height: 24}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6.436 8a8.6 8.6 0 0 0 -.436 2.727c0 4.017 2.686 7.273 6 7.273s6 -3.256 6 -7.273a8.6 8.6 0 0 0 -.436 -2.727" /><path d="M14.5 21s-.682 -3 -2.5 -3s-2.5 3 -2.5 3" /><path d="M18.52 5.23c.292 1.666 -1.02 2.77 -1.02 2.77s-1.603 -.563 -1.895 -2.23c-.292 -1.666 1.02 -2.77 1.02 -2.77s1.603 .563 1.895 2.23" /><path d="M21.094 12.14c-1.281 1.266 -3.016 .76 -3.016 .76s-.454 -1.772 .828 -3.04c1.281 -1.266 3.016 -.76 3.016 -.76s.454 1.772 -.828 3.04" /><path d="M17.734 18.826c-1.5 -.575 -1.734 -2.19 -1.734 -2.19s1.267 -1.038 2.767 -.462c1.5 .575 1.733 2.19 1.733 2.19s-1.267 1.038 -2.767 .462" /><path d="M6.267 18.826c1.5 -.575 1.733 -2.19 1.733 -2.19s-1.267 -1.038 -2.767 -.462c-1.5 .575 -1.733 2.19 -1.733 2.19s1.267 1.038 2.767 .462" /><path d="M2.906 12.14c1.281 1.266 3.016 .76 3.016 .76s.454 -1.772 -.828 -3.04c-1.281 -1.265 -3.016 -.76 -3.016 -.76s-.454 1.772 .828 3.04" /><path d="M5.48 5.23c-.292 1.666 1.02 2.77 1.02 2.77s1.603 -.563 1.895 -2.23c.292 -1.666 -1.02 -2.77 -1.02 -2.77s-1.603 .563 -1.895 2.23" /><path d="M10.6 8h2a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-1a1 1 0 0 0 -1 1v1a1 1 0 0 0 1 1h2" /></svg>
      </span>
    );
    if (rank === 3) return (
      <span className="inline-block" style={{width: 24, height: 24}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6.436 8a8.6 8.6 0 0 0 -.436 2.727c0 4.017 2.686 7.273 6 7.273s6 -3.256 6 -7.273a8.6 8.6 0 0 0 -.436 -2.727" /><path d="M14.5 21s-.682 -3 -2.5 -3s-2.5 3 -2.5 3" /><path d="M18.52 5.23c.292 1.666 -1.02 2.77 -1.02 2.77s-1.603 -.563 -1.895 -2.23c-.292 -1.666 1.02 -2.77 1.02 -2.77s1.603 .563 1.895 2.23" /><path d="M21.094 12.14c-1.281 1.266 -3.016 .76 -3.016 .76s-.454 -1.772 .828 -3.04c1.281 -1.266 3.016 -.76 3.016 -.76s.454 1.772 -.828 3.04" /><path d="M17.734 18.826c-1.5 -.575 -1.734 -2.19 -1.734 -2.19s1.267 -1.038 2.767 -.462c1.5 .575 1.733 2.19 1.733 2.19s-1.267 1.038 -2.767 .462" /><path d="M6.267 18.826c1.5 -.575 1.733 -2.19 1.733 -2.19s-1.267 -1.038 -2.767 -.462c-1.5 .575 -1.733 2.19 -1.733 2.19s1.267 1.038 2.767 .462" /><path d="M2.906 12.14c1.281 1.266 3.016 .76 3.016 .76s.454 -1.772 -.828 -3.04c-1.281 -1.265 -3.016 -.76 -3.016 -.76s-.454 1.772 .828 3.04" /><path d="M5.48 5.23c-.292 1.666 1.02 2.77 1.02 2.77s1.603 -.563 1.895 -2.23c.292 -1.666 -1.02 -2.77 -1.02 -2.77s-1.603 .563 -1.895 2.23" /><path d="M10.5 8h1.5a1.5 1.5 0 0 1 0 3h-1h1a1.5 1.5 0 0 1 0 3h-1.5" /></svg>
      </span>
    );
    return null;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-primary border-primary border-2';
    if (rank === 2) return 'bg-white border-gray-200 border-2';
    if (rank === 3) return 'bg-white border-gray-200 border-2';
    return 'bg-white border-gray-100';
  };

  const exportToCSV = () => {
    const headers = ['Rang', 'Nom', 'Email', 'Téléphone', 'Total dépensé', 'Visites', 'Note moyenne', 'Score fidélité'];
    const rows = filteredClients.map(c => [
      c.rank,
      c.name,
      c.email,
      c.phone,
      `${c.totalSpent} MAD`,
      c.totalVisits,
      c.averageRating,
      c.loyaltyScore,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meilleurs-clients.csv';
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
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .gradient-gold {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
        }
        .gradient-silver {
          background: linear-gradient(135deg, #C0C0C0 0%, #808080 100%);
        }
        .gradient-bronze {
          background: linear-gradient(135deg, #CD7F32 0%, #8B4513 100%);
        }
      `}</style>

      {/* Header */}
      <div className="mb-8 pt-20 animate-slideUp">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-5xl font-light text-gray-900 tracking-tight">Top 100 Clients</h1>
            </div>
            <p className="text-sm text-gray-400">Classement de vos meilleurs clients par performance</p>
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
                  <SelectItem value="spent">Total dépensé</SelectItem>
                  <SelectItem value="visits">Nombre de visites</SelectItem>
                  <SelectItem value="rating">Note moyenne</SelectItem>
                  <SelectItem value="loyalty">Score de fidélité</SelectItem>
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
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Revenu total</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
              <DollarSign className="text-gray-400" size={16} />
            </div>
          </div>
          <p className="text-3xl font-light text-gray-900">{totalRevenue.toLocaleString()} MAD</p>
          <p className="text-xs text-gray-400 mt-1">Top 100 clients</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Visites totales</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
              <Calendar className="text-gray-400" size={16} />
            </div>
          </div>
          <p className="text-3xl font-light text-gray-900">{totalVisits}</p>
          <p className="text-xs text-gray-400 mt-1">Rendez-vous cumulés</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Panier moyen</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
              <TrendingUp className="text-gray-400" size={16} />
            </div>
          </div>
          <p className="text-3xl font-light text-gray-900">{Math.round(averageSpending)} MAD</p>
          <p className="text-xs text-gray-400 mt-1">Par client</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Note moyenne</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
              <Star className="text-gray-400" size={16} />
            </div>
          </div>
          <p className="text-3xl font-light text-gray-900">4.8</p>
          <p className="text-xs text-gray-400 mt-1">Sur 5 étoiles</p>
        </div>
      </div>

      {/* Podium - Top 3 */}
      {filteredClients.length >= 3 && (
        <div className="mb-8 animate-fadeIn">
          <div className="grid grid-cols-3 gap-6">
            {/* 2nd Place */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-8 mt-8">
              <div className="flex flex-col items-center">
                <span className="mb-3 inline-block" style={{width: 32, height: 32}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6.436 8a8.6 8.6 0 0 0 -.436 2.727c0 4.017 2.686 7.273 6 7.273s6 -3.256 6 -7.273a8.6 8.6 0 0 0 -.436 -2.727" /><path d="M14.5 21s-.682 -3 -2.5 -3s-2.5 3 -2.5 3" /><path d="M18.52 5.23c.292 1.666 -1.02 2.77 -1.02 2.77s-1.603 -.563 -1.895 -2.23c-.292 -1.666 1.02 -2.77 1.02 -2.77s1.603 .563 1.895 2.23" /><path d="M21.094 12.14c-1.281 1.266 -3.016 .76 -3.016 .76s-.454 -1.772 .828 -3.04c1.28 -1.266 3.016 -.76 3.016 -.76s.454 1.772 -.828 3.04" /><path d="M17.734 18.826c-1.5 -.575 -1.734 -2.19 -1.734 -2.19s1.267 -1.038 2.767 -.462c1.5 .575 1.733 2.19 1.733 2.19s-1.267 1.038 -2.767 .462" /><path d="M6.267 18.826c1.5 -.575 1.733 -2.19 1.733 -2.19s-1.267 -1.038 -2.767 -.462c-1.5 .575 -1.733 2.19 -1.733 2.19s1.267 1.038 2.767 .462" /><path d="M2.906 12.14c1.281 1.266 3.016 .76 3.016 .76s.454 -1.772 -.828 -3.04c-1.281 -1.265 -3.016 -.76 -3.016 -.76s-.454 1.772 .828 3.04" /><path d="M5.48 5.23c-.292 1.666 1.02 2.77 1.02 2.77s1.603 -.563 1.895 -2.23c.292 -1.666 -1.02 -2.77 -1.02 -2.77s-1.603 .563 -1.895 2.23" /><path d="M10.6 8h2a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-1a1 1 0 0 0 -1 1v1a1 1 0 0 0 1 1h2" /></svg>
                </span>
                <h3 className="font-medium text-gray-900 text-center mb-1">{filteredClients[1].name}</h3>
                <p className="text-xs text-gray-500 mb-4">{filteredClients[1].email}</p>
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Dépensé</span>
                    <span className="font-medium text-gray-900">{filteredClients[1].totalSpent} MAD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Visites</span>
                    <span className="font-medium text-gray-900">{filteredClients[1].totalVisits}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="bg-primary rounded-lg border-2 border-primary p-8">
              <div className="flex flex-col items-center">
                <span className="mb-3 inline-block" style={{width: 40, height: 40}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6.436 8a8.6 8.6 0 0 0 -.436 2.727c0 4.017 2.686 7.273 6 7.273s6 -3.256 6 -7.273a8.6 8.6 0 0 0 -.436 -2.727" /><path d="M14.5 21s-.682 -3 -2.5 -3s-2.5 3 -2.5 3" /><path d="M18.52 5.23c.292 1.666 -1.02 2.77 -1.02 2.77s-1.603 -.563 -1.895 -2.23c-.292 -1.666 1.02 -2.77 1.02 -2.77s1.603 .563 1.895 2.23" /><path d="M21.094 12.14c-1.281 1.266 -3.016 .76 -3.016 .76s-.454 -1.772 .828 -3.04c1.281 -1.266 3.016 -.76 3.016 -.76s.454 1.772 -.828 3.04" /><path d="M17.734 18.826c-1.5 -.575 -1.734 -2.19 -1.734 -2.19s1.267 -1.038 2.767 -.462c1.5 .575 1.733 2.19 1.733 2.19s-1.267 1.038 -2.767 .462" /><path d="M6.267 18.826c1.5 -.575 1.733 -2.19 1.733 -2.19s-1.267 -1.038 -2.767 -.462c-1.5 .575 -1.733 2.19 -1.733 2.19s1.267 1.038 2.767 .462" /><path d="M2.906 12.14c1.281 1.266 3.016 .76 3.016 .76s.454 -1.772 -.828 -3.04c-1.281 -1.265 -3.016 -.76 -3.016 -.76s-.454 1.772 .828 3.04" /><path d="M5.48 5.23c-.292 1.666 1.02 2.77 1.02 2.77s1.603 -.563 1.895 -2.23c.292 -1.666 -1.02 -2.77 -1.02 -2.77s-1.603 .563 -1.895 2.23" /><path d="M11 9l1 -1v6" /></svg>
                </span>
                <h3 className="font-medium text-white text-center mb-1 text-lg">{filteredClients[0].name}</h3>
                <p className="text-xs text-blue-100 mb-4">{filteredClients[0].email}</p>
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-100">Dépensé</span>
                    <span className="font-medium text-white">{filteredClients[0].totalSpent} MAD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-100">Visites</span>
                    <span className="font-medium text-white">{filteredClients[0].totalVisits}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-100">Fidélité</span>
                    <span className="font-medium text-white">{filteredClients[0].loyaltyScore}/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-8 mt-8">
              <div className="flex flex-col items-center">
                <span className="mb-3 inline-block" style={{width: 32, height: 32}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6.436 8a8.6 8.6 0 0 0 -.436 2.727c0 4.017 2.686 7.273 6 7.273s6 -3.256 6 -7.273a8.6 8.6 0 0 0 -.436 -2.727" /><path d="M14.5 21s-.682 -3 -2.5 -3s-2.5 3 -2.5 3" /><path d="M18.52 5.23c.292 1.666 -1.02 2.77 -1.02 2.77s-1.603 -.563 -1.895 -2.23c-.292 -1.666 1.02 -2.77 1.02 -2.77s1.603 .563 1.895 2.23" /><path d="M21.094 12.14c-1.281 1.266 -3.016 .76 -3.016 .76s-.454 -1.772 .828 -3.04c-1.281 -1.266 -3.016 -.76 -3.016 -.76s-.454 1.772 .828 3.04" /><path d="M17.734 18.826c-1.5 -.575 -1.734 -2.19 -1.734 -2.19s1.267 -1.038 2.767 -.462c1.5 .575 1.733 2.19 1.733 2.19s-1.267 1.038 -2.767 .462" /><path d="M6.267 18.826c1.5 -.575 1.733 -2.19 1.733 -2.19s-1.267 -1.038 -2.767 -.462c-1.5 .575 -1.733 2.19 -1.733 2.19s1.267 1.038 2.767 .462" /><path d="M2.906 12.14c1.281 1.266 3.016 .76 3.016 .76s.454 -1.772 -.828 -3.04c-1.281 -1.265 -3.016 -.76 -3.016 -.76s-.454 1.772 .828 3.04" /><path d="M5.48 5.23c-.292 1.666 1.02 2.77 1.02 2.77s1.603 -.563 1.895 -2.23c.292 -1.666 -1.02 -2.77 -1.02 -2.77s-1.603 .563 -1.895 2.23" /><path d="M10.5 8h1.5a1.5 1.5 0 0 1 0 3h-1h1a1.5 1.5 0 0 1 0 3h-1.5" /></svg>
                </span>
                <h3 className="font-medium text-gray-900 text-center mb-1">{filteredClients[2].name}</h3>
                <p className="text-xs text-gray-500 mb-4">{filteredClients[2].email}</p>
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Dépensé</span>
                    <span className="font-medium text-gray-900">{filteredClients[2].totalSpent} MAD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Visites</span>
                    <span className="font-medium text-gray-900">{filteredClients[2].totalVisits}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-6 animate-fadeIn">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Rankings List */}
      <div className="space-y-2 animate-fadeIn">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className={`rounded-lg border p-5 hover:shadow-lg transition-all ${getRankStyle(client.rank)} ${client.rank === 1 ? 'bg-primary border-primary' : ''}`}
          >
            <div className="flex items-center gap-6">
              {/* Rank */}
              <div className="flex items-center justify-center w-12">
                {client.rank === 1 ? (
                  <span className="inline-block" style={{width: 24, height: 24}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6.436 8a8.6 8.6 0 0 0 -.436 2.727c0 4.017 2.686 7.273 6 7.273s6 -3.256 6 -7.273a8.6 8.6 0 0 0 -.436 -2.727" /><path d="M14.5 21s-.682 -3 -2.5 -3s-2.5 3 -2.5 3" /><path d="M18.52 5.23c.292 1.666 -1.02 2.77 -1.02 2.77s-1.603 -.563 -1.895 -2.23c-.292 -1.666 1.02 -2.77 1.02 -2.77s1.603 .563 1.895 2.23" /><path d="M21.094 12.14c-1.281 1.266 -3.016 .76 -3.016 .76s-.454 -1.772 .828 -3.04c1.281 -1.266 3.016 -.76 3.016 -.76s.454 1.772 -.828 3.04" /><path d="M17.734 18.826c-1.5 -.575 -1.734 -2.19 -1.734 -2.19s1.267 -1.038 2.767 -.462c1.5 .575 1.733 2.19 1.733 2.19s-1.267 1.038 -2.767 .462" /><path d="M6.267 18.826c1.5 -.575 1.733 -2.19 1.733 -2.19s-1.267 -1.038 -2.767 -.462c-1.5 .575 -1.733 2.19 -1.733 2.19s1.267 1.038 2.767 .462" /><path d="M2.906 12.14c1.281 1.266 3.016 .76 3.016 .76s.454 -1.772 -.828 -3.04c-1.281 -1.265 -3.016 -.76 -3.016 -.76s-.454 1.772 .828 3.04" /><path d="M5.48 5.23c-.292 1.666 1.02 2.77 1.02 2.77s1.603 -.563 1.895 -2.23c.292 -1.666 -1.02 -2.77 -1.02 -2.77s-1.603 .563 -1.895 2.23" /><path d="M10.6 8h2a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-1a1 1 0 0 0 -1 1v1a1 1 0 0 0 1 1h2" /></svg>
                  </span>
                ) : getRankIcon(client.rank) || (
                  <span className="text-2xl font-light text-gray-400">{client.rank}</span>
                )}
              </div>

              {/* Client Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${client.rank === 1 ? 'bg-white text-foreground' : 'bg-primary text-primary-foreground'}`}>
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className={`font-medium ${client.rank === 1 ? 'text-white' : 'text-gray-900'}`}>{client.name}</h3>
                    <p className={`text-xs ${client.rank === 1 ? 'text-blue-100' : 'text-gray-500'}`}>{client.email}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-5 gap-8 flex-1">
                <div>
                  <p className={`text-xs mb-1 ${client.rank === 1 ? 'text-blue-100' : 'text-gray-400'}`}>Total dépensé</p>
                  <p className={`text-lg font-light ${client.rank === 1 ? 'text-white' : 'text-gray-900'}`}>{client.totalSpent} MAD</p>
                </div>
                <div>
                  <p className={`text-xs mb-1 ${client.rank === 1 ? 'text-blue-100' : 'text-gray-400'}`}>Visites</p>
                  <p className={`text-lg font-light ${client.rank === 1 ? 'text-white' : 'text-gray-900'}`}>{client.totalVisits}</p>
                </div>
                <div>
                  <p className={`text-xs mb-1 ${client.rank === 1 ? 'text-blue-100' : 'text-gray-400'}`}>Note moyenne</p>
                  <div className="flex items-center gap-1">
                    <Star className={client.rank === 1 ? 'text-white' : 'text-foreground'} size={14} fill="currentColor" />
                    <p className={`text-lg font-light ${client.rank === 1 ? 'text-white' : 'text-gray-900'}`}>{client.averageRating}</p>
                  </div>
                </div>
                <div>
                  <p className={`text-xs mb-1 ${client.rank === 1 ? 'text-blue-100' : 'text-gray-400'}`}>Fidélité</p>
                  <p className={`text-lg font-light ${client.rank === 1 ? 'text-white' : 'text-gray-900'}`}>{client.loyaltyScore}/100</p>
                </div>
                <div>
                  <p className={`text-xs mb-1 ${client.rank === 1 ? 'text-blue-100' : 'text-gray-400'}`}>Croissance</p>
                  <div className="flex items-center gap-1">
                    {client.growth >= 0 ? (
                      <ChevronUp className={client.rank === 1 ? 'text-white' : 'text-emerald-600'} size={14} />
                    ) : (
                      <ChevronDown className={client.rank === 1 ? 'text-white' : 'text-red-600'} size={14} />
                    )}
                    <p className={`text-lg font-light ${client.rank === 1 ? 'text-white' : client.growth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {Math.abs(client.growth)}%
                    </p>
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