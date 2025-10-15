'use client'

import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { THEME_PRESETS, useThemeStore } from '@/lib/theme-store'
import { Check } from 'lucide-react'

export function ThemeSelector() {
  const { currentTheme, setTheme } = useThemeStore()

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-1 text-lg font-semibold">Theme</h3>
        <p className="text-muted-foreground text-sm">Choose your preferred color theme</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {THEME_PRESETS.map((theme) => {
          const isSelected = currentTheme === theme.id
          const primaryColor = `oklch(0.7 0.2 ${theme.primary})`
          const secondaryColor = `oklch(0.65 0.25 ${theme.secondary})`
          const accentColor = `oklch(0.7 0.22 ${theme.accent})`

          return (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className={`group relative transition-all ${
                isSelected ? 'ring-primary ring-offset-background ring-2 ring-offset-2' : ''
              }`}
            >
              <Card
                className={`glass border-border/50 hover:border-primary/50 p-4 transition-all ${
                  isSelected ? 'border-primary' : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="cursor-pointer text-sm font-medium">{theme.name}</Label>
                    {isSelected && (
                      <div className="bg-primary flex h-5 w-5 items-center justify-center rounded-full">
                        <Check className="text-primary-foreground h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div
                      className="h-8 flex-1 rounded-md border border-white/20"
                      style={{
                        backgroundColor: primaryColor,
                        boxShadow: `0 0 10px ${primaryColor}40`,
                      }}
                    />
                    <div
                      className="h-8 flex-1 rounded-md border border-white/20"
                      style={{
                        backgroundColor: secondaryColor,
                        boxShadow: `0 0 10px ${secondaryColor}40`,
                      }}
                    />
                    <div
                      className="h-8 flex-1 rounded-md border border-white/20"
                      style={{
                        backgroundColor: accentColor,
                        boxShadow: `0 0 10px ${accentColor}40`,
                      }}
                    />
                  </div>
                </div>
              </Card>
            </button>
          )
        })}
      </div>
    </div>
  )
}
