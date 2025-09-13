"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollViewWithContext_1 = require("@components/ScrollViewWithContext");
const useHandleBackButton_1 = require("@hooks/useHandleBackButton");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const BankAccounts_1 = require("@libs/actions/BankAccounts");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const withPolicyAndFullscreenLoading_1 = require("./withPolicyAndFullscreenLoading");
function fetchData(policyID, skipVBBACal) {
    if (skipVBBACal) {
        return;
    }
    (0, BankAccounts_1.openWorkspaceView)(policyID);
}
function WorkspacePageWithSections({ backButtonRoute, children = () => null, footer = null, icon = undefined, headerText, policy, policyDraft, route, shouldUseScrollView = false, showLoadingAsFirstRender = true, shouldSkipVBBACall = true, shouldShowBackButton = false, shouldShowLoading = true, shouldShowOfflineIndicatorInWideScreen = false, shouldShowNonAdmin = false, headerContent, testID, shouldShowNotFoundPage = false, isLoading: isPageLoading = false, onBackButtonPress, shouldShowThreeDotsButton, threeDotsMenuItems, shouldUseHeadlineHeader = true, addBottomSafeAreaPadding = false, }) {
    const styles = (0, useThemeStyles_1.default)();
    const policyID = route.params?.policyID;
    const { isOffline } = (0, useNetwork_1.default)({ onReconnect: () => fetchData(policyID, shouldSkipVBBACall) });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    const [reimbursementAccount = CONST_1.default.REIMBURSEMENT_ACCOUNT.DEFAULT_DATA] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: true });
    const [currentUserLogin] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, {
        selector: (session) => session?.email,
        canBeMissing: true,
    });
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const isLoading = (reimbursementAccount?.isLoading || isPageLoading) ?? true;
    const achState = policy?.achAccount?.state ?? reimbursementAccount?.achData?.state;
    const isUsingECard = account?.isUsingExpensifyCard ?? false;
    const hasVBA = achState === CONST_1.default.BANK_ACCOUNT.STATE.OPEN;
    const content = typeof children === 'function' ? children(hasVBA, policyID, isUsingECard) : children;
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const firstRender = (0, react_1.useRef)(showLoadingAsFirstRender);
    const isFocused = (0, native_1.useIsFocused)();
    const prevPolicy = (0, usePrevious_1.default)(policy);
    (0, react_1.useEffect)(() => {
        // Because isLoading is false before merging in Onyx, we need firstRender ref to display loading page as well before isLoading is change to true
        firstRender.current = false;
    }, []);
    (0, react_1.useEffect)(() => {
        fetchData(policyID, shouldSkipVBBACall);
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const shouldShowPolicy = (0, react_1.useMemo)(() => (0, PolicyUtils_1.shouldShowPolicy)(policy, false, currentUserLogin), [policy, currentUserLogin]);
    const isPendingDelete = (0, PolicyUtils_1.isPendingDeletePolicy)(policy);
    const prevIsPendingDelete = (0, PolicyUtils_1.isPendingDeletePolicy)(prevPolicy);
    const shouldShow = (0, react_1.useMemo)(() => {
        // If the policy object doesn't exist or contains only error data, we shouldn't display it.
        if ((((0, EmptyObject_1.isEmptyObject)(policy) || (Object.keys(policy).length === 1 && !(0, EmptyObject_1.isEmptyObject)(policy.errors))) && (0, EmptyObject_1.isEmptyObject)(policyDraft)) || shouldShowNotFoundPage) {
            return true;
        }
        // We check isPendingDelete and prevIsPendingDelete to prevent the NotFound view from showing right after we delete the workspace
        return (!(0, EmptyObject_1.isEmptyObject)(policy) && !(0, PolicyUtils_1.isPolicyAdmin)(policy) && !shouldShowNonAdmin) || (!shouldShowPolicy && (!isPendingDelete || prevIsPendingDelete));
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [policy, shouldShowNonAdmin, shouldShowPolicy]);
    const handleOnBackButtonPress = () => {
        if (onBackButtonPress) {
            onBackButtonPress();
            return true;
        }
        if (backButtonRoute) {
            Navigation_1.default.goBack(backButtonRoute);
            return true;
        }
        Navigation_1.default.popToSidebar();
        return true;
    };
    (0, useHandleBackButton_1.default)(handleOnBackButtonPress);
    return (<ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnablePickerAvoiding={false} shouldEnableMaxHeight testID={testID ?? WorkspacePageWithSections.displayName} shouldShowOfflineIndicator={!shouldShow} shouldShowOfflineIndicatorInWideScreen={shouldShowOfflineIndicatorInWideScreen && !shouldShow}>
            <FullPageNotFoundView_1.default onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACES_LIST.route)} onLinkPress={PolicyUtils_1.goBackFromInvalidPolicy} shouldShow={shouldShow} subtitleKey={shouldShowPolicy ? 'workspace.common.notAuthorized' : undefined} shouldForceFullScreen shouldDisplaySearchRouter>
                <HeaderWithBackButton_1.default title={headerText} onBackButtonPress={handleOnBackButtonPress} shouldShowBackButton={shouldUseNarrowLayout || shouldShowBackButton} icon={icon ?? undefined} shouldShowThreeDotsButton={shouldShowThreeDotsButton} threeDotsMenuItems={threeDotsMenuItems} shouldUseHeadlineHeader={shouldUseHeadlineHeader}>
                    {headerContent}
                </HeaderWithBackButton_1.default>
                {!isOffline && (isLoading || firstRender.current) && shouldShowLoading && isFocused ? (<FullscreenLoadingIndicator_1.default style={[styles.flex1, styles.pRelative]}/>) : (<>
                        {shouldUseScrollView ? (<ScrollViewWithContext_1.default keyboardShouldPersistTaps="handled" addBottomSafeAreaPadding={addBottomSafeAreaPadding} style={[styles.settingsPageBackground, styles.flex1, styles.w100]}>
                                <react_native_1.View style={[styles.w100, styles.flex1]}>{content}</react_native_1.View>
                            </ScrollViewWithContext_1.default>) : (content)}
                        {footer}
                    </>)}
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
WorkspacePageWithSections.displayName = 'WorkspacePageWithSections';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspacePageWithSections);
