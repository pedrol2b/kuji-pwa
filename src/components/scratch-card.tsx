'use client'

import type React from 'react'

import type { KujiItem } from '@/lib/kuji-store'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import * as Icons from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface ScratchCardProps {
  item: KujiItem | null
  dayLabel: string
  isScratched: boolean
  onScratched: () => void
}

export function ScratchCard({ item, dayLabel, isScratched, onScratched }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [scratchPercentage, setScratchPercentage] = useState(0)
  const [isCanvasReady, setIsCanvasReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || isScratched) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const initCanvas = () => {
      const rect = canvas.getBoundingClientRect()

      if (!rect || rect.width === 0 || rect.height === 0) {
        // Retry after a short delay
        setTimeout(initCanvas, 50)
        return
      }

      // Set canvas size
      canvas.width = rect.width * 2
      canvas.height = rect.height * 2
      ctx.scale(2, 2)

      // Draw metallic scratch-off coating
      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height)
      gradient.addColorStop(0, '#c0c0c0')
      gradient.addColorStop(0.5, '#e8e8e8')
      gradient.addColorStop(1, '#a8a8a8')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, rect.width, rect.height)

      // Add texture
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
      for (let i = 0; i < 50; i++) {
        ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, 2, 2)
      }

      // Add text
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.font = 'bold 14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('SCRATCH', rect.width / 2, rect.height / 2 - 5)
      ctx.fillText('HERE', rect.width / 2, rect.height / 2 + 15)

      setIsCanvasReady(true)
    }

    initCanvas()
  }, [isScratched])

  const scratch = (x: number, y: number) => {
    try {
      const canvas = canvasRef.current
      if (!canvas || isScratched || !isCanvasReady) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const rect = canvas.getBoundingClientRect()
      if (!rect || rect.width === 0 || rect.height === 0 || canvas.width === 0 || canvas.height === 0) {
        return
      }

      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height

      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc((x - rect.left) * scaleX, (y - rect.top) * scaleY, 40, 0, Math.PI * 2)
      ctx.fill()

      // Check scratch percentage
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = imageData.data
      let transparent = 0

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparent++
      }

      const percentage = (transparent / (pixels.length / 4)) * 100
      setScratchPercentage(percentage)

      if (percentage > 50 && !isScratched) {
        onScratched()
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(50)
        }
      }
    } catch (error) {
      console.error('[v0] Scratch error:', error)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    try {
      e.preventDefault()
      setIsDrawing(true)
      scratch(e.clientX, e.clientY)
    } catch (error) {
      console.error('[v0] Mouse down error:', error)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    try {
      if (isDrawing) {
        scratch(e.clientX, e.clientY)
      }
    } catch (error) {
      console.error('[v0] Mouse move error:', error)
    }
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    try {
      e.preventDefault()
      setIsDrawing(true)
      const touch = e.touches[0]
      if (touch) {
        scratch(touch.clientX, touch.clientY)
      }
    } catch (error) {
      console.error('[v0] Touch start error:', error)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    try {
      if (isDrawing) {
        const touch = e.touches[0]
        if (touch) {
          scratch(touch.clientX, touch.clientY)
        }
      }
    } catch (error) {
      console.error('[v0] Touch move error:', error)
    }
  }

  const handleTouchEnd = () => {
    setIsDrawing(false)
  }

  const IconComponent = item ? (Icons[item.icon as keyof typeof Icons] as LucideIcon) : null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="border-border/50 relative aspect-[3/4] w-full overflow-hidden rounded-xl border-2"
      style={{
        boxShadow: item && isScratched ? `0 0 20px ${item.color}40` : 'none',
      }}
    >
      {/* Background - revealed content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
        style={{
          backgroundColor: item ? `${item.color}20` : '#1a1a1a',
        }}
      >
        <div className="text-muted-foreground mb-2 text-xs font-bold">{dayLabel}</div>
        {item ? (
          <>
            {IconComponent && (
              <IconComponent className="mb-3 h-12 w-12" style={{ color: item.color }} strokeWidth={2} />
            )}
            <h3 className="mb-1 text-lg font-bold" style={{ color: item.color }}>
              {item.name}
            </h3>
            <div
              className="rounded-full border px-3 py-1 text-xs"
              style={{
                borderColor: item.color,
                color: item.color,
              }}
            >
              {item.weight}% chance
            </div>
          </>
        ) : (
          <div className="text-muted-foreground">
            <div className="mb-2 text-4xl">—</div>
            <div className="text-sm">No Draw</div>
          </div>
        )}
      </div>

      {/* Scratch-off overlay */}
      {!isScratched && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-pointer touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      )}
    </motion.div>
  )
}
