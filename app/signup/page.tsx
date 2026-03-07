'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '', firmName: '', role: '', phone: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.password) return;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setMessage('Please enter a valid email address.');
            setMessageType('error');
            return;
        }

        if (formData.password.length < 6) {
            setMessage('Password must be at least 6 characters.');
            setMessageType('error');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: { full_name: formData.name, role: 'designer' },
                },
            });

            if (authError) {
                setMessage(authError.message);
                setMessageType('error');
                setIsSubmitting(false);
                return;
            }

            if (authData.user) {
                await supabase.from('profiles').insert({
                    id: authData.user.id,
                    email: formData.email,
                    full_name: formData.name,
                    phone: formData.phone,
                    role: 'designer',
                    firm_name: formData.firmName,
                    job_title: formData.role,
                    approved: false,  // Requires admin approval
                });
            }

            setMessage('Application submitted! We\'ll review and get back to you shortly.');
            setMessageType('success');
            setTimeout(() => { router.push('/pending-approval'); }, 2000);
        } catch (err) {
            setMessage('Something went wrong. Please try again.');
            setMessageType('error');
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-[#fafafa] text-[#111] flex flex-col"
            style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
        >
            {/* Top bar */}
            <header className="flex items-center justify-between px-8 md:px-12 py-5 border-b border-[#f0f0f0]">
                <Link href="/landing" className="text-[13px] font-semibold text-[#111] no-underline">
                    Roof
                </Link>
                <Link href="/login" className="text-[13px] text-[#888] no-underline hover:text-[#111] transition-colors">
                    Already have an account? <span className="font-semibold text-[#111]">Log in</span>
                </Link>
            </header>

            {/* Form — centered, clean, single column */}
            <div className="flex-1 flex items-center justify-center px-8 py-16">
                <div className="w-full max-w-[380px]">
                    <h1 className="text-[28px] font-light tracking-[-0.02em] mb-2">
                        Join Roof
                    </h1>
                    <p className="text-[14px] text-[#888] mb-8 leading-relaxed">
                        Create your designer account. We&apos;ll review your
                        application and get you set up.
                    </p>

                    <div className="flex flex-col gap-4">
                        {[
                            { key: 'name', label: 'Your name', placeholder: 'Bjorn Teo', type: 'text' },
                            { key: 'email', label: 'Work email', placeholder: 'bjorn@vinterior.sg', type: 'email' },
                            { key: 'firmName', label: 'Firm name', placeholder: 'Vinterior Pte Ltd', type: 'text' },
                            { key: 'phone', label: 'Phone', placeholder: '+65 9123 4567', type: 'tel' },
                            { key: 'password', label: 'Password', placeholder: 'Choose a password', type: 'password' },
                        ].map(field => (
                            <div key={field.key}>
                                <label className="block text-[11px] font-medium text-[#999] uppercase tracking-[0.1em] mb-1.5">
                                    {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={(formData as any)[field.key]}
                                    onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                                    className="w-full px-4 py-3 text-[13px] border border-[#e5e5e5] rounded-lg bg-transparent focus:border-[#111] focus:outline-none transition-colors placeholder:text-[#ccc]"
                                />
                            </div>
                        ))}

                        {/* Role select */}
                        <div>
                            <label className="block text-[11px] font-medium text-[#999] uppercase tracking-[0.1em] mb-1.5">
                                Your role
                            </label>
                            <select
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-3 text-[13px] border border-[#e5e5e5] rounded-lg bg-transparent focus:border-[#111] focus:outline-none transition-colors appearance-none cursor-pointer"
                                style={{ color: formData.role ? '#111' : '#ccc' }}
                            >
                                <option value="" disabled>Select your role</option>
                                <option value="owner">Firm Owner / Director</option>
                                <option value="principal">Principal Designer</option>
                                <option value="senior">Senior Designer</option>
                                <option value="designer">Designer</option>
                                <option value="pm">Project Manager</option>
                                <option value="drafter">Drafter / 3D Artist</option>
                                <option value="admin">Admin / Operations</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !formData.name || !formData.email || !formData.password}
                        className="w-full mt-8 py-3.5 text-[14px] font-semibold text-white bg-[#111] rounded-xl hover:bg-[#333] disabled:bg-[#ccc] disabled:cursor-not-allowed transition-all"
                    >
                        {isSubmitting ? 'Submitting...' : 'Apply to join Roof'}
                    </button>

                    {message && (
                        <div className={`mt-4 px-4 py-3 rounded-lg text-[12px] font-medium ${messageType === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-100'
                                : 'bg-red-50 text-red-600 border border-red-100'
                            }`}>
                            {message}
                        </div>
                    )}

                    <p className="text-[11px] text-[#bbb] text-center mt-4 leading-relaxed">
                        By applying, you agree to Roof&apos;s Terms and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
}
