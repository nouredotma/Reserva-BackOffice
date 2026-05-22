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
      ['Appointment with', 'Appointment date', 'Client', 'Booked online', 'Created', 'Cancellation', 'Canceled by client'].join(','),
      ...appointments.map(apt =>
        [
          apt.collaborator,
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
    a.download = `rdv-annules-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const printReport = () => {
    window.print();
  };


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
          {/* Left: Title */}
          <div className="flex items-center gap-8">
            <div>
              <h1 className="text-5xl font-light text-gray-900 tracking-tight">
                Canceled appointments
              </h1>
              <p className="text-base text-gray-400 mt-2">Canceled appointments from 10/13/2025 to 11/12/2025</p>
            </div>
          </div>

          {/* Right: Actions */}
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
            <button className="flex items-center px-4 gap-2 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-neutral-200 rounded-full hover:bg-gray-50 transition-colors">
              <Trash2 size={16} />
              Vider la corbeille
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border-2 border-neutral-200 overflow-hidden animate-slideUp">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointment with
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointment date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booked online
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cancellation
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Canceled by client
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{apt.collaborator}</span>
                  </td>
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
                  <td className="px-6 py-4 text-center">
                    <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors underline">
                      Restaurer
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
