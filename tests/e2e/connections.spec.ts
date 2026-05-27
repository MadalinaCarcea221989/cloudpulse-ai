import { test, expect } from "@playwright/test";

test.describe("Connections (authenticated)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/connections");
    await page.waitForLoadState("networkidle");
  });

  test("Connections page loads for authenticated user", async ({ page }) => {
    await expect(page.getByText("Infrastructure Connections")).toBeVisible();
  });

  test("Add connection modal opens", async ({ page }) => {
    await page.getByTestId("connections-add-button").click();
    await expect(page.getByTestId("connect-modal")).toBeVisible();
  });

  test("Submit with empty fields blocks submission", async ({ page }) => {
    await page.getByTestId("connections-add-button").click();
    await expect(page.getByTestId("connect-modal")).toBeVisible();

    const submit = page.getByTestId("connect-submit-aws");
    await expect(submit).toBeDisabled();
  });

  test("Submit with valid data adds connection and closes modal", async ({ page }) => {
    await page.getByTestId("connections-add-button").click();
    await expect(page.getByTestId("connect-modal")).toBeVisible();

    const displayName = `E2E AWS ${Date.now()}`;

    await page.getByTestId("connect-input-aws-display_name").fill(displayName);
    await page.getByTestId("connect-input-aws-account_identifier").fill(`acc-${Date.now()}`);
    await page.getByTestId("connect-input-aws-region").fill("us-east-1");

    await page.getByTestId("connect-submit-aws").click();
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("connect-modal")).toHaveCount(0);
    await expect(page.getByText(displayName)).toBeVisible();
  });
});

test.describe("Connections (logged out)", () => {
  test.use({ storageState: undefined });

  test("Unauthenticated user hitting /connections redirects to auth", async ({ page }) => {
    await page.goto("/connections");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/auth/);
  });
});
