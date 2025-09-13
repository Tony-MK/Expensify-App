"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.navigateAfterOnboardingWithMicrotaskQueue = exports.navigateAfterOnboarding = void 0;
const ROUTES_1 = require("@src/ROUTES");
const Modal_1 = require("./actions/Modal");
const shouldOpenOnAdminRoom_1 = require("./Navigation/helpers/shouldOpenOnAdminRoom");
const Navigation_1 = require("./Navigation/Navigation");
const ReportUtils_1 = require("./ReportUtils");
const navigateAfterOnboarding = (isSmallScreenWidth, canUseDefaultRooms, onboardingPolicyID, onboardingAdminsChatReportID, shouldPreventOpenAdminRoom = false) => {
    (0, Modal_1.setDisableDismissOnEscape)(false);
    Navigation_1.default.dismissModal();
    let reportID;
    // When hasCompletedGuidedSetupFlow is true, OnboardingModalNavigator in AuthScreen is removed from the navigation stack.
    // On small screens, this removal redirects navigation to HOME. Dismissing the modal doesn't work properly,
    // so we need to specifically navigate to the last accessed report.
    if (!isSmallScreenWidth) {
        if (onboardingAdminsChatReportID && !shouldPreventOpenAdminRoom) {
            reportID = onboardingAdminsChatReportID;
        }
    }
    else {
        const lastAccessedReport = (0, ReportUtils_1.findLastAccessedReport)(!canUseDefaultRooms, (0, shouldOpenOnAdminRoom_1.default)() && !shouldPreventOpenAdminRoom);
        const lastAccessedReportID = lastAccessedReport?.reportID;
        // we don't want to navigate to newly created workspaces after onboarding is completed.
        if (lastAccessedReportID && lastAccessedReport.policyID !== onboardingPolicyID && !(0, ReportUtils_1.isConciergeChatReport)(lastAccessedReport)) {
            reportID = lastAccessedReportID;
        }
    }
    if (reportID) {
        Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID));
    }
    // In this case, we have joined an accessible policy. We would have an onboarding policy, but not an admins chat report.
    // We should skip the Test Drive modal in this case since we already have a policy to join.
    if (onboardingPolicyID && !onboardingAdminsChatReportID) {
        return;
    }
    // We're using Navigation.isNavigationReady here because without it, on iOS,
    // Navigation.dismissModal runs after Navigation.navigate(ROUTES.TEST_DRIVE_MODAL_ROOT.route)
    // And dismisses the modal before it even shows
    Navigation_1.default.isNavigationReady().then(() => {
        Navigation_1.default.navigate(ROUTES_1.default.TEST_DRIVE_MODAL_ROOT.route);
    });
};
exports.navigateAfterOnboarding = navigateAfterOnboarding;
const navigateAfterOnboardingWithMicrotaskQueue = (isSmallScreenWidth, canUseDefaultRooms, onboardingPolicyID, onboardingAdminsChatReportID, shouldPreventOpenAdminRoom = false) => {
    Navigation_1.default.setNavigationActionToMicrotaskQueue(() => {
        navigateAfterOnboarding(isSmallScreenWidth, canUseDefaultRooms, onboardingPolicyID, onboardingAdminsChatReportID, shouldPreventOpenAdminRoom);
    });
};
exports.navigateAfterOnboardingWithMicrotaskQueue = navigateAfterOnboardingWithMicrotaskQueue;
