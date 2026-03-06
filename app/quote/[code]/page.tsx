import ClientQuoteInteractive from './ClientQuoteInteractive';

export default async function SharedQuotePage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;

    return <ClientQuoteInteractive shareCode={code} />;
}
