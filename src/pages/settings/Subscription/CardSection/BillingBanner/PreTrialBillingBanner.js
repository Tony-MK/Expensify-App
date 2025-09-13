"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Illustrations = require("@components/Icon/Illustrations");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report = require("@libs/actions/Report");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils = require("@libs/ReportUtils");
const ROUTES_1 = require("@src/ROUTES");
const BillingBanner_1 = require("./BillingBanner");
function PreTrialBillingBanner() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const navigateToChat = () => {
        const reportUsedForOnboarding = ReportUtils.getChatUsedForOnboarding();
        if (!reportUsedForOnboarding) {
            Report.navigateToConciergeChat();
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(reportUsedForOnboarding.reportID));
    };
    return (<BillingBanner_1.default title={translate('subscription.billingBanner.preTrial.title')} subtitle={<Text_1.default>
                    {translate('subscription.billingBanner.preTrial.subtitleStart')}
                    <TextLink_1.default style={styles.link} onPress={navigateToChat}>
                        {translate('subscription.billingBanner.preTrial.subtitleLink')}
                    </TextLink_1.default>
                    {translate('subscription.billingBanner.preTrial.subtitleEnd')}
                </Text_1.default>} icon={Illustrations.TreasureChest}/>);
}
PreTrialBillingBanner.displayName = 'PreTrialBillingBanner';
exports.default = PreTrialBillingBanner;
