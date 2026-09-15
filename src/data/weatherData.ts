import { WeatherLog, WeatherType } from '../types';

export interface WeatherBadgeInfo {
  type: WeatherType;
  label: string;
  emoji: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  description: string;
}

export const WEATHER_BADGES: Record<WeatherType, WeatherBadgeInfo> = {
  sunny: {
    type: 'sunny',
    label: 'Însorit',
    emoji: '☀️',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-300',
    description: 'Cer senin, soarele strălucește vesel!'
  },
  partly_cloudy: {
    type: 'partly_cloudy',
    label: 'Soare cu nori',
    emoji: '⛅',
    bgColor: 'bg-sky-100',
    textColor: 'text-sky-800',
    borderColor: 'border-sky-300',
    description: 'Norișori pufoși se joacă de-a v-ați ascunselea cu soarele.'
  },
  cloudy: {
    type: 'cloudy',
    label: 'Înnorat',
    emoji: '☁️',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-800',
    borderColor: 'border-slate-300',
    description: 'Cer acoperit de nori cenușii și grei.'
  },
  rainy: {
    type: 'rainy',
    label: 'Ploaie',
    emoji: '🌧️',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300',
    description: 'Picături dese de apă cad din cer!'
  },
  windy: {
    type: 'windy',
    label: 'Vânt puternic',
    emoji: '💨',
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-800',
    borderColor: 'border-teal-300',
    description: 'Vântul suflă cu putere și mișcă frunzele copacilor.'
  },
  snowy: {
    type: 'snowy',
    label: 'Ninsoare',
    emoji: '❄️',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-800',
    borderColor: 'border-indigo-300',
    description: 'Fulgi albi de zăpadă plutesc lin către pământ.'
  }
};

export const INITIAL_CALENDAR_LOGS: WeatherLog[] = [
  {
    id: 'log-1',
    date: '2026-09-08',
    dayName: 'Luni',
    weatherType: 'sunny',
    tempLevel: 'warm',
    tempDegrees: 24,
    windSpeed: 'gentle',
    rainCm: 0,
    outfit: {
      hat: 'Șapcă galbenă',
      top: 'Tricou cu soare',
      bottom: 'Pantaloni scurți',
      shoes: 'Sandale comode',
      accessory: 'Ochelari de soare'
    },
    notes: 'Sofia a ieșit la joacă în parc. Morișca abia se clătina.'
  },
  {
    id: 'log-2',
    date: '2026-09-09',
    dayName: 'Marți',
    weatherType: 'partly_cloudy',
    tempLevel: 'mild',
    tempDegrees: 19,
    windSpeed: 'gentle',
    rainCm: 0,
    outfit: {
      top: 'Hanorac subțire',
      bottom: 'Pantaloni de trening',
      shoes: 'Pantofi sport'
    },
    notes: 'Nori albi ca vata de zahăr. Termi stătea exact la mijloc.'
  },
  {
    id: 'log-3',
    date: '2026-09-10',
    dayName: 'Miercuri',
    weatherType: 'windy',
    tempLevel: 'mild',
    tempDegrees: 17,
    windSpeed: 'fast',
    rainCm: 0,
    outfit: {
      top: 'Geacă antivânt',
      bottom: 'Blugi lungi',
      shoes: 'Adidași'
    },
    notes: 'Morișca se învârtea cu mare viteză! Sofia a știut că e vânt.'
  },
  {
    id: 'log-4',
    date: '2026-09-11',
    dayName: 'Joi',
    weatherType: 'rainy',
    tempLevel: 'chilly',
    tempDegrees: 14,
    windSpeed: 'fast',
    rainCm: 6,
    outfit: {
      hat: 'Glugă impermeabilă',
      top: 'Pelerină galbenă de ploaie',
      bottom: 'Pantaloni impermeabili',
      shoes: 'Cizme de cauciuc',
      accessory: 'Umbrelă colorată'
    },
    notes: 'Picurel s-a umplut cu 6 cm de apă peste noapte! Sofia a sărit în bălți.'
  },
  {
    id: 'log-5',
    date: '2026-09-12',
    dayName: 'Vineri',
    weatherType: 'sunny',
    tempLevel: 'warm',
    tempDegrees: 23,
    windSpeed: 'calm',
    rainCm: 0,
    outfit: {
      top: 'Tricou roz',
      bottom: 'Fustă cu buline',
      shoes: 'Sandale'
    },
    notes: 'Soare cald după ploaie. Pe cer a apărut un curcubeu!'
  },
  {
    id: 'log-6',
    date: '2026-09-13',
    dayName: 'Sâmbătă',
    weatherType: 'partly_cloudy',
    tempLevel: 'warm',
    tempDegrees: 22,
    windSpeed: 'gentle',
    rainCm: 0,
    outfit: {
      top: 'Tricou verde',
      bottom: 'Pantaloni scurți',
      shoes: 'Adidași'
    },
    notes: 'Plimbare cu bicicleta alături de bunica.'
  },
  {
    id: 'log-7',
    date: '2026-09-14',
    dayName: 'Duminică',
    weatherType: 'cloudy',
    tempLevel: 'mild',
    tempDegrees: 18,
    windSpeed: 'gentle',
    rainCm: 1,
    outfit: {
      top: 'Pulover confortabil',
      bottom: 'Pantaloni lungi',
      shoes: 'Ghete ușoare'
    },
    notes: 'Nori grei. Picurel a strâns doar 1 cm de burniță.'
  }
];

