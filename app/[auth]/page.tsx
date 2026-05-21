'use client';

import React, { useState, useEffect, use } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import CurvySlideButton from '@/components/CurvySlideButton';
import { Checkbox } from "@/components/ui/checkbox";
import LoadingOverlay from '@/components/LoadingOverlay';
import { useRouter, notFound } from 'next/navigation';
import { useAuth } from '@/lib/mock-auth';

// Animated Text Component
const AnimatedText = ({ className = "" }: { className?: string }) => {
  const messages = [
    { title: "Gestion simplifiée de votre établissement", subtitle: "Pilotez votre activité en toute sérénité et gagnez du temps chaque jour et à long terme." },
    { title: "Gerez vos rdv de manière efficace", subtitle: "Planifiez, suivez et optimisez vos rendez-vous sans effort en un clin d'œil." },
    { title: "Optimisez votre temps et vos ressources", subtitle: "Automatisez les tâches répétitives et concentrez-vous sur ce qui compte vraiment." },
    { title: "Restez organisé à tout moment", subtitle: "Accédez à vos outils où que vous soyez, sur tous vos appareils en toute simplicité." }
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setIsAnimating(false);
      }, 500);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={`min-h-[140px] flex flex-col justify-center text-left pl-2 lg:pl-0 ${className}`}>
      <div className={`transition-all duration-500 pr-0 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}> 
        <h2 className="text-2xl lg:text-2xl font-extrabold text-white mb-4 leading-tight text-left">
          {messages[currentIndex].title}
        </h2>
        <p className="text-sm lg:text-base text-white/80 font-medium leading-relaxed text-left">
          {messages[currentIndex].subtitle}
        </p>
      </div>
      {/* Progress Dots */}
      <div className="flex gap-2 justify-start mt-6">
        {messages.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentIndex 
                ? 'w-8 bg-white' 
                : 'w-1.5 bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

type Params = Promise<{ auth: string }>;

export default function AuthPage({ params }: { params: Params }) {
  const resolvedParams = use(params);
  const auth = resolvedParams.auth;

  // Validate route parameter
  if (auth !== 'login' && auth !== 'register') {
    notFound();
  }

  // Derive mode from the path
  const mode = auth === 'login' ? 'login' : 'signup';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetError, setResetError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    
    if (!resetEmail.trim()) {
      setResetError('Veuillez entrer votre adresse email');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setResetError('Veuillez entrer une adresse email valide');
      return;
    }
    
    // Simulate sending reset email
    setResetEmailSent(true);
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setResetEmail('');
    setResetEmailSent(false);
    setResetError('');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setFieldErrors({});
    
    const errors: {[key: string]: string} = {};
    
    if (mode === 'signup') {
      // Validation for signup
      if (!firstName.trim()) errors.firstName = 'Le prénom est requis';
      if (!lastName.trim()) errors.lastName = 'Le nom est requis';
      if (!email.trim()) errors.email = 'L\'email est requis';
      if (!password) errors.password = 'Le mot de passe est requis';
      if (!confirmPassword) errors.confirmPassword = 'Veuillez confirmer votre mot de passe';
      
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }
      if (password.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères');
        return;
      }
      if (!acceptTerms) {
        setError('Veuillez accepter les conditions d\'utilisation');
        return;
      }
      alert('Compte créé avec succès! Redirection...');
    } else {
      // Login validation
      if (!email.trim()) errors.email = 'L\'email est requis';
      if (!password) errors.password = 'Le mot de passe est requis';
      
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      setLoading(true);
      setTimeout(() => {
        const success = login(email, password);
        setLoading(false);
        if (success) {
          router.push('/dashboard/rendez-vous');
        } else {
          setError('Email ou mot de passe invalide');
        }
      }, 1500); // Simulate loading
    }
  };

  const handleModeSwitch = (newMode: 'login' | 'signup') => {
    setShowForgotPassword(false);
    setError('');
    setFieldErrors({});
    router.replace(newMode === 'signup' ? '/register' : '/login', { scroll: false });
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard/rendez-vous');
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden bg-white">
        {/* Left Side - Brand Section */}
        <div className="w-full h-[320px] lg:h-full lg:w-[700px] bg-white relative overflow-hidden">
          {/* left - Full Height */}
          <div className="relative w-full h-full p-4">
            <div className="w-full h-full rounded-3xl overflow-hidden bg-foreground flex flex-col items-center justify-center relative">
              <div className="relative h-full w-full flex flex-col items-start justify-between p-8 lg:p-12 z-10">
                <div className="h-20 w-20 rounded-2xl border border-white/30 bg-white/10 flex items-center justify-center">
                  <img src="/icon.png" alt="Reserva" className="h-12 w-12 object-contain brightness-0 invert" />
                </div>

                <div className="space-y-8 max-w-xl text-left">
                  <AnimatedText className="text-white w-full max-w-[620px] pl-0" />
                </div>
              </div>
              
              {/* Decorative background tile */}
              <img 
                src="/tile.webp" 
                alt="" 
                className="absolute -bottom-20 -right-20 w-[400px] h-auto rotate-12 brightness-0 invert pointer-events-none select-none"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 bg-white flex items-start justify-center p-6 lg:p-12 overflow-y-auto relative">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <LoadingOverlay />
            </div>
          ) : (
            <div className="w-full max-w-md pt-4">
            
            {/* Header */}
            <div className="mt-4 mb-10">
              <h1 className="text-4xl lg:text-4xl font-extrabold text-[#000000] mb-3">
                {showForgotPassword ? 'Mot de passe oublié ?' : 'Bienvenue !'}
              </h1>
              {/* Mode Toggle Links */}
              <div className="mt-2 text-left">
                {showForgotPassword ? (
                  <p className="text-gray-600 font-medium text-sm">
                    Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                  </p>
                ) : (
                  <p className="text-gray-600 font-medium text-sm">
                    {mode === 'login' ? (
                      <>
                        Pas encore de compte ?{' '}
                        <button
                          type="button"
                          onClick={() => handleModeSwitch('signup')}
                          className="text-[#000000] font-bold hover:underline"
                        >
                          S&apos;inscrire
                        </button>
                      </>
                    ) : (
                      <>
                        Vous avez déjà un compte ?{' '}
                        <button
                          type="button"
                          onClick={() => handleModeSwitch('login')}
                          className="text-[#000000] font-bold hover:underline"
                        >
                          Se connecter
                        </button>
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Forgot Password Form */}
            {showForgotPassword ? (
              <div className="space-y-6">
                {!resetEmailSent ? (
                  <form onSubmit={handlePasswordReset} className="space-y-4" noValidate>
                    <div>
                      <label htmlFor="resetEmail" className="block text-sm font-bold text-gray-900 mb-2">
                        Adresse email
                      </label>
                      <input
                        id="resetEmail"
                        type="text"
                        placeholder="vous@exemple.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full px-6 py-3 bg-white border border-gray-200 rounded-full focus:ring-1 focus:ring-[#082259] outline-none transition-all text-gray-900 placeholder-gray-400 text-base font-medium"
                        autoFocus
                      />
                      {resetError && (
                        <p className="mt-2 text-sm text-red-500">{resetError}</p>
                      )}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-4 text-left">
                      <p className="text-sm text-gray-900 font-semibold mb-2">Prochaines étapes :</p>
                      <ol className="text-sm text-gray-900 space-y-1.5 ml-4 list-decimal">
                        <li>Vérifiez votre boîte de réception</li>
                        <li>Cliquez sur le lien de réinitialisation</li>
                        <li>Créez un nouveau mot de passe</li>
                        <li>Connectez-vous avec votre nouveau mot de passe</li>
                      </ol>
                    </div>

                    <div
                      onClick={() => {
                        const form = document.querySelector('form');
                        if (form) {
                          const event = new Event('submit', { bubbles: true, cancelable: true });
                          form.dispatchEvent(event);
                        }
                      }}
                    >
                      <CurvySlideButton
                        text={"Envoyer le lien de réinitialisation"}
                        color="#FFC900"
                        textColor="#ffffff"
                        borderColor="#FFC900"
                        hoverTextColor="#000000"
                        hoverColor="#ffffff"
                        styles={{
                          width: '100%',
                          padding: '12px 24px',
                          fontSize: '16px',
                          borderRadius: '30px',
                          marginTop: '0',
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={closeForgotPasswordModal}
                      className="w-full text-gray-600 py-3 rounded-full font-semibold text-base hover:text-gray-900 transition-colors"
                    >
                      Retour à la connexion
                    </button>
                  </form>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-[#000000]">
                      Email envoyé !
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Nous avons envoyé un lien de réinitialisation à <strong className="text-[#000000]">{resetEmail}</strong>. 
                      Veuillez vérifier votre boîte de réception et suivre les instructions.
                    </p>
                    
                    <p className="text-xs text-gray-500">
                      Vous n&apos;avez pas reçu l&apos;email ? Vérifiez votre dossier spam ou{' '}
                      <button
                        onClick={() => setResetEmailSent(false)}
                        className="text-[#082259] font-bold hover:underline"
                      >
                        réessayez
                      </button>
                    </p>

                    <button
                      onClick={closeForgotPasswordModal}
                      className="w-full bg-[#000000] text-white py-3.5 rounded-full font-bold text-base hover:bg-[#000000] transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                      Retour à la connexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login Form */
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* First Name and Last Name - Only for Signup */}
                {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-bold text-gray-900 mb-2">
                      Prénom
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Jean"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-6 py-3 bg-white border border-gray-200 rounded-full focus:ring-1 focus:ring-[#082259] outline-none transition-all text-gray-900 placeholder-gray-400 text-base font-medium"
                    />
                    {fieldErrors.firstName && (
                      <p className="mt-2 text-sm text-red-500">{fieldErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-bold text-gray-900 mb-2">
                      Nom
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Dupont"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-6 py-3 bg-white border border-gray-200 rounded-full focus:ring-1 focus:ring-[#082259] outline-none transition-all text-gray-900 placeholder-gray-400 text-base font-medium"
                    />
                    {fieldErrors.lastName && (
                      <p className="mt-2 text-sm text-red-500">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="text"
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-3 bg-white border border-gray-200 rounded-full focus:ring-1 focus:ring-[#082259] outline-none transition-all text-gray-900 placeholder-gray-400 pr-12 text-base font-medium"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </span>
                </div>
                {fieldErrors.email && (
                  <p className="mt-2 text-sm text-red-500">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-[#000000] mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-3 bg-white border border-gray-200 rounded-full focus:ring-1 focus:ring-[#082259] outline-none transition-all text-gray-900 placeholder-gray-400 pr-12 text-base font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-2 text-sm text-red-500">{fieldErrors.password}</p>
                )}
              </div>

              {/* Confirm Password - Only for Signup */}
              {mode === 'signup' && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-bold text-[#000000] mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-6 py-3 bg-white border border-gray-200 rounded-full focus:ring-1 focus:ring-[#082259] outline-none transition-all text-gray-900 placeholder-gray-400 pr-12 text-base font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-500">{fieldErrors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-full px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              {/* Options Row */}
              {mode === 'login' ? (
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer group">
                    <Checkbox
                      id="keepLoggedIn"
                      checked={keepLoggedIn}
                      onCheckedChange={checked => setKeepLoggedIn(checked === true)}
                      className="w-5 h-5 ml-1 rounded-full border-2 bg-white border-gray-300 text-[#000000] cursor-pointer"
                    />
                    <span className="ml-2 text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                      Rester connecté
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm font-bold text-[#000000] hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              ) : (
                <div>
                  <label className="flex items-start cursor-pointer group">
                    <Checkbox
                      id="acceptTerms"
                      checked={acceptTerms}
                      onCheckedChange={checked => setAcceptTerms(checked === true)}
                      className="w-5 h-5 bg-white rounded-full border-1 border-gray-300 text-[#000000] cursor-pointer mt-0.5"
                    />
                    <span className="ml-3 text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                      J&apos;accepte les{' '}
                      <a href="#" className="text-[#000000] hover:underline">
                        conditions d&apos;utilisation
                      </a>{' '}
                      et la{' '}
                      <a href="#" className="text-[#000000] hover:underline">
                        politique de confidentialité
                      </a>
                    </span>
                  </label>
                </div>
              )}

                {/* Sign In Button */}
                <div onClick={() => {
                  const form = document.querySelector('form');
                  if (form) {
                    const event = new Event('submit', { bubbles: true, cancelable: true });
                    form.dispatchEvent(event);
                  }
                }}>
                  <CurvySlideButton
                    text={mode === 'login' ? 'Se connecter' : 'Créer un compte'}
                    color="#FFC900"
                    textColor="#ffffff"
                    borderColor="#FFC900"
                    hoverTextColor="#0A0A0A"
                    hoverColor="#ffffff"
                    styles={{
                      width: '100%',
                      padding: '12px 24px',
                      fontSize: '16px',
                      borderRadius: '30px',
                      marginTop: '16px',
                    }}
                  />
                </div>
              </form>
            )}

            {/* Divider and Social Login */}
            {!showForgotPassword && (
              <>
                <div className="flex items-center gap-4 my-8">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-sm font-semibold text-gray-400">OU</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Social Login */}
                <CurvySlideButton
              text={
                <span className="flex items-center justify-center gap-3">
                  <svg width="22" height="22" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_17_40)">
                      <path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.02h13.02c-.56 3.02-2.24 5.58-4.78 7.3v6.06h7.74c4.54-4.18 7.07-10.34 7.07-17.676z" fill="#4285F4"/>
                      <path d="M24.48 48c6.42 0 11.8-2.12 15.74-5.76l-7.74-6.06c-2.14 1.44-4.88 2.3-8 2.3-6.14 0-11.34-4.14-13.2-9.7H3.36v6.18C7.28 43.82 15.18 48 24.48 48z" fill="#34A853"/>
                      <path d="M11.28 28.78A13.98 13.98 0 0 1 9.6 24c0-1.66.3-3.28.84-4.78v-6.18H3.36A23.98 23.98 0 0 0 0 24c0 3.98.96 7.74 2.64 11.02l8.64-6.24z" fill="#FBBC05"/>
                      <path d="M24.48 9.54c3.5 0 6.62 1.2 9.08 3.56l6.8-6.8C36.28 2.12 30.9 0 24.48 0 15.18 0 7.28 4.18 3.36 10.04l8.64 6.18c1.86-5.56 7.06-9.7 13.2-9.7z" fill="#EA4335"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_17_40">
                        <rect width="48" height="48" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                  Se connecter avec Google
                </span>
              }
              color="#ffffff"
              textColor="#374151"
              borderColor="#e5e7eb"
              hoverTextColor="#ffffff"
              hoverColor="#000000"
              styles={{
                width: '100%',
                padding: '12px 24px',
                fontSize: '16px',
                borderRadius: '30px',
              }}
            />
            <div className="w-full text-center mt-3">
              <span className="text-xs text-gray-400 font-medium">SSL Connexion sécurisée et privée</span>
            </div>
              </>
            )}

          </div>
          )}
        </div>
      </div>
    </>
  );
}
