"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dedent_1 = require("@libs/StringUtils/dedent");
const base_1 = require("@prompts/translation/base");
const context_1 = require("@prompts/translation/context");
const OpenAIUtils_1 = require("../OpenAIUtils");
const Translator_1 = require("./Translator");
class ChatGPTTranslator extends Translator_1.default {
    constructor(apiKey) {
        super();
        this.openai = new OpenAIUtils_1.default(apiKey);
    }
    async performTranslation(targetLang, text, context) {
        const systemPrompt = (0, dedent_1.default)(`
            ${(0, base_1.default)(targetLang)}
            ${(0, context_1.default)(context)}
        `);
        let attempt = 0;
        while (attempt <= ChatGPTTranslator.MAX_RETRIES) {
            try {
                const result = await this.openai.promptChatCompletions({
                    systemPrompt,
                    userPrompt: text,
                });
                if (this.validateTemplatePlaceholders(text, result) && this.validateTemplateHTML(text, result)) {
                    if (attempt > 0) {
                        console.log(`🙃 Translation succeeded after ${attempt + 1} attempts`);
                    }
                    console.log(`🧠 Translated "${text}" to ${targetLang}: "${result}"`);
                    return result;
                }
                console.warn(`⚠️ Translation for "${text}" failed validation (attempt ${attempt + 1}/${ChatGPTTranslator.MAX_RETRIES + 1})`);
                if (attempt === ChatGPTTranslator.MAX_RETRIES) {
                    console.error(`❌ Final attempt failed placeholder validation. Falling back to original.`);
                    return text;
                }
            }
            catch (error) {
                console.error(`Error translating "${text}" to ${targetLang} (attempt ${attempt + 1}):`, error);
                if (attempt === ChatGPTTranslator.MAX_RETRIES) {
                    return text; // Final fallback
                }
            }
            attempt++;
        }
        // Should never hit this, but fallback just in case
        return text;
    }
}
/**
 * The maximum number of times we'll retry a successful translation request in the event of hallucinations.
 */
ChatGPTTranslator.MAX_RETRIES = 4;
exports.default = ChatGPTTranslator;
