"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
const ReportUtils_1 = require("@libs/ReportUtils");
const UserUtils_1 = require("@libs/UserUtils");
const AttachmentModalContainer_1 = require("@pages/media/AttachmentModalScreen/AttachmentModalContainer");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function WorkspaceAvatarModalContent({ navigation, route }) {
    const { policyID } = route.params;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: false });
    const [isLoadingApp = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const avatarURL = policy?.avatarURL ?? (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policy?.name ?? '');
    const contentProps = (0, react_1.useMemo)(() => ({
        source: (0, UserUtils_1.getFullSizeAvatar)(avatarURL, 0),
        headerTitle: policy?.name,
        isWorkspaceAvatar: true,
        originalFileName: policy?.originalFileName ?? policy?.id,
        shouldShowNotFoundPage: !Object.keys(policy ?? {}).length && !isLoadingApp,
        isLoading: !Object.keys(policy ?? {}).length && !!isLoadingApp,
        maybeIcon: true,
    }), [avatarURL, isLoadingApp, policy]);
    return (<AttachmentModalContainer_1.default navigation={navigation} contentProps={contentProps}/>);
}
WorkspaceAvatarModalContent.displayName = 'WorkspaceAvatarModalContent';
exports.default = WorkspaceAvatarModalContent;
