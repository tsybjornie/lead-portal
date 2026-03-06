import Link from 'next/link';

export default function DashboardsIndex() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white font-mono space-y-8">
            <h1 className="text-4xl font-bold tracking-widest border-b-4 border-cyan-500 pb-2">SIFU COMMAND NEXUS</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Link href="/dashboards/designer">
                    <div className="w-64 h-40 bg-gray-800 border border-gray-700 hover:border-cyan-400 hover:bg-gray-700 transition-all rounded-xl flex flex-col items-center justify-center group cursor-pointer">
                        <span className="text-4xl mb-2 group-hover:scale-110 transition-transform"></span>
                        <h2 className="text-xl font-bold text-cyan-400">Designer</h2>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Command Center</p>
                    </div>
                </Link>

                <Link href="/dashboards/vendor">
                    <div className="w-64 h-40 bg-gray-800 border border-gray-700 hover:border-yellow-400 hover:bg-gray-700 transition-all rounded-xl flex flex-col items-center justify-center group cursor-pointer">
                        <span className="text-4xl mb-2 group-hover:scale-110 transition-transform"></span>
                        <h2 className="text-xl font-bold text-yellow-400">Vendor</h2>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Ops Dashboard</p>
                    </div>
                </Link>

                <Link href="/dashboards/owner">
                    <div className="w-64 h-40 bg-gray-800 border border-gray-700 hover:border-teal-400 hover:bg-gray-700 transition-all rounded-xl flex flex-col items-center justify-center group cursor-pointer">
                        <span className="text-4xl mb-2 group-hover:scale-110 transition-transform"></span>
                        <h2 className="text-xl font-bold text-teal-400">Owner</h2>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Client View</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
