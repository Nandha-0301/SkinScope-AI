import { motion } from "framer-motion";
import { headingReveal, inViewViewport, introStagger } from "./motionSystem.js";

function SectionIntro({ eyebrow, title, description, align = "left" }) {
  const alignment = align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-3xl";
  const descriptionAlignment = align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl";

  return (
    <motion.div
      className={`mb-8 ${alignment}`}
      variants={introStagger}
      initial="hidden"
      whileInView="show"
      viewport={inViewViewport}
    >
      <motion.p variants={headingReveal} className="theme-text-tertiary mb-3 text-sm uppercase tracking-wider">
        {eyebrow}
      </motion.p>
      <motion.h2
        variants={headingReveal}
        className="theme-text-primary font-display text-3xl font-semibold leading-snug tracking-tight lg:text-5xl"
      >
        {title}
      </motion.h2>
      <motion.p variants={headingReveal} className={`theme-text-secondary mt-4 leading-relaxed ${descriptionAlignment}`}>
        {description}
      </motion.p>
    </motion.div>
  );
}

export default SectionIntro;
