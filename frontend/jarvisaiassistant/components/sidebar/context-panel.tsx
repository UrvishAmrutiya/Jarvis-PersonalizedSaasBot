"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Database, ChevronDown, ChevronUp, FileText } from "lucide-react"
import type { SourceSnippet } from "@/hooks/use-jarvis-chat"

interface ContextPanelProps {
  sources: SourceSnippet[]
}

function SourceCard({ source, index }: { source: SourceSnippet; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = source.snippet.length > 150

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-card/60 p-3 backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-purple-500" />

      <div className="ml-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-cyan-400" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm font-medium text-foreground cursor-help">Source #{index + 1}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>ID: {source.id}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Badge variant="secondary" className="border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-xs">
          <Database className="mr-1 h-3 w-3" />
          Pinecone
        </Badge>
      </div>

      <motion.div className="ml-2 mt-2" initial={false} animate={{ height: expanded || !isLong ? "auto" : "3.5rem" }}>
        <p className="text-sm text-muted-foreground leading-relaxed overflow-hidden">
          {expanded || !isLong ? source.snippet : `${source.snippet.substring(0, 150)}...`}
        </p>
      </motion.div>

      {isLong && (
        <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 mt-1 h-auto p-0 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-transparent"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="mr-1 h-3 w-3" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-3 w-3" />
                Show more
              </>
            )}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export function ContextPanel({ sources }: ContextPanelProps) {
  return (
    <Card className="rounded-2xl border-cyan-500/20 bg-card/80 shadow-lg shadow-cyan-500/5 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-foreground">
          <Database className="h-4 w-4 text-cyan-400" />
          Context Chunks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="popLayout">
          {sources.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-dashed border-cyan-500/20 bg-cyan-500/5 p-4 text-center"
            >
              <Database className="mx-auto mb-2 h-8 w-8 text-cyan-500/30" />
              <p className="text-sm text-muted-foreground">
                Ask a question to see which documents Jarvis uses as context.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {sources.map((source, idx) => (
                <SourceCard key={source.id || idx} source={source} index={idx} />
              ))}
            </div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
