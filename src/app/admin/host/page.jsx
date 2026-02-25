"use client";

import { useState, useEffect } from "react";
import { getDashboardStats, getScannerPins, generateScannerPin, revokeScannerPin } from "@/lib/actions";
import { Users, Ticket, CheckCircle, Plus, ShieldAlert, ShieldCheck, Loader2, KeyRound, Activity } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HostDashboard() {
  const [stats, setStats] = useState({ totalPhysical: 0, totalVirtual: 0, totalCheckedIn: 0 });
  const [pins, setPins] = useState([]);
  const [newPinLabel, setNewPinLabel] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Initial Load
  useEffect(() => {
    let isMounted = true;
    async function fetchInitialData() {
      const statsRes = await getDashboardStats();
      const pinsRes = await getScannerPins();
      if (isMounted) {
        if (statsRes.success) setStats(statsRes.stats);
        if (pinsRes.success) setPins(pinsRes.pins);
        setIsLoading(false);
      }
    }
    fetchInitialData();
    return () => { isMounted = false; };
  }, []);

  // 2. Background Refresh
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
      await refreshDashboardData(); 
    }
    setIsGenerating(false);
  }

  // Handle revoking a PIN
  async function handleTogglePin(id, currentStatus) {
    const res = await revokeScannerPin(id, currentStatus);
    if (res.success) {
      await refreshDashboardData(); 
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-slate-50 gap-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm font-medium text-slate-400 tracking-widest uppercase">Initializing Telemetry...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090B] text-slate-50 font-sans selection:bg-blue-500/30">
      
      {/* Sticky Top Navigation */}
      <header className="sticky top-0 z-50 bg-[#09090B]/80 backdrop-blur-xl border-b border-white/5 px-6 lg:px-12 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image src="/logo-CEX.png" alt="Logo" width={36} height={36} className="object-contain rounded-lg" />
            </Link>
            <div>
              <h1 className="text-lg font-heading font-bold leading-tight">Host Command</h1>
              <p className="text-xs text-slate-400 font-mono">v1.0.0-production</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full border border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              System Active
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 lg:p-12 space-y-10">
        
        {/* Telemetry Stats Grid */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-200">Live Telemetry</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat Card 1 */}
            <div className="relative overflow-hidden bg-[#111113] border border-white/5 rounded-2xl p-6 group hover:border-blue-500/30 transition-colors">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-slate-400">Physical Issued</h3>
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Users className="w-4 h-4" /></div>
              </div>
              <p className="text-4xl font-bold font-mono tracking-tight">{stats.totalPhysical}</p>
            </div>

            {/* Stat Card 2 */}
            <div className="relative overflow-hidden bg-[#111113] border border-white/5 rounded-2xl p-6 group hover:border-purple-500/30 transition-colors">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-slate-400">Virtual Issued</h3>
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Ticket className="w-4 h-4" /></div>
              </div>
              <p className="text-4xl font-bold font-mono tracking-tight">{stats.totalVirtual}</p>
            </div>

            {/* Stat Card 3 - Special Highlight */}
            <div className="relative overflow-hidden bg-gradient-to-b from-[#111113] to-green-950/20 border border-green-500/20 rounded-2xl p-6">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/20 blur-[30px] rounded-full pointer-events-none" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <h3 className="text-sm font-medium text-green-400/80">Attendees Checked-In</h3>
                <div className="p-2 bg-green-500/20 rounded-lg text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]"><CheckCircle className="w-4 h-4" /></div>
              </div>
              <p className="text-4xl font-bold text-green-400 font-mono tracking-tight relative z-10">{stats.totalCheckedIn}</p>
            </div>
          </div>
        </section>

        {/* Access Control Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <KeyRound className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-200">Scanner Access Control</h2>
          </div>

          <div className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Sleek inline generation form */}
            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
              <form onSubmit={handleCreatePin} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <ShieldCheck className="w-5 h-5 text-slate-500" />
                  </div>
                  <input 
                    type="text" 
                    value={newPinLabel}
                    onChange={(e) => setNewPinLabel(e.target.value)}
                    placeholder="Enter device or volunteer label (e.g., VIP Entrance)" 
                    className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-white placeholder-slate-500 text-sm"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50 text-sm whitespace-nowrap"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Issue New PIN
                </button>
              </form>
            </div>

            {/* Enterprise Data Table for PINs */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/20 text-xs uppercase tracking-wider text-slate-500 border-b border-white/5">
                    <th className="px-6 py-4 font-medium">Access PIN</th>
                    <th className="px-6 py-4 font-medium">Assigned Label</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pins.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-500 text-sm">
                        No access PINs have been generated yet.
                      </td>
                    </tr>
                  ) : (
                    pins.map((pin) => (
                      <tr key={pin.id} className={`transition-colors hover:bg-white/[0.02] ${!pin.isActive && 'opacity-60'}`}>
                        <td className="px-6 py-4">
                          <span className="font-mono text-lg tracking-[0.2em] text-blue-400 font-medium bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/20">
                            {pin.pin}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300 font-medium">
                          {pin.label}
                        </td>
                        <td className="px-6 py-4">
                          {pin.isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Revoked
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleTogglePin(pin.id, pin.isActive)}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                              pin.isActive 
                                ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' 
                                : 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
                            }`}
                          >
                            {pin.isActive ? (
                              <><ShieldAlert className="w-3.5 h-3.5" /> Revoke</>
                            ) : (
                              <><ShieldCheck className="w-3.5 h-3.5" /> Restore</>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}