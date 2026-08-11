import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TiltCard from "../TiltCard.jsx";
import { faqItems } from "./homeContent.js";
import {
  cardHover,
  cardHoverTransition,
  headingReveal,
  inViewViewport,
  sectionReveal,
  smoothEase,
  staggerContainer,
  staggerItem,
} from "./motionSystem.js";

function FAQSection() {
  const [activeItem, setActiveItem] = useState(0);

  return (
    <motion.section
      id="faq"
      className="layout-shell section-spacing"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={inViewViewport}
    >
      <div className="theme-surface rounded-2xl border border-white/10 p-8 backdrop-blur-xl lg:p-12">
        <div className="mb-8 max-w-3xl">
          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={inViewViewport}
            variants={headingReveal}
            className="theme-text-tertiary mb-3 text-sm uppercase"
          >
            FAQ
          </motion.p>
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={inViewViewport}
            variants={headingReveal}
            className="theme-text-primary mb-4 text-3xl font-semibold lg:text-5xl"
          >
            Questions users ask before they trust the scan
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={inViewViewport}
            variants={headingReveal}
            className="theme-text-secondary"
          >
            The answers below keep the product positioning clear: early support, privacy-aware processing, and better
            next-step guidance.
          </motion.p>
        </div>

        <motion.div
          className="grid gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={inViewViewport}
        >
          {faqItems.map((item, index) => {
            const isOpen = index === activeItem;

            return (
              <TiltCard
                as="article"
                tilt={false}
                layout
                key={item.question}
                variants={staggerItem}
                whileHover={cardHover}
                transition={cardHoverTransition}
                className={`rounded-2xl border border-white/10 p-5 backdrop-blur-xl transition-all duration-300 ease-out ${
                  isOpen
                    ? "theme-surface-strong theme-card-hover"
                    : "theme-surface theme-card-hover"
                }`}
              >
                <button
                  type="button"
                  className="m-0 flex w-full appearance-none items-center justify-between gap-4 border-0 bg-transparent p-0 text-left font-inherit shadow-none outline-none"
                  aria-expanded={isOpen}
                  onClick={() => setActiveItem(isOpen ? -1 : index)}
                >
                  <span className="theme-text-primary pr-4 text-base font-medium leading-7 sm:text-lg">
                    {item.question}
                  </span>
                  <motion.span
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg transition-all duration-300 ease-out ${
                      isOpen ? "bg-mint-400/20 text-mint-300" : "theme-surface text-mint-300"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2, ease: smoothEase }}
                  >
                    {isOpen ? "-" : "+"}
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: smoothEase }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 border-t border-white/[0.08] pt-4">
                        <p className="theme-text-secondary text-sm leading-8 sm:text-base">{item.answer}</p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </TiltCard>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default FAQSection;
