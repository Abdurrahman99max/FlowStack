"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/images/logo.png" alt="FlowStack" width={36} height={36} />
          <span className="font-serif text-lg font-bold tracking-tight text-foreground">
            FlowStack
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="#how-it-works" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
            How It Works
          </Link>
          <Link href="#trending" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
            Trending
          </Link>
          <Link href="#roles" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
            By Role
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button size="sm" className="h-8 gap-2 rounded-full px-4 text-[13px]" asChild>
            <Link href="/dashboard">
              <LayoutGrid className="h-3.5 w-3.5" />
              Explore Directory
            </Link>
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-foreground" />
          ) : (
            <Menu className="h-5 w-5 text-foreground" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border/60 bg-background md:hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex flex-col gap-1 px-6 py-4">
            <Link href="#how-it-works" className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary" onClick={() => setMobileOpen(false)}>
              How It Works
            </Link>
            <Link href="#trending" className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary" onClick={() => setMobileOpen(false)}>
              Trending
            </Link>
            <Link href="#roles" className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary" onClick={() => setMobileOpen(false)}>
              By Role
            </Link>
            <div className="mt-3 border-t border-border/60 pt-3">
              <Button size="sm" className="w-full gap-2 rounded-full" asChild>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Explore Directory
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}