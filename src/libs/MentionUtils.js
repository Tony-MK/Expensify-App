"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportMentionDetails = void 0;
const isEmpty_1 = require("lodash/isEmpty");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const ReportUtils_1 = require("./ReportUtils");
const removeLeadingLTRAndHash = (value) => value.replace(CONST_1.default.UNICODE.LTR, '').replace('#', '');
const getReportMentionDetails = (htmlAttributeReportID, currentReport, reports, tnode) => {
    let reportID;
    let mentionDisplayText;
    // Get mention details based on reportID from tag attribute
    if (!(0, isEmpty_1.default)(htmlAttributeReportID)) {
        const report = reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${htmlAttributeReportID}`];
        reportID = report?.reportID ?? htmlAttributeReportID;
        mentionDisplayText = removeLeadingLTRAndHash(report?.reportName ?? htmlAttributeReportID);
        // Get mention details from name inside tnode
    }
    else if ('data' in tnode && !(0, EmptyObject_1.isEmptyObject)(tnode.data)) {
        mentionDisplayText = removeLeadingLTRAndHash(tnode.data);
        Object.values(reports ?? {}).forEach((report) => {
            if (report?.policyID !== currentReport?.policyID || !(0, ReportUtils_1.isChatRoom)(report) || removeLeadingLTRAndHash(report?.reportName ?? '') !== mentionDisplayText) {
                return;
            }
            reportID = report?.reportID;
        });
    }
    else {
        return null;
    }
    return { reportID, mentionDisplayText };
};
exports.getReportMentionDetails = getReportMentionDetails;
