import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CostBenefitAnalysis } from "./CostBenefitAnalysis";

type View = ReturnType<typeof render>;

const change = async (
  user: ReturnType<typeof userEvent.setup>,
  view: View,
  label: string,
  value: string,
) => {
  const input = view.getByLabelText(label);
  await user.clear(input);
  await user.type(input, value);
};

const click = async (
  user: ReturnType<typeof userEvent.setup>,
  view: View,
  name: string,
) => user.click(view.getByRole("button", { name }));

const ranking = (view: View) =>
  within(view.getByRole("list", { name: "Ranking" })).getAllByRole("listitem");

const fillExample = async (
  user: ReturnType<typeof userEvent.setup>,
  view: View,
) => {
  const [optionA, optionB] = view.getAllByLabelText("Option name");
  await user.type(optionA, "Shoe A");
  await user.type(optionB, "Shoe B");

  const names = view.getAllByLabelText("Variable name");
  await user.type(names[0], "Comfort");
  await user.type(names[1], "Price");
  await user.type(names[2], "Warranty");
  await user.selectOptions(view.getByLabelText("Direction for Price"), "lower");

  await change(user, view, "Shoe A, Comfort", "8");
  await change(user, view, "Shoe A, Price", "3");
  await change(user, view, "Shoe A, Warranty", "5");
  await change(user, view, "Shoe B, Comfort", "6");
  await change(user, view, "Shoe B, Price", "9");
  await change(user, view, "Shoe B, Warranty", "5");
};

describe("CostBenefitAnalysis", () => {
  it("should render blank placeholders before ratings are entered", () => {
    const view = render(<CostBenefitAnalysis />);

    expect(view.getAllByLabelText("Option name")).toHaveLength(2);
    expect(view.getAllByLabelText("Variable name")).toHaveLength(3);
    expect(view.getByPlaceholderText("e.g. Shoe A")).toBeInTheDocument();
    expect(view.getByPlaceholderText("e.g. Price")).toBeInTheDocument();

    const ratings = view.getAllByPlaceholderText("1-10") as HTMLInputElement[];
    expect(ratings).toHaveLength(6);
    expect(ratings.every((input) => input.value === "")).toBe(true);
    expect(
      view.getByText("Rate your options from 1 to 10 to see the ranking."),
    ).toBeInTheDocument();
  });

  it("should rank options by their average rating", async () => {
    const user = userEvent.setup();
    const view = render(<CostBenefitAnalysis />);
    await fillExample(user, view);

    const items = ranking(view);
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain("Shoe A");
    expect(items[0].textContent).toContain("7.0");
    expect(items[1].textContent).toContain("Shoe B");
    expect(items[1].textContent).toContain("4.3");
  });

  it("should flag invalid ratings and count them as zero", async () => {
    const user = userEvent.setup();
    const view = render(<CostBenefitAnalysis />);
    await fillExample(user, view);
    await change(user, view, "Shoe A, Comfort", "11");

    expect(view.getByLabelText("Shoe A, Comfort")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(
      view.getByText(
        "Empty or invalid cells (not 1-10) count as 0 for that variable.",
      ),
    ).toBeInTheDocument();
    const shoeA = ranking(view).find((item) =>
      item.textContent?.includes("Shoe A"),
    );
    expect(shoeA?.textContent).toContain("4.3");
  });

  it("should add a variable card and focus its name field", async () => {
    const user = userEvent.setup();
    const view = render(<CostBenefitAnalysis />);
    await click(user, view, "Add variable");

    const names = view.getAllByLabelText("Variable name");
    expect(names).toHaveLength(4);
    expect(view.getAllByPlaceholderText("1-10")).toHaveLength(8);
    expect(document.activeElement).toBe(names[3]);
  });

  it("should add an option row and focus its name field", async () => {
    const user = userEvent.setup();
    const view = render(<CostBenefitAnalysis />);
    await click(user, view, "Add option");

    const names = view.getAllByLabelText("Option name");
    expect(names).toHaveLength(3);
    expect(view.getAllByPlaceholderText("1-10")).toHaveLength(9);
    expect(document.activeElement).toBe(names[2]);
  });

  it("should remove an option and its ratings", async () => {
    const user = userEvent.setup();
    const view = render(<CostBenefitAnalysis />);
    await fillExample(user, view);
    await click(user, view, "Remove Shoe B");

    expect(view.queryByDisplayValue("Shoe B")).not.toBeInTheDocument();
    expect(view.getAllByPlaceholderText("1-10")).toHaveLength(3);
  });

  it("should preserve a single option when its remove button is disabled", async () => {
    const user = userEvent.setup();
    const view = render(<CostBenefitAnalysis />);
    await click(user, view, "Remove Option 2");

    expect(view.getAllByLabelText("Option name")).toHaveLength(1);
    expect(
      view.getByText("Add at least two options to compare."),
    ).toBeInTheDocument();
  });

  it("should keep at least one variable", async () => {
    const user = userEvent.setup();
    const view = render(<CostBenefitAnalysis />);
    await click(user, view, "Remove Variable 2");
    await click(user, view, "Remove Variable 2");

    expect(view.getAllByLabelText("Variable name")).toHaveLength(1);
  });
});
