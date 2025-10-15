'use client'

import type React from 'react'

import type { KujiItem } from '@/lib/kuji-store'
import { cn } from '@/lib/utils'
import * as Icons from 'lucide-react'

interface KujiCardProps {
  item: KujiItem
  size?: 'sm' | 'md' | 'lg' | 'xl'
  highlight?: boolean
}

export function KujiCard({ item, size = 'md', highlight = false }: KujiCardProps) {
  const Icon = Icons[item.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>

  const sizeClasses = {
    sm: 'w-24 h-32 sm:w-28 sm:h-36',
    md: 'w-32 h-40 sm:w-36 sm:h-44',
    lg: 'w-40 h-48 sm:w-44 sm:h-52',
    xl: 'w-48 h-56 sm:w-56 sm:h-64',
  }

  const iconContainerSizes = {
    sm: 'w-10 h-10 p-2',
    md: 'w-12 h-12 p-2.5',
    lg: 'w-16 h-16 p-3',
    xl: 'w-20 h-20 p-4 sm:w-24 sm:h-24 sm:p-5',
  }

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12 sm:w-14 sm:h-14',
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-xl sm:text-2xl',
  }

  return (
    <div
      className={cn(
        'glass flex flex-col items-center justify-center gap-2 rounded-2xl border-2 transition-all sm:gap-3',
        sizeClasses[size],
        highlight ? 'scale-105' : 'border-border/50',
      )}
      style={{
        background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}05 100%)`,
        ...(highlight && {
          borderColor: item.color,
          boxShadow: `0 0 40px ${item.color}80, 0 0 80px ${item.color}40`,
        }),
      }}
    >
      <div
        className={cn('flex items-center justify-center rounded-full transition-all', iconContainerSizes[size])}
        style={{
          background: `${item.color}20`,
          boxShadow: highlight ? `0 0 30px ${item.color}50` : 'none',
          color: item.color,
        }}
      >
        {Icon && <Icon className={iconSizes[size]} />}
      </div>
      <p className={cn('px-2 text-center font-bold text-balance', textSizes[size])}>{item.name}</p>
    </div>
  )
}
