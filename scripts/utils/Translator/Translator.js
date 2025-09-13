"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const htmlparser2_1 = require("htmlparser2");
/**
 * Base Translator class standardizes interface for translators and implements common logging.
 */
class Translator {
    /**
     * Translate a string to the given locale.
     * Implements common logging logic, while concrete subclasses handle actual translations.
     */
    async translate(targetLang, text, context) {
        const isEmpty = !text || text.trim().length === 0;
        if (isEmpty) {
            return '';
        }
        const result = await this.performTranslation(targetLang, text, context);
        const prefix = `🧠 Translated to [${targetLang}]: `;
        console.log(`${prefix}"${this.trimForLogs(text)}"\n${''.padStart(prefix.length - 2, ' ')}→ "${this.trimForLogs(result)}"`);
        if (context) {
            console.log(`${''.padStart(prefix.length - 2, ' ')}[context] ${this.trimForLogs(context)}`);
        }
        return result;
    }
    /**
     * Trim a string to keep logs readable.
     */
    trimForLogs(text) {
        return `${text.slice(0, 80)}${text.length > 80 ? '...' : ''}`;
    }
    /**
     * Validate that placeholders are all present and unchanged before and after translation.
     */
    validateTemplatePlaceholders(original, translated) {
        const extractPlaceholders = (s) => Array.from(s.matchAll(/\$\{[^}]*}/g))
            .map((m) => m[0])
            .sort();
        const originalSpans = extractPlaceholders(original);
        const translatedSpans = extractPlaceholders(translated);
        return JSON.stringify(originalSpans) === JSON.stringify(translatedSpans);
    }
    /**
     * Validate that the HTML structure is the same before and after translation.
     */
    validateTemplateHTML(original, translated) {
        // Attributes that are allowed to be translated
        const TRANSLATABLE_ATTRIBUTES = new Set(['alt', 'title', 'placeholder', 'aria-label', 'aria-describedby', 'aria-labelledby', 'value']);
        const parseHTMLStructure = (s) => {
            const doc = (0, htmlparser2_1.parseDocument)(s);
            const elements = htmlparser2_1.DomUtils.getElementsByTagName(() => true, doc, true);
            return elements.map((element) => {
                const tagName = element.name.toLowerCase();
                // Extract attributes, excluding translatable ones
                const attributes = [];
                if (element.attribs) {
                    for (const [attrName, attrValue] of Object.entries(element.attribs ?? {})) {
                        const normalizedAttrName = attrName.toLowerCase();
                        if (!TRANSLATABLE_ATTRIBUTES.has(normalizedAttrName)) {
                            attributes.push(`${normalizedAttrName}="${attrValue ?? ''}"`);
                        }
                    }
                }
                return {
                    tagName,
                    attributes: attributes.sort(),
                };
            });
        };
        const originalStructure = parseHTMLStructure(original);
        const translatedStructure = parseHTMLStructure(translated);
        // Compare structures (tag names and non-translatable attributes)
        return JSON.stringify(originalStructure) === JSON.stringify(translatedStructure);
    }
}
exports.default = Translator;
