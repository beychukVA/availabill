import { test, expect } from "@playwright/test";

const AVAILABILL_BASE_API = "http://localhost:8360/api/v1/users/1/transactions";

const transactionURL = `${AVAILABILL_BASE_API}?page=0&amount=5&startDate=&endDate=&startAmount=0&endAmount=999999&status=OPEN`;
const maxAmountURL = `${AVAILABILL_BASE_API}?page=0&amount=1&sortDirection=DESC&sortColumnt=amount`;

test.beforeEach(async ({ page }) => {
  await page.goto("localhost:3000/bills");
});

test("Page title is Ihre Rechnungen", async ({ page }) => {
  const innerHeadingText = await page.getByTestId("billsHeading").innerText();

  expect(innerHeadingText).toContain("Ihre Rechnungen");
});

test("Selecting impossible date results in a div saying no data found", async ({
  page,
}) => {
  await page.getByTestId("dateRangePicker").click();
  await page.getByRole("combobox").nth(1).selectOption("1923");
  await page.getByRole("button", { name: "4", exact: true }).nth(1).click();
  await page.getByRole("button", { name: "5", exact: true }).first().click();
  await page.getByRole("button", { name: "APPLY" }).click();

  const noTableDataTxt = await page.getByTestId("noTableData").innerText();

  expect(noTableDataTxt).toBe("Keine Rechnungen vorhanden");
});

test("Selecting valid data results in populated table row(s)", async ({
  page,
}) => {
  await page.getByTestId("dateRangePicker").click();
  await page.getByRole("button", { name: "This Year" }).click();
  await page.getByRole("button", { name: "APPLY" }).click();

  const tableRow = await page.getByTestId("tableRow");
  const noOfTableRows = await tableRow.count();

  expect(tableRow).toBeDefined();
  expect(noOfTableRows).toBeGreaterThan(0);
});

test("Selecting all OPEN transactions returns corresponding data", async ({
  page,
}) => {
  const responsePromise = page.waitForResponse(transactionURL);

  await page.getByTestId("tableSelectTransactionType").click();
  await page.getByRole("option", { name: "Open" }).click();

  await responsePromise;

  const firstTransactionStatus = page
    .getByTestId("tableTransactionStatus")
    .first();

  const firstTransactionStatusTxt = await firstTransactionStatus.innerText();

  expect(firstTransactionStatusTxt).toBeDefined();
  expect(firstTransactionStatusTxt).toBe("open");
});

test("Getting max amount for table data from BE should set the max amount in slider properly", async ({
  page,
}) => {
  const responsePromise = page.waitForResponse(maxAmountURL);

  await responsePromise;

  const sliderData = await page.getByTestId("sliderFilter").allTextContents();
  const trimmedMaxNumber = Number(sliderData[0].substring(1));

  expect(sliderData).toBeDefined();
  expect(trimmedMaxNumber).toBeGreaterThan(0);
  expect(trimmedMaxNumber).toBeLessThan(9999999);
});

test("Selecting invalid stuff and clearing filters gets row data on screen", async ({
  page,
}) => {
  await page.getByTestId("dateRangePicker").click();
  await page.getByRole("combobox").nth(1).selectOption("1923");
  await page.getByRole("button", { name: "4", exact: true }).nth(1).click();
  await page.getByRole("button", { name: "5", exact: true }).first().click();
  await page.getByRole("button", { name: "APPLY" }).click();
  await page.getByRole("button", { name: "CLEAR FILTER" }).click();

  const tableRow = await page.getByTestId("tableRow");
  const noOfTableRows = await tableRow.count();

  expect(tableRow).toBeDefined();
  expect(noOfTableRows).toBeGreaterThan(0);
});
