import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import IncidentDetailModal from "@/components/IncidentDetailModal";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/",
  redirect: vi.fn(),
}));

const incident = {
  id: "inc-1",
  service: "Lambda",
  region: "us-east-1",
  severity: "critical" as const,
  status: "monitoring" as const,
  title: "Timeouts on Lambda",
  timestamp: new Date(),
  provider: "aws" as const,
};

describe("IncidentDetailModal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("renders null when incident is null", () => {
    const { container } = render(
      <IncidentDetailModal incident={null} open={false} onClose={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders incident service name in title", () => {
    render(<IncidentDetailModal incident={incident} open={true} onClose={vi.fn()} />);
    expect(screen.getByTestId("incident-modal-title")).toHaveTextContent("Lambda");
  });

  it("timeline highlights correct step based on status", () => {
    render(<IncidentDetailModal incident={incident} open={true} onClose={vi.fn()} />);
    const step = screen.getByTestId("timeline-step-monitoring");
    expect(step).toHaveAttribute("data-active", "true");
  });

  it("copy button calls clipboard API and resets after 2 seconds", async () => {
    render(<IncidentDetailModal incident={incident} open={true} onClose={vi.fn()} />);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    const copyButton = screen.getByTestId("copy-command-0");
    await user.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(copyButton.querySelector(".text-green-400")).toBeTruthy();

    vi.advanceTimersByTime(2000);
    expect(copyButton.querySelector(".text-green-400")).toBeFalsy();
  });

  it("remediation panel is hidden by default and shows after click", async () => {
    render(<IncidentDetailModal incident={incident} open={true} onClose={vi.fn()} />);
    const user = userEvent.setup();

    expect(screen.queryByText("AI Remediation Plan")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("remediation-toggle"));
    expect(screen.getByText("AI Remediation Plan")).toBeVisible();
  });

  it("clears timeout on unmount", async () => {
    const clearSpy = vi.spyOn(global, "clearTimeout");
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    const { unmount } = render(
      <IncidentDetailModal incident={incident} open={true} onClose={vi.fn()} />
    );

    await user.click(screen.getByTestId("copy-command-0"));
    unmount();

    expect(clearSpy).toHaveBeenCalled();
  });
});
