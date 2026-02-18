import { test, expect } from '@playwright/test';
import { ChatbotPage } from '../../pages/chatbotPage';
const testData = require(`../../testdata/${process.env.ENV || 'qa'}/test-data.json`);
const allure = require('allure-js-commons');


// Choose test data on the basis of LANGUAGE env variable
const testLanguage = process.env.LANGUAGE;
let filteredData;
if (testLanguage) {
    filteredData = Object.fromEntries(
        Object.entries(testData).filter(([key]) => key === testLanguage)
    );
}
else {
    filteredData = testData;
}


for (const [lang, dataset] of Object.entries(filteredData)) {
    for (const data of dataset) {
        let chatbotPage;
        const TestCaseID = data.TestCaseId;
        const TestcaseDescription = data.TestCaseDescription;
        test.describe(`Chatbot response validation tests for language: ${lang.toUpperCase()} -> ${TestCaseID}`, () => {
            test.beforeEach(async ({ page }) => {
                chatbotPage = new ChatbotPage(page);
                // open browser and navigate to chatbot url
                await test.step('Step 1: Navigate to chatbot', async () => {
                    await chatbotPage.navigateToChatbot();
                });

                // click on change language button
                if (testLanguage.toLocaleLowerCase() === 'ar') {
                    await test.step('Step 2: Click on Change language button', async () => {
                        await chatbotPage.clickChangeLanguageButton();
                    });

                }

            });

            test(`Test to ${TestcaseDescription}`, async () => {
                let responseMessage;
                console.log(`Executing TestCase ID: ${TestCaseID} - ${TestcaseDescription}`);
                // Sends message to chatbot

                await test.step('Step 3: Sends message to chatbot', async () => {
                    await chatbotPage.sendMessage(data.InputMessage);
                    allure.logStep(`📤 Message sent: ${data.InputMessage}`);
                });

                // Verifies bot response
                await test.step('Step 4: verifies bot response', async () => {
                    responseMessage = await chatbotPage.expectedBotResponse(data.InputMessage,data.ExpectedKeyword,data.ExpectedResponse);
                    console.log(' Input message : ' + data.InputMessage + ' | Bot Expected response : ' + data.ExpectedResponse);
                    allure.logStep(' Input message : ' + data.InputMessage + ' | Bot Expected response : ' + data.ExpectedResponse);
                    allure.logStep(`📤 Bot response received: ${responseMessage}`);
                });

                //verify browser text language
                // await test.step('Step 5: verifies bot response text language', async () => {
                //     const flag = await chatbotPage.verifyBrowserLanguage(lang);
                //     allure.logStep(` Bot response language is as expected: ${lang}`);
                //     if (flag) {
                //         allure.logStep(` Bot response language is as expected: ${lang}`);
                //         console.log(`Bot response language is as expected: ${lang}`);
                //     }
                //     else {
                //         allure.logStep(` Bot response language is not as expected: ${lang}`);
                //         throw new Error(" Bot response language is not as expected.");

                //     }
                // });

                // verify text direction
                await test.step('Step 6: verifies bot response text direction', async () => {
                    const direction = await chatbotPage.validateDirection(responseMessage, data.direction);
                    if (direction) {
                        console.log("Text is aligned as per expected direction.Text direction is: " + data.direction);
                        allure.logStep("Text is aligned as per expected direction.Text direction is: " + data.direction);
                    }
                    else {
                        allure.logStep("Text is not aligned as per expected direction.Text direction found is: " + data.direction);
                        throw new Error("Text is not aligned as per expected direction.Expected text direction is: " + data.direction);


                    }

                });
            });


        });
    }
}

