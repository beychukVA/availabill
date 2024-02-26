import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("localhost:3000");
});

test("There is a greeting present on the dashboard to the user", async ({
  page,
}) => {
  const innerHeadingText = await page
    .getByTestId("greetingMessage")
    .innerText();

  expect(innerHeadingText).toBeDefined();
  expect(innerHeadingText).toContain("Guten Tag");
});

test("There should be emails present in 'Your ideas' section", async ({
  page,
}) => {
  const emailText = await page
    .getByTestId("emailKarAccount")
    .first()
    .innerText();

  expect(emailText).toBeDefined();
  // eslint-disable-next-line no-useless-escape
  expect(emailText).toMatch(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
});

test("Card section should display valid card data", async ({ page }) => {
  const paymentData = await page
    .getByTestId("paymentCardTotalAmount")
    .first()
    .innerText();

  expect(paymentData).toBeDefined();
  expect(paymentData).not.toBeNaN();
});
