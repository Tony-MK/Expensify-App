"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Expensicons_1 = require("@components/Icon/Expensicons");
const Illustrations_1 = require("@components/Icon/Illustrations");
const MenuItem_1 = require("@components/MenuItem");
const ScrollView_1 = require("@components/ScrollView");
const Section_1 = require("@components/Section");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const WorkspaceResetBankAccountModal_1 = require("@pages/workspace/WorkspaceResetBankAccountModal");
const BankAccounts_1 = require("@userActions/BankAccounts");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const Enable2FACard_1 = require("./Enable2FACard");
function FinishChatCard({ requiresTwoFactorAuth, reimbursementAccount, setUSDBankAccountStep }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const policyID = reimbursementAccount?.achData?.policyID;
    const shouldShowResetModal = reimbursementAccount?.shouldShowResetModal ?? false;
    const handleNavigateToConciergeChat = () => (0, Report_1.navigateToConciergeChat)(true, undefined, undefined, reimbursementAccount?.achData?.ACHRequestReportActionID);
    return (<ScrollView_1.default style={[styles.flex1]}>
            <Section_1.default title={translate('workspace.bankAccount.letsFinishInChat')} icon={Illustrations_1.ConciergeBubble} containerStyles={[styles.mb8, styles.mh5]} titleStyles={[styles.mb3]}>
                <Text_1.default style={styles.mb6}>{translate('connectBankAccountStep.letsChatText')}</Text_1.default>
                <MenuItem_1.default icon={Expensicons_1.ChatBubble} title={translate('workspace.bankAccount.finishInChat')} onPress={handleNavigateToConciergeChat} outerWrapperStyle={shouldUseNarrowLayout ? styles.mhn5 : styles.mhn8} shouldShowRightIcon/>
                <MenuItem_1.default icon={Expensicons_1.Pencil} title={translate('workspace.bankAccount.updateDetails')} onPress={() => {
            (0, BankAccounts_1.setBankAccountSubStep)(CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.MANUAL).then(() => {
                setUSDBankAccountStep(CONST_1.default.BANK_ACCOUNT.STEP.REQUESTOR);
                (0, BankAccounts_1.goToWithdrawalAccountSetupStep)(CONST_1.default.BANK_ACCOUNT.STEP.REQUESTOR);
            });
        }} outerWrapperStyle={shouldUseNarrowLayout ? styles.mhn5 : styles.mhn8} shouldShowRightIcon/>
                <MenuItem_1.default icon={Expensicons_1.RotateLeft} title={translate('workspace.bankAccount.startOver')} onPress={BankAccounts_1.requestResetBankAccount} outerWrapperStyle={shouldUseNarrowLayout ? styles.mhn5 : styles.mhn8} shouldShowRightIcon/>
            </Section_1.default>
            {!requiresTwoFactorAuth && <Enable2FACard_1.default policyID={policyID}/>}
            {shouldShowResetModal && (<WorkspaceResetBankAccountModal_1.default reimbursementAccount={reimbursementAccount} isNonUSDWorkspace={false} setUSDBankAccountStep={setUSDBankAccountStep}/>)}
        </ScrollView_1.default>);
}
FinishChatCard.displayName = 'FinishChatCard';
exports.default = FinishChatCard;
