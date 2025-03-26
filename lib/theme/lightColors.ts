/**
 * Fitness App Light Theme
 * 
 * Modernes, neon-inspiriertes Farbschema für die Fitness-App.
 * Diese Farben sind optimiert für ein helles Design mit guter Lesbarkeit und Kontrast.
 */

export const fitnessLightColors = {
    // Primäre Farben - Leuchtendes Neon-Blau als Hauptfarbe
    primary: {
      default: "#00B2FF", // Leuchtendes Neon-Blau für Hauptaktionen
      light: "#59DDFF",   // Heller für sekundäre Elemente
      dark: "#0085E0",    // Dunkel für Hover/Aktiv-Zustände
      faded: "rgba(0, 178, 255, 0.15)", // Transparent für Hintergründe
      contrast: "#FFFFFF" // Textfarbe auf Primary-Hintergrund
    },
  
    // Sekundäre Farben - Kräftiges Pink für Fortschritt und Fokus
    secondary: {
      default: "#FF2DCA", // Leuchtendes Pink
      light: "#FF67E8",   // Heller für sanfte Elemente
      dark: "#D600A9",    // Dunkel für Hover/Aktiv-Zustände
      faded: "rgba(255, 45, 202, 0.15)", // Transparent für Hintergründe
      contrast: "#FFFFFF" // Textfarbe auf Secondary-Hintergrund
    },
  
    // Tertiäre Farben - Neon-Grün für Erfolg und Abschluss
    tertiary: {
      default: "#00E676", // Leuchtendes Neon-Grün für Erfolg
      light: "#5EFFA6",   // Helleres Grün
      dark: "#00B248",    // Dunkel für Hover/Aktiv-Zustände
      faded: "rgba(0, 230, 118, 0.15)", // Transparent für Hintergründe
      contrast: "#FFFFFF" // Textfarbe auf Tertiary-Hintergrund
    },
  
    // Akzente - Leuchtendes Gelb für Hervorhebungen
    accent: {
      default: "#FFDD00", // Leuchtendes Gelb für Akzente
      light: "#FFEA64",   // Heller für sanfte Akzente
      dark: "#FFBB00",    // Dunkler für Kontrast
      faded: "rgba(255, 221, 0, 0.15)", // Transparent für Hintergründe
      contrast: "#000000" // Textfarbe auf Accent-Hintergrund (schwarz für besseren Kontrast)
    },
  
    // Hintergründe - Reine weiße Töne als Grundlage für ein modernes Aussehen
    background: {
      default: "#F8F9FA", // Haupthintergrund (sehr hell grau)
      elevated: "#FFFFFF", // Erhöhte Elemente (weiß)
      card: "#FFFFFF",    // Kartenelemente (weiß)
      input: "#F0F1F2",   // Input-Felder (leicht grau)
      secondary: "#F3F4F6" // Sekundäre Hintergründe (helles grau)
    },
  
    // Textfarben
    text: {
      primary: "#18191A",    // Dunkelgrau (fast schwarz) für Haupttext
      secondary: "#505A6C",  // Mittelgrau mit leicht blauem Unterton für sekundären Text
      tertiary: "#8890A3",   // Helleres Grau mit blauem Unterton für Platzhalter
      disabled: "#BEC2C9",   // Sehr helles Grau für deaktivierte Elemente
      inverse: "#FFFFFF"     // Weiß für Text auf dunklen Hintergründen
    },
  
    // Gradienten
    gradients: {
      primaryToLight: ["#00B2FF", "#59DDFF"],
      secondaryToLight: ["#FF2DCA", "#FF67E8"],
      tertiaryToLight: ["#00E676", "#5EFFA6"],
      card: ["#FFFFFF", "#F8F9FA"],
      cardHighlight: ["#FFFFFF", "#F0F5FF"],
      header: ["rgba(255,255,255,0.95)", "rgba(248,249,250,0.9)"]
    },
  
    // Statusfarben für Feedback
    status: {
      success: "#00E676", // Gleiches Neon-Grün wie tertiary
      warning: "#FFDD00", // Gleiches leuchtendes Gelb wie accent
      error: "#FF1744",   // Kräftiges Neon-Rot für Fehler
      info: "#00B2FF",    // Gleiches Neon-Blau wie primary
    },
  
    // UI-Elemente
    ui: {
      divider: "#E4E6EB",     // Trennlinien
      border: "#DADDE1",      // Ränder
      shadow: "rgba(0,0,0,0.1)" // Schatten
    }
  };
  
  /**
   * Konvertiert eine hex Farbe mit Opacity zu rgba
   */
  export const hexToRgba = (hex: string, opacity: number): string => {
    if (typeof hex !== 'string') return hex;
    
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  
  export default fitnessLightColors;