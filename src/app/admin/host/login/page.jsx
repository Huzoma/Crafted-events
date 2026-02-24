"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyHostLogin } from "@/lib/actions";
import { ShieldCheck, Loader2, ArrowRight } from "lucide-react";

export default function HostLogin() {
  const [email, setEmail] = useState("");
  const [loginCode, setLoginCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await verifyHostLogin(email, loginCode);

    if (result.success) {
      // Send the host straight to the main dashboard
      router.push("/admin/host");
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#09090B] flex items-center justify-center p-6 text-slate-50">
      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/20 blur-[60px] rounded-full pointer-events-none" />

        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-blue-500/20 relative z-10">
          <ShieldCheck className="w-8 h-8 text-blue-400" />
        </div>
        
        <h1 className="text-2xl font-heading font-bold text-center mb-2 relative z-10">Host Command Center</h1>
        <p className="text-slate-400 text-sm text-center mb-8 relative z-10">Sign in to manage your event.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="text-xs font-medium text-slate-400 ml-1 mb-1 block">Host Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@crafted.com" 
              required
              className="w-full px-4 py-3 bg-[#09090B]/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder-slate-600" 
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 ml-1 mb-1 block">Secret Passcode</label>
            <input 
              type="password" 
              value={loginCode}
              onChange={(e) => setLoginCode(e.target.value)}
              placeholder="••••••••" 
              required
              className="w-full px-4 py-3 bg-[#09090B]/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder-slate-600 tracking-widest" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !email || !loginCode}
            className="w-full mt-2 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Access Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}