import { useState } from "react";
import FacialExpression from "./components/FacialExpression";
import MoodSongs from "./components/MoodSongs";
import PlayerBar from "./components/PlayerBar";

const App = () => {
  const [songs, setSongs] = useState([]);
  const [playing, setPlaying] = useState(null);
  const [currentMood, setCurrentMood] = useState(null);
  const [showPlayer, setShowPlayer] = useState(true);

  return (
    <div className="h-screen w-screen overflow-x-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-[6vw] mb-[4vw] lg:mb-[0vw] lg:py-[1vw] h-[10vh] lg:h-[12vh]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Vibify
                </h1>
              </div>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl hidden lg:block">
                Detect your mood with AI facial recognition and discover music that matches your vibe
              </p>
            </div>
            
            <div className="flex items-center gap-3 hidden sm:flex">
              {currentMood && (
                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 backdrop-blur-sm">
                  <span className="text-sm font-medium">Mood: <span className="capitalize text-purple-300">{currentMood}</span></span>
                </div>
              )}
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 rounded-full px-4 py-2 border border-slate-700/50 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>AI Ready</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-col lg:flex-row justify-between gap-5 lg:gap-8">
          {/* Mood Detection Section */}
          <section className="group min-h-[42vh] lg:min-h-full lg:w-1/2">
            <div className="h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:border-purple-500/30 hover:shadow-purple-500/10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center border border-purple-500/30">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold">Mood Detection</h2>
              </div>
              <FacialExpression 
                setSongs={setSongs} 
                setPlaying={setPlaying} 
                setCurrentMood={setCurrentMood}
              />
            </div>
          </section>

          {/* Songs Section */}
          <section className="group min-h-[50vh] lg:min-h-full lg:w-1/2">
            <div className="h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:border-cyan-500/30 hover:shadow-cyan-500/10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center border border-cyan-500/30">
                  <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold">Your Playlist</h2>
                {songs.length > 0 && (
                  <span className="ml-auto text-sm text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full">
                    {songs.length} {songs.length === 1 ? 'song' : 'songs'}
                  </span>
                )}
              </div>
              <MoodSongs songs={songs} playing={playing} setPlaying={setPlaying} />
            </div>
          </section>
        </main>
      </div>

      <PlayerBar currentSong={songs[playing ?? -1]} />
    </div>
  );
};

export default App;