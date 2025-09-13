"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var react_native_1 = require("react-native");
var FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
var Button_1 = require("@components/Button");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var ReportActionsSkeletonView_1 = require("@components/ReportActionsSkeletonView");
var ReportHeaderSkeletonView_1 = require("@components/ReportHeaderSkeletonView");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var Text_1 = require("@components/Text");
var useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var useTransactionViolations_1 = require("@hooks/useTransactionViolations");
var Report_1 = require("@libs/actions/Report");
var Transaction_1 = require("@libs/actions/Transaction");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var DuplicateTransactionsList_1 = require("./DuplicateTransactionsList");
function TransactionDuplicateReview() {
    var _a;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var route = (0, native_1.useRoute)();
    var currentPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    var report = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(route.params.threadReportID), { canBeMissing: true })[0];
    var reportMetadata = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_METADATA).concat(route.params.threadReportID), { canBeMissing: true })[0];
    var reportAction = (0, ReportActionsUtils_1.getReportAction)(report === null || report === void 0 ? void 0 : report.parentReportID, report === null || report === void 0 ? void 0 : report.parentReportActionID);
    var transactionID = (_a = (0, ReportActionsUtils_1.getLinkedTransactionID)(reportAction, report === null || report === void 0 ? void 0 : report.reportID)) !== null && _a !== void 0 ? _a : undefined;
    var transactionViolations = (0, useTransactionViolations_1.default)(transactionID);
    var duplicateTransactionIDs = (0, react_1.useMemo)(function () { var _a, _b, _c; return (_c = (_b = (_a = transactionViolations === null || transactionViolations === void 0 ? void 0 : transactionViolations.find(function (violation) { return violation.name === CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION; })) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.duplicates) !== null && _c !== void 0 ? _c : []; }, [transactionViolations]);
    var transactionIDs = (0, react_1.useMemo)(function () { return (transactionID ? __spreadArray([transactionID], duplicateTransactionIDs, true) : duplicateTransactionIDs); }, [transactionID, duplicateTransactionIDs]);
    var transactionsSelector = (0, react_1.useCallback)(function (allTransactions) {
        return transactionIDs
            .map(function (id) { return allTransactions === null || allTransactions === void 0 ? void 0 : allTransactions["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(id)]; })
            .sort(function (a, b) { var _a, _b; return new Date((_a = a === null || a === void 0 ? void 0 : a.created) !== null && _a !== void 0 ? _a : '').getTime() - new Date((_b = b === null || b === void 0 ? void 0 : b.created) !== null && _b !== void 0 ? _b : '').getTime(); });
    }, [transactionIDs]);
    var transactions = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
        selector: transactionsSelector,
        canBeMissing: true,
    }, [transactionIDs])[0];
    var keepAll = function () {
        (0, Transaction_1.dismissDuplicateTransactionViolation)(transactionIDs, currentPersonalDetails);
        Navigation_1.default.goBack();
    };
    var hasSettledOrApprovedTransaction = transactions === null || transactions === void 0 ? void 0 : transactions.some(function (transaction) { return (0, ReportUtils_1.isSettled)(transaction === null || transaction === void 0 ? void 0 : transaction.reportID) || (0, ReportUtils_1.isReportIDApproved)(transaction === null || transaction === void 0 ? void 0 : transaction.reportID); });
    (0, react_1.useEffect)(function () {
        if (!route.params.threadReportID || (report === null || report === void 0 ? void 0 : report.reportID)) {
            return;
        }
        (0, Report_1.openReport)(route.params.threadReportID);
    }, [report === null || report === void 0 ? void 0 : report.reportID, route.params.threadReportID]);
    var isLoadingPage = (!(report === null || report === void 0 ? void 0 : report.reportID) && (reportMetadata === null || reportMetadata === void 0 ? void 0 : reportMetadata.isLoadingInitialReportActions) !== false) || !(reportAction === null || reportAction === void 0 ? void 0 : reportAction.reportActionID);
    // eslint-disable-next-line rulesdir/no-negated-variables
    var shouldShowNotFound = !isLoadingPage && !transactionID;
    if (isLoadingPage) {
        return (<ScreenWrapper_1.default testID={TransactionDuplicateReview.displayName}>
                <react_native_1.View style={[styles.flex1]}>
                    <react_native_1.View style={[styles.appContentHeader, styles.borderBottom]}>
                        <ReportHeaderSkeletonView_1.default onBackButtonPress={function () { }}/>
                    </react_native_1.View>
                    <ReportActionsSkeletonView_1.default />
                </react_native_1.View>
            </ScreenWrapper_1.default>);
    }
    return (<ScreenWrapper_1.default testID={TransactionDuplicateReview.displayName}>
            <FullPageNotFoundView_1.default shouldShow={shouldShowNotFound}>
                <HeaderWithBackButton_1.default title={translate('iou.reviewDuplicates')} onBackButtonPress={function () { return Navigation_1.default.goBack(route.params.backTo); }}/>
                <react_native_1.View style={[styles.justifyContentCenter, styles.ph5, styles.pb3, styles.borderBottom]}>
                    <Button_1.default text={translate('iou.keepAll')} onPress={keepAll}/>
                    {!!hasSettledOrApprovedTransaction && <Text_1.default style={[styles.textNormal, styles.colorMuted, styles.mt3]}>{translate('iou.someDuplicatesArePaid')}</Text_1.default>}
                </react_native_1.View>
                <DuplicateTransactionsList_1.default transactions={transactions !== null && transactions !== void 0 ? transactions : []}/>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
TransactionDuplicateReview.displayName = 'TransactionDuplicateReview';
exports.default = TransactionDuplicateReview;
