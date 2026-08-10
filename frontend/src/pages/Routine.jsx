import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MainLayout from "../components/layout/MainLayout.jsx";
import PageSection from "../components/layout/PageSection.jsx";
import PageHero from "../components/product/PageHero.jsx";
import InfoCard from "../components/product/InfoCard.jsx";
import Button from "../components/ui/Button.jsx";

const questions = [
  {
    id: 1,
    text: "How does your skin feel in the morning?",
    options: ["Tight", "Balanced", "Oily", "Dry"],
  },
  {
    id: 2,
    text: "How visible are your pores?",
    options: ["Very visible", "Visible in T-zone", "Small", "Hardly visible"],
  },
  {
    id: 3,
    text: "How often do you notice shine during the day?",
    options: ["Always", "Often", "Sometimes", "Rarely"],
  },
  {
    id: 4,
    text: "How often does your skin feel sensitive to products?",
    options: ["Very often", "Sometimes", "Rarely", "Never"],
  },
  {
    id: 5,
    text: "How often do you get breakouts?",
    options: ["Weekly", "Monthly", "Occasionally", "Never"],
  },
  {
    id: 6,
    text: "How consistent are you with sunscreen?",
    options: ["Every day", "Most days", "Sometimes", "Never"],
  },
  {
    id: 7,
    text: "After cleansing, your skin usually feels...",
    options: ["Tight", "Comfortable", "Oily quickly", "Dry for long"],
  },
  {
    id: 8,
    text: "What is your biggest skin priority right now?",
    options: ["Acne control", "Hydration", "Glow", "Anti-aging"],
  },
  {
    id: 9,
    text: "How often do you use exfoliation products?",
    options: ["2-3 times weekly", "Weekly", "Monthly", "Never"],
  },
  {
    id: 10,
    text: "How often do you notice redness or irritation?",
    options: ["Very often", "Sometimes", "Rarely", "Never"],
  },
  {
    id: 11,
    text: "How would you describe your skin tone evenness?",
    options: ["Uneven", "Slightly uneven", "Mostly even", "Even"],
  },
  {
    id: 12,
    text: "How much water do you drink daily?",
    options: ["Less than 1L", "1-2L", "2-3L", "More than 3L"],
  },
  {
    id: 13,
    text: "How much stress do you currently experience?",
    options: ["High", "Moderate", "Low", "Very low"],
  },
  {
    id: 14,
    text: "How many hours do you sleep on average?",
    options: ["Under 5", "5-6", "7-8", "More than 8"],
  },
  {
    id: 15,
    text: "How often do you wear makeup?",
    options: ["Daily", "Most days", "Occasionally", "Never"],
  },
  {
    id: 16,
    text: "How often do you reapply moisturizer?",
    options: ["Twice daily", "Once daily", "A few times weekly", "Rarely"],
  },
  {
    id: 17,
    text: "How does your skin react to weather changes?",
    options: ["Gets irritated", "Gets dry", "Gets oily", "No major change"],
  },
  {
    id: 18,
    text: "How often do you touch your face during the day?",
    options: ["Very often", "Often", "Sometimes", "Rarely"],
  },
  {
    id: 19,
    text: "How often do you cleanse before sleeping?",
    options: ["Every night", "Most nights", "Sometimes", "Rarely"],
  },
  {
    id: 20,
    text: "How committed are you to a consistent routine?",
    options: ["Very committed", "Committed", "Somewhat", "Not sure yet"],
  },
];

const initialAnswers = Array.from({ length: questions.length }, () => "");

function getResultFromAnswers(answers) {
  const joined = answers.join(" ").toLowerCase();
  const oilySignals = ["oily", "shine", "very visible", "t-zone", "always"];
  const drySignals = ["tight", "dry", "hydration", "gets dry"];
  const sensitiveSignals = ["sensitive", "redness", "irritation", "gets irritated"];

  const score = (signals) => signals.reduce((acc, item) => acc + (joined.includes(item) ? 1 : 0), 0);

  const oily = score(oilySignals);
  const dry = score(drySignals);
  const sensitive = score(sensitiveSignals);

  const skinType =
    oily > dry && oily > sensitive
      ? "Oily"
      : dry > oily && dry > sensitive
        ? "Dry"
        : sensitive >= 2
          ? "Sensitive"
          : "Combination";

  const keyConcerns =
    skinType === "Oily"
      ? ["Breakouts", "Excess shine", "Visible pores"]
      : skinType === "Dry"
        ? ["Dehydration", "Tightness", "Dullness"]
        : skinType === "Sensitive"
          ? ["Irritation", "Barrier support", "Redness"]
          : ["Balancing oil and hydration", "Texture consistency", "Daily protection"];

  const morningRoutine =
    skinType === "Oily"
      ? ["Gel cleanser", "Niacinamide serum", "Lightweight moisturizer", "SPF 50"]
      : skinType === "Dry"
        ? ["Cream cleanser", "Hydrating serum", "Ceramide moisturizer", "SPF 50"]
        : skinType === "Sensitive"
          ? ["Gentle cleanser", "Soothing serum", "Barrier cream", "Mineral SPF"]
          : ["Gentle cleanser", "Balancing serum", "Moisturizer", "SPF 50"];

  const nightRoutine =
    skinType === "Oily"
      ? ["Cleanser", "Targeted treatment", "Oil-free moisturizer"]
      : skinType === "Dry"
        ? ["Cleanser", "Hydrating essence", "Rich moisturizer"]
        : skinType === "Sensitive"
          ? ["Low-foam cleanser", "Barrier serum", "Calming moisturizer"]
          : ["Cleanser", "Repair serum", "Night moisturizer"];

  return { skinType, keyConcerns, morningRoutine, nightRoutine };
}

