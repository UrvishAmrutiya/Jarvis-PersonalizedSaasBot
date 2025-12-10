"use client"

import type React from "react"
import { useState, useRef, useEffect, type KeyboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageBubble } from "./message-bubble"
import { TypingIndicator } from "./typing-indicator"
import { SendHorizonal, RotateCcw, Download, Bot } from "lucide-react"
import type { ChatMessage, HealthStatus } from "@/hooks/use-jarvis-chat"
import { cn } from "@/lib/utils"

interface ChatPanelProps {
  messages: ChatMessage[]
  isLoading: boolean
  onSendMessage: (message: string) => void
  onReset: () => void
  isResetting?: boolean
  health?: HealthStatus | null
}

function OnlineIndicator({ isOnline }: { isOnline: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        <motion.span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75",
            isOnline ? "bg-cyan-400" : "bg-red-400",
          )}
          animate={{ scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
        <span className={cn("relative inline-flex h-3 w-3 rounded-full", isOnline ? "bg-cyan-500" : "bg-red-500")} />
      </span>
      <span className={cn("text-xs font-medium", isOnline ? "text-cyan-400" : "text-red-400")}>
        {isOnline ? "Jarvis online" : "Jarvis offline"}
      </span>
    </div>
  )
}

export function ChatPanel({
  messages,
  isLoading,
  onSendMessage,
  onReset,
  isResetting = false,
  health,
}: ChatPanelProps) {
  const [input, setInput] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim())
      setInput("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const textarea = e.target
    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }

  const handleDownloadTranscript = () => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
    window.open(`${BACKEND_URL}/api/transcript`, "_blank")
  }

  const isOnline = health?.llm === "online"

  return (
    <Card className="flex h-full flex-col rounded-2xl border-cyan-500/20 bg-card/80 shadow-lg shadow-cyan-500/5 backdrop-blur">
      <CardHeader className="border-b border-cyan-500/20 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 ring-1 ring-cyan-500/30"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(34,211,238,0.2)",
                  "0 0 30px rgba(34,211,238,0.4)",
                  "0 0 20px rgba(34,211,238,0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              <Bot className="h-5 w-5 text-cyan-400" />
            </motion.div>
            <div>
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg text-foreground">Ask Jarvis anything</CardTitle>
                <OnlineIndicator isOnline={isOnline} />
              </div>
              <CardDescription className="mt-1 text-sm">
                Context-aware responses powered by your product docs.
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            {/* Reset */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                aria-label="Start new session"
                className="gap-1.5 border-cyan-500/30 bg-transparent text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">New session</span>
              </Button>
            </motion.div>

            {/* Download */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTranscript}
                aria-label="Download transcript"
                className="gap-1.5 border-cyan-500/30 bg-transparent text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex-1 overflow-y-auto px-4 py-4" style={{ maxHeight: "calc(70vh - 200px)" }}>
          <AnimatePresence mode="sync">
            {isResetting ? (
              <motion.div
                key="resetting"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 0.9 }}
                className="flex h-full flex-col items-center justify-center"
              >
                <Bot className="mb-4 h-12 w-12 text-cyan-500/50" />
              </motion.div>
            ) : messages.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex h-full flex-col items-center justify-center text-center text-muted-foreground"
              >
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}>
                  <Bot className="mb-4 h-12 w-12 text-cyan-500/50" />
                </motion.div>
                <p className="text-sm">No messages yet. Ask Jarvis a question to get started!</p>
              </motion.div>
            ) : (
              <div className="space-y-2">
                {messages.map((msg, idx) => (
                  <MessageBubble key={idx} role={msg.role} content={msg.content} index={idx} />
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3 py-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 ring-1 ring-cyan-500/30">
                      <Bot className="h-4 w-4 text-cyan-400" />
                    </div>
                    <TypingIndicator />
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t border-cyan-500/20 bg-card/50 p-4">
          <div className="flex gap-3">
            <motion.div
              className="flex-1"
              animate={
                isFocused ? { boxShadow: "0 0 20px rgba(34,211,238,0.2)" } : { boxShadow: "0 0 0px rgba(34,211,238,0)" }
              }
            >
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Ask Jarvis about features, pricing, how-tos, etc…"
                className={cn(
                  "min-h-[44px] max-h-[120px] resize-none rounded-xl border-cyan-500/30 bg-background/50 backdrop-blur",
                  "placeholder:text-muted-foreground/50 focus:border-cyan-500/50 focus:ring-cyan-500/20",
                  "transition-all duration-200",
                )}
                rows={1}
                disabled={isLoading}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className={cn(
                  "h-11 w-11 shrink-0 rounded-xl",
                  "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white",
                  "hover:from-cyan-400 hover:to-cyan-500",
                  "disabled:from-muted disabled:to-muted disabled:text-muted-foreground",
                  "shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40",
                  "transition-all duration-200",
                )}
                aria-label="Send message"
              >
                <SendHorizonal className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{"↵ Enter to send, Shift+Enter for new line"}</p>
        </div>
      </CardContent>
    </Card>
  )
}