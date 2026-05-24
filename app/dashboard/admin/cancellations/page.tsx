'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Download, Printer, Check } from 'lucide-react';
import { CancelledAppointment, generateSampleCancelledAppointments } from '@/lib/mock-data';

export default function CancellationsPage() {
  const [appointments, setAppointments] = useState<CancelledAppointment[]>([]);

  useEffect(() => {
    setAppointments(generateSampleCancelledAppointments(10));
  }, []);

  const exportData = () => {
    const csvContent = [
      ['Appointment date', 'Client', 'Booked online', 'Created', 'Cancellation', 'Canceled by client'].join(','),
      ...appointments.map(apt =>
        [
          apt.date,
          apt.client,
          apt.takenOnline ? 'Yes' : 'No',
          `${apt.creationDate} ${apt.creationTime}`,
          `${apt.cancellationDate} ${apt.cancellationTime}`,
          apt.cancelledByClient ? 'Yes' : 'No'
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `canceled-appointments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const printReport = () => {
    window.print();
  };


  return (
    <div className="min-h-screen p-0 md:p-0">
      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <div className="mb-5 md:mb-8 pt-32 md:pt-20">
        <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between mb-6">
          {/* Left: Title */}
          <div className="flex items-center gap-8 min-w-0">
            <div className="min-w-0">
              <h1 className="text-2xl md:text-5xl font-light text-gray-900 tracking-tight">
                Canceled appointments
              </h1>
              <p className="mt-2 text-xs md:text-sm text-neutral-500">Canceled appointments from 10/13/2025 to 11/12/2025</p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 no-print">
            <button
              type="button"
              onClick={exportData}
              className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-emerald-500 bg-emerald-50 px-3 sm:px-4 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              type="button"
              onClick={printReport}
              className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-blue-500 bg-blue-50 px-3 sm:px-4 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              type="button"
              className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 sm:px-4 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">Empty trash</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="scroll-hint overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">
                  Appointment date
                </th>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">
                  Client
                </th>
                <th className="px-6 py-4 text-center text-xs font-normal tracking-wider text-gray-500">
                  Booked online
                </th>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-normal tracking-wider text-gray-500">
                  Cancellation
                </th>
                <th className="px-6 py-4 text-center text-xs font-normal tracking-wider text-gray-500">
                  Canceled by client
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400">
                      {apt.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{apt.client || '-'}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {apt.takenOnline && (
                      <Check size={18} className="text-gray-600 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>{apt.creationDate}</div>
                      <div className="text-xs text-gray-500">{apt.creationTime}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>{apt.cancellationDate}</div>
                      <div className="text-xs text-gray-500">{apt.cancellationTime}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {apt.cancelledByClient && (
                      <Check size={18} className="text-gray-600 mx-auto" />
                    )}
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
