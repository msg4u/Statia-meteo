import React, { useState, useEffect } from 'react';
import { STORY_PAGES } from '../data/storyData';
import { ArrowLeft, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { stopSpeaking, playPopSound, preloadSpeech } from '../utils/audio';
import { SpeakButton } from './SpeakButton';

export const StoryBook: React.FC = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const page = STORY_PAGES[currentPageIndex];
  const fullPageText = `${page.title}. ${page.text} ${page.dialogue || ''}`;

  // Automatically preload current page and adjacent pages for 0ms audio start
  useEffect(() => {
    preloadSpeech(fullPageText);
    if (currentPageIndex + 1 < STORY_PAGES.length) {
      const nextP = STORY_PAGES[currentPageIndex + 1];
      preloadSpeech(`${nextP.title}. ${nextP.text} ${nextP.dialogue || ''}`);
    }
  }, [currentPageIndex, fullPageText]);

  const handleNextPage = () => {
    stopSpeaking();
    playPopSound();
    if (currentPageIndex < STORY_PAGES.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handlePrevPage = () => {
    stopSpeaking();
    playPopSound();
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  return (
    <div id="storybook-container" className="max-w-4xl mx-auto flex flex-col items-center">
      {/* Book cover or page container */}
      <div className="w-full bg-white border-4 border-amber-300 rounded-3xl shadow-xl overflow-hidden relative">
        {/* Book Header ribbon */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-amber-500">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-950" />
            <h2 className="font-fun text-xl sm:text-2xl font-black text-amber-950">
              Sofia, fetița care voia să ghicească vremea
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <SpeakButton
              id="story-read-aloud-btn"
              text={fullPageText}
              label="Citește-mi povestea"
              playingLabel="Oprește lectura"
              variant="pill"
              color="white"
              size="md"
            />
            <span className="bg-amber-950/10 font-black text-amber-950 px-3 py-1 rounded-full text-xs">
              {currentPageIndex + 1} / {STORY_PAGES.length}
            </span>
          </div>
        </div>

        {/* Content area: Scene illustration + Story text */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#fffdfa]">
          {/* Visual Scene Illustration */}
          <div className="w-full h-72 sm:h-80 bg-gradient-to-br from-sky-50 via-amber-50 to-rose-50 rounded-3xl border-3 border-amber-200 shadow-inner flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {page.sceneType === 'confusion' && (
              <div className="flex flex-col items-center animate-pulse-slow">
                <div className="text-7xl mb-3 drop-shadow-md">👧🧣☀️🌧️</div>
                <div className="bg-white/90 border border-amber-300 px-4 py-2 rounded-2xl text-center text-xs font-bold text-slate-800 shadow-xs">
                  "Să mă îmbrac gros sau subțire azi?"
                </div>
              </div>
            )}

            {page.sceneType === 'grandma' && (
              <div className="flex flex-col items-center text-center">
                <div className="flex gap-4 text-6xl mb-3">
                  <span>👵</span>
                  <span className="animate-bounce">✨</span>
                  <span>👧</span>
                </div>
                <div className="bg-white/90 border border-amber-300 px-4 py-2 rounded-2xl text-xs font-bold text-amber-900 shadow-xs">
                  "Natura ne dă semne, Sofia! Hai să facem trei prieteni!"
                </div>
              </div>
            )}

            {page.sceneType === 'morisca' && (
              <div className="flex flex-col items-center">
                <div className="text-8xl animate-spin" style={{ animationDuration: '3s' }}>
                  🌀
                </div>
                <div className="bg-white/90 border border-amber-300 px-4 py-2 rounded-2xl text-xs font-bold text-amber-900 shadow-xs mt-3">
                  Morișca: "Când mă învârt repede, e vânt puternic!"
                </div>
              </div>
            )}

            {page.sceneType === 'picurel' && (
              <div className="flex flex-col items-center">
                <div className="text-8xl animate-bounce">
                  💧
                </div>
                <div className="bg-white/90 border border-blue-300 px-4 py-2 rounded-2xl text-xs font-bold text-blue-900 shadow-xs mt-3">
                  Picurel: "Cu cât sunt mai plin, cu atât a plouat mai mult!"
                </div>
              </div>
            )}

            {page.sceneType === 'termi' && (
              <div className="flex flex-col items-center">
                <div className="text-8xl">
                  🌡️
                </div>
                <div className="bg-white/90 border border-rose-300 px-4 py-2 rounded-2xl text-xs font-bold text-rose-900 shadow-xs mt-3">
                  Termi: "Bila mea roșie urcă la cald și coboară la frig!"
                </div>
              </div>
            )}

            {page.sceneType === 'calendar' && (
              <div className="flex flex-col items-center">
                <div className="flex gap-2 text-5xl mb-2">
                  <span>📅</span>
                  <span>☀️</span>
                  <span>☁️</span>
                  <span>🌧️</span>
                </div>
                <div className="bg-white/90 border border-purple-300 px-4 py-2 rounded-2xl text-xs font-bold text-purple-900 shadow-xs mt-2">
                  "Norii sunt grei + Morișca se învârte = Vine ploaia!"
                </div>
              </div>
            )}

            {page.sceneType === 'success' && (
              <div className="flex flex-col items-center">
                <div className="flex gap-3 text-6xl mb-3">
                  <span>👧</span>
                  <span>🎉</span>
                  <span>🌀</span>
                  <span>💧</span>
                  <span>🌡️</span>
                </div>
                <div className="bg-white/90 border border-emerald-300 px-4 py-2 rounded-2xl text-xs font-bold text-emerald-900 shadow-xs">
                  Sofia nu se mai îmbracă niciodată greșit!
                </div>
              </div>
            )}

            {/* Keyword tag bottom left */}
            <div className="absolute bottom-3 left-3 bg-amber-100/90 border border-amber-300 text-amber-900 text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>{page.highlightWord}</span>
            </div>
          </div>

          {/* Story Text */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600">
                  Pagina {page.id}
                </span>
                <SpeakButton
                  text={`${page.title}. ${page.text}`}
                  label="Ascultă textul"
                  variant="badge"
                  color="amber"
                />
              </div>

              <h3 className="font-fun text-2xl font-black text-slate-900 mt-1 mb-4">
                {page.title}
              </h3>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
                {page.text}
              </p>

              {page.dialogue && (
                <div className="mt-4 p-3.5 bg-amber-100/70 border-l-4 border-amber-500 rounded-r-2xl text-slate-900 font-bold italic text-sm sm:text-base flex items-start justify-between gap-2">
                  <span>{page.dialogue}</span>
                  <SpeakButton
                    text={page.dialogue}
                    label="Dialog"
                    variant="icon"
                    size="sm"
                    color="amber"
                  />
                </div>
              )}
            </div>

            {/* Educational insight box */}
            <div className="mt-6 p-3 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-sky-900 font-bold flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-base">💡</span>
                <span>{page.learningTip}</span>
              </div>
              <SpeakButton
                text={`Sfatul Sofiei: ${page.learningTip}`}
                label="Sfat"
                variant="icon"
                size="sm"
                color="sky"
              />
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-amber-50 px-6 py-4 border-t-2 border-amber-200 flex items-center justify-between">
          <button
            id="story-prev-page-btn"
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0}
            className="py-2.5 px-5 bg-white hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed border border-amber-300 text-amber-900 font-extrabold text-sm rounded-2xl flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Pagina dinapoi</span>
          </button>

          {/* Quick page dots */}
          <div className="flex gap-1.5">
            {STORY_PAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  stopSpeaking();
                  playPopSound();
                  setCurrentPageIndex(idx);
                }}
                className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer ${
                  idx === currentPageIndex
                    ? 'bg-amber-500 w-8'
                    : 'bg-amber-200 hover:bg-amber-300'
                }`}
                title={`Mergi la pagina ${idx + 1}`}
              />
            ))}
          </div>

          <button
            id="story-next-page-btn"
            onClick={handleNextPage}
            disabled={currentPageIndex === STORY_PAGES.length - 1}
            className="py-2.5 px-5 bg-amber-400 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-amber-950 font-extrabold text-sm rounded-2xl flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <span>Pagina următoare</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
