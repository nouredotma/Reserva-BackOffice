'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Calendar, Download, Printer, Check } from 'lucide-react';

export default function CancelledAppointments() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sample data for cancelled appointments
  // Dates are now within the last 30 days from 12/11/2025
  const collaboratorNames = [
    'Yassine El Fassi',
    'Samira Bouzid',
    'Khalid Ait Lahcen',
    'Nadia El Khatib'
  ];
  const actualClients = [
    'Yassine El Bou Fatima',
    'Mohamed Ben Khadija',
    'Omar Ait Sara',
    'Hassan Bou Imane',
    'Soufiane Al Nadia',
    'Abdelkader El Amina',
    'Rachid Ben Samira',
    'Mehdi Ait Meryem',
    'Hamza Bou Salma',
    'Ayoub Al Zineb',
  ];
  // Helper to format date
  function formatDate(date: Date) {
    return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
  // Generate dates within last 30 days from 12/11/2025
  const baseDate = new Date('2025-11-12T10:00:00');
  const appointments = Array.from({ length: 10 }).map((_, i) => {
    const daysAgo = 29 - i * 3;
    const rdvDate = new Date(baseDate);
    rdvDate.setDate(baseDate.getDate() - daysAgo);
    rdvDate.setHours(9 + (i % 8), 0);
    const creationDate = new Date(rdvDate);
    creationDate.setDate(rdvDate.getDate() - 1);
    creationDate.setHours(rdvDate.getHours() - 1, 30);
    const cancellationDate = new Date(rdvDate);
    cancellationDate.setHours(rdvDate.getHours() - 1, 45);
    return {
      id: i + 1,
      collaborator: collaboratorNames[i % collaboratorNames.length],
      date: formatDate(rdvDate),
      client: actualClients[i % actualClients.length],
      takenOnline: i % 2 === 0,
      creationDate: creationDate.toLocaleDateString('fr-FR'),
      creationTime: creationDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      cancellationDate: cancellationDate.toLocaleDateString('fr-FR'),
      cancellationTime: cancellationDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      cancelledByClient: i % 2 === 1
    };
  });

  const exportData = () => {
    const csvContent = [
      ['RDV avec', 'Date du RDV', 'Client(e)', 'Pris par Internet', 'Création', 'Annulation', 'Annulé par le client'].join(','),
      ...appointments.map(apt => 
        [
          apt.collaborator, 
          apt.date, 
          apt.client, 
          apt.takenOnline ? 'Oui' : 'Non',
          `${apt.creationDate} ${apt.creationTime}`,
          `${apt.cancellationDate} ${apt.cancellationTime}`,
          apt.cancelledByClient ? 'Oui' : 'Non'
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
          {/* Left: Title */}
          <div className="flex items-center gap-8">
            <div>
              <h1 className="text-5xl font-light text-gray-900 tracking-tight">
                RDV annulés
              </h1>
              <p className="text-base text-gray-400 mt-2">Rendez-vous annulés du 13/10/2025 au 12/11/2025</p>
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
              Imprimer
            </button>
            <button className="flex items-center px-4 gap-2 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
              <Trash2 size={16} />
              Vider la corbeille
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
                  RDV avec
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date du RDV
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client(e)
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pris par Internet
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Création
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Annulation
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Annulé par le client
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