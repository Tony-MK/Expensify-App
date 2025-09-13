"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Provider_1 = require("@components/DragAndDrop/Provider");
const usePrevious_1 = require("@hooks/usePrevious");
const SuggestionEmoji_1 = require("./SuggestionEmoji");
const SuggestionMention_1 = require("./SuggestionMention");
/**
 * This component contains the individual suggestion components.
 * If you want to add a new suggestion type, add it here.
 *
 */
function Suggestions({ value, selection, setSelection, updateComment, resetKeyboardInput, measureParentContainerAndReportCursor, isAutoSuggestionPickerLarge = true, isComposerFocused, isGroupPolicyReport, policyID, }, ref) {
    const suggestionEmojiRef = (0, react_1.useRef)(null);
    const suggestionMentionRef = (0, react_1.useRef)(null);
    const { isDraggingOver } = (0, react_1.useContext)(Provider_1.DragAndDropContext);
    const prevIsDraggingOver = (0, usePrevious_1.default)(isDraggingOver);
    const getSuggestions = (0, react_1.useCallback)(() => {
        if (suggestionEmojiRef.current?.getSuggestions) {
            const emojiSuggestions = suggestionEmojiRef.current.getSuggestions();
            if (emojiSuggestions.length > 0) {
                return emojiSuggestions;
            }
        }
        if (suggestionMentionRef.current?.getSuggestions) {
            const mentionSuggestions = suggestionMentionRef.current.getSuggestions();
            if (mentionSuggestions.length > 0) {
                return mentionSuggestions;
            }
        }
        return [];
    }, []);
    /**
     * Clean data related to EmojiSuggestions
     */
    const resetSuggestions = (0, react_1.useCallback)(() => {
        suggestionEmojiRef.current?.resetSuggestions();
        suggestionMentionRef.current?.resetSuggestions();
    }, []);
    /**
     * Listens for keyboard shortcuts and applies the action
     */
    const triggerHotkeyActions = (0, react_1.useCallback)((e) => {
        const emojiHandler = suggestionEmojiRef.current?.triggerHotkeyActions(e);
        const mentionHandler = suggestionMentionRef.current?.triggerHotkeyActions(e);
        return emojiHandler ?? mentionHandler;
    }, []);
    const onSelectionChange = (0, react_1.useCallback)((e) => {
        const emojiHandler = suggestionEmojiRef.current?.onSelectionChange?.(e);
        suggestionMentionRef.current?.onSelectionChange?.(e);
        return emojiHandler;
    }, []);
    const updateShouldShowSuggestionMenuToFalse = (0, react_1.useCallback)(() => {
        suggestionEmojiRef.current?.updateShouldShowSuggestionMenuToFalse();
        suggestionMentionRef.current?.updateShouldShowSuggestionMenuToFalse();
    }, []);
    const setShouldBlockSuggestionCalc = (0, react_1.useCallback)((shouldBlock) => {
        suggestionEmojiRef.current?.setShouldBlockSuggestionCalc(shouldBlock);
        suggestionMentionRef.current?.setShouldBlockSuggestionCalc(shouldBlock);
    }, []);
    const getIsSuggestionsMenuVisible = (0, react_1.useCallback)(() => {
        const isEmojiVisible = suggestionEmojiRef.current?.getIsSuggestionsMenuVisible() ?? false;
        const isSuggestionVisible = suggestionMentionRef.current?.getIsSuggestionsMenuVisible() ?? false;
        return isEmojiVisible || isSuggestionVisible;
    }, []);
    (0, react_1.useImperativeHandle)(ref, () => ({
        resetSuggestions,
        onSelectionChange,
        triggerHotkeyActions,
        updateShouldShowSuggestionMenuToFalse,
        setShouldBlockSuggestionCalc,
        getSuggestions,
        getIsSuggestionsMenuVisible,
    }), [onSelectionChange, resetSuggestions, setShouldBlockSuggestionCalc, triggerHotkeyActions, updateShouldShowSuggestionMenuToFalse, getSuggestions, getIsSuggestionsMenuVisible]);
    (0, react_1.useEffect)(() => {
        if (!(!prevIsDraggingOver && isDraggingOver)) {
            return;
        }
        updateShouldShowSuggestionMenuToFalse();
    }, [isDraggingOver, prevIsDraggingOver, updateShouldShowSuggestionMenuToFalse]);
    const baseProps = {
        value,
        setSelection,
        selection,
        updateComment,
        isAutoSuggestionPickerLarge,
        measureParentContainerAndReportCursor,
        isComposerFocused,
        isGroupPolicyReport,
        policyID,
    };
    return (<react_native_1.View testID="suggestions">
            <SuggestionEmoji_1.default ref={suggestionEmojiRef} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...baseProps} resetKeyboardInput={resetKeyboardInput}/>
            <SuggestionMention_1.default ref={suggestionMentionRef} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...baseProps}/>
        </react_native_1.View>);
}
Suggestions.displayName = 'Suggestions';
exports.default = (0, react_1.forwardRef)(Suggestions);
