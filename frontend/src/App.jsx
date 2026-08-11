import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import CursorGlow from "./components/CursorGlow.jsx";
import CursorRipple from "./components/CursorRipple.jsx";
import Navbar from "./components/Navbar.jsx";
import Starfield from "./components/Starfield.jsx";
import { useTheme } from "./components/ThemeProvider.jsx";
import Loader from "./pages/Loader.jsx";
import Home from "./pages/Home.jsx";
import Disease from "./pages/Disease.jsx";
import Routine from "./pages/Routine.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import Privacy from "./pages/Privacy.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Results from "./pages/Results.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(true);
  const showNavbar = !location.pathname.startsWith("/app");
  const { theme } = useTheme();

  useEffect(() => {
    const loaderTimer = window.setTimeout(() => {
      setShowLoader(false);
    }, 3500);

    return () => {
      window.clearTimeout(loaderTimer);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {showLoader ? <Loader /> : null}
      <CursorGlow />
      <CursorRipple />
      {showNavbar ? <Navbar /> : null}
      <AnimatePresence>
        {theme === "dark" ? (
          <motion.div
            key="starfield"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Starfield />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/disease" element={<Disease />} />
          <Route path="/routine" element={<Routine />} />
          <Route path="/results" element={<Results />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
