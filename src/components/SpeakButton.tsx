import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { speakText, stopSpeaking, subscribeNarrator, sanitizeText, preloadSpeech, playPopSound } from '../utils/audio';

interface SpeakButtonProps {
  id?: string;
  text: string;
  label?: string;
  playingLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'pill' | 'icon' | 'badge';
  color?: 'amber' | 'rose' | 'emerald' | 'purple' | 'sky' | 'white';
  className?: string;
  onBeforePlay?: () => void;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
  id,
  text,
  label,
  playingLabel = 'Oprește',
  size = 'md',
  variant = 'pill',
  color = 'amber',
  className = '',
  onBeforePlay,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Preload audio in background so it's ready before the child clicks
    if (text) {
      preloadSpeech(text).catch(() => {});
    }

    const unsubscribe = subscribeNarrator((status) => {
      const isTarget = status.activeText ? sanitizeText(status.activeText) === sanitizeText(text) : false;
      setIsSpeaking(status.isSpeaking && isTarget);
      setIsLoading(status.isLoading && isTarget);
    });

    return () => {
      unsubscribe();
    };
  }, [text]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking || isLoading) {
      stopSpeaking();
      return;
    }

    playPopSound();
    if (onBeforePlay) {
      onBeforePlay();
    }
    speakText(text);
  };

  // Color schemes
  const colorStyles = {
    amber: {
      idle: 'bg-amber-100 text-amber-900 hover:bg-amber-200 border-amber-300',
      active: 'bg-rose-500 text-white border-rose-600 animate-pulse',
      loading: 'bg-amber-200 text-amber-800 border-amber-300',
    },
    rose: {
      idle: 'bg-rose-100 text-rose-900 hover:bg-rose-200 border-rose-300',
      active: 'bg-rose-600 text-white border-rose-700 animate-pulse',
      loading: 'bg-rose-200 text-rose-800 border-rose-300',
    },
    emerald: {
      idle: 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border-emerald-300',
      active: 'bg-rose-500 text-white border-rose-600 animate-pulse',
      loading: 'bg-emerald-200 text-emerald-800 border-emerald-300',
    },
    purple: {
      idle: 'bg-purple-100 text-purple-900 hover:bg-purple-200 border-purple-300',
      active: 'bg-rose-500 text-white border-rose-600 animate-pulse',
      loading: 'bg-purple-200 text-purple-800 border-purple-300',
    },
    sky: {
      idle: 'bg-sky-100 text-sky-900 hover:bg-sky-200 border-sky-300',
      active: 'bg-rose-500 text-white border-rose-600 animate-pulse',
      loading: 'bg-sky-200 text-sky-800 border-sky-300',
    },
    white: {
      idle: 'bg-white text-slate-800 hover:bg-slate-50 border-slate-200 shadow-xs',
      active: 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-sm',
      loading: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  }[color];

  const currentStatusStyle = isSpeaking
    ? colorStyles.active
    : isLoading
    ? colorStyles.loading
    : colorStyles.idle;

  // Icon sizing
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const renderIcon = () => {
    if (isLoading) {
      return <Loader2 className={`${iconSizes[size]} animate-spin shrink-0`} />;
    }
    if (isSpeaking) {
      return <VolumeX className={`${iconSizes[size]} shrink-0`} />;
    }
    return <Volume2 className={`${iconSizes[size]} shrink-0`} />;
  };

  if (variant === 'icon') {
    const dimSizes = {
      sm: 'w-8 h-8 p-1.5',
      md: 'w-10 h-10 p-2',
      lg: 'w-12 h-12 p-3',
    };
    return (
      <button
        id={id}
        type="button"
        onClick={handleClick}
        title={isSpeaking ? playingLabel : label || 'Ascultă'}
        aria-label={isSpeaking ? playingLabel : label || 'Ascultă'}
        className={`${dimSizes[size]} rounded-full border-2 flex items-center justify-center transition-all transform active:scale-90 cursor-pointer shadow-xs ${currentStatusStyle} ${className}`}
      >
        {renderIcon()}
      </button>
    );
  }

  if (variant === 'badge') {
    return (
      <button
        id={id}
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all active:scale-95 cursor-pointer shadow-2xs ${currentStatusStyle} ${className}`}
      >
        {renderIcon()}
        <span>{isSpeaking ? playingLabel : isLoading ? 'Se încarcă...' : label || 'Ascultă'}</span>
      </button>
    );
  }

  // Pill (Default)
  const padSizes = {
    sm: 'py-1.5 px-3 text-xs',
    md: 'py-2 px-4 text-sm',
    lg: 'py-2.5 px-5 text-base',
  };

  return (
    <button
      id={id}
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-bold border-2 transition-all transform active:scale-95 cursor-pointer shadow-xs ${padSizes[size]} ${currentStatusStyle} ${className}`}
    >
      {renderIcon()}
      <span>
        {isSpeaking
          ? playingLabel
          : isLoading
          ? 'Se pregătește...'
          : label || 'Ascultă cu voce caldă'}
      </span>
    </button>
  );
};
