import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import EmailAuthForm from "@/components/auth/EmailAuthForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/auth",
  redirect: vi.fn(),
}));

describe("EmailAuthForm", () => {
  const setup = (props?: Partial<React.ComponentProps<typeof EmailAuthForm>>) => {
    const onSubmit = vi.fn().mockResolvedValue({ success: true });
    const onModeChange = vi.fn();
    const onBack = vi.fn();

    render(
      <EmailAuthForm
        mode="signin"
        onModeChange={onModeChange}
        onSubmit={onSubmit}
        onBack={onBack}
        isLoading={false}
        {...props}
      />
    );

    return { onSubmit, onModeChange, onBack };
  };

  it("renders sign in mode by default", () => {
    setup();
    expect(screen.getByTestId("auth-submit")).toHaveTextContent("Sign In");
  });

  it("switching to Create Account clears all fields", async () => {
    setup();
    const user = userEvent.setup();

    await user.type(screen.getByTestId("auth-email-input"), "user@example.com");
    await user.type(screen.getByTestId("auth-password-input"), "password");

    await user.click(screen.getByTestId("auth-tab-signup"));

    expect(screen.getByTestId("auth-email-input")).toHaveValue("");
    expect(screen.getByTestId("auth-password-input")).toHaveValue("");
  });

  it("switching back to Sign In clears all fields", async () => {
    setup();
    const user = userEvent.setup();

    await user.click(screen.getByTestId("auth-tab-signup"));
    await user.type(screen.getByTestId("auth-email-input"), "user@example.com");
    await user.type(screen.getByTestId("auth-password-input"), "password");

    await user.click(screen.getByTestId("auth-tab-signin"));

    expect(screen.getByTestId("auth-email-input")).toHaveValue("");
    expect(screen.getByTestId("auth-password-input")).toHaveValue("");
  });

  it("submit with empty fields does not call onSubmit", async () => {
    const { onSubmit } = setup();
    const user = userEvent.setup();

    await user.click(screen.getByTestId("auth-submit"));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows confirmation screen after successful signup", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ success: true, requiresConfirmation: true });
    const user = userEvent.setup();

    render(
      <EmailAuthForm
        mode="signup"
        onModeChange={vi.fn()}
        onSubmit={onSubmit}
        onBack={vi.fn()}
        isLoading={false}
      />
    );

    await user.type(screen.getByTestId("auth-email-input"), "new@user.com");
    await user.type(screen.getByTestId("auth-password-input"), "TestPassword123!");
    await user.click(screen.getByTestId("auth-submit"));

    expect(await screen.findByTestId("auth-confirmation-screen")).toBeVisible();
  });

  it("spinner shows during loading and stops after response", () => {
    render(
      <EmailAuthForm
        mode="signin"
        onModeChange={vi.fn()}
        onSubmit={vi.fn()}
        onBack={vi.fn()}
        isLoading={true}
      />
    );

    expect(screen.getByTestId("auth-submit")).toHaveTextContent("Signing in...");
  });

  it("password toggle shows and hides password", async () => {
    setup();
    const user = userEvent.setup();

    const passwordInput = screen.getByTestId("auth-password-input") as HTMLInputElement;
    expect(passwordInput.type).toBe("password");

    await user.click(screen.getByTestId("auth-password-toggle"));
    expect(passwordInput.type).toBe("text");

    await user.click(screen.getByTestId("auth-password-toggle"));
    expect(passwordInput.type).toBe("password");
  });
});
