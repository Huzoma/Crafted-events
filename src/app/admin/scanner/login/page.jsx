"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyScannerPin } from "@/lib/actions";
import { Lock, Loader2, ArrowRight } from "lucide-react";

export default function ScannerLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await verifyScannerPin(pin);

    if (result.success) {
      // If the cookie was set successfully, send them to the scanner!
      router.push("/admin/scanner");
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#09090B] flex items-center justify-center p-6 text-slate-50">
      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl shadow-2xl">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-blue-500/20">
          <Lock className="w-8 h-8 text-blue-400" />
        </div>
        
        <h1 className="text-2xl font-heading font-bold text-center mb-2">Volunteer Access</h1>
        <p className="text-slate-400 text-sm text-center mb-8">Enter your assigned event PIN to access the scanner.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="password" 
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN" 
              required
              className="w-full px-4 py-4 text-center tracking-[0.5em] text-2xl font-bold bg-[#09090B]/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder-slate-600" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading || pin.length < 4}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Unlock Scanner
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}