'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoofAuth, lookupUserByCode } from '@/context/RoofAuthContext';

export default function Home() {
  const { isLoggedIn, user } = useRoofAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn && user) {
      // Redirect to user's role-appropriate dashboard
      const entry = lookupUserByCode((user as any).code || '');
      router.replace(entry?.defaultRoute || '/hub');
    } else {
      router.replace('/landing');
    }
  }, [isLoggedIn, user, router]);

  return null;
}
