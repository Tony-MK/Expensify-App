"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var react_native_1 = require("react-native");
var ConfirmationPage_1 = require("@components/ConfirmationPage");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var Illustrations = require("@components/Icon/Illustrations");
var LottieAnimations_1 = require("@components/LottieAnimations");
var RenderHTML_1 = require("@components/RenderHTML");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var TextLink_1 = require("@components/TextLink");
var useEnvironment_1 = require("@hooks/useEnvironment");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Navigation_1 = require("@libs/Navigation/Navigation");
var HybridApp_1 = require("@userActions/HybridApp");
var Link_1 = require("@userActions/Link");
var CONFIG_1 = require("@src/CONFIG");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var SCREENS_1 = require("@src/SCREENS");
function MergeResultPage() {
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var userEmailOrPhone = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: function (session) { return session === null || session === void 0 ? void 0 : session.email; }, canBeMissing: true })[0];
    var params = (0, native_1.useRoute)().params;
    var environmentURL = (0, useEnvironment_1.default)().environmentURL;
    var result = params.result, login = params.login, backTo = params.backTo;
    var defaultResult = {
        heading: translate('mergeAccountsPage.mergeFailureGenericHeading'),
        buttonText: translate('common.buttonConfirm'),
        illustration: Illustrations.LockClosedOrange,
    };
    var results = (0, react_1.useMemo)(function () {
        var _a;
        return _a = {},
            _a[CONST_1.default.MERGE_ACCOUNT_RESULTS.SUCCESS] = {
                heading: translate('mergeAccountsPage.mergeSuccess.accountsMerged'),
                descriptionComponent: (<react_native_1.View style={[styles.renderHTML, styles.w100, styles.flexRow]}>
                        <RenderHTML_1.default html={translate('mergeAccountsPage.mergeSuccess.description', { from: login, to: userEmailOrPhone !== null && userEmailOrPhone !== void 0 ? userEmailOrPhone : '' })}/>
                    </react_native_1.View>),
                buttonText: translate('common.buttonConfirm'),
                onButtonPress: function () { return Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY); },
                illustration: LottieAnimations_1.default.Fireworks,
                illustrationStyle: { width: 150, height: 150 },
            },
            _a[CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_NO_EXIST] = {
                heading: translate('mergeAccountsPage.mergeFailureGenericHeading'),
                descriptionComponent: (<react_native_1.View style={[styles.renderHTML, styles.w100, styles.flexRow]}>
                        <RenderHTML_1.default html={translate('mergeAccountsPage.mergeFailureUncreatedAccountDescription', {
                        email: login,
                        contactMethodLink: "".concat(environmentURL, "/").concat(ROUTES_1.default.SETTINGS_CONTACT_METHODS.route),
                    })}/>
                    </react_native_1.View>),
                onButtonPress: function () { return Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY); },
                buttonText: translate('common.buttonConfirm'),
                illustration: Illustrations.LockClosedOrange,
            },
            _a[CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_2FA] = {
                heading: translate('mergeAccountsPage.mergeFailureGenericHeading'),
                descriptionComponent: (<react_native_1.View style={[styles.renderHTML, styles.w100, styles.flexRow]}>
                        <RenderHTML_1.default html={translate('mergeAccountsPage.mergeFailure2FA.description', { email: login })}/>
                    </react_native_1.View>),
                cta: <TextLink_1.default href={CONST_1.default.MERGE_ACCOUNT_HELP_URL}>{translate('mergeAccountsPage.mergeFailure2FA.learnMore')}</TextLink_1.default>,
                ctaStyle: __assign(__assign({}, styles.mt2), styles.textSupporting),
                onButtonPress: function () { return Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY); },
                buttonText: translate('common.buttonConfirm'),
                illustration: Illustrations.LockClosedOrange,
            },
            _a[CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_SMART_SCANNER] = {
                heading: translate('mergeAccountsPage.mergeFailureGenericHeading'),
                descriptionComponent: (<react_native_1.View style={[styles.renderHTML, styles.w100, styles.flexRow]}>
                        <RenderHTML_1.default html={translate('mergeAccountsPage.mergeFailureSmartScannerAccountDescription', { email: login })}/>
                    </react_native_1.View>),
                buttonText: translate('common.buttonConfirm'),
                illustration: Illustrations.LockClosedOrange,
                onButtonPress: function () { return Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY); },
            },
            _a[CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_SAML_DOMAIN_CONTROL] = {
                heading: translate('mergeAccountsPage.mergeFailureGenericHeading'),
                descriptionComponent: (<react_native_1.View style={[styles.renderHTML, styles.w100, styles.flexRow]}>
                        <RenderHTML_1.default html={translate('mergeAccountsPage.mergeFailureSAMLDomainControlDescription', { email: login })}/>
                    </react_native_1.View>),
                buttonText: translate('common.buttonConfirm'),
                onButtonPress: function () { return Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY); },
                illustration: Illustrations.LockClosedOrange,
            },
            _a[CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_SAML_NOT_SUPPORTED] = {
                heading: translate('mergeAccountsPage.mergePendingSAML.weAreWorkingOnIt'),
                description: translate('mergeAccountsPage.mergePendingSAML.limitedSupport'),
                ctaComponent: (<react_native_1.View style={[styles.renderHTML, styles.mt2, styles.flexRow]}>
                        <RenderHTML_1.default html={translate('mergeAccountsPage.mergePendingSAML.reachOutForHelp')}/>
                    </react_native_1.View>),
                secondaryButtonText: translate('mergeAccountsPage.mergePendingSAML.goToExpensifyClassic'),
                onSecondaryButtonPress: function () {
                    if (CONFIG_1.default.IS_HYBRID_APP) {
                        (0, HybridApp_1.closeReactNativeApp)({ shouldSetNVP: true });
                        return;
                    }
                    (0, Link_1.openOldDotLink)(CONST_1.default.OLDDOT_URLS.INBOX, false);
                },
                shouldShowSecondaryButton: true,
                buttonText: translate('common.buttonConfirm'),
                onButtonPress: function () { return Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY); },
                illustration: Illustrations.RunningTurtle,
                illustrationStyle: { width: 132, height: 150 },
            },
            _a[CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_SAML_PRIMARY_LOGIN] = {
                heading: translate('mergeAccountsPage.mergeFailureGenericHeading'),
                descriptionComponent: (<react_native_1.View style={[styles.renderHTML, styles.w100, styles.flexRow]}>
                        <RenderHTML_1.default html={translate('mergeAccountsPage.mergeFailureSAMLAccountDescription', { email: login })}/>
                    </react_native_1.View>),
                buttonText: translate('common.buttonConfirm'),
                onButtonPress: function () { return Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY); },
                illustration: Illustrations.LockClosedOrange,
            },
            _a[CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_ACCOUNT_LOCKED] = {
                heading: translate('mergeAccountsPage.mergeFailureGenericHeading'),
                descriptionComponent: (<react_native_1.View style={[styles.renderHTML, styles.w100, styles.flexRow]}>
                        <RenderHTML_1.default html={translate('mergeAccountsPage.mergeFailureAccountLockedDescription', { email: login })}/>
                    </react_native_1.View>),
                buttonText: translate('common.buttonConfirm'),
                onButtonPress: function () { return Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY); },
                illustration: Illustrations.LockClosedOrange,
            },
            _a[CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_INVOICING] = {
                heading: translate('mergeAccountsPage.mergeFailureGenericHeading'),
                descriptionComponent: (<react_native_1.View style={[styles.renderHTML, styles.w100, styles.flexRow]}>
                        <RenderHTML_1.default html={translate('mergeAccountsPage.mergeFailureInvoicedAccountDescription', { email: login })}/>
                    </react_native_1.View>),
                buttonText: translate('common.buttonConfirm'),
                onButtonPress: function () { return Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY); },
                illustration: Illustrations.LockClosedOrange,
            },
            _a[CONST_1.default.MERGE_ACCOUNT_RESULTS.TOO_MANY_ATTEMPTS] = {
                heading: translate('mergeAccountsPage.mergeFailureTooManyAttempts.heading'),
                description: translate('mergeAccountsPage.mergeFailureTooManyAttempts.description'),
                buttonText: translate('common.buttonConfirm'),
                onButtonPress: function () { return Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY); },
                illustration: Illustrations.LockClosedOrange,
            },
            _a[CONST_1.default.MERGE_ACCOUNT_RESULTS.ACCOUNT_UNVALIDATED] = {
                heading: translate('mergeAccountsPage.mergeFailureGenericHeading'),
                description: translate('mergeAccountsPage.mergeFailureUnvalidatedAccount.description'),
                buttonText: translate('common.buttonConfirm'),
                onButtonPress: function () { return Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY); },
                illustration: Illustrations.LockClosedOrange,
            },
            _a[CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_MERGE_SELF] = {
                heading: translate('mergeAccountsPage.mergeFailureGenericHeading'),
                description: translate('mergeAccountsPage.mergeFailureSelfMerge.description'),
                buttonText: translate('common.buttonConfirm'),
                onButtonPress: function () { return Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_SECURITY); },
                illustration: Illustrations.LockClosedOrange,
            },
            _a;
    }, [login, translate, userEmailOrPhone, styles, environmentURL]);
    (0, react_1.useEffect)(function () {
        /**
         * If the result is success, we need to remove the initial screen from the navigation state
         * so that the back button closes the modal instead of going back to the initial screen.
         */
        if (result !== CONST_1.default.MERGE_ACCOUNT_RESULTS.SUCCESS) {
            return;
        }
        react_native_1.InteractionManager.runAfterInteractions(function () {
            Navigation_1.default.removeScreenFromNavigationState(SCREENS_1.default.SETTINGS.MERGE_ACCOUNTS.ACCOUNT_DETAILS);
        });
    }, [result]);
    var _a = results[result] || defaultResult, heading = _a.heading, headingStyle = _a.headingStyle, onButtonPress = _a.onButtonPress, descriptionStyle = _a.descriptionStyle, illustration = _a.illustration, illustrationStyle = _a.illustrationStyle, description = _a.description, descriptionComponent = _a.descriptionComponent, buttonText = _a.buttonText, secondaryButtonText = _a.secondaryButtonText, onSecondaryButtonPress = _a.onSecondaryButtonPress, shouldShowSecondaryButton = _a.shouldShowSecondaryButton, cta = _a.cta, ctaComponent = _a.ctaComponent, ctaStyle = _a.ctaStyle;
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom testID={MergeResultPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('mergeAccountsPage.mergeAccount')} shouldShowBackButton={result !== CONST_1.default.MERGE_ACCOUNT_RESULTS.SUCCESS} onBackButtonPress={function () {
            Navigation_1.default.goBack(backTo !== null && backTo !== void 0 ? backTo : ROUTES_1.default.SETTINGS_MERGE_ACCOUNTS.getRoute());
        }} shouldDisplayHelpButton={false}/>
            <ConfirmationPage_1.default containerStyle={__assign(__assign({}, styles.flexGrow1), styles.mt3)} heading={heading} headingStyle={headingStyle} onButtonPress={onButtonPress} shouldShowButton buttonText={buttonText} shouldShowSecondaryButton={shouldShowSecondaryButton} secondaryButtonText={secondaryButtonText} onSecondaryButtonPress={onSecondaryButtonPress} description={description} descriptionStyle={[descriptionStyle, styles.textSupporting]} illustration={illustration} illustrationStyle={illustrationStyle} cta={cta} ctaStyle={ctaStyle} descriptionComponent={descriptionComponent} ctaComponent={ctaComponent}/>
        </ScreenWrapper_1.default>);
}
MergeResultPage.displayName = 'MergeResultPage';
exports.default = MergeResultPage;
