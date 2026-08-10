import { useCallback, useEffect, useRef, useState } from "react";
import { rippleDuration } from "../components/home/motionSystem.js";

function useRippleEffect(duration = rippleDuration) {
  const [ripples, setRipples] = useState([]);
  const timeoutsRef = useRef(new Map());

  const removeRipple = useCallback((id) => {
    setRipples((current) => current.filter((ripple) => ripple.id !== id));
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      window.clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const createRipple = useCallback(
    ({ x, y }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setRipples((current) => [...current, { id, x, y }]);
      const timeout = window.setTimeout(() => removeRipple(id), duration * 1000);
      timeoutsRef.current.set(id, timeout);
    },
    [duration, removeRipple],
  );

  useEffect(
    () => () => {
      timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
      timeoutsRef.current.clear();
    },
    [],
  );

  return { ripples, createRipple, removeRipple };
}

export default useRippleEffect;
