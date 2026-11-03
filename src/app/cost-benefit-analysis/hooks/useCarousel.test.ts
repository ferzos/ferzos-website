import { act, fireEvent, renderHook } from "@testing-library/react";

import { useCarousel } from "./useCarousel";

const setMetric = (element: HTMLElement, name: string, value: number) => {
  Object.defineProperty(element, name, { configurable: true, value });
};

describe("useCarousel", () => {
  it("should expose available scroll directions from the element's position", () => {
    const { result } = renderHook(() => useCarousel(3));
    const element = document.createElement("div");

    setMetric(element, "scrollWidth", 600);
    setMetric(element, "clientWidth", 300);

    act(() => result.current.setElement(element));
    fireEvent.scroll(element);
    expect(result.current.canPrev).toBe(false);
    expect(result.current.canNext).toBe(true);

    setMetric(element, "scrollLeft", 300);
    fireEvent.scroll(element);

    expect(result.current.canPrev).toBe(true);
    expect(result.current.canNext).toBe(false);
  });

  it("should scroll by one card and its gap in the requested direction", () => {
    const { result } = renderHook(() => useCarousel(3));
    const element = document.createElement("div");
    const card = document.createElement("div");
    const scrollBy = jest.fn();

    setMetric(card, "offsetWidth", 120);
    Object.defineProperty(element, "firstElementChild", { configurable: true, value: card });
    Object.defineProperty(element, "scrollBy", { configurable: true, value: scrollBy });
    act(() => result.current.setElement(element));

    act(() => result.current.scrollByCard(1));
    expect(scrollBy).toHaveBeenCalledWith({ left: 132, behavior: "smooth" });

    act(() => result.current.scrollByCard(-1));
    expect(scrollBy).toHaveBeenLastCalledWith({ left: -132, behavior: "smooth" });
  });
});
