"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Button_1 = require("@components/Button");
var DotIndicatorMessage_1 = require("@components/DotIndicatorMessage");
var Icon_1 = require("@components/Icon");
var Expensicons = require("@components/Icon/Expensicons");
var Illustrations = require("@components/Icon/Illustrations");
var ScrollView_1 = require("@components/ScrollView");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var ErrorUtils_1 = require("@libs/ErrorUtils");
var BankAccounts_1 = require("@userActions/BankAccounts");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
function HangTight(_a) {
    var _b, _c, _d, _e;
    var policyID = _a.policyID, bankAccountID = _a.bankAccountID;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var safeAreaInsetPaddingBottom = (0, useSafeAreaPaddings_1.default)().paddingBottom;
    var reimbursementAccount = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false })[0];
    var signerEmail = (_c = (_b = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.achData) === null || _b === void 0 ? void 0 : _b.corpay) === null || _c === void 0 ? void 0 : _c.signerEmail;
    var secondSignerEmail = (_e = (_d = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.achData) === null || _d === void 0 ? void 0 : _d.corpay) === null || _e === void 0 ? void 0 : _e.secondSignerEmail;
    var error = (0, ErrorUtils_1.getLatestErrorMessage)(reimbursementAccount);
    var handleSendReminder = function () {
        if (!signerEmail || !policyID) {
            return;
        }
        (0, BankAccounts_1.sendReminderForCorpaySignerInformation)({ policyID: policyID, bankAccountID: bankAccountID, signerEmail: signerEmail, secondSignerEmail: secondSignerEmail });
    };
    (0, react_1.useEffect)(function () {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if ((reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.errors) || (reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.isSendingReminderForCorpaySignerInformation) || !(reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.isSuccess)) {
            return;
        }
        if (reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.isSuccess) {
            (0, BankAccounts_1.clearReimbursementAccountSendReminderForCorpaySignerInformation)();
        }
        return function () {
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
                {!!error && error.length > 0 && (<DotIndicatorMessage_1.default textStyles={[styles.formError]} type="error" messages={{ error: error }}/>)}
                <Button_1.default success style={[styles.w100]} onPress={handleSendReminder} large icon={(reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.isSendingReminderForCorpaySignerInformation) ? undefined : Expensicons.Bell} text={translate('signerInfoStep.sendReminder')} isLoading={reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.isSendingReminderForCorpaySignerInformation}/>
            </react_native_1.View>
        </ScrollView_1.default>);
}
HangTight.displayName = 'HangTight';
exports.default = HangTight;
