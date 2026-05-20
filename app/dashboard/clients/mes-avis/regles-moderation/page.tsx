'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Shield, Check, AlertTriangle, Star, MessageSquare, Clock, TrendingUp, ToggleLeft, ToggleRight } from 'lucide-react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { sampleModerationRules } from '@/lib/mockData';

interface ModerationRule {
  id: string;
  name: string;
  description: string;
  type: 'keyword' | 'rating' | 'length' | 'auto-approve';
  condition: string;
  action: 'auto-reject' | 'flag' | 'auto-approve';
  isActive: boolean;
  createdDate: Date;
  appliedCount?: number;
}

export default function ReglesModerationPage() {
  const [rules, setRules] = useState<ModerationRule[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<ModerationRule | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'keyword' as 'keyword' | 'rating' | 'length' | 'auto-approve',
    condition: '',
    action: 'flag' as 'auto-reject' | 'flag' | 'auto-approve',
    isActive: true,
  });

  useEffect(() => {
    const storedRules = localStorage.getItem('moderationRules');
    if (storedRules && JSON.parse(storedRules).length > 0) {
      const parsed = JSON.parse(storedRules).map((r: ModerationRule) => ({
        ...r,
        createdDate: new Date(r.createdDate),
      }));
      setRules(parsed);
    } else {
      localStorage.setItem('moderationRules', JSON.stringify(sampleModerationRules));
      setRules(sampleModerationRules);
    }
  }, []);

  const activeRulesCount = rules.filter(r => r.isActive).length;
  const totalApplied = rules.reduce((sum, r) => sum + (r.appliedCount || 0), 0);

  const handleAddRule = () => {
    setEditingRule(null);
    setFormData({
      name: '',
      description: '',
      type: 'keyword',
      condition: '',
      action: 'flag',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEditRule = (rule: ModerationRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      description: rule.description,
      type: rule.type,
      condition: rule.condition,
      action: rule.action,
      isActive: rule.isActive,
    });
    setShowModal(true);
  };

  const toggleRuleStatus = (id: string) => {
    const updatedRules = rules.map(r =>
      r.id === id ? { ...r, isActive: !r.isActive } : r
    );
    setRules(updatedRules);
    localStorage.setItem('moderationRules', JSON.stringify(updatedRules));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.description || !formData.condition) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (editingRule) {
      const updatedRules = rules.map(r =>
        r.id === editingRule.id ? { ...editingRule, ...formData } : r
      );
      setRules(updatedRules);
      localStorage.setItem('moderationRules', JSON.stringify(updatedRules));
    } else {
      const newRule: ModerationRule = {
        id: Date.now().toString(),
        ...formData,
        createdDate: new Date(),
        appliedCount: 0,
      };
      const updatedRules = [...rules, newRule];
      setRules(updatedRules);
      localStorage.setItem('moderationRules', JSON.stringify(updatedRules));
    }
    setShowModal(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'keyword': return <MessageSquare size={16} />;
      case 'rating': return <Star size={16} />;
      case 'length': return <Clock size={16} />;
      case 'auto-approve': return <Check size={16} />;
      default: return <Shield size={16} />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'auto-reject': return 'text-red-600';
      case 'flag': return 'text-amber-600';
      case 'auto-approve': return 'text-emerald-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>

      {/* Header */}
      <div className="mb-8 pt-20 animate-slideUp">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-light text-black tracking-tight mb-2">Modération</h1>
            <p className="text-sm text-gray-400">Gérez les règles de validation des avis clients</p>
          </div>
          <button
            onClick={handleAddRule}
            className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-[#E6B500] transition-colors flex items-center gap-2"
          >
            Nouvelle règle
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8 animate-fadeIn">
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Règles actives</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <Shield className="text-emerald-600" size={16} />
            </div>
          </div>
          <p className="text-3xl font-light text-black">{activeRulesCount}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total règles</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <TrendingUp className="text-blue-600" size={16} />
            </div>
          </div>
          <p className="text-3xl font-light text-black">{rules.length}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Avis traités</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
              <Check className="text-gray-600" size={16} />
            </div>
          </div>
          <p className="text-3xl font-light text-black">{totalApplied}</p>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-3 mb-12 animate-fadeIn">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="bg-white rounded-lg border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      rule.isActive ? 'bg-primary' : 'bg-gray-100'
                    }`}>
                      <span className={rule.isActive ? 'text-white' : 'text-gray-400'}>
                        {getTypeIcon(rule.type)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-black mb-1">{rule.name}</h3>
                      <p className="text-sm text-gray-500">{rule.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-13 mt-4">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-400">Condition:</span>
                      <span className="font-medium text-gray-700">{rule.condition}</span>
                    </div>
                    <div className="h-3 w-px bg-gray-200"></div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-400">Action:</span>
                      <span className={`font-medium ${getActionColor(rule.action)}`}>
                        {rule.action === 'auto-reject' && 'Rejet auto'}
                        {rule.action === 'flag' && 'Signaler'}
                        {rule.action === 'auto-approve' && 'Approuver auto'}
                      </span>
                    </div>
                    {rule.appliedCount !== undefined && (
                      <>
                        <div className="h-3 w-px bg-gray-200"></div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{rule.appliedCount} fois appliquée</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleRuleStatus(rule.id)}
                    className={`p-2 rounded-md transition-all ${
                      rule.isActive
                        ? 'text-foreground hover:bg-gray-100'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={rule.isActive ? 'Désactiver' : 'Activer'}
                  >
                    {rule.isActive ? <ToggleLeft size={18} /> : <ToggleRight size={18} />}
                  </button>
                  <button
                    onClick={() => handleEditRule(rule)}
                    className="px-4 py-2 text-sm font-medium text-foreground hover:text-[#8A6F00] transition-colors"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How it Works */}
      <div className="animate-fadeIn">
        <div className="mb-6">
          <h2 className="text-3xl font-light text-black tracking-tight mb-2">Comment ça fonctionne</h2>
          <p className="text-sm text-gray-400">Le processus de modération expliqué simplement</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-lg border border-gray-100 p-8">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-light mb-6">
              1
            </div>
            <h3 className="text-lg font-medium text-black mb-3">Le client note</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Après sa prestation, le client reçoit un email pour évaluer son expérience sur 4 critères distincts.
            </p>
            <div className="space-y-2">
              {['Accueil', 'Propreté', 'Cadre', 'Prestation'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-lg border border-gray-100 p-8">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-light mb-6">
              2
            </div>
            <h3 className="text-lg font-medium text-black mb-3">Analyse automatique</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Les règles de modération analysent l'avis en temps réel selon vos critères configurés.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                <span className="text-sm text-gray-700">Validation immédiate si conforme</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                <span className="text-sm text-gray-700">Signalement si critère détecté</span>
              </div>
              <div className="flex items-start gap-2">
                <X className="text-red-600 shrink-0 mt-0.5" size={16} />
                <span className="text-sm text-gray-700">Rejet si non-conforme</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-lg border border-gray-100 p-8">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-light mb-6">
              3
            </div>
            <h3 className="text-lg font-medium text-black mb-3">Vous décidez</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Vous avez 7 jours pour valider, répondre ou refuser les avis signalés. Après ce délai, traitement automatique.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 leading-relaxed">
                Les avis validés apparaissent sur votre page publique et impactent votre note moyenne.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-black">
                  {editingRule ? 'Modifier la règle' : 'Nouvelle règle'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="px-8 py-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nom de la règle
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-full bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Ex: Langage inapproprié"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                      placeholder="Décrivez le fonctionnement..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                    <Select value={formData.type} onValueChange={v => setFormData({ ...formData, type: v as any })}>
                      <SelectTrigger id="type" className="rounded-full px-4 py-3 mt-2">
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="keyword">Mots-clés</SelectItem>
                        <SelectItem value="rating">Note</SelectItem>
                        <SelectItem value="length">Longueur</SelectItem>
                        <SelectItem value="auto-approve">Auto-approbation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="action" className="block text-sm font-medium text-gray-700">Action</label>
                    <Select value={formData.action} onValueChange={v => setFormData({ ...formData, action: v as any })}>
                      <SelectTrigger id="action" className="rounded-full px-4 py-3 mt-2">
                        <SelectValue placeholder="Sélectionner l'action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto-reject">Rejet automatique</SelectItem>
                        <SelectItem value="flag">Signalement</SelectItem>
                        <SelectItem value="auto-approve">Approbation auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                    Condition
                  </label>
                  <input
                    id="condition"
                    type="text"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-4 py-3 rounded-full bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Ex: nul, horrible, arnaque"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isActive: true })}
                    className={`flex-1 px-4 py-3 rounded-full text-sm font-medium transition-all ${
                      formData.isActive
                       ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isActive: false })}
                    className={`flex-1 px-4 py-3 rounded-full text-sm font-medium transition-all ${
                      !formData.isActive
                         ? 'bg-red-50 text-red-700' 
                              : 'bg-gray-50 text-gray-600'
                    }`}
                  >
                    Inactive
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 text-sm font-medium text-foreground hover:text-[#8A6F00] transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-[#E6B500] transition-colors"
                >
                  {editingRule ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}