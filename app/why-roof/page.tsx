'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WhyRoofRedirect() {
    const router = useRouter();
    useEffect(() => { router.replace('/landing'); }, [router]);
    return null;
}
