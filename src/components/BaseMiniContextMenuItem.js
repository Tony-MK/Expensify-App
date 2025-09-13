"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DomUtils_1 = require("@libs/DomUtils");
const getButtonState_1 = require("@libs/getButtonState");
const ReportActionComposeFocusManager_1 = require("@libs/ReportActionComposeFocusManager");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const PressableWithoutFeedback_1 = require("./Pressable/PressableWithoutFeedback");
const PopoverAnchorTooltip_1 = require("./Tooltip/PopoverAnchorTooltip");
/**
 * Component that renders a mini context menu item with a
 * pressable. Also renders a tooltip when hovering the item.
 */
function BaseMiniContextMenuItem({ tooltipText, onPress, children, isDelayButtonStateComplete = true, shouldPreventDefaultFocusOnPress = true, ref }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    return (<PopoverAnchorTooltip_1.default text={tooltipText} shouldRender>
            <PressableWithoutFeedback_1.default ref={ref} onPress={onPress} onMouseDown={(event) => {
            if (!ReportActionComposeFocusManager_1.default.isFocused() && !ReportActionComposeFocusManager_1.default.isEditFocused()) {
                const activeElement = DomUtils_1.default.getActiveElement();
                if (activeElement instanceof HTMLElement) {
                    activeElement?.blur();
                }
                return;
            }
            // Allow text input blur on right click
            if (!event || event.button === 2) {
                return;
            }
            // Prevent text input blur on left click
            if (shouldPreventDefaultFocusOnPress) {
                event.preventDefault();
            }
        }} accessibilityLabel={tooltipText} role={CONST_1.default.ROLE.BUTTON} style={({ hovered, pressed }) => [
            styles.reportActionContextMenuMiniButton,
            StyleUtils.getButtonBackgroundColorStyle((0, getButtonState_1.default)(hovered, pressed, isDelayButtonStateComplete), true),
            isDelayButtonStateComplete && styles.cursorDefault,
        ]}>
                {(pressableState) => (<react_native_1.View style={[StyleUtils.getWidthAndHeightStyle(variables_1.default.iconSizeNormal), styles.alignItemsCenter, styles.justifyContentCenter]}>
                        {typeof children === 'function' ? children(pressableState) : children}
                    </react_native_1.View>)}
            </PressableWithoutFeedback_1.default>
        </PopoverAnchorTooltip_1.default>);
}
BaseMiniContextMenuItem.displayName = 'BaseMiniContextMenuItem';
exports.default = BaseMiniContextMenuItem;
