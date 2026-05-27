import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("Dashboard loads with incidents and no infinite spinner", async ({ page }) => {
    await expect(page.getByText("Loading live incidents…")).toHaveCount(0);

    const cards = page.locator('[data-testid^="incident-card-"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Show more incidents button loads more and hides when exhausted", async ({ page }) => {
    const button = page.locator('[data-testid^="show-more-incidents-"]').first();
    await expect(button).toBeVisible();

    const beforeText = await button.innerText();
    const beforeMatch = /\((\d+) remaining\)/.exec(beforeText);
    const beforeRemaining = beforeMatch ? Number(beforeMatch[1]) : null;

    await button.click();
    await page.waitForLoadState("networkidle");

    if (beforeRemaining !== null && beforeRemaining <= 10) {
      await expect(button).toHaveCount(0);
    } else {
      await expect(button).toBeVisible();
      const afterText = await button.innerText();
      if (beforeRemaining !== null) {
        const afterMatch = /\((\d+) remaining\)/.exec(afterText);
        const afterRemaining = afterMatch ? Number(afterMatch[1]) : null;
        if (afterRemaining !== null) {
          expect(afterRemaining).toBeLessThan(beforeRemaining);
        }
      }
    }
  });

  test("Clicking an incident opens modal with correct data", async ({ page }) => {
    const card = page.locator('[data-testid^="incident-card-"]').first();
    const statusText = await card.locator("span").first().innerText();
    const status = statusText.trim().toLowerCase();

    await card.click();
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("incident-detail-modal")).toBeVisible();

    const statusStep = page.getByTestId(`timeline-step-${status}`);
    await expect(statusStep).toHaveAttribute("data-active", "true");
  });

  test("Modal scrollbar stays inside modal bounds", async ({ page }) => {
    const card = page.locator('[data-testid^="incident-card-"]').first();
    await card.click();
    await page.waitForLoadState("networkidle");

    const modal = page.getByTestId("incident-detail-modal");
    const scrollBody = modal.locator(".overflow-y-auto").first();

    await expect(scrollBody).toBeVisible();

    const modalBox = await modal.boundingBox();
    const bodyBox = await scrollBody.boundingBox();

    expect(modalBox).not.toBeNull();
    expect(bodyBox).not.toBeNull();

    if (modalBox && bodyBox) {
      expect(bodyBox.x).toBeGreaterThanOrEqual(modalBox.x);
      expect(bodyBox.y).toBeGreaterThanOrEqual(modalBox.y);
      expect(bodyBox.x + bodyBox.width).toBeLessThanOrEqual(modalBox.x + modalBox.width);
      expect(bodyBox.y + bodyBox.height).toBeLessThanOrEqual(modalBox.y + modalBox.height);
    }
  });

  test("Close button closes modal", async ({ page }) => {
    const card = page.locator('[data-testid^="incident-card-"]').first();
    await card.click();
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByTestId("incident-detail-modal")).toHaveCount(0);
  });

  test("Clicking outside modal closes it", async ({ page }) => {
    const card = page.locator('[data-testid^="incident-card-"]').first();
    await card.click();
    await page.waitForLoadState("networkidle");

    await page.mouse.click(10, 10);
    await expect(page.getByTestId("incident-detail-modal")).toHaveCount(0);
  });

  test("Generate Remediation Plan expands panel", async ({ page }) => {
    const card = page.locator('[data-testid^="incident-card-"]').first();
    await card.click();
    await page.waitForLoadState("networkidle");

    await page.getByTestId("remediation-toggle").click();
    await expect(page.getByText("AI Remediation Plan")).toBeVisible();
  });

  test("Copy button copies text and resets after 2 seconds", async ({ page }) => {
    const card = page.locator('[data-testid^="incident-card-"]').first();
    await card.click();
    await page.waitForLoadState("networkidle");

    const copyButton = page.getByTestId("copy-command-0");
    await copyButton.click();

    const copiedText = await page.evaluate(async () => navigator.clipboard.readText());
    expect(copiedText.length).toBeGreaterThan(0);

    await expect(copyButton.locator(".text-green-400")).toBeVisible();

    await page.waitForTimeout(2100);
    await expect(copyButton.locator(".text-green-400")).toHaveCount(0);
  });
});
