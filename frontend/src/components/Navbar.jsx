import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router-dom";
import logoImage from "../assets/logo.gif";
import { navigationLinks } from "../constants/navigationLinks.js";
import { buttonMotion, iconHover, iconHoverTransition, smoothEase } from "./home/motionSystem.js";
import { useTheme } from "./ThemeProvider.jsx";
import useMagneticEffect from "../hooks/useMagneticEffect.js";

function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const themeToggleRef = useRef(null);
  const menuButtonRef = useRef(null);
  const themeMagnetic = useMagneticEffect(themeToggleRef);
  const menuMagnetic = useMagneticEffect(menuButtonRef);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: smoothEase }}
        className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-300 ${
          scrolled
            ? theme === "dark"
              ? "theme-nav-shell shadow-lg"
              : "theme-nav-shell shadow-[0_14px_40px_rgba(148,163,184,0.18)]"
            : theme === "dark"
              ? "border-white/5 bg-transparent"
              : "border-slate-200/60 bg-white/40"
        }`}
      >
        <div
          className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 lg:px-12"
          role="navigation"
          aria-label="Primary Navigation"
        >
          <Link className="flex items-center gap-3 theme-text-primary" to="/" data-cursor-glow="interactive">
            <motion.img
              whileHover={iconHover}
              transition={iconHoverTransition}
              src={logoImage}
              alt="SkinScope AI"
              className="h-8 w-8 border border-white/10 object-cover"
            />
            <span className="text-lg font-semibold tracking-tight theme-text-primary">SkinScope AI</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm theme-text-secondary md:flex">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  [
                    "relative pb-1 text-[0.95rem] font-medium transition-colors duration-200 hover:text-mint-300",
                    "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:bg-mint-400/90 after:transition-transform after:duration-200",
                    isActive ? "text-mint-300 after:scale-x-100" : "theme-text-secondary after:scale-x-0 hover:after:scale-x-100",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              ref={themeToggleRef}
              type="button"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              onClick={toggleTheme}
              data-cursor-glow="interactive"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 theme-surface theme-card-hover theme-text-primary will-change-transform"
              style={themeMagnetic.style}
              onMouseMove={themeMagnetic.onMouseMove}
              onMouseLeave={themeMagnetic.onMouseLeave}
              {...buttonMotion}
            >
              <motion.span whileHover={iconHover} transition={iconHoverTransition} className="flex items-center justify-center">
                {theme === "dark" ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M12 4.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V5.5a.75.75 0 0 1 .75-.75Zm0 11a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Zm0 3.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V20a.75.75 0 0 1 .75-.75ZM5.47 6.53a.75.75 0 0 1 1.06 0l1.06 1.06A.75.75 0 1 1 6.53 8.65L5.47 7.59a.75.75 0 0 1 0-1.06Zm10.94 10.94a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06ZM4.75 12a.75.75 0 0 1 .75-.75H7a.75.75 0 0 1 0 1.5H5.5a.75.75 0 0 1-.75-.75Zm12.25 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 17 12ZM6.53 15.35a.75.75 0 0 1 1.06 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06Zm10.94-10.94a.75.75 0 0 1 1.06 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06Z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M14.53 3.53a.75.75 0 0 1 .8-.18 8.25 8.25 0 1 1-10.98 10.98.75.75 0 0 1 .98-.98 6.75 6.75 0 1 0 8.22-8.22.75.75 0 0 1-.02-1.6Z" />
                  </svg>
                )}
              </motion.span>
            </motion.button>

            <motion.button
              ref={menuButtonRef}
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center border border-white/5 bg-white/[0.04] theme-surface theme-text-primary transition-colors hover:border-mint-300/20 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
              data-cursor-glow="interactive"
              style={menuMagnetic.style}
              onMouseMove={menuMagnetic.onMouseMove}
              onMouseLeave={menuMagnetic.onMouseLeave}
              {...buttonMotion}
            >
              <span className="sr-only">Toggle menu</span>
              <span className="flex flex-col gap-1.5">
                <span className={`h-0.5 w-4 bg-current transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`h-0.5 w-4 bg-current transition-opacity ${mobileOpen ? "opacity-0" : "opacity-100"}`} />
                <span className={`h-0.5 w-4 bg-current transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
              </span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className={`sticky top-[57px] z-40 w-full border-b backdrop-blur-md lg:hidden ${
              theme === "dark" ? "theme-nav-shell" : "theme-nav-shell shadow-[0_18px_40px_rgba(148,163,184,0.12)]"
            }`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.26, ease: "easeInOut" }}
          >
            <div className="mx-auto max-w-7xl px-6 py-3 lg:px-12">
              <div className="grid gap-2">
                {navigationLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      [
                        "border-b border-white/[0.08] px-0 py-3 text-sm font-medium transition-colors duration-200 last:border-b-0",
                        isActive
                          ? "text-mint-300"
                          : "theme-text-secondary hover:text-mint-300",
                      ].join(" ")
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
