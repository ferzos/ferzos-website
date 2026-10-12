import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StopCalculator } from "./StopCalculator";

describe("StopCalculator", () => {
  it("should show the stopping distance for the default journey", () => {
    const { getByText } = render(<StopCalculator />);

    expect(getByText("3.68 km")).toBeInTheDocument();
  });

  it("should update the stopping distance when the remaining distance changes", async () => {
    const user = userEvent.setup();
    const { getByRole, getByText } = render(<StopCalculator />);

    const remainingInput = getByRole("spinbutton", { name: "Remaining" });
    await user.clear(remainingInput);
    await user.type(remainingInput, "2");

    expect(getByText("736 m")).toBeInTheDocument();
  });

  it("should show a validation error when a non-whole object count is entered", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<StopCalculator />);

    await user.click(getByRole("tab", { name: "Objects" }));
    const remainingInput = getByRole("spinbutton", { name: "Remaining" });
    await user.clear(remainingInput);
    await user.type(remainingInput, "2.5");

    expect(getByRole("alert")).toHaveTextContent("Enter a whole number.");
  });

  it("should show the stopping time when time mode is selected", async () => {
    const user = userEvent.setup();
    const { getByRole, getByText } = render(<StopCalculator />);

    await user.click(getByRole("tab", { name: "Time" }));

    expect(getByText("3 min 41 s")).toBeInTheDocument();
    expect(getByRole("combobox", { name: "Unit" })).toBeInTheDocument();
  });

  it("should include the entered name in the stopping object count", async () => {
    const user = userEvent.setup();
    const { getByRole, getByText } = render(<StopCalculator />);

    await user.click(getByRole("tab", { name: "Objects" }));
    await user.type(getByRole("textbox", { name: "What you are counting" }), "shops");

    expect(getByText("4 shops")).toBeInTheDocument();
  });
});
