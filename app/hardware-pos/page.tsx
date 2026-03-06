'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';

/* ── Category icons ── */
const CAT_ICON: Record<string, string> = {
    Tiling: '🪨',
    Carpentry: '🪵',
    Painting: '🎨',
    Electrical: '⚡',
    Plumbing: '🔧',
    Tools: '🔨',
};

/* ── Mini barcode SVG ── */
function Barcode({ code }: { code: string }) {
    // Generate pseudo-random bar widths from SKU characters
    const bars: number[] = [];
    for (let i = 0; i < code.length; i++) {
        bars.push(code.charCodeAt(i) % 3 + 1);
        bars.push(1); // gap
    }
    const totalW = bars.reduce((a, b) => a + b, 0);
    let x = 0;
    return (
        <svg viewBox={`0 0 ${totalW} 16`} style={{ width: '100%', height: 16 }}>
            {bars.map((w, i) => {
                const rect = i % 2 === 0 ? (
                    <rect key={i} x={x} y={0} width={w} height={16} fill="#BBBAB7" rx={0.3} />
                ) : null;
                x += w;
                return rect;
            })}
        </svg>
    );
}

/* ── Seed inventory data (hardware shop items) ── */
const SEED_INVENTORY = [
    { sku: 'TIL-HG-600', name: '600×600 Homogeneous Tile (White)', category: 'Tiling', unit: 'box (4pcs)', costPrice: 18.50, sellPrice: 28.00, stock: 145, reorderAt: 30, supplier: 'Niro Granite' },
    { sku: 'TIL-HG-601', name: '600×600 Homogeneous Tile (Grey)', category: 'Tiling', unit: 'box (4pcs)', costPrice: 19.00, sellPrice: 29.00, stock: 98, reorderAt: 30, supplier: 'Niro Granite' },
    { sku: 'TIL-FW-300', name: '300×600 Feature Wall Tile (Marble Look)', category: 'Tiling', unit: 'box (6pcs)', costPrice: 32.00, sellPrice: 48.00, stock: 67, reorderAt: 20, supplier: 'White Horse' },
    { sku: 'PLY-MR-18', name: '18mm Marine Plywood (4×8)', category: 'Carpentry', unit: 'sheet', costPrice: 45.00, sellPrice: 68.00, stock: 52, reorderAt: 15, supplier: 'Sarawak Timber' },
    { sku: 'PLY-BB-12', name: '12mm Birch Plywood (4×8)', category: 'Carpentry', unit: 'sheet', costPrice: 75.00, sellPrice: 110.00, stock: 18, reorderAt: 10, supplier: 'Baltic Import' },
    { sku: 'LAM-FX-001', name: 'Formica Laminate (Walnut Grain)', category: 'Carpentry', unit: 'sheet (4×8)', costPrice: 55.00, sellPrice: 82.00, stock: 34, reorderAt: 10, supplier: 'Formica SG' },
    { sku: 'PNT-NP-5L', name: 'Nippon Paint Odourless (5L, White)', category: 'Painting', unit: 'pail', costPrice: 38.00, sellPrice: 55.00, stock: 89, reorderAt: 25, supplier: 'Nippon Paint' },
    { sku: 'PNT-DL-5L', name: 'Dulux Pentalite (5L, White)', category: 'Painting', unit: 'pail', costPrice: 42.00, sellPrice: 62.00, stock: 61, reorderAt: 20, supplier: 'AkzoNobel' },
    { sku: 'ELC-CB-13A', name: '13A Switch Socket (Schneider)', category: 'Electrical', unit: 'pc', costPrice: 4.50, sellPrice: 8.00, stock: 320, reorderAt: 100, supplier: 'Schneider Electric' },
    { sku: 'ELC-MCB-20', name: '20A MCB Breaker (Schneider)', category: 'Electrical', unit: 'pc', costPrice: 12.00, sellPrice: 22.00, stock: 48, reorderAt: 15, supplier: 'Schneider Electric' },
    { sku: 'ELC-LED-12', name: 'Philips LED Downlight 12W 3000K', category: 'Electrical', unit: 'pc', costPrice: 8.50, sellPrice: 15.00, stock: 156, reorderAt: 50, supplier: 'Philips' },
    { sku: 'ELC-DRV-60', name: 'Philips LED Driver 60W Dimmable', category: 'Electrical', unit: 'pc', costPrice: 22.00, sellPrice: 38.00, stock: 23, reorderAt: 10, supplier: 'Philips' },
    { sku: 'PLB-PPR-20', name: 'PPR Pipe 20mm (4m)', category: 'Plumbing', unit: 'length', costPrice: 6.50, sellPrice: 12.00, stock: 78, reorderAt: 20, supplier: 'ERA Pipes' },
    { sku: 'PLB-TAP-01', name: 'Basin Mixer Tap (Chrome)', category: 'Plumbing', unit: 'pc', costPrice: 45.00, sellPrice: 78.00, stock: 15, reorderAt: 5, supplier: 'Grohe' },
    { sku: 'PLB-SIL-AM', name: 'Anti-Mold Silicone Sealant (Clear)', category: 'Plumbing', unit: 'tube', costPrice: 5.50, sellPrice: 9.50, stock: 210, reorderAt: 50, supplier: 'Dow Corning' },
    { sku: 'HCK-DSC-01', name: 'Diamond Cutting Disc 4"', category: 'Tools', unit: 'pc', costPrice: 3.50, sellPrice: 7.00, stock: 95, reorderAt: 30, supplier: 'Bosch' },
    { sku: 'QTZ-CT-01', name: 'Quartz Countertop (Calacatta, per ft)', category: 'Carpentry', unit: 'ft run', costPrice: 75.00, sellPrice: 120.00, stock: 200, reorderAt: 50, supplier: 'Caesarstone' },
    { sku: 'GRT-EP-3K', name: 'Epoxy Grout (3kg, Grey)', category: 'Tiling', unit: 'bag', costPrice: 18.00, sellPrice: 28.00, stock: 42, reorderAt: 10, supplier: 'Mapei' },
];

