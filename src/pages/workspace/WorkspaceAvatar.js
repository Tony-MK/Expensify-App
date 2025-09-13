"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var AttachmentModal_1 = require("@components/AttachmentModal");
var useOnyx_1 = require("@hooks/useOnyx");
var usePolicy_1 = require("@hooks/usePolicy");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ReportUtils_1 = require("@libs/ReportUtils");
var UserUtils_1 = require("@libs/UserUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
function WorkspaceAvatar(_a) {
    var _b, _c, _d, _e, _f;
    var route = _a.route;
    var _g = (_b = route === null || route === void 0 ? void 0 : route.params) !== null && _b !== void 0 ? _b : {}, policyID = _g.policyID, fallbackLetter = _g.letter;
    var policy = (0, usePolicy_1.default)(policyID);
    var _h = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true, initWithStoredValues: false })[0], isLoadingApp = _h === void 0 ? false : _h;
    var policyAvatarURL = policy === null || policy === void 0 ? void 0 : policy.avatarURL;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var avatarURL = policyAvatarURL || (0, ReportUtils_1.getDefaultWorkspaceAvatar)((_c = policy === null || policy === void 0 ? void 0 : policy.name) !== null && _c !== void 0 ? _c : fallbackLetter);
    // eslint-disable-next-line rulesdir/no-negated-variables
    var shouldShowNotFoundPage = !Object.keys(policy !== null && policy !== void 0 ? policy : {}).length && !isLoadingApp && (!policyID || !fallbackLetter);
    return (<AttachmentModal_1.default headerTitle={(_d = policy === null || policy === void 0 ? void 0 : policy.name) !== null && _d !== void 0 ? _d : ''} defaultOpen source={(0, UserUtils_1.getFullSizeAvatar)(avatarURL, 0)} onModalClose={Navigation_1.default.goBack} isWorkspaceAvatar originalFileName={(_f = (_e = policy === null || policy === void 0 ? void 0 : policy.originalFileName) !== null && _e !== void 0 ? _e : policy === null || policy === void 0 ? void 0 : policy.id) !== null && _f !== void 0 ? _f : policyID} shouldShowNotFoundPage={shouldShowNotFoundPage} isLoading={!Object.keys(policy !== null && policy !== void 0 ? policy : {}).length && !!isLoadingApp} maybeIcon/>);
}
WorkspaceAvatar.displayName = 'WorkspaceAvatar';
exports.default = WorkspaceAvatar;
