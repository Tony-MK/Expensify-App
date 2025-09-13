"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const searchOptions_1 = require("@libs/searchOptions");
const StringUtils_1 = require("@libs/StringUtils");
const Navigation_1 = require("@navigation/Navigation");
const CompanyCards_1 = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function SelectCountryStep({ policyID }) {
    const { translate } = (0, useLocalize_1.default)();
    const route = (0, native_1.useRoute)();
    const styles = (0, useThemeStyles_1.default)();
    const policy = (0, usePolicy_1.default)(policyID);
    const [currencyList = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENCY_LIST, { canBeMissing: true });
    const [countryByIp] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY, { canBeMissing: false });
    const [addNewCard] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ADD_NEW_COMPANY_CARD, { canBeMissing: true });
    const [searchValue, debouncedSearchValue, setSearchValue] = (0, useDebouncedState_1.default)('');
    const getCountry = (0, react_1.useCallback)(() => {
        if (addNewCard?.data?.selectedCountry) {
            return addNewCard.data.selectedCountry;
        }
        return (0, CardUtils_1.getPlaidCountry)(policy?.outputCurrency, currencyList, countryByIp);
    }, [addNewCard?.data.selectedCountry, countryByIp, currencyList, policy?.outputCurrency]);
    const [currentCountry, setCurrentCountry] = (0, react_1.useState)(getCountry);
    const [hasError, setHasError] = (0, react_1.useState)(false);
    const doesCountrySupportPlaid = (0, CardUtils_1.isPlaidSupportedCountry)(currentCountry);
    const submit = () => {
        if (!currentCountry) {
            setHasError(true);
        }
        else {
            if (addNewCard?.data.selectedCountry !== currentCountry) {
                (0, CompanyCards_1.clearAddNewCardFlow)();
            }
            (0, CompanyCards_1.setAddNewCompanyCardStepAndData)({
                step: doesCountrySupportPlaid ? CONST_1.default.COMPANY_CARDS.STEP.SELECT_FEED_TYPE : CONST_1.default.COMPANY_CARDS.STEP.CARD_TYPE,
                data: {
                    selectedCountry: currentCountry,
                    selectedFeedType: doesCountrySupportPlaid ? CONST_1.default.COMPANY_CARDS.FEED_TYPE.DIRECT : CONST_1.default.COMPANY_CARDS.FEED_TYPE.CUSTOM,
                },
                isEditing: false,
            });
        }
    };
    (0, react_1.useEffect)(() => {
        setCurrentCountry(getCountry());
    }, [getCountry]);
    const handleBackButtonPress = () => {
        if (route?.params?.backTo) {
            Navigation_1.default.navigate(route.params.backTo);
            return;
        }
        Navigation_1.default.goBack();
    };
    const onSelectionChange = (0, react_1.useCallback)((country) => {
        setCurrentCountry(country.value);
    }, []);
    const countries = (0, react_1.useMemo)(() => Object.keys(CONST_1.default.ALL_COUNTRIES)
        .filter((countryISO) => !CONST_1.default.PLAID_EXCLUDED_COUNTRIES.includes(countryISO))
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
    return (<ScreenWrapper_1.default testID={SelectCountryStep.displayName} enableEdgeToEdgeBottomSafeAreaPadding shouldEnablePickerAvoiding={false} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('workspace.companyCards.addCards')} onBackButtonPress={handleBackButtonPress}/>

            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mv3]}>{translate('workspace.companyCards.addNewCard.whereIsYourBankLocated')}</Text_1.default>
            <SelectionList_1.default headerMessage={headerMessage} sections={[{ data: searchResults }]} textInputValue={searchValue} textInputLabel={translate('common.search')} onChangeText={setSearchValue} onSelectRow={onSelectionChange} onConfirm={submit} ListItem={RadioListItem_1.default} initiallyFocusedOptionKey={currentCountry} shouldSingleExecuteRowSelect shouldStopPropagation shouldUseDynamicMaxToRenderPerBatch showConfirmButton addBottomSafeAreaPadding confirmButtonText={translate('common.next')} shouldUpdateFocusedIndex>
                {hasError && (<react_native_1.View style={[styles.ph3, styles.mb3]}>
                        <FormHelpMessage_1.default isError={hasError} message={translate('workspace.companyCards.addNewCard.error.pleaseSelectCountry')}/>
                    </react_native_1.View>)}
            </SelectionList_1.default>
        </ScreenWrapper_1.default>);
}
SelectCountryStep.displayName = 'SelectCountryStep';
exports.default = SelectCountryStep;
