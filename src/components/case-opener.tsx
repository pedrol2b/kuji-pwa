'use client'

import { KujiCard } from '@/components/kuji-card'
import { Button } from '@/components/ui/button'
import { useKujiStore, type KujiItem } from '@/lib/kuji-store'
import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import { RotateCcw, Sparkles } from 'lucide-react'
import { useState } from 'react'

export function CaseOpener() {
  const { getWeightedRandom, recordDraw, getActiveList } = useKujiStore() // Use getActiveList instead of items
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedItem, setSelectedItem] = useState<KujiItem | null>(null)
  const [displayItems, setDisplayItems] = useState<KujiItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const activeList = getActiveList()
  const items = activeList?.items || []

  const generateDisplayItems = (winner: KujiItem) => {
    const itemsToShow: KujiItem[] = []
    const totalItems = 30

    for (let i = 0; i < totalItems; i++) {
      if (i === 22) {
        itemsToShow.push(winner)
      } else {
        const randomItem = items[Math.floor(Math.random() * items.length)]
        itemsToShow.push(randomItem)
      }
    }

    return itemsToShow
  }

  const getThemeColors = () => {
    try {
      // Create a temporary element to get computed colors
      const temp = document.createElement('div')
      temp.style.display = 'none'
      document.body.appendChild(temp)

      // Apply theme colors and get computed RGB values
      temp.style.color = 'hsl(var(--primary))'
      const primary = window.getComputedStyle(temp).color

      temp.style.color = 'hsl(var(--secondary))'
      const secondary = window.getComputedStyle(temp).color

      temp.style.color = 'hsl(var(--accent))'
      const accent = window.getComputedStyle(temp).color

      document.body.removeChild(temp)

      return [primary, secondary, accent]
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Fallback colors if something goes wrong
      return ['#00d9ff', '#a855f7', '#ff6bb5']
    }
  }

  const handleOpenCase = () => {
    if (isSpinning || items.length === 0) return

    setIsSpinning(true)
    setSelectedItem(null)

    const winner = getWeightedRandom()
    const display = generateDisplayItems(winner)
    setDisplayItems(display)
    setCurrentIndex(0)

    let index = 0
    const winnerIndex = 22
    const animate = () => {
      if (index < winnerIndex) {
        setCurrentIndex(index)
        index++
        const delay = Math.min(50 + index * 8, 300)
        setTimeout(animate, delay)
      } else {
        setCurrentIndex(winnerIndex)
        setSelectedItem(winner)
        setIsSpinning(false)

        recordDraw(winner)

        const colors = getThemeColors()

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: colors,
        })

        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([100, 50, 100])
        }
      }
    }

    setTimeout(animate, 100)
  }

  const handleReset = () => {
    setSelectedItem(null)
    setDisplayItems([])
    setCurrentIndex(0)
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 pb-24 md:pb-0">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-balance sm:text-3xl">No items added yet</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Tap the settings icon to add your first item</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-1 flex-col pb-24 md:pb-0">
      <div className="flex flex-1 items-center justify-center overflow-hidden px-4 py-8">
        {!selectedItem ? (
          <div className="relative w-full max-w-sm">
            <div className="relative flex h-[400px] items-center justify-center sm:h-[480px]">
              {displayItems.length > 0 ? (
                <>
                  {/* Show 3 cards: previous, current, next */}
                  {[currentIndex - 1, currentIndex, currentIndex + 1].map((index, offset) => {
                    if (index < 0 || index >= displayItems.length) return null
                    const item = displayItems[index]
                    const isCurrent = offset === 1

                    return (
                      <motion.div
                        key={`${item.id}-${index}`}
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{
                          opacity: isCurrent ? 1 : 0.3,
                          y: (offset - 1) * 120,
                          scale: isCurrent ? 1 : 0.85,
                          zIndex: isCurrent ? 10 : offset,
                        }}
                        transition={{ duration: 0.3 }}
                        className="absolute"
                      >
                        <KujiCard item={item} size="lg" />
                      </motion.div>
                    )
                  })}
                </>
              ) : (
                items.slice(0, 3).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{
                      opacity: index === 1 ? 1 : 0.3,
                      y: (index - 1) * 120,
                      scale: index === 1 ? 1 : 0.85,
                      zIndex: index === 1 ? 10 : index,
                    }}
                    className="absolute"
                  >
                    <KujiCard item={item} size="lg" />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-6 px-4"
            >
              <div className="space-y-2 text-center">
                <h2 className="from-primary via-secondary to-accent bg-gradient-to-r bg-clip-text text-3xl font-bold text-balance text-transparent sm:text-4xl">
                  Your Draw
                </h2>
                <p className="text-muted-foreground text-lg sm:text-xl">You got {selectedItem.name}!</p>
              </div>

              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <KujiCard item={selectedItem} size="xl" highlight />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="glass border-border/50 sticky bottom-0 border-t p-4">
        <div className="container mx-auto max-w-sm">
          {!selectedItem ? (
            <Button
              size="lg"
              onClick={handleOpenCase}
              disabled={isSpinning}
              className="from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 neon-glow h-14 w-full bg-gradient-to-r py-6 text-lg font-bold text-white transition-all hover:text-white disabled:opacity-50 sm:h-16"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {isSpinning ? 'Drawing...' : 'Draw'}
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleReset}
              variant="outline"
              className="h-14 w-full bg-transparent py-6 text-lg font-bold transition-all sm:h-16"
              style={{
                borderColor: isHovering ? selectedItem.color : `${selectedItem.color}80`,
                color: selectedItem.color,
                backgroundColor: isHovering ? `${selectedItem.color}20` : 'transparent',
                boxShadow: isHovering ? `0 0 30px ${selectedItem.color}60` : `0 0 20px ${selectedItem.color}40`,
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onTouchStart={() => setIsHovering(true)}
              onTouchEnd={() => setIsHovering(false)}
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Draw Again
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
