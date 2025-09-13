"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Pressable_1 = require("@components/Pressable");
const RadioButtonWithLabel_1 = require("@components/RadioButtonWithLabel");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Link_1 = require("@libs/actions/Link");
const Welcome_1 = require("@libs/actions/Welcome");
const Navigation_1 = require("@libs/Navigation/Navigation");
const SequentialQueue_1 = require("@libs/Network/SequentialQueue");
const OnboardingUtils_1 = require("@libs/OnboardingUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const variables_1 = require("@styles/variables");
const HybridApp_1 = require("@userActions/HybridApp");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const integrations = [
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
function BaseOnboardingAccounting({ shouldUseNativeStyles, route }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    // We need to use isSmallScreenWidth, see navigateAfterOnboarding function comment
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { onboardingIsMediumOrLargerScreenWidth, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const [onboardingPolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_POLICY_ID, { canBeMissing: true });
    const [allPolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false });
    const [onboardingCompanySize] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_COMPANY_SIZE, { canBeMissing: true });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const [onboardingUserReportedIntegration] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_USER_REPORTED_INTEGRATION, { canBeMissing: true });
    const [userReportedIntegration, setUserReportedIntegration] = (0, react_1.useState)(onboardingUserReportedIntegration ?? undefined);
    const [error, setError] = (0, react_1.useState)('');
    const paidGroupPolicy = Object.values(allPolicies ?? {}).find((policy) => (0, PolicyUtils_1.isPaidGroupPolicy)(policy) && (0, PolicyUtils_1.isPolicyAdmin)(policy, session?.email));
    const [onboarding] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, { canBeMissing: true });
    const { isOffline } = (0, useNetwork_1.default)();
    const isLoading = onboarding?.isLoading;
    const prevIsLoading = (0, usePrevious_1.default)(isLoading);
    const isVsb = onboarding?.signupQualifier === CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.VSB;
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
            return;
        }
        (0, SequentialQueue_1.waitForIdle)().then(() => {
            (0, Link_1.openOldDotLink)(CONST_1.default.OLDDOT_URLS.INBOX, true);
        });
    }, [isLoading, prevIsLoading]);
    const accountingOptions = (0, react_1.useMemo)(() => {
        const createAccountingOption = (integration) => ({
            keyForList: integration.key,
            text: translate(integration.translationKey),
            leftElement: (<Icon_1.default src={integration.icon} width={variables_1.default.iconSizeExtraLarge} height={variables_1.default.iconSizeExtraLarge} additionalStyles={[StyleUtils.getAvatarBorderStyle(CONST_1.default.AVATAR_SIZE.DEFAULT, CONST_1.default.ICON_TYPE_AVATAR), styles.mr3]}/>),
            isSelected: userReportedIntegration === integration.key,
        });
        const noneAccountingOption = {
            keyForList: null,
            text: translate('onboarding.accounting.none'),
            leftElement: (<Icon_1.default src={Expensicons.CircleSlash} width={variables_1.default.iconSizeNormal} height={variables_1.default.iconSizeNormal} fill={theme.icon} additionalStyles={[StyleUtils.getAvatarBorderStyle(CONST_1.default.AVATAR_SIZE.DEFAULT, CONST_1.default.ICON_TYPE_AVATAR), styles.mr3, styles.onboardingSmallIcon]}/>),
            isSelected: userReportedIntegration === null,
        };
        const othersAccountingOption = {
            keyForList: 'other',
            text: translate('workspace.accounting.other'),
            leftElement: (<Icon_1.default src={Expensicons.Connect} width={variables_1.default.iconSizeNormal} height={variables_1.default.iconSizeNormal} fill={theme.icon} additionalStyles={[StyleUtils.getAvatarBorderStyle(CONST_1.default.AVATAR_SIZE.DEFAULT, CONST_1.default.ICON_TYPE_AVATAR), styles.mr3, styles.onboardingSmallIcon]}/>),
            isSelected: userReportedIntegration === 'other',
        };
        return [...integrations.map(createAccountingOption), othersAccountingOption, noneAccountingOption];
    }, [StyleUtils, styles.mr3, styles.onboardingSmallIcon, theme.icon, translate, userReportedIntegration]);
    const handleContinue = (0, react_1.useCallback)(() => {
        if (userReportedIntegration === undefined) {
            setError(translate('onboarding.errorSelection'));
            return;
        }
        (0, Welcome_1.setOnboardingUserReportedIntegration)(userReportedIntegration);
        // Navigate to the next onboarding step interested features with the selected integration
        Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_INTERESTED_FEATURES.getRoute(route.params?.backTo));
    }, [translate, userReportedIntegration, route.params?.backTo]);
    const handleIntegrationSelect = (0, react_1.useCallback)((integrationKey) => {
        setUserReportedIntegration(integrationKey);
        setError('');
    }, []);
    const renderOption = (0, react_1.useCallback)((item) => (<Pressable_1.PressableWithoutFeedback key={item.keyForList ?? ''} onPress={() => handleIntegrationSelect(item.keyForList)} accessibilityLabel={item.text} accessible={false} hoverStyle={!item.isSelected ? styles.hoveredComponentBG : undefined} style={[styles.onboardingAccountingItem, isSmallScreenWidth && styles.flexBasis100, item.isSelected && styles.activeComponentBG]}>
                <RadioButtonWithLabel_1.default isChecked={!!item.isSelected} onPress={() => handleIntegrationSelect(item.keyForList)} style={[styles.flexRowReverse]} wrapperStyle={[styles.ml0]} labelElement={<react_native_1.View style={[styles.alignItemsCenter, styles.flexRow]}>
                            {item.leftElement}
                            <Text_1.default style={styles.textStrong}>{item.text}</Text_1.default>
                        </react_native_1.View>} shouldBlendOpacity/>
            </Pressable_1.PressableWithoutFeedback>), [
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
            <HeaderWithBackButton_1.default shouldShowBackButton={!isVsb} progressBarPercentage={80} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.ONBOARDING_EMPLOYEES.getRoute())}/>
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
