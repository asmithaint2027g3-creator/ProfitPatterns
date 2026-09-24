import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms
  duration?: number; // ms
  direction?: "up" | "down" | "left" | "right" | "fade";
  threshold?: number;
  staggerChildren?: boolean;
  staggerDelay?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 500,
  direction = "up",
  threshold = 0.15,
  staggerChildren = false,
  staggerDelay = 80,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const currentEl = elementRef.current;
    if (currentEl) {
      // Check if already visible or near viewport to avoid blank space
      const rect = currentEl.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        setIsVisible(true);
        return;
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold: Math.min(threshold, 0.05),
        rootMargin: "150px 0px 50px 0px",
      }
    );

    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [threshold]);

  const getTransform = () => {
    switch (direction) {
      case "up":
        return "translateY(24px)";
      case "down":
        return "translateY(-24px)";
      case "left":
        return "translateX(24px)";
      case "right":
        return "translateX(-24px)";
      case "fade":
      default:
        return "none";
    }
  };

  const style: React.CSSProperties = {
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    transitionDelay: `${delay}ms`,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "none" : getTransform(),
    willChange: "opacity, transform",
  };

  return (
    <div ref={elementRef} className={cn(className)} style={style}>
      {children}
    </div>
  );
}

/**
 * Animated Container that automatically staggers direct children
 */
export function StaggerReveal({
  children,
  className,
  staggerMs = 100,
  baseDelay = 0,
}: {
  children: React.ReactNode[];
  className?: string;
  staggerMs?: number;
  baseDelay?: number;
}) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <ScrollReveal delay={baseDelay + index * staggerMs} direction="up">
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
