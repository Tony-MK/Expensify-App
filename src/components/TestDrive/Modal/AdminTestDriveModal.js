"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const Log_1 = require("@libs/Log");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const BaseTestDriveModal_1 = require("./BaseTestDriveModal");
function AdminTestDriveModal() {
    const { translate } = (0, useLocalize_1.default)();
    const [onboarding] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, { canBeMissing: false });
    const [onboardingReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${onboarding?.chatReportID}`, { canBeMissing: true });
    const navigate = () => {
        Log_1.default.hmmm('[AdminTestDriveModal] Navigate function called');
        react_native_1.InteractionManager.runAfterInteractions(() => {
            Log_1.default.hmmm('[AdminTestDriveModal] Calling Navigation.navigate()');
            Navigation_1.default.navigate(ROUTES_1.default.TEST_DRIVE_DEMO_ROOT);
        });
    };
    const skipTestDrive = () => {
        Log_1.default.hmmm('[AdminTestDriveModal] Skip test drive function called');
        Navigation_1.default.dismissModal();
        Log_1.default.hmmm('[AdminTestDriveModal] Running after interactions');
        react_native_1.InteractionManager.runAfterInteractions(() => {
            if (!(0, ReportUtils_1.isAdminRoom)(onboardingReport)) {
                Log_1.default.hmmm('[AdminTestDriveModal] Not an admin room');
                return;
            }
            Log_1.default.hmmm('[AdminTestDriveModal] Navigating to report', { reportID: onboardingReport?.reportID });
            Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(onboardingReport?.reportID));
        });
    };
    return (<BaseTestDriveModal_1.default description={translate('testDrive.modal.description')} onConfirm={navigate} onHelp={skipTestDrive} shouldCallOnHelpWhenModalHidden/>);
}
AdminTestDriveModal.displayName = 'AdminTestDriveModal';
exports.default = AdminTestDriveModal;
