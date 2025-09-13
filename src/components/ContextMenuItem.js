"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useThrottledButtonState_1 = require("@hooks/useThrottledButtonState");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const getButtonState_1 = require("@libs/getButtonState");
const BaseMiniContextMenuItem_1 = require("./BaseMiniContextMenuItem");
const FocusableMenuItem_1 = require("./FocusableMenuItem");
const Icon_1 = require("./Icon");
function ContextMenuItem({ onPress, successIcon, successText = '', icon, text, isMini = false, description = '', isAnonymousAction = false, isFocused = false, shouldLimitWidth = true, wrapperStyle, shouldPreventDefaultFocusOnPress = true, buttonRef = { current: null }, onFocus = () => { }, onBlur = () => { }, disabled = false, shouldShowLoadingSpinnerIcon = false, }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { windowWidth } = (0, useWindowDimensions_1.default)();
    const [isThrottledButtonActive, setThrottledButtonInactive] = (0, useThrottledButtonState_1.default)();
    const triggerPressAndUpdateSuccess = (event) => {
        if (!isThrottledButtonActive) {
            return;
        }
        onPress(event);
        // We only set the success state when we have icon or text to represent the success state
        // We may want to replace this check by checking the Result from OnPress Callback in future.
        if (!!successIcon || successText) {
            setThrottledButtonInactive();
        }
    };
    (0, react_1.useImperativeHandle)(ref, () => ({ triggerPressAndUpdateSuccess }));
    const itemIcon = !isThrottledButtonActive && successIcon ? successIcon : icon;
    const itemText = !isThrottledButtonActive && successText ? successText : text;
    return isMini ? (<BaseMiniContextMenuItem_1.default ref={buttonRef} tooltipText={itemText} onPress={triggerPressAndUpdateSuccess} isDelayButtonStateComplete={!isThrottledButtonActive} shouldPreventDefaultFocusOnPress={shouldPreventDefaultFocusOnPress}>
            {({ hovered, pressed }) => (<Icon_1.default small src={itemIcon} fill={StyleUtils.getIconFillColor((0, getButtonState_1.default)(hovered, pressed, !isThrottledButtonActive))}/>)}
        </BaseMiniContextMenuItem_1.default>) : (<FocusableMenuItem_1.default title={itemText} icon={itemIcon} onPress={triggerPressAndUpdateSuccess} wrapperStyle={[styles.pr8, wrapperStyle]} success={!isThrottledButtonActive} description={description} descriptionTextStyle={styles.breakWord} style={shouldLimitWidth && StyleUtils.getContextMenuItemStyles(windowWidth)} isAnonymousAction={isAnonymousAction} focused={isFocused} interactive={isThrottledButtonActive} onFocus={onFocus} onBlur={onBlur} disabled={disabled} shouldShowLoadingSpinnerIcon={shouldShowLoadingSpinnerIcon}/>);
}
ContextMenuItem.displayName = 'ContextMenuItem';
exports.default = (0, react_1.forwardRef)(ContextMenuItem);
