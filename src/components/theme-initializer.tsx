'use client'

import { THEME_PRESETS, useThemeStore } from '@/lib/theme-store'
import { useEffect } from 'react'

export function ThemeInitializer() {
  const { currentTheme } = useThemeStore()

  useEffect(() => {
    // Initialize theme on mount
    const theme = THEME_PRESETS.find((t) => t.id === currentTheme)
    if (theme) {
      document.documentElement.style.setProperty('--primary', `oklch(0.7 0.2 ${theme.primary})`)
      document.documentElement.style.setProperty('--secondary', `oklch(0.65 0.25 ${theme.secondary})`)
      document.documentElement.style.setProperty('--accent', `oklch(0.7 0.22 ${theme.accent})`)
      document.documentElement.style.setProperty('--ring', `oklch(0.7 0.2 ${theme.primary})`)
      document.documentElement.style.setProperty('--chart-1', `oklch(0.7 0.2 ${theme.primary})`)
      document.documentElement.style.setProperty('--chart-2', `oklch(0.65 0.25 ${theme.secondary})`)
      document.documentElement.style.setProperty('--chart-3', `oklch(0.7 0.22 ${theme.accent})`)
      document.documentElement.style.setProperty('--sidebar-primary', `oklch(0.7 0.2 ${theme.primary})`)
      document.documentElement.style.setProperty('--sidebar-ring', `oklch(0.7 0.2 ${theme.primary})`)
    }
  }, [currentTheme])

  return null
}
