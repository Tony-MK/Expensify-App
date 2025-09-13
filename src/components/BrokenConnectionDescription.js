"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useTransactionViolations_1 = require("@hooks/useTransactionViolations");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const Navigation_1 = require("@navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const TextLink_1 = require("./TextLink");
function BrokenConnectionDescription({ transactionID, policy, report }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const transactionViolations = (0, useTransactionViolations_1.default)(transactionID);
    const brokenConnection530Error = transactionViolations?.find((violation) => violation.data?.rterType === CONST_1.default.RTER_VIOLATION_TYPES.BROKEN_CARD_CONNECTION_530);
    const brokenConnectionError = transactionViolations?.find((violation) => violation.data?.rterType === CONST_1.default.RTER_VIOLATION_TYPES.BROKEN_CARD_CONNECTION);
    const isPolicyAdmin = (0, PolicyUtils_1.isPolicyAdmin)(policy);
    if (!brokenConnection530Error && !brokenConnectionError) {
        return '';
    }
    if (brokenConnection530Error) {
        return translate('violations.brokenConnection530Error');
    }
    if (isPolicyAdmin && !(0, ReportUtils_1.isCurrentUserSubmitter)(report)) {
        return (<>
                {`${translate('violations.adminBrokenConnectionError')}`}
                <TextLink_1.default style={[styles.textLabelSupporting, styles.link]} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARDS.getRoute(policy?.id))}>{`${translate('workspace.common.companyCards')}`}</TextLink_1.default>
                .
            </>);
    }
    if ((0, ReportUtils_1.isReportApproved)({ report }) || (0, ReportUtils_1.isReportManuallyReimbursed)(report)) {
        return translate('violations.memberBrokenConnectionError');
    }
    return `${translate('violations.memberBrokenConnectionError')} ${translate('violations.markAsCashToIgnore')}`;
}
BrokenConnectionDescription.displayName = 'BrokenConnectionDescription';
exports.default = BrokenConnectionDescription;
