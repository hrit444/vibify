const MoodSongs = ({ songs, playing, setPlaying }) => {
  const songSelectHandler = (idx) => {
    if (playing === idx) {
      setPlaying(null);
    } else {
      setPlaying(idx);
    }
  };

  const moodColors = {
    happy: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
    sad: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
    angry: "from-red-500/20 to-rose-500/20 border-red-500/30",
    surprised: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
    neutral: "from-gray-500/20 to-slate-500/20 border-gray-500/30",
    fearful: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
    disgusted: "from-green-500/20 to-emerald-500/20 border-green-500/30"
  };

  return (
    <div className="flex flex-col h-full">
      {songs && songs.length > 0 ? (
        <>
          <div className="mb-4">
            <p className="text-sm text-slate-400">
              {songs.length} {songs.length === 1 ? 'track' : 'tracks'} curated for your mood
            </p>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {songs.map((song, idx) => {
                const isPlaying = playing === idx;
                const moodColor = moodColors[song.mood?.toLowerCase()] || moodColors.neutral;
                
                return (
                  <div
                    key={idx}
                    onClick={() => songSelectHandler(idx)}
                    className={`group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${
                      isPlaying
                        ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-500/50 shadow-lg shadow-emerald-500/20 scale-[1.02]"
                        : "bg-slate-800/40 hover:bg-slate-700/40 border-slate-700/50 hover:border-slate-600/50 hover:scale-[1.01]"
                    }`}
                  >
                    {/* Gradient overlay for playing state */}
                    {isPlaying && (
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 animate-pulse"></div>
                    )}

                    <div className="relative p-4 flex items-center gap-4">
                      {/* Album Art / Icon */}
                      <div className={`relative w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden ${
                        isPlaying 
                          ? "bg-gradient-to-br from-emerald-500 to-cyan-500" 
                          : `bg-gradient-to-br ${moodColor.split(' ')[0]}`
                      }`}>
                        {isPlaying ? (
                          <div className="flex gap-1 items-end h-6">
                            <div className="w-1 bg-white rounded-full animate-music-bar-1" style={{ height: '40%' }}></div>
                            <div className="w-1 bg-white rounded-full animate-music-bar-2" style={{ height: '60%' }}></div>
                            <div className="w-1 bg-white rounded-full animate-music-bar-3" style={{ height: '80%' }}></div>
                            <div className="w-1 bg-white rounded-full animate-music-bar-4" style={{ height: '50%' }}></div>
                          </div>
                        ) : (
                          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                          </svg>
                        )}
                      </div>

                      {/* Song Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base text-white truncate mb-1">
                          {song.title}
                        </h4>
                        <p className="text-sm text-slate-400 truncate">
                          {song.artist}
                        </p>
                        {song.mood && (
                          <div className="mt-2 flex items-center gap-2 hidden sm:flex lg:flex ">
                            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gradient-to-r ${moodColor} backdrop-blur-sm font-medium capitalize`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              {song.mood}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Play Button / Status */}
                      <div className="flex-shrink-0">
                        {isPlaying ? (
                          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-xs font-medium text-emerald-300">Playing</span>
                          </div>
                        ) : (
                          <button className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 flex items-center justify-center transition-all group-hover:scale-110">
                            <svg className="w-5 h-5 text-slate-300 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-20 h-20 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No songs yet</h3>
          <p className="text-sm text-slate-500 max-w-xs">
            Detect your mood using the camera to get personalized music recommendations
          </p>
        </div>
      )}
    </div>
  );
};

export default MoodSongs;