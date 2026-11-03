import { useCallback, useEffect, useState } from "react";

const CARD_GAP = 12;

/** Tracks scroll edges and moves the variable row one card at a time. */
export function useCarousel(contentKey: unknown) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [edges, setEdges] = useState({ canPrev: false, canNext: false });

  const measure = useCallback(() => {
    if (!element) return;
    const canPrev = element.scrollLeft > 2;
    const canNext = element.scrollLeft < element.scrollWidth - element.clientWidth - 2;
    setEdges((previous) =>
      previous.canPrev === canPrev && previous.canNext === canNext
        ? previous
        : { canPrev, canNext }
    );
  }, [element]);

  useEffect(() => {
    if (!element) return;
    const frame = requestAnimationFrame(measure);
    element.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure, contentKey, element]);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    if (!element) return;
    const card = element.firstElementChild as HTMLElement | null;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    element.scrollBy?.({
      left: direction * ((card?.offsetWidth ?? 0) + CARD_GAP),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [element]);

  return { setElement, canPrev: edges.canPrev, canNext: edges.canNext, scrollByCard };
}
