import { useEffect, useRef } from "react";
import "./Starfield.css";

const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (import.meta.env.DEV) {
      // Debug verification that the component mounts.
      console.log("Starfield mounted");
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId;
    let w;
    let h;

    const STAR_COUNTS = { background: 280, mid: 180, foreground: 90 };
    const LERP_FACTOR = 0.05;
    const CURSOR_RADIUS = 150;
    const CURSOR_ATTRACTION_STRENGTH = 0.15;
    const CURSOR_BRIGHTNESS_BOOST = 0.12;

    let layers = { background: [], mid: [], foreground: [] };
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let cursorScreenX = -1000;
    let cursorScreenY = -1000;
    let time = 0;
    let shootingStars = [];
    let clusterPulse = null;

    const LAYER_CONFIG = {
      background: {
        parallaxStrength: 6,
        sizeRange: [0.3, 0.7],
        baseBrightnessRange: [0.3, 0.48],
        blinkSpeedRange: [0.15, 0.4],
        variationRange: [0.06, 0.1],
        noiseRange: [0.008, 0.02],
        idleDriftFactor: 0.25,
        attractionFactor: 0.3,
      },
      mid: {
        parallaxStrength: 18,
        sizeRange: [0.5, 1.1],
        baseBrightnessRange: [0.45, 0.65],
        blinkSpeedRange: [0.3, 0.7],
        variationRange: [0.08, 0.14],
        noiseRange: [0.015, 0.035],
        idleDriftFactor: 0.55,
        attractionFactor: 0.6,
      },
      foreground: {
        parallaxStrength: 35,
        sizeRange: [0.8, 1.8],
        baseBrightnessRange: [0.55, 0.78],
        blinkSpeedRange: [0.5, 1.0],
        variationRange: [0.12, 0.22],
        noiseRange: [0.025, 0.055],
        idleDriftFactor: 1.0,
        attractionFactor: 1.0,
      },
    };

    const getStarColor = () => {
      const roll = Math.random();
      if (roll < 0.95) {
        return { r: 255, g: 255, b: 255 };
      }
      if (roll < 0.98) {
        return { r: 215, g: 230, b: 255 };
      }
      return { r: 225, g: 255, b: 235 };
    };

    const randomRange = (min, max) => Math.random() * (max - min) + min;
    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

    const noise = (seed, t) => {
      const x = Math.sin(seed * 12.9898 + t * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };

    const createStarsForLayer = (layerName, count) => {
      const config = LAYER_CONFIG[layerName];
      return new Array(count)
        .fill(0)
        .map((_, index) => {
          const color = getStarColor();
          return {
            x: Math.random() * w,
            y: Math.random() * h,
            baseX: 0,
            baseY: 0,
            offsetX: 0,
            offsetY: 0,
            size: randomRange(config.sizeRange[0], config.sizeRange[1]),
            baseBrightness: randomRange(config.baseBrightnessRange[0], config.baseBrightnessRange[1]),
            blinkSpeed1: randomRange(config.blinkSpeedRange[0], config.blinkSpeedRange[1]),
            blinkSpeed2: randomRange(config.blinkSpeedRange[0] * 0.3, config.blinkSpeedRange[1] * 0.5),
            blinkSpeed3: randomRange(config.noiseRange[0], config.noiseRange[1]),
            phase1: Math.random() * Math.PI * 2,
            phase2: Math.random() * Math.PI * 2,
            phase3: Math.random() * Math.PI * 2,
            variation1: randomRange(config.variationRange[0], config.variationRange[1]),
            variation2: randomRange(config.variationRange[0] * 0.4, config.variationRange[1] * 0.5),
            noiseSeed: Math.random() * 10000,
            noiseAmplitude: randomRange(0.02, 0.06),
            color,
            clusterBoost: 0,
            index,
          };
        })
        .map((star) => ({ ...star, baseX: star.x, baseY: star.y }));
    };

    const createShootingStar = () => {
      const startX = Math.random() * w * 0.7;
      const startY = Math.random() * h * 0.4;
      const angle = randomRange(Math.PI * 0.12, Math.PI * 0.32);
      const speed = randomRange(10, 16);
      const length = randomRange(100, 180);

      return {
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length,
        alpha: 0,
        maxAlpha: randomRange(0.12, 0.28),
        life: 0,
        maxLife: Math.floor(randomRange(50, 90)),
        width: randomRange(0.8, 1.5),
      };
    };

    const createClusterPulse = () => {
      const allStars = [...layers.foreground, ...layers.mid.slice(0, 20)];
      if (allStars.length < 5) return null;

      const centerStar = allStars[Math.floor(Math.random() * allStars.length)];
      const clusterStars = [];
      const clusterCount = Math.floor(randomRange(3, 6));

      allStars.forEach((star) => {
        if (clusterStars.length >= clusterCount) return;
        const dx = star.baseX - centerStar.baseX;
        const dy = star.baseY - centerStar.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          clusterStars.push(star);
        }
      });

      if (clusterStars.length < 2) return null;

      return {
        stars: clusterStars,
        life: 0,
        maxLife: randomRange(120, 200),
        maxBoost: randomRange(0.12, 0.2),
      };
    };

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      w = canvas.width;
      h = canvas.height;

      const isMobile = w < 768;
      const factor = isMobile ? 0.5 : 1;

      layers = {
        background: createStarsForLayer("background", Math.floor(STAR_COUNTS.background * factor)),
        mid: createStarsForLayer("mid", Math.floor(STAR_COUNTS.mid * factor)),
        foreground: createStarsForLayer("foreground", Math.floor(STAR_COUNTS.foreground * factor)),
      };

      shootingStars = [];
      clusterPulse = null;
    };

    const handleResize = () => init();

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / w) * 2 - 1;
      targetMouseY = (e.clientY / h) * 2 - 1;
      cursorScreenX = e.clientX;
      cursorScreenY = e.clientY;
    };

    const updateClusterPulse = () => {
      if (!clusterPulse && Math.random() < 0.0003) {
        clusterPulse = createClusterPulse();
      }

      if (clusterPulse) {
        clusterPulse.life++;
        const lifeRatio = clusterPulse.life / clusterPulse.maxLife;

        let boost = 0;
        if (lifeRatio < 0.3) {
          boost = (lifeRatio / 0.3) * clusterPulse.maxBoost;
        } else if (lifeRatio > 0.7) {
          boost = ((1 - lifeRatio) / 0.3) * clusterPulse.maxBoost;
        } else {
          boost = clusterPulse.maxBoost;
        }

        clusterPulse.stars.forEach((star) => {
          star.clusterBoost = boost;
        });

        if (clusterPulse.life >= clusterPulse.maxLife) {
          clusterPulse.stars.forEach((star) => {
            star.clusterBoost = 0;
          });
          clusterPulse = null;
        }
      }
    };

    const renderLayer = (layerName, idleDriftX, idleDriftY) => {
      const config = LAYER_CONFIG[layerName];
      const stars = layers[layerName];

      stars.forEach((star) => {
        const parallaxX = (mouseX + idleDriftX * config.idleDriftFactor) * config.parallaxStrength;
        const parallaxY = (mouseY + idleDriftY * config.idleDriftFactor) * config.parallaxStrength;

        let x = star.baseX + parallaxX + star.offsetX;
        let y = star.baseY + parallaxY + star.offsetY;

        x = ((x % w) + w) % w;
        y = ((y % h) + h) % h;

        const dx = cursorScreenX - x;
        const dy = cursorScreenY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CURSOR_RADIUS && dist > 0) {
          const falloff = 1 - dist / CURSOR_RADIUS;
          const attractForce = falloff * falloff * CURSOR_ATTRACTION_STRENGTH * config.attractionFactor;
          star.offsetX += (dx / dist) * attractForce;
          star.offsetY += (dy / dist) * attractForce;
        }

        star.offsetX *= 0.98;
        star.offsetY *= 0.98;

        const blink1 = Math.sin(time * star.blinkSpeed1 + star.phase1) * star.variation1;
        const blink2 = Math.sin(time * star.blinkSpeed2 + star.phase2) * star.variation2;
        const blink3 = Math.sin(time * star.blinkSpeed3 + star.phase3) * 0.03;
        const noiseVal = (noise(star.noiseSeed, time * 0.5) - 0.5) * star.noiseAmplitude;

        let alpha = star.baseBrightness + blink1 + blink2 + blink3 + noiseVal;

        if (dist < CURSOR_RADIUS) {
          const falloff = 1 - dist / CURSOR_RADIUS;
          const boost = falloff * falloff * CURSOR_BRIGHTNESS_BOOST;
          alpha += boost;
        }

        alpha += star.clusterBoost;
        alpha = clamp(alpha, 0, 1);

        const { r, g, b } = star.color;
        ctx.beginPath();
        ctx.arc(x + star.offsetX, y + star.offsetY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();
      });
    };

    const renderShootingStars = () => {
      if (Math.random() < 0.0008 && shootingStars.length < 1) {
        shootingStars.push(createShootingStar());
      }

      shootingStars = shootingStars.filter((star) => {
        star.life++;
        star.x += star.vx;
        star.y += star.vy;

        const lifeRatio = star.life / star.maxLife;
        if (lifeRatio < 0.15) {
          star.alpha = (lifeRatio / 0.15) * star.maxAlpha;
        } else if (lifeRatio > 0.6) {
          star.alpha = ((1 - lifeRatio) / 0.4) * star.maxAlpha;
        } else {
          star.alpha = star.maxAlpha;
        }

        const mag = Math.sqrt(star.vx * star.vx + star.vy * star.vy);
        const tailX = star.x - (star.vx / mag) * star.length;
        const tailY = star.y - (star.vy / mag) * star.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(0.6, `rgba(220, 235, 255, ${star.alpha * 0.4})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${star.alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(star.x, star.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = star.width;
        ctx.lineCap = "round";
        ctx.stroke();

        return star.life < star.maxLife && star.x < w + 200 && star.y < h + 200;
      });
    };

    const renderNebulaGlow = () => {
      const breathe = Math.sin(time * 0.0004) * 0.12 + 0.88;

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      const heroGlow = ctx.createRadialGradient(w * 0.5, h * 0.32, 0, w * 0.5, h * 0.32, w * 0.45 * breathe);
      heroGlow.addColorStop(0, "rgba(25, 55, 75, 0.035)");
      heroGlow.addColorStop(0.6, "rgba(18, 40, 55, 0.02)");
      heroGlow.addColorStop(1, "transparent");
      ctx.fillStyle = heroGlow;
      ctx.fillRect(0, 0, w, h);

      const accentGlow = ctx.createRadialGradient(w * 0.22, h * 0.55, 0, w * 0.22, h * 0.55, w * 0.32 * breathe);
      accentGlow.addColorStop(0, "rgba(25, 65, 45, 0.025)");
      accentGlow.addColorStop(1, "transparent");
      ctx.fillStyle = accentGlow;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();
    };

    const render = () => {
      time += 0.016;

      ctx.fillStyle = "#020408";
      ctx.fillRect(0, 0, w, h);

      mouseX += (targetMouseX - mouseX) * LERP_FACTOR;
      mouseY += (targetMouseY - mouseY) * LERP_FACTOR;

      const idleDriftX = Math.sin(time * 0.05) * 0.08;
      const idleDriftY = Math.cos(time * 0.04) * 0.06;

      updateClusterPulse();
      renderNebulaGlow();
      renderLayer("background", idleDriftX, idleDriftY);
      renderLayer("mid", idleDriftX, idleDriftY);
      renderLayer("foreground", idleDriftX, idleDriftY);
      renderShootingStars();

      animationFrameId = requestAnimationFrame(render);
    };

    init();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="starfield-canvas" />
      <div className="starfield-vignette" />
    </>
  );
};

export default Starfield;
