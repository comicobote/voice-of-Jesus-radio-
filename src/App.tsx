import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Phone, Share2, Award, Calendar, Volume2, MessageSquare, 
  Sparkles, Globe, Sun, ArrowRight, ArrowLeft, Plus, Check, Play, Copy, Ear,
  BookOpen, Compass, Mail, MapPin, Send, HelpCircle, ChevronRight, Menu, X, Radio
} from 'lucide-react';

import { BibleVerse, RadioProgram } from './types';
import { BIBLE_VERSES, RADIO_SCHEDULE } from './data/radioData';
import RadioPlayer from './components/RadioPlayer';
import MoMoSupport from './components/MoMoSupport';

// Image imports
import celestialCross from './assets/images/celestial_cross_1781890462658.jpg';
import stainedGlass from './assets/images/stained_glass_1781890476699.jpg';
import prayerGlow from './assets/images/prayer_glow_1781890490579.jpg';
import jesusCross from './assets/images/jesus_cross_1781898756674.jpg';

export default function App() {
  const WHATSAPP_LINK = "https://wa.me/256770795585?text=Hello%20Voice%20Of%20Jesus%20Radio,%20I'm%20listening%20live%20and%20I%20have%20a%20blessing/song%20request:";
  const PHONE_CALL = "tel:0769302480";

  // Sidebar navigation and view tabs
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'contact' | 'testimonies' | 'journal'>('home');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // State Management
  const [activeVerseCategory, setActiveVerseCategory] = useState<string>('all');
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number>(0);
  const [isCarouselPlaying, setIsCarouselPlaying] = useState<boolean>(true);
  const [heroSlideIndex, setHeroSlideIndex] = useState<number>(0);
  
  // Testimonies Praise Wall
  const [testimonies, setTestimonies] = useState<any[]>([
    {
      id: "t1",
      name: "Sister Apophia Acen",
      location: "Lira, Uganda",
      content: "I want to praise Jesus! After listening to Pastor Adoko's prayer for healing, my severe joint pains of 3 years vanished completely. The doctors were surprised!",
      hallelujahs: 73,
      timestamp: "2 days ago"
    },
    {
      id: "t2",
      name: "Brother Denis Okello",
      location: "Oyam District",
      content: "Glory to Jesus Christ on the cross! Our family farm has overcome severe drought. This week we received abundant rain and we praise God for His favor!",
      hallelujahs: 52,
      timestamp: "8 hours ago"
    },
    {
      id: "t3",
      name: "Evangelist Isaac Ayella",
      location: "Gulu, Uganda",
      content: "While listening directly to the night hymns broadcast, my relatives gave their lives to Jesus Christ. He is of a truth the way!",
      hallelujahs: 94,
      timestamp: "2 hours ago"
    }
  ]);

  const [newTestimonyName, setNewTestimonyName] = useState<string>('');
  const [newTestimonyLocation, setNewTestimonyLocation] = useState<string>('');
  const [newTestimonyContent, setNewTestimonyContent] = useState<string>('');
  const [showAddTestimonyForm, setShowAddTestimonyForm] = useState<boolean>(false);
  const [testimonySearchQuery, setTestimonySearchQuery] = useState<string>('');

  // Interactive Sermon Notebook
  const [journalNote, setJournalNote] = useState<string>('');
  const [journalList, setJournalList] = useState<Array<{id: string, date: string, verse: string, note: string}>>([
    {
      id: "j1",
      date: "Today",
      verse: "John 10:10",
      note: "Sermon took place during 'Morning Devotional'. It was a reminder that through Christ, we are gifted an abundant, flourishing life, free of spiritual anxiety. Must share with Aunt Sarah."
    }
  ]);
  const [selectedJournalVerse, setSelectedJournalVerse] = useState<string>("John 3:16");

  // Contact form submission
  const [contactName, setContactName] = useState<string>('');
  const [contactMessage, setContactMessage] = useState<string>('');
  const [contactSent, setContactSent] = useState<boolean>(false);

  // Recent support offerings roster (for dashboard display)
  const [recentDonations, setRecentDonations] = useState<Array<{name: string, amount: number, time: string}>>([
    { name: "Sister Agnes Apio", amount: 20000, time: "Just now" },
    { name: "Brother Innocent Ayella", amount: 10000, time: "22 mins ago" },
    { name: "Pastor Alfred Ocen", amount: 50000, time: "1 hour ago" },
    { name: "Faith Prayer Fellowship", amount: 150000, time: "3 hours ago" }
  ]);

  // Console broadcast logger
  const [broadcastConsoleLogs, setBroadcastConsoleLogs] = useState<string[]>([
    "🛰️ Satellite transmission receiver standard active.",
    "🎧 Voice Of Jesus Radio - Serving healing to thousands daily."
  ]);

  const [copiedVerseId, setCopiedVerseId] = useState<number | null>(null);

  // Rotating background slider with powerful imagery and scriptures
  const sliderImages = [
    { 
      img: jesusCross, 
      quote: "He Himself bore our sins in His own body on the tree, that we, having died to sins, might live for righteousness—by whose stripes you were healed.", 
      citation: "1 Peter 2:24",
      title: "AMBULANCE FOR SOULS",
      subtitle: "The ultimate price was paid for your eternal liberty."
    },
    { 
      img: celestialCross, 
      quote: "But those who wait on the Lord shall renew their strength; they shall mount up with wings like eagles, they shall run and not be weary, they shall walk and not faint.", 
      citation: "Isaiah 40:31",
      title: "A VOICE IN THE WILDERNESS",
      subtitle: "Your strength is being supernaturally restored."
    },
    { 
      img: stainedGlass, 
      quote: "I am the way, the truth, and the life. No one comes to the Father except through Me.", 
      citation: "John 14:6",
      title: "FOUNDATION OF FAITH",
      subtitle: "He is the light that directs through every shadow."
    },
    { 
      img: prayerGlow, 
      quote: "And my God shall supply all your need according to His riches in glory by Christ Jesus.", 
      citation: "Philippians 4:19",
      title: "COVENANT BREAKTHROUGH",
      subtitle: "The Lord is our ultimate and faithful Shepherd."
    }
  ];

  // Load Real-time Testimonies on Mount
  useEffect(() => {
    fetch("/api/testimonies")
      .then(res => res.json())
      .then(data => {
        if (data.testimonies && data.testimonies.length > 0) {
          setTestimonies(data.testimonies);
        }
      })
      .catch(err => console.error("Error loading testimonies from server:", err));

    // Load local journal items if they exist
    const cachedJournal = localStorage.getItem('voj_daily_journal');
    if (cachedJournal) {
      setJournalList(JSON.parse(cachedJournal));
    }
  }, []);

  // Save journal notes helper
  const handleSaveJournalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalNote.trim()) return;

    const payload = {
      id: "j-" + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      verse: selectedJournalVerse,
      note: journalNote.trim()
    };

    const updatedJournal = [payload, ...journalList];
    setJournalList(updatedJournal);
    localStorage.setItem('voj_daily_journal', JSON.stringify(updatedJournal));
    setJournalNote('');
    addConsoleMessage(`📝 Devotional Bible entry stored successfully in your personal journal.`);
  };

  // Delete journal entry
  const handleDeleteJournal = (id: string) => {
    const nextList = journalList.filter(item => item.id !== id);
    setJournalList(nextList);
    localStorage.setItem('voj_daily_journal', JSON.stringify(nextList));
  };

  // Auto Slider for Hero Background Banner
  useEffect(() => {
    const sliderInterval = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % sliderImages.length);
    }, 8000);
    return () => clearInterval(sliderInterval);
  }, [sliderImages.length]);

  // Filter verses
  const filteredVerses = activeVerseCategory === 'all' 
    ? BIBLE_VERSES 
    : BIBLE_VERSES.filter(v => v.category === activeVerseCategory);

  // Auto Scripture rotational tick
  useEffect(() => {
    if (!isCarouselPlaying) return;
    const interval = setInterval(() => {
      setCurrentVerseIndex((prev) => (prev + 1) % filteredVerses.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [isCarouselPlaying, filteredVerses.length]);

  // Ensure currentVerseIndex doesn't overshoot after filter changes
  useEffect(() => {
    setCurrentVerseIndex(0);
  }, [activeVerseCategory]);

  const handleNextVerse = () => {
    setCurrentVerseIndex((prev) => (prev + 1) % filteredVerses.length);
  };

  const handlePrevVerse = () => {
    setCurrentVerseIndex((prev) => (prev - 1 + filteredVerses.length) % filteredVerses.length);
  };

  const handleCopyVerse = (verse: BibleVerse) => {
    const textToCopy = `"${verse.text}" - ${verse.reference} | Voice Of Jesus Radio`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedVerseId(verse.id);
    setTimeout(() => setCopiedVerseId(null), 2000);
  };

  // Sound-out / TTS reading
  const handleTTSRead = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech isn't supported on this browser.");
    }
  };

  const addConsoleMessage = (msg: string) => {
    setBroadcastConsoleLogs(prev => [msg, ...prev.slice(0, 4)]);
  };

  // Handle donation receipt success
  const handleDonationReceiptSuccess = (donorName: string, amount: number) => {
    const newDonation = {
      name: donorName,
      amount,
      time: "Just now"
    };
    setRecentDonations([newDonation, ...recentDonations]);
    addConsoleMessage(`💰 Blessed Contribution of UGX ${amount.toLocaleString()} received from ${donorName}!`);
  };

  // Testimony submission
  const handleAddTestimonySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonyName.trim() || !newTestimonyContent.trim()) {
      alert("Please enter both your name and testimony description.");
      return;
    }

    try {
      const response = await fetch("/api/testimonies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTestimonyName.trim(),
          location: newTestimonyLocation.trim() || "Lira, Uganda",
          content: newTestimonyContent.trim()
        })
      });

      const data = await response.json();
      if (data.status === "success") {
        setTestimonies([data.testimony, ...testimonies]);
        setNewTestimonyName('');
        setNewTestimonyLocation('');
        setNewTestimonyContent('');
        setShowAddTestimonyForm(false);
        addConsoleMessage(`🙌 God is glorified! A new testament of faith from ${data.testimony.name} was registered.`);
      } else {
        alert(data.error || "Failed to submit testimony.");
      }
    } catch (err) {
      // Offline fallback
      const localTestimony = {
        id: "ltest-" + Date.now(),
        name: newTestimonyName.trim(),
        location: newTestimonyLocation.trim() || "Lira, Uganda",
        content: newTestimonyContent.trim(),
        hallelujahs: 1,
        timestamp: "Just now"
      };
      setTestimonies([localTestimony, ...testimonies]);
      setNewTestimonyName('');
      setNewTestimonyLocation('');
      setNewTestimonyContent('');
      setShowAddTestimonyForm(false);
      addConsoleMessage(`🙌 God is glorified! Registered praise testimonial locally.`);
    }
  };

  // Hallelujah click handler
  const handleHallelujahIncrement = async (id: string, name: string) => {
    setTestimonies(testimonies.map(t => t.id === id ? { ...t, hallelujahs: (t.hallelujahs ?? 0) + 1 } : t));
    addConsoleMessage(`🔥 Hallelujah! Believers praised God with ${name}'s testimony.`);

    try {
      await fetch("/api/testimonies/hallelujah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
    } catch (e) {
      console.error("Hallelujah sync failed:", e);
    }
  };

  // Direct mock contact dispatch
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMessage.trim()) return;

    setContactSent(true);
    addConsoleMessage(`📞 Broadcast Message dispatched from ${contactName} to our studio desk!`);
    setTimeout(() => {
      setContactName('');
      setContactMessage('');
      setContactSent(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans selection:bg-emerald-600 selection:text-white flex flex-col md:flex-row relative">

      {/* FIXED LEFT SIDEBAR DIRECTORY (DESKTOP) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 shrink-0 z-10" id="sidebar-panel">
        
        {/* Brand identity badge */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="relative w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-serif font-bold shadow-md shadow-emerald-600/20">
            <span className="text-lg">†</span>
          </div>
          <div className="text-left">
            <h1 className="font-serif text-sm font-bold tracking-tight text-stone-900 uppercase">Voice Of Jesus</h1>
            <p className="text-[10px] text-emerald-700 font-extrabold tracking-widest uppercase">RADIO STATION</p>
          </div>
        </div>

        {/* Dynamic Navigation directory */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button 
            onClick={() => { setActiveTab('home'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 shadow-sm'
                : 'text-stone-500 hover:bg-slate-50 hover:text-stone-900'
            }`}
          >
            <Radio className="w-4 h-4 text-emerald-600" />
            <span>Live Broadcast</span>
          </button>

          <button 
            onClick={() => { setActiveTab('testimonies'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'testimonies'
                ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 shadow-sm'
                : 'text-stone-500 hover:bg-slate-50 hover:text-stone-900'
            }`}
          >
            <Heart className="w-4 h-4 text-emerald-600 fill-emerald-100" />
            <span>Praise Wall</span>
          </button>

          <button 
            onClick={() => { setActiveTab('journal'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'journal'
                ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 shadow-sm'
                : 'text-stone-500 hover:bg-slate-50 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Sermon Journal</span>
          </button>

          <button 
            onClick={() => { setActiveTab('about'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 shadow-sm'
                : 'text-stone-500 hover:bg-slate-50 hover:text-stone-900'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-600" />
            <span>About Us</span>
          </button>

          <button 
            onClick={() => { setActiveTab('contact'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 shadow-sm'
                : 'text-stone-500 hover:bg-slate-50 hover:text-stone-900'
            }`}
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Contact Us</span>
          </button>
        </nav>

        {/* 500,000 UGX Annual Budget Sidebar Warning */}
        <div className="p-4 mx-4 mb-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-left space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-800 uppercase font-serif">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
            <span>Mission Budget</span>
          </div>
          <p className="text-[10px] text-stone-600 font-medium leading-relaxed">
            We need <strong className="text-emerald-700">500,000 UGX</strong> every year to keep the radio running on the internet (domain, server plans, and streaming platform).
          </p>
          <button 
            onClick={() => { setActiveTab('home'); }}
            className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Sow Seed Now</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Operational Console logs at the base */}
        <div className="p-4 border-t border-slate-100 bg-[#f9fafb] text-left font-mono">
          <div className="text-[9px] uppercase font-bold text-stone-400 tracking-wider mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            <span>Receiver Console</span>
          </div>
          <div className="space-y-1">
            {broadcastConsoleLogs.map((log, index) => (
              <p key={index} className="text-[9px] text-stone-500 leading-normal line-clamp-2">
                {log}
              </p>
            ))}
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER BAR & HAMBURGER GATE */}
      <div className="md:hidden w-full bg-white border-b border-slate-200 sticky top-0 z-50 px-4 h-16 flex items-center justify-between" id="mobile-header">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            <span>†</span>
          </div>
          <div className="text-left font-serif">
            <h1 className="text-sm font-bold tracking-tight text-stone-900 leading-none">VOICE OF JESUS</h1>
            <p className="text-[8px] text-emerald-600 font-bold tracking-widest uppercase">Hope and Healing</p>
          </div>
        </div>

        <button 
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 text-stone-600 hover:bg-stone-50 rounded-xl cursor-pointer"
          aria-label="Open directory Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* MOBILE LEFT DRAWER OVERLAY */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden"
            ></motion.div>
            
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-white z-50 md:hidden flex flex-col justify-between shadow-2xl p-6"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      <span>†</span>
                    </div>
                    <span className="font-serif text-sm font-bold">VOICE OF JESUS</span>
                  </div>
                  <button 
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1 rounded-lg text-stone-400 hover:bg-slate-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-2">
                  <button 
                    onClick={() => { setActiveTab('home'); setIsMobileSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all text-left ${
                      activeTab === 'home' ? 'bg-emerald-50 text-emerald-700' : 'text-stone-500'
                    }`}
                  >
                    <Radio className="w-4 h-4" />
                    <span>Live Broadcast</span>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('testimonies'); setIsMobileSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all text-left ${
                      activeTab === 'testimonies' ? 'bg-emerald-50 text-emerald-700' : 'text-stone-500'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    <span>Praise Wall</span>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('journal'); setIsMobileSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all text-left ${
                      activeTab === 'journal' ? 'bg-emerald-50 text-emerald-700' : 'text-stone-500'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Sermon Journal</span>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('about'); setIsMobileSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all text-left ${
                      activeTab === 'about' ? 'bg-emerald-50 text-emerald-700' : 'text-stone-500'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>About Us</span>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('contact'); setIsMobileSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-left ${
                      activeTab === 'contact' ? 'bg-emerald-50 text-emerald-700' : 'text-stone-500'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    <span>Contact Us</span>
                  </button>
                </nav>

                {/* 500k warning slider */}
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-left space-y-2">
                  <span className="block font-serif text-[11px] font-bold text-emerald-800 uppercase">Mission Budget</span>
                  <p className="text-[10px] text-stone-600 leading-relaxed font-sans">
                    We need <strong className="text-emerald-700">500,000 UGX every year</strong> to keep this voice of hope online.
                  </p>
                </div>
              </div>

              <div className="text-[10px] text-stone-400 text-center font-mono py-2 border-t border-slate-100 leading-relaxed uppercase">
                Uganda Station Service Gate
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* RIGHT DISPLAY PORT (SCROLLABLE VIEWPORT) */}
      <div className="flex-1 min-h-screen flex flex-col justify-between overflow-x-hidden p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
        
        {/* UPPER ANNOUNCEMENT BAR */}
        <div className="bg-emerald-600 text-white py-3 px-4 rounded-2xl text-center font-extrabold text-[10px] sm:text-xs uppercase tracking-wider relative shadow-sm flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 animate-pulse text-emerald-250 shrink-0" />
          <span>
            Annual Faith Seed Portal Online • Together Sowing for 500,000 UGX Annual Internet Domain & Web Hosting Plan
          </span>
        </div>

        {/* ACTIVE MODULE CONTAINER VIEWPORT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="space-y-10"
          >
            
            {/* 1. HOME BROADCAST DASHBOARD VIEW */}
            {activeTab === 'home' && (
              <>
                {/* 1.1 ROTATIONAL CHRISTIAN SLIDESHOW & RADIO PLAYER GRID */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="hero-broadcast-deck">
                  
                  {/* LEFT: Slideshow Frame (Custom readable captions overlaid) */}
                  <div className="lg:col-span-7 rounded-[28px] overflow-hidden relative shadow-md min-h-[350px] md:min-h-[460px] flex flex-col justify-end border border-slate-200 bg-white group select-none">
                    
                    {/* Image Slide transition */}
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={heroSlideIndex}
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.95 }}
                        className="absolute inset-0"
                      >
                        {/* Soft black overlay box for guaranteed 100% white contrast readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent z-10"></div>
                        <img 
                          src={sliderImages[heroSlideIndex].img} 
                          alt="Jesus Christ Saviour of Voice of Jesus Radio" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Encapsulated overlay text (Encouraging Bible Words) */}
                    <div className="relative z-20 p-6 md:p-8 space-y-3.5 max-w-2xl bg-gradient-to-t from-black/95 via-black/50 to-transparent pt-32 text-left">
                      
                      <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 py-1 px-3 rounded-full text-emerald-400 font-serif text-[10px] font-bold tracking-widest uppercase">
                        <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                        <span>{sliderImages[heroSlideIndex].title}</span>
                      </div>

                      <div className="space-y-2">
                        <blockquote className="font-serif italic text-white text-base md:text-xl leading-relaxed tracking-wide font-medium shadow-sm">
                          "{sliderImages[heroSlideIndex].quote}"
                        </blockquote>
                        <cite className="block text-emerald-400 text-xs font-bold tracking-widest uppercase font-mono">
                          — {sliderImages[heroSlideIndex].citation}
                        </cite>
                        <p className="text-[11px] text-white/50">{sliderImages[heroSlideIndex].subtitle}</p>
                      </div>

                      {/* Dot indexes */}
                      <div className="flex gap-1.5 pt-2">
                        {sliderImages.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setHeroSlideIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-350 cursor-pointer ${
                              heroSlideIndex === idx ? 'w-8 bg-emerald-500 shadow-md shadow-emerald-500/30' : 'w-2 bg-neutral-600 hover:bg-neutral-500'
                            }`}
                            aria-label={`Show slide indices ${idx + 1}`}
                          ></button>
                        ))}
                      </div>
                    </div>

                    <div className="absolute top-6 left-6 z-20 bg-emerald-700/90 backdrop-blur-xl py-1 px-3 rounded-xl text-white font-serif text-[10px] uppercase tracking-wider font-extrabold flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      Voice Of Jesus LIVE Feed
                    </div>
                  </div>

                  {/* RIGHT: Live Music/Sermon Radio Player Box */}
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <RadioPlayer onAddBroadcastStatus={addConsoleMessage} />
                  </div>
                </section>

                {/* 1.2 ROTATIONAL BIBLE PROMISES DISCOVERY DEEP WELL */}
                <section className="bg-white rounded-[28px] border border-slate-200 p-6 md:p-8 shadow-sm relative overflow-hidden" id="bible-carousel-banner">
                  
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-100 pb-5 text-left">
                    <div>
                      <span className="text-emerald-700 font-extrabold uppercase text-[10px] tracking-widest font-mono block mb-1">SCRIPTURE EXPLORER</span>
                      <h3 className="font-serif text-lg md:text-xl font-bold text-stone-900 tracking-wide uppercase">Scriptures of Hope, Deliverance & Blessings</h3>
                      <p className="text-xs text-stone-500 mt-1 max-w-xl">
                        "For the word of God is living and powerful, and sharper than any two-edged sword..." Discover encouraging promises below.
                      </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {['all', 'salvation', 'strength', 'faith', 'healing', 'praise'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveVerseCategory(cat)}
                          className={`py-1.5 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            activeVerseCategory === cat
                              ? 'bg-emerald-600 text-white shadow-md'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Verse Display Plate */}
                  <div className="relative min-h-[145px] flex flex-col justify-between text-center px-4 sm:px-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${filteredVerses[currentVerseIndex]?.id}-${activeVerseCategory}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-4"
                      >
                        <span className="font-serif text-5xl text-emerald-600/10 block leading-none select-none h-4">“</span>
                        <h4 className="font-serif text-stone-800 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto italic font-medium">
                          {filteredVerses[currentVerseIndex]?.text}
                        </h4>
                        <cite className="block text-emerald-700 font-mono text-xs tracking-widest uppercase font-bold">
                          — {filteredVerses[currentVerseIndex]?.reference}
                        </cite>
                      </motion.div>
                    </AnimatePresence>

                    {/* Dynamic Navigation widgets */}
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-5 border-t border-slate-100 w-full gap-4 text-xs text-stone-500">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={handlePrevVerse}
                          className="bg-white hover:bg-slate-50 border border-slate-200 p-2 rounded-xl cursor-pointer"
                          aria-label="Previous scriptural segment"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 text-stone-600" />
                        </button>
                        <button 
                          onClick={handleNextVerse}
                          className="bg-white hover:bg-slate-50 border border-slate-200 p-2 rounded-xl cursor-pointer"
                          aria-label="Forward scriptural segment"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-stone-600" />
                        </button>
                      </div>

                      <button
                        onClick={() => setIsCarouselPlaying(!isCarouselPlaying)}
                        className={`py-1.5 px-3.5 rounded-full border text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                          isCarouselPlaying 
                            ? 'text-emerald-700 border-emerald-200 bg-emerald-50' 
                            : 'text-stone-500 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isCarouselPlaying ? 'bg-emerald-600 animate-pulse' : 'bg-stone-400'}`}></span>
                        <span>{isCarouselPlaying ? 'Auto Cycling' : 'Cycling Paused'}</span>
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTTSRead(filteredVerses[currentVerseIndex]?.text)}
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-stone-600 p-2.5 rounded-xl flex items-center gap-1.5 font-bold text-[10px] cursor-pointer"
                          title="Speak scriptural passage out loud"
                        >
                          <Ear className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Listen Aloud</span>
                        </button>

                        <button
                          onClick={() => handleCopyVerse(filteredVerses[currentVerseIndex])}
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-stone-600 py-2.5 px-3 rounded-xl flex items-center gap-1.5 font-bold text-[10px] cursor-pointer"
                        >
                          {copiedVerseId === filteredVerses[currentVerseIndex]?.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-stone-500" />
                              <span>Copy Seed</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 1.3 DOUBLE GRID: MOBILE MONEY PORTAL & BROADCAST LIST */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: secure MoMo Support Portal */}
                  <div className="lg:col-span-7 space-y-6">
                    <MoMoSupport 
                      ownerPhone="+256770795585" 
                      onSuccess={handleDonationReceiptSuccess} 
                    />

                    {/* Sowers feed ticker */}
                    <div className="bg-white rounded-[24px] p-6 border border-slate-200 text-left">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[11px] font-black uppercase text-stone-400 tracking-wider font-mono">Recent Sacrificial seeds</span>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {recentDonations.slice(0, 4).map((d, index) => (
                          <div key={index} className="p-3 bg-stone-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                            <div className="text-left">
                              <span className="block font-bold text-stone-850">{d.name}</span>
                              <span className="text-[10px] text-stone-500">{d.time} • Faith Partner</span>
                            </div>
                            <span className="font-extrabold text-emerald-700">+UGX {d.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Radio Program Timetable */}
                  <div className="lg:col-span-5 bg-white rounded-[28px] p-6 md:p-8 border border-slate-200 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      <div className="text-left">
                        <h4 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-widest leading-none">Broadcasting Timetable</h4>
                        <p className="text-[11px] text-stone-500 mt-1">Live Spiritual food hosted from our studio</p>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      {RADIO_SCHEDULE.map((p) => {
                        const currentHour = new Date().getHours();
                        let isHighlighted = false;
                        
                        // Approximate live show highlights
                        if (currentHour >= 5 && currentHour < 8 && p.id === 1) isHighlighted = true;
                        else if (currentHour >= 9 && currentHour < 12 && p.id === 2) isHighlighted = true;
                        else if (currentHour >= 13 && currentHour < 16 && p.id === 3) isHighlighted = true;
                        else if (currentHour >= 18 && currentHour < 21 && p.id === 4) isHighlighted = true;
                        else if ((currentHour >= 22 || currentHour < 2) && p.id === 5) isHighlighted = true;

                        return (
                          <div 
                            key={p.id}
                            className={`p-4 rounded-2xl border transition-all relative ${
                              isHighlighted 
                                ? 'bg-emerald-50/70 border-emerald-250 shadow-sm' 
                                : 'bg-white border-slate-100 hover:border-slate-200'
                            }`}
                          >
                            {isHighlighted && (
                              <span className="absolute top-3.5 right-4 text-[9px] bg-emerald-600 text-white font-extrabold py-0.5 px-2 rounded-full uppercase tracking-wider animate-pulse">
                                Live Now
                              </span>
                            )}

                            <div className="text-[10px] font-bold text-emerald-700 font-mono uppercase mb-0.5 text-left">{p.time}</div>
                            <h5 className="font-black text-xs text-stone-900 mb-0.5 text-left uppercase">{p.name}</h5>
                            <p className="text-[11px] text-stone-550 mb-1 text-left">Preacher: <span className="font-bold">{p.host}</span></p>
                            <p className="text-[11px] text-stone-605 leading-relaxed text-left italic">"{p.description}"</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </section>
              </>
            )}

            {/* 2. PRAISE & TESTING TESTIMONY WALL VIEW */}
            {activeTab === 'testimonies' && (
              <section className="bg-white border border-slate-200 rounded-[28px] p-6 md:p-8 space-y-6" id="testimony-board-panel">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="text-left">
                    <span className="font-mono text-xs uppercase text-emerald-700 font-extrabold tracking-widest block mb-0.5">🙌 HARVEST OF MIRACLES</span>
                    <h3 className="font-serif text-lg md:text-xl font-bold text-stone-900 tracking-wide uppercase">Answered Prayers & Testimony Board</h3>
                    <p className="text-xs text-stone-550">Publish your divine testimony of miracle breakthroughs, deliverance, and recovery to encourage other seekers.</p>
                  </div>

                  {/* Header widgets */}
                  <div className="flex flex-wrap items-center gap-3.5 w-full md:w-auto">
                    <input
                      type="text"
                      value={testimonySearchQuery}
                      onChange={(e) => setTestimonySearchQuery(e.target.value)}
                      placeholder="Search miracles..."
                      className="bg-stone-50 border border-slate-200 rounded-xl py-2 px-4 text-xs text-stone-900 max-w-sm focus:outline-none focus:border-emerald-600"
                    />

                    <button
                      onClick={() => setShowAddTestimonyForm(!showAddTestimonyForm)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer uppercase tracking-wider"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Write Testimony</span>
                    </button>
                  </div>
                </div>

                {/* Collapsible publish form block as required */}
                <AnimatePresence>
                  {showAddTestimonyForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-stone-50 rounded-2xl p-5 border border-slate-250 overflow-hidden text-left shadow-inner"
                    >
                      <form onSubmit={handleAddTestimonySubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">Your Name</label>
                          <input
                            type="text"
                            required
                            value={newTestimonyName}
                            onChange={(e) => setNewTestimonyName(e.target.value)}
                            placeholder="e.g. Sister Apophia Acen"
                            className="w-full bg-white border border-slate-250 rounded-xl py-2.5 px-4 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">District / Town</label>
                          <input
                            type="text"
                            value={newTestimonyLocation}
                            onChange={(e) => setNewTestimonyLocation(e.target.value)}
                            placeholder="e.g. Lira, Northern Uganda"
                            className="w-full bg-white border border-slate-250 rounded-xl py-2.5 px-4 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                          />
                        </div>

                        <div>
                          <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold uppercase tracking-wide text-xs py-3 px-4 rounded-xl shadow-sm cursor-pointer transition-colors"
                          >
                            Publish Praise Testimony
                          </button>
                        </div>

                        <div className="md:col-span-3">
                          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">Praise Description (What did Jesus do in your life?)</label>
                          <textarea
                            required
                            rows={3}
                            value={newTestimonyContent}
                            onChange={(e) => setNewTestimonyContent(e.target.value)}
                            placeholder="Type details about your miracle recovery, family reconciliation, financial breakthrough, or saved spirits. God is good!"
                            className="w-full bg-white border border-slate-250 rounded-xl py-2.5 px-4 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* MIRACLES LIST ROWS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonies
                    .filter(t => t.name.toLowerCase().includes(testimonySearchQuery.toLowerCase()) || t.content.toLowerCase().includes(testimonySearchQuery.toLowerCase()))
                    .map((t) => (
                      <div key={t.id} className="bg-[#fcfdfd] rounded-2xl p-5 border border-slate-150 flex flex-col justify-between hover:border-slate-305 transition-all text-left shadow-sm">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                            <div className="text-left">
                              <span className="block font-black text-stone-900 uppercase">{t.name}</span>
                              <span className="text-[10px] text-emerald-700 font-extrabold uppercase tracking-wider">{t.location}</span>
                            </div>
                            <span className="text-[10px] text-stone-400 font-mono italic">{t.timestamp}</span>
                          </div>

                          <p className="text-stone-700 text-xs italic leading-relaxed text-left font-serif">
                            "{t.content}"
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-4">
                          <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                            <span>{t.hallelujahs ?? 1} Praises & Hallelujahs</span>
                          </span>

                          <button
                            onClick={() => handleHallelujahIncrement(t.id, t.name)}
                            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 py-1.5 px-3 rounded-lg text-emerald-700 text-xs flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider"
                            id={`hallelujah-button-${t.id}`}
                          >
                            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                            <span>Hallelujah</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* 3. INTERACTIVE SERMON JOURNAL VIEW */}
            {activeTab === 'journal' && (
              <section className="bg-white border border-slate-200 rounded-[28px] p-6 md:p-8 space-y-6" id="journal-writer-panel">
                <div className="pb-5 border-b border-slate-100 text-left">
                  <span className="font-mono text-xs uppercase text-emerald-700 font-bold tracking-widest block mb-0.5">✍️ SPIRITUAL COMPANION</span>
                  <h3 className="font-serif text-lg md:text-xl font-bold text-stone-900 tracking-wide uppercase">Your Sermon Meditation Journal</h3>
                  <p className="text-xs text-stone-550">Draft notes, active Bible references, and pastor instructions while listening in to Voice of Jesus Radio. Saved directly inside your browser cache.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Notes Draft Composer */}
                  <div className="lg:col-span-5 bg-stone-50 p-6 rounded-[22px] border border-slate-200">
                    <h4 className="text-stone-900 font-serif text-sm font-bold uppercase mb-4 text-left">Capture sermon notes</h4>
                    
                    <form onSubmit={handleSaveJournalNote} className="space-y-4 text-left">
                      <div>
                        <label className="block text-xs font-bold text-stone-600 uppercase mb-1.5">Sermon Main Bible Scripture</label>
                        <select 
                          value={selectedJournalVerse}
                          onChange={(e) => setSelectedJournalVerse(e.target.value)}
                          className="w-full bg-white border border-slate-250 rounded-xl py-2.5 px-3.5 text-xs text-stone-900 focus:outline-none focus:border-emerald-600 font-medium cursor-pointer"
                        >
                          {BIBLE_VERSES.map(v => (
                            <option key={v.id} value={v.reference}>{v.reference} - {v.text.substring(0, 35)}...</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-600 uppercase mb-1.5">Your reflections & prayers</label>
                        <textarea
                          required
                          rows={5}
                          value={journalNote}
                          onChange={(e) => setJournalNote(e.target.value)}
                          placeholder="What is God saying to you today? Jot down notes, revelations, guidelines during stream devotions..."
                          className="w-full bg-white border border-slate-250 rounded-xl py-3 px-4 text-xs text-stone-900 focus:outline-none focus:border-emerald-600 font-medium"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-serif text-xs font-extrabold uppercase tracking-widest cursor-pointer shadow-sm shadow-emerald-600/10 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Save Entry to Journal</span>
                      </button>
                    </form>
                  </div>

                  {/* Journal Archives Logs */}
                  <div className="lg:col-span-7 space-y-4">
                    <h4 className="text-stone-850 font-serif text-sm font-bold tracking-widest uppercase text-left">Your Saved Entries ({journalList.length})</h4>
                    
                    {journalList.length === 0 ? (
                      <div className="bg-white border border-dashed border-slate-250 rounded-2xl py-12 text-center text-stone-400">
                        <BookOpen className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                        <p className="text-xs">Your spiritual devotional notebook is clean & empty.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
                        {journalList.map((j) => (
                          <div key={j.id} className="p-4 bg-white border border-slate-150 rounded-2xl text-left space-y-3 relative shadow-sm">
                            <div className="flex justify-between items-center text-xs border-b border-stone-50 pb-2">
                              <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg text-[10px] uppercase font-mono border border-emerald-150">
                                📖 Core Reference: {j.verse}
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="text-stone-400 font-mono text-[10px]">{j.date}</span>
                                <button 
                                  onClick={() => handleDeleteJournal(j.id)}
                                  className="text-stone-400 hover:text-red-650 cursor-pointer text-[10px] font-bold"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <p className="text-stone-740 text-xs italic font-serif leading-relaxed">
                              "{j.note}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </section>
            )}

            {/* 4. ABOUT MINISTRY PORTRAIT VIEW */}
            {activeTab === 'about' && (
              <section className="bg-white border border-slate-200 rounded-[28px] p-6 md:p-8 space-y-8" id="about-us-panel">
                <div className="border-b border-slate-100 pb-5 text-left">
                  <span className="font-mono text-xs uppercase text-emerald-700 font-bold tracking-widest block mb-0.5">🌍 OUR TESTIMONY</span>
                  <h3 className="font-serif text-lg md:text-xl font-bold text-stone-900 tracking-wide uppercase">Voice of Jesus Radio - Lira, Northern Uganda</h3>
                  <p className="text-xs text-stone-550">A legacy of spreading uncompromised Biblical truths, deliverance, salvation and healing hope.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4 text-left text-xs text-stone-700 leading-relaxed font-sans font-medium">
                    <h4 className="text-stone-900 font-serif text-base font-bold uppercase mb-2">Our Celestial Mission</h4>
                    <p>
                      Voice of Jesus Radio was established in the hearts of pastoral leaders in Lira, Northern Uganda, in response to a divine mandate: 
                      <em> "Go into all the world and preach the gospel to every creature" (Mark 16:15)</em>. Over our years on the digital and FM back-ups, we have served as a source of recovery, comfort, and deliverance for thousands of homes.
                    </p>
                    <p>
                      From spiritual warfare prayers, high-definition praise beats of East-Africa, to laying of hands on stream callers, our program slots are carefully crafted. Hundreds have testified to healing from malaria, chronic pain, spiritual afflictions and social reconciliation through direct seed intercession.
                    </p>
                    <p className="bg-[#f0fdf4] border-l-4 border-emerald-600 rounded-r-xl p-4 text-emerald-700">
                      <strong>Operational costs statement:</strong> To keep this digital station broadcast equipment on continuous standby, pay for our secure web hosting, domain name records and continuous Zeno radio satellite streaming platform subscription, we need exactly <strong>500,000 UGX</strong> every single year. Your generous sacrificial seeds directly finance this ministry on the airwaves of hope.
                    </p>
                  </div>

                  {/* Aesthetic mission cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-stone-50 border border-slate-250 p-5 rounded-2xl text-left space-y-2 shadow-sm">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-2 border border-emerald-100">
                        <Globe className="w-5 h-5" />
                      </div>
                      <h5 className="font-bold text-xs uppercase text-stone-900 tracking-wider">Universal Reach</h5>
                      <p className="text-[11px] text-stone-550">Broadcasting live across the entire East African region and globally via the internet.</p>
                    </div>

                    <div className="bg-stone-50 border border-slate-250 p-5 rounded-2xl text-left space-y-2 shadow-sm">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-2 border border-emerald-100">
                        <Award className="w-5 h-5" />
                      </div>
                      <h5 className="font-bold text-xs uppercase text-stone-900 tracking-wider">Salvation Fruit</h5>
                      <p className="text-[11px] text-stone-550">Witnessing dozens of souls accepting Jesus Christ on our weekly live night devotions.</p>
                    </div>

                    <div className="bg-stone-50 border border-slate-250 p-5 rounded-2xl text-left space-y-2 shadow-sm col-span-1 sm:col-span-2">
                      <h5 className="font-bold text-xs uppercase text-stone-900 tracking-wider">Meet Our Pastor Joseph</h5>
                      <quote className="block text-[11px] text-stone-700 italic font-serif">
                        "Your seed is not merely a payment, it is a spiritual vehicle carrying salvation, deliverance and divine breakthroughs into homes that are lost in the dark. May the God of peace bless you bountifully."
                      </quote>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 5. CONTACT US DESK VIEW */}
            {activeTab === 'contact' && (
              <section className="bg-white border border-slate-200 rounded-[28px] p-6 md:p-8 space-y-8" id="contact-desk-panel">
                <div className="border-b border-slate-100 pb-5 text-left">
                  <span className="font-mono text-xs uppercase text-emerald-700 font-bold tracking-widest block mb-0.5">📞 LIVE OUTREACH</span>
                  <h3 className="font-serif text-lg md:text-xl font-bold text-stone-900 tracking-wide uppercase">Connect With Our Studio Desk</h3>
                  <p className="text-xs text-stone-550">Submit prayer requests prompts, praise feedback, song shoutouts, or seeds verification inquiries.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Studio Directory info */}
                  <div className="lg:col-span-5 space-y-5 text-left">
                    <h4 className="text-stone-900 font-serif text-sm font-bold uppercase tracking-widest">Office Directory</h4>
                    
                    <div className="space-y-4 text-xs font-medium text-stone-650">
                      <div className="flex items-start gap-3.5">
                        <MapPin className="w-5 h-4.5 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <strong className="block text-stone-900">Physical Studio Location</strong>
                          <span>Lira City, Northern Uganda</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <Phone className="w-5 h-4.5 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <strong className="block text-stone-900">Direct Telephone Call desk</strong>
                          <span>Live Hotline: 0769302480 / 0770795585</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <MessageSquare className="w-5 h-4.5 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <strong className="block text-stone-900">Official Ministry WhatsApp</strong>
                          <span>+256 770 795585</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <Mail className="w-5 h-4.5 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <strong className="block text-stone-900">Digital Mail Address</strong>
                          <span>contact@voiceofjesusradio.com</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                      <a 
                        href={PHONE_CALL}
                        className="w-full text-center bg-stone-100 hover:bg-stone-200 text-stone-700 py-3 rounded-xl font-bold uppercase text-[10px] tracking-wider cursor-pointer"
                      >
                        Call Hotline desk Now
                      </a>
                      <a 
                        href={WHATSAPP_LINK}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl uppercase text-[10px] tracking-wider cursor-pointer shadow-sm shadow-emerald-600/10"
                      >
                        WhatsApp Studio Live
                      </a>
                    </div>
                  </div>

                  {/* Mail delivery Form */}
                  <div className="lg:col-span-7 bg-stone-50 border border-slate-200 rounded-3xl p-6 text-left">
                    <h4 className="text-stone-900 font-serif text-sm font-bold uppercase mb-4">Send a direct message</h4>
                    
                    <AnimatePresence mode="wait">
                      {contactSent ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="py-12 text-center space-y-3"
                        >
                          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-250">
                            <Check className="w-6 h-6" />
                          </div>
                          <h5 className="font-serif text-stone-900 font-bold uppercase text-sm">Message Transmitted!</h5>
                          <p className="text-xs text-stone-500">Your praise feedback message has been directly dispatched to the Voice Of Jesus pastors in the studio.</p>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-stone-600 uppercase mb-1.5">Your Full Name</label>
                              <input
                                type="text"
                                required
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                placeholder="Sister Acen Agnes"
                                className="w-full bg-white border border-slate-250 rounded-xl py-2.5 px-4 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-bold text-stone-600 uppercase mb-1.5">Reply Mobile Phone (MoMo)</label>
                              <input
                                type="tel"
                                placeholder="e.g. 0770795585"
                                className="w-full bg-white border border-slate-250 rounded-xl py-2.5 px-4 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-600 uppercase mb-1.5">Your message details</label>
                            <textarea
                              required
                              rows={4}
                              value={contactMessage}
                              onChange={(e) => setContactMessage(e.target.value)}
                              placeholder="Type your prayer notification seeds, song requests, greetings to your family in Northern Uganda or compliments to the pastor..."
                              className="w-full bg-white border border-slate-250 rounded-xl py-3 px-4 text-xs text-stone-900 focus:outline-none focus:border-emerald-600 font-medium"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-serif text-xs font-bold uppercase tracking-widest cursor-pointer shadow-sm rounded-xl flex items-center justify-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            <span>Transmit Message to Studio</span>
                          </button>
                        </form>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </section>
            )}

          </motion.div>
        </AnimatePresence>

      </div>

      {/* FIXED FOOTER CREDITS */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-stone-500 md:hidden">
        <p className="font-serif text-emerald-800 font-black tracking-widest mb-1">VOICE OF JESUS RADIO</p>
        <p className="max-w-xs mx-auto text-[10px] text-stone-400 italic font-serif leading-relaxed px-4">
          "Praise the Lord, all nation! Praise Him, all people! For His merciful kindness is great toward us..."
        </p>
        <p className="mt-2 text-[9px] text-stone-400">
          &copy; {new Date().getFullYear()} Voice Of Jesus. Lira City City Gates. Licensed by Ugbeatz.
        </p>
      </footer>

    </div>
  );
}
