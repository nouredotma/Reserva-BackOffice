'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

type FieldConfig = {
  name: string;
  label: string;
  display: boolean;
  required: boolean;
  askYearOnly?: boolean;
  askPostalCodeOnly?: boolean;
};

const GestionFicheClients = () => {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [fields, setFields] = useState<FieldConfig[]>([
    {
      name: 'genre',
      label: 'Genre',
      display: true,
      required: false
    },
    {
      name: 'birthDate',
      label: 'Date of birth',
      display: true,
      required: false,
      askYearOnly: false
    },
    {
      name: 'address',
      label: 'Mailing address',
      display: true,
      required: false,
      askPostalCodeOnly: false
    }
  ]);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleDisplay = (index: number) => {
    const newFields = [...fields];
    newFields[index].display = !newFields[index].display;
    setFields(newFields);
  };

  const toggleRequired = (index: number) => {
    const newFields = [...fields];
    newFields[index].required = !newFields[index].required;
    setFields(newFields);
  };

  const toggleYearOnly = (index: number) => {
    const newFields = [...fields];
    if (newFields[index].askYearOnly !== undefined) {
      newFields[index].askYearOnly = !newFields[index].askYearOnly;
    }
    setFields(newFields);
  };

  const togglePostalCodeOnly = (index: number) => {
    const newFields = [...fields];
    if (newFields[index].askPostalCodeOnly !== undefined) {
      newFields[index].askPostalCodeOnly = !newFields[index].askPostalCodeOnly;
    }
    setFields(newFields);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-12 rounded-xl w-1/3"></div>
          <div className="bg-gray-200 h-96 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="min-h-screen p-0 md:p-0">
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
      `}</style>

      {/* Header */}
      <div className="mb-8 animate-slideDown pt-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-5xl font-light text-gray-900 tracking-tight">
                Guest profile settings
              </h1>
              <p className="text-sm text-gray-600">
          You can show additional fields and decide whether each field is required.
        </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-[var(--reserva-ink)] hover:text-white cursor-pointer transition-colors flex items-center gap-2">
              <Save size={16} />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 mb-8">

        <p className="text-sm text-gray-600 font-medium mt-0">
          Note: If fields were made required by the administrator, you cannot change this option.
        </p>
      </div>

      {/* Field Configuration */}
      <div className="space-y-8 animate-fadeIn">

        {/* Genre Field */}
        <div className="p-0">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Genre</h2>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <Label className="text-sm font-medium text-gray-700 w-24">Show:</Label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="genre-display"
                    checked={fields[0].display}
                    onChange={() => {
                      const newFields = [...fields];
                      newFields[0].display = true;
                      setFields(newFields);
                    }}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="genre-display"
                    checked={!fields[0].display}
                    onChange={() => {
                      const newFields = [...fields];
                      newFields[0].display = false;
                      setFields(newFields);
                    }}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>
              </div>

              <div className="flex items-center gap-4 ml-12 pl-8 border-l border-gray-200">
                <Label className="text-sm font-medium text-gray-700 w-32">Required:</Label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="genre-required"
                    checked={fields[0].required}
                    onChange={() => {
                      const newFields = [...fields];
                      newFields[0].required = true;
                      setFields(newFields);
                    }}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="genre-required"
                    checked={!fields[0].required}
                    onChange={() => {
                      const newFields = [...fields];
                      newFields[0].required = false;
                      setFields(newFields);
                    }}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Date of birth Field */}
        <div className="pt-4">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Date of birth</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {/* Afficher + Saisie obligatoire aligned */}
              <div className="flex items-center gap-4">
                <Label className="text-sm font-medium text-gray-700 w-24">Show:</Label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="birth-display"
                    checked={fields[1].display}
                    onChange={() => {
                      const newFields = [...fields];
                      newFields[1].display = true;
                      setFields(newFields);
                    }}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="birth-display"
                    checked={!fields[1].display}
                    onChange={() => {
                      const newFields = [...fields];
                      newFields[1].display = false;
                      setFields(newFields);
                    }}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>

              </div>
              <div className="flex items-center gap-4 ml-12 pl-8 border-l border-gray-200">
                <Label className="text-sm font-medium text-gray-700 w-32">Required:</Label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="birth-required"
                    checked={fields[1].required}
                    onChange={() => {
                      const newFields = [...fields];
                      newFields[1].required = true;
                      setFields(newFields);
                    }}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="birth-required"
                    checked={!fields[1].required}
                    onChange={() => {
                      const newFields = [...fields];
                      newFields[1].required = false;
                      setFields(newFields);
                    }}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-0">
                  <Checkbox
                    checked={fields[1].askYearOnly}
                    onCheckedChange={() => toggleYearOnly(1)}
                    className="size-4 rounded-full accent-primary"
                  />
                  <span className="text-sm text-gray-700">Do not ask for the year</span>
                </div>
          </div>
        </div>

        {/* Mailing address Field */}
        <div className="pt-4">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Mailing address</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {/* Afficher + Saisie obligatoire aligned */}
              <div className="flex items-center gap-4">
                <Label className="text-sm font-medium text-gray-700 w-24">Show:</Label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="address-display"
                    checked={fields[2].display}
                    onChange={() => {
                      const newFields = [...fields];
                      newFields[2].display = true;
                      setFields(newFields);
                    }}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="address-display"
                    checked={!fields[2].display}
                    onChange={() => {
                      const newFields = [...fields];
                      newFields[2].display = false;
                      setFields(newFields);
                    }}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>

              </div>
              <div className="flex items-center gap-4 ml-12 pl-8 border-l border-gray-200">
                <Label className="text-sm font-medium text-gray-700 w-32">Required:</Label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="address-required"
                    checked={fields[2].required}
                    onChange={() => {
                      const newFields = [...fields];
                      newFields[2].required = true;
                      setFields(newFields);
                    }}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="address-required"
                    checked={!fields[2].required}
                    onChange={() => {
                      const newFields = [...fields];
                      newFields[2].required = false;
                      setFields(newFields);
                    }}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-0">
                  <Checkbox
                    checked={fields[2].askPostalCodeOnly}
                    onCheckedChange={() => togglePostalCodeOnly(2)}
                    className="size-4 rounded-full accent-primary"
                  />
                  <span className="text-sm text-gray-700">Demander le code postal uniquement</span>
                </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GestionFicheClients;
