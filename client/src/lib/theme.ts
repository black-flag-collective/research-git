export const themes = {
  light: {
    name: "Light",
    class: "",
    colors: {
      background: "hsl(0, 0%, 100%)",
      foreground: "hsl(222.2, 84%, 4.9%)",
      card: "hsl(0, 0%, 100%)",
      cardForeground: "hsl(222.2, 84%, 4.9%)",
      popover: "hsl(0, 0%, 100%)",
      popoverForeground: "hsl(222.2, 84%, 4.9%)",
      primary: "hsl(221.2, 83.2%, 53.3%)",
      primaryForeground: "hsl(210, 40%, 98%)",
      secondary: "hsl(210, 40%, 96%)",
      secondaryForeground: "hsl(222.2, 84%, 4.9%)",
      muted: "hsl(210, 40%, 96%)",
      mutedForeground: "hsl(215.4, 16.3%, 46.9%)",
      accent: "hsl(210, 40%, 96%)",
      accentForeground: "hsl(222.2, 84%, 4.9%)",
      destructive: "hsl(0, 84.2%, 60.2%)",
      destructiveForeground: "hsl(210, 40%, 98%)",
      border: "hsl(214.3, 31.8%, 91.4%)",
      input: "hsl(214.3, 31.8%, 91.4%)",
      ring: "hsl(221.2, 83.2%, 53.3%)",
      sidebar: "hsl(0, 0%, 100%)",
      sidebarForeground: "hsl(222.2, 84%, 4.9%)",
    }
  },
  dark: {
    name: "Dark",
    class: "dark",
    colors: {
      background: "hsl(222.2, 84%, 4.9%)",
      foreground: "hsl(210, 40%, 98%)",
      card: "hsl(222.2, 84%, 4.9%)",
      cardForeground: "hsl(210, 40%, 98%)",
      popover: "hsl(222.2, 84%, 4.9%)",
      popoverForeground: "hsl(210, 40%, 98%)",
      primary: "hsl(217.2, 91.2%, 59.8%)",
      primaryForeground: "hsl(222.2, 84%, 4.9%)",
      secondary: "hsl(217.2, 32.6%, 17.5%)",
      secondaryForeground: "hsl(210, 40%, 98%)",
      muted: "hsl(217.2, 32.6%, 17.5%)",
      mutedForeground: "hsl(215, 20.2%, 65.1%)",
      accent: "hsl(217.2, 32.6%, 17.5%)",
      accentForeground: "hsl(210, 40%, 98%)",
      destructive: "hsl(0, 62.8%, 30.6%)",
      destructiveForeground: "hsl(210, 40%, 98%)",
      border: "hsl(217.2, 32.6%, 17.5%)",
      input: "hsl(217.2, 32.6%, 17.5%)",
      ring: "hsl(217.2, 91.2%, 59.8%)",
      sidebar: "hsl(222.2, 84%, 4.9%)",
      sidebarForeground: "hsl(210, 40%, 98%)",
    }
  },
  archive: {
    name: "Archive",
    class: "theme-archive",
    colors: {
      background: "hsl(24, 20%, 97%)",
      foreground: "hsl(20, 14.3%, 4.1%)",
      card: "hsl(0, 0%, 100%)",
      cardForeground: "hsl(20, 14.3%, 4.1%)",
      popover: "hsl(0, 0%, 100%)",
      popoverForeground: "hsl(20, 14.3%, 4.1%)",
      primary: "hsl(24, 45%, 58%)",
      primaryForeground: "hsl(60, 9.1%, 97.8%)",
      secondary: "hsl(60, 4.8%, 95.9%)",
      secondaryForeground: "hsl(24, 9.8%, 10%)",
      muted: "hsl(60, 4.8%, 95.9%)",
      mutedForeground: "hsl(25, 5.3%, 44.7%)",
      accent: "hsl(60, 4.8%, 95.9%)",
      accentForeground: "hsl(24, 9.8%, 10%)",
      destructive: "hsl(0, 84.2%, 60.2%)",
      destructiveForeground: "hsl(60, 9.1%, 97.8%)",
      border: "hsl(20, 5.9%, 90%)",
      input: "hsl(20, 5.9%, 90%)",
      ring: "hsl(24, 45%, 58%)",
      sidebar: "hsl(30, 20%, 99%)",
      sidebarForeground: "hsl(20, 14.3%, 4.1%)",
    }
  },
  research: {
    name: "Research",
    class: "theme-research",
    colors: {
      background: "hsl(210, 20%, 98%)",
      foreground: "hsl(210, 25%, 7.8431%)",
      card: "hsl(0, 0%, 100%)",
      cardForeground: "hsl(210, 25%, 7.8431%)",
      popover: "hsl(0, 0%, 100%)",
      popoverForeground: "hsl(210, 25%, 7.8431%)",
      primary: "hsl(220, 70%, 50%)",
      primaryForeground: "hsl(0, 0%, 100%)",
      secondary: "hsl(210, 40%, 96%)",
      secondaryForeground: "hsl(210, 25%, 7.8431%)",
      muted: "hsl(210, 40%, 96%)",
      mutedForeground: "hsl(210, 25%, 45%)",
      accent: "hsl(210, 40%, 96%)",
      accentForeground: "hsl(210, 25%, 7.8431%)",
      destructive: "hsl(0, 84%, 60%)",
      destructiveForeground: "hsl(0, 0%, 100%)",
      border: "hsl(210, 30%, 90%)",
      input: "hsl(210, 30%, 97%)",
      ring: "hsl(220, 70%, 50%)",
      sidebar: "hsl(0, 0%, 100%)",
      sidebarForeground: "hsl(210, 25%, 7.8431%)",
    }
  }
} as const;

export type ThemeName = keyof typeof themes;
export type Theme = typeof themes[ThemeName];

export const themeConfig = {
  defaultTheme: "research" as ThemeName,
  typography: {
    fonts: {
      sans: "Inter, system-ui, sans-serif",
      serif: "Georgia, serif",
      mono: "JetBrains Mono, Fira Code, monospace",
    },
    sizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
    }
  },
  spacing: {
    radius: "0.5rem",
    container: "1200px",
  },
  animation: {
    duration: "200ms",
    easing: "ease-out",
  }
};

export function applyTheme(themeName: ThemeName) {
  const theme = themes[themeName];
  const root = document.documentElement;
  
  // Remove all theme classes
  Object.values(themes).forEach(t => {
    if (t.class) root.classList.remove(t.class);
  });
  
  // Add current theme class
  if (theme.class) {
    root.classList.add(theme.class);
  }
  
  // Apply CSS custom properties
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVar, value);
  });
  
  // Apply typography
  root.style.setProperty('--font-sans', themeConfig.typography.fonts.sans);
  root.style.setProperty('--font-serif', themeConfig.typography.fonts.serif);
  root.style.setProperty('--font-mono', themeConfig.typography.fonts.mono);
  root.style.setProperty('--radius', themeConfig.spacing.radius);
  
  // Store preference
  localStorage.setItem('theme', themeName);
}

export function getStoredTheme(): ThemeName {
  if (typeof window === 'undefined') return themeConfig.defaultTheme;
  
  const stored = localStorage.getItem('theme') as ThemeName;
  return stored && stored in themes ? stored : themeConfig.defaultTheme;
}