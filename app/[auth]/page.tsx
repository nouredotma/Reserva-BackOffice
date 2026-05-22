'use client';

import React, { useState, useEffect, use } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, notFound } from 'next/navigation';
import { useAuth } from '@/lib/mock-auth';
import { categoryRegistrationOptions } from '@/lib/mock-data';
import type { EstablishmentCategory } from '@/lib/reserva-types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Animated Text Component
const AnimatedText = ({ className = "" }: { className?: string }) => {
  const messages = [
    { title: "Simple establishment management", subtitle: "Run your business calmly and save time every day, now and over the long term." },
    { title: "Manage reservations efficiently", subtitle: "Plan, track, and optimize reservations effortlessly." },
    { title: "Optimize your time and resources", subtitle: "Automate repetitive tasks and focus on what really matters." },
    { title: "Stay organized at every moment", subtitle: "Access your tools wherever you are, on every device." }
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
        <h2 className="text-2xl lg:text-2xl font-medium text-white mb-4 leading-tight text-left">
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
  const [businessCategory, setBusinessCategory] = useState<EstablishmentCategory>('restaurants');
  const [establishmentName, setEstablishmentName] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetError, setResetError] = useState('');

  const { login, isAuthenticated, signup } = useAuth();
  const router = useRouter();


  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (!resetEmail.trim()) {
      setResetError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setResetError('Please enter a valid email address');
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
      if (!firstName.trim()) errors.firstName = 'First name is required';
      if (!lastName.trim()) errors.lastName = 'Last name is required';
      if (!email.trim()) errors.email = 'Email is required';
      if (!password) errors.password = 'Password is required';
      if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
      if (!businessCategory) errors.businessCategory = 'Select your business category';

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 8) {
        setError('Password must contain at least 8 characters');
        return;
      }
      if (!acceptTerms) {
        setError('Please accept the terms of use');
        return;
      }

      const success = signup(
        email,
        password,
        `${firstName} ${lastName}`.trim(),
        businessCategory,
        establishmentName.trim() || undefined,
      );
      if (!success) {
        setError('This email is already used by another account');
      }
    } else {
      // Login validation
      if (!email.trim()) errors.email = 'Email is required';
      if (!password) errors.password = 'Password is required';

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      const success = login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
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
      router.replace('/dashboard/agenda');
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden bg-white">
        {/* Left Side - Brand Section */}
        <div className="hidden lg:block w-full h-[320px] lg:h-full lg:w-[700px] bg-white relative overflow-hidden">
          {/* left - Full Height */}
          <div className="relative w-full h-full p-4">
            <div className="w-full h-full rounded-3xl overflow-hidden bg-foreground flex flex-col items-center justify-center relative">
              <div className="relative h-full w-full flex flex-col items-start justify-start gap-10 p-8 lg:p-12 z-10">
                <div className="h-16 w-16 rounded-2xl border border-white/30 bg-white/10 flex items-center justify-center">
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
        <div
          className={`flex-1 bg-white flex justify-center overflow-y-auto relative ${
            mode === 'signup'
              ? 'items-start px-6 py-8 lg:px-12 lg:py-10'
              : 'items-center p-6 lg:p-12'
          }`}
        >
          <div className="w-full max-w-md pt-0 lg:pt-2">

            {/* Header */}
            <div className="mt-1 lg:mt-2 mb-4 lg:mb-5">
              <h1 className="text-3xl lg:text-4xl font-medium text-[#000000] mb-1.5 lg:mb-2">
                {showForgotPassword ? 'Forgot password?' : 'Welcome!'}
              </h1>
              {/* Mode Toggle Links */}
              <div className="mt-1 text-left">
                {showForgotPassword ? (
                  <p className="text-gray-600 font-medium text-xs lg:text-sm">
                    Enter your email address and we will send you a link to reset your password.
                  </p>
                ) : (
                  <p className="text-gray-600 font-medium text-xs lg:text-sm">
                    {mode === 'login' ? (
                      <>
                        Don&apos;t have an account?{' '}
                        <button
                          type="button"
                          onClick={() => handleModeSwitch('signup')}
                          className="text-[#000000] font-bold underline hover:text-primary cursor-pointer"
                        >
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => handleModeSwitch('login')}
                          className="text-[#000000] font-bold underline hover:text-primary cursor-pointer"
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Forgot Password Form */}
            {showForgotPassword ? (
              <div className="space-y-2.5 lg:space-y-3">
                {!resetEmailSent ? (
                  <form onSubmit={handlePasswordReset} className="space-y-2.5 lg:space-y-3" noValidate>
                    <div>
                      <label htmlFor="resetEmail" className="block text-xs lg:text-sm font-medium text-gray-900 mb-1">
                        Email address
                      </label>
                      <input
                        id="resetEmail"
                        type="text"
                        placeholder="you@example.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full px-4 py-2 lg:px-6 lg:py-2.5 bg-neutral-50 border border-gray-200 rounded-full focus:border-gray-200 focus:ring-1 focus:ring-primary focus:ring-offset-0 outline-none transition-all text-gray-900 placeholder-gray-400 text-sm lg:text-base font-medium"
                        autoFocus
                      />
                      {resetError && (
                        <p className="mt-1 text-xs lg:text-sm text-red-500">{resetError}</p>
                      )}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-3 lg:p-4 text-left">
                      <p className="text-xs lg:text-sm text-gray-900 font-medium mb-1.5 lg:mb-2">Next steps:</p>
                      <ol className="text-xs lg:text-sm text-gray-900 space-y-1 lg:space-y-1.5 ml-4 list-decimal">
                        <li>Check your inbox</li>
                        <li>Click the reset link</li>
                        <li>Create a new password</li>
                        <li>Sign in with your new password</li>
                      </ol>
                    </div>

                    <button
                      type="submit"
                      className="btn-blob mt-1.5 lg:mt-2"
                      style={{
                        background: '#FFC900',
                        color: '#ffffff',
                        border: '2px solid #FFC900',
                        '--hover-bg': '#ffffff',
                        '--hover-text': '#000000',
                      } as React.CSSProperties}
                    >
                      <span>Send reset link</span>
                    </button>

                    <button
                      type="button"
                      onClick={closeForgotPasswordModal}
                      className="w-full text-gray-600 py-2.5 lg:py-3 rounded-full font-medium text-xs lg:text-sm hover:text-gray-900 transition-colors cursor-pointer"
                    >
                      Back to sign in
                    </button>
                  </form>
                ) : (
                  <div className="text-center space-y-3 lg:space-y-4">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-green-100 rounded-full flex items-center justify-center mb-3 lg:mb-4 mx-auto">
                      <svg className="w-8 h-8 lg:w-10 lg:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                      </svg>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-medium text-[#000000]">
                      Email sent!
                    </h2>
                    <p className="text-gray-600 text-xs lg:text-sm leading-relaxed">
                      We sent a reset link to <span className="text-[#000000] font-medium">{resetEmail}</span>.
                      Please check your inbox and follow the instructions.
                    </p>

                    <p className="text-[10px] lg:text-xs text-gray-500">
                      Did not receive the email? Check your spam folder or{' '}
                      <button
                        onClick={() => setResetEmailSent(false)}
                        className="text-primary font-medium hover:underline cursor-pointer"
                      >
                        try again
                      </button>
                    </p>

                    <button
                      onClick={closeForgotPasswordModal}
                      className="w-full bg-[#000000] text-white py-2.5 lg:py-3.5 rounded-full font-medium text-xs lg:text-base hover:bg-[#000000] transition-colors duration-200   cursor-pointer"
                    >
                      Back to sign in
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login Form */
              <form onSubmit={handleSubmit} className="space-y-2.5 lg:space-y-3" noValidate>
                {/* First Name and Last Name - Only for Signup */}
                {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-2.5 lg:gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-xs lg:text-sm font-medium text-gray-900 mb-1">
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 lg:px-6 lg:py-2.5 bg-neutral-50 border border-gray-200 rounded-full focus:border-gray-200 focus:ring-1 focus:ring-primary focus:ring-offset-0 outline-none transition-all text-gray-900 placeholder-gray-400 text-sm lg:text-base font-medium"
                    />
                    {fieldErrors.firstName && (
                      <p className="mt-1 text-xs lg:text-sm text-red-500">{fieldErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs lg:text-sm font-medium text-gray-900 mb-1">
                      Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Smith"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 lg:px-6 lg:py-2.5 bg-neutral-50 border border-gray-200 rounded-full focus:border-gray-200 focus:ring-1 focus:ring-primary focus:ring-offset-0 outline-none transition-all text-gray-900 placeholder-gray-400 text-sm lg:text-base font-medium"
                    />
                    {fieldErrors.lastName && (
                      <p className="mt-1 text-xs lg:text-sm text-red-500">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-900 lg:text-sm">
                      What type of business do you run?
                    </label>
                    <Select
                      value={businessCategory}
                      onValueChange={(value) => setBusinessCategory(value as EstablishmentCategory)}
                    >
                      <SelectTrigger className="h-[38px] w-full rounded-full border-gray-200 bg-neutral-50 px-4 py-2 text-sm font-medium text-gray-900 lg:h-[46px] lg:px-6 lg:py-2.5 lg:text-base">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryRegistrationOptions.map((option) => (
                          <SelectItem key={option.key} value={option.key}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldErrors.businessCategory && (
                      <p className="mt-1 text-xs text-red-500 lg:text-sm">{fieldErrors.businessCategory}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="establishmentName" className="mb-1 block text-xs font-medium text-gray-900 lg:text-sm">
                      Establishment name (optional)
                    </label>
                    <input
                      id="establishmentName"
                      type="text"
                      placeholder="e.g. Le Jardin"
                      value={establishmentName}
                      onChange={(e) => setEstablishmentName(e.target.value)}
                      className="w-full rounded-full border border-gray-200 bg-neutral-50 px-4 py-2 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-gray-200 focus:ring-1 focus:ring-primary focus:ring-offset-0 lg:px-6 lg:py-2.5 lg:text-base"
                    />
                  </div>
                </>
              )}

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-xs lg:text-sm font-medium text-gray-900 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="text"
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 lg:px-6 lg:py-2.5 bg-neutral-50 border border-gray-200 rounded-full focus:border-gray-200 focus:ring-1 focus:ring-primary focus:ring-offset-0 outline-none transition-all text-gray-900 placeholder-gray-400 pr-10 lg:pr-12 text-sm lg:text-base font-medium"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Mail className="h-4 w-4 lg:h-[18px] lg:w-[18px]" />
                  </span>
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-xs lg:text-sm text-red-500">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-xs lg:text-sm font-medium text-[#000000] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 lg:px-6 lg:py-2.5 bg-neutral-50 border border-gray-200 rounded-full focus:border-gray-200 focus:ring-1 focus:ring-primary focus:ring-offset-0 outline-none transition-all text-gray-900 placeholder-gray-400 pr-10 lg:pr-12 text-sm lg:text-base font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-[18px] w-[18px] lg:h-[22px] lg:w-[22px]" />
                    ) : (
                      <Eye className="h-[18px] w-[18px] lg:h-[22px] lg:w-[22px]" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-xs lg:text-sm text-red-500">{fieldErrors.password}</p>
                )}
              </div>

              {/* Confirm Password - Only for Signup */}
              {mode === 'signup' && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs lg:text-sm font-medium text-[#000000] mb-1">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 lg:px-6 lg:py-2.5 bg-neutral-50 border border-gray-200 rounded-full focus:border-gray-200 focus:ring-1 focus:ring-primary focus:ring-offset-0 outline-none transition-all text-gray-900 placeholder-gray-400 pr-10 lg:pr-12 text-sm lg:text-base font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      aria-label={showConfirmPassword ? 'Masquer le password' : 'Afficher le password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-[18px] w-[18px] lg:h-[22px] lg:w-[22px]" />
                      ) : (
                        <Eye className="h-[18px] w-[18px] lg:h-[22px] lg:w-[22px]" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1 text-xs lg:text-sm text-red-500">{fieldErrors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-full px-4 py-2 text-xs lg:text-sm">
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
                      className="w-4 h-4 lg:w-5 lg:h-5 ml-1 rounded-full border bg-white border-gray-300 text-[#000000] cursor-pointer"
                    />
                    <span className="ml-2 text-xs lg:text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      Stay signed in
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs lg:text-sm font-medium text-[#000000] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              ) : (
                <div>
                  <label className="flex items-start cursor-pointer group">
                    <Checkbox
                      id="acceptTerms"
                      checked={acceptTerms}
                      onCheckedChange={checked => setAcceptTerms(checked === true)}
                      className="w-4 h-4 lg:w-5 lg:h-5 bg-white rounded-full border-1 border-gray-300 text-[#000000] cursor-pointer mt-0.5"
                    />
                    <span className="ml-2 lg:ml-3 text-xs lg:text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      I accept the{' '}
                      <a href="#" className="text-[#000000] hover:underline cursor-pointer">
                        terms of use
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-[#000000] hover:underline cursor-pointer">
                        privacy policy
                      </a>
                    </span>
                  </label>
                </div>
              )}

                {/* Sign In Button */}
                {mode === 'login' && (
                  <p className="text-[11px] leading-relaxed text-gray-500">
                    Demo: <span className="font-medium text-gray-700">restaurant@reserva.demo</span> /{' '}
                    <span className="font-medium text-gray-700">demo123</span> (and 7 other category accounts).
                  </p>
                )}

                <button
                  type="submit"
                  className="btn-blob mt-1.5 lg:mt-2"
                  style={{
                    background: '#FFC900',
                    color: '#ffffff',
                    border: '2px solid #FFC900',
                    '--hover-bg': '#ffffff',
                    '--hover-text': '#0A0A0A',
                  } as React.CSSProperties}
                >
                  <span>{mode === 'login' ? 'Sign in' : 'Create account'}</span>
                </button>
              </form>
            )}

            {/* Divider and Social Login */}
            {!showForgotPassword && (
              <>
                <div className="flex items-center gap-3 lg:gap-4 my-4 lg:my-5">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-xs lg:text-sm font-medium text-gray-400">OR</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Social Login */}
                <button
                  type="button"
                  className="btn-blob"
                  style={{
                    background: '#ffffff',
                    color: '#374151',
                    border: '2px solid #e5e7eb',
                    '--hover-bg': '#000000',
                    '--hover-text': '#ffffff',
                  } as React.CSSProperties}
                >
                  <span className="flex items-center justify-center gap-2 lg:gap-3">
                    <svg className="w-[18px] h-[18px] lg:w-[22px] lg:h-[22px]" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.018 0-9.309-3.083-11.101-7.456l-6.522 5.025C9.686 39.997 16.39 44 24 44z" />
                      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                    </svg>
                    Sign in with Google
                  </span>
                </button>
                <div className="w-full text-center mt-2.5 lg:mt-3">
                  <span className="text-[10px] lg:text-xs text-gray-400 font-medium">Secure and private SSL sign in</span>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
