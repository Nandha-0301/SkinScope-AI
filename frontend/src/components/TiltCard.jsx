import { useRef } from "react";
import { motion } from "framer-motion";
import useTiltEffect from "../hooks/useTiltEffect.js";

const motionMap = {
  article: motion.article,
  div: motion.div,
  section: motion.section,
};

function TiltCard({
  as = "div",
  tilt = false,
  className = "",
  style,
  children,
  "data-cursor-glow": dataCursorGlow,
  onMouseMove,
  onMouseLeave,
  ...props
}) {
  const Component = motionMap[as] || motion.div;
  const ref = useRef(null);
  const tiltEffect = useTiltEffect(ref);

  return (
    <Component
      ref={ref}
      data-cursor-glow={dataCursorGlow}
      className={`relative isolate overflow-hidden will-change-transform before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_42%,rgba(16,185,129,0.04))] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 ${className}`.trim()}
      style={{ ...(tilt ? tiltEffect.style || {} : {}), ...(style || {}) }}
      onMouseMove={(event) => {
        if (tilt) {
          tiltEffect.onMouseMove(event);
        }
        onMouseMove?.(event);
      }}
      onMouseLeave={(event) => {
        if (tilt) {
          tiltEffect.onMouseLeave();
        }
        onMouseLeave?.(event);
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

export default TiltCard;
