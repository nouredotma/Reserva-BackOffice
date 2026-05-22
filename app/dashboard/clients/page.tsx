'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Legacy route — guest CRM lives under Bookings. */
export default function ClientsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/bookings');
  }, [router]);
  return null;
}
