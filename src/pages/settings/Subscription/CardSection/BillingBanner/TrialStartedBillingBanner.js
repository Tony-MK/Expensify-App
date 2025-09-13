"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Illustrations = require("@components/Icon/Illustrations");
const useLocalize_1 = require("@hooks/useLocalize");
const SubscriptionUtils = require("@libs/SubscriptionUtils");
const BillingBanner_1 = require("./BillingBanner");
function TrialStartedBillingBanner() {
    const { translate } = (0, useLocalize_1.default)();
    const subtitle = !SubscriptionUtils.doesUserHavePaymentCardAdded() ? translate('subscription.billingBanner.trialStarted.subtitle') : '';
    return (<BillingBanner_1.default title={translate('subscription.billingBanner.trialStarted.title', { numOfDays: SubscriptionUtils.calculateRemainingFreeTrialDays() })} subtitle={subtitle} icon={Illustrations.TreasureChest}/>);
}
TrialStartedBillingBanner.displayName = 'TrialStartedBillingBanner';
exports.default = TrialStartedBillingBanner;
