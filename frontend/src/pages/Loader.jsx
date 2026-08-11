import { useEffect, useState } from "react";
import logoImage from "../assets/logo.gif";
import AILoader from "../components/AILoader.jsx";

function Loader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 3500);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div
      id="face-scanner-loader"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 2s ease",
      }}
    >
      <div className="grid gap-6">
        <img src={logoImage} alt="SkinScope AI Logo" className="scanner-grid" />
        <AILoader variant="scan-line" label="Scanning visible skin patterns..." />
        <AILoader variant="thinking-dots" label="AI engine warming up" />
      </div>
    </div>
  );
}

export default Loader;
