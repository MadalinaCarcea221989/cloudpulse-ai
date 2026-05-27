import { test } from "@playwright/test";

const email = process.env.E2E_TEST_EMAIL || "e2e-test-user@cloudpulse.test";
const password = process.env.E2E_TEST_PASSWORD || "TestPassword123!";

test("authenticate", async ({ page }) => {
  await page.goto("/auth");
  await page.waitForLoadState("networkidle");

  await page.getByTestId("auth-email-button").click();
  await page.getByTestId("auth-tab-signin").click();

  await page.getByTestId("auth-email-input").fill(email);
  await page.getByTestId("auth-password-input").fill(password);

  await page.getByTestId("auth-submit").click();
  await page.waitForLoadState("networkidle");

  await page.context().storageState({ path: "tests/e2e/.auth/user.json" });
});
