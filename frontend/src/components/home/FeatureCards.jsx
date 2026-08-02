import { motion, useScroll, useTransform } from "framer-motion";
import TiltCard from "../TiltCard.jsx";
import SectionIntro from "./SectionIntro.jsx";
import { featureCards, supportedConditions } from "./homeContent.js";
import {
  cardHover,
  cardHoverTransition,
  iconHover,
  iconHoverTransition,
  inViewViewport,
  parallaxDepth,
  parallaxInputRange,
  sectionReveal,
  staggerContainer,
  staggerItem,
} from "./motionSystem.js";

const cardStyles = [
  "border-mint-400/18 bg-[linear-gradient(180deg,rgba(99,230,172,0.08),rgba(255,255,255,0.04))] shadow-float",
  "theme-surface border-white/10 bg-white/5",
  "theme-surface border-white/10 bg-white/5",
  "theme-surface border-white/10 bg-white/5",
];

function FeatureCards() {
  const { scrollY } = useScroll();
  const cardParallax = useTransform(scrollY, parallaxInputRange, parallaxDepth.cardMedium);

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
          eyebrow="What You Get"
          title="Clear output that helps users decide what to do next"
          description="Instead of generic beauty advice, SkinScope AI focuses on healthcare support: possible condition screening, visible severity cues, and practical routine direction."
          align="center"
        />

        <motion.div style={{ y: cardParallax }}>
          <TiltCard
            tilt={false}
            variants={staggerItem}
            whileHover={cardHover}
            transition={cardHoverTransition}
            className="theme-surface theme-card-hover mx-auto mt-8 grid max-w-4xl gap-4 rounded-2xl border border-white/10 p-5 text-center backdrop-blur-xl transition-all duration-300 ease-out sm:p-6"
          >
            <p className="theme-text-tertiary text-sm font-semibold uppercase tracking-[0.28em]">Supports early review of</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {supportedConditions.map((condition) => (
                <span
                  key={condition}
                  className="theme-surface rounded-full border border-white/10 px-3 py-2 text-sm font-medium theme-text-secondary"
                >
                  {condition}
                </span>
              ))}
            </div>
          </TiltCard>
        </motion.div>

        <motion.div
          className="mt-8 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={inViewViewport}
        >
          {featureCards.map((card, index) => (
            <TiltCard
              as="article"
              tilt
              key={card.title}
              variants={staggerItem}
              whileHover={cardHover}
              transition={cardHoverTransition}
              className={`theme-card-hover group flex h-full flex-col justify-between gap-6 rounded-2xl border p-7 shadow-glass backdrop-blur-xl transition-all duration-300 ease-out ${cardStyles[index]}`}
            >
              <div className="flex items-center justify-between gap-4">
                <motion.span
                  whileHover={iconHover}
                  transition={iconHoverTransition}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-night-950/75 text-base font-semibold text-mint-300"
                >
                  0{index + 1}
                </motion.span>
                <span className="h-px flex-1 bg-gradient-to-r from-white/0 via-white/10 to-white/0" />
              </div>
              <div className="flex flex-1 flex-col justify-between gap-6">
                <h3 className="theme-text-primary font-display text-2xl font-semibold tracking-tight">{card.title}</h3>
                <p className="theme-text-secondary text-sm leading-7">{card.description}</p>
              </div>
            </TiltCard>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default FeatureCards;
