import { motion, useScroll, useTransform } from "framer-motion";
import HeroSection from "../components/home/HeroSection.jsx";
import FeatureCards from "../components/home/FeatureCards.jsx";
import StepsSection from "../components/home/StepsSection.jsx";
import BenefitsSection from "../components/home/BenefitsSection.jsx";
import FAQSection from "../components/home/FAQSection.jsx";
import CallToActionSection from "../components/home/CallToActionSection.jsx";
import MainLayout from "../components/layout/MainLayout.jsx";
import { useTheme } from "../components/ThemeProvider.jsx";
import { parallaxDepth, parallaxInputRange } from "../components/home/motionSystem.js";

function Home() {
  const { theme } = useTheme();
  const { scrollY } = useScroll();
  const ySlow = useTransform(scrollY, parallaxInputRange, parallaxDepth.backgroundSlow);
  const yFast = useTransform(scrollY, parallaxInputRange, parallaxDepth.backgroundFast);

  return (
    <MainLayout
      className="text-slate-950 dark:text-white"
      background={
        <div className="pointer-events-none fixed inset-0 z-0">
          <motion.div
            style={{ y: ySlow }}
            className={`absolute inset-0 ${
              theme === "dark"
                ? "bg-[linear-gradient(180deg,rgba(5,7,11,0.84),rgba(5,7,11,0.7)_28%,rgba(5,7,11,0.78)_100%)]"
                : "bg-[linear-gradient(180deg,rgba(248,250,252,0.94),rgba(241,245,249,0.84)_32%,rgba(236,253,245,0.78)_100%)]"
            }`}
          />
          <motion.div
            style={{ y: yFast }}
            className={`absolute inset-0 ${
              theme === "dark"
                ? "bg-[radial-gradient(circle_at_12%_18%,rgba(99,230,172,0.08),transparent_26%),radial-gradient(circle_at_88%_12%,rgba(56,189,248,0.06),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.05),transparent_20%)]"
                : "bg-[radial-gradient(circle_at_12%_18%,rgba(16,185,129,0.12),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(59,130,246,0.08),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(34,197,94,0.06),transparent_20%)]"
            }`}
          />
        </div>
      }
    >
      <div className="relative z-10">
        <div className="flex flex-col pb-0">
          <HeroSection />
          <FeatureCards />
          <StepsSection />
          <BenefitsSection />
          <FAQSection />
          <CallToActionSection />
        </div>
      </div>
    </MainLayout>
  );
}

export default Home;
