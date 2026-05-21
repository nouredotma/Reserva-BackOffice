'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Copy, Eye, EyeOff, ChevronDown, X, Check, Clock, Palette, List, Settings, ArrowUpDown, Filter } from 'lucide-react';
import { Sketch } from '@uiw/react-color';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { defaultAgendas } from '@/lib/mockData';

type Service = {
  id: number;
  name: string;
  abbreviation: string;
  description: string;
  color: string;
  price: number;
  priceType: 'fixed' | 'from' | 'range';
  priceFrom?: number;
  priceTo?: number;
  onQuote: boolean;
  duration: number;
  category: string;
  visibility: 'bookable' | 'visible' | 'hidden';
  competences: string[];
  multipleProviders: boolean;
};

const GestionPrestations = () => {
  const [mounted, setMounted] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [draggedService, setDraggedService] = useState<Service | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);
  const [collaborators, setCollaborators] = useState<string[]>([]);

  // Load data from localStorage
  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      const storedServices = localStorage.getItem('services');
      const storedCategories = localStorage.getItem('serviceCategories');
      const storedAgendas = localStorage.getItem('employeeAgendas');
      
      if (storedAgendas) {
        try {
          const agendas = JSON.parse(storedAgendas);
          setCollaborators(agendas.map((a: any) => a.name));
        } catch {
          setCollaborators(defaultAgendas.map(a => a.name));
        }
      } else {
        setCollaborators(defaultAgendas.map(a => a.name));
      }
      
      if (storedServices) {
        setServices(JSON.parse(storedServices));
      } else {
        // Default services - Realistic beauty/wellness services
        const defaultServices: Service[] = [
          // COIFFURE FEMME
          {
            id: 1,
            name: 'Coupe Femme + Brushing',
            abbreviation: 'Coupe F',
            description: 'Coupe personnalisée selon votre style et brushing professionnel pour une finition parfaite.',
            color: '#EC4899',
            price: 150,
            priceType: 'fixed',
            onQuote: false,
            duration: 60,
            category: 'COIFFURE FEMME',
            visibility: 'bookable',
            competences: ['Yassine El Fassi', 'Samira Bouzid'],
            multipleProviders: true
          },
          {
            id: 2,
            name: 'Coloration Complète',
            abbreviation: 'Coloration',
            description: 'Coloration permanente de toute la chevelure avec produits professionnels de qualité.',
            color: '#EC4899',
            price: 350,
            priceType: 'from',
            priceFrom: 350,
            onQuote: false,
            duration: 120,
            category: 'COIFFURE FEMME',
            visibility: 'bookable',
            competences: ['Samira Bouzid'],
            multipleProviders: false
          },
          {
            id: 3,
            name: 'Mèches Balayage',
            abbreviation: 'Balayage',
            description: 'Technique de mèches naturelles pour un effet soleil et lumineux.',
            color: '#EC4899',
            price: 450,
            priceType: 'from',
            priceFrom: 450,
            onQuote: false,
            duration: 150,
            category: 'COIFFURE FEMME',
            visibility: 'bookable',
            competences: ['Samira Bouzid', 'Yassine El Fassi'],
            multipleProviders: true
          },
          {
            id: 4,
            name: 'Lissage Brésilien',
            abbreviation: 'Lissage',
            description: 'Traitement de lissage longue durée pour des cheveux lisses et brillants.',
            color: '#EC4899',
            price: 800,
            priceType: 'from',
            priceFrom: 800,
            onQuote: true,
            duration: 180,
            category: 'COIFFURE FEMME',
            visibility: 'bookable',
            competences: ['Samira Bouzid'],
            multipleProviders: false
          },
          // COIFFURE HOMME
          {
            id: 5,
            name: 'Coupe Homme Classique',
            abbreviation: 'Coupe H',
            description: 'Coupe masculine classique avec finitions aux ciseaux ou tondeuse.',
            color: '#3B82F6',
            price: 80,
            priceType: 'fixed',
            onQuote: false,
            duration: 30,
            category: 'COIFFURE HOMME',
            visibility: 'bookable',
            competences: ['Yassine El Fassi', 'Khalid Ait Lahcen'],
            multipleProviders: true
          },
          {
            id: 6,
            name: 'Coupe + Barbe',
            abbreviation: 'Coupe Barbe',
            description: 'Coupe complète avec taille et entretien de la barbe.',
            color: '#3B82F6',
            price: 120,
            priceType: 'fixed',
            onQuote: false,
            duration: 45,
            category: 'COIFFURE HOMME',
            visibility: 'bookable',
            competences: ['Khalid Ait Lahcen'],
            multipleProviders: false
          },
          {
            id: 7,
            name: 'Rasage Traditionnel',
            abbreviation: 'Rasage',
            description: 'Rasage à l\'ancienne au coupe-chou avec serviettes chaudes.',
            color: '#3B82F6',
            price: 100,
            priceType: 'fixed',
            onQuote: false,
            duration: 40,
            category: 'COIFFURE HOMME',
            visibility: 'bookable',
            competences: ['Khalid Ait Lahcen'],
            multipleProviders: false
          },
          // SOINS DU VISAGE
          {
            id: 8,
            name: 'Soin du Visage Complet',
            abbreviation: 'Soin Visage',
            description: 'Nettoyage, gommage, masque et hydratation en profondeur pour un visage rayonnant.',
            color: '#10B981',
            price: 250,
            priceType: 'fixed',
            onQuote: false,
            duration: 60,
            category: 'SOINS DU VISAGE',
            visibility: 'bookable',
            competences: ['Nadia El Khatib'],
            multipleProviders: false
          },
          {
            id: 9,
            name: 'Soin Anti-Âge',
            abbreviation: 'Anti-Âge',
            description: 'Soin spécialisé pour réduire les rides et raffermir la peau.',
            color: '#10B981',
            price: 350,
            priceType: 'fixed',
            onQuote: false,
            duration: 75,
            category: 'SOINS DU VISAGE',
            visibility: 'bookable',
            competences: ['Nadia El Khatib'],
            multipleProviders: false
          },
          {
            id: 10,
            name: 'Nettoyage de Peau Profond',
            abbreviation: 'Nettoyage',
            description: 'Extraction des impuretés et nettoyage en profondeur des pores.',
            color: '#10B981',
            price: 200,
            priceType: 'fixed',
            onQuote: false,
            duration: 45,
            category: 'SOINS DU VISAGE',
            visibility: 'bookable',
            competences: ['Nadia El Khatib'],
            multipleProviders: false
          },
          // MANUCURE & PÉDICURE
          {
            id: 11,
            name: 'Manucure Classique',
            abbreviation: 'Manucure',
            description: 'Soin complet des mains avec pose de vernis classique.',
            color: '#F59E0B',
            price: 80,
            priceType: 'fixed',
            onQuote: false,
            duration: 45,
            category: 'MANUCURE & PÉDICURE',
            visibility: 'bookable',
            competences: ['Nadia El Khatib'],
            multipleProviders: false
          },
          {
            id: 12,
            name: 'Pose Vernis Semi-Permanent',
            abbreviation: 'Semi-Permanent',
            description: 'Manucure avec pose de vernis semi-permanent longue tenue (3 semaines).',
            color: '#F59E0B',
            price: 150,
            priceType: 'fixed',
            onQuote: false,
            duration: 60,
            category: 'MANUCURE & PÉDICURE',
            visibility: 'bookable',
            competences: ['Nadia El Khatib'],
            multipleProviders: false
          },
          {
            id: 13,
            name: 'Pédicure Spa',
            abbreviation: 'Pédicure',
            description: 'Soin complet des pieds avec bain relaxant, gommage et massage.',
            color: '#F59E0B',
            price: 120,
            priceType: 'fixed',
            onQuote: false,
            duration: 60,
            category: 'MANUCURE & PÉDICURE',
            visibility: 'bookable',
            competences: ['Nadia El Khatib'],
            multipleProviders: false
          },
          // MASSAGE & BIEN-ÊTRE
          {
            id: 14,
            name: 'Massage Relaxant Corps Complet',
            abbreviation: 'Massage Relax',
            description: 'Massage aux huiles essentielles pour une détente totale du corps.',
            color: '#8B5CF6',
            price: 300,
            priceType: 'fixed',
            onQuote: false,
            duration: 60,
            category: 'MASSAGE & BIEN-ÊTRE',
            visibility: 'bookable',
            competences: ['Nadia El Khatib'],
            multipleProviders: false
          },
          {
            id: 15,
            name: 'Massage Dos et Épaules',
            abbreviation: 'Massage Dos',
            description: 'Massage ciblé pour soulager les tensions du dos et des épaules.',
            color: '#8B5CF6',
            price: 180,
            priceType: 'fixed',
            onQuote: false,
            duration: 30,
            category: 'MASSAGE & BIEN-ÊTRE',
            visibility: 'bookable',
            competences: ['Nadia El Khatib'],
            multipleProviders: false
          },
          {
            id: 16,
            name: 'Hammam + Gommage',
            abbreviation: 'Hammam',
            description: 'Séance de hammam traditionnel avec gommage au savon noir.',
            color: '#8B5CF6',
            price: 250,
            priceType: 'fixed',
            onQuote: false,
            duration: 90,
            category: 'MASSAGE & BIEN-ÊTRE',
            visibility: 'bookable',
            competences: ['Nadia El Khatib'],
            multipleProviders: false
          },
          // ÉPILATION
          {
            id: 17,
            name: 'Épilation Sourcils',
            abbreviation: 'Sourcils',
            description: 'Épilation et restructuration des sourcils.',
            color: '#EF4444',
            price: 50,
            priceType: 'fixed',
            onQuote: false,
            duration: 15,
            category: 'ÉPILATION',
            visibility: 'bookable',
            competences: ['Nadia El Khatib'],
            multipleProviders: false
          },
          {
            id: 18,
            name: 'Épilation Jambes Complètes',
            abbreviation: 'Jambes',
            description: 'Épilation complète des jambes à la cire.',
            color: '#EF4444',
            price: 150,
            priceType: 'fixed',
            onQuote: false,
            duration: 45,
            category: 'ÉPILATION',
            visibility: 'bookable',
            competences: ['Nadia El Khatib'],
            multipleProviders: false
          },
          {
            id: 19,
            name: 'Épilation Maillot Brésilien',
            abbreviation: 'Maillot',
            description: 'Épilation intégrale du maillot.',
            color: '#EF4444',
            price: 120,
            priceType: 'fixed',
            onQuote: false,
            duration: 30,
            category: 'ÉPILATION',
            visibility: 'bookable',
            competences: ['Nadia El Khatib'],
            multipleProviders: false
          }
        ];
        setServices(defaultServices);
        localStorage.setItem('services', JSON.stringify(defaultServices));
      }
      
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        const defaultCategories = [
          'COIFFURE FEMME',
          'COIFFURE HOMME',
          'SOINS DU VISAGE',
          'MANUCURE & PÉDICURE',
          'MASSAGE & BIEN-ÊTRE',
          'ÉPILATION'
        ];
        setCategories(defaultCategories);
        localStorage.setItem('serviceCategories', JSON.stringify(defaultCategories));
      }
    }
  }, []);

  // Save services to localStorage
  useEffect(() => {
    if (mounted && services.length > 0) {
      localStorage.setItem('services', JSON.stringify(services));
    }
  }, [services, mounted]);

  // Save categories to localStorage
  useEffect(() => {
    if (mounted && categories.length > 0) {
      localStorage.setItem('serviceCategories', JSON.stringify(categories));
    }
  }, [categories, mounted]);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setCategories([...categories, newCategoryName.trim()]);
      setNewCategoryName('');
      setShowCategoryModal(false);
    }
  };

  const handleDeleteCategory = (category: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category}" ?`)) {
      setCategories(categories.filter(c => c !== category));
      setServices(services.filter(s => s.category !== category));
    }
  };

  const handleDeleteService = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette prestation ?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleDuplicateService = (service: Service) => {
    setServices(prevServices => {
      const newService = {
        ...service,
        id: Date.now(),
        name: `${service.name} (Copie)`
      };
      return [...prevServices, newService];
    });
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, service: Service) => {
    setDraggedService(service);
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, category: string) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    setDragOverCategory(category);
  };

  const handleDragLeave = () => {
    setDragOverCategory(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetCategory: string) => {
    e.preventDefault();
    setDragOverCategory(null);
    if (draggedService && draggedService.category !== targetCategory) {
      setServices(services.map(s => 
        s.id === draggedService.id 
          ? { ...s, category: targetCategory }
          : s
      ));
      setDraggedService(null);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedServices = categories.reduce((acc, category) => {
    acc[category] = filteredServices.filter(s => s.category === category);
    return acc;
  }, {} as Record<string, Service[]>);

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
              Gestion des Prestations
            </h1>
            <p className="text-sm text-gray-500">
              Gérez vos services, catégories et tarifs
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="px-4 py-2 text-sm font-medium bg-white text-gray-600 hover:text-gray-900 border border-gray-200 rounded-full hover:border-gray-300 transition-colors"
            >
              <Plus size={16} className="inline-block mr-2 -mt-0.5" />
              Catégorie
            </button>
            <button
              onClick={() => {
                setEditingService(null);
                setShowModal(true);
              }}
              className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm"
            >
              <Plus size={16} className="inline-block mr-2 -mt-0.5" />
              Nouvelle Prestation
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une prestation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white pl-12 pr-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={filterCategory} onValueChange={v => setFilterCategory(v)}>
                <SelectTrigger className="px-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm bg-white w-[220px]">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Services by Category */}
      <div className="space-y-8 animate-fadeIn">
        {categories.map(category => {
          const categoryServices = groupedServices[category] || [];
          if (categoryServices.length === 0 && filterCategory !== 'all') return null;

          // Remove drop highlight completely
          const showDropHighlight = false;

          return (
            <div 
              key={category} 
              className={`space-y-4 transition-all`}
              onDragOver={(e) => handleDragOver(e, category)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, category)}
            >
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                    {categoryServices.length} {categoryServices.length === 1 ? 'prestation' : 'prestations'}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="text-sm text-red-600 hover:text-red-700 opacity-0 hover:opacity-100 transition-opacity"
                >
                  Supprimer la catégorie
                </button>
              </div>

              {/* Services */}
              {viewMode === 'list' && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  {categoryServices.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      Aucune prestation dans cette catégorie
                    </div>
                  ) : (
                    categoryServices.map((service, idx) => (
                      <ServiceRow
                        key={service.id}
                        service={service}
                        isLast={idx === categoryServices.length - 1}
                        onEdit={() => {
                          setEditingService(service);
                          setShowModal(true);
                        }}
                        onDelete={() => handleDeleteService(service.id)}
                        onDuplicate={() => handleDuplicateService(service)}
                        onDragStart={handleDragStart}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredServices.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-gray-400 mb-4">Aucune prestation trouvée</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('all');
              }}
              className="text-sm text-foreground hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Service Modal */}
      {showModal && (
        <ServiceModal
          service={editingService}
          categories={categories}
          onClose={() => {
            setShowModal(false);
            setEditingService(null);
          }}
          onSave={(service) => {
            if (editingService) {
              setServices(services.map(s => s.id === service.id ? service : s));
            } else {
              setServices([...services, { ...service, id: Date.now() }]);
            }
            setShowModal(false);
            setEditingService(null);
          }}
        />
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Nouvelle catégorie</h3>
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nom de la catégorie"
                className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddCategory}
                  className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Service Row Component
const ServiceRow = ({ service, isLast, onEdit, onDelete, onDuplicate, onDragStart }: {
  service: Service;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, service: Service) => void;
}) => {
  const getVisibilityIcon = () => {
    if (service.visibility === 'bookable') return <Eye size={14} className="text-emerald-600" />;
    if (service.visibility === 'visible') return <EyeOff size={14} className="text-amber-600" />;
    return <EyeOff size={14} className="text-gray-400" />;
  };

  const getVisibilityText = () => {
    if (service.visibility === 'bookable') return 'Réservable';
    if (service.visibility === 'visible') return 'Visible';
    return 'Masqué';
  };

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, service)}
      className={`p-4 hover:bg-gray-50 transition-colors group cursor-move ${!isLast ? 'border-b border-gray-100' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }}></div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-medium text-gray-900">{service.name}</h3>
            {service.abbreviation && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                {service.abbreviation}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {service.duration} min
            </span>
            <span className="flex items-center gap-1 font-medium text-gray-900">
              {service.priceType === 'fixed' && `${service.price} MAD`}
              {service.priceType === 'from' && `À partir de ${service.priceFrom} MAD`}
              {service.priceType === 'range' && `${service.priceFrom}-${service.priceTo} MAD`}
              {service.onQuote && ' (Sur devis)'}
            </span>
            <span className="flex items-center gap-1">
              {getVisibilityIcon()}
              {getVisibilityText()}
            </span>
            {service.competences && service.competences.length > 0 && (
              <span className="text-gray-400 truncate">
                {service.competences.join(', ')}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onDuplicate}
            className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
            title="Dupliquer"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Modifier"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ service, onEdit, onDelete, onDuplicate }: {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: service.color }}></div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onDuplicate}
            className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{service.name}</h3>
      <p className="text-xs text-gray-500 mb-4 line-clamp-2">{service.description}</p>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Durée</span>
          <span className="font-medium text-gray-900">{service.duration} min</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Prix</span>
          <span className="font-medium text-gray-900">
            {service.priceType === 'fixed' && `${service.price} MAD`}
            {service.priceType === 'from' && `À partir de ${service.priceFrom} MAD`}
            {service.priceType === 'range' && `${service.priceFrom}-${service.priceTo} MAD`}
            {service.onQuote && ' (Sur devis)'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Visibilité</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
            service.visibility === 'bookable' ? 'bg-emerald-50 text-emerald-700' :
            service.visibility === 'visible' ? 'bg-amber-50 text-amber-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            {service.visibility === 'bookable' ? 'Réservable' : service.visibility === 'visible' ? 'Visible' : 'Masqué'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Service Modal Component
const ServiceModal = ({ service, categories, onClose, onSave }: {
  service: Service | null;
  categories: string[];
  onClose: () => void;
  onSave: (service: Service) => void;
}) => {
  const [formData, setFormData] = useState<Service>(
    service || {
      id: 0,
      name: '',
      abbreviation: '',
      description: '',
      color: '#3B82F6',
      price: 0,
      priceType: 'fixed',
      onQuote: false,
      duration: 60,
      category: categories[0] || '',
      visibility: 'bookable',
      competences: [],
      multipleProviders: false
    }
  );

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleSubmit = () => {
    if (!formData.name || !formData.category) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <style>{`
        input[type=number].no-arrows {
          appearance: textfield;
        }
        input[type=number].no-arrows::-webkit-inner-spin-button,
        input[type=number].no-arrows::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number].no-arrows {
          -moz-appearance: textfield;
        }
      `}</style>
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-light text-gray-900">
              {service ? 'Modifier une prestation' : 'Nouvelle prestation'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="px-8 py-6 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Informations de base
              </h3>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-foreground hover:underline flex items-center gap-1"
              >
                {showAdvanced ? 'Masquer' : 'Afficher plus d\'options'}
                <ChevronDown size={14} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Ex: Vernis semi-permanent renforcé | Ongles courts"
                />
              </div>

              {showAdvanced && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Abréviation
                  </label>
                  <input
                    type="text"
                    value={formData.abbreviation}
                    onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Ex: VSP Court"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                  placeholder="Décrivez la prestation..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded-full hover:border-gray-300 transition-colors"
                  >
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm" 
                      style={{ backgroundColor: formData.color }}
                    />
                    <span className="text-sm text-gray-700 font-mono">{formData.color}</span>
                  </button>
                  
                  {showColorPicker && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowColorPicker(false)}
                      />
                      <div className="absolute top-full mt-2 z-20 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
                        <Sketch
                          color={formData.color}
                          onChange={(color) => {
                            setFormData({ ...formData, color: color.hex });
                          }}
                          style={{ boxShadow: 'none' }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Tarification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de prix
                </label>
                {/* Use Select dropdown for priceType */}
                <Select value={formData.priceType} onValueChange={v => setFormData({ ...formData, priceType: v as 'fixed' | 'from' | 'range' })}>
                  <SelectTrigger className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm mt-2">
                    <SelectValue placeholder="Sélectionner le type de prix" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Prix fixe</SelectItem>
                    <SelectItem value="from">À partir de</SelectItem>
                    <SelectItem value="range">Fourchette</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.priceType === 'fixed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix (MAD)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                      onClick={() => setFormData({ ...formData, price: Math.max(0, Number(formData.price) - 10) })}
                      aria-label="Diminuer le prix"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm text-center no-arrows"
                      required
                      placeholder="Prix en MAD"
                      min={0}
                    />
                    <button
                      type="button"
                      className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                      onClick={() => setFormData({ ...formData, price: Number(formData.price) + 10 })}
                      aria-label="Augmenter le prix"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {formData.priceType === 'from' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix minimum (MAD)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                      onClick={() => setFormData({ ...formData, priceFrom: Math.max(0, Number(formData.priceFrom || 0) - 10) })}
                      aria-label="Diminuer le prix minimum"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={formData.priceFrom || ''}
                      onChange={e => setFormData({ ...formData, priceFrom: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm text-center no-arrows"
                      required
                      placeholder="Prix minimum en MAD"
                      min={0}
                    />
                    <button
                      type="button"
                      className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                      onClick={() => setFormData({ ...formData, priceFrom: Number(formData.priceFrom || 0) + 10 })}
                      aria-label="Augmenter le prix minimum"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {formData.priceType === 'range' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix minimum (MAD)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                        onClick={() => setFormData({ ...formData, priceFrom: Math.max(0, Number(formData.priceFrom || 0) - 10) })}
                        aria-label="Diminuer le prix minimum"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={formData.priceFrom || ''}
                        onChange={e => setFormData({ ...formData, priceFrom: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm text-center no-arrows"
                        required
                        placeholder="Prix minimum en MAD"
                        min={0}
                      />
                      <button
                        type="button"
                        className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                        onClick={() => setFormData({ ...formData, priceFrom: Number(formData.priceFrom || 0) + 10 })}
                        aria-label="Augmenter le prix minimum"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix maximum (MAD)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                        onClick={() => setFormData({ ...formData, priceTo: Math.max(0, Number(formData.priceTo || 0) - 10) })}
                        aria-label="Diminuer le prix maximum"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={formData.priceTo || ''}
                        onChange={e => setFormData({ ...formData, priceTo: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm text-center no-arrows"
                        required
                        placeholder="Prix maximum en MAD"
                        min={0}
                      />
                      <button
                        type="button"
                        className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                        onClick={() => setFormData({ ...formData, priceTo: Number(formData.priceTo || 0) + 10 })}
                        aria-label="Augmenter le prix maximum"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée (min)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                    onClick={() => setFormData({ ...formData, duration: Math.max(0, Number(formData.duration) - 5) })}
                    aria-label="Diminuer la durée"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm text-center no-arrows"
                    required
                    placeholder="Durée en minutes"
                    min={0}
                  />
                  <button
                    type="button"
                    className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                    onClick={() => setFormData({ ...formData, duration: Number(formData.duration) + 5 })}
                    aria-label="Augmenter la durée"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="onQuote"
                checked={formData.onQuote}
                onCheckedChange={(checked) => setFormData({ ...formData, onQuote: !!checked })}
                className="w-4 h-4 rounded-full text-foreground border-gray-300 focus:ring-gray-900"
              />
              <label htmlFor="onQuote" className="text-sm text-gray-700">
                Sur devis
              </label>
            </div>
          </div>

          {/* Category & Visibility */}
          <div className="space-y-4">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Organisation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                {/* Use Select dropdown for category */}
                <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                  <SelectTrigger className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm mt-2">
                    <SelectValue placeholder="Sélectionner la catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibilité
                </label>
                {/* Use Select dropdown for visibility */}
                <Select value={formData.visibility} onValueChange={v => setFormData({ ...formData, visibility: v as 'bookable' | 'visible' | 'hidden' })}>
                  <SelectTrigger className="w-full px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm mt-2">
                    <SelectValue placeholder="Sélectionner la visibilité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bookable">Prestation réservable</SelectItem>
                    <SelectItem value="visible">Affichée mais non réservable</SelectItem>
                    <SelectItem value="hidden">Masquée sur le portail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Collaborateurs */}
          {showAdvanced && (
            <div className="space-y-4">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Collaborateurs
              </h3>
              <p className="text-xs text-gray-500">
                Sélectionnez les collaborateurs qui peuvent effectuer cette prestation
              </p>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {collaborators.map(employee => (
                    <button
                      key={employee}
                      type="button"
                      onClick={() => {
                        const hasEmployee = formData.competences.includes(employee);
                        setFormData({
                          ...formData,
                          competences: hasEmployee
                            ? formData.competences.filter(c => c !== employee)
                            : [...formData.competences, employee]
                        });
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.competences.includes(employee)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {employee}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="multipleProviders"
                    checked={formData.multipleProviders}
                    onCheckedChange={(checked) => setFormData({ ...formData, multipleProviders: !!checked })}
                    className="w-4 h-4 rounded-full text-foreground border-gray-300 focus:ring-gray-900"
                  />
                  <label htmlFor="multipleProviders" className="text-sm text-gray-700">
                    Plusieurs collaborateurs peuvent effectuer cette prestation simultanément
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-4 rounded-b-2xl flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            {service ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GestionPrestations;