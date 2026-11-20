import { test, expect } from "@playwright/test";

test.describe("administrative gate", () => {
  test("an anonymous visitor is redirected to sign-in", async ({ page }) => {
    const response = await page.goto("/admin");
    expect(page.url()).toContain("/admin/login");
    await expect(page.locator("h1")).toContainText(/Administration sign-in/i);
    expect(response?.status()).toBeLessThan(400);
  });

  test("a wrong password is refused without revealing whether the account exists", async ({ page }) => {
    await page.goto("/admin/login");
    await page.locator("#email").fill("admin@iten-tambach.go.ke");
    await page.locator("#password").fill("DefinitelyWrongPassword1!");
    await page.getByRole("button", { name: /sign in/i }).click();
    const alert = page.locator("[role=alert]").first();
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(/incorrect/i);
  });

  test("sign-in form is not indexed", async ({ page }) => {
    await page.goto("/admin/login");
    const robots = await page.locator('meta[name="robots"]').first().getAttribute("content");
    expect(robots).toContain("noindex");
  });
});
