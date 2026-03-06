import ClientDashboard from './ClientDashboard';

export default async function ClientDashboardPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;
    return <ClientDashboard shareCode={code} />;
}
