"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const UserListItem_1 = require("@components/SelectionList/UserListItem");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnboardingMessages_1 = require("@hooks/useOnboardingMessages");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const navigateAfterOnboarding_1 = require("@libs/navigateAfterOnboarding");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const UserUtils_1 = require("@libs/UserUtils");
const Member_1 = require("@userActions/Policy/Member");
const Policy_1 = require("@userActions/Policy/Policy");
const Report_1 = require("@userActions/Report");
const Welcome_1 = require("@userActions/Welcome");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function BaseOnboardingWorkspaces({ route, shouldUseNativeStyles }) {
    const { isOffline } = (0, useNetwork_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { onboardingMessages } = (0, useOnboardingMessages_1.default)();
    // We need to use isSmallScreenWidth, see navigateAfterOnboarding function comment
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { onboardingIsMediumOrLargerScreenWidth, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const [joinablePolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.JOINABLE_POLICIES, { canBeMissing: true });
    const [getAccessiblePoliciesAction] = (0, useOnyx_1.default)(ONYXKEYS_1.default.VALIDATE_USER_AND_GET_ACCESSIBLE_POLICIES, { canBeMissing: true });
    const joinablePoliciesLoading = getAccessiblePoliciesAction?.loading;
    const joinablePoliciesLength = Object.keys(joinablePolicies ?? {}).length;
    const [onboardingPersonalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ONBOARDING_PERSONAL_DETAILS_FORM, { canBeMissing: true });
    const [loginList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LOGIN_LIST, { canBeMissing: true });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true });
    const isValidated = (0, UserUtils_1.isCurrentUserValidated)(loginList, session?.email);
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const [onboardingValues] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, { canBeMissing: true });
    const isVsb = onboardingValues?.signupQualifier === CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.VSB;
    const isSmb = onboardingValues?.signupQualifier === CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.SMB;
    const handleJoinWorkspace = (0, react_1.useCallback)((policy) => {
        if (policy.automaticJoiningEnabled) {
            (0, Member_1.joinAccessiblePolicy)(policy.policyID);
        }
        else {
            (0, Member_1.askToJoinPolicy)(policy.policyID);
        }
        (0, Report_1.completeOnboarding)({
            engagementChoice: CONST_1.default.ONBOARDING_CHOICES.LOOKING_AROUND,
            onboardingMessage: onboardingMessages[CONST_1.default.ONBOARDING_CHOICES.LOOKING_AROUND],
            firstName: onboardingPersonalDetails?.firstName ?? '',
            lastName: onboardingPersonalDetails?.lastName ?? '',
        });
        (0, Welcome_1.setOnboardingAdminsChatReportID)();
        (0, Welcome_1.setOnboardingPolicyID)(policy.policyID);
        (0, navigateAfterOnboarding_1.navigateAfterOnboardingWithMicrotaskQueue)(isSmallScreenWidth, isBetaEnabled(CONST_1.default.BETAS.DEFAULT_ROOMS), policy.automaticJoiningEnabled ? policy.policyID : undefined);
    }, [onboardingMessages, onboardingPersonalDetails?.firstName, onboardingPersonalDetails?.lastName, isSmallScreenWidth, isBetaEnabled]);
    const policyIDItems = (0, react_1.useMemo)(() => {
        return Object.values(joinablePolicies ?? {}).map((policyInfo) => {
            return {
                text: policyInfo.policyName,
                alternateText: translate('onboarding.workspaceMemberList', { employeeCount: policyInfo.employeeCount, policyOwner: policyInfo.policyOwner }),
                keyForList: policyInfo.policyID,
                isDisabled: true,
                rightElement: (<Button_1.default isDisabled={isOffline} success medium text={policyInfo.automaticJoiningEnabled ? translate('workspace.workspaceList.joinNow') : translate('workspace.workspaceList.askToJoin')} onPress={() => {
                        handleJoinWorkspace(policyInfo);
                    }}/>),
                icons: [
                    {
                        id: policyInfo.policyID,
                        source: (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policyInfo.policyName),
                        fallbackIcon: Expensicons.FallbackWorkspaceAvatar,
                        name: policyInfo.policyName,
                        type: CONST_1.default.ICON_TYPE_WORKSPACE,
                    },
                ],
            };
        });
    }, [translate, isOffline, joinablePolicies, handleJoinWorkspace]);
    const wrapperPadding = onboardingIsMediumOrLargerScreenWidth ? styles.mh8 : styles.mh5;
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        if (!isValidated || joinablePoliciesLength > 0 || joinablePoliciesLoading) {
            return;
        }
        (0, Policy_1.getAccessiblePolicies)();
    }, [isValidated, joinablePoliciesLength, joinablePoliciesLoading]));
    const handleBackButtonPress = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack();
    }, []);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom shouldEnableMaxHeight testID="BaseOnboardingWorkspaces" style={[styles.defaultModalContainer, shouldUseNativeStyles && styles.pt8]} shouldShowOfflineIndicator={isSmallScreenWidth}>
            <HeaderWithBackButton_1.default shouldShowBackButton progressBarPercentage={60} onBackButtonPress={handleBackButtonPress}/>
            <SelectionList_1.default sections={[{ data: policyIDItems }]} onSelectRow={() => { }} ListItem={UserListItem_1.default} listItemWrapperStyle={onboardingIsMediumOrLargerScreenWidth ? [styles.pl8, styles.pr8, styles.cursorDefault] : []} showLoadingPlaceholder={joinablePoliciesLoading} shouldStopPropagation showScrollIndicator headerContent={<react_native_1.View style={[wrapperPadding, onboardingIsMediumOrLargerScreenWidth && styles.mt5, styles.mb5]}>
                        <Text_1.default style={styles.textHeadlineH1}>{translate('onboarding.joinAWorkspace')}</Text_1.default>
                        <Text_1.default style={[styles.textSupporting, styles.mt3]}>{translate('onboarding.listOfWorkspaces')}</Text_1.default>
                    </react_native_1.View>} footerContent={<Button_1.default success={false} large text={translate('common.skip')} testID="onboardingWorkSpaceSkipButton" onPress={() => {
                if (isVsb) {
                    Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_ACCOUNTING.getRoute(route.params?.backTo));
                    return;
                }
                if (isSmb) {
                    Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_EMPLOYEES.getRoute(route.params?.backTo));
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_PURPOSE.getRoute(route.params?.backTo));
            }} style={[styles.mt5]}/>}/>
        </ScreenWrapper_1.default>);
}
BaseOnboardingWorkspaces.displayName = 'BaseOnboardingWorkspaces';
exports.default = BaseOnboardingWorkspaces;
