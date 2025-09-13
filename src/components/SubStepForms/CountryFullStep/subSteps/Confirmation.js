"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const PushRowWithModal_1 = require("@components/PushRowWithModal");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useExpensifyCardUkEuSupported_1 = require("@hooks/useExpensifyCardUkEuSupported");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const mapCurrencyToCountry_1 = require("@libs/mapCurrencyToCountry");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const getAvailableEuCountries_1 = require("@pages/ReimbursementAccount/utils/getAvailableEuCountries");
const FormActions_1 = require("@userActions/FormActions");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const { COUNTRY } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA;
function Confirmation({ onNext, policyID, isComingFromExpensifyCard }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: true });
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: true });
    const currency = policy?.outputCurrency ?? '';
    const shouldAllowChange = currency === CONST_1.default.CURRENCY.EUR;
    const defaultCountries = shouldAllowChange ? CONST_1.default.ALL_EUROPEAN_UNION_COUNTRIES : CONST_1.default.ALL_COUNTRIES;
    const currencyMappedToCountry = (0, mapCurrencyToCountry_1.default)(currency);
    const isUkEuCurrencySupported = (0, useExpensifyCardUkEuSupported_1.default)(policyID) && isComingFromExpensifyCard;
    const countriesSupportedForExpensifyCard = (0, getAvailableEuCountries_1.default)();
    const countryDefaultValue = reimbursementAccountDraft?.[COUNTRY] ?? reimbursementAccount?.achData?.[COUNTRY] ?? '';
    const [selectedCountry, setSelectedCountry] = (0, react_1.useState)(countryDefaultValue);
    const disableSubmit = !(currency in CONST_1.default.CURRENCY);
    const handleSettingsPress = () => {
        if (!policyID) {
            return;
        }
        (0, Policy_1.setIsComingFromGlobalReimbursementsFlow)(true);
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_OVERVIEW.getRoute(policyID), { forceReplace: !isSmallScreenWidth });
    };
    const handleSubmit = () => {
        (0, FormActions_1.setDraftValues)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM, { [COUNTRY]: selectedCountry });
        onNext();
    };
    const validate = (0, react_1.useCallback)((values) => {
        return (0, ValidationUtils_1.getFieldRequiredErrors)(values, [COUNTRY]);
    }, []);
    (0, react_1.useEffect)(() => {
        (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM);
    });
    (0, react_1.useEffect)(() => {
        if (currency === CONST_1.default.CURRENCY.EUR) {
            return;
        }
        setSelectedCountry(currencyMappedToCountry);
    }, [currency, currencyMappedToCountry]);
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} submitButtonText={translate('common.confirm')} validate={validate} onSubmit={handleSubmit} style={[styles.flexGrow1]} submitButtonStyles={[styles.mh5, styles.pb0]} isSubmitDisabled={disableSubmit} shouldHideFixErrorsAlert>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mb3]}>{translate('countryStep.confirmBusinessBank')}</Text_1.default>
            <MenuItemWithTopDescription_1.default description={translate('common.currency')} title={currency} interactive={false}/>
            <react_native_1.View style={styles.ph5}>
                <Text_1.default style={[styles.mb3, styles.mutedTextLabel]}>
                    {`${translate('countryStep.yourBusiness')} ${translate('countryStep.youCanChange')}`}{' '}
                    <TextLink_1.default style={[styles.label]} onPress={handleSettingsPress}>
                        {translate('common.settings').toLowerCase()}
                    </TextLink_1.default>
                    .
                </Text_1.default>
            </react_native_1.View>
            <InputWrapper_1.default InputComponent={PushRowWithModal_1.default} optionsList={isUkEuCurrencySupported ? countriesSupportedForExpensifyCard : defaultCountries} onValueChange={(value) => setSelectedCountry(value)} description={translate('common.country')} modalHeaderTitle={translate('countryStep.selectCountry')} searchInputTitle={translate('countryStep.findCountry')} shouldAllowChange={shouldAllowChange} value={selectedCountry} inputID={COUNTRY} shouldSaveDraft={false}/>
        </FormProvider_1.default>);
}
Confirmation.displayName = 'Confirmation';
exports.default = Confirmation;
