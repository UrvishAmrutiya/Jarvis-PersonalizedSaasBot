"use client"

import { motion } from "framer-motion"

export function TypingIndicator() {
  const dotVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: { scale: 1.2, opacity: 1 },
  }

  return (
    <motion.div
      className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 px-4 py-2 ring-1 ring-cyan-500/30"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-cyan-400"
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: i * 0.15,
          }}
          style={{
            boxShadow: "0 0 8px rgba(34, 211, 238, 0.6)",
          }}
        />
      ))}
    </motion.div>
  )
}
