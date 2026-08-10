import MainLayout from "../components/layout/MainLayout.jsx";
import PageSection from "../components/layout/PageSection.jsx";
import PageHero from "../components/product/PageHero.jsx";
import InfoCard from "../components/product/InfoCard.jsx";
import SectionIntro from "../components/home/SectionIntro.jsx";

const steps = [
  {
    number: "01",
    title: "Upload or Capture",
    description: "Upload an image or use your camera to capture the affected area clearly.",
  },
  {
    number: "02",
    title: "Early Signal Detection",
    description: "Our model reviews visible skin patterns and looks for possible condition signals in the image.",
  },
  {
    number: "03",
    title: "Possible Condition Insight",
    description: "Receive a possible condition match, confidence signals, and guidance in one clear result.",
  },
  {
    number: "04",
    title: "Take Action",
    description: "Use the suggested next steps for early support or decide when to consult a professional.",
  },
];

function HowItWorks() {
  return (
    <MainLayout>
      <PageSection first>
        <PageHero
          eyebrow="Product Flow"
          title="How SkinScope AI works"
          subtitle="A guided flow from image capture to next-step clarity, designed to feel fast, calm, and structured."
        />
      </PageSection>

      <PageSection>
        <SectionIntro
          eyebrow="How It Works"
          title="A clear path from scan to next step"
          description="The workflow stays intentionally simple so users can move from image capture to useful product guidance without friction."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <InfoCard
              key={step.number}
              eyebrow={step.number}
              title={step.title}
              description={step.description}
              className="h-full"
            />
          ))}
        </div>

        <div className="card-base mt-8 px-6 py-4 text-center text-sm theme-text-secondary">
          Designed for early awareness, not medical diagnosis.
        </div>
      </PageSection>
    </MainLayout>
  );
}

export default HowItWorks;
