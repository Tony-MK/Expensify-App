"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTestDrive = startTestDrive;
const react_native_1 = require("react-native");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const Task_1 = require("./Task");
function startTestDrive(introSelected, shouldUpdateSelfTourViewedOnlyLocally, hasUserBeenAddedToNudgeMigration, isUserPaidPolicyMember) {
    react_native_1.InteractionManager.runAfterInteractions(() => {
        if (hasUserBeenAddedToNudgeMigration ||
            isUserPaidPolicyMember ||
            introSelected?.choice === CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM ||
            introSelected?.choice === CONST_1.default.ONBOARDING_CHOICES.TEST_DRIVE_RECEIVER ||
            introSelected?.choice === CONST_1.default.ONBOARDING_CHOICES.TRACK_WORKSPACE ||
            (introSelected?.choice === CONST_1.default.ONBOARDING_CHOICES.SUBMIT && introSelected.inviteType === CONST_1.default.ONBOARDING_INVITE_TYPES.WORKSPACE)) {
            (0, Task_1.completeTestDriveTask)(shouldUpdateSelfTourViewedOnlyLocally);
            Navigation_1.default.navigate(ROUTES_1.default.TEST_DRIVE_DEMO_ROOT);
        }
        else {
            Navigation_1.default.navigate(ROUTES_1.default.TEST_DRIVE_MODAL_ROOT.route);
        }
    });
}
