"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFrequentlyUsedEmojis = exports.getRemovedSkinToneEmoji = exports.getEmojiReactionDetails = exports.getUniqueEmojiCodes = exports.getPreferredEmojiCode = exports.getPreferredSkinToneIndex = exports.getEmojiCodeWithSkinColor = exports.getLocalizedEmojiName = exports.findEmojiByCode = exports.findEmojiByName = void 0;
exports.getProcessedText = getProcessedText;
exports.getHeaderEmojis = getHeaderEmojis;
exports.mergeEmojisWithFrequentlyUsedEmojis = mergeEmojisWithFrequentlyUsedEmojis;
exports.containsOnlyEmojis = containsOnlyEmojis;
exports.replaceEmojis = replaceEmojis;
exports.suggestEmojis = suggestEmojis;
exports.replaceAndExtractEmojis = replaceAndExtractEmojis;
exports.extractEmojis = extractEmojis;
exports.getAddedEmojis = getAddedEmojis;
exports.isFirstLetterEmoji = isFirstLetterEmoji;
exports.hasAccountIDEmojiReacted = hasAccountIDEmojiReacted;
exports.getSpacersIndexes = getSpacersIndexes;
exports.splitTextWithEmojis = splitTextWithEmojis;
exports.containsCustomEmoji = containsCustomEmoji;
exports.containsOnlyCustomEmoji = containsOnlyCustomEmoji;
const expensify_common_1 = require("expensify-common");
const sortBy_1 = require("lodash/sortBy");
const react_1 = require("react");
const Emojis = require("@assets/emojis");
const Text_1 = require("@components/Text");
const CONST_1 = require("@src/CONST");
const LOCALES_1 = require("@src/CONST/LOCALES");
const memoize_1 = require("./memoize");
const findEmojiByName = (name) => Emojis.emojiNameTable[name];
exports.findEmojiByName = findEmojiByName;
const findEmojiByCode = (code) => Emojis.emojiCodeTableWithSkinTones[code];
exports.findEmojiByCode = findEmojiByCode;
const sortByName = (emoji, emojiData) => !emoji.name.includes(emojiData[0].toLowerCase().slice(1));
const processFrequentlyUsedEmojis = (emojiList) => {
    if (!emojiList) {
        return [];
    }
    const processedFrequentlyUsedEmojis = emojiList
        ?.map((item) => {
        let emoji = item;
        if (!item.code) {
            emoji = { ...emoji, ...findEmojiByName(item.name) };
        }
        if (!item.name) {
            emoji = { ...emoji, ...findEmojiByCode(item.code) };
        }
        const emojiWithSkinTones = Emojis.emojiCodeTableWithSkinTones[emoji.code];
        if (!emojiWithSkinTones) {
            return null;
        }
        return { ...emojiWithSkinTones, count: item.count, lastUpdatedAt: item.lastUpdatedAt };
    })
        .filter((emoji) => !!emoji) ?? [];
    // On AddComment API response, each variant of the same emoji (with different skin tones) is
    // treated as a separate entry due to unique emoji codes for each variant.
    // So merge duplicate emojis, sum their counts, and use the latest lastUpdatedAt timestamp, then sort accordingly.
    const frequentlyUsedEmojiCodesToObjects = new Map();
    processedFrequentlyUsedEmojis.forEach((emoji) => {
        const existingEmoji = frequentlyUsedEmojiCodesToObjects.get(emoji.code);
        if (existingEmoji) {
            existingEmoji.count += emoji.count;
            existingEmoji.lastUpdatedAt = Math.max(existingEmoji.lastUpdatedAt, emoji.lastUpdatedAt);
        }
        else {
            frequentlyUsedEmojiCodesToObjects.set(emoji.code, emoji);
        }
    });
    return Array.from(frequentlyUsedEmojiCodesToObjects.values()).sort((a, b) => {
        if (a.count !== b.count) {
            return b.count - a.count;
        }
        return b.lastUpdatedAt - a.lastUpdatedAt;
    });
};
exports.processFrequentlyUsedEmojis = processFrequentlyUsedEmojis;
/**
 * Given an English emoji name, get its localized version
 */
