import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Disc, Sparkles, Users, Radio, Activity
} from 'lucide-react';

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
  
  // Custom green-based color state for the tuner status
  const [statusColorClasses, setStatusColorClasses] = useState<string>(
    "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
  );
  
  // Stats / listener simulator values
  const [listeners, setListeners] = useState<number>(314);
  const [currentShow, setCurrentShow] = useState<{title: string, sub: string}>({
    title: "Voice Of Jesus Radio",
    sub: "Northern Uganda's Eternal Beacon of Faith"
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Dynamic fluctuation of listener counts for authentic simulation
  useEffect(() => {
    const inter = setInterval(() => {
      setListeners(prev => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(280, prev + delta);
      });
    }, 8000);
    return () => clearInterval(inter);
  }, []);

  // Update show title based on current time (Ugandan local/simulated broadcaster schedules)
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
        title: "Divine Healing & Breakout Prophecy", 
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

  // Audio stream state triggers
  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsBuffering(false);
      setStatusText("PAUSED");
      setStatusColorClasses("bg-stone-100 text-stone-500 border-stone-200");
      onAddBroadcastStatus?.("⏸️ Live Broadcast stream suspended.");
    } else {
      setIsBuffering(true);
      setStatusText("TUNING FEED...");
      setStatusColorClasses("bg-emerald-50 text-emerald-600 border-emerald-200 animate-pulse");
      onAddBroadcastStatus?.("📡 Connecting to global high-definition gospel stream server...");
      
      try {
        audioRef.current.src = DEFAULT_STREAM_URL;
        audioRef.current.load();
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
            setIsBuffering(false);
            setStatusText("LIVE ON AIR");
            setStatusColorClasses("bg-emerald-555 text-white border-emerald-600 bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] font-black");
            onAddBroadcastStatus?.("📻 Hallelujah! Connected. Voice Of Jesus Radio is live.");
          }).catch(err => {
            console.error("Audio playback failure:", err);
            setIsPlaying(false);
            setIsBuffering(false);
            setStatusText("STATION MUTED");
            setStatusColorClasses("bg-red-50 text-red-600 border-red-200");
            onAddBroadcastStatus?.("⚠️ Direct gateway offline. Retrying standard satellite feed...");
          });
        }
      } catch (err) {
        setIsPlaying(false);
        setIsBuffering(false);
        setStatusText("OFFLINE");
        setStatusColorClasses("bg-red-50 text-red-600 border-red-200");
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
    setStatusColorClasses("bg-emerald-600 text-white border-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] font-black");
  };

  const handleAudioError = () => {
    setIsPlaying(false);
    setIsBuffering(false);
    setStatusText("RECONNECTING");
    setStatusColorClasses("bg-amber-50 text-amber-600 border-amber-200 animate-pulse");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const visualizerBarsCount = 26;

  return (
    <div className={`relative rounded-[24px] p-6 md:p-8 bg-white border transition-all duration-700 overflow-hidden shadow-lg ${
      isPlaying 
        ? 'border-emerald-500 shadow-[0_0_35px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20' 
        : 'border-slate-200 hover:border-slate-300'
    }`} id="radio-player-container">
      
      {/* HTML5 Audio API Node */}
      <audio
        ref={audioRef}
        src={DEFAULT_STREAM_URL}
        preload="none"
        crossOrigin="anonymous"
        onLoadStart={handleAudioLoadStart}
        onPlaying={handleAudioPlaying}
        onError={handleAudioError}
        style={{ display: 'none' }}
      />

      {/* Atmospheric rich light glowing backgrounds */}
      <div className={`absolute -top-24 -right-24 w-80 h-80 rounded-full filter blur-3xl pointer-events-none transition-all duration-1000 ${
        isPlaying ? 'bg-emerald-100/50' : 'bg-slate-100/30'
      }`}></div>
      <div className={`absolute -bottom-24 -left-24 w-80 h-80 rounded-full filter blur-3xl pointer-events-none transition-all duration-1000 ${
        isPlaying ? 'bg-teal-50' : 'bg-slate-100/20'
      }`}></div>

      {/* Internal Content Stack */}
      <div className="relative z-10 space-y-6">
        
        {/* TOP STATION BANNER HUD */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className={`flex h-3 w-3 rounded-full transition-all duration-500 ${isPlaying ? "bg-emerald-500" : "bg-stone-300"}`}>
                {isPlaying && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 animate-ping opacity-75"></span>
                )}
              </span>
            </div>
            
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold tracking-[0.25em] text-emerald-600 uppercase font-mono">ON-AIR FEED</span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
              </div>
              <p className="text-[10px] text-stone-500 font-medium tracking-wide font-sans uppercase">Apostolic Hope & Healing</p>
            </div>
          </div>

          {/* Connected Roster Statistics Counter */}
          <div className="flex items-center gap-2 bg-emerald-50/50 px-3.5 py-1.5 rounded-xl border border-emerald-100/50 text-[11px] font-mono font-bold text-emerald-700">
            <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{listeners.toLocaleString()} ONLINE SOULS</span>
          </div>
        </div>

        {/* INTEGRATED TUNER SCREEN (GLASS DISPLAY DECK) */}
        <div className="bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden p-6 md:p-8 text-center space-y-6 shadow-inner">
          
          {/* Aesthetic retro-modern terminal brackets */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-slate-300"></div>
          <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-slate-300"></div>
          <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-slate-300"></div>
          <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-slate-300"></div>

          {/* Current Status Indicator */}
          <div className="inline-block" id="stream-status-badge">
            <span className={`text-[10px] uppercase font-extrabold px-4 py-1.5 rounded-full border tracking-[0.2em] font-mono transition-all duration-500 ${statusColorClasses}`}>
              {statusText}
            </span>
          </div>

          {/* Vinyl Discard Media Plate */}
          <div className="flex justify-center py-1">
            <div className="relative">
              {/* Rotating Outer Track */}
              <div className={`w-36 h-36 rounded-full bg-gradient-to-br from-stone-100 via-stone-200 to-stone-50 p-[3px] border border-slate-200 flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.06)] relative ${
                isPlaying ? "animate-spin" : ""
              }`} style={{ animationDuration: '12s' }} id="record-plate">
                <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_40%,_rgba(255,255,255,0.85)_80%)] rounded-full"></div>
                
                {/* Grooves Simulation */}
                <div className="absolute w-28 h-28 border border-slate-300/30 rounded-full"></div>
                <div className="absolute w-20 h-20 border border-slate-300/40 rounded-full"></div>
                
                {/* Center Core */}
                <div className="w-12 h-12 rounded-full bg-white border border-emerald-100 flex items-center justify-center relative z-10 shadow-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Radio className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </div>
              </div>

              {/* Laser Pointer Light Accent */}
              {isPlaying && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400/35 rounded-full filter blur-md animate-pulse"></div>
              )}
            </div>
          </div>

          {/* Active Show/Sermon Metagrid - Fully optimized for modern legible contrast */}
          <div className="space-y-1.5 relative z-10 max-w-lg mx-auto text-center">
            <h3 className="text-stone-900 text-base md:text-lg font-bold tracking-tight font-sans uppercase">
              {currentShow.title}
            </h3>
            <p className="text-xs text-emerald-700 font-bold tracking-wide max-w-sm mx-auto">
              {currentShow.sub}
            </p>
          </div>

          {/* Stereo Digital Amplitude Equalizer Visualizer */}
          <div className="flex justify-center items-end h-8 gap-1 pt-2 overflow-hidden border-t border-slate-200/50" id="live-audio-visualizer">
            {Array.from({ length: visualizerBarsCount }).map((_, idx) => {
              const delay = (0.04 * (idx % 12)).toFixed(2);
              const duration = (0.5 + Math.random() * 0.7).toFixed(2);
              const style = isPlaying
                ? { animationDelay: `${delay}s`, animationDuration: `${duration}s` }
                : { transform: 'scaleY(0.15)', animation: 'none' };

              return (
                <div
                  key={idx}
                  className="w-1.5 bg-gradient-to-t from-emerald-600 via-emerald-500 to-emerald-400 rounded-full visualizer-bar h-8 origin-bottom transition-all"
                  style={style}
                ></div>
              );
            })}
          </div>
        </div>

        {/* MAIN HUD TENSION CONTROL SLATE */}
        <div className="bg-slate-50/55 rounded-2xl p-4 border border-slate-100 flex flex-col md:flex-row items-center gap-4 justify-between">
          
          {/* Main Power/Streaming Switch */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause live feed" : "Stream live broadcast"}
            id="play-stream-button"
            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform active:scale-95 border-2 shrink-0 ${
              isPlaying
                ? 'bg-gradient-to-tr from-emerald-600 to-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-500/15 hover:scale-105'
                : 'bg-white border-slate-300 text-emerald-600 hover:text-emerald-700 hover:border-emerald-500 hover:scale-105 shadow-sm'
            }`}
          >
            {isBuffering ? (
              <svg className="w-5 h-5 animate-spin text-current" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isPlaying ? (
              <Pause className="w-5 h-5 fill-current stroke-current" />
            ) : (
              <Play className="w-5 h-5 fill-current stroke-current ml-0.5" />
            )}
          </button>

          {/* Streaming Connection State */}
          <div className="text-center md:text-left flex-1 space-y-0.5">
            <span className="block text-stone-400 text-[8px] font-bold uppercase tracking-[0.18em] font-mono">DIGITAL RECEIVER</span>
            <span className="block text-xs font-semibold text-stone-700 tracking-wide">
              {isPlaying ? "ACTIVE GOSPEL BROADCAST STREAM" : "STANDBY STATION - HIT PLAY"}
            </span>
          </div>

          {/* Clean Glassmorphic Slider and Dial Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto md:min-w-[150px] bg-white py-1.5 px-3 rounded-xl border border-slate-200 shadow-sm" id="volume-pane">
            <button
              onClick={toggleMute}
              className="text-stone-400 hover:text-emerald-600 transition-colors focus:outline-none h-6 w-6 flex items-center justify-center rounded-lg hover:bg-slate-50"
              title={isMuted ? "Unmute stream" : "Mute stream"}
              id="volume-mute-button"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-stone-400 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4 text-stone-700" />
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
              className="w-full h-1 bg-stone-100 accent-emerald-600 rounded-lg cursor-pointer hover:accent-emerald-500 transition-colors focus:outline-none"
              style={{ background: `linear-gradient(to right, #10b981 ${(isMuted ? 0 : volume) * 100}%, #f3f4f6 ${(isMuted ? 0 : volume) * 100}%)` }}
              aria-label="Volume level controller"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
