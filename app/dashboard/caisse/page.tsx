'use client';

import { useState, useEffect, useRef } from 'react';
import { DollarSign, CreditCard, RefreshCcw, Download, Plus, Search, Filter, Calendar, Users, X, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Wallet, Receipt, Clock, BarChart3, PieChart, Eye, Printer, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { generateCaissePDF } from '@/components/CaissePrintDocument';
import { sampleTransactions } from '@/lib/mockData';

interface Transaction {
  id: string;
  type: 'Vente' | 'Remboursement' | 'Dépôt' | 'Retrait';
  amount: number;
  method: 'Espèces' | 'Carte' | 'Virement' | 'Chèque';
  client?: string;
  employee?: string;
  date: Date;
  note?: string;
  category?: string;
}

interface CaissePageProps {
  methodFilter: 'all' | 'Espèces' | 'Carte' | 'Virement' | 'Chèque';
  typeFilter: 'all' | 'Vente' | 'Remboursement' | 'Dépôt' | 'Retrait';
  selectedPeriod: 'day' | 'week' | 'month' | 'all';
  setMethodFilter: (filter: 'all' | 'Espèces' | 'Carte' | 'Virement' | 'Chèque') => void;
  setTypeFilter: (filter: 'all' | 'Vente' | 'Remboursement' | 'Dépôt' | 'Retrait') => void;
  setSelectedPeriod: (period: 'day' | 'week' | 'month' | 'all') => void;
}

export default function CaissePage({
  methodFilter,
  typeFilter,
  selectedPeriod,
  setMethodFilter,
  setTypeFilter,
  setSelectedPeriod,
}: CaissePageProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Vente' as Transaction['type'],
    amount: 0,
    method: 'Espèces' as Transaction['method'],
    client: '',
    employee: '',
    note: ''
  });
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTransactions(sampleTransactions);
  }, []);

  // Filtering
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch =
      tx.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.employee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.method.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === 'all' || tx.method === methodFilter;
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    return matchesSearch && matchesMethod && matchesType;
  });

  // Stats
  const totalSales = transactions.filter(t => t.type === 'Vente').reduce((sum, t) => sum + t.amount, 0);
  const totalCash = transactions.filter(t => t.method === 'Espèces').reduce((sum, t) => sum + t.amount, 0);
  const totalCard = transactions.filter(t => t.method === 'Carte').reduce((sum, t) => sum + t.amount, 0);
  const totalRefunds = transactions.filter(t => t.type === 'Remboursement').reduce((sum, t) => sum + t.amount, 0);
  const totalDeposits = transactions.filter(t => t.type === 'Dépôt').reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions.filter(t => t.type === 'Retrait').reduce((sum, t) => sum + t.amount, 0);

  // Export CSV
  const exportToCSV = () => {
    const headers = ['Type', 'Montant', 'Méthode', 'Client', 'Employé', 'Date', 'Note'];
    const rows = filteredTransactions.map(tx => [
      tx.type,
      tx.amount,
      tx.method,
      tx.client || '',
      tx.employee || '',
      tx.date.toLocaleString('fr-FR'),
      tx.note || ''
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions-caisse.csv';
    a.click();
  };

  // Add transaction
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const newTx: Transaction = {
      id: (transactions.length + 1).toString(),
      ...formData,
      amount: Number(formData.amount),
      date: new Date(),
    };
    setTransactions([newTx, ...transactions]);
    setShowModal(false);
    setFormData({ type: 'Vente', amount: 0, method: 'Espèces', client: '', employee: '', note: '' });
  };

  // Print handler
  const handlePrint = () => {
    generateCaissePDF({
      transactions,
      totalSales,
      totalCash,
      totalCard,
      totalRefunds,
      totalDeposits,
      totalWithdrawals,
    });
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
        .accent-bg { background-color: #0A0A0A !important; }
        .accent-text { color: #0A0A0A !important; }
        /* Hide number input arrows for montant field */
        input[type=number].no-arrows {
          appearance: textfield;
        }
        input[type=number].no-arrows::-webkit-inner-spin-button,
        input[type=number].no-arrows::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number].no-arrows {
          -moz-appearance: textfield;
        }
      `}</style>

      {/* Header */}
      <div className="mb-8 pt-20 animate-slideUp">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-light text-gray-900 tracking-tight mb-2">Caisse</h1>
            <p className="text-sm text-gray-400">Gestion des transactions et flux financiers</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Download size={16} />
              Exporter
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2 bg-emerald-600 text-white text-sm font-medium rounded-full hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Ajouter
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 animate-fadeIn">
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-gray-400" size={18} />
            <span className="text-xs text-gray-400">Ventes</span>
          </div>
          <p className="text-2xl font-light text-gray-900">{totalSales} MAD</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-gray-400" size={18} />
            <span className="text-xs text-gray-400">Espèces</span>
          </div>
          <p className="text-2xl font-light text-gray-900">{totalCash} MAD</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="text-gray-400" size={18} />
            <span className="text-xs text-gray-400">Carte</span>
          </div>
          <p className="text-2xl font-light text-gray-900">{totalCard} MAD</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCcw className="text-gray-400" size={18} />
            <span className="text-xs text-gray-400">Remboursements</span>
          </div>
          <p className="text-2xl font-light text-gray-900">{totalRefunds} MAD</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-gray-400" size={18} />
            <span className="text-xs text-gray-400">Dépôts</span>
          </div>
          <p className="text-2xl font-light text-gray-900">{totalDeposits} MAD</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-gray-400" size={18} />
            <span className="text-xs text-gray-400">Retraits</span>
          </div>
          <p className="text-2xl font-light text-gray-900">{totalWithdrawals} MAD</p>
        </div>
      </div>

      {/* Search & Quick Actions */}
      <div className="mb-6 animate-fadeIn">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher une transaction..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={() => { setFormData({ ...formData, type: 'Vente' }); setShowModal(true); }}
            className="px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={14} />
            Nouvelle vente
          </button>
          <button
            onClick={() => { setFormData({ ...formData, type: 'Remboursement' }); setShowModal(true); }}
            className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-full text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <RefreshCcw size={14} />
            Remboursement
          </button>
          <button
            onClick={() => { setFormData({ ...formData, type: 'Dépôt' }); setShowModal(true); }}
            className="px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Wallet size={14} />
            Dépôt
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full text-xs font-medium transition-colors flex items-center gap-2"
            title="Imprimer le rapport"
          >
            <Printer size={14} />
          </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 animate-fadeIn">
        {/* Daily Summary */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-gray-900">Résumé du jour</h3>
            <Calendar className="text-gray-400" size={18} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="text-emerald-600" size={16} />
                <span className="text-xs text-emerald-700 font-medium">Entrées</span>
              </div>
              <p className="text-2xl font-light text-emerald-900">{totalSales + totalDeposits} MAD</p>
              <p className="text-xs text-emerald-600 mt-1">{transactions.filter(t => t.amount > 0).length} transactions</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDownRight className="text-red-600" size={16} />
                <span className="text-xs text-red-700 font-medium">Sorties</span>
              </div>
              <p className="text-2xl font-light text-red-900">{Math.abs(totalRefunds + totalWithdrawals)} MAD</p>
              <p className="text-xs text-red-600 mt-1">{transactions.filter(t => t.amount < 0).length} transactions</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Solde net</span>
              <span className="text-xl font-medium text-gray-900">
                {totalSales + totalDeposits + totalRefunds + totalWithdrawals} MAD
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods Distribution */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-gray-900">Répartition paiements</h3>
            <Wallet className="text-gray-400" size={18} />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Espèces</span>
                <span className="text-sm font-medium text-gray-900">{totalCash} MAD</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${(totalCash / totalSales) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Carte</span>
                <span className="text-sm font-medium text-gray-900">{totalCard} MAD</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${(totalCard / totalSales) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Virement</span>
                <span className="text-sm font-medium text-gray-900">
                  {transactions.filter(t => t.method === 'Virement').reduce((sum, t) => sum + t.amount, 0)} MAD
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{ width: `${(transactions.filter(t => t.method === 'Virement').reduce((sum, t) => sum + t.amount, 0) / totalSales) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden animate-fadeIn">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-900">Toutes les transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      tx.type === 'Vente' ? 'bg-emerald-50 text-emerald-700' :
                      tx.type === 'Remboursement' ? 'bg-red-50 text-red-700' :
                      tx.type === 'Dépôt' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-light text-lg ${tx.amount < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {tx.amount} MAD
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {tx.method === 'Espèces' && <Wallet size={14} className="text-gray-400" />}
                      {tx.method === 'Carte' && <CreditCard size={14} className="text-gray-400" />}
                      <span className="text-sm text-gray-600">{tx.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tx.client || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tx.employee || '-'}</td>
                  <td className="px-6 py-4 text-xs text-gray-400">{tx.date.toLocaleString('fr-FR')}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tx.note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (
          <div className="py-12 text-center">
            <Receipt className="mx-auto text-gray-300 mb-3" size={48} />
                        <p className="text-gray-500">Aucune transaction trouvée</p>
          </div>
        )}
      </div>

      {/* Modal Add Transaction */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-light text-gray-900">Nouvelle transaction</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddTransaction} className="px-8 py-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <Select value={formData.type} onValueChange={v => setFormData({ ...formData, type: v as any })}>
                      <SelectTrigger className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm mt-2">
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vente">Vente</SelectItem>
                        <SelectItem value="Remboursement">Remboursement</SelectItem>
                        <SelectItem value="Dépôt">Dépôt</SelectItem>
                        <SelectItem value="Retrait">Retrait</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                        onClick={() => setFormData({ ...formData, amount: Math.max(0, Number(formData.amount) - 10) })}
                        aria-label="Diminuer le montant"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm text-center no-arrows"
                        required
                        placeholder="Montant en MAD"
                        min={0}
                      />
                      <button
                        type="button"
                        className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                        onClick={() => setFormData({ ...formData, amount: Number(formData.amount) + 10 })}
                        aria-label="Augmenter le montant"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Méthode</label>
                    <Select value={formData.method} onValueChange={v => setFormData({ ...formData, method: v as any })}>
                      <SelectTrigger className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm mt-2">
                        <SelectValue placeholder="Sélectionner la méthode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Espèces">Espèces</SelectItem>
                        <SelectItem value="Carte">Carte</SelectItem>
                        <SelectItem value="Virement">Virement</SelectItem>
                        <SelectItem value="Chèque">Chèque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                    <input type="text" value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })} className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm" placeholder="Nom du client" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employé</label>
                    <input type="text" value={formData.employee} onChange={e => setFormData({ ...formData, employee: e.target.value })} className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm" placeholder="Nom de l'employé" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                    <input type="text" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm" placeholder="Ajouter une note (optionnel)" />
                  </div>
                </div>
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-100 -mx-8 px-8 py-4 mt-6 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Annuler</button>
                <button type="submit" className="flex-1 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