const getLocalizedEmojiName = (name, locale) => {
    const normalizedLocale = locale && (0, LOCALES_1.isFullySupportedLocale)(locale) ? locale : CONST_1.default.LOCALES.EN;
    if (normalizedLocale === CONST_1.default.LOCALES.DEFAULT) {
        return name;
    }
    const emojiCode = Emojis.emojiNameTable[name]?.code ?? '';
    return Emojis.localeEmojis[normalizedLocale]?.[emojiCode]?.name ?? '';
};
exports.getLocalizedEmojiName = getLocalizedEmojiName;
/**
 * Get the unicode code of an emoji in base 16.
 */
const getEmojiUnicode = (0, memoize_1.default)((input) => {
    if (input.length === 0) {
        return '';
    }
    if (input.length === 1) {
        return input
            .charCodeAt(0)
            .toString()
            .split(' ')
            .map((val) => parseInt(val, 10).toString(16))
            .join(' ');
    }
    const pairs = [];
    // Some Emojis in UTF-16 are stored as a pair of 2 Unicode characters (e.g. Flags)
    // The first char is generally between the range U+D800 to U+DBFF called High surrogate
    // & the second char between the range U+DC00 to U+DFFF called low surrogate
    // More info in the following links:
    // 1. https://docs.microsoft.com/en-us/windows/win32/intl/surrogates-and-supplementary-characters
    // 2. https://thekevinscott.com/emojis-in-javascript/
    for (let i = 0; i < input.length; i++) {
        if (input.charCodeAt(i) >= 0xd800 && input.charCodeAt(i) <= 0xdbff) {
            // high surrogate
            if (input.charCodeAt(i + 1) >= 0xdc00 && input.charCodeAt(i + 1) <= 0xdfff) {
                // low surrogate
                pairs.push((input.charCodeAt(i) - 0xd800) * 0x400 + (input.charCodeAt(i + 1) - 0xdc00) + 0x10000);
            }
        }
        else if (input.charCodeAt(i) < 0xd800 || input.charCodeAt(i) > 0xdfff) {
            // modifiers and joiners
            pairs.push(input.charCodeAt(i));
        }
    }
    return pairs.map((val) => parseInt(String(val), 10).toString(16)).join(' ');
}, { monitoringName: 'getEmojiUnicode' });
/**
 * Validates first character is emoji in text string
 */
function isFirstLetterEmoji(message) {
    const trimmedMessage = expensify_common_1.Str.replaceAll(message.replace(/ /g, ''), '\n', '');
    const match = trimmedMessage.match(CONST_1.default.REGEX.ALL_EMOJIS);
    if (!match) {
        return false;
    }
    return trimmedMessage.startsWith(match[0]);
}
/**
 * Validates that this message contains only emojis
 */
function containsOnlyEmojis(message) {
    const trimmedMessage = expensify_common_1.Str.replaceAll(message.replace(/ /g, ''), '\n', '');
    const match = trimmedMessage.match(CONST_1.default.REGEX.ALL_EMOJIS);
    if (!match) {
        return false;
    }
    const codes = [];
    match.map((emoji) => getEmojiUnicode(emoji)
        .split(' ')
        .map((code) => {
        if (!CONST_1.default.INVISIBLE_CODEPOINTS.includes(code)) {
            codes.push(code);
        }
        return code;
    }));
    // Emojis are stored as multiple characters, so we're using spread operator
    // to iterate over the actual emojis, not just characters that compose them
    const messageCodes = [...trimmedMessage]
        .map((char) => getEmojiUnicode(char))
        .filter((string) => string.length > 0 && !CONST_1.default.INVISIBLE_CODEPOINTS.includes(string));
    return codes.length === messageCodes.length;
}
/**
 * Get the header emojis with their code, icon and index
 */
function getHeaderEmojis(emojis) {
    const headerIndices = [];
    emojis.forEach((emoji, index) => {
        if (!('header' in emoji)) {
            return;
        }
        headerIndices.push({ code: emoji.code, index, icon: emoji.icon });
    });
    return headerIndices;
}
/**
 * Get number of empty spaces to be filled to get equal emojis for every row
 */
function getDynamicSpacing(emojiCount, suffix) {
    const spacerEmojis = [];
    let modLength = CONST_1.default.EMOJI_NUM_PER_ROW - (emojiCount % CONST_1.default.EMOJI_NUM_PER_ROW);
    // Empty spaces is pushed if the given row has less than eight emojis
    while (modLength > 0 && modLength < CONST_1.default.EMOJI_NUM_PER_ROW) {
        spacerEmojis.push({
            code: `${CONST_1.default.EMOJI_SPACER}_${suffix}_${modLength}`,
            spacer: true,
        });
        modLength -= 1;
    }
    return spacerEmojis;
}
/**
 * Add dynamic spaces to emoji categories
 */
