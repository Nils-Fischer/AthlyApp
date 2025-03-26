import { useMemo } from "react";
import { useWorkoutHistoryStore } from "~/stores/workoutHistoryStore";
import { WorkoutSession, ExerciseRecord } from "~/lib/types";
import { format, addDays, startOfMonth, endOfMonth, addMonths } from "date-fns";

/**
 * Hook für Workout-Statistiken und Analytics
 * Berechnet verschiedene Statistiken basierend auf den Workout-Sessions
 */
export function useWorkoutStats() {
  const { sessions } = useWorkoutHistoryStore();

  // Hilfsfunktion zum Extrahieren der Anzahl der Sätze
  const getSetsCount = (entry: ExerciseRecord): number => {
    if (typeof entry.sets === 'number') {
      return entry.sets;
    }
    // Falls sets ein Array ist, nutze die Länge
    if (Array.isArray(entry.sets)) {
      return entry.sets.length;
    }
    return 1; // Fallback
  };

  // Hilfsfunktion zum Berechnen des Volumens eines Eintrags
  const calculateEntryVolume = (entry: ExerciseRecord): number => {
    const weight = entry.weight || 0;
    const reps = entry.reps || 0;
    const sets = getSetsCount(entry);
    
    return weight * sets * reps;
  };

  // Berechnete Werte für monatliche Workouts
  const monthlyWorkouts = useMemo(() => {
    const now = new Date();
    
    // Aktueller Monat
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentMonthSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.getMonth() === currentMonth && 
             sessionDate.getFullYear() === currentYear;
    });
    
    // Vormonat
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const previousMonthSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.getMonth() === previousMonth && 
             sessionDate.getFullYear() === previousYear;
    });
    
    const current = currentMonthSessions.length;
    const previous = previousMonthSessions.length;
    const trend = previous === 0 ? 0 : Math.round((current - previous) / previous * 100);
    
    return { current, previous, trend };
  }, [sessions]);

  // Hilfsfunktion zum Extrahieren der Trainingsdauer
  const getDuration = (session: WorkoutSession): number => {
    if (typeof session.duration === 'number') {
      return session.duration;
    }
    // Falls duration ein string ist oder ein anderer Typ, versuche zu konvertieren
    if (session.duration) {
      const parsed = Number(session.duration);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
    // Als Fallback: Schätze die Zeit aus den Übungen
    // (z.B. 2 Minuten pro Satz als Schätzung)
    return session.entries.reduce((total, entry) => {
      return total + getSetsCount(entry) * 2;
    }, 0);
  };

  // Durchschnittliche Session-Dauer
  const averageSessionDuration = useMemo(() => {
    const now = new Date();
    
    // Letzten 30 Tage
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    const currentSessions = sessions.filter(session => 
      new Date(session.date) >= thirtyDaysAgo && new Date(session.date) <= now
    );
    
    // 30-60 Tage zurück
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(now.getDate() - 60);
    
    const previousSessions = sessions.filter(session => 
      new Date(session.date) >= sixtyDaysAgo && new Date(session.date) < thirtyDaysAgo
    );
    
    // Berechne Durchschnitte
    const current = currentSessions.length > 0 
      ? Math.round(currentSessions.reduce((sum, session) => sum + getDuration(session), 0) / currentSessions.length) 
      : 0;
      
    const previous = previousSessions.length > 0 
      ? Math.round(previousSessions.reduce((sum, session) => sum + getDuration(session), 0) / previousSessions.length) 
      : 0;
      
    const trend = previous === 0 ? 0 : Math.round((current - previous) / previous * 100);
    
    return { current, previous, trend };
  }, [sessions]);

  // Wöchentliche Workout-Frequenz
  const weeklyWorkoutsAverage = useMemo(() => {
    const now = new Date();
    
    // Letzten 4 Wochen
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(now.getDate() - 28);
    
    const currentSessions = sessions.filter(session => 
      new Date(session.date) >= fourWeeksAgo && new Date(session.date) <= now
    );
    
    // 4-8 Wochen zurück
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(now.getDate() - 56);
    
    const previousSessions = sessions.filter(session => 
      new Date(session.date) >= eightWeeksAgo && new Date(session.date) < fourWeeksAgo
    );
    
    // Berechne wöchentliche Durchschnitte
    const current = +(currentSessions.length / 4).toFixed(1);
    const previous = +(previousSessions.length / 4).toFixed(1);
    const trend = previous === 0 ? 0 : Math.round((current - previous) / previous * 100);
    
    return { current, previous, trend };
  }, [sessions]);

  // Gesamtvolumen
  const totalVolume = useMemo(() => {
    const now = new Date();
    
    // Letzten 30 Tage
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    // 30-60 Tage zurück
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(now.getDate() - 60);
    
    // Berechne Volumen für jeden Zeitraum
    const calculateVolume = (sessionsArray: WorkoutSession[]) => {
      return sessionsArray.reduce((totalVolume, session) => {
        const sessionVolume = session.entries.reduce((entryVolume, entry) => {
          return entryVolume + calculateEntryVolume(entry);
        }, 0);
        return totalVolume + sessionVolume;
      }, 0);
    };
    
    const currentSessions = sessions.filter(session => 
      new Date(session.date) >= thirtyDaysAgo && new Date(session.date) <= now
    );
    
    const previousSessions = sessions.filter(session => 
      new Date(session.date) >= sixtyDaysAgo && new Date(session.date) < thirtyDaysAgo
    );
    
    const current = Math.round(calculateVolume(currentSessions));
    const previous = Math.round(calculateVolume(previousSessions));
    const trend = previous === 0 ? 0 : Math.round((current - previous) / previous * 100);
    
    return { current, previous, trend };
  }, [sessions]);

  // Workout Kalenderdaten für Heatmap
  const getWorkoutCalendarData = (startDate: Date, endDate: Date) => {
    // Erstelle ein Array mit allen Tagen im Bereich
    const result = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
      
      // Finde Workouts für diesen Tag
      const dayWorkouts = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate.toISOString().split('T')[0] === dateStr;
      });
      
      result.push({
        date: dateStr,
        count: dayWorkouts.length,
        workoutId: dayWorkouts.length > 0 ? dayWorkouts[0].id : undefined
      });
      
      // Nächster Tag
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return result;
  };

  // Finde Workout für ein bestimmtes Datum
  const getWorkoutByDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    
    return sessions.find(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.toISOString().split('T')[0] === dateStr;
    });
  };

  // Top Übungen nach Nutzungshäufigkeit und Volumen
  const getTopExercises = (limit = 3) => {
    const exerciseStats: Record<number, { 
      exerciseId: number; 
      name: string;
      count: number; 
      volume: number; 
      sets: number;
    }> = {};
    
    // Sammle Daten für jede Übung
    sessions.forEach(session => {
      session.entries.forEach(entry => {
        if (!exerciseStats[entry.exerciseId]) {
          exerciseStats[entry.exerciseId] = {
            exerciseId: entry.exerciseId,
            name: entry.exerciseName || `Übung ${entry.exerciseId}`,
            count: 0,
            volume: 0,
            sets: 0
          };
        }
        
        exerciseStats[entry.exerciseId].count += 1;
        exerciseStats[entry.exerciseId].sets += getSetsCount(entry);
        exerciseStats[entry.exerciseId].volume += calculateEntryVolume(entry);
      });
    });
    
    // Sortiere nach Volume und gib die Top-N zurück
    return Object.values(exerciseStats)
      .sort((a, b) => b.volume - a.volume)
      .slice(0, limit);
  };

  // Berechne aktuelle Streak
  const getCurrentStreak = () => {
    if (sessions.length === 0) return 0;
    
    // Sortiere Sessions nach Datum (neueste zuerst)
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let streak = 1;
    let currentDate = new Date(sortedSessions[0].date);
    currentDate.setHours(0, 0, 0, 0);
    
    // Prüfe, ob das letzte Training innerhalb der letzten 48 Stunden war
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const msSinceLastWorkout = now.getTime() - currentDate.getTime();
    const daysSinceLastWorkout = msSinceLastWorkout / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastWorkout > 1) {
      return 0; // Streak ist gebrochen wenn mehr als 1 Tag vergangen ist
    }
    
    // Berechne aktuelle Streak
    for (let i = 1; i < sortedSessions.length; i++) {
      const prevDate = new Date(sortedSessions[i].date);
      prevDate.setHours(0, 0, 0, 0);
      
      // Berechne Differenz in Tagen
      const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Aufeinanderfolgende Tage
        streak++;
        currentDate = prevDate;
      } else if (diffDays === 0) {
        // Gleiches Datum (mehrere Workouts am selben Tag)
        currentDate = prevDate;
      } else {
        // Streak ist unterbrochen
        break;
      }
    }
    
    return streak;
  };

  // Berechne längste Streak
  const getLongestStreak = () => {
    if (sessions.length === 0) return { days: 0, endDate: new Date() };
    
    // Sortiere Sessions nach Datum (älteste zuerst)
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    let longestStreak = 1;
    let currentStreak = 1;
    let longestStreakEndDate = new Date(sortedSessions[0].date);
    let currentDate = new Date(sortedSessions[0].date);
    currentDate.setHours(0, 0, 0, 0);
    
    // Berechne längste Streak
    for (let i = 1; i < sortedSessions.length; i++) {
      const nextDate = new Date(sortedSessions[i].date);
      nextDate.setHours(0, 0, 0, 0);
      
      // Berechne Differenz in Tagen
      const diffDays = Math.round((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Aufeinanderfolgende Tage
        currentStreak++;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
          longestStreakEndDate = nextDate;
        }
      } else if (diffDays === 0) {
        // Gleiches Datum (mehrere Workouts am selben Tag)
      } else {
        // Streak ist unterbrochen
        currentStreak = 1;
      }
      
      currentDate = nextDate;
    }
    
    return { days: longestStreak, endDate: longestStreakEndDate };
  };

  // Wochentags-Verteilung der Workouts
  const getWorkoutsByWeekday = () => {
    const weekdayCounts = [0, 0, 0, 0, 0, 0, 0]; // So, Mo, Di, Mi, Do, Fr, Sa
    
    sessions.forEach(session => {
      const date = new Date(session.date);
      const weekday = date.getDay(); // 0 = Sonntag, 1 = Montag, ...
      weekdayCounts[weekday]++;
    });
    
    // Konvertiere zu deutschem Format (Mo, Di, Mi, Do, Fr, Sa, So)
    const germanyWeekdayCounts = [
      weekdayCounts[1], // Montag
      weekdayCounts[2], // Dienstag
      weekdayCounts[3], // Mittwoch
      weekdayCounts[4], // Donnerstag
      weekdayCounts[5], // Freitag
      weekdayCounts[6], // Samstag
      weekdayCounts[0]  // Sonntag
    ];
    
    return {
      counts: germanyWeekdayCounts,
      labels: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
    };
  };

  return {
    // Berechnete Statistiken
    monthlyWorkouts,
    averageSessionDuration,
    weeklyWorkoutsAverage,
    totalVolume,
    
    // Funktionen
    getWorkoutCalendarData,
    getWorkoutByDate,
    getTopExercises,
    getCurrentStreak,
    getLongestStreak,
    getWorkoutsByWeekday
  };
}