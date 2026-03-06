"use client";

import { useState } from 'react';
import {
    FileText,
    Users,
    Shield,
    TrendingUp,
    Calculator,
    Truck,
    CheckCircle,
    ArrowRight,
    Star,
    Zap,
    Lock,
    BarChart3,
    Building2,
    Palette,
    HardHat,
    ClipboardCheck,
    X,
    Check
} from 'lucide-react';

interface LandingPageProps {
    onLogin: (role: 'designer' | 'vendor' | 'admin' | 'owner') => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
    const [hoveredRole, setHoveredRole] = useState<string | null>(null);

    const features = [
        {
            icon: Calculator,
            title: 'Universal Quotation Engine',
            description: 'Multi-unit support (mm, ft, sqft) with automatic conversions. Never miscalculate again.',
            color: 'from-blue-500 to-indigo-600'
        },
        {
            icon: Shield,
            title: 'Margin Protection',
            description: 'Smart alerts prevent under-margin quotes. Your profitability is always protected.',
            color: 'from-gray-600 to-gray-700'
        },
        {
            icon: TrendingUp,
            title: 'Price Consistency',
            description: 'Designer and Vendor use the same 3-tier structure. Compare RFQs apples-to-apples.',
            color: 'from-gray-700 to-gray-800'
        },
        {
            icon: ClipboardCheck,
            title: 'Digital Contracts',
            description: 'Convert quotes to legally-binding contracts with embedded e-signatures.',
            color: 'from-gray-800 to-gray-900'
        }
    ];

    const roles = [
        {
            id: 'designer',
            icon: Palette,
            title: 'Interior Designer',
            subtitle: 'Design firms & ID consultants',
            features: [
                'Build professional quotes in minutes',
                'Compare vendor prices across RFQs',
                'Track prospect  client conversion',
                'Generate branded contracts'
            ],
            cta: 'Enter as Designer',
            gradient: 'from-gray-800 to-gray-900'
        },
        {
            id: 'vendor',
            icon: HardHat,
            title: 'Vendor / Contractor',
            subtitle: 'Carpenters, tilers, electricians',
            features: [
                'Quote using same structure as designer',
                'Track your costs & protect margins',
                'Receive RFQs from designers',
                'Build your reputation score'
            ],
            cta: 'Enter as Vendor',
            gradient: 'from-gray-700 to-gray-800'
        },
        {
            id: 'admin',
            icon: Building2,
            title: 'Firm Admin',
            subtitle: 'Business owners & managers',
            features: [
                'Set margin thresholds firm-wide',
                'Approve quotes before sending',
                'View analytics & P&L',
                'Manage team permissions'
            ],
            cta: 'Enter as Admin',
            gradient: 'from-slate-700 to-slate-900'
        },
        {
            id: 'owner',
            icon: Users,
            title: 'Homeowner / Client',
            subtitle: 'Track your renovation project',
            features: [
                'View project progress in real-time',
                'Approve variation orders',
                'Access all documents and contracts',
                'Communicate with your designer'
            ],
            cta: 'Enter as Owner',
            gradient: 'from-gray-600 to-gray-700'
        }
    ];

