"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const ReportActionAvatars_1 = require("@components/ReportActionAvatars");
const ReportWelcomeText_1 = require("@components/ReportWelcomeText");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const AnimatedEmptyStateBackground_1 = require("./AnimatedEmptyStateBackground");
function ReportActionItemCreated({ reportID, policyID }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, { canBeMissing: true });
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: true });
    if (!(0, ReportUtils_1.isChatReport)(report)) {
        return null;
    }
    const shouldDisableDetailPage = (0, ReportUtils_1.shouldDisableDetailPage)(report);
    return (<OfflineWithFeedback_1.default pendingAction={report?.pendingFields?.addWorkspaceRoom ?? report?.pendingFields?.createChat} errors={report?.errorFields?.addWorkspaceRoom ?? report?.errorFields?.createChat} errorRowStyles={[styles.ml10, styles.mr2]} onClose={() => (0, Report_1.clearCreateChatError)(report)}>
            <react_native_1.View style={[styles.pRelative]}>
                <AnimatedEmptyStateBackground_1.default />
                <react_native_1.View accessibilityLabel={translate('accessibilityHints.chatWelcomeMessage')} style={[styles.p5]}>
                    <OfflineWithFeedback_1.default pendingAction={report?.pendingFields?.avatar}>
                        <PressableWithoutFeedback_1.default onPress={() => (0, ReportUtils_1.navigateToDetailsPage)(report, Navigation_1.default.getReportRHPActiveRoute(), true)} style={[styles.mh5, styles.mb3, styles.alignSelfStart, shouldDisableDetailPage && styles.cursorDefault]} accessibilityLabel={translate('common.details')} role={CONST_1.default.ROLE.BUTTON} disabled={shouldDisableDetailPage}>
                            <ReportActionAvatars_1.default reportID={reportID} size={CONST_1.default.AVATAR_SIZE.X_LARGE} horizontalStacking={{
            displayInRows: shouldUseNarrowLayout,
            maxAvatarsInRow: shouldUseNarrowLayout ? CONST_1.default.AVATAR_ROW_SIZE.DEFAULT : CONST_1.default.AVATAR_ROW_SIZE.LARGE_SCREEN,
            overlapDivider: 4,
            sort: (0, ReportUtils_1.isInvoiceRoom)(report) && (0, ReportUtils_1.isCurrentUserInvoiceReceiver)(report) ? CONST_1.default.REPORT_ACTION_AVATARS.SORT_BY.REVERSE : undefined,
        }}/>
                        </PressableWithoutFeedback_1.default>
                    </OfflineWithFeedback_1.default>
                    <react_native_1.View style={[styles.ph5]}>
                        <ReportWelcomeText_1.default report={report} policy={policy}/>
                    </react_native_1.View>
                </react_native_1.View>
            </react_native_1.View>
        </OfflineWithFeedback_1.default>);
}
ReportActionItemCreated.displayName = 'ReportActionItemCreated';
exports.default = (0, react_1.memo)(ReportActionItemCreated);
