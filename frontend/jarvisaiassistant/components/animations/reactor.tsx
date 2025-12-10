"use client"

import { motion } from "framer-motion"

interface ReactorProps {
  isLaunching?: boolean
}

export function Reactor({ isLaunching = false }: ReactorProps) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <motion.div
        animate={
          isLaunching
            ? { scale: 0.1, opacity: 0 }
            : {
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }
        }
        transition={
          isLaunching ? { duration: 0.5 } : { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
        }
        className="absolute h-72 w-72 rounded-full bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 blur-xl sm:h-80 sm:w-80"
      />

      {/* Rotating outer ring */}
      <motion.div
        animate={isLaunching ? { rotate: 720, scale: 0 } : { rotate: 360 }}
        transition={
          isLaunching ? { duration: 0.6 } : { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }
        }
        className="absolute h-64 w-64 sm:h-72 sm:w-72"
      >
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/40" />
        <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
        <div className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
      </motion.div>

      {/* Counter-rotating middle ring */}
      <motion.div
        animate={isLaunching ? { rotate: -720, scale: 0 } : { rotate: -360 }}
        transition={
          isLaunching ? { duration: 0.6 } : { duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }
        }
        className="absolute h-48 w-48 sm:h-56 sm:w-56"
      >
        <div className="absolute inset-0 rounded-full border border-blue-500/50 border-dashed" />
        {/* Orbiting dots */}
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            className="absolute h-2 w-2 rounded-full bg-blue-400"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${deg}deg) translateX(96px) translateY(-50%)`,
            }}
          />
        ))}
      </motion.div>

      {/* Inner rotating ring */}
      <motion.div
        animate={isLaunching ? { rotate: 360, scale: 0 } : { rotate: 360 }}
        transition={isLaunching ? { duration: 0.4 } : { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="absolute h-32 w-32 rounded-full border border-cyan-400/60 sm:h-40 sm:w-40"
      >
        {/* Arc segments */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth="2"
            strokeDasharray="30 20"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Core center */}
      <motion.div
        animate={isLaunching ? { scale: 3, opacity: 0 } : { scale: [1, 1.05, 1] }}
        transition={
          isLaunching ? { duration: 0.5 } : { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
        }
        whileHover={{ scale: 1.1 }}
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_60px_rgba(34,211,238,0.6)] sm:h-24 sm:w-24"
      >
        {/* Inner core glow */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent" />

        {/* Pulsing center dot */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="h-6 w-6 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] sm:h-8 sm:w-8"
        />
      </motion.div>

      {/* Hover ripple effect */}
      <motion.div
        initial={{ scale: 1, opacity: 0 }}
        whileHover={{ scale: 1.5, opacity: 0.3 }}
        transition={{ duration: 0.4 }}
        className="absolute h-32 w-32 rounded-full border-2 border-cyan-400/50 sm:h-40 sm:w-40"
      />
    </div>
  )
}
