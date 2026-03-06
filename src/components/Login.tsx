"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ShieldCheck, ChevronRight, Eye, EyeOff } from 'lucide-react';

type Role = 'ADMIN' | 'DESIGNER' | 'VENDOR';

interface LoginProps {
    onLogin: (role: Role) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (role: Role) => {
        setIsLoading(true);
        // Simulate network delay for "realism"
        setTimeout(() => {
            onLogin(role);
        }, 800);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center font-sans px-4 relative overflow-hidden">
            {/* Background Decorative Elements (Consistent with Gateway) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-blue-100/50 blur-3xl opacity-60 mix-blend-multiply" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-purple-100/50 blur-3xl opacity-60 mix-blend-multiply" />
            </div>

            {/* BRANDING */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center"
            >
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-slate-200 shadow-sm px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-slate-500 mb-6">
                    <ShieldCheck size={12} className="text-blue-600" />
                    SECURE ACCESS
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                    Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Back</span>
                </h1>
                <p className="text-slate-500 text-sm">
                    Enter your credentials to access the workspace.
                </p>
            </motion.div>

            {/* LOGIN CARD */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-xl relative"
            >
                <div className="space-y-6">
                    {/* INPUTS */}
                    <div className="space-y-4">
                        <div className="relative">
                            <label className="text-xs font-bold text-slate-700 ml-1 mb-1 block">EMAIL ADDRESS</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400"
                                    placeholder="name@firm.com"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-xs font-bold text-slate-700 ml-1 mb-1 block">PASSWORD</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg py-2.5 pl-10 pr-10 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400"
                                    placeholder=""
                                />
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                            <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            Remember me
                        </label>
                        <a href="#" className="text-blue-600 hover:underline font-medium">Forgot password?</a>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="space-y-3 pt-2">
                        <button
                            onClick={() => handleLogin('DESIGNER')}
                            disabled={isLoading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Authenticating...' : 'Sign In as Designer'}
                        </button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-400 font-medium">Other Portals</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleLogin('VENDOR')}
                                disabled={isLoading}
                                className="bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-700 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all text-xs"
                            >
                                <ChevronRight size={14} />
                                Vendor Portal
                            </button>
                            <button
                                onClick={() => handleLogin('ADMIN')}
                                disabled={isLoading}
                                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all text-xs"
                            >
                                <ShieldCheck size={14} />
                                Admin Console
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="mt-8 text-slate-400 text-[10px] font-mono tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                SYSTEM OPERATIONAL
            </div>
        </div>
    );
}
