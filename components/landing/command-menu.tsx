"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Sparkles, Code, Palette, Megaphone, LayoutGrid } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-full bg-secondary/50 border-border/50 text-sm font-normal text-muted-foreground shadow-none hover:bg-secondary/80 hover:text-foreground sm:pr-12 md:w-56 lg:w-64 transition-colors"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search tools or roles...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-7 select-none items-center gap-1 rounded-full border border-border bg-background px-2 font-mono text-[11px] font-medium opacity-100 sm:flex text-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a tool name or role..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Roles">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard?role=developer"))}>
              <Code className="mr-2 h-4 w-4 text-blue-500" />
              <span>Developer</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard?role=designer"))}>
              <Palette className="mr-2 h-4 w-4 text-purple-500" />
              <span>Designer</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard?role=marketer"))}>
              <Megaphone className="mr-2 h-4 w-4 text-orange-500" />
              <span>Marketer</span>
            </CommandItem>
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading="Popular Tools">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/tools/chatgpt"))}>
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span>ChatGPT</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/tools/cursor"))}>
              <Code className="mr-2 h-4 w-4 text-foreground" />
              <span>Cursor</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/tools/figma"))}>
              <Palette className="mr-2 h-4 w-4 text-pink-500" />
              <span>Figma</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
              <LayoutGrid className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Browse Full Directory</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}