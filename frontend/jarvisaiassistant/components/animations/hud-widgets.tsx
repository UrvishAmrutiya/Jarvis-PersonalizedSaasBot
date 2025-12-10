"use client"

import { motion } from "framer-motion"

export function HudWidgets() {
  return (
    <>
      {/* Top-left: Rotating chip/circuit icon */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.6, x: 0, rotate: 360 }}
        transition={{
          opacity: { delay: 1.5, duration: 0.8 },
          x: { delay: 1.5, duration: 0.8 },
          rotate: { duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
        }}
        className="absolute left-8 top-24 hidden md:block"
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="text-cyan-500/40">
          <rect x="15" y="15" width="30" height="30" rx="4" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="30" cy="30" r="8" stroke="currentColor" strokeWidth="1.5" />
          <line x1="30" y1="5" x2="30" y2="15" stroke="currentColor" strokeWidth="1" />
          <line x1="30" y1="45" x2="30" y2="55" stroke="currentColor" strokeWidth="1" />
          <line x1="5" y1="30" x2="15" y2="30" stroke="currentColor" strokeWidth="1" />
          <line x1="45" y1="30" x2="55" y2="30" stroke="currentColor" strokeWidth="1" />
        </svg>
      </motion.div>

      {/* Left: Rotating polygon scanner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute left-12 top-1/2 hidden -translate-y-1/2 lg:block"
      >
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <polygon
              points="40,5 75,25 75,55 40,75 5,55 5,25"
              stroke="rgba(34,211,238,0.3)"
              strokeWidth="1"
              fill="none"
            />
            <polygon
              points="40,15 65,30 65,50 40,65 15,50 15,30"
              stroke="rgba(59,130,246,0.3)"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </motion.div>
        {/* Scanning line */}
        <motion.div
          animate={{ y: [-30, 30, -30] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
        />
      </motion.div>

      {/* Right: Matrix-like fading text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute right-8 top-1/3 hidden text-right font-mono text-xs lg:block"
      >
        {["SYS.READY", "VEC.SYNC", "LLM.ACTIVE", "CTX.LOADED"].map((text, i) => (
          <motion.div
            key={text}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.3,
            }}
            className="text-cyan-500/50"
          >
            {text}
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom-right: Data stream indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-24 right-12 hidden md:block"
      >
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [8, 24, 8] }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.15,
              }}
              className="w-1 rounded-full bg-gradient-to-t from-cyan-500/30 to-blue-500/30"
            />
          ))}
        </div>
      </motion.div>
    </>
  )
}
