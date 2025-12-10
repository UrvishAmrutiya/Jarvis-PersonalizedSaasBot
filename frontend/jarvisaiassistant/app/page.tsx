"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Reactor } from "@/components/animations/reactor"
import { HudWidgets } from "@/components/animations/hud-widgets"
import { ParticleField } from "@/components/animations/particle-field"

export default function LandingPage() {
  const router = useRouter()
  const [isLaunching, setIsLaunching] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleLaunch = () => {
    // Play click sound if available
    if (audioRef.current) {
      audioRef.current.play().catch(() => {})
    }

    setIsLaunching(true)

    // Navigate after animation
    setTimeout(() => {
      router.push("/chat")
    }, 800)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a1a]">
      {/* Particle background */}
      <ParticleField />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a1a]/50 to-[#0a0a1a]" />

      {/* HUD decorative widgets */}
      <HudWidgets />

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-4 text-center"
        >
          <h1 className="text-6xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)] sm:text-7xl md:text-8xl">
            JARVIS
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-2 text-lg tracking-widest text-cyan-300/80 sm:text-xl"
          >
            Enterprise AI Copilot
          </motion.p>
        </motion.div>

        {/* Reactor core */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="my-12"
        >
          <Reactor isLaunching={isLaunching} />
        </motion.div>

        {/* Slogan */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-8 max-w-md text-center text-lg italic text-slate-400 sm:text-xl"
        >
          Code Meets Intelligence. Knowledge Meets Action.
        </motion.p>

        {/* Launch button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <Button
            onClick={handleLaunch}
            disabled={isLaunching}
            size="lg"
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-6 text-lg font-semibold text-white shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(34,211,238,0.6)] hover:scale-105 disabled:opacity-50"
          >
            <span className="relative z-10">Launch Assistant</span>
            {/* Ripple effect on hover */}
            <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 text-sm text-slate-500"
        >
          Powered by Self-Hosted LLM + Vector Search
        </motion.p>
      </div>

      {/* White flash transition */}
      <AnimatePresence>
        {isLaunching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="fixed inset-0 z-50 bg-white"
          />
        )}
      </AnimatePresence>

      {/* Audio element for click sound */}
      <audio ref={audioRef} src="/sounds/click.mp3" preload="auto" />
    </div>
  )
}
