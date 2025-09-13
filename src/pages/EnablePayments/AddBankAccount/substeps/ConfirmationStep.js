"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const DotIndicatorMessage_1 = require("@components/DotIndicatorMessage");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const PersonalBankAccountForm_1 = require("@src/types/form/PersonalBankAccountForm");
const BANK_INFO_STEP_KEYS = PersonalBankAccountForm_1.default.BANK_INFO_STEP;
const BANK_INFO_STEP_INDEXES = CONST_1.default.WALLET.SUBSTEP_INDEXES.BANK_ACCOUNT;
function ConfirmationStep({ onNext, onMove }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [personalBankAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.PERSONAL_BANK_ACCOUNT_FORM_DRAFT, { canBeMissing: true });
    const [personalBankAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_BANK_ACCOUNT, { canBeMissing: true });
    const isLoading = personalBankAccount?.isLoading ?? false;
    const error = (0, ErrorUtils_1.getLatestErrorMessage)(personalBankAccount ?? {});
    const handleModifyAccountNumbers = () => {
        onMove(BANK_INFO_STEP_INDEXES.ACCOUNT_NUMBERS);
    };
    return (<ScrollView_1.default style={styles.pt0} contentContainerStyle={styles.flexGrow1}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5]}>{translate('walletPage.confirmYourBankAccount')}</Text_1.default>
            <Text_1.default style={[styles.mt3, styles.mb3, styles.ph5, styles.textSupporting]}>{translate('bankAccount.letsDoubleCheck')}</Text_1.default>
            <MenuItemWithTopDescription_1.default description={personalBankAccountDraft?.[BANK_INFO_STEP_KEYS.BANK_NAME]} title={`${translate('bankAccount.accountEnding')} ${(personalBankAccountDraft?.[BANK_INFO_STEP_KEYS.ACCOUNT_NUMBER] ?? '').slice(-4)}`} shouldShowRightIcon onPress={handleModifyAccountNumbers}/>
            <react_native_1.View style={[styles.ph5, styles.pb5, styles.flexGrow1, styles.justifyContentEnd]}>
                {!!error && error.length > 0 && (<DotIndicatorMessage_1.default textStyles={[styles.formError]} type="error" messages={{ error }}/>)}
                <Button_1.default isLoading={isLoading} isDisabled={isLoading || isOffline} success large style={[styles.w100]} onPress={onNext} text={translate('common.confirm')}/>
            </react_native_1.View>
        </ScrollView_1.default>);
}
ConfirmationStep.displayName = 'ConfirmationStep';
exports.default = ConfirmationStep;
