'use client';

import React, { useState, useEffect } from 'react';
import { Download, Printer, FileText, CreditCard, Calendar, TrendingUp, Filter } from 'lucide-react';

export default function InvoicesDashboard() {
  const [mounted, setMounted] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate invoice data
  const invoices = [
    { id: 'F1363585', date: '20 November 2024', amount: 82.80, status: 'paid', payment: 'Automatic debit' },
    { id: 'F1305070', date: '20 October 2024', amount: 82.80, status: 'paid', payment: 'Automatic debit' },
    { id: 'F1266568', date: '20 September 2024', amount: 82.80, status: 'paid', payment: 'Automatic debit' },
    { id: 'F1220184', date: '20 August 2024', amount: 82.80, status: 'paid', payment: 'Automatic debit' },
    { id: 'F1177477', date: '20 July 2024', amount: 82.80, status: 'paid', payment: 'Automatic debit' },
    { id: 'F1125461', date: '20 June 2024', amount: 82.80, status: 'paid', payment: 'Automatic debit' },
    { id: 'F1075923', date: '20 May 2024', amount: 82.80, status: 'paid', payment: 'Automatic debit' },
    { id: 'F1028474', date: '20 April 2024', amount: 82.80, status: 'paid', payment: 'Automatic debit' },
    { id: 'F0985621', date: '20 March 2024', amount: 82.80, status: 'pending', payment: 'Pending' },
    { id: 'F0942387', date: '20 February 2024', amount: 82.80, status: 'paid', payment: 'Automatic debit' },
  ];

  const filteredInvoices = filterStatus === 'all'
    ? invoices
    : invoices.filter(inv => inv.status === filterStatus);

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidCount = invoices.filter(inv => inv.status === 'paid').length;
  const pendingCount = invoices.filter(inv => inv.status === 'pending').length;

  const exportData = () => {
    const csvContent = [
      ['Number', 'Date', 'Amount incl. tax', 'Status', 'Payment terms'].join(','),
      ...filteredInvoices.map(inv =>
        [
          inv.id,
          inv.date,
          `${inv.amount.toFixed(2)} €`,
          inv.status === 'paid' ? 'Paid' : 'Pending',
          inv.payment
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoices-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const printReport = () => {
    window.print();
  };

  const downloadInvoice = (invoiceId: string) => {
    console.log(`Invoice download ${invoiceId}`);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen p-0 md:p-0">
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
          <div className="flex items-center gap-8">
            <div>
              <h1 className="text-5xl font-light text-gray-900 tracking-tight">
                Invoices
              </h1>
              <p className="text-base text-gray-400 mt-2">Manage and review all invoices</p>
            </div>
          </div>

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

        {/* Stats Cards (KPI) - Redesigned to match taux-occupation/ressources style */}
        <div className="grid grid-cols-3 gap-4 mb-8 animate-fadeIn">
          <div className="bg-white rounded-xl border border-gray-100 p-6  transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-colors">
                <FileText size={20} className="text-gray-400" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <TrendingUp size={12} />
                <span className="text-[10px] font-medium">+2%</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 font-medium">Total invoices</p>
              <p className="text-3xl font-light text-gray-900">{invoices.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6  transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-colors">
                <CreditCard size={20} className="text-gray-400" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <TrendingUp size={12} />
                <span className="text-[10px] font-medium">+1%</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 font-medium">Total amount</p>
              <p className="text-3xl font-light text-gray-900">{totalAmount.toFixed(2)} €</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6  transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-colors">
                <Calendar size={20} className="text-gray-400" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <TrendingUp size={12} />
                <span className="text-[10px] font-medium">+0%</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 font-medium">Paid invoices</p>
              <p className="text-3xl font-light text-gray-900">{paidCount}/{invoices.length}</p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-6 no-print justify-end">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter size={16} />
            <span>Filter by status:</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 text-sm rounded-full transition-all ${
                filterStatus === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('paid')}
              className={`px-4 py-2 text-sm rounded-full transition-all ${
                filterStatus === 'paid'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 text-sm rounded-full transition-all ${
                filterStatus === 'pending'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Pending
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden animate-slideUp">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount incl. tax
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment terms
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.map((invoice, index) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-gray-50/30 transition-colors"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{invoice.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">
                      {invoice.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">{invoice.amount.toFixed(2)} €</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{invoice.payment}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => downloadInvoice(invoice.id)}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors underline"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No invoices found</p>
          </div>
        )}
      </div>

      {/* Footer Summary */}
      <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200 no-print">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Affichage de <span className="font-semibold text-gray-900">{filteredInvoices.length}</span> invoice(s)
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Displayed total</div>
            <div className="text-2xl font-semibold text-gray-900">
              {filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)} €
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
