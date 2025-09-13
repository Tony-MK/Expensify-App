"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const utils_1 = require("@components/Button/utils");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const useHover_1 = require("@hooks/useHover");
const useMouseContext_1 = require("@hooks/useMouseContext");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useSyncFocus_1 = require("@hooks/useSyncFocus");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
function BaseListItem({ item, pressableStyle, wrapperStyle, pressableWrapperStyle, containerStyle, isDisabled = false, shouldPreventEnterKeySubmit = false, canSelectMultiple = false, onSelectRow, onDismissError = () => { }, rightHandSideComponent, keyForList, errors, pendingAction, FooterComponent, children, isFocused, shouldSyncFocus = true, shouldDisplayRBR = true, shouldShowBlueBorderOnFocus = false, onFocus = () => { }, hoverStyle, onLongPressRow, testID, shouldUseDefaultRightHandSideCheckmark = true, forwardedFSClass, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { hovered, bind } = (0, useHover_1.default)();
    const { isMouseDownOnInput, setMouseUp } = (0, useMouseContext_1.useMouseContext)();
    const pressableRef = (0, react_1.useRef)(null);
    // Sync focus on an item
    (0, useSyncFocus_1.default)(pressableRef, !!isFocused, shouldSyncFocus);
    const handleMouseLeave = (e) => {
        bind.onMouseLeave();
        e.stopPropagation();
        setMouseUp();
    };
    const rightHandSideComponentRender = () => {
        if (canSelectMultiple || !rightHandSideComponent) {
            return null;
        }
        if (typeof rightHandSideComponent === 'function') {
            return rightHandSideComponent(item, isFocused);
        }
        return rightHandSideComponent;
    };
    return (<OfflineWithFeedback_1.default onClose={() => onDismissError(item)} pendingAction={pendingAction} errors={errors} errorRowStyles={styles.ph5} contentContainerStyle={containerStyle}>
            <PressableWithFeedback_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...bind} ref={pressableRef} onLongPress={() => {
            onLongPressRow?.(item);
        }} onPress={(e) => {
            if (isMouseDownOnInput) {
                e?.stopPropagation(); // Preventing the click action
                return;
            }
            if (shouldPreventEnterKeySubmit && e && 'key' in e && e.key === CONST_1.default.KEYBOARD_SHORTCUTS.ENTER.shortcutKey) {
                return;
            }
            onSelectRow(item);
        }} disabled={isDisabled && !item.isSelected} interactive={item.isInteractive} accessibilityLabel={item.text ?? ''} role={(0, utils_1.getButtonRole)(true)} isNested hoverDimmingValue={1} pressDimmingValue={item.isInteractive === false ? 1 : variables_1.default.pressDimValue} hoverStyle={[!item.isDisabled && item.isInteractive !== false && styles.hoveredComponentBG, hoverStyle]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true, [CONST_1.default.INNER_BOX_SHADOW_ELEMENT]: shouldShowBlueBorderOnFocus }} onMouseDown={(e) => e.preventDefault()} id={keyForList ?? ''} style={[
            pressableStyle,
            isFocused && StyleUtils.getItemBackgroundColorStyle(!!item.isSelected, !!isFocused, !!item.isDisabled, theme.activeComponentBG, theme.hoverComponentBG),
        ]} onFocus={onFocus} onMouseLeave={handleMouseLeave} tabIndex={item.tabIndex} wrapperStyle={pressableWrapperStyle} testID={testID}>
                <react_native_1.View testID={`${CONST_1.default.BASE_LIST_ITEM_TEST_ID}${item.keyForList}`} accessibilityState={{ selected: !!isFocused }} style={[
            wrapperStyle,
            isFocused && StyleUtils.getItemBackgroundColorStyle(!!item.isSelected, !!isFocused, !!item.isDisabled, theme.activeComponentBG, theme.hoverComponentBG),
        ]} fsClass={forwardedFSClass}>
                    {typeof children === 'function' ? children(hovered) : children}

                    {!canSelectMultiple && !!item.isSelected && !rightHandSideComponent && shouldUseDefaultRightHandSideCheckmark && (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.ml3]} accessible={false}>
                            <react_native_1.View>
                                <Icon_1.default src={Expensicons.Checkmark} fill={theme.success}/>
                            </react_native_1.View>
                        </react_native_1.View>)}
                    {(!item.isSelected || !!item.canShowSeveralIndicators) && !!item.brickRoadIndicator && shouldDisplayRBR && (<react_native_1.View style={[styles.alignItemsCenter, styles.justifyContentCenter]}>
                            <Icon_1.default testID={CONST_1.default.DOT_INDICATOR_TEST_ID} src={Expensicons.DotIndicator} fill={item.brickRoadIndicator === CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.INFO ? theme.iconSuccessFill : theme.danger}/>
                        </react_native_1.View>)}

                    {rightHandSideComponentRender()}
                </react_native_1.View>
                {FooterComponent}
            </PressableWithFeedback_1.default>
        </OfflineWithFeedback_1.default>);
}
BaseListItem.displayName = 'BaseListItem';
exports.default = BaseListItem;
