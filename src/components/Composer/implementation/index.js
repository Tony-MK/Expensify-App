"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const debounce_1 = require("lodash/debounce");
const react_1 = require("react");
const react_native_1 = require("react-native");
const RNMarkdownTextInput_1 = require("@components/RNMarkdownTextInput");
const useHtmlPaste_1 = require("@hooks/useHtmlPaste");
const useIsScrollBarVisible_1 = require("@hooks/useIsScrollBarVisible");
const useMarkdownStyle_1 = require("@hooks/useMarkdownStyle");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const addEncryptedAuthTokenToURL_1 = require("@libs/addEncryptedAuthTokenToURL");
const Browser_1 = require("@libs/Browser");
const EmojiUtils_1 = require("@libs/EmojiUtils");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const isEnterWhileComposition_1 = require("@libs/KeyboardShortcut/isEnterWhileComposition");
const Parser_1 = require("@libs/Parser");
const CONST_1 = require("@src/CONST");
const excludeNoStyles = [];
const excludeReportMentionStyle = ['mentionReport'];
const imagePreviewAuthRequiredURLs = [CONST_1.default.EXPENSIFY_URL, CONST_1.default.STAGING_EXPENSIFY_URL];
// Enable Markdown parsing.
// On web we like to have the Text Input field always focused so the user can easily type a new chat
function Composer({ value, defaultValue, maxLines = -1, onKeyPress = () => { }, style, autoFocus = false, shouldCalculateCaretPosition = false, isDisabled = false, onClear = () => { }, onPasteFile = () => { }, onSelectionChange = () => { }, checkComposerVisibility = () => false, selection: selectionProp = {
    start: 0,
    end: 0,
}, isComposerFullSize = false, onContentSizeChange, shouldContainScroll = true, isGroupPolicyReport = false, ...props }, ref) {
    const textContainsOnlyEmojis = (0, react_1.useMemo)(() => (0, EmojiUtils_1.containsOnlyEmojis)(Parser_1.default.htmlToText(Parser_1.default.replace(value ?? ''))), [value]);
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const markdownStyle = (0, useMarkdownStyle_1.default)(textContainsOnlyEmojis, !isGroupPolicyReport ? excludeReportMentionStyle : excludeNoStyles);
    const StyleUtils = (0, useStyleUtils_1.default)();
    const textInput = (0, react_1.useRef)(null);
    const [selection, setSelection] = (0, react_1.useState)({
        start: selectionProp.start,
        end: selectionProp.end,
    });
    const [isRendered, setIsRendered] = (0, react_1.useState)(false);
    const isScrollBarVisible = (0, useIsScrollBarVisible_1.default)(textInput, value ?? '');
    const [prevScroll, setPrevScroll] = (0, react_1.useState)();
    const [prevHeight, setPrevHeight] = (0, react_1.useState)();
    const isReportFlatListScrolling = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        if (!!selection && selectionProp.start === selection.start && selectionProp.end === selection.end) {
            return;
        }
        setSelection(selectionProp);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [selectionProp]);
    /**
     *  Adds the cursor position to the selection change event.
     */
    const addCursorPositionToSelectionChange = (event) => {
        const webEvent = event;
        const sel = window.getSelection();
        if (shouldCalculateCaretPosition && isRendered && sel) {
            const range = sel.getRangeAt(0).cloneRange();
            range.collapse(true);
            const rect = range.getClientRects()[0] || range.startContainer.parentElement?.getClientRects()[0];
            const containerRect = textInput.current?.getBoundingClientRect();
            let x = 0;
            let y = 0;
            if (rect && containerRect) {
                x = rect.left - containerRect.left;
                y = rect.top - containerRect.top + (textInput?.current?.scrollTop ?? 0) - rect.height / 2;
            }
            const selectionValue = {
                start: webEvent.nativeEvent.selection.start,
                end: webEvent.nativeEvent.selection.end,
                positionX: x - CONST_1.default.SPACE_CHARACTER_WIDTH,
                positionY: y,
            };
            onSelectionChange({
                ...webEvent,
                nativeEvent: {
                    ...webEvent.nativeEvent,
                    selection: selectionValue,
                },
            });
            setSelection(selectionValue);
        }
        else {
            onSelectionChange(webEvent);
            setSelection(webEvent.nativeEvent.selection);
        }
    };
    /**
     * Check the paste event for an attachment, parse the data and call onPasteFile from props with the selected file,
     * Otherwise, convert pasted HTML to Markdown and set it on the composer.
     */
    const handlePaste = (0, react_1.useCallback)((event) => {
        const isVisible = checkComposerVisibility();
        const isFocused = textInput.current?.isFocused();
        const isContenteditableDivFocused = document.activeElement?.nodeName === 'DIV' && document.activeElement?.hasAttribute('contenteditable');
        if (!(isVisible || isFocused)) {
            return true;
        }
        if (textInput.current !== event.target && !(isContenteditableDivFocused && !event.clipboardData?.files.length)) {
            const eventTarget = event.target;
            // To make sure the composer does not capture paste events from other inputs, we check where the event originated
            // If it did originate in another input, we return early to prevent the composer from handling the paste
            const isTargetInput = eventTarget?.nodeName === CONST_1.default.ELEMENT_NAME.INPUT || eventTarget?.nodeName === CONST_1.default.ELEMENT_NAME.TEXTAREA || eventTarget?.contentEditable === 'true';
            if (isTargetInput || (!isFocused && isContenteditableDivFocused && event.clipboardData?.files.length)) {
                return true;
            }
            textInput.current?.focus();
        }
        event.preventDefault();
        const TEXT_HTML = 'text/html';
        const clipboardDataHtml = event.clipboardData?.getData(TEXT_HTML) ?? '';
        // If paste contains files, then trigger file management
        if (event.clipboardData?.files.length && event.clipboardData.files.length > 0) {
            // Prevent the default so we do not post the file name into the text box
            onPasteFile(event.clipboardData.files[0]);
            return true;
        }
        // If paste contains base64 image
        if (clipboardDataHtml?.includes(CONST_1.default.IMAGE_BASE64_MATCH)) {
            const domparser = new DOMParser();
            const pastedHTML = clipboardDataHtml;
            const embeddedImages = domparser.parseFromString(pastedHTML, TEXT_HTML)?.images;
            if (embeddedImages.length > 0 && embeddedImages[0].src) {
                const src = embeddedImages[0].src;
                const file = (0, FileUtils_1.base64ToFile)(src, 'image.png');
                onPasteFile(file);
                return true;
            }
        }
        // If paste contains image from Google Workspaces ex: Sheets, Docs, Slide, etc
        if (clipboardDataHtml?.includes(CONST_1.default.GOOGLE_DOC_IMAGE_LINK_MATCH)) {
            const domparser = new DOMParser();
            const pastedHTML = clipboardDataHtml;
            const embeddedImages = domparser.parseFromString(pastedHTML, TEXT_HTML).images;
            if (embeddedImages.length > 0 && embeddedImages[0]?.src) {
                const src = embeddedImages[0].src;
                if (src.includes(CONST_1.default.GOOGLE_DOC_IMAGE_LINK_MATCH)) {
                    fetch(src)
                        .then((response) => response.blob())
                        .then((blob) => {
                        const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                        onPasteFile(file);
                    });
                    return true;
                }
            }
        }
        return false;
    }, [onPasteFile, checkComposerVisibility]);
    (0, react_1.useEffect)(() => {
        if (!textInput.current) {
            return;
        }
        const debouncedSetPrevScroll = (0, debounce_1.default)(() => {
            if (!textInput.current) {
                return;
            }
            setPrevScroll(textInput.current.scrollTop);
        }, 100);
        textInput.current.addEventListener('scroll', debouncedSetPrevScroll);
        return () => {
            textInput.current?.removeEventListener('scroll', debouncedSetPrevScroll);
        };
    }, []);
    (0, react_1.useEffect)(() => {
        const scrollingListener = react_native_1.DeviceEventEmitter.addListener(CONST_1.default.EVENTS.SCROLLING, (scrolling) => {
            isReportFlatListScrolling.current = scrolling;
        });
        return () => scrollingListener.remove();
    }, []);
    (0, react_1.useEffect)(() => {
        const handleWheel = (e) => {
            if (isReportFlatListScrolling.current) {
                e.preventDefault();
                return;
            }
            // When the composer has no scrollable content, the stopPropagation will prevent the inverted wheel event handler on the Chat body
            // which defaults to the browser wheel behavior. This causes the chat body to scroll in the opposite direction creating jerky behavior.
            if (textInput.current && textInput.current.scrollHeight <= textInput.current.clientHeight) {
                return;
            }
            e.stopPropagation();
        };
        textInput.current?.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            textInput.current?.removeEventListener('wheel', handleWheel);
        };
    }, []);
    (0, react_1.useEffect)(() => {
        if (!textInput.current || prevScroll === undefined || prevHeight === undefined) {
            return;
        }
        // eslint-disable-next-line react-compiler/react-compiler
        textInput.current.scrollTop = prevScroll + prevHeight - textInput.current.clientHeight;
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isComposerFullSize]);
    const isActive = (0, native_1.useIsFocused)();
    (0, useHtmlPaste_1.default)(textInput, handlePaste, isActive);
    (0, react_1.useEffect)(() => {
        setIsRendered(true);
    }, []);
    const clear = (0, react_1.useCallback)(() => {
        if (!textInput.current) {
            return;
        }
        const currentText = textInput.current.value;
        textInput.current.clear();
        // We need to reset the selection to 0,0 manually after clearing the text input on web
        const selectionEvent = {
            nativeEvent: {
                selection: {
                    start: 0,
                    end: 0,
                },
            },
        };
        onSelectionChange(selectionEvent);
        setSelection({ start: 0, end: 0 });
        onClear(currentText);
    }, [onClear, onSelectionChange]);
    (0, react_1.useImperativeHandle)(ref, () => {
        const textInputRef = textInput.current;
        if (!textInputRef) {
            throw new Error('textInputRef is not available. This should never happen and indicates a developer error.');
        }
        return {
            ...textInputRef,
            // Overwrite clear with our custom implementation, which mimics how the native TextInput's clear method works
            clear,
            // We have to redefine these methods as they are inherited by prototype chain and are not accessible directly
            blur: () => textInputRef.blur(),
            focus: () => textInputRef.focus(),
            get scrollTop() {
                return textInputRef.scrollTop;
            },
        };
    }, [clear]);
    const handleKeyPress = (0, react_1.useCallback)((e) => {
        // Prevent onKeyPress from being triggered if the Enter key is pressed while text is being composed
        if (!onKeyPress || (0, isEnterWhileComposition_1.default)(e)) {
            return;
        }
        onKeyPress(e);
    }, [onKeyPress]);
    const scrollStyleMemo = (0, react_1.useMemo)(() => {
        if (shouldContainScroll) {
            return isScrollBarVisible ? [styles.overflowScroll, styles.overscrollBehaviorContain] : styles.overflowHidden;
        }
        return styles.overflowAuto;
    }, [shouldContainScroll, styles.overflowAuto, styles.overflowScroll, styles.overscrollBehaviorContain, styles.overflowHidden, isScrollBarVisible]);
    const inputStyleMemo = (0, react_1.useMemo)(() => [
        react_native_1.StyleSheet.flatten([style, { outline: 'none' }]),
        StyleUtils.getComposeTextAreaPadding(isComposerFullSize, textContainsOnlyEmojis),
        (0, Browser_1.isMobileSafari)() || (0, Browser_1.isSafari)() ? styles.rtlTextRenderForSafari : {},
        scrollStyleMemo,
        StyleUtils.getComposerMaxHeightStyle(maxLines, isComposerFullSize),
        isComposerFullSize ? { height: '100%', maxHeight: 'none' } : undefined,
        textContainsOnlyEmojis ? styles.onlyEmojisTextLineHeight : {},
    ], [style, styles.rtlTextRenderForSafari, styles.onlyEmojisTextLineHeight, scrollStyleMemo, StyleUtils, maxLines, isComposerFullSize, textContainsOnlyEmojis]);
    return (<RNMarkdownTextInput_1.default id={CONST_1.default.COMPOSER.NATIVE_ID} autoComplete="off" autoCorrect={!(0, Browser_1.isMobileSafari)()} placeholderTextColor={theme.placeholderText} ref={(el) => {
            textInput.current = el;
        }} selection={selection} style={[inputStyleMemo]} markdownStyle={markdownStyle} value={value} defaultValue={defaultValue} autoFocus={autoFocus} 
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...props} onSelectionChange={addCursorPositionToSelectionChange} onContentSizeChange={(e) => {
            setPrevHeight(e.nativeEvent.contentSize.height);
            onContentSizeChange?.(e);
        }} disabled={isDisabled} onKeyPress={handleKeyPress} addAuthTokenToImageURLCallback={addEncryptedAuthTokenToURL_1.default} imagePreviewAuthRequiredURLs={imagePreviewAuthRequiredURLs}/>);
}
Composer.displayName = 'Composer';
exports.default = react_1.default.forwardRef(Composer);
