import { test, expect } from "@playwright/test";

const BACKEND_URL = "http://localhost:8360/api/v1";
const authFile = "playwright/.auth/user.json";

test("test", async ({ page, request }) => {
  await page.goto("http://localhost:3000/onboarding");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByPlaceholder("E-Mail").first().click();
  await page.getByPlaceholder("E-Mail").first().fill("admin@availabill.ch");
  await page.getByPlaceholder("E-Mail").first().press("Tab");
  await page.getByPlaceholder("passwort eingeben").fill("admin");
  let accessToken = "";
  const loginRequestHandlerFactory = (resolve: any) => async (data: any) => {
    if (!data._initializer.url.match(/api\/v1\/auth\/login/i)) {
      return;
    }
    const response = await data.response();
    const json = await response.json();
    accessToken = json.access_token;
    resolve();
  };
  let loginRequestHandler: any = null;
  const loginPromise = new Promise((resolve) => {
    loginRequestHandler = loginRequestHandlerFactory(resolve);
    page.on("request", loginRequestHandler);
  });
  await page.getByRole("button", { name: "Bestätigen und weiter" }).click();
  await loginPromise;
  page.off("request", loginRequestHandler);
  await page.locator("input[type=code]").click();
  const oneTimeCodeParams = new URLSearchParams([["reference", accessToken]]);
  const oneTimeCodeRes = await request.get(
    `${BACKEND_URL}/oneTimePassword?${oneTimeCodeParams.toString()}`
  );
  const oneTimeCode = await oneTimeCodeRes.json();
  await page.locator("input[type=code]").fill(oneTimeCode.code);
  await page.getByRole("button", { name: "Senden", exact: true }).click();
  const firstDashboardItem = page.getByRole("link", {
    name: "Dein availabill",
  });
  await expect(firstDashboardItem).toBeVisible();
  await page.context().storageState({ path: authFile });
});
