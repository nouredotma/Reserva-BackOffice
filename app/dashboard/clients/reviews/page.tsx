'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LegacyReviewsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/bookings/reviews');
  }, [router]);
  return null;
}
