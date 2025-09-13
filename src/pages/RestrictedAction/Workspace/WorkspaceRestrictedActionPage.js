"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const PolicyUtils = require("@libs/PolicyUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WorkspaceAdminRestrictedAction_1 = require("./WorkspaceAdminRestrictedAction");
const WorkspaceOwnerRestrictedAction_1 = require("./WorkspaceOwnerRestrictedAction");
const WorkspaceUserRestrictedAction_1 = require("./WorkspaceUserRestrictedAction");
function WorkspaceRestrictedActionPage({ route: { params: { policyID }, }, }) {
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION);
    const policy = (0, usePolicy_1.default)(policyID);
    // Workspace Owner
    if (PolicyUtils.isPolicyOwner(policy, session?.accountID ?? -1)) {
        return <WorkspaceOwnerRestrictedAction_1.default />;
    }
    // Workspace Admin
    if (PolicyUtils.isPolicyAdmin(policy, session?.email)) {
        return <WorkspaceAdminRestrictedAction_1.default policyID={policyID}/>;
    }
    // Workspace User
    if (PolicyUtils.isPolicyUser(policy, session?.email)) {
        return <WorkspaceUserRestrictedAction_1.default policyID={policyID}/>;
    }
    return <NotFoundPage_1.default />;
}
WorkspaceRestrictedActionPage.displayName = 'WorkspaceRestrictedActionPage';
exports.default = WorkspaceRestrictedActionPage;
