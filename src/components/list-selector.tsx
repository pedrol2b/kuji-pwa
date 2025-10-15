'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useKujiStore } from '@/lib/kuji-store'
import { Check, ChevronDown, Edit2, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'

export function ListSelector() {
  const { lists, activeListId, switchList, createList, deleteList, renameList, getActiveList } = useKujiStore()
  const [isOpen, setIsOpen] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [editingListId, setEditingListId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const activeList = getActiveList()

  const handleCreateList = () => {
    if (newListName.trim()) {
      createList(newListName.trim())
      setNewListName('')
    }
  }

  const handleRename = (id: string) => {
    if (editingName.trim()) {
      renameList(id, editingName.trim())
      setEditingListId(null)
      setEditingName('')
    }
  }

  const handleDelete = (id: string) => {
    if (lists.length > 1) {
      deleteList(id)
    }
  }

  const startEditing = (id: string, currentName: string) => {
    setEditingListId(id)
    setEditingName(currentName)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-primary/50 hover:bg-primary/10 hover:border-primary h-14 w-full justify-between bg-transparent"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="from-primary to-secondary neon-glow flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br">
              <span className="text-sm font-bold text-white">{activeList?.items.length || 0}</span>
            </div>
            <div className="min-w-0 flex-1 text-left">
              <div className="truncate font-semibold">{activeList?.name || 'No List'}</div>
              <div className="text-muted-foreground text-xs">
                {activeList?.items.length || 0} item{activeList?.items.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          <ChevronDown className="ml-2 h-5 w-5 flex-shrink-0" />
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[80vh] max-w-md flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Switch List</DialogTitle>
          <DialogDescription>Choose a list or create a new one</DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-3 overflow-y-auto px-6 pb-6">
          {/* Existing Lists */}
          {lists.map((list) => (
            <Card
              key={list.id}
              className={`cursor-pointer p-4 transition-all ${
                list.id === activeListId
                  ? 'border-primary bg-primary/10 ring-primary/50 ring-2'
                  : 'border-border/50 hover:border-primary/50 hover:bg-primary/5'
              }`}
            >
              {editingListId === list.id ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename(list.id)
                      if (e.key === 'Escape') {
                        setEditingListId(null)
                        setEditingName('')
                      }
                    }}
                    className="h-9 flex-1"
                    autoFocus
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRename(list.id)}
                    className="text-primary hover:text-primary hover:bg-primary/10 h-9 w-9"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditingListId(null)
                      setEditingName('')
                    }}
                    className="h-9 w-9"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => {
                    switchList(list.id)
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{list.name}</div>
                    <div className="text-muted-foreground text-sm">
                      {list.items.length} item{list.items.length !== 1 ? 's' : ''}
                    </div>

                    {/* Preview of first 3 items */}
                    {list.items.length > 0 && (
                      <div className="mt-2 flex gap-1">
                        {list.items.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-xs"
                            style={{
                              backgroundColor: `${item.color}20`,
                              color: item.color,
                              border: `1px solid ${item.color}40`,
                            }}
                          >
                            {item.name.charAt(0)}
                          </div>
                        ))}
                        {list.items.length > 3 && (
                          <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-md text-xs">
                            +{list.items.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        startEditing(list.id, list.name)
                      }}
                      className="hover:bg-primary/10 hover:text-primary h-9 w-9"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {lists.length > 1 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(list.id)
                        }}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-9"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}

          {/* Create New List */}
          <Card className="border-primary/50 border-2 border-dashed p-4">
            <div className="flex items-center gap-2">
              <Input
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateList()
                }}
                placeholder="New list name..."
                className="h-10 flex-1"
              />
              <Button onClick={handleCreateList} disabled={!newListName.trim()} className="h-10">
                <Plus className="mr-2 h-4 w-4" />
                Create
              </Button>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
