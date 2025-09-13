"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const Text_1 = require("@components/Text");
const PopoverAnchorTooltip_1 = require("@components/Tooltip/PopoverAnchorTooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const EmojiPickerAction_1 = require("@libs/actions/EmojiPickerAction");
const getButtonState_1 = require("@libs/getButtonState");
const CONST_1 = require("@src/CONST");
function EmojiPickerButtonDropdown(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
{ isDisabled = false, withoutOverlay = false, onModalHide, onInputChange, value, disabled, style, ...otherProps }, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
ref) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const emojiPopoverAnchor = (0, react_1.useRef)(null);
    const { translate } = (0, useLocalize_1.default)();
    (0, react_1.useEffect)(() => EmojiPickerAction_1.resetEmojiPopoverAnchor, []);
    const onPress = () => {
        if ((0, EmojiPickerAction_1.isEmojiPickerVisible)()) {
            (0, EmojiPickerAction_1.hideEmojiPicker)();
            return;
        }
        (0, EmojiPickerAction_1.showEmojiPicker)(onModalHide, (emoji) => onInputChange(emoji), emojiPopoverAnchor, {
            horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
            vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
            shiftVertical: 4,
        }, () => { }, undefined, value, withoutOverlay);
    };
    return (<PopoverAnchorTooltip_1.default text={translate('reportActionCompose.emoji')}>
            <PressableWithoutFeedback_1.default ref={emojiPopoverAnchor} style={[styles.emojiPickerButtonDropdown, style]} disabled={isDisabled} onPress={onPress} id="emojiDropdownButton" accessibilityLabel="statusEmoji" role={CONST_1.default.ROLE.BUTTON}>
                {({ hovered, pressed }) => (<react_native_1.View style={styles.emojiPickerButtonDropdownContainer}>
                        <Text_1.default style={styles.emojiPickerButtonDropdownIcon} numberOfLines={1}>
                            {
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            value || (<Icon_1.default src={Expensicons.Emoji} fill={StyleUtils.getIconFillColor(CONST_1.default.BUTTON_STATES.DISABLED)}/>)}
                        </Text_1.default>
                        <react_native_1.View style={[styles.popoverMenuIcon, styles.pointerEventsAuto, disabled && styles.cursorDisabled, styles.rotate90]}>
                            <Icon_1.default src={Expensicons.ArrowRight} fill={StyleUtils.getIconFillColor((0, getButtonState_1.default)(hovered, pressed))}/>
                        </react_native_1.View>
                    </react_native_1.View>)}
            </PressableWithoutFeedback_1.default>
        </PopoverAnchorTooltip_1.default>);
}
EmojiPickerButtonDropdown.displayName = 'EmojiPickerButtonDropdown';
exports.default = react_1.default.forwardRef(EmojiPickerButtonDropdown);
