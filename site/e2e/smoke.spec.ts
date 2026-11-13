import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const REPO = "https://github.com/eljamez/bleeps-and-bloops";

const pages = [
  { path: "/", heading: "Bleeps and Bloops" },
  { path: "/start/new", heading: "Start a new project" },
  { path: "/start/existing", heading: "Add Bleeps to an existing project" },
  { path: "/using-bleeps", heading: "Day to day" },
] as const;

const banned = [
  "James Hall",
  "Kent",
  "Kody",
  "game controller",
  "bb:kick-off",
  "Karabiner",
  "what it ships",
  "what come out",
  "a bloop",
];

async function expectGithubLink(page: Page) {
  await expect(
    page.getByRole("navigation", { name: "Pages" }).getByRole("link", { name: "GitHub" }),
  ).toHaveAttribute("href", REPO);
}

async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const summary = results.violations
    .map((violation) => `${violation.id}: ${violation.help}`)
    .join("\n");
  expect(results.violations, summary).toEqual([]);
}

test("landing CTAs open the two setup paths", async ({ page }) => {
  await page.goto("/");
  await page.locator("a.path-card", { hasText: "Start a new project" }).click();
  await expect(page).toHaveURL("/start/new");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Start a new project");

  await page.goto("/");
  await page
    .locator("a.path-card", { hasText: "Add Bleeps to an existing project" })
    .click();
  await expect(page).toHaveURL("/start/existing");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Add Bleeps to an existing project",
  );
});

for (const entry of pages) {
  test(`${entry.path} loads, links to GitHub, and passes axe`, async ({ page }) => {
    await page.goto(entry.path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(entry.heading);
    await expectGithubLink(page);
    await expect(
      page.getByRole("navigation", { name: "Pages" }).getByRole("link", { name: "New project" }),
    ).toHaveAttribute("href", "/start/new");
    await expect(
      page
        .getByRole("navigation", { name: "Pages" })
        .getByRole("link", { name: "Existing project" }),
    ).toHaveAttribute("href", "/start/existing");
    const text = await page.locator("body").innerText();
    for (const phrase of banned) {
      expect(text, phrase).not.toContain(phrase);
    }
    await expectNoAxeViolations(page);
  });
}

test("setup pages mention Blip and link to day-to-day use", async ({ page }) => {
  for (const path of ["/start/new", "/start/existing"]) {
    await page.goto(path);
    await expect(page.getByText(/Blip is the QA lead/)).toBeVisible();
    await page.getByRole("link", { name: "Day to day with Bleeps" }).click();
    await expect(page).toHaveURL("/using-bleeps");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Day to day");
  }
});

test("usage page explains Blip and the patrol switch", async ({ page }) => {
  await page.goto("/using-bleeps");
  await expect(page.getByRole("heading", { name: "The crew" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Blip" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "The patrol" })).toBeVisible();
  const crew = page.locator("#crew");
  for (const name of ["Beep", "Buzz", "Echo", "Chip", "Bloops"]) {
    await expect(crew.getByText(name, { exact: true })).toBeVisible();
  }
  await expect(
    page.getByText(/Scripts first: common work gets a script/),
  ).toBeVisible();
  await expect(page.getByText(/Green tests are a hard gate before auto-merge/)).toBeVisible();
  await expect(page.getByText(/The patrol is per project/)).toBeVisible();
});
