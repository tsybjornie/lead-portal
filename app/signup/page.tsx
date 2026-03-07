'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '', firmName: '', role: '', phone: '', password: '', education: '', country: '', portfolio: '', completedProjects: '', credentials: [] as string[] });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const [certFiles, setCertFiles] = useState<File[]>([]);

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
                    portfolio: formData.portfolio,
                    completed_projects: formData.completedProjects,
                    credentials: formData.credentials,
                    education: formData.education,
                    country: formData.country,
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
                            { key: 'name', label: 'Your name', placeholder: 'Full name', type: 'text' },
                            { key: 'email', label: 'Work email', placeholder: 'you@yourfirm.com', type: 'email' },
                            { key: 'firmName', label: 'Firm name', placeholder: 'Your firm name', type: 'text' },
                            { key: 'phone', label: 'Phone', placeholder: '+65 / +60', type: 'tel' },
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

                        {/* Portfolio — what matters most */}
                        <div>
                            <label className="block text-[11px] font-medium text-[#999] uppercase tracking-[0.1em] mb-1.5">
                                Portfolio link (optional)
                            </label>
                            <input
                                type="url"
                                placeholder="Website, Instagram, or Behance link"
                                value={formData.portfolio}
                                onChange={e => setFormData({ ...formData, portfolio: e.target.value })}
                                className="w-full px-4 py-3 text-[13px] border border-[#e5e5e5] rounded-lg bg-transparent focus:border-[#111] focus:outline-none transition-colors placeholder:text-[#ccc]"
                            />
                        </div>

                        {/* Completed Projects */}
                        <div>
                            <label className="block text-[11px] font-medium text-[#999] uppercase tracking-[0.1em] mb-1.5">
                                Completed projects (approx)
                            </label>
                            <select
                                value={formData.completedProjects}
                                onChange={e => setFormData({ ...formData, completedProjects: e.target.value })}
                                className="w-full px-4 py-3 text-[13px] border border-[#e5e5e5] rounded-lg bg-transparent focus:border-[#111] focus:outline-none transition-colors appearance-none cursor-pointer"
                                style={{ color: formData.completedProjects ? '#111' : '#ccc' }}
                            >
                                <option value="" disabled>How many projects have you completed?</option>
                                <option value="1-10">1 – 10 projects</option>
                                <option value="11-50">11 – 50 projects</option>
                                <option value="51-100">51 – 100 projects</option>
                                <option value="101-500">101 – 500 projects</option>
                                <option value="500+">500+ projects</option>
                            </select>
                        </div>

                        {/* Optional Credentials — badges, not gatekeepers */}
                        <div>
                            <label className="block text-[11px] font-medium text-[#999] uppercase tracking-[0.1em] mb-1.5">
                                Credentials (optional — select all that apply)
                            </label>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                                {['SIDAC Accredited', 'BOA Registered', 'BCA Licensed', 'SIDA Award Winner', 'PAM Member', 'CIDA (China)', 'None / Self-taught'].map(cred => {
                                    const active = formData.credentials.includes(cred);
                                    return (
                                        <button key={cred} type="button"
                                            className={`text-[11px] px-3 py-1.5 rounded-full border transition-all ${active ? 'bg-[#111] text-white border-[#111]' : 'bg-transparent text-[#888] border-[#e5e5e5] hover:border-[#111]'}`}
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                credentials: active ? prev.credentials.filter(c => c !== cred) : [...prev.credentials, cred],
                                            }))}
                                        >{cred}</button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Education */}
                        <div>
                            <label className="block text-[11px] font-medium text-[#999] uppercase tracking-[0.1em] mb-1.5">
                                Design education (optional)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. NAFA, NUS Architecture, UTM, Self-taught"
                                value={formData.education}
                                onChange={e => setFormData({ ...formData, education: e.target.value })}
                                className="w-full px-4 py-3 text-[13px] border border-[#e5e5e5] rounded-lg bg-transparent focus:border-[#111] focus:outline-none transition-colors placeholder:text-[#ccc]"
                            />
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-[11px] font-medium text-[#999] uppercase tracking-[0.1em] mb-1.5">
                                Country
                            </label>
                            <select
                                value={formData.country}
                                onChange={e => setFormData({ ...formData, country: e.target.value })}
                                className="w-full px-4 py-3 text-[13px] border border-[#e5e5e5] rounded-lg bg-transparent focus:border-[#111] focus:outline-none transition-colors appearance-none cursor-pointer"
                                style={{ color: formData.country ? '#111' : '#ccc' }}
                            >
                                <option value="" disabled>Where are you based?</option>
                                <option value="SG">🇸🇬 Singapore</option>
                                <option value="MY">🇲🇾 Malaysia</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Cert Upload */}
                    <div className="mt-8">
                        <label className="block text-[11px] font-medium text-[#999] uppercase tracking-[0.1em] mb-1.5">
                            Upload certificates (PDF, optional)
                        </label>
                        <p className="text-[11px] text-[#bbb] mb-3 leading-relaxed">
                            SIDAC, BOA, BCA license, portfolio deck — upload as PDF. Max 5 files, 10MB each.
                        </p>
                        <label className="flex items-center justify-center gap-2 p-5 border-2 border-dashed border-[#e5e5e5] rounded-lg cursor-pointer hover:border-[#999] transition-colors bg-[#fafafa]">
                            <span className="text-[18px]">📄</span>
                            <span className="text-[12px] text-[#999] font-medium">
                                {certFiles.length > 0 ? 'Add more files' : 'Click to upload PDF certificates'}
                            </span>
                            <input type="file" accept=".pdf" multiple className="hidden"
                                onChange={e => {
                                    const files = Array.from(e.target.files || []);
                                    const pdfs = files.filter(f => f.type === 'application/pdf' && f.size <= 10 * 1024 * 1024);
                                    setCertFiles(prev => [...prev, ...pdfs].slice(0, 5));
                                    e.target.value = '';
                                }}
                            />
                        </label>
                        {certFiles.length > 0 && (
                            <div className="mt-2.5 flex flex-col gap-1.5">
                                {certFiles.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between px-3 py-2 bg-green-50 rounded-md border border-green-100">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[13px]">📋</span>
                                            <span className="text-[11px] font-medium text-green-700">{file.name}</span>
                                            <span className="text-[10px] text-[#999]">({(file.size / 1024).toFixed(0)} KB)</span>
                                        </div>
                                        <button type="button" onClick={() => setCertFiles(prev => prev.filter((_, j) => j !== i))} className="text-[13px] text-[#ccc] hover:text-[#666] bg-transparent border-none cursor-pointer px-1.5">✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
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
