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
              You can show a custom message to guests who book online. This message appears right after the reservation time is selected.
            </p>
          </div>
        </div>
      </div>

      {/* Info Message & Visibility Checkbox (from image) */}
      <div className="mb-8">
        <div className="flex items-center gap-6">
          <span className="font-bold text-gray-700 mr-2 mb-4">VISIBILITY</span>

        </div><label className="flex items-center gap-2 text-gray-700 text-sm">
            <Checkbox className="h-4 w-4" />
            The message is enabled on my WellBe page
          </label>
      </div>
    </div>
  );
};

export default GestionMessages;
