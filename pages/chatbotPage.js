// chatbotPage.js
import { Page, expect } from '@playwright/test';
import { validateResponse } from '../tests/semanticvalidationhelper/evaluationValidator.js';
import { logEvaluation } from '../tests/semanticvalidationhelper/reportLogger';


class ChatbotPage {

    constructor(page) {
        this.page = page;
        this.disclaimerPopupHeading = this.page.locator("//div[@class = 'disclaimer-content']/h1");
        this.acceptButton = this.page.locator(".btn.btn-brand");
        this.declineButton = this.page.locator("//href[contains(text(),'Decline')]");
        this.chatInput = this.page.getByRole('textbox', { id: 'conversation' });
        this.sendMessageButton = this.page.locator("//*[@id='arrow-up-circle']");
        this.containerBotMessage = this.page.locator("//div[contains(@class , 'chatContainer')]/div[last()-1]/div/div[1]/run-type-renderer/div/div[1]");
        this.changeLanguageButton = this.page.locator("//a[@aria-label = 'Arabic']");
        this.loadingMessageImage = this.page.locator("//div[@class = 'block-ui-template']/img");
    }

    // In case, user accepts disclaimer, navigate to chatbot page
    async navigateToChatbot() {
        await this.page.goto('/');
        if (expect(await this.acceptButton.isVisible())) {
            console.log('Disclaimer popup is visible');
            await this.page.waitForTimeout(100);
            await this.acceptButton.click();
            console.log('Clicked on Accept and continue button');
        }
        //await this.page.waitForTimeout(10000);
        await expect(this.chatInput).toBeVisible();
    }


    // In case, user rejects disclaimer, navigate to home page
    async navigateToSignInPage() {
        await this.page.goto('/');
        if (await this.declineButton.isVisible()) {
            await this.declineButton.click();
        }
        const pageTitle = await page.title();
        console.log('Page title : ', pageTitle);
        await expect(page).toHaveTitle('Home | The Official Platform of the UAE Government');
        return true;
    }

    async clickChangeLanguageButton() {
        console.log('Clicking on Change Language button');
        await this.changeLanguageButton.click();
    }

    // send message to chatbot
    async sendMessage(messages) {
        const text = await this.chatInput.textContent();
        console.log(`Focusing on chat input box ${text}`);

        // check if chat input is empty
        if (text === '') {
            console.log('Chat input box is empty');
            // fill message
            await this.page.waitForTimeout(1000);
            await this.chatInput.click();
            await this.chatInput.type(messages);
            console.log(`Sending message to chatbot: ${messages}`);
            await this.page.waitForTimeout(1000);

            //Press tab to move to send button. Check accessibility
            const maxTabs = 4; // Limit Tab presses to prevent infinite loops
            const button = await this.page.$("//button[@type = 'submit']");
            for (let i = 0; i < maxTabs; i++) {
                await this.page.keyboard.press('Tab');
                await this.page.waitForTimeout(1000); // Small pause for UI updates
                const isfocused = await button.evaluate((el) => el === document.activeElement);
                // check if send button is focused, then press enter.
                if (isfocused) {
                    console.log('Send button is focused');
                    await this.page.keyboard.press('Enter');
                    await this.checkMessageLoadingImageHidden();
                    //await expect(this.containerBotMessage).toBeVisible({ timeout: 100000 });
                    await this.page.waitForTimeout(100000);
                    console.log(`Message sent to chatbot: ${messages}`);
                    break;
                }

            }
            // //await this.containerBotMessage.waitFor({ state: 'visible' });
            // await expect(this.containerBotMessage).toBeVisible({ timeout: 100000 });
            // //await this.containerBotMessage.waitFor({ state: 'visible' });

        }
        else {
            console.log('Chat input is not empty!!!');
            throw new Error("Chat input is not empty!!!");
        }

        //verify chat input is cleared after sending message
        const chatAreaText = await this.chatInput.textContent();
        if (chatAreaText !== '') {
            throw new Error("Message not sent, chat input box is not cleared.");
        }
        else {
            console.log('Chat input box is cleared after sending message');
        }

    }

    // validate bot response with either single or multiple paragraphs
    async expectedBotResponse(question, context, expectedAnswer) {
        await this.validateAutoScrollFunctionality();
        console.log(`validating bot response. Expected response: ${expectedAnswer}`);
        let actualMessage = '';
        let paragraphLocators;
        if (this.containerBotMessage.isVisible()) {
            console.log('Bot message is visible');
            paragraphLocators = await this.containerBotMessage.locator('p, li');
        }

        const paragraphCount = await paragraphLocators.count();
        console.log(`Number of steps in Bot response: ${paragraphCount}`);
        if (paragraphCount > 0) {
            let fullText = '';
            for (let i = 0; i < paragraphCount; i++) {
                fullText += await paragraphLocators.nth(i).textContent() + ' ';
            }

            actualMessage = fullText.trim();
            console.log(`Bot response: ${actualMessage}`);

            //check if all expected keywords are present in bot response
            let containsAll = true;
            for (const word of context.split(',')) {
                if (!actualMessage.includes(word.trim())) {
                    containsAll = false;
                    break;
                }
            }

            expect(containsAll).toBeTruthy();
            console.log('Bot response contains all expected keywords from context');
            console.log(`Question: ${question}`);
            console.log(`Context: ${context}`);
            console.log(`Expected Answer: ${expectedAnswer}`);

            const result = await validateResponse({
                question,
                context,
                expectedAnswer,
                actualMessage
            });

            console.log("Evaluation Scores:", result.scores);

            logEvaluation(result);

            expect(result.pass).toBeTruthy();

        }
        else {
            throw new Error("No text found in bot response.");
        }
        return finalmessage;
    }


    // validate text direction based on language
    async validateDirection(text, textDirection) {
        const arabicRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]+$/;
        if (arabicRegex.test(text)) {
            return textDirection === 'rtl';
        }
        return textDirection === 'ltr';
    }

    // verify browser language for webpage by checking html 'lang' attribute
    async verifyBrowserLanguage(language) {
        const htmlDir = await this.page.getAttribute('html', 'lang');
        console.log(`Browser language is: ${htmlDir}`);
        expect(htmlDir).toBe(language);
        return true;
    }

    // return latest bot message and validate expected response
    async validateResponse(expectedResponse) {
        const actualText = await this.containerBotMessage.locator('p').textContent();
        expect(actualText).toContain(expectedResponse);
        console.log(`Fetching latest bot message text...${actualText}`);
        return actualText;

    }

    //validate auto scroll functionality of chat container
    async validateAutoScrollFunctionality() {
        const previousScrollHeight = await this.getScrollHeight();
        console.log(`Previous scroll height: ${previousScrollHeight}`);
        const lastBotMessage = await this.containerBotMessage.locator('p').last();
        lastBotMessage.scrollIntoViewIfNeeded();
        const currentScrollHeight = await this.getScrollHeight();
        console.log(`Current scroll height: ${currentScrollHeight}`);
        if (currentScrollHeight >= previousScrollHeight) {
            console.log('Scroll functionality is working as expected.');
        }
    }

    // get current scroll height of last chat message 
    async getScrollHeight() {
        //const selector = "//div[@role = 'log']/div[last()-1]/div/div[1]"; 
        const selector = "//div[contains(@class,'start')]";
        return await this.page.$eval(selector, el => el.scrollHeight);
    }

    // check loading image visibility while bot is typing
    async checkMessageLoadingImageHidden() {
        console.log('Waiting for bot response to load...');
        await expect(this.loadingMessageImage).toBeHidden({ timeout: 10000 });
    }

}

module.exports = { ChatbotPage };