"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Building2, CheckCircle2, ChevronRight, LayoutDashboard, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Login from '@/components/Login';
import DashboardAdmin from '@/components/DashboardAdmin';
import DashboardDesigner from '@/components/DashboardDesigner';
import DashboardVendor from '@/components/DashboardVendor';
import LandingPage from '@/components/LandingPage';
import OwnerDashboard from '@/components/dashboards/OwnerDashboard';

type ViewState = 'LANDING' | 'GATEWAY' | 'LOGIN' | 'ADMIN' | 'DESIGNER' | 'VENDOR' | 'OWNER';
type Market = 'SG' | 'MY' | 'BOTH';
type Tier = 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';

export default function Home() {
  const [view, setView] = useState<ViewState>('LANDING');
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);

  const handleGatewayComplete = () => {
    if (selectedMarket && selectedTier) {
      setView('LOGIN');
    }
  };

  const handleLandingLogin = (role: 'designer' | 'vendor' | 'admin' | 'owner') => {
    // Map lowercase role to uppercase ViewState
    if (role === 'designer') setView('DESIGNER');
    else if (role === 'vendor') setView('VENDOR');
    else if (role === 'admin') setView('ADMIN');
    else if (role === 'owner') setView('OWNER');
  };

  const handleLogin = (role: 'ADMIN' | 'DESIGNER' | 'VENDOR') => {
    setView(role);
  };

  const handleLogout = () => {
    setView('LANDING');
    setSelectedMarket(null);
    setSelectedTier(null);
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <AnimatePresence mode="wait">
        {view === 'LANDING' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Link
              href="/hub"
              className="fixed top-4 left-4 z-[9999] bg-slate-900/80 backdrop-blur-md border border-slate-700 shadow-sm px-4 py-2 rounded-full text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              ← Command Center
            </Link>
            <LandingPage onLogin={handleLandingLogin} />
          </motion.div>
        )}

        {view === 'GATEWAY' && (
          <Gateway
            selectedMarket={selectedMarket}
            setSelectedMarket={setSelectedMarket}
            selectedTier={selectedTier}
            setSelectedTier={setSelectedTier}
            onComplete={handleGatewayComplete}
          />
        )}

        {view === 'LOGIN' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full h-screen"
          >
            {/* Pass context to Login if needed, or just display it */}
            <div className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span className="bg-slate-200 px-2 py-1 rounded">{selectedMarket} MARKET</span>
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">{selectedTier} TIER</span>
            </div>
            <Login onLogin={handleLogin} />
          </motion.div>
        )}

        {view === 'ADMIN' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <DashboardHeader onLogout={handleLogout} role="ADMIN" />
            <DashboardAdmin />
          </motion.div>
        )}

        {view === 'DESIGNER' && (
          <motion.div
            key="designer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <DashboardHeader onLogout={handleLogout} role="DESIGNER" />
            <DashboardDesigner />
          </motion.div>
        )}

        {view === 'VENDOR' && (
          <motion.div
            key="vendor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <DashboardVendor onLogout={handleLogout} />
          </motion.div>
        )}

        {view === 'OWNER' && (
          <motion.div
            key="owner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <DashboardHeader onLogout={handleLogout} role="OWNER" />
            <OwnerDashboard
              ownerName="Sample Owner"
              projectProgress={65}
              currentStatus="Kitchen Cabinet Installation"
              currentStatusDescription="Your custom cabinets are being fitted. Expected completion: 3 days."
              stages={[
                { id: '1', name: 'Design Approval', status: 'COMPLETED', date: 'Jan 15' },
                { id: '2', name: 'Hacking & Demolition', status: 'COMPLETED', date: 'Jan 20' },
                { id: '3', name: 'Electrical & Plumbing', status: 'COMPLETED', date: 'Jan 28' },
                { id: '4', name: 'Cabinet Installation', status: 'ACTIVE' },
                { id: '5', name: 'Painting & Touch-up', status: 'PENDING' },
                { id: '6', name: 'Final Inspection', status: 'PENDING' }
              ]}
              recentPhotos={[
                { url: '/placeholder-kitchen.jpg', caption: 'Kitchen progress', timestamp: 'Today, 10:30 AM' },
                { url: '/placeholder-cabinet.jpg', caption: 'Cabinet fitting', timestamp: 'Yesterday, 4:15 PM' }
              ]}
              aiWorkmanshipScore={87}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

function DashboardHeader({ onLogout, role }: { onLogout: () => void; role: string }) {
  return (
    <button
      onClick={onLogout}
      className="fixed top-4 right-4 z-[9999] bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm px-4 py-2 rounded-full text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 group"
    >
      <span>LOGOUT {role}</span>
      <div className="w-2 h-2 rounded-full bg-green-500 group-hover:bg-red-500 transition-colors" />
    </button>
  );
}

function Gateway({
  selectedMarket, setSelectedMarket,
  selectedTier, setSelectedTier,
  onComplete
}: {
  selectedMarket: Market | null; setSelectedMarket: (m: Market | null) => void;
  selectedTier: Tier | null; setSelectedTier: (t: Tier | null) => void;
  onComplete: () => void;
}) {
  const step = !selectedMarket ? 1 : !selectedTier ? 2 : 3;

  return (
    <motion.div
      key="gateway"
      className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-blue-100/50 blur-3xl opacity-60 mix-blend-multiply" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-purple-100/50 blur-3xl opacity-60 mix-blend-multiply" />
      </div>

      <div className="z-10 max-w-4xl w-full px-6 text-center">
        {/* Header */}
        <motion.div
          layout
          className="mb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-slate-500 mb-6"
          >
            <ShieldCheck size={12} className="text-blue-600" />
            SECURE GATEWAY v2.4
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">ArcControl</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            The operating system for modern interior design firms. Select your workspace to begin.
          </p>
        </motion.div>

        {/* Dynamic Content Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center"
              >
                <h2 className="text-xl font-bold text-slate-800 mb-8">Select Your Market</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                  <MarketCard
                    id="SG"
                    title="Singapore"
                    icon="🇸🇬"
                    desc="BCA Compliance, HDB Permits"
                    onClick={() => setSelectedMarket('SG')}
                  />
                  <MarketCard
                    id="MY"
                    title="Malaysia"
                    icon="🇲🇾"
                    desc="CIDB Standards, RM Billing"
                    onClick={() => setSelectedMarket('MY')}
                  />
                  <MarketCard
                    id="BOTH"
                    title="Cross-Border"
                    icon="🌏"
                    desc="Unified Dashboard, Multi-Currency"
                    onClick={() => setSelectedMarket('BOTH')}
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center"
              >
                <button
                  onClick={() => setSelectedMarket(null)}
                  className="mb-8 text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
                >
                  ← Back to Market
                </button>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Select Subscription Tier</h2>
                <p className="text-slate-500 text-sm mb-8">Access features based on your plan</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                  <TierCard
                    id="STARTER"
                    title="Starter"
                    price="Free"
                    features={['Basic Quotes', '5 Projects', 'Email Support']}
                    onClick={() => setSelectedTier('STARTER')}
                  />
                  <TierCard
                    id="PROFESSIONAL"
                    title="Professional"
                    price="$299/mo"
                    features={['Advanced AI', 'Unlimited Projects', 'Priority Support']}
                    highlighted
                    onClick={() => setSelectedTier('PROFESSIONAL')}
                  />
                  <TierCard
                    id="ENTERPRISE"
                    title="Enterprise"
                    price="Custom"
                    features={['API Access', 'White Label', 'Dedicated Manager']}
                    onClick={() => setSelectedTier('ENTERPRISE')}
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center justify-center pt-8"
              >
                <div className="p-8 bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-green-500 w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Configuration Ready</h3>
                  <p className="text-slate-500 mb-8">
                    Optimizing workspace for <strong className="text-slate-800">{selectedMarket === 'BOTH' ? 'International' : selectedMarket === 'SG' ? 'Singapore' : 'Malaysia'}</strong> market on <strong className="text-slate-800 lowercase capitalize">{selectedTier}</strong> tier.
                  </p>

                  <button
                    onClick={onComplete}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <LayoutDashboard size={18} />
                    Initialize Workspace
                  </button>

                  <button
                    onClick={() => setSelectedTier(null)}
                    className="mt-4 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Change Configuration
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function MarketCard({ id, title, icon, desc, onClick }: { id: string, title: string, icon: string, desc: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative bg-white hover:bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all text-left flex flex-col items-center justify-center gap-4 h-[200px]"
    >
      <div className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">
        {icon}
      </div>
      <div className="text-center">
        <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{title}</h3>
        <p className="text-xs text-slate-500 mt-1">{desc}</p>
      </div>
    </button>
  );
}

function TierCard({ id, title, price, features, highlighted, onClick }: { id: string, title: string, price: string, features: string[], highlighted?: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative p-6 rounded-2xl border shadow-sm transition-all text-left flex flex-col h-full w-full
          ${highlighted
          ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200 hover:shadow-blue-300 hover:scale-105 z-10'
          : 'bg-white border-slate-200 text-slate-900 hover:border-blue-300 hover:shadow-md'
        }
        `}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-blue-900 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
          RECOMMENDED
        </div>
      )}
      <h3 className={`font-bold ${highlighted ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
      <p className={`text-2xl font-black mt-2 mb-6 ${highlighted ? 'text-white' : 'text-slate-900'}`}>{price}</p>

      <ul className="space-y-3 mb-6 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-xs">
            <CheckCircle2 size={14} className={highlighted ? 'text-blue-200' : 'text-green-500'} />
            <span className={highlighted ? 'text-blue-50' : 'text-slate-600'}>{f}</span>
          </li>
        ))}
      </ul>

      <div className={`w-full py-2 rounded-lg text-xs font-bold text-center mt-auto flex items-center justify-center gap-1
            ${highlighted
          ? 'bg-white text-blue-600'
          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
        }
        `}>
        Select Plan <ChevronRight size={12} />
      </div>
    </button>
  );
}
