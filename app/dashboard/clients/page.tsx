'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientsPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/dashboard/clients/gestion');
  }, [router]);

  return null;
}
