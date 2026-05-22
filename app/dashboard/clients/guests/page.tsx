'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LegacyGuestsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/bookings/guests');
  }, [router]);
  return null;
}
