import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface KujiItem {
  id: string
  name: string
  icon: string
  color: string
  weight: number
}

export interface DailyDraw {
  date: string // ISO date string
  item: KujiItem
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  listId?: string // Track which list was used for this draw
  feeling?: 'great' | 'good' | 'neutral' | 'bad' | 'terrible' // User's feeling about the result
  reflection?: string // User's notes/thoughts about the decision
  timestamp: string // Full timestamp for better sorting
}

export interface KujiList {
  id: string
  name: string
  items: KujiItem[]
  createdAt: string
}

interface KujiStore {
  lists: KujiList[]
  activeListId: string | null
  history: DailyDraw[]

  createList: (name: string) => void
  deleteList: (id: string) => void
  switchList: (id: string) => void
  renameList: (id: string, name: string) => void
  getActiveList: () => KujiList | null

  addItem: (item: KujiItem) => void
  removeItem: (id: string) => void
  updateItem: (id: string, updates: Partial<KujiItem>) => void
  getWeightedRandom: () => KujiItem
  recordDraw: (item: KujiItem) => void
  getWeekHistory: () => (DailyDraw | null)[]

  updateDrawFeeling: (date: string, feeling: DailyDraw['feeling']) => void
  updateDrawReflection: (date: string, reflection: string) => void
  getItemStats: () => { item: KujiItem; count: number; percentage: number }[]
  deleteDraw: (date: string) => void
  clearAllHistory: () => void
  clearHistoryByList: (listId: string) => void
}

const DEFAULT_ITEMS: KujiItem[] = [
  {
    id: '1',
    name: 'Option A',
    icon: 'Star',
    color: 'oklch(0.7 0.2 210)', // cyan - matches primary
    weight: 20,
  },
  {
    id: '2',
    name: 'Option B',
    icon: 'Circle',
    color: 'oklch(0.65 0.25 300)', // purple - matches secondary
    weight: 20,
  },
  {
    id: '3',
    name: 'Option C',
    icon: 'Square',
    color: 'oklch(0.7 0.22 330)', // pink - matches accent
    weight: 20,
  },
  {
    id: '4',
    name: 'Option D',
    icon: 'Triangle',
    color: 'oklch(0.7 0.22 30)', // orange
    weight: 20,
  },
  {
    id: '5',
    name: 'Option E',
    icon: 'Hexagon',
    color: 'oklch(0.75 0.2 130)', // lime green
    weight: 20,
  },
]

const DEFAULT_LIST: KujiList = {
  id: 'default',
  name: 'My First List',
  items: DEFAULT_ITEMS,
  createdAt: new Date().toISOString(),
}

