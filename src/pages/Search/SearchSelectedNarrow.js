"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const PopoverMenu_1 = require("@components/PopoverMenu");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Expensicons = require("@src/components/Icon/Expensicons");
const CONST_1 = require("@src/CONST");
function SearchSelectedNarrow({ options, itemsLength }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    // Stores an option to execute after modal closes when using deferred execution
    const selectedOptionRef = (0, react_1.useRef)(null);
    const [isModalVisible, setIsModalVisible] = (0, react_1.useState)(false);
    const buttonRef = (0, react_1.useRef)(null);
    const openMenu = () => setIsModalVisible(true);
    const closeMenu = () => setIsModalVisible(false);
    const handleOnModalHide = () => {
        if (!selectedOptionRef.current) {
            return;
        }
        selectedOptionRef.current.onSelected?.();
        selectedOptionRef.current = null;
    };
    const handleOnMenuItemPress = (option) => {
        if (option?.shouldCloseModalOnSelect) {
            selectedOptionRef.current = option;
            closeMenu();
            return;
        }
        option?.onSelected?.();
    };
    const handleOnCloseMenu = () => {
        selectedOptionRef.current = null;
        closeMenu();
    };
    return (<react_native_1.View style={[styles.pb3]}>
            <Button_1.default onPress={openMenu} ref={buttonRef} style={[styles.w100, styles.ph5]} text={translate('workspace.common.selected', { count: itemsLength })} isContentCentered iconRight={Expensicons.DownArrow} isDisabled={options.length === 0} shouldShowRightIcon={options.length !== 0} success/>
            <PopoverMenu_1.default isVisible={isModalVisible} onClose={handleOnCloseMenu} onModalHide={handleOnModalHide} onItemSelected={(selectedItem) => {
            handleOnMenuItemPress(selectedItem);
        }} anchorPosition={{ horizontal: 0, vertical: 0 }} anchorRef={buttonRef} anchorAlignment={{
            horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
            vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
        }} fromSidebarMediumScreen={false} shouldUseModalPaddingStyle menuItems={options}/>
        </react_native_1.View>);
}
SearchSelectedNarrow.displayName = 'SearchSelectedNarrow';
exports.default = SearchSelectedNarrow;
