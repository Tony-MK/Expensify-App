"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debounce_1 = require("lodash/debounce");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_keyboard_controller_1 = require("react-native-keyboard-controller");
const react_native_reanimated_1 = require("react-native-reanimated");
const Composer_1 = require("@components/Composer");
const EmojiPickerButton_1 = require("@components/EmojiPicker/EmojiPickerButton");
const ExceededCommentLength_1 = require("@components/ExceededCommentLength");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const Tooltip_1 = require("@components/Tooltip");
const useHandleExceedMaxCommentLength_1 = require("@hooks/useHandleExceedMaxCommentLength");
const useKeyboardState_1 = require("@hooks/useKeyboardState");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useReportScrollManager_1 = require("@hooks/useReportScrollManager");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useScrollBlocker_1 = require("@hooks/useScrollBlocker");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Composer_2 = require("@libs/actions/Composer");
const EmojiPickerAction_1 = require("@libs/actions/EmojiPickerAction");
const InputFocus_1 = require("@libs/actions/InputFocus");
const Report_1 = require("@libs/actions/Report");
const index_website_1 = require("@libs/Browser/index.website");
const ComposerUtils_1 = require("@libs/ComposerUtils");
const DomUtils_1 = require("@libs/DomUtils");
const EmojiUtils_1 = require("@libs/EmojiUtils");
const focusComposerWithDelay_1 = require("@libs/focusComposerWithDelay");
const focusEditAfterCancelDelete_1 = require("@libs/focusEditAfterCancelDelete");
const Parser_1 = require("@libs/Parser");
const ReportActionComposeFocusManager_1 = require("@libs/ReportActionComposeFocusManager");
const ReportActionItemEventHandler_1 = require("@libs/ReportActionItemEventHandler");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const setShouldShowComposeInputKeyboardAware_1 = require("@libs/setShouldShowComposeInputKeyboardAware");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
// eslint-disable-next-line no-restricted-imports
const findNodeHandle_1 = require("@src/utils/findNodeHandle");
const keyboard_1 = require("@src/utils/keyboard");
const ReportActionContextMenu = require("./ContextMenu/ReportActionContextMenu");
const getCursorPosition_1 = require("./ReportActionCompose/getCursorPosition");
const getScrollPosition_1 = require("./ReportActionCompose/getScrollPosition");
const Suggestions_1 = require("./ReportActionCompose/Suggestions");
const shouldUseEmojiPickerSelection_1 = require("./shouldUseEmojiPickerSelection");
const shouldUseForcedSelectionRange = (0, shouldUseEmojiPickerSelection_1.default)();
// video source -> video attributes
const draftMessageVideoAttributeCache = new Map();
const DEFAULT_MODAL_VALUE = {
    willAlertModalBecomeVisible: false,
    isVisible: false,
};
function ReportActionItemMessageEdit({ action, draftMessage, reportID, policyID, index, isGroupPolicyReport, shouldDisableEmojiPicker = false }, forwardedRef) {
    const [preferredSkinTone = CONST_1.default.EMOJI_DEFAULT_SKIN_TONE] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PREFERRED_EMOJI_SKIN_TONE, { canBeMissing: true });
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const containerRef = (0, react_1.useRef)(null);
    const reportScrollManager = (0, useReportScrollManager_1.default)();
    const { translate, preferredLocale } = (0, useLocalize_1.default)();
    const { isKeyboardShown } = (0, useKeyboardState_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const prevDraftMessage = (0, usePrevious_1.default)(draftMessage);
    const suggestionsRef = (0, react_1.useRef)(null);
    const mobileInputScrollPosition = (0, react_1.useRef)(0);
    const cursorPositionValue = (0, react_native_reanimated_1.useSharedValue)({ x: 0, y: 0 });
    const tag = (0, react_native_reanimated_1.useSharedValue)(-1);
    const emojisPresentBefore = (0, react_1.useRef)([]);
    const [draft, setDraft] = (0, react_1.useState)(() => {
        if (draftMessage) {
            emojisPresentBefore.current = (0, EmojiUtils_1.extractEmojis)(draftMessage);
        }
        return draftMessage;
    });
    const [selection, setSelection] = (0, react_1.useState)({ start: draft.length, end: draft.length, positionX: 0, positionY: 0 });
    const [isFocused, setIsFocused] = (0, react_1.useState)(false);
    const { hasExceededMaxCommentLength, validateCommentMaxLength } = (0, useHandleExceedMaxCommentLength_1.default)();
    const debouncedValidateCommentMaxLength = (0, react_1.useMemo)(() => (0, debounce_1.default)(validateCommentMaxLength, CONST_1.default.TIMING.COMMENT_LENGTH_DEBOUNCE_TIME), [validateCommentMaxLength]);
    const [modal = DEFAULT_MODAL_VALUE] = (0, useOnyx_1.default)(ONYXKEYS_1.default.MODAL, { canBeMissing: true });
    const [onyxInputFocused = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.INPUT_FOCUSED, { canBeMissing: true });
    const { isScrolling, startScrollBlock, endScrollBlock } = (0, useScrollBlocker_1.default)();
    const textInputRef = (0, react_1.useRef)(null);
    const isFocusedRef = (0, react_1.useRef)(false);
    const draftRef = (0, react_1.useRef)(draft);
    const emojiPickerSelectionRef = (0, react_1.useRef)(undefined);
    // The ref to check whether the comment saving is in progress
    const isCommentPendingSaved = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        draftMessageVideoAttributeCache.clear();
        const originalMessage = Parser_1.default.htmlToMarkdown((0, ReportActionsUtils_1.getReportActionHtml)(action), {
            cacheVideoAttributes: (videoSource, attrs) => draftMessageVideoAttributeCache.set(videoSource, attrs),
        });
        if ((0, ReportActionsUtils_1.isDeletedAction)(action) || !!(action.message && draftMessage === originalMessage) || !!(prevDraftMessage === draftMessage || isCommentPendingSaved.current)) {
            return;
        }
        setDraft(draftMessage);
    }, [draftMessage, action, prevDraftMessage]);
    (0, react_1.useEffect)(() => {
        (0, InputFocus_1.composerFocusKeepFocusOn)(textInputRef.current, isFocused, modal, onyxInputFocused);
    }, [isFocused, modal, onyxInputFocused]);
    (0, react_1.useEffect)(
    // Remove focus callback on unmount to avoid stale callbacks
    () => {
        if (textInputRef.current) {
            ReportActionComposeFocusManager_1.default.editComposerRef.current = textInputRef.current;
        }
        return () => {
            if (ReportActionComposeFocusManager_1.default.editComposerRef.current !== textInputRef.current) {
                return;
            }
            ReportActionComposeFocusManager_1.default.clear(true);
        };
    }, []);
    // We consider the report action active if it's focused, its emoji picker is open or its context menu is open
    const isActive = (0, react_1.useCallback)(() => isFocusedRef.current || (0, EmojiPickerAction_1.isActive)(action.reportActionID) || ReportActionContextMenu.isActiveReportAction(action.reportActionID), [action.reportActionID]);
    /**
     * Focus the composer text input
     * @param shouldDelay - Impose delay before focusing the composer
     */
    const focus = (0, react_1.useCallback)((shouldDelay = false, forcedSelectionRange) => {
        (0, focusComposerWithDelay_1.default)(textInputRef.current)(shouldDelay, forcedSelectionRange);
    }, []);
    // Take over focus priority
    const setUpComposeFocusManager = (0, react_1.useCallback)(() => {
        ReportActionComposeFocusManager_1.default.onComposerFocus(() => {
            focus(true, emojiPickerSelectionRef.current ? { ...emojiPickerSelectionRef.current } : undefined);
            emojiPickerSelectionRef.current = undefined;
        }, true);
    }, [focus]);
    // show the composer after editing is complete for devices that hide the composer during editing.
    (0, react_1.useEffect)(() => () => (0, Composer_2.setShouldShowComposeInput)(true), []);
    /**
     * Save the draft of the comment. This debounced so that we're not ceaselessly saving your edit. Saving the draft
     * allows one to navigate somewhere else and come back to the comment and still have it in edit mode.
     * @param {String} newDraft
     */
    const debouncedSaveDraft = (0, react_1.useMemo)(() => 
    // eslint-disable-next-line react-compiler/react-compiler
    (0, debounce_1.default)((newDraft) => {
        (0, Report_1.saveReportActionDraft)(reportID, action, newDraft);
        isCommentPendingSaved.current = false;
    }, 1000), [reportID, action]);
    (0, react_1.useEffect)(() => () => {
        debouncedSaveDraft.cancel();
        isCommentPendingSaved.current = false;
    }, [debouncedSaveDraft]);
    /**
     * Update the value of the draft in Onyx
     *
     * @param {String} newDraftInput
     */
    const updateDraft = (0, react_1.useCallback)((newDraftInput) => {
        const { text: newDraft, emojis, cursorPosition } = (0, EmojiUtils_1.replaceAndExtractEmojis)(newDraftInput, preferredSkinTone, preferredLocale);
        emojisPresentBefore.current = emojis;
        setDraft(newDraft);
        if (newDraftInput !== newDraft) {
            const position = Math.max((selection?.end ?? 0) + (newDraft.length - draftRef.current.length), cursorPosition ?? 0);
            setSelection({
                start: position,
                end: position,
                positionX: 0,
                positionY: 0,
            });
        }
        draftRef.current = newDraft;
        // We want to escape the draft message to differentiate the HTML from the report action and the HTML the user drafted.
        debouncedSaveDraft(newDraft);
        isCommentPendingSaved.current = true;
    }, [debouncedSaveDraft, preferredSkinTone, preferredLocale, selection.end]);
    (0, react_1.useEffect)(() => {
        updateDraft(draft);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- run this only when language is changed
    }, [action.reportActionID, preferredLocale]);
    /**
     * Delete the draft of the comment being edited. This will take the comment out of "edit mode" with the old content.
     */
    const deleteDraft = (0, react_1.useCallback)(() => {
        (0, Report_1.deleteReportActionDraft)(reportID, action);
        if (isActive()) {
            ReportActionComposeFocusManager_1.default.clear(true);
            // Wait for report action compose re-mounting on mWeb
            react_native_1.InteractionManager.runAfterInteractions(() => ReportActionComposeFocusManager_1.default.focus());
        }
        // Scroll to the last comment after editing to make sure the whole comment is clearly visible in the report.
        if (index === 0) {
            keyboard_1.default.dismiss().then(() => {
                reportScrollManager.scrollToIndex(index, false);
            });
        }
    }, [action, index, reportID, reportScrollManager, isActive]);
    /**
     * Save the draft of the comment to be the new comment message. This will take the comment out of "edit mode" with
     * the new content.
     */
    const publishDraft = (0, react_1.useCallback)(() => {
        // Do nothing if draft exceed the character limit
        if ((0, ReportUtils_1.getCommentLength)(draft, { reportID }) > CONST_1.default.MAX_COMMENT_LENGTH) {
            return;
        }
        const trimmedNewDraft = draft.trim();
        // When user tries to save the empty message, it will delete it. Prompt the user to confirm deleting.
        if (!trimmedNewDraft) {
            textInputRef.current?.blur();
            ReportActionContextMenu.showDeleteModal(reportID, action, true, deleteDraft, () => (0, focusEditAfterCancelDelete_1.default)(textInputRef.current));
            return;
        }
        (0, Report_1.editReportComment)(reportID, action, trimmedNewDraft, Object.fromEntries(draftMessageVideoAttributeCache));
        deleteDraft();
    }, [action, deleteDraft, draft, reportID]);
    /**
     * @param emoji
     */
    const addEmojiToTextBox = (emoji) => {
        const newSelection = {
            start: selection.start + emoji.length + CONST_1.default.SPACE_LENGTH,
            end: selection.start + emoji.length + CONST_1.default.SPACE_LENGTH,
            positionX: 0,
            positionY: 0,
        };
        setSelection(newSelection);
        if (shouldUseForcedSelectionRange) {
            // On Android and Chrome mobile, focusing the input sets the cursor position back to the start.
            // To fix this, immediately set the selection again after focusing the input.
            emojiPickerSelectionRef.current = newSelection;
        }
        updateDraft((0, ComposerUtils_1.insertText)(draft, selection, `${emoji} `));
    };
    const hideSuggestionMenu = (0, react_1.useCallback)(() => {
        if (!suggestionsRef.current) {
            return;
        }
        suggestionsRef.current.updateShouldShowSuggestionMenuToFalse(false);
    }, [suggestionsRef]);
    const onSaveScrollAndHideSuggestionMenu = (0, react_1.useCallback)((e) => {
        mobileInputScrollPosition.current = e?.nativeEvent?.contentOffset?.y ?? 0;
        hideSuggestionMenu();
    }, [hideSuggestionMenu]);
    /**
     * Key event handlers that short cut to saving/canceling.
     *
     * @param {Event} e
     */
    const triggerSaveOrCancel = (0, react_1.useCallback)((e) => {
        if (!e || (0, ComposerUtils_1.canSkipTriggerHotkeys)(shouldUseNarrowLayout, isKeyboardShown)) {
            return;
        }
        const keyEvent = e;
        const isSuggestionsMenuVisible = suggestionsRef.current?.getIsSuggestionsMenuVisible();
        if (isSuggestionsMenuVisible) {
            suggestionsRef.current?.triggerHotkeyActions(keyEvent);
            return;
        }
        if (keyEvent.key === CONST_1.default.KEYBOARD_SHORTCUTS.ESCAPE.shortcutKey && isSuggestionsMenuVisible) {
            e.preventDefault();
            hideSuggestionMenu();
            return;
        }
        if (keyEvent.key === CONST_1.default.KEYBOARD_SHORTCUTS.ENTER.shortcutKey && !keyEvent.shiftKey) {
            e.preventDefault();
            publishDraft();
        }
        else if (keyEvent.key === CONST_1.default.KEYBOARD_SHORTCUTS.ESCAPE.shortcutKey) {
            e.preventDefault();
            deleteDraft();
        }
    }, [deleteDraft, hideSuggestionMenu, isKeyboardShown, shouldUseNarrowLayout, publishDraft]);
    const measureContainer = (0, react_1.useCallback)((callback) => {
        if (!containerRef.current) {
            return;
        }
        containerRef.current.measureInWindow(callback);
    }, []);
    const measureParentContainerAndReportCursor = (0, react_1.useCallback)((callback) => {
        const performMeasurement = () => {
            const { scrollValue } = (0, getScrollPosition_1.default)({ mobileInputScrollPosition, textInputRef });
            const { x: xPosition, y: yPosition } = (0, getCursorPosition_1.default)({ positionOnMobile: cursorPositionValue.get(), positionOnWeb: selection });
            measureContainer((x, y, width, height) => {
                callback({
                    x,
                    y,
                    width,
                    height,
                    scrollValue,
                    cursorCoordinates: { x: xPosition, y: yPosition },
                });
            });
        };
        if (isScrolling) {
            return;
        }
        performMeasurement();
    }, [cursorPositionValue, measureContainer, selection, isScrolling]);
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
    (0, react_1.useEffect)(() => {
        debouncedValidateCommentMaxLength(draft, { reportID });
    }, [draft, reportID, debouncedValidateCommentMaxLength]);
    (0, react_1.useEffect)(() => {
        // required for keeping last state of isFocused variable
        isFocusedRef.current = isFocused;
        if (!isFocused) {
            hideSuggestionMenu();
        }
    }, [isFocused, hideSuggestionMenu]);
    const closeButtonStyles = [styles.composerSizeButton, { marginVertical: styles.composerSizeButton.marginHorizontal }];
    return (<>
            <react_native_1.View style={[styles.chatItemMessage, styles.flexRow]} ref={containerRef}>
                <react_native_1.View style={[
            isFocused ? styles.chatItemComposeBoxFocusedColor : styles.chatItemComposeBoxColor,
            styles.flexRow,
            styles.flex1,
            styles.chatItemComposeBox,
            hasExceededMaxCommentLength && styles.borderColorDanger,
        ]}>
                    <react_native_1.View style={[styles.justifyContentEnd, styles.mb1]}>
                        <Tooltip_1.default text={translate('common.cancel')}>
                            <PressableWithFeedback_1.default onPress={deleteDraft} style={closeButtonStyles} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.close')} 
    // disable dimming
    hoverDimmingValue={1} pressDimmingValue={1} 
    // Keep focus on the composer when cancel button is clicked.
    onMouseDown={(e) => e.preventDefault()}>
                                <Icon_1.default fill={theme.icon} src={Expensicons.Close}/>
                            </PressableWithFeedback_1.default>
                        </Tooltip_1.default>
                    </react_native_1.View>
                    <react_native_1.View style={[StyleUtils.getContainerComposeStyles(), styles.textInputComposeBorder]}>
                        <Composer_1.default multiline ref={(el) => {
            textInputRef.current = el;
            if (typeof forwardedRef === 'function') {
                forwardedRef(el);
            }
            else if (forwardedRef) {
                // eslint-disable-next-line no-param-reassign
                forwardedRef.current = el;
            }
        }} onChangeText={updateDraft} // Debounced saveDraftComment
     onKeyPress={triggerSaveOrCancel} value={draft} maxLines={shouldUseNarrowLayout ? CONST_1.default.COMPOSER.MAX_LINES_SMALL_SCREEN : CONST_1.default.COMPOSER.MAX_LINES} // This is the same that slack has
     style={[styles.textInputCompose, styles.flex1, styles.bgTransparent]} onFocus={() => {
            setIsFocused(true);
            if (textInputRef.current) {
                ReportActionComposeFocusManager_1.default.editComposerRef.current = textInputRef.current;
            }
            startScrollBlock();
            react_native_1.InteractionManager.runAfterInteractions(() => {
                requestAnimationFrame(() => {
                    reportScrollManager.scrollToIndex(index, true);
                    endScrollBlock();
                });
            });
            if ((0, index_website_1.isMobileChrome)() && reportScrollManager.ref?.current) {
                reportScrollManager.ref.current.scrollToIndex({ index, animated: false });
            }
            (0, setShouldShowComposeInputKeyboardAware_1.default)(false);
            // The last composer that had focus should re-gain focus
            setUpComposeFocusManager();
            // Clear active report action when another action gets focused
            if (!(0, EmojiPickerAction_1.isActive)(action.reportActionID)) {
                (0, EmojiPickerAction_1.clearActive)();
            }
            if (!ReportActionContextMenu.isActiveReportAction(action.reportActionID)) {
                ReportActionContextMenu.clearActiveReportAction();
            }
        }} onBlur={(event) => {
            setIsFocused(false);
            const relatedTargetId = event.nativeEvent?.relatedTarget?.id;
            if (relatedTargetId === CONST_1.default.COMPOSER.NATIVE_ID || relatedTargetId === CONST_1.default.EMOJI_PICKER_BUTTON_NATIVE_ID || (0, EmojiPickerAction_1.isEmojiPickerVisible)()) {
                return;
            }
            (0, setShouldShowComposeInputKeyboardAware_1.default)(true);
        }} onLayout={ReportActionItemEventHandler_1.default.handleComposerLayoutChange(reportScrollManager, index)} selection={selection} onSelectionChange={(e) => setSelection(e.nativeEvent.selection)} isGroupPolicyReport={isGroupPolicyReport} shouldCalculateCaretPosition onScroll={onSaveScrollAndHideSuggestionMenu}/>
                    </react_native_1.View>

                    <Suggestions_1.default ref={suggestionsRef} 
    // eslint-disable-next-line react-compiler/react-compiler
    isComposerFocused={textInputRef.current?.isFocused()} updateComment={updateDraft} measureParentContainerAndReportCursor={measureParentContainerAndReportCursor} isGroupPolicyReport={isGroupPolicyReport} policyID={policyID} value={draft} selection={selection} setSelection={setSelection}/>

                    <react_native_1.View style={styles.editChatItemEmojiWrapper}>
                        <EmojiPickerButton_1.default isDisabled={shouldDisableEmojiPicker} onModalHide={() => {
            const activeElementId = DomUtils_1.default.getActiveElement()?.id;
            if (activeElementId === CONST_1.default.COMPOSER.NATIVE_ID || activeElementId === CONST_1.default.EMOJI_PICKER_BUTTON_NATIVE_ID) {
                return;
            }
            ReportActionComposeFocusManager_1.default.focus();
        }} onEmojiSelected={addEmojiToTextBox} emojiPickerID={action.reportActionID} onPress={setUpComposeFocusManager}/>
                    </react_native_1.View>

                    <react_native_1.View style={styles.alignSelfEnd}>
                        <Tooltip_1.default text={translate('common.saveChanges')}>
                            <PressableWithFeedback_1.default style={[styles.chatItemSubmitButton, hasExceededMaxCommentLength ? {} : styles.buttonSuccess]} onPress={publishDraft} disabled={hasExceededMaxCommentLength} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.saveChanges')} hoverDimmingValue={1} pressDimmingValue={0.2} 
    // Keep focus on the composer when send button is clicked.
    onMouseDown={(e) => e.preventDefault()}>
                                <Icon_1.default src={Expensicons.Checkmark} fill={hasExceededMaxCommentLength ? theme.icon : theme.textLight}/>
                            </PressableWithFeedback_1.default>
                        </Tooltip_1.default>
                    </react_native_1.View>
                </react_native_1.View>
            </react_native_1.View>
            {hasExceededMaxCommentLength && <ExceededCommentLength_1.default />}
        </>);
}
ReportActionItemMessageEdit.displayName = 'ReportActionItemMessageEdit';
exports.default = (0, react_1.forwardRef)(ReportActionItemMessageEdit);
