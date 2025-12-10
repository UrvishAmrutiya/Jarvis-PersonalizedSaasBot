"use client"

import { useState, useCallback, useEffect, useRef } from "react"

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface SourceSnippet {
  id: string
  snippet: string
}

export interface SessionStats {
  totalTokens?: number
  totalTurns?: number
  sessionStartedAt?: string
}

export interface HealthStatus {
  llm: "online" | "offline"
  vectorDb: "online" | "offline"
}

export function useJarvisChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sources, setSources] = useState<SourceSnippet[]>([])
  const [stats, setStats] = useState<SessionStats | null>(null)
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const sessionStartRef = useRef<string>(new Date().toISOString())

  const loadHealth = useCallback(async () => {
    try {
      const response = await fetch("/api/health")
      if (response.ok) {
        const data = await response.json()
        setHealth(data)
      }
    } catch (error) {
      console.error("Failed to load health status:", error)
      setHealth({ llm: "offline", vectorDb: "offline" })
    }
  }, [])

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading) return

      const userMessage: ChatMessage = { role: "user", content: message }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        const history = [...messages, userMessage]
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, history }),
        })

        if (response.ok) {
          const data = await response.json()
          const assistantMessage: ChatMessage = { role: "assistant", content: data.answer }
          setMessages((prev) => [...prev, assistantMessage])
          setSources(data.sources || [])
          if (data.stats) {
            setStats(data.stats)
          }
        } else {
          const errorMessage: ChatMessage = {
            role: "assistant",
            content: "Sorry, I encountered an error processing your request. Please try again.",
          }
          setMessages((prev) => [...prev, errorMessage])
        }
      } catch (error) {
        console.error("Failed to send message:", error)
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: "Unable to connect to the backend. Please check your connection and try again.",
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [messages, isLoading],
  )

  const resetSession = useCallback(() => {
    setMessages([])
    setSources([])
    setStats(null)
    sessionStartRef.current = new Date().toISOString()
  }, [])

  const downloadTranscript = useCallback(() => {
    window.open("/api/transcript", "_blank")
  }, [])

  useEffect(() => {
    loadHealth()
    const interval = setInterval(loadHealth, 30000) // Refresh health every 30s
    return () => clearInterval(interval)
  }, [loadHealth])

  return {
    messages,
    isLoading,
    sources,
    stats,
    health,
    sendMessage,
    resetSession,
    loadHealth,
    downloadTranscript,
    sessionStart: sessionStartRef.current,
    turnCount: messages.filter((m) => m.role === "user").length,
  }
}