/* ── Seed trade accounts (contractors with credit) ── */
const TRADE_ACCOUNTS = [
    { id: 'MC-001', name: 'Multiply Carpentry', rcs: 920, creditLimit: 15000, used: 3200, terms: 'Net 60', status: 'Elite' },
    { id: 'CD-001', name: 'Cubic Deco', rcs: 850, creditLimit: 12000, used: 7800, terms: 'Net 30', status: 'Trusted' },
    { id: 'GV-001', name: 'Glass Vision', rcs: 780, creditLimit: 10000, used: 2100, terms: 'Net 30', status: 'Trusted' },
    { id: 'MQ-001', name: 'Metalliqx', rcs: 710, creditLimit: 8000, used: 5500, terms: 'Net 30', status: 'Trusted' },
    { id: 'WK-001', name: 'Wei Kiat Plumbing', rcs: 620, creditLimit: 5000, used: 4800, terms: 'COD', status: 'Established' },
    { id: 'AH-001', name: 'Ah Heng Electric', rcs: 480, creditLimit: 0, used: 0, terms: 'COD', status: 'Building' },
];

const CATEGORIES = ['All', 'Tiling', 'Carpentry', 'Painting', 'Electrical', 'Plumbing', 'Tools'];

type Tab = 'pos' | 'inventory' | 'purchase' | 'accounts';

