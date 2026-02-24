"use client"; // Required for forms that use state

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MonitorPlay, User, Mail, Aperture, Globe, Calendar, CheckCircle, Loader2 } from "lucide-react";
import { registerAttendee } from "@/lib/actions"; // Import our new Server Action

export default function VirtualRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successCode, setSuccessCode] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // The function that runs when they click the button
  async function handleSubmit(event) {
    event.preventDefault(); // Stop page from refreshing
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(event.target);
    formData.append("ticketType", "VIRTUAL"); // Inject the ticket type

    // Send directly to PostgreSQL via Server Action
    const result = await registerAttendee(formData);

    if (result.success) {
      setSuccessCode(result.accessCode); // Show the success UI
    } else {
      setErrorMsg(result.error);
    }
    
    setIsSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-[#09090B] text-slate-50 grid grid-cols-1 lg:grid-cols-2 overflow-hidden selection:bg-blue-500/30">
      
      {/* ================= LEFT COLUMN ================= */}
      <div className="relative flex flex-col justify-center px-6 py-12 lg:p-20 z-20">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-blue-800/20 blur-[120px] rounded-full pointer-events-none" />
          
          <nav className="absolute top-8 left-6 lg:left-20 flex items-center">
            <Link href="/" className="text-xl font-heading font-bold tracking-tighter flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Aperture className="w-6 h-6 text-blue-500" />
              Crafted<span className="text-slate-500">Excellence</span>
            </Link>
          </nav>

          <div className="w-full max-w-md mx-auto lg:mx-0 mt-20 lg:mt-0">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to home
            </Link>

            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 sm:p-10 backdrop-blur-xl shadow-2xl relative">
              
              {/* SUCCESS STATE UI */}
              {successCode ? (
                <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h2 className="font-heading text-3xl font-bold mb-2">You are in!</h2>
                  <p className="text-slate-400 text-sm mb-6">
                    Your virtual registration is confirmed. Use this one-time passcode to access the stream on the event day.
                  </p>
                  <div className="bg-[#09090B]/50 border border-slate-700/50 rounded-xl p-6 mb-8">
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Your Access Code</p>
                    <p className="text-4xl font-heading font-bold text-blue-400 tracking-[0.2em]">{successCode}</p>
                  </div>
                  <Link href="/" className="text-sm font-medium text-white bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 transition-all">
                    Return to Homepage
                  </Link>
                </div>
              ) : (
                /* NORMAL FORM UI */
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <MonitorPlay className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h1 className="font-heading text-2xl sm:text-3xl font-bold">Virtual Pass</h1>
                      <div className="flex items-center gap-3 text-xs text-blue-300 mt-1 font-medium">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Oct 24</span>
                        <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Global Stream</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed font-light">
                    Join from anywhere in the world. Provide your details below to receive your secure streaming link and one-time passcode.
                  </p>

                  {errorMsg && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                      {errorMsg}
                    </div>
                  )}

                  {/* FORM WITH ONSUBMIT HANDLER */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-slate-500" />
                        </div>
                        <input 
                          type="text" id="name" name="name" required placeholder="Enter your full name" 
                          className="w-full pl-12 pr-4 py-4 bg-[#09090B]/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-slate-600 shadow-inner" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-slate-500" />
                        </div>
                        <input 
                          type="email" id="email" name="email" required placeholder="you@example.com" 
                          className="w-full pl-12 pr-4 py-4 bg-[#09090B]/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-slate-600 shadow-inner" 
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-white text-black rounded-xl font-bold hover:bg-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Get Virtual Access"
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
      </div>

      {/* ================= RIGHT COLUMN (Unchanged) ================= */}
      <div className="hidden lg:block relative h-full w-full overflow-hidden bg-blue-900/20">
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-blue-900/40 to-[#09090B]/30 z-10 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/10 z-10 mix-blend-overlay pointer-events-none" />
        <Image 
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3" 
          alt="Premium virtual streaming experience" 
          fill priority sizes="(max-width: 1024px) 0vw, 50vw"
          className="object-cover filter saturate-0 contrast-125 opacity-70"
        />
        <div className="absolute bottom-20 left-20 z-20 max-w-md pointer-events-none">
          <h2 className="font-heading text-4xl font-bold text-white mb-4 leading-tight">Stream the experience globally.</h2>
          <p className="text-lg text-blue-200 font-light leading-relaxed">
            Access world-class insights and interact with the event from the comfort of your own space.
          </p>
        </div>
      </div>
    </main>
  );
}