"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const FeedbackSurvey_1 = require("@components/FeedbackSurvey");
const FixedFooter_1 = require("@components/FixedFooter");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useCancellationType_1 = require("@hooks/useCancellationType");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Subscription_1 = require("@libs/actions/Subscription");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function RequestEarlyCancellationPage() {
    const { environmentURL } = (0, useEnvironment_1.default)();
    const workspacesListRoute = `${environmentURL}/${ROUTES_1.default.WORKSPACES_LIST.route}`;
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const cancellationType = (0, useCancellationType_1.default)();
    const handleSubmit = (cancellationReason, cancellationNote = '') => {
        setIsLoading(true);
        (0, Subscription_1.cancelBillingSubscription)(cancellationReason, cancellationNote);
    };
    const acknowledgementText = (0, react_1.useMemo)(() => <RenderHTML_1.default html={translate('subscription.requestEarlyCancellation.acknowledgement')}/>, [translate]);
    const manualCancellationContent = (0, react_1.useMemo)(() => (<react_native_1.View style={[styles.flexGrow1, styles.justifyContentBetween, styles.mh5]}>
                <react_native_1.View>
                    <Text_1.default style={styles.textHeadline}>{translate('subscription.requestEarlyCancellation.requestSubmitted.title')}</Text_1.default>
                    <react_native_1.View style={[styles.mt1, styles.renderHTML]}>
                        <RenderHTML_1.default html={translate('subscription.requestEarlyCancellation.requestSubmitted.subtitle')}/>
                    </react_native_1.View>
                </react_native_1.View>
                <FixedFooter_1.default style={styles.ph0}>
                    <Button_1.default success text={translate('common.done')} onPress={() => Navigation_1.default.goBack()} large/>
                </FixedFooter_1.default>
            </react_native_1.View>), [styles, translate]);
    const automaticCancellationContent = (0, react_1.useMemo)(() => (<react_native_1.View style={[styles.flexGrow1, styles.justifyContentBetween, styles.mh5]}>
                <react_native_1.View>
                    <Text_1.default style={styles.textHeadline}>{translate('subscription.requestEarlyCancellation.subscriptionCanceled.title')}</Text_1.default>
                    <Text_1.default style={[styles.mt1, styles.textNormalThemeText]}>{translate('subscription.requestEarlyCancellation.subscriptionCanceled.subtitle')}</Text_1.default>
                    <Text_1.default style={[styles.mv4, styles.textNormalThemeText]}>{translate('subscription.requestEarlyCancellation.subscriptionCanceled.info')}</Text_1.default>

                    <RenderHTML_1.default html={translate('subscription.requestEarlyCancellation.subscriptionCanceled.preventFutureActivity', { workspacesListRoute })}/>
                </react_native_1.View>
                <FixedFooter_1.default style={styles.ph0}>
                    <Button_1.default success text={translate('common.done')} onPress={() => Navigation_1.default.goBack()} large/>
                </FixedFooter_1.default>
            </react_native_1.View>), [styles, translate, workspacesListRoute]);
    const surveyContent = (0, react_1.useMemo)(() => (<FeedbackSurvey_1.default formID={ONYXKEYS_1.default.FORMS.REQUEST_EARLY_CANCELLATION_FORM} title={translate('subscription.subscriptionSettings.helpUsImprove')} description={translate('subscription.requestEarlyCancellation.subtitle')} onSubmit={handleSubmit} optionRowStyles={styles.flex1} footerText={<Text_1.default style={[styles.mb2, styles.mt4]}>{acknowledgementText}</Text_1.default>} isNoteRequired isLoading={isLoading} enabledWhenOffline={false}/>), [acknowledgementText, isLoading, styles.flex1, styles.mb2, styles.mt4, translate]);
    const contentMap = {
        [CONST_1.default.CANCELLATION_TYPE.MANUAL]: manualCancellationContent,
        [CONST_1.default.CANCELLATION_TYPE.AUTOMATIC]: automaticCancellationContent,
        [CONST_1.default.CANCELLATION_TYPE.NONE]: manualCancellationContent,
    };
    const screenContent = cancellationType ? contentMap[cancellationType] : surveyContent;
    return (<ScreenWrapper_1.default testID={RequestEarlyCancellationPage.displayName} includeSafeAreaPaddingBottom={false} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight>
            <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]}>
                <HeaderWithBackButton_1.default title={translate('subscription.requestEarlyCancellation.title')} onBackButtonPress={Navigation_1.default.goBack}/>
                <ScrollView_1.default contentContainerStyle={[styles.flexGrow1, styles.pt3]}>{screenContent}</ScrollView_1.default>
            </DelegateNoAccessWrapper_1.default>
        </ScreenWrapper_1.default>);
}
RequestEarlyCancellationPage.displayName = 'RequestEarlyCancellationPage';
exports.default = RequestEarlyCancellationPage;
