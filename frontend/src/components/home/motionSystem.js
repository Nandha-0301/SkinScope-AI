export const smoothEase = [0.2, 0, 0, 1];

export const inViewViewport = {
  once: true,
  margin: "-100px",
};

export const sectionReveal = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: smoothEase },
  },
};

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: smoothEase },
  },
};

export const introStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const headingReveal = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: smoothEase },
  },
};

export const cardHover = {
  y: -2,
};

export const cardHoverTransition = {
  duration: 0.25,
  ease: smoothEase,
};

export const buttonMotion = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.22, ease: smoothEase },
};

export const iconHover = {
  rotate: 2,
  scale: 1.02,
};

export const iconHoverTransition = {
  duration: 0.2,
  ease: smoothEase,
};

export const floatAnimation = {
  y: [0, -6, 0],
};

export const floatTransition = {
  duration: 10,
  repeat: Infinity,
  ease: "easeInOut",
};

export const cursorGlowSize = 240;

export const cursorGlowSpring = {
  stiffness: 50,
  damping: 20,
  mass: 0.6,
};

export const magneticPullFactor = 0.2;

export const magneticMaxOffset = 6;

export const magneticSpring = {
  stiffness: 220,
  damping: 22,
  mass: 0.4,
};

export const tiltMaxRotation = 1.5;

export const tiltTranslateFactor = 0.02;

export const tiltSpring = {
  stiffness: 110,
  damping: 22,
  mass: 0.5,
};

export const parallaxInputRange = [0, 600];

export const parallaxDepth = {
  backgroundSlow: [0, -12],
  backgroundFast: [0, -24],
  cardMedium: [0, -6],
  imageFast: [0, -20],
};

export const rippleDuration = 0.45;

export const aiLoaderDuration = 1.8;

export const shimmerDuration = 1.5;
