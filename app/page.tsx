'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoofAuth } from '@/context/RoofAuthContext';

export default function Home() {
  const { isLoggedIn, user, isLoading, isApproved, defaultRoute } = useRoofAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (isLoggedIn && user) {
      if (!isApproved) {
        router.replace('/pending-approval');
      } else {
        router.replace(defaultRoute);
      }
    } else {
      router.replace('/landing');
    }
  }, [isLoggedIn, user, isLoading, isApproved, defaultRoute, router]);

  return null;
}
