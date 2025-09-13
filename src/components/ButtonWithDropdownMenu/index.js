"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Button_1 = require("@components/Button");
var Icon_1 = require("@components/Icon");
var Expensicons = require("@components/Icon/Expensicons");
var PopoverMenu_1 = require("@components/PopoverMenu");
var useKeyboardShortcut_1 = require("@hooks/useKeyboardShortcut");
var usePopoverPosition_1 = require("@hooks/usePopoverPosition");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var mergeRefs_1 = require("@libs/mergeRefs");
var variables_1 = require("@styles/variables");
var CONST_1 = require("@src/CONST");
var defaultAnchorAlignment = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
    // we assume that popover menu opens below the button, anchor is at TOP
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
};
function ButtonWithDropdownMenuInner(_a) {
    var _b, _c, _d, _e, _f, _g;
    var ref = _a.ref, props = __rest(_a, ["ref"]);
    var _h = props.success, success = _h === void 0 ? true : _h, _j = props.isSplitButton, isSplitButton = _j === void 0 ? true : _j, _k = props.isLoading, isLoading = _k === void 0 ? false : _k, _l = props.isDisabled, isDisabled = _l === void 0 ? false : _l, _m = props.pressOnEnter, pressOnEnter = _m === void 0 ? false : _m, _o = props.shouldAlwaysShowDropdownMenu, shouldAlwaysShowDropdownMenu = _o === void 0 ? false : _o, _p = props.menuHeaderText, menuHeaderText = _p === void 0 ? '' : _p, customText = props.customText, style = props.style, disabledStyle = props.disabledStyle, _q = props.buttonSize, buttonSize = _q === void 0 ? CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM : _q, _r = props.anchorAlignment, anchorAlignment = _r === void 0 ? defaultAnchorAlignment : _r, buttonRef = props.buttonRef, onPress = props.onPress, options = props.options, onOptionSelected = props.onOptionSelected, onSubItemSelected = props.onSubItemSelected, onOptionsMenuShow = props.onOptionsMenuShow, onOptionsMenuHide = props.onOptionsMenuHide, _s = props.enterKeyEventListenerPriority, enterKeyEventListenerPriority = _s === void 0 ? 0 : _s, wrapperStyle = props.wrapperStyle, _t = props.useKeyboardShortcuts, useKeyboardShortcuts = _t === void 0 ? false : _t, _u = props.defaultSelectedIndex, defaultSelectedIndex = _u === void 0 ? 0 : _u, _v = props.shouldShowSelectedItemCheck, shouldShowSelectedItemCheck = _v === void 0 ? false : _v, testID = props.testID, _w = props.secondLineText, secondLineText = _w === void 0 ? '' : _w, icon = props.icon, _x = props.shouldPopoverUseScrollView, shouldPopoverUseScrollView = _x === void 0 ? false : _x, containerStyles = props.containerStyles, _y = props.shouldUseModalPaddingStyle, shouldUseModalPaddingStyle = _y === void 0 ? true : _y, _z = props.shouldUseShortForm, shouldUseShortForm = _z === void 0 ? false : _z, _0 = props.shouldUseOptionIcon, shouldUseOptionIcon = _0 === void 0 ? false : _0;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var StyleUtils = (0, useStyleUtils_1.default)();
    var _1 = (0, react_1.useState)(defaultSelectedIndex), selectedItemIndex = _1[0], setSelectedItemIndex = _1[1];
    var _2 = (0, react_1.useState)(false), isMenuVisible = _2[0], setIsMenuVisible = _2[1];
    // In tests, skip the popover anchor position calculation. The default values are needed for popover menu to be rendered in tests.
    var defaultPopoverAnchorPosition = process.env.NODE_ENV === 'test' ? { horizontal: 100, vertical: 100 } : null;
    var _3 = (0, react_1.useState)(defaultPopoverAnchorPosition), popoverAnchorPosition = _3[0], setPopoverAnchorPosition = _3[1];
    var dropdownAnchor = (0, react_1.useRef)(null);
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to apply correct popover styles
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    var isSmallScreenWidth = (0, useResponsiveLayout_1.default)().isSmallScreenWidth;
    // eslint-disable-next-line react-compiler/react-compiler
    var dropdownButtonRef = isSplitButton ? buttonRef : (0, mergeRefs_1.default)(buttonRef, dropdownAnchor);
    var selectedItem = (_b = options.at(selectedItemIndex)) !== null && _b !== void 0 ? _b : options.at(0);
    var areAllOptionsDisabled = options.every(function (option) { return option.disabled; });
    var innerStyleDropButton = StyleUtils.getDropDownButtonHeight(buttonSize);
    var isButtonSizeLarge = buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.LARGE;
    var isButtonSizeSmall = buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.SMALL;
    var nullCheckRef = function (refParam) { return refParam !== null && refParam !== void 0 ? refParam : null; };
    var shouldShowButtonRightIcon = !!((_c = options.at(0)) === null || _c === void 0 ? void 0 : _c.shouldShowButtonRightIcon);
    (0, react_1.useEffect)(function () {
        setSelectedItemIndex(defaultSelectedIndex);
    }, [defaultSelectedIndex]);
    var paddingBottom = (0, useSafeAreaPaddings_1.default)(true).paddingBottom;
    var calculatePopoverPosition = (0, usePopoverPosition_1.default)().calculatePopoverPosition;
    (0, react_1.useEffect)(function () {
        if (!dropdownAnchor.current || !isMenuVisible) {
            return;
        }
        calculatePopoverPosition(dropdownAnchor, anchorAlignment).then(setPopoverAnchorPosition);
    }, [isMenuVisible, calculatePopoverPosition, anchorAlignment]);
    var handleSingleOptionPress = (0, react_1.useCallback)(function (event) {
        var option = options.at(0);
        if (!option) {
            return;
        }
        if (option.onSelected) {
            option.onSelected();
        }
        else {
            onOptionSelected === null || onOptionSelected === void 0 ? void 0 : onOptionSelected(option);
            onPress(event, option.value);
        }
        onSubItemSelected === null || onSubItemSelected === void 0 ? void 0 : onSubItemSelected(option, 0, event);
    }, [options, onPress, onOptionSelected, onSubItemSelected]);
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.CTRL_ENTER, function (e) {
        if (shouldAlwaysShowDropdownMenu || options.length) {
            if (!isSplitButton) {
                setIsMenuVisible(!isMenuVisible);
                return;
            }
            if (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.value) {
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
    var splitButtonWrapperStyle = isSplitButton ? [styles.flexRow, styles.justifyContentBetween, styles.alignItemsCenter] : {};
    var isTextTooLong = customText && (customText === null || customText === void 0 ? void 0 : customText.length) > 6;
    var handlePress = (0, react_1.useCallback)(function (event) {
        if (!isSplitButton) {
            setIsMenuVisible(!isMenuVisible);
        }
        else if (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.value) {
            onPress(event, selectedItem.value);
        }
    }, [isMenuVisible, isSplitButton, onPress, selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.value]);
    (0, react_1.useImperativeHandle)(ref, function () { return ({
        setIsMenuVisible: setIsMenuVisible,
    }); });
    return (<react_native_1.View style={wrapperStyle}>
            {shouldAlwaysShowDropdownMenu || options.length > 1 ? (<react_native_1.View style={[splitButtonWrapperStyle, style]}>
                    <Button_1.default success={success} pressOnEnter={pressOnEnter} ref={dropdownButtonRef} onPress={handlePress} text={(_d = customText !== null && customText !== void 0 ? customText : selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.text) !== null && _d !== void 0 ? _d : ''} isDisabled={isDisabled || areAllOptionsDisabled} isLoading={isLoading} shouldRemoveRightBorderRadius style={isSplitButton ? [styles.flex1, styles.pr0] : {}} large={buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.LARGE} medium={buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM} small={buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.SMALL} innerStyles={[innerStyleDropButton, !isSplitButton && styles.dropDownButtonCartIconView, isTextTooLong && shouldUseShortForm && __assign(__assign({}, styles.pl2), styles.pr1)]} enterKeyEventListenerPriority={enterKeyEventListenerPriority} iconRight={Expensicons.DownArrow} shouldShowRightIcon={!isSplitButton && !isLoading} isSplitButton={isSplitButton} testID={testID} textStyles={[isTextTooLong && shouldUseShortForm ? __assign(__assign({}, styles.textExtraSmall), styles.textBold) : {}]} secondLineText={secondLineText} icon={icon}/>

                    {isSplitButton && (<Button_1.default ref={dropdownAnchor} success={success} isDisabled={isDisabled} style={[styles.pl0]} onPress={function () { return setIsMenuVisible(!isMenuVisible); }} shouldRemoveLeftBorderRadius large={buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.LARGE} medium={buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM} small={buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.SMALL} innerStyles={[styles.dropDownButtonCartIconContainerPadding, innerStyleDropButton, isButtonSizeSmall && styles.dropDownButtonCartIcon]} enterKeyEventListenerPriority={enterKeyEventListenerPriority}>
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
                </react_native_1.View>) : (<Button_1.default success={success} ref={buttonRef} pressOnEnter={pressOnEnter} isDisabled={isDisabled || !!((_e = options.at(0)) === null || _e === void 0 ? void 0 : _e.disabled)} style={[styles.w100, style]} disabledStyle={disabledStyle} isLoading={isLoading} text={selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.text} onPress={handleSingleOptionPress} large={buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.LARGE} medium={buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM} small={buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.SMALL} innerStyles={[innerStyleDropButton, shouldShowButtonRightIcon && styles.dropDownButtonCartIconView]} iconRightStyles={shouldShowButtonRightIcon && styles.ml2} enterKeyEventListenerPriority={enterKeyEventListenerPriority} secondLineText={secondLineText} icon={shouldUseOptionIcon && !shouldShowButtonRightIcon ? (_f = options.at(0)) === null || _f === void 0 ? void 0 : _f.icon : icon} iconRight={shouldShowButtonRightIcon ? (_g = options.at(0)) === null || _g === void 0 ? void 0 : _g.icon : undefined} shouldShowRightIcon={shouldShowButtonRightIcon} testID={testID}/>)}
            {(shouldAlwaysShowDropdownMenu || options.length > 1) && !!popoverAnchorPosition && (<PopoverMenu_1.default isVisible={isMenuVisible} onClose={function () {
                setIsMenuVisible(false);
                onOptionsMenuHide === null || onOptionsMenuHide === void 0 ? void 0 : onOptionsMenuHide();
            }} onModalShow={onOptionsMenuShow} onItemSelected={function (selectedSubitem, index, event) {
                onSubItemSelected === null || onSubItemSelected === void 0 ? void 0 : onSubItemSelected(selectedSubitem, index, event);
                if (selectedSubitem.shouldCloseModalOnSelect !== false) {
                    setIsMenuVisible(false);
                }
            }} anchorPosition={popoverAnchorPosition} shouldShowSelectedItemCheck={shouldShowSelectedItemCheck} 
        // eslint-disable-next-line react-compiler/react-compiler
        anchorRef={nullCheckRef(dropdownAnchor)} scrollContainerStyle={!shouldUseModalPaddingStyle && isSmallScreenWidth && __assign(__assign({}, styles.pt4), { paddingBottom: paddingBottom })} anchorAlignment={anchorAlignment} shouldUseModalPaddingStyle={shouldUseModalPaddingStyle} headerText={menuHeaderText} shouldUseScrollView={shouldPopoverUseScrollView} containerStyles={containerStyles} menuItems={options.map(function (item, index) {
                var _a;
                return (__assign(__assign({}, item), { onSelected: item.onSelected
                        ? function () {
                            var _a;
                            (_a = item.onSelected) === null || _a === void 0 ? void 0 : _a.call(item);
                            if (item.shouldUpdateSelectedIndex) {
                                setSelectedItemIndex(index);
                            }
                        }
                        : function () {
                            onOptionSelected === null || onOptionSelected === void 0 ? void 0 : onOptionSelected(item);
                            if (item.shouldUpdateSelectedIndex === false) {
                                return;
                            }
                            setSelectedItemIndex(index);
                        }, shouldCallAfterModalHide: true, subMenuItems: (_a = item.subMenuItems) === null || _a === void 0 ? void 0 : _a.map(function (subItem) { return (__assign(__assign({}, subItem), { shouldCallAfterModalHide: true })); }) }));
            })}/>)}
        </react_native_1.View>);
}
ButtonWithDropdownMenuInner.displayName = 'ButtonWithDropdownMenu';
var ButtonWithDropdownMenu = ButtonWithDropdownMenuInner;
exports.default = ButtonWithDropdownMenu;
