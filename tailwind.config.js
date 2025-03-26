const { hairlineWidth } = require("nativewind/theme");

// Die neuen Fitness-App-Farben
const fitnessColors = {
  // Primäre Farben - Orange für Energie und Dynamik
  primary: {
    DEFAULT: "#FF5E0E", // Kräftiges Orange für Hauptaktionen
    light: "#FF8A50",   // Heller für sekundäre Elemente
    dark: "#E64500",    // Dunkel für Hover/Aktiv-Zustände
    faded: "rgba(255, 94, 14, 0.2)", // Transparent für Hintergründe
  },

  // Sekundäre Farben - Blau für Fortschritt und Fokus
  secondary: {
    DEFAULT: "#0088FF", // Lebendiges Blau
    light: "#60B5FF",   // Heller für sanfte Elemente
    dark: "#0065C2",    // Dunkel für Hover/Aktiv-Zustände
    faded: "rgba(0, 136, 255, 0.2)", // Transparent für Hintergründe
  },

  // Tertiäre Farben - Grün für Erfolg und Abschluss
  tertiary: {
    DEFAULT: "#00C853", // Lebendiges Grün für Erfolg
    light: "#5EE595",   // Helleres Grün
    dark: "#009624",    // Dunkel für Hover/Aktiv-Zustände
    faded: "rgba(0, 200, 83, 0.2)", // Transparent für Hintergründe
  },

  // Akzente - Gelb für Hervorhebungen
  accent: {
    DEFAULT: "#FFB300", // Gelb-Orange für Akzente
    light: "#FFD54F",   // Heller für sanfte Akzente
    dark: "#FF8F00",    // Dunkler für Kontrast
    faded: "rgba(255, 179, 0, 0.2)", // Transparent für Hintergründe
  },

  // Hintergründe - Dunkle Töne als Grundlage
  bg: {
    DEFAULT: "#121212", // Haupthintergrund (fast schwarz)
    elevated: "#1E1E1E", // Leicht erhöhte Elemente
    card: "#252525",    // Kartenelemente
    input: "#2C2C2C",   // Input-Felder
  },
  
  // Textfarben
  text: {
    DEFAULT: "#FFFFFF",    // Weiß für Haupttext
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
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Bestehende HSL-Farben für Kompatibilität mit vorhandenen Komponenten
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // NEUES FARBSYSTEM - Direktzugriff für neue Komponenten
        // Zugriff mit Klassen wie 'bg-fitness-primary' oder 'text-fitness-tertiary-light'
        fitness: {
          primary: fitnessColors.primary,
          secondary: fitnessColors.secondary,
          tertiary: fitnessColors.tertiary,
          accent: fitnessColors.accent,
          background: fitnessColors.bg.DEFAULT,
          'bg-elevated': fitnessColors.bg.elevated,
          'bg-card': fitnessColors.bg.card,
          'bg-input': fitnessColors.bg.input,
          text: fitnessColors.text.DEFAULT,
          'text-secondary': fitnessColors.text.secondary,
          'text-tertiary': fitnessColors.text.tertiary,
          'text-disabled': fitnessColors.text.disabled,
          success: fitnessColors.status.success,
          warning: fitnessColors.status.warning,
          error: fitnessColors.status.error,
          info: fitnessColors.status.info,
        },
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};