function addSpacesToEmojiCategories(emojis) {
    let updatedEmojis = [];
    emojis.forEach((emoji, index) => {
        if (emoji && typeof emoji === 'object' && 'header' in emoji) {
            updatedEmojis = updatedEmojis.concat(getDynamicSpacing(updatedEmojis.length, index), [emoji], getDynamicSpacing(1, index));
            return;
        }
        updatedEmojis.push(emoji);
    });
    return updatedEmojis;
}
/**
 * Get a merged array with frequently used emojis
 */
function mergeEmojisWithFrequentlyUsedEmojis(emojis, frequentlyUsedEmojis) {
    if (frequentlyUsedEmojis.length === 0) {
        return addSpacesToEmojiCategories(emojis);
    }
    const formattedFrequentlyUsedEmojis = frequentlyUsedEmojis.map((frequentlyUsedEmoji) => {
        // Frequently used emojis in the old format will have name/types/code stored with them
        // The back-end may not always have both, so we'll need to fill them in.
        if (!('code' in frequentlyUsedEmoji)) {
            return findEmojiByName(frequentlyUsedEmoji.name);
        }
        if (!('name' in frequentlyUsedEmoji)) {
            return findEmojiByCode(frequentlyUsedEmoji.code);
        }
        return frequentlyUsedEmoji;
    });
    const mergedEmojis = [Emojis.categoryFrequentlyUsed, ...formattedFrequentlyUsedEmojis, ...emojis];
    return addSpacesToEmojiCategories(mergedEmojis);
}
/**
 * Given an emoji item object, return an emoji code based on its type.
 */
const getEmojiCodeWithSkinColor = (item, preferredSkinToneIndex) => {
    const { code, types } = item;
    if (typeof preferredSkinToneIndex === 'number' && types?.[preferredSkinToneIndex]) {
        return types.at(preferredSkinToneIndex) ?? '';
    }
    return code;
};
exports.getEmojiCodeWithSkinColor = getEmojiCodeWithSkinColor;
/**
 * Extracts emojis from a given text.
 *
 * @param text - The text to extract emojis from.
 * @returns An array of emoji codes.
 */
function extractEmojis(text) {
    if (!text) {
        return [];
    }
    // Parse Emojis including skin tones - Eg: ['👩🏻', '👩🏻', '👩🏼', '👩🏻', '👩🏼', '👩']
    const parsedEmojis = text.match(CONST_1.default.REGEX.ALL_EMOJIS);
    if (!parsedEmojis) {
        return [];
    }
    const emojis = [];
    // Text can contain similar emojis as well as their skin tone variants. Create a Set to remove duplicate emojis from the search.
    for (const character of parsedEmojis) {
        const emoji = Emojis.emojiCodeTableWithSkinTones[character];
        if (emoji) {
            emojis.push(emoji);
        }
    }
    return emojis;
}
/**
 * Take the current emojis and the former emojis and return the emojis that were added, if we add an already existing emoji, we also return it
 * @param currentEmojis The array of current emojis
 * @param formerEmojis The array of former emojis
 * @returns The array of added emojis
 */
function getAddedEmojis(currentEmojis, formerEmojis) {
    const newEmojis = [...currentEmojis];
    // We are removing the emojis from the newEmojis array if they were already present before.
    formerEmojis.forEach((formerEmoji) => {
        const indexOfAlreadyPresentEmoji = newEmojis.findIndex((newEmoji) => newEmoji.code === formerEmoji.code);
        if (indexOfAlreadyPresentEmoji >= 0) {
            newEmojis.splice(indexOfAlreadyPresentEmoji, 1);
        }
    });
    return newEmojis;
}
/**
 * Replace any emoji name in a text with the emoji icon.
 * If we're on mobile, we also add a space after the emoji granted there's no text after it.
 */
