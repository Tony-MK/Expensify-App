"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const BankAccountUtils_1 = require("@libs/BankAccountUtils");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const Url_1 = require("@libs/Url");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const Navigation_1 = require("@navigation/Navigation");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const MoneyRequestCompanyInfoForm_1 = require("@src/types/form/MoneyRequestCompanyInfoForm");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepCompanyInfo({ route, report, transaction }) {
    const { backTo } = route.params;
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const defaultWebsiteExample = (0, react_1.useMemo)(() => (0, BankAccountUtils_1.getDefaultCompanyWebsite)(session, account), [session, account]);
    const policyID = (0, IOU_1.getIOURequestPolicyID)(transaction, report);
    const policy = (0, usePolicy_1.default)(policyID);
    const [policyRecentlyUsedCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_CATEGORIES}${policyID}`, { canBeMissing: true });
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`, { canBeMissing: true });
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`, { canBeMissing: true });
    const formattedAmount = (0, CurrencyUtils_1.convertToDisplayString)(Math.abs(transaction?.amount ?? 0), transaction?.currency);
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [MoneyRequestCompanyInfoForm_1.default.COMPANY_NAME, MoneyRequestCompanyInfoForm_1.default.COMPANY_WEBSITE]);
        if (values.companyWebsite) {
            const companyWebsite = expensify_common_1.Str.sanitizeURL(values.companyWebsite, CONST_1.default.COMPANY_WEBSITE_DEFAULT_SCHEME);
            if (!(0, ValidationUtils_1.isValidWebsite)(companyWebsite)) {
                errors.companyWebsite = translate('bankAccount.error.website');
            }
            else {
                const domain = (0, Url_1.extractUrlDomain)(companyWebsite);
                if (!domain || !expensify_common_1.Str.isValidDomainName(domain)) {
                    errors.companyWebsite = translate('iou.invalidDomainError');
                }
                else if ((0, ValidationUtils_1.isPublicDomain)(domain)) {
                    errors.companyWebsite = translate('iou.publicDomainError');
                }
            }
        }
        return errors;
    }, [translate]);
    const submit = (values) => {
        const companyWebsite = expensify_common_1.Str.sanitizeURL(values.companyWebsite, CONST_1.default.COMPANY_WEBSITE_DEFAULT_SCHEME);
        (0, IOU_1.sendInvoice)(currentUserPersonalDetails.accountID, transaction, report, undefined, policy, policyTags, policyCategories, values.companyName, companyWebsite, policyRecentlyUsedCategories);
    };
    return (<StepScreenWrapper_1.default headerTitle={translate('iou.companyInfo')} onBackButtonPress={() => Navigation_1.default.goBack(backTo)} shouldShowWrapper testID={IOURequestStepCompanyInfo.displayName}>
            <Text_1.default style={[styles.textNormalThemeText, styles.ph5]}>{translate('iou.companyInfoDescription')}</Text_1.default>
            <FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.MONEY_REQUEST_COMPANY_INFO_FORM} onSubmit={submit} validate={validate} submitButtonText={translate('iou.sendInvoice', { amount: formattedAmount })} enabledWhenOffline>
                <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={MoneyRequestCompanyInfoForm_1.default.COMPANY_NAME} name={MoneyRequestCompanyInfoForm_1.default.COMPANY_NAME} label={translate('iou.yourCompanyName')} accessibilityLabel={translate('iou.yourCompanyName')} role={CONST_1.default.ROLE.PRESENTATION} ref={inputCallbackRef} containerStyles={styles.mv4}/>
                <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={MoneyRequestCompanyInfoForm_1.default.COMPANY_WEBSITE} name={MoneyRequestCompanyInfoForm_1.default.COMPANY_WEBSITE} inputMode={CONST_1.default.INPUT_MODE.URL} label={translate('iou.yourCompanyWebsite')} accessibilityLabel={translate('iou.yourCompanyWebsite')} role={CONST_1.default.ROLE.PRESENTATION} hint={translate('iou.yourCompanyWebsiteNote')} defaultValue={defaultWebsiteExample}/>
            </FormProvider_1.default>
        </StepScreenWrapper_1.default>);
}
IOURequestStepCompanyInfo.displayName = 'IOURequestStepCompanyInfo';
exports.default = (0, withWritableReportOrNotFound_1.default)((0, withFullTransactionOrNotFound_1.default)(IOURequestStepCompanyInfo));
