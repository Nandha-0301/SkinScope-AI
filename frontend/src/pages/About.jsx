import MainLayout from "../components/layout/MainLayout.jsx";
import PageSection from "../components/layout/PageSection.jsx";
import PageHero from "../components/product/PageHero.jsx";
import InfoCard from "../components/product/InfoCard.jsx";

function About() {
  return (
    <MainLayout>
      <PageSection first>
        <PageHero
          eyebrow="About"
          title="About SkinScope AI"
          subtitle="SkinScope AI is built to provide early support using AI-powered image analysis."
        />
      </PageSection>

      <PageSection>
        <div className="grid gap-8 md:grid-cols-2">
          <InfoCard
            eyebrow="Mission"
            title="To make early skin awareness accessible and simple"
            description="Skin changes can be easy to ignore or hard to interpret. SkinScope AI is designed to make that first step more understandable and less intimidating."
          />
          <InfoCard
            eyebrow="Disclaimer"
            title="Built for early awareness"
            description="This tool supports early awareness, not medical diagnosis. It is meant to guide earlier attention and better next steps, not replace a licensed professional."
          />
        </div>
      </PageSection>
    </MainLayout>
  );
}

export default About;
