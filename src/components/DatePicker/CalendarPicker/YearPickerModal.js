"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Modal_1 = require("@components/Modal");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function YearPickerModal({ isVisible, years, currentYear = new Date().getFullYear(), onYearChange, onClose }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [searchText, setSearchText] = (0, react_1.useState)('');
    const { sections, headerMessage } = (0, react_1.useMemo)(() => {
        const yearsList = searchText === '' ? years : years.filter((year) => year.text?.includes(searchText));
        return {
            headerMessage: !yearsList.length ? translate('common.noResultsFound') : '',
            sections: [{ data: yearsList.sort((a, b) => b.value - a.value), indexOffset: 0 }],
        };
    }, [years, searchText, translate]);
    (0, react_1.useEffect)(() => {
        if (isVisible) {
            return;
        }
        setSearchText('');
    }, [isVisible]);
    return (<Modal_1.default type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} isVisible={isVisible} onClose={() => onClose?.()} onModalHide={onClose} shouldHandleNavigationBack shouldUseCustomBackdrop onBackdropPress={onClose} enableEdgeToEdgeBottomSafeAreaPadding>
            <ScreenWrapper_1.default style={[styles.pb0]} includePaddingTop={false} enableEdgeToEdgeBottomSafeAreaPadding testID={YearPickerModal.displayName}>
                <HeaderWithBackButton_1.default title={translate('yearPickerPage.year')} onBackButtonPress={onClose}/>
                <SelectionList_1.default textInputLabel={translate('yearPickerPage.selectYear')} textInputValue={searchText} textInputMaxLength={4} onChangeText={(text) => setSearchText(text.replace(CONST_1.default.REGEX.NON_NUMERIC, '').trim())} inputMode={CONST_1.default.INPUT_MODE.NUMERIC} headerMessage={headerMessage} sections={sections} onSelectRow={(option) => {
            react_native_1.Keyboard.dismiss();
            onYearChange?.(option.value);
        }} initiallyFocusedOptionKey={currentYear.toString()} showScrollIndicator shouldStopPropagation shouldUseDynamicMaxToRenderPerBatch ListItem={RadioListItem_1.default} addBottomSafeAreaPadding/>
            </ScreenWrapper_1.default>
        </Modal_1.default>);
}
YearPickerModal.displayName = 'YearPickerModal';
exports.default = YearPickerModal;
