import { forwardRef } from "react";
import { Link } from "react-router-dom";

const variantClasses = {
  primary:
    "border border-mint-400/55 bg-gradient-to-r from-green-400 to-emerald-500 text-night-950 shadow-[0_10px_30px_rgba(53,201,139,0.18)] hover:scale-[1.02] hover:shadow-[0_16px_36px_rgba(53,201,139,0.24)] hover:from-green-300 hover:to-emerald-400",
  secondary:
    "theme-button-secondary border bg-transparent shadow-[0_10px_30px_rgba(2,10,17,0.12)] hover:bg-white/[0.1] hover:border-white/20",
  ghost:
    "border border-transparent bg-transparent text-[var(--text)] hover:bg-white/[0.05]",
};

const sizeClasses = {
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "min-h-12 px-6 py-3 text-sm",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-mint-400/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:scale-100";

const Button = forwardRef(function Button(
  { as: asProp, children, className = "", href, to, target, rel, size = "md", variant = "primary", ...props },
  ref
) {
  const classes = [baseClasses, sizeClasses[size], variantClasses[variant], className].filter(Boolean).join(" ");

  if (asProp === "label") {
    return (
      <label ref={ref} className={classes} {...props}>
        {children}
      </label>
    );
  }

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a ref={ref} href={href} target={target} rel={rel} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  );
});

export default Button;
