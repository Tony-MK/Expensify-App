"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const AdminTestDriveModal_1 = require("./AdminTestDriveModal");
const EmployeeTestDriveModal_1 = require("./EmployeeTestDriveModal");
function TestDriveModal() {
    const [introSelected] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_INTRO_SELECTED, { canBeMissing: true });
    const isAdminTester = introSelected?.choice === CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM || introSelected?.choice === CONST_1.default.ONBOARDING_CHOICES.TRACK_WORKSPACE;
    return isAdminTester ? <AdminTestDriveModal_1.default /> : <EmployeeTestDriveModal_1.default />;
}
TestDriveModal.displayName = 'TestDriveModal';
exports.default = TestDriveModal;
