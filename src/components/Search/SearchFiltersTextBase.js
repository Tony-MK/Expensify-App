"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Search_1 = require("@libs/actions/Search");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function SearchFiltersTextBase({ filterKey, titleKey, testID, characterLimit = CONST_1.default.MERCHANT_NAME_MAX_BYTES }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [searchAdvancedFiltersForm] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: false });
    const currentValue = searchAdvancedFiltersForm?.[filterKey] ?? '';
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const updateFilter = (values) => {
        (0, Search_1.updateAdvancedFilters)(values);
        Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
    };
    const validate = (values) => {
        const errors = {};
        const fieldValue = values[filterKey] ?? '';
        const trimmedValue = fieldValue.trim();
        const { isValid, byteLength } = (0, ValidationUtils_1.isValidInputLength)(trimmedValue, characterLimit);
        if (!isValid) {
            errors[filterKey] = translate('common.error.characterLimitExceedCounter', { length: byteLength, limit: characterLimit });
        }
        return errors;
    };
    return (<ScreenWrapper_1.default testID={testID} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} includeSafeAreaPaddingBottom shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate(titleKey)} onBackButtonPress={() => {
            Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
        }}/>
            <FormProvider_1.default style={[styles.flex1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM} validate={validate} onSubmit={updateFilter} submitButtonText={translate('common.save')} enabledWhenOffline shouldHideFixErrorsAlert>
                <react_native_1.View style={styles.mb5}>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={filterKey} name={filterKey} defaultValue={currentValue} label={translate(titleKey)} accessibilityLabel={translate(titleKey)} role={CONST_1.default.ROLE.PRESENTATION} ref={inputCallbackRef}/>
                </react_native_1.View>
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
SearchFiltersTextBase.displayName = 'SearchFiltersTextBase';
exports.default = SearchFiltersTextBase;
