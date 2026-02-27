import Link from "next/link";
import Image from "next/image";
import { MapPin, Globe, ArrowRight, Calendar, ShieldCheck, ScanLine } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-[100dvh] bg-[#09090B] text-slate-50 overflow-hidden relative selection:bg-blue-500/30 flex flex-col">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-blue-600/10 blur-[100px] sm:blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-purple-600/10 blur-[100px] sm:blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(to right, white 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

      {/* Top Navigation */}
      <nav className="relative z-10 flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 lg:px-12 max-w-7xl mx-auto w-full gap-4 sm:gap-0">
        <div className="flex items-center gap-3">
          <Image src="/logo-CEX.png" alt="Crafted Excellence Logo" width={36} height={36} className="object-contain rounded-xl sm:w-[40px] sm:h-[40px]" />
          <span className="text-lg sm:text-xl font-heading font-bold tracking-tight">Crafted<span className="text-slate-500">Excellence</span></span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>October 24, 2026</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-6xl mx-auto my-8 sm:my-0">
        
        {/* Hero Typography */}
        <div className="text-center max-w-3xl mb-10 sm:mb-16 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-medium mb-2 sm:mb-4">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 animate-pulse" />
            Registration Now Open
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold tracking-tighter leading-[1.15] sm:leading-[1.1]">
            Where craft meets <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">absolute mastery.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-400 font-light leading-relaxed px-2 sm:px-0">
            Join industry leaders and visionaries for an exclusive day of innovation, design, and elite networking. Choose your experience below.
          </p>
        </div>

        {/* The Gateway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl">
          
          {/* Physical Pass Card */}
          <Link href="/register/physical" className="group relative bg-[#111113] border border-white/5 rounded-[2rem] p-6 sm:p-8 hover:border-blue-500/30 transition-all hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] overflow-hidden flex flex-col h-full text-center sm:text-left items-center sm:items-start">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[40px] rounded-full group-hover:bg-blue-500/20 transition-colors pointer-events-none" />
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 mb-5 sm:mb-6 text-blue-400 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Physical Pass</h2>
            <p className="text-sm sm:text-base text-slate-400 mb-6 sm:mb-8 flex-1 leading-relaxed">
              Experience the energy in person. Secure your seat at the venue, network directly with speakers, and enjoy exclusive physical access.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-blue-400 font-bold mt-auto group-hover:gap-4 transition-all text-sm sm:text-base">
              Claim Physical Ticket <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </Link>

          {/* Virtual Pass Card */}
          <Link href="/register/virtual" className="group relative bg-[#111113] border border-white/5 rounded-[2rem] p-6 sm:p-8 hover:border-purple-500/30 transition-all hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] overflow-hidden flex flex-col h-full text-center sm:text-left items-center sm:items-start">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[40px] rounded-full group-hover:bg-purple-500/20 transition-colors pointer-events-none" />
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 mb-5 sm:mb-6 text-purple-400 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Virtual Pass</h2>
            <p className="text-sm sm:text-base text-slate-400 mb-6 sm:mb-8 flex-1 leading-relaxed">
              Stream the entire event live from anywhere in the world in stunning high definition. Join the global community chat.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-purple-400 font-bold mt-auto group-hover:gap-4 transition-all text-sm sm:text-base">
              Claim Virtual Pass <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </Link>

        </div>
      </div>

      {/* Stealth Admin Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs font-medium text-slate-600">
          <p className="text-center sm:text-left">© 2026 Crafted Excellence. All rights reserved.</p>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/admin/scanner/login" className="flex items-center gap-1.5 sm:gap-2 hover:text-slate-300 transition-colors">
              <ScanLine className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Volunteer Scanner
            </Link>
            <Link href="/admin/host/login" className="flex items-center gap-1.5 sm:gap-2 hover:text-slate-300 transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Host Portal
            </Link>
          </div>
        </div>
      </footer>

    </main>
  );
}