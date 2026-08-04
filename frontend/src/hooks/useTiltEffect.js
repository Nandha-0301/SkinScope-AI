import { useCallback } from "react";
import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import {
  tiltMaxRotation,
  tiltSpring,
  tiltTranslateFactor,
} from "../components/home/motionSystem.js";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function useTiltEffect(ref, maxRotation = tiltMaxRotation, translateFactor = tiltTranslateFactor) {
  const reduceMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springRotateX = useSpring(rotateX, tiltSpring);
  const springRotateY = useSpring(rotateY, tiltSpring);
  const springX = useSpring(x, tiltSpring);
  const springY = useSpring(y, tiltSpring);

  const reset = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    x.set(0);
    y.set(0);
  }, [rotateX, rotateY, x, y]);

  const handleMouseMove = useCallback(
    (event) => {
      if (reduceMotion || !ref.current) {
        return;
      }

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = event.clientX - centerX;
      const offsetY = event.clientY - centerY;

      rotateX.set(clamp(offsetY / 30, -maxRotation, maxRotation));
      rotateY.set(clamp(offsetX / -30, -maxRotation, maxRotation));
      x.set(clamp(offsetX * translateFactor, -10, 10));
      y.set(clamp(offsetY * translateFactor, -10, 10));
    },
    [maxRotation, reduceMotion, ref, rotateX, rotateY, translateFactor, x, y],
  );

  return {
    style: reduceMotion
      ? undefined
      : {
          rotateX: springRotateX,
          rotateY: springRotateY,
          x: springX,
          y: springY,
          transformPerspective: 1000,
        },
    onMouseMove: handleMouseMove,
    onMouseLeave: reset,
  };
}

export default useTiltEffect;
