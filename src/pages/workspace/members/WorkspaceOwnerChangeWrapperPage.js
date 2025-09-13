"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@navigation/Navigation");
const CardAuthenticationModal_1 = require("@pages/settings/Subscription/CardAuthenticationModal");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicy_1 = require("@pages/workspace/withPolicy");
const Member_1 = require("@userActions/Policy/Member");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const WorkspaceOwnerChangeCheck_1 = require("./WorkspaceOwnerChangeCheck");
const WorkspaceOwnerPaymentCardForm_1 = require("./WorkspaceOwnerPaymentCardForm");
function WorkspaceOwnerChangeWrapperPage({ route, policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [privateStripeCustomerID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIVATE_STRIPE_CUSTOMER_ID, { canBeMissing: true });
    const policyID = route.params.policyID;
    const accountID = route.params.accountID;
    const error = route.params.error;
    const backTo = route.params.backTo;
    const isAuthRequired = privateStripeCustomerID?.status === CONST_1.default.STRIPE_SCA_AUTH_STATUSES.CARD_AUTHENTICATION_REQUIRED;
    const shouldShowPaymentCardForm = error === CONST_1.default.POLICY.OWNERSHIP_ERRORS.NO_BILLING_CARD || isAuthRequired;
    (0, react_1.useEffect)(() => {
        if (!policy || policy?.isLoading) {
            return;
        }
        if (!policy.errorFields && policy.isChangeOwnerFailed) {
            // there are some errors but not related to change owner flow - show an error page
            Navigation_1.default.goBack();
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_OWNER_CHANGE_ERROR.getRoute(policyID, accountID, backTo));
            return;
        }
        if (!policy?.errorFields?.changeOwner && policy?.isChangeOwnerSuccessful) {
            // no errors - show a success page
            Navigation_1.default.goBack();
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_OWNER_CHANGE_SUCCESS.getRoute(policyID, accountID, backTo));
            return;
        }
        const changeOwnerErrors = Object.keys(policy?.errorFields?.changeOwner ?? {});
        if (changeOwnerErrors && changeOwnerErrors.length > 0) {
            Navigation_1.default.setParams({ error: changeOwnerErrors.at(0) });
        }
    }, [accountID, backTo, policy, policy?.errorFields?.changeOwner, policyID]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID}>
            <ScreenWrapper_1.default testID={WorkspaceOwnerChangeWrapperPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.changeOwner.changeOwnerPageTitle')} onBackButtonPress={() => {
            (0, Member_1.clearWorkspaceOwnerChangeFlow)(policyID);
            if (backTo) {
                Navigation_1.default.goBack(backTo);
            }
            else {
                Navigation_1.default.goBack();
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_MEMBER_DETAILS.getRoute(policyID, accountID));
            }
        }}/>
                <react_native_1.View style={[styles.containerWithSpaceBetween, error !== CONST_1.default.POLICY.OWNERSHIP_ERRORS.NO_BILLING_CARD ? styles.ph5 : styles.ph0, styles.pb0]}>
                    {!!policy?.isLoading && <FullscreenLoadingIndicator_1.default />}
                    {shouldShowPaymentCardForm && <WorkspaceOwnerPaymentCardForm_1.default policy={policy}/>}
                    {!policy?.isLoading && !shouldShowPaymentCardForm && (<WorkspaceOwnerChangeCheck_1.default policy={policy} accountID={accountID} error={error}/>)}
                    <CardAuthenticationModal_1.default headerTitle={translate('subscription.authenticatePaymentCard')} policyID={policyID}/>
                </react_native_1.View>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceOwnerChangeWrapperPage.displayName = 'WorkspaceOwnerChangeWrapperPage';
exports.default = (0, withPolicy_1.default)(WorkspaceOwnerChangeWrapperPage);
