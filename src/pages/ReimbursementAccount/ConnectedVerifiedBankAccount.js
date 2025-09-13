"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const BankIcons_1 = require("@components/Icon/BankIcons");
const Expensicons_1 = require("@components/Icon/Expensicons");
const Illustrations_1 = require("@components/Icon/Illustrations");
const MenuItem_1 = require("@components/MenuItem");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Section_1 = require("@components/Section");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const WorkspaceResetBankAccountModal_1 = require("@pages/workspace/WorkspaceResetBankAccountModal");
const ReimbursementAccount_1 = require("@userActions/ReimbursementAccount");
const CONST_1 = require("@src/CONST");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function ConnectedVerifiedBankAccount({ reimbursementAccount, onBackButtonPress, setShouldShowConnectedVerifiedBankAccount, setUSDBankAccountStep, setNonUSDBankAccountStep, isNonUSDWorkspace, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { icon, iconSize, iconStyles } = (0, BankIcons_1.default)({ bankName: reimbursementAccount?.achData?.bankName, styles });
    const formattedBankAccountNumber = reimbursementAccount?.achData?.accountNumber
        ? `${translate('bankAccount.accountEnding')} ${reimbursementAccount?.achData?.accountNumber.slice(-4)}`
        : '';
    const bankAccountOwnerName = reimbursementAccount?.achData?.addressName;
    const errors = reimbursementAccount?.errors ?? {};
    const pendingAction = reimbursementAccount?.pendingAction;
    const shouldShowResetModal = reimbursementAccount?.shouldShowResetModal ?? false;
    return (<ScreenWrapper_1.default testID={ConnectedVerifiedBankAccount.displayName} includeSafeAreaPaddingBottom={false} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight style={[styles.flex1, styles.justifyContentBetween, styles.mh2]} forwardedFSClass={CONST_1.default.FULLSTORY.CLASS.MASK}>
            <HeaderWithBackButton_1.default title={translate('bankAccount.addBankAccount')} onBackButtonPress={onBackButtonPress}/>
            <ScrollView_1.default style={[styles.flex1]}>
                <Section_1.default title={translate('workspace.bankAccount.allSet')} icon={Illustrations_1.ThumbsUpStars}>
                    <OfflineWithFeedback_1.default pendingAction={pendingAction} errors={errors} shouldShowErrorMessages onClose={ReimbursementAccount_1.resetReimbursementAccount}>
                        <MenuItem_1.default title={bankAccountOwnerName} description={formattedBankAccountNumber} icon={icon} iconStyles={iconStyles} iconWidth={iconSize} iconHeight={iconSize} interactive={false} displayInDefaultIconColor wrapperStyle={[styles.ph0, styles.mv3, styles.h13]}/>
                        <Text_1.default style={[styles.mv3]}>{translate('workspace.bankAccount.accountDescriptionWithCards')}</Text_1.default>
                        <MenuItem_1.default title={translate('workspace.bankAccount.disconnectBankAccount')} icon={Expensicons_1.Close} onPress={ReimbursementAccount_1.requestResetBankAccount} outerWrapperStyle={shouldUseNarrowLayout ? styles.mhn5 : styles.mhn8} disabled={!!pendingAction || !(0, EmptyObject_1.isEmptyObject)(errors)}/>
                    </OfflineWithFeedback_1.default>
                </Section_1.default>
            </ScrollView_1.default>
            {shouldShowResetModal && (<WorkspaceResetBankAccountModal_1.default reimbursementAccount={reimbursementAccount} isNonUSDWorkspace={isNonUSDWorkspace} setShouldShowConnectedVerifiedBankAccount={setShouldShowConnectedVerifiedBankAccount} setUSDBankAccountStep={setUSDBankAccountStep} setNonUSDBankAccountStep={setNonUSDBankAccountStep}/>)}
        </ScreenWrapper_1.default>);
}
ConnectedVerifiedBankAccount.displayName = 'ConnectedVerifiedBankAccount';
exports.default = ConnectedVerifiedBankAccount;
