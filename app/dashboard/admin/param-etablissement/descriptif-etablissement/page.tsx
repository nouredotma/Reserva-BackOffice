'use client';

import React, { useState } from 'react';
import { Building2, Check } from 'lucide-react';

const AProposPage = () => {
  const [description, setDescription] = useState(
    "Le Salon Marrakech est un institut de beauté marocain situé au cœur de Paris, réputé pour son ambiance chaleureuse et ses soins traditionnels. Spécialisé dans le hammam, les soins du visage à l'huile d'argan, et la manucure orientale, notre équipe passionnée vous accueille dans un décor inspiré des riads marocains. Profitez d'une expérience authentique avec des rituels de beauté ancestraux, des massages relaxants et des soins capillaires naturels. Que vous veniez pour une épilation au sucre, une pose de henné ou simplement pour vous détendre, le Salon Marrakech vous garantit un moment de bien-être et de raffinement à la marocaine."
  );
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const maxChars = 1000;
  const remainingChars = maxChars - description.length;

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
              À-propos
            </h1>
            <p className="text-sm text-gray-500">
              Modifier la section à-propos de ma page WellBe
            </p>
          </div>
          <a
            href="#"
            className="px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-gray-800 transition-all flex items-center gap-2"
          >
            <Building2 size={18} />
            Voir ma page WellBe
          </a>
        </div>
        <div className="text-gray-600 text-sm mb-6">
          Ce texte sera soumis à validation.
        </div>
      </div>

      {/* Card Section */}
      <div className="max-w-6xl mx-autop-0 animate-fadeIn">
        <textarea
          value={description}
          onChange={(e) => {
            if (e.target.value.length <= maxChars) {
              setDescription(e.target.value);
            }
          }}
          rows={10}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-gray-700 resize-none leading-relaxed bg-gray-50"
          placeholder="Décrivez votre établissement..."
        />
        <div className="mt-2 text-right text-xs text-gray-500">
          {remainingChars} caractères restants
        </div>
        <button
          onClick={handleSave}
          className="w-full mt-6 bg-primary hover:bg-[#E6B500] text-primary-foreground font-medium py-3 rounded-full transition-colors uppercase text-sm tracking-wide"
        >
          SAUVEGARDER
        </button>
      </div>
    </div>
  );
};

export default AProposPage;