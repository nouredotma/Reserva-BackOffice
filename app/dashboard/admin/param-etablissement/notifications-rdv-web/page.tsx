'use client';

import React, { useState } from 'react';
import { Check, Mail, Trash2, Plus } from 'lucide-react';

const NotificationRDVPage = () => {
  const [emails, setEmails] = useState(['nailly.contact@gmail.com']);
  const [newEmail, setNewEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddEmail = () => {
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setNewEmail('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const handleDeleteEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen p-0 md:p-0 max-w-[2000px] mx-auto">
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
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-6 right-6 bg-green-400 text-white px-6 py-3 rounded shadow-lg z-50 flex items-center gap-3 animate-fadeIn">
          <Check size={20} />
          <span className="font-medium">Modifications enregistrées avec succès</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 animate-slideDown mt-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-2">
              Notifications RDV
            </h1>
            <p className="text-sm text-gray-500">
              Recevez un email dès qu'un rendez-vous est pris ou annulé en ligne
            </p>
          </div>
        </div>
      </div>

      {/* Card Section */}
      <div className="max-w-6xl mx-auto animate-fadeIn p-0">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Ajouter une adresse email</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-gray-700 bg-gray-50"
              placeholder="exemple@email.com"
            />
            <button
              type="button"
              onClick={handleAddEmail}
              className="px-5 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Ajouter
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {emails.map(email => (
            <div key={email} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-full px-5 py-3">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <span className="text-sm text-gray-900 font-medium">{email}</span>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteEmail(email)}
                className="px-3 py-1 text-sm text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors flex items-center gap-1"
              >
                <Trash2 size={16} />
                Supprimer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationRDVPage;