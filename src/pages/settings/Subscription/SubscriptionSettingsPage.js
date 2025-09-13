"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Illustrations = require("@components/Icon/Illustrations");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSubscriptionPlan_1 = require("@hooks/useSubscriptionPlan");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Subscription_1 = require("@libs/actions/Subscription");
const Navigation_1 = require("@libs/Navigation/Navigation");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const CardSection_1 = require("./CardSection/CardSection");
const ReducedFunctionalityMessage_1 = require("./ReducedFunctionalityMessage");
const SubscriptionPlan_1 = require("./SubscriptionPlan");
function SubscriptionSettingsPage({ route }) {
    const backTo = route?.params?.backTo;
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const subscriptionPlan = (0, useSubscriptionPlan_1.default)();
    (0, react_1.useEffect)(() => {
        (0, Subscription_1.openSubscriptionPage)();
    }, []);
    const [isAppLoading = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: false });
    if (!subscriptionPlan && isAppLoading) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    if (!subscriptionPlan) {
        return <NotFoundPage_1.default />;
    }
    return (<ScreenWrapper_1.default testID={SubscriptionSettingsPage.displayName} shouldShowOfflineIndicatorInWideScreen>
            <HeaderWithBackButton_1.default title={translate('workspace.common.subscription')} onBackButtonPress={() => {
            if (Navigation_1.default.getShouldPopToSidebar()) {
                Navigation_1.default.popToSidebar();
                return;
            }
            Navigation_1.default.goBack(backTo);
        }} shouldShowBackButton={shouldUseNarrowLayout} shouldDisplaySearchRouter icon={Illustrations.CreditCardsNew} shouldUseHeadlineHeader/>
            <ScrollView_1.default style={styles.pt3}>
                <react_native_1.View style={[styles.flex1, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                    <ReducedFunctionalityMessage_1.default />
                    <CardSection_1.default />
                    <SubscriptionPlan_1.default />
                </react_native_1.View>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
SubscriptionSettingsPage.displayName = 'SubscriptionSettingsPage';
exports.default = SubscriptionSettingsPage;
