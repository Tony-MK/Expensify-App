"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const escape_1 = require("lodash/escape");
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const PersonalDetailsUtils = require("@libs/PersonalDetailsUtils");
const ReportActionsUtils = require("@libs/ReportActionsUtils");
const ReportUtils = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const Banner_1 = require("./Banner");
function ArchivedReportFooter({ report }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [personalDetails = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST);
    const [reportClosedAction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`, { canEvict: false, selector: ReportActionsUtils.getLastClosedReportAction });
    const originalMessage = ReportActionsUtils.isClosedAction(reportClosedAction) ? ReportActionsUtils.getOriginalMessage(reportClosedAction) : null;
    const archiveReason = originalMessage?.reason ?? CONST_1.default.REPORT.ARCHIVE_REASON.DEFAULT;
    const actorPersonalDetails = personalDetails?.[reportClosedAction?.actorAccountID ?? -1];
    let displayName = PersonalDetailsUtils.getDisplayNameOrDefault(actorPersonalDetails);
    let oldDisplayName;
    if (archiveReason === CONST_1.default.REPORT.ARCHIVE_REASON.ACCOUNT_MERGED) {
        const newAccountID = originalMessage?.newAccountID;
        const oldAccountID = originalMessage?.oldAccountID;
        displayName = PersonalDetailsUtils.getDisplayNameOrDefault(personalDetails?.[newAccountID ?? -1]);
        oldDisplayName = PersonalDetailsUtils.getDisplayNameOrDefault(personalDetails?.[oldAccountID ?? -1]);
    }
    const shouldRenderHTML = archiveReason !== CONST_1.default.REPORT.ARCHIVE_REASON.DEFAULT && archiveReason !== CONST_1.default.REPORT.ARCHIVE_REASON.BOOKING_END_DATE_HAS_PASSED;
    let policyName = ReportUtils.getPolicyName({ report });
    if (archiveReason === CONST_1.default.REPORT.ARCHIVE_REASON.INVOICE_RECEIVER_POLICY_DELETED) {
        policyName = originalMessage?.receiverPolicyName ?? '';
    }
    if (shouldRenderHTML) {
        oldDisplayName = (0, escape_1.default)(oldDisplayName);
        displayName = (0, escape_1.default)(displayName);
        policyName = (0, escape_1.default)(policyName);
    }
    const text = shouldRenderHTML
        ? translate(`reportArchiveReasons.${archiveReason}`, {
            displayName: `<strong>${displayName}</strong>`,
            oldDisplayName: `<strong>${oldDisplayName}</strong>`,
            policyName: `<strong>${policyName}</strong>`,
            shouldUseYou: actorPersonalDetails?.accountID === (0, Report_1.getCurrentUserAccountID)(),
        })
        : translate(`reportArchiveReasons.${archiveReason}`);
    return (<Banner_1.default containerStyles={[styles.chatFooterBanner]} text={text} shouldRenderHTML={shouldRenderHTML} shouldShowIcon/>);
}
ArchivedReportFooter.displayName = 'ArchivedReportFooter';
exports.default = ArchivedReportFooter;
