# 🧪 Playwright Chatbot Automation Project

This guide explains **how to set up, configure, and run** the Playwright-based GUI automation framework from scratch, including reading test data from JSON file, filtering by language selected, and generating Allure reports, and using serial test execution for dependent flows.

---

## 🔧 1. Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v16 or above)
- [npm](https://www.npmjs.com/get-npm)
- Git (for version control)
- Allure commandline (for report generation)

### Optional (Windows users)
Install PowerShell or use Git Bash if using Unix-style commands.

---

## 📦 2. Install Project Dependencies

Navigate to the project root and install dependencies:

```bash
npm install
```

---

## 📁 3. Project Structure Overview

```
project-root/
├── tests/
│   └── chatbot_tests/
│       └── Chatbot.spec.js
├── utils/
│   └── generateAllureReport.js
├── test-data/
|   |_qa---test-data.json
|   |
|   |_uat---test-data.json 
|
├── .env.qa, .env.dev, .env.uat, .env.prod
├── playwright.config.js
└── package.json 

---

## ⚙️ 4. Environment Setup

Create `.env.qa`, `.env.dev`, etc. inside project-root/envConfig. Example `envConfig/.env.qa`:

```
ENV=qa
BASE_URL=https://ask.u.ae/en/
```

These are dynamically picked up using `process.env`.

---

Test file:  
`tests/chatbot_tests/chatbot.spec.js`

---

## 🚀 8. Run the Tests


### All test cases for UI
```bash
npm run test
```

### Filter by test category
```bash
$env:LANGUAGE="en"; $env:ENV="qa"; npm run test
$env:LANGUAGE="ar"; $env:ENV="qa"; npm run test
```

---

## 🧼 9. Clean & Generate Allure Report

```bash
npm run clean:allure
npm run allure:report
npx allure open ./allure-report
```

---

## 📜 10. Suggested NPM Scripts

Inside `package.json`:

```json
{
   "scripts": {
    "test": "npm run clean:allure && npx playwright test chatbot.spec.js --project=chromium && npm run allure:report",
    "clean:allure": "npx rimraf allure-results allure-report",
    "allure:report": "node utils/generateAllureReport.js"
  }
}
```

---

## 📬 Contact

For questions, reach out to the Ariz - QA Automation Team or raise a GitHub issue.
