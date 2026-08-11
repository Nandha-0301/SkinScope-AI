import { useCallback } from "react";
import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import {
  magneticMaxOffset,
  magneticPullFactor,
  magneticSpring,
} from "../components/home/motionSystem.js";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function useMagneticEffect(ref, strength = magneticPullFactor, maxOffset = magneticMaxOffset) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, magneticSpring);
  const springY = useSpring(y, magneticSpring);

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const handleMouseMove = useCallback(
    (event) => {
      if (reduceMotion || !ref.current) {
        return;
      }

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const offsetX = clamp((event.clientX - centerX) * strength, -maxOffset, maxOffset);
      const offsetY = clamp((event.clientY - centerY) * strength, -maxOffset, maxOffset);

      x.set(offsetX);
      y.set(offsetY);
    },
    [maxOffset, reduceMotion, ref, strength, x, y],
  );

  return {
    style: reduceMotion ? undefined : { x: springX, y: springY },
    onMouseMove: handleMouseMove,
    onMouseLeave: reset,
  };
}

export default useMagneticEffect;
