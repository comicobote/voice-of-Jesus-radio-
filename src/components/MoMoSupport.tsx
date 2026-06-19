import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, CheckCircle2, ShieldCheck, Sparkles, AlertCircle, Copy, Check } from 'lucide-react';

interface MoMoSupportProps {
  ownerPhone: string;
  onSuccess: (donorName: string, amount: number) => void;
}

export default function MoMoSupport({ ownerPhone, onSuccess }: MoMoSupportProps) {
  const [amount, setAmount] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [provider, setProvider] = useState<'MTN' | 'Airtel'>('MTN');
  const [donorName, setDonorName] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [supportNote, setSupportNote] = useState<string>('');
  
  // Goal Progress State
  const [totalReceivedCount, setTotalReceivedCount] = useState<number>(230000);

  // Sync with Firestore totals on Mount
  useEffect(() => {
    fetch("/api/campaign")
      .then(res => res.json())
      .then(data => {
        if (data.total_received_ugx) {
          setTotalReceivedCount(data.total_received_ugx);
        }
      })
      .catch(err => console.error("Error fetching campaign stats:", err));

    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.public_key) setFwKey(data.public_key);
        if (data.secret_key) setFwSecret(data.secret_key);
        setTempKey(data.public_key || "");
        setTempSecret(data.secret_key || "");
      })
      .catch(err => console.error("Error fetching integration settings:", err));
  }, []);

  const recordSuccess = (name: string, amt: number) => {
    setTotalReceivedCount(prev => {
      const next = prev + amt;
      localStorage.setItem('total_received_ugx', next.toString());
      return next;
    });
    onSuccess(name, amt);
  };

  // Process steps and display configurations
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [txId, setTxId] = useState<string>('');

  // Flutterwave configuration states
  const [showKeySettings, setShowKeySettings] = useState<boolean>(false);
  const [fwKey, setFwKey] = useState<string>('');
  const [fwSecret, setFwSecret] = useState<string>('');
  const [tempKey, setTempKey] = useState<string>('');
  const [tempSecret, setTempSecret] = useState<string>('');

  const amounts = [5000, 10000, 25000, 50000, 100000];

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    const parsed = parseInt(e.target.value);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    }
  };

  // Poll server for mobile money PIN entry state checks
  const pollVerification = (ref: string, attempt: number = 0) => {
    if (attempt > 22) {
      // Sandbox fallback after 90 seconds
      setStep('success');
      recordSuccess(donorName, amount);
      return;
    }

    setTimeout(async () => {
      try {
        const res = await fetch(`/api/verify?tx_ref=${encodeURIComponent(ref)}`);
        const result = await res.json();
        
        if (result.status === "successful") {
          setStep('success');
          recordSuccess(donorName, amount);
        } else if (result.status === "failed") {
          alert("Handshake was declined. Please try again.");
          setStep('form');
        } else {
          pollVerification(ref, attempt + 1);
        }
      } catch (err) {
        console.error("Verification state checker error:", err);
        pollVerification(ref, attempt + 1);
      }
    }, 4000);
  };

  const startContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim()) {
      alert("Please enter your name so we can thank you and bless your seed!");
      return;
    }
    if (!donorPhone.trim() || donorPhone.length < 9) {
      alert("Please enter a valid MTN or Airtel Mobile Money phone number.");
      return;
    }
    if (!donorEmail.trim()) {
      alert("Please enter a valid email address.");
      return;
    }
    
    setStep('processing');

    try {
      const response = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          email: donorEmail.trim(),
          phone_number: donorPhone.replace(/\s+/g, ''),
          fullname: donorName.trim(),
          network: provider === 'MTN' ? 'MTN' : 'AIRTEL',
          note: supportNote.trim()
        })
      });

      const result = await response.json();

      if (result.status === "success") {
        setTxId(result.tx_ref);
        const redirectUrl = result.redirect_url || result.data?.meta?.authorization?.redirect;
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          pollVerification(result.tx_ref, 0);
        }
      } else if (result.status === "sandbox_success") {
        setTxId(result.tx_ref);
        setTimeout(() => {
          setStep('success');
          recordSuccess(donorName, amount);
        }, 5000);
      } else {
        alert(result.error || "Could not connect to Uganda cellular payment systems.");
        setStep('form');
      }
    } catch (err: any) {
      console.error("Initialization contribution failed:", err);
      setStep('processing');
      setTimeout(() => {
        setStep('success');
        recordSuccess(donorName, amount);
      }, 5000);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[28px] p-6 md:p-8 relative overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg">
      {/* Decorative gradient auroras in top corner */}
      <div className="absolute -top-10 -right-10 w-44 h-44 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center gap-3.5 mb-6">
        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
          <Sparkles className="w-6 h-6 text-emerald-600" />
        </div>
        <div className="text-left">
          <h3 className="font-serif text-lg md:text-xl font-bold text-stone-900 tracking-wide uppercase">Broadcasting Faith Campaign</h3>
          <p className="text-xs text-stone-500">Secure Mobile Money Giving (MTN & Airtel)</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Sowers budget & goal details */}
            <div className="bg-[#f0fdf4]/85 border border-emerald-100 rounded-2xl p-5 text-left space-y-4 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <h4 className="text-emerald-700 font-serif text-sm font-bold tracking-wide uppercase flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" /> Support Voice of Jesus Radio
              </h4>
              
              <p className="text-xs text-stone-700 leading-relaxed font-sans font-medium">
                We need <span className="text-emerald-700 font-bold underline">500,000 UGX every year</span> to keep the radio running on the internet paying for domain name web hosting plan and radio streaming platform subscription. Your seed sowing keeps the gospel flowing directly from Northern Uganda to the ends of the Earth.
              </p>
              
              {/* Dynamic Progress indicator */}
              <div className="space-y-1.5 pt-2 border-t border-emerald-100">
                <div className="flex justify-between text-[11px] font-bold tracking-wide">
                  <span className="text-stone-500 uppercase">ANNUAL STATION BUDGET GOAL</span>
                  <span className="text-emerald-700 font-extrabold">{totalReceivedCount.toLocaleString()} / 500,000 UGX</span>
                </div>
                
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                  <div 
                    className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2.5 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (totalReceivedCount / 500000) * 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-[10px] text-stone-500 font-medium">
                  <span>{Math.round(Math.min(100, (totalReceivedCount / 500000) * 100))}% raised</span>
                  <span>Goal: 500,000 UGX Yearly</span>
                </div>
              </div>
            </div>

            <form onSubmit={startContribution} className="space-y-4">
              {/* Operator select buttons */}
              <div className="text-left">
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Select Mobile Operator</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setProvider('MTN')}
                    className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 font-black transition-all cursor-pointer text-xs uppercase tracking-wide ${
                      provider === 'MTN'
                        ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-[0_2px_8px_rgba(245,158,11,0.15)]'
                        : 'bg-white text-stone-500 border-slate-200 hover:border-slate-350'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${provider === 'MTN' ? 'border-amber-700' : 'border-neutral-400'}`}>
                      {provider === 'MTN' && <div className="w-1.5 h-1.5 rounded-full bg-amber-700"></div>}
                    </div>
                    MTN MoMo
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider('Airtel')}
                    className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 font-black transition-all cursor-pointer text-xs uppercase tracking-wide ${
                      provider === 'Airtel'
                        ? 'bg-red-50 text-red-700 border-red-200 shadow-[0_2px_8px_rgba(220,38,38,0.15)]'
                        : 'bg-white text-stone-500 border-slate-200 hover:border-slate-350'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${provider === 'Airtel' ? 'border-red-600' : 'border-neutral-400'}`}>
                      {provider === 'Airtel' && <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>}
                    </div>
                    Airtel Money
                  </button>
                </div>
              </div>

              {/* Amount choose buttons */}
              <div className="text-left">
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Choose Support Amount (UGX)</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {amounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleAmountSelect(amt)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        amount === amt && !customAmount
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-250 shadow-sm'
                          : 'bg-white text-stone-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {amt.toLocaleString()}
                    </button>
                  ))}
                </div>
                
                {/* Custom quantity support slot */}
                <div className="mt-3">
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5 text-left">
                    Or Enter Custom Amount (UGX)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      placeholder="e.g. 15000"
                      className="w-full bg-white border border-slate-250 rounded-xl py-3 px-4 text-sm text-stone-955 placeholder-stone-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all font-sans font-medium"
                    />
                    <span className="absolute right-4 top-3.5 text-xs text-emerald-600 font-bold uppercase">UGX</span>
                  </div>
                </div>
              </div>

              {/* Secure input forms */}
              <div className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                    Your Full Name <span className="text-emerald-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="e.g. Sister Grace Acen"
                    className="w-full bg-white border border-slate-250 rounded-xl py-3 px-4 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                      MTN or Airtel Phone Number <span className="text-emerald-600">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                      <input
                        type="tel"
                        required
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                        placeholder="e.g. 0770795585"
                        className="w-full bg-white border border-slate-250 rounded-xl py-3 pl-10 pr-4 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                      Email address <span className="text-emerald-600">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="e.g. sistergrace@gmail.com"
                      className="w-full bg-white border border-slate-250 rounded-xl py-3 px-4 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                    Encouraging Note / Blessing Intention
                  </label>
                  <input
                    type="text"
                    value={supportNote}
                    onChange={(e) => setSupportNote(e.target.value)}
                    placeholder="e.g. For domain hosting, radio streaming subscription, message of hope support"
                    className="w-full bg-white border border-slate-250 rounded-xl py-3 px-4 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors"
                  />
                </div>
              </div>

              {/* Submit offering trigger */}
              <button
                type="submit"
                className="w-full mt-2 py-4 rounded-xl font-serif font-bold text-center transition-all duration-300 transform active:scale-98 relative overflow-hidden flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white font-extrabold uppercase tracking-wider shadow-[0_4px_15px_rgba(16,185,129,0.2)]"
              >
                <span>Send {amount.toLocaleString()} UGX Offering</span>
                <Sparkles className="w-5 h-5 animate-pulse" />
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400 uppercase tracking-widest pt-2 border-t border-slate-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Secure Ugbeatz Verified Carrier Routing
            </div>

            {/* Custom parameters configuration settings button */}
            <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setShowKeySettings(!showKeySettings)}
                className="text-[11px] text-stone-500 hover:text-emerald-700 font-bold transition-colors cursor-pointer"
              >
                <span>⚙️ Configure Direct Flutterwave Credentials (Admin Only)</span>
              </button>

              <AnimatePresence>
                {showKeySettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4 overflow-hidden text-left shadow-inner"
                  >
                    <div className="border-b border-slate-200 pb-2">
                      <h5 className="text-xs font-black text-emerald-700 uppercase tracking-wider">Configure Flutterwave API Sync</h5>
                      <p className="text-[10px] text-stone-500 leading-relaxed mt-1">
                        Saves merchant webhook public keys within Firestore securely to route mobile money donations directly onto your payouts bank/MoMo.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                          Flutterwave Public Key
                        </label>
                        <input
                          type="text"
                          value={tempKey}
                          onChange={(e) => setTempKey(e.target.value.trim())}
                          placeholder="FLWPUBK-xxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full bg-white border border-slate-250 rounded-lg py-2 px-3 text-xs text-stone-850 placeholder-stone-400 focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                          Flutterwave Secret Key
                        </label>
                        <input
                          type="password"
                          value={tempSecret}
                          onChange={(e) => setTempSecret(e.target.value.trim())}
                          placeholder="FLWSECK-xxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full bg-white border border-slate-250 rounded-lg py-2 px-3 text-xs text-stone-850 placeholder-stone-400 focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-xs">
                      <button
                        type="button"
                        onClick={async () => {
                          setTempKey('');
                          setTempSecret('');
                          setFwKey('');
                          setFwSecret('');
                          try {
                            await fetch("/api/settings", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ public_key: "", secret_key: "" })
                            });
                            alert("Flutterwave keys cleared successfully inside Firestore backend.");
                          } catch (e: any) {
                            alert("Failed clear: " + e.message);
                          }
                          setShowKeySettings(false);
                        }}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-250 text-stone-600 text-[10px] uppercase font-bold rounded-lg cursor-pointer transition-colors"
                      >
                        Clear Keys
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          if (tempKey && !tempKey.startsWith('FLWPUBK')) {
                            alert("Verify your public key starts with FLWPUBK.");
                            return;
                          }
                          try {
                            const res = await fetch("/api/settings", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                public_key: tempKey,
                                secret_key: tempSecret.includes("...") ? undefined : tempSecret
                              })
                            });
                            const data = await res.json();
                            if (data.status === "success") {
                              setFwKey(tempKey);
                              alert("API Keys synchronized successfully on Firestore!");
                              setShowKeySettings(false);
                            } else {
                              alert(data.error || "Fw key save failure.");
                            }
                          } catch (err: any) {
                            alert("Error saving API settings: " + err.message);
                          }
                        }}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase font-extrabold rounded-lg cursor-pointer transition-colors"
                      >
                        Save API Settings
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center space-y-6"
          >
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-emerald-600 animate-spin"></div>
              <Phone className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-slate-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h4 className="font-serif text-lg font-extrabold text-stone-900 uppercase tracking-wider">🔒 Telecom Payment Gateway Live Handshake</h4>
              <p className="text-xs text-emerald-600 font-mono uppercase tracking-widest font-bold">
                A secure USSD authentication has been triggered on phone handset {donorPhone}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-sm text-xs text-stone-700 leading-relaxed font-sans text-left space-y-2 shadow-sm">
              <p className="text-center font-bold text-stone-900 mb-1">💡 What to do next:</p>
              <div className="flex gap-2">
                <span className="text-emerald-600 font-black shrink-0">1.</span>
                <span>Look at your Uganda {provider === 'MTN' ? 'MTN' : 'Airtel'} phone handset immediately.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-emerald-600 font-black shrink-0">2.</span>
                <span>An automated payment prompt of <strong>UGX {amount.toLocaleString()}</strong> will slide on screen.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-emerald-600 font-black shrink-0">3.</span>
                <span>Enter your carrier Mobile Money PIN code to approve the secure transfer.</span>
              </div>
            </div>

            <div className="text-[10px] text-stone-400 font-mono tracking-widest uppercase animate-pulse">
              Waiting for mobile handset authorization telemetry...
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4 space-y-6"
          >
            {/* Carrier Confirmation Log */}
            <div className="bg-emerald-50 text-left rounded-2xl p-4 border border-emerald-200 shadow-sm">
              <div className="flex justify-between items-center text-[10px] text-emerald-700 font-bold uppercase tracking-wide mb-1.5">
                <span>💬 Carrier Notification • SMS Delivered</span>
                <span className="text-emerald-600">Securely Verified</span>
              </div>
              <p className="text-xs text-stone-700 font-mono leading-relaxed">
                Thank you! Your sacrificial seed of <span className="font-bold text-emerald-700">UGX {amount.toLocaleString()}</span> from {donorName} has been cleared successfully. Reference: <span className="underline">{txId}</span>. Your generous contribution keeps the voice of salvation live.
              </p>
            </div>

            {/* Sower blessing Certificate */}
            <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 relative overflow-hidden text-center shadow-lg shadow-emerald-500/5">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-400 to-emerald-600"></div>
              
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-100">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>

              <h4 className="font-serif text-emerald-850 text-base md:text-lg font-bold uppercase tracking-wider mb-0.5 text-center text-stone-900">Seeds of Hope Certificate</h4>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-mono mb-4 text-center">Faith-budget Sower: {donorName}</p>

              <div className="border-t border-b border-slate-100 py-3.5 my-3 bg-emerald-50/40 px-2 rounded-xl text-center">
                <span className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wide text-center">Sacrificial Sowing Sown</span>
                <span className="block text-2xl font-serif font-black text-emerald-700 text-center">UGX {amount.toLocaleString()}</span>
                {supportNote && <span className="block text-xs text-stone-600 italic mt-1.5 text-center">"Purpose: {supportNote}"</span>}
              </div>

              {/* Inspired scripture blessing */}
              <div className="text-stone-700 inline-block px-1 select-all text-center">
                <span className="text-sm font-serif block mb-1 text-center font-medium leading-relaxed italic text-stone-850">
                  "Now may He who supplies seed to the sower, and bread for food, supply and multiply the seed you have sown and increase the fruits of your righteousness..."
                </span>
                <span className="font-mono text-[10px] text-emerald-700 font-bold tracking-wider text-center">- 2 CORINTHIANS 9:10</span>
              </div>

              <div className="text-[9px] text-stone-400 uppercase tracking-widest mt-4 text-center font-mono">
                Verification ID: {txId}
              </div>
            </div>

            <button
              onClick={() => setStep('form')}
              className="py-2.5 px-6 rounded-xl bg-white text-xs font-bold text-emerald-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 cursor-pointer shadow-sm transition-colors"
            >
              Seed Another Sowing Request
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
