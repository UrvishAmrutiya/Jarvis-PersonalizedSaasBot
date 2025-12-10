"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, ChevronRight, Sparkles, HelpCircle, DollarSign, Zap } from "lucide-react"

interface TipsCardProps {
  onSelectTip: (tip: string) => void
}

const tips = [
  { text: "What are the main features of our SaaS product?", icon: Sparkles },
  { text: "How do I create a new project and invite team members?", icon: HelpCircle },
  { text: "Explain our pricing tiers in simple terms.", icon: DollarSign },
  { text: "What integrations are available?", icon: Zap },
]

export function TipsCard({ onSelectTip }: TipsCardProps) {
  return (
    <Card className="rounded-2xl border-cyan-500/20 bg-card/80 shadow-lg shadow-cyan-500/5 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-foreground">
          <Lightbulb className="h-4 w-4 text-cyan-400" />
          Try asking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tips.map((tip, index) => (
            <motion.div
              key={tip.text}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                className="h-auto w-full justify-start gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 text-left text-sm font-normal hover:bg-cyan-500/10 hover:border-cyan-500/30 group"
                onClick={() => onSelectTip(tip.text)}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                  <tip.icon className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <span className="flex-1 text-muted-foreground group-hover:text-foreground transition-colors">
                  {tip.text}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
