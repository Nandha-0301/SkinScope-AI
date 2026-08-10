import Footer from "../home/Footer.jsx";

function MainLayout({ background = null, children, className = "", footerClassName = "" }) {
  return (
    <main className={`relative min-h-screen overflow-hidden ${className}`.trim()}>
      {background ?? (
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="theme-page-gradient absolute inset-0" />
          <div className="theme-page-glow absolute inset-0" />
        </div>
      )}

      <div className="relative z-10">
        {children}
        <Footer className={footerClassName} />
      </div>
    </main>
  );
}

export default MainLayout;
