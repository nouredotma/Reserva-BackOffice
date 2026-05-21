'use client';

import React, { useState, useEffect } from 'react';
import { GripVertical, Save, Check } from 'lucide-react';

type DisplayField = {
  id: string;
  label: string;
  visible: boolean;
  order: number;
};

const GestionAffichageRDV = () => {
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showColorInRDV, setShowColorInRDV] = useState(true);
  const [fields, setFields] = useState<DisplayField[]>([
    { id: 'hours', label: 'Horaires', visible: true, order: 1 },
    { id: 'clientName', label: 'Nom de l’invité', visible: true, order: 2 },
    { id: 'services', label: 'Offre(s)', visible: true, order: 3 },
    { id: 'notes', label: 'Titre ou note', visible: true, order: 4 },
  ]);

  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('rdvDisplaySettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setShowColorInRDV(parsed.showColorInRDV ?? true);
        setFields(parsed.fields || fields);
      }
    }
  }, []);

  const handleSave = () => {
    const settings = { showColorInRDV, fields };
    if (typeof window !== 'undefined') {
      localStorage.setItem('rdvDisplaySettings', JSON.stringify(settings));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleFieldVisibility = (fieldId: string) => {
    setFields(fields.map(f => 
      f.id === fieldId ? { ...f, visible: !f.visible } : f
    ));
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newFields = [...fields];
    const draggedField = newFields[draggedItem];
    newFields.splice(draggedItem, 1);
    newFields.splice(index, 0, draggedField);
    
    newFields.forEach((field, idx) => {
      field.order = idx + 1;
    });
    
    setFields(newFields);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen p-0">
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-12 rounded-xl w-1/3"></div>
          <div className="bg-gray-200 h-96 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-0 md:p-0 lg:p-0">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>

      {/* Header */}
      <div className="mb-8 animate-slideUp pt-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-2">
              Affichage des réservations
            </h1>
            <p className="text-sm text-gray-500">
              Personnalisez l’ordre et la visibilité des informations dans les réservations
            </p>
          </div>
          
          <button
            onClick={handleSave}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-2  ${
              saved 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                : 'bg-primary text-primary-foreground hover:bg-gray-800'
            }`}
          >
            {saved ? (
              <>
                <Check size={16} />
                Enregistré
              </>
            ) : (
              <>
                <Save size={16} />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 animate-fadeIn">
          
          {/* Left - Configuration */}
          <div className="space-y-6">
            
            {/* Color Setting */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-900">Couleur dans la réservation</h3>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  Afficher la couleur de la ressource en arrière-plan de la réservation
                </p>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-gray-700 text-sm">
                    <input
                      type="radio"
                      name="colorInRDV"
                      value="oui"
                      checked={showColorInRDV}
                      onChange={() => setShowColorInRDV(true)}
                      className="h-4 w-4 accent-primary"
                    />
                    Oui
                  </label>
                  <label className="flex items-center gap-2 text-gray-700 text-sm">
                    <input
                      type="radio"
                      name="colorInRDV"
                      value="non"
                      checked={!showColorInRDV}
                      onChange={() => setShowColorInRDV(false)}
                      className="h-4 w-4 accent-primary"
                    />
                    Non
                  </label>
                </div>
              </div>
            </div>

            {/* Fields Configuration */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  Ordre et visibilité des informations
                </h3>
                <p className="text-xs text-gray-500">
                  Glissez pour réorganiser, activez ou désactivez les champs
                </p>
              </div>
              
              <div className="divide-y divide-gray-100">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`px-6 py-4 flex items-center justify-between group hover:bg-gray-50 transition-colors cursor-move ${draggedItem === index ? 'opacity-40' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-gray-400 group-hover:text-gray-900 transition-colors">
                        <GripVertical size={18} />
                      </div>
                      <span className="text-sm text-gray-900 font-medium">{field.label}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-xs text-gray-500">Afficher</span>
                      <label className="flex items-center gap-2 text-gray-700 text-sm">
                        <input
                          type="radio"
                          name={`${field.id}-visibility`}
                          value="oui"
                          checked={field.visible}
                          onChange={() => toggleFieldVisibility(field.id)}
                          className="h-4 w-4 accent-primary"
                        />
                        Oui
                      </label>
                      <label className="flex items-center gap-2 text-gray-700 text-sm">
                        <input
                          type="radio"
                          name={`${field.id}-visibility`}
                          value="non"
                          checked={!field.visible}
                          onChange={() => toggleFieldVisibility(field.id)}
                          className="h-4 w-4 accent-primary"
                        />
                        Non
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Preview */}
          <div>
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900">Aperçu</h3>
                </div>
                
                <div className="p-6">
                  {/* AppointmentCard Preview - matches agenda style */}
                  <div
                    className={`rounded-lg p-3 border transition-all ${showColorInRDV ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        {fields.filter(f => f.visible).sort((a, b) => a.order - b.order).map(field => {
                          switch (field.id) {
                            case 'clientName':
                              return <p key={field.id} className="font-medium truncate break-words w-full">Nom de l’invité</p>;
                            case 'services':
                              return <p key={field.id} className="text-xs opacity-60 truncate break-words w-full mt-0.5">Offre(s)</p>;
                            case 'notes':
                              return <p key={field.id} className="text-xs opacity-60 truncate break-words w-full mt-0.5">Titre ou note</p>;
                            case 'hours':
                              return (
                                <div key={field.id} className="flex items-center gap-1.5 text-xs opacity-60 mb-1">
                                  {/* Clock icon placeholder */}
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                  <span>10:00 · 30min</span>
                                </div>
                              );
                            default:
                              return null;
                          }
                        })}
                      </div>
                      <button className="p-1 opacity-40 hover:opacity-100 transition-opacity">
                        {/* MoreVertical icon placeholder */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                      </button>
                    </div>
                    {/* Show Praticien if any field is visible */}
                    <div className="mt-2 pt-2 border-t border-current/10 text-xs opacity-60">
                      <div className="flex items-center gap-1">
                        {/* User icon placeholder */}
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M4 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/></svg>
                        <span className="truncate break-words w-full">Praticien</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Champs visibles</span>
                      <span className="text-gray-900 font-medium">
                        {fields.filter(f => f.visible).length} / {fields.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-3">
                      <span className="text-gray-500">Couleur d&apos;arrière-plan</span>
                      <span className="text-gray-900 font-medium">
                        {showColorInRDV ? 'Activée' : 'Désactivée'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default GestionAffichageRDV;
