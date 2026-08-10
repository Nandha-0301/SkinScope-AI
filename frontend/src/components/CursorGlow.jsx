import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTheme } from "./ThemeProvider.jsx";
import { cursorGlowSize, cursorGlowSpring, smoothEase } from "./home/motionSystem.js";

function CursorGlow() {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-cursorGlowSize);
  const y = useMotionValue(-cursorGlowSize);
  const springX = useSpring(x, cursorGlowSpring);
  const springY = useSpring(y, cursorGlowSpring);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const finePointerQuery = window.matchMedia("(pointer: fine)");
    const updatePointerCapability = () => setEnabled(finePointerQuery.matches);

    updatePointerCapability();
    finePointerQuery.addEventListener("change", updatePointerCapability);

    return () => finePointerQuery.removeEventListener("change", updatePointerCapability);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      return undefined;
    }

    const handleMove = (event) => {
      x.set(event.clientX - cursorGlowSize / 2);
      y.set(event.clientY - cursorGlowSize / 2);
      setVisible(true);

      if (event.target instanceof Element) {
        setInteractive(Boolean(event.target.closest("[data-cursor-glow='interactive']")));
      }
    };

    const handleLeave = () => {
      setVisible(false);
      setInteractive(false);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseleave", handleLeave);
    window.addEventListener("blur", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("blur", handleLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) {
    return null;
  }

  const glowGradient =
    theme === "dark"
      ? "radial-gradient(circle, rgba(16,185,129,0.04), rgba(56,189,248,0.02), transparent 70%)"
      : "radial-gradient(circle, rgba(16,185,129,0.03), rgba(59,130,246,0.015), transparent 70%)";

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 h-[280px] w-[280px] rounded-full blur-2xl will-change-transform"
      style={{
        x: springX,
        y: springY,
        mixBlendMode: "screen",
        background: glowGradient,
      }}
      animate={{
        opacity: visible ? (interactive ? 0.06 : 0.04) : 0,
        scale: interactive ? 1.04 : 1,
      }}
      transition={{ duration: 0.25, ease: smoothEase }}
    />
  );
}

export default CursorGlow;
