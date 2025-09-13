"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onServerDataReady = onServerDataReady;
exports.isOnboardingFlowCompleted = isOnboardingFlowCompleted;
exports.dismissProductTraining = dismissProductTraining;
exports.setOnboardingPurposeSelected = setOnboardingPurposeSelected;
exports.updateOnboardingLastVisitedPath = updateOnboardingLastVisitedPath;
exports.resetAllChecks = resetAllChecks;
exports.setOnboardingAdminsChatReportID = setOnboardingAdminsChatReportID;
exports.setOnboardingPolicyID = setOnboardingPolicyID;
exports.completeHybridAppOnboarding = completeHybridAppOnboarding;
exports.setOnboardingErrorMessage = setOnboardingErrorMessage;
exports.setOnboardingCompanySize = setOnboardingCompanySize;
exports.setSelfTourViewed = setSelfTourViewed;
exports.setOnboardingMergeAccountStepValue = setOnboardingMergeAccountStepValue;
exports.updateOnboardingValuesAndNavigation = updateOnboardingValuesAndNavigation;
exports.setOnboardingUserReportedIntegration = setOnboardingUserReportedIntegration;
const react_native_hybrid_app_1 = require("@expensify/react-native-hybrid-app");
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const DateUtils_1 = require("@libs/DateUtils");
const Log_1 = require("@libs/Log");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONFIG_1 = require("@src/CONFIG");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
let isLoadingReportData = true;
let onboarding;
let resolveIsReadyPromise;
let isServerDataReadyPromise = new Promise((resolve) => {
    resolveIsReadyPromise = resolve;
});
let resolveOnboardingFlowStatus;
let isOnboardingFlowStatusKnownPromise = new Promise((resolve) => {
    resolveOnboardingFlowStatus = resolve;
});
function onServerDataReady() {
    return isServerDataReadyPromise;
}
let isOnboardingInProgress = false;
function isOnboardingFlowCompleted({ onCompleted, onNotCompleted, onCanceled }) {
    isOnboardingFlowStatusKnownPromise.then(() => {
        if ((0, EmptyObject_1.isEmptyObject)(onboarding) || onboarding?.hasCompletedGuidedSetupFlow === undefined) {
            onCanceled?.();
            return;
        }
        if (onboarding?.hasCompletedGuidedSetupFlow) {
            isOnboardingInProgress = false;
            onCompleted?.();
        }
        else if (!isOnboardingInProgress) {
            isOnboardingInProgress = true;
            onNotCompleted?.();
        }
    });
}
/**
 * Check if report data are loaded
 */
function checkServerDataReady() {
    if (isLoadingReportData) {
        return;
    }
    resolveIsReadyPromise?.();
}
/**
 * Check if the onboarding data is loaded
 */
function checkOnboardingDataReady() {
    if (onboarding === undefined) {
        return;
    }
    resolveOnboardingFlowStatus();
}
function setOnboardingPurposeSelected(value) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.ONBOARDING_PURPOSE_SELECTED, value ?? null);
}
function setOnboardingCompanySize(value) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.ONBOARDING_COMPANY_SIZE, value);
}
function setOnboardingUserReportedIntegration(value) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.ONBOARDING_USER_REPORTED_INTEGRATION, value);
}
function setOnboardingErrorMessage(value) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.ONBOARDING_ERROR_MESSAGE, value ?? null);
}
function setOnboardingAdminsChatReportID(adminsChatReportID) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.ONBOARDING_ADMINS_CHAT_REPORT_ID, adminsChatReportID ?? null);
}
function setOnboardingPolicyID(policyID) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.ONBOARDING_POLICY_ID, policyID ?? null);
}
function updateOnboardingLastVisitedPath(path) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.ONBOARDING_LAST_VISITED_PATH, path);
}
function updateOnboardingValuesAndNavigation(onboardingValues) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_ONBOARDING, { ...onboardingValues, shouldValidate: undefined });
    // We need to have the Onyx values updated before navigating back
    // Because we navigate based no useEffect logic and we need to clear `shouldValidate` value before going back
    Navigation_1.default.setNavigationActionToMicrotaskQueue(() => {
        Navigation_1.default.goBack(ROUTES_1.default.ONBOARDING_WORK_EMAIL.getRoute());
    });
}
function setOnboardingMergeAccountStepValue(value, skipped = false) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, { isMergeAccountStepCompleted: value, isMergeAccountStepSkipped: skipped });
}
function completeHybridAppOnboarding() {
    if (!CONFIG_1.default.IS_HYBRID_APP) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_TRY_NEW_DOT,
            value: {
                classicRedirect: {
                    completedHybridAppOnboarding: true,
                },
            },
        },
    ];
    // eslint-disable-next-line rulesdir/no-api-side-effects-method
    API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.COMPLETE_HYBRID_APP_ONBOARDING, {}, { optimisticData }).then((response) => {
        if (!response) {
            return;
        }
        // No matter what the response is, we want to mark the onboarding as completed (user saw the explanation modal)
        Log_1.default.info(`[HybridApp] Onboarding status has changed. Propagating new value to OldDot`, true);
        react_native_hybrid_app_1.default.completeOnboarding({ status: true });
    });
}
// We use `connectWithoutView` here since this connection only updates a module-level variable
// and doesn't need to trigger component re-renders.
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.NVP_ONBOARDING,
    callback: (value) => {
        onboarding = value;
        checkOnboardingDataReady();
    },
});
// We use `connectWithoutView` here since this connection only to get loading flag
// and doesn't need to trigger component re-renders.
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.IS_LOADING_REPORT_DATA,
    initWithStoredValues: false,
    callback: (value) => {
        isLoadingReportData = value ?? false;
        checkServerDataReady();
    },
});
function resetAllChecks() {
    isServerDataReadyPromise = new Promise((resolve) => {
        resolveIsReadyPromise = resolve;
    });
    isOnboardingFlowStatusKnownPromise = new Promise((resolve) => {
        resolveOnboardingFlowStatus = resolve;
    });
    isLoadingReportData = true;
    isOnboardingInProgress = false;
}
function setSelfTourViewed(shouldUpdateOnyxDataOnlyLocally = false) {
    if (shouldUpdateOnyxDataOnlyLocally) {
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, { selfTourViewed: true });
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_ONBOARDING,
            value: {
                selfTourViewed: true,
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.SELF_TOUR_VIEWED, null, { optimisticData });
}
function dismissProductTraining(elementName, isDismissedUsingCloseButton = false) {
    const date = new Date();
    const dismissedMethod = isDismissedUsingCloseButton ? 'x' : 'click';
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING,
            value: {
                [elementName]: {
                    timestamp: DateUtils_1.default.getDBTime(date.valueOf()),
                    dismissedMethod,
                },
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.DISMISS_PRODUCT_TRAINING, { name: elementName, dismissedMethod }, { optimisticData });
}
