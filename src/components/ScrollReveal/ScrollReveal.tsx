"use client";

import { useEffect, useRef, useState } from "react";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  visibleClassName?: string;
  threshold?: number;
  rootMargin?: string;
  style?: React.CSSProperties;
};

export default function ScrollReveal({
  children,
  className = "",
  visibleClassName = "",
  threshold = 0.18,
  rootMargin = "0px 0px -18% 120%",
  style,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, rootMargin, threshold]);

  return (
    <div
      ref={ref}
      className={[className, isVisible ? visibleClassName : ""].join(" ").trim()}
      style={style}
    >
      {children}
    </div>
  );
}
