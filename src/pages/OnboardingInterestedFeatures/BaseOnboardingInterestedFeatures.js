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
var Checkbox_1 = require("@components/Checkbox");
var CustomStatusBarAndBackgroundContext_1 = require("@components/CustomStatusBarAndBackground/CustomStatusBarAndBackgroundContext");
var FixedFooter_1 = require("@components/FixedFooter");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var Icon_1 = require("@components/Icon");
var Illustrations = require("@components/Icon/Illustrations");
var Pressable_1 = require("@components/Pressable");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var ScrollView_1 = require("@components/ScrollView");
var Section_1 = require("@components/Section");
var Text_1 = require("@components/Text");
var useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var useOnboardingMessages_1 = require("@hooks/useOnboardingMessages");
var useOnyx_1 = require("@hooks/useOnyx");
var usePermissions_1 = require("@hooks/usePermissions");
var usePrevious_1 = require("@hooks/usePrevious");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Link_1 = require("@libs/actions/Link");
var Policy_1 = require("@libs/actions/Policy/Policy");
var Report_1 = require("@libs/actions/Report");
var Welcome_1 = require("@libs/actions/Welcome");
var types_1 = require("@libs/API/types");
var navigateAfterOnboarding_1 = require("@libs/navigateAfterOnboarding");
var Navigation_1 = require("@libs/Navigation/Navigation");
var SequentialQueue_1 = require("@libs/Network/SequentialQueue");
var OnboardingUtils_1 = require("@libs/OnboardingUtils");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var HybridApp_1 = require("@userActions/HybridApp");
var CONFIG_1 = require("@src/CONFIG");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
function BaseOnboardingInterestedFeatures(_a) {
    var shouldUseNativeStyles = _a.shouldUseNativeStyles;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var onboardingMessages = (0, useOnboardingMessages_1.default)().onboardingMessages;
    var setRootStatusBarEnabled = (0, react_1.useContext)(CustomStatusBarAndBackgroundContext_1.default).setRootStatusBarEnabled;
    // We need to use isSmallScreenWidth, see navigateAfterOnboarding function comment
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    var _b = (0, useResponsiveLayout_1.default)(), onboardingIsMediumOrLargerScreenWidth = _b.onboardingIsMediumOrLargerScreenWidth, isSmallScreenWidth = _b.isSmallScreenWidth;
    var onboardingPurposeSelected = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_PURPOSE_SELECTED, { canBeMissing: true })[0];
    var onboardingPolicyID = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_POLICY_ID, { canBeMissing: true })[0];
    var currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    var allPolicies = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false })[0];
    var onboardingAdminsChatReportID = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_ADMINS_CHAT_REPORT_ID, { canBeMissing: true })[0];
    var onboardingCompanySize = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_COMPANY_SIZE, { canBeMissing: true })[0];
    var userReportedIntegration = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_USER_REPORTED_INTEGRATION, { canBeMissing: true })[0];
    var isBetaEnabled = (0, usePermissions_1.default)().isBetaEnabled;
    var session = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false })[0];
    var paidGroupPolicy = Object.values(allPolicies !== null && allPolicies !== void 0 ? allPolicies : {}).find(function (policy) { return (0, PolicyUtils_1.isPaidGroupPolicy)(policy) && (0, PolicyUtils_1.isPolicyAdmin)(policy, session === null || session === void 0 ? void 0 : session.email); });
    var onboarding = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, { canBeMissing: true })[0];
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var isLoading = onboarding === null || onboarding === void 0 ? void 0 : onboarding.isLoading;
    var prevIsLoading = (0, usePrevious_1.default)(isLoading);
    var _c = (0, react_1.useState)(0), width = _c[0], setWidth = _c[1];
    var features = (0, react_1.useMemo)(function () {
        return [
            {
                id: CONST_1.FEATURE_IDS.CATEGORIES,
                title: translate('workspace.moreFeatures.categories.title'),
                icon: Illustrations.FolderOpen,
                enabledByDefault: true,
                apiEndpoint: types_1.WRITE_COMMANDS.ENABLE_POLICY_CATEGORIES,
            },
            {
                id: CONST_1.FEATURE_IDS.ACCOUNTING,
                title: translate('workspace.moreFeatures.connections.title'),
                icon: Illustrations.Accounting,
                enabledByDefault: !!userReportedIntegration,
                apiEndpoint: types_1.WRITE_COMMANDS.ENABLE_POLICY_CONNECTIONS,
            },
            {
                id: CONST_1.FEATURE_IDS.COMPANY_CARDS,
                title: translate('workspace.moreFeatures.companyCards.title'),
                icon: Illustrations.CompanyCard,
                enabledByDefault: true,
                apiEndpoint: types_1.WRITE_COMMANDS.ENABLE_POLICY_COMPANY_CARDS,
            },
            {
                id: CONST_1.FEATURE_IDS.WORKFLOWS,
                title: translate('workspace.moreFeatures.workflows.title'),
                icon: Illustrations.Workflows,
                enabledByDefault: true,
                apiEndpoint: types_1.WRITE_COMMANDS.ENABLE_POLICY_WORKFLOWS,
            },
            {
                id: CONST_1.FEATURE_IDS.INVOICES,
                title: translate('workspace.moreFeatures.invoices.title'),
                icon: Illustrations.InvoiceBlue,
                apiEndpoint: types_1.WRITE_COMMANDS.ENABLE_POLICY_INVOICING,
            },
            {
                id: CONST_1.FEATURE_IDS.RULES,
                title: translate('workspace.moreFeatures.rules.title'),
                icon: Illustrations.Rules,
                apiEndpoint: types_1.WRITE_COMMANDS.SET_POLICY_RULES_ENABLED,
                requiresUpdate: true,
            },
            {
                id: CONST_1.FEATURE_IDS.DISTANCE_RATES,
                title: translate('workspace.moreFeatures.distanceRates.title'),
                icon: Illustrations.Car,
                apiEndpoint: types_1.WRITE_COMMANDS.ENABLE_POLICY_DISTANCE_RATES,
            },
            {
                id: CONST_1.FEATURE_IDS.EXPENSIFY_CARD,
                title: translate('workspace.moreFeatures.expensifyCard.title'),
                icon: Illustrations.HandCard,
                apiEndpoint: types_1.WRITE_COMMANDS.ENABLE_POLICY_EXPENSIFY_CARDS,
            },
            {
                id: CONST_1.FEATURE_IDS.TAGS,
                title: translate('workspace.moreFeatures.tags.title'),
                icon: Illustrations.Tag,
                apiEndpoint: types_1.WRITE_COMMANDS.ENABLE_POLICY_TAGS,
            },
            {
                id: CONST_1.FEATURE_IDS.PER_DIEM,
                title: translate('workspace.moreFeatures.perDiem.title'),
                icon: Illustrations.PerDiem,
                apiEndpoint: types_1.WRITE_COMMANDS.TOGGLE_POLICY_PER_DIEM,
                requiresUpdate: true,
            },
        ];
    }, [translate, userReportedIntegration]);
    var _d = (0, react_1.useState)(function () { return features.filter(function (feature) { return feature.enabledByDefault; }).map(function (feature) { return feature.id; }); }), selectedFeatures = _d[0], setSelectedFeatures = _d[1];
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
            setRootStatusBarEnabled(false);
            return;
        }
        // Wait for CompleteGuidedSetup and CreateWorkspace to complete before redirecting to OldDot to prevent showing this onboarding modal again.
        (0, SequentialQueue_1.waitForIdle)().then(function () {
            (0, Link_1.openOldDotLink)(CONST_1.default.OLDDOT_URLS.INBOX, true);
        });
    }, [isLoading, prevIsLoading, setRootStatusBarEnabled]);
    var handleContinue = (0, react_1.useCallback)(function () {
        var _a, _b;
        if (!onboardingPurposeSelected || !onboardingCompanySize) {
            return;
        }
        var shouldCreateWorkspace = !onboardingPolicyID && !paidGroupPolicy;
        var newUserReportedIntegration = selectedFeatures.some(function (feature) { return feature === 'accounting'; }) ? userReportedIntegration : undefined;
        var featuresMap = features.map(function (feature) { return (__assign(__assign({}, feature), { enabled: selectedFeatures.includes(feature.id) })); });
        // We need `adminsChatReportID` for `completeOnboarding`, but at the same time, we don't want to call `createWorkspace` more than once.
        // If we have already created a workspace, we want to reuse the `onboardingAdminsChatReportID` and `onboardingPolicyID`.
        var _c = shouldCreateWorkspace
            ? (0, Policy_1.createWorkspace)({
                policyOwnerEmail: undefined,
                makeMeAdmin: true,
                policyName: '',
                policyID: (0, Policy_1.generatePolicyID)(),
                engagementChoice: CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM,
                currency: (_a = currentUserPersonalDetails === null || currentUserPersonalDetails === void 0 ? void 0 : currentUserPersonalDetails.localCurrencyCode) !== null && _a !== void 0 ? _a : '',
                file: undefined,
                shouldAddOnboardingTasks: false,
                companySize: onboardingCompanySize,
                userReportedIntegration: newUserReportedIntegration,
                featuresMap: featuresMap,
            })
            : { adminsChatReportID: onboardingAdminsChatReportID, policyID: onboardingPolicyID, type: undefined }, adminsChatReportID = _c.adminsChatReportID, policyID = _c.policyID, type = _c.type;
        if (policyID) {
            (0, Policy_1.updateInterestedFeatures)(featuresMap, policyID, type);
        }
        if (shouldCreateWorkspace) {
            (0, Welcome_1.setOnboardingAdminsChatReportID)(adminsChatReportID);
            (0, Welcome_1.setOnboardingPolicyID)(policyID);
        }
        (0, Report_1.completeOnboarding)({
            engagementChoice: onboardingPurposeSelected,
            onboardingMessage: onboardingMessages[onboardingPurposeSelected],
            adminsChatReportID: adminsChatReportID,
            onboardingPolicyID: policyID,
            companySize: onboardingCompanySize,
            userReportedIntegration: newUserReportedIntegration,
            firstName: currentUserPersonalDetails === null || currentUserPersonalDetails === void 0 ? void 0 : currentUserPersonalDetails.firstName,
            lastName: currentUserPersonalDetails === null || currentUserPersonalDetails === void 0 ? void 0 : currentUserPersonalDetails.lastName,
            selectedInterestedFeatures: featuresMap.filter(function (feature) { return feature.enabled; }).map(function (feature) { return feature.id; }),
        });
        if ((0, OnboardingUtils_1.shouldOnboardingRedirectToOldDot)(onboardingCompanySize, newUserReportedIntegration)) {
            // Do not call openOldDotLink here because it will cause a navigation loop. See https://github.com/Expensify/App/issues/61363
            return;
        }
        // Avoid creating new WS because onboardingPolicyID is cleared before unmounting
        react_native_1.InteractionManager.runAfterInteractions(function () {
            (0, Welcome_1.setOnboardingAdminsChatReportID)();
            (0, Welcome_1.setOnboardingPolicyID)();
        });
        // We need to wait the policy is created before navigating out the onboarding flow
        (0, navigateAfterOnboarding_1.navigateAfterOnboardingWithMicrotaskQueue)(isSmallScreenWidth, isBetaEnabled(CONST_1.default.BETAS.DEFAULT_ROOMS), policyID, adminsChatReportID, 
        // Onboarding tasks would show in Concierge instead of admins room for testing accounts, we should open where onboarding tasks are located
        // See https://github.com/Expensify/App/issues/57167 for more details
        ((_b = session === null || session === void 0 ? void 0 : session.email) !== null && _b !== void 0 ? _b : '').includes('+'));
    }, [
        isBetaEnabled,
        isSmallScreenWidth,
        onboardingAdminsChatReportID,
        onboardingCompanySize,
        onboardingMessages,
        onboardingPolicyID,
        onboardingPurposeSelected,
        paidGroupPolicy,
        session === null || session === void 0 ? void 0 : session.email,
        userReportedIntegration,
        features,
        selectedFeatures,
        currentUserPersonalDetails === null || currentUserPersonalDetails === void 0 ? void 0 : currentUserPersonalDetails.firstName,
        currentUserPersonalDetails === null || currentUserPersonalDetails === void 0 ? void 0 : currentUserPersonalDetails.lastName,
        currentUserPersonalDetails === null || currentUserPersonalDetails === void 0 ? void 0 : currentUserPersonalDetails.localCurrencyCode,
    ]);
    // Create items for enabled features
    var enabledFeatures = features
        .filter(function (feature) { return feature.enabledByDefault; })
        .map(function (feature) { return (__assign({}, feature)); });
    // Create items for features they may be interested in
    var mayBeInterestedFeatures = features
        .filter(function (feature) { return !feature.enabledByDefault; })
        .map(function (feature) { return (__assign({}, feature)); });
    // Define sections
    var sections = [
        {
            titleTranslationKey: 'onboarding.interestedFeatures.featuresAlreadyEnabled',
            items: enabledFeatures,
        },
        {
            titleTranslationKey: 'onboarding.interestedFeatures.featureYouMayBeInterestedIn',
            items: mayBeInterestedFeatures,
        },
    ];
    var handleFeatureSelect = (0, react_1.useCallback)(function (featureId) {
        setSelectedFeatures(function (prev) {
            if (prev.includes(featureId)) {
                return prev.filter(function (id) { return id !== featureId; });
            }
            return __spreadArray(__spreadArray([], prev, true), [featureId], false);
        });
    }, []);
    var gap = styles.gap3.gap;
    var renderItem = (0, react_1.useCallback)(function (item) {
        var isSelected = selectedFeatures.includes(item.id);
        return (<Pressable_1.PressableWithoutFeedback key={item.id} onPress={function () {
                handleFeatureSelect(item.id);
            }} accessibilityLabel={item.title} accessible={false} hoverStyle={!isSelected ? styles.hoveredComponentBG : undefined} style={[styles.onboardingInterestedFeaturesItem, isSmallScreenWidth ? styles.flexBasis100 : { maxWidth: (width - gap) / 2 }, isSelected && styles.activeComponentBG]}>
                    <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.gap3]}>
                        <Icon_1.default src={item.icon} width={48} height={48}/>
                        <Text_1.default style={[styles.textStrong]}>{item.title}</Text_1.default>
                    </react_native_1.View>
                    <Checkbox_1.default accessibilityLabel={item.title} isChecked={isSelected} onPress={function () {
                handleFeatureSelect(item.id);
            }}/>
                </Pressable_1.PressableWithoutFeedback>);
    }, [styles, isSmallScreenWidth, selectedFeatures, handleFeatureSelect, width, gap]);
    var renderSection = (0, react_1.useCallback)(function (section) { return (<Section_1.default key={section.titleTranslationKey} containerStyles={[styles.p0, styles.mh0, styles.bgTransparent, styles.noBorderRadius]} childrenStyles={[styles.flexRow, styles.flexWrap, styles.gap3]} renderTitle={function () { return <Text_1.default style={[styles.mutedNormalTextLabel, styles.mb3]}>{translate(section.titleTranslationKey)}</Text_1.default>; }} subtitleMuted>
                {section.items.map(renderItem)}
            </Section_1.default>); }, [styles, renderItem, translate]);
    return (<ScreenWrapper_1.default testID="BaseOnboardingInterestedFeatures" style={[styles.defaultModalContainer, shouldUseNativeStyles && styles.pt8]} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default shouldShowBackButton progressBarPercentage={90} onBackButtonPress={function () { return Navigation_1.default.goBack(ROUTES_1.default.ONBOARDING_ACCOUNTING.getRoute()); }}/>
            <react_native_1.View style={[onboardingIsMediumOrLargerScreenWidth && styles.mt5, onboardingIsMediumOrLargerScreenWidth ? styles.mh8 : styles.mh5]}>
                <Text_1.default style={[styles.textHeadlineH1, styles.mb5]}>{translate('onboarding.interestedFeatures.title')}</Text_1.default>
            </react_native_1.View>

            <ScrollView_1.default onLayout={function (e) {
            setWidth(e.nativeEvent.layout.width);
        }} style={[onboardingIsMediumOrLargerScreenWidth ? styles.mh8 : styles.mh5]}>
                {sections.map(renderSection)}
            </ScrollView_1.default>

            <FixedFooter_1.default style={[styles.pt3, styles.ph5]}>
                <Button_1.default success large text={translate('common.continue')} onPress={handleContinue} isLoading={isLoading} isDisabled={isOffline} pressOnEnter/>
            </FixedFooter_1.default>
        </ScreenWrapper_1.default>);
}
BaseOnboardingInterestedFeatures.displayName = 'BaseOnboardingInterestedFeatures';
exports.default = BaseOnboardingInterestedFeatures;
