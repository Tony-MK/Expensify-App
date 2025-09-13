"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var usePermissions_1 = require("@hooks/usePermissions");
var AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
var Policy_1 = require("@userActions/Policy/Policy");
var CONST_1 = require("@src/CONST");
var WorkspaceDuplicateForm_1 = require("./WorkspaceDuplicateForm");
function WorkspaceDuplicatePage() {
    var _a;
    var route = (0, native_1.useRoute)();
    var policyID = (_a = route === null || route === void 0 ? void 0 : route.params) === null || _a === void 0 ? void 0 : _a.policyID;
    var isBetaEnabled = (0, usePermissions_1.default)().isBetaEnabled;
    var isDuplicatedWorkspaceEnabled = isBetaEnabled(CONST_1.default.BETAS.DUPLICATE_WORKSPACE);
    (0, react_1.useEffect)(Policy_1.clearDuplicateWorkspace, []);
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} shouldBeBlocked={!isDuplicatedWorkspaceEnabled}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={WorkspaceDuplicatePage.displayName}>
                <WorkspaceDuplicateForm_1.default policyID={policyID}/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceDuplicatePage.displayName = 'WorkspaceDuplicatePage';
exports.default = WorkspaceDuplicatePage;