function replaceEmojis(text, preferredSkinTone = CONST_1.default.EMOJI_DEFAULT_SKIN_TONE, locale = CONST_1.default.LOCALES.DEFAULT) {
    // emojisTrie is importing the emoji JSON file on the app starting and we want to avoid it
    const emojisTrie = require('./EmojiTrie').default;
    const normalizedLocale = locale && (0, LOCALES_1.isFullySupportedLocale)(locale) ? locale : CONST_1.default.LOCALES.EN;
    const trie = emojisTrie[normalizedLocale];
    if (!trie) {
        return { text, emojis: [] };
    }
    let newText = text;
    const emojis = [];
    const emojiData = text.match(CONST_1.default.REGEX.EMOJI_NAME);
    if (!emojiData || emojiData.length === 0) {
        return { text: newText, emojis };
    }
    let cursorPosition;
    for (const emoji of emojiData) {
        const name = emoji.slice(1, -1);
        let checkEmoji = trie.search(name);
        // If the user has selected a language other than English, and the emoji doesn't exist in that language,
        // we will check if the emoji exists in English.
        if (normalizedLocale !== CONST_1.default.LOCALES.DEFAULT && !checkEmoji?.metaData?.code) {
            const englishTrie = emojisTrie[CONST_1.default.LOCALES.DEFAULT];
            if (englishTrie) {
                checkEmoji = englishTrie.search(name);
            }
        }
        if (checkEmoji?.metaData?.code && checkEmoji?.metaData?.name) {
            const emojiReplacement = getEmojiCodeWithSkinColor(checkEmoji.metaData, preferredSkinTone);
            emojis.push({
                name,
                code: checkEmoji.metaData?.code,
                types: checkEmoji.metaData.types,
            });
            // Set the cursor to the end of the last replaced Emoji. Note that we position after
            // the extra space, if we added one.
            cursorPosition = newText.indexOf(emoji) + (emojiReplacement?.length ?? 0);
            newText = newText.replace(emoji, emojiReplacement ?? '');
        }
    }
    // cursorPosition, when not undefined, points to the end of the last emoji that was replaced.
    // In that case we want to append a space at the cursor position, but only if the next character
    // is not already a space (to avoid double spaces).
    if (cursorPosition && cursorPosition > 0) {
        const space = ' ';
        if (newText.charAt(cursorPosition) !== space) {
            newText = newText.slice(0, cursorPosition) + space + newText.slice(cursorPosition);
        }
        cursorPosition += space.length;
    }
    return { text: newText, emojis, cursorPosition };
}
/**
 * Find all emojis in a text and replace them with their code.
 */
function replaceAndExtractEmojis(text, preferredSkinTone = CONST_1.default.EMOJI_DEFAULT_SKIN_TONE, locale = CONST_1.default.LOCALES.DEFAULT) {
    const normalizedLocale = locale && (0, LOCALES_1.isFullySupportedLocale)(locale) ? locale : CONST_1.default.LOCALES.EN;
    const { text: convertedText = '', emojis = [], cursorPosition } = replaceEmojis(text, preferredSkinTone, normalizedLocale);
    return {
        text: convertedText,
        emojis: emojis.concat(extractEmojis(text)),
        cursorPosition,
    };
}
/**
 * Suggest emojis when typing emojis prefix after colon
 * @param [limit] - matching emojis limit
 */
function suggestEmojis(text, locale = CONST_1.default.LOCALES.DEFAULT, limit = CONST_1.default.AUTO_COMPLETE_SUGGESTER.MAX_AMOUNT_OF_SUGGESTIONS) {
    // emojisTrie is importing the emoji JSON file on the app starting and we want to avoid it
    const emojisTrie = require('./EmojiTrie').default;
    const normalizedLocale = locale && (0, LOCALES_1.isFullySupportedLocale)(locale) ? locale : CONST_1.default.LOCALES.EN;
    const trie = emojisTrie[normalizedLocale];
    if (!trie) {
        return [];
    }
    const emojiData = text.match(CONST_1.default.REGEX.EMOJI_SUGGESTIONS);
    if (!emojiData) {
        return [];
    }
    const matching = [];
    const nodes = trie.getAllMatchingWords(emojiData[0].toLowerCase().slice(1), limit);
    for (const node of nodes) {
        if (node.metaData?.code && !matching.find((obj) => obj.name === node.name)) {
            if (matching.length === limit) {
                return (0, sortBy_1.default)(matching, (emoji) => sortByName(emoji, emojiData));
            }
            matching.push({ code: node.metaData.code, name: node.name, types: node.metaData.types });
        }
        const suggestions = node.metaData.suggestions;
        if (!suggestions) {
            return;
        }
        for (const suggestion of suggestions) {
            if (matching.length === limit) {
                return (0, sortBy_1.default)(matching, (emoji) => sortByName(emoji, emojiData));
            }
            if (!matching.find((obj) => obj.name === suggestion.name)) {
                matching.push({ ...suggestion });
            }
        }
    }
    return (0, sortBy_1.default)(matching, (emoji) => sortByName(emoji, emojiData));
}
/**
 * Retrieve preferredSkinTone as Number to prevent legacy 'default' String value
 */
