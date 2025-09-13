"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const SelectionList_1 = require("@components/SelectionList");
const InviteMemberListItem_1 = require("@components/SelectionList/InviteMemberListItem");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useReportTransactions_1 = require("@hooks/useReportTransactions");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const mapOnyxCollectionItems_1 = require("@src/utils/mapOnyxCollectionItems");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
function IOURequestEditReportCommon({ backTo, transactionIDs, selectReport, selectedReportID, selectedPolicyID, removeFromReport, isEditing = false, isUnreported, shouldShowNotFoundPage: shouldShowNotFoundPageFromProps, }) {
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const { options } = (0, OptionListContextProvider_1.useOptionsList)();
    const [outstandingReportsByPolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID, { canBeMissing: true });
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const [selectedReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${selectedReportID}`, { canBeMissing: true });
    const reportOwnerAccountID = (0, react_1.useMemo)(() => selectedReport?.ownerAccountID ?? currentUserPersonalDetails.accountID, [selectedReport, currentUserPersonalDetails.accountID]);
    const reportPolicy = (0, usePolicy_1.default)(selectedReport?.policyID);
    const [reportNameValuePairs] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS, { canBeMissing: true });
    const [allPoliciesID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { selector: (policies) => (0, mapOnyxCollectionItems_1.default)(policies, (policy) => policy?.id), canBeMissing: false });
    const [searchValue, debouncedSearchValue, setSearchValue] = (0, useDebouncedState_1.default)('');
    const isOwner = selectedReport ? selectedReport.ownerAccountID === currentUserPersonalDetails.accountID : false;
    const isReportIOU = selectedReport ? (0, ReportUtils_1.isIOUReport)(selectedReport) : false;
    const reportTransactions = (0, useReportTransactions_1.default)(selectedReportID);
    const isCardTransaction = (0, react_1.useMemo)(() => {
        if (!transactionIDs || !selectedReport) {
            return false;
        }
        return reportTransactions
            .filter((transaction) => transactionIDs.includes(transaction.transactionID))
            .some((transaction) => transaction?.comment?.liabilityType === CONST_1.default.TRANSACTION.LIABILITY_TYPE.RESTRICT);
    }, [transactionIDs, selectedReport, reportTransactions]);
    const shouldShowRemoveFromReport = isEditing && isOwner && !isReportIOU && !isUnreported && !isCardTransaction;
    const expenseReports = (0, react_1.useMemo)(() => {
        // Early return if no reports are available to prevent useless loop
        if (!outstandingReportsByPolicyID || (0, EmptyObject_1.isEmptyObject)(outstandingReportsByPolicyID)) {
            return [];
        }
        const personalPolicyID = (0, PolicyUtils_1.getPersonalPolicy)()?.id;
        if (!selectedPolicyID || selectedPolicyID === personalPolicyID || (0, ReportUtils_1.isSelfDM)(selectedReport)) {
            return Object.values(allPoliciesID ?? {})
                .filter((policyID) => personalPolicyID !== policyID)
                .flatMap((policyID) => {
                if (!policyID) {
                    return [];
                }
                const reports = (0, ReportUtils_1.getOutstandingReportsForUser)(policyID, reportOwnerAccountID, outstandingReportsByPolicyID?.[policyID ?? CONST_1.default.DEFAULT_NUMBER_ID] ?? {}, reportNameValuePairs, isEditing);
                return reports;
            });
        }
        return (0, ReportUtils_1.getOutstandingReportsForUser)(selectedPolicyID, reportOwnerAccountID, outstandingReportsByPolicyID?.[selectedPolicyID ?? CONST_1.default.DEFAULT_NUMBER_ID] ?? {}, reportNameValuePairs, isEditing);
    }, [outstandingReportsByPolicyID, reportOwnerAccountID, allPoliciesID, reportNameValuePairs, selectedReport, selectedPolicyID, isEditing]);
    const reportOptions = (0, react_1.useMemo)(() => {
        if (!outstandingReportsByPolicyID || (0, EmptyObject_1.isEmptyObject)(outstandingReportsByPolicyID)) {
            return [];
        }
        return expenseReports
            .sort((report1, report2) => (0, ReportUtils_1.sortOutstandingReportsBySelected)(report1, report2, selectedReportID, localeCompare))
            .filter((report) => !debouncedSearchValue || report?.reportName?.toLowerCase().includes(debouncedSearchValue.toLowerCase()))
            .filter((report) => report !== undefined)
            .map((report) => {
            const matchingOption = options.reports.find((option) => option.reportID === report.reportID);
            return {
                ...matchingOption,
                // We are shallow copying properties from matchingOption, so if it has a brickRoadIndicator, it will display RBR.
                // We set it to null here to prevent showing RBR for reports https://github.com/Expensify/App/issues/65960.
                brickRoadIndicator: null,
                alternateText: (0, ReportUtils_1.getPolicyName)({ report }) ?? matchingOption?.alternateText,
                value: report.reportID,
                isSelected: report.reportID === selectedReportID,
                policyID: matchingOption?.policyID ?? report.policyID,
            };
        });
    }, [outstandingReportsByPolicyID, debouncedSearchValue, expenseReports, selectedReportID, options.reports, localeCompare]);
    const navigateBack = () => {
        Navigation_1.default.goBack(backTo);
    };
    const headerMessage = (0, react_1.useMemo)(() => (searchValue && !reportOptions.length ? translate('common.noResultsFound') : ''), [searchValue, reportOptions, translate]);
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundPage = (0, react_1.useMemo)(() => {
        if (expenseReports.length === 0 || shouldShowNotFoundPageFromProps) {
            return true;
        }
        if (!selectedReport) {
            return false;
        }
        const isAdmin = (0, PolicyUtils_1.isPolicyAdmin)(reportPolicy);
        const isOpen = (0, ReportUtils_1.isOpenReport)(selectedReport);
        const isSubmitter = (0, ReportUtils_1.isReportOwner)(selectedReport);
        // If the report is Open, then only submitters, admins can move expenses
        return isOpen && !isAdmin && !isSubmitter;
    }, [selectedReport, reportPolicy, expenseReports.length, shouldShowNotFoundPageFromProps]);
    return (<StepScreenWrapper_1.default headerTitle={translate('common.report')} onBackButtonPress={navigateBack} shouldShowWrapper testID="IOURequestEditReportCommon" includeSafeAreaPaddingBottom shouldShowNotFoundPage={shouldShowNotFoundPage}>
            <SelectionList_1.default sections={[{ data: reportOptions }]} onSelectRow={selectReport} textInputValue={searchValue} onChangeText={setSearchValue} textInputLabel={expenseReports.length >= CONST_1.default.STANDARD_LIST_ITEM_LIMIT ? translate('common.search') : undefined} shouldSingleExecuteRowSelect headerMessage={headerMessage} initiallyFocusedOptionKey={selectedReportID} ListItem={InviteMemberListItem_1.default} listFooterContent={shouldShowRemoveFromReport ? (<MenuItem_1.default onPress={removeFromReport} title={translate('iou.removeFromReport')} description={translate('iou.moveToPersonalSpace')} icon={Expensicons.Close}/>) : undefined}/>
        </StepScreenWrapper_1.default>);
}
exports.default = IOURequestEditReportCommon;
