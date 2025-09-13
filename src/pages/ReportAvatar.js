"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AttachmentModal_1 = require("@components/AttachmentModal");
const useOnyx_1 = require("@hooks/useOnyx");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const UserUtils_1 = require("@libs/UserUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function ReportAvatar({ route }) {
    const { reportID, policyID } = route.params;
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, { canBeMissing: false });
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: true });
    const [isLoadingApp = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const attachment = (0, react_1.useMemo)(() => {
        if ((0, ReportUtils_1.isGroupChat)(report) && !(0, ReportUtils_1.isThread)(report)) {
            return {
                source: report?.avatarUrl ? (0, UserUtils_1.getFullSizeAvatar)(report.avatarUrl, 0) : (0, ReportUtils_1.getDefaultGroupAvatar)(report?.reportID),
                headerTitle: (0, ReportUtils_1.getReportName)(report),
                isWorkspaceAvatar: false,
            };
        }
        return {
            source: (0, UserUtils_1.getFullSizeAvatar)((0, ReportUtils_1.getWorkspaceIcon)(report, policy).source, 0),
            headerTitle: (0, ReportUtils_1.getPolicyName)({ report, policy }),
            // In the case of default workspace avatar, originalFileName prop takes policyID as value to get the color of the avatar
            originalFileName: policy?.originalFileName ?? policy?.id ?? report?.policyID,
            isWorkspaceAvatar: true,
        };
    }, [report, policy]);
    return (<AttachmentModal_1.default headerTitle={attachment.headerTitle} defaultOpen source={attachment.source} onModalClose={() => {
            Navigation_1.default.goBack(report?.reportID ? ROUTES_1.default.REPORT_WITH_ID_DETAILS.getRoute(report?.reportID) : undefined);
        }} isWorkspaceAvatar={attachment.isWorkspaceAvatar} maybeIcon originalFileName={attachment.originalFileName} shouldShowNotFoundPage={!report?.reportID && !isLoadingApp} isLoading={(!report?.reportID || !policy?.id) && !!isLoadingApp}/>);
}
ReportAvatar.displayName = 'ReportAvatar';
exports.default = ReportAvatar;
