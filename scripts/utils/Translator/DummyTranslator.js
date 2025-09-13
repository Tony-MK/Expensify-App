"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Translator_1 = require("./Translator");
class DummyTranslator extends Translator_1.default {
    performTranslation(targetLang, text, context) {
        return Promise.resolve(`[${targetLang}]${context ? `[ctx: ${context}]` : ''} ${text}`);
    }
}
exports.default = DummyTranslator;
