"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react/jsx-props-no-spreading */
const fast_equals_1 = require("fast-equals");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useArrowKeyFocusManager_1 = require("@hooks/useArrowKeyFocusManager");
const useKeyboardShortcut_1 = require("@hooks/useKeyboardShortcut");
const usePrevious_1 = require("@hooks/usePrevious");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const Browser_1 = require("@libs/Browser");
const getPlatform_1 = require("@libs/getPlatform");
const variables_1 = require("@styles/variables");
const Modal_1 = require("@userActions/Modal");
const CONST_1 = require("@src/CONST");
const FocusableMenuItem_1 = require("./FocusableMenuItem");
const FocusTrapForModal_1 = require("./FocusTrap/FocusTrapForModal");
const Expensicons = require("./Icon/Expensicons");
const MenuItem_1 = require("./MenuItem");
const OfflineWithFeedback_1 = require("./OfflineWithFeedback");
const PopoverWithMeasuredContent_1 = require("./PopoverWithMeasuredContent");
const ScrollView_1 = require("./ScrollView");
const Text_1 = require("./Text");
const renderWithConditionalWrapper = (shouldUseScrollView, contentContainerStyle, children) => {
    if (shouldUseScrollView) {
        return <ScrollView_1.default contentContainerStyle={contentContainerStyle}>{children}</ScrollView_1.default>;
    }
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
};
function getSelectedItemIndex(menuItems) {
    return menuItems.findIndex((option) => option.isSelected);
}
function PopoverMenu(props) {
    const wasVisible = (0, usePrevious_1.default)(props.isVisible);
    // Do not render the PopoverMenu before it gets opened. Until then both values are false
    if (!wasVisible && !props.isVisible) {
        return null;
    }
    return <BasePopoverMenu {...props}/>;
}
function BasePopoverMenu({ menuItems, onItemSelected, isVisible, anchorPosition, anchorRef, onClose, onLayout, onModalShow, onModalHide, headerText, fromSidebarMediumScreen, anchorAlignment = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
}, animationIn = 'fadeIn', animationInDelay, animationOut = 'fadeOut', animationInTiming = CONST_1.default.ANIMATED_TRANSITION, animationOutTiming, disableAnimation = true, withoutOverlay = false, shouldSetModalVisibility = true, shouldEnableNewFocusManagement, restoreFocusType, shouldShowSelectedItemCheck = false, containerStyles, headerStyles, innerContainerStyle, scrollContainerStyle, shouldUseScrollView = false, shouldEnableMaxHeight = true, shouldUpdateFocusedIndex = true, shouldUseModalPaddingStyle, shouldAvoidSafariException = false, testID, }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to apply correct popover styles
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const [currentMenuItems, setCurrentMenuItems] = (0, react_1.useState)(menuItems);
    const currentMenuItemsFocusedIndex = getSelectedItemIndex(currentMenuItems);
    const [enteredSubMenuIndexes, setEnteredSubMenuIndexes] = (0, react_1.useState)(CONST_1.default.EMPTY_ARRAY);
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const platform = (0, getPlatform_1.default)();
    const isWebOrDesktop = platform === CONST_1.default.PLATFORM.WEB || platform === CONST_1.default.PLATFORM.DESKTOP;
    const [focusedIndex, setFocusedIndex] = (0, useArrowKeyFocusManager_1.default)({ initialFocusedIndex: currentMenuItemsFocusedIndex, maxIndex: currentMenuItems.length - 1, isActive: isVisible });
    const selectItem = (index, event) => {
        const selectedItem = currentMenuItems.at(index);
        if (!selectedItem) {
            return;
        }
        if (selectedItem?.subMenuItems) {
            setCurrentMenuItems([...selectedItem.subMenuItems]);
            setEnteredSubMenuIndexes([...enteredSubMenuIndexes, index]);
            const selectedSubMenuItemIndex = selectedItem?.subMenuItems.findIndex((option) => option.isSelected);
            setFocusedIndex(selectedSubMenuItemIndex);
        }
        else if (selectedItem.shouldCallAfterModalHide && (!(0, Browser_1.isSafari)() || shouldAvoidSafariException)) {
            onItemSelected?.(selectedItem, index, event);
            if (selectedItem.shouldCloseModalOnSelect !== false) {
                (0, Modal_1.close)(() => {
                    selectedItem.onSelected?.();
                }, undefined, selectedItem.shouldCloseAllModals);
            }
            else {
                selectedItem.onSelected?.();
            }
        }
        else {
            onItemSelected?.(selectedItem, index, event);
            selectedItem.onSelected?.();
        }
    };
    const getPreviousSubMenu = () => {
        let currentItems = menuItems;
        for (let i = 0; i < enteredSubMenuIndexes.length - 1; i++) {
            const nextItems = currentItems[enteredSubMenuIndexes[i]].subMenuItems;
            if (!nextItems) {
                return currentItems;
            }
            currentItems = nextItems;
        }
        return currentItems;
    };
    const renderBackButtonItem = () => {
        const previousMenuItems = getPreviousSubMenu();
        const previouslySelectedItem = previousMenuItems[enteredSubMenuIndexes[enteredSubMenuIndexes.length - 1]];
        const hasBackButtonText = !!previouslySelectedItem?.backButtonText;
        return (<MenuItem_1.default key={previouslySelectedItem?.text} icon={Expensicons.BackArrow} iconFill={(isHovered) => (isHovered ? theme.iconHovered : theme.icon)} style={hasBackButtonText ? styles.pv0 : undefined} additionalIconStyles={[{ width: variables_1.default.iconSizeSmall, height: variables_1.default.iconSizeSmall }, styles.opacitySemiTransparent, styles.mr1]} title={hasBackButtonText ? previouslySelectedItem?.backButtonText : previouslySelectedItem?.text} titleStyle={hasBackButtonText ? styles.createMenuHeaderText : undefined} shouldShowBasicTitle={hasBackButtonText} shouldCheckActionAllowedOnPress={false} description={previouslySelectedItem?.description} onPress={() => {
                setCurrentMenuItems(previousMenuItems);
                setFocusedIndex(-1);
                setEnteredSubMenuIndexes((prevState) => prevState.slice(0, -1));
            }}/>);
    };
    const renderedMenuItems = currentMenuItems.map((item, menuIndex) => {
        const { text, onSelected, subMenuItems, shouldCallAfterModalHide, key, testID: menuItemTestID, shouldShowLoadingSpinnerIcon, ...menuItemProps } = item;
        return (<OfflineWithFeedback_1.default 
        // eslint-disable-next-line react/no-array-index-key
        key={key ?? `${item.text}_${menuIndex}`} pendingAction={item.pendingAction}>
                <FocusableMenuItem_1.default 
        // eslint-disable-next-line react/no-array-index-key
        key={key ?? `${item.text}_${menuIndex}`} pressableTestID={menuItemTestID ?? `PopoverMenuItem-${item.text}`} title={text} onPress={(event) => selectItem(menuIndex, event)} focused={focusedIndex === menuIndex} shouldShowSelectedItemCheck={shouldShowSelectedItemCheck} shouldCheckActionAllowedOnPress={false} iconRight={item.rightIcon} shouldShowRightIcon={!!item.rightIcon} onFocus={() => {
                if (!shouldUpdateFocusedIndex) {
                    return;
                }
                setFocusedIndex(menuIndex);
            }} wrapperStyle={[
                StyleUtils.getItemBackgroundColorStyle(!!item.isSelected, focusedIndex === menuIndex, item.disabled ?? false, theme.activeComponentBG, theme.hoverComponentBG),
                shouldUseScrollView && !shouldUseModalPaddingStyle && StyleUtils.getOptionMargin(menuIndex, currentMenuItems.length - 1),
            ]} shouldRemoveHoverBackground={item.isSelected} titleStyle={react_native_1.StyleSheet.flatten([styles.flex1, item.titleStyle])} 
        // Spread other props dynamically
        {...menuItemProps} hasSubMenuItems={!!subMenuItems?.length} shouldShowLoadingSpinnerIcon={shouldShowLoadingSpinnerIcon}/>
            </OfflineWithFeedback_1.default>);
    });
    const renderHeaderText = () => {
        if (!headerText || enteredSubMenuIndexes.length !== 0) {
            return;
        }
        return <Text_1.default style={[styles.createMenuHeaderText, styles.ph5, styles.pv3, headerStyles]}>{headerText}</Text_1.default>;
    };
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.ENTER, () => {
        if (focusedIndex === -1) {
            return;
        }
        selectItem(focusedIndex);
        setFocusedIndex(-1); // Reset the focusedIndex on selecting any menu
    }, { isActive: isVisible });
    const keyboardShortcutSpaceCallback = (0, react_1.useCallback)((e) => {
        if (shouldUseScrollView) {
            return;
        }
        e?.preventDefault();
    }, [shouldUseScrollView]);
    // On web and desktop, pressing the space bar after interacting with the parent view
    // can cause the parent view to scroll when the space bar is pressed.
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.SPACE, keyboardShortcutSpaceCallback, { isActive: isWebOrDesktop && isVisible, shouldPreventDefault: false });
    const handleModalHide = () => {
        onModalHide?.();
        setFocusedIndex(currentMenuItemsFocusedIndex);
    };
    // When the menu items are changed, we want to reset the sub-menu to make sure
    // we are not accessing the wrong sub-menu parent or possibly undefined when rendering the back button.
    // We use useLayoutEffect so the reset happens before the repaint
    (0, react_1.useLayoutEffect)(() => {
        if (menuItems.length === 0) {
            return;
        }
        setEnteredSubMenuIndexes(CONST_1.default.EMPTY_ARRAY);
        setCurrentMenuItems(menuItems);
        // Update the focused item to match the selected item, but only when the popover is not visible.
        // This ensures that if the popover is visible, highlight from the keyboard navigation is not overridden
        // by external updates.
        if (isVisible) {
            return;
        }
        setFocusedIndex(getSelectedItemIndex(menuItems));
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [menuItems, setFocusedIndex]);
    const menuContainerStyle = (0, react_1.useMemo)(() => {
        if (isSmallScreenWidth) {
            return shouldEnableMaxHeight ? { maxHeight: windowHeight - 250 } : {};
        }
        return styles.createMenuContainer;
    }, [isSmallScreenWidth, shouldEnableMaxHeight, windowHeight, styles.createMenuContainer]);
    const { paddingTop, paddingBottom, paddingVertical, ...restScrollContainerStyle } = react_native_1.StyleSheet.flatten([styles.pv4, scrollContainerStyle]) ?? {};
    return (<PopoverWithMeasuredContent_1.default anchorPosition={anchorPosition} anchorRef={anchorRef} anchorAlignment={anchorAlignment} onClose={() => {
            setCurrentMenuItems(menuItems);
            setEnteredSubMenuIndexes(CONST_1.default.EMPTY_ARRAY);
            onClose();
        }} isVisible={isVisible} onModalHide={handleModalHide} onModalShow={onModalShow} animationIn={animationIn} animationOut={animationOut} animationInDelay={animationInDelay} animationInTiming={animationInTiming} animationOutTiming={animationOutTiming} disableAnimation={disableAnimation} fromSidebarMediumScreen={fromSidebarMediumScreen} withoutOverlay={withoutOverlay} shouldSetModalVisibility={shouldSetModalVisibility} shouldEnableNewFocusManagement={shouldEnableNewFocusManagement} useNativeDriver restoreFocusType={restoreFocusType} innerContainerStyle={{ ...styles.pv0, ...innerContainerStyle }} shouldUseModalPaddingStyle={shouldUseModalPaddingStyle} testID={testID}>
            <FocusTrapForModal_1.default active={isVisible}>
                <react_native_1.View onLayout={onLayout} style={[menuContainerStyle, containerStyles, { paddingTop, paddingBottom, paddingVertical, ...(isWebOrDesktop ? styles.flex1 : styles.flexGrow1) }]}>
                    {renderHeaderText()}
                    {enteredSubMenuIndexes.length > 0 && renderBackButtonItem()}
                    {renderWithConditionalWrapper(shouldUseScrollView, restScrollContainerStyle, renderedMenuItems)}
                </react_native_1.View>
            </FocusTrapForModal_1.default>
        </PopoverWithMeasuredContent_1.default>);
}
PopoverMenu.displayName = 'PopoverMenu';
exports.default = react_1.default.memo(PopoverMenu, (prevProps, nextProps) => (0, fast_equals_1.deepEqual)(prevProps.menuItems, nextProps.menuItems) &&
    prevProps.isVisible === nextProps.isVisible &&
    (0, fast_equals_1.deepEqual)(prevProps.anchorPosition, nextProps.anchorPosition) &&
    prevProps.anchorRef === nextProps.anchorRef &&
    prevProps.headerText === nextProps.headerText &&
    prevProps.fromSidebarMediumScreen === nextProps.fromSidebarMediumScreen &&
    (0, fast_equals_1.deepEqual)(prevProps.anchorAlignment, nextProps.anchorAlignment) &&
    prevProps.animationIn === nextProps.animationIn &&
    prevProps.animationOut === nextProps.animationOut &&
    prevProps.animationInTiming === nextProps.animationInTiming &&
    prevProps.disableAnimation === nextProps.disableAnimation &&
    prevProps.withoutOverlay === nextProps.withoutOverlay &&
    prevProps.shouldSetModalVisibility === nextProps.shouldSetModalVisibility);
