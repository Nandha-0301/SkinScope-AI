import { motion } from "framer-motion";
import supportImage from "../../assets/man.webp";
import TiltCard from "../TiltCard.jsx";
import SectionIntro from "./SectionIntro.jsx";
import { safetyPanels, whoItsFor } from "./homeContent.js";
import {
  cardHover,
  cardHoverTransition,
  inViewViewport,
  sectionReveal,
  staggerContainer,
  staggerItem,
} from "./motionSystem.js";

function BenefitsSection() {
  return (
    <motion.section
      className="layout-shell section-spacing"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={inViewViewport}
    >
      <div className="theme-surface rounded-2xl border border-white/10 p-8 backdrop-blur-xl lg:p-12">
        <SectionIntro
          eyebrow="Who It's For"
          title="Built for people who want clearer health-support guidance"
          description="SkinScope AI is positioned as a first-step screening experience for users who want to respond earlier, track concerns better, and understand what deserves more attention."
          align="center"
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <motion.div
            className="grid gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={inViewViewport}
          >
            {whoItsFor.map((item) => (
              <TiltCard
                as="article"
                tilt={false}
                key={item.title}
                variants={staggerItem}
                whileHover={cardHover}
                transition={cardHoverTransition}
                className="theme-surface theme-card-hover grid gap-4 rounded-2xl border border-white/10 p-7 backdrop-blur-xl transition-all duration-300 ease-out"
              >
                <h3 className="theme-text-primary font-display text-2xl font-semibold">{item.title}</h3>
                <p className="theme-text-secondary text-sm leading-7">{item.description}</p>
              </TiltCard>
            ))}
          </motion.div>

          <div className="grid gap-6">
            <TiltCard
              as="article"
              tilt={false}
              variants={staggerItem}
              initial="hidden"
              whileInView="show"
              viewport={inViewViewport}
              whileHover={cardHover}
              transition={cardHoverTransition}
              className="theme-surface theme-card-hover relative overflow-hidden rounded-2xl border border-white/10 p-7 backdrop-blur-xl transition-all duration-300 ease-out"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,230,172,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_30%)]" />
              <div className="relative grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div className="max-w-lg overflow-hidden rounded-[1.5rem] border border-white/[0.08]">
                  <img src={supportImage} alt="Skin health support" className="h-full w-full object-cover" />
                </div>
                <div className="max-w-3xl grid gap-5">
                  <p className="theme-text-tertiary text-sm uppercase tracking-wider">Safety + Boundaries</p>
                  <h3 className="theme-text-primary font-display text-3xl font-semibold">A calmer way to support earlier action</h3>
                  <p className="theme-text-secondary text-sm leading-7">
                    The product helps people review visible concerns earlier, but always frames the output as support, not certainty.
                  </p>
                </div>
              </div>
            </TiltCard>

            <motion.div
              className="grid gap-6 sm:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={inViewViewport}
            >
              {safetyPanels.map((panel) => (
                <TiltCard
                  as="article"
                  tilt={false}
                  key={panel.title}
                  variants={staggerItem}
                  whileHover={cardHover}
                  transition={cardHoverTransition}
                  className="theme-surface theme-card-hover grid gap-4 rounded-2xl border border-white/10 p-7 backdrop-blur-xl transition-all duration-300 ease-out"
                >
                  <h3 className="theme-text-primary font-display text-xl font-semibold">{panel.title}</h3>
                  <p className="theme-text-secondary text-sm leading-7">{panel.description}</p>
                </TiltCard>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default BenefitsSection;
