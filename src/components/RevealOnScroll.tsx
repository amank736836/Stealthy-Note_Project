"use client";

import { useEffect } from "react";

export default function RevealOnScroll() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    if (elements.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("reveal-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.classList.remove("reveal-pending");
          element.classList.add("reveal-visible");
          observer.unobserve(element);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
    );

    elements.forEach((element) => {
      const isInitiallyVisible =
        element.getBoundingClientRect().top < window.innerHeight * 0.92;

      if (isInitiallyVisible) {
        element.classList.add("reveal-visible");
      } else {
        element.classList.add("reveal-pending");
      }

      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
