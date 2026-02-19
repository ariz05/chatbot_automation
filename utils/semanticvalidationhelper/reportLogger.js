import fs from "fs";

export function logEvaluation(result) {
    fs.appendFileSync(
        "evaluation-report.json",
        JSON.stringify({
            ...result,
            timestamp: new Date().toISOString()
        }) + "\n"
    );
}

module.exports = { logEvaluation };