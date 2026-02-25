import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import path from 'path';

/**
 * See https://playwright.dev/docs/test-configuration.
 */

// 1. Choose environment
const environment = process.env.ENV || 'qa';
dotenv.config({ path: path.resolve(__dirname, `envConfig/.env.${environment}`) });
console.log(`🔧 ENV = ${environment}`);

// 2. Choose url
const uibaseURL = process.env.URL;
console.log(`🔧 BASE_URL = ${uibaseURL}`);

// 3. Choose test language
const testLanguage = process.env.LANGUAGE;
console.log(`🔧 TestLanguage = ${testLanguage}`);

// 4. Choose OPENROUTER API KEY
const openRouterAPIKey = process.env.OPENROUTER_API_KEY;
console.log(`🔧 openRouter API Key = ${openRouterAPIKey}`);


export default defineConfig({
  testDir: './tests',
  //timeout for each test is 120 sec [GLOBAL TIMEOUT]
  timeout: 120 * 1000,
  //timeout for all assertion is 10 sec
  expect: {
    timeout: 10000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['allure-playwright']
  ],

  /* Shared settings for all the projects below.
  use: {
    screenshot: 'only-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        baseURL: uibaseURL,
        headless: false,
        viewport: { width: 1920, height: 1080 },
        ...devices['Desktop Chrome']
      },
    },

    // {
    //   name: 'firefox',
    //   use: {
    //     baseURL: uibaseURL,
    //     headless: false,
    //     ...devices['Desktop Firefox']
    //   },
    // },

    // {
    //   name: 'webkit',
    //   use: {
    //     baseURL: uibaseURL,
    //     headless: false,
    //     ...devices['Desktop Safari']
    //   },
    // },

    /* Test against mobile viewports. */
    {
      name: 'Mobile_Chrome',
      use: {
        baseURL: uibaseURL,
        headless: false,
        ...devices['Pixel 5']
      },
    },
    {
      name: 'Mobile_Safari',
      use: {
        baseURL: uibaseURL,
        headless: false,
        ...devices['iPhone 12']
      },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
