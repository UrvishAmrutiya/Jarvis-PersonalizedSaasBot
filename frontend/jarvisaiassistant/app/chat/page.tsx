"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { ChatPanel } from "@/components/chat/chat-panel"
import { ContextPanel } from "@/components/sidebar/context-panel"
import { SessionInfoCard } from "@/components/sidebar/session-info-card"
import { TipsCard } from "@/components/sidebar/tips-card"
import { useJarvisChat } from "@/hooks/use-jarvis-chat"
import { cn } from "@/lib/utils"

function AnimatedGridBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Dark gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0d1025] to-[#0a0a1a]" />

      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Scanning line effect */}
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
        animate={{
          y: [0, typeof window !== "undefined" ? window.innerHeight : 1000],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-purple-500/10 blur-[100px]" />
    </div>
  )
}

export default function ChatPage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark") // Default to dark for futuristic theme
  const [activeTab, setActiveTab] = useState<"chat" | "context">("chat")
  const [isResetting, setIsResetting] = useState(false)

  const {
    messages,
    isLoading,
    sources,
    stats,
    health,
    sendMessage,
    resetSession,
    downloadTranscript,
    sessionStart,
    turnCount,
  } = useJarvisChat()

  useEffect(() => {
    document.documentElement.classList.add("dark") // Force dark mode for chat
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
    document.documentElement.classList.toggle("dark", theme === "light")
  }

  const handleReset = useCallback(async () => {
    setIsResetting(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    resetSession()
    setIsResetting(false)
  }, [resetSession])

  const handleSelectTip = useCallback(
    (tip: string) => {
      sendMessage(tip)
    },
    [sendMessage],
  )

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedGridBackground />

      <Navbar health={health} theme={theme} onToggleTheme={toggleTheme} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 lg:hidden">
          <div className="flex rounded-xl bg-card/80 backdrop-blur p-1 border border-cyan-500/20">
            {(["chat", "context"] as const).map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  activeTab === tab ? "bg-cyan-500/20 text-cyan-400" : "text-muted-foreground hover:text-foreground",
                )}
                whileTap={{ scale: 0.98 }}
              >
                {tab === "chat" ? "Chat" : "Context"}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chat Panel - Takes 2/3 on desktop */}
          <AnimatePresence mode="wait">
            {(activeTab === "chat" || (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
              <motion.div
                key="chat"
                className="lg:col-span-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-[calc(100vh-180px)] lg:h-[calc(100vh-140px)]">
                  <ChatPanel
                    messages={messages}
                    isLoading={isLoading}
                    onSendMessage={sendMessage}
                    onReset={handleReset}
                    onDownload={downloadTranscript}
                    isResetting={isResetting}
                    health={health}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Side Panel - Takes 1/3 on desktop */}
          <AnimatePresence mode="wait">
            {(activeTab === "context" || (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
              <motion.div
                key="context"
                className="space-y-6 lg:col-span-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <ContextPanel sources={sources} />
                <SessionInfoCard stats={stats} sessionStart={sessionStart} turnCount={turnCount} />
                <TipsCard onSelectTip={handleSelectTip} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
