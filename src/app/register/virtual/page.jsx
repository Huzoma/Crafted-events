"use client";

import { useState } from "react";
import Link from "next/link";
import QRCode from "react-qr-code";
import { registerAttendee } from "@/lib/actions";
import { Ticket, User, Mail, Phone, Loader2, ArrowLeft, Globe, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function VirtualRegistration() {
  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successId, setSuccessId] = useState(null); 

  // Form State
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  // Handle Form Submission
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("email", formData.email);
    submitData.append("phone", formData.phone);
    submitData.append("ticketType", "VIRTUAL"); 

    const result = await registerAttendee(submitData);

    if (result.success) {
      setSuccessId(result.qrCodeId);
    } else {
      setErrorMsg(result.error);
    }
    setIsLoading(false);
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-[#09090B]">
      
      {/* --- LEFT PANEL: Image, Blue Overlay, and Sophisticated Text --- */}
      <div className="relative hidden lg:flex flex-col justify-end p-16 bg-[url('/virtual-1.jpg')] bg-cover bg-center overflow-hidden">
        <div className="absolute inset-0 bg-blue-950/70 mix-blend-multiply" />
        
        <div className="relative z-10 text-white space-y-4">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 mb-6">
            <Globe className="w-6 h-6 text-blue-200" />
          </div>
          <h2 className="text-4xl font-heading font-bold leading-tight">
            Join the experience <br/> from anywhere.
          </h2>
          <p className="text-blue-200 text-lg max-w-md leading-relaxed font-light">
            Tune in to the live broadcast, connect with a global community, and experience the craft from the comfort of your home. Claim your free virtual pass today.
          </p>
        </div>
      </div>

      {/* --- RIGHT PANEL: The Registration Form --- */}
      <div className="flex items-center justify-center p-6 relative">
        
        <Link 
          href="/" 
          className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 group-hover:gap-4 hover:text-white transition-all z-20 font-medium text-sm"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl shadow-2xl relative z-10 overflow-hidden mt-12 lg:mt-0">
          
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-600/10 blur-[60px] rounded-full pointer-events-none" />

          {successId ? (
            /* --- UI RENDER: INLINE SUCCESS TICKET --- */
            <div className="text-center relative z-10 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              
              <h1 className="text-2xl font-heading font-bold mb-2 text-white">Pass Secured!</h1>
              <p className="text-slate-400 mb-6 text-sm px-2">
                Your virtual pass is active. A copy has also been sent to <strong className="text-slate-200">{formData.email}</strong>.
              </p>

              <div className="bg-white p-6 rounded-3xl mx-auto inline-block shadow-2xl mb-6 relative border-4 border-slate-200">
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#18181b] rounded-full border-r border-slate-200"></div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#18181b] rounded-full border-l border-slate-200"></div>
                
                <div className="flex justify-center mb-4">
                  <Image src="/logo-CEX.png" alt="Crafted Excellence Logo" width={32} height={32} className="object-contain" />
                </div>
                
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mb-4">Virtual Pass</p>
                
                <div className="bg-white p-2">
                  <QRCode value={successId} size={160} style={{ height: "auto", maxWidth: "100%", width: "100%" }} viewBox={`0 0 256 256`} />
                </div>
                <p className="text-slate-400 font-mono text-[10px] mt-4 tracking-widest truncate max-w-[160px]">{successId}</p>
              </div>

              <button onClick={() => window.location.reload()} className="w-full flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all">
                Register Another Attendee
              </button>
            </div>
          ) : (
            /* --- UI RENDER: Active Registration Form --- */
            <div className="relative z-10">
              <div className="flex justify-center mb-6 relative z-10">
                <Image src="/logo-CEX.png" alt="Crafted Excellence Logo" width={48} height={48} className="object-contain rounded-xl" />
              </div>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-heading font-bold mb-2">Claim Virtual Pass</h1>
                <p className="text-slate-400 text-sm">Register to stream Crafted for Excellence live.</p>
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
                      Claim Virtual Pass
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