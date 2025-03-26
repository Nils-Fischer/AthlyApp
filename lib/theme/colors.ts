/**
 * Fitness App Farbsystem
 * 
 * Diese Datei enthält alle Farben, die in der App verwendet werden.
 * Sie dient als zentrale Stelle für die Farbdefinitionen, um ein konsistentes Design zu gewährleisten.
 */

export const fitnessColors = {
    // Primäre Farben - Orange für Energie und Dynamik
    primary: {
      default: "#FF5E0E", // Kräftiges Orange für Hauptaktionen
      light: "#FF8A50",   // Heller für sekundäre Elemente
      dark: "#E64500",    // Dunkel für Hover/Aktiv-Zustände
      faded: "rgba(255, 94, 14, 0.2)", // Transparent für Hintergründe
    },
  
    // Sekundäre Farben - Blau für Fortschritt und Fokus
    secondary: {
      default: "#0088FF", // Lebendiges Blau
      light: "#60B5FF",   // Heller für sanfte Elemente
      dark: "#0065C2",    // Dunkel für Hover/Aktiv-Zustände
      faded: "rgba(0, 136, 255, 0.2)", // Transparent für Hintergründe
    },
  
    // Tertiäre Farben - Grün für Erfolg und Abschluss
    tertiary: {
      default: "#00C853", // Lebendiges Grün für Erfolg
      light: "#5EE595",   // Helleres Grün
      dark: "#009624",    // Dunkel für Hover/Aktiv-Zustände
      faded: "rgba(0, 200, 83, 0.2)", // Transparent für Hintergründe
    },
  
    // Akzente - Gelb für Hervorhebungen
    accent: {
      default: "#FFB300", // Gelb-Orange für Akzente
      light: "#FFD54F",   // Heller für sanfte Akzente
      dark: "#FF8F00",    // Dunkler für Kontrast
      faded: "rgba(255, 179, 0, 0.2)", // Transparent für Hintergründe
    },
  
    // Hintergründe - Dunkle Töne als Grundlage
    background: {
      default: "#121212", // Haupthintergrund (fast schwarz)
      elevated: "#1E1E1E", // Leicht erhöhte Elemente
      card: "#252525",    // Kartenelemente
      input: "#2C2C2C",   // Input-Felder
    },
  
    // Textfarben
    text: {
      primary: "#FFFFFF",    // Weiß für Haupttext
      secondary: "#B0B0B0",  // Grau für sekundären Text
      tertiary: "#707070",   // Dunkleres Grau für Platzhalter
      disabled: "#505050",   // Für deaktivierte Elemente
    },
  
    // Statusfarben für Feedback
    status: {
      success: "#00C853", // Gleiches Grün wie tertiary
      warning: "#FFB300", // Gleiches Gelb wie accent
      error: "#FF3D00",   // Rot für Fehler
      info: "#0088FF",    // Gleiches Blau wie secondary
    },
  
    // Zusätzliche Farben für Diagramme und Visualisierungen
    chart: {
      orange: "#FF5E0E",
      blue: "#0088FF",
      green: "#00C853",
      yellow: "#FFB300",
      purple: "#AA00FF",
      cyan: "#00E5FF",
      pink: "#FF4081",
      teal: "#1DE9B6",
    },
  
    // Gradienten
    gradients: {
      primaryToAccent: ["#FF5E0E", "#FFB300"],
      primaryToDark: ["#FF5E0E", "#E64500"],
      blueToGreen: ["#0088FF", "#00C853"],
      darkToLight: ["#121212", "#252525"],
    },
  };
  
  /**
   * Konvertiert eine hex Farbe mit Opacity zu rgba
   * @param hex Hex Farbcode (z.B. "#FF5E0E")
   * @param opacity Opacity Wert zwischen 0 und 1
   * @returns rgba Farbwert als String
   */
  export const hexToRgba = (hex: string, opacity: number): string => {
    if (typeof hex !== 'string') return hex;
    
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  
  /**
   * Erstellt einen linearen Gradienten String für React Native
   * @param colors Array mit Farbwerten
   * @param direction "to-right" | "to-left" | "to-bottom" | "to-top" | "to-bottom-right" | "to-top-left"
   * @returns CSS Gradient String
   */
  export const linearGradient = (
    colors: string[], 
    direction: "to-right" | "to-left" | "to-bottom" | "to-top" | "to-bottom-right" | "to-top-left" = "to-right"
  ): string => {
    let angle = "90deg";
    
    switch (direction) {
      case "to-right": angle = "90deg"; break;
      case "to-left": angle = "270deg"; break;
      case "to-bottom": angle = "180deg"; break;
      case "to-top": angle = "0deg"; break;
      case "to-bottom-right": angle = "135deg"; break;
      case "to-top-left": angle = "315deg"; break;
    }
    
    return `linear-gradient(${angle}, ${colors.join(", ")})`;
  };
  
  export default fitnessColors;