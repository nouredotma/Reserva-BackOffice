'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, X, User as UserIcon, Merge, Filter, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { sampleDuplicates } from '@/lib/mockData';

interface DuplicateClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  status: 'Active' | 'Inactive';
  notes?: string;
  duplicates: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    status: 'Active' | 'Inactive';
    notes?: string;
  }>;
}

export default function DoublonsPage() {
  const [duplicates, setDuplicates] = useState<DuplicateClient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [selectedDuplicate, setSelectedDuplicate] = useState<DuplicateClient | null>(null);
  useEffect(() => {
    setDuplicates(sampleDuplicates);
  }, []);
  const filteredDuplicates = duplicates.filter(dup => {
    const matchesSearch =
      dup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dup.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dup.phone.includes(searchTerm) ||
      dup.duplicates.some(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.phone.includes(searchTerm)
      );
    const matchesStatus = statusFilter === 'all' || dup.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleMerge = (dup: DuplicateClient) => {
    setSelectedDuplicate(dup);
    setShowMergeModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce doublon ?')) {
      setDuplicates(duplicates.filter(d => d.id !== id));
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
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>

      {/* Header */}
      <div className="mb-8 pt-20 animate-slideUp">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-4">
            <h1 className="text-5xl font-light text-gray-900 tracking-tight">Doublons détectés</h1>
            <span className="text-sm text-gray-400 mt-4">
              {filteredDuplicates.length} {filteredDuplicates.length === 1 ? 'doublon' : 'doublons'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === 'grid' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Grille
              </button>
              <span className="text-gray-300">/</span>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === 'list' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Liste
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher un doublon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                statusFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setStatusFilter('Active')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                statusFilter === 'Active' ? 'bg-primary text-primary-foreground' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Actifs
            </button>
            <button
              onClick={() => setStatusFilter('Inactive')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                statusFilter === 'Inactive' ? 'bg-primary text-primary-foreground' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Inactifs
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
          {filteredDuplicates.map((dup) => (
            <div
              key={dup.id}
              className="bg-white rounded-lg border border-gray-100 p-6  hover:border-gray-200 transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {dup.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{dup.name}</h3>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium mt-1 ${
                      dup.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {dup.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleMerge(dup)}
                    className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                    title="Fusionner"
                  >
                    <Merge size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(dup.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2.5 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} className="text-gray-400" />
                  <span className="truncate">{dup.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} className="text-gray-400" />
                  <span>{dup.phone}</span>
                </div>
                {dup.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="truncate">{dup.address}</span>
                  </div>
                )}
              </div>

              {/* Duplicates List */}
              <div className="pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-400 mb-2">Doublons détectés :</div>
                <ul className="space-y-2">
                  {dup.duplicates.map(d => (
                    <li key={d.id} className="flex items-center gap-2 text-sm text-gray-600">
                      <UserIcon size={14} className="text-gray-400" />
                      <span className="font-medium">{d.name}</span>
                      <span className="text-gray-400">({d.email}, {d.phone})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg border border-gray-100  overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Invité</th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Contact</th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">Adresse</th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Doublons</th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Statut</th>
                  <th className="px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDuplicates.map((dup) => (
                  <tr key={dup.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3 min-w-[160px]">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-medium text-sm">
                            {dup.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="font-medium text-gray-900 truncate">{dup.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1 min-w-[180px]">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={12} className="text-gray-400 flex-shrink-0" />
                          <span className="truncate">{dup.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={12} className="text-gray-400 flex-shrink-0" />
                          <span className="whitespace-nowrap">{dup.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 hidden xl:table-cell">
                      {dup.address ? (
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                          <span className="truncate">{dup.address}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      <ul className="space-y-1">
                        {dup.duplicates.map(d => (
                          <li key={d.id} className="flex items-center gap-2">
                            <UserIcon size={12} className="text-gray-400" />
                            <span className="font-medium">{d.name}</span>
                            <span className="text-gray-400">({d.email}, {d.phone})</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        dup.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {dup.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleMerge(dup)}
                          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                          title="Fusionner"
                        >
                          <Merge size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(dup.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredDuplicates.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-100 p-12 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <UserIcon size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun doublon détecté</h3>
          <p className="text-gray-500 text-sm mb-6">
            {searchTerm ? 'Essayez de modifier votre recherche' : 'Tous vos invités sont uniques !'}
          </p>
        </div>
      )}

      {/* Merge Modal */}
      {showMergeModal && selectedDuplicate && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-lg  max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-gray-900">
                  Fusionner les doublons
                </h2>
                <button 
                  onClick={() => setShowMergeModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            {/* Merge Details */}
            <div className="px-8 py-6">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Invités à fusionner</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="font-medium text-gray-900 mb-1">{selectedDuplicate.name}</div>
                    <div className="text-sm text-gray-600 mb-1">{selectedDuplicate.email}</div>
                    <div className="text-sm text-gray-600 mb-1">{selectedDuplicate.phone}</div>
                    {selectedDuplicate.address && <div className="text-sm text-gray-600 mb-1">{selectedDuplicate.address}</div>}
                    <div className="text-xs text-gray-400">Statut: {selectedDuplicate.status}</div>
                  </div>
                  {selectedDuplicate.duplicates.map(d => (
                    <div key={d.id} className="flex-1 bg-gray-50 rounded-lg p-4">
                      <div className="font-medium text-gray-900 mb-1">{d.name}</div>
                      <div className="text-sm text-gray-600 mb-1">{d.email}</div>
                      <div className="text-sm text-gray-600 mb-1">{d.phone}</div>
                      {d.address && <div className="text-sm text-gray-600 mb-1">{d.address}</div>}
                      <div className="text-xs text-gray-400">Statut: {d.status}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-sm text-gray-700">
                  <strong>Fusionner ces invités ?</strong> Les informations seront regroupées et les doublons supprimés.
                </div>
              </div>
              {/* Actions */}
              <div className="sticky bottom-0 bg-white border-t border-gray-100 -mx-8 px-8 py-4 mt-6 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowMergeModal(false)}
                  className="flex-1 px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setDuplicates(duplicates.filter(d => d.id !== selectedDuplicate.id));
                    setShowMergeModal(false);
                  }}
                  className="flex-1 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                >
                  Fusionner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
