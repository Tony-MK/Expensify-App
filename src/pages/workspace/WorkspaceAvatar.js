"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AttachmentModal_1 = require("@components/AttachmentModal");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const UserUtils_1 = require("@libs/UserUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function WorkspaceAvatar({ route }) {
    const { policyID, letter: fallbackLetter } = route?.params ?? {};
    const policy = (0, usePolicy_1.default)(policyID);
    const [isLoadingApp = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true, initWithStoredValues: false });
    const policyAvatarURL = policy?.avatarURL;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const avatarURL = policyAvatarURL || (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policy?.name ?? fallbackLetter);
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundPage = !Object.keys(policy ?? {}).length && !isLoadingApp && (!policyID || !fallbackLetter);
    return (<AttachmentModal_1.default headerTitle={policy?.name ?? ''} defaultOpen source={(0, UserUtils_1.getFullSizeAvatar)(avatarURL, 0)} onModalClose={Navigation_1.default.goBack} isWorkspaceAvatar originalFileName={policy?.originalFileName ?? policy?.id ?? policyID} shouldShowNotFoundPage={shouldShowNotFoundPage} isLoading={!Object.keys(policy ?? {}).length && !!isLoadingApp} maybeIcon/>);
}
WorkspaceAvatar.displayName = 'WorkspaceAvatar';
exports.default = WorkspaceAvatar;
