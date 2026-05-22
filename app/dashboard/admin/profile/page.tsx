'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Camera, CheckCircle2, KeyRound, Mail, Phone, Save, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/mock-auth';

export default function AdminProfilePage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [profile, setProfile] = useState({
    name: user?.name ?? 'Le Jardin Owner',
    email: user?.email ?? 'restaurant@reserva.demo',
    phone: '+212 6 24 18 77 90',
    role: 'Owner admin',
    language: 'en',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const updateField = (field: keyof typeof profile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      setAvatarPreview(readerEvent.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem(
      'admin_profile_settings',
      JSON.stringify({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
        language: profile.language,
        avatarPreview,
      }),
    );
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
      `}</style>

      <div className="mb-10 pt-20 animate-slideUp">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="mb-2 text-5xl font-light tracking-tight text-gray-900">Admin profile</h1>
            <p className="text-sm text-gray-400">Owner account details used for the establishment back office.</p>
          </div>
          {saved && (
            <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 size={16} />
              Saved
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="rounded-lg border border-gray-100 bg-white p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-5 h-32 w-32 overflow-hidden rounded-full bg-gray-100">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Admin profile" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary text-4xl font-semibold text-primary-foreground">
                  {profile.name.charAt(0)}
                </div>
              )}
              <label className="absolute bottom-2 right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-900 text-white">
                <Camera size={18} />
                <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
              </label>
            </div>
            <h2 className="text-xl font-medium text-gray-900">{profile.name}</h2>
            <p className="mt-1 text-sm text-gray-400">{profile.role}</p>
          </div>

          <div className="mt-8 space-y-4">
            {[
              { icon: Mail, label: 'Email', value: profile.email },
              { icon: Phone, label: 'Phone', value: profile.phone },
              { icon: Shield, label: 'Access', value: 'Admin dashboard' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <Icon size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-500">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-100 bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                <User size={18} className="text-gray-500" />
              </div>
              <div>
                <h2 className="text-xl font-light text-gray-900">Account information</h2>
                <p className="text-sm text-gray-400">Visible to Reserva support and internal establishment workflows.</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Full name</label>
                <Input value={profile.name} onChange={(event) => updateField('name', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Role</label>
                <Input value={profile.role} onChange={(event) => updateField('role', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                <Input type="email" value={profile.email} onChange={(event) => updateField('email', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Phone number</label>
                <Input value={profile.phone} onChange={(event) => updateField('phone', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Preferred language</label>
                <Select value={profile.language} onValueChange={(value) => updateField('language', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                <KeyRound size={18} className="text-gray-500" />
              </div>
              <div>
                <h2 className="text-xl font-light text-gray-900">Password</h2>
                <p className="text-sm text-gray-400">Keep the owner login separate from the public establishment profile.</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Current password</label>
                <Input
                  type="password"
                  value={profile.currentPassword}
                  onChange={(event) => updateField('currentPassword', event.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">New password</label>
                <Input type="password" value={profile.newPassword} onChange={(event) => updateField('newPassword', event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Confirm password</label>
                <Input
                  type="password"
                  value={profile.confirmPassword}
                  onChange={(event) => updateField('confirmPassword', event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="lg">
              <Save size={16} />
              Save profile
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
