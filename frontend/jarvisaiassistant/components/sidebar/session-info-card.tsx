"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, MessageCircle, Sigma, Activity } from "lucide-react"
import type { SessionStats } from "@/hooks/use-jarvis-chat"

interface SessionInfoCardProps {
  stats: SessionStats | null
  sessionStart: string
  turnCount: number
}

function formatDuration(startDate: string): string {
  const start = new Date(startDate)
  const now = new Date()
  const diffMs = now.getTime() - start.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)

  if (diffMins < 1) return "Just started"
  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? "s" : ""}`
  return `${diffHours}h ${diffMins % 60}m`
}

function StatTile({
  icon: Icon,
  label,
  value,
  index,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  index: number
}) {
  const [prevValue, setPrevValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (prevValue !== value) {
      setIsAnimating(true)
      setPrevValue(value)
      const timer = setTimeout(() => setIsAnimating(false), 500)
      return () => clearTimeout(timer)
    }
  }, [value, prevValue])

  return (
    <motion.div
      className="flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <motion.div
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 ring-1 ring-cyan-500/30"
        animate={
          isAnimating
            ? {
                boxShadow: [
                  "0 0 10px rgba(34,211,238,0.3)",
                  "0 0 20px rgba(34,211,238,0.6)",
                  "0 0 10px rgba(34,211,238,0.3)",
                ],
              }
            : {}
        }
        transition={{ duration: 0.5 }}
      >
        <Icon className="h-4 w-4 text-cyan-400" />
      </motion.div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={String(value)}
            className="font-medium text-foreground"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            {value}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export function SessionInfoCard({ stats, sessionStart, turnCount }: SessionInfoCardProps) {
  const [duration, setDuration] = useState(formatDuration(sessionStart))

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(formatDuration(sessionStart))
    }, 60000)
    return () => clearInterval(interval)
  }, [sessionStart])

  const statItems = [
    {
      icon: MessageCircle,
      label: "User turns",
      value: stats?.totalTurns ?? turnCount,
    },
    {
      icon: Clock,
      label: "Session time",
      value: duration,
    },
    {
      icon: Sigma,
      label: "Tokens used",
      value: stats?.totalTokens?.toLocaleString() ?? "—",
    },
  ]

  return (
    <Card className="rounded-2xl border-cyan-500/20 bg-card/80 shadow-lg shadow-cyan-500/5 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-foreground">
          <Activity className="h-4 w-4 text-cyan-400" />
          Session Info
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {statItems.map((item, index) => (
            <StatTile key={item.label} {...item} index={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
