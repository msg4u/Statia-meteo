import React, { useEffect } from 'react';
import { HelpCircle, Heart, Lightbulb, Compass, BookOpen, CheckCircle2 } from 'lucide-react';
import { preloadSpeech } from '../utils/audio';
import { SpeakButton } from './SpeakButton';

export const EducatorGuide: React.FC = () => {
  const questions = [
    {
      q: 'Ce i-ar spune Morișca Sofiei azi, dacă s-ar învârti foarte repede?',
      hint: 'Încurajează copilul să asocieze viteza rotației cu intensitatea vântului (vânt sprinten sau vijelie).',
      icon: '🌀'
    },
    {
      q: 'Dacă Picurel e plin dimineața, ce s-a întâmplat peste noapte, ca în poveste?',
      hint: 'Ajută copilul să înțeleagă că apa nu a apărut prin magie, ci a căzut din norii de ploaie în timp ce dormea.',
      icon: '💧'
    },
    {
      q: 'Crezi că mâine va ploua, ca atunci când Sofia a ghicit corect? De ce crezi asta?',
      hint: 'Ghidează copilul să observe cerul: sunt norii grei și cenușii? S-a răcit aerul pe Termi? Adună indiciile!',
      icon: '🌧️'
    },
    {
      q: 'Care dintre cei trei prieteni ai Sofiei ți se pare cel mai interesant? De ce?',
      hint: 'Întrebare deschisă care stimulează exprimarea emoțională și preferințele personale ale copilului.',
      icon: '❤️'
    }
  ];

  useEffect(() => {
    questions.forEach((item) => {
      preloadSpeech(item.q);
    });
  }, []);

  return (
    <div id="educator-guide-container" className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Pentru Părinți & Educatori</span>
          </div>
          <h2 className="font-fun text-2xl sm:text-3xl font-black">
            Ghid Pedagogic: Vremea ca Știință și Joacă
          </h2>
          <p className="text-amber-100 font-semibold text-sm sm:text-base mt-1 max-w-xl">
            Cum să transformi observarea mediului într-o experiență unică, formativă și plină de curiozitate pentru copiii de 4-7 ani.
          </p>
        </div>

        <div className="text-5xl hidden sm:block animate-pulse-slow">
          🧭
        </div>
      </div>

      {/* Concept link */}
      <div className="bg-white border-3 border-orange-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🌱</span>
          <div>
            <h3 className="font-fun text-xl sm:text-2xl font-black text-slate-900">
              Legătura Poveste — Concept Științific
            </h3>
            <span className="text-xs font-bold text-orange-700">De la magie la gândire critică bazată pe date</span>
          </div>
        </div>

        <p className="text-slate-700 font-medium text-sm sm:text-base leading-relaxed">
          Povestea transformă cele trei instrumente meteo într-un fel de <strong>«consilieri de încredere»</strong> ai Sofiei, apropiind copilul de ideea de <em>observație sistematică</em> și <em>predicție bazată pe date</em> — nu magie sau superstiție, ci citirea atentă a semnelor din natură, repetată zi de zi, până devine posibilă o estimare informată despre ziua următoare.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <span className="text-2xl block mb-1">🌀</span>
            <h4 className="font-fun font-bold text-amber-950 text-sm">Morișca (Anemometru)</h4>
            <p className="text-xs text-amber-900 mt-1">
              Copilul asociază mișcarea fizică (rotația) cu forța nevăzută a aerului în mișcare (vântul).
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
            <span className="text-2xl block mb-1">💧</span>
            <h4 className="font-fun font-bold text-blue-950 text-sm">Picurel (Pluviometru)</h4>
            <p className="text-xs text-blue-900 mt-1">
              Introduce noțiunea de volum, cantitate și măsurare numerică simplă în centimetri cu rigla.
            </p>
          </div>

          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
            <span className="text-2xl block mb-1">🌡️</span>
            <h4 className="font-fun font-bold text-rose-950 text-sm">Termi (Termometru)</h4>
            <p className="text-xs text-rose-900 mt-1">
              Leagă senzația tactilă (cald/frig) de o scală vizuală verticală (jos = frig, sus = căldură).
            </p>
          </div>
        </div>
      </div>

      {/* Guide questions with click-to-speak */}
      <div className="bg-white border-3 border-orange-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">❓</span>
          <div>
            <h3 className="font-fun text-xl sm:text-2xl font-black text-slate-900">
              Cum Ghidezi Activitatea: Întrebări Inspirate din Poveste
            </h3>
            <span className="text-xs font-bold text-orange-700">Adresează-i copilului aceste întrebări în timpul rutinei de dimineață</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {questions.map((item, idx) => (
            <div
              key={idx}
              id={`guide-question-${idx}`}
              className="p-5 rounded-3xl bg-orange-50/60 border border-orange-200 hover:border-orange-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <SpeakButton
                    id={`speak-guide-q-${idx}`}
                    text={item.q}
                    variant="icon"
                    size="sm"
                    color="amber"
                    label="Ascultă întrebarea"
                  />
                </div>
                <h4 className="font-fun font-bold text-slate-900 text-sm sm:text-base leading-snug">
                  "{item.q}"
                </h4>
              </div>

              <div className="mt-3 pt-3 border-t border-orange-100 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="text-xs font-medium text-slate-700">
                  {item.hint}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practical Routine & Notebook tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-50 border-3 border-emerald-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🚪</span>
            <h4 className="font-fun text-lg font-black text-emerald-950">
              Sfat Practic: Locul Vizibil
            </h4>
          </div>
          <p className="text-xs sm:text-sm font-medium text-emerald-900 leading-relaxed">
            Puneți calendarul Sofiei într-un loc vizibil zilnic (<strong>lângă ușa de la intrare</strong> sau pe frigider), ca rutina să se lege natural de un moment fix al zilei: chiar <em>înainte de a ieși din casă spre grădiniță sau parc</em>.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-800 bg-white/70 p-3 rounded-2xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Evită deciziile grăbite și elimină frustrarea hainelor nepotrivite!</span>
          </div>
        </div>

        <div className="bg-purple-50 border-3 border-purple-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📓</span>
            <h4 className="font-fun text-lg font-black text-purple-950">
              Caietul de Observații Meteo
            </h4>
          </div>
          <p className="text-xs sm:text-sm font-medium text-purple-900 leading-relaxed">
            Mai mult, folosiți un <strong>caiet de observații</strong> unde copilul poate desena în fiecare zi forma norilor (pufoși ca oile sau întunecați ca munții), frunzele luate de vânt sau bălțile în care a sărit. Desenul fixează memoria și sporește creativitatea!
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-purple-800 bg-white/70 p-3 rounded-2xl border border-purple-200">
            <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Încurajează curiozitatea copilului prin întrebări deschise zilnice!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
