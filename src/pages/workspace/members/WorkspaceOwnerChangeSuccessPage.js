"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmationPage_1 = require("@components/ConfirmationPage");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const LottieAnimations_1 = require("@components/LottieAnimations");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Member_1 = require("@userActions/Policy/Member");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceOwnerChangeSuccessPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const accountID = Number(route.params.accountID) ?? -1;
    const policyID = route.params.policyID;
    const backTo = route.params.backTo;
    const closePage = (0, react_1.useCallback)(() => {
        (0, Member_1.clearWorkspaceOwnerChangeFlow)(policyID);
        if (backTo) {
            Navigation_1.default.goBack(backTo);
        }
        else {
            Navigation_1.default.goBack();
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_MEMBER_DETAILS.getRoute(policyID, accountID));
        }
    }, [accountID, backTo, policyID]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID}>
            <ScreenWrapper_1.default testID={WorkspaceOwnerChangeSuccessPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.changeOwner.changeOwnerPageTitle')} onBackButtonPress={closePage}/>
                <ConfirmationPage_1.default illustration={LottieAnimations_1.default.Fireworks} heading={translate('workspace.changeOwner.successTitle')} description={translate('workspace.changeOwner.successDescription')} descriptionStyle={styles.textSupporting} shouldShowButton buttonText={translate('common.buttonConfirm')} onButtonPress={closePage}/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceOwnerChangeSuccessPage.displayName = 'WorkspaceOwnerChangeSuccessPage';
exports.default = WorkspaceOwnerChangeSuccessPage;
