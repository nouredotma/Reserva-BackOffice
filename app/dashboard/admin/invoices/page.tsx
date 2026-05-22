'use client';

import { useState } from 'react';
import { Calendar, Download, FileText, Filter, Printer, TrendingUp } from 'lucide-react';

const invoices = [
  { id: 'F1363585', date: '20 November 2024', amount: 82.8, status: 'paid' },
  { id: 'F1305070', date: '20 October 2024', amount: 82.8, status: 'paid' },
  { id: 'F1266568', date: '20 September 2024', amount: 82.8, status: 'paid' },
  { id: 'F1220184', date: '20 August 2024', amount: 82.8, status: 'paid' },
  { id: 'F1177477', date: '20 July 2024', amount: 82.8, status: 'paid' },
  { id: 'F1125461', date: '20 June 2024', amount: 82.8, status: 'paid' },
  { id: 'F1075923', date: '20 May 2024', amount: 82.8, status: 'paid' },
  { id: 'F1028474', date: '20 April 2024', amount: 82.8, status: 'paid' },
  { id: 'F0985621', date: '20 March 2024', amount: 82.8, status: 'pending' },
  { id: 'F0942387', date: '20 February 2024', amount: 82.8, status: 'paid' },
];

export default function InvoicesPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending'>('all');

  const filteredInvoices = filterStatus === 'all' ? invoices : invoices.filter((invoice) => invoice.status === filterStatus);
  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidCount = invoices.filter((invoice) => invoice.status === 'paid').length;

  const exportData = () => {
    const csvContent = [
      ['Number', 'Date', 'Amount incl. tax', 'Status'].join(','),
      ...filteredInvoices.map((invoice) =>
        [invoice.id, invoice.date, `${invoice.amount.toFixed(2)} EUR`, invoice.status === 'paid' ? 'Paid' : 'Pending'].join(','),
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoices-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-0">
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
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="mb-8 pt-20 animate-slideUp">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-light tracking-tight text-gray-900">Invoices</h1>
            <p className="mt-2 text-base text-gray-400">Manage and review all invoices</p>
          </div>
          <div className="flex items-center gap-4 no-print">
            <button onClick={exportData} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 transition-colors hover:text-gray-900">
              <Download size={16} />
              Exporter
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 transition-colors hover:text-gray-900">
              <Printer size={16} />
              Print
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3 animate-fadeIn">
          <div className="group rounded-xl border border-neutral-200 bg-white p-6 transition-all">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                <FileText size={20} className="text-gray-400" />
              </div>
              <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-600">
                <TrendingUp size={12} />
                <span className="text-[10px] font-medium">+2%</span>
              </div>
            </div>
            <p className="mb-1 text-xs font-medium text-gray-500">Total invoices</p>
            <p className="text-3xl font-light text-gray-900">{invoices.length}</p>
          </div>
          <div className="group rounded-xl border border-neutral-200 bg-white p-6 transition-all">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                <Calendar size={20} className="text-gray-400" />
              </div>
              <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-600">
                <TrendingUp size={12} />
                <span className="text-[10px] font-medium">+1%</span>
              </div>
            </div>
            <p className="mb-1 text-xs font-medium text-gray-500">Paid invoices</p>
            <p className="text-3xl font-light text-gray-900">{paidCount}/{invoices.length}</p>
          </div>
          <div className="group rounded-xl border border-neutral-200 bg-white p-6 transition-all">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                <FileText size={20} className="text-gray-400" />
              </div>
              <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-600">
                <TrendingUp size={12} />
                <span className="text-[10px] font-medium">+0%</span>
              </div>
            </div>
            <p className="mb-1 text-xs font-medium text-gray-500">Total amount</p>
            <p className="text-3xl font-light text-gray-900">{totalAmount.toFixed(2)} EUR</p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-end gap-4 no-print">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter size={16} />
            <span>Filter by status:</span>
          </div>
          <div className="flex gap-2">
            {(['all', 'paid', 'pending'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`rounded-full border px-4 py-2 text-sm capitalize transition-all ${
                  filterStatus === status ? 'border-primary bg-primary text-primary-foreground' : 'border-neutral-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white animate-slideUp">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Number</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount incl. tax</th>
                <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="transition-colors hover:bg-gray-50/30">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{invoice.id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{invoice.date}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">{invoice.amount.toFixed(2)} EUR</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-sm font-medium text-emerald-600 underline transition-colors hover:text-emerald-700">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
