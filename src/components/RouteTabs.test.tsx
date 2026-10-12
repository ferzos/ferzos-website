import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockNextNavigation } from "@/__mocks__/next-navigation";
import RouteTabs from "./RouteTabs";

let mockPush: jest.Mock;

describe("RouteTabs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ({ push: mockPush } = mockNextNavigation());
  });

  it("should show the page content and active tab for the current route", () => {
    mockNextNavigation({ pathname: "/optimal-stopping", push: mockPush });
    const { getByRole, getByText } = render(
      <RouteTabs>
        <p>Optional stopping content</p>
      </RouteTabs>,
    );

    expect(
      getByRole("tab", { name: "Optional Stopping" }),
    ).toHaveAttribute("aria-selected", "true");
    expect(getByText("Optional stopping content")).toBeInTheDocument();
  });

  it("should navigate to the selected page when its tab is chosen", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(
      <RouteTabs>
        <p>Optional stopping content</p>
      </RouteTabs>,
    );

    await user.click(getByRole("tab", { name: "Optional Stopping" }));

    expect(mockPush).toHaveBeenCalledWith("/optimal-stopping");
  });
});