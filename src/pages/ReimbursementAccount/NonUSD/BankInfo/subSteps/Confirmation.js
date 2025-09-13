"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getBankInfoStepValues_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getBankInfoStepValues");
const getInputKeysForBankInfoStep_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getInputKeysForBankInfoStep");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const { ACCOUNT_HOLDER_COUNTRY } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
function Confirmation({ onNext, onMove, corpayFields }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: true });
    const inputKeys = (0, getInputKeysForBankInfoStep_1.default)(corpayFields);
    const values = (0, react_1.useMemo)(() => (0, getBankInfoStepValues_1.getBankInfoStepValues)(inputKeys, reimbursementAccountDraft, reimbursementAccount), [inputKeys, reimbursementAccount, reimbursementAccountDraft]);
    const items = (0, react_1.useMemo)(() => corpayFields?.formFields?.map((field) => {
        let title = values[field.id] ? String(values[field.id]) : '';
        if (field.id === ACCOUNT_HOLDER_COUNTRY) {
            title = CONST_1.default.ALL_COUNTRIES[title];
        }
        return (<MenuItemWithTopDescription_1.default description={field.label} title={title} shouldShowRightIcon onPress={() => {
                if (!field.id.includes(CONST_1.default.NON_USD_BANK_ACCOUNT.BANK_INFO_STEP_ACCOUNT_HOLDER_KEY_PREFIX)) {
                    onMove(0);
                }
                else {
                    onMove(1);
                }
            }} key={field.id}/>);
    }), [corpayFields, onMove, values]);
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} submitButtonText={translate('common.confirm')} onSubmit={onNext} style={[styles.flexGrow1]} submitButtonStyles={styles.mh5}>
            <react_native_1.View style={styles.flexGrow4}>
                <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mb3]}>{translate('bankInfoStep.letsDoubleCheck')}</Text_1.default>
                <Text_1.default style={[styles.textSupporting, styles.ph5, styles.mb5]}>{translate('bankInfoStep.thisBankAccount')}</Text_1.default>
                {corpayFields?.isLoading ? (<react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} color={theme.spinner} style={styles.flexGrow1}/>) : (items)}
            </react_native_1.View>
        </FormProvider_1.default>);
}
Confirmation.displayName = 'Confirmation';
exports.default = Confirmation;
