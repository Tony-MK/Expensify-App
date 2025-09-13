"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mime_db_1 = require("mime-db");
const react_1 = require("react");
const react_native_1 = require("react-native");
const RNMarkdownTextInput_1 = require("@components/RNMarkdownTextInput");
const useMarkdownStyle_1 = require("@hooks/useMarkdownStyle");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const EmojiUtils_1 = require("@libs/EmojiUtils");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const Parser_1 = require("@libs/Parser");
const getFileSize_1 = require("@pages/Share/getFileSize");
const CONST_1 = require("@src/CONST");
const excludeNoStyles = [];
const excludeReportMentionStyle = ['mentionReport'];
function Composer({ onClear: onClearProp = () => { }, onPasteFile = () => { }, isDisabled = false, maxLines, isComposerFullSize = false, style, 
// On native layers we like to have the Text Input not focused so the
// user can read new chats without the keyboard in the way of the view.
// On Android the selection prop is required on the TextInput but this prop has issues on IOS
selection, value, isGroupPolicyReport = false, ...props }, ref) {
    const textInput = (0, react_1.useRef)(null);
    const textContainsOnlyEmojis = (0, react_1.useMemo)(() => (0, EmojiUtils_1.containsOnlyEmojis)(Parser_1.default.htmlToText(Parser_1.default.replace(value ?? ''))), [value]);
    const theme = (0, useTheme_1.default)();
    const markdownStyle = (0, useMarkdownStyle_1.default)(textContainsOnlyEmojis, !isGroupPolicyReport ? excludeReportMentionStyle : excludeNoStyles);
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    (0, react_1.useEffect)(() => {
        if (!textInput.current || !textInput.current.setSelection || !selection || isComposerFullSize) {
            return;
        }
        // We need the delay for setSelection to properly work for IOS in bridgeless mode due to a react native
        // internal bug of dispatching the event before the component is ready for it.
        // (see https://github.com/Expensify/App/pull/50520#discussion_r1861960311 for more context)
        const timeoutID = setTimeout(() => {
            // We are setting selection twice to trigger a scroll to the cursor on toggling to smaller composer size.
            textInput.current?.setSelection((selection.start || 1) - 1, selection.start);
            textInput.current?.setSelection(selection.start, selection.start);
        }, 0);
        return () => clearTimeout(timeoutID);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isComposerFullSize]);
    /**
     * Set the TextInput Ref
     * @param {Element} el
     */
    const setTextInputRef = (0, react_1.useCallback)((el) => {
        // eslint-disable-next-line react-compiler/react-compiler
        textInput.current = el;
        if (typeof ref !== 'function' || textInput.current === null) {
            return;
        }
        // This callback prop is used by the parent component using the constructor to
        // get a ref to the inner textInput element e.g. if we do
        // <constructor ref={el => this.textInput = el} /> this will not
        // return a ref to the component, but rather the HTML element by default
        ref(textInput.current);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    const onClear = (0, react_1.useCallback)(({ nativeEvent }) => {
        onClearProp(nativeEvent.text);
    }, [onClearProp]);
    const pasteFile = (0, react_1.useCallback)((e) => {
        const clipboardContent = e.nativeEvent.items.at(0);
        if (clipboardContent?.type === 'text/plain') {
            return;
        }
        const mimeType = clipboardContent?.type ?? '';
        const fileURI = clipboardContent?.data;
        const baseFileName = fileURI?.split('/').pop() ?? 'file';
        const { fileName: stem, fileExtension: originalFileExtension } = (0, FileUtils_1.splitExtensionFromFileName)(baseFileName);
        const fileExtension = originalFileExtension || (mime_db_1.default[mimeType].extensions?.[0] ?? 'bin');
        const fileName = `${stem}.${fileExtension}`;
        let file = { uri: fileURI, name: fileName, type: mimeType, size: 0 };
        (0, getFileSize_1.default)(file.uri ?? '')
            .then((size) => (file = { ...file, size }))
            .finally(() => onPasteFile(file));
    }, [onPasteFile]);
    const maxHeightStyle = (0, react_1.useMemo)(() => StyleUtils.getComposerMaxHeightStyle(maxLines, isComposerFullSize), [StyleUtils, isComposerFullSize, maxLines]);
    const composerStyle = (0, react_1.useMemo)(() => react_native_1.StyleSheet.flatten([style, textContainsOnlyEmojis ? styles.onlyEmojisTextLineHeight : {}]), [style, textContainsOnlyEmojis, styles]);
    return (<RNMarkdownTextInput_1.default id={CONST_1.default.COMPOSER.NATIVE_ID} multiline autoComplete="off" placeholderTextColor={theme.placeholderText} ref={setTextInputRef} value={value} rejectResponderTermination={false} smartInsertDelete={false} textAlignVertical="center" style={[composerStyle, maxHeightStyle]} markdownStyle={markdownStyle} 
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...props} readOnly={isDisabled} onPaste={pasteFile} onClear={onClear}/>);
}
Composer.displayName = 'Composer';
exports.default = react_1.default.forwardRef(Composer);
