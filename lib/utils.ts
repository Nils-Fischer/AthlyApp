import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): number {
  return parseInt(
    Date.now().toString() +
      Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")
  );
}

export function parseJSON<T>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
}
import { CoachResponse, IntelligentFeedback, WorkoutPerformance } from '~/lib/types';

export const generateIntelligentFeedback = (
  mood: 'great' | 'good' | 'bad',
  difficulty: 'easy' | 'perfect' | 'hard',
  currentPerformance: WorkoutPerformance,
  previousPerformances: WorkoutPerformance[]
): CoachResponse => {
  
  // Berechne kontextbezogene Daten
  const performanceChange = previousPerformances.length > 0
    ? ((currentPerformance.volume - previousPerformances[0].volume) / previousPerformances[0].volume) * 100
    : 0;
  
  const workoutsThisWeek = previousPerformances.filter(p => {
    const date = new Date(p.date);
    const today = new Date();
    return date >= new Date(today.setDate(today.getDate() - 7));
  }).length;

  // Personalisierte Hauptnachricht
  const getMainMessage = () => {
    if (mood === 'great' && difficulty === 'perfect') {
      return `Was für ein starkes Training! ${
        performanceChange > 0 
          ? `Du hast dich um ${Math.abs(performanceChange).toFixed(1)}% gesteigert – genau diese konstante Progression wollen wir sehen.`
          : "Deine Form und Ausführung waren heute besonders gut."
      } ${
        workoutsThisWeek >= 3 
          ? "Deine Konstanz diese Woche ist beeindruckend!" 
          : "Lass uns diese Energie in die nächsten Trainings mitnehmen!"
      }`;
    }

    if (mood === 'great' && difficulty === 'easy') {
      return `Du fühlst dich heute stark, das ist super! Dein Körper zeigt deutliche Anpassungen ans Training. ${
        performanceChange > 0 
          ? "Die Gewichte fühlen sich leichter an – ein klares Zeichen für deinen Fortschritt."
          : "Deine Bewegungen waren heute besonders kontrolliert und präzise."
      } Beim nächsten Training können wir die Intensität etwas erhöhen.`;
    }

    if (mood === 'bad' && difficulty === 'hard') {
      return `Auch anspruchsvolle Trainings sind wichtig für deine Entwicklung. ${
        workoutsThisWeek >= 3 
          ? "Besonders nach einer intensiven Trainingswoche ist das völlig normal." 
          : "Solche Tage hat jeder – sie machen dich mental und physisch stärker."
      } Lass uns für das nächste Training die Gewichte leicht anpassen, damit du wieder in deiner optimalen Zone trainierst.`;
    }

    // ... weitere personalisierte Kombinationen
    return "Gutes Training! Lass uns darauf aufbauen.";
  };

  // Detaillierte Empfehlungen
  const getDetailedRecommendations = (): IntelligentFeedback[] => {
    const details: IntelligentFeedback[] = [];

    // Performance-basierte Empfehlung
    if (performanceChange !== 0) {
      details.push({
        type: 'performance',
        message: performanceChange > 0
          ? `Dein Trainingsvolumen ist um ${Math.abs(performanceChange).toFixed(1)}% gestiegen. Deine Kraft entwickelt sich sehr gut!`
          : `Dein Volumen war heute etwas niedriger als beim letzten Mal. Das ist völlig okay - Schwankungen sind normal und Teil des Prozesses.`,
        priority: 'high'
      });
    }

    // Recovery-Empfehlung basierend auf Intensität und Wochenvolumen
    details.push({
      type: 'recovery',
      message: difficulty === 'hard' || workoutsThisWeek >= 4
        ? "Plane eine etwas längere Regenerationsphase ein (48h+). Fokussiere dich auf guten Schlaf und ausreichend Protein."
        : "Eine normale Regenerationszeit von 24-36h sollte ausreichen. Achte auf gute Ernährung.",
      priority: workoutsThisWeek >= 4 ? 'high' : 'medium'
    });

    // Motivations-Tipp
    if (mood === 'great') {
      details.push({
        type: 'motivation',
        message: "Du bist auf einem sehr guten Weg! Deine Konstanz und dein Einsatz zahlen sich aus.",
        recommendation: difficulty === 'easy' 
          ? "Bereite dich mental darauf vor, beim nächsten Mal etwas mehr Gewicht zu stemmen." 
          : "Behalte diese Intensität bei - sie ist optimal für deinen Fortschritt.",
        priority: 'medium'
      });
    }

    return details;
  };

  return {
    mainMessage: getMainMessage(),
    details: getDetailedRecommendations(),
    nextWorkoutSuggestion: {
      weight: currentPerformance.volume * (
        difficulty === 'easy' && mood === 'great' ? 1.05 :
        difficulty === 'hard' && mood === 'bad' ? 0.95 :
        1
      ),
      intensity: 
        difficulty === 'easy' && mood === 'great' ? 75 :
        difficulty === 'hard' && mood === 'bad' ? 65 :
        70,
      recoveryTime: 
        difficulty === 'hard' || workoutsThisWeek >= 4 ? 48 : 
        24
    }
  };
};