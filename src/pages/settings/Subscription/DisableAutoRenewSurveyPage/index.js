"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FeedbackSurvey_1 = require("@components/FeedbackSurvey");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Subscription = require("@userActions/Subscription");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function DisableAutoRenewSurveyPage() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const handleSubmit = (key, additionalNote) => {
        Subscription.updateSubscriptionAutoRenew(false, key, additionalNote);
        Navigation_1.default.goBack();
    };
    return (<ScreenWrapper_1.default testID={DisableAutoRenewSurveyPage.displayName} includeSafeAreaPaddingBottom={false} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('subscription.subscriptionSettings.disableAutoRenew')} onBackButtonPress={Navigation_1.default.goBack}/>
            <ScrollView_1.default contentContainerStyle={[styles.flexGrow1, styles.pt3]}>
                <FeedbackSurvey_1.default formID={ONYXKEYS_1.default.FORMS.DISABLE_AUTO_RENEW_SURVEY_FORM} title={translate('subscription.subscriptionSettings.helpUsImprove')} description={translate('subscription.subscriptionSettings.whatsMainReason')} onSubmit={handleSubmit} optionRowStyles={styles.flex1}/>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
DisableAutoRenewSurveyPage.displayName = 'DisableAutoRenewSurveyPage';
exports.default = DisableAutoRenewSurveyPage;
