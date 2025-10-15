'use client'

import { CaseOpener } from '@/components/case-opener'
import { DecisionJournal } from '@/components/decision-journal'
import { KujiManager } from '@/components/kuji-manager'
import { Button } from '@/components/ui/button'
import { WeeklyHistory } from '@/components/weekly-history'
import { useKujiStore } from '@/lib/kuji-store'
import { BookOpen, Calendar, Settings, Sparkles } from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const [showManager, setShowManager] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showJournal, setShowJournal] = useState(false)

  const { getActiveList } = useKujiStore()
  const activeList = getActiveList()

  const activeView = showJournal ? 'journal' : showHistory ? 'history' : showManager ? 'settings' : 'home'

  return (
    <main className="bg-background text-foreground flex min-h-screen flex-col font-sans">
      {/* Animated background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-primary/20 absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full blur-[120px]" />
        <div className="bg-secondary/20 absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full blur-[120px] delay-1000" />
        <div className="bg-accent/10 absolute top-1/2 left-1/2 h-96 w-96 animate-pulse rounded-full blur-[120px] delay-2000" />
      </div>

      <header className="border-border/50 glass sticky top-0 z-[60] border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="from-primary to-secondary neon-glow flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br sm:h-10 sm:w-10">
              <span className="text-sm font-bold text-white sm:text-base">くじ</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight sm:text-xl">Kuji</h1>
              <p className="text-muted-foreground hidden text-xs sm:block">{activeList?.name || 'No list selected'}</p>
            </div>
          </div>
          <div className="hidden gap-2 md:flex">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setShowJournal(!showJournal)
                if (!showJournal) {
                  setShowHistory(false)
                  setShowManager(false)
                }
              }}
              className="border-primary/50 hover:bg-primary/10 hover:border-primary hover:text-primary h-10 w-10 transition-all sm:h-12 sm:w-12"
            >
              <BookOpen className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setShowHistory(!showHistory)
                if (!showHistory) {
                  setShowManager(false)
                  setShowJournal(false)
                }
              }}
              className="border-primary/50 hover:bg-primary/10 hover:border-primary hover:text-primary h-10 w-10 transition-all sm:h-12 sm:w-12"
            >
              <Calendar className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setShowManager(!showManager)
                if (!showManager) {
                  setShowHistory(false)
                  setShowJournal(false)
                }
              }}
              className="border-primary/50 hover:bg-primary/10 hover:border-primary hover:text-primary h-10 w-10 transition-all sm:h-12 sm:w-12"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 flex-col md:pb-0">
        {showJournal ? (
          <DecisionJournal onClose={() => setShowJournal(false)} />
        ) : showHistory ? (
          <WeeklyHistory onClose={() => setShowHistory(false)} />
        ) : showManager ? (
          <KujiManager onClose={() => setShowManager(false)} />
        ) : (
          <CaseOpener />
        )}
      </div>

      <nav className="border-border/50 glass fixed right-0 bottom-0 left-0 z-[60] border-t md:hidden">
        <div className="container mx-auto flex items-center justify-around px-4 py-2">
          <button
            onClick={() => {
              setShowHistory(false)
              setShowManager(false)
              setShowJournal(false)
            }}
            className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-all ${
              activeView === 'home'
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
            }`}
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-medium">Draw</span>
          </button>

          <button
            onClick={() => {
              setShowJournal(true)
              setShowHistory(false)
              setShowManager(false)
            }}
            className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-all ${
              activeView === 'journal'
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
            }`}
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-xs font-medium">Journal</span>
          </button>

          <button
            onClick={() => {
              setShowHistory(true)
              setShowManager(false)
              setShowJournal(false)
            }}
            className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-all ${
              activeView === 'history'
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
            }`}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs font-medium">History</span>
          </button>

          <button
            onClick={() => {
              setShowManager(true)
              setShowHistory(false)
              setShowJournal(false)
            }}
            className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-all ${
              activeView === 'settings'
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </nav>

      <footer className="border-border/50 glass relative z-10 hidden border-t md:block">
        <div className="text-muted-foreground container mx-auto px-4 py-3 text-center text-xs sm:text-sm">
          <p>Let fate decide ✨</p>
        </div>
      </footer>
    </main>
  )
}
