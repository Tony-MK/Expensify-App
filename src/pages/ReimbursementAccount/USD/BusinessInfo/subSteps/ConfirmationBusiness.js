"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CheckboxWithLabel_1 = require("@components/CheckboxWithLabel");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const getSubStepValues_1 = require("@pages/ReimbursementAccount/utils/getSubStepValues");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const BUSINESS_INFO_STEP_KEYS = ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP;
const BUSINESS_INFO_STEP_INDEXES = CONST_1.default.REIMBURSEMENT_ACCOUNT.SUBSTEP_INDEX.BUSINESS_INFO;
function ConfirmCompanyLabel() {
    const { translate } = (0, useLocalize_1.default)();
    return (<Text_1.default>
            {`${translate('businessInfoStep.confirmCompanyIsNot')} `}
            <TextLink_1.default href={CONST_1.default.LIST_OF_RESTRICTED_BUSINESSES}>{`${translate('businessInfoStep.listOfRestrictedBusinesses')}.`}</TextLink_1.default>
        </Text_1.default>);
}
function ConfirmationBusiness({ onNext, onMove }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT);
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [BUSINESS_INFO_STEP_KEYS.HAS_NO_CONNECTION_TO_CANNABIS]);
        if (!values.hasNoConnectionToCannabis) {
            errors.hasNoConnectionToCannabis = translate('bankAccount.error.restrictedBusiness');
        }
        return errors;
    }, [translate]);
    const values = (0, react_1.useMemo)(() => (0, getSubStepValues_1.default)(BUSINESS_INFO_STEP_KEYS, reimbursementAccountDraft, reimbursementAccount), [reimbursementAccount, reimbursementAccountDraft]);
    const defaultCheckboxState = reimbursementAccountDraft?.[BUSINESS_INFO_STEP_KEYS.HAS_NO_CONNECTION_TO_CANNABIS] ?? false;
    return (<ScrollView_1.default contentContainerStyle={styles.flexGrow1}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mb3]}>{translate('businessInfoStep.letsDoubleCheck')}</Text_1.default>
            <MenuItemWithTopDescription_1.default description={translate('businessInfoStep.businessName')} title={values[BUSINESS_INFO_STEP_KEYS.COMPANY_NAME]} shouldShowRightIcon onPress={() => {
            onMove(BUSINESS_INFO_STEP_INDEXES.BUSINESS_NAME);
        }}/>
            <MenuItemWithTopDescription_1.default description={translate('businessInfoStep.taxIDNumber')} title={values[BUSINESS_INFO_STEP_KEYS.COMPANY_TAX_ID]} shouldShowRightIcon onPress={() => {
            onMove(BUSINESS_INFO_STEP_INDEXES.TAX_ID_NUMBER);
        }}/>
            <MenuItemWithTopDescription_1.default description={translate('common.companyAddress')} title={`${values[BUSINESS_INFO_STEP_KEYS.STREET]}, ${values[BUSINESS_INFO_STEP_KEYS.CITY]}, ${values[BUSINESS_INFO_STEP_KEYS.STATE]} ${values[BUSINESS_INFO_STEP_KEYS.ZIP_CODE]}`} shouldShowRightIcon onPress={() => {
            onMove(BUSINESS_INFO_STEP_INDEXES.COMPANY_ADDRESS);
        }}/>
            <MenuItemWithTopDescription_1.default description={translate('common.phoneNumber')} title={values[BUSINESS_INFO_STEP_KEYS.COMPANY_PHONE]} shouldShowRightIcon onPress={() => {
            onMove(BUSINESS_INFO_STEP_INDEXES.PHONE_NUMBER);
        }}/>
            <MenuItemWithTopDescription_1.default description={translate('businessInfoStep.companyWebsite')} title={values[BUSINESS_INFO_STEP_KEYS.COMPANY_WEBSITE]} shouldShowRightIcon onPress={() => {
            onMove(BUSINESS_INFO_STEP_INDEXES.COMPANY_WEBSITE);
        }}/>
            <MenuItemWithTopDescription_1.default description={translate('businessInfoStep.companyType')} title={translate(`businessInfoStep.incorporationType.${values[BUSINESS_INFO_STEP_KEYS.INCORPORATION_TYPE]}`)} shouldShowRightIcon onPress={() => {
            onMove(BUSINESS_INFO_STEP_INDEXES.COMPANY_TYPE);
        }}/>
            <MenuItemWithTopDescription_1.default description={translate('businessInfoStep.incorporationDate')} title={values[BUSINESS_INFO_STEP_KEYS.INCORPORATION_DATE]} shouldShowRightIcon onPress={() => {
            onMove(BUSINESS_INFO_STEP_INDEXES.INCORPORATION_DATE);
        }}/>
            <MenuItemWithTopDescription_1.default description={translate('businessInfoStep.incorporationState')} title={translate(`allStates.${values[BUSINESS_INFO_STEP_KEYS.INCORPORATION_STATE]}.stateName`)} shouldShowRightIcon onPress={() => {
            onMove(BUSINESS_INFO_STEP_INDEXES.INCORPORATION_STATE);
        }}/>
            <MenuItemWithTopDescription_1.default description={translate('companyStep.industryClassificationCode')} title={values[BUSINESS_INFO_STEP_KEYS.INCORPORATION_CODE]} shouldShowRightIcon onPress={() => {
            onMove(BUSINESS_INFO_STEP_INDEXES.INCORPORATION_CODE);
        }}/>
            <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} validate={validate} onSubmit={onNext} scrollContextEnabled submitButtonText={translate('common.confirm')} style={[styles.mh5, styles.flexGrow1]} enabledWhenOffline={false} shouldHideFixErrorsAlert>
                <InputWrapper_1.default InputComponent={CheckboxWithLabel_1.default} aria-label={`${translate('businessInfoStep.confirmCompanyIsNot')} ${translate('businessInfoStep.listOfRestrictedBusinesses')}`} inputID={BUSINESS_INFO_STEP_KEYS.HAS_NO_CONNECTION_TO_CANNABIS} defaultValue={defaultCheckboxState} LabelComponent={ConfirmCompanyLabel} style={[styles.mt3]} shouldSaveDraft/>
            </FormProvider_1.default>
        </ScrollView_1.default>);
}
ConfirmationBusiness.displayName = 'ConfirmationBusiness';
exports.default = ConfirmationBusiness;
