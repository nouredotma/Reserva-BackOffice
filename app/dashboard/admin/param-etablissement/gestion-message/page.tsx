'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

const GestionMessages = () => {
  return (
    <div className="min-h-screen p-0 md:p-0">
      {/* Header */}
      <div className="mb-8 animate-slideDown mt-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-2">
              Gestion Message
            </h1>
            <p className="text-sm text-gray-500">
              Vous pouvez afficher un message personnalisé à vos clients qui prennent rendez-vous en ligne. Ce message apparait juste après le choix de l&apos;horaire du rendez-vous.
            </p>
          </div>
        </div>
      </div>

      {/* Info Message & Visibility Checkbox (from image) */}
      <div className="mb-8">
        <div className="flex items-center gap-6">
          <span className="font-bold text-gray-700 mr-2 mb-4">VISIBILITÉ</span>
          
        </div><label className="flex items-center gap-2 text-gray-700 text-sm">
            <Checkbox className="h-4 w-4" />
            Le message est activé sur ma page WellBe
          </label>
      </div>
    </div>
  );
};

export default GestionMessages;