const getPreferredSkinToneIndex = (value) => {
    if (value !== null && Number.isInteger(Number(value))) {
        return Number(value);
    }
    return CONST_1.default.EMOJI_DEFAULT_SKIN_TONE;
};
exports.getPreferredSkinToneIndex = getPreferredSkinToneIndex;
/**
 * Given an emoji object it returns the correct emoji code
 * based on the users preferred skin tone.
 */
const getPreferredEmojiCode = (emoji, preferredSkinTone) => {
    if (emoji.types && typeof preferredSkinTone === 'number') {
        const emojiCodeWithSkinTone = preferredSkinTone >= 0 ? emoji.types.at(preferredSkinTone) : undefined;
        // Note: it can happen that preferredSkinTone has a outdated format,
        // so it makes sense to check if we actually got a valid emoji code back
        if (emojiCodeWithSkinTone) {
            return emojiCodeWithSkinTone;
        }
    }
    return emoji.code;
};
exports.getPreferredEmojiCode = getPreferredEmojiCode;
/**
 * Given an emoji object and a list of senders it will return an
 * array of emoji codes, that represents all used variations of the
 * emoji, sorted by the reaction timestamp.
 */
const getUniqueEmojiCodes = (emojiAsset, users) => {
    const emojiCodes = Object.values(users ?? {}).reduce((result, userSkinTones) => {
        Object.keys(userSkinTones?.skinTones ?? {}).forEach((skinTone) => {
            const createdAt = userSkinTones.skinTones[Number(skinTone)];
            const emojiCode = getPreferredEmojiCode(emojiAsset, Number(skinTone));
            if (!!emojiCode && (!result[emojiCode] || createdAt < result[emojiCode])) {
                // eslint-disable-next-line no-param-reassign
                result[emojiCode] = createdAt;
            }
        });
        return result;
    }, {});
    return Object.keys(emojiCodes ?? {}).sort((a, b) => (new Date(emojiCodes[a]) > new Date(emojiCodes[b]) ? 1 : -1));
};
exports.getUniqueEmojiCodes = getUniqueEmojiCodes;
/**
 * Given an emoji reaction object and its name, it populates it with the oldest reaction timestamps.
 */
const enrichEmojiReactionWithTimestamps = (emoji, emojiName) => {
    let oldestEmojiTimestamp = null;
    const usersWithTimestamps = {};
    Object.entries(emoji.users ?? {}).forEach(([id, user]) => {
        const userTimestamps = Object.values(user?.skinTones ?? {});
        const oldestUserTimestamp = userTimestamps.reduce((min, curr) => {
            if (min) {
                return curr < min ? curr : min;
            }
            return curr;
        }, userTimestamps.at(0));
        if (!oldestUserTimestamp) {
            return;
        }
        if (!oldestEmojiTimestamp || oldestUserTimestamp < oldestEmojiTimestamp) {
            oldestEmojiTimestamp = oldestUserTimestamp;
        }
        usersWithTimestamps[id] = {
            ...user,
            id,
            oldestTimestamp: oldestUserTimestamp,
        };
    });
    return {
        ...emoji,
        users: usersWithTimestamps,
        // Just in case two emojis have the same timestamp, also combine the timestamp with the
        // emojiName so that the order will always be the same. Without this, the order can be pretty random
        // and shift around a little bit.
        oldestTimestamp: (oldestEmojiTimestamp ?? emoji.createdAt) + emojiName,
    };
};
/**
 * Returns true if the accountID has reacted to the report action (with the given skin tone).
 * Uses the NEW FORMAT for "emojiReactions"
 * @param usersReactions - all the users reactions
 */
