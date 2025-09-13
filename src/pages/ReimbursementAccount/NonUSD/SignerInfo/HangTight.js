"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const DotIndicatorMessage_1 = require("@components/DotIndicatorMessage");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const BankAccounts_1 = require("@userActions/BankAccounts");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function HangTight({ policyID, bankAccountID }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { paddingBottom: safeAreaInsetPaddingBottom } = (0, useSafeAreaPaddings_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const signerEmail = reimbursementAccount?.achData?.corpay?.signerEmail;
    const secondSignerEmail = reimbursementAccount?.achData?.corpay?.secondSignerEmail;
    const error = (0, ErrorUtils_1.getLatestErrorMessage)(reimbursementAccount);
    const handleSendReminder = () => {
        if (!signerEmail || !policyID) {
            return;
        }
        (0, BankAccounts_1.sendReminderForCorpaySignerInformation)({ policyID, bankAccountID, signerEmail, secondSignerEmail });
    };
    (0, react_1.useEffect)(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (reimbursementAccount?.errors || reimbursementAccount?.isSendingReminderForCorpaySignerInformation || !reimbursementAccount?.isSuccess) {
            return;
        }
        if (reimbursementAccount?.isSuccess) {
            (0, BankAccounts_1.clearReimbursementAccountSendReminderForCorpaySignerInformation)();
        }
        return () => {
            (0, BankAccounts_1.clearReimbursementAccountSendReminderForCorpaySignerInformation)();
        };
    }, [reimbursementAccount]);
    return (<ScrollView_1.default style={styles.pt0} contentContainerStyle={[styles.flexGrow1, { paddingBottom: safeAreaInsetPaddingBottom + styles.pb5.paddingBottom }]}>
            <react_native_1.View style={[styles.flexGrow1, styles.justifyContentCenter, styles.alignItemsCenter]}>
                <react_native_1.View style={styles.mb5}>
                    <Icon_1.default width={144} height={132} src={Illustrations.Pillow}/>
                </react_native_1.View>
                <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mh5, styles.mb3, styles.mt5]}>{translate('signerInfoStep.hangTight')}</Text_1.default>
                <Text_1.default style={[styles.textAlignCenter, styles.mutedTextLabel, styles.mh5]}>{translate('signerInfoStep.weAreWaiting')}</Text_1.default>
            </react_native_1.View>
            <react_native_1.View style={[styles.ph5, styles.flexGrow1, styles.justifyContentEnd]}>
                {!!error && error.length > 0 && (<DotIndicatorMessage_1.default textStyles={[styles.formError]} type="error" messages={{ error }}/>)}
                <Button_1.default success style={[styles.w100]} onPress={handleSendReminder} large icon={reimbursementAccount?.isSendingReminderForCorpaySignerInformation ? undefined : Expensicons.Bell} text={translate('signerInfoStep.sendReminder')} isLoading={reimbursementAccount?.isSendingReminderForCorpaySignerInformation}/>
            </react_native_1.View>
        </ScrollView_1.default>);
}
HangTight.displayName = 'HangTight';
exports.default = HangTight;
