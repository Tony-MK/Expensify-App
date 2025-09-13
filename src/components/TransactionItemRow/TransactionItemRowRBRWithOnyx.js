"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons_1 = require("@components/Icon/Expensicons");
const RenderHTML_1 = require("@components/RenderHTML");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ViolationsUtils_1 = require("@libs/Violations/ViolationsUtils");
const variables_1 = require("@styles/variables");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function TransactionItemRowRBRWithOnyx({ transaction, violations, report, containerStyles, missingFieldError }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const [reportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transaction.reportID}`, {
        canBeMissing: true,
    });
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${report?.policyID}`, { canBeMissing: true });
    const transactionThreadId = reportActions ? (0, ReportActionsUtils_1.getIOUActionForTransactionID)(Object.values(reportActions ?? {}), transaction.transactionID)?.childReportID : undefined;
    const [transactionThreadActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadId}`, {
        canBeMissing: true,
    });
    const RBRMessages = ViolationsUtils_1.default.getRBRMessages(transaction, violations ?? [], translate, missingFieldError, Object.values(transactionThreadActions ?? {}), policyTags);
    return (RBRMessages.length > 0 && (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.gap1, containerStyles]} testID="TransactionItemRowRBRWithOnyx">
                <Icon_1.default src={Expensicons_1.DotIndicator} fill={theme.danger} height={variables_1.default.iconSizeExtraSmall} width={variables_1.default.iconSizeExtraSmall}/>
                <react_native_1.View style={[styles.pre, styles.flexShrink1, { color: theme.danger }]}>
                    <RenderHTML_1.default html={`<rbr shouldShowEllipsis="1" issmall >${RBRMessages}</rbr>`}/>
                </react_native_1.View>
            </react_native_1.View>));
}
TransactionItemRowRBRWithOnyx.displayName = 'TransactionItemRowRBRWithOnyx';
exports.default = TransactionItemRowRBRWithOnyx;
