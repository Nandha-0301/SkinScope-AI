import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroImage from "../../assets/skin.jpg";
import useMagneticEffect from "../../hooks/useMagneticEffect.js";
import TiltCard from "../TiltCard.jsx";
import { useTheme } from "../ThemeProvider.jsx";
import Button from "../ui/Button.jsx";
import {
  floatAnimation,
  floatTransition,
  headingReveal,
  inViewViewport,
  parallaxDepth,
  parallaxInputRange,
  sectionReveal,
  smoothEase,
  staggerContainer,
  staggerItem,
} from "./motionSystem.js";

function HeroSection() {
  const { theme } = useTheme();
  const detectButtonRef = useRef(null);
  const routineButtonRef = useRef(null);
  const detectMagnetic = useMagneticEffect(detectButtonRef);
  const routineMagnetic = useMagneticEffect(routineButtonRef);
  const { scrollY } = useScroll();
  const imageParallax = useTransform(scrollY, parallaxInputRange, parallaxDepth.imageFast);

  return (
    <motion.section
      id="home"
      className="layout-shell mt-8"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={inViewViewport}
    >
      <div className="theme-surface relative overflow-hidden rounded-2xl border border-white/10 p-8 backdrop-blur-xl lg:p-12">
        <div
          className={`pointer-events-none absolute inset-0 ${
            theme === "dark"
              ? "bg-[radial-gradient(circle_at_14%_18%,rgba(99,230,172,0.1),transparent_24%),radial-gradient(circle_at_84%_24%,rgba(56,189,248,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_34%)]"
              : "bg-[radial-gradient(circle_at_14%_18%,rgba(16,185,129,0.12),transparent_24%),radial-gradient(circle_at_84%_24%,rgba(59,130,246,0.08),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.32),transparent_34%)]"
          }`}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="pointer-events-none absolute inset-4 rounded-[2rem] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent)] sm:inset-5" />

        <motion.div
          className="relative grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={inViewViewport}
        >
          <motion.div variants={staggerItem} className="flex h-full max-w-3xl flex-col justify-center break-words">
            <motion.h1
              variants={headingReveal}
              className="theme-text-primary font-display text-5xl font-semibold leading-snug tracking-tight lg:text-6xl"
            >
              Scan your skin.
              <br />
              <span className="text-mint-300">Understand possible conditions.</span>
              <br />
              Act earlier.
            </motion.h1>

            <motion.p variants={headingReveal} className="theme-text-secondary mt-6 max-w-2xl leading-relaxed">
              SkinScope AI helps you review visible skin changes with calm, guided AI support.
              It offers early signal detection, next-step guidance, and optional routine recommendations in one place.
            </motion.p>

            <motion.div variants={headingReveal} className="mt-8 flex flex-wrap gap-3">
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
                  className="rounded-2xl font-semibold will-change-transform"
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
                  className="rounded-2xl font-semibold will-change-transform"
                >
                  View Routine Guide
                </Button>
              </motion.div>
            </motion.div>
            <motion.p variants={headingReveal} className="theme-text-tertiary mt-3 max-w-2xl text-xs leading-6">
              Private. No data stored. Takes ~10 seconds.
            </motion.p>
            <motion.p variants={headingReveal} className="theme-text-tertiary mt-2 max-w-2xl text-xs leading-6">
              For early awareness only. Not a medical diagnosis.
            </motion.p>
          </motion.div>

          <motion.div variants={staggerItem} className="mx-auto w-full max-w-[520px] lg:max-w-[620px]">
            <div className="pointer-events-none absolute inset-8 rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(99,230,172,0.12),transparent_62%)] blur-2xl" />

            <motion.div style={{ y: imageParallax }} className="will-change-transform">
              <motion.div animate={floatAnimation} transition={floatTransition} className="relative">
                <TiltCard
                  tilt={false}
                  className={`relative rounded-[1.75rem] border p-4 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:p-5 ${
                    theme === "dark"
                      ? "border-white/[0.08] bg-[linear-gradient(180deg,rgba(13,21,32,0.9),rgba(13,21,32,0.78))]"
                      : "border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(241,245,249,0.88))]"
                  }`}
                >
                  <div className="overflow-hidden rounded-[1.6rem] border border-white/[0.06] bg-night-950/80 dark:bg-night-950/80">
                    <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.03] px-4 py-3 dark:bg-white/[0.03]">
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={inViewViewport}
                        transition={{ duration: 0.4, ease: smoothEase }}
                      >
                        <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
                        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                        <span className="h-2.5 w-2.5 rounded-full bg-mint-400/70" />
                      </motion.div>
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-slate-400">
                        Skin analysis preview
                      </p>
                    </div>

                    <div className="relative">
                      <img
                        src={heroImage}
                        alt="Close-up skin analysis preview"
                        className="h-[380px] w-full object-cover object-center sm:h-[430px] lg:h-[500px]"
                      />
                      <div
                        className={`absolute inset-0 ${
                          theme === "dark"
                            ? "bg-[linear-gradient(180deg,rgba(5,7,11,0.06),rgba(5,7,11,0.38))]"
                            : "bg-[linear-gradient(180deg,rgba(248,250,252,0.02),rgba(148,163,184,0.14))]"
                        }`}
                      />
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default HeroSection;
