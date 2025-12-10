"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { User, Bot } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface MessageBubbleProps {
  role: "user" | "assistant"
  content: string
  index?: number
}

export function MessageBubble({ role, content, index = 0 }: MessageBubbleProps) {
  const isUser = role === "user"

  // Simple markdown-like formatting for line breaks and bullet points
  const formatContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      // Handle bullet points
      if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
        return (
          <li key={i} className="ml-4 list-disc">
            {line.trim().substring(2)}
          </li>
        )
      }
      // Handle numbered lists
      const numberedMatch = line.match(/^(\d+)\.\s(.*)/)
      if (numberedMatch) {
        return (
          <li key={i} className="ml-4 list-decimal">
            {numberedMatch[2]}
          </li>
        )
      }
      // Handle code blocks (simple inline)
      if (line.includes("`")) {
        const parts = line.split("`")
        return (
          <p key={i} className={i > 0 ? "mt-2" : ""}>
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <code key={j} className="rounded bg-cyan-500/10 px-1.5 py-0.5 font-mono text-sm text-cyan-300">
                  {part}
                </code>
              ) : (
                part
              ),
            )}
          </p>
        )
      }
      return line ? (
        <p key={i} className={i > 0 ? "mt-2" : ""}>
          {line}
        </p>
      ) : (
        <br key={i} />
      )
    })
  }

  const messageVariants = {
    initial: {
      opacity: 0,
      x: isUser ? 20 : -20,
      y: 10,
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay: index * 0.05,
      },
    },
  }

  return (
    <motion.div
      className={cn("flex gap-3 py-3", isUser && "flex-row-reverse")}
      variants={messageVariants}
      initial="initial"
      animate="animate"
    >
      <Avatar
        className={cn(
          "h-8 w-8 shrink-0 ring-2",
          isUser
            ? "bg-gradient-to-br from-purple-500 to-pink-500 ring-purple-500/30"
            : "bg-gradient-to-br from-cyan-500/20 to-purple-500/20 ring-cyan-500/30",
        )}
      >
        <AvatarFallback
          className={cn(
            isUser ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white" : "bg-transparent text-cyan-400",
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            : "bg-card/80 text-card-foreground border border-cyan-500/30 shadow-lg shadow-cyan-500/5",
          !isUser &&
            "relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-cyan-500/10 before:to-transparent before:pointer-events-none",
        )}
      >
        <div className="relative space-y-1">{formatContent(content)}</div>
      </div>
    </motion.div>
  )
}
