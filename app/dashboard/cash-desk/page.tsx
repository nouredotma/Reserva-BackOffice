'use client';

import { useState, useEffect, useMemo } from 'react';
import { DollarSign, CreditCard, RefreshCcw, Download, Plus, Search, Calendar, X, Wallet, Receipt, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useCashDeskFilters, type CashDeskPeriodFilter } from '@/lib/cash-desk-filters';
import { sampleBookings, sampleClients, sampleTransactions } from '@/lib/mock-data';
import type { Transaction } from '@/lib/types';

const isWithinSelectedPeriod = (date: Date, selectedPeriod: CashDeskPeriodFilter) => {
  if (selectedPeriod === 'all') return true;

  const now = new Date();
  const transactionDate = new Date(date);

  if (selectedPeriod === 'day') {
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    return transactionDate >= startOfDay;
  }

  if (selectedPeriod === 'week') {
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    const weekday = startOfWeek.getDay();
    const mondayOffset = weekday === 0 ? -6 : 1 - weekday;
    startOfWeek.setDate(startOfWeek.getDate() + mondayOffset);
    return transactionDate >= startOfWeek;
  }

  return (
    transactionDate.getFullYear() === now.getFullYear() &&
    transactionDate.getMonth() === now.getMonth()
  );
};

export default function CashDeskPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { methodFilter, typeFilter, selectedPeriod } = useCashDeskFilters();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const clientOptions = useMemo(
    () =>
      Array.from(
        new Set([
          ...sampleClients.map((client) => client.name),
          ...sampleBookings.map((booking) => booking.clientName),
        ]),
      ).sort((a, b) => a.localeCompare(b)),
    [],
  );
  const [formData, setFormData] = useState({
    type: 'Sale' as Transaction['type'],
    amount: 0,
    method: 'Cash' as Transaction['method'],
    client: '',
    note: ''
  });

  useEffect(() => {
    setTransactions(sampleTransactions);
  }, []);

  // Filtering
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch =
      !normalizedSearch ||
      tx.client?.toLowerCase().includes(normalizedSearch) ||
      tx.note?.toLowerCase().includes(normalizedSearch) ||
      tx.method.toLowerCase().includes(normalizedSearch);
    const matchesMethod = methodFilter === 'all' || tx.method === methodFilter;
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesPeriod = isWithinSelectedPeriod(tx.date, selectedPeriod);
    return matchesSearch && matchesMethod && matchesType && matchesPeriod;
  });

  // Stats
  const totalSales = filteredTransactions.filter(t => t.type === 'Sale').reduce((sum, t) => sum + t.amount, 0);
  const totalCash = filteredTransactions.filter(t => t.method === 'Cash').reduce((sum, t) => sum + t.amount, 0);
  const totalCard = filteredTransactions.filter(t => t.method === 'Card').reduce((sum, t) => sum + t.amount, 0);
  const totalTransfer = filteredTransactions.filter(t => t.method === 'Transfer').reduce((sum, t) => sum + t.amount, 0);
  const totalRefunds = filteredTransactions.filter(t => t.type === 'Refund').reduce((sum, t) => sum + t.amount, 0);
  const totalDeposits = filteredTransactions.filter(t => t.type === 'Deposit').reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = filteredTransactions.filter(t => t.type === 'Withdrawal').reduce((sum, t) => sum + t.amount, 0);
  const getSalesShare = (amount: number) => (totalSales > 0 ? (amount / totalSales) * 100 : 0);
  const totalInflow = totalSales + totalDeposits;
  const totalOutflow = Math.abs(totalRefunds + totalWithdrawals);
  const netBalance = totalInflow - totalOutflow;
  const inflowCount = filteredTransactions.filter(t => t.type === 'Sale' || t.type === 'Deposit').length;
  const outflowCount = filteredTransactions.filter(t => t.type === 'Refund' || t.type === 'Withdrawal').length;

  // Export CSV
  const exportToCSV = () => {
    const headers = ['Type', 'Amount', 'Method', 'Client', 'Date', 'Note'];
    const rows = filteredTransactions.map(tx => [
      tx.type,
      tx.amount,
      tx.method,
      tx.client || '',
      tx.date.toLocaleString('en-US'),
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
    setFormData({ type: 'Sale', amount: 0, method: 'Cash', client: '', note: '' });
  };

  const openTransactionModal = (type: Transaction['type']) => {
    setFormData((prev) => ({ ...prev, type }));
    setShowModal(true);
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
      <div className="mb-5 md:mb-8 pt-20 animate-slideUp">
        <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-5xl font-light text-gray-900 tracking-tight mb-2">Cash Desk</h1>
            <p className="text-xs md:text-sm text-gray-400">Manage transactions and cash flow</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={exportToCSV}
              className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-emerald-500 bg-emerald-50 px-3 sm:px-4 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Exporter</span>
            </button>
            <button
              type="button"
              onClick={() => openTransactionModal('Sale')}
              className="flex h-10 cursor-pointer items-center gap-2 rounded-full bg-primary px-3 sm:px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-[var(--reserva-ink)] hover:text-white"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 animate-fadeIn">
        <div className="bg-white rounded-xl border border-neutral-200 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-gray-400" size={18} />
            <span className="text-xs text-gray-400">Sales</span>
          </div>
          <p className="text-2xl font-light text-gray-900">{totalSales} MAD</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-gray-400" size={18} />
            <span className="text-xs text-gray-400">Cash</span>
          </div>
          <p className="text-2xl font-light text-gray-900">{totalCash} MAD</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="text-gray-400" size={18} />
            <span className="text-xs text-gray-400">Card</span>
          </div>
          <p className="text-2xl font-light text-gray-900">{totalCard} MAD</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCcw className="text-gray-400" size={18} />
            <span className="text-xs text-gray-400">Refunds</span>
          </div>
          <p className="text-2xl font-light text-gray-900">{totalRefunds} MAD</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-gray-400" size={18} />
            <span className="text-xs text-gray-400">Deposits</span>
          </div>
          <p className="text-2xl font-light text-gray-900">{totalDeposits} MAD</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-gray-400" size={18} />
            <span className="text-xs text-gray-400">Withdrawals</span>
          </div>
          <p className="text-2xl font-light text-gray-900">{totalWithdrawals} MAD</p>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 animate-fadeIn">
        {/* Daily Summary */}
        <div className="md:col-span-2 bg-white rounded-xl border border-neutral-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-gray-900">Daily summary</h3>
            <Calendar className="text-gray-400" size={18} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="text-emerald-600" size={16} />
                <span className="text-xs text-emerald-700 font-medium">Inflow</span>
              </div>
              <p className="text-2xl font-light text-emerald-900">{totalInflow} MAD</p>
              <p className="text-xs text-emerald-600 mt-1">{inflowCount} transactions</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDownRight className="text-red-600" size={16} />
                <span className="text-xs text-red-700 font-medium">Outflow</span>
              </div>
              <p className="text-2xl font-light text-red-900">{totalOutflow} MAD</p>
              <p className="text-xs text-red-600 mt-1">{outflowCount} transactions</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Solde net</span>
              <span className="text-xl font-medium text-gray-900">
                {netBalance} MAD
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods Distribution */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-gray-900">Payment breakdown</h3>
            <Wallet className="text-gray-400" size={18} />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Cash</span>
                <span className="text-sm font-medium text-gray-900">{totalCash} MAD</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${getSalesShare(totalCash)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Card</span>
                <span className="text-sm font-medium text-gray-900">{totalCard} MAD</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${getSalesShare(totalCard)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Transfer</span>
                <span className="text-sm font-medium text-gray-900">
                  {totalTransfer} MAD
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{ width: `${getSalesShare(totalTransfer)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex animate-fadeIn">
        <div className="flex h-10 min-w-0 w-full items-center gap-2 rounded-full border border-neutral-200 bg-white px-3">
          <Search size={16} className="shrink-0 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transactions"
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white animate-fadeIn">
        <div className="scroll-hint overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Type</th>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Method</th>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Client</th>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Date</th>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="transition-colors hover:bg-gray-50/30">
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        tx.type === 'Sale'
                          ? 'bg-emerald-100 text-emerald-700'
                          : tx.type === 'Refund'
                            ? 'bg-red-100 text-red-700'
                            : tx.type === 'Deposit'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${tx.amount < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {tx.amount} MAD
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      {tx.method === 'Cash' && <Wallet size={14} className="text-gray-400" />}
                      {tx.method === 'Card' && <CreditCard size={14} className="text-gray-400" />}
                      <span>{tx.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{tx.client || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{tx.date.toLocaleString('en-US')}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{tx.note || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (
          <div className="py-12 text-center">
            <Receipt className="mx-auto mb-3 text-gray-300" size={48} />
            <p className="text-sm text-gray-500">No transactions found</p>
          </div>
        )}
      </div>

      {/* Modal Add Transaction */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4 animate-fadeIn">
          <div className="bg-white rounded-xl border border-neutral-200 max-w-lg w-full max-h-[calc(100vh-1.5rem)] md:max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 md:px-8 py-5 md:py-6 flex items-center justify-between">
              <h2 className="text-2xl font-light text-gray-900">New transaction</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddTransaction} className="px-5 md:px-8 py-5 md:py-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <Select value={formData.type} onValueChange={v => setFormData({ ...formData, type: v as Transaction['type'] })}>
                      <SelectTrigger className="mt-2 w-full cursor-pointer rounded-full border border-neutral-200 bg-gray-50 px-4 py-2.5 text-sm">
                        <SelectValue placeholder="Select le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sale">Sale</SelectItem>
                        <SelectItem value="Refund">Refund</SelectItem>
                        <SelectItem value="Deposit">Deposit</SelectItem>
                        <SelectItem value="Withdrawal">Withdrawal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="cursor-pointer rounded-full bg-gray-100 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-200"
                        onClick={() => setFormData({ ...formData, amount: Math.max(0, Number(formData.amount) - 10) })}
                        aria-label="Decrease amount"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-neutral-200 text-sm text-center no-arrows"
                        required
                        placeholder="Amount en MAD"
                        min={0}
                      />
                      <button
                        type="button"
                        className="cursor-pointer rounded-full bg-gray-100 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-200"
                        onClick={() => setFormData({ ...formData, amount: Number(formData.amount) + 10 })}
                        aria-label="Increase amount"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                    <Select value={formData.method} onValueChange={v => setFormData({ ...formData, method: v as Transaction['method'] })}>
                      <SelectTrigger className="mt-2 w-full cursor-pointer rounded-full border border-neutral-200 bg-gray-50 px-4 py-2.5 text-sm">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="Transfer">Transfer</SelectItem>
                        <SelectItem value="Check">Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                    <Select
                      value={formData.client || '__none__'}
                      onValueChange={(v) => setFormData({ ...formData, client: v === '__none__' ? '' : v })}
                    >
                      <SelectTrigger className="mt-2 w-full cursor-pointer rounded-full border border-neutral-200 bg-gray-50 px-4 py-2.5 text-sm">
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__" className="cursor-pointer">
                          No client
                        </SelectItem>
                        {clientOptions.map((name) => (
                          <SelectItem key={name} value={name} className="cursor-pointer">
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                    <input type="text" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-neutral-200 text-sm" placeholder="Add a note (optional)" />
                  </div>
                </div>
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-100 -mx-8 px-8 py-4 mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 cursor-pointer rounded-full border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-[var(--reserva-ink)] hover:text-white cursor-pointer transition-colors">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
