"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const Text_1 = require("@components/Text");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getButtonState_1 = require("@libs/getButtonState");
const CONST_1 = require("@src/CONST");
function EmojiPickerMenuItem({ emoji, onPress, onHoverIn = () => { }, onHoverOut = () => { }, onFocus = () => { }, onBlur = () => { }, isFocused = false, isHighlighted = false, isUsingKeyboardMovement = false, }) {
    const ref = (0, react_1.useRef)(null);
    const StyleUtils = (0, useStyleUtils_1.default)();
    const themeStyles = (0, useThemeStyles_1.default)();
    (0, react_1.useEffect)(() => {
        if (!isFocused) {
            return;
        }
        ref?.current?.focus();
    }, [isFocused]);
    return (<PressableWithoutFeedback_1.default shouldUseAutoHitSlop={false} onPress={() => onPress(emoji)} onHoverIn={onHoverIn} onHoverOut={onHoverOut} onFocus={onFocus} onBlur={onBlur} ref={ref} style={({ pressed }) => [
            StyleUtils.getButtonBackgroundColorStyle((0, getButtonState_1.default)(false, pressed)),
            isHighlighted && isUsingKeyboardMovement && themeStyles.emojiItemKeyboardHighlighted,
            isHighlighted && !isUsingKeyboardMovement && themeStyles.emojiItemHighlighted,
            themeStyles.emojiItem,
        ]} accessibilityLabel={emoji} role={CONST_1.default.ROLE.BUTTON}>
            <Text_1.default style={[themeStyles.emojiText]}>{emoji}</Text_1.default>
        </PressableWithoutFeedback_1.default>);
}
// Significantly speeds up re-renders of the EmojiPickerMenu's FlatList
// by only re-rendering at most two EmojiPickerMenuItems that are highlighted/un-highlighted per user action.
exports.default = react_1.default.memo(EmojiPickerMenuItem, (prevProps, nextProps) => prevProps.isHighlighted === nextProps.isHighlighted && prevProps.emoji === nextProps.emoji && prevProps.isUsingKeyboardMovement === nextProps.isUsingKeyboardMovement);