export default function HardwarePOSPage() {
    const f = "'Space Grotesk', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace";
    const [tab, setTab] = useState<Tab>('pos');
    const [inventory, setInventory] = useState(SEED_INVENTORY);
    const [cart, setCart] = useState<{ sku: string; name: string; qty: number; price: number }[]>([]);
    const [scanInput, setScanInput] = useState('');
    const [category, setCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [selectedAccount, setSelectedAccount] = useState('');
    const [mounted, setMounted] = useState(false);
    const scanRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setMounted(true); }, []);
    useEffect(() => { if (tab === 'pos' && scanRef.current) scanRef.current.focus(); }, [tab]);

    const handleScan = useCallback((code: string) => {
        const item = inventory.find(i => i.sku.toLowerCase() === code.toLowerCase());
        if (item) {
            setCart(prev => {
                const existing = prev.find(c => c.sku === item.sku);
                if (existing) return prev.map(c => c.sku === item.sku ? { ...c, qty: c.qty + 1 } : c);
                return [...prev, { sku: item.sku, name: item.name, qty: 1, price: item.sellPrice }];
            });
            setScanInput('');
        }
    }, [inventory]);

    const handleScanKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && scanInput.trim()) {
            handleScan(scanInput.trim());
        }
    };

    const addToCart = (item: typeof SEED_INVENTORY[0]) => {
        setCart(prev => {
            const existing = prev.find(c => c.sku === item.sku);
            if (existing) return prev.map(c => c.sku === item.sku ? { ...c, qty: c.qty + 1 } : c);
            return [...prev, { sku: item.sku, name: item.name, qty: 1, price: item.sellPrice }];
        });
    };

    const removeFromCart = (sku: string) => setCart(prev => prev.filter(c => c.sku !== sku));
    const updateQty = (sku: string, qty: number) => {
        if (qty <= 0) return removeFromCart(sku);
        setCart(prev => prev.map(c => c.sku === sku ? { ...c, qty } : c));
    };

    const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const gst = subtotal * 0.09;
    const total = subtotal + gst;

    const account = TRADE_ACCOUNTS.find(a => a.id === selectedAccount);
    const creditAvailable = account ? account.creditLimit - account.used : 0;
    const canCredit = account && creditAvailable >= total;

    const filteredInventory = inventory.filter(item => {
        const matchCat = category === 'All' || item.category === category;
        const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const lowStockItems = inventory.filter(i => i.stock <= i.reorderAt);

    const completeSale = (paymentMethod: string) => {
        if (cart.length === 0) return;
        setInventory(prev => prev.map(item => {
            const cartItem = cart.find(c => c.sku === item.sku);
            if (cartItem) return { ...item, stock: item.stock - cartItem.qty };
            return item;
        }));
        setCart([]);
        setSelectedAccount('');
    };

    const tabs: { key: Tab; label: string; icon: string }[] = [
        { key: 'pos', label: 'Point of Sale', icon: '🏪' },
        { key: 'inventory', label: 'Inventory', icon: '📦' },
        { key: 'purchase', label: 'Purchase Orders', icon: '🛒' },
        { key: 'accounts', label: 'Trade Accounts', icon: '💳' },
    ];

    const bg = '#FAFAF9';
    const card = '#FFFFFF';
    const border = '#E9E9E7';
    const text = '#37352F';
    const muted = '#9B9A97';
    const accent = '#10B981';

    return (
        <div style={{
            fontFamily: f, background: bg, minHeight: '100vh', color: text,
            opacity: mounted ? 1 : 0, transition: 'opacity 0.5s',
        }}>
            {/* Google Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
            {/* Responsive styles for iPad */}
            <style>{`
                @media (max-width: 1024px) {
                    .pos-grid { grid-template-columns: 1fr !important; }
                    .pos-cart { position: fixed !important; bottom: 0; left: 0; right: 0; max-height: 50vh; z-index: 100; border-radius: 16px 16px 0 0 !important; }
                    .product-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    .trade-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    .inv-table { font-size: 11px !important; }
                    .inv-table th, .inv-table td { padding: 8px 6px !important; }
                }
                @media (max-width: 768px) {
                    .product-grid { grid-template-columns: 1fr !important; }
                    .trade-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
            {/* Header */}
            <header style={{
                padding: '12px 24px', borderBottom: `1px solid ${border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 8, background: accent,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, fontWeight: 900, color: 'white',
                    }}>R</div>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em' }}>Hardware POS</div>
                        <div style={{ fontSize: 10, color: muted, fontWeight: 500 }}>by Roof • Powered by IRS</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {lowStockItems.length > 0 && (
                        <div style={{
                            padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                            background: 'rgba(239,68,68,0.08)', color: '#EF4444',
                        }}>
                            ⚠ {lowStockItems.length} items low stock
                        </div>
                    )}
                    <div style={{ fontSize: 12, color: muted }}>Cubic Deco Hardware</div>
                </div>
            </header>

            {/* Tabs */}
            <nav style={{
                display: 'flex', gap: 0, borderBottom: `1px solid ${border}`,
                padding: '0 24px',
            }}>
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{
                        padding: '12px 20px', fontSize: 12, fontWeight: 600, fontFamily: f,
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: tab === t.key ? accent : muted,
                        borderBottom: tab === t.key ? `2px solid ${accent}` : '2px solid transparent',
                        transition: 'all 0.2s',
                    }}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </nav>

            {/* Tab Content */}
            <div style={{ padding: '20px 24px' }}>
                {/* ═══ POS TAB ═══ */}
                {tab === 'pos' && (
                    <div className="pos-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, minHeight: 'calc(100vh - 120px)' }}>
                        {/* Left — Product Grid */}
                        <div>
                            {/* Scan Bar */}
                            <div style={{
                                background: card, borderRadius: 10, padding: '12px 16px',
                                border: `1px solid ${border}`, marginBottom: 16,
                                display: 'flex', gap: 12, alignItems: 'center',
                            }}>
                                <span style={{ fontSize: 20 }}>📷</span>
                                <input
                                    ref={scanRef}
                                    value={scanInput}
                                    onChange={e => setScanInput(e.target.value)}
                                    onKeyDown={handleScanKeyDown}
                                    placeholder="Scan barcode or type SKU... (press Enter)"
                                    style={{
                                        flex: 1, background: '#F5F5F3', border: `1px solid ${border}`,
                                        borderRadius: 6, padding: '10px 14px', color: text,
                                        fontSize: 14, fontFamily: f, outline: 'none',
                                    }}
                                />
                                <div style={{ fontSize: 10, color: muted, whiteSpace: 'nowrap' }}>USB scanner auto-types here</div>
                            </div>

                            {/* Category Filter */}
                            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                                {CATEGORIES.map(c => (
                                    <button key={c} onClick={() => setCategory(c)} style={{
                                        padding: '6px 14px', fontSize: 11, fontWeight: 600, fontFamily: f,
                                        borderRadius: 6, border: `1px solid ${category === c ? accent : border}`,
                                        background: category === c ? 'rgba(16,185,129,0.1)' : card,
                                        color: category === c ? accent : muted,
                                        cursor: 'pointer', transition: 'all 0.15s',
                                    }}>
                                        {c}
                                    </button>
                                ))}
                            </div>

                            {/* Product Grid */}
                            <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                                {filteredInventory.map(item => (
                                    <button key={item.sku} onClick={() => addToCart(item)} style={{
                                        background: card, border: `1px solid ${border}`, borderRadius: 10,
                                        padding: '14px 12px', cursor: 'pointer', textAlign: 'left',
                                        transition: 'all 0.15s', fontFamily: f,
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = accent; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = border; }}
                                    >
                                        {/* Icon + Name row */}
                                        <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                                            <div style={{
                                                width: 40, height: 40, borderRadius: 8,
                                                background: '#F5F5F3', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 20, flexShrink: 0,
                                            }}>
                                                {CAT_ICON[item.category] || '📦'}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 12, fontWeight: 600, color: text, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                                                <div style={{ fontSize: 10, color: muted }}>{item.unit}</div>
                                            </div>
                                        </div>
                                        {/* Barcode */}
                                        <div style={{ marginBottom: 6, opacity: 0.5 }}>
                                            <Barcode code={item.sku} />
                                        </div>
                                        <div style={{ fontSize: 9, fontFamily: 'monospace', color: muted, textAlign: 'center', marginBottom: 8, letterSpacing: '0.1em' }}>{item.sku}</div>
                                        {/* Price + Stock */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ fontSize: 16, fontWeight: 800, color: accent }}>
                                                ${item.sellPrice.toFixed(2)}
                                            </div>
                                            <div style={{
                                                fontSize: 10, fontWeight: 600,
                                                padding: '2px 8px', borderRadius: 10,
                                                background: item.stock <= item.reorderAt ? 'rgba(239,68,68,0.08)' : '#F5F5F3',
                                                color: item.stock <= item.reorderAt ? '#EF4444' : muted,
                                            }}>
                                                {item.stock} pcs
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right — Cart */}
                        <div className="pos-cart" style={{
                            background: card, borderRadius: 12, border: `1px solid ${border}`,
                            display: 'flex', flexDirection: 'column', overflow: 'hidden',
                        }}>
                            <div style={{ padding: '16px', borderBottom: `1px solid ${border}` }}>
                                <div style={{ fontSize: 14, fontWeight: 700 }}>Current Sale</div>
                                <div style={{ fontSize: 11, color: muted }}>{cart.length} item{cart.length !== 1 ? 's' : ''}</div>
                            </div>

                            {/* Cart Items */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                                {cart.length === 0 ? (
                                    <div style={{ padding: 40, textAlign: 'center', color: muted, fontSize: 13 }}>
                                        Scan an item or click from the grid
                                    </div>
                                ) : cart.map(item => (
                                    <div key={item.sku} style={{
                                        padding: '12px 16px', borderBottom: `1px solid ${border}`,
                                        display: 'flex', alignItems: 'center', gap: 12,
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{item.name}</div>
                                            <div style={{ fontSize: 11, color: muted }}>${item.price.toFixed(2)} × {item.qty}</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <button onClick={() => updateQty(item.sku, item.qty - 1)} style={{
                                                width: 24, height: 24, borderRadius: 4, border: `1px solid ${border}`,
                                                background: '#F5F5F3', color: text, cursor: 'pointer', fontSize: 14, fontFamily: f,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>−</button>
                                            <span style={{ fontSize: 13, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                                            <button onClick={() => updateQty(item.sku, item.qty + 1)} style={{
                                                width: 24, height: 24, borderRadius: 4, border: `1px solid ${border}`,
                                                background: '#F5F5F3', color: text, cursor: 'pointer', fontSize: 14, fontFamily: f,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>+</button>
                                        </div>
                                        <div style={{ fontSize: 13, fontWeight: 700, minWidth: 60, textAlign: 'right' }}>
                                            ${(item.price * item.qty).toFixed(2)}
                                        </div>
                                        <button onClick={() => removeFromCart(item.sku)} style={{
                                            background: 'transparent', border: 'none', color: '#EF4444',
                                            cursor: 'pointer', fontSize: 14, padding: 4,
                                        }}>✕</button>
                                    </div>
                                ))}
                            </div>

                            {/* Trade Account Selector */}
                            <div style={{ padding: '12px 16px', borderTop: `1px solid ${border}` }}>
                                <div style={{ fontSize: 10, fontWeight: 600, color: muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trade Account (optional)</div>
                                <select
                                    value={selectedAccount}
                                    onChange={e => setSelectedAccount(e.target.value)}
                                    style={{
                                        width: '100%', padding: '8px 10px', borderRadius: 6,
                                        background: '#F5F5F3', border: `1px solid ${border}`,
                                        color: text, fontSize: 12, fontFamily: f,
                                    }}
                                >
                                    <option value="">Walk-in Customer (Cash/Card)</option>
                                    {TRADE_ACCOUNTS.map(a => (
                                        <option key={a.id} value={a.id}>
                                            {a.name} — RCS {a.rcs} ({a.terms})
                                        </option>
                                    ))}
                                </select>
                                {account && (
                                    <div style={{
                                        marginTop: 8, padding: '8px 10px', borderRadius: 6,
                                        background: canCredit ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                                        fontSize: 11, color: canCredit ? accent : '#EF4444',
                                    }}>
                                        Credit: ${creditAvailable.toLocaleString()} available ({account.terms})
                                        {!canCredit && total > 0 && ' — EXCEEDS LIMIT'}
                                    </div>
                                )}
                            </div>

                            {/* Totals */}
                            <div style={{ padding: '16px', borderTop: `1px solid ${border}`, background: '#F9F9F8' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: muted, marginBottom: 4 }}>
                                    <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: muted, marginBottom: 8 }}>
                                    <span>GST (9%)</span><span>${gst.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 900, marginBottom: 16 }}>
                                    <span>Total</span><span style={{ color: accent }}>${total.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button onClick={() => completeSale('cash')} style={{
                                        flex: 1, padding: '12px', borderRadius: 8, border: 'none',
                                        background: accent, color: 'white', fontSize: 13, fontWeight: 700,
                                        cursor: cart.length ? 'pointer' : 'not-allowed', fontFamily: f,
                                        opacity: cart.length ? 1 : 0.4,
                                    }}>
                                        💵 Cash
                                    </button>
                                    <button onClick={() => completeSale('card')} style={{
                                        flex: 1, padding: '12px', borderRadius: 8, border: 'none',
                                        background: '#3B82F6', color: 'white', fontSize: 13, fontWeight: 700,
                                        cursor: cart.length ? 'pointer' : 'not-allowed', fontFamily: f,
                                        opacity: cart.length ? 1 : 0.4,
                                    }}>
                                        💳 Card
                                    </button>
                                    {account && (
                                        <button onClick={() => canCredit && completeSale('credit')} style={{
                                            flex: 1, padding: '12px', borderRadius: 8, border: 'none',
                                            background: canCredit ? '#8B5CF6' : '#333', color: 'white',
                                            fontSize: 13, fontWeight: 700, fontFamily: f,
                                            cursor: canCredit && cart.length ? 'pointer' : 'not-allowed',
                                            opacity: canCredit && cart.length ? 1 : 0.4,
                                        }}>
                                            📑 Credit ({account.terms})
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ INVENTORY TAB ═══ */}
                {tab === 'inventory' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div>
                                <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px' }}>Stock Inventory</h2>
                                <p style={{ fontSize: 12, color: muted, margin: 0 }}>{inventory.length} items • {lowStockItems.length} below reorder point</p>
                            </div>
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search inventory..."
                                style={{
                                    padding: '8px 14px', borderRadius: 6, background: card,
                                    border: `1px solid ${border}`, color: text, fontSize: 12, fontFamily: f,
                                    width: 220, outline: 'none',
                                }}
                            />
                        </div>
                        <div style={{ background: card, borderRadius: 10, border: `1px solid ${border}`, overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                <thead>
                                    <tr style={{ borderBottom: `1px solid ${border}` }}>
                                        {['SKU', 'Item', 'Category', 'Unit', 'Cost', 'Sell', 'Margin', 'Stock', 'Reorder', 'Supplier'].map(h => (
                                            <th key={h} style={{
                                                padding: '10px 12px', textAlign: 'left', fontSize: 10,
                                                fontWeight: 600, color: muted, textTransform: 'uppercase',
                                                letterSpacing: '0.04em',
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInventory.map((item, i) => {
                                        const margin = ((item.sellPrice - item.costPrice) / item.sellPrice * 100).toFixed(0);
                                        const isLow = item.stock <= item.reorderAt;
                                        return (
                                            <tr key={item.sku} style={{
                                                borderBottom: `1px solid ${border}`,
                                                background: isLow ? 'rgba(239,68,68,0.03)' : 'transparent',
                                            }}>
                                                <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 11, color: muted }}>{item.sku}</td>
                                                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.name}</td>
                                                <td style={{ padding: '10px 12px', color: muted }}>{item.category}</td>
                                                <td style={{ padding: '10px 12px', color: muted }}>{item.unit}</td>
                                                <td style={{ padding: '10px 12px', color: muted }}>${item.costPrice.toFixed(2)}</td>
                                                <td style={{ padding: '10px 12px', fontWeight: 600 }}>${item.sellPrice.toFixed(2)}</td>
                                                <td style={{ padding: '10px 12px', color: accent, fontWeight: 600 }}>{margin}%</td>
                                                <td style={{
                                                    padding: '10px 12px', fontWeight: 700,
                                                    color: isLow ? '#EF4444' : text,
                                                }}>{item.stock} {isLow && '⚠'}</td>
                                                <td style={{ padding: '10px 12px', color: muted }}>{item.reorderAt}</td>
                                                <td style={{ padding: '10px 12px', color: muted }}>{item.supplier}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ═══ PURCHASE ORDERS TAB ═══ */}
                {tab === 'purchase' && (
                    <div>
                        <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px' }}>Purchase Orders</h2>
                        <p style={{ fontSize: 12, color: muted, margin: '0 0 16px' }}>Auto-generated when stock hits reorder point</p>

                        {lowStockItems.length > 0 && (
                            <div style={{ marginBottom: 20 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#EF4444', marginBottom: 10 }}>
                                    ⚠ Items Below Reorder Point — Auto PO Suggested
                                </div>
                                <div style={{ background: card, borderRadius: 10, border: `1px solid ${border}`, overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                        <thead>
                                            <tr style={{ borderBottom: `1px solid ${border}` }}>
                                                {['SKU', 'Item', 'Current Stock', 'Reorder Point', 'Suggested Order', 'Supplier', 'Est. Cost', 'Action'].map(h => (
                                                    <th key={h} style={{
                                                        padding: '10px 12px', textAlign: 'left', fontSize: 10,
                                                        fontWeight: 600, color: muted, textTransform: 'uppercase',
                                                    }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lowStockItems.map(item => {
                                                const orderQty = item.reorderAt * 2 - item.stock;
                                                const estCost = orderQty * item.costPrice;
                                                return (
                                                    <tr key={item.sku} style={{ borderBottom: `1px solid ${border}` }}>
                                                        <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 11, color: muted }}>{item.sku}</td>
                                                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.name}</td>
                                                        <td style={{ padding: '10px 12px', color: '#EF4444', fontWeight: 700 }}>{item.stock}</td>
                                                        <td style={{ padding: '10px 12px', color: muted }}>{item.reorderAt}</td>
                                                        <td style={{ padding: '10px 12px', fontWeight: 700, color: accent }}>{orderQty}</td>
                                                        <td style={{ padding: '10px 12px', color: muted }}>{item.supplier}</td>
                                                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>${estCost.toFixed(2)}</td>
                                                        <td style={{ padding: '10px 12px' }}>
                                                            <button style={{
                                                                padding: '5px 12px', borderRadius: 5, border: 'none',
                                                                background: accent, color: 'white', fontSize: 11,
                                                                fontWeight: 600, cursor: 'pointer', fontFamily: f,
                                                            }}>Create PO</button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Recent Purchase Orders</div>
                        <div style={{ background: card, borderRadius: 10, border: `1px solid ${border}`, overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                <thead>
                                    <tr style={{ borderBottom: `1px solid ${border}` }}>
                                        {['PO #', 'Supplier', 'Items', 'Total', 'Status', 'Date'].map(h => (
                                            <th key={h} style={{
                                                padding: '10px 12px', textAlign: 'left', fontSize: 10,
                                                fontWeight: 600, color: muted, textTransform: 'uppercase',
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { po: 'PO-2026-0048', supplier: 'Niro Granite', items: 3, total: 2850, status: 'Delivered', date: '28 Feb' },
                                        { po: 'PO-2026-0047', supplier: 'Schneider Electric', items: 5, total: 1240, status: 'In Transit', date: '25 Feb' },
                                        { po: 'PO-2026-0046', supplier: 'Nippon Paint', items: 2, total: 1520, status: 'Confirmed', date: '22 Feb' },
                                        { po: 'PO-2026-0045', supplier: 'Grohe', items: 8, total: 3600, status: 'Delivered', date: '18 Feb' },
                                        { po: 'PO-2026-0044', supplier: 'Sarawak Timber', items: 4, total: 4200, status: 'Delivered', date: '15 Feb' },
                                    ].map(po => (
                                        <tr key={po.po} style={{ borderBottom: `1px solid ${border}` }}>
                                            <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 600, color: accent }}>{po.po}</td>
                                            <td style={{ padding: '10px 12px' }}>{po.supplier}</td>
                                            <td style={{ padding: '10px 12px', color: muted }}>{po.items} items</td>
                                            <td style={{ padding: '10px 12px', fontWeight: 600 }}>${po.total.toLocaleString()}</td>
                                            <td style={{ padding: '10px 12px' }}>
                                                <span style={{
                                                    padding: '3px 10px', borderRadius: 12, fontSize: 10, fontWeight: 600,
                                                    background: po.status === 'Delivered' ? 'rgba(16,185,129,0.1)' :
                                                        po.status === 'In Transit' ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)',
                                                    color: po.status === 'Delivered' ? accent :
                                                        po.status === 'In Transit' ? '#F59E0B' : '#3B82F6',
                                                }}>
                                                    {po.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 12px', color: muted }}>{po.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ═══ TRADE ACCOUNTS TAB ═══ */}
                {tab === 'accounts' && (
                    <div>
                        <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px' }}>Trade Accounts</h2>
                        <p style={{ fontSize: 12, color: muted, margin: '0 0 16px' }}>Contractor credit powered by Roof Credit Score (RCS)</p>

                        <div className="trade-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                            {TRADE_ACCOUNTS.map(a => {
                                const utilization = a.creditLimit > 0 ? (a.used / a.creditLimit * 100) : 0;
                                const tierColor = a.status === 'Elite' ? '#8B5CF6' :
                                    a.status === 'Trusted' ? accent :
                                        a.status === 'Established' ? '#F59E0B' : '#EF4444';
                                return (
                                    <div key={a.id} style={{
                                        background: card, borderRadius: 12, border: `1px solid ${border}`,
                                        padding: '20px', transition: 'all 0.2s',
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                            <div style={{ fontSize: 14, fontWeight: 700 }}>{a.name}</div>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: 12, fontSize: 10, fontWeight: 700,
                                                background: `${tierColor}15`, color: tierColor,
                                            }}>{a.status}</span>
                                        </div>
                                        <div style={{
                                            display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16,
                                        }}>
                                            <div style={{ fontSize: 28, fontWeight: 900, color: tierColor }}>{a.rcs}</div>
                                            <div style={{ fontSize: 12, color: muted }}>RCS</div>
                                        </div>
                                        {a.creditLimit > 0 ? (
                                            <>
                                                <div style={{ fontSize: 11, color: muted, marginBottom: 6 }}>
                                                    Credit: ${a.used.toLocaleString()} / ${a.creditLimit.toLocaleString()} used
                                                </div>
                                                <div style={{
                                                    width: '100%', height: 6, borderRadius: 3,
                                                    background: '#222', overflow: 'hidden', marginBottom: 8,
                                                }}>
                                                    <div style={{
                                                        width: `${utilization}%`, height: '100%', borderRadius: 3,
                                                        background: utilization > 80 ? '#EF4444' : accent,
                                                        transition: 'width 0.5s',
                                                    }} />
                                                </div>
                                                <div style={{ fontSize: 12, fontWeight: 600, color: accent }}>
                                                    ${(a.creditLimit - a.used).toLocaleString()} available • {a.terms}
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{ fontSize: 12, color: muted }}>
                                                COD only — RCS below 700 threshold
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
