export type ColorSchemeId = 'sunset' | 'aurora' | 'lagoon' | 'forest';

type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

type ComponentTokenOverrides = {
  primary?: ColorScale;
};

export interface PlaygroundColorScheme {
  id: ColorSchemeId;
  name: string;
  accent: string;
  accentStrong: string;
  accentContrast: string;
  surface: string;
  surfaceStrong: string;
  shadow: string;
  spinner: string;
  gradient: {
    light: { from: string; via: string; to: string };
    dark: { from: string; via: string; to: string };
  };
  glowLight: [string, string];
  glowDark: [string, string];
  componentTokens?: ComponentTokenOverrides;
}

export const colorSchemes: PlaygroundColorScheme[] = [
  {
    id: 'sunset',
    name: 'Sunset',
    accent: '#FF6B35',
    accentStrong: '#FF3E00',
    accentContrast: '#FFFFFF',
    surface: 'rgba(255, 107, 53, 0.12)',
    surfaceStrong: 'rgba(255, 107, 53, 0.24)',
    shadow: 'rgba(255, 107, 53, 0.25)',
    spinner: 'rgba(255, 143, 110, 0.7)',
    gradient: {
      light: { from: '#FFF8F4', via: '#FFE8DF', to: '#FFE0D0' },
      dark: { from: '#1D1411', via: '#261513', to: '#311916' }
    },
    glowLight: ['rgba(255, 185, 122, 0.20)', 'rgba(255, 127, 122, 0.20)'],
    glowDark: ['rgba(255, 167, 122, 0.35)', 'rgba(255, 127, 191, 0.30)'],
    componentTokens: {
      primary: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12'
      }
    }
  },
  {
    id: 'aurora',
    name: 'Aurora',
    accent: '#8B5CF6',
    accentStrong: '#EC4899',
    accentContrast: '#FFFFFF',
    surface: 'rgba(139, 92, 246, 0.12)',
    surfaceStrong: 'rgba(236, 72, 153, 0.16)',
    shadow: 'rgba(139, 92, 246, 0.28)',
    spinner: 'rgba(196, 181, 253, 0.7)',
    gradient: {
      light: { from: '#F5F0FF', via: '#FDE7F5', to: '#FFF0FB' },
      dark: { from: '#160F1E', via: '#1C1122', to: '#241127' }
    },
    glowLight: ['rgba(139, 92, 246, 0.25)', 'rgba(236, 72, 153, 0.18)'],
    glowDark: ['rgba(139, 92, 246, 0.35)', 'rgba(236, 72, 153, 0.35)'],
    componentTokens: {
      primary: {
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95'
      }
    }
  },
  {
    id: 'lagoon',
    name: 'Lagoon',
    accent: '#0EA5E9',
    accentStrong: '#6366F1',
    accentContrast: '#FFFFFF',
    surface: 'rgba(14, 165, 233, 0.12)',
    surfaceStrong: 'rgba(99, 102, 241, 0.15)',
    shadow: 'rgba(14, 165, 233, 0.3)',
    spinner: 'rgba(125, 211, 252, 0.85)',
    gradient: {
      light: { from: '#F0FAFF', via: '#E0F2FF', to: '#DFF0FF' },
      dark: { from: '#0F172A', via: '#111C2F', to: '#0F1A2A' }
    },
    glowLight: ['rgba(14, 165, 233, 0.2)', 'rgba(99, 102, 241, 0.18)'],
    glowDark: ['rgba(14, 165, 233, 0.25)', 'rgba(99, 102, 241, 0.25)'],
    componentTokens: {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e'
      }
    }
  },
  {
    id: 'forest',
    name: 'Forest',
    accent: '#22C55E',
    accentStrong: '#16A34A',
    accentContrast: '#032810',
    surface: 'rgba(34, 197, 94, 0.12)',
    surfaceStrong: 'rgba(34, 197, 94, 0.2)',
    shadow: 'rgba(34, 197, 94, 0.26)',
    spinner: 'rgba(134, 239, 172, 0.8)',
    gradient: {
      light: { from: '#F2FFF6', via: '#E6FFEE', to: '#DFFEEC' },
      dark: { from: '#0E1B14', via: '#0D2416', to: '#0C2C1B' }
    },
    glowLight: ['rgba(34, 197, 94, 0.2)', 'rgba(5, 150, 105, 0.18)'],
    glowDark: ['rgba(34, 197, 94, 0.3)', 'rgba(5, 150, 105, 0.28)'],
    componentTokens: {
      primary: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b'
      }
    }
  }
];

export const defaultColorSchemeId: ColorSchemeId = 'sunset';

export const colorSchemeMap = new Map(colorSchemes.map((scheme) => [scheme.id, scheme]));
