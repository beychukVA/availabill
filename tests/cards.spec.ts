import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("localhost:3000/cards");
});

test("Page title is Karten & Konten", async ({ page }) => {
  const innerHeadingText = await page.getByTestId("cardsTitle").innerText();

  expect(innerHeadingText).toContain("Karten & Konten");
});

test("Displays an adequate error message to the user if the request for registering card failed from BE side", async ({
  page,
}) => {
  await page.getByPlaceholder("-- -- -- --").first().click();
  await page.getByPlaceholder("-- -- -- --").first().fill("12345");
  await page.getByPlaceholder("-- -- -- --").nth(1).click();
  await page.getByPlaceholder("-- -- -- --").nth(1).fill("1223445");
  await page.getByRole("button", { name: "Jetzt registrieren" }).click();
  const innerErrorText = await page
    .getByTestId("registerCardError")
    .innerText();

  expect(innerErrorText).toContain("Entschuldigung, da war ein Fehler");
});

test("Displays a client side error to the user if the card entered is invalid", async ({
  page,
}) => {
  await page.getByPlaceholder("-- -- -- --").first().click();
  await page.getByPlaceholder("-- -- -- --").first().fill("12345");
  await page.getByPlaceholder("-- -- -- --").nth(1).click();
  await page.getByPlaceholder("-- -- -- --").nth(1).fill("12");
  await page.getByRole("button", { name: "Jetzt registrieren" }).click();
  const innerErrorText = await page.getByTestId("cardNumberError").innerText();

  expect(innerErrorText).toContain(
    "Bitte geben Sie eine gültige Kartennummer ein"
  );
});

test("Displays a client side error to the user if the code entered is invalid", async ({
  page,
}) => {
  await page.getByPlaceholder("-- -- -- --").first().click();
  await page.getByPlaceholder("-- -- -- --").first().fill("12");
  await page.getByPlaceholder("-- -- -- --").nth(1).click();
  await page.getByPlaceholder("-- -- -- --").nth(1).fill("12");
  await page.getByRole("button", { name: "Jetzt registrieren" }).click();
  const innerErrorText = await page
    .getByTestId("registrationCodeError")
    .innerText();

  expect(innerErrorText).toContain("Bitte trage einen korrekten Code ein");
});

test("Displays an error modal if the request for card registration failed", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "MediaMarkt Karte beantragen" })
    .click();
  await page.locator(".Cards_plusBlock__iZ7OD > svg").first().click();
  await page.getByRole("button", { name: "Choose date" }).click();
  await page.getByRole("gridcell", { name: "22" }).click();
  await page.getByPlaceholder("-- -- -- --").nth(2).click();
  await page.getByPlaceholder("-- -- -- --").nth(2).fill("123456");
  await page.getByRole("button", { name: "Senden" }).click();
  const innerErrorText = await page
    .getByTestId("registerCardErrorHeading")
    .innerText();

  expect(innerErrorText).toContain("Fehler passiert");
});
