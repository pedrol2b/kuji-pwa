'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useKujiStore, type DailyDraw } from '@/lib/kuji-store'
import { endOfWeek, format, isWithinInterval, parseISO, startOfWeek } from 'date-fns'
import { motion } from 'framer-motion'
import { AlertTriangle, Calendar, Sparkles, Trash2, TrendingUp, X } from 'lucide-react'
import { useMemo, useState } from 'react'

interface DecisionJournalProps {
  onClose: () => void
}

const FEELING_ICONS = {
  great: { icon: '😄', label: 'Great', color: 'text-green-500' },
  good: { icon: '🙂', label: 'Good', color: 'text-blue-500' },
  neutral: { icon: '😐', label: 'Neutral', color: 'text-yellow-500' },
  bad: { icon: '😕', label: 'Bad', color: 'text-orange-500' },
  terrible: { icon: '😢', label: 'Terrible', color: 'text-red-500' },
}

export function DecisionJournal({ onClose }: DecisionJournalProps) {
  const {
    history,
    updateDrawFeeling,
    updateDrawReflection,
    getItemStats,
    lists,
    deleteDraw,
    clearAllHistory,
    clearHistoryByList,
  } = useKujiStore()
  const [editingDate, setEditingDate] = useState<string | null>(null)
  const [reflectionText, setReflectionText] = useState('')
  const [filterList, setFilterList] = useState<string | 'all'>('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'single' | 'all' | 'list'; value?: string } | null>(null)

  const sortedHistory = useMemo(() => {
    return [...history]
      .filter((draw) => (filterList === 'all' ? true : draw.listId === filterList))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [history, filterList])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const itemStats = useMemo(() => getItemStats(), [history])

  const thisWeekStats = useMemo(() => {
    const now = new Date()
    const weekStart = startOfWeek(now)
    const weekEnd = endOfWeek(now)

    const thisWeekDraws = history.filter((draw) => {
      const drawDate = parseISO(draw.date)
      return isWithinInterval(drawDate, { start: weekStart, end: weekEnd })
    })

    const withFeelings = thisWeekDraws.filter((d) => d.feeling).length
    const positiveCount = thisWeekDraws.filter((d) => d.feeling === 'great' || d.feeling === 'good').length
    const negativeCount = thisWeekDraws.filter((d) => d.feeling === 'bad' || d.feeling === 'terrible').length

    return {
      total: thisWeekDraws.length,
      withFeelings,
      positive: positiveCount,
      negative: negativeCount,
      neutral: thisWeekDraws.length - positiveCount - negativeCount,
    }
  }, [history])

  const handleFeelingClick = (date: string, feeling: DailyDraw['feeling']) => {
    updateDrawFeeling(date, feeling)
  }

  const handleSaveReflection = (date: string) => {
    updateDrawReflection(date, reflectionText)
    setEditingDate(null)
    setReflectionText('')
  }

  const handleEditReflection = (draw: DailyDraw) => {
    setEditingDate(draw.date)
    setReflectionText(draw.reflection || '')
  }

  const getListName = (listId?: string) => {
    if (!listId) return 'Unknown List'
    const list = lists.find((l) => l.id === listId)
    return list?.name || 'Unknown List'
  }

  const handleDeleteClick = (type: 'single' | 'all' | 'list', value?: string) => {
    setDeleteTarget({ type, value })
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return

    switch (deleteTarget.type) {
      case 'single':
        if (deleteTarget.value) {
          deleteDraw(deleteTarget.value)
        }
        break
      case 'all':
        clearAllHistory()
        break
      case 'list':
        if (deleteTarget.value) {
          clearHistoryByList(deleteTarget.value)
        }
        break
    }

    setDeleteDialogOpen(false)
    setDeleteTarget(null)
  }

  const getDeleteDialogContent = () => {
    if (!deleteTarget) return { title: '', description: '' }

    switch (deleteTarget.type) {
      case 'single':
        return {
          title: 'Delete this entry?',
          description: 'This will permanently remove this decision from your journal. This action cannot be undone.',
        }
      case 'all':
        return {
          title: 'Clear all history?',
          description: `This will permanently delete all ${history.length} entries from your journal. This action cannot be undone.`,
        }
      case 'list':
        const listName = getListName(deleteTarget.value)
        const count = history.filter((d) => d.listId === deleteTarget.value).length
        return {
          title: `Clear history for "${listName}"?`,
          description: `This will permanently delete ${count} entries from this list. This action cannot be undone.`,
        }
      default:
        return { title: '', description: '' }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background/30 backdrop-blur-sm"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-border/50 glass sticky top-0 z-10 border-b">
          <div className="container mx-auto flex items-center justify-between px-4 py-3">
            <div>
              <h2 className="text-xl font-bold">Decision Journal</h2>
              <p className="text-muted-foreground text-xs">Reflect on your draws and track patterns</p>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 md:pb-4">
          <div className="container mx-auto max-w-4xl space-y-6">
            {/* Weekly Reflection Card */}
            <Card className="border-primary/20 from-primary/5 to-secondary/5 bg-gradient-to-br p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full">
                  <Sparkles className="text-primary h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-bold">Did fate serve you well this week?</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Total Draws</div>
                      <div className="text-primary text-2xl font-bold">{thisWeekStats.total}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Positive</div>
                      <div className="text-2xl font-bold text-green-500">{thisWeekStats.positive}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Neutral</div>
                      <div className="text-2xl font-bold text-yellow-500">{thisWeekStats.neutral}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Negative</div>
                      <div className="text-2xl font-bold text-red-500">{thisWeekStats.negative}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Item Statistics */}
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="text-primary h-5 w-5" />
                <h3 className="text-lg font-bold">Most Drawn Items</h3>
              </div>
              <div className="space-y-3">
                {itemStats.slice(0, 5).map((stat, index) => (
                  <div key={stat.item.id} className="flex items-center gap-3">
                    <div className="text-muted-foreground w-6 font-mono text-sm">#{index + 1}</div>
                    <div className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: stat.item.color }} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{stat.item.name}</div>
                      <div className="bg-muted mt-1 h-2 w-full rounded-full">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${stat.percentage}%`,
                            backgroundColor: stat.item.color,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-sm font-bold" style={{ color: stat.item.color }}>
                      {stat.count}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Filter by List */}
            {lists.length > 1 && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterList === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterList('all')}
                >
                  All Lists
                </Button>
                {lists.map((list) => (
                  <Button
                    key={list.id}
                    variant={filterList === list.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterList(list.id)}
                  >
                    {list.name}
                  </Button>
                ))}
              </div>
            )}

            {/* Timeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="text-primary h-5 w-5" />
                  <h3 className="text-lg font-bold">Timeline</h3>
                </div>
                {sortedHistory.length > 0 && (
                  <div className="flex gap-2">
                    {filterList !== 'all' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick('list', filterList)}
                        className="border-destructive/50 text-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear List
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick('all')}
                      className="border-destructive/50 text-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear All
                    </Button>
                  </div>
                )}
              </div>

              {sortedHistory.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No draws yet. Start drawing to build your journal!</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {sortedHistory.map((draw) => (
                    <Card key={draw.date} className="hover:border-primary/30 p-4 transition-colors">
                      <div className="flex items-start gap-4">
                        {/* Date */}
                        <div className="flex-shrink-0 text-center">
                          <div className="text-muted-foreground text-xs">{format(parseISO(draw.date), 'MMM')}</div>
                          <div className="text-2xl font-bold">{format(parseISO(draw.date), 'dd')}</div>
                          <div className="text-muted-foreground text-xs">{format(parseISO(draw.date), 'EEE')}</div>
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <div
                              className="h-3 w-3 flex-shrink-0 rounded-full"
                              style={{ backgroundColor: draw.item.color }}
                            />
                            <span className="truncate font-bold">{draw.item.name}</span>
                            <span className="text-muted-foreground text-xs">•</span>
                            <span className="text-muted-foreground truncate text-xs">{getListName(draw.listId)}</span>
                          </div>

                          {/* Feeling selector */}
                          <div className="mb-2 flex gap-2">
                            {Object.entries(FEELING_ICONS).map(([key, { icon, label }]) => (
                              <button
                                key={key}
                                onClick={() => handleFeelingClick(draw.date, key as DailyDraw['feeling'])}
                                className={`text-2xl transition-all hover:scale-110 ${
                                  draw.feeling === key ? 'scale-125' : 'opacity-40 hover:opacity-70'
                                }`}
                                title={label}
                              >
                                {icon}
                              </button>
                            ))}
                          </div>

                          {/* Reflection */}
                          {editingDate === draw.date ? (
                            <div className="space-y-2">
                              <Textarea
                                value={reflectionText}
                                onChange={(e) => setReflectionText(e.target.value)}
                                placeholder="How did this decision work out? Any thoughts?"
                                className="min-h-[80px] text-sm"
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleSaveReflection(draw.date)}>
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingDate(null)
                                    setReflectionText('')
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : draw.reflection ? (
                            <div
                              className="text-muted-foreground bg-muted/50 hover:bg-muted/70 cursor-pointer rounded-lg p-3 text-sm transition-colors"
                              onClick={() => handleEditReflection(draw)}
                            >
                              {draw.reflection}
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditReflection(draw)}
                              className="text-muted-foreground hover:text-foreground text-xs"
                            >
                              Add reflection...
                            </Button>
                          )}
                        </div>

                        {/* Delete button for individual entries */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick('single', draw.date)}
                          className="text-foreground/70 hover:text-destructive-foreground hover:bg-destructive flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confirmation dialog for delete operations */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="text-destructive h-5 w-5" />
                {getDeleteDialogContent().title}
              </AlertDialogTitle>
              <AlertDialogDescription>{getDeleteDialogContent().description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  )
}
