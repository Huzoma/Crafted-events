"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAttendee, getDashboardStats } from "@/lib/actions";
import { Ticket, User, Mail, Phone, ArrowRight, Loader2, AlertTriangle, MonitorPlay, ArrowLeft, MapPin } from "lucide-react";
import Image from "next/image";

export default function PhysicalRegistration() {
  const router = useRouter();
  
  // UI States
  const [isCheckingCapacity, setIsCheckingCapacity] = useState(true);
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  // 1. Check Capacity on Mount
  useEffect(() => {
    let isMounted = true;

    async function checkCapacity() {
      const res = await getDashboardStats();
      if (isMounted && res.success) {
        if (res.stats.totalPhysical >= 150) {
          setIsSoldOut(true);
        }
        setIsCheckingCapacity(false);
      }
    }

    checkCapacity();
    return () => { isMounted = false; };
  }, []);

  // 2. Handle Form Submission
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("email", formData.email);
    submitData.append("phone", formData.phone);
    submitData.append("ticketType", "PHYSICAL");

    const result = await registerAttendee(submitData);

    if (result.success) {
      router.push(`/register/success?id=${result.qrCodeId}`);
    } else {
      setErrorMsg(result.error);
      setIsLoading(false);
    }
  }

  // --- UI RENDER: Loading State ---
  if (isCheckingCapacity) {
    return (
      <main className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-slate-50">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Verifying ticket availability...</p>
      </main>
    );
  }

  return (
    // Main container is now a grid split 50/50 on large screens
    <main className="min-h-screen grid lg:grid-cols-2 bg-[#09090B]">
      
      {/* --- LEFT PANEL: Image, Blue Overlay, and Sophisticated Text --- */}
      {/* Hidden on mobile, flex on large screens */}
      <div className="relative hidden lg:flex flex-col justify-end p-16 bg-[url('/physical-1.jpg')] bg-cover bg-center overflow-hidden">
        {/* The Theme Overlay: Blends deep blue into the image */}
        <div className="absolute inset-0 bg-blue-950/70 mix-blend-multiply" />
        
        {/* Sophisticated Content */}
        <div className="relative z-10 text-white space-y-4">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 mb-6">
            <MapPin className="w-6 h-6 text-blue-200" />
          </div>
          <h2 className="text-4xl font-heading font-bold leading-tight">
            Experience the excellence <br/> in person.
          </h2>
          <p className="text-blue-200 text-lg max-w-md leading-relaxed font-light">
            Immerse yourself in the atmosphere, connect with fellow attendees, and witness the craft live. Secure your exclusive physical pass today.
          </p>
        </div>
      </div>

      {/* --- RIGHT PANEL: The Registration Form --- */}
      <div className="flex items-center justify-center p-6 relative">
        
        {/* Back Button positioned relative to the right panel */}
        <Link 
          href="/" 
          className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-20 font-medium text-sm"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl shadow-2xl relative z-10 overflow-hidden mt-12 lg:mt-0">
          
          {/* Decorative background glow for the card */}
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/10 blur-[60px] rounded-full pointer-events-none" />

          <div className="flex justify-center mb-6 relative z-10">
            <Image src="/logo-CEX.png" alt="Crafted Excellence Logo" width={48} height={48} className="object-contain rounded-xl" />
          </div>

          {/* --- UI RENDER: Sold Out State --- */}
          {isSoldOut ? (
            <div className="text-center relative z-10">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="text-3xl font-heading font-bold mb-3">Sold Out!</h1>
              <p className="text-slate-400 mb-8 leading-relaxed">
                We are incredibly humbled by the response. All 150 physical seats have been claimed. 
              </p>
              <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl mb-6 text-left">
                <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                  <MonitorPlay className="w-5 h-5" /> Don&apos;t miss out!
                </h3>
                <p className="text-sm text-slate-300">
                  You can still experience the entire event live from anywhere in the world. Claim your free virtual pass now.
                </p>
              </div>
              <Link 
                href="/register/virtual"
                className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-[0.98]"
              >
                Get Virtual Pass
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            
            /* --- UI RENDER: Active Registration Form --- */
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-heading font-bold mb-2">Secure Your Seat</h1>
                <p className="text-slate-400 text-sm">Join us live in-person for Crafted for Excellence.</p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-medium text-slate-400 ml-1 mb-1 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Uzoma Iyke Tobe" 
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#09090B]/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder-slate-600" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 ml-1 mb-1 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="uzo@example.com" 
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#09090B]/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder-slate-600" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 ml-1 mb-1 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+234 814 000 0000" 
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#09090B]/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder-slate-600" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-white text-black rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Ticket className="w-5 h-5" />
                      Claim Physical Ticket
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}