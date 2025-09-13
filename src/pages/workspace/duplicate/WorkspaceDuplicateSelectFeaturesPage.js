"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var usePermissions_1 = require("@hooks/usePermissions");
var AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
var CONST_1 = require("@src/CONST");
var WorkspaceDuplicateSelectFeaturesForm_1 = require("./WorkspaceDuplicateSelectFeaturesForm");
function WorkspaceDuplicateSelectFeaturesPage() {
    var _a;
    var route = (0, native_1.useRoute)();
    var policyID = (_a = route === null || route === void 0 ? void 0 : route.params) === null || _a === void 0 ? void 0 : _a.policyID;
    var isBetaEnabled = (0, usePermissions_1.default)().isBetaEnabled;
    var isDuplicatedWorkspaceEnabled = isBetaEnabled(CONST_1.default.BETAS.DUPLICATE_WORKSPACE);
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} shouldBeBlocked={!isDuplicatedWorkspaceEnabled}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={WorkspaceDuplicateSelectFeaturesPage.displayName}>
                <WorkspaceDuplicateSelectFeaturesForm_1.default policyID={policyID}/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceDuplicateSelectFeaturesPage.displayName = 'WorkspaceDuplicateSelectFeaturesPage';
exports.default = WorkspaceDuplicateSelectFeaturesPage;
