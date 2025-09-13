"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const Text_1 = require("@components/Text");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Browser = require("@libs/Browser");
const getButtonState_1 = require("@libs/getButtonState");
const CONST_1 = require("@src/CONST");
function EmojiPickerMenuItem({ emoji, onPress, onHoverIn = () => { }, onHoverOut = () => { }, onFocus = () => { }, onBlur = () => { }, isFocused = false, isHighlighted = false, }) {
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const ref = (0, react_1.useRef)(null);
    const StyleUtils = (0, useStyleUtils_1.default)();
    const themeStyles = (0, useThemeStyles_1.default)();
    const focusAndScroll = () => {
        if (ref.current && 'focus' in ref.current) {
            ref.current.focus({ preventScroll: true });
        }
        if (ref.current && 'scrollIntoView' in ref.current) {
            ref.current.scrollIntoView({ block: 'nearest' });
        }
    };
    (0, react_1.useEffect)(() => {
        if (!isFocused) {
            return;
        }
        focusAndScroll();
    }, [isFocused]);
    return (<PressableWithoutFeedback_1.default shouldUseAutoHitSlop={false} onPress={() => onPress(emoji)} 
    // In order to prevent haptic feedback, pass empty callback as onLongPress  Please refer https://github.com/necolas/react-native-web/issues/2349#issuecomment-1195564240
    onLongPress={Browser.isMobileChrome() ? () => { } : undefined} onPressOut={Browser.isMobile() ? onHoverOut : undefined} onHoverIn={() => {
            if (onHoverIn) {
                onHoverIn();
            }
            setIsHovered(true);
        }} onHoverOut={() => {
            if (onHoverOut) {
                onHoverOut();
            }
            setIsHovered(false);
        }} onFocus={onFocus} onBlur={onBlur} ref={(el) => {
            ref.current = el ?? null;
        }} style={({ pressed }) => [
            isFocused || isHovered || isHighlighted ? themeStyles.emojiItemHighlighted : {},
            Browser.isMobile() && StyleUtils.getButtonBackgroundColorStyle((0, getButtonState_1.default)(false, pressed)),
            themeStyles.emojiItem,
        ]} accessibilityLabel={emoji} role={CONST_1.default.ROLE.BUTTON}>
            <Text_1.default style={[themeStyles.emojiText]}>{emoji}</Text_1.default>
        </PressableWithoutFeedback_1.default>);
}
// Significantly speeds up re-renders of the EmojiPickerMenu's FlatList
// by only re-rendering at most two EmojiPickerMenuItems that are highlighted/un-highlighted per user action.
exports.default = react_1.default.memo(EmojiPickerMenuItem, (prevProps, nextProps) => prevProps.isFocused === nextProps.isFocused && prevProps.isHighlighted === nextProps.isHighlighted && prevProps.emoji === nextProps.emoji);
