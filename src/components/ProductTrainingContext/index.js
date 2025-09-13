"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProductTrainingContext = void 0;
exports.ProductTrainingContextProvider = ProductTrainingContextProvider;
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const RenderHTML_1 = require("@components/RenderHTML");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSidePanel_1 = require("@hooks/useSidePanel");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const onboardingSelectors_1 = require("@libs/onboardingSelectors");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const TooltipUtils_1 = require("@libs/TooltipUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const createPressHandler_1 = require("./createPressHandler");
const TOOLTIPS_1 = require("./TOOLTIPS");
const ProductTrainingContext = (0, react_1.createContext)({
    shouldRenderTooltip: () => false,
    registerTooltip: () => { },
    unregisterTooltip: () => { },
});
function ProductTrainingContextProvider({ children }) {
    const [isLoadingApp = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const [tryNewDot] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { canBeMissing: true });
    const hasBeenAddedToNudgeMigration = !!tryNewDot?.nudgeMigration?.timestamp;
    const [isOnboardingCompleted = true, isOnboardingCompletedMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, {
        selector: onboardingSelectors_1.hasCompletedGuidedSetupFlowSelector,
        canBeMissing: true,
    });
    const [allPolicies, allPoliciesMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const [currentUserLogin, currentUserLoginMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (session) => session?.email, canBeMissing: true });
    const [isActingAsDelegate] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: (account) => !!account?.delegatedAccess?.delegate, canBeMissing: true });
    const isUserPolicyEmployee = (0, react_1.useMemo)(() => {
        if (!allPolicies || !currentUserLogin || (0, isLoadingOnyxValue_1.default)(allPoliciesMetadata, currentUserLoginMetadata)) {
            return false;
        }
        return (0, PolicyUtils_1.getActiveEmployeeWorkspaces)(allPolicies, currentUserLogin).length > 0;
    }, [allPolicies, currentUserLogin, allPoliciesMetadata, currentUserLoginMetadata]);
    const isUserPolicyAdmin = (0, react_1.useMemo)(() => {
        if (!allPolicies || !currentUserLogin || (0, isLoadingOnyxValue_1.default)(allPoliciesMetadata, currentUserLoginMetadata)) {
            return false;
        }
        return (0, PolicyUtils_1.getActiveAdminWorkspaces)(allPolicies, currentUserLogin).length > 0;
    }, [allPolicies, currentUserLogin, allPoliciesMetadata, currentUserLoginMetadata]);
    const [dismissedProductTraining] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING, { canBeMissing: true });
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [modal] = (0, useOnyx_1.default)(ONYXKEYS_1.default.MODAL, { canBeMissing: true });
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const isModalVisible = modal?.isVisible || modal?.willAlertModalBecomeVisible;
    const [activeTooltips, setActiveTooltips] = (0, react_1.useState)(new Set());
    const unregisterTooltip = (0, react_1.useCallback)((tooltipName) => {
        setActiveTooltips((prev) => {
            const next = new Set(prev);
            next.delete(tooltipName);
            return next;
        });
    }, [setActiveTooltips]);
    const determineVisibleTooltip = (0, react_1.useCallback)(() => {
        if (activeTooltips.size === 0) {
            return null;
        }
        const sortedTooltips = Array.from(activeTooltips)
            .map((name) => ({
            name,
            priority: TOOLTIPS_1.default[name]?.priority ?? 0,
        }))
            .sort((a, b) => b.priority - a.priority);
        const highestPriorityTooltip = sortedTooltips.at(0);
        if (!highestPriorityTooltip) {
            return null;
        }
        return highestPriorityTooltip.name;
    }, [activeTooltips]);
    const isUserInPaidPolicy = (0, react_1.useMemo)(() => {
        if (!allPolicies || !currentUserLogin || (0, isLoadingOnyxValue_1.default)(allPoliciesMetadata, currentUserLoginMetadata)) {
            return false;
        }
        return (0, PolicyUtils_1.getGroupPaidPoliciesWithExpenseChatEnabled)(allPolicies).length > 0;
    }, [allPolicies, currentUserLogin, allPoliciesMetadata, currentUserLoginMetadata]);
    const shouldTooltipBeVisible = (0, react_1.useCallback)((tooltipName) => {
        if ((0, isLoadingOnyxValue_1.default)(isOnboardingCompletedMetadata) || isLoadingApp) {
            return false;
        }
        const isDismissed = (0, TooltipUtils_1.default)(tooltipName, dismissedProductTraining);
        if (isDismissed) {
            return false;
        }
        const tooltipConfig = TOOLTIPS_1.default[tooltipName];
        // if hasBeenAddedToNudgeMigration is true, and welcome modal is not dismissed, don't show tooltip
        if (hasBeenAddedToNudgeMigration && !dismissedProductTraining?.[CONST_1.default.MIGRATED_USER_WELCOME_MODAL]) {
            return false;
        }
        if (isOnboardingCompleted === false) {
            return false;
        }
        // We need to make an exception for these tooltips because it is shown in a modal, otherwise it would be hidden if a modal is visible
        if (tooltipName !== CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP &&
            tooltipName !== CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_TOOLTIP_MANAGER &&
            tooltipName !== CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_CONFIRMATION &&
            tooltipName !== CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_DRIVE_CONFIRMATION &&
            isModalVisible) {
            return false;
        }
        return tooltipConfig.shouldShow({
            shouldUseNarrowLayout,
            isUserPolicyEmployee,
            isUserPolicyAdmin,
            hasBeenAddedToNudgeMigration,
            isUserInPaidPolicy,
        });
    }, [
        isOnboardingCompletedMetadata,
        isLoadingApp,
        dismissedProductTraining,
        hasBeenAddedToNudgeMigration,
        isOnboardingCompleted,
        isModalVisible,
        shouldUseNarrowLayout,
        isUserPolicyEmployee,
        isUserPolicyAdmin,
        isUserInPaidPolicy,
    ]);
    const registerTooltip = (0, react_1.useCallback)((tooltipName) => {
        const shouldRegister = shouldTooltipBeVisible(tooltipName);
        if (!shouldRegister) {
            return;
        }
        setActiveTooltips((prev) => new Set([...prev, tooltipName]));
    }, [shouldTooltipBeVisible]);
    const shouldRenderTooltip = (0, react_1.useCallback)((tooltipName) => {
        // If the user is acting as a copilot, don't show any tooltips
        if (isActingAsDelegate) {
            return false;
        }
        // First check base conditions
        const shouldShow = shouldTooltipBeVisible(tooltipName);
        if (!shouldShow) {
            return false;
        }
        const visibleTooltip = determineVisibleTooltip();
        // If this is the highest priority visible tooltip, show it
        if (tooltipName === visibleTooltip) {
            return true;
        }
        return false;
    }, [isActingAsDelegate, shouldTooltipBeVisible, determineVisibleTooltip]);
    const contextValue = (0, react_1.useMemo)(() => ({
        shouldRenderTooltip,
        registerTooltip,
        unregisterTooltip,
    }), [shouldRenderTooltip, registerTooltip, unregisterTooltip]);
    return <ProductTrainingContext.Provider value={contextValue}>{children}</ProductTrainingContext.Provider>;
}
const useProductTrainingContext = (tooltipName, shouldShow = true, config = {}) => {
    const context = (0, react_1.useContext)(ProductTrainingContext);
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { shouldHideToolTip } = (0, useSidePanel_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    if (!context) {
        throw new Error('useProductTourContext must be used within a ProductTourProvider');
    }
    const { shouldRenderTooltip, registerTooltip, unregisterTooltip } = context;
    (0, react_1.useEffect)(() => {
        if (!shouldShow) {
            return;
        }
        registerTooltip(tooltipName);
        return () => {
            unregisterTooltip(tooltipName);
        };
    }, [tooltipName, registerTooltip, unregisterTooltip, shouldShow]);
    const shouldShowProductTrainingTooltip = (0, react_1.useMemo)(() => {
        return shouldShow && shouldRenderTooltip(tooltipName) && !shouldHideToolTip;
    }, [shouldRenderTooltip, tooltipName, shouldShow, shouldHideToolTip]);
    const hideTooltip = (0, react_1.useCallback)((isDismissedUsingCloseButton = false) => {
        if (!shouldShowProductTrainingTooltip) {
            return;
        }
        const tooltip = TOOLTIPS_1.default[tooltipName];
        tooltip.onHideTooltip(isDismissedUsingCloseButton);
        unregisterTooltip(tooltipName);
    }, [tooltipName, shouldShowProductTrainingTooltip, unregisterTooltip]);
    const renderProductTrainingTooltip = (0, react_1.useCallback)(() => {
        const tooltip = TOOLTIPS_1.default[tooltipName];
        return (<react_native_1.View fsClass={CONST_1.default.FULLSTORY.CLASS.UNMASK}>
                <react_native_1.View style={[
                styles.alignItemsCenter,
                styles.flexRow,
                tooltip?.shouldRenderActionButtons ? styles.justifyContentStart : styles.justifyContentCenter,
                styles.textAlignCenter,
                styles.gap3,
                styles.pv2,
                styles.ph2,
            ]}>
                    <Icon_1.default src={Expensicons.Lightbulb} fill={theme.tooltipHighlightText} medium/>
                    <react_native_1.View style={[styles.renderHTML, styles.dFlex, styles.flexShrink1]}>
                        <RenderHTML_1.default html={translate(tooltip.content)}/>
                    </react_native_1.View>
                    {!tooltip?.shouldRenderActionButtons && (<PressableWithoutFeedback_1.default shouldUseAutoHitSlop accessibilityLabel={translate('productTrainingTooltip.scanTestTooltip.noThanks')} role={CONST_1.default.ROLE.BUTTON} 
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...(0, createPressHandler_1.default)(() => hideTooltip(true))}>
                            <Icon_1.default src={Expensicons.Close} fill={theme.icon} width={variables_1.default.iconSizeSemiSmall} height={variables_1.default.iconSizeSemiSmall}/>
                        </PressableWithoutFeedback_1.default>)}
                </react_native_1.View>
                {!!tooltip?.shouldRenderActionButtons && (<react_native_1.View style={[styles.alignItemsCenter, styles.justifyContentBetween, styles.flexRow, styles.ph2, styles.pv2, styles.gap2]}>
                        <Button_1.default success text={translate('productTrainingTooltip.scanTestTooltip.tryItOut')} style={[styles.flex1]} 
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...(0, createPressHandler_1.default)(config.onConfirm)}/>
                        <Button_1.default text={translate('productTrainingTooltip.scanTestTooltip.noThanks')} style={[styles.flex1]} 
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...(0, createPressHandler_1.default)(config.onDismiss)}/>
                    </react_native_1.View>)}
            </react_native_1.View>);
    }, [
        tooltipName,
        styles.alignItemsCenter,
        styles.flexRow,
        styles.justifyContentStart,
        styles.justifyContentCenter,
        styles.textAlignCenter,
        styles.gap3,
        styles.pv2,
        styles.flex1,
        styles.justifyContentBetween,
        styles.ph2,
        styles.gap2,
        styles.renderHTML,
        styles.dFlex,
        styles.flexShrink1,
        theme.tooltipHighlightText,
        theme.icon,
        translate,
        config.onConfirm,
        config.onDismiss,
        hideTooltip,
    ]);
    const hideProductTrainingTooltip = (0, react_1.useCallback)(() => {
        hideTooltip(false);
    }, [hideTooltip]);
    return {
        renderProductTrainingTooltip,
        hideProductTrainingTooltip,
        shouldShowProductTrainingTooltip,
    };
};
exports.useProductTrainingContext = useProductTrainingContext;
