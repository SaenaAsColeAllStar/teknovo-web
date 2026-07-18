"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

export type ClickSparkEasing = "linear" | "ease-in" | "ease-out" | "ease-in-out";

export type ClickSparkProps = {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: ClickSparkEasing;
  extraScale?: number;
  children?: ReactNode;
  /** Extra class on the wrapper (e.g. min-h-screen for full-page coverage). */
  className?: string;
};

type Spark = {
  x: number;
  y: number;
  angle: number;
  startTime: number;
};

/**
 * React Bits ClickSpark (JS + CSS / inline-style variant) — canvas spark bursts on click.
 * Fixed full-viewport overlay so sparks paint above page chrome; clicks via document capture.
 * Respects `prefers-reduced-motion: reduce` (no sparks / no animation loop).
 * RAF only runs while sparks are alive (avoids perpetual main-thread work / INP drag).
 */
export function ClickSpark({
  sparkColor = "#fff",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1.0,
  children,
  className,
}: ClickSparkProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const animatingRef = useRef(false);
  const reduceMotionRef = useRef(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reduceMotionRef.current = media.matches;
      setReduceMotion(media.matches);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let resizeTimeout: ReturnType<typeof setTimeout>;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      const nextW = Math.max(1, Math.floor(width * dpr));
      const nextH = Math.max(1, Math.floor(height * dpr));

      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW;
        canvas.height = nextH;
      }

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw in CSS pixels; device pixels handled by backing store + transform.
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    resizeCanvas();
    window.addEventListener("resize", handleResize);
    document.addEventListener("astro:page-load", resizeCanvas);
    document.addEventListener("astro:after-swap", resizeCanvas);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("astro:page-load", resizeCanvas);
      document.removeEventListener("astro:after-swap", resizeCanvas);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case "linear":
          return t;
        case "ease-in":
          return t * t;
        case "ease-in-out":
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing],
  );

  const easeFuncRef = useRef(easeFunc);
  easeFuncRef.current = easeFunc;

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      // Reset any residual transform then clear in device pixels.
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  useEffect(() => {
    if (!reduceMotion) return;
    sparksRef.current = [];
    animatingRef.current = false;
    clearCanvas();
  }, [reduceMotion, clearCanvas]);

  const startAnimating = useCallback(() => {
    if (animatingRef.current || reduceMotionRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    animatingRef.current = true;

    const draw = (timestamp: number) => {
      // Clear in CSS-pixel space (transform already applied).
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) {
          return false;
        }

        const progress = elapsed / duration;
        const eased = easeFuncRef.current(progress);

        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      if (sparksRef.current.length > 0) {
        requestAnimationFrame(draw);
      } else {
        animatingRef.current = false;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
    };

    requestAnimationFrame(draw);
  }, [sparkColor, sparkSize, sparkRadius, duration, extraScale]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (reduceMotionRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      // Fixed viewport canvas: client coords map 1:1 to CSS-pixel canvas space.
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const now = performance.now();
      const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
      }));

      sparksRef.current.push(...newSparks);
      startAnimating();
    };

    // Capture phase so clicks on cards/nav/sections still spawn sparks.
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [sparkCount, startAnimating]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100%",
        height: "100%",
      }}
    >
      {children}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 9999,
          display: "block",
          userSelect: "none",
          pointerEvents: "none",
        }}
        aria-hidden
      />
    </div>
  );
}
