'use client';



import { useCallback, useEffect, useRef, useState } from 'react';

import { Calendar, Download, FileText, Plus, Printer, TrendingUp } from 'lucide-react';

type Invoice = {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending';
};

const initialInvoices: Invoice[] = [

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



type InvoiceStatus = 'all' | 'paid' | 'pending';



const statusOptions: { value: InvoiceStatus; label: string }[] = [

  { value: 'all', label: 'All' },

  { value: 'paid', label: 'Paid' },

  { value: 'pending', label: 'Pending' },

];



const exportButtonClass =

  'flex h-10 cursor-pointer items-center gap-2 rounded-full border border-emerald-500 bg-emerald-50 px-4 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white';

const printButtonClass =

  'flex h-10 cursor-pointer items-center gap-2 rounded-full border border-blue-500 bg-blue-50 px-4 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-600 hover:text-white';

const createInvoiceButtonClass =

  'flex h-10 cursor-pointer items-center gap-2 rounded-full border border-primary bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:border-[var(--reserva-ink)] hover:bg-[var(--reserva-ink)] hover:text-white';

function InvoiceStatusFilter({

  value,

  onChange,

}: {

  value: InvoiceStatus;

  onChange: (value: InvoiceStatus) => void;

}) {

  const containerRef = useRef<HTMLDivElement>(null);

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });



  const updateIndicator = useCallback(() => {

    const container = containerRef.current;

    if (!container) return;

    const activeButton = container.querySelector<HTMLButtonElement>(`[data-status="${value}"]`);

    if (!activeButton) return;

    setIndicatorStyle({

      left: activeButton.offsetLeft,

      width: activeButton.offsetWidth,

    });

  }, [value]);



  useEffect(() => {

    updateIndicator();

    window.addEventListener('resize', updateIndicator);

    return () => window.removeEventListener('resize', updateIndicator);

  }, [updateIndicator]);



  return (

    <div

      ref={containerRef}

      className="relative inline-flex h-10 max-w-full items-center overflow-x-auto rounded-full bg-neutral-200 p-1"

      role="tablist"

      aria-label="Invoice status"

    >

      <div

        aria-hidden

        className="pointer-events-none absolute top-1 bottom-1 rounded-full bg-white transition-[left,width] duration-300 ease-out"

        style={{ left: indicatorStyle.left, width: indicatorStyle.width }}

      />

      {statusOptions.map((option) => (

        <button

          key={option.value}

          type="button"

          role="tab"

          aria-selected={value === option.value}

          data-status={option.value}

          onClick={() => onChange(option.value)}

          className={`relative z-10 flex h-8 cursor-pointer items-center whitespace-nowrap rounded-full px-4 text-xs font-medium transition-colors ${

            value === option.value ? 'text-gray-900' : 'text-neutral-500 hover:text-neutral-700'

          }`}

        >

          {option.label}

        </button>

      ))}

    </div>

  );

}



export default function InvoicesPage() {

  const [filterStatus, setFilterStatus] = useState<InvoiceStatus>('all');

  const [invoiceList, setInvoiceList] = useState(initialInvoices);



  const filteredInvoices =

    filterStatus === 'all' ? invoiceList : invoiceList.filter((invoice) => invoice.status === filterStatus);

  const totalAmount = invoiceList.reduce((sum, invoice) => sum + invoice.amount, 0);

  const paidCount = invoiceList.filter((invoice) => invoice.status === 'paid').length;



  const createInvoice = () => {

    const nextId = `F${String(Date.now()).slice(-7)}`;

    const date = new Date().toLocaleDateString('en-GB', {

      day: 'numeric',

      month: 'long',

      year: 'numeric',

    });

    setInvoiceList((current) => [

      { id: nextId, date, amount: 82.8, status: 'pending' },

      ...current,

    ]);

  };



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
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>



      <div className="mb-8 pt-20">

        <div className="mb-6 flex flex-wrap items-center justify-between gap-6">

          <div>

            <h1 className="text-5xl font-light tracking-tight text-gray-900">Invoices</h1>

            <p className="mt-2 text-sm text-neutral-500">Manage and review all invoices</p>

          </div>

          <div className="flex flex-wrap items-center gap-3 no-print">

            <button type="button" onClick={createInvoice} className={createInvoiceButtonClass}>

              <Plus size={14} />

              Create invoice

            </button>

            <InvoiceStatusFilter value={filterStatus} onChange={setFilterStatus} />

            <button type="button" onClick={exportData} className={exportButtonClass}>

              <Download size={14} />

              Export

            </button>

            <button type="button" onClick={() => window.print()} className={printButtonClass}>

              <Printer size={14} />

              Print

            </button>

          </div>

        </div>



        <div className="mb-8 grid gap-4 md:grid-cols-3">

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

            <p className="text-3xl font-light text-gray-900">{invoiceList.length}</p>

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

            <p className="text-3xl font-light text-gray-900">{paidCount}/{invoiceList.length}</p>

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

      </div>



      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="border-b border-gray-100 bg-gray-50">

              <tr>

                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Number</th>

                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Date</th>

                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">Amount incl. tax</th>

                <th className="px-6 py-4 text-center text-xs font-normal tracking-wider text-gray-500">Status</th>

                <th className="px-6 py-4 text-center text-xs font-normal tracking-wider text-gray-500">Actions</th>

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

                    <button

                      type="button"

                      className="cursor-pointer text-sm font-medium text-emerald-600 underline transition-colors hover:text-emerald-700"

                    >

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


