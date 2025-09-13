"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Modal_1 = require("@components/Modal");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const searchOptions_1 = require("@libs/searchOptions");
const StringUtils_1 = require("@libs/StringUtils");
const CONST_1 = require("@src/CONST");
function CountrySelectorModal({ isVisible, currentCountry, onCountrySelected, onClose, label, onBackdropPress }) {
    const { translate } = (0, useLocalize_1.default)();
    const [searchValue, debouncedSearchValue, setSearchValue] = (0, useDebouncedState_1.default)('');
    const countries = (0, react_1.useMemo)(() => Object.keys(CONST_1.default.ALL_COUNTRIES).map((countryISO) => {
        const countryName = translate(`allCountries.${countryISO}`);
        return {
            value: countryISO,
            keyForList: countryISO,
            text: countryName,
            isSelected: currentCountry === countryISO,
            searchValue: StringUtils_1.default.sanitizeString(`${countryISO}${countryName}`),
        };
    }), [translate, currentCountry]);
    const searchResults = (0, searchOptions_1.default)(debouncedSearchValue, countries);
    const headerMessage = debouncedSearchValue.trim() && !searchResults.length ? translate('common.noResultsFound') : '';
    const styles = (0, useThemeStyles_1.default)();
    return (<Modal_1.default type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} isVisible={isVisible} onClose={onClose} onModalHide={onClose} onBackdropPress={onBackdropPress}>
            <ScreenWrapper_1.default style={[styles.pb0]} includePaddingTop={false} includeSafeAreaPaddingBottom={false} testID={CountrySelectorModal.displayName}>
                <HeaderWithBackButton_1.default title={label} shouldShowBackButton onBackButtonPress={onClose}/>
                <SelectionList_1.default headerMessage={headerMessage} sections={[{ data: searchResults }]} textInputValue={searchValue} textInputLabel={translate('common.search')} onChangeText={setSearchValue} onSelectRow={onCountrySelected} ListItem={RadioListItem_1.default} initiallyFocusedOptionKey={currentCountry} shouldSingleExecuteRowSelect shouldStopPropagation shouldUseDynamicMaxToRenderPerBatch/>
            </ScreenWrapper_1.default>
        </Modal_1.default>);
}
CountrySelectorModal.displayName = 'CountrySelectorModal';
exports.default = CountrySelectorModal;
