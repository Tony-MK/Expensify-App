"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const emojis_1 = require("@assets/emojis");
const useKeyboardState_1 = require("@hooks/useKeyboardState");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePreferredEmojiSkinTone_1 = require("@hooks/usePreferredEmojiSkinTone");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const EmojiUtils_1 = require("@libs/EmojiUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useEmojiPickerMenu = () => {
    const emojiListRef = (0, react_1.useRef)(null);
    const [frequentlyUsedEmojis] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FREQUENTLY_USED_EMOJIS, { canBeMissing: true });
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    const allEmojis = (0, react_1.useMemo)(() => (0, EmojiUtils_1.mergeEmojisWithFrequentlyUsedEmojis)(emojis_1.default, (0, EmojiUtils_1.processFrequentlyUsedEmojis)(frequentlyUsedEmojis)), [frequentlyUsedEmojis]);
    const headerEmojis = (0, react_1.useMemo)(() => (0, EmojiUtils_1.getHeaderEmojis)(allEmojis), [allEmojis]);
    const headerRowIndices = (0, react_1.useMemo)(() => headerEmojis.map((headerEmoji) => headerEmoji.index), [headerEmojis]);
    const spacersIndexes = (0, react_1.useMemo)(() => (0, EmojiUtils_1.getSpacersIndexes)(allEmojis), [allEmojis]);
    const [filteredEmojis, setFilteredEmojis] = (0, react_1.useState)(allEmojis);
    const [headerIndices, setHeaderIndices] = (0, react_1.useState)(headerRowIndices);
    const isListFiltered = allEmojis.length !== filteredEmojis.length;
    const { preferredLocale } = (0, useLocalize_1.default)();
    const [preferredSkinTone] = (0, usePreferredEmojiSkinTone_1.default)();
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { keyboardHeight } = (0, useKeyboardState_1.default)();
    /**
     * The EmojiPicker sets the `innerContainerStyle` with `maxHeight: '95%'` in `styles.popoverInnerContainer`
     * to prevent the list from being cut off when the list height exceeds the container's height.
     * To calculate the available list height, we subtract the keyboard height from the `windowHeight`
     * to ensure the list is properly adjusted when the keyboard is visible.
     */
    const listStyle = StyleUtils.getEmojiPickerListHeight(isListFiltered, windowHeight * 0.95 - keyboardHeight);
    (0, react_1.useEffect)(() => {
        setFilteredEmojis(allEmojis);
    }, [allEmojis]);
    (0, react_1.useEffect)(() => {
        setHeaderIndices(headerRowIndices);
    }, [headerRowIndices]);
    /**
     * Suggest emojis based on the search term
     */
    const suggestEmojisCallback = (0, react_1.useCallback)((searchTerm) => {
        const normalizedSearchTerm = searchTerm.toLowerCase().trim().replaceAll(':', '');
        const emojisSuggestions = (0, EmojiUtils_1.suggestEmojis)(`:${normalizedSearchTerm}`, preferredLocale, allEmojis.length);
        return [normalizedSearchTerm, emojisSuggestions];
    }, [allEmojis, preferredLocale]);
    return {
        allEmojis,
        headerEmojis,
        headerRowIndices,
        filteredEmojis,
        headerIndices,
        setFilteredEmojis,
        setHeaderIndices,
        isListFiltered,
        suggestEmojis: suggestEmojisCallback,
        preferredSkinTone,
        listStyle,
        emojiListRef,
        spacersIndexes,
    };
};
exports.default = useEmojiPickerMenu;
