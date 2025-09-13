"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Button_1 = require("@components/Button");
var PopoverMenu_1 = require("@components/PopoverMenu");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Expensicons = require("@src/components/Icon/Expensicons");
var CONST_1 = require("@src/CONST");
function SearchSelectedNarrow(_a) {
    var options = _a.options, itemsLength = _a.itemsLength;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    // Stores an option to execute after modal closes when using deferred execution
    var selectedOptionRef = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)(false), isModalVisible = _b[0], setIsModalVisible = _b[1];
    var buttonRef = (0, react_1.useRef)(null);
    var openMenu = function () { return setIsModalVisible(true); };
    var closeMenu = function () { return setIsModalVisible(false); };
    var handleOnModalHide = function () {
        var _a, _b;
        if (!selectedOptionRef.current) {
            return;
        }
        (_b = (_a = selectedOptionRef.current).onSelected) === null || _b === void 0 ? void 0 : _b.call(_a);
        selectedOptionRef.current = null;
    };
    var handleOnMenuItemPress = function (option) {
        var _a;
        if (option === null || option === void 0 ? void 0 : option.shouldCloseModalOnSelect) {
            selectedOptionRef.current = option;
            closeMenu();
            return;
        }
        (_a = option === null || option === void 0 ? void 0 : option.onSelected) === null || _a === void 0 ? void 0 : _a.call(option);
    };
    var handleOnCloseMenu = function () {
        selectedOptionRef.current = null;
        closeMenu();
    };
    return (<react_native_1.View style={[styles.pb3]}>
            <Button_1.default onPress={openMenu} ref={buttonRef} style={[styles.w100, styles.ph5]} text={translate('workspace.common.selected', { count: itemsLength })} isContentCentered iconRight={Expensicons.DownArrow} isDisabled={options.length === 0} shouldShowRightIcon={options.length !== 0} success/>
            <PopoverMenu_1.default isVisible={isModalVisible} onClose={handleOnCloseMenu} onModalHide={handleOnModalHide} onItemSelected={function (selectedItem) {
            handleOnMenuItemPress(selectedItem);
        }} anchorPosition={{ horizontal: 0, vertical: 0 }} anchorRef={buttonRef} anchorAlignment={{
            horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
            vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
        }} fromSidebarMediumScreen={false} shouldUseModalPaddingStyle menuItems={options}/>
        </react_native_1.View>);
}
SearchSelectedNarrow.displayName = 'SearchSelectedNarrow';
exports.default = SearchSelectedNarrow;
