"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_live_markdown_1 = require("@expensify/react-native-live-markdown");
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
const useShortMentionsList_1 = require("@hooks/useShortMentionsList");
const useTheme_1 = require("@hooks/useTheme");
const FormatSelectionUtils_1 = require("@libs/FormatSelectionUtils");
const ParsingUtils_1 = require("@libs/ParsingUtils");
const runOnLiveMarkdownRuntime_1 = require("@libs/runOnLiveMarkdownRuntime");
const CONST_1 = require("@src/CONST");
// Convert the underlying TextInput into an Animated component so that we can take an animated ref and pass it to a worklet
const AnimatedMarkdownTextInput = react_native_reanimated_1.default.createAnimatedComponent(react_native_live_markdown_1.MarkdownTextInput);
function RNMarkdownTextInputWithRef({ maxLength, parser, ref, forwardedFSClass = CONST_1.default.FULLSTORY.CLASS.MASK, ...props }) {
    const theme = (0, useTheme_1.default)();
    const { availableLoginsList, currentUserMentions } = (0, useShortMentionsList_1.default)();
    const mentionsSharedVal = (0, react_native_reanimated_1.useSharedValue)(availableLoginsList);
    const inputRef = (0, react_1.useRef)(null);
    // Expose the ref to the parent component
    react_1.default.useImperativeHandle(ref, () => inputRef.current);
    // Check if the cursor is at the end of the text
    const isCursorAtEnd = props.selection && props.value && props.selection.start === props.value.length;
    // Automatically scroll to the end if the cursor was at the end after value changes
    (0, react_1.useEffect)(() => {
        if (!inputRef.current || !isCursorAtEnd) {
            return;
        }
        if ('scrollTop' in inputRef.current && 'scrollHeight' in inputRef.current) {
            const currentRef = inputRef.current;
            currentRef.scrollTop = currentRef.scrollHeight;
        }
    }, [props.value, isCursorAtEnd]);
    // If `parser` prop was passed down we use it directly, otherwise we default to parsing with ExpensiMark
    const parserWorklet = (0, react_1.useCallback)((text) => {
        'worklet';
        if (parser) {
            return parser(text);
        }
        return (0, ParsingUtils_1.parseExpensiMarkWithShortMentions)(text, mentionsSharedVal.get(), currentUserMentions);
    }, [currentUserMentions, mentionsSharedVal, parser]);
    (0, react_1.useEffect)(() => {
        (0, runOnLiveMarkdownRuntime_1.default)(() => {
            'worklet';
            mentionsSharedVal.set(availableLoginsList);
        })();
    }, [availableLoginsList, mentionsSharedVal]);
    return (<AnimatedMarkdownTextInput allowFontScaling={false} textBreakStrategy="simple" keyboardAppearance={theme.colorScheme} parser={parserWorklet} ref={inputRef} formatSelection={FormatSelectionUtils_1.default} 
    // eslint-disable-next-line react/forbid-component-props
    fsClass={forwardedFSClass} 
    // eslint-disable-next-line
    {...props} 
    /**
     * If maxLength is not set, we should set it to CONST.MAX_COMMENT_LENGTH + 1, to avoid parsing markdown for large text
     */
    maxLength={maxLength ?? CONST_1.default.MAX_COMMENT_LENGTH + 1}/>);
}
RNMarkdownTextInputWithRef.displayName = 'RNTextInputWithRef';
exports.default = RNMarkdownTextInputWithRef;
