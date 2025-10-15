'use client'

import { ScratchCard } from '@/components/scratch-card'
import { Button } from '@/components/ui/button'
import { useKujiStore } from '@/lib/kuji-store'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'

interface WeeklyHistoryProps {
  onClose: () => void
}

const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export function WeeklyHistory({ onClose }: WeeklyHistoryProps) {
  const { getWeekHistory } = useKujiStore()
  const weekHistory = getWeekHistory()
  const [scratchedCards, setScratchedCards] = useState<boolean[]>(Array(7).fill(false))

  const handleScratched = (index: number) => {
    setScratchedCards((prev) => {
      const newScratched = [...prev]
      newScratched[index] = true
      return newScratched
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background/30 backdrop-blur-sm"
    >
      <div className="flex h-full flex-col">
        <div className="border-border/50 glass sticky top-0 z-10 border-b">
          <div className="container mx-auto flex items-center justify-between px-4 py-3">
            <div>
              <h2 className="text-xl font-bold">Weekly History</h2>
              <p className="text-muted-foreground text-xs">Scratch to reveal your draws</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={onClose}
              className="border-primary/50 hover:bg-primary/10 hover:border-primary hover:text-primary bg-transparent"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Scratch cards grid */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 md:pb-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
              {weekHistory.map((draw, index) => (
                <ScratchCard
                  key={index}
                  item={draw?.item || null}
                  dayLabel={DAY_LABELS[index]}
                  isScratched={scratchedCards[index]}
                  onScratched={() => handleScratched(index)}
                />
              ))}
            </div>

            {/* Stats */}
            <div className="border-border/50 glass mt-8 rounded-xl border p-4">
              <h3 className="mb-3 text-sm font-bold">This Week</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Total Draws</div>
                  <div className="text-primary text-2xl font-bold">{weekHistory.filter((d) => d !== null).length}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Scratched</div>
                  <div className="text-secondary text-2xl font-bold">{scratchedCards.filter((s) => s).length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
