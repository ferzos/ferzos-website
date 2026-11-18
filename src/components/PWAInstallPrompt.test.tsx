import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PWAInstallPrompt } from "./PWAInstallPrompt";
import { installPromptDismissedUntilKey } from "@/hooks/usePWAInstall";

const installMedia = (matches = false) => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  });
};

const offerInstall = (outcome: "accepted" | "dismissed" = "dismissed") => {
  const prompt = jest.fn().mockResolvedValue(undefined);
  const event = new Event("beforeinstallprompt", { cancelable: true });
  Object.assign(event, {
    prompt,
    userChoice: Promise.resolve({ outcome }),
  });

  act(() => {
    window.dispatchEvent(event);
  });
};

describe("PWAInstallPrompt", () => {
  beforeEach(() => {
    localStorage.clear();
    installMedia();
  });

  it("should offer install when the browser can install the app", () => {
    const { getByRole } = render(<PWAInstallPrompt />);

    offerInstall();

    expect(
      getByRole("heading", { name: "Install Ferzos" }),
    ).toBeInTheDocument();
    expect(getByRole("button", { name: "Install" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Later" })).toBeInTheDocument();
  });

  it("should hide the install offer on the next visit when Later is chosen", async () => {
    const user = userEvent.setup();
    const firstVisit = render(<PWAInstallPrompt />);

    offerInstall();
    await user.click(firstVisit.getByRole("button", { name: "Later" }));

    expect(
      firstVisit.queryByRole("heading", { name: "Install Ferzos" }),
    ).not.toBeInTheDocument();
    firstVisit.unmount();

    const nextVisit = render(<PWAInstallPrompt />);
    offerInstall();

    expect(
      nextVisit.queryByRole("heading", { name: "Install Ferzos" }),
    ).not.toBeInTheDocument();
  });

  it("should hide the install offer when a previous Later choice is still in effect", () => {
    localStorage.setItem(
      installPromptDismissedUntilKey,
      String(Date.now() + 60_000),
    );
    const { queryByRole } = render(<PWAInstallPrompt />);

    offerInstall();

    expect(
      queryByRole("heading", { name: "Install Ferzos" }),
    ).not.toBeInTheDocument();
  });

  it("should offer install again when a previous Later choice has expired", () => {
    localStorage.setItem(
      installPromptDismissedUntilKey,
      String(Date.now() - 1),
    );
    const { getByRole } = render(<PWAInstallPrompt />);

    offerInstall();

    expect(
      getByRole("heading", { name: "Install Ferzos" }),
    ).toBeInTheDocument();
  });

  it("should hide the install offer when the browser dialog fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    const view = render(<PWAInstallPrompt />);
    const event = new Event("beforeinstallprompt", { cancelable: true });
    Object.assign(event, {
      prompt: jest.fn().mockRejectedValue(new Error("install failed")),
      userChoice: Promise.resolve({ outcome: "accepted" }),
    });

    act(() => {
      window.dispatchEvent(event);
    });
    await user.click(view.getByRole("button", { name: "Install" }));

    expect(
      view.queryByRole("heading", { name: "Install Ferzos" }),
    ).not.toBeInTheDocument();
  });

  it("should hide the install offer on the next visit when the browser dialog is canceled", async () => {
    const user = userEvent.setup();
    const firstVisit = render(<PWAInstallPrompt />);

    offerInstall("dismissed");
    await user.click(firstVisit.getByRole("button", { name: "Install" }));

    expect(
      firstVisit.queryByRole("heading", { name: "Install Ferzos" }),
    ).not.toBeInTheDocument();
    firstVisit.unmount();

    const nextVisit = render(<PWAInstallPrompt />);
    offerInstall();

    expect(
      nextVisit.queryByRole("heading", { name: "Install Ferzos" }),
    ).not.toBeInTheDocument();
  });
});
