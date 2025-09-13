"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var SubscriptionPlanDowngradeBlocked_1 = require("@components/SubscriptionPlanDowngradeBlocked");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var Navigation_1 = require("@navigation/Navigation");
var utils_1 = require("@pages/settings/Subscription/utils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
function SubscriptionPlanDowngradeBlockedPage() {
    var translate = (0, useLocalize_1.default)().translate;
    var privateSubscription = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIVATE_SUBSCRIPTION, { canBeMissing: false })[0];
    var formattedSubscriptionEndDate = (0, utils_1.formatSubscriptionEndDate)(privateSubscription === null || privateSubscription === void 0 ? void 0 : privateSubscription.endDate);
    var onClosePress = function () {
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
