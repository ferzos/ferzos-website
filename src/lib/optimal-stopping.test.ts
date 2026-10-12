import { calculate, formatDuration } from "./optimal-stopping";

describe("calculate", () => {
  it("should return a stopping distance of 3.68 km for a 10 km journey", () => {
    expect(calculate({ mode: "distance", value: 10 })).toEqual({ ok: true, text: "3.68 km" });
  });

  it("should return a stopping distance of 736 m for a 2 km journey", () => {
    expect(calculate({ mode: "distance", value: 2 })).toEqual({ ok: true, text: "736 m" });
  });

  it("should return a stopping time of 1 h 6 min when 3 hours are available", () => {
    expect(calculate({ mode: "time", value: 3, unit: "h" })).toEqual({ ok: true, text: "1 h 6 min" });
  });

  it("should return a stopping time of 1 min 50 s when 5 minutes are available", () => {
    expect(calculate({ mode: "time", value: 5, unit: "min" })).toEqual({ ok: true, text: "1 min 50 s" });
  });

  it("should return 4 shops when 10 shops are available", () => {
    expect(calculate({ mode: "objects", value: 10, name: "shops" })).toEqual({ ok: true, text: "4 shops" });
  });

  it("should return 1 shop when 3 shops are available", () => {
    expect(calculate({ mode: "objects", value: 3, name: "shops" })).toEqual({ ok: true, text: "1 shop" });
  });

  it("should return 4 objects when 10 objects are available and the name is blank", () => {
    expect(calculate({ mode: "objects", value: 10, name: " " })).toEqual({ ok: true, text: "4 objects" });
  });

  it("should return a whole-number error when the number of shops is fractional", () => {
    expect(calculate({ mode: "objects", value: 2.5, name: "shops" })).toEqual({
      ok: false,
      error: "Enter a whole number.",
    });
  });

  it.each([0, -1, NaN])("should return an unsuccessful result when the distance is %p", (value) => {
    expect(calculate({ mode: "distance", value }).ok).toBe(false);
  });
});

describe("formatDuration", () => {
  it("should return 0 s when the duration is zero", () => expect(formatDuration(0)).toBe("0 s"));
  it("should return 1 d 1 h when the duration is 90061 seconds", () => expect(formatDuration(90061)).toBe("1 d 1 h"));
});