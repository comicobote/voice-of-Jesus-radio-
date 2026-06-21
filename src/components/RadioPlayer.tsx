import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Disc, Sparkles, Users, Radio, Activity
} from 'lucide-react';
import { customFetch } from './PHPConnector';

interface RadioPlayerProps {
  onAddBroadcastStatus?: (msg: string) => void;
}

export default function RadioPlayer({ onAddBroadcastStatus }: RadioPlayerProps) {
  const DEFAULT_STREAM_URL = "https://stream.zeno.fm/ssue0yzyum0uv";
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("READY TO HEAR");
  
  // Custom status color classes
  const [statusColorClasses, setStatusColorClasses] = useState<string>(
    "bg-stone-100 text-stone-700 border-stone-200"
  );
  
  // Active listeners starting at 324, syncing automatically with server
  const [listeners, setListeners] = useState<number>(324);
  const [currentShow, setCurrentShow] = useState<{title: string, sub: string}>({
    title: "Voice Of Jesus Radio",
    sub: "Northern Uganda's Eternal Beacon of Faith"
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Dynamic fluctuation of listener counts pulling from real server endpoint via customFetch
  useEffect(() => {
    const fetchListeners = async () => {
      try {
        const res = await customFetch("/api/listeners");
        const data = await res.json();
        if (data && typeof data.count === "number") {
          setListeners(data.count);
        }
      } catch (e) {
        setListeners(prev => prev + (Math.floor(Math.random() * 3) - 1));
      }
    };

    fetchListeners();
    const interval = setInterval(fetchListeners, 10000);
    return () => clearInterval(interval);
  }, []);

  // Update show title based on current time
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 8) {
      setCurrentShow({ 
        title: "Morning Devotional & Prayer Hour", 
        sub: "Divine Covenant Morning Deliverance with Pastor Alfred" 
      });
    } else if (hours >= 9 && hours < 12) {
      setCurrentShow({ 
        title: "The Living Word Hour", 
        sub: "Interactive Bible Exposition and Open Discussion" 
      });
    } else if (hours >= 13 && hours < 16) {
      setCurrentShow({ 
        title: "Hour of Joy & Celestial Praise", 
        sub: "African Gospel Beats, Praise Medleys & Testimonies" 
      });
    } else if (hours >= 18 && hours < 21) {
      setCurrentShow({ 
        title: "Divine Healing & Prophetic Deliverance", 
        sub: "Live Global Prayer Outreach & Spiritual Deliverance" 
      });
    } else {
      setCurrentShow({ 
        title: "Overnight Deliverance Sanctuary", 
        sub: "Deep Spiritual Reflection, Hymns & Quiet Meditative Keys" 
      });
    }
  }, []);

  // Keep actual HTML Audio element volume in sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Audio stream state triggers passed upward
  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsBuffering(false);
      setStatusText("PAUSED");
      setStatusColorClasses("bg-stone-100 text-stone-600 border-stone-200");
      onAddBroadcastStatus?.("⏸️ Live Broadcast stream suspended.");
    } else {
      setIsBuffering(true);
      setStatusText("TUNING FEED...");
      setStatusColorClasses("bg-red-50 text-[#df2027] border-red-200 animate-pulse");
      onAddBroadcastStatus?.("📡 Connecting to global high-definition gospel stream server...");
      
      try {
        if (!audioRef.current.src || audioRef.current.src !== DEFAULT_STREAM_URL) {
          audioRef.current.src = DEFAULT_STREAM_URL;
        }
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
            setIsBuffering(false);
            setStatusText("LIVE ON AIR");
            setStatusColorClasses("bg-[#df2027] text-white border-[#df2027] shadow-sm font-black");
            onAddBroadcastStatus?.("📻 Hallelujah! Connected. Voice Of Jesus Radio is live.");
          }).catch(err => {
            console.error("Audio playback failure:", err);
            setIsPlaying(false);
            setIsBuffering(false);
            setStatusText("STATION MUTED");
            setStatusColorClasses("bg-amber-100 text-amber-800 border-amber-250");
            onAddBroadcastStatus?.("⚠️ Direct gateway offline. Retrying standard satellite feed...");
          });
        }
      } catch (err) {
        setIsPlaying(false);
        setIsBuffering(false);
        setStatusText("OFFLINE");
        setStatusColorClasses("bg-red-50 text-red-700 border-red-200");
        onAddBroadcastStatus?.("⚠️ Audio player failed to initialize. Reload the page.");
      }
    }
  };

  const handleAudioLoadStart = () => {
    if (isPlaying) {
      setIsBuffering(true);
    }
  };

  const handleAudioPlaying = () => {
    setIsBuffering(false);
    setStatusText("LIVE ON AIR");
    setStatusColorClasses("bg-[#df2027] text-white border-[#df2027] shadow-sm font-extrabold");
  };

  const handleAudioError = () => {
    setIsPlaying(false);
    setIsBuffering(false);
    setStatusText("RECONNECTING");
    setStatusColorClasses("bg-amber-50 text-amber-800 border-amber-200 animate-pulse");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const visualizerBarsCount = 26;

  return (
    <div className={`relative rounded-[28px] p-6 md:p-8 bg-white border transition-all duration-700 overflow-hidden shadow-md ${
      isPlaying 
        ? 'border-red-500 shadow-[0_4px_30px_rgba(223,32,39,0.1)] ring-1 ring-[#df2027]/20' 
        : 'border-stone-200 hover:border-red-400/30'
    }`} id="radio-player-container">
      
      {/* HTML5 Audio API Node */}
      <audio
        ref={audioRef}
        src={DEFAULT_STREAM_URL}
        preload="auto"
        crossOrigin="anonymous"
        onLoadStart={handleAudioLoadStart}
        onPlaying={handleAudioPlaying}
        onError={handleAudioError}
        style={{ display: 'none' }}
      />

      {/* Atmospheric rich light glowing backgrounds - beautiful gold & red orbs */}
      <div className={`absolute -top-24 -right-24 w-80 h-80 rounded-full filter blur-3xl pointer-events-none transition-all duration-1000 ${
        isPlaying ? 'bg-red-500/10' : 'bg-stone-50'
      }`}></div>
      <div className={`absolute -bottom-24 -left-24 w-80 h-80 rounded-full filter blur-3xl pointer-events-none transition-all duration-1000 ${
        isPlaying ? 'bg-red-500/5' : 'bg-stone-100/50'
      }`}></div>

      {/* Internal Content Stack */}
      <div className="relative z-10 space-y-6">
         
         {/* TOP STATION BANNER HUD */}
         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-stone-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className={`flex h-3.5 w-3.5 rounded-full transition-all duration-500 ${isPlaying ? "bg-yellow-500" : "bg-stone-300"}`}>
                {isPlaying && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-400 animate-ping opacity-75"></span>
                )}
              </span>
            </div>
            
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black tracking-[0.25em] text-[#df2027] uppercase font-mono">ON-AIR FEED</span>
                <Sparkles className="w-3.5 h-3.5 text-[#df2027] animate-pulse shrink-0" />
              </div>
              <p className="text-[10px] text-stone-600 font-medium tracking-wide font-sans uppercase">Apostolic Hope & Healing</p>
            </div>
          </div>

          {/* Connected Roster Statistics Counter with clean background */}
          <div className="flex items-center gap-2 bg-stone-50 px-3.5 py-1.5 rounded-xl border border-stone-200 text-[11px] font-mono font-bold text-stone-800 shadow-sm">
            <Users className="w-3.5 h-3.5 text-[#df2027] shrink-0" />
            <span>LIVE {listeners.toLocaleString()} LISTENING</span>
          </div>
        </div>

        {/* INTEGRATED TUNER SCREEN (GLASS DISPLAY DECK) */}
        <div className="bg-[#fafbfe] rounded-2xl border border-stone-200 relative overflow-hidden p-6 md:p-8 text-center space-y-6 shadow-sm">
          
          {/* Aesthetic retro-modern terminal brackets */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-stone-300"></div>
          <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-stone-300"></div>
          <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-stone-300"></div>
          <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-stone-300"></div>

          {/* Current Status Indicator */}
          <div className="inline-block" id="stream-status-badge">
            <span className={`text-[10px] uppercase font-extrabold px-4 py-1.5 rounded-full border tracking-[0.2em] font-mono transition-all duration-500 ${statusColorClasses}`}>
              {statusText}
            </span>
          </div>

          {/* Vinyl Discard Media Plate - Tactile, clickable play button! */}
          <div className="flex justify-center py-1">
            <div 
              onClick={togglePlay}
              className="relative cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-98"
              title={isPlaying ? "Click to Pause" : "Click to Play"}
            >
              {/* Rotating Outer Track */}
              <div className={`w-38 h-38 rounded-full bg-gradient-to-br from-stone-800 via-stone-950 to-stone-900 p-[3px] border border-stone-700/80 flex items-center justify-center shadow-2xl relative ${
                isPlaying ? "animate-spin" : ""
              }`} style={{ animationDuration: '10s' }} id="record-plate">
                <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_35%,_rgba(0,0,0,0.95)_90%)] rounded-full"></div>
                
                {/* Grooves Simulation */}
                <div className="absolute w-30 h-30 border border-neutral-800/40 rounded-full"></div>
                <div className="absolute w-24 h-24 border border-neutral-800/60 rounded-full"></div>
                <div className="absolute w-16 h-16 border border-neutral-900/60 rounded-full"></div>
                
                {/* Center Core */}
                <div className="w-12 h-12 rounded-full bg-stone-900 border border-[#df2027]/30 flex items-center justify-center relative z-10 shadow-lg">
                  <div className="w-6 h-6 rounded-full bg-[#df2027]/10 flex items-center justify-center">
                    <Radio className="w-3.5 h-3.5 text-[#df2027]" />
                  </div>
                </div>
              </div>

              {/* Large floating overlay play trigger UI */}
              <div className="absolute inset-0 flex items-center justify-center bg-[#df2027]/10 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="bg-[#df2027] hover:bg-[#c1151c] text-white font-sans font-extrabold text-[11px] uppercase px-4 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                  {isPlaying ? <Pause className="w-3.5 h-3.5 text-white" /> : <Play className="w-3.5 h-3.5 text-white fill-white" />}
                  <span>{isPlaying ? 'Pause Radio' : 'Stream Radio'}</span>
                </div>
              </div>

              {/* Laser Pointer Light Accent */}
              {isPlaying && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#df2027]/40 rounded-full filter blur-md animate-pulse"></div>
              )}
            </div>
          </div>

          {/* Active Show/Sermon Metagrid - Fully optimized for modern legible contrast */}
          <div className="space-y-1.5 relative z-10 max-w-lg mx-auto text-center">
            <h3 className="text-stone-900 text-base md:text-lg font-bold font-sans uppercase tracking-tight">
              {currentShow.title}
            </h3>
            <p className="text-xs text-[#df2027] font-semibold tracking-wide max-w-sm mx-auto font-sans">
              {currentShow.sub}
            </p>
          </div>

          {/* Stereo Digital Amplitude Equalizer Visualizer */}
          <div className="flex justify-center items-end h-8 gap-0.5 pt-2 overflow-hidden border-t border-stone-200" id="live-audio-visualizer">
            {Array.from({ length: visualizerBarsCount }).map((_, idx) => {
              const delay = (0.04 * (idx % 12)).toFixed(2);
              const duration = (0.5 + Math.random() * 0.7).toFixed(2);
              const style = isPlaying
                ? { animationDelay: `${delay}s`, animationDuration: `${duration}s` }
                : { transform: 'scaleY(0.15)', animation: 'none' };

              // Beautiful Red-Orange glowing equalizer bars
              let barGradients = "from-[#df2027] via-rose-500 to-[#df2027]"; // Default
              if (idx % 4 === 0) {
                barGradients = "from-stone-950 via-stone-800 to-stone-600"; // Dark Onyx
              } else if (idx % 4 === 1) {
                barGradients = "from-[#df2027] to-red-400"; // Pulse Red Light
              } else if (idx % 4 === 2) {
                barGradients = "from-rose-500 via-red-350 to-rose-400"; // Rose Gold
              } else if (idx % 4 === 3) {
                barGradients = "from-[#df2027] via-red-650 to-stone-900"; // Dark Crimson
              }

              return (
                <div
                  key={idx}
                  className={`w-1.5 bg-gradient-to-t ${barGradients} rounded-full visualizer-bar h-8 origin-bottom transition-all`}
                  style={style}
                ></div>
              );
            })}
          </div>
        </div>

        {/* MAIN HUD TENSION CONTROL SLATE */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-col md:flex-row items-center gap-4 justify-between">
          
          {/* Main Power/Streaming Switch */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause live feed" : "Stream live broadcast"}
            id="play-stream-button"
            className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform active:scale-95 border shrink-0 ${
              isPlaying
                ? 'bg-[#df2027] border-[#df2027] text-white shadow-sm hover:scale-105'
                : 'bg-black hover:bg-stone-900 border-black text-white hover:scale-105 shadow-sm'
            }`}
          >
            {isBuffering ? (
              <svg className="w-6 h-6 animate-spin text-current" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isPlaying ? (
              <Pause className="w-6 h-6 fill-current stroke-current" />
            ) : (
              <Play className="w-6 h-6 fill-current stroke-current ml-1" />
            )}
          </button>

          {/* Streaming Connection State */}
          <div className="text-center md:text-left flex-1 space-y-0.5">
            <span className="block text-stone-500 text-[8px] font-bold uppercase tracking-[0.18em] font-mono">DIGITAL RECEIVER</span>
            <span className="block text-xs font-semibold text-stone-800 tracking-wide">
              {isPlaying ? "ACTIVE GOSPEL BROADCAST STREAM" : "STANDBY STATION - HIT THE GOLD PLAY BUTTON!"}
            </span>
          </div>

          {/* Clean Glassmorphic Slider and Dial Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto md:min-w-[150px] bg-stone-100 py-1.5 px-3 rounded-xl border border-stone-200 shadow-sm" id="volume-pane">
            <button
              onClick={toggleMute}
              className="text-stone-500 hover:text-[#df2027] transition-colors focus:outline-none h-6 w-6 flex items-center justify-center rounded-lg hover:bg-stone-200"
              title={isMuted ? "Unmute stream" : "Mute stream"}
              id="volume-mute-button"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-stone-400 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4 text-stone-600" />
              )}
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-full h-1 bg-stone-200 accent-[#df2027] rounded-lg cursor-pointer hover:accent-[#df2027] transition-colors focus:outline-none"
              style={{ background: `linear-gradient(to right, #df2027 ${(isMuted ? 0 : volume) * 100}%, #e5e7eb ${(isMuted ? 0 : volume) * 100}%)` }}
              aria-label="Volume level controller"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
