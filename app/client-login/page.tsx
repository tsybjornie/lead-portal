'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientLogin() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState<'email' | 'code'>('email');
    const router = useRouter();

    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    return (
        <div style={{ fontFamily: f, background: '#FFFFFF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#37352F' }}>
            <div style={{ width: 380, padding: '0 24px' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em' }}>Roof</div>
                    <div style={{ fontSize: 12, color: '#9B9A97', marginTop: 4, letterSpacing: '0.04em' }}>RENOVATION PLATFORM</div>
                </div>

                {step === 'email' ? (
                    <>
                        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px', textAlign: 'center' }}>Welcome</h2>
                        <p style={{ fontSize: 13, color: '#9B9A97', margin: '0 0 28px', textAlign: 'center' }}>Enter your email to access your project</p>
                        <input
                            value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="you@email.com" type="email" autoFocus
                            style={{ width: '100%', padding: '12px 14px', border: '1px solid #E9E9E7', borderRadius: 6, fontSize: 14, fontFamily: f, outline: 'none', marginBottom: 12, boxSizing: 'border-box' }}
                        />
                        <button onClick={() => { if (email.trim()) setStep('code'); }}
                            disabled={!email.trim()}
                            style={{
                                width: '100%', padding: '12px', background: email.trim() ? '#37352F' : '#D3D1CB',
                                color: 'white', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600,
                                cursor: email.trim() ? 'pointer' : 'default', transition: 'background 0.15s',
                            }}>
                            Continue
                        </button>
                    </>
                ) : (
                    <>
                        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px', textAlign: 'center' }}>Check your email</h2>
                        <p style={{ fontSize: 13, color: '#9B9A97', margin: '0 0 28px', textAlign: 'center' }}>
                            We sent a 6-digit code to {email}
                        </p>
                        <input
                            value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="000000" autoFocus maxLength={6}
                            style={{ width: '100%', padding: '14px', border: '1px solid #E9E9E7', borderRadius: 6, fontSize: 24, fontFamily: f, outline: 'none', textAlign: 'center', letterSpacing: '0.3em', marginBottom: 12, boxSizing: 'border-box' }}
                        />
                        <button onClick={() => { if (code.length === 6) router.push('/prospect'); }}
                            disabled={code.length !== 6}
                            style={{
                                width: '100%', padding: '12px', background: code.length === 6 ? '#37352F' : '#D3D1CB',
                                color: 'white', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600,
                                cursor: code.length === 6 ? 'pointer' : 'default',
                            }}>
                            Verify & Enter
                        </button>
                        <button onClick={() => setStep('email')} style={{
                            width: '100%', marginTop: 8, padding: '10px', background: 'none', border: '1px solid #E9E9E7',
                            borderRadius: 6, fontSize: 13, cursor: 'pointer', color: '#9B9A97',
                        }}>Back</button>
                    </>
                )}

                <p style={{ fontSize: 11, color: '#C8C7C3', textAlign: 'center', marginTop: 32, lineHeight: 1.6 }}>
                    Powered by Roof
                </p>
            </div>
        </div>
    );
}
