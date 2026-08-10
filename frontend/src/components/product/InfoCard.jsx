import TiltCard from "../TiltCard.jsx";

function InfoCard({
  eyebrow,
  title,
  description,
  children,
  className = "",
  contentClassName = "",
  titleClassName = "",
  descriptionClassName = "",
  eyebrowClassName = "",
  tilt = false,
}) {
  return (
    <TiltCard
      as="article"
      tilt={tilt}
      className={`card-base grid gap-4 p-6 ${className}`.trim()}
    >
      <div className={contentClassName}>
        {eyebrow ? <p className={`eyebrow-text text-mint-300/80 ${eyebrowClassName}`.trim()}>{eyebrow}</p> : null}
        {title ? <h3 className={`font-display text-xl font-semibold tracking-tight theme-text-primary sm:text-2xl ${titleClassName}`.trim()}>{title}</h3> : null}
        {description ? <p className={`theme-text-secondary text-sm leading-7 sm:text-base ${descriptionClassName}`.trim()}>{description}</p> : null}
        {children}
      </div>
    </TiltCard>
  );
}

export default InfoCard;
