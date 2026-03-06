import { redirect } from 'next/navigation';

// Client portal entry  redirects to login or dashboard
export default function ClientPortalPage() {
    // In production, check auth cookie here
    // For demo, redirect to login
    redirect('/client/login');
}
