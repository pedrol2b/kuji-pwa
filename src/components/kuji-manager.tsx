'use client'

import type React from 'react'

import { KujiCard } from '@/components/kuji-card'
import { ListSelector } from '@/components/list-selector'
import { ThemeSelector } from '@/components/theme-selector'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { useKujiStore } from '@/lib/kuji-store'
import { AnimatePresence, motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { ChevronDown, ChevronUp, Plus, Search, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'

interface KujiManagerProps {
  onClose: () => void
}

const COMMON_ICONS = [
  'Star',
  'Circle',
  'Square',
  'Ticket',
  'Trophy',
  'Target',
  'Heart',
  'Sparkles',
  'Gift',
  'Zap',
  'Flame',
  'Crown',
  'Diamond',
  'Clover',
  'Music',
  'Coffee',
  'Book',
  'Gamepad',
  'Camera',
  'Smile',
  'Sun',
  'Moon',
  'Cloud',
  'Leaf',
]

const ALL_ICONS = Array.from(
  new Set(
    Object.keys(Icons).filter(
      (key) =>
        key !== 'createLucideIcon' &&
        key !== 'default' &&
        key !== 'icons' &&
        typeof Icons[key as keyof typeof Icons] === 'object',
    ),
  ),
)

export function KujiManager({ onClose }: KujiManagerProps) {
  const { addItem, removeItem, updateItem, getActiveList } = useKujiStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [iconSearch, setIconSearch] = useState('')
  const [newItem, setNewItem] = useState({
    name: '',
    icon: 'Star',
    color: '#00d9ff',
    weight: 20,
  })

  const normalizeHexForPicker = (hex: string): string => {
    // Remove # if present
    const cleanHex = hex.replace('#', '').toUpperCase()

    // If it's already 6 characters, return it
    if (cleanHex.length === 6 && /^[A-F0-9]{6}$/.test(cleanHex)) {
      return `#${cleanHex}`
    }

    // If it's 3 characters, expand it (e.g., F5A -> FF55AA)
    if (cleanHex.length === 3 && /^[A-F0-9]{3}$/.test(cleanHex)) {
      return `#${cleanHex[0]}${cleanHex[0]}${cleanHex[1]}${cleanHex[1]}${cleanHex[2]}${cleanHex[2]}`
    }

    // If it's between 1-5 characters, pad with the last character or 0
    if (cleanHex.length > 0 && cleanHex.length < 6 && /^[A-F0-9]+$/.test(cleanHex)) {
      const padChar = cleanHex[cleanHex.length - 1] || '0'
      return `#${cleanHex.padEnd(6, padChar)}`
    }

    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim()
    return primaryColor || '#00d9ff'
  }

  const handleColorChange = (value: string) => {
    // Ensure the value starts with #
    let hexValue = value.trim()
    if (!hexValue.startsWith('#')) {
      hexValue = '#' + hexValue
    }

    // Validate hex format (3 or 6 hex digits after #)
    // const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

    // Always update the state to allow typing
    setNewItem({ ...newItem, color: hexValue })
  }

  const filteredIcons = useMemo(() => {
    if (!iconSearch.trim()) {
      return Array.from(new Set(COMMON_ICONS))
    }
    const searchLower = iconSearch.toLowerCase()
    return Array.from(new Set(ALL_ICONS.filter((icon) => icon.toLowerCase().includes(searchLower)))).slice(0, 100)
  }, [iconSearch])

  const handleAddItem = () => {
    if (!newItem.name.trim()) return

    addItem({
      id: Date.now().toString(),
      name: newItem.name,
      icon: newItem.icon,
      color: newItem.color,
      weight: newItem.weight,
    })

    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim()
    setNewItem({
      name: '',
      icon: 'Star',
      color: primaryColor || '#00d9ff',
      weight: 20,
    })
    setShowAddForm(false)
    setIconSearch('')
  }

  const activeList = getActiveList()
  const items = activeList?.items || []

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)

  return (
    <div className="flex h-full flex-col">
      <div className="glass border-border/50 sticky top-0 z-10 border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div>
            <h2 className="text-xl font-bold">Manage Items</h2>
            <p className="text-muted-foreground text-xs">Adjust probabilities</p>
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

      <div className="flex-1 space-y-4 overflow-y-auto px-4 pt-6 pb-24 md:pb-4">
        <ListSelector />
        <ThemeSelector />

        <div className="border-border/50 border-t pt-4" />

        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="glass border-border/50 overflow-hidden">
              <button
                onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <div className="flex-shrink-0">
                  <KujiCard item={item} size="sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{item.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {totalWeight > 0 ? `${Math.round((item.weight / totalWeight) * 100)}% chance` : '0% chance'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeItem(item.id)
                    }}
                    className="text-foreground hover:bg-destructive h-10 w-10 transition-colors hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {expandedItem === item.id ? (
                    <ChevronUp className="text-muted-foreground h-5 w-5" />
                  ) : (
                    <ChevronDown className="text-muted-foreground h-5 w-5" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {expandedItem === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-border/50 space-y-3 border-t px-4 pt-4 pb-4">
                      <Label className="text-sm">Probability Weight</Label>
                      <Slider
                        value={[item.weight]}
                        onValueChange={([value]) => updateItem(item.id, { weight: value })}
                        min={1}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-muted-foreground text-right text-xs">Weight: {item.weight}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>

        {showAddForm ? (
          <Card className="glass border-primary/50 p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Add New Item</h3>

              <div className="space-y-2">
                <Label className="text-sm">Item Name</Label>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g., Option A"
                  className="bg-background/50 h-12"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Icon</Label>
                <div className="relative">
                  <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    placeholder="Search icons..."
                    className="bg-background/50 h-12 pl-10"
                  />
                </div>
                <div className="border-border/50 bg-background/30 max-h-[200px] overflow-y-auto rounded-lg border p-2">
                  <div className="grid grid-cols-6 gap-2">
                    {filteredIcons.map((iconName) => {
                      const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<{
                        className?: string
                      }>
                      const isSelected = newItem.icon === iconName
                      return (
                        <button
                          key={iconName}
                          onClick={() => {
                            setNewItem({ ...newItem, icon: iconName })
                          }}
                          className={`hover:bg-primary/20 hover:border-primary/50 flex aspect-square items-center justify-center rounded-md border p-3 transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/20 ring-primary/50 ring-2'
                              : 'border-border/30 hover:border-primary/50'
                          }`}
                          title={iconName}
                        >
                          {IconComponent && <IconComponent className="h-6 w-6" />}
                        </button>
                      )
                    })}
                  </div>
                  {filteredIcons.length === 0 && (
                    <p className="text-muted-foreground py-8 text-center text-sm">
                      No icons found for &quot;{iconSearch}&quot;
                    </p>
                  )}
                  {!iconSearch && (
                    <p className="text-muted-foreground border-border/30 mt-3 border-t pt-3 text-center text-xs">
                      Showing common icons. Search to find more.
                    </p>
                  )}
                  {iconSearch && filteredIcons.length > 0 && (
                    <p className="text-muted-foreground border-border/30 mt-3 border-t pt-3 text-center text-xs">
                      Found {filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Color</Label>
                <div className="flex items-center gap-3">
                  <div
                    className="h-16 w-16 flex-shrink-0 rounded-xl border-2 border-white transition-all"
                    style={{
                      backgroundColor: newItem.color,
                      boxShadow: `0 0 20px ${newItem.color}60`,
                    }}
                  />
                  <div className="flex-1">
                    <input
                      type="color"
                      value={normalizeHexForPicker(newItem.color)}
                      onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
                      className="bg-background/50 border-border/50 h-12 w-full cursor-pointer rounded-lg border"
                    />
                    <Input
                      value={newItem.color}
                      onChange={(e) => handleColorChange(e.target.value)}
                      placeholder={
                        getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() ||
                        '#00d9ff'
                      }
                      className="bg-background/50 mt-2 h-10 font-mono text-sm uppercase"
                      maxLength={7}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Probability Weight: {newItem.weight}</Label>
                <Slider
                  value={[newItem.weight]}
                  onValueChange={([value]) => setNewItem({ ...newItem, weight: value })}
                  min={1}
                  max={100}
                  step={1}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleAddItem} className="h-12 flex-1">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setIconSearch('')
                  }}
                  className="h-12"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Button
            onClick={() => setShowAddForm(true)}
            variant="outline"
            className="border-primary/50 hover:bg-primary/10 hover:border-primary hover:text-primary h-14 w-full border-2 border-dashed"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Item
          </Button>
        )}
      </div>
    </div>
  )
}
