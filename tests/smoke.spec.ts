import { test } from "@playwright/test";

test("Smoke test", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.getByRole("link", { name: "Dein availabill" }).click();
});
