/**
 * Fitness App Light Theme
 * 
 * Helles, freundliches Farbschema für die moderne Fitness-App.
 * Diese Farben sind optimiert für ein helles Design mit guter Lesbarkeit und Kontrast.
 */

export const fitnessLightColors = {
    // Primäre Farben - Lebendiges Orange als Hauptfarbe
    primary: {
      default: "#FF5E0E", // Kräftiges Orange für Hauptaktionen
      light: "#FF8A50",   // Heller für sekundäre Elemente
      dark: "#E64500",    // Dunkel für Hover/Aktiv-Zustände
      faded: "rgba(255, 94, 14, 0.15)", // Transparent für Hintergründe
      contrast: "#FFFFFF" // Textfarbe auf Primary-Hintergrund
    },
  
    // Sekundäre Farben - Frisches Blau für Fortschritt und Fokus
    secondary: {
      default: "#0088FF", // Lebendiges Blau
      light: "#60B5FF",   // Heller für sanfte Elemente
      dark: "#0065C2",    // Dunkel für Hover/Aktiv-Zustände
      faded: "rgba(0, 136, 255, 0.15)", // Transparent für Hintergründe
      contrast: "#FFFFFF" // Textfarbe auf Secondary-Hintergrund
    },
  
    // Tertiäre Farben - Frisches Grün für Erfolg und Abschluss
    tertiary: {
      default: "#00C853", // Lebendiges Grün für Erfolg
      light: "#5EE595",   // Helleres Grün
      dark: "#009624",    // Dunkel für Hover/Aktiv-Zustände
      faded: "rgba(0, 200, 83, 0.15)", // Transparent für Hintergründe
      contrast: "#FFFFFF" // Textfarbe auf Tertiary-Hintergrund
    },
  
    // Akzente - Gelb für Hervorhebungen
    accent: {
      default: "#FF9500", // Warmes Orange-Gelb für Akzente
      light: "#FFB74D",   // Heller für sanfte Akzente
      dark: "#F57C00",    // Dunkler für Kontrast
      faded: "rgba(255, 149, 0, 0.15)", // Transparent für Hintergründe
      contrast: "#FFFFFF" // Textfarbe auf Accent-Hintergrund
    },
  
    // Hintergründe - Helle Töne als Grundlage
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
      secondary: "#606770",  // Mittelgrau für sekundären Text
      tertiary: "#909499",   // Helleres Grau für Platzhalter
      disabled: "#BEC2C9",   // Sehr helles Grau für deaktivierte Elemente
      inverse: "#FFFFFF"     // Weiß für Text auf dunklen Hintergründen
    },
  
    // Gradienten
    gradients: {
      primaryToLight: ["#FF5E0E", "#FF8A50"],
      secondaryToLight: ["#0088FF", "#60B5FF"],
      tertiaryToLight: ["#00C853", "#5EE595"],
      card: ["#FFFFFF", "#F8F9FA"],
      cardHighlight: ["#FFFFFF", "#F0F5FF"],
      header: ["rgba(255,255,255,0.95)", "rgba(248,249,250,0.9)"]
    },
  
    // Statusfarben für Feedback
    status: {
      success: "#00C853", // Gleiches Grün wie tertiary
      warning: "#FF9500", // Gleiches Orange-Gelb wie accent
      error: "#FF3D00",   // Rot für Fehler
      info: "#0088FF",    // Gleiches Blau wie secondary
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