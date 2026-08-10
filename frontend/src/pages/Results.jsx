import { useLocation } from "react-router-dom";
import heroImage from "../assets/skin.jpg";
import MainLayout from "../components/layout/MainLayout.jsx";
import PageSection from "../components/layout/PageSection.jsx";
import PageHero from "../components/product/PageHero.jsx";
import InfoCard from "../components/product/InfoCard.jsx";
import Button from "../components/ui/Button.jsx";

const fallbackResult = {
  condition: "No result available",
  confidence: "N/A",
  severity: "Review pending",
  summary: "Start a new skin check to view the latest backend-supported result.",
};

function Results() {
  const location = useLocation();
  const image = location.state?.image || heroImage;
  const result = location.state?.result
    ? {
        condition: location.state.result.disease || "Unknown",
        confidence: location.state.result.accuracy || "N/A",
        severity: location.state.result.severity || "Mild",
        summary: location.state.result.effects || "AI-generated results are ready for review.",
      }
    : fallbackResult;

  return (
    <MainLayout>
      <PageSection first>
        <PageHero
          eyebrow="Results"
          title="Your AI review result"
          subtitle="Review the uploaded image, possible condition insight, confidence, and recommended next step."
        />
      </PageSection>

      <PageSection>
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <InfoCard title="Uploaded image" description="This is the image currently used for the analysis result." tilt={false}>
            <div className="card-base overflow-hidden rounded-2xl">
              <img src={image} alt="Uploaded skin preview" className="h-full w-full object-cover" />
            </div>
          </InfoCard>

          <div className="grid gap-8">
            <InfoCard title={result.condition} description={result.summary} tilt={false}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="card-base p-5">
                  <p className="eyebrow-text">Confidence</p>
                  <p className="mt-3 text-3xl font-semibold theme-text-primary">{result.confidence}</p>
                </div>
                <div className="card-base p-5">
                  <p className="eyebrow-text">Severity</p>
                  <p className="mt-3 text-3xl font-semibold theme-text-primary">{result.severity}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button to="/routine">View Routine Guide</Button>
                <Button to="/disease" variant="secondary">
                  Start New Skin Check
                </Button>
              </div>
            </InfoCard>

            <InfoCard
              tilt={false}
              title="Important note"
              description="Results are meant to support early awareness and product guidance, not replace professional medical diagnosis."
            />
          </div>
        </div>
      </PageSection>
    </MainLayout>
  );
}

export default Results;
