import { test, expect } from "@playwright/test";

test("Offline network shows graceful error and no infinite spinner", async ({ page, context }) => {
  await context.setOffline(true);
  await page.goto("/");
  await page.waitForLoadState("networkidle", { timeout: 15000 });

  await expect(page.getByText("Failed to load incidents")).toBeVisible();
  await expect(page.getByText("Loading live incidents…")).toHaveCount(0);

  await context.setOffline(false);
});

test("Runtime error shows recovery UI", async ({ page }) => {
  await page.goto("/__e2e__/error");
  await page.waitForLoadState("networkidle");

  await expect(page.getByText("Something went wrong")).toBeVisible();
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Go home" })).toBeVisible();
});

test("Try Again restores UI without full reload", async ({ page }) => {
  await page.goto("/__e2e__/error");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Try again" }).click();
  await page.waitForLoadState("networkidle");

  await expect(page.getByTestId("e2e-recovery")).toBeVisible();
});
