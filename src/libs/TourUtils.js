"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestDriveURL = getTestDriveURL;
const CONST_1 = require("@src/CONST");
function getTestDriveURL(shouldUseNarrowLayout, introSelected, isUserPolicyAdmin) {
    if (introSelected) {
        if (introSelected?.choice === CONST_1.default.ONBOARDING_CHOICES.SUBMIT && introSelected.inviteType === CONST_1.default.ONBOARDING_INVITE_TYPES.WORKSPACE) {
            return shouldUseNarrowLayout ? CONST_1.default.STORYLANE.EMPLOYEE_TOUR_MOBILE : CONST_1.default.STORYLANE.EMPLOYEE_TOUR;
        }
        if (introSelected?.choice === CONST_1.default.ONBOARDING_CHOICES.TRACK_WORKSPACE) {
            return shouldUseNarrowLayout ? CONST_1.default.STORYLANE.TRACK_WORKSPACE_TOUR_MOBILE : CONST_1.default.STORYLANE.TRACK_WORKSPACE_TOUR;
        }
        return shouldUseNarrowLayout ? CONST_1.default.STORYLANE.ADMIN_TOUR_MOBILE : CONST_1.default.STORYLANE.ADMIN_TOUR;
    }
    // Migrated users don't have the introSelected NVP, so we must check if they are an Admin of any Workspace in order
    // to show the Admin demo.
    if (isUserPolicyAdmin) {
        return shouldUseNarrowLayout ? CONST_1.default.STORYLANE.ADMIN_TOUR_MOBILE : CONST_1.default.STORYLANE.ADMIN_TOUR;
    }
    return shouldUseNarrowLayout ? CONST_1.default.STORYLANE.EMPLOYEE_TOUR_MOBILE : CONST_1.default.STORYLANE.EMPLOYEE_TOUR;
}
