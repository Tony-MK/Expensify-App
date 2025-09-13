"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const usePermissions_1 = require("@hooks/usePermissions");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const WorkspaceDuplicateForm_1 = require("./WorkspaceDuplicateForm");
function WorkspaceDuplicatePage() {
    const route = (0, native_1.useRoute)();
    const policyID = route?.params?.policyID;
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const isDuplicatedWorkspaceEnabled = isBetaEnabled(CONST_1.default.BETAS.DUPLICATE_WORKSPACE);
    (0, react_1.useEffect)(Policy_1.clearDuplicateWorkspace, []);
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} shouldBeBlocked={!isDuplicatedWorkspaceEnabled}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={WorkspaceDuplicatePage.displayName}>
                <WorkspaceDuplicateForm_1.default policyID={policyID}/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceDuplicatePage.displayName = 'WorkspaceDuplicatePage';
exports.default = WorkspaceDuplicatePage;
