"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyHostLogin } from "@/lib/actions";
import { ShieldCheck, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HostLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", loginCode: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const res = await verifyHostLogin(formData.email, formData.loginCode);

    if (res.success) {
      router.push("/admin/host");
    } else {
      setErrorMsg(res.error);
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center p-6 bg-[#09090B] overflow-hidden">
      
      {/* Sophisticated Admin Background: Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(to right, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-white transition-colors z-20 font-medium text-sm">
        <ArrowLeft className="w-4 h-4" />
        Exit to Platform
      </Link>

      <div className="w-full max-w-md bg-[#111113]/80 border border-white/5 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative z-10">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
            <ShieldCheck className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-white mb-2">Host Authentication</h1>
          <p className="text-slate-400 text-sm text-center">Secure access restricted to authorized event administrators.</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-400 ml-1 mb-1.5 block uppercase tracking-wider">Admin Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="host@craftedexcellence.com" 
                required
                className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-white placeholder-slate-600" 
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 ml-1 mb-1.5 block uppercase tracking-wider">Security Code</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="password" 
                value={formData.loginCode}
                onChange={(e) => setFormData({...formData, loginCode: e.target.value})}
                placeholder="••••••••" 
                required
                className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-white placeholder-slate-600 tracking-widest" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-white text-black rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity"}
          </button>
        </form>
      </div>
    </main>
  );
}