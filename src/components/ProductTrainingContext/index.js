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
exports.useProductTrainingContext = void 0;
exports.ProductTrainingContextProvider = ProductTrainingContextProvider;
var react_1 = require("react");
var react_native_1 = require("react-native");
var Button_1 = require("@components/Button");
var Icon_1 = require("@components/Icon");
var Expensicons = require("@components/Icon/Expensicons");
var PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
var RenderHTML_1 = require("@components/RenderHTML");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useSidePanel_1 = require("@hooks/useSidePanel");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var onboardingSelectors_1 = require("@libs/onboardingSelectors");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var TooltipUtils_1 = require("@libs/TooltipUtils");
var variables_1 = require("@styles/variables");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
var createPressHandler_1 = require("./createPressHandler");
var TOOLTIPS_1 = require("./TOOLTIPS");
var ProductTrainingContext = (0, react_1.createContext)({
    shouldRenderTooltip: function () { return false; },
    registerTooltip: function () { },
    unregisterTooltip: function () { },
});
function ProductTrainingContextProvider(_a) {
    var _b;
    var children = _a.children;
    var _c = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true })[0], isLoadingApp = _c === void 0 ? true : _c;
    var tryNewDot = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { canBeMissing: true })[0];
    var hasBeenAddedToNudgeMigration = !!((_b = tryNewDot === null || tryNewDot === void 0 ? void 0 : tryNewDot.nudgeMigration) === null || _b === void 0 ? void 0 : _b.timestamp);
    var _d = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, {
        selector: onboardingSelectors_1.hasCompletedGuidedSetupFlowSelector,
        canBeMissing: true,
    }), _e = _d[0], isOnboardingCompleted = _e === void 0 ? true : _e, isOnboardingCompletedMetadata = _d[1];
    var _f = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true }), allPolicies = _f[0], allPoliciesMetadata = _f[1];
    var _g = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: function (session) { return session === null || session === void 0 ? void 0 : session.email; }, canBeMissing: true }), currentUserLogin = _g[0], currentUserLoginMetadata = _g[1];
    var isActingAsDelegate = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: function (account) { var _a; return !!((_a = account === null || account === void 0 ? void 0 : account.delegatedAccess) === null || _a === void 0 ? void 0 : _a.delegate); }, canBeMissing: true })[0];
    var isUserPolicyEmployee = (0, react_1.useMemo)(function () {
        if (!allPolicies || !currentUserLogin || (0, isLoadingOnyxValue_1.default)(allPoliciesMetadata, currentUserLoginMetadata)) {
            return false;
        }
        return (0, PolicyUtils_1.getActiveEmployeeWorkspaces)(allPolicies, currentUserLogin).length > 0;
    }, [allPolicies, currentUserLogin, allPoliciesMetadata, currentUserLoginMetadata]);
    var isUserPolicyAdmin = (0, react_1.useMemo)(function () {
        if (!allPolicies || !currentUserLogin || (0, isLoadingOnyxValue_1.default)(allPoliciesMetadata, currentUserLoginMetadata)) {
            return false;
        }
        return (0, PolicyUtils_1.getActiveAdminWorkspaces)(allPolicies, currentUserLogin).length > 0;
    }, [allPolicies, currentUserLogin, allPoliciesMetadata, currentUserLoginMetadata]);
    var dismissedProductTraining = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING, { canBeMissing: true })[0];
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var modal = (0, useOnyx_1.default)(ONYXKEYS_1.default.MODAL, { canBeMissing: true })[0];
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var isModalVisible = (modal === null || modal === void 0 ? void 0 : modal.isVisible) || (modal === null || modal === void 0 ? void 0 : modal.willAlertModalBecomeVisible);
    var _h = (0, react_1.useState)(new Set()), activeTooltips = _h[0], setActiveTooltips = _h[1];
    var unregisterTooltip = (0, react_1.useCallback)(function (tooltipName) {
        setActiveTooltips(function (prev) {
            var next = new Set(prev);
            next.delete(tooltipName);
            return next;
        });
    }, [setActiveTooltips]);
    var determineVisibleTooltip = (0, react_1.useCallback)(function () {
        if (activeTooltips.size === 0) {
            return null;
        }
        var sortedTooltips = Array.from(activeTooltips)
            .map(function (name) {
            var _a, _b;
            return ({
                name: name,
                priority: (_b = (_a = TOOLTIPS_1.default[name]) === null || _a === void 0 ? void 0 : _a.priority) !== null && _b !== void 0 ? _b : 0,
            });
        })
            .sort(function (a, b) { return b.priority - a.priority; });
        var highestPriorityTooltip = sortedTooltips.at(0);
        if (!highestPriorityTooltip) {
            return null;
        }
        return highestPriorityTooltip.name;
    }, [activeTooltips]);
    var isUserInPaidPolicy = (0, react_1.useMemo)(function () {
        if (!allPolicies || !currentUserLogin || (0, isLoadingOnyxValue_1.default)(allPoliciesMetadata, currentUserLoginMetadata)) {
            return false;
        }
        return (0, PolicyUtils_1.getGroupPaidPoliciesWithExpenseChatEnabled)(allPolicies).length > 0;
    }, [allPolicies, currentUserLogin, allPoliciesMetadata, currentUserLoginMetadata]);
    var shouldTooltipBeVisible = (0, react_1.useCallback)(function (tooltipName) {
        if ((0, isLoadingOnyxValue_1.default)(isOnboardingCompletedMetadata) || isLoadingApp) {
            return false;
        }
        var isDismissed = (0, TooltipUtils_1.default)(tooltipName, dismissedProductTraining);
        if (isDismissed) {
            return false;
        }
        var tooltipConfig = TOOLTIPS_1.default[tooltipName];
        // if hasBeenAddedToNudgeMigration is true, and welcome modal is not dismissed, don't show tooltip
        if (hasBeenAddedToNudgeMigration && !(dismissedProductTraining === null || dismissedProductTraining === void 0 ? void 0 : dismissedProductTraining[CONST_1.default.MIGRATED_USER_WELCOME_MODAL])) {
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
            shouldUseNarrowLayout: shouldUseNarrowLayout,
            isUserPolicyEmployee: isUserPolicyEmployee,
            isUserPolicyAdmin: isUserPolicyAdmin,
            hasBeenAddedToNudgeMigration: hasBeenAddedToNudgeMigration,
            isUserInPaidPolicy: isUserInPaidPolicy,
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
    var registerTooltip = (0, react_1.useCallback)(function (tooltipName) {
        var shouldRegister = shouldTooltipBeVisible(tooltipName);
        if (!shouldRegister) {
            return;
        }
        setActiveTooltips(function (prev) { return new Set(__spreadArray(__spreadArray([], prev, true), [tooltipName], false)); });
    }, [shouldTooltipBeVisible]);
    var shouldRenderTooltip = (0, react_1.useCallback)(function (tooltipName) {
        // If the user is acting as a copilot, don't show any tooltips
        if (isActingAsDelegate) {
            return false;
        }
        // First check base conditions
        var shouldShow = shouldTooltipBeVisible(tooltipName);
        if (!shouldShow) {
            return false;
        }
        var visibleTooltip = determineVisibleTooltip();
        // If this is the highest priority visible tooltip, show it
        if (tooltipName === visibleTooltip) {
            return true;
        }
        return false;
    }, [isActingAsDelegate, shouldTooltipBeVisible, determineVisibleTooltip]);
    var contextValue = (0, react_1.useMemo)(function () { return ({
        shouldRenderTooltip: shouldRenderTooltip,
        registerTooltip: registerTooltip,
        unregisterTooltip: unregisterTooltip,
    }); }, [shouldRenderTooltip, registerTooltip, unregisterTooltip]);
    return <ProductTrainingContext.Provider value={contextValue}>{children}</ProductTrainingContext.Provider>;
}
var useProductTrainingContext = function (tooltipName, shouldShow, config) {
    if (shouldShow === void 0) { shouldShow = true; }
    if (config === void 0) { config = {}; }
    var context = (0, react_1.useContext)(ProductTrainingContext);
    var styles = (0, useThemeStyles_1.default)();
    var theme = (0, useTheme_1.default)();
    var shouldHideToolTip = (0, useSidePanel_1.default)().shouldHideToolTip;
    var translate = (0, useLocalize_1.default)().translate;
    if (!context) {
        throw new Error('useProductTourContext must be used within a ProductTourProvider');
    }
    var shouldRenderTooltip = context.shouldRenderTooltip, registerTooltip = context.registerTooltip, unregisterTooltip = context.unregisterTooltip;
    (0, react_1.useEffect)(function () {
        if (!shouldShow) {
            return;
        }
        registerTooltip(tooltipName);
        return function () {
            unregisterTooltip(tooltipName);
        };
    }, [tooltipName, registerTooltip, unregisterTooltip, shouldShow]);
    var shouldShowProductTrainingTooltip = (0, react_1.useMemo)(function () {
        return shouldShow && shouldRenderTooltip(tooltipName) && !shouldHideToolTip;
    }, [shouldRenderTooltip, tooltipName, shouldShow, shouldHideToolTip]);
    var hideTooltip = (0, react_1.useCallback)(function (isDismissedUsingCloseButton) {
        if (isDismissedUsingCloseButton === void 0) { isDismissedUsingCloseButton = false; }
        if (!shouldShowProductTrainingTooltip) {
            return;
        }
        var tooltip = TOOLTIPS_1.default[tooltipName];
        tooltip.onHideTooltip(isDismissedUsingCloseButton);
        unregisterTooltip(tooltipName);
    }, [tooltipName, shouldShowProductTrainingTooltip, unregisterTooltip]);
    var renderProductTrainingTooltip = (0, react_1.useCallback)(function () {
        var tooltip = TOOLTIPS_1.default[tooltipName];
        return (<react_native_1.View fsClass={CONST_1.default.FULLSTORY.CLASS.UNMASK}>
                <react_native_1.View style={[
                styles.alignItemsCenter,
                styles.flexRow,
                (tooltip === null || tooltip === void 0 ? void 0 : tooltip.shouldRenderActionButtons) ? styles.justifyContentStart : styles.justifyContentCenter,
                styles.textAlignCenter,
                styles.gap3,
                styles.pv2,
                styles.ph2,
            ]}>
                    <Icon_1.default src={Expensicons.Lightbulb} fill={theme.tooltipHighlightText} medium/>
                    <react_native_1.View style={[styles.renderHTML, styles.dFlex, styles.flexShrink1]}>
                        <RenderHTML_1.default html={translate(tooltip.content)}/>
                    </react_native_1.View>
                    {!(tooltip === null || tooltip === void 0 ? void 0 : tooltip.shouldRenderActionButtons) && (<PressableWithoutFeedback_1.default shouldUseAutoHitSlop accessibilityLabel={translate('productTrainingTooltip.scanTestTooltip.noThanks')} role={CONST_1.default.ROLE.BUTTON} 
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...(0, createPressHandler_1.default)(function () { return hideTooltip(true); })}>
                            <Icon_1.default src={Expensicons.Close} fill={theme.icon} width={variables_1.default.iconSizeSemiSmall} height={variables_1.default.iconSizeSemiSmall}/>
                        </PressableWithoutFeedback_1.default>)}
                </react_native_1.View>
                {!!(tooltip === null || tooltip === void 0 ? void 0 : tooltip.shouldRenderActionButtons) && (<react_native_1.View style={[styles.alignItemsCenter, styles.justifyContentBetween, styles.flexRow, styles.ph2, styles.pv2, styles.gap2]}>
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
    var hideProductTrainingTooltip = (0, react_1.useCallback)(function () {
        hideTooltip(false);
    }, [hideTooltip]);
    return {
        renderProductTrainingTooltip: renderProductTrainingTooltip,
        hideProductTrainingTooltip: hideProductTrainingTooltip,
        shouldShowProductTrainingTooltip: shouldShowProductTrainingTooltip,
    };
};
exports.useProductTrainingContext = useProductTrainingContext;
