import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Phone, Share2, Award, Calendar, Volume2, MessageSquare, 
  Sparkles, Globe, Sun, ArrowRight, ArrowLeft, Plus, Check, Play, Copy, Ear,
  BookOpen, Compass, Mail, MapPin, Send, HelpCircle, ChevronRight, Menu, X, Radio, Home,
  Lock, Settings, Edit3, Save, LogOut, CheckCircle2, ShieldAlert, CreditCard, PlusCircle, Search, ThumbsUp
} from 'lucide-react';

import { BibleVerse, RadioProgram } from './types';
import { BIBLE_VERSES, RADIO_SCHEDULE } from './data/radioData';
import RadioPlayer from './components/RadioPlayer';
import MoMoSupport from './components/MoMoSupport';
import PHPConnector, { customFetch } from './components/PHPConnector';

// Image imports
import celestialCross from './assets/images/celestial_cross_1781890462658.jpg';
import stainedGlass from './assets/images/stained_glass_1781890476699.jpg';
import prayerGlow from './assets/images/prayer_glow_1781890490579.jpg';
import jesusCross from './assets/images/jesus_cross_1781898756674.jpg';
import choirPraise from './assets/images/choir_praise_1781977423386.jpg';

export default function App() {
  const WHATSAPP_LINK = "https://wa.me/256770795585?text=Hello%20Voice%20Of%20Jesus%20Radio,%20I'm%20listening%20live%20and%20I%20have%20a%20blessing/song%20request:";
  const PHONE_CALL = "tel:0769302480";

  // Sidebar navigation and view tabs
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'contact' | 'testimonies' | 'journal' | 'momo' | 'schedule' | 'blog'>('home');
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
    { name: "Sister Agnes Apio", amount: 10000, time: "Just now" }
  ]);

  // Admin and Blog related states
  const [selectedFullBlog, setSelectedFullBlog] = useState<any | null>(null);
  const [blogsList, setBlogsList] = useState<any[]>([]);
  const [blogsLoading, setBlogsLoading] = useState<boolean>(true);
  
  // Credentials requested by Pastor Bonny Obote
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [adminIsLoggedIn, setAdminIsLoggedIn] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  // Blog creation forms state
  const [newBlogTitle, setNewBlogTitle] = useState<string>('');
  const [newBlogCategory, setNewBlogCategory] = useState<string>('SERMONS');
  const [newBlogImageUrl, setNewBlogImageUrl] = useState<string>('');
  const [newBlogContent, setNewBlogContent] = useState<string>('');
  const [newBlogAuthor, setNewBlogAuthor] = useState<string>('Pastor Bonny Obote');
  const [isPublishingBlog, setIsPublishingBlog] = useState<boolean>(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [isDeletingBlogId, setIsDeletingBlogId] = useState<string | null>(null);
  const [aboutUsText, setAboutUsText] = useState<string>('');
  const [contactUsText, setContactUsText] = useState<string>('');
  const [footerText, setFooterText] = useState<string>('');
  const [footerCopyrightText, setFooterCopyrightText] = useState<string>('');

  // Editable dynamic campaign metrics (with initial 10,000 progress)
  const [targetUgx, setTargetUgx] = useState<number>(500000);
  const [totalReceivedCount, setTotalReceivedCount] = useState<number>(10000);
  const [announcementText, setAnnouncementText] = useState<string>("📺 REPAIRS IN PROGRESS: Supporting Voice of Jesus Radio today directly completes our radio streaming server upgrade. Help us reach our 500,000 UGX target!");
  const [isSavingOptions, setIsSavingOptions] = useState<boolean>(false);

  // Direct Flutterwave secrets configuration
  const [flutterwavePublicKey, setFlutterwavePublicKey] = useState<string>('');
  const [flutterwaveSecretKey, setFlutterwaveSecretKey] = useState<string>('');
  const [isSavingKeys, setIsSavingKeys] = useState<boolean>(false);

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
      img: choirPraise, 
      quote: "Praise the Lord! Sing to the Lord a new song, and His praise in the assembly of saints.", 
      citation: "Psalm 149:1",
      title: "JOY OF THE HEAVENS",
      subtitle: "The voice of fellowship and joint deliverance singing."
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

  // Load Real-time Testimonies and Sync Server States on Mount
  useEffect(() => {
    customFetch("/api/testimonies")
      .then(res => res.json())
      .then(data => {
        if (data.testimonies && data.testimonies.length > 0) {
          setTestimonies(data.testimonies);
        }
      })
      .catch(err => console.error("Error loading testimonies from server:", err));

    // Fetch dynamic live blog news feed
    customFetch("/api/blogs")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBlogsList(data);
        }
        setBlogsLoading(false);
      })
      .catch(err => {
        console.error("Error loading custom blogs from server:", err);
        setBlogsLoading(false);
      });

    // Fetch homepage announcements
    customFetch("/api/homepage-options")
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.announcementText) setAnnouncementText(data.announcementText);
          if (data.aboutUsText) setAboutUsText(data.aboutUsText);
          if (data.contactUsText) setContactUsText(data.contactUsText);
          if (data.footerText) setFooterText(data.footerText);
          if (data.footerCopyrightText) setFooterCopyrightText(data.footerCopyrightText);
        }
      })
      .catch(err => console.error("Error loading homepage customization details:", err));

    // Fetch official campaign metrics
    customFetch("/api/campaign")
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (typeof data.target_ugx === "number") setTargetUgx(data.target_ugx);
          if (typeof data.total_received_ugx === "number") setTotalReceivedCount(data.total_received_ugx);
          if (Array.isArray(data.donations)) {
            setRecentDonations(data.donations);
          }
        }
      })
      .catch(err => console.error("Error loading server campaign details:", err));

    // Load local journal items if they exist
    const cachedJournal = localStorage.getItem('voj_daily_journal');
    if (cachedJournal) {
      setJournalList(JSON.parse(cachedJournal));
    }
  }, []);

  // Save journal notes helper
  
  const handleDeleteBlog = (blogId: string) => {
    if (!window.confirm('Are you sure you want to delete this chronicle?')) return;
    setIsDeletingBlogId(blogId);
    customFetch("/api/delete_blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: blogId, email: adminEmail, password: adminPassword })
    })
    .then(() => {
      setBlogsList(prev => prev.filter(b => b.id !== blogId));
      setIsDeletingBlogId(null);
    })
    .catch(() => setIsDeletingBlogId(null));
  };

  const handleEditBlogSubmit = (e: React.FormEvent, blogId: string) => {
    e.preventDefault();
    setIsPublishingBlog(true);
    customFetch("/api/edit_blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: blogId,
        title: newBlogTitle.trim(),
        content: newBlogContent.trim(),
        category: newBlogCategory,
        author: newBlogAuthor.trim(),
        imageUrl: newBlogImageUrl.trim(),
        email: adminEmail,
        password: adminPassword
      })
    })
    .then(() => {
      setBlogsList(prev => prev.map(b => b.id === blogId ? { ...b, title: newBlogTitle, content: newBlogContent, category: newBlogCategory, author: newBlogAuthor, imageUrl: newBlogImageUrl } : b));
      setEditingBlogId(null);
      setNewBlogTitle('');
      setNewBlogContent('');
      setNewBlogImageUrl('');
      setIsPublishingBlog(false);
    })
    .catch(() => setIsPublishingBlog(false));
  };

  const startEditingBlog = (blog: any) => {
    setEditingBlogId(blog.id);
    setNewBlogTitle(blog.title);
    setNewBlogContent(blog.content);
    setNewBlogCategory(blog.category);
    setNewBlogAuthor(blog.author);
    setNewBlogImageUrl(blog.imageUrl);
  };


  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword.trim()) {
      setLoginError("Please provide both email address and password.");
      return;
    }
    
    setIsLoggingIn(true);
    setLoginError('');

    customFetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: adminEmail.trim(), password: adminPassword.trim() })
    })
    .then(res => {
      if (!res.ok) throw new Error("Hallelujah! Access denied. Ensure your email and password are correct.");
      return res.json();
    })
    .then(data => {
      if (data.status === "success") {
        setAdminIsLoggedIn(true);
        addConsoleMessage("🔐 Admin Console Access Approved. Welcome Pastor Bonny Obote!");
        // Sync custom state defaults for option panels
        setHomeAnnouncementText(announcementText);
        setHomeTargetUgx(targetUgx);
        setHomeTotalReceived(totalReceivedCount);
        
        // Load direct keys secure configurations
        customFetch("/api/settings")
          .then(r => r.json())
          .then(kData => {
            if (kData.public_key) setFlutterwavePublicKey(kData.public_key);
            if (kData.secret_key) setFlutterwaveSecretKey(kData.secret_key);
          })
          .catch(() => {});
      }
    })
    .catch(err => {
      setLoginError(err.message || "Invalid Admin Credentials.");
    })
    .finally(() => {
      setIsLoggingIn(false);
    });
  };

  const handlePublishBlogPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle.trim() || !newBlogContent.trim()) {
      alert("Hallelujah! Please fill out both the title and the content of the field update.");
      return;
    }

    setIsPublishingBlog(true);
    customFetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newBlogTitle.trim(),
        content: newBlogContent.trim(),
        category: newBlogCategory,
        author: newBlogAuthor.trim(),
        imageUrl: newBlogImageUrl.trim() || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop",
        email: adminEmail,
        password: adminPassword
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success" && data.blog) {
        setBlogsList(prev => [data.blog, ...prev]);
        setNewBlogTitle('');
        setNewBlogContent('');
        setNewBlogImageUrl('');
        addConsoleMessage(`📰 Successfully published new blog update: "${data.blog.title}"`);
        alert("Praise the Lord! Gospel blog post uploaded successfully.");
      } else {
        alert(data.error || "Failed uploading blog update.");
      }
    })
    .catch(err => {
      alert("Error: " + err.message);
    })
    .finally(() => {
      setIsPublishingBlog(false);
    });
  };

  const [homeAnnouncementText, setHomeAnnouncementText] = useState<string>('');
  const [homeTargetUgx, setHomeTargetUgx] = useState<number>(500000);
  const [homeTotalReceived, setHomeTotalReceived] = useState<number>(10000);

  const handleSaveHomepageOptions = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingOptions(true);

    customFetch("/api/homepage-options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
        announcementText: homeAnnouncementText.trim(),
        targetUgx: Number(homeTargetUgx),
        totalReceivedUgx: Number(homeTotalReceived),
        aboutUsText: aboutUsText.trim(),
        contactUsText: contactUsText.trim(),
        footerText: footerText.trim(),
        footerCopyrightText: footerCopyrightText.trim()
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        setAnnouncementText(homeAnnouncementText.trim());
        setTargetUgx(Number(homeTargetUgx));
        setTotalReceivedCount(Number(homeTotalReceived));
        addConsoleMessage("🛡️ Saved customized layout configurations to Firebase.");
        alert("Victory! Homepage customizable elements saved securely.");
      } else {
        alert(data.error || "Failed saving options.");
      }
    })
    .catch(err => {
      alert("Error: " + err.message);
    })
    .finally(() => {
      setIsSavingOptions(false);
    });
  };

  const handleSaveFlutterwaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingKeys(true);

    customFetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
        public_key: flutterwavePublicKey.trim(),
        secret_key: flutterwaveSecretKey.trim()
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        addConsoleMessage("💳 Merged direct Flutterwave credentials.");
        alert("Praise the Lord! Flutterwave credentials synchronized successfully.");
      } else {
        alert(data.error || "Failed saving keys.");
      }
    })
    .catch(err => {
      alert("Error: " + err.message);
    })
    .finally(() => {
      setIsSavingKeys(false);
    });
  };

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
    }, 10000);
    return () => clearInterval(sliderInterval);
  }, [sliderImages.length]);

  // Filter verses
  const filteredVerses = activeVerseCategory === 'all' 
    ? BIBLE_VERSES 
    : BIBLE_VERSES.filter(v => v.category === activeVerseCategory);

  // Auto Scripture rotational tick (10 seconds)
  useEffect(() => {
    if (!isCarouselPlaying) return;
    const interval = setInterval(() => {
      setCurrentVerseIndex((prev) => (prev + 1) % filteredVerses.length);
    }, 10000);
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
      const response = await customFetch("/api/testimonies", {
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
      await customFetch("/api/testimonies/hallelujah", {
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
    <div className="min-h-screen bg-gradient-to-br from-[#1e1b4b] to-[#1e3a8a] text-white font-sans selection:bg-[#fcd34d] selection:text-[#1e1b4b] flex flex-col relative overflow-x-hidden">

      {/* SCREENSHOT STYLED HEADER */}
      <header className="bg-[#1e1b4b] w-full text-white relative">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          {/* Logo Top Left */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 border-2 border-blue-400/30 flex items-center justify-center font-bold text-xl relative">
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#1e3a8a]/40 rounded-full"></span>
              †
            </div>
            <div className="leading-tight">
              <h1 className="font-extrabold text-sm uppercase tracking-wide">Voice Of Jesus</h1>
              <p className="text-[9px] font-medium tracking-widest uppercase opacity-90">RADIO STATION</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 text-[14px] font-medium tracking-wide">
            <button onClick={() => setActiveTab('home')} className="hover:text-blue-100/80 transition-colors">Live Radio Player</button>
            <button onClick={() => setActiveTab('blog')} className="hover:text-blue-100/80 transition-colors">Devotion Chronicles</button>
            <button onClick={() => setActiveTab('testimonies')} className="hover:text-blue-100/80 transition-colors">Testimony Records</button>
            <button onClick={() => setActiveTab('journal')} className="hover:text-blue-100/80 transition-colors">Sermon Notebook</button>
            <button onClick={() => setActiveTab('about')} className="hover:text-blue-100/80 transition-colors">About Us</button>
            <button onClick={() => setActiveTab('contact')} className="hover:text-blue-100/80 transition-colors">Contact Us</button>
            
            <div className="relative flex items-center bg-[#1e3a8a]/40 rounded px-3 py-1.5 ml-2">
              <input type="text" placeholder="Search" className="text-white text-sm bg-transparent outline-none w-20" />
              <Search className="w-4 h-4 text-blue-200" />
            </div>

            <button onClick={() => setActiveTab('admin')} className="flex items-center gap-1.5 hover:text-blue-100/80 transition-colors ml-2">
              <span>Admin Login</span>
              <div className="flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
            </button>

            <button onClick={() => setActiveTab('momo')} className="bg-[#492265] hover:bg-[#381a4f] text-white px-5 py-2 text-sm font-bold transition-colors shadow-sm ml-2">
              Support Us
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} className="xl:hidden text-white flex items-center gap-2">
            <span className="text-xs font-bold uppercase">Menu</span>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Center Big Logo Area */}
        <div className="w-full py-12 md:py-20 flex flex-col items-center justify-center relative min-h-[250px] md:min-h-[350px]">
          {/* Decorative Background Blobs */}
          <div className="absolute inset-0 flex items-center justify-between opacity-40 pointer-events-none px-[10%] hidden md:flex">
            <div className="flex gap-4">
              <div className="w-48 h-20 bg-[#fad2a6] rounded-[40px] opacity-80"></div>
              <div className="w-20 h-20 bg-[#fad2a6] rounded-full opacity-80"></div>
            </div>
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-[#fad2a6] rounded-full opacity-80"></div>
              <div className="w-48 h-20 bg-[#fad2a6] rounded-[40px] opacity-80"></div>
            </div>
          </div>
          
          <div className="z-10 flex flex-col items-center gap-3 mb-8 md:mb-12 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#1e3a8a]/40 rounded-full flex items-center justify-center text-[#fcd34d] text-4xl font-black shadow-lg">†</div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter text-white uppercase drop-shadow-sm whitespace-nowrap">Voice Of Jesus Online Radio</h2>
          </div>
          

        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="xl:hidden bg-[#fcd34d] border-t border-blue-400/30/20 overflow-hidden text-white"
          >
            <div className="flex flex-col px-6 py-4 space-y-4">
              <button onClick={() => { setActiveTab('home'); setIsMobileSidebarOpen(false); }} className="text-left font-bold uppercase text-sm tracking-wider">Home</button>
              <button onClick={() => { setActiveTab('blog'); setIsMobileSidebarOpen(false); }} className="text-left font-bold uppercase text-sm tracking-wider">Devotion Chronicles</button>
              <button onClick={() => { setActiveTab('testimonies'); setIsMobileSidebarOpen(false); }} className="text-left font-bold uppercase text-sm tracking-wider">Testimony Records</button>
              <button onClick={() => { setActiveTab('schedule'); setIsMobileSidebarOpen(false); }} className="text-left font-bold uppercase text-sm tracking-wider">Intercession Timetable</button>
              <button onClick={() => { setActiveTab('journal'); setIsMobileSidebarOpen(false); }} className="text-left font-bold uppercase text-sm tracking-wider">Sermon Notebook</button>
              <button onClick={() => { setActiveTab('about'); setIsMobileSidebarOpen(false); }} className="text-left font-bold uppercase text-sm tracking-wider">About Us</button>
              <button onClick={() => { setActiveTab('contact'); setIsMobileSidebarOpen(false); }} className="text-left font-bold uppercase text-sm tracking-wider">Contact Us</button>
              <button onClick={() => { setActiveTab('admin'); setIsMobileSidebarOpen(false); }} className="text-left font-bold uppercase text-sm tracking-wider text-yellow-300">Admin Login</button>
              <button onClick={() => { setActiveTab('momo'); setIsMobileSidebarOpen(false); }} className="bg-[#492265] text-white px-5 py-3 font-bold uppercase text-sm text-center">Support Us</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 min-h-screen flex flex-col w-full pb-20">
        
        {/* UPPER ANNOUNCEMENT BAR */}
        <div className="bg-[#492265] text-white py-2 px-4 text-center font-medium text-[11px] uppercase tracking-wider flex justify-center items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-white" />
          <span>We need 500000UGX to keep this gospel radio running please support with any little money to enable us to continue spreading the gospel of Jesus Christ</span>
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
                {/* 1.1 ROTATIONAL CHRISTIAN SLIDESHOW & RADIO PLAYER HERO SECTION */}
                <section className="bg-[#2e1065]/60 rounded-[16px] overflow-hidden relative shadow-lg min-h-[400px] flex flex-col md:flex-row items-stretch" id="hero-broadcast-deck">
                  <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-20 text-left">
                    <h2 className="text-[#fcd34d] font-black text-2xl md:text-3xl mb-2 tracking-tight">{sliderImages[heroSlideIndex].title || 'Voice Of Jesus'}</h2>
                    <h1 className="text-white font-extrabold text-4xl md:text-6xl uppercase tracking-tighter mb-4 leading-none">{sliderImages[heroSlideIndex].subtitle || 'Reggae Vibes'}</h1>
                    <p className="text-blue-100/80 text-sm md:text-base max-w-md mb-8 leading-relaxed font-medium">
                      "{sliderImages[heroSlideIndex].quote}"
                      <br/>
                      <span className="text-[#fcd34d] font-bold text-xs uppercase tracking-widest mt-2 block">— {sliderImages[heroSlideIndex].citation}</span>
                    </p>

                    <div className="flex gap-2">
                        {sliderImages.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setHeroSlideIndex(idx)}
                            className={`h-2 rounded-full transition-all duration-350 cursor-pointer ${
                              heroSlideIndex === idx ? 'w-8 bg-[#fcd34d] text-blue-900' : 'w-2 bg-[#1e3a8a]/30 hover:bg-[#1e3a8a]/50'
                            }`}
                            aria-label={`Show slide ${idx + 1}`}
                          ></button>
                        ))}
                    </div>
                  </div>

                  <div className="w-full md:w-[50%] lg:w-[45%] relative p-4 md:p-6 lg:p-8 flex items-center justify-center bg-[#172554]/80 border-l border-blue-400/20">
                      <div className="w-full max-w-[400px] relative z-20 group mx-auto">
                         <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-br from-[#fcd34d] to-[#492265] opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"></div>
                         <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-blue-400/20 bg-black/80 backdrop-blur-sm">
                           <RadioPlayer onAddBroadcastStatus={addConsoleMessage} />
                         </div>
                      </div>
                  </div>
                </section>

                {/* 1.2 ROTATIONAL BIBLE PROMISES DISCOVERY DEEP WELL */}
                <section className="bg-[#1e3a8a]/40 rounded-xl border border-blue-400/30 hover:border-[#fcd34d]/40 transition-all duration-300 p-6 md:p-8 shadow-sm relative overflow-hidden mt-8" id="bible-carousel-banner">
                  
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-blue-400/30 pb-5 text-left">
                    <div>
                      <span className="text-[#fcd34d] font-black uppercase text-[10px] tracking-widest font-mono block mb-1">SCRIPTURE EXPLORER</span>
                      <h3 className="font-sans text-lg md:text-xl font-extrabold text-white tracking-tight uppercase">Scriptures of Hope, Deliverance & Blessings</h3>
                      <p className="text-xs text-blue-200 mt-1 max-w-xl">
                        "For the word of God is living and powerful, and sharper than any two-edged sword..." Discover encouraging promises below.
                      </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {['all', 'salvation', 'strength', 'faith', 'healing', 'praise'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveVerseCategory(cat)}
                          className={`py-1.5 px-3 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                            activeVerseCategory === cat
                              ? 'bg-[#fcd34d] text-blue-900 text-white shadow-sm font-black'
                              : 'bg-[#1e3a8a]/20 border border-blue-400/30 text-white hover:bg-[#1e3a8a]/40 hover:text-white'
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
                        <span className="font-sans text-5xl text-[#fcd34d]/20 block leading-none select-none h-4">“</span>
                        <h4 className="font-sans text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto italic font-medium">
                          {filteredVerses[currentVerseIndex]?.text}
                        </h4>
                        <cite className="block text-[#fcd34d] font-mono text-xs tracking-widest uppercase font-bold">
                          — {filteredVerses[currentVerseIndex]?.reference}
                        </cite>
                      </motion.div>
                    </AnimatePresence>

                    {/* Dynamic Navigation widgets */}
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-5 border-t border-blue-400/30 w-full gap-4 text-xs text-blue-200">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={handlePrevVerse}
                          className="bg-[#1e3a8a]/20 hover:bg-[#1e3a8a]/40 border border-blue-400/30 p-2 rounded-xl cursor-pointer"
                          aria-label="Previous scriptural segment"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 text-white" />
                        </button>
                        <button 
                          onClick={handleNextVerse}
                          className="bg-[#1e3a8a]/20 hover:bg-[#1e3a8a]/40 border border-blue-400/30 p-2 rounded-xl cursor-pointer"
                          aria-label="Forward scriptural segment"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>

                      <button
                        onClick={() => setIsCarouselPlaying(!isCarouselPlaying)}
                        className={`py-1.5 px-3.5 rounded-full border text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                          isCarouselPlaying 
                            ? 'text-[#fcd34d] border-[#fcd34d]/30 bg-orange-50' 
                            : 'text-blue-200 border-blue-400/30 hover:bg-[#1e3a8a]/20'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isCarouselPlaying ? 'bg-[#fcd34d] text-blue-900 animate-pulse' : 'bg-stone-400'}`}></span>
                        <span>{isCarouselPlaying ? 'Auto Cycling' : 'Cycling Paused'}</span>
                      </button>

                      <div className="flex gap-2 font-sans">
                        <button
                          onClick={() => handleTTSRead(filteredVerses[currentVerseIndex]?.text)}
                          className="bg-[#1e3a8a]/20 hover:bg-[#1e3a8a]/40 border border-blue-400/30 text-white p-2.5 rounded-xl flex items-center gap-1.5 font-bold text-[10px] cursor-pointer hover:text-[#fcd34d]"
                          title="Speak scriptural passage out loud"
                        >
                          <Ear className="w-3.5 h-3.5" />
                          <span>Listen Aloud</span>
                        </button>

                        <button
                          onClick={() => handleCopyVerse(filteredVerses[currentVerseIndex])}
                          className="bg-[#1e3a8a]/20 hover:bg-[#1e3a8a]/40 border border-blue-400/30 text-white py-2.5 px-3 rounded-xl flex items-center gap-1.5 font-bold text-[10px] cursor-pointer hover:text-[#fcd34d]"
                        >
                          {copiedVerseId === filteredVerses[currentVerseIndex]?.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#fcd34d]" />
                              <span className="text-[#fcd34d]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Scripture</span>
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
                    <div className="bg-[#1e3a8a]/40 rounded-xl p-6 border border-blue-400/30 hover:border-[#fcd34d]/40 transition-all duration-300 text-left shadow-sm">
                      <div className="flex justify-between items-center mb-4 border-b border-blue-400/20 pb-2">
                        <span className="text-[11px] font-black uppercase text-[#fcd34d] tracking-wider font-sans">Recent Contributions</span>
                        <div className="h-2 w-2 rounded-full bg-[#fcd34d] text-blue-900 animate-pulse"></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {recentDonations.slice(0, 4).map((d, index) => (
                          <div key={index} className="p-3 bg-[#1e3a8a]/20 rounded-xl border border-blue-400/30 flex items-center justify-between text-xs">
                            <div className="text-left font-sans">
                              <span className="block font-bold text-white">{d.name}</span>
                              <span className="text-[10px] text-blue-200">{d.time} • Faith Partner</span>
                            </div>
                            <span className="font-extrabold text-[#fcd34d]">+UGX {d.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Radio Program Timetable */}
                  <div className="lg:col-span-5 bg-[#1e3a8a]/40 rounded-xl p-6 md:p-8 border border-blue-400/30 hover:border-[#fcd34d]/40 transition-all duration-300 space-y-6 shadow-sm">
                    <div className="flex items-center gap-3 pb-4 border-b border-blue-400/30">
                      <Calendar className="w-5 h-5 text-[#fcd34d]" />
                      <div className="text-left">
                        <h4 className="font-serif text-sm font-bold text-white uppercase tracking-widest leading-none">Broadcasting Timetable</h4>
                        <p className="text-[11px] text-blue-200 mt-1">Live Spiritual food hosted from our studio</p>
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
                                ? 'bg-orange-50/50 border-[#fcd34d]/40 shadow-sm' 
                                : 'bg-[#1e3a8a]/20 border-blue-400/30 hover:border-[#fcd34d]/40'
                            }`}
                          >
                            {isHighlighted && (
                              <span className="absolute top-3.5 right-4 text-[9px] bg-[#fcd34d] text-blue-900 text-white font-extrabold py-0.5 px-2 rounded-full uppercase tracking-wider animate-pulse">
                                Live Now
                              </span>
                            )}

                            <div className="text-[10px] font-bold text-[#fcd34d] font-mono uppercase mb-0.5 text-left">{p.time}</div>
                            <h5 className="font-bold text-xs text-white mb-0.5 text-left uppercase">{p.name}</h5>
                            <p className="text-[11px] text-white mb-1 text-left">Preacher: <span className="font-bold text-[#fcd34d]">{p.host}</span></p>
                            <p className="text-[11px] text-blue-200 leading-relaxed text-left italic">"{p.description}"</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </section>
 
                {/* 1.4 GOSPEL CHRONICLES & DEVOTIONAL ARCHIVES */}
                <section className="space-y-6 text-left" id="blog-area-homepage">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-blue-400/30 pb-4 gap-4">
                    <div className="text-left font-sans">
                      <span className="font-mono text-xs uppercase text-[#fcd34d] font-extrabold tracking-widest block mb-0.5">📰 GOSPEL CHRONICLE LOGS</span>
                      <h3 className="font-sans text-lg md:text-xl font-extrabold text-white tracking-tight uppercase">Devotional sermons & Stations update</h3>
                      <p className="text-xs text-blue-200 mt-1">Read life-changing scriptures, teachings, and radio announcements shared directly by Pastor Bonny Obote.</p>
                    </div>
                  </div>
 
                  {blogsList.length === 0 ? (
                    <div className="bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl p-10 text-center space-y-4">
                      <div className="w-12 h-12 bg-blue-900/30 rounded-full border border-blue-400 flex items-center justify-center mx-auto text-[#fcd34d] animate-pulse">
                        <PlusCircle className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-sans text-white uppercase text-xs font-bold font-black">Archive logs empty</h4>
                        <p className="text-xs text-blue-200 max-w-sm mx-auto font-medium">No chronicle devotions has been posted yet.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                      {blogsList.map((b) => (
                        <div 
                          key={b.id} 
                          className="bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl overflow-hidden flex flex-col hover:border-[#fcd34d]/30 hover:shadow-sm transition-all group"
                        >
                          <div className="h-44 overflow-hidden relative bg-[#1e3a8a]/40">
                            <img 
                              src={b.imageUrl || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop"} 
                              alt={b.title} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4">
                              <span className="bg-[#fcd34d] text-white font-mono text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                                {b.category}
                              </span>
                            </div>
                          </div>
 
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                               <div className="flex items-center justify-between text-[10px] text-blue-200 font-mono">
                                <span className="uppercase font-bold">by: {b.author}</span>
                                <span>{b.date}</span>
                              </div>
                              <h4 className="font-sans text-sm font-bold text-white uppercase group-hover:text-[#fcd34d] transition-colors line-clamp-2">
                                {b.title}
                              </h4>
                              <p className="text-xs text-white line-clamp-3 font-sans leading-relaxed">
                                {b.content}
                              </p>
                            </div>
 
                            <button
                              onClick={() => setSelectedFullBlog(b)}
                              className="w-full py-2.5 bg-[#1e3a8a]/20 hover:bg-[#1e3a8a]/40 border border-blue-400/30 text-white text-[10px] font-mono tracking-widest font-extrabold uppercase rounded-lg transition-all cursor-pointer"
                            >
                              Expand Chronicle Text &rarr;
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}

            {/* 1.5 CAMPAIGN BUDGETS VIEW */}
            {activeTab === 'momo' && (
              <section className="space-y-8 animate-fadeIn text-left">
                {/* Header card with statistics summary */}
                <div className="bg-gradient-to-r from-neutral-900 via-stone-900 to-neutral-950 text-white rounded-3xl p-8 relative overflow-hidden border border-blue-400/20 shadow-xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="relative z-10 space-y-4">
                    <span className="bg-[#fcd34d] text-white text-[10px] font-black uppercase px-3 py-1 rounded-md tracking-wider">
                      🌍 Operation Broadcast Fund
                    </span>
                    <h2 className="text-2xl md:text-3xl font-sans font-extrabold uppercase tracking-tight">
                      Station Support
                    </h2>
                    <p className="text-xs text-white max-w-2xl leading-relaxed">
                      Voice Of Jesus Radio is a community-funded ministry providing spiritual healing and uncompromised Biblical truths globally from Lira City. Our operational server plans, live stream hosting, and bandwidth licenses require a steady faith-partnership support.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-neutral-800">
                      <div>
                        <span className="block text-[10px] text-blue-100 uppercase font-mono">ANNUAL TARGET BUDGET</span>
                        <span className="text-xl md:text-2xl font-black text-white">{targetUgx.toLocaleString()} UGX</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-blue-100 uppercase font-mono">TOTAL CONTRIBUTED</span>
                        <span className="text-xl md:text-2xl font-black text-yellow-400">{totalReceivedCount.toLocaleString()} UGX</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-blue-100 uppercase font-mono">CAMPAIGN PROGRESS</span>
                        <span className="text-xl md:text-2xl font-black text-emerald-400">
                          {Math.min(100, Math.round((totalReceivedCount / targetUgx) * 100))}% Secured
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#fcd34d] to-blue-500 h-full rounded-full transition-all duration-750" 
                          style={{ width: `${Math.min(100, (totalReceivedCount / targetUgx) * 105)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secure donation gateways */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7">
                    <MoMoSupport 
                      ownerPhone="+256770795585" 
                      onSuccess={handleDonationReceiptSuccess} 
                    />
                  </div>

                  {/* Operational breakdowns & instructions */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-[#1e3a8a]/40 rounded-xl p-6 border border-blue-400/30 shadow-sm space-y-4">
                      <h4 className="font-sans text-xs font-black text-white uppercase tracking-wider border-l-2 border-[#fcd34d] pl-2">
                        MTN & AIRTEL DIRECT PAYMENTS
                      </h4>
                      <p className="text-xs text-white leading-relaxed font-sans">
                        You can send contributions directly to our official broadcast lines in Uganda. We verify and allocate every contribution immediately:
                      </p>
                      
                      <div className="space-y-3 pt-2 font-sans">
                        <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/50 text-xs text-left">
                          <span className="font-bold text-amber-800 block mb-1">MTN MOBILE MONEY (Uganda):</span>
                          <span className="font-mono text-yellow-400 block font-bold">+256 770 795585</span>
                          <span className="text-[10px] text-blue-200">Registered Name: Bonny Obote</span>
                        </div>

                        <div className="p-3 bg-blue-900/30/40 rounded-xl border border-blue-400/50 text-xs text-left">
                          <span className="font-bold text-[#fcd34d] block mb-1">AIRTEL MONEY (Uganda):</span>
                          <span className="font-mono text-yellow-400 block font-bold">+256 769 302480</span>
                          <span className="text-[10px] text-blue-200">Registered Name: Bonny Obote</span>
                        </div>
                      </div>

                      <div className="bg-[#1e3a8a]/20 p-4 rounded-xl border border-blue-400/30 text-xs text-blue-200 italic text-left">
                        "Each one must give as he has decided in his heart, not reluctantly or under compulsion, for God loves a cheerful giver." &mdash; 2 Corinthians 9:7
                      </div>
                    </div>

                    {/* Roster of contribution logs */}
                    <div className="bg-[#1e3a8a]/40 rounded-xl p-6 border border-blue-400/30 shadow-sm">
                      <div className="flex justify-between items-center mb-4 border-b border-blue-400/20 pb-2">
                        <span className="text-[11px] font-black uppercase text-[#fcd34d] tracking-wider font-sans">Recent Partners</span>
                        <span className="text-[9px] bg-[#fcd34d]/10 text-[#fcd34d] px-2 py-0.5 rounded font-bold uppercase">SECURED</span>
                      </div>
                      <div className="space-y-3">
                        {recentDonations.map((d, index) => (
                          <div key={index} className="p-3 bg-[#1e3a8a]/20 rounded-xl border border-blue-400/30 flex items-center justify-between text-xs">
                            <div className="text-left font-sans">
                              <span className="block font-bold text-white">{d.name}</span>
                              <span className="text-[10px] text-blue-200">{d.time} &bull; Faith Support</span>
                            </div>
                            <span className="font-extrabold text-[#fcd34d]">+UGX {d.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 1.6 INTERCESSION TIMETABLE VIEW */}
            {activeTab === 'schedule' && (
              <section className="space-y-8 animate-fadeIn text-left">
                <div className="bg-[#2e1065]/60 rounded-xl p-6 md:p-8 border border-blue-400/20 shadow-sm text-white">
                  <div className="border-b border-blue-400/20 pb-5 mb-6 text-left">
                    <span className="font-mono text-xs uppercase text-[#fcd34d] font-extrabold tracking-widest block mb-1">🗓️ STREAMS INDEX & PROGRAMS</span>
                    <h3 className="font-sans text-lg md:text-xl font-extrabold text-white tracking-tight uppercase">Ministry Broadcast & Intercession Timetable</h3>
                    <p className="text-xs text-blue-100 mt-1">
                      Tune in any of our daily and weekly prayer outlines 24/7. Transmitting divine healing and prayer arrays hosted from our studios.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {RADIO_SCHEDULE.map((p) => {
                      const currentHour = new Date().getHours();
                      let isHighlighted = false;
                      
                      if (currentHour >= 5 && currentHour < 8 && p.id === 1) isHighlighted = true;
                      else if (currentHour >= 9 && currentHour < 12 && p.id === 2) isHighlighted = true;
                      else if (currentHour >= 13 && currentHour < 16 && p.id === 3) isHighlighted = true;
                      else if (currentHour >= 18 && currentHour < 21 && p.id === 4) isHighlighted = true;
                      else if ((currentHour >= 22 || currentHour < 2) && p.id === 5) isHighlighted = true;

                      return (
                        <div 
                          key={p.id}
                          className={`p-6 rounded-2xl border transition-all relative flex flex-col justify-between space-y-4 ${
                            isHighlighted 
                              ? 'bg-gradient-to-r from-purple-900/40 via-purple-800/40 to-purple-900/40 border-purple-500/50 shadow-md scale-[1.01]' 
                              : 'bg-black/40 border-blue-400/20 hover:border-[#fcd34d]/40 hover:shadow-sm'
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-bold text-[#fcd34d] font-mono uppercase bg-[#fcd34d] text-blue-900/10 px-2 py-0.5 rounded border border-[#fcd34d]/20">
                                {p.time}
                              </span>
                              {isHighlighted && (
                                <span className="text-[8px] bg-[#fcd34d] text-white font-black py-0.5 px-2 rounded-full uppercase tracking-wider animate-pulse">
                                  LIVE NOW
                                </span>
                              )}
                            </div>
                            
                            <h4 className="font-bold text-sm text-white uppercase tracking-tight mb-1">{p.name}</h4>
                            <p className="text-xs text-blue-100 mb-1">Preacher: <span className="font-extrabold text-[#fcd34d]">{p.host}</span></p>
                            <p className="text-xs text-blue-200 leading-relaxed italic">"{p.description}"</p>
                          </div>

                          <div className="pt-2 border-t border-blue-400/20">
                            <button 
                              onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                              className="text-[10px] font-bold text-[#fcd34d] hover:underline flex items-center gap-1 cursor-pointer uppercase font-mono"
                            >
                              <span>Open Radio Stream</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 p-6 bg-black/40 rounded-2xl border border-blue-400/20 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-blue-100 text-left">
                    <div className="space-y-2">
                      <h4 className="font-bold text-white uppercase">Weekly Fellowship Program Goals</h4>
                      <ul className="space-y-1.5 list-disc pl-4 text-blue-200">
                        <li><strong>Monday Devotion:</strong> Pray for local mission growth and stream infrastructure.</li>
                        <li><strong>Wednesday Healing:</strong> Healing intercessions for all listeners in East Africa.</li>
                        <li><strong>Friday Deliverance Hour:</strong> Prayers over personal call requests from believers worldwide.</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-white uppercase">Emergency Call Hotline</h4>
                      <p className="leading-relaxed">
                        If you need urgent intercession or counseling, call our studio line directly at <strong>0769302480</strong> / <strong>0770795585</strong>. Our service ministers are available to stand in faith with you.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 1.7 DEVOTION CHRONICLES VIEW */}
            {activeTab === 'blog' && (
              <section className="space-y-8 animate-fadeIn text-left">
                <div className="bg-[#1e3a8a]/40 rounded-xl p-6 md:p-8 border border-blue-400/30 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-blue-400/30 pb-5 gap-4">
                    <div className="text-left font-sans">
                      <span className="font-mono text-xs uppercase text-[#fcd34d] font-extrabold tracking-widest block mb-1">📰 DEVOTION CHRONICLES</span>
                      <h3 className="font-sans text-lg md:text-xl font-extrabold text-white tracking-tight uppercase">Station chronicles & devotional posts</h3>
                      <p className="text-xs text-blue-200 mt-1">Life-changing Biblical teachings and announcements posted directly by Pastor Bonny Obote.</p>
                    </div>
                    
                    {adminIsLoggedIn && (
                      <button 
                        onClick={() => { setActiveTab('admin'); }}
                        className="py-2 px-4 bg-[#fcd34d]/10 hover:bg-[#fcd34d]/20 text-[#fcd34d] text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer"
                      >
                        Write New Chronicle Update
                      </button>
                    )}
                  </div>

                  {blogsList.length === 0 ? (
                    <div className="p-16 text-center space-y-4">
                      <div className="w-12 h-12 bg-blue-900/30 rounded-full border border-blue-400 flex items-center justify-center mx-auto text-[#fcd34d] animate-pulse">
                        <PlusCircle className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-sans text-white uppercase text-xs font-bold font-black">Archive logs empty</h4>
                        <p className="text-xs text-blue-200 max-w-sm mx-auto font-medium">No chronicle devotions has been posted yet.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 font-sans">
                      {blogsList.map((b) => (
                        <div 
                          key={b.id} 
                          className="bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl overflow-hidden flex flex-col hover:border-[#fcd34d]/30 hover:shadow-md transition-all group"
                        >
                          <div className="h-44 overflow-hidden relative bg-[#1e3a8a]/40">
                            <img 
                              src={b.imageUrl || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop"} 
                              alt={b.title} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4">
                              <span className="bg-[#fcd34d] text-white font-mono text-[9px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider shadow-sm">
                                {b.category}
                              </span>
                            </div>
                          </div>

                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[10px] text-blue-200 font-mono">
                                <span className="uppercase font-bold text-[#fcd34d]">by {b.author}</span>
                                <span>{b.date}</span>
                              </div>
                              <h4 className="font-sans text-sm font-bold text-yellow-400 uppercase group-hover:text-[#fcd34d] transition-colors line-clamp-2 leading-snug">
                                {b.title}
                              </h4>
                              <p className="text-xs text-white line-clamp-4 leading-relaxed font-sans">
                                {b.content}
                              </p>
                            </div>

                            <button
                              onClick={() => setSelectedFullBlog(b)}
                              className="w-full py-2.5 bg-[#1e3a8a]/20 hover:bg-[#fcd34d]/5 hover:text-[#fcd34d] hover:border-[#fcd34d]/25 border border-blue-400/30 text-white text-[10px] font-mono tracking-widest font-extrabold uppercase rounded-lg transition-all cursor-pointer"
                            >
                              Expand Chronicle Text &rarr;
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* 2. PRAISE & TESTING TESTIMONY WALL VIEW */}
            {activeTab === 'testimonies' && (
              <section className="bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl p-6 md:p-8 space-y-6 shadow-sm animate-fadeIn" id="testimony-board-panel">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-blue-400/30">
                  <div className="text-left">
                    <span className="font-mono text-xs uppercase text-[#fcd34d] font-extrabold tracking-widest block mb-0.5">🙌 HARVEST OF MIRACLES</span>
                    <h3 className="font-sans text-lg md:text-xl font-extrabold text-white tracking-tight uppercase">Answered Prayers & Testimony Board</h3>
                    <p className="text-xs text-white">Publish your divine testimony of miracle breakthroughs, deliverance, and recovery to encourage other seekers.</p>
                  </div>

                  {/* Header widgets */}
                  <div className="flex flex-wrap items-center gap-3.5 w-full md:w-auto font-sans">
                    <input
                      type="text"
                      value={testimonySearchQuery}
                      onChange={(e) => setTestimonySearchQuery(e.target.value)}
                      placeholder="Search miracles..."
                      className="bg-[#1e3a8a]/20 border border-blue-400/30 rounded-xl py-2 px-4 text-xs text-white max-w-sm focus:outline-none focus:border-[#fcd34d] font-medium"
                    />

                    <button
                      onClick={() => setShowAddTestimonyForm(!showAddTestimonyForm)}
                      className="bg-[#fcd34d] hover:bg-[#c1151c] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer uppercase tracking-wider"
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
                      className="bg-[#1e3a8a]/20 rounded-xl p-5 border border-blue-400/30 overflow-hidden text-left shadow-inner"
                    >
                      <form onSubmit={handleAddTestimonySubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end font-sans">
                        <div>
                          <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5 font-mono">Your Name</label>
                          <input
                            type="text"
                            required
                            value={newTestimonyName}
                            onChange={(e) => setNewTestimonyName(e.target.value)}
                            placeholder="e.g. Sister Apophia Acen"
                            className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-[#fcd34d]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5 font-mono">District / Town</label>
                          <input
                            type="text"
                            value={newTestimonyLocation}
                            onChange={(e) => setNewTestimonyLocation(e.target.value)}
                            placeholder="e.g. Lira, Northern Uganda"
                            className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-[#fcd34d]"
                          />
                        </div>

                        <div>
                          <button
                            type="submit"
                            className="w-full bg-[#fcd34d] hover:bg-[#c1151c] text-white font-extrabold uppercase tracking-wide text-xs py-3 px-4 rounded-xl shadow-sm cursor-pointer transition-colors"
                          >
                            Publish Praise Testimony
                          </button>
                        </div>

                        <div className="md:col-span-3">
                          <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5 font-mono">Praise Description (What did Jesus do in your life?)</label>
                          <textarea
                            required
                            rows={3}
                            value={newTestimonyContent}
                            onChange={(e) => setNewTestimonyContent(e.target.value)}
                            placeholder="Type details about your miracle recovery, family reconciliation, financial breakthrough, or saved spirits. God is good!"
                            className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-[#fcd34d]"
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
                      <div key={t.id} className="bg-[#1e3a8a]/40 rounded-xl p-5 border border-blue-400/30 flex flex-col justify-between hover:border-[#fcd34d]/30 hover:shadow-sm transition-all text-left shadow-sm">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-xs pb-2 border-b border-blue-400/20">
                            <div className="text-left font-sans">
                              <span className="block font-black text-white uppercase tracking-tight">{t.name}</span>
                              <span className="text-[10px] text-[#fcd34d] font-extrabold uppercase tracking-wider">{t.location}</span>
                            </div>
                            <span className="text-[10px] text-blue-200 font-mono italic">{t.timestamp}</span>
                          </div>

                          <p className="text-white text-xs italic leading-relaxed text-left font-serif">
                            "{t.content}"
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-blue-400/20 mt-4 font-sans">
                          <span className="text-[10px] text-white font-bold uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-[#fcd34d] animate-pulse" />
                            <span>{t.hallelujahs ?? 1} Praises & Hallelujahs</span>
                          </span>

                          <button
                            onClick={() => handleHallelujahIncrement(t.id, t.name)}
                            className="bg-blue-900/30 hover:bg-blue-800 border border-blue-400 py-1.5 px-3 rounded-lg text-[#fcd34d] text-xs flex items-center gap-1 cursor-pointer font-extrabold uppercase tracking-widest"
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
              <section className="bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl p-6 md:p-8 space-y-6 shadow-sm" id="journal-writer-panel">
                <div className="pb-5 border-b border-blue-400/30 text-left">
                  <span className="font-mono text-xs uppercase text-[#fcd34d] font-bold tracking-widest block mb-0.5">✍️ SPIRITUAL COMPANION</span>
                  <h3 className="font-sans text-lg md:text-xl font-extrabold text-white tracking-tight uppercase">Your Sermon Meditation Journal</h3>
                  <p className="text-xs text-blue-200">Draft notes, active Bible references, and pastor instructions while listening in to Voice of Jesus Radio. Saved directly inside your browser cache.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Notes Draft Composer */}
                  <div className="lg:col-span-12 xl:col-span-5 bg-[#1e3a8a]/20 p-6 rounded-xl border border-blue-400/30 shadow-sm">
                    <h4 className="text-white font-sans text-sm font-bold uppercase mb-4 text-left">Capture sermon notes</h4>
                    
                    <form onSubmit={handleSaveJournalNote} className="space-y-4 text-left font-sans">
                      <div>
                        <label className="block text-xs font-bold text-white uppercase mb-1.5 font-mono">Sermon Main Bible Scripture</label>
                        <select 
                          value={selectedJournalVerse}
                          onChange={(e) => setSelectedJournalVerse(e.target.value)}
                          className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#fcd34d] font-medium cursor-pointer"
                        >
                          {BIBLE_VERSES.map(v => (
                            <option key={v.id} value={v.reference} className="bg-[#1e3a8a]/40 text-white">{v.reference} - {v.text.substring(0, 35)}...</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-white uppercase mb-1.5 font-mono">Your reflections & prayers</label>
                        <textarea
                          required
                          rows={5}
                          value={journalNote}
                          onChange={(e) => setJournalNote(e.target.value)}
                          placeholder="What is God saying to you today? Jot down notes, revelations, guidelines during stream devotions..."
                          className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-3 px-4 text-xs text-white placeholder-blue-300 focus:outline-none focus:border-[#fcd34d] font-medium"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-[#fcd34d] hover:bg-[#c1151c] text-white font-sans text-xs font-extrabold uppercase tracking-widest cursor-pointer shadow-sm flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Save Entry to Journal</span>
                      </button>
                    </form>
                  </div>

                  {/* Journal Archives Logs */}
                  <div className="lg:col-span-12 xl:col-span-7 space-y-4">
                    <h4 className="text-white font-sans text-sm font-bold tracking-widest uppercase text-left">Your Saved Entries ({journalList.length})</h4>
                    
                    {journalList.length === 0 ? (
                      <div className="bg-[#1e3a8a]/20 border border-dashed border-blue-400/30 rounded-xl py-12 text-center text-blue-300 font-sans">
                        <BookOpen className="w-8 h-8 text-blue-100 mx-auto mb-2" />
                        <p className="text-xs">Your spiritual devotional notebook is clean & empty.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
                        {journalList.map((j) => (
                          <div key={j.id} className="p-4 bg-[#1e3a8a]/20 border border-blue-400/30 rounded-xl text-left space-y-3 relative shadow-sm">
                            <div className="flex justify-between items-center text-xs border-b border-blue-400/30 pb-2 font-sans">
                              <span className="bg-blue-900/30 text-[#fcd34d] font-extrabold px-2.5 py-1 rounded-lg text-[10px] uppercase font-mono border border-blue-400/20">
                                📖 Core Reference: {j.verse}
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="text-blue-200 font-mono text-[10px]">{j.date}</span>
                                <button 
                                  onClick={() => handleDeleteJournal(j.id)}
                                  className="text-blue-100 hover:text-blue-300 cursor-pointer text-[10px] font-black uppercase tracking-wider"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <p className="text-white text-xs italic font-serif leading-relaxed">
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
              <section className="bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl p-6 md:p-8 space-y-8 shadow-sm" id="about-us-panel">
                <div className="border-b border-blue-400/30 pb-5 text-left">
                  <span className="font-mono text-xs uppercase text-[#fcd34d] font-bold tracking-widest block mb-0.5">🌍 OUR TESTIMONY</span>
                  <h3 className="font-sans text-lg md:text-xl font-extrabold text-white tracking-tight uppercase">Voice of Jesus Radio - Lira, Northern Uganda</h3>
                  <p className="text-xs text-blue-200">A legacy of spreading uncompromised Biblical truths, deliverance, salvation and healing hope.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4 text-left text-xs text-white leading-relaxed font-sans font-medium">
                    {aboutUsText ? (
                      <div className="whitespace-pre-wrap">{aboutUsText}</div>
                    ) : (
                      <>
                        <h4 className="text-white font-sans text-base font-bold uppercase mb-2">Our Celestial Mission</h4>
                        <p>
                          Voice of Jesus Radio was established in the hearts of pastoral leaders in Lira, Northern Uganda, in response to a divine mandate: 
                          <em> "Go into all the world and preach the gospel to every creature" (Mark 16:15)</em>. Over our years on the digital and FM back-ups, we have served as a source of recovery, comfort, and deliverance for thousands of homes.
                        </p>
                        <p>
                          From spiritual warfare prayers, high-definition praise beats of East-Africa, to laying of hands on stream callers, our program slots are carefully crafted. Hundreds have testified to healing from malaria, chronic pain, spiritual afflictions and social reconciliation through direct faith intercession.
                        </p>
                        <p className="bg-amber-500/10 border-l-4 border-[#fcd34d] rounded-r-xl p-4 text-[#fcd34d] font-sans">
                          <strong>Operational costs statement:</strong> To keep this digital station broadcast equipment on continuous standby, pay for our secure web hosting, domain name records and continuous Zeno radio satellite streaming platform subscription, we need exactly <strong>500,000 UGX</strong> every single year. Your generous sacrificial contributions directly finance this ministry on the airwaves of hope.
                        </p>
                      </>
                    )}
                  </div>

                  {/* Aesthetic mission cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#1e3a8a]/20 border border-blue-400/30 p-5 rounded-2xl text-left space-y-2 shadow-sm">
                      <div className="w-10 h-10 bg-blue-900/30 rounded-xl border border-blue-400/20 flex items-center justify-center text-[#fcd34d] mb-2">
                        <Globe className="w-5 h-5" />
                      </div>
                      <h5 className="font-bold text-xs uppercase text-white tracking-wider">Universal Reach</h5>
                      <p className="text-[11px] text-white">Broadcasting live across the entire East African region and globally via the internet.</p>
                    </div>

                    <div className="bg-[#1e3a8a]/20 border border-blue-400/30 p-5 rounded-2xl text-left space-y-2 shadow-sm">
                      <div className="w-10 h-10 bg-blue-900/30 rounded-xl border border-blue-400/20 flex items-center justify-center text-[#fcd34d] mb-2">
                        <Award className="w-5 h-5" />
                      </div>
                      <h5 className="font-bold text-xs uppercase text-white tracking-wider">Salvation Fruit</h5>
                      <p className="text-[11px] text-white">Witnessing dozens of souls accepting Jesus Christ on our weekly live night devotions.</p>
                    </div>

                    <div className="bg-[#1e3a8a]/20 border border-blue-400/30 p-5 rounded-2xl text-left space-y-3 shadow-sm col-span-1 sm:col-span-2">
                      <h5 className="font-bold text-xs uppercase text-white tracking-wider">Meet Our Pastor Joseph</h5>
                      <quote className="block text-[11px] text-white italic font-serif leading-relaxed">
                        "Your support is not merely a payment, it is a spiritual vehicle carrying salvation, deliverance and divine breakthroughs into homes that are lost in the dark. May the God of peace bless you bountifully."
                      </quote>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 5. CONTACT US DESK VIEW */}
            {activeTab === 'contact' && (
              <section className="bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl p-6 md:p-8 space-y-8 shadow-sm" id="contact-desk-panel">
                <div className="border-b border-blue-400/30 pb-5 text-left">
                  <span className="font-mono text-xs uppercase text-[#fcd34d] font-bold tracking-widest block mb-0.5">📞 LIVE OUTREACH</span>
                  <h3 className="font-sans text-lg md:text-xl font-extrabold text-white tracking-tight uppercase">Connect With Our Studio Desk</h3>
                  <p className="text-xs text-blue-200">Submit prayer requests prompts, praise feedback, song shoutouts, or contribution verification inquiries.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Studio Directory info */}
                  <div className="lg:col-span-5 space-y-5 text-left">
                    <h4 className="text-white font-sans text-sm font-bold uppercase tracking-widest">Office Directory</h4>
                    
                    <div className="space-y-4 text-xs font-medium text-white">
                      <div className="flex items-start gap-3.5">
                        <MapPin className="w-5 h-4.5 text-amber-550 mt-0.5 shrink-0" />
                        <div>
                          <strong className="block text-white">Physical Studio Location</strong>
                          <span>Lira City, Northern Uganda</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <Phone className="w-5 h-4.5 text-amber-550 mt-0.5 shrink-0" />
                        <div>
                          <strong className="block text-white">Direct Telephone Call desk</strong>
                          <span>Live Hotline: 0769302480 / 0770795585</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <MessageSquare className="w-5 h-4.5 text-amber-550 mt-0.5 shrink-0" />
                        <div>
                          <strong className="block text-white">Official Ministry WhatsApp</strong>
                          <span>+256 770 795585</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <Mail className="w-5 h-4.5 text-amber-500 mt-0.5 shrink-0" />
                        <div>
                          <strong className="block text-white">Digital Mail Address</strong>
                          <span>contact@voiceofjesusradio.com</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-blue-400/30 flex flex-col gap-2 font-sans">
                      <a 
                        href={PHONE_CALL}
                        className="w-full text-center bg-[#1e3a8a]/20 hover:bg-[#1e3a8a]/40 border border-blue-400/30 text-white py-3 rounded-xl font-bold uppercase text-[10px] tracking-wider cursor-pointer"
                      >
                        Call Hotline desk Now
                      </a>
                      <a 
                        href={WHATSAPP_LINK}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full text-center bg-[#fcd34d] hover:bg-[#c1151c] text-white font-extrabold py-3 rounded-xl uppercase text-[10px] tracking-wider cursor-pointer"
                      >
                        WhatsApp Studio Live
                      </a>
                    </div>
                  </div>

                  {/* Mail delivery Form */}
                  <div className="lg:col-span-7 bg-[#1e3a8a]/20 border border-blue-400/30 rounded-xl p-6 text-left">
                    <h4 className="text-yellow-400 font-sans text-sm font-bold uppercase mb-4">Send a direct message</h4>
                    
                    <AnimatePresence mode="wait">
                      {contactSent ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="py-12 text-center space-y-3 font-sans"
                        >
                          <div className="w-12 h-12 bg-blue-900/30 text-[#fcd34d] rounded-full flex items-center justify-center mx-auto border border-blue-400/20">
                            <Check className="w-6 h-6" />
                          </div>
                          <h5 className="font-serif text-white font-bold uppercase text-sm">Message Transmitted!</h5>
                          <p className="text-xs text-blue-100">Your praise feedback message has been directly dispatched to the Voice Of Jesus pastors in the studio.</p>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleContactSubmit} className="space-y-4 font-sans">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-white uppercase mb-1.5 font-mono">Your Full Name</label>
                              <input
                                type="text"
                                required
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                placeholder="Sister Acen Agnes"
                                className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-[#3a936a]"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-bold text-white uppercase mb-1.5 font-mono">Reply Mobile Phone (MoMo)</label>
                              <input
                                type="tel"
                                placeholder="e.g. 0770795585"
                                className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-[#3a936a]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-white uppercase mb-1.5 font-mono">Your message details</label>
                            <textarea
                              required
                              rows={4}
                              value={contactMessage}
                              onChange={(e) => setContactMessage(e.target.value)}
                              placeholder="Type your prayer requests, song requests, greetings to your family in Northern Uganda or compliments to the pastor..."
                              className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-3 px-4 text-xs text-white placeholder-blue-300 focus:outline-none focus:border-[#3a936a] font-medium"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3 bg-[#3a936a] hover:bg-[#2d7353] text-white font-serif text-xs font-extrabold uppercase tracking-widest cursor-pointer shadow-sm rounded-xl flex items-center justify-center gap-2"
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

            {/* 9. SECURE ADMINISTRATOR CONTROL DASHBOARD */}
            {activeTab === 'admin' && (
              <section className="bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl p-6 md:p-8 space-y-8 text-left shadow-sm" id="admin-desk-panel">
                <div className="border-b border-blue-400/30 pb-5 text-left">
                  <span className="font-mono text-xs uppercase text-[#fcd34d] font-extrabold tracking-widest block mb-1">🔒 SECURE CONTROL VAULT</span>
                  <h3 className="font-sans text-lg md:text-xl font-extrabold text-white tracking-tight uppercase">Voice Of Jesus Admin Console</h3>
                  <p className="text-xs text-blue-200 mt-1">Authorized access limits for Pastor Bonny Obote to manage campaign values, configure secure keys, and deploy live blogs.</p>
                </div>

                {!adminIsLoggedIn ? (
                  /* Admin Secure Login credentials access */
                  <div className="max-w-md mx-auto bg-[#1e3a8a]/20 border border-blue-400/30 rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-[#1e3a8a]/40 border border-blue-400/30 text-[#fcd34d] rounded-full flex items-center justify-center mx-auto shadow-sm animate-pulse">
                        <Lock className="w-5 h-5" />
                      </div>
                      <h4 className="font-sans text-white uppercase text-xs font-bold">Admin Signature Auth</h4>
                      <p className="text-[11px] text-white font-medium">Provide authorize email and password credentials designed for Pastor Bonny Obote</p>
                    </div>

                    {loginError && (
                      <div className="p-3 bg-blue-900/30 border border-blue-400/50 text-blue-100 text-xs rounded-xl font-medium">
                        ⚠️ {loginError}
                      </div>
                    )}

                    <form onSubmit={handleAdminSignIn} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono font-bold">AUTHORIZED EMAIL ADDRESS</label>
                        <input
                          type="email"
                          required
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-[#fcd34d]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono font-bold">SECURITY ASSIGNED PASSWORD</label>
                        <input
                          type="password"
                          required
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-[#fcd34d]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full py-3 bg-[#fcd34d] hover:bg-[#c1151c] text-white font-sans text-xs font-bold uppercase tracking-widest cursor-pointer shadow-sm rounded-xl transition-all disabled:opacity-50"
                      >
                        {isLoggingIn ? 'Decrypting Credentials...' : 'Sign In as Administrator'}
                      </button>
                    </form>

                    <div className="pt-4 border-t border-blue-400/30 text-center">
                      <p className="text-[10px] text-blue-200 leading-relaxed">
                        Strictly restricted to administrators. System firewall records and logs are persistently monitored.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Admin Command Deck panels - 3 logical workspaces */
                  <div className="space-y-8">
                    {/* Console Header row with quick action buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#1e3a8a]/20 border border-blue-400/30 rounded-xl">
                      <div className="text-left font-mono">
                        <span className="text-[10px] bg-blue-900/30 text-[#fcd34d] font-extrabold px-2 py-0.5 rounded-full border border-blue-400/50 uppercase">Session Active</span>
                        <h4 className="text-white text-xs font-bold mt-1.5">{adminEmail}</h4>
                      </div>
                      <button
                        onClick={() => { setAdminIsLoggedIn(false); setAdminPassword(''); }}
                        className="text-xs bg-[#1e3a8a]/40 hover:bg-[#1e3a8a]/20 border border-blue-400/30 hover:border-blue-400/50 text-white py-1.5 px-3 rounded-lg font-bold uppercase transition-all cursor-pointer font-mono"
                      >
                        Secure Log Out
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Left: General Announcements and collected goals */}
                      <div className="lg:col-span-12 xl:col-span-6 space-y-6">
                        <form onSubmit={handleSaveHomepageOptions} className="bg-[#1e3a8a]/20 border border-blue-400/30 rounded-xl p-5 md:p-6 space-y-5 text-left shadow-sm">
                          <h4 className="text-yellow-400 font-sans text-xs font-bold uppercase tracking-widest border-b border-blue-400/30 pb-2 flex items-center gap-2 font-black">
                            <Settings className="w-4 h-4 text-[#fcd34d]" />
                            <span>1. Homepage easily change options</span>
                          </h4>

                          <div className="space-y-4 font-sans">
                            <div>
                              <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono font-bold">Aura Broadcast Announcement Banner</label>
                              <textarea
                                rows={2}
                                value={homeAnnouncementText}
                                onChange={(e) => setHomeAnnouncementText(e.target.value)}
                                placeholder="Change homepage ticker messages here..."
                                className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#fcd34d] font-medium"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono font-bold">Operations Target Goal (UGX)</label>
                                <input
                                  type="number"
                                  value={homeTargetUgx}
                                  onChange={(e) => setHomeTargetUgx(Number(e.target.value))}
                                  className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#fcd34d]"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono font-bold">Collected progressions (UGX)</label>
                                <input
                                  type="number"
                                  value={homeTotalReceived}
                                  onChange={(e) => setHomeTotalReceived(Number(e.target.value))}
                                  className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#fcd34d]"
                                />
                              </div>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-[#fcd34d] hover:bg-[#c1151c] text-white text-[10px] font-mono tracking-widest font-extrabold uppercase rounded-lg transition-all cursor-pointer"
                          >
                            Update Station Metrics
                          </button>
                        </form>

                        {/* Flutterwave Secret settings */}
                        <form onSubmit={handleSaveFlutterwaveCredentials} className="bg-[#1e3a8a]/20 border border-blue-400/30 rounded-xl p-5 md:p-6 space-y-5 text-left font-sans shadow-sm">
                          <h4 className="text-yellow-400 font-sans text-xs font-bold uppercase tracking-widest border-b border-blue-400/30 pb-2 flex items-center gap-2 font-black">
                            <CreditCard className="w-4 h-4 text-[#fcd34d]" />
                            <span>2. Configure Direct Flutterwave Credentials (Admin Only)</span>
                          </h4>

                          <p className="text-[10px] text-blue-200 leading-relaxed font-sans">
                            Integrate secure API keys directly with your Flutterwave dashboard to process live credit card payments and secure MoMo routes securely.
                          </p>

                          <div className="space-y-4">
                            <div>
                               <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono font-bold">FLUTTERWAVE PUBLIC KEY</label>
                              <input
                                type="text"
                                value={flutterwavePublicKey}
                                onChange={(e) => setFlutterwavePublicKey(e.target.value)}
                                placeholder="FLWPUBK_TEST-xxxxxxxxxxxxxxxx-X"
                                className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#fcd34d] font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono">FLUTTERWAVE SECRET KEY</label>
                              <input
                                type="password"
                                value={flutterwaveSecretKey}
                                onChange={(e) => setFlutterwaveSecretKey(e.target.value)}
                                placeholder="FLWSECK_TEST-••••••••••••••••"
                                className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#fcd34d] font-mono"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-[#fcd34d] hover:bg-[#c1151c] text-white border border-[#fcd34d] text-[10px] font-mono tracking-widest font-extrabold uppercase rounded-lg transition-all cursor-pointer"
                          >
                            Save Payment Credentials
                          </button>
                        </form>
                      </div>

                      {/* Right: Publish custom Blogs and Miracles section */}
                      <div className="lg:col-span-12 xl:col-span-6 font-sans">
                        <form onSubmit={handlePublishBlogPost} className="bg-[#1e3a8a]/20 border border-blue-400/30 rounded-xl p-5 md:p-6 space-y-5 text-left font-sans shadow-sm">
                          <h4 className="text-yellow-400 font-sans text-xs font-bold uppercase tracking-widest border-b border-blue-400/30 pb-2 flex items-center gap-2 font-black">
                            <PlusCircle className="w-4 h-4 text-[#fcd34d]" />
                            <span>3. Update blog post in blog Area</span>
                          </h4>

                          <div className="space-y-4 font-sans">
                            <div>
                              <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono">CHRONICLE TITLE</label>
                              <input
                                type="text"
                                required
                                value={newBlogTitle}
                                onChange={(e) => setNewBlogTitle(e.target.value)}
                                placeholder="e.g. POWERFUL MIRACLES WITNESSED IN NORTH OVERNIGHT"
                                className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#fcd34d] uppercase font-bold"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono">AUTHOR NAME</label>
                                <input
                                  type="text"
                                  required
                                  value={newBlogAuthor}
                                  onChange={(e) => setNewBlogAuthor(e.target.value)}
                                  className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#fcd34d]"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono">CATEGORY CLASSIFIER</label>
                                <select
                                  value={newBlogCategory}
                                  onChange={(e) => setNewBlogCategory(e.target.value)}
                                  className="w-full h-10 bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl px-2 text-xs text-white focus:outline-none font-medium focus:border-[#fcd34d]"
                                >
                                  <option value="SERMONS">SERMONS</option>
                                  <option value="DEVOTIONALS">DEVOTIONALS</option>
                                  <option value="ANNOUNCEMENTS">ANNOUNCEMENTS</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono">VISUAL HERO GRAPHIC IMAGE URL</label>
                              <input
                                type="url"
                                value={newBlogImageUrl}
                                onChange={(e) => setNewBlogImageUrl(e.target.value)}
                                placeholder="https://images.unsplash.com/photo-..."
                                className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#fcd34d] font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-white uppercase mb-1.5 font-mono font-bold">CHRONICLE FULL PASSAGE TEXT</label>
                              <textarea
                                required
                                rows={6}
                                value={newBlogContent}
                                onChange={(e) => setNewBlogContent(e.target.value)}
                                placeholder="Pastor Bonny shares the incredible sermon details with digital world..."
                                className="w-full bg-[#1e3a8a]/40 border border-blue-400/30 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-[#fcd34d] font-medium"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={isPublishingBlog}
                            className="w-full py-3 bg-[#fcd34d] hover:bg-[#c1151c] text-white font-sans text-xs font-bold uppercase tracking-widest cursor-pointer shadow-sm rounded-xl transition-all disabled:opacity-50"
                          >
                            {isPublishingBlog ? 'Replicating Live Archives...' : 'Deploy Chronicle Post'}
                          </button>
                        </form>
                      </div>
                    </div>

                    {/* PHP custom backend connection */}
                    <div className="mt-8 border-t border-blue-400/30 pt-8">
                      <PHPConnector />
                    </div>
                  </div>
                )}
              </section>
            )}

          </motion.div>
        </AnimatePresence>

      </div>

      {/* SCREENSHOT STYLED FOOTER */}
      <footer className="bg-[#1e1b4b] text-white pt-12 pb-8 px-6 font-sans w-full mt-auto relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-[#1e3a8a]/20"></div>
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          <div className="space-y-4">
            <h4 className="font-extrabold uppercase text-lg mb-4">Live Radio Channels</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><button onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-blue-100/80 transition-colors">Daily Devotions</button></li>
              <li><button onClick={() => { setActiveTab('journal'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-blue-100/80 transition-colors">Sermons Note</button></li>
              <li><button onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-blue-100/80 transition-colors">Morning Devotions</button></li>
              <li><button onClick={() => { setActiveTab('blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-blue-100/80 transition-colors">Lira City Updates</button></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-extrabold uppercase text-lg mb-4">Ministry Channels</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><button onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-blue-100/80 transition-colors">Live Radio</button></li>
              <li><button onClick={() => { setActiveTab('momo'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-blue-100/80 transition-colors">Support Live Campaign</button></li>
              <li><button onClick={() => { setActiveTab('schedule'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-blue-100/80 transition-colors">Live Presenters Timetable</button></li>
            </ul>
          </div>

          <div className="space-y-4 md:col-span-2 flex flex-col items-start md:items-end text-left md:text-right">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 border-2 border-blue-400/30 flex items-center justify-center font-bold text-xl relative">
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#1e3a8a]/40 rounded-full"></span>
                †
              </div>
              <div className="leading-tight text-left">
                <h1 className="font-extrabold text-sm uppercase tracking-wide">Voice Of Jesus</h1>
                <p className="text-[9px] font-medium tracking-widest uppercase opacity-90">RADIO STATION</p>
              </div>
            </div>
            <p className="text-sm max-w-sm font-medium leading-relaxed">
              Broadcasting uncompromised biblical truths, spiritual breakthroughs, and East-African gospel rhythms across Northern Uganda.
            </p>
            <div className="mt-6 flex gap-3">
               {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                  <a key={social} href={`https://${social}.com`} target="_blank" rel="noreferrer" className="w-10 h-10 border-2 border-blue-400/30 rounded-full flex items-center justify-center hover:bg-[#1e3a8a]/40 hover:text-[#fcd34d] transition-colors font-bold uppercase text-sm">
                    {social.substring(0, 1)}
                  </a>
               ))}
            </div>
            
            <div className="mt-6 text-sm font-medium text-blue-200 text-left md:text-right space-y-1">
              {footerText ? (
                <div className="whitespace-pre-wrap">{footerText}</div>
              ) : (
                <>
                  <p>Lira City, Northern Uganda</p>
                  <p>Call: 0769302480 / 0770795585</p>
                  <p>WhatsApp: +256 770 795585</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto mt-12 pt-8 border-t border-blue-400/30/20 text-center text-sm font-medium opacity-90 flex flex-col md:flex-row items-center justify-between gap-4">
          {footerCopyrightText ? <p dangerouslySetInnerHTML={{ __html: footerCopyrightText }} /> : <p>&copy; {new Date().getFullYear()} Voice Of Jesus Radio.</p>}
          <p className="font-mono text-xs tracking-widest uppercase"></p>
        </div>
      </footer>

      {/* INTUITIVE GOSPEL BLOG READER FULL MODAL */}
      <AnimatePresence>
        {selectedFullBlog && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 font-sans"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-neutral-900 border border-neutral-800 w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl relative text-left"
            >
              <button
                onClick={() => setSelectedFullBlog(null)}
                className="absolute top-6 right-6 z-10 bg-black/60 hover:bg-black/90 p-2.5 rounded-full border border-neutral-800 text-white transition-all cursor-pointer"
                title="Deactivate reader"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-64 sm:h-80 relative bg-neutral-950">
                <img 
                  src={selectedFullBlog.imageUrl || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop"} 
                  alt={selectedFullBlog.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="bg-[#fcd34d] text-white font-mono text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wide">
                    {selectedFullBlog.category}
                  </span>
                  <h3 className="font-sans text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-3 leading-tight uppercase">
                    {selectedFullBlog.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-4 font-mono">
                  <span>BY AUTHOR : <strong className="text-white uppercase">{selectedFullBlog.author}</strong></span>
                  <span>PUBLISHED : {selectedFullBlog.date}</span>
                </div>

                <div className="text-white text-sm md:text-base leading-relaxed space-y-4 max-h-[30vh] overflow-y-auto pr-2 font-light whitespace-pre-wrap font-sans">
                  {selectedFullBlog.content}
                </div>

                <div className="border-t border-neutral-805 pt-4 flex justify-end">
                  <button
                    onClick={() => setSelectedFullBlog(null)}
                    className="bg-[#fcd34d] hover:bg-[#c1151c] text-white text-xs font-mono font-bold tracking-widest uppercase py-3 px-6 rounded-xl cursor-pointer"
                  >
                     Close Archives Reader
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
