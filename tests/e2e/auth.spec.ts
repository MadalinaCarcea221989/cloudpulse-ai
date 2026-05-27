import { test, expect } from "@playwright/test";

const baseEmail = process.env.E2E_TEST_EMAIL || "e2e-test-user@cloudpulse.test";
const basePassword = process.env.E2E_TEST_PASSWORD || "TestPassword123!";

const uniqueEmail = () => `e2e+${Date.now()}@cloudpulse.test`;

test.describe("Auth (logged out)", () => {
  test.use({ storageState: undefined });

  test("Sign up with new email shows confirmation screen", async ({ page }) => {
    await page.goto("/auth");
    await page.waitForLoadState("networkidle");

    await page.getByTestId("auth-email-button").click();
    await page.getByTestId("auth-tab-signup").click();

    const email = uniqueEmail();
    await page.getByTestId("auth-email-input").fill(email);
    await page.getByTestId("auth-password-input").fill("TestPassword123!");

    await page.getByTestId("auth-submit").click();
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("auth-confirmation-screen")).toBeVisible();
    await expect(page.getByTestId("auth-confirmation-email")).toHaveText(email);

    await page.getByTestId("auth-back-to-signin").click();
    await expect(page.getByTestId("auth-email-input")).toHaveValue("");
    await expect(page.getByTestId("auth-password-input")).toHaveValue("");
  });

  test("Sign up with already registered email shows error toast", async ({ page }) => {
    await page.goto("/auth");
    await page.waitForLoadState("networkidle");

    await page.getByTestId("auth-email-button").click();
    await page.getByTestId("auth-tab-signup").click();

    await page.getByTestId("auth-email-input").fill(baseEmail);
    await page.getByTestId("auth-password-input").fill(basePassword);

    await page.getByTestId("auth-submit").click();
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Sign up failed")).toBeVisible();
    await expect(page.getByTestId("auth-submit")).toBeEnabled();
  });

  test("Sign up with password under 6 characters shows validation error", async ({ page }) => {
    await page.goto("/auth");
    await page.waitForLoadState("networkidle");

    await page.getByTestId("auth-email-button").click();
    await page.getByTestId("auth-tab-signup").click();

    await page.getByTestId("auth-email-input").fill(uniqueEmail());
    await page.getByTestId("auth-password-input").fill("123");

    await page.getByTestId("auth-submit").click();
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Password too short")).toBeVisible();
  });

  test("Sign up with empty fields is blocked", async ({ page }) => {
    await page.goto("/auth");
    await page.waitForLoadState("networkidle");

    await page.getByTestId("auth-email-button").click();
    await page.getByTestId("auth-tab-signup").click();

    await page.getByTestId("auth-submit").click();
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Missing fields")).toBeVisible();
    await expect(page.getByTestId("auth-submit")).toBeEnabled();
  });

  test("Sign in with correct credentials redirects to dashboard", async ({ page }) => {
    await page.goto("/auth");
    await page.waitForLoadState("networkidle");

    await page.getByTestId("auth-email-button").click();
    await page.getByTestId("auth-tab-signin").click();

    await page.getByTestId("auth-email-input").fill(baseEmail);
    await page.getByTestId("auth-password-input").fill(basePassword);

    await page.getByTestId("auth-submit").click();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId("nav-user-menu")).toBeVisible();
  });

  test("Sign in with wrong password shows error and retains fields", async ({ page }) => {
    await page.goto("/auth");
    await page.waitForLoadState("networkidle");

    await page.getByTestId("auth-email-button").click();
    await page.getByTestId("auth-tab-signin").click();

    await page.getByTestId("auth-email-input").fill(baseEmail);
    await page.getByTestId("auth-password-input").fill("WrongPassword!");

    await page.getByTestId("auth-submit").click();
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Sign in failed")).toBeVisible();
    await expect(page.getByTestId("auth-email-input")).toHaveValue(baseEmail);
    await expect(page.getByTestId("auth-password-input")).toHaveValue("WrongPassword!");
  });

  test("Switching tabs clears fields", async ({ page }) => {
    await page.goto("/auth");
    await page.waitForLoadState("networkidle");

    await page.getByTestId("auth-email-button").click();
    await page.getByTestId("auth-tab-signup").click();

    await page.getByTestId("auth-email-input").fill("user@example.com");
    await page.getByTestId("auth-password-input").fill("TestPassword123!");

    await page.getByTestId("auth-tab-signin").click();
    await expect(page.getByTestId("auth-email-input")).toHaveValue("");
    await expect(page.getByTestId("auth-password-input")).toHaveValue("");
  });

  test("Navigate to /connections while logged out redirects to auth", async ({ page }) => {
    await page.goto("/connections");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/auth/);
  });
});

test.describe("Auth (logged in)", () => {
  test("Refresh page stays on dashboard", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.reload();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId("nav-user-menu")).toBeVisible();
  });

  test("Log out clears session and back button does not return", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.getByTestId("nav-user-menu").click();
    await page.getByTestId("nav-signout").click();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/auth/);

    await page.goBack();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/auth/);
  });
});
