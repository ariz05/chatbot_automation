const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create reports folder if not exists
const reportsDir = path.resolve(__dirname, '..', 'Archived_reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir);
}

const now = new Date();
const pad = (n) => n.toString().padStart(2, '0');
const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;

const outputDir = path.join(reportsDir, `allure-report-${timestamp}`);

try {
  console.log(`📦 Generating Allure report in: ${outputDir}`);
  execSync(`npx allure generate ./allure-results --clean -o ${outputDir}`, { stdio: 'inherit' });
  execSync(`npx allure open ${outputDir}`, { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to generate Allure report:', error.message);
  process.exit(1);
}
