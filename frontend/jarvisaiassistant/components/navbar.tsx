"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sun, Moon, Settings, Bot, AlertCircle, X } from "lucide-react"
import type { HealthStatus } from "@/hooks/use-jarvis-chat"
import { cn } from "@/lib/utils"

interface NavbarProps {
  health: HealthStatus | null
  theme: "light" | "dark"
  onToggleTheme: () => void
}

function StatusDot({ status }: { status: "online" | "offline" }) {
  const isOnline = status === "online"

  return (
    <span className="relative flex h-2.5 w-2.5">
      {isOnline && (
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
          animate={{ scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      )}
      {!isOnline && (
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
          animate={{ opacity: [0.75, 0.4, 0.75] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        />
      )}
      <span
        className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", isOnline ? "bg-emerald-500" : "bg-red-500")}
      />
    </span>
  )
}

function StatusPill({ label, status }: { label: string; status: "online" | "offline" }) {
  const isOnline = status === "online"

  return (
    <Badge
      variant="secondary"
      className={cn(
        "gap-1.5 rounded-full px-3 py-1 border transition-colors",
        isOnline
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          : "border-red-500/30 bg-red-500/10 text-red-400",
      )}
    >
      <StatusDot status={status} />
      <span className="text-xs">
        {label}: {status}
      </span>
      {!isOnline && <AlertCircle className="h-3 w-3" />}
    </Badge>
  )
}

export function Navbar({ health, theme, onToggleTheme }: NavbarProps) {
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const isAnyOffline = health && (health.llm === "offline" || health.vectorDb === "offline")

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <motion.div
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/25"
              animate={{
                boxShadow: [
                  "0 10px 20px rgba(34,211,238,0.25)",
                  "0 10px 30px rgba(34,211,238,0.4)",
                  "0 10px 20px rgba(34,211,238,0.25)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              <Bot className="h-5 w-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">Jarvis</h1>
              <p className="text-xs text-muted-foreground">Enterprise AI Copilot</p>
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex items-center gap-3">
            {/* Status Pills */}
            {health && (
              <div className="hidden items-center gap-2 sm:flex">
                <StatusPill label="LLM" status={health.llm} />
                <StatusPill label="Vector DB" status={health.vectorDb} />
              </div>
            )}

            {/* Mobile status indicator */}
            {health && (
              <div className="flex sm:hidden">
                <StatusPill
                  label="Status"
                  status={health.llm === "online" && health.vectorDb === "online" ? "online" : "offline"}
                />
              </div>
            )}

            {/* Theme Toggle */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleTheme}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                className="rounded-xl border border-cyan-500/20 bg-transparent text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
            </motion.div>

            {/* Settings Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 rounded-xl border-cyan-500/20 bg-transparent text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isAnyOffline && !bannerDismissed && (
          <motion.div
            className="border-b border-red-500/20 bg-red-500/10 px-4 py-2"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 text-sm text-red-400">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>Some backend services are unavailable. Answers may be degraded.</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                onClick={() => setBannerDismissed(true)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
