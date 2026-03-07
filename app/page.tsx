'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoofAuth } from '@/context/RoofAuthContext';

export default function Home() {
  const { isLoggedIn, user, isLoading, defaultRoute } = useRoofAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for auth to hydrate
    if (isLoggedIn && user) {
      router.replace(defaultRoute);
    } else {
      router.replace('/landing');
    }
  }, [isLoggedIn, user, isLoading, defaultRoute, router]);

  return null;
}
