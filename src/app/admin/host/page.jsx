"use client";

import { useState, useEffect } from "react";
import { getDashboardStats, getScannerPins, generateScannerPin, revokeScannerPin } from "@/lib/actions";
import { Users, Ticket, CheckCircle, Plus, ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import Image from "next/image";

export default function HostDashboard() {
  const [stats, setStats] = useState({ totalPhysical: 0, totalVirtual: 0, totalCheckedIn: 0 });
  const [pins, setPins] = useState([]);
  const [newPinLabel, setNewPinLabel] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Initial Load: Runs once when the page mounts
  useEffect(() => {
    let isMounted = true;

    async function fetchInitialData() {
      const statsRes = await getDashboardStats();
      const pinsRes = await getScannerPins();
      
      // Only update state if the component is still on the screen
      if (isMounted) {
        if (statsRes.success) setStats(statsRes.stats);
        if (pinsRes.success) setPins(pinsRes.pins);
        setIsLoading(false);
      }
    }

    fetchInitialData();

    // Cleanup function prevents memory leaks
    return () => { isMounted = false; };
  }, []);

  // 2. Background Refresh: Used by the buttons to silently update data
  async function refreshDashboardData() {
    const statsRes = await getDashboardStats();
    const pinsRes = await getScannerPins();
    
    if (statsRes.success) setStats(statsRes.stats);
    if (pinsRes.success) setPins(pinsRes.pins);
  }

  // Handle generating a new PIN
  async function handleCreatePin(e) {
    e.preventDefault();
    if (!newPinLabel) return;
    
    setIsGenerating(true);
    const res = await generateScannerPin(newPinLabel);
    if (res.success) {
      setNewPinLabel("");
      await refreshDashboardData(); // Updated to the new background refresh function
    }
    setIsGenerating(false);
  }

  // Handle revoking a PIN
  async function handleTogglePin(id, currentStatus) {
    const res = await revokeScannerPin(id, currentStatus);
    if (res.success) {
      await refreshDashboardData(); // Updated to the new background refresh function
    }
  }

  if (isLoading) {
    return <div className="min-h-screen bg-[#09090B] flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;
  }

  return (
    <main className="min-h-screen bg-[#09090B] text-slate-50 p-6 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <Image src="/logo-CEX.png" alt="Logo" width={32} height={32} className="object-contain rounded-md" />
            <h1 className="text-2xl font-heading font-bold">Host Command Center</h1>
          </div>
          <div className="text-sm text-slate-400 bg-slate-800/50 px-4 py-2 rounded-full">
            Live Status: <span className="text-green-400 font-medium">Active</span>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400"><Users className="w-6 h-6" /></div>
              <h2 className="text-slate-400 font-medium">Physical Tickets</h2>
            </div>
            <p className="text-4xl font-bold">{stats.totalPhysical}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400"><Ticket className="w-6 h-6" /></div>
              <h2 className="text-slate-400 font-medium">Virtual Tickets</h2>
            </div>
            <p className="text-4xl font-bold">{stats.totalVirtual}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[40px] rounded-full pointer-events-none" />
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="p-3 bg-green-500/10 rounded-lg text-green-400"><CheckCircle className="w-6 h-6" /></div>
              <h2 className="text-slate-400 font-medium">Checked In</h2>
            </div>
            <p className="text-4xl font-bold text-green-400 relative z-10">{stats.totalCheckedIn}</p>
          </div>
        </section>

        {/* PIN Management Section */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6 border-b border-slate-800 pb-4">Scanner Access Control</h2>
          
          {/* Create New PIN Form */}
          <form onSubmit={handleCreatePin} className="flex flex-col sm:flex-row gap-4 mb-8">
            <input 
              type="text" 
              value={newPinLabel}
              onChange={(e) => setNewPinLabel(e.target.value)}
              placeholder="E.g., VIP Entrance Phone" 
              className="flex-1 px-4 py-3 bg-[#09090B]/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder-slate-600"
              required
            />
            <button 
              type="submit" 
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              Generate New PIN
            </button>
          </form>

          {/* List of active/inactive PINs */}
          <div className="space-y-4">
            {pins.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No volunteer PINs generated yet.</p>
            ) : (
              pins.map((pin) => (
                <div key={pin.id} className={`flex items-center justify-between p-4 rounded-xl border ${pin.isActive ? 'bg-blue-900/10 border-blue-500/20' : 'bg-red-900/10 border-red-500/20'}`}>
                  <div>
                    <p className="font-medium text-lg flex items-center gap-3">
                      <span className="tracking-[0.2em] text-blue-400 font-mono">{pin.pin}</span>
                      {!pin.isActive && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-md uppercase tracking-wider font-bold">Revoked</span>}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">{pin.label}</p>
                  </div>
                  
                  <button 
                    onClick={() => handleTogglePin(pin.id, pin.isActive)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${pin.isActive ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}
                  >
                    {pin.isActive ? (
                      <><ShieldAlert className="w-4 h-4" /> Revoke Access</>
                    ) : (
                      <><ShieldCheck className="w-4 h-4" /> Restore Access</>
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </main>
  );
}