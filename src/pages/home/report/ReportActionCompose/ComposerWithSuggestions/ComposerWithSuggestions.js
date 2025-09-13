"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const debounce_1 = require("lodash/debounce");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_keyboard_controller_1 = require("react-native-keyboard-controller");
const react_native_reanimated_1 = require("react-native-reanimated");
const Composer_1 = require("@components/Composer");
const useKeyboardState_1 = require("@hooks/useKeyboardState");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSidePanel_1 = require("@hooks/useSidePanel");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Browser_1 = require("@libs/Browser");
const canFocusInputOnScreenFocus_1 = require("@libs/canFocusInputOnScreenFocus");
const ComponentUtils_1 = require("@libs/ComponentUtils");
const ComposerUtils_1 = require("@libs/ComposerUtils");
const convertToLTRForComposer_1 = require("@libs/convertToLTRForComposer");
const DraftCommentUtils_1 = require("@libs/DraftCommentUtils");
const EmojiUtils_1 = require("@libs/EmojiUtils");
const focusComposerWithDelay_1 = require("@libs/focusComposerWithDelay");
const getPlatform_1 = require("@libs/getPlatform");
const KeyDownPressListener_1 = require("@libs/KeyboardShortcut/KeyDownPressListener");
const Parser_1 = require("@libs/Parser");
const ReportActionComposeFocusManager_1 = require("@libs/ReportActionComposeFocusManager");
const ReportUtils_1 = require("@libs/ReportUtils");
const updateMultilineInputRange_1 = require("@libs/updateMultilineInputRange");
const willBlurTextInputOnTapOutside_1 = require("@libs/willBlurTextInputOnTapOutside");
const getCursorPosition_1 = require("@pages/home/report/ReportActionCompose/getCursorPosition");
const getScrollPosition_1 = require("@pages/home/report/ReportActionCompose/getScrollPosition");
const SilentCommentUpdater_1 = require("@pages/home/report/ReportActionCompose/SilentCommentUpdater");
const Suggestions_1 = require("@pages/home/report/ReportActionCompose/Suggestions");
const EmojiPickerAction_1 = require("@userActions/EmojiPickerAction");
const InputFocus_1 = require("@userActions/InputFocus");
const Modal_1 = require("@userActions/Modal");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
// eslint-disable-next-line no-restricted-imports
const findNodeHandle_1 = require("@src/utils/findNodeHandle");
const { RNTextInputReset } = react_native_1.NativeModules;
const isIOSNative = (0, getPlatform_1.default)() === CONST_1.default.PLATFORM.IOS;
/**
 * Broadcast that the user is typing. Debounced to limit how often we publish client events.
 */
const debouncedBroadcastUserIsTyping = (0, debounce_1.default)((reportID) => {
    (0, Report_1.broadcastUserIsTyping)(reportID);
}, 1000, {
    maxWait: 1000,
    leading: true,
});
const willBlurTextInputOnTapOutside = (0, willBlurTextInputOnTapOutside_1.default)();
// We want consistent auto focus behavior on input between native and mWeb so we have some auto focus management code that will
// prevent auto focus for mobile device
const shouldFocusInputOnScreenFocus = (0, canFocusInputOnScreenFocus_1.default)();
/**
 * This component holds the value and selection state.
 * If a component really needs access to these state values it should be put here.
 * However, double check if the component really needs access, as it will re-render
 * on every key press.
 */
function ComposerWithSuggestions({ 
// Props: Report
reportID, includeChronos, lastReportAction, isGroupPolicyReport, policyID, 
// Focus
onFocus, onBlur, onValueChange, 
// Composer
isComposerFullSize, setIsFullComposerAvailable, isMenuVisible, inputPlaceholder, displayFilesInModal, disabled, setIsCommentEmpty, handleSendMessage, shouldShowComposeInput, measureParentContainer = () => { }, isScrollLikelyLayoutTriggered, raiseIsScrollLikelyLayoutTriggered, onCleared = () => { }, onLayout: onLayoutProps, 
// Refs
suggestionsRef, isNextModalWillOpenRef, 
// For testing
children, didHideComposerInput, }, ref) {
    const { isKeyboardShown } = (0, useKeyboardState_1.default)();
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { preferredLocale } = (0, useLocalize_1.default)();
    const { isSidePanelHiddenOrLargeScreen } = (0, useSidePanel_1.default)();
    const isFocused = (0, native_1.useIsFocused)();
    const navigation = (0, native_1.useNavigation)();
    const emojisPresentBefore = (0, react_1.useRef)([]);
    const mobileInputScrollPosition = (0, react_1.useRef)(0);
    const cursorPositionValue = (0, react_native_reanimated_1.useSharedValue)({ x: 0, y: 0 });
    const tag = (0, react_native_reanimated_1.useSharedValue)(-1);
    const draftComment = (0, DraftCommentUtils_1.getDraftComment)(reportID) ?? '';
    const [value, setValue] = (0, react_1.useState)(() => {
        if (draftComment) {
            emojisPresentBefore.current = (0, EmojiUtils_1.extractEmojis)(draftComment);
        }
        return draftComment;
    });
    const commentRef = (0, react_1.useRef)(value);
    const [modal] = (0, useOnyx_1.default)(ONYXKEYS_1.default.MODAL, { canBeMissing: true });
    const [preferredSkinTone = CONST_1.default.EMOJI_DEFAULT_SKIN_TONE] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PREFERRED_EMOJI_SKIN_TONE, { selector: EmojiUtils_1.getPreferredSkinToneIndex, canBeMissing: true });
    const [editFocused] = (0, useOnyx_1.default)(ONYXKEYS_1.default.INPUT_FOCUSED, { canBeMissing: true });
    const lastTextRef = (0, react_1.useRef)(value);
    (0, react_1.useEffect)(() => {
        lastTextRef.current = value;
    }, [value]);
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const maxComposerLines = shouldUseNarrowLayout ? CONST_1.default.COMPOSER.MAX_LINES_SMALL_SCREEN : CONST_1.default.COMPOSER.MAX_LINES;
    const shouldAutoFocus = shouldFocusInputOnScreenFocus && !modal?.isVisible && shouldShowComposeInput && (0, Modal_1.areAllModalsHidden)() && isFocused && !didHideComposerInput;
    const valueRef = (0, react_1.useRef)(value);
    valueRef.current = value;
    const [selection, setSelection] = (0, react_1.useState)(() => ({ start: value.length, end: value.length, positionX: 0, positionY: 0 }));
    const [composerHeight, setComposerHeight] = (0, react_1.useState)(0);
    const textInputRef = (0, react_1.useRef)(null);
    const syncSelectionWithOnChangeTextRef = (0, react_1.useRef)(null);
    // The ref to check whether the comment saving is in progress
    const isCommentPendingSaved = (0, react_1.useRef)(false);
    const animatedRef = (0, react_native_reanimated_1.useAnimatedRef)();
    /**
     * Set the TextInput Ref
     */
    const setTextInputRef = (0, react_1.useCallback)((el) => {
        ReportActionComposeFocusManager_1.default.composerRef.current = el;
        textInputRef.current = el;
        if (typeof animatedRef === 'function') {
            animatedRef(el);
        }
    }, [animatedRef]);
    const resetKeyboardInput = (0, react_1.useCallback)(() => {
        if (!RNTextInputReset) {
            return;
        }
        RNTextInputReset.resetKeyboardInput(CONST_1.default.COMPOSER.NATIVE_ID);
    }, []);
    const debouncedSaveReportComment = (0, react_1.useMemo)(() => (0, debounce_1.default)((selectedReportID, newComment) => {
        (0, Report_1.saveReportDraftComment)(selectedReportID, newComment);
        isCommentPendingSaved.current = false;
    }, 1000), []);
    (0, react_1.useEffect)(() => {
        const switchToCurrentReport = react_native_1.DeviceEventEmitter.addListener(`switchToPreExistingReport_${reportID}`, ({ preexistingReportID, callback }) => {
            if (!commentRef.current) {
                callback();
                return;
            }
            (0, Report_1.saveReportDraftComment)(preexistingReportID, commentRef.current, callback);
        });
        return () => {
            switchToCurrentReport.remove();
        };
    }, [reportID]);
    /**
     * Find the newly added characters between the previous text and the new text based on the selection.
     *
     * @param prevText - The previous text.
     * @param newText - The new text.
     * @returns An object containing information about the newly added characters.
     * @property startIndex - The start index of the newly added characters in the new text.
     * @property endIndex - The end index of the newly added characters in the new text.
     * @property diff - The newly added characters.
     */
    const findNewlyAddedChars = (0, react_1.useCallback)((prevText, newText) => {
        let startIndex = -1;
        let endIndex = -1;
        let currentIndex = 0;
        // Find the first character mismatch with newText
        while (currentIndex < newText.length && prevText.charAt(currentIndex) === newText.charAt(currentIndex) && selection.start > currentIndex) {
            currentIndex++;
        }
        if (currentIndex < newText.length) {
            startIndex = currentIndex;
            const commonSuffixLength = (0, ComposerUtils_1.findCommonSuffixLength)(prevText, newText, selection?.end ?? 0);
            // if text is getting pasted over find length of common suffix and subtract it from new text length
            if (commonSuffixLength > 0 || (selection?.end ?? 0) - selection.start > 0) {
                endIndex = newText.length - commonSuffixLength;
            }
            else {
                endIndex = currentIndex + newText.length;
            }
        }
        return {
            startIndex,
            endIndex,
            diff: newText.substring(startIndex, endIndex),
        };
    }, [selection.start, selection.end]);
    /**
     * Update the value of the comment in Onyx
     */
    const updateComment = (0, react_1.useCallback)((commentValue, shouldDebounceSaveComment) => {
        raiseIsScrollLikelyLayoutTriggered();
        const { startIndex, endIndex, diff } = findNewlyAddedChars(lastTextRef.current, commentValue);
        const isEmojiInserted = diff.length && endIndex > startIndex && diff.trim() === diff && (0, EmojiUtils_1.containsOnlyEmojis)(diff);
        const commentWithSpaceInserted = isEmojiInserted ? (0, ComposerUtils_1.insertWhiteSpaceAtIndex)(commentValue, endIndex) : commentValue;
        const { text: newComment, emojis, cursorPosition } = (0, EmojiUtils_1.replaceAndExtractEmojis)(commentWithSpaceInserted, preferredSkinTone, preferredLocale);
        if (emojis.length) {
            const newEmojis = (0, EmojiUtils_1.getAddedEmojis)(emojis, emojisPresentBefore.current);
            if (newEmojis.length) {
                // Ensure emoji suggestions are hidden after inserting emoji even when the selection is not changed
                if (suggestionsRef.current) {
                    suggestionsRef.current.resetSuggestions();
                }
            }
        }
        const newCommentConverted = (0, convertToLTRForComposer_1.default)(newComment);
        const isNewCommentEmpty = !!newCommentConverted.match(/^(\s)*$/);
        const isPrevCommentEmpty = !!commentRef.current.match(/^(\s)*$/);
        /** Only update isCommentEmpty state if it's different from previous one */
        if (isNewCommentEmpty !== isPrevCommentEmpty) {
            setIsCommentEmpty(isNewCommentEmpty);
        }
        emojisPresentBefore.current = emojis;
        setValue(newCommentConverted);
        if (commentValue !== newComment) {
            const position = Math.max((selection.end ?? 0) + (newComment.length - commentRef.current.length), cursorPosition ?? 0);
            if (commentWithSpaceInserted !== newComment && isIOSNative) {
                syncSelectionWithOnChangeTextRef.current = { position, value: newComment };
            }
            setSelection((prevSelection) => ({
                start: position,
                end: position,
                positionX: prevSelection.positionX,
                positionY: prevSelection.positionY,
            }));
        }
        commentRef.current = newCommentConverted;
        if (shouldDebounceSaveComment) {
            isCommentPendingSaved.current = true;
            debouncedSaveReportComment(reportID, newCommentConverted);
        }
        else {
            (0, Report_1.saveReportDraftComment)(reportID, newCommentConverted);
        }
        if (newCommentConverted) {
            debouncedBroadcastUserIsTyping(reportID);
        }
    }, [findNewlyAddedChars, preferredLocale, preferredSkinTone, reportID, setIsCommentEmpty, suggestionsRef, raiseIsScrollLikelyLayoutTriggered, debouncedSaveReportComment, selection.end]);
    /**
     * Callback to add whatever text is chosen into the main input (used f.e as callback for the emoji picker)
     */
    const replaceSelectionWithText = (0, react_1.useCallback)((text) => {
        // selection replacement should be debounced to avoid conflicts with text typing
        // (f.e. when emoji is being picked and 1 second still did not pass after user finished typing)
        updateComment((0, ComposerUtils_1.insertText)(commentRef.current, selection, text), true);
    }, [selection, updateComment]);
    const handleKeyPress = (0, react_1.useCallback)((event) => {
        const webEvent = event;
        if (!webEvent || (0, ComposerUtils_1.canSkipTriggerHotkeys)(shouldUseNarrowLayout, isKeyboardShown)) {
            return;
        }
        if (suggestionsRef.current?.triggerHotkeyActions(webEvent)) {
            return;
        }
        // Submit the form when Enter is pressed
        if (webEvent.key === CONST_1.default.KEYBOARD_SHORTCUTS.ENTER.shortcutKey && !webEvent.shiftKey) {
            webEvent.preventDefault();
            handleSendMessage();
        }
        // Trigger the edit box for last sent message if ArrowUp is pressed and the comment is empty and Chronos is not in the participants
        const isEmptyComment = !valueRef.current || !!valueRef.current.match(CONST_1.default.REGEX.EMPTY_COMMENT);
        if (webEvent.key === CONST_1.default.KEYBOARD_SHORTCUTS.ARROW_UP.shortcutKey && selection.start <= 0 && isEmptyComment && !includeChronos) {
            webEvent.preventDefault();
            if (lastReportAction) {
                const message = Array.isArray(lastReportAction?.message) ? (lastReportAction?.message?.at(-1) ?? null) : (lastReportAction?.message ?? null);
                (0, Report_1.saveReportActionDraft)(reportID, lastReportAction, Parser_1.default.htmlToMarkdown(message?.html ?? ''));
            }
        }
        // Flag emojis like "Wales" have several code points. Default backspace key action does not remove such flag emojis completely.
        // so we need to handle backspace key action differently with grapheme segmentation.
        if (webEvent.key === CONST_1.default.KEYBOARD_SHORTCUTS.BACKSPACE.shortcutKey) {
            if (selection.start === 0) {
                return;
            }
            if (selection.start !== selection.end) {
                return;
            }
            // Grapheme segmentation is same for English and Spanish.
            const splitter = new Intl.Segmenter(CONST_1.default.LOCALES.EN, { granularity: 'grapheme' });
            // Wales flag has 14 UTF-16 code units. This is the emoji with the largest number of UTF-16 code units we use.
            const start = Math.max(0, selection.start - 14);
            const graphemes = Array.from(splitter.segment(lastTextRef.current.substring(start, selection.start)));
            const lastGrapheme = graphemes.at(graphemes.length - 1);
            const lastGraphemeLength = lastGrapheme?.segment.length ?? 0;
            if (lastGraphemeLength > 1) {
                event.preventDefault();
                const newText = lastTextRef.current.slice(0, selection.start - lastGraphemeLength) + lastTextRef.current.slice(selection.start);
                setSelection((prevSelection) => ({
                    start: selection.start - lastGraphemeLength,
                    end: selection.start - lastGraphemeLength,
                    positionX: prevSelection.positionX,
                    positionY: prevSelection.positionY,
                }));
                updateComment(newText, true);
            }
        }
    }, [shouldUseNarrowLayout, isKeyboardShown, suggestionsRef, selection.start, includeChronos, handleSendMessage, lastReportAction, reportID, updateComment, selection.end]);
    const onChangeText = (0, react_1.useCallback)((commentValue) => {
        updateComment(commentValue, true);
        if (isIOSNative && syncSelectionWithOnChangeTextRef.current) {
            const positionSnapshot = syncSelectionWithOnChangeTextRef.current.position;
            syncSelectionWithOnChangeTextRef.current = null;
            // ensure that selection is set imperatively after all state changes are effective
            react_native_1.InteractionManager.runAfterInteractions(() => {
                // note: this implementation is only available on non-web RN, thus the wrapping
                // 'if' block contains a redundant (since the ref is only used on iOS) platform check
                textInputRef.current?.setSelection(positionSnapshot, positionSnapshot);
            });
        }
    }, [updateComment]);
    const onSelectionChange = (0, react_1.useCallback)((e) => {
        setSelection(e.nativeEvent.selection);
        if (!textInputRef.current?.isFocused()) {
            return;
        }
        suggestionsRef.current?.onSelectionChange?.(e);
    }, [suggestionsRef]);
    const hideSuggestionMenu = (0, react_1.useCallback)((e) => {
        mobileInputScrollPosition.current = e?.nativeEvent?.contentOffset?.y ?? 0;
        if (!suggestionsRef.current || isScrollLikelyLayoutTriggered.current) {
            return;
        }
        suggestionsRef.current.updateShouldShowSuggestionMenuToFalse(false);
    }, [suggestionsRef, isScrollLikelyLayoutTriggered]);
    const setShouldBlockSuggestionCalcToFalse = (0, react_1.useCallback)(() => {
        if (!suggestionsRef.current) {
            return false;
        }
        (0, InputFocus_1.inputFocusChange)(false);
        return suggestionsRef.current.setShouldBlockSuggestionCalc(false);
    }, [suggestionsRef]);
    /**
     * Focus the composer text input
     * @param [shouldDelay=false] Impose delay before focusing the composer
     */
    const focus = (0, react_1.useCallback)((shouldDelay = false) => {
        (0, focusComposerWithDelay_1.default)(textInputRef.current)(shouldDelay);
    }, []);
    /**
     * Set focus callback
     * @param shouldTakeOverFocus - Whether this composer should gain focus priority
     */
    const setUpComposeFocusManager = (0, react_1.useCallback)((shouldTakeOverFocus = false) => {
        ReportActionComposeFocusManager_1.default.onComposerFocus((shouldFocusForNonBlurInputOnTapOutside = false) => {
            if ((!willBlurTextInputOnTapOutside && !shouldFocusForNonBlurInputOnTapOutside) || !isFocused || !isSidePanelHiddenOrLargeScreen) {
                return;
            }
            focus(true);
        }, shouldTakeOverFocus);
    }, [focus, isFocused, isSidePanelHiddenOrLargeScreen]);
    /**
     * Check if the composer is visible. Returns true if the composer is not covered up by emoji picker or menu. False otherwise.
     * @returns {Boolean}
     */
    const checkComposerVisibility = (0, react_1.useCallback)(() => {
        // Checking whether the screen is focused or not, helps avoid `modal.isVisible` false when popups are closed, even if the modal is opened.
        const isComposerCoveredUp = !isFocused || (0, EmojiPickerAction_1.isEmojiPickerVisible)() || isMenuVisible || !!modal?.isVisible || modal?.willAlertModalBecomeVisible;
        return !isComposerCoveredUp;
    }, [isMenuVisible, modal, isFocused]);
    const focusComposerOnKeyPress = (0, react_1.useCallback)((e) => {
        const isComposerVisible = checkComposerVisibility();
        if (!isComposerVisible) {
            return;
        }
        // Do not focus the composer if the Side Panel is visible
        if (!isSidePanelHiddenOrLargeScreen) {
            return;
        }
        if (!(0, ReportUtils_1.shouldAutoFocusOnKeyPress)(e)) {
            return;
        }
        // if we're typing on another input/text area, do not focus
        if ([CONST_1.default.ELEMENT_NAME.INPUT, CONST_1.default.ELEMENT_NAME.TEXTAREA].includes(e.target?.nodeName ?? '')) {
            return;
        }
        focus();
    }, [checkComposerVisibility, focus, isSidePanelHiddenOrLargeScreen]);
    const blur = (0, react_1.useCallback)(() => {
        if (!textInputRef.current) {
            return;
        }
        textInputRef.current.blur();
    }, []);
    const clear = (0, react_1.useCallback)(() => {
        'worklet';
        (0, ComponentUtils_1.forceClearInput)(animatedRef);
    }, [animatedRef]);
    const getCurrentText = (0, react_1.useCallback)(() => {
        return commentRef.current;
    }, []);
    (0, react_1.useEffect)(() => {
        const unsubscribeNavigationBlur = navigation.addListener('blur', () => (0, KeyDownPressListener_1.removeKeyDownPressListener)(focusComposerOnKeyPress));
        const unsubscribeNavigationFocus = navigation.addListener('focus', () => {
            (0, KeyDownPressListener_1.addKeyDownPressListener)(focusComposerOnKeyPress);
            // The report isn't unmounted and can be focused again after going back from another report so we should update the composerRef again
            ReportActionComposeFocusManager_1.default.composerRef.current = textInputRef.current;
            setUpComposeFocusManager();
        });
        (0, KeyDownPressListener_1.addKeyDownPressListener)(focusComposerOnKeyPress);
        setUpComposeFocusManager();
        return () => {
            ReportActionComposeFocusManager_1.default.clear();
            (0, KeyDownPressListener_1.removeKeyDownPressListener)(focusComposerOnKeyPress);
            unsubscribeNavigationBlur();
            unsubscribeNavigationFocus();
        };
    }, [focusComposerOnKeyPress, navigation, setUpComposeFocusManager, isSidePanelHiddenOrLargeScreen]);
    const prevIsModalVisible = (0, usePrevious_1.default)(modal?.isVisible);
    const prevIsFocused = (0, usePrevious_1.default)(isFocused);
    (0, react_1.useEffect)(() => {
        const isModalVisible = modal?.isVisible;
        if (isModalVisible && !prevIsModalVisible) {
            // eslint-disable-next-line react-compiler/react-compiler, no-param-reassign
            isNextModalWillOpenRef.current = false;
        }
        // We want to blur the input immediately when a screen is out of focus.
        if (!isFocused) {
            textInputRef.current?.blur();
            return;
        }
        // Do not focus the composer if the Side Panel is visible
        if (!isSidePanelHiddenOrLargeScreen) {
            return;
        }
        // We want to focus or refocus the input when a modal has been closed or the underlying screen is refocused.
        // We avoid doing this on native platforms since the software keyboard popping
        // open creates a jarring and broken UX.
        if (!((willBlurTextInputOnTapOutside || shouldAutoFocus) && !isNextModalWillOpenRef.current && !isModalVisible && (!!prevIsModalVisible || !prevIsFocused))) {
            return;
        }
        if (editFocused) {
            (0, InputFocus_1.inputFocusChange)(false);
            return;
        }
        focus(true);
    }, [focus, prevIsFocused, editFocused, prevIsModalVisible, isFocused, modal?.isVisible, isNextModalWillOpenRef, shouldAutoFocus, isSidePanelHiddenOrLargeScreen]);
    (0, react_1.useEffect)(() => {
        // Scrolls the composer to the bottom and sets the selection to the end, so that longer drafts are easier to edit
        (0, updateMultilineInputRange_1.default)(textInputRef.current, !!shouldAutoFocus);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useImperativeHandle)(ref, () => ({
        blur,
        focus,
        replaceSelectionWithText,
        isFocused: () => !!textInputRef.current?.isFocused(),
        clear,
        getCurrentText,
    }), [blur, clear, focus, replaceSelectionWithText, getCurrentText]);
    (0, react_1.useEffect)(() => {
        onValueChange(value);
    }, [onValueChange, value]);
    const onLayout = (0, react_1.useCallback)((e) => {
        onLayoutProps?.(e);
        const composerLayoutHeight = e.nativeEvent.layout.height;
        if (composerHeight === composerLayoutHeight) {
            return;
        }
        setComposerHeight(composerLayoutHeight);
    }, [composerHeight, onLayoutProps]);
    const onClear = (0, react_1.useCallback)((text) => {
        mobileInputScrollPosition.current = 0;
        // Note: use the value when the clear happened, not the current value which might have changed already
        onCleared(text);
        updateComment('', true);
    }, [onCleared, updateComment]);
    (0, react_1.useEffect)(() => {
        // We use the tag to store the native ID of the text input. Later, we use it in onSelectionChange to pick up the proper text input data.
        tag.set((0, findNodeHandle_1.default)(textInputRef.current) ?? -1);
    }, [tag]);
    (0, react_native_keyboard_controller_1.useFocusedInputHandler)({
        onSelectionChange: (event) => {
            'worklet';
            if (event.target === tag.get()) {
                cursorPositionValue.set({
                    x: event.selection.end.x,
                    y: event.selection.end.y,
                });
            }
        },
    }, []);
    const measureParentContainerAndReportCursor = (0, react_1.useCallback)((callback) => {
        const { scrollValue } = (0, getScrollPosition_1.default)({ mobileInputScrollPosition, textInputRef });
        const { x: xPosition, y: yPosition } = (0, getCursorPosition_1.default)({ positionOnMobile: cursorPositionValue.get(), positionOnWeb: selection });
        measureParentContainer((x, y, width, height) => {
            callback({
                x,
                y,
                width,
                height,
                scrollValue,
                cursorCoordinates: { x: xPosition, y: yPosition },
            });
        });
    }, [measureParentContainer, cursorPositionValue, selection]);
    const isTouchEndedRef = (0, react_1.useRef)(false);
    const containerComposeStyles = react_native_1.StyleSheet.flatten(StyleUtils.getContainerComposeStyles());
    const updateIsFullComposerAvailable = (0, react_1.useCallback)((e) => {
        const paddingTopAndBottom = containerComposeStyles.paddingVertical * 2;
        const inputHeight = e.nativeEvent.contentSize.height;
        const totalHeight = inputHeight + paddingTopAndBottom;
        const isFullComposerAvailable = totalHeight >= CONST_1.default.COMPOSER.FULL_COMPOSER_MIN_HEIGHT;
        setIsFullComposerAvailable?.(isFullComposerAvailable);
    }, [setIsFullComposerAvailable, containerComposeStyles]);
    return (<>
            <react_native_1.View style={[containerComposeStyles, styles.textInputComposeBorder]} onTouchEndCapture={() => {
            isTouchEndedRef.current = true;
        }}>
                <Composer_1.default checkComposerVisibility={checkComposerVisibility} autoFocus={!!shouldAutoFocus} multiline ref={setTextInputRef} placeholder={inputPlaceholder} placeholderTextColor={theme.placeholderText} onChangeText={onChangeText} onKeyPress={handleKeyPress} textAlignVertical="top" style={[styles.textInputCompose, isComposerFullSize ? styles.textInputFullCompose : styles.textInputCollapseCompose]} maxLines={maxComposerLines} onFocus={() => {
            // The last composer that had focus should re-gain focus
            setUpComposeFocusManager(true);
            onFocus();
        }} onBlur={onBlur} onClick={setShouldBlockSuggestionCalcToFalse} onPasteFile={(file) => {
            textInputRef.current?.blur();
            displayFilesInModal([file]);
        }} onClear={onClear} isDisabled={disabled} selection={selection} onSelectionChange={onSelectionChange} isComposerFullSize={isComposerFullSize} onContentSizeChange={updateIsFullComposerAvailable} value={value} testID="composer" shouldCalculateCaretPosition onLayout={onLayout} onScroll={hideSuggestionMenu} shouldContainScroll={(0, Browser_1.isMobileSafari)()} isGroupPolicyReport={isGroupPolicyReport}/>
            </react_native_1.View>

            <Suggestions_1.default ref={suggestionsRef} isComposerFocused={textInputRef.current?.isFocused()} updateComment={updateComment} measureParentContainerAndReportCursor={measureParentContainerAndReportCursor} isGroupPolicyReport={isGroupPolicyReport} policyID={policyID} 
    // Input
    value={value} selection={selection} setSelection={setSelection} resetKeyboardInput={resetKeyboardInput}/>

            {(0, ReportUtils_1.isValidReportIDFromPath)(reportID) && (<SilentCommentUpdater_1.default reportID={reportID} value={value} updateComment={updateComment} commentRef={commentRef} isCommentPendingSaved={isCommentPendingSaved}/>)}

            {/* Only used for testing so far */}
            {children}
        </>);
}
ComposerWithSuggestions.displayName = 'ComposerWithSuggestions';
exports.default = (0, react_1.memo)((0, react_1.forwardRef)(ComposerWithSuggestions));
