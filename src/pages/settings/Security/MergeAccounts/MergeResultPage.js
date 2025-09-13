"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmationPage_1 = require("@components/ConfirmationPage");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Illustrations = require("@components/Icon/Illustrations");
const LottieAnimations_1 = require("@components/LottieAnimations");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextLink_1 = require("@components/TextLink");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const HybridApp_1 = require("@userActions/HybridApp");
const Link_1 = require("@userActions/Link");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
function MergeResultPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [userEmailOrPhone] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (session) => session?.email, canBeMissing: true });
    const { params } = (0, native_1.useRoute)();
    const { environmentURL } = (0, useEnvironment_1.default)();
    const { result, login, backTo } = params;
    const defaultResult = {
        heading: translate('mergeAccountsPage.mergeFailureGenericHeading'),
        buttonText: translate('common.buttonConfirm'),
        illustration: Illustrations.LockClosedOrange,
    };
    const results = (0, react_1.useMemo)(() => {
        return {
            [CONST_1.default.MERGE_ACCOUNT_RESULTS.SUCCESS]: {
                heading: translate('mergeAccountsPage.mergeSuccess.accountsMerged'),
                descriptionComponent: (<react_native_1.View style={[styles.renderHTML, styles.w100, styles.flexRow]}>
                        <RenderHTML_1.default html={translate('mergeAccountsPage.mergeSuccess.description', { from: login, to: userEmailOrPhone ?? '' })}/>
                    </react_native_1.View>),
                buttonText: translate('common.buttonConfirm'),
                onButtonPress: () => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY),
                illustration: LottieAnimations_1.default.Fireworks,
                illustrationStyle: { width: 150, height: 150 },
            },
            [CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_NO_EXIST]: {
                heading: translate('mergeAccountsPage.mergeFailureGenericHeading'),
                descriptionComponent: (<react_native_1.View style={[styles.renderHTML, styles.w100, styles.flexRow]}>
                        <RenderHTML_1.default html={translate('mergeAccountsPage.mergeFailureUncreatedAccountDescription', {
                        email: login,
                        contactMethodLink: `${environmentURL}/${ROUTES_1.default.SETTINGS_CONTACT_METHODS.route}`,
                    })}/>
                    </react_native_1.View>),
                onButtonPress: () => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY),
                buttonText: translate('common.buttonConfirm'),
                illustration: Illustrations.LockClosedOrange,
            },
            [CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_2FA]: {
                heading: translate('mergeAccountsPage.mergeFailureGenericHeading'),
                descriptionComponent: (<react_native_1.View style={[styles.renderHTML, styles.w100, styles.flexRow]}>
                        <RenderHTML_1.default html={translate('mergeAccountsPage.mergeFailure2FA.description', { email: login })}/>
                    </react_native_1.View>),
                cta: <TextLink_1.default href={CONST_1.default.MERGE_ACCOUNT_HELP_URL}>{translate('mergeAccountsPage.mergeFailure2FA.learnMore')}</TextLink_1.default>,
                ctaStyle: { ...styles.mt2, ...styles.textSupporting },
                onButtonPress: () => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY),
                buttonText: translate('common.buttonConfirm'),
                illustration: Illustrations.LockClosedOrange,
            },
            [CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_SMART_SCANNER]: {
                heading: translate('mergeAccountsPage.mergeFailureGenericHeading'),
                descriptionComponent: (<react_native_1.View style={[styles.renderHTML, styles.w100, styles.flexRow]}>
                        <RenderHTML_1.default html={translate('mergeAccountsPage.mergeFailureSmartScannerAccountDescription', { email: login })}/>
                    </react_native_1.View>),
                buttonText: translate('common.buttonConfirm'),
                illustration: Illustrations.LockClosedOrange,
                onButtonPress: () => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY),
            },
            [CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_SAML_DOMAIN_CONTROL]: {
                heading: translate('mergeAccountsPage.mergeFailureGenericHeading'),
                descriptionComponent: (<react_native_1.View style={[styles.renderHTML, styles.w100, styles.flexRow]}>
                        <RenderHTML_1.default html={translate('mergeAccountsPage.mergeFailureSAMLDomainControlDescription', { email: login })}/>
                    </react_native_1.View>),
                buttonText: translate('common.buttonConfirm'),
                onButtonPress: () => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY),
                illustration: Illustrations.LockClosedOrange,
            },
            [CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_SAML_NOT_SUPPORTED]: {
                heading: translate('mergeAccountsPage.mergePendingSAML.weAreWorkingOnIt'),
                description: translate('mergeAccountsPage.mergePendingSAML.limitedSupport'),
                ctaComponent: (<react_native_1.View style={[styles.renderHTML, styles.mt2, styles.flexRow]}>
                        <RenderHTML_1.default html={translate('mergeAccountsPage.mergePendingSAML.reachOutForHelp')}/>
                    </react_native_1.View>),
                secondaryButtonText: translate('mergeAccountsPage.mergePendingSAML.goToExpensifyClassic'),
                onSecondaryButtonPress: () => {
                    if (CONFIG_1.default.IS_HYBRID_APP) {
                        (0, HybridApp_1.closeReactNativeApp)({ shouldSetNVP: true });
                        return;
                    }
                    (0, Link_1.openOldDotLink)(CONST_1.default.OLDDOT_URLS.INBOX, false);
                },
                shouldShowSecondaryButton: true,
                buttonText: translate('common.buttonConfirm'),
                onButtonPress: () => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY),
                illustration: Illustrations.RunningTurtle,
                illustrationStyle: { width: 132, height: 150 },
            },
            [CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_SAML_PRIMARY_LOGIN]: {
                heading: translate('mergeAccountsPage.mergeFailureGenericHeading'),
                descriptionComponent: (<react_native_1.View style={[styles.renderHTML, styles.w100, styles.flexRow]}>
                        <RenderHTML_1.default html={translate('mergeAccountsPage.mergeFailureSAMLAccountDescription', { email: login })}/>
                    </react_native_1.View>),
                buttonText: translate('common.buttonConfirm'),
                onButtonPress: () => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY),
                illustration: Illustrations.LockClosedOrange,
            },
            [CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_ACCOUNT_LOCKED]: {
                heading: translate('mergeAccountsPage.mergeFailureGenericHeading'),
                descriptionComponent: (<react_native_1.View style={[styles.renderHTML, styles.w100, styles.flexRow]}>
                        <RenderHTML_1.default html={translate('mergeAccountsPage.mergeFailureAccountLockedDescription', { email: login })}/>
                    </react_native_1.View>),
                buttonText: translate('common.buttonConfirm'),
                onButtonPress: () => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY),
                illustration: Illustrations.LockClosedOrange,
            },
            [CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_INVOICING]: {
                heading: translate('mergeAccountsPage.mergeFailureGenericHeading'),
                descriptionComponent: (<react_native_1.View style={[styles.renderHTML, styles.w100, styles.flexRow]}>
                        <RenderHTML_1.default html={translate('mergeAccountsPage.mergeFailureInvoicedAccountDescription', { email: login })}/>
                    </react_native_1.View>),
                buttonText: translate('common.buttonConfirm'),
                onButtonPress: () => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY),
                illustration: Illustrations.LockClosedOrange,
            },
            [CONST_1.default.MERGE_ACCOUNT_RESULTS.TOO_MANY_ATTEMPTS]: {
                heading: translate('mergeAccountsPage.mergeFailureTooManyAttempts.heading'),
                description: translate('mergeAccountsPage.mergeFailureTooManyAttempts.description'),
                buttonText: translate('common.buttonConfirm'),
                onButtonPress: () => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY),
                illustration: Illustrations.LockClosedOrange,
            },
            [CONST_1.default.MERGE_ACCOUNT_RESULTS.ACCOUNT_UNVALIDATED]: {
                heading: translate('mergeAccountsPage.mergeFailureGenericHeading'),
                description: translate('mergeAccountsPage.mergeFailureUnvalidatedAccount.description'),
                buttonText: translate('common.buttonConfirm'),
                onButtonPress: () => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY),
                illustration: Illustrations.LockClosedOrange,
            },
            [CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_MERGE_SELF]: {
                heading: translate('mergeAccountsPage.mergeFailureGenericHeading'),
                description: translate('mergeAccountsPage.mergeFailureSelfMerge.description'),
                buttonText: translate('common.buttonConfirm'),
                onButtonPress: () => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY),
                illustration: Illustrations.LockClosedOrange,
            },
        };
    }, [login, translate, userEmailOrPhone, styles, environmentURL]);
    (0, react_1.useEffect)(() => {
        /**
         * If the result is success, we need to remove the initial screen from the navigation state
         * so that the back button closes the modal instead of going back to the initial screen.
         */
        if (result !== CONST_1.default.MERGE_ACCOUNT_RESULTS.SUCCESS) {
            return;
        }
        react_native_1.InteractionManager.runAfterInteractions(() => {
            Navigation_1.default.removeScreenFromNavigationState(SCREENS_1.default.SETTINGS.MERGE_ACCOUNTS.ACCOUNT_DETAILS);
        });
    }, [result]);
    const { heading, headingStyle, onButtonPress, descriptionStyle, illustration, illustrationStyle, description, descriptionComponent, buttonText, secondaryButtonText, onSecondaryButtonPress, shouldShowSecondaryButton, cta, ctaComponent, ctaStyle, } = results[result] || defaultResult;
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom testID={MergeResultPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('mergeAccountsPage.mergeAccount')} shouldShowBackButton={result !== CONST_1.default.MERGE_ACCOUNT_RESULTS.SUCCESS} onBackButtonPress={() => {
            Navigation_1.default.goBack(backTo ?? ROUTES_1.default.SETTINGS_MERGE_ACCOUNTS.getRoute());
        }} shouldDisplayHelpButton={false}/>
            <ConfirmationPage_1.default containerStyle={{ ...styles.flexGrow1, ...styles.mt3 }} heading={heading} headingStyle={headingStyle} onButtonPress={onButtonPress} shouldShowButton buttonText={buttonText} shouldShowSecondaryButton={shouldShowSecondaryButton} secondaryButtonText={secondaryButtonText} onSecondaryButtonPress={onSecondaryButtonPress} description={description} descriptionStyle={[descriptionStyle, styles.textSupporting]} illustration={illustration} illustrationStyle={illustrationStyle} cta={cta} ctaStyle={ctaStyle} descriptionComponent={descriptionComponent} ctaComponent={ctaComponent}/>
        </ScreenWrapper_1.default>);
}
MergeResultPage.displayName = 'MergeResultPage';
exports.default = MergeResultPage;
