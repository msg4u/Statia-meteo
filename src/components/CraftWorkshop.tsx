import React, { useState, useEffect } from 'react';
import { CRAFT_PROJECTS } from '../data/craftData';
import { CraftProject } from '../types';
import { Check, CheckCircle2, Sparkles, ShieldAlert, Heart, Trophy } from 'lucide-react';
import { playPopSound, playSuccessFanfare, speakText, preloadSpeech } from '../utils/audio';
import confetti from 'canvas-confetti';
import { SpeakButton } from './SpeakButton';

export const CraftWorkshop: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('termi');
  const [checkedMaterials, setCheckedMaterials] = useState<Record<string, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const project: CraftProject = CRAFT_PROJECTS.find((p) => p.id === selectedProjectId) || CRAFT_PROJECTS[0];

  useEffect(() => {
    // Preload project presentation and steps for instantaneous audio
    preloadSpeech(`${project.name}. ${project.tagline}`);
    preloadSpeech(`Secretul Bunicii: ${project.secretTip}`);
    project.steps.forEach((s) => {
      preloadSpeech(`Pasul ${s.stepNumber}: ${s.title}. ${s.instruction}`);
    });
  }, [project]);

  const handleToggleMaterial = (matName: string) => {
    playPopSound();
    setCheckedMaterials((prev) => ({
      ...prev,
      [`${project.id}-${matName}`]: !prev[`${project.id}-${matName}`],
    }));
  };

  const handleToggleStep = (stepNumber: number) => {
    playPopSound();
    setCompletedSteps((prev) => ({
      ...prev,
      [`${project.id}-${stepNumber}`]: !prev[`${project.id}-${stepNumber}`],
    }));
  };

  const handleFinishProject = () => {
    playSuccessFanfare();
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
    });
    speakText(`Bravo, micule meteorolog! L-ai construit cu succes pe ${project.characterName}! Acum e gata să te ajute să citești cerul!`);
  };

  return (
    <div id="craft-workshop-container" className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <span>✂️</span>
            <span>Atelierul de Meșterit</span>
          </div>
          <h2 className="font-fun text-2xl sm:text-3xl font-black">
            Fii Sofia și construiește-ți cei trei prieteni!
          </h2>
          <p className="text-emerald-950 font-semibold text-sm sm:text-base mt-1 max-w-2xl">
            Cu materiale simple reciclate pe care le ai deja prin casă, dă viață personajelor din poveste!
          </p>
        </div>

        <div className="text-5xl hidden md:block animate-bounce duration-1000">
          🎨
        </div>
      </div>

      {/* Project Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CRAFT_PROJECTS.map((proj) => {
          const active = proj.id === selectedProjectId;
          return (
            <button
              key={proj.id}
              id={`craft-tab-${proj.id}`}
              onClick={() => {
                playPopSound();
                setSelectedProjectId(proj.id);
              }}
              className={`p-4 rounded-3xl border-3 flex flex-col items-center text-center transition-all cursor-pointer ${
                active
                  ? 'bg-white border-teal-500 shadow-md scale-102 ring-2 ring-teal-200'
                  : 'bg-white/70 border-slate-200 hover:bg-white hover:border-teal-300'
              }`}
            >
              <span className="text-4xl mb-1 drop-shadow-xs">
                {proj.id === 'termi' && '🌡️'}
                {proj.id === 'morisca' && '🌀'}
                {proj.id === 'picurel' && '💧'}
                {proj.id === 'calendar' && '📅'}
              </span>
              <span className="font-fun text-base font-extrabold text-slate-900">
                {proj.characterName}
              </span>
              <span className="text-[11px] font-bold text-slate-700 line-clamp-1 mt-0.5">
                {proj.tagline}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Craft Project Content */}
      <div className="bg-white border-3 border-teal-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Project Title & Tagline */}
        <div className="border-b-2 border-teal-100 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Proiectul #{CRAFT_PROJECTS.findIndex((p) => p.id === selectedProjectId) + 1}
              </span>
              <SpeakButton
                id={`speak-proj-${project.id}`}
                text={`${project.name}. ${project.tagline}`}
                label="Ascultă descrierea"
                variant="badge"
                color="teal"
              />
            </div>
            <h3 className="font-fun text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {project.name}
            </h3>
            <p className="text-slate-700 font-medium text-sm sm:text-base mt-1">
              {project.tagline}
            </p>
          </div>

          <button
            onClick={handleFinishProject}
            id="craft-finish-btn"
            className="py-2.5 px-5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-extrabold text-sm rounded-2xl flex items-center gap-2 shadow-xs transition-transform active:scale-95 self-start sm:self-center cursor-pointer"
          >
            <Trophy className="w-5 h-5 text-yellow-200" />
            <span>Am terminat construcția!</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Materials Checklist */}
          <div className="lg:col-span-1 bg-teal-50/80 border-2 border-teal-200 rounded-3xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎒</span>
              <h4 className="font-fun text-lg font-bold text-teal-950">
                Materiale Necesare
              </h4>
            </div>
            <p className="text-xs text-teal-800 font-semibold mb-4">
              Bifează pe măsură ce le găsești prin casă:
            </p>

            <div className="flex flex-col gap-2.5">
              {project.materials.map((mat, idx) => {
                const key = `${project.id}-${mat.name}`;
                const checked = checkedMaterials[key] || false;
                return (
                  <button
                    key={idx}
                    id={`material-check-${idx}`}
                    onClick={() => handleToggleMaterial(mat.name)}
                    className={`w-full p-3 rounded-2xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
                      checked
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-950 shadow-xs'
                        : 'bg-white border-teal-100 text-slate-700 hover:border-teal-300'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-colors ${
                        checked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {checked && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>

                    <span className="text-2xl">{mat.icon}</span>

                    <div className="flex-1">
                      <span className={`text-xs sm:text-sm font-bold block ${checked ? 'line-through opacity-70' : ''}`}>
                        {mat.name}
                      </span>
                      {mat.count && (
                        <span className="text-[11px] font-semibold text-teal-700">
                          {mat.count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Secret Tip Box */}
            <div className="mt-6 p-4 bg-amber-100/90 border border-amber-300 rounded-2xl text-amber-950">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>Secretul Bunicii:</span>
                </div>
                <SpeakButton
                  id={`speak-secret-${project.id}`}
                  text={`Secretul Bunicii: ${project.secretTip}`}
                  variant="icon"
                  size="sm"
                  color="amber"
                  label="Ascultă secretul bunicii"
                />
              </div>
              <p className="text-xs font-semibold leading-relaxed">
                {project.secretTip}
              </p>
            </div>
          </div>

          {/* Right Column: Step-by-Step Construction Guide */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-fun text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>🛠️</span>
                <span>Pași de Construcție Pas-cu-Pas</span>
              </h4>
              <span className="text-xs font-bold text-slate-700">
                {project.steps.length} pași simpli
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {project.steps.map((step) => {
                const stepKey = `${project.id}-${step.stepNumber}`;
                const isDone = completedSteps[stepKey] || false;
                const stepSpeech = `Pasul ${step.stepNumber}: ${step.title}. ${step.instruction}`;

                return (
                  <div
                    key={step.stepNumber}
                    id={`craft-step-card-${step.stepNumber}`}
                    className={`p-5 rounded-3xl border-2 transition-all ${
                      isDone
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-teal-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleStep(step.stepNumber)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-fun font-black text-base transition-all cursor-pointer ${
                            isDone
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-teal-100 text-teal-900 hover:bg-teal-200'
                          }`}
                          title="Bifează pasul ca fiind completat!"
                        >
                          {isDone ? <Check className="w-5 h-5 stroke-[3]" /> : step.stepNumber}
                        </button>

                        <div>
                          <h5 className="font-fun text-base sm:text-lg font-black text-slate-900">
                            {step.title}
                          </h5>
                          {step.instruction.includes('adult') && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full mt-0.5">
                              <ShieldAlert className="w-3 h-3" />
                              <span>Cere ajutorul unui adult</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <SpeakButton
                        id={`speak-step-${step.stepNumber}`}
                        text={stepSpeech}
                        variant="icon"
                        size="sm"
                        color="teal"
                        label={`Ascultă pasul ${step.stepNumber}`}
                      />
                    </div>

                    <p className="mt-3 text-sm text-slate-700 font-medium leading-relaxed">
                      {step.instruction}
                    </p>

                    {/* Pro tip / little reminder */}
                    <div className="mt-3 bg-teal-50/60 border border-teal-100 rounded-xl p-2.5 text-xs text-teal-950 font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{step.tip}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
