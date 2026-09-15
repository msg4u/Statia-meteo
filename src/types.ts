export type WeatherType = 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'windy' | 'snowy';

export type WindSpeed = 'calm' | 'gentle' | 'fast' | 'strong';

export type TempLevel = 'freezing' | 'chilly' | 'mild' | 'warm' | 'hot';

export interface WeatherLog {
  id: string;
  date: string; // YYYY-MM-DD
  dayName: string; // Luni, Marți, etc.
  weatherType: WeatherType;
  tempLevel: TempLevel;
  tempDegrees: number;
  windSpeed: WindSpeed;
  rainCm: number;
  outfit: {
    hat?: string;
    top: string;
    bottom: string;
    shoes: string;
    accessory?: string;
  };
  notes?: string;
}

export interface StoryPage {
  id: number;
  title: string;
  text: string;
  dialogue?: string;
  character?: 'sofia' | 'bunica' | 'morisca' | 'picurel' | 'termi';
  highlightWord: string;
  learningTip: string;
  sceneType: 'confusion' | 'grandma' | 'morisca' | 'picurel' | 'termi' | 'calendar' | 'success';
}

export interface CraftStep {
  stepNumber: number;
  title: string;
  instruction: string;
  tip: string;
  illustrationType: string;
}

export interface CraftProject {
  id: 'termi' | 'morisca' | 'picurel' | 'calendar';
  name: string;
  characterName: string;
  tagline: string;
  materials: { name: string; icon: string; count?: string }[];
  steps: CraftStep[];
  secretTip: string;
}
