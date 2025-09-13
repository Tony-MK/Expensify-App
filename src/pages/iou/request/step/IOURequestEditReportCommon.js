"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Expensicons = require("@components/Icon/Expensicons");
var MenuItem_1 = require("@components/MenuItem");
var OptionListContextProvider_1 = require("@components/OptionListContextProvider");
var SelectionList_1 = require("@components/SelectionList");
var InviteMemberListItem_1 = require("@components/SelectionList/InviteMemberListItem");
var useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
var useDebouncedState_1 = require("@hooks/useDebouncedState");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var usePolicy_1 = require("@hooks/usePolicy");
var useReportTransactions_1 = require("@hooks/useReportTransactions");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
var mapOnyxCollectionItems_1 = require("@src/utils/mapOnyxCollectionItems");
var StepScreenWrapper_1 = require("./StepScreenWrapper");
function IOURequestEditReportCommon(_a) {
    var backTo = _a.backTo, transactionIDs = _a.transactionIDs, selectReport = _a.selectReport, selectedReportID = _a.selectedReportID, selectedPolicyID = _a.selectedPolicyID, removeFromReport = _a.removeFromReport, _b = _a.isEditing, isEditing = _b === void 0 ? false : _b, isUnreported = _a.isUnreported, shouldShowNotFoundPageFromProps = _a.shouldShowNotFoundPage;
    var _c = (0, useLocalize_1.default)(), translate = _c.translate, localeCompare = _c.localeCompare;
    var options = (0, OptionListContextProvider_1.useOptionsList)().options;
    var outstandingReportsByPolicyID = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID, { canBeMissing: true })[0];
    var currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    var selectedReport = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(selectedReportID), { canBeMissing: true })[0];
    var reportOwnerAccountID = (0, react_1.useMemo)(function () { var _a; return (_a = selectedReport === null || selectedReport === void 0 ? void 0 : selectedReport.ownerAccountID) !== null && _a !== void 0 ? _a : currentUserPersonalDetails.accountID; }, [selectedReport, currentUserPersonalDetails.accountID]);
    var reportPolicy = (0, usePolicy_1.default)(selectedReport === null || selectedReport === void 0 ? void 0 : selectedReport.policyID);
    var reportNameValuePairs = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS, { canBeMissing: true })[0];
    var allPoliciesID = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { selector: function (policies) { return (0, mapOnyxCollectionItems_1.default)(policies, function (policy) { return policy === null || policy === void 0 ? void 0 : policy.id; }); }, canBeMissing: false })[0];
    var _d = (0, useDebouncedState_1.default)(''), searchValue = _d[0], debouncedSearchValue = _d[1], setSearchValue = _d[2];
    var isOwner = selectedReport ? selectedReport.ownerAccountID === currentUserPersonalDetails.accountID : false;
    var isReportIOU = selectedReport ? (0, ReportUtils_1.isIOUReport)(selectedReport) : false;
    var reportTransactions = (0, useReportTransactions_1.default)(selectedReportID);
    var isCardTransaction = (0, react_1.useMemo)(function () {
        if (!transactionIDs || !selectedReport) {
            return false;
        }
        return reportTransactions
            .filter(function (transaction) { return transactionIDs.includes(transaction.transactionID); })
            .some(function (transaction) { var _a; return ((_a = transaction === null || transaction === void 0 ? void 0 : transaction.comment) === null || _a === void 0 ? void 0 : _a.liabilityType) === CONST_1.default.TRANSACTION.LIABILITY_TYPE.RESTRICT; });
    }, [transactionIDs, selectedReport, reportTransactions]);
    var shouldShowRemoveFromReport = isEditing && isOwner && !isReportIOU && !isUnreported && !isCardTransaction;
    var expenseReports = (0, react_1.useMemo)(function () {
        var _a, _b;
        // Early return if no reports are available to prevent useless loop
        if (!outstandingReportsByPolicyID || (0, EmptyObject_1.isEmptyObject)(outstandingReportsByPolicyID)) {
            return [];
        }
        var personalPolicyID = (_a = (0, PolicyUtils_1.getPersonalPolicy)()) === null || _a === void 0 ? void 0 : _a.id;
        if (!selectedPolicyID || selectedPolicyID === personalPolicyID || (0, ReportUtils_1.isSelfDM)(selectedReport)) {
            return Object.values(allPoliciesID !== null && allPoliciesID !== void 0 ? allPoliciesID : {})
                .filter(function (policyID) { return personalPolicyID !== policyID; })
                .flatMap(function (policyID) {
                var _a;
                if (!policyID) {
                    return [];
                }
                var reports = (0, ReportUtils_1.getOutstandingReportsForUser)(policyID, reportOwnerAccountID, (_a = outstandingReportsByPolicyID === null || outstandingReportsByPolicyID === void 0 ? void 0 : outstandingReportsByPolicyID[policyID !== null && policyID !== void 0 ? policyID : CONST_1.default.DEFAULT_NUMBER_ID]) !== null && _a !== void 0 ? _a : {}, reportNameValuePairs, isEditing);
                return reports;
            });
        }
        return (0, ReportUtils_1.getOutstandingReportsForUser)(selectedPolicyID, reportOwnerAccountID, (_b = outstandingReportsByPolicyID === null || outstandingReportsByPolicyID === void 0 ? void 0 : outstandingReportsByPolicyID[selectedPolicyID !== null && selectedPolicyID !== void 0 ? selectedPolicyID : CONST_1.default.DEFAULT_NUMBER_ID]) !== null && _b !== void 0 ? _b : {}, reportNameValuePairs, isEditing);
    }, [outstandingReportsByPolicyID, reportOwnerAccountID, allPoliciesID, reportNameValuePairs, selectedReport, selectedPolicyID, isEditing]);
    var reportOptions = (0, react_1.useMemo)(function () {
        if (!outstandingReportsByPolicyID || (0, EmptyObject_1.isEmptyObject)(outstandingReportsByPolicyID)) {
            return [];
        }
        return expenseReports
            .sort(function (report1, report2) { return (0, ReportUtils_1.sortOutstandingReportsBySelected)(report1, report2, selectedReportID, localeCompare); })
            .filter(function (report) { var _a; return !debouncedSearchValue || ((_a = report === null || report === void 0 ? void 0 : report.reportName) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(debouncedSearchValue.toLowerCase())); })
            .filter(function (report) { return report !== undefined; })
            .map(function (report) {
            var _a, _b;
            var matchingOption = options.reports.find(function (option) { return option.reportID === report.reportID; });
            return __assign(__assign({}, matchingOption), { 
                // We are shallow copying properties from matchingOption, so if it has a brickRoadIndicator, it will display RBR.
                // We set it to null here to prevent showing RBR for reports https://github.com/Expensify/App/issues/65960.
                brickRoadIndicator: null, alternateText: (_a = (0, ReportUtils_1.getPolicyName)({ report: report })) !== null && _a !== void 0 ? _a : matchingOption === null || matchingOption === void 0 ? void 0 : matchingOption.alternateText, value: report.reportID, isSelected: report.reportID === selectedReportID, policyID: (_b = matchingOption === null || matchingOption === void 0 ? void 0 : matchingOption.policyID) !== null && _b !== void 0 ? _b : report.policyID });
        });
    }, [outstandingReportsByPolicyID, debouncedSearchValue, expenseReports, selectedReportID, options.reports, localeCompare]);
    var navigateBack = function () {
        Navigation_1.default.goBack(backTo);
    };
    var headerMessage = (0, react_1.useMemo)(function () { return (searchValue && !reportOptions.length ? translate('common.noResultsFound') : ''); }, [searchValue, reportOptions, translate]);
    // eslint-disable-next-line rulesdir/no-negated-variables
    var shouldShowNotFoundPage = (0, react_1.useMemo)(function () {
        if (expenseReports.length === 0 || shouldShowNotFoundPageFromProps) {
            return true;
        }
        if (!selectedReport) {
            return false;
        }
        var isAdmin = (0, PolicyUtils_1.isPolicyAdmin)(reportPolicy);
        var isOpen = (0, ReportUtils_1.isOpenReport)(selectedReport);
        var isSubmitter = (0, ReportUtils_1.isReportOwner)(selectedReport);
        // If the report is Open, then only submitters, admins can move expenses
        return isOpen && !isAdmin && !isSubmitter;
    }, [selectedReport, reportPolicy, expenseReports.length, shouldShowNotFoundPageFromProps]);
    return (<StepScreenWrapper_1.default headerTitle={translate('common.report')} onBackButtonPress={navigateBack} shouldShowWrapper testID="IOURequestEditReportCommon" includeSafeAreaPaddingBottom shouldShowNotFoundPage={shouldShowNotFoundPage}>
            <SelectionList_1.default sections={[{ data: reportOptions }]} onSelectRow={selectReport} textInputValue={searchValue} onChangeText={setSearchValue} textInputLabel={expenseReports.length >= CONST_1.default.STANDARD_LIST_ITEM_LIMIT ? translate('common.search') : undefined} shouldSingleExecuteRowSelect headerMessage={headerMessage} initiallyFocusedOptionKey={selectedReportID} ListItem={InviteMemberListItem_1.default} listFooterContent={shouldShowRemoveFromReport ? (<MenuItem_1.default onPress={removeFromReport} title={translate('iou.removeFromReport')} description={translate('iou.moveToPersonalSpace')} icon={Expensicons.Close}/>) : undefined}/>
        </StepScreenWrapper_1.default>);
}
exports.default = IOURequestEditReportCommon;