    const workflow = [
        { step: 1, title: 'Prospect Inquiry', icon: Users },
        { step: 2, title: 'Build Quote', icon: Calculator },
        { step: 3, title: 'Auto-Price & Source', icon: Truck },
        { step: 4, title: 'Dispatch & Confirm', icon: BarChart3 },
        { step: 5, title: 'Client Accepts', icon: CheckCircle },
        { step: 6, title: 'Sign Contract', icon: FileText },
        { step: 7, title: 'Collect Payment', icon: TrendingUp },
        { step: 8, title: 'Execute Project', icon: Zap }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-800">

            {/*  */}
            {/* HERO SECTION - Notion Style */}
            {/*  */}
            <header className="bg-white border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-6 pt-8 pb-20">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">N</span>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">Roof</span>
                    </div>

                    {/* Hero Content */}
                    <div className="max-w-3xl">
                        <p className="text-gray-500 text-sm mb-4">
                            Show me the Roof.
                        </p>

                        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-[1.1]">
                            Quotations that just work.
                        </h2>

                        <p className="text-xl text-gray-500 mb-10 max-w-xl">
                            The renovation quotation system that makes complex pricing look effortless.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => onLogin('designer')}
                                className="bg-black hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                            >
                                Get Started
                                <ArrowRight size={16} />
                            </button>
                            <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium px-6 py-3 rounded-lg transition-colors">
                                See how it works
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/*  */}
            {/* WORKFLOW SECTION */}
            {/*  */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">End-to-End Workflow</h3>
                        <p className="text-gray-500">From first contact to project completion</p>
                    </div>

                    <div className="relative">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                            {workflow.map((item) => (
                                <div key={item.step} className="text-center group">
                                    <div className="relative inline-flex items-center justify-center w-14 h-14 bg-white border border-gray-200 rounded-xl mb-3 group-hover:border-gray-300 transition-all">
                                        <item.icon size={22} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-900 rounded-full text-[10px] text-white font-medium flex items-center justify-center">
                                            {item.step}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">{item.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/*  */}
            {/* PROBLEMS SECTION - Industry Pain Points */}
            {/*  */}
            <section className="py-20 bg-white border-t border-gray-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-sm text-red-500 font-medium">Industry Problems</span>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                            The problems everyone faces.
                        </h3>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Miscommunication, inconsistent pricing, and lack of transparency cost the industry millions every year.
                        </p>
                    </div>

                    {/* Problems Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {/* Designer Problems */}
                        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4">
                                <Palette size={24} className="text-white/80 mb-2" />
                                <h4 className="font-bold text-lg">Interior Designers</h4>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex items-start gap-3">
                                    <X size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Spreadsheet Chaos</p>
                                        <p className="text-sm text-gray-500">Every quote is a different Excel file. No consistency, easy to make mistakes.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <X size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Can't Compare Vendor Prices</p>
                                        <p className="text-sm text-gray-500">Each vendor quotes differently. Apples-to-oranges comparison wastes hours.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <X size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Margin Erosion</p>
                                        <p className="text-sm text-gray-500">Last-minute client changes eat into profits. No visibility until project ends.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <X size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Manual Contract Creation</p>
                                        <p className="text-sm text-gray-500">Retyping quote into contract. Risk of errors. No e-signature.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vendor Problems */}
                        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-4">
                                <HardHat size={24} className="text-white/80 mb-2" />
                                <h4 className="font-bold text-lg">Vendors / Contractors</h4>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex items-start gap-3">
                                    <X size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Scope is Unclear</p>
                                        <p className="text-sm text-gray-500">RFQs come via WhatsApp with vague descriptions. Easy to miss items.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <X size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Under-Quoting</p>
                                        <p className="text-sm text-gray-500">Pressure to be cheapest. Forgetting to include levies, insurance, transport.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <X size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">No Reputation System</p>
                                        <p className="text-sm text-gray-500">Good workmanship doesn't help win jobs. Only price matters.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <X size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">No Cost Tracking</p>
                                        <p className="text-sm text-gray-500">Win the job, but don't know actual profit until months later.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Client Problems */}
                        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-4">
                                <Users size={24} className="text-white/80 mb-2" />
                                <h4 className="font-bold text-lg">Homeowners / Clients</h4>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex items-start gap-3">
                                    <X size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Can't Compare Quotes</p>
                                        <p className="text-sm text-gray-500">Every ID firm has different format. What's included? What's excluded?</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <X size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Hidden Costs</p>
                                        <p className="text-sm text-gray-500">"That's not included" surprises during project. Final bill is 30% higher.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <X size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">No Price Transparency</p>
                                        <p className="text-sm text-gray-500">Is this price fair? Am I being overcharged? No way to know.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <X size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Verbal Agreements</p>
                                        <p className="text-sm text-gray-500">"I thought you said..." disputes. No digital trail.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Solution Banner */}
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-center">
                        <h4 className="text-2xl font-black mb-3">Roof Solves All of This</h4>
                        <p className="text-blue-100 max-w-2xl mx-auto mb-6">
                            One standardized system for designers, vendors, and clients. Same structure, same language, complete transparency.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="bg-white/20 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">
                                <Check size={14} /> Consistent 3-tier quoting
                            </div>
                            <div className="bg-white/20 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">
                                <Check size={14} /> Apples-to-apples RFQ comparison
                            </div>
                            <div className="bg-white/20 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">
                                <Check size={14} /> Margin protection alerts
                            </div>
                            <div className="bg-white/20 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">
                                <Check size={14} /> Digital contracts and e-signatures
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/*  */}
            {/* FEATURES SECTION */}
            {/*  */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-black mb-3">Powerful Features</h3>
                        <p className="text-gray-500">Everything you need to run a profitable renovation business</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-gray-200 transition-all group"
                            >
                                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl mb-4 shadow-lg`}>
                                    <feature.icon size={24} className="text-white" />
                                </div>
                                <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/*  */}
            {/* ROLES / PORTALS SECTION */}
            {/*  */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-black mb-3">Four Portals, One System</h3>
                        <p className="text-gray-500">Choose your role and get started</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {roles.map((role) => (
                            <div
                                key={role.id}
                                className={`relative bg-gray-50 border rounded-2xl overflow-hidden transition-all cursor-pointer ${hoveredRole === role.id ? 'border-blue-500 scale-[1.02] shadow-xl shadow-blue-500/10' : 'border-gray-200'
                                    }`}
                                onMouseEnter={() => setHoveredRole(role.id)}
                                onMouseLeave={() => setHoveredRole(null)}
                                onClick={() => onLogin(role.id as 'designer' | 'vendor' | 'admin')}
                            >
                                {/* Gradient Header */}
                                <div className={`bg-gradient-to-r ${role.gradient} p-6`}>
                                    <role.icon size={32} className="text-white/80 mb-3" />
                                    <h4 className="text-xl font-black">{role.title}</h4>
                                    <p className="text-sm text-white/60">{role.subtitle}</p>
                                </div>

                                {/* Features List */}
                                <div className="p-6 space-y-3">
                                    {role.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-2">
                                            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-slate-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <div className="px-6 pb-6">
                                    <button className={`w-full bg-gradient-to-r ${role.gradient} text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`}>
                                        {role.cta}
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/*  */}
            {/* PHILOSOPHY - Michael Caine Quote */}
            {/*  */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                        <span className="text-white font-black text-xl">N</span>
                    </div>
                    <blockquote className="text-2xl md:text-3xl font-medium text-gray-700 mb-4">
                        "In God we trust. All others must bring data."
                    </blockquote>
                    <p className="text-gray-500 mb-8"> W. Edwards Deming</p>
                    <p className="text-lg text-gray-600 max-w-xl mx-auto">
                        That is the spirit of Roof. Transparent pricing, backed by data.
                    </p>
                </div>
            </section>

            {/*  */}
            {/* TESTIMONIAL */}
            {/*  */}
            <section className="py-16 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <blockquote className="text-xl font-medium text-gray-600 mb-4">
                        "Finally, a system that lets me compare vendor prices consistently.
                        No more spreadsheet chaos  everything is standardized."
                    </blockquote>
                    <p className="text-gray-500"> Interior Designer, Singapore</p>
                </div>
            </section>

            {/*  */}
            {/* FOOTER - Minimal */}
            {/*  */}
            <footer className="py-12 border-t border-slate-100 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-sm">N</span>
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">Roof</p>
                                <p className="text-xs text-gray-500"> 2026 All rights reserved</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <a href="#" className="hover:text-slate-800 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-slate-800 transition-colors">Terms</a>
                            <a href="#" className="hover:text-slate-800 transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
