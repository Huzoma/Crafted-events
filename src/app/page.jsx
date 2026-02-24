import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MonitorPlay, Ticket, Calendar, MapPin, Aperture } from "lucide-react";

export default function LandingPage() {
  return (
    // Deep dark background stays to make your brand's blue pop
    <main className="min-h-screen bg-[#09090B] text-slate-50 overflow-hidden relative selection:bg-blue-500/30">
      
      {/* Brand-Aligned Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-800/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation Area */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        {/* Added font-heading here for the logo text */}
        <Link href="/" className="text-xl font-heading font-bold tracking-tighter flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image 
            src="/logo-CEX.png" 
            alt="Crafted Excellence Logo" 
            width={28} 
            height={28} 
            className="object-contain rounded-md" 
          />
          Crafted<span className="text-slate-500">Excellence</span>
        </Link>
        <Link href="/admin/host/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Admin Login
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* LEFT COLUMN: The Copy & Buttons */}
        <div className="flex flex-col items-start text-left">
          
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Registration is Live
          </div>

          {/* Added font-heading here for the massive headline */}
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Extraordinary <br />
            events <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-700">start here.</span>
          </h1>
          
          <p className="text-lg text-slate-400 mb-10 max-w-lg leading-relaxed font-light">
            Join the premier gathering of innovators. Secure your spot to experience world-class insights—whether you are joining us in Lagos or streaming live globally.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Primary Button */}
            <Link 
              href="/register/physical" 
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-slate-200 transition-all hover:scale-105 active:scale-95"
            >
              Get Physical Ticket
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            {/* Secondary Button */}
            <Link 
              href="/register/virtual" 
              className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800/50 border border-slate-700 text-white rounded-full font-semibold hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
            >
              Register for Virtual
              <MonitorPlay className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: The Visual Element */}
        <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center">
          
          {/* The Outer Container */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center backdrop-blur-sm">
            
            {/* The Floating Glass Ticket */}
            <div className="relative z-10 w-3/4 max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 ease-out">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="text-xs text-blue-300 font-bold tracking-widest uppercase mb-1">VIP Pass</div>
                  {/* Kept this standard font for readability on the ticket */}
                  <div className="text-xl font-bold text-white">Crafted for Excellence</div>
                </div>
                <Ticket className="w-8 h-8 text-blue-400" />
              </div>
              
              <div className="space-y-5 mb-10">
                <div className="flex items-center gap-4 text-slate-300 text-sm">
                  <div className="p-2 bg-white/5 rounded-lg"><Calendar className="w-4 h-4" /></div>
                  <span>October 24, 2026</span>
                </div>
                <div className="flex items-center gap-4 text-slate-300 text-sm">
                  <div className="p-2 bg-white/5 rounded-lg"><MapPin className="w-4 h-4" /></div>
                  <span>Lagos, Nigeria</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="text-xs text-slate-400 uppercase tracking-widest">Admit One</div>
                {/* Simulated Barcode */}
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-white/30 rounded-full" />
                  <div className="w-2 h-4 bg-white/50 rounded-full" />
                  <div className="w-1 h-4 bg-white/30 rounded-full" />
                  <div className="w-3 h-4 bg-blue-500 rounded-full animate-pulse" />
                  <div className="w-1 h-4 bg-white/30 rounded-full" />
                </div>
              </div>
            </div>

            {/* Subtle inner blue glowing orbs behind the ticket */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full" />
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-800/20 blur-3xl rounded-full" />
          </div>
        </div>

      </section>
    </main>
  );
}