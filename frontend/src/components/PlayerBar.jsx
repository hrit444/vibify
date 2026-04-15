import { useEffect, useRef, useState } from "react";

const PlayerBar = ({ currentSong, isVisible, setIsVisible }) => {
  const moodGradients = {
    happy: "from-yellow-500 to-orange-500",
    sad: "from-blue-500 to-indigo-500",
    angry: "from-red-500 to-rose-500",
    surprised: "from-purple-500 to-pink-500",
    neutral: "from-gray-500 to-slate-500",
    fearful: "from-violet-500 to-purple-500",
    disgusted: "from-green-500 to-emerald-500"
  };

  const gradient = moodGradients[currentSong?.mood?.toLowerCase()] || "from-purple-500 to-cyan-500";

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // When song changes, reset and autoplay
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsPlaying(true);
    setCurrentTime(0);

    const play = () => {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    };

    // Wait a tick so the new src is loaded
    const timeout = setTimeout(play, 50);
    return () => clearTimeout(timeout);
  }, [currentSong?.audio]);

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration || 0);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime || 0);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const value = Number(e.target.value);
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const formatTime = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!currentSong) return null;

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-6 z-[99] right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 flex items-center justify-center text-white hover:scale-110 active:scale-95"
        aria-label={isVisible ? "Hide player" : "Show player"}
      >
        {isVisible ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        )}
      </button>

      {/* Player Bar - Conditional rendering */}
      {isVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            <div className="bg-slate-900/55 backdrop-blur-xs border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
              {/* Progress bar effect */}
              <div className={`h-1 bg-gradient-to-r ${gradient} opacity-50`}></div>
              
              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Album Art & Song Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Album Art */}
                    <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br ${gradient} flex-shrink-0 shadow-lg overflow-hidden`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex gap-1 items-end h-8">
                          <div className="w-1.5 bg-white/90 rounded-full animate-music-bar-1" style={{ height: '40%' }}></div>
                          <div className="w-1.5 bg-white/90 rounded-full animate-music-bar-2" style={{ height: '60%' }}></div>
                          <div className="w-1.5 bg-white/90 rounded-full animate-music-bar-3" style={{ height: '80%' }}></div>
                          <div className="w-1.5 bg-white/90 rounded-full animate-music-bar-4" style={{ height: '50%' }}></div>
                          <div className="w-1.5 bg-white/90 rounded-full animate-music-bar-1" style={{ height: '70%' }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Song Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-white max-w-[60vw] lg:max-w-none truncate mb-1">
                        {currentSong?.title || "Unknown Title"}
                      </h3>
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-slate-400 max-w-[40vw] lg:max-w-none truncate ">
                          {currentSong?.artist || "Unknown Artist"}
                        </p>
                        {currentSong?.mood && (
                          <>
                            <span className="text-slate-600">•</span>
                            <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${gradient} bg-opacity-20 border border-current/20 capitalize font-medium`}>
                              {currentSong.mood}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Custom Audio Controls */}
                  <div className="w-full sm:w-auto sm:flex-shrink-0 flex gap-2">

                    {/* Play / Pause Button */}
                    <div className="flex items-center justify-end">
                      <button
                        onClick={togglePlayPause}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-100 shadow-md shadow-black/40 transition-colors"
                        aria-label={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? (
                          <i className="ri-pause-mini-line text-lg"></i>
                        ) : (
                          <i className="ri-play-fill text-lg translate-x-[1px]"></i>
                        )}
                      </button>
                    </div>
                    {/* Seekbar */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <span className="text-[0.65rem] sm:text-xs text-slate-400 w-9 text-right">
                        {formatTime(currentTime)}
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        value={duration ? currentTime : 0}
                        onChange={handleSeek}
                        className="flex-1 h-1.5 rounded-full bg-slate-700/70 accent-emerald-400 cursor-pointer"
                      />
                      <span className="text-[0.65rem] sm:text-xs text-slate-400 w-9">
                        {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden native audio element - Always in DOM to keep playing */}
      <audio
        ref={audioRef}
        src={currentSong.audio}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        className="hidden"
      />
    </>
  );
};

export default PlayerBar;