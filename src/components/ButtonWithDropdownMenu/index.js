"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PopoverMenu_1 = require("@components/PopoverMenu");
const useKeyboardShortcut_1 = require("@hooks/useKeyboardShortcut");
const usePopoverPosition_1 = require("@hooks/usePopoverPosition");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const mergeRefs_1 = require("@libs/mergeRefs");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const defaultAnchorAlignment = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
    // we assume that popover menu opens below the button, anchor is at TOP
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
};
function ButtonWithDropdownMenuInner({ ref, ...props }) {
    const { success = true, isSplitButton = true, isLoading = false, isDisabled = false, pressOnEnter = false, shouldAlwaysShowDropdownMenu = false, menuHeaderText = '', customText, style, disabledStyle, buttonSize = CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM, anchorAlignment = defaultAnchorAlignment, buttonRef, onPress, options, onOptionSelected, onSubItemSelected, onOptionsMenuShow, onOptionsMenuHide, enterKeyEventListenerPriority = 0, wrapperStyle, useKeyboardShortcuts = false, defaultSelectedIndex = 0, shouldShowSelectedItemCheck = false, testID, secondLineText = '', icon, shouldPopoverUseScrollView = false, containerStyles, shouldUseModalPaddingStyle = true, shouldUseShortForm = false, shouldUseOptionIcon = false, } = props;
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const [selectedItemIndex, setSelectedItemIndex] = (0, react_1.useState)(defaultSelectedIndex);
    const [isMenuVisible, setIsMenuVisible] = (0, react_1.useState)(false);
    // In tests, skip the popover anchor position calculation. The default values are needed for popover menu to be rendered in tests.
    const defaultPopoverAnchorPosition = process.env.NODE_ENV === 'test' ? { horizontal: 100, vertical: 100 } : null;
    const [popoverAnchorPosition, setPopoverAnchorPosition] = (0, react_1.useState)(defaultPopoverAnchorPosition);
    const dropdownAnchor = (0, react_1.useRef)(null);
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to apply correct popover styles
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    // eslint-disable-next-line react-compiler/react-compiler
    const dropdownButtonRef = isSplitButton ? buttonRef : (0, mergeRefs_1.default)(buttonRef, dropdownAnchor);
    const selectedItem = options.at(selectedItemIndex) ?? options.at(0);
    const areAllOptionsDisabled = options.every((option) => option.disabled);
    const innerStyleDropButton = StyleUtils.getDropDownButtonHeight(buttonSize);
    const isButtonSizeLarge = buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.LARGE;
    const isButtonSizeSmall = buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.SMALL;
    const nullCheckRef = (refParam) => refParam ?? null;
    const shouldShowButtonRightIcon = !!options.at(0)?.shouldShowButtonRightIcon;
    (0, react_1.useEffect)(() => {
        setSelectedItemIndex(defaultSelectedIndex);
    }, [defaultSelectedIndex]);
    const { paddingBottom } = (0, useSafeAreaPaddings_1.default)(true);
    const { calculatePopoverPosition } = (0, usePopoverPosition_1.default)();
    (0, react_1.useEffect)(() => {
        if (!dropdownAnchor.current || !isMenuVisible) {
            return;
        }
        calculatePopoverPosition(dropdownAnchor, anchorAlignment).then(setPopoverAnchorPosition);
    }, [isMenuVisible, calculatePopoverPosition, anchorAlignment]);
    const handleSingleOptionPress = (0, react_1.useCallback)((event) => {
        const option = options.at(0);
        if (!option) {
            return;
        }
        if (option.onSelected) {
            option.onSelected();
        }
        else {
            onOptionSelected?.(option);
            onPress(event, option.value);
        }
        onSubItemSelected?.(option, 0, event);
    }, [options, onPress, onOptionSelected, onSubItemSelected]);
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.CTRL_ENTER, (e) => {
        if (shouldAlwaysShowDropdownMenu || options.length) {
            if (!isSplitButton) {
                setIsMenuVisible(!isMenuVisible);
                return;
            }
            if (selectedItem?.value) {
                onPress(e, selectedItem.value);
            }
        }
        else {
            handleSingleOptionPress(e);
        }
    }, {
        captureOnInputs: true,
        shouldBubble: false,
        isActive: useKeyboardShortcuts,
    });
    const splitButtonWrapperStyle = isSplitButton ? [styles.flexRow, styles.justifyContentBetween, styles.alignItemsCenter] : {};
    const isTextTooLong = customText && customText?.length > 6;
    const handlePress = (0, react_1.useCallback)((event) => {
        if (!isSplitButton) {
            setIsMenuVisible(!isMenuVisible);
        }
        else if (selectedItem?.value) {
            onPress(event, selectedItem.value);
        }
    }, [isMenuVisible, isSplitButton, onPress, selectedItem?.value]);
    (0, react_1.useImperativeHandle)(ref, () => ({
        setIsMenuVisible,
    }));
    return (<react_native_1.View style={wrapperStyle}>
            {shouldAlwaysShowDropdownMenu || options.length > 1 ? (<react_native_1.View style={[splitButtonWrapperStyle, style]}>
                    <Button_1.default success={success} pressOnEnter={pressOnEnter} ref={dropdownButtonRef} onPress={handlePress} text={customText ?? selectedItem?.text ?? ''} isDisabled={isDisabled || areAllOptionsDisabled} isLoading={isLoading} shouldRemoveRightBorderRadius style={isSplitButton ? [styles.flex1, styles.pr0] : {}} large={buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.LARGE} medium={buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM} small={buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.SMALL} innerStyles={[innerStyleDropButton, !isSplitButton && styles.dropDownButtonCartIconView, isTextTooLong && shouldUseShortForm && { ...styles.pl2, ...styles.pr1 }]} enterKeyEventListenerPriority={enterKeyEventListenerPriority} iconRight={Expensicons.DownArrow} shouldShowRightIcon={!isSplitButton && !isLoading} isSplitButton={isSplitButton} testID={testID} textStyles={[isTextTooLong && shouldUseShortForm ? { ...styles.textExtraSmall, ...styles.textBold } : {}]} secondLineText={secondLineText} icon={icon}/>

                    {isSplitButton && (<Button_1.default ref={dropdownAnchor} success={success} isDisabled={isDisabled} style={[styles.pl0]} onPress={() => setIsMenuVisible(!isMenuVisible)} shouldRemoveLeftBorderRadius large={buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.LARGE} medium={buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM} small={buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.SMALL} innerStyles={[styles.dropDownButtonCartIconContainerPadding, innerStyleDropButton, isButtonSizeSmall && styles.dropDownButtonCartIcon]} enterKeyEventListenerPriority={enterKeyEventListenerPriority}>
                            <react_native_1.View style={[styles.dropDownButtonCartIconView, innerStyleDropButton]}>
                                <react_native_1.View style={[success ? styles.buttonSuccessDivider : styles.buttonDivider]}/>
                                <react_native_1.View style={[
                    isButtonSizeLarge && styles.dropDownLargeButtonArrowContain,
                    isButtonSizeSmall && shouldUseShortForm ? styles.dropDownSmallButtonArrowContain : styles.dropDownMediumButtonArrowContain,
                ]}>
                                    <Icon_1.default medium={isButtonSizeLarge} small={!isButtonSizeLarge && !shouldUseShortForm} inline={shouldUseShortForm} width={shouldUseShortForm ? variables_1.default.iconSizeExtraSmall : undefined} height={shouldUseShortForm ? variables_1.default.iconSizeExtraSmall : undefined} src={Expensicons.DownArrow} additionalStyles={shouldUseShortForm ? [styles.pRelative, styles.t0] : undefined} fill={success ? theme.buttonSuccessText : theme.icon}/>
                                </react_native_1.View>
                            </react_native_1.View>
                        </Button_1.default>)}
                </react_native_1.View>) : (<Button_1.default success={success} ref={buttonRef} pressOnEnter={pressOnEnter} isDisabled={isDisabled || !!options.at(0)?.disabled} style={[styles.w100, style]} disabledStyle={disabledStyle} isLoading={isLoading} text={selectedItem?.text} onPress={handleSingleOptionPress} large={buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.LARGE} medium={buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM} small={buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.SMALL} innerStyles={[innerStyleDropButton, shouldShowButtonRightIcon && styles.dropDownButtonCartIconView]} iconRightStyles={shouldShowButtonRightIcon && styles.ml2} enterKeyEventListenerPriority={enterKeyEventListenerPriority} secondLineText={secondLineText} icon={shouldUseOptionIcon && !shouldShowButtonRightIcon ? options.at(0)?.icon : icon} iconRight={shouldShowButtonRightIcon ? options.at(0)?.icon : undefined} shouldShowRightIcon={shouldShowButtonRightIcon} testID={testID}/>)}
            {(shouldAlwaysShowDropdownMenu || options.length > 1) && !!popoverAnchorPosition && (<PopoverMenu_1.default isVisible={isMenuVisible} onClose={() => {
                setIsMenuVisible(false);
                onOptionsMenuHide?.();
            }} onModalShow={onOptionsMenuShow} onItemSelected={(selectedSubitem, index, event) => {
                onSubItemSelected?.(selectedSubitem, index, event);
                if (selectedSubitem.shouldCloseModalOnSelect !== false) {
                    setIsMenuVisible(false);
                }
            }} anchorPosition={popoverAnchorPosition} shouldShowSelectedItemCheck={shouldShowSelectedItemCheck} 
        // eslint-disable-next-line react-compiler/react-compiler
        anchorRef={nullCheckRef(dropdownAnchor)} scrollContainerStyle={!shouldUseModalPaddingStyle && isSmallScreenWidth && { ...styles.pt4, paddingBottom }} anchorAlignment={anchorAlignment} shouldUseModalPaddingStyle={shouldUseModalPaddingStyle} headerText={menuHeaderText} shouldUseScrollView={shouldPopoverUseScrollView} containerStyles={containerStyles} menuItems={options.map((item, index) => ({
                ...item,
                onSelected: item.onSelected
                    ? () => {
                        item.onSelected?.();
                        if (item.shouldUpdateSelectedIndex) {
                            setSelectedItemIndex(index);
                        }
                    }
                    : () => {
                        onOptionSelected?.(item);
                        if (item.shouldUpdateSelectedIndex === false) {
                            return;
                        }
                        setSelectedItemIndex(index);
                    },
                shouldCallAfterModalHide: true,
                subMenuItems: item.subMenuItems?.map((subItem) => ({ ...subItem, shouldCallAfterModalHide: true })),
            }))}/>)}
        </react_native_1.View>);
}
ButtonWithDropdownMenuInner.displayName = 'ButtonWithDropdownMenu';
const ButtonWithDropdownMenu = ButtonWithDropdownMenuInner;
exports.default = ButtonWithDropdownMenu;
