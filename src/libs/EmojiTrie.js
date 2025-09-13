"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEmojisTrie = void 0;
const emojis_1 = require("@assets/emojis");
const CONST_1 = require("@src/CONST");
const LOCALES_1 = require("@src/CONST/LOCALES");
const Timing_1 = require("./actions/Timing");
const StringUtils_1 = require("./StringUtils");
const Trie_1 = require("./Trie");
/**
 *
 * @param trie The Trie object.
 * @param keywords An array containing the keywords.
 * @param item An object containing the properties of the emoji.
 * @param name The localized name of the emoji.
 * @param shouldPrependKeyword Prepend the keyword (instead of append) to the suggestions
 */
function addKeywordsToTrie(trie, keywords, item, name, shouldPrependKeyword = false) {
    keywords.forEach((keyword) => {
        const keywordNode = trie.search(keyword);
        const normalizedKeyword = StringUtils_1.default.normalizeAccents(keyword);
        if (!keywordNode) {
            const metadata = { suggestions: [{ code: item.code, types: item.types, name }] };
            if (normalizedKeyword !== keyword) {
                trie.add(normalizedKeyword, metadata);
            }
            trie.add(keyword, metadata);
        }
        else {
            const suggestion = { code: item.code, types: item.types, name };
            const suggestions = shouldPrependKeyword ? [suggestion, ...(keywordNode.metaData.suggestions ?? [])] : [...(keywordNode.metaData.suggestions ?? []), suggestion];
            const newMetadata = {
                ...keywordNode.metaData,
                suggestions,
            };
            if (normalizedKeyword !== keyword) {
                trie.update(normalizedKeyword, newMetadata);
            }
            trie.update(keyword, newMetadata);
        }
    });
}
/**
 * Allows searching based on parts of the name. This turns 'white_large_square' into ['white_large_square', 'large_square', 'square'].
 *
 * @param name The emoji name
 * @returns An array containing the name parts
 */
function getNameParts(name) {
    const nameSplit = name.split('_');
    return nameSplit.map((namePart, index) => nameSplit.slice(index).join('_'));
}
function createTrie(lang = CONST_1.default.LOCALES.DEFAULT) {
    const trie = new Trie_1.default();
    const langEmojis = emojis_1.localeEmojis[lang];
    const defaultLangEmojis = emojis_1.localeEmojis[CONST_1.default.LOCALES.DEFAULT];
    const isDefaultLocale = lang === CONST_1.default.LOCALES.DEFAULT;
    emojis_1.default
        .filter((item) => !item.header)
        .forEach((item) => {
        const englishName = item.name;
        const localeName = langEmojis?.[item.code]?.name ?? englishName;
        const normalizedName = StringUtils_1.default.normalizeAccents(localeName);
        const node = trie.search(localeName);
        if (!node) {
            const metadata = { code: item.code, types: item.types, name: localeName, suggestions: [] };
            if (normalizedName !== localeName) {
                trie.add(normalizedName, metadata);
            }
            trie.add(localeName, metadata);
        }
        else {
            const newMetadata = { code: item.code, types: item.types, name: localeName, suggestions: node.metaData.suggestions };
            if (normalizedName !== localeName) {
                trie.update(normalizedName, newMetadata);
            }
            trie.update(localeName, newMetadata);
        }
        const nameParts = getNameParts(localeName).slice(1); // We remove the first part because we already index the full name.
        addKeywordsToTrie(trie, nameParts, item, localeName);
        // Add keywords for both the locale language and English to enable users to search using either language.
        const keywords = (langEmojis?.[item.code]?.keywords ?? []).concat(isDefaultLocale ? [] : (defaultLangEmojis?.[item.code]?.keywords ?? []));
        addKeywordsToTrie(trie, keywords, item, localeName);
        /**
         * If current language isn't the default, prepend the English name of the emoji in the suggestions as well.
         * We do this because when the user types the english name of the emoji, we want to show the emoji in the suggestions before all the others.
         */
        if (!isDefaultLocale) {
            const englishNameParts = getNameParts(englishName);
            addKeywordsToTrie(trie, englishNameParts, item, localeName, true);
        }
    });
    return trie;
}
const emojiTrieForLocale = Object.values(LOCALES_1.FULLY_SUPPORTED_LOCALES).reduce((acc, lang) => {
    acc[lang] = undefined;
    return acc;
}, {});
const buildEmojisTrie = (locale) => {
    if (emojiTrieForLocale[locale]) {
        return; // Return early if the locale is not supported or the trie is already built
    }
    Timing_1.default.start(CONST_1.default.TIMING.TRIE_INITIALIZATION);
    emojiTrieForLocale[locale] = createTrie(locale);
    Timing_1.default.end(CONST_1.default.TIMING.TRIE_INITIALIZATION);
};
exports.buildEmojisTrie = buildEmojisTrie;
exports.default = emojiTrieForLocale;
