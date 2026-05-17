'use client';

import React, { useState } from 'react';

const GestionListeAttentePage = () => {
  const [activation, setActivation] = useState('non');

  return (
    <div className="min-h-screen p-0 md:p-0">
      {/* Header */}
      <div className="mb-8 animate-slideDown mt-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-2">
              Activation de la liste d'attente
            </h1>
            <p className="text-sm text-gray-500">
              Souhaitez-vous activer la liste d'attente ?
            </p>
          </div>
          <button className="px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-gray-800 transition-all flex items-center gap-2">
            Enregistrer
          </button>
        </div>
      </div>

      {/* Activation Options */}
      <div className="mb-8">
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2 text-gray-700 text-sm">
            <input
              type="radio"
              name="activation"
              value="oui"
              checked={activation === 'oui'}
              onChange={() => setActivation('oui')}
              className="h-4 w-4 accent-primary"
            />
            Oui
          </label>
          <label className="flex items-center gap-2 text-gray-700 text-sm">
            <input
              type="radio"
              name="activation"
              value="non"
              checked={activation === 'non'}
              onChange={() => setActivation('non')}
              className="h-4 w-4 accent-primary"
            />
            Non
          </label>
        </div>
      </div>
    </div>
  );
};

export default GestionListeAttentePage;
