"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AmountWithoutCurrencyInput_1 = require("@components/AmountWithoutCurrencyInput");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Search_1 = require("@libs/actions/Search");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function SearchFiltersAmountBase({ title, filterKey, testID }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const [searchAdvancedFiltersForm] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: false });
    const greaterThan = searchAdvancedFiltersForm?.[`${filterKey}${CONST_1.default.SEARCH.AMOUNT_MODIFIERS.GREATER_THAN}`];
    const greaterThanFormattedAmount = greaterThan ? (0, CurrencyUtils_1.convertToFrontendAmountAsString)(Number(greaterThan)) : undefined;
    const lessThan = searchAdvancedFiltersForm?.[`${filterKey}${CONST_1.default.SEARCH.AMOUNT_MODIFIERS.LESS_THAN}`];
    const lessThanFormattedAmount = lessThan ? (0, CurrencyUtils_1.convertToFrontendAmountAsString)(Number(lessThan)) : undefined;
    const updateAmountFilter = (values) => {
        const greater = values[`${filterKey}${CONST_1.default.SEARCH.AMOUNT_MODIFIERS.GREATER_THAN}`];
        const greaterThanBackendAmount = greater ? (0, CurrencyUtils_1.convertToBackendAmount)(Number(greater)) : '';
        const less = values[`${filterKey}${CONST_1.default.SEARCH.AMOUNT_MODIFIERS.LESS_THAN}`];
        const lessThanBackendAmount = less ? (0, CurrencyUtils_1.convertToBackendAmount)(Number(less)) : '';
        (0, Search_1.updateAdvancedFilters)({
            [`${filterKey}${CONST_1.default.SEARCH.AMOUNT_MODIFIERS.GREATER_THAN}`]: greaterThanBackendAmount?.toString(),
            [`${filterKey}${CONST_1.default.SEARCH.AMOUNT_MODIFIERS.LESS_THAN}`]: lessThanBackendAmount?.toString(),
        });
        Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
    };
    return (<ScreenWrapper_1.default testID={testID} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} includeSafeAreaPaddingBottom shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate(title)} onBackButtonPress={() => {
            Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
        }}/>
            <FormProvider_1.default style={[styles.flex1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM} onSubmit={updateAmountFilter} submitButtonText={translate('common.save')} enabledWhenOffline>
                <react_native_1.View style={styles.mb5}>
                    <InputWrapper_1.default InputComponent={AmountWithoutCurrencyInput_1.default} inputID={`${filterKey}${CONST_1.default.SEARCH.AMOUNT_MODIFIERS.GREATER_THAN}`} name={`${filterKey}${CONST_1.default.SEARCH.AMOUNT_MODIFIERS.GREATER_THAN}`} defaultValue={greaterThanFormattedAmount} label={translate('search.filters.amount.greaterThan')} accessibilityLabel={translate('search.filters.amount.greaterThan')} role={CONST_1.default.ROLE.PRESENTATION} ref={inputCallbackRef} inputMode={CONST_1.default.INPUT_MODE.DECIMAL} uncontrolled/>
                </react_native_1.View>
                <react_native_1.View style={styles.mb5}>
                    <InputWrapper_1.default InputComponent={AmountWithoutCurrencyInput_1.default} inputID={`${filterKey}${CONST_1.default.SEARCH.AMOUNT_MODIFIERS.LESS_THAN}`} name={`${filterKey}${CONST_1.default.SEARCH.AMOUNT_MODIFIERS.LESS_THAN}`} defaultValue={lessThanFormattedAmount} label={translate('search.filters.amount.lessThan')} accessibilityLabel={translate('search.filters.amount.lessThan')} role={CONST_1.default.ROLE.PRESENTATION} inputMode={CONST_1.default.INPUT_MODE.DECIMAL} uncontrolled/>
                </react_native_1.View>
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
SearchFiltersAmountBase.displayName = 'SearchFiltersAmountBase';
exports.default = SearchFiltersAmountBase;
