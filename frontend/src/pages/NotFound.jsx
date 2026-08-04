import MainLayout from "../components/layout/MainLayout.jsx";
import PageSection from "../components/layout/PageSection.jsx";
import Button from "../components/ui/Button.jsx";
import PageHero from "../components/product/PageHero.jsx";

function NotFound() {
  return (
    <MainLayout>
      <PageSection first>
        <PageHero
          eyebrow="404"
          title="Page not found"
          subtitle="The page you are looking for does not exist or may have moved."
        >
          <div className="pt-2">
            <Button to="/">Go Home</Button>
          </div>
        </PageHero>
      </PageSection>
    </MainLayout>
  );
}

export default NotFound;
