import { Link } from "react-router-dom";
import { navigationLinks } from "../../constants/navigationLinks.js";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/your-org/SkinScope-AI" },
  { label: "Email", href: "mailto:skinscope.ai@gmail.com" },
  { label: "Contact", to: "/contact" },
];

function Footer({ className = "" }) {
  return (
    <footer className={`theme-footer-shell section-spacing w-full border-t border-white/10 ${className}`.trim()}>
      <div className="layout-shell py-16">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div className="max-w-sm">
            <Link to="/" className="theme-text-primary text-lg font-semibold transition-colors duration-300 hover:text-mint-300">
              SkinScope AI
            </Link>
            <p className="theme-text-tertiary mt-4 text-sm leading-7">
              SkinScope AI helps people review visible skin concerns earlier with calmer, clearer AI-supported guidance.
            </p>
          </div>

          <div>
            <h4 className="theme-text-secondary mb-4 text-sm font-medium uppercase tracking-wider">Quick Links</h4>
            <ul className="theme-text-tertiary space-y-3 text-sm">
              {navigationLinks.map((link) => (
                <li key={link.to}>
                  <Link className="transition-colors duration-300 hover:text-mint-300" to={link.to}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="theme-text-secondary mb-4 text-sm font-medium uppercase tracking-wider">Contact</h4>
            <div className="theme-text-tertiary space-y-3 text-sm">
              <a className="block transition-colors duration-300 hover:text-mint-300" href="mailto:skinscope.ai@gmail.com">
                skinscope.ai@gmail.com
              </a>
              <a className="block transition-colors duration-300 hover:text-mint-300" href="tel:+919535078979">
                +91 7483327794
              </a>
            </div>
          </div>

          <div>
            <h4 className="theme-text-secondary mb-4 text-sm font-medium uppercase tracking-wider">Social</h4>
            <ul className="theme-text-tertiary space-y-3 text-sm">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  {"to" in link ? (
                    <Link className="transition-colors duration-300 hover:text-mint-300" to={link.to}>
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      className="transition-colors duration-300 hover:text-mint-300"
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="theme-text-tertiary mt-10 border-t border-white/10 pt-10 text-center text-sm">
          <p>&copy; 2026 SkinScope AI. All rights reserved.</p>
          <p className="mt-3 text-xs">Built for early awareness. Always consult a medical professional for diagnosis.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
