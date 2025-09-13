"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const EmojiSuggestions_1 = require("@components/EmojiSuggestions");
const useArrowKeyFocusManager_1 = require("@hooks/useArrowKeyFocusManager");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const EmojiUtils_1 = require("@libs/EmojiUtils");
const SuggestionUtils_1 = require("@libs/SuggestionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
/**
 * Check if this piece of string looks like an emoji
 */
const isEmojiCode = (str, pos) => {
    const leftWords = str.slice(0, pos).split(CONST_1.default.REGEX.SPECIAL_CHAR_OR_EMOJI);
    const leftWord = leftWords.at(-1) ?? '';
    return CONST_1.default.REGEX.HAS_COLON_ONLY_AT_THE_BEGINNING.test(leftWord) && leftWord.length > 2;
};
const defaultSuggestionsValues = {
    suggestedEmojis: [],
    colonIndex: -1,
    shouldShowSuggestionMenu: false,
};
function SuggestionEmoji({ value, selection, setSelection, updateComment, isAutoSuggestionPickerLarge, resetKeyboardInput, measureParentContainerAndReportCursor, isComposerFocused }, ref) {
    const [preferredSkinTone = CONST_1.default.EMOJI_DEFAULT_SKIN_TONE] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PREFERRED_EMOJI_SKIN_TONE, { canBeMissing: true, selector: EmojiUtils_1.getPreferredSkinToneIndex });
    const [suggestionValues, setSuggestionValues] = (0, react_1.useState)(defaultSuggestionsValues);
    const suggestionValuesRef = (0, react_1.useRef)(suggestionValues);
    // eslint-disable-next-line react-compiler/react-compiler
    suggestionValuesRef.current = suggestionValues;
    const isEmojiSuggestionsMenuVisible = suggestionValues.suggestedEmojis.length > 0 && suggestionValues.shouldShowSuggestionMenu;
    const [highlightedEmojiIndex, setHighlightedEmojiIndex] = (0, useArrowKeyFocusManager_1.default)({
        isActive: isEmojiSuggestionsMenuVisible,
        maxIndex: suggestionValues.suggestedEmojis.length - 1,
        shouldExcludeTextAreaNodes: false,
    });
    const { preferredLocale } = (0, useLocalize_1.default)();
    // Used to decide whether to block the suggestions list from showing to prevent flickering
    const shouldBlockCalc = (0, react_1.useRef)(false);
    /**
     * Replace the code of emoji and update selection
     * @param {Number} selectedEmoji
     */
    const insertSelectedEmoji = (0, react_1.useCallback)((highlightedEmojiIndexInner) => {
        const commentBeforeColon = value.slice(0, suggestionValues.colonIndex);
        const emojiObject = highlightedEmojiIndexInner !== -1 ? suggestionValues.suggestedEmojis.at(highlightedEmojiIndexInner) : undefined;
        const emojiCode = emojiObject?.types?.at(preferredSkinTone) && preferredSkinTone !== -1 ? emojiObject.types.at(preferredSkinTone) : emojiObject?.code;
        const commentAfterColonWithEmojiNameRemoved = value.slice(selection.end);
        updateComment(`${commentBeforeColon}${emojiCode} ${(0, SuggestionUtils_1.trimLeadingSpace)(commentAfterColonWithEmojiNameRemoved)}`, true);
        // In some Android phones keyboard, the text to search for the emoji is not cleared
        // will be added after the user starts typing again on the keyboard. This package is
        // a workaround to reset the keyboard natively.
        resetKeyboardInput?.();
        setSelection({
            start: suggestionValues.colonIndex + (emojiCode?.length ?? 0) + CONST_1.default.SPACE_LENGTH,
            end: suggestionValues.colonIndex + (emojiCode?.length ?? 0) + CONST_1.default.SPACE_LENGTH,
        });
        setSuggestionValues((prevState) => ({ ...prevState, suggestedEmojis: [] }));
    }, [preferredSkinTone, resetKeyboardInput, selection.end, setSelection, suggestionValues.colonIndex, suggestionValues.suggestedEmojis, updateComment, value]);
    /**
     * Clean data related to suggestions
     */
    const resetSuggestions = (0, react_1.useCallback)(() => {
        setSuggestionValues(defaultSuggestionsValues);
    }, []);
    const updateShouldShowSuggestionMenuToFalse = (0, react_1.useCallback)(() => {
        setSuggestionValues((prevState) => {
            if (prevState.shouldShowSuggestionMenu) {
                return { ...prevState, shouldShowSuggestionMenu: false };
            }
            return prevState;
        });
    }, []);
    /**
     * Listens for keyboard shortcuts and applies the action
     */
    const triggerHotkeyActions = (0, react_1.useCallback)((e) => {
        const suggestionsExist = suggestionValues.suggestedEmojis.length > 0;
        if (((!e.shiftKey && e.key === CONST_1.default.KEYBOARD_SHORTCUTS.ENTER.shortcutKey) || e.key === CONST_1.default.KEYBOARD_SHORTCUTS.TAB.shortcutKey) && suggestionsExist) {
            e.preventDefault();
            if (suggestionValues.suggestedEmojis.length > 0) {
                insertSelectedEmoji(highlightedEmojiIndex);
            }
            return true;
        }
        if (e.key === CONST_1.default.KEYBOARD_SHORTCUTS.ESCAPE.shortcutKey) {
            e.preventDefault();
            if (suggestionsExist) {
                resetSuggestions();
            }
            return true;
        }
    }, [highlightedEmojiIndex, insertSelectedEmoji, resetSuggestions, suggestionValues.suggestedEmojis.length]);
    /**
     * Calculates and cares about the content of an Emoji Suggester
     */
    const calculateEmojiSuggestion = (0, react_1.useCallback)((newValue, selectionStart, selectionEnd) => {
        if (selectionStart !== selectionEnd || !selectionEnd || shouldBlockCalc.current || !newValue || (selectionStart === 0 && selectionEnd === 0)) {
            shouldBlockCalc.current = false;
            resetSuggestions();
            return;
        }
        const leftString = newValue.substring(0, selectionEnd);
        const colonIndex = leftString.lastIndexOf(':');
        const isCurrentlyShowingEmojiSuggestion = isEmojiCode(newValue, selectionEnd);
        const nextState = {
            suggestedEmojis: [],
            colonIndex,
            shouldShowSuggestionMenu: false,
        };
        const newSuggestedEmojis = (0, EmojiUtils_1.suggestEmojis)(leftString, preferredLocale);
        if (newSuggestedEmojis?.length && isCurrentlyShowingEmojiSuggestion) {
            nextState.suggestedEmojis = newSuggestedEmojis;
            nextState.shouldShowSuggestionMenu = !(0, EmptyObject_1.isEmptyObject)(newSuggestedEmojis);
        }
        // Early return if there is no update
        const currentState = suggestionValuesRef.current;
        if (nextState.suggestedEmojis.length === 0 && currentState.suggestedEmojis.length === 0) {
            return;
        }
        setSuggestionValues((prevState) => ({ ...prevState, ...nextState }));
        setHighlightedEmojiIndex(0);
    }, [preferredLocale, setHighlightedEmojiIndex, resetSuggestions]);
    (0, react_1.useEffect)(() => {
        if (!isComposerFocused) {
            return;
        }
        calculateEmojiSuggestion(value, selection.start, selection.end);
    }, [value, selection, calculateEmojiSuggestion, isComposerFocused]);
    const setShouldBlockSuggestionCalc = (0, react_1.useCallback)((shouldBlockSuggestionCalc) => {
        shouldBlockCalc.current = shouldBlockSuggestionCalc;
    }, [shouldBlockCalc]);
    const getSuggestions = (0, react_1.useCallback)(() => suggestionValues.suggestedEmojis, [suggestionValues]);
    const getIsSuggestionsMenuVisible = (0, react_1.useCallback)(() => isEmojiSuggestionsMenuVisible, [isEmojiSuggestionsMenuVisible]);
    (0, react_1.useImperativeHandle)(ref, () => ({
        resetSuggestions,
        triggerHotkeyActions,
        setShouldBlockSuggestionCalc,
        updateShouldShowSuggestionMenuToFalse,
        getSuggestions,
        getIsSuggestionsMenuVisible,
    }), [resetSuggestions, setShouldBlockSuggestionCalc, triggerHotkeyActions, updateShouldShowSuggestionMenuToFalse, getSuggestions, getIsSuggestionsMenuVisible]);
    if (!isEmojiSuggestionsMenuVisible) {
        return null;
    }
    return (<EmojiSuggestions_1.default highlightedEmojiIndex={highlightedEmojiIndex} emojis={suggestionValues.suggestedEmojis} prefix={value.slice(suggestionValues.colonIndex + 1, selection.end)} onSelect={insertSelectedEmoji} preferredSkinToneIndex={preferredSkinTone} isEmojiPickerLarge={!!isAutoSuggestionPickerLarge} measureParentContainerAndReportCursor={measureParentContainerAndReportCursor} resetSuggestions={resetSuggestions}/>);
}
SuggestionEmoji.displayName = 'SuggestionEmoji';
exports.default = (0, react_1.forwardRef)(SuggestionEmoji);
