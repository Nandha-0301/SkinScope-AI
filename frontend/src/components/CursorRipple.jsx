import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useRippleEffect from "../hooks/useRippleEffect.js";
import { rippleDuration, smoothEase } from "./home/motionSystem.js";

function CursorRipple() {
  const [enabled, setEnabled] = useState(false);
  const { ripples, createRipple, removeRipple } = useRippleEffect();

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
      return undefined;
    }

    const handleMouseDown = (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const interactiveTarget = event.target.closest("[data-ripple='cta']");

      if (!interactiveTarget) {
        return;
      }

      createRipple({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousedown", handleMouseDown, { passive: true });

    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [createRipple, enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute h-20 w-20 rounded-full bg-green-400/18 will-change-transform"
            style={{ left: ripple.x - 40, top: ripple.y - 40 }}
            initial={{ scale: 0, opacity: 0.22 }}
            animate={{ scale: 2.1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: rippleDuration, ease: smoothEase }}
            onAnimationComplete={() => removeRipple(ripple.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default CursorRipple;
