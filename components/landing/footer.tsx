import Link from "next/link"
import { Layers } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <Layers className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-foreground">
                FlowStack
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Signal over noise. AI tools that fit.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </Link>
            <Link
              href="#trending"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Trending
            </Link>
            <Link
              href="#roles"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              By Role
            </Link>
            <Link
              href="/auth/sign-up"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            {new Date().getFullYear()} FlowStack. Built for professionals who
            value their time.
          </p>
        </div>
      </div>
    </footer>
  )
}
