import { test, expect } from "@playwright/test";

const BACKEND_URL = "http://localhost:8360/api/v1";

test.beforeEach(async ({ page }) => {
  await page.goto("localhost:3000/profile");
  await expect(page).toHaveURL(/.*profile/);
});

test("Username change", async ({ page }) => {
  const tabContactInfoText = await page.getByTestId("Kontaktdaten").innerText();
  expect(tabContactInfoText).toContain("Kontaktdaten");

  await page.getByTestId("Kontaktdaten").click();

  const userNameText = await page.getByTestId("userName").innerText();
  expect(userNameText).toContain("Name");

  await page.getByTestId("editNameButton").click();
  await page.getByRole("radio").nth(0).check();

  await page.getByPlaceholder("Vorname").fill("Vorname");
  await page.getByPlaceholder("Nachname").fill("Nachname");
  await page.getByRole("button", { name: "Speichern" }).nth(0).click();

  const checkToast = async () => {
    try {
      await page.locator(".toastError").innerText({ timeout: 3000 });
      return "error";
    } catch (error) {
      return "success";
    }
  };

  const message = await checkToast();

  expect(message).toBe("success");
});

test("Address change", async ({ page }) => {
  const tabContactInfoText = await page.getByTestId("Kontaktdaten").innerText();
  expect(tabContactInfoText).toContain("Kontaktdaten");

  await page.getByTestId("Kontaktdaten").click();

  const userAddressText = await page.getByTestId("address").innerText();
  expect(userAddressText).toContain("Adresse");

  await page.getByTestId("address").scrollIntoViewIfNeeded();

  const checkAddAddressButton = async () => {
    try {
      await page.getByTestId("addAddressButton").innerText({ timeout: 1000 });
      return "success";
    } catch (error) {
      return "error";
    }
  };
  const isAddButton = await checkAddAddressButton();
  if (isAddButton === "success") {
    await page.getByTestId("addAddressButton").click();
  } else {
    await page.getByTestId("menuAddressButton").click();
    await page.getByTestId("editAddressButton").click();
  }
  await page.getByPlaceholder("strasse und nr.").fill("Street 14");
  await page.getByPlaceholder("PLZ").fill("12345");
  await page.getByPlaceholder("Ort", { exact: true }).fill("City");
  await page.getByTestId("selectCountry").click();
  await page.getByTestId("selectCountry").getByText("Schweiz").last().click();

  await page.getByRole("button", { name: "Speichern" }).nth(1).click();

  const checkToast = async () => {
    try {
      await page.locator(".toastError").innerText({ timeout: 3000 });
      return "error";
    } catch (error) {
      return "success";
    }
  };

  const message = await checkToast();

  expect(message).toBe("success");
});

test("Add new email", async ({ page }) => {
  const tabContactInfoText = await page.getByTestId("Kontaktdaten").innerText();
  expect(tabContactInfoText).toContain("Kontaktdaten");

  await page.getByTestId("Kontaktdaten").click();

  const userEmailText = await page.getByTestId("email").innerText();
  expect(userEmailText).toContain("Weitere E-Mail-Adressen");

  await page.getByTestId("email").scrollIntoViewIfNeeded();

  await page.getByTestId("addNewEmailButton").click();
  const newEmail = `test-${(Math.random() * 10000).toFixed(0)}@gmail.com`;
  await page.getByPlaceholder("e-mail eingeben").fill(newEmail);
  await page.getByPlaceholder("e-mail erneut eingeben").fill(newEmail);

  await page
    .getByTestId("addNewEmailButtonConfirm")
    .getByRole("button", { name: "Weiter" })
    .click();

  await page
    .getByTestId("addNewEmailButtonClose")
    .getByRole("button", { name: "Schliessen" })
    .click();

  const checkToast = async () => {
    try {
      await page.locator(".toastError").innerText({ timeout: 3000 });
      return "error";
    } catch (error) {
      return "success";
    }
  };

  const message = await checkToast();

  expect(message).toBe("success");
});

test("Add or change a phone number", async ({ page, request }) => {
  const tabContactInfoText = await page.getByTestId("Kontaktdaten").innerText();
  expect(tabContactInfoText).toContain("Kontaktdaten");

  await page.getByTestId("Kontaktdaten").click();

  const userAddressText = await page.getByTestId("phone").innerText();
  expect(userAddressText).toContain("Mobilnummer");

  await page.getByTestId("phone").scrollIntoViewIfNeeded();

  const checkAddNewPhoneButton = async () => {
    try {
      await page.getByTestId("addNewPhoneButton").innerText({ timeout: 1000 });
      return "success";
    } catch (error) {
      return "error";
    }
  };
  const isAddButton = await checkAddNewPhoneButton();
  if (isAddButton === "success") {
    await page.getByTestId("addNewPhoneButton").click();
  } else {
    await page.getByTestId("menuPhoneButton").click();
    await page.getByTestId("editPhoneButton").click();
  }

  await page.getByPlaceholder("E-Mail").nth(3).fill("nenad@gmail.com");
  await page.getByPlaceholder("passwort eingeben").nth(2).fill("!Qwertyu1");

  // Login
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
  await page.getByRole("button", { name: "Weiter" }).nth(8).click();
  await loginPromise;
  page.off("request", loginRequestHandler);
  await page.locator("input[type=code]").nth(5).click();
  const oneTimeCodeParams = new URLSearchParams([["reference", accessToken]]);
  const oneTimeCodeRes = await request.get(
    `${BACKEND_URL}/oneTimePassword?${oneTimeCodeParams.toString()}`
  );
  const oneTimeCode = await oneTimeCodeRes.json();
  await page.locator("input[type=code]").nth(5).fill(oneTimeCode.code);
  await page.getByRole("button", { name: "Weiter" }).nth(9).click();

  const phone = Math.round(
    1000000000 - 1 + Math.random() * (9999999999 - 1000000000 + 1)
  ).toString();

  await page.getByPlaceholder("--- --- -- --").fill(phone);
  await page.getByRole("button", { name: "Senden" }).nth(6).click();

  // CHANGE_PHONE_NUMBER_CONFIRMATION
  const oneTimeCodeParamsChange = new URLSearchParams([["reference", phone]]);
  const oneTimeCodeResChange = await request.get(
    `${BACKEND_URL}/oneTimePassword?${oneTimeCodeParamsChange.toString()}`
  );
  const oneTimeCodeChange = await oneTimeCodeResChange.json();
  await page.locator("input[type=code]").nth(6).fill(oneTimeCodeChange.code);
  await page.getByRole("button", { name: "Weiter" }).nth(11).click();
});
