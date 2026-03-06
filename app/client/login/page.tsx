'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientLoginPage() {
    const router = useRouter();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) { setError('Please enter your project code'); return; }
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/quotes/${code.trim().toUpperCase()}`);
            if (!res.ok) throw new Error('Invalid code');
            router.push(`/client/${code.trim().toUpperCase()}/dashboard`);
        } catch {
            setError('Project code not found. Please check and try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            <div className="w-full max-w-sm px-6">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-lg">N</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Client Portal</h1>
                    <p className="text-sm text-gray-400 mt-1">Enter your project code to access your dashboard</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Project Code</label>
                        <input
                            type="text"
                            value={code}
                            onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
                            placeholder="e.g. 84BDRL"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 transition-colors tracking-widest text-center font-mono text-lg"
                            maxLength={10}
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-500 text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Access Dashboard'}
                    </button>
                </form>

                <p className="text-center text-[10px] text-gray-300 mt-8">
                    Your project code was provided by your designer.
                </p>

                <div className="text-center mt-12">
                    <p className="text-[10px] text-gray-200">Powered by Ordinance Systems</p>
                </div>
            </div>
        </div>
    );
}
