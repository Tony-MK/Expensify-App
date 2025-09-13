"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const searchOptions_1 = require("@libs/searchOptions");
const StringUtils_1 = require("@libs/StringUtils");
const Url_1 = require("@libs/Url");
const CONST_1 = require("@src/CONST");
function CountrySelectionPage({ route }) {
    const [searchValue, setSearchValue] = (0, react_1.useState)('');
    const { translate } = (0, useLocalize_1.default)();
    const currentCountry = route.params.country;
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
    const searchResults = (0, searchOptions_1.default)(searchValue, countries);
    const headerMessage = searchValue.trim() && !searchResults.length ? translate('common.noResultsFound') : '';
    const selectCountry = (0, react_1.useCallback)((option) => {
        const backTo = route.params.backTo ?? '';
        // Check the "backTo" parameter to decide navigation behavior
        if (!backTo) {
            Navigation_1.default.goBack();
        }
        else {
            // Set compareParams to false because we want to go back to this particular screen and update params (country).
            Navigation_1.default.goBack((0, Url_1.appendParam)(backTo, 'country', option.value), { compareParams: false });
        }
    }, [route]);
    return (<ScreenWrapper_1.default testID={CountrySelectionPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
            <HeaderWithBackButton_1.default title={translate('common.country')} shouldShowBackButton onBackButtonPress={() => {
            const backTo = route.params.backTo ?? '';
            const backToRoute = backTo ? `${backTo}?country=${currentCountry}` : '';
            Navigation_1.default.goBack(backToRoute, { compareParams: false });
        }}/>

            <SelectionList_1.default headerMessage={headerMessage} textInputLabel={translate('common.country')} textInputValue={searchValue} sections={[{ data: searchResults }]} ListItem={RadioListItem_1.default} onSelectRow={selectCountry} shouldSingleExecuteRowSelect onChangeText={setSearchValue} initiallyFocusedOptionKey={currentCountry} shouldUseDynamicMaxToRenderPerBatch addBottomSafeAreaPadding/>
        </ScreenWrapper_1.default>);
}
CountrySelectionPage.displayName = 'CountrySelectionPage';
exports.default = CountrySelectionPage;
