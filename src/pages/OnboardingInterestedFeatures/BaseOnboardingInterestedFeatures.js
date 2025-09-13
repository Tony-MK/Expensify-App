"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Checkbox_1 = require("@components/Checkbox");
const CustomStatusBarAndBackgroundContext_1 = require("@components/CustomStatusBarAndBackground/CustomStatusBarAndBackgroundContext");
const FixedFooter_1 = require("@components/FixedFooter");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const Illustrations = require("@components/Icon/Illustrations");
const Pressable_1 = require("@components/Pressable");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Section_1 = require("@components/Section");
const Text_1 = require("@components/Text");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnboardingMessages_1 = require("@hooks/useOnboardingMessages");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const usePrevious_1 = require("@hooks/usePrevious");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Link_1 = require("@libs/actions/Link");
const Policy_1 = require("@libs/actions/Policy/Policy");
const Report_1 = require("@libs/actions/Report");
const Welcome_1 = require("@libs/actions/Welcome");
const types_1 = require("@libs/API/types");
const navigateAfterOnboarding_1 = require("@libs/navigateAfterOnboarding");
const Navigation_1 = require("@libs/Navigation/Navigation");
const SequentialQueue_1 = require("@libs/Network/SequentialQueue");
const OnboardingUtils_1 = require("@libs/OnboardingUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const HybridApp_1 = require("@userActions/HybridApp");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function BaseOnboardingInterestedFeatures({ shouldUseNativeStyles }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { onboardingMessages } = (0, useOnboardingMessages_1.default)();
    const { setRootStatusBarEnabled } = (0, react_1.useContext)(CustomStatusBarAndBackgroundContext_1.default);
    // We need to use isSmallScreenWidth, see navigateAfterOnboarding function comment
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { onboardingIsMediumOrLargerScreenWidth, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const [onboardingPurposeSelected] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_PURPOSE_SELECTED, { canBeMissing: true });
    const [onboardingPolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_POLICY_ID, { canBeMissing: true });
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const [allPolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false });
    const [onboardingAdminsChatReportID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_ADMINS_CHAT_REPORT_ID, { canBeMissing: true });
    const [onboardingCompanySize] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_COMPANY_SIZE, { canBeMissing: true });
    const [userReportedIntegration] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_USER_REPORTED_INTEGRATION, { canBeMissing: true });
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const paidGroupPolicy = Object.values(allPolicies ?? {}).find((policy) => (0, PolicyUtils_1.isPaidGroupPolicy)(policy) && (0, PolicyUtils_1.isPolicyAdmin)(policy, session?.email));
    const [onboarding] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, { canBeMissing: true });
    const { isOffline } = (0, useNetwork_1.default)();
    const isLoading = onboarding?.isLoading;
    const prevIsLoading = (0, usePrevious_1.default)(isLoading);
    const [width, setWidth] = (0, react_1.useState)(0);
    const features = (0, react_1.useMemo)(() => {
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
    const [selectedFeatures, setSelectedFeatures] = (0, react_1.useState)(() => features.filter((feature) => feature.enabledByDefault).map((feature) => feature.id));
    // Set onboardingPolicyID and onboardingAdminsChatReportID if a workspace is created by the backend for OD signup
    (0, react_1.useEffect)(() => {
        if (!paidGroupPolicy || onboardingPolicyID) {
            return;
        }
        (0, Welcome_1.setOnboardingAdminsChatReportID)(paidGroupPolicy.chatReportIDAdmins?.toString());
        (0, Welcome_1.setOnboardingPolicyID)(paidGroupPolicy.id);
    }, [paidGroupPolicy, onboardingPolicyID]);
    (0, react_1.useEffect)(() => {
        if (!!isLoading || !prevIsLoading) {
            return;
        }
        if (CONFIG_1.default.IS_HYBRID_APP) {
            (0, HybridApp_1.closeReactNativeApp)({ shouldSetNVP: true });
            setRootStatusBarEnabled(false);
            return;
        }
        // Wait for CompleteGuidedSetup and CreateWorkspace to complete before redirecting to OldDot to prevent showing this onboarding modal again.
        (0, SequentialQueue_1.waitForIdle)().then(() => {
            (0, Link_1.openOldDotLink)(CONST_1.default.OLDDOT_URLS.INBOX, true);
        });
    }, [isLoading, prevIsLoading, setRootStatusBarEnabled]);
    const handleContinue = (0, react_1.useCallback)(() => {
        if (!onboardingPurposeSelected || !onboardingCompanySize) {
            return;
        }
        const shouldCreateWorkspace = !onboardingPolicyID && !paidGroupPolicy;
        const newUserReportedIntegration = selectedFeatures.some((feature) => feature === 'accounting') ? userReportedIntegration : undefined;
        const featuresMap = features.map((feature) => ({
            ...feature,
            enabled: selectedFeatures.includes(feature.id),
        }));
        // We need `adminsChatReportID` for `completeOnboarding`, but at the same time, we don't want to call `createWorkspace` more than once.
        // If we have already created a workspace, we want to reuse the `onboardingAdminsChatReportID` and `onboardingPolicyID`.
        const { adminsChatReportID, policyID, type } = shouldCreateWorkspace
            ? (0, Policy_1.createWorkspace)({
                policyOwnerEmail: undefined,
                makeMeAdmin: true,
                policyName: '',
                policyID: (0, Policy_1.generatePolicyID)(),
                engagementChoice: CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM,
                currency: currentUserPersonalDetails?.localCurrencyCode ?? '',
                file: undefined,
                shouldAddOnboardingTasks: false,
                companySize: onboardingCompanySize,
                userReportedIntegration: newUserReportedIntegration,
                featuresMap,
            })
            : { adminsChatReportID: onboardingAdminsChatReportID, policyID: onboardingPolicyID, type: undefined };
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
            adminsChatReportID,
            onboardingPolicyID: policyID,
            companySize: onboardingCompanySize,
            userReportedIntegration: newUserReportedIntegration,
            firstName: currentUserPersonalDetails?.firstName,
            lastName: currentUserPersonalDetails?.lastName,
            selectedInterestedFeatures: featuresMap.filter((feature) => feature.enabled).map((feature) => feature.id),
        });
        if ((0, OnboardingUtils_1.shouldOnboardingRedirectToOldDot)(onboardingCompanySize, newUserReportedIntegration)) {
            // Do not call openOldDotLink here because it will cause a navigation loop. See https://github.com/Expensify/App/issues/61363
            return;
        }
        // Avoid creating new WS because onboardingPolicyID is cleared before unmounting
        react_native_1.InteractionManager.runAfterInteractions(() => {
            (0, Welcome_1.setOnboardingAdminsChatReportID)();
            (0, Welcome_1.setOnboardingPolicyID)();
        });
        // We need to wait the policy is created before navigating out the onboarding flow
        (0, navigateAfterOnboarding_1.navigateAfterOnboardingWithMicrotaskQueue)(isSmallScreenWidth, isBetaEnabled(CONST_1.default.BETAS.DEFAULT_ROOMS), policyID, adminsChatReportID, 
        // Onboarding tasks would show in Concierge instead of admins room for testing accounts, we should open where onboarding tasks are located
        // See https://github.com/Expensify/App/issues/57167 for more details
        (session?.email ?? '').includes('+'));
    }, [
        isBetaEnabled,
        isSmallScreenWidth,
        onboardingAdminsChatReportID,
        onboardingCompanySize,
        onboardingMessages,
        onboardingPolicyID,
        onboardingPurposeSelected,
        paidGroupPolicy,
        session?.email,
        userReportedIntegration,
        features,
        selectedFeatures,
        currentUserPersonalDetails?.firstName,
        currentUserPersonalDetails?.lastName,
        currentUserPersonalDetails?.localCurrencyCode,
    ]);
    // Create items for enabled features
    const enabledFeatures = features
        .filter((feature) => feature.enabledByDefault)
        .map((feature) => ({
        ...feature,
    }));
    // Create items for features they may be interested in
    const mayBeInterestedFeatures = features
        .filter((feature) => !feature.enabledByDefault)
        .map((feature) => ({
        ...feature,
    }));
    // Define sections
    const sections = [
        {
            titleTranslationKey: 'onboarding.interestedFeatures.featuresAlreadyEnabled',
            items: enabledFeatures,
        },
        {
            titleTranslationKey: 'onboarding.interestedFeatures.featureYouMayBeInterestedIn',
            items: mayBeInterestedFeatures,
        },
    ];
    const handleFeatureSelect = (0, react_1.useCallback)((featureId) => {
        setSelectedFeatures((prev) => {
            if (prev.includes(featureId)) {
                return prev.filter((id) => id !== featureId);
            }
            return [...prev, featureId];
        });
    }, []);
    const gap = styles.gap3.gap;
    const renderItem = (0, react_1.useCallback)((item) => {
        const isSelected = selectedFeatures.includes(item.id);
        return (<Pressable_1.PressableWithoutFeedback key={item.id} onPress={() => {
                handleFeatureSelect(item.id);
            }} accessibilityLabel={item.title} accessible={false} hoverStyle={!isSelected ? styles.hoveredComponentBG : undefined} style={[styles.onboardingInterestedFeaturesItem, isSmallScreenWidth ? styles.flexBasis100 : { maxWidth: (width - gap) / 2 }, isSelected && styles.activeComponentBG]}>
                    <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.gap3]}>
                        <Icon_1.default src={item.icon} width={48} height={48}/>
                        <Text_1.default style={[styles.textStrong]}>{item.title}</Text_1.default>
                    </react_native_1.View>
                    <Checkbox_1.default accessibilityLabel={item.title} isChecked={isSelected} onPress={() => {
                handleFeatureSelect(item.id);
            }}/>
                </Pressable_1.PressableWithoutFeedback>);
    }, [styles, isSmallScreenWidth, selectedFeatures, handleFeatureSelect, width, gap]);
    const renderSection = (0, react_1.useCallback)((section) => (<Section_1.default key={section.titleTranslationKey} containerStyles={[styles.p0, styles.mh0, styles.bgTransparent, styles.noBorderRadius]} childrenStyles={[styles.flexRow, styles.flexWrap, styles.gap3]} renderTitle={() => <Text_1.default style={[styles.mutedNormalTextLabel, styles.mb3]}>{translate(section.titleTranslationKey)}</Text_1.default>} subtitleMuted>
                {section.items.map(renderItem)}
            </Section_1.default>), [styles, renderItem, translate]);
    return (<ScreenWrapper_1.default testID="BaseOnboardingInterestedFeatures" style={[styles.defaultModalContainer, shouldUseNativeStyles && styles.pt8]} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default shouldShowBackButton progressBarPercentage={90} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.ONBOARDING_ACCOUNTING.getRoute())}/>
            <react_native_1.View style={[onboardingIsMediumOrLargerScreenWidth && styles.mt5, onboardingIsMediumOrLargerScreenWidth ? styles.mh8 : styles.mh5]}>
                <Text_1.default style={[styles.textHeadlineH1, styles.mb5]}>{translate('onboarding.interestedFeatures.title')}</Text_1.default>
            </react_native_1.View>

            <ScrollView_1.default onLayout={(e) => {
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
