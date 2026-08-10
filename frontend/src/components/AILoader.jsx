import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { aiLoaderDuration, smoothEase } from "./home/motionSystem.js";

function PulseGrid() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 9 }).map((_, index) => (
        <motion.span
          key={index}
          className="h-3 w-3 rounded-md bg-mint-400/70"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1, 0.95] }}
          transition={{
            repeat: Infinity,
            duration: aiLoaderDuration,
            ease: "easeInOut",
            delay: index * 0.05,
          }}
        />
      ))}
    </div>
  );
}

function ScanLine() {
  return (
    <div className="relative h-28 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
      <motion.div
        className="absolute inset-y-0 left-[-30%] w-[40%] bg-gradient-to-r from-transparent via-green-400/40 to-transparent blur-xl"
        animate={{ x: ["0%", "240%"] }}
        transition={{ repeat: Infinity, repeatType: "mirror", duration: 2.2, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
    </div>
  );
}

function ThinkingDots() {
  const dots = [0, 1, 2];

  return (
    <div className="flex items-center gap-2">
      {dots.map((dot) => (
        <motion.span
          key={dot}
          className="h-2.5 w-2.5 rounded-full bg-mint-300"
          animate={{ y: [0, -4, 0], opacity: [0.45, 1, 0.45] }}
          transition={{
            repeat: Infinity,
            duration: 0.9,
            delay: dot * 0.18,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function AILoader({
  variant = "pulse-grid",
  label = "Analyzing safely...",
  messages,
  showProgress = false,
  messageDuration = 1600,
}) {
  const statusMessages = useMemo(
    () => (Array.isArray(messages) && messages.length > 0 ? messages : [label]),
    [label, messages],
  );
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    setMessageIndex(0);
  }, [statusMessages]);

  useEffect(() => {
    if (statusMessages.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % statusMessages.length);
    }, messageDuration);

    return () => window.clearInterval(timer);
  }, [messageDuration, statusMessages]);

  const renderer =
    variant === "scan-line" ? <ScanLine /> : variant === "thinking-dots" ? <ThinkingDots /> : <PulseGrid />;
  const progressValue =
    statusMessages.length > 1 ? ((messageIndex + 1) / statusMessages.length) * 100 : showProgress ? 66 : 0;

  return (
    <motion.div
      className="grid gap-4"
      aria-live="polite"
      aria-busy="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: smoothEase }}
    >
      <div className="flex items-center justify-center">{renderer}</div>
      <div className="grid gap-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={statusMessages[messageIndex]}
            className="text-center text-sm theme-text-tertiary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            {statusMessages[messageIndex]}
          </motion.p>
        </AnimatePresence>

        {showProgress ? (
          <div className="mx-auto h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-300"
              initial={{ width: "14%" }}
              animate={{ width: `${Math.max(progressValue, 14)}%` }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

export default AILoader;
