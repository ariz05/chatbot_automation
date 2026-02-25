# 🧪 Playwright Chatbot Automation Project

This guide explains **how to set up, configure, and run** the Playwright-based GUI automation framework from scratch, including reading test data from JSON file, filtering by language selected, and generating Allure reports.

---

## 🔧 1. Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v16 or above)
- [npm](https://www.npmjs.com/get-npm)
- Git (for version control)
- Allure commandline (for report generation)
- OpenRouter SDK
- Semantic similarity scoring
- Answer relevancy metric
- Hallucination detection metric
- Context precision metric
- Context recall metric for completeness


### Optional (Windows users)
Install PowerShell or use Git Bash if using Unix-style commands.

---

## 📦 2. Install Project Dependencies

=> Navigate to the project root and install dependencies:

Install all dependencies listed in package.json file

---> npm install

Install playwright

---> npm init playwright@latest

Set up Semantic validator Engine

---> npm install @playwright/test openai dotenv

Set up Allure reporting 

---> npm install -g allure-commandline

## 📁 3. Project Structure Overview

```
project-root/
├── tests/
│   └── chatbot_tests/
│       └── Chatbot.spec.js
|
|
├── utils/
│   └── generateAllureReport.js
|   └── semanticvalidationhelper/
|        └── config.js
|        └── evaluationEngine.js
|        └── evaluationValidator.js
|        └── openrouterClient.js
|        └── reportLogger.js
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

These are dynamically picked up using `process.env`.

```
ENV=qa
BASE_URL=https://beta-ask.u.ae/en/uask/
```

Test file:  
`tests/chatbot_tests/chatbot.spec.js`

---

## 🚀 8. Run the Tests
```

### Filter by test category
To run tests in chromium as configured in package.json. Browser can be reconfigured from package.json file as required.
```bash
1. To run tests to valdate in English language in chromium browser
$env:LANGUAGE="en"; $env:ENV="qa"; $env:OPENROUTER_API_KEY="${key}"; npm run test

1. To run tests to valdate in Arabic language in chromium browser
$env:LANGUAGE="en"; $env:ENV="qa"; $env:OPENROUTER_API_KEY="${key}"; npm run test
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
