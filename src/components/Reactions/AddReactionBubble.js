"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const Text_1 = require("@components/Text");
const PopoverAnchorTooltip_1 = require("@components/Tooltip/PopoverAnchorTooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getButtonState_1 = require("@libs/getButtonState");
const variables_1 = require("@styles/variables");
const EmojiPickerAction_1 = require("@userActions/EmojiPickerAction");
const Session_1 = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
function AddReactionBubble({ onSelectEmoji, reportAction, onPressOpenPicker, onWillShowPicker = () => { }, isContextMenu = false, setIsEmojiPickerActive }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const ref = (0, react_1.useRef)(null);
    const { translate } = (0, useLocalize_1.default)();
    (0, react_1.useEffect)(() => EmojiPickerAction_1.resetEmojiPopoverAnchor, []);
    const onPress = () => {
        const openPicker = (refParam, anchorOrigin) => {
            (0, EmojiPickerAction_1.showEmojiPicker)(() => {
                setIsEmojiPickerActive?.(false);
            }, (emojiCode, emojiObject) => {
                onSelectEmoji(emojiObject);
            }, refParam ?? ref, anchorOrigin, onWillShowPicker, reportAction.reportActionID);
        };
        if (!EmojiPickerAction_1.emojiPickerRef.current?.isEmojiPickerVisible) {
            setIsEmojiPickerActive?.(true);
            if (onPressOpenPicker) {
                onPressOpenPicker(openPicker);
            }
            else {
                openPicker();
            }
        }
        else {
            setIsEmojiPickerActive?.(false);
            EmojiPickerAction_1.emojiPickerRef.current.hideEmojiPicker();
        }
    };
    return (<PopoverAnchorTooltip_1.default text={translate('emojiReactions.addReactionTooltip')}>
            <PressableWithFeedback_1.default ref={ref} style={({ hovered, pressed }) => [styles.emojiReactionBubble, styles.userSelectNone, StyleUtils.getEmojiReactionBubbleStyle(hovered || pressed, false, isContextMenu)]} onPress={(0, Session_1.callFunctionIfActionIsAllowed)(onPress)} onMouseDown={(event) => {
            // Allow text input blur when Add reaction is right clicked
            if (!event || event.button === 2) {
                return;
            }
            // Prevent text input blur when Add reaction is left clicked
            event.preventDefault();
        }} accessibilityLabel={translate('emojiReactions.addReactionTooltip')} role={CONST_1.default.ROLE.BUTTON} 
    // disable dimming
    pressDimmingValue={1} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
                {({ hovered, pressed }) => (<>
                        {/* This (invisible) text will make the view have the same size as a regular
   emoji reaction. We make the text invisible and put the
   icon on top of it. */}
                        <Text_1.default style={[styles.opacity0, StyleUtils.getEmojiReactionBubbleTextStyle(isContextMenu)]}>{'\u2800\u2800'}</Text_1.default>
                        <react_native_1.View style={styles.pAbsolute}>
                            <Icon_1.default src={Expensicons.AddReaction} width={isContextMenu ? variables_1.default.iconSizeNormal : variables_1.default.iconSizeSmall} height={isContextMenu ? variables_1.default.iconSizeNormal : variables_1.default.iconSizeSmall} fill={StyleUtils.getIconFillColor((0, getButtonState_1.default)(hovered, pressed))}/>
                        </react_native_1.View>
                    </>)}
            </PressableWithFeedback_1.default>
        </PopoverAnchorTooltip_1.default>);
}
AddReactionBubble.displayName = 'AddReactionBubble';
exports.default = AddReactionBubble;