export const useKujiStore = create<KujiStore>()(
  persist(
    (set, get) => ({
      lists: [DEFAULT_LIST],
      activeListId: 'default',
      history: [],

      createList: (name) => {
        const newList: KujiList = {
          id: Date.now().toString(),
          name,
          items: [],
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          lists: [...state.lists, newList],
          activeListId: newList.id,
        }))
      },

      deleteList: (id) => {
        set((state) => {
          const filteredLists = state.lists.filter((list) => list.id !== id)
          // If deleting active list, switch to first available list
          const newActiveId = state.activeListId === id ? filteredLists[0]?.id || null : state.activeListId

          return {
            lists: filteredLists,
            activeListId: newActiveId,
          }
        })
      },

      switchList: (id) => {
        set({ activeListId: id })
      },

      renameList: (id, name) => {
        set((state) => ({
          lists: state.lists.map((list) => (list.id === id ? { ...list, name } : list)),
        }))
      },

      getActiveList: () => {
        const state = get()
        return state.lists.find((list) => list.id === state.activeListId) || null
      },

      addItem: (item) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === state.activeListId ? { ...list, items: [...list.items, item] } : list,
          ),
        })),

      removeItem: (id) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === state.activeListId ? { ...list, items: list.items.filter((item) => item.id !== id) } : list,
          ),
        })),

      updateItem: (id, updates) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === state.activeListId
              ? {
                  ...list,
                  items: list.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
                }
              : list,
          ),
        })),

      getWeightedRandom: () => {
        const activeList = get().getActiveList()
        const items = activeList?.items || []

        if (items.length === 0) {
          throw new Error('No items in active list')
        }

        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
        let random = Math.random() * totalWeight

        for (const item of items) {
          random -= item.weight
          if (random <= 0) {
            return item
          }
        }

        return items[0]
      },

      recordDraw: (item) => {
        const today = new Date()
        const todayStr = today.toISOString().split('T')[0]
        const dayOfWeek = today.getDay()
        const activeListId = get().activeListId

        set((state) => {
          // Remove any existing draw for today
          const filteredHistory = state.history.filter((draw) => draw.date !== todayStr)

          return {
            history: [
              ...filteredHistory,
              {
                date: todayStr,
                item,
                dayOfWeek,
                listId: activeListId || undefined,
                timestamp: today.toISOString(), // Added full timestamp
              },
            ],
          }
        })
      },

      getWeekHistory: () => {
        const history = get().history
        const today = new Date()
        const currentDay = today.getDay() // 0 = Sunday, 6 = Saturday

        // Calculate the start of the current week (Sunday)
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - currentDay)
        weekStart.setHours(0, 0, 0, 0)

        // Create array for 7 days (Sun-Sat)
        const weekHistory: (DailyDraw | null)[] = Array(7).fill(null)

        // Fill in the draws we have for this week
        history.forEach((draw) => {
          const drawDate = new Date(draw.date)
          if (drawDate >= weekStart) {
            weekHistory[draw.dayOfWeek] = draw
          }
        })

        return weekHistory
      },

      updateDrawFeeling: (date, feeling) => {
        set((state) => ({
          history: state.history.map((draw) => (draw.date === date ? { ...draw, feeling } : draw)),
        }))
      },

      updateDrawReflection: (date, reflection) => {
        set((state) => ({
          history: state.history.map((draw) => (draw.date === date ? { ...draw, reflection } : draw)),
        }))
      },

      getItemStats: () => {
        const history = get().history
        const itemCounts = new Map<string, { item: KujiItem; count: number }>()

        history.forEach((draw) => {
          const existing = itemCounts.get(draw.item.id)
          if (existing) {
            existing.count++
          } else {
            itemCounts.set(draw.item.id, { item: draw.item, count: 1 })
          }
        })

        const total = history.length
        return Array.from(itemCounts.values())
          .map(({ item, count }) => ({
            item,
            count,
            percentage: total > 0 ? (count / total) * 100 : 0,
          }))
          .sort((a, b) => b.count - a.count)
      },

      deleteDraw: (date) => {
        set((state) => ({
          history: state.history.filter((draw) => draw.date !== date),
        }))
      },

      clearAllHistory: () => {
        set({ history: [] })
      },

      clearHistoryByList: (listId) => {
        set((state) => ({
          history: state.history.filter((draw) => draw.listId !== listId),
        }))
      },
    }),
    {
      name: 'kuji-storage',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      migrate: (persistedState: any, version: number) => {
        // If old structure with items array exists, convert to lists
        if (persistedState.items && !persistedState.lists) {
          return {
            ...persistedState,
            lists: [
              {
                id: 'default',
                name: 'My First List',
                items: persistedState.items,
                createdAt: new Date().toISOString(),
              },
            ],
            activeListId: 'default',
            items: undefined, // Remove old items property
          }
        }

        if (persistedState.history) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          persistedState.history = persistedState.history.map((draw: any) => ({
            ...draw,
            timestamp: draw.timestamp || `${draw.date}T12:00:00.000Z`,
          }))
        }

        return persistedState
      },
      version: 2, // Incremented version for migration
    },
  ),
)
