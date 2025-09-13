"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const searchOptions_1 = require("@libs/searchOptions");
const StringUtils_1 = require("@libs/StringUtils");
const BankAccounts_1 = require("@userActions/BankAccounts");
const Text_1 = require("@src/components/Text");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function CountrySelection({ isEditing, onNext, formValues, resetScreenIndex, fieldsMap }) {
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [searchValue, debouncedSearchValue, setSearchValue] = (0, useDebouncedState_1.default)('');
    const [currentCountry, setCurrentCountry] = (0, react_1.useState)(formValues.bankCountry);
    const [isUserValidated] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: (account) => account?.validated, canBeMissing: false });
    const onCountrySelected = (0, react_1.useCallback)(() => {
        if (currentCountry === CONST_1.default.COUNTRY.US) {
            if (isUserValidated) {
                Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_ADD_US_BANK_ACCOUNT);
            }
            else {
                Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_CONTACT_METHOD_VERIFY_ACCOUNT.getRoute(Navigation_1.default.getActiveRoute(), ROUTES_1.default.SETTINGS_ADD_US_BANK_ACCOUNT));
            }
            return;
        }
        if (!(0, EmptyObject_1.isEmptyObject)(fieldsMap) && formValues.bankCountry === currentCountry) {
            onNext();
            return;
        }
        (0, BankAccounts_1.fetchCorpayFields)(currentCountry);
        resetScreenIndex?.(CONST_1.default.CORPAY_FIELDS.INDEXES.MAPPING.BANK_ACCOUNT_DETAILS);
    }, [currentCountry, fieldsMap, formValues.bankCountry, resetScreenIndex, isUserValidated, onNext]);
    const onSelectionChange = (0, react_1.useCallback)((country) => {
        setCurrentCountry(country.value);
    }, []);
    const countries = (0, react_1.useMemo)(() => Object.keys(CONST_1.default.ALL_COUNTRIES)
        .filter((countryISO) => !CONST_1.default.CORPAY_FIELDS.EXCLUDED_COUNTRIES.includes(countryISO))
        .map((countryISO) => {
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
    return (<FullPageOfflineBlockingView_1.default>
            <react_native_1.View style={styles.ph5}>
                <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb6]}>{translate('addPersonalBankAccount.countrySelectionStepHeader')}</Text_1.default>
            </react_native_1.View>
            <SelectionList_1.default headerMessage={headerMessage} sections={[{ data: searchResults }]} textInputValue={searchValue} textInputLabel={translate('common.search')} onChangeText={setSearchValue} onSelectRow={onSelectionChange} onConfirm={onCountrySelected} ListItem={RadioListItem_1.default} initiallyFocusedOptionKey={currentCountry} shouldSingleExecuteRowSelect shouldStopPropagation shouldUseDynamicMaxToRenderPerBatch showConfirmButton confirmButtonText={isEditing ? translate('common.confirm') : translate('common.next')} isConfirmButtonDisabled={isOffline} shouldUpdateFocusedIndex/>
        </FullPageOfflineBlockingView_1.default>);
}
CountrySelection.displayName = 'CountrySelection';
exports.default = CountrySelection;
