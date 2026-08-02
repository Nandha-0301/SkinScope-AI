import MainLayout from "../components/layout/MainLayout.jsx";
import PageSection from "../components/layout/PageSection.jsx";
import PageHero from "../components/product/PageHero.jsx";
import InfoCard from "../components/product/InfoCard.jsx";
import SectionIntro from "../components/home/SectionIntro.jsx";

function LockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 10.5V8.25a4.5 4.5 0 1 1 9 0v2.25" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 10.5h10.5a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75v-7.5a.75.75 0 0 1 .75-.75Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25v2.25" />
    </svg>
  );
}

function ShieldIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.75c2.01 1.45 4.51 2.25 7.13 2.25v4.73c0 4.3-2.75 8.11-6.83 9.49a1 1 0 0 1-.6 0C7.62 18.84 4.87 15.03 4.87 10.73V6c2.62 0 5.12-.8 7.13-2.25Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 12.25 1.5 1.5 3-3.5" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

const privacyCards = [
  {
    title: "No image storage",
    description: "We do not store your uploaded images permanently after analysis.",
    Icon: LockIcon,
  },
  {
    title: "Secure processing",
    description: "All analysis is handled through secure processing designed to reduce unnecessary exposure of image data.",
    Icon: ShieldIcon,
  },
  {
    title: "No personal tracking",
    description: "We do not build hidden identity profiles or track you beyond what is needed for the product to work.",
    Icon: UserIcon,
  },
];

function Privacy() {
  return (
    <MainLayout>
      <PageSection first>
        <PageHero
          eyebrow="Privacy & Security"
          title="Your data stays private"
          subtitle="We prioritize privacy at every step."
        />
      </PageSection>

      <PageSection>
        <SectionIntro
          eyebrow="Privacy"
          title="Built to earn trust, not just attention"
          description="For a health-support product, privacy is part of the experience. The system is designed to keep handling minimal and purposeful."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {privacyCards.map(({ title, description, Icon }) => (
            <InfoCard
              key={title}
              title={title}
              description={description}
              contentClassName="space-y-4"
              className="h-full"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-mint-300">
                <Icon className="h-5 w-5" />
              </div>
            </InfoCard>
          ))}
        </div>

        <div className="card-base mt-8 px-6 py-4 text-center text-sm theme-text-secondary">
          Designed for early support. We do not store or misuse your data.
        </div>
      </PageSection>
    </MainLayout>
  );
}

export default Privacy;
