/**
 * Theme Configuration
 * 
 * This file allows you to easily control all aspects of the application's theme system.
 * Modify colors, typography, spacing, and animations here for global changes.
 */

export const themeConfig = {
  // Default theme to use when the app loads
  defaultTheme: "research" as const,

  // Available theme options
  themes: {
    research: {
      name: "Research",
      description: "Clean and professional theme for research work",
      primary: "hsl(220, 70%, 50%)", // Blue primary
      accent: "hsl(210, 40%, 96%)",  // Light gray accent
    },
    archive: {
      name: "Archive",
      description: "Warm, document-inspired theme",
      primary: "hsl(24, 45%, 58%)",  // Warm brown primary
      accent: "hsl(60, 4.8%, 95.9%)", // Cream accent
    },
    dark: {
      name: "Dark",
      description: "Dark theme for low-light environments",
      primary: "hsl(217.2, 91.2%, 59.8%)", // Bright blue primary
      accent: "hsl(217.2, 32.6%, 17.5%)",  // Dark accent
    },
    light: {
      name: "Light",
      description: "Clean light theme with high contrast",
      primary: "hsl(221.2, 83.2%, 53.3%)", // Standard blue
      accent: "hsl(210, 40%, 96%)",         // Light accent
    }
  },

  // Typography settings
  typography: {
    fontFamily: {
      sans: "Inter, system-ui, sans-serif",
      serif: "Georgia, serif",
      mono: "JetBrains Mono, Fira Code, Consolas, monospace"
    },
    fontSize: {
      xs: "0.75rem",    // 12px
      sm: "0.875rem",   // 14px  
      base: "1rem",     // 16px
      lg: "1.125rem",   // 18px
      xl: "1.25rem",    // 20px
      "2xl": "1.5rem",  // 24px
      "3xl": "1.875rem",// 30px
      "4xl": "2.25rem", // 36px
    },
    fontWeight: {
      normal: "400",
      medium: "500", 
      semibold: "600",
      bold: "700"
    }
  },

  // Spacing and layout
  spacing: {
    borderRadius: {
      sm: "0.25rem",  // 4px
      md: "0.375rem", // 6px 
      lg: "0.5rem",   // 8px (default)
      xl: "0.75rem",  // 12px
      "2xl": "1rem",  // 16px
    },
    container: {
      maxWidth: "1200px",
      padding: "1rem"
    },
    layout: {
      headerHeight: "3.5rem",   // 56px
      sidebarWidth: "20rem",    // 320px
      sidebarCollapsed: "4rem", // 64px
    }
  },

  // Animation settings
  animation: {
    duration: {
      fast: "150ms",
      normal: "200ms", 
      slow: "300ms",
    },
    easing: {
      default: "ease-out",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
    }
  },

  // Component-specific settings
  components: {
    card: {
      shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      shadowHover: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    },
    button: {
      height: {
        sm: "2rem",     // 32px
        md: "2.5rem",   // 40px 
        lg: "2.75rem",  // 44px
      }
    },
    input: {
      height: "2.5rem", // 40px
      borderWidth: "1px"
    }
  },

  // Archive-specific theme colors
  archive: {
    statusColors: {
      draft: "hsl(45, 93%, 47%)",      // Yellow/amber
      review: "hsl(213, 94%, 68%)",    // Blue
      approved: "hsl(142, 76%, 36%)",  // Green
      rejected: "hsl(0, 84%, 60%)",    // Red
    },
    categoryColors: {
      manuscript: "hsl(220, 70%, 50%)",    // Blue
      photograph: "hsl(160, 70%, 45%)",    // Emerald
      correspondence: "hsl(30, 70%, 55%)", // Amber
      legal: "hsl(280, 70%, 50%)",         // Purple
      personal: "hsl(340, 70%, 50%)",      // Rose
    }
  }
};

// Helper function to get theme colors
export function getThemeColor(themeName: keyof typeof themeConfig.themes, colorType: 'primary' | 'accent') {
  return themeConfig.themes[themeName][colorType];
}

// Helper function to get status color
export function getStatusColor(status: keyof typeof themeConfig.archive.statusColors) {
  return themeConfig.archive.statusColors[status];
}

// Helper function to get category color  
export function getCategoryColor(category: keyof typeof themeConfig.archive.categoryColors) {
  return themeConfig.archive.categoryColors[category];
}