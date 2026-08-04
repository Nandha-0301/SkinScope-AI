import { useRef } from "react";
import { motion } from "framer-motion";
import useMagneticEffect from "../../hooks/useMagneticEffect.js";
import TiltCard from "../TiltCard.jsx";
import { headingReveal, inViewViewport, sectionReveal, smoothEase } from "./motionSystem.js";
import Button from "../ui/Button.jsx";

function CallToActionSection() {
  const detectButtonRef = useRef(null);
  const routineButtonRef = useRef(null);
  const detectMagnetic = useMagneticEffect(detectButtonRef);
  const routineMagnetic = useMagneticEffect(routineButtonRef);

  return (
    <motion.section
      className="layout-shell section-spacing"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={inViewViewport}
    >
      <TiltCard
        tilt={false}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.25, ease: smoothEase }}
        className="rounded-2xl border border-white/10 bg-gradient-to-r from-green-500/8 to-blue-500/8 p-8 backdrop-blur-xl lg:p-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
      >
        <div className="max-w-xl">
          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={inViewViewport}
            variants={headingReveal}
            className="theme-text-tertiary mb-3 text-sm uppercase"
          >
            Ready to start
          </motion.p>
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={inViewViewport}
            variants={headingReveal}
            className="theme-text-primary mb-4 text-3xl font-semibold leading-snug tracking-tight lg:text-5xl"
          >
            Not sure about a skin change?
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={inViewViewport}
            variants={headingReveal}
            className="theme-text-secondary"
          >
            Start a quick check and get clarity in seconds.
          </motion.p>
        </div>

        <div className="grid gap-3">
          <div className="flex flex-wrap gap-3">
            <motion.div
              ref={detectButtonRef}
              data-cursor-glow="interactive"
              style={detectMagnetic.style}
              onMouseMove={detectMagnetic.onMouseMove}
              onMouseLeave={detectMagnetic.onMouseLeave}
            >
              <Button
                to="/disease"
                data-ripple="cta"
                size="lg"
                className="will-change-transform"
              >
                Start Skin Check
              </Button>
            </motion.div>
            <motion.div
              ref={routineButtonRef}
              data-cursor-glow="interactive"
              style={routineMagnetic.style}
              onMouseMove={routineMagnetic.onMouseMove}
              onMouseLeave={routineMagnetic.onMouseLeave}
            >
              <Button
                to="/routine"
                data-ripple="cta"
                variant="secondary"
                size="lg"
                className="will-change-transform"
              >
                Create Routine Plan
              </Button>
            </motion.div>
          </div>
          <p className="theme-text-tertiary max-w-2xl text-xs leading-6">
            For early awareness only. Not a medical diagnosis.
          </p>
        </div>
      </TiltCard>
    </motion.section>
  );
}

export default CallToActionSection;
