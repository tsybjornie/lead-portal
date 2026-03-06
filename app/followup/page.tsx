'use client';

export default function RoofPage() {
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    return (
        <div style={{ fontFamily: f, padding: '40px', maxWidth: 900, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 32 }}></span>
                    <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Roof</h1>
                </div>
                <p style={{ fontSize: 14, color: '#9B9A97', margin: 0 }}>CRM, lead tracking & automated follow-ups</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                    { icon: '', title: 'Pipeline', desc: 'Visual lead pipeline & deal tracking', status: 'Coming Soon' },
                    { icon: '', title: 'Auto Follow-Up', desc: 'Automated WhatsApp & email Roofs', status: 'Coming Soon' },
                    { icon: '', title: 'Dashboard', desc: 'Conversion rates & lead analytics', status: 'Coming Soon' },
                    { icon: '', title: 'Quotations', desc: 'Generate & send quotes from leads', status: 'Coming Soon' },
                    { icon: '', title: 'Reminders', desc: 'Smart reminders & task management', status: 'Coming Soon' },
                    { icon: '', title: 'Reports', desc: 'Sales performance & forecasting', status: 'Coming Soon' },
                ].map((card, i) => (
                    <div key={i} style={{
                        background: '#FBFBFA', border: '1px solid #E9E9E7', borderRadius: 8,
                        padding: 20, display: 'flex', flexDirection: 'column',
                    }}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>{card.icon}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{card.title}</div>
                        <div style={{ fontSize: 12, color: '#9B9A97', flex: 1, lineHeight: 1.5 }}>{card.desc}</div>
                        <div style={{
                            marginTop: 12, fontSize: 10, fontWeight: 600, padding: '3px 8px',
                            borderRadius: 4, background: '#FBF3DB', color: '#9F6B00',
                            display: 'inline-block', alignSelf: 'flex-start',
                        }}>{card.status}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
