"use client"

import Link from "next/link"
import {
  Code,
  Palette,
  Target,
  Megaphone,
  PenTool,
  BarChart3,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { motion } from "framer-motion"

const iconMap: Record<string, React.ElementType> = {
  Code,
  Palette,
  Target,
  Megaphone,
  PenTool,
  BarChart3,
  Sparkles,
}

interface Role {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  tool_count: number
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function RolePreview({ roles }: { roles: Role[] }) {
  return (
    <section id="roles" className="bg-card px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Personalized discovery
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
            Tools curated for your role
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            Pick your role and we surface the tools that matter. No scrolling
            through irrelevant results. No guesswork.
          </p>
        </div>

        {/* Roles grid */}
        <TooltipProvider>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {roles
              .filter((r) => r.slug !== "other")
              .map((role) => {
                const Icon = iconMap[role.icon] || Sparkles
                return (
                  <motion.div
                    key={role.id}
                    variants={itemVariants}
                    className="group relative flex items-start gap-4 rounded-xl border border-border bg-background p-5 transition-all hover:border-primary/20 hover:shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif text-base font-bold text-foreground">
                        {role.name}
                      </h3>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        {role.description}
                      </p>
                      {role.tool_count > 0 && (
                        <p className="mt-2 text-xs font-medium text-primary">
                          {role.tool_count} tools curated
                        </p>
                      )}
                    </div>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="absolute right-3 bottom-3 text-muted-foreground/30 transition-colors hover:text-muted-foreground"
                          aria-label={`What does ${role.name} include?`}
                        >
                          <HelpCircle className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="max-w-xs text-sm leading-relaxed"
                      >
                        {role.slug === "developer"
                          ? "Includes tools for code generation, debugging, testing, documentation, and deployment."
                          : role.slug === "designer"
                            ? "Includes tools for visual design, prototyping, asset generation, and design systems."
                            : role.slug === "product-manager"
                              ? "Includes tools for project coordination, roadmapping, user research, and documentation."
                              : role.slug === "marketer"
                                ? "Includes tools for content creation, SEO, analytics, and social media management."
                                : role.slug === "writer"
                                  ? "Includes tools for writing, editing, research, content creation, and SEO."
                                  : "Includes tools for data analysis, visualization, reporting, and research."}
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                )
              })}

            {/* "Other" role card */}
            {roles
              .filter((r) => r.slug === "other")
              .map((role) => (
                <motion.div
                  key={role.id}
                  variants={itemVariants}
                  className="group relative flex items-start gap-4 rounded-xl border border-dashed border-border bg-background p-5 transition-all hover:border-primary/20 sm:col-span-2 lg:col-span-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Sparkles className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-foreground">
                      {"Don't see your role?"}
                    </h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      Tell us what you do and pick your key tasks. We will match
                      you with the right tools based on how you actually work —
                      not a label.
                    </p>
                  </div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="absolute right-3 bottom-3 text-muted-foreground/30 transition-colors hover:text-muted-foreground"
                        aria-label="How does the Other role work?"
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="max-w-xs text-sm leading-relaxed"
                    >
                      Select &quot;Other&quot; during onboarding to type your
                      own role and pick tasks that match your daily work. We
                      route you to relevant tools based on tasks, not titles.
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
          </motion.div>
        </TooltipProvider>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Button size="lg" className="gap-2" asChild>
            <Link href="/auth/sign-up">
              Find My AI Stack
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            Pick your role. See your tools. Takes under 2 minutes.
          </p>
        </div>
      </div>
    </section>
  )
}
