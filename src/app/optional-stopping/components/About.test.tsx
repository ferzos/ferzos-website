import { render } from "@testing-library/react";
import { AboutSection } from "./About";

describe("AboutSection", () => {
  it("should explain the secretary problem", () => {
    const { getByRole, getByText } = render(<AboutSection />);

    expect(
      getByRole("heading", { name: "What is the secretary problem?" }),
    ).toBeInTheDocument();
    expect(
      getByText(/single best option from a sequential stream of candidates/),
    ).toBeInTheDocument();
  });

  it("should explain the 37% rule and its success probability", () => {
    const { getByRole, getByText } = render(<AboutSection />);

    expect(
      getByRole("heading", { name: "What is the 37% rule?" }),
    ).toBeInTheDocument();
    expect(getByText(/Explore the first 37%/)).toBeInTheDocument();
    expect(
      getByText(/about a 37% chance of ending up with the very best option/),
    ).toBeInTheDocument();
  });
});
