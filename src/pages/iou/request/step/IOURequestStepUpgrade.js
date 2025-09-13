"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const UpgradeConfirmation_1 = require("@pages/workspace/upgrade/UpgradeConfirmation");
const UpgradeIntro_1 = require("@pages/workspace/upgrade/UpgradeIntro");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const Policy = require("@src/libs/actions/Policy/Policy");
const ROUTES_1 = require("@src/ROUTES");
function IOURequestStepUpgrade({ route: { params: { transactionID, action }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const feature = CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.categories;
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [isUpgraded, setIsUpgraded] = (0, react_1.useState)(false);
    const policyDataRef = (0, react_1.useRef)(null);
    return (<ScreenWrapper_1.default shouldShowOfflineIndicator testID="workspaceUpgradePage" offlineIndicatorStyle={styles.mtAuto}>
            <HeaderWithBackButton_1.default title={translate('common.upgrade')} onBackButtonPress={() => {
            Navigation_1.default.goBack();
        }}/>
            <ScrollView_1.default contentContainerStyle={styles.flexGrow1}>
                {!!isUpgraded && (<UpgradeConfirmation_1.default onConfirmUpgrade={() => {
                (0, IOU_1.setMoneyRequestParticipants)(transactionID, [
                    {
                        selected: true,
                        accountID: 0,
                        isPolicyExpenseChat: true,
                        reportID: policyDataRef.current?.expenseChatReportID,
                        policyID: policyDataRef.current?.policyID,
                        searchText: policyDataRef.current?.policyName,
                    },
                ]);
                Navigation_1.default.goBack();
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CATEGORY.getRoute(action, CONST_1.default.IOU.TYPE.SUBMIT, transactionID, policyDataRef.current?.expenseChatReportID));
            }} policyName="" isCategorizing/>)}
                {!isUpgraded && (<UpgradeIntro_1.default feature={feature} onUpgrade={() => {
                const policyData = Policy.createWorkspace({
                    policyOwnerEmail: '',
                    makeMeAdmin: false,
                    policyName: '',
                    policyID: undefined,
                    engagementChoice: CONST_1.default.ONBOARDING_CHOICES.TRACK_WORKSPACE,
                });
                setIsUpgraded(true);
                policyDataRef.current = policyData;
            }} buttonDisabled={isOffline} loading={false} isCategorizing/>)}
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
exports.default = IOURequestStepUpgrade;
