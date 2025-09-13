"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const ActionSheetAwareScrollView = require("@components/ActionSheetAwareScrollView");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const PopoverAnchorTooltip_1 = require("@components/Tooltip/PopoverAnchorTooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getButtonState_1 = require("@libs/getButtonState");
const EmojiPickerAction_1 = require("@userActions/EmojiPickerAction");
const CONST_1 = require("@src/CONST");
function EmojiPickerButton({ isDisabled = false, emojiPickerID = '', shiftVertical = 0, onPress, onModalHide, onEmojiSelected }) {
    const actionSheetContext = (0, react_1.useContext)(ActionSheetAwareScrollView.ActionSheetAwareScrollViewContext);
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const emojiPopoverAnchor = (0, react_1.useRef)(null);
    const { translate } = (0, useLocalize_1.default)();
    const isFocused = (0, native_1.useIsFocused)();
    const openEmojiPicker = (e) => {
        if (!isFocused) {
            return;
        }
        actionSheetContext.transitionActionSheetState({
            type: ActionSheetAwareScrollView.Actions.CLOSE_KEYBOARD,
        });
        if (!EmojiPickerAction_1.emojiPickerRef?.current?.isEmojiPickerVisible) {
            (0, EmojiPickerAction_1.showEmojiPicker)(onModalHide, onEmojiSelected, emojiPopoverAnchor, {
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
                shiftVertical,
            }, () => { }, emojiPickerID);
        }
        else {
            EmojiPickerAction_1.emojiPickerRef.current.hideEmojiPicker();
        }
        onPress?.(e);
    };
    (0, react_1.useEffect)(() => EmojiPickerAction_1.resetEmojiPopoverAnchor, []);
    return (<PopoverAnchorTooltip_1.default text={translate('reportActionCompose.emoji')}>
            <PressableWithoutFeedback_1.default ref={emojiPopoverAnchor} style={({ hovered, pressed }) => [styles.chatItemEmojiButton, StyleUtils.getButtonBackgroundColorStyle((0, getButtonState_1.default)(hovered, pressed))]} disabled={isDisabled} onPress={openEmojiPicker} id={CONST_1.default.EMOJI_PICKER_BUTTON_NATIVE_ID} accessibilityLabel={translate('reportActionCompose.emoji')}>
                {({ hovered, pressed }) => (<Icon_1.default src={Expensicons.Emoji} fill={StyleUtils.getIconFillColor((0, getButtonState_1.default)(hovered, pressed))}/>)}
            </PressableWithoutFeedback_1.default>
        </PopoverAnchorTooltip_1.default>);
}
EmojiPickerButton.displayName = 'EmojiPickerButton';
exports.default = (0, react_1.memo)(EmojiPickerButton);
