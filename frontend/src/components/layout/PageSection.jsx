function PageSection({ as: Component = "section", first = false, className = "", innerClassName = "", children }) {
  return (
    <Component className={`${first ? "mt-8" : "section-spacing"} ${className}`.trim()}>
      <div className={`layout-shell ${innerClassName}`.trim()}>{children}</div>
    </Component>
  );
}

export default PageSection;