export interface OutfitOption {
  id: string;
  category: 'hat' | 'top' | 'bottom' | 'shoes' | 'accessory';
  name: string;
  emoji: string;
  recommendedFor: {
    tempLevels: string[];
    weatherTypes: WeatherType[];
  };
}

export const OUTFIT_OPTIONS: OutfitOption[] = [
  // HATS
  { id: 'hat-sun', category: 'hat', name: 'Pălărie de soare', emoji: '👒', recommendedFor: { tempLevels: ['warm', 'hot'], weatherTypes: ['sunny'] } },
  { id: 'hat-cap', category: 'hat', name: 'Șapcă sportivă', emoji: '🧢', recommendedFor: { tempLevels: ['mild', 'warm'], weatherTypes: ['sunny', 'partly_cloudy'] } },
  { id: 'hat-winter', category: 'hat', name: 'Căciulă de lână cu ciucure', emoji: '🧶', recommendedFor: { tempLevels: ['freezing', 'chilly'], weatherTypes: ['snowy', 'cloudy', 'windy'] } },

  // TOPS
  { id: 'top-tshirt', category: 'top', name: 'Tricou lejer de bumbac', emoji: '👕', recommendedFor: { tempLevels: ['warm', 'hot'], weatherTypes: ['sunny', 'partly_cloudy'] } },
  { id: 'top-sweater', category: 'top', name: 'Pulover călduros', emoji: '🧥', recommendedFor: { tempLevels: ['chilly', 'mild'], weatherTypes: ['cloudy', 'windy', 'partly_cloudy'] } },
  { id: 'top-raincoat', category: 'top', name: 'Pelerină impermeabilă galbenă', emoji: '🧥', recommendedFor: { tempLevels: ['chilly', 'mild', 'freezing'], weatherTypes: ['rainy'] } },
  { id: 'top-wintercoat', category: 'top', name: 'Geacă groasă de iarnă', emoji: '🧥', recommendedFor: { tempLevels: ['freezing'], weatherTypes: ['snowy', 'windy'] } },

  // BOTTOMS
  { id: 'bottom-shorts', category: 'bottom', name: 'Pantaloni scurți', emoji: '🩳', recommendedFor: { tempLevels: ['warm', 'hot'], weatherTypes: ['sunny'] } },
  { id: 'bottom-pants', category: 'bottom', name: 'Pantaloni lungi comozi', emoji: '👖', recommendedFor: { tempLevels: ['mild', 'chilly'], weatherTypes: ['partly_cloudy', 'cloudy', 'windy'] } },
  { id: 'bottom-waterproof', category: 'bottom', name: 'Pantaloni rezistenți la apă', emoji: '👖', recommendedFor: { tempLevels: ['freezing', 'chilly'], weatherTypes: ['rainy', 'snowy'] } },

  // SHOES
  { id: 'shoes-sandals', category: 'shoes', name: 'Sandale aerisite', emoji: '👡', recommendedFor: { tempLevels: ['warm', 'hot'], weatherTypes: ['sunny'] } },
  { id: 'shoes-sneakers', category: 'shoes', name: 'Adidași de alergat', emoji: '👟', recommendedFor: { tempLevels: ['mild', 'warm'], weatherTypes: ['sunny', 'partly_cloudy', 'windy'] } },
  { id: 'shoes-rainboots', category: 'shoes', name: 'Cizme de cauciuc colorate', emoji: '👢', recommendedFor: { tempLevels: ['chilly', 'mild'], weatherTypes: ['rainy'] } },
  { id: 'shoes-winterboots', category: 'shoes', name: 'Ghete îmblănite', emoji: '🥾', recommendedFor: { tempLevels: ['freezing'], weatherTypes: ['snowy'] } },

  // ACCESSORIES
  { id: 'acc-umbrella', category: 'accessory', name: 'Umbrelă mare cu buline', emoji: '☂️', recommendedFor: { tempLevels: ['chilly', 'mild', 'freezing'], weatherTypes: ['rainy'] } },
  { id: 'acc-sunglasses', category: 'accessory', name: 'Ochelari de soare haioși', emoji: '🕶️', recommendedFor: { tempLevels: ['warm', 'hot'], weatherTypes: ['sunny', 'partly_cloudy'] } },
  { id: 'acc-scarf', category: 'accessory', name: 'Fular călduros', emoji: '🧣', recommendedFor: { tempLevels: ['freezing', 'chilly'], weatherTypes: ['snowy', 'windy'] } }
];