function Routine() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);

  const isComplete = step >= questions.length;
  const progress = Math.round((step / questions.length) * 100);
  const currentQuestion = questions[Math.min(step, questions.length - 1)];
  const currentAnswer = answers[step] || "";
  const canContinue = Boolean(currentAnswer);

  const result = useMemo(() => {
    if (!isComplete) return null;
    return getResultFromAnswers(answers);
  }, [answers, isComplete]);

  const handleSelect = (value) => {
    setAnswers((previous) => {
      const next = [...previous];
      next[step] = value;
      return next;
    });
  };

  const goNext = () => {
    if (!currentAnswer) return;
    setStep((previous) => Math.min(previous + 1, questions.length));
  };

  const goPrevious = () => {
    setStep((previous) => Math.max(previous - 1, 0));
  };

  return (
    <MainLayout>
      <PageSection first>
        <PageHero
          eyebrow="Routine"
          title="Routine Guide"
          subtitle="Answer a few questions to create a routine plan aligned to your skin signals and priorities."
        />
      </PageSection>

      <PageSection>
        <div className="mx-auto grid max-w-4xl gap-8">
          <InfoCard tilt={false} className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="eyebrow-text">{isComplete ? "Routine Ready" : `Question ${step + 1} of ${questions.length}`}</p>
                <p className="theme-text-secondary text-sm font-medium">{progress}% complete</p>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/8">
                <motion.span
                  className="block h-full rounded-full bg-gradient-to-r from-mint-400 to-emerald-300"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </div>
            </div>
          </InfoCard>

          <AnimatePresence mode="wait">
            {!isComplete ? (
              <motion.div
                key={`question-${step}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <InfoCard
                  tilt={false}
                  eyebrow="Assessment"
                  title={currentQuestion.text}
                  description="Choose one option to keep moving through the routine assessment."
                  className="p-6 sm:p-8"
                >
                  <div className="grid gap-3 pt-2 sm:grid-cols-2">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`card-base rounded-xl px-4 py-3 text-left text-sm font-semibold theme-text-primary transition-all duration-200 ${
                          currentAnswer === option ? "card-strong border-mint-400/50 shadow-glow" : "hover:border-mint-300/25"
                        }`}
                        onClick={() => handleSelect(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={canContinue ? "answer-picked" : "answer-needed"}
                      className={`pt-4 text-sm ${canContinue ? "text-mint-300" : "theme-text-secondary"}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {canContinue ? "Answer saved. Continue when you are ready." : "Choose one answer to keep going."}
                    </motion.p>
                  </AnimatePresence>

                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={goPrevious} disabled={step === 0}>
                      Previous
                    </Button>
                    <Button type="button" onClick={goNext} disabled={!canContinue}>
                      Next Question
                    </Button>
                  </div>
                </InfoCard>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="grid gap-6"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <InfoCard tilt={false} title="Skin Type" className="h-full">
                    <span className="inline-flex w-fit items-center rounded-full border border-mint-400/35 bg-mint-400/15 px-4 py-2 font-semibold text-mint-300">
                      {result?.skinType}
                    </span>
                  </InfoCard>

                  <InfoCard tilt={false} title="Key Concerns" className="h-full">
                    <ul className="grid gap-2 pl-5 theme-text-secondary">
                      {(result?.keyConcerns || []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </InfoCard>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <InfoCard tilt={false} title="Morning Routine" className="h-full">
                    <ul className="grid gap-2 pl-5 theme-text-secondary">
                      {(result?.morningRoutine || []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </InfoCard>

                  <InfoCard tilt={false} title="Night Routine" className="h-full">
                    <ul className="grid gap-2 pl-5 theme-text-secondary">
                      {(result?.nightRoutine || []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </InfoCard>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button type="button" variant="secondary" onClick={goPrevious}>
                    Previous
                  </Button>
                  <Button to="/disease" variant="ghost">
                    Start Skin Check
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageSection>
    </MainLayout>
  );
}

export default Routine;
