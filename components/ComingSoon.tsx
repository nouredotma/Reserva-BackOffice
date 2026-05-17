'use client';

import { Construction, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ComingSoonProps {
  title: string;
  description?: string;
  backLink?: string;
  backLinkText?: string;
}

export default function ComingSoon({ 
  title, 
  description = "Cette fonctionnalité est en cours de développement.", 
  backLink = "/dashboard/clients",
  backLinkText = "Retour aux Clients"
}: ComingSoonProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto p-8">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Construction size={48} className="text-gray-400" />
        </div>
        <h1 className="text-4xl font-light text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-500 text-lg mb-8">{description}</p>
        <Link
          href={backLink}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={16} />
          {backLinkText}
        </Link>
      </div>
    </div>
  );
}
