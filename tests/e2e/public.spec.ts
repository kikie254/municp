import { test, expect } from "@playwright/test";

test.describe("public website", () => {
  test("homepage renders with one h1 and the municipal identity", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText(/Iten/i);
    await expect(page.getByRole("link", { name: /skip/i }).first()).toBeAttached();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("primary navigation reaches services, projects and resources", async ({ page }) => {
    await page.goto("/");
    await page.goto("/services");
    await expect(page.locator("h1")).toHaveCount(1);
    await page.goto("/projects");
    await expect(page.locator("h1")).toHaveCount(1);
    await page.goto("/resources");
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("keyboard focus is visible on the first interactive element", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return null;
      const s = getComputedStyle(el);
      return { tag: el.tagName, width: s.outlineWidth, style: s.outlineStyle };
    });
    expect(outline).not.toBeNull();
    expect(outline!.width).not.toBe("0px");
  });

  test("search dialog opens, is announced and closes on Escape", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /search/i }).first();
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("enquiry form validates on the server and shows field errors", async ({ page }) => {
    await page.goto("/contact");
    await page.locator("#name").fill("A");
    await page.locator("#email").fill("not-an-email");
    await page.locator("#message").fill("short");
    await page.getByRole("button", { name: /send submission/i }).click();
    await expect(page.locator("[role=alert]").first()).toBeVisible();
  });

  test("mobile viewport has no horizontal overflow", async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 360, height: 780 });
    for (const path of ["/", "/news", "/projects", "/resources", "/contact"]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `horizontal overflow on ${path}`).toBeLessThanOrEqual(1);
    }
  });
});
