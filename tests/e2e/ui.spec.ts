import { test, expect } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 900 },
  { name: "desktop", width: 1280, height: 900 },
];

test("No horizontal scroll on key pages", async ({ page }) => {
  const paths = ["/", "/overview", "/team", "/connections"];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const path of paths) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const hasHorizontalScroll = await page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth > window.innerWidth + 1;
      });

      expect(hasHorizontalScroll).toBe(false);
    }
  }
});

test("Buttons have visible hover states", async ({ page }) => {
  await page.goto("/auth");
  await page.waitForLoadState("networkidle");

  const button = page.getByTestId("nav-signin");
  const before = await button.evaluate((el) => getComputedStyle(el).backgroundColor);

  await button.hover();
  const after = await button.evaluate((el) => getComputedStyle(el).backgroundColor);

  expect(after).not.toBe(before);
});

test("Toasts appear and disappear", async ({ page }) => {
  await page.goto("/auth");
  await page.waitForLoadState("networkidle");

  await page.getByTestId("auth-email-button").click();
  await page.getByTestId("auth-tab-signup").click();

  await page.getByTestId("auth-submit").click();
  await page.waitForLoadState("networkidle");

  const toast = page.getByText("Missing fields");
  await expect(toast).toBeVisible();
  await expect(toast).toBeHidden({ timeout: 10000 });
});

test("No console errors during normal navigation", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await page.goto("/overview");
  await page.waitForLoadState("networkidle");

  await page.goto("/team");
  await page.waitForLoadState("networkidle");

  expect(errors).toEqual([]);
});
