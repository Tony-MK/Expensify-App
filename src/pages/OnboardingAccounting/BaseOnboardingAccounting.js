"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Button_1 = require("@components/Button");
var FixedFooter_1 = require("@components/FixedFooter");
var FormHelpMessage_1 = require("@components/FormHelpMessage");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var Icon_1 = require("@components/Icon");
var Expensicons = require("@components/Icon/Expensicons");
var Pressable_1 = require("@components/Pressable");
var RadioButtonWithLabel_1 = require("@components/RadioButtonWithLabel");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var ScrollView_1 = require("@components/ScrollView");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var useOnyx_1 = require("@hooks/useOnyx");
var usePrevious_1 = require("@hooks/usePrevious");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Link_1 = require("@libs/actions/Link");
var Welcome_1 = require("@libs/actions/Welcome");
var Navigation_1 = require("@libs/Navigation/Navigation");
var SequentialQueue_1 = require("@libs/Network/SequentialQueue");
var OnboardingUtils_1 = require("@libs/OnboardingUtils");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var variables_1 = require("@styles/variables");
var HybridApp_1 = require("@userActions/HybridApp");
var CONFIG_1 = require("@src/CONFIG");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var integrations = [
    {
        key: 'quickbooksOnline',
        icon: Expensicons.QBOCircle,
        translationKey: 'workspace.accounting.qbo',
    },
    {
        key: 'quickbooksDesktop',
        icon: Expensicons.QBDSquare,
        translationKey: 'workspace.accounting.qbd',
    },
    {
        key: 'xero',
        icon: Expensicons.XeroCircle,
        translationKey: 'workspace.accounting.xero',
    },
    {
        key: 'netsuite',
        icon: Expensicons.NetSuiteSquare,
        translationKey: 'workspace.accounting.netsuite',
    },
    {
        key: 'intacct',
        icon: Expensicons.IntacctSquare,
        translationKey: 'workspace.accounting.intacct',
    },
    {
        key: 'sap',
        icon: Expensicons.SapSquare,
        translationKey: 'workspace.accounting.sap',
    },
    {
        key: 'oracle',
        icon: Expensicons.OracleSquare,
        translationKey: 'workspace.accounting.oracle',
    },
    {
        key: 'microsoftDynamics',
        icon: Expensicons.MicrosoftDynamicsSquare,
        translationKey: 'workspace.accounting.microsoftDynamics',
    },
];
function BaseOnboardingAccounting(_a) {
    var _b;
    var shouldUseNativeStyles = _a.shouldUseNativeStyles, route = _a.route;
    var styles = (0, useThemeStyles_1.default)();
    var theme = (0, useTheme_1.default)();
    var StyleUtils = (0, useStyleUtils_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    // We need to use isSmallScreenWidth, see navigateAfterOnboarding function comment
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    var _c = (0, useResponsiveLayout_1.default)(), onboardingIsMediumOrLargerScreenWidth = _c.onboardingIsMediumOrLargerScreenWidth, isSmallScreenWidth = _c.isSmallScreenWidth;
    var onboardingPolicyID = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_POLICY_ID, { canBeMissing: true })[0];
    var allPolicies = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false })[0];
    var onboardingCompanySize = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_COMPANY_SIZE, { canBeMissing: true })[0];
    var session = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false })[0];
    var onboardingUserReportedIntegration = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_USER_REPORTED_INTEGRATION, { canBeMissing: true })[0];
    var _d = (0, react_1.useState)(onboardingUserReportedIntegration !== null && onboardingUserReportedIntegration !== void 0 ? onboardingUserReportedIntegration : undefined), userReportedIntegration = _d[0], setUserReportedIntegration = _d[1];
    var _e = (0, react_1.useState)(''), error = _e[0], setError = _e[1];
    var paidGroupPolicy = Object.values(allPolicies !== null && allPolicies !== void 0 ? allPolicies : {}).find(function (policy) { return (0, PolicyUtils_1.isPaidGroupPolicy)(policy) && (0, PolicyUtils_1.isPolicyAdmin)(policy, session === null || session === void 0 ? void 0 : session.email); });
    var onboarding = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, { canBeMissing: true })[0];
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var isLoading = onboarding === null || onboarding === void 0 ? void 0 : onboarding.isLoading;
    var prevIsLoading = (0, usePrevious_1.default)(isLoading);
    var isVsb = (onboarding === null || onboarding === void 0 ? void 0 : onboarding.signupQualifier) === CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.VSB;
    // Set onboardingPolicyID and onboardingAdminsChatReportID if a workspace is created by the backend for OD signup
    (0, react_1.useEffect)(function () {
        var _a;
        if (!paidGroupPolicy || onboardingPolicyID) {
            return;
        }
        (0, Welcome_1.setOnboardingAdminsChatReportID)((_a = paidGroupPolicy.chatReportIDAdmins) === null || _a === void 0 ? void 0 : _a.toString());
        (0, Welcome_1.setOnboardingPolicyID)(paidGroupPolicy.id);
    }, [paidGroupPolicy, onboardingPolicyID]);
    (0, react_1.useEffect)(function () {
        if (!!isLoading || !prevIsLoading) {
            return;
        }
        if (CONFIG_1.default.IS_HYBRID_APP) {
            (0, HybridApp_1.closeReactNativeApp)({ shouldSetNVP: true });
            return;
        }
        (0, SequentialQueue_1.waitForIdle)().then(function () {
            (0, Link_1.openOldDotLink)(CONST_1.default.OLDDOT_URLS.INBOX, true);
        });
    }, [isLoading, prevIsLoading]);
    var accountingOptions = (0, react_1.useMemo)(function () {
        var createAccountingOption = function (integration) { return ({
            keyForList: integration.key,
            text: translate(integration.translationKey),
            leftElement: (<Icon_1.default src={integration.icon} width={variables_1.default.iconSizeExtraLarge} height={variables_1.default.iconSizeExtraLarge} additionalStyles={[StyleUtils.getAvatarBorderStyle(CONST_1.default.AVATAR_SIZE.DEFAULT, CONST_1.default.ICON_TYPE_AVATAR), styles.mr3]}/>),
            isSelected: userReportedIntegration === integration.key,
        }); };
        var noneAccountingOption = {
            keyForList: null,
            text: translate('onboarding.accounting.none'),
            leftElement: (<Icon_1.default src={Expensicons.CircleSlash} width={variables_1.default.iconSizeNormal} height={variables_1.default.iconSizeNormal} fill={theme.icon} additionalStyles={[StyleUtils.getAvatarBorderStyle(CONST_1.default.AVATAR_SIZE.DEFAULT, CONST_1.default.ICON_TYPE_AVATAR), styles.mr3, styles.onboardingSmallIcon]}/>),
            isSelected: userReportedIntegration === null,
        };
        var othersAccountingOption = {
            keyForList: 'other',
            text: translate('workspace.accounting.other'),
            leftElement: (<Icon_1.default src={Expensicons.Connect} width={variables_1.default.iconSizeNormal} height={variables_1.default.iconSizeNormal} fill={theme.icon} additionalStyles={[StyleUtils.getAvatarBorderStyle(CONST_1.default.AVATAR_SIZE.DEFAULT, CONST_1.default.ICON_TYPE_AVATAR), styles.mr3, styles.onboardingSmallIcon]}/>),
            isSelected: userReportedIntegration === 'other',
        };
        return __spreadArray(__spreadArray([], integrations.map(createAccountingOption), true), [othersAccountingOption, noneAccountingOption], false);
    }, [StyleUtils, styles.mr3, styles.onboardingSmallIcon, theme.icon, translate, userReportedIntegration]);
    var handleContinue = (0, react_1.useCallback)(function () {
        var _a;
        if (userReportedIntegration === undefined) {
            setError(translate('onboarding.errorSelection'));
            return;
        }
        (0, Welcome_1.setOnboardingUserReportedIntegration)(userReportedIntegration);
        // Navigate to the next onboarding step interested features with the selected integration
        Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_INTERESTED_FEATURES.getRoute((_a = route.params) === null || _a === void 0 ? void 0 : _a.backTo));
    }, [translate, userReportedIntegration, (_b = route.params) === null || _b === void 0 ? void 0 : _b.backTo]);
    var handleIntegrationSelect = (0, react_1.useCallback)(function (integrationKey) {
        setUserReportedIntegration(integrationKey);
        setError('');
    }, []);
    var renderOption = (0, react_1.useCallback)(function (item) {
        var _a;
        return (<Pressable_1.PressableWithoutFeedback key={(_a = item.keyForList) !== null && _a !== void 0 ? _a : ''} onPress={function () { return handleIntegrationSelect(item.keyForList); }} accessibilityLabel={item.text} accessible={false} hoverStyle={!item.isSelected ? styles.hoveredComponentBG : undefined} style={[styles.onboardingAccountingItem, isSmallScreenWidth && styles.flexBasis100, item.isSelected && styles.activeComponentBG]}>
                <RadioButtonWithLabel_1.default isChecked={!!item.isSelected} onPress={function () { return handleIntegrationSelect(item.keyForList); }} style={[styles.flexRowReverse]} wrapperStyle={[styles.ml0]} labelElement={<react_native_1.View style={[styles.alignItemsCenter, styles.flexRow]}>
                            {item.leftElement}
                            <Text_1.default style={styles.textStrong}>{item.text}</Text_1.default>
                        </react_native_1.View>} shouldBlendOpacity/>
            </Pressable_1.PressableWithoutFeedback>);
    }, [
        handleIntegrationSelect,
        isSmallScreenWidth,
        styles.alignItemsCenter,
        styles.flexBasis100,
        styles.flexRow,
        styles.flexRowReverse,
        styles.ml0,
        styles.onboardingAccountingItem,
        styles.textStrong,
        styles.hoveredComponentBG,
        styles.activeComponentBG,
    ]);
    return (<ScreenWrapper_1.default testID="BaseOnboardingAccounting" style={[styles.defaultModalContainer, shouldUseNativeStyles && styles.pt8]} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default shouldShowBackButton={!isVsb} progressBarPercentage={80} onBackButtonPress={function () { return Navigation_1.default.goBack(ROUTES_1.default.ONBOARDING_EMPLOYEES.getRoute()); }}/>
            <react_native_1.View style={[onboardingIsMediumOrLargerScreenWidth && styles.mt5, onboardingIsMediumOrLargerScreenWidth ? styles.mh8 : styles.mh5]}>
                <Text_1.default style={[styles.textHeadlineH1, styles.mb5]}>{translate('onboarding.accounting.title')}</Text_1.default>
            </react_native_1.View>
            <ScrollView_1.default style={[onboardingIsMediumOrLargerScreenWidth ? styles.mh8 : styles.mh5, styles.pt3, styles.pb8]}>
                <react_native_1.View style={[styles.flexRow, styles.flexWrap, styles.gap3, styles.mb3]}>{accountingOptions.map(renderOption)}</react_native_1.View>
            </ScrollView_1.default>
            <FixedFooter_1.default style={[styles.pt3, styles.ph5]}>
                {!!error && (<FormHelpMessage_1.default style={[styles.ph1, styles.mb2]} isError message={error}/>)}

                <Button_1.default success large text={translate('common.continue')} onPress={handleContinue} isLoading={isLoading} isDisabled={isOffline && (0, OnboardingUtils_1.shouldOnboardingRedirectToOldDot)(onboardingCompanySize, userReportedIntegration)} pressOnEnter/>
            </FixedFooter_1.default>
        </ScreenWrapper_1.default>);
}
BaseOnboardingAccounting.displayName = 'BaseOnboardingAccounting';
exports.default = BaseOnboardingAccounting;
