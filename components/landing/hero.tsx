"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

const roles = [
  "Developer",
  "Designer",
  "Product Manager",
  "Marketer",
  "Writer",
  "Data Analyst",
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background px-6 py-20 md:py-32">
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#2563EB 1px, transparent 1px), linear-gradient(to right, #2563EB 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Badge
              variant="secondary"
              className="mb-6 gap-1.5 border border-border px-3 py-1.5 text-sm font-medium"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Signal over noise
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-serif text-4xl font-extrabold leading-tight tracking-tight text-foreground text-balance md:text-6xl md:leading-[1.1]"
          >
            Stop experimenting blindly.{" "}
            <span className="text-primary">Find the AI tools</span> that
            actually fit your workflow.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl"
          >
            Every week, another AI tool promises to change everything. FlowStack
            cuts through the noise with tools curated by role, validated by
            professionals, and organized for how you actually work.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button size="lg" className="gap-2 text-base" asChild>
              <Link href="/auth/sign-up">
                Find My AI Stack
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Free to start. Takes under 2 minutes.
            </p>
          </motion.div>

          {/* Role chips */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12"
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Curated for
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {roles.map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/5"
                >
                  {role}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          >
            {[
              "40+ curated AI tools",
              "Community-validated reviews",
              "Role-specific recommendations",
            ].map((item) => (
              <span
                key={item}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
