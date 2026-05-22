'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Plus, X, Check, Trash2 } from 'lucide-react';

type PaymentMethod = {
  id: string;
  type: 'moroccan_transfer' | 'card';
  last4: string;
  name: string;
  createdDate: string;
  isDefault: boolean;
};

export default function PaymentMethodsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'moroccan_transfer',
      last4: '03',
      name: 'MA****03',
      createdDate: '15/11/2024',
      isDefault: true
    }
  ]);

  const [newPaymentType, setNewPaymentType] = useState<'moroccan_transfer' | 'card'>('moroccan_transfer');
  const [iban, setIban] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCardBack, setShowCardBack] = useState(false);

  const formatIBAN = (value: string) => {
    const cleaned = value.replace(/\s/g, '').toUpperCase();
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleAddPaymentMethod = async () => {
    setError('');
    setLoading(true);

    // Validation
    if (newPaymentType === 'moroccan_transfer') {
      if (!iban || iban.replace(/\s/g, '').length < 15) {
        setError('Veuillez entrer un IBAN marocain valide');
        setLoading(false);
        return;
      }
    } else {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
        setError('Please enter a valid card number');
        setLoading(false);
        return;
      }
      if (!cardName) {
        setError('Veuillez entrer le nom du titulaire');
        setLoading(false);
        return;
      }
      if (!cardExpiry || cardExpiry.length !== 5) {
        setError('Veuillez entrer une date d\'expiration valide');
        setLoading(false);
        return;
      }
      if (!cardCvc || cardCvc.length < 3) {
        setError('Veuillez entrer un CVV valide');
        setLoading(false);
        return;
      }
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: newPaymentType,
      last4: newPaymentType === 'moroccan_transfer'
        ? iban.replace(/\s/g, '').slice(-2)
        : cardNumber.replace(/\s/g, '').slice(-4),
      name: newPaymentType === 'moroccan_transfer'
        ? `MA****${iban.replace(/\s/g, '').slice(-2)}`
        : `**** ${cardNumber.replace(/\s/g, '').slice(-4)}`,
      createdDate: new Date().toLocaleDateString('en-US'),
      isDefault: paymentMethods.length === 0
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddForm(false);
    setIban('');
    setCardNumber('');
    setCardName('');
    setCardExpiry('');
    setCardCvc('');
    setNewPaymentType('moroccan_transfer');
    setLoading(false);
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  const handleDelete = (id: string) => {
    if (paymentMethods.find(m => m.id === id)?.isDefault && paymentMethods.length > 1) {
      // Set another method as default
      const newMethods = paymentMethods.filter(m => m.id !== id);
      newMethods[0].isDefault = true;
      setPaymentMethods(newMethods);
    } else {
      setPaymentMethods(paymentMethods.filter(m => m.id !== id));
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setIban('');
    setCardNumber('');
    setCardName('');
    setCardExpiry('');
    setCardCvc('');
    setNewPaymentType('moroccan_transfer');
    setError('');
  };


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
        @keyframes flipToBack {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(180deg); }
        }
        @keyframes flipToFront {
          from { transform: rotateY(180deg); }
          to { transform: rotateY(0deg); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .card-flip-enter { animation: flipToBack 0.6s ease-in-out; }
        .card-flip-exit { animation: flipToFront 0.6s ease-in-out; }
        .card-3d {
          perspective: 1000px;
        }
        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .card-inner.flipped {
          transform: rotateY(180deg);
        }
        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .card-back {
          transform: rotateY(180deg);
        }
      `}</style>

      {/* Header - Ultra Minimalist Premium */}
      <div className="mb-8 animate-slideUp pt-20">
        <div className="flex items-center justify-between">
          {/* Left: Title */}
          <div>
            <h1 className="text-5xl font-light text-gray-900 tracking-tight mb-2">
              Payment methods
            </h1>
            <p className="text-sm text-gray-400">
              Manage your bank details for debits
            </p>
          </div>

          {/* Right: Add Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-[var(--reserva-ink)] hover:text-white cursor-pointer transition-colors flex items-center gap-2"
            >
              Add
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Warning Banner */}
      {!showAddForm && (
        <div className="mb-6 bg-amber-50 border border-amber-200/50 rounded-xl p-4 flex gap-3 animate-fadeIn">
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-amber-800 leading-relaxed">
            New payment methods will be used for future debits. Scheduled debits will use the previous method unless it fails.
          </p>
        </div>
      )}

      {/* Add Payment Form - Inline */}
      {showAddForm ? (
        <div className="animate-fadeIn space-y-8 mb-8">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-light text-gray-900">New payment method</h2>
            <button
              onClick={handleCancelAdd}
              className="p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setNewPaymentType('moroccan_transfer')}
                className={`px-6 py-3 text-sm font-medium transition-all relative ${
                  newPaymentType === 'moroccan_transfer'
                    ? 'text-foreground'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Transfer Moroccan
                {newPaymentType === 'moroccan_transfer' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                )}
              </button>
              <button
                onClick={() => setNewPaymentType('card')}
                className={`px-6 py-3 text-sm font-medium transition-all relative ${
                  newPaymentType === 'card'
                    ? 'text-foreground'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Card bancaire
                {newPaymentType === 'card' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                )}
              </button>
            </div>
          </div>

          {/* Moroccan Transfer Form */}
          {newPaymentType === 'moroccan_transfer' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="text-sm text-gray-600">
                  Moroccan bank debit via IBAN
                </p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                  Moroccan bank details
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IBAN Moroccan
                  </label>
                  <input
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(formatIBAN(e.target.value))}
                    placeholder="MA76 XXXX XXXX XXXX XXXX XXXX XXX"
                    maxLength={34}
                    className="w-full px-6 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    Your IBAN usually starts with MA for Morocco
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Card Form - Side by Side Layout */}
          {newPaymentType === 'card' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <img src="/Images/card/card.png" alt="Visa" className="h-4 w-auto" />
                                    <span>Card payment</span>

                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Form Fields */}
                <div className="order-2 lg:order-1">
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                    Informations de la carte
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value.replace(/\D/g, '')))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-6 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name du titulaire
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        placeholder="FATIMA ZAHRA EL AMRANI"
                        className="w-full px-6 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date d&apos;expiration
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          placeholder="MM/AA"
                          maxLength={5}
                          className="w-full px-6 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Code CVV
                        </label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                          onFocus={() => setShowCardBack(true)}
                          onBlur={() => setShowCardBack(false)}
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-6 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 flex items-start gap-2">
                      <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                      Your information is secure and encrypted
                    </p>
                  </div>
                </div>

                {/* Right: Interactive Card Preview */}
                <div className="order-1 lg:order-2">
                  <div className="card-3d w-full aspect-[1.586/1] max-w-md mx-auto lg:sticky lg:top-8">
                    <div className={`card-inner ${showCardBack ? 'flipped' : ''}`}>
                      {/* Front of Card */}
                      <div className="card-face rounded-2xl  overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-300 rounded-full blur-3xl"></div>
                        </div>

                        {/* Card Content */}
                        <div className="relative h-full p-6 flex flex-col justify-between">
                          {/* Top: Chip and Logo */}
                          <div className="flex items-start justify-between">
                            {/* EMV Chip */}
                         <img src="/Images/card/chip.png" alt="Visa" className="h-6 w-auto object-contain" />

                            {/* Contactless Icon */}
                            <div className="text-white/40">
                         <img src="/icon.png" alt="Reserva" className="h-6 w-auto object-contain brightness-0 invert" />

                            </div>
                          </div>

                          {/* Middle: Card Number */}
                          <div className="my-4">
                            <div className="text-white text-xl md:text-2xl font-mono tracking-wider drop-">
                              {cardNumber || '•••• •••• •••• ••••'}
                            </div>
                          </div>

                          {/* Bottom: Name and Expiry */}
                          <div className="flex items-end justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="text-white/50 text-[9px] mb-1 uppercase tracking-widest font-medium">
                                Card Holder
                              </div>
                              <div className="text-white text-sm font-medium tracking-wider uppercase truncate ">
                                {cardName || 'YOUR NAME'}
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <div className="text-white/50 text-[9px] mb-1 uppercase tracking-widest font-medium text-right">
                                Expires
                              </div>
                              <div className="text-white text-sm font-medium tracking-wider tabular-nums ">
                                {cardExpiry || 'MM/YY'}
                              </div>
                            </div>
                            {/* Visa Logo */}
                            <div className="flex-shrink-0">
                              <img src="/Images/card/card.png" alt="Visa" className="h-6 w-auto object-contain" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Back of Card */}
                      <div className="card-face card-back rounded-2xl  overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
                        {/* Magnetic Stripe */}
                        <div className="w-full h-12 bg-black mt-6"></div>

                        {/* Card Content */}
                        <div className="p-6 pt-8">
                          {/* Signature Strip and CVV */}
                          <div className="bg-white/90 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 border-b border-gray-300 h-8"></div>
                              <div className="ml-4 bg-white border-2 border-dashed border-gray-300 px-3 py-1 rounded">
                                <div className="text-gray-800 font-mono text-sm tracking-wider">
                                  {cardCvc || 'CVV'}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Info Text */}
                          <div className="text-white/60 text-[9px] leading-relaxed space-y-1">
                            <p>This card is property of the issuing bank. If found, please return to the nearest branch.</p>
                          </div>

                          {/* Bottom Logos */}
                          <div className="flex items-center justify-between mt-8">
                            <div className="text-white/40 text-xs"> <img src="/icon.png" alt="Reserva" className="h-6 w-auto object-contain brightness-0 invert" />
</div>
                            <div className="text-white/40 text-xs">Verified by VISA / MASTERCARD</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200/50 rounded-xl">
              <p className="text-sm text-red-800 flex items-start gap-2">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                {error}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleCancelAdd}
              disabled={loading}
              className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 rounded-lg"
              style={{ minWidth: '120px' }}
            >
              Annuler
            </button>
            <button
              onClick={handleAddPaymentMethod}
              disabled={loading}
              className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-[var(--reserva-ink)] hover:text-white cursor-pointer transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ minWidth: '120px' }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Ajout en cours...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Add
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Payment Methods List */
        <div className="space-y-3 mb-6">
          {paymentMethods.map((method) => (
            <div key={method.id} className="rounded-xl border border-gray-100 p-6  transition-all animate-fadeIn group">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-lg flex items-center justify-center">
                    {method.type === 'moroccan_transfer' ? (
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                        <span className="text-black text-xs font-bold">Transfer</span>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                        <span className="text-black text-xs font-bold">Card</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-medium text-gray-900">{method.name}</span>
                      {method.isDefault && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-medium rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      WLB • Created le {method.createdDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                      Set as default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
