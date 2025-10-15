import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemePreset = {
  id: string
  name: string
  primary: string // hue value for oklch
  secondary: string // hue value for oklch
  accent: string // hue value for oklch
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'cyan',
    name: 'Cyan',
    primary: '210', // cyan/turquoise
    secondary: '300', // purple
    accent: '330', // pink
  },
  {
    id: 'purple',
    name: 'Purple',
    primary: '280', // purple
    secondary: '330', // pink
    accent: '210', // cyan
  },
  {
    id: 'pink',
    name: 'Pink',
    primary: '330', // pink/magenta
    secondary: '280', // purple
    accent: '210', // cyan
  },
  {
    id: 'green',
    name: 'Green',
    primary: '150', // green/emerald
    secondary: '180', // cyan-green
    accent: '120', // lime
  },
  {
    id: 'orange',
    name: 'Orange',
    primary: '40', // orange
    secondary: '60', // yellow
    accent: '20', // red-orange
  },
  {
    id: 'red',
    name: 'Red',
    primary: '20', // red
    secondary: '340', // pink-red
    accent: '40', // orange
  },
  {
    id: 'blue',
    name: 'Blue',
    primary: '240', // blue
    secondary: '210', // cyan
    accent: '270', // purple-blue
  },
]

interface ThemeStore {
  currentTheme: string
  setTheme: (themeId: string) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      currentTheme: 'cyan',
      setTheme: (themeId: string) => {
        const theme = THEME_PRESETS.find((t) => t.id === themeId)
        if (theme) {
          // Update CSS variables
          document.documentElement.style.setProperty('--primary', `oklch(0.7 0.2 ${theme.primary})`)
          document.documentElement.style.setProperty('--secondary', `oklch(0.65 0.25 ${theme.secondary})`)
          document.documentElement.style.setProperty('--accent', `oklch(0.7 0.22 ${theme.accent})`)
          document.documentElement.style.setProperty('--ring', `oklch(0.7 0.2 ${theme.primary})`)
          document.documentElement.style.setProperty('--chart-1', `oklch(0.7 0.2 ${theme.primary})`)
          document.documentElement.style.setProperty('--chart-2', `oklch(0.65 0.25 ${theme.secondary})`)
          document.documentElement.style.setProperty('--chart-3', `oklch(0.7 0.22 ${theme.accent})`)
          document.documentElement.style.setProperty('--sidebar-primary', `oklch(0.7 0.2 ${theme.primary})`)
          document.documentElement.style.setProperty('--sidebar-ring', `oklch(0.7 0.2 ${theme.primary})`)

          set({ currentTheme: themeId })
        }
      },
    }),
    {
      name: 'kuji-theme',
    },
  ),
)