function hasAccountIDEmojiReacted(accountID, usersReactions, skinTone) {
    if (skinTone === undefined) {
        return !!usersReactions[accountID];
    }
    const userReaction = usersReactions[accountID];
    if (!userReaction?.skinTones || !Object.values(userReaction?.skinTones ?? {}).length) {
        return false;
    }
    return !!userReaction.skinTones[skinTone];
}
/**
 * Given an emoji reaction and current user's account ID, it returns the reusable details of the emoji reaction.
 */
const getEmojiReactionDetails = (emojiName, reaction, currentUserAccountID) => {
    const { users, oldestTimestamp } = enrichEmojiReactionWithTimestamps(reaction, emojiName);
    const emoji = findEmojiByName(emojiName);
    const emojiCodes = getUniqueEmojiCodes(emoji, users);
    const reactionCount = Object.values(users ?? {})
        .map((user) => Object.values(user?.skinTones ?? {}).length)
        .reduce((sum, curr) => sum + curr, 0);
    const hasUserReacted = hasAccountIDEmojiReacted(currentUserAccountID, users);
    const userAccountIDs = Object.values(users ?? {})
        .sort((a, b) => (a.oldestTimestamp > b.oldestTimestamp ? 1 : -1))
        .map((user) => Number(user.id));
    return {
        emoji,
        emojiCodes,
        reactionCount,
        hasUserReacted,
        userAccountIDs,
        oldestTimestamp,
    };
};
exports.getEmojiReactionDetails = getEmojiReactionDetails;
/**
 * Given an emoji code, returns an base emoji code without skin tone
 */
const getRemovedSkinToneEmoji = (emoji) => emoji?.replace(CONST_1.default.REGEX.EMOJI_SKIN_TONES, '');
exports.getRemovedSkinToneEmoji = getRemovedSkinToneEmoji;
function getSpacersIndexes(allEmojis) {
    const spacersIndexes = [];
    allEmojis.forEach((emoji, index) => {
        if (!(CONST_1.default.EMOJI_PICKER_ITEM_TYPES.SPACER in emoji)) {
            return;
        }
        spacersIndexes.push(index);
    });
    return spacersIndexes;
}
/** Splits the text with emojis into array if emojis exist in the text */
function splitTextWithEmojis(text = '') {
    if (!text) {
        return [];
    }
    const doesTextContainEmojis = new RegExp(CONST_1.default.REGEX.EMOJIS, CONST_1.default.REGEX.EMOJIS.flags.concat('g')).test(text);
    if (!doesTextContainEmojis) {
        return [];
    }
    // The regex needs to be cloned because `exec()` is a stateful operation and maintains the state inside
    // the regex variable itself, so we must have an independent instance for each function's call.
    const emojisRegex = new RegExp(CONST_1.default.REGEX.EMOJIS, CONST_1.default.REGEX.EMOJIS.flags.concat('g'));
    const splitText = [];
    let regexResult;
    let lastMatchIndexEnd = 0;
    do {
        regexResult = emojisRegex.exec(text);
        if (regexResult?.indices) {
            const matchIndexStart = regexResult.indices[0][0];
            const matchIndexEnd = regexResult.indices[0][1];
            if (matchIndexStart > lastMatchIndexEnd) {
                splitText.push({
                    text: text.slice(lastMatchIndexEnd, matchIndexStart),
                    isEmoji: false,
                });
            }
            splitText.push({
                text: text.slice(matchIndexStart, matchIndexEnd),
                isEmoji: true,
            });
            lastMatchIndexEnd = matchIndexEnd;
        }
    } while (regexResult !== null);
    if (lastMatchIndexEnd < text.length) {
        splitText.push({
            text: text.slice(lastMatchIndexEnd, text.length),
            isEmoji: false,
        });
    }
    return splitText;
}
function getProcessedText(processedTextArray, style) {
    return processedTextArray.map(({ text, isEmoji }, index) => isEmoji ? (<Text_1.default 
    // eslint-disable-next-line react/no-array-index-key
    key={index} style={style}>
                {text}
            </Text_1.default>) : (text));
}
function containsCustomEmoji(text) {
    if (!text) {
        return false;
    }
    const privateUseAreaRegex = CONST_1.default.REGEX.PRIVATE_USER_AREA;
    return privateUseAreaRegex.test(text);
}
function containsOnlyCustomEmoji(text) {
    if (!text) {
        return false;
    }
    const privateUseAreaRegex = CONST_1.default.REGEX.ONLY_PRIVATE_USER_AREA;
    return privateUseAreaRegex.test(text);
}
