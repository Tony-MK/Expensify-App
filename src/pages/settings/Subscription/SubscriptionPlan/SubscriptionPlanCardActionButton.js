"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const Text_1 = require("@components/Text");
const useHasTeam2025Pricing_1 = require("@hooks/useHasTeam2025Pricing");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrivateSubscription_1 = require("@hooks/usePrivateSubscription");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Policy_1 = require("@libs/actions/Policy/Policy");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const AddMembersButton_1 = require("./AddMembersButton");
function SubscriptionPlanCardActionButton({ subscriptionPlan, isFromComparisonModal, isSelected, closeComparisonModal, style }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const hasTeam2025Pricing = (0, useHasTeam2025Pricing_1.default)();
    const currentUserAccountID = (0, Report_1.getCurrentUserAccountID)();
    const [policies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    const privateSubscription = (0, usePrivateSubscription_1.default)();
    const isAnnual = privateSubscription?.type === CONST_1.default.SUBSCRIPTION.TYPE.ANNUAL;
    const ownerPolicies = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getOwnedPaidPolicies)(policies, currentUserAccountID), [policies, currentUserAccountID]);
    const [canPerformUpgrade, policy] = (0, react_1.useMemo)(() => {
        const firstPolicy = ownerPolicies.at(0);
        if (!firstPolicy || ownerPolicies.length > 1) {
            return [false, undefined];
        }
        return [(0, PolicyUtils_1.canModifyPlan)(firstPolicy.id), firstPolicy];
    }, [ownerPolicies]);
    const handlePlanPress = (planType) => {
        closeComparisonModal?.();
        // If user has no policies, return.
        if (!ownerPolicies.length) {
            return;
        }
        if (planType === CONST_1.default.POLICY.TYPE.TEAM && privateSubscription?.type === CONST_1.default.SUBSCRIPTION.TYPE.ANNUAL && !account?.canDowngrade) {
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SUBSCRIPTION_DOWNGRADE_BLOCKED.getRoute(Navigation_1.default.getActiveRoute()));
            return;
        }
        if (planType === CONST_1.default.POLICY.TYPE.TEAM) {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_DOWNGRADE.getRoute(policy?.id, Navigation_1.default.getActiveRoute()));
            return;
        }
        if (planType === CONST_1.default.POLICY.TYPE.CORPORATE) {
            if (canPerformUpgrade && !!policy?.id) {
                (0, Policy_1.upgradeToCorporate)(policy.id);
                closeComparisonModal?.();
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policy?.id, undefined, Navigation_1.default.getActiveRoute()));
        }
    };
    const currentPlanLabel = (<react_native_1.View style={style}>
            <react_native_1.View style={[styles.button, styles.buttonContainer, styles.outlinedButton]}>
                <Text_1.default style={styles.textLabelSupporting}>{translate('subscription.yourPlan.thisIsYourCurrentPlan')}</Text_1.default>
            </react_native_1.View>
        </react_native_1.View>);
    if (subscriptionPlan === CONST_1.default.POLICY.TYPE.TEAM) {
        if (isFromComparisonModal) {
            if (isSelected) {
                return currentPlanLabel;
            }
            return (<Button_1.default text={translate('subscription.yourPlan.downgrade')} style={style} onPress={() => handlePlanPress(CONST_1.default.POLICY.TYPE.TEAM)}/>);
        }
        if (hasTeam2025Pricing) {
            return <AddMembersButton_1.default />;
        }
    }
    if (subscriptionPlan === CONST_1.default.POLICY.TYPE.CORPORATE) {
        if (isFromComparisonModal) {
            if (isSelected) {
                return currentPlanLabel;
            }
            return (<Button_1.default success style={style} text={translate('subscription.yourPlan.upgrade')} onPress={() => handlePlanPress(CONST_1.default.POLICY.TYPE.CORPORATE)}/>);
        }
    }
    const autoIncrease = privateSubscription?.addNewUsersAutomatically ? translate('subscription.subscriptionSettings.on') : translate('subscription.subscriptionSettings.off');
    const subscriptionType = isAnnual ? translate('subscription.subscriptionSettings.annual') : translate('subscription.details.payPerUse');
    const subscriptionSize = `${privateSubscription?.userCount ?? translate('subscription.subscriptionSettings.none')}`;
    const autoRenew = privateSubscription?.autoRenew ? translate('subscription.subscriptionSettings.on') : translate('subscription.subscriptionSettings.off');
    return (<MenuItemWithTopDescription_1.default description={translate('subscription.subscriptionSettings.title')} style={style} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SUBSCRIPTION_SETTINGS_DETAILS)} numberOfLinesTitle={3} title={translate('subscription.subscriptionSettings.summary', { subscriptionType, subscriptionSize, autoRenew, autoIncrease })}/>);
}
exports.default = SubscriptionPlanCardActionButton;
