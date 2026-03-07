'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PendingApprovalPage() {
    return (
        <div
            className="min-h-screen bg-[#fafafa] text-[#111] flex flex-col items-center justify-center px-10"
            style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
                className="text-center max-w-[440px]"
            >
                {/* Status indicator */}
                <div className="w-16 h-16 rounded-full bg-[#111]/5 flex items-center justify-center mx-auto mb-8">
                    <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                </div>

                <h1 className="text-3xl font-light tracking-[-0.03em] mb-4">
                    Application received
                </h1>

                <p className="text-[15px] text-[#888] leading-relaxed mb-8">
                    Your account is under review. We&apos;ll notify you by email once you&apos;re approved to use the platform.
                </p>

                <div className="text-[10px] tracking-[0.25em] uppercase font-medium text-[#ccc] mb-12">
                    This usually takes less than 24 hours
                </div>

                <div className="flex gap-4 justify-center">
                    <Link
                        href="/landing"
                        className="text-[12px] font-medium text-[#999] hover:text-[#111] transition-colors"
                    >
                        ← Back to Roof
                    </Link>
                </div>
            </motion.div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-10 py-8">
                <div className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#ccc]">
                    Roof
                </div>
                <div className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#ccc]">
                    {new Date().getFullYear()}
                </div>
            </div>
        </div>
    );
}
