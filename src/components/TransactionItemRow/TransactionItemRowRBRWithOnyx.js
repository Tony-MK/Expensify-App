"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Icon_1 = require("@components/Icon");
var Expensicons_1 = require("@components/Icon/Expensicons");
var RenderHTML_1 = require("@components/RenderHTML");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ViolationsUtils_1 = require("@libs/Violations/ViolationsUtils");
var variables_1 = require("@styles/variables");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
function TransactionItemRowRBRWithOnyx(_a) {
    var _b;
    var transaction = _a.transaction, violations = _a.violations, report = _a.report, containerStyles = _a.containerStyles, missingFieldError = _a.missingFieldError;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var theme = (0, useTheme_1.default)();
    var reportActions = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(transaction.reportID), {
        canBeMissing: true,
    })[0];
    var policyTags = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY_TAGS).concat(report === null || report === void 0 ? void 0 : report.policyID), { canBeMissing: true })[0];
    var transactionThreadId = reportActions ? (_b = (0, ReportActionsUtils_1.getIOUActionForTransactionID)(Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {}), transaction.transactionID)) === null || _b === void 0 ? void 0 : _b.childReportID : undefined;
    var transactionThreadActions = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(transactionThreadId), {
        canBeMissing: true,
    })[0];
    var RBRMessages = ViolationsUtils_1.default.getRBRMessages(transaction, violations !== null && violations !== void 0 ? violations : [], translate, missingFieldError, Object.values(transactionThreadActions !== null && transactionThreadActions !== void 0 ? transactionThreadActions : {}), policyTags);
    return (RBRMessages.length > 0 && (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.gap1, containerStyles]} testID="TransactionItemRowRBRWithOnyx">
                <Icon_1.default src={Expensicons_1.DotIndicator} fill={theme.danger} height={variables_1.default.iconSizeExtraSmall} width={variables_1.default.iconSizeExtraSmall}/>
                <react_native_1.View style={[styles.pre, styles.flexShrink1, { color: theme.danger }]}>
                    <RenderHTML_1.default html={"<rbr shouldShowEllipsis=\"1\" issmall >".concat(RBRMessages, "</rbr>")}/>
                </react_native_1.View>
            </react_native_1.View>));
}
TransactionItemRowRBRWithOnyx.displayName = 'TransactionItemRowRBRWithOnyx';
exports.default = TransactionItemRowRBRWithOnyx;
