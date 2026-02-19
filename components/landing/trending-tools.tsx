"use client"

import Link from "next/link"
import {
  ArrowRight,
  TrendingUp,
  Star,
  BadgeCheck,
  ExternalLink,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { motion } from "framer-motion"

interface TrendingTool {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  website_url: string
  pricing_model: string
  is_verified: boolean
  trending_reason: string
  average_rating: number
  review_count: number
  category_name: string
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

function PricingBadge({ model }: { model: string }) {
  const labels: Record<string, string> = {
    free: "Free",
    freemium: "Freemium",
    paid: "Paid",
    enterprise: "Enterprise",
    "open-source": "Open Source",
  }
  return (
    <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
      {labels[model] || model}
    </span>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span className="text-sm font-semibold text-foreground">
        {Number(rating).toFixed(1)}
      </span>
    </span>
  )
}

export function TrendingTools({ tools }: { tools: TrendingTool[] }) {
  if (!tools || tools.length === 0) return null

  return (
    <section id="trending" className="bg-background px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto mb-14 flex max-w-2xl flex-col items-center text-center">
          <Badge
            variant="secondary"
            className="mb-4 gap-1.5 border border-border px-3 py-1.5 text-sm font-medium"
          >
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Updated weekly
          </Badge>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
            Trending AI stacks this week
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            The tools gaining real momentum among professionals right now — not
            hype, not ads, just signal.
          </p>
        </div>

        {/* Tools grid */}
        <TooltipProvider>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {tools.map((tool) => (
              <motion.div
                key={tool.id}
                variants={itemVariants}
                className="group relative flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-md"
              >
                {/* Header row */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-serif text-lg font-bold text-primary">
                      {tool.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-serif text-base font-bold text-foreground">
                          {tool.name}
                        </h3>
                        {tool.is_verified && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <BadgeCheck className="h-4 w-4 text-accent" />
                            </TooltipTrigger>
                            <TooltipContent>
                              FlowStack Verified — consistently rated highly by
                              professionals
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {tool.category_name}
                      </p>
                    </div>
                  </div>
                  <PricingBadge model={tool.pricing_model} />
                </div>

                {/* Tagline */}
                <p className="mb-3 text-sm font-medium text-foreground">
                  {tool.tagline}
                </p>

                {/* Trending reason */}
                <div className="mb-4 flex-1 rounded-lg bg-primary/5 px-3 py-2">
                  <p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
                    <TrendingUp className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                    {tool.trending_reason}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <StarRating rating={tool.average_rating} />
                    <span className="text-xs text-muted-foreground">
                      {tool.review_count} reviews
                    </span>
                  </div>
                  <a
                    href={tool.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground opacity-0 transition-all group-hover:opacity-100"
                    aria-label={`Visit ${tool.name} website`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                {/* Help tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="absolute right-3 bottom-3 text-muted-foreground/30 transition-colors hover:text-muted-foreground"
                      aria-label="What makes this tool trending?"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-xs text-sm leading-relaxed"
                  >
                    Trending tools are curated by the FlowStack team based on
                    community activity — bookmark velocity, new reviews, and
                    rating momentum over the past 7 days.
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            ))}
          </motion.div>
        </TooltipProvider>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Button variant="outline" size="lg" className="gap-2" asChild>
            <Link href="/auth/sign-up">
              Explore all tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
