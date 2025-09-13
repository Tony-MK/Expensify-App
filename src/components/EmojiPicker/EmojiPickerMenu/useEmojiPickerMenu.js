"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var emojis_1 = require("@assets/emojis");
var useKeyboardState_1 = require("@hooks/useKeyboardState");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var usePreferredEmojiSkinTone_1 = require("@hooks/usePreferredEmojiSkinTone");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useWindowDimensions_1 = require("@hooks/useWindowDimensions");
var EmojiUtils_1 = require("@libs/EmojiUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var useEmojiPickerMenu = function () {
    var emojiListRef = (0, react_1.useRef)(null);
    var frequentlyUsedEmojis = (0, useOnyx_1.default)(ONYXKEYS_1.default.FREQUENTLY_USED_EMOJIS, { canBeMissing: true })[0];
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    var allEmojis = (0, react_1.useMemo)(function () { return (0, EmojiUtils_1.mergeEmojisWithFrequentlyUsedEmojis)(emojis_1.default, (0, EmojiUtils_1.processFrequentlyUsedEmojis)(frequentlyUsedEmojis)); }, [frequentlyUsedEmojis]);
    var headerEmojis = (0, react_1.useMemo)(function () { return (0, EmojiUtils_1.getHeaderEmojis)(allEmojis); }, [allEmojis]);
    var headerRowIndices = (0, react_1.useMemo)(function () { return headerEmojis.map(function (headerEmoji) { return headerEmoji.index; }); }, [headerEmojis]);
    var spacersIndexes = (0, react_1.useMemo)(function () { return (0, EmojiUtils_1.getSpacersIndexes)(allEmojis); }, [allEmojis]);
    var _a = (0, react_1.useState)(allEmojis), filteredEmojis = _a[0], setFilteredEmojis = _a[1];
    var _b = (0, react_1.useState)(headerRowIndices), headerIndices = _b[0], setHeaderIndices = _b[1];
    var isListFiltered = allEmojis.length !== filteredEmojis.length;
    var preferredLocale = (0, useLocalize_1.default)().preferredLocale;
    var preferredSkinTone = (0, usePreferredEmojiSkinTone_1.default)()[0];
    var windowHeight = (0, useWindowDimensions_1.default)().windowHeight;
    var StyleUtils = (0, useStyleUtils_1.default)();
    var keyboardHeight = (0, useKeyboardState_1.default)().keyboardHeight;
    /**
     * The EmojiPicker sets the `innerContainerStyle` with `maxHeight: '95%'` in `styles.popoverInnerContainer`
     * to prevent the list from being cut off when the list height exceeds the container's height.
     * To calculate the available list height, we subtract the keyboard height from the `windowHeight`
     * to ensure the list is properly adjusted when the keyboard is visible.
     */
    var listStyle = StyleUtils.getEmojiPickerListHeight(isListFiltered, windowHeight * 0.95 - keyboardHeight);
    (0, react_1.useEffect)(function () {
        setFilteredEmojis(allEmojis);
    }, [allEmojis]);
    (0, react_1.useEffect)(function () {
        setHeaderIndices(headerRowIndices);
    }, [headerRowIndices]);
    /**
     * Suggest emojis based on the search term
     */
    var suggestEmojisCallback = (0, react_1.useCallback)(function (searchTerm) {
        var normalizedSearchTerm = searchTerm.toLowerCase().trim().replaceAll(':', '');
        var emojisSuggestions = (0, EmojiUtils_1.suggestEmojis)(":".concat(normalizedSearchTerm), preferredLocale, allEmojis.length);
        return [normalizedSearchTerm, emojisSuggestions];
    }, [allEmojis, preferredLocale]);
    return {
        allEmojis: allEmojis,
        headerEmojis: headerEmojis,
        headerRowIndices: headerRowIndices,
        filteredEmojis: filteredEmojis,
        headerIndices: headerIndices,
        setFilteredEmojis: setFilteredEmojis,
        setHeaderIndices: setHeaderIndices,
        isListFiltered: isListFiltered,
        suggestEmojis: suggestEmojisCallback,
        preferredSkinTone: preferredSkinTone,
        listStyle: listStyle,
        emojiListRef: emojiListRef,
        spacersIndexes: spacersIndexes,
    };
};
exports.default = useEmojiPickerMenu;
