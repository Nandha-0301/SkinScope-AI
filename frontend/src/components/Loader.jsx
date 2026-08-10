import AILoader from "./AILoader.jsx";
import SkeletonCard from "./SkeletonCard.jsx";

function Loader() {
  return (
    <div className="loading-stack" aria-live="polite" aria-busy="true">
      <AILoader variant="pulse-grid" label="Preparing analysis cards..." />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

export default Loader;
