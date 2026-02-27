"use client";

import { useState } from "react";
import { Scanner } from '@yudiel/react-qr-scanner';
import { processScannedTicket } from "@/lib/actions"; // Corrected Import
import { CheckCircle, XCircle, AlertTriangle, ScanLine, RotateCcw } from "lucide-react";

export default function ScannerDashboard() {
  const [scanResult, setScanResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleScan(detectedCodes) {
    // Lock the scanner so we don't spam the database with multiple requests
    if (isProcessing || scanResult || detectedCodes.length === 0) return;
    
    setIsProcessing(true);
    const rawQrCodePayload = detectedCodes[0].rawValue;

    // Send the scanned code to our correct Server Action
    const result = await processScannedTicket(rawQrCodePayload); // Corrected Function Call
    setScanResult(result);
    setIsProcessing(false);
  }

  function resetScanner() {
    setScanResult(null);
  }

  return (
    <main className="min-h-screen bg-[#09090B] text-slate-50 flex flex-col items-center py-12 px-6">
      
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="font-heading text-3xl font-bold flex items-center justify-center gap-3">
          <ScanLine className="text-blue-500 w-8 h-8" />
          Access Control
        </h1>
        <p className="text-slate-400 text-sm mt-2">Position the QR code inside the frame.</p>
      </div>

      {/* Camera Viewport */}
      <div className="w-full max-w-md bg-black rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl relative aspect-[4/5]">
        {!scanResult ? (
          <Scanner 
            onScan={handleScan} 
            onError={(error) => console.error(error?.message)}
            components={{ tracker: true, audio: false }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#09090B] z-10 animate-in fade-in zoom-in duration-300">
            
            {/* Dynamic Status UI based on the database response */}
            {scanResult.status === "VALID" && (
              <>
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-green-400 mb-2">ADMIT ONE</h2>
                <p className="text-xl font-medium mb-1">{scanResult.name}</p>
                <p className="text-slate-400 mb-8">{scanResult.message}</p>
              </>
            )}

            {scanResult.status === "ALREADY_USED" && (
              <>
                <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6">
                  <AlertTriangle className="w-12 h-12 text-yellow-500" />
                </div>
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">ALREADY SCANNED</h2>
                <p className="text-xl font-medium mb-1">{scanResult.name}</p>
                <p className="text-slate-400 mb-8">{scanResult.message}</p>
              </>
            )}

            {scanResult.status === "INVALID" && (
              <>
                <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                  <XCircle className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-3xl font-bold text-red-400 mb-2">INVALID TICKET</h2>
                <p className="text-slate-400 mb-8">{scanResult.message}</p>
              </>
            )}

            <button 
              onClick={resetScanner}
              className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              Scan Next Guest
            </button>
          </div>
        )}

        {/* Loading Overlay while talking to Supabase */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-blue-400 font-medium animate-pulse">Verifying...</p>
            </div>
          </div>
        )}
      </div>

    </main>
  );
}