"use client";

import { useState } from 'react';
import { useData, Client } from '@/context/DataContext';

export default function ClientManager() {
    const { clients, addClient } = useData();
    const [isOpen, setIsOpen] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [type, setType] = useState<'Residential' | 'Commercial'>('Residential');
    const [contact, setContact] = useState('');

    // New Fields
    const [newPropertyAddress, setNewPropertyAddress] = useState('');
    const [currentAddress, setCurrentAddress] = useState('');
    const [renovationIdiosyncrasies, setRenovationIdiosyncrasies] = useState('');

    const handleAdd = () => {
        const newClient: Client = {
            id: `CLI-${Date.now()}`,
            name,
            type,
            contact,
            newPropertyAddress,
            currentAddress,
            renovationIdiosyncrasies
        };
        addClient(newClient);
        setIsOpen(false);
        // Reset form
        setName('');
        setContact('');
        setNewPropertyAddress('');
        setCurrentAddress('');
        setRenovationIdiosyncrasies('');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-navy-900">Client Rolodex</h2>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-navy-900 text-gold-500 px-4 py-2 rounded text-xs font-bold hover:bg-black transition-colors"
                >
                    {isOpen ? 'CANCEL' : '+ ADD CLIENT'}
                </button>
            </div>

            {/* ADD FORM */}
            {isOpen && (
                <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200 animate-in fade-in slide-in-from-top-2 shadow-inner">
                    <h3 className="text-sm font-bold text-navy-900 uppercase mb-4 border-b border-gray-200 pb-2">New Client Profile</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* BASIC INFO */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">CLIENT NAME</label>
                                <input
                                    value={name} onChange={e => setName(e.target.value)}
                                    className="w-full p-2 text-sm border border-gray-300 rounded focus:border-navy-500 focus:ring-1 focus:ring-navy-500"
                                    placeholder="e.g. Mr. Tan"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">TYPE</label>
                                    <select
                                        value={type} onChange={e => setType(e.target.value as any)}
                                        className="w-full p-2 text-sm border border-gray-300 rounded"
                                    >
                                        <option value="Residential">Residential</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">CONTACT</label>
                                    <input
                                        value={contact} onChange={e => setContact(e.target.value)}
                                        className="w-full p-2 text-sm border border-gray-300 rounded"
                                        placeholder="Phone / Email"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* IDIOSYNCRASIES */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">RENOVATION IDIOSYNCRASIES</label>
                            <textarea
                                value={renovationIdiosyncrasies} onChange={e => setRenovationIdiosyncrasies(e.target.value)}
                                className="w-full p-2 text-sm border border-orange-200 bg-orange-50 rounded h-[108px] focus:border-orange-400 focus:ring-1 focus:ring-orange-400 placeholder:text-orange-300/70"
                                placeholder="Special requests, Feng Shui requirements, Pets, No hacking allowed, etc."
                            />
                        </div>

                        {/* ADDRESSES */}
                        <div className="md:col-span-2 grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">NEW PROPERTY ADDRESS (RENO SITE)</label>
                                <textarea
                                    value={newPropertyAddress} onChange={e => setNewPropertyAddress(e.target.value)}
                                    className="w-full p-2 text-sm border border-gray-300 rounded h-20"
                                    placeholder="Address of property to be renovated..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">CURRENT ADDRESS (CORRESPONDENCE)</label>
                                <textarea
                                    value={currentAddress} onChange={e => setCurrentAddress(e.target.value)}
                                    className="w-full p-2 text-sm border border-gray-300 rounded h-20"
                                    placeholder="Current residential address..."
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleAdd}
                        disabled={!name}
                        className="w-full bg-navy-900 text-white font-bold py-3 rounded text-sm hover:bg-navy-800 disabled:opacity-50 transition-colors shadow-lg"
                    >
                        CREATE CLIENT PROFILE
                    </button>
                </div>
            )}

            {/* LIST */}
            {clients.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                    No clients added yet. Click "+ ADD CLIENT" to start.
                </div>
            ) : (
                <div className="space-y-4">
                    {clients.map(c => (
                        <div key={c.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors bg-white shadow-sm group">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-navy-900 text-lg">{c.name}</h3>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${c.type === 'Residential' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {c.type}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                        <span> {c.contact}</span>
                                    </div>
                                </div>
                                <button className="text-xs text-gray-400 hover:text-navy-900 underline opacity-0 group-hover:opacity-100 transition-opacity">
                                    Edit Profile
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-3 border-t border-gray-100">
                                <div className="col-span-2 grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="block font-bold text-gray-500 uppercase mb-1">Renovation Site</span>
                                        <p className="text-gray-700 whitespace-pre-wrap">{c.newPropertyAddress || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="block font-bold text-gray-500 uppercase mb-1">Current Address</span>
                                        <p className="text-gray-700 whitespace-pre-wrap">{c.currentAddress || '-'}</p>
                                    </div>
                                    {/* Enhanced Contact Display */}
                                    {c.personInCharge && (
                                        <div className="bg-blue-50/50 p-2 rounded border border-blue-100">
                                            <span className="block font-bold text-blue-800 uppercase mb-1">PIC: {c.personInCharge.role}</span>
                                            <p className="font-bold">{c.personInCharge.name}</p>
                                            <p className="text-gray-600">{c.personInCharge.contact}</p>
                                        </div>
                                    )}
                                    {c.disputeEscalation && (
                                        <div className="bg-red-50/50 p-2 rounded border border-red-100">
                                            <span className="block font-bold text-red-800 uppercase mb-1">
                                                Escalation ({c.disputeEscalation.priority})
                                            </span>
                                            <p className="font-bold text-red-900">{c.disputeEscalation.name}</p>
                                            <p className="text-red-700">{c.disputeEscalation.contact}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-orange-50 p-2 rounded border border-orange-100 h-full">
                                    <span className="block font-bold text-orange-800 uppercase mb-1">Idiosyncrasies</span>
                                    <p className="text-orange-900 italic">{c.renovationIdiosyncrasies || 'None recorded'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
