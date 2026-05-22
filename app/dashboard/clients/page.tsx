'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/clients/guests');
  }, [router]);

  return null;
}
