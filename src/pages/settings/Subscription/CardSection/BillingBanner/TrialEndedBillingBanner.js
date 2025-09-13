"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Illustrations = require("@components/Icon/Illustrations");
const useLocalize_1 = require("@hooks/useLocalize");
const SubscriptionUtils = require("@libs/SubscriptionUtils");
const BillingBanner_1 = require("./BillingBanner");
function TrialEndedBillingBanner() {
    const { translate } = (0, useLocalize_1.default)();
    if (SubscriptionUtils.doesUserHavePaymentCardAdded()) {
        return null;
    }
    return (<BillingBanner_1.default title={translate('subscription.billingBanner.trialEnded.title')} subtitle={translate('subscription.billingBanner.trialEnded.subtitle')} icon={Illustrations.Tire}/>);
}
TrialEndedBillingBanner.displayName = 'TrialEndedBillingBanner';
exports.default = TrialEndedBillingBanner;
