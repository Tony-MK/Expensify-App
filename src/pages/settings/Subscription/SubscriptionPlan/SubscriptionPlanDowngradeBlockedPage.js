"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SubscriptionPlanDowngradeBlocked_1 = require("@components/SubscriptionPlanDowngradeBlocked");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const Navigation_1 = require("@navigation/Navigation");
const utils_1 = require("@pages/settings/Subscription/utils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function SubscriptionPlanDowngradeBlockedPage() {
    const { translate } = (0, useLocalize_1.default)();
    const [privateSubscription] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIVATE_SUBSCRIPTION, { canBeMissing: false });
    const formattedSubscriptionEndDate = (0, utils_1.formatSubscriptionEndDate)(privateSubscription?.endDate);
    const onClosePress = () => {
        Navigation_1.default.goBack();
    };
    return (<ScreenWrapper_1.default testID={SubscriptionPlanDowngradeBlockedPage.displayName} includeSafeAreaPaddingBottom shouldEnableMaxHeight>
            <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]}>
                <HeaderWithBackButton_1.default title={translate('workspace.common.planType')} onBackButtonPress={onClosePress}/>
                <SubscriptionPlanDowngradeBlocked_1.default privateSubscription={privateSubscription} formattedSubscriptionEndDate={formattedSubscriptionEndDate} onClosePress={onClosePress}/>
            </DelegateNoAccessWrapper_1.default>
        </ScreenWrapper_1.default>);
}
SubscriptionPlanDowngradeBlockedPage.displayName = 'SubscriptionPlanDowngradeBlockedPage';
exports.default = SubscriptionPlanDowngradeBlockedPage;
