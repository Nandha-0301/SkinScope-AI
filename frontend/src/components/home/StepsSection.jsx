import { motion } from "framer-motion";
import TiltCard from "../TiltCard.jsx";
import SectionIntro from "./SectionIntro.jsx";
import { steps } from "./homeContent.js";
import {
  cardHover,
  cardHoverTransition,
  iconHover,
  iconHoverTransition,
  inViewViewport,
  sectionReveal,
  staggerContainer,
  staggerItem,
} from "./motionSystem.js";

function StepsSection() {
  return (
    <motion.section
      id="how-it-works"
      className="layout-shell section-spacing"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={inViewViewport}
    >
      <div className="theme-surface rounded-2xl border border-white/10 p-8 backdrop-blur-xl lg:p-12">
        <SectionIntro
          eyebrow="How It Works"
          title="A simple AI flow built for early support"
          description="The experience is designed to be understandable: upload an image, let the model review visible patterns, then use the result as an informed starting point."
        />

        <motion.div
          className="grid gap-6 md:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={inViewViewport}
        >
          {steps.map((step) => (
            <TiltCard
              as="article"
              tilt={false}
              key={step.number}
              variants={staggerItem}
              whileHover={cardHover}
              transition={cardHoverTransition}
              className="theme-surface theme-card-hover rounded-2xl border border-white/10 p-6 backdrop-blur-xl transition-all duration-300 ease-out"
            >
              <motion.div whileHover={iconHover} transition={iconHoverTransition} className="text-green-400 font-semibold">
                {step.number}
              </motion.div>
              <h3 className="theme-text-primary mt-2 font-semibold">{step.title}</h3>
              <p className="theme-text-tertiary mt-1 text-sm">{step.description}</p>
            </TiltCard>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default StepsSection